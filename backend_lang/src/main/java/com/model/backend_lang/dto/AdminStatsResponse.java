package com.model.backend_lang.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private String activeLanguage;
    private long totalStudents;
    private long proMembers;
    private long freeMembers;
    private long totalCourses;
    private long totalLessons;
    private long totalCompletedLessons;
    private long monthlyRevenueYen;
    private long dailyActiveUsers;
    private double proConversionRate;

    private List<DailyTrafficPoint> weeklyTraffic;
    private List<CategoryStatItem> categoryStats;
    private List<LanguageStatItem> languageStats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyTrafficPoint {
        private String day;
        private String date;
        private int visitors;
        private int videoViews;
        private int signups;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStatItem {
        private String targetLanguage;
        private String category;
        private String japaneseTag;
        private int views;
        private int percentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LanguageStatItem {
        private String language;
        private String nativeName;
        private String flag;
        private long coursesCount;
        private long lessonsCount;
        private int estimatedLearners;
        private int sharePercentage;
    }
}
