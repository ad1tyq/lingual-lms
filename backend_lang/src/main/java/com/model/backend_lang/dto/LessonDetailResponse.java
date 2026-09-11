package com.model.backend_lang.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDetailResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String title;
    private int sequenceNo;
    private boolean isFree;
    private String videoUrl;
    private boolean completed;
    private LocalDateTime lastWatchedAt;
}
