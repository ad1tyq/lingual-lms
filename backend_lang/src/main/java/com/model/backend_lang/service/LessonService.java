package com.model.backend_lang.service;

import com.model.backend_lang.dto.LessonDetailResponse;
import com.model.backend_lang.dto.LessonSummaryResponse;
import com.model.backend_lang.exception.ResourceNotFoundException;
import com.model.backend_lang.exception.SubscriptionRequiredException;
import com.model.backend_lang.exception.UnauthorizedException;
import com.model.backend_lang.model.Lesson;
import com.model.backend_lang.model.SubscriptionStatus;
import com.model.backend_lang.model.User;
import com.model.backend_lang.model.UserProgress;
import com.model.backend_lang.repository.CourseRepository;
import com.model.backend_lang.repository.LessonRepository;
import com.model.backend_lang.repository.UserProgressRepository;
import com.model.backend_lang.repository.UserRepository;
import com.model.backend_lang.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;

    @Transactional(readOnly = true)
    public List<LessonSummaryResponse> getLessonsByCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        // Check authentication context to determine if user is PRO and fetch progress
        User currentUser = getAuthenticatedUserFromContext();
        boolean isPro = currentUser != null && currentUser.getSubscriptionStatus() == SubscriptionStatus.PRO;

        Set<Long> completedLessonIds = Collections.emptySet();
        if (currentUser != null) {
            completedLessonIds = userProgressRepository.findAllByUserIdAndLessonCourseId(currentUser.getId(), courseId)
                    .stream()
                    .filter(UserProgress::isCompleted)
                    .map(up -> up.getLesson().getId())
                    .collect(Collectors.toSet());
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceNoAsc(courseId);
        final Set<Long> finalCompletedLessonIds = completedLessonIds;

        return lessons.stream().map(lesson -> {
            boolean unlocked = currentUser != null && (lesson.isFree() || isPro);
            return LessonSummaryResponse.builder()
                    .id(lesson.getId())
                    .courseId(lesson.getCourse().getId())
                    .title(lesson.getTitle())
                    .sequenceNo(lesson.getSequenceNo())
                    .isFree(lesson.isFree())
                    .isLocked(!unlocked)
                    .videoUrl(unlocked ? lesson.getVideoUrl() : null)
                    .completed(currentUser != null ? finalCompletedLessonIds.contains(lesson.getId()) : null)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Intercepts request to fetch a specific lesson.
     * Enforces mandatory user authentication before accessing any video.
     * If logged in, checks is_free flag vs PRO subscription status.
     */
    @Transactional
    public LessonDetailResponse getLessonById(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // Mandatory check: Must be logged in to open any video
        User currentUser = getAuthenticatedUserFromContext();
        if (currentUser == null) {
            log.warn("Unauthorized attempt to open video lesson id {} without logging in", lessonId);
            throw new UnauthorizedException("You cannot open or watch any videos without creating an account or logging in.");
        }

        // Intercept: Query is_free flag
        boolean isFree = lesson.isFree();
        SubscriptionStatus userStatus = currentUser.getSubscriptionStatus();

        if (!isFree && userStatus != SubscriptionStatus.PRO) {
            log.warn("Access denied: User {} with status {} attempted to access paid lesson id {}",
                    currentUser.getEmail(), userStatus, lessonId);
            throw new SubscriptionRequiredException(
                    "Subscription required to access this lesson. Please upgrade to PRO to unlock full course access."
            );
        }

        // Track or update last_watched_at in user_progress
        boolean completed = false;
        LocalDateTime lastWatched = LocalDateTime.now();

        if (currentUser != null) {
            Optional<UserProgress> progressOpt = userProgressRepository.findByUserIdAndLessonId(currentUser.getId(), lesson.getId());
            UserProgress progress;
            if (progressOpt.isPresent()) {
                progress = progressOpt.get();
                progress.setLastWatchedAt(LocalDateTime.now());
                completed = progress.isCompleted();
                lastWatched = progress.getLastWatchedAt();
            } else {
                progress = UserProgress.builder()
                        .user(currentUser)
                        .lesson(lesson)
                        .completed(false)
                        .lastWatchedAt(LocalDateTime.now())
                        .build();
                completed = false;
                lastWatched = progress.getLastWatchedAt();
            }
            userProgressRepository.save(progress);
        }

        return LessonDetailResponse.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .courseTitle(lesson.getCourse().getTitle())
                .title(lesson.getTitle())
                .sequenceNo(lesson.getSequenceNo())
                .isFree(lesson.isFree())
                .videoUrl(lesson.getVideoUrl())
                .completed(completed)
                .lastWatchedAt(lastWatched)
                .build();
    }

    private User getAuthenticatedUserFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }

        if (authentication.getPrincipal() instanceof UserPrincipal principal) {
            return userRepository.findById(principal.getId()).orElse(null);
        }

        return null;
    }
}
