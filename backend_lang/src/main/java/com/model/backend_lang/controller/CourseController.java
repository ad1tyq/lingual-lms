package com.model.backend_lang.controller;

import com.model.backend_lang.dto.*;
import com.model.backend_lang.service.CourseService;
import com.model.backend_lang.service.LessonService;
import com.model.backend_lang.exception.UnauthorizedException;
import com.model.backend_lang.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final LessonService lessonService;

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "language", required = false) String language
    ) {
        String filter = (category != null && !category.trim().isEmpty()) ? category : language;
        List<CourseResponse> courses = courseService.getAllCourses(filter);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable("id") Long id) {
        CourseResponse course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{id}/lessons")
    public ResponseEntity<List<LessonSummaryResponse>> getCourseLessons(@PathVariable("id") Long id) {
        List<LessonSummaryResponse> lessons = lessonService.getLessonsByCourse(id);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey,
            @Valid @RequestBody CreateCourseRequest request
    ) {
        verifyAdminAccess(adminKey);
        CourseResponse created = courseService.createCourse(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable("id") Long id,
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey,
            @Valid @RequestBody CreateCourseRequest request
    ) {
        verifyAdminAccess(adminKey);
        CourseResponse updated = courseService.updateCourse(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable("id") Long id,
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey
    ) {
        verifyAdminAccess(adminKey);
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/lessons")
    public ResponseEntity<LessonDetailResponse> addLesson(
            @PathVariable("id") Long courseId,
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey,
            @Valid @RequestBody CreateLessonRequest request
    ) {
        verifyAdminAccess(adminKey);
        LessonDetailResponse lesson = courseService.addLessonToCourse(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(lesson);
    }

    private void verifyAdminAccess(String adminKey) {
        if ("admin_japan_secret_key_2026".equals(adminKey)) {
            return;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal principal) {
            boolean isAdmin = principal.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))
                    || "admin@japan.com".equalsIgnoreCase(principal.getEmail());
            if (isAdmin) {
                return;
            }
        }
        throw new UnauthorizedException("Administrator credentials required to perform this action. Please log in with administrator credentials.");
    }
}
