package com.example.drawing.service;

import com.example.drawing.model.Drawing;
import com.example.drawing.model.Step;
import com.example.drawing.repository.DrawingRepository;
import com.example.drawing.repository.StepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrawingService {

    @Autowired
    private DrawingRepository drawingRepo;

    @Autowired
    private StepRepository stepRepo;

    public Drawing saveDrawing(Drawing drawing) {
        return drawingRepo.save(drawing);
    }

    public Step saveStep(Step step) {
        return stepRepo.save(step);
    }

    public List<String> getAllDrawingNames() {
        return drawingRepo.findAll().stream().map(Drawing::getName).toList();
    }

    public List<Step> getStepsByDrawingName(String name) {
        Drawing drawing = drawingRepo.findByName(name);
        return stepRepo.findByDrawingOrderByStepNumberAsc(drawing);
    }

    public Drawing findByName(String name) {
        return drawingRepo.findByName(name);
    }

    // ✅ NEW: Get all drawings
    public List<Drawing> getAllDrawings() {
        return drawingRepo.findAll();
    }

    // ✅ NEW: Get drawing by ID
    public Drawing getDrawingById(Long id) {
        return drawingRepo.findById(id).orElse(null);
    }

    // ✅ NEW: Delete drawing by ID
    public void deleteDrawingById(Long id) {
        drawingRepo.deleteById(id);
    }
}
