package com.model.backend_lang.controller;

import com.model.backend_lang.dto.CourseProgressResponse;
import com.model.backend_lang.dto.ProgressResponse;
import com.model.backend_lang.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/{id}/complete")
    public ResponseEntity<ProgressResponse> completeLesson(@PathVariable("id") Long lessonId) {
        ProgressResponse response = progressService.completeLesson(lessonId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseProgressResponse> getCourseProgress(@PathVariable("courseId") Long courseId) {
        CourseProgressResponse response = progressService.getCourseProgress(courseId);
        return ResponseEntity.ok(response);
    }
}
