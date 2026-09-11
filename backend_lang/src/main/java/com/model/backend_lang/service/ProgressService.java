package com.model.backend_lang.service;

import com.model.backend_lang.dto.CourseProgressResponse;
import com.model.backend_lang.dto.ProgressResponse;
import com.model.backend_lang.exception.ResourceNotFoundException;
import com.model.backend_lang.exception.UnauthorizedException;
import com.model.backend_lang.model.Lesson;
import com.model.backend_lang.model.User;
import com.model.backend_lang.model.UserProgress;
import com.model.backend_lang.repository.CourseRepository;
import com.model.backend_lang.repository.LessonRepository;
import com.model.backend_lang.repository.UserProgressRepository;
import com.model.backend_lang.repository.UserRepository;
import com.model.backend_lang.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProgressResponse completeLesson(Long lessonId) {
        User currentUser = getRequiredUser();
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Optional<UserProgress> existingOpt = userProgressRepository.findByUserIdAndLessonId(currentUser.getId(), lessonId);
        UserProgress progress;
        if (existingOpt.isPresent()) {
            progress = existingOpt.get();
            progress.setCompleted(true);
            progress.setLastWatchedAt(LocalDateTime.now());
        } else {
            progress = UserProgress.builder()
                    .user(currentUser)
                    .lesson(lesson)
                    .completed(true)
                    .lastWatchedAt(LocalDateTime.now())
                    .build();
        }

        UserProgress saved = userProgressRepository.save(progress);

        return ProgressResponse.builder()
                .lessonId(lesson.getId())
                .completed(saved.isCompleted())
                .lastWatchedAt(saved.getLastWatchedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public CourseProgressResponse getCourseProgress(Long courseId) {
        User currentUser = getRequiredUser();
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }

        List<Lesson> courseLessons = lessonRepository.findByCourseIdOrderBySequenceNoAsc(courseId);
        int totalLessons = courseLessons.size();

        List<UserProgress> progressList = userProgressRepository.findAllByUserIdAndLessonCourseId(currentUser.getId(), courseId);
        List<Long> completedLessonIds = progressList.stream()
                .filter(UserProgress::isCompleted)
                .map(p -> p.getLesson().getId())
                .collect(Collectors.toList());

        int completedCount = completedLessonIds.size();
        double percentage = totalLessons > 0 ? (double) completedCount / totalLessons * 100.0 : 0.0;

        return CourseProgressResponse.builder()
                .courseId(courseId)
                .totalLessons(totalLessons)
                .completedLessons(completedCount)
                .completionPercentage(Math.round(percentage * 100.0) / 100.0)
                .completedLessonIds(completedLessonIds)
                .build();
    }

    private User getRequiredUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return userRepository.findById(principal.getId())
                    .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
        }
        throw new UnauthorizedException("User is not authenticated");
    }
}
