package com.example.service.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "club")
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
    private boolean active;
    private String martialArtsType;
    private UUID instructorId;  // store UUID only instead of User entity

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // getters and setters

    public String getMartialArtsType() {
        return martialArtsType;
    }

    public void setMartialArtsType(String martialArtsType) {
        this.martialArtsType = martialArtsType;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getClubCode() {
        return clubCode;
    }

    public void setClubCode(String clubCode) {
        this.clubCode = clubCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public Instant getEstablishedDate() {
        return establishedDate;
    }

    public void setEstablishedDate(Instant establishedDate) {
        this.establishedDate = establishedDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(UUID instructorId) {
        this.instructorId = instructorId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
