package com.example.drawing.service;

import com.example.drawing.model.UserSubmission;
import com.example.drawing.repository.UserSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserSubmissionService {

    @Autowired
    private UserSubmissionRepository submissionRepo;

    public UserSubmission saveSubmission(UserSubmission submission) {
        return submissionRepo.save(submission);
    }

    public List<UserSubmission> getAllSubmissions() {
        return submissionRepo.findAll();
    }

    public UserSubmission getSubmissionById(Long id) {
        return submissionRepo.findById(id).orElse(null);
    }

    public List<UserSubmission> getTopRatedSubmissions() {
        return submissionRepo.findTop5ByOrderByRatingDesc();
    }
}
