package com.example.drawing.controller;

import com.example.drawing.model.Drawing;
import com.example.drawing.model.Step;
import com.example.drawing.service.DrawingService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // private static final String IMAGE_BASE_PATH = "images/";
    private static final String IMAGE_BASE_PATH = System.getProperty("user.dir") + "/images/";

    @PostMapping("/drawings")
    public Drawing createDrawing(@RequestBody Drawing drawing) {
        return drawingService.saveDrawing(drawing);
    }

    @PostMapping("/steps")
    public Step uploadStep(
            @RequestParam("drawingName") String drawingName,
            @RequestParam("stepNumber") int stepNumber,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile imageFile
    ) throws IOException {
        Drawing drawing = drawingService.findByName(drawingName);
        if (drawing == null) {
            throw new RuntimeException("Drawing not found: " + drawingName);
        }

        // Create folder if not exists
        String folderPath = IMAGE_BASE_PATH + drawingName + "/";
        File dir = new File(folderPath);
        if (!dir.exists()) dir.mkdirs();

        // Save image to correct place
        String filename = "step" + stepNumber + ".png";
        File destination = new File(folderPath + filename);
        imageFile.transferTo(destination);

        // Create Step entity
        Step step = new Step();
        step.setDrawing(drawing);
        step.setStepNumber(stepNumber);
        step.setDescription(description);
        step.setImagePath("/images/" + drawingName + "/" + filename); // used by frontend

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
}
