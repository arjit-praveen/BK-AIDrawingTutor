package com.example.drawing.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Step {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int stepNumber;
    private String description;
    private String imagePath;

    @ManyToOne
    @JoinColumn(name = "drawing_id")
    @JsonBackReference
    private Drawing drawing;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getStepNumber() { return stepNumber; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public Drawing getDrawing() { return drawing; }
    public void setDrawing(Drawing drawing) { this.drawing = drawing; }
}
