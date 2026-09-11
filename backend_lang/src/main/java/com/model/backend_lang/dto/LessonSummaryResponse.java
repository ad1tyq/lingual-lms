package com.model.backend_lang.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSummaryResponse {
    private Long id;
    private Long courseId;
    private String title;
    private int sequenceNo;
    private boolean isFree;
    private boolean isLocked;
    private String videoUrl;
    private Boolean completed;
}
