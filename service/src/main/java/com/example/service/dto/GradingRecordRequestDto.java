package com.example.service.dto;

import java.util.List;
import java.time.Instant;
import java.util.UUID;

public record GradingRecordRequestDto(
        UUID studentId,
        UUID examinerId,
        UUID clubId,
        Instant date,
        String currentBelt,
        String testingForBelt,
        List<GradingEvaluationDto> evaluations,
        String overallDecision,
        String overallComment
) {}
