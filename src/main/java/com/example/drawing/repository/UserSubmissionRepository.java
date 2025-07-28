package com.example.drawing.repository;

import com.example.drawing.model.UserSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserSubmissionRepository extends JpaRepository<UserSubmission, Long> {
    List<UserSubmission> findTop5ByOrderByRatingDesc();
}
