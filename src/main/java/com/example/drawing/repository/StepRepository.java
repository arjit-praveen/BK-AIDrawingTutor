package com.example.drawing.repository;

import com.example.drawing.model.Step;
import com.example.drawing.model.Drawing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StepRepository extends JpaRepository<Step, Long> {
    List<Step> findByDrawingOrderByStepNumberAsc(Drawing drawing);
}
