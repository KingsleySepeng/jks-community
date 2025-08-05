package com.example.service.controller;

import com.example.service.dto.TechniqueDto;
import com.example.service.service.TechniqueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/techniques")
public class TechniqueController {

    private final TechniqueService techniqueService;

    public TechniqueController(TechniqueService techniqueService) {
        this.techniqueService = techniqueService;
    }

    @GetMapping("/{belt}")
    public ResponseEntity<List<TechniqueDto>> getByBelt(@PathVariable String belt) {
        return ResponseEntity.ok(techniqueService.getByBelt(belt));
    }
}
