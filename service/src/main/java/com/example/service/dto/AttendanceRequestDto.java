package com.example.service.dto;

import java.util.UUID;

public record AttendanceRequestDto(
        UUID userId,
        UUID instructorId,
        UUID clubId,
        String date,
        String status,
        String comments
) {}

