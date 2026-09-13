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
public class CreateCourseRequest {

    private String targetLanguage;
    private String category;
    private String language; // fallback if category is passed as language

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String japaneseTag;

    public String getEffectiveTargetLanguage() {
        if (targetLanguage != null && !targetLanguage.trim().isEmpty()) {
            return targetLanguage.trim();
        }
        return "Japanese";
    }

    public String getEffectiveCategory() {
        if (category != null && !category.trim().isEmpty()) {
            return category.trim();
        }
        if (language != null && !language.trim().isEmpty()) {
            return language.trim();
        }
        return "General Culture";
    }
}
