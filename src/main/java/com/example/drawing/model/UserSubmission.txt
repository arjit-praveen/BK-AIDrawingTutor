package com.example.drawing.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class UserSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String imagePath;

    private int rating;

    @ManyToOne
    @JoinColumn(name = "drawing_id")
    @JsonIgnoreProperties({"description"}) // Prevent circular reference or excessive nesting
    private Drawing drawing;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public Drawing getDrawing() { return drawing; }
    public void setDrawing(Drawing drawing) { this.drawing = drawing; }
}
