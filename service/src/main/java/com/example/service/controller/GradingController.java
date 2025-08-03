package com.example.service.controller;

import com.example.service.dto.GradingRecordRequestDto;
import com.example.service.dto.GradingRecordResponseDto;
import com.example.service.service.GradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/grading-records")
public class GradingController {
    private final GradingService gradingService;

    public GradingController(GradingService gradingService) { this.gradingService = gradingService; }

    @PostMapping()
    public ResponseEntity<List<GradingRecordResponseDto>> submit(
            @RequestBody List<GradingRecordRequestDto> batch) {
        List<GradingRecordResponseDto> saved = gradingService.saveAll(batch);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<GradingRecordResponseDto>> listByClub(@PathVariable UUID clubId) {
        return ResponseEntity.ok(gradingService.findByClub(clubId));
    }
}
