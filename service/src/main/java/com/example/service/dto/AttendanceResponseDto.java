package com.example.service.dto;

import java.time.Instant;
import java.util.UUID;

public record AttendanceResponseDto(
        UUID id,
        UUID userId,
        UUID instructorId,
        UUID clubId,
        Instant date,
        String status,
        String comments
) {}

