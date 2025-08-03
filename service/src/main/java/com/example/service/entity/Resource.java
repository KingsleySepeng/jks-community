package com.example.service.entity;


import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Lob
    @Column(nullable = false)
    @Basic(fetch = FetchType.EAGER)
    private byte[] data;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Instant uploadedAt;

    @Column(nullable = false)
    private UUID clubId;

    @PreUpdate
    protected void onUpdate() {
        this.uploadedAt = Instant.now();
    }

    public UUID getClubId() {
        return clubId;
    }

    public void setClubId(UUID clubId) {
        this.clubId = clubId;
    }

    // getters + setters
    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String t) {
        this.title = t;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String d) {
        this.description = d;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant i) {
        this.uploadedAt = i;
    }
}