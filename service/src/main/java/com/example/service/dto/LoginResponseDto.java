package com.example.service.dto;

import com.example.service.entity.Role;

import java.util.Set;
import java.util.UUID;

public class LoginResponseDto {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private Set<Role> roles;
    private UUID clubId;


    // Constructor
    public LoginResponseDto(UUID id, String email, String firstName, String lastName, Set<Role> roles, UUID clubId) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
        this.clubId = clubId;
    }

    // Getters & setters

    public UUID getClubId() {
        return clubId;
    }

    public void setClubId(UUID clubId) {
        this.clubId = clubId;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
