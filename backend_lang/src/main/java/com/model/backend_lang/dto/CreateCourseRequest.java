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

    private String category;
    private String language; // fallback if category is passed as language

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    public String getEffectiveCategory() {
        if (category != null && !category.trim().isEmpty()) {
            return category.trim();
        }
        if (language != null && !language.trim().isEmpty()) {
            return language.trim();
        }
        return "Japanese Culture";
    }
}
