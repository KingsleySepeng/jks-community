package com.example.service.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GradingRecordResponseDto(
        UUID id,
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
