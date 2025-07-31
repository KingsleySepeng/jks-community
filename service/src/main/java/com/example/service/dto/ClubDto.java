package com.example.service.dto;

import java.time.Instant;
import java.util.UUID;

public class ClubDto {
    private UUID id;
    private String clubCode;
    private String name;
    private String address;
    private String contactNumber;
    private Instant establishedDate;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
    private String logoUrl;
    private boolean isActive;
    private UUID instructorId;
}

