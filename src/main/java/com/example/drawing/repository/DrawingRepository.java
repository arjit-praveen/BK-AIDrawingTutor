package com.example.drawing.repository;

import com.example.drawing.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrawingRepository extends JpaRepository<Drawing, Long> {
    Drawing findByName(String name);
}
