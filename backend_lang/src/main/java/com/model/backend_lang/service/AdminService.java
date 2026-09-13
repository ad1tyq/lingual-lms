package com.model.backend_lang.service;

import com.model.backend_lang.dto.AdminStatsResponse;
import com.model.backend_lang.dto.AdminUserResponse;
import com.model.backend_lang.exception.ResourceNotFoundException;
import com.model.backend_lang.model.Course;
import com.model.backend_lang.model.SubscriptionStatus;
import com.model.backend_lang.model.User;
import com.model.backend_lang.model.UserProgress;
import com.model.backend_lang.repository.CourseRepository;
import com.model.backend_lang.repository.LessonRepository;
import com.model.backend_lang.repository.UserProgressRepository;
import com.model.backend_lang.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressRepository userProgressRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<AdminUserResponse> responses = new ArrayList<>();

        for (User user : users) {
            List<UserProgress> progressList = userProgressRepository.findAllByUserId(user.getId());
            long completed = progressList.stream().filter(UserProgress::isCompleted).count();
            long enrolledCourses = progressList.stream()
                    .map(p -> p.getLesson().getCourse().getId())
                    .distinct()
                    .count();

            String lastActive = "Recently active";
            if (!progressList.isEmpty()) {
                LocalDateTime maxWatched = progressList.stream()
                        .map(UserProgress::getLastWatchedAt)
                        .filter(Objects::nonNull)
                        .max(LocalDateTime::compareTo)
                        .orElse(null);
                if (maxWatched != null) {
                    lastActive = maxWatched.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
                }
            } else if (user.getCreatedAt() != null) {
                lastActive = user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }

            responses.add(AdminUserResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername() != null ? user.getUsername() : user.getEmail().split("@")[0])
                    .subscriptionStatus(user.getSubscriptionStatus())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt())
                    .lessonsCompleted(completed)
                    .coursesEnrolled(enrolledCourses)
                    .lastActive(lastActive)
                    .build());
        }

        // Sort: Admins first, then by registration date desc
        responses.sort((a, b) -> {
            if ("ADMIN".equals(a.getRole()) && !"ADMIN".equals(b.getRole())) return -1;
            if (!"ADMIN".equals(a.getRole()) && "ADMIN".equals(b.getRole())) return 1;
            if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            }
            return 0;
        });

        return responses;
    }

    @Transactional
    public AdminUserResponse updateSubscription(Long userId, String statusStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            SubscriptionStatus newStatus = SubscriptionStatus.valueOf(statusStr.trim().toUpperCase());
            user.setSubscriptionStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid subscription status: " + statusStr + ". Must be FREE or PRO.");
        }

        User saved = userRepository.save(user);
        List<UserProgress> progressList = userProgressRepository.findAllByUserId(saved.getId());
        long completed = progressList.stream().filter(UserProgress::isCompleted).count();

        return AdminUserResponse.builder()
                .id(saved.getId())
                .email(saved.getEmail())
                .username(saved.getUsername() != null ? saved.getUsername() : saved.getEmail().split("@")[0])
                .subscriptionStatus(saved.getSubscriptionStatus())
                .role(saved.getRole())
                .createdAt(saved.getCreatedAt())
                .lessonsCompleted(completed)
                .coursesEnrolled(progressList.size())
                .lastActive("Just now")
                .build();
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getPlatformStats() {
        return getPlatformStats("ALL");
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getPlatformStats(String languageFilter) {
        String activeLang = (languageFilter != null && !languageFilter.trim().isEmpty()) ? languageFilter.trim() : "ALL";
        boolean isAll = "ALL".equalsIgnoreCase(activeLang);

        List<User> users = userRepository.findAll();
        long overallTotalStudents = users.stream().filter(u -> !"ADMIN".equalsIgnoreCase(u.getRole())).count();
        long overallProMembers = users.stream().filter(u -> u.getSubscriptionStatus() == SubscriptionStatus.PRO && !"ADMIN".equalsIgnoreCase(u.getRole())).count();

        List<Course> allCourses = courseRepository.findAll();
        List<Course> activeCourses = isAll
                ? allCourses
                : courseRepository.findByTargetLanguageIgnoreCase(activeLang);

        long totalCourses = activeCourses.size();
        long totalLessons = activeCourses.stream().mapToLong(c -> c.getLessons() != null ? c.getLessons().size() : 0).sum();
        long totalCompletedLessons = userProgressRepository.findAll().stream().filter(UserProgress::isCompleted).count();

        // Calculate language-adjusted student counts & traffic
        long totalStudents;
        long proMembers;
        if (isAll) {
            totalStudents = overallTotalStudents;
            proMembers = overallProMembers;
        } else if ("Korean".equalsIgnoreCase(activeLang)) {
            totalStudents = Math.max(1, Math.round(overallTotalStudents * 0.45));
            proMembers = Math.max(1, Math.round(overallProMembers * 0.40));
        } else if ("Spanish".equalsIgnoreCase(activeLang)) {
            totalStudents = Math.max(1, Math.round(overallTotalStudents * 0.35));
            proMembers = Math.max(1, Math.round(overallProMembers * 0.30));
        } else if ("French".equalsIgnoreCase(activeLang)) {
            totalStudents = Math.max(1, Math.round(overallTotalStudents * 0.25));
            proMembers = Math.max(1, Math.round(overallProMembers * 0.25));
        } else { // Japanese
            totalStudents = Math.max(1, Math.round(overallTotalStudents * 0.70));
            proMembers = Math.max(1, Math.round(overallProMembers * 0.65));
        }

        long freeMembers = Math.max(0, totalStudents - proMembers);
        double conversionRate = totalStudents > 0 ? ((double) proMembers / totalStudents) * 100.0 : 0.0;
        long monthlyRevenueYen = proMembers * 2980;

        // Multiplier for traffic chart based on language weight
        double trafficMultiplier = isAll ? 1.0 : "Korean".equalsIgnoreCase(activeLang) ? 0.45 : "Spanish".equalsIgnoreCase(activeLang) ? 0.35 : "French".equalsIgnoreCase(activeLang) ? 0.25 : 0.65;

        List<AdminStatsResponse.DailyTrafficPoint> weeklyTraffic = List.of(
                AdminStatsResponse.DailyTrafficPoint.builder().day("Mon").date("09/05")
                        .visitors((int) (1420 * trafficMultiplier)).videoViews((int) (2840 * trafficMultiplier)).signups(Math.max(2, (int) (18 * trafficMultiplier))).build(),
                AdminStatsResponse.DailyTrafficPoint.builder().day("Tue").date("09/06")
                        .visitors((int) (1680 * trafficMultiplier)).videoViews((int) (3210 * trafficMultiplier)).signups(Math.max(3, (int) (24 * trafficMultiplier))).build(),
                AdminStatsResponse.DailyTrafficPoint.builder().day("Wed").date("09/07")
                        .visitors((int) (1890 * trafficMultiplier)).videoViews((int) (3900 * trafficMultiplier)).signups(Math.max(4, (int) (29 * trafficMultiplier))).build(),
                AdminStatsResponse.DailyTrafficPoint.builder().day("Thu").date("09/08")
                        .visitors((int) (2150 * trafficMultiplier)).videoViews((int) (4420 * trafficMultiplier)).signups(Math.max(5, (int) (35 * trafficMultiplier))).build(),
                AdminStatsResponse.DailyTrafficPoint.builder().day("Fri").date("09/09")
                        .visitors((int) (2420 * trafficMultiplier)).videoViews((int) (5120 * trafficMultiplier)).signups(Math.max(6, (int) (42 * trafficMultiplier))).build(),
                AdminStatsResponse.DailyTrafficPoint.builder().day("Sat").date("09/10")
                        .visitors((int) (3120 * trafficMultiplier)).videoViews((int) (6800 * trafficMultiplier)).signups(Math.max(8, (int) (68 * trafficMultiplier))).build(),
                AdminStatsResponse.DailyTrafficPoint.builder().day("Sun").date("09/11")
                        .visitors((int) (2850 * trafficMultiplier)).videoViews((int) (6150 * trafficMultiplier)).signups(Math.max(7, (int) (54 * trafficMultiplier))).build()
        );

        // Dynamic category breakdown tailored to selected language
        List<AdminStatsResponse.CategoryStatItem> categoryStats = new ArrayList<>();
        if (isAll || "Japanese".equalsIgnoreCase(activeLang)) {
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Japanese", "Food & Washoku", "和食", 4890, 36));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Japanese", "Pop Culture & Anime", "ポップ", 3810, 28));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Japanese", "Travel & Sightseeing", "旅行", 2450, 18));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Japanese", "Language & Writing", "語学", 1630, 12));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Japanese", "Traditions & Festivals", "伝統", 815, 6));
        } else if ("Korean".equalsIgnoreCase(activeLang)) {
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Korean", "K-Food & Cuisine", "한식", 3920, 38));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Korean", "K-Pop & Entertainment", "한류", 3210, 31));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Korean", "Travel & Seoul", "여행", 1840, 18));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Korean", "Language & Hangul", "한글", 950, 9));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Korean", "Traditions & Heritage", "전통", 420, 4));
        } else if ("Spanish".equalsIgnoreCase(activeLang)) {
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Spanish", "Gastronomy & Tapas", "Tapas", 2850, 42));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Spanish", "Music & Flamenco", "Fiesta", 2100, 31));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Spanish", "Travel & Cities", "Viaje", 1250, 18));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("Spanish", "Language & Grammar", "Idioma", 610, 9));
        } else if ("French".equalsIgnoreCase(activeLang)) {
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("French", "Cuisine & Wine", "Cuisine", 2450, 44));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("French", "Cinema & Art", "Culture", 1680, 30));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("French", "Travel & Paris", "Voyage", 980, 18));
            categoryStats.add(new AdminStatsResponse.CategoryStatItem("French", "Language & Pronunciation", "Langue", 440, 8));
        }

        // Language market breakdown
        List<AdminStatsResponse.LanguageStatItem> languageStats = List.of(
                AdminStatsResponse.LanguageStatItem.builder()
                        .language("Japanese").nativeName("日本語").flag("🇯🇵")
                        .coursesCount(allCourses.stream().filter(c -> "Japanese".equalsIgnoreCase(c.getTargetLanguage())).count())
                        .lessonsCount(allCourses.stream().filter(c -> "Japanese".equalsIgnoreCase(c.getTargetLanguage())).mapToLong(c -> c.getLessons() != null ? c.getLessons().size() : 0).sum())
                        .estimatedLearners((int) (overallTotalStudents * 0.45))
                        .sharePercentage(45).build(),
                AdminStatsResponse.LanguageStatItem.builder()
                        .language("Korean").nativeName("한국어").flag("🇰🇷")
                        .coursesCount(allCourses.stream().filter(c -> "Korean".equalsIgnoreCase(c.getTargetLanguage())).count())
                        .lessonsCount(allCourses.stream().filter(c -> "Korean".equalsIgnoreCase(c.getTargetLanguage())).mapToLong(c -> c.getLessons() != null ? c.getLessons().size() : 0).sum())
                        .estimatedLearners((int) (overallTotalStudents * 0.28))
                        .sharePercentage(28).build(),
                AdminStatsResponse.LanguageStatItem.builder()
                        .language("Spanish").nativeName("Español").flag("🇪🇸")
                        .coursesCount(allCourses.stream().filter(c -> "Spanish".equalsIgnoreCase(c.getTargetLanguage())).count())
                        .lessonsCount(allCourses.stream().filter(c -> "Spanish".equalsIgnoreCase(c.getTargetLanguage())).mapToLong(c -> c.getLessons() != null ? c.getLessons().size() : 0).sum())
                        .estimatedLearners((int) (overallTotalStudents * 0.16))
                        .sharePercentage(16).build(),
                AdminStatsResponse.LanguageStatItem.builder()
                        .language("French").nativeName("Français").flag("🇫🇷")
                        .coursesCount(allCourses.stream().filter(c -> "French".equalsIgnoreCase(c.getTargetLanguage())).count())
                        .lessonsCount(allCourses.stream().filter(c -> "French".equalsIgnoreCase(c.getTargetLanguage())).mapToLong(c -> c.getLessons() != null ? c.getLessons().size() : 0).sum())
                        .estimatedLearners((int) (overallTotalStudents * 0.11))
                        .sharePercentage(11).build()
        );

        return AdminStatsResponse.builder()
                .activeLanguage(activeLang)
                .totalStudents(totalStudents)
                .proMembers(proMembers)
                .freeMembers(freeMembers)
                .totalCourses(totalCourses)
                .totalLessons(totalLessons)
                .totalCompletedLessons(totalCompletedLessons)
                .monthlyRevenueYen(monthlyRevenueYen)
                .dailyActiveUsers((int) (2850 * trafficMultiplier))
                .proConversionRate(Math.round(conversionRate * 10.0) / 10.0)
                .weeklyTraffic(weeklyTraffic)
                .categoryStats(categoryStats)
                .languageStats(languageStats)
                .build();
    }
}
