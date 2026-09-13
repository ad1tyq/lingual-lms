package com.model.backend_lang.service;

import com.model.backend_lang.dto.CourseResponse;
import com.model.backend_lang.dto.CreateCourseRequest;
import com.model.backend_lang.dto.CreateLessonRequest;
import com.model.backend_lang.dto.LessonDetailResponse;
import com.model.backend_lang.exception.ResourceNotFoundException;
import com.model.backend_lang.model.Course;
import com.model.backend_lang.model.Lesson;
import com.model.backend_lang.repository.CourseRepository;
import com.model.backend_lang.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses(String targetLanguage, String category) {
        List<Course> courses;
        boolean hasTargetLang = targetLanguage != null && !targetLanguage.trim().isEmpty() && !"ALL".equalsIgnoreCase(targetLanguage.trim());
        boolean hasCategory = category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category.trim());

        if (hasTargetLang && hasCategory) {
            courses = courseRepository.findByTargetLanguageIgnoreCaseAndLanguageIgnoreCase(targetLanguage.trim(), category.trim());
        } else if (hasTargetLang) {
            courses = courseRepository.findByTargetLanguageIgnoreCase(targetLanguage.trim());
        } else if (hasCategory) {
            courses = courseRepository.findByLanguageIgnoreCase(category.trim());
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream()
                .map(this::mapToCourseResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses(String category) {
        return getAllCourses(null, category);
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableLanguages() {
        return courseRepository.findAll().stream()
                .map(c -> c.getTargetLanguage() != null ? c.getTargetLanguage() : "Japanese")
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course/Category not found with id: " + courseId));
        return mapToCourseResponse(course);
    }

    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request) {
        String japTag = request.getJapaneseTag() != null && !request.getJapaneseTag().trim().isEmpty()
                ? request.getJapaneseTag().trim()
                : null;

        Course course = Course.builder()
                .targetLanguage(request.getEffectiveTargetLanguage())
                .language(request.getEffectiveCategory())
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .japaneseTag(japTag)
                .build();

        Course saved = courseRepository.save(course);
        return mapToCourseResponse(saved);
    }

    @Transactional
    public CourseResponse updateCourse(Long courseId, CreateCourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course/Category not found with id: " + courseId));

        if (request.getTargetLanguage() != null && !request.getTargetLanguage().trim().isEmpty()) {
            course.setTargetLanguage(request.getEffectiveTargetLanguage());
        }
        course.setLanguage(request.getEffectiveCategory());
        course.setTitle(request.getTitle().trim());
        course.setDescription(request.getDescription());
        if (request.getJapaneseTag() != null) {
            course.setJapaneseTag(request.getJapaneseTag().trim());
        }

        Course updated = courseRepository.save(course);
        return mapToCourseResponse(updated);
    }

    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course/Category not found with id: " + courseId));
        courseRepository.delete(course);
    }

    @Transactional
    public LessonDetailResponse addLessonToCourse(Long courseId, CreateLessonRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course/Category not found with id: " + courseId));

        int nextSeq = request.getSequenceNo() != null ? request.getSequenceNo()
                : (course.getLessons() != null ? course.getLessons().size() + 1 : 1);

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.getTitle().trim())
                .videoUrl(request.getVideoUrl().trim())
                .isFree(request.getIsFree() != null ? request.getIsFree() : false)
                .sequenceNo(nextSeq)
                .build();

        Lesson saved = lessonRepository.save(lesson);

        return LessonDetailResponse.builder()
                .id(saved.getId())
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .title(saved.getTitle())
                .sequenceNo(saved.getSequenceNo())
                .isFree(saved.isFree())
                .videoUrl(saved.getVideoUrl())
                .completed(false)
                .lastWatchedAt(LocalDateTime.now())
                .build();
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lessonRepository.delete(lesson);
    }

    private CourseResponse mapToCourseResponse(Course course) {
        int totalLessons = course.getLessons() != null ? course.getLessons().size() : 0;
        int freeLessons = course.getLessons() != null
                ? (int) course.getLessons().stream().filter(Lesson::isFree).count()
                : 0;

        return CourseResponse.builder()
                .id(course.getId())
                .targetLanguage(course.getTargetLanguage() != null ? course.getTargetLanguage() : "Japanese")
                .language(course.getLanguage())
                .category(course.getLanguage())
                .title(course.getTitle())
                .description(course.getDescription())
                .japaneseTag(course.getJapaneseTag())
                .totalLessons(totalLessons)
                .freeLessonsCount(freeLessons)
                .build();
    }
}
