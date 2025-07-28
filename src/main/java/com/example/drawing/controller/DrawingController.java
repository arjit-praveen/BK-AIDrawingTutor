package com.example.drawing.controller;

import com.example.drawing.model.Drawing;
import com.example.drawing.model.Step;
import com.example.drawing.model.UserSubmission;
import com.example.drawing.service.DrawingService;
import com.example.drawing.service.UserSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class DrawingController {

    @Autowired
    private DrawingService drawingService;

    @Autowired
    private UserSubmissionService submissionService;

    private static final String IMAGE_BASE_PATH = System.getProperty("user.dir") + "/images/";
    private static final String SUBMISSION_BASE_PATH = System.getProperty("user.dir") + "/submissions/";

    // DTO class to receive rating from JSON
    static class RatingRequest {
        public int rating;
    }

    // Create drawing
    @PostMapping("/drawings")
    public Drawing createDrawing(@RequestBody Drawing drawing) {
        return drawingService.saveDrawing(drawing);
    }

    // Upload tutorial step
    @PostMapping("/steps")
    public Step uploadStep(
            @RequestParam("drawingName") String drawingName,
            @RequestParam("stepNumber") int stepNumber,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile imageFile
    ) throws IOException {
        Drawing drawing = drawingService.findByName(drawingName);
        if (drawing == null) throw new RuntimeException("Drawing not found: " + drawingName);

        String folderPath = IMAGE_BASE_PATH + drawingName + "/";
        new File(folderPath).mkdirs();
        String filename = "step" + stepNumber + ".png";
        File destination = new File(folderPath + filename);
        imageFile.transferTo(destination);

        Step step = new Step();
        step.setDrawing(drawing);
        step.setStepNumber(stepNumber);
        step.setDescription(description);
        step.setImagePath("/images/" + drawingName + "/" + filename);

        return drawingService.saveStep(step);
    }

    @GetMapping("/drawings/names")
    public List<String> getAllDrawingNames() {
        return drawingService.getAllDrawingNames();
    }

    @GetMapping("/drawings/{name}/steps")
    public List<Step> getSteps(@PathVariable String name) {
        return drawingService.getStepsByDrawingName(name);
    }

    @GetMapping("/drawings")
    public List<Drawing> getAllDrawings() {
        return drawingService.getAllDrawings();
    }

    @DeleteMapping("/drawings/{id}")
    public ResponseEntity<Void> deleteDrawing(@PathVariable Long id) {
        Drawing drawing = drawingService.getDrawingById(id);
        if (drawing == null) return ResponseEntity.notFound().build();

        String folderPath = IMAGE_BASE_PATH + drawing.getName();
        File folder = new File(folderPath);
        if (folder.exists()) {
            for (File file : folder.listFiles()) file.delete();
            folder.delete();
        }

        drawingService.deleteDrawingById(id);
        return ResponseEntity.ok().build();
    }

    // ✅ User uploads a submission
    @PostMapping("/submit")
    public ResponseEntity<String> submitDrawing(
            @RequestParam("drawingName") String drawingName,
            @RequestParam("username") String username,
            @RequestParam("image") MultipartFile imageFile
    ) throws IOException {
        Drawing drawing = drawingService.findByName(drawingName);
        if (drawing == null) return ResponseEntity.badRequest().body("Drawing not found.");

        String folderPath = SUBMISSION_BASE_PATH + drawingName + "/";
        new File(folderPath).mkdirs();

        String filename = username + "_" + System.currentTimeMillis() + ".png";
        File destination = new File(folderPath + filename);
        imageFile.transferTo(destination);

        UserSubmission submission = new UserSubmission();
        submission.setDrawing(drawing);
        submission.setUsername(username);
        submission.setImagePath("/submissions/" + drawingName + "/" + filename);
        submission.setRating(0);

        submissionService.saveSubmission(submission);
        return ResponseEntity.ok("Submitted successfully.");
    }

    // ✅ Admin fetches all submissions
    @GetMapping("/submissions")
    public List<UserSubmission> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    // ✅ Admin rates a submission (FIXED to accept JSON body)
    @PutMapping("/submissions/{id}/rate")
    public ResponseEntity<String> rateSubmission(
            @PathVariable Long id,
            @RequestBody RatingRequest request
    ) {
        UserSubmission submission = submissionService.getSubmissionById(id);
        if (submission == null) return ResponseEntity.notFound().build();

        submission.setRating(request.rating);
        submissionService.saveSubmission(submission);
        return ResponseEntity.ok("Rating updated.");
    }

    // ✅ Get top 5 rated submissions
    @GetMapping("/submissions/top")
    public List<UserSubmission> getTopRatedSubmissions() {
        return submissionService.getTopRatedSubmissions();
    }
}
