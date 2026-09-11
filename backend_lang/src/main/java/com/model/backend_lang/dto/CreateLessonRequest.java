package com.model.backend_lang.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {

    @NotBlank(message = "Lesson title is required")
    private String title;

    @NotBlank(message = "Video URL is required")
    private String videoUrl;

    private Boolean isFree;

    private Integer sequenceNo;
}
