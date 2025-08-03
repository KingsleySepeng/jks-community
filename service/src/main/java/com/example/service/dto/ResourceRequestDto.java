package com.example.service.dto;

import java.util.UUID;

public record ResourceRequestDto(
        UUID clubId,
        String title,
        String description
) {}
