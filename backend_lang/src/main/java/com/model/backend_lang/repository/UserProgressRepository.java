package com.model.backend_lang.repository;

import com.model.backend_lang.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    List<UserProgress> findAllByUserId(Long userId);
    List<UserProgress> findAllByUserIdAndLessonCourseId(Long userId, Long courseId);
}
