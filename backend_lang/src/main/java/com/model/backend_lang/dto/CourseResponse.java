package com.model.backend_lang.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String language;
    private String category;
    private String title;
    private String description;
    private int totalLessons;
    private int freeLessonsCount;
}
