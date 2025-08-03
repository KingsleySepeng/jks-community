package com.example.service.dto;

import java.time.Instant;
import java.util.UUID;

public record ResourceResponseDto(
        UUID id,
        UUID clubId,
        String title,
        String description,
        String contentType,
        String base64Data,
        Instant uploadedAt
) {}
