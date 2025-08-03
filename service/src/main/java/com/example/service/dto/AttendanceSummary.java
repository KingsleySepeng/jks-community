package com.example.service.dto;

import java.util.UUID;

public record AttendanceSummary(UUID userId, int total, int present, int notAttended, double percentage) {
}

