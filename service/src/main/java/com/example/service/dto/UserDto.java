package com.example.service.dto;

import com.example.service.entity.Belt;
import com.example.service.entity.Role;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String memberId;
    private String email;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
    private Belt belt;
    private Set<Role> roles;
    private UUID clubId;
    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}

