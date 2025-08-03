package com.example.service.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "grading_evaluations")
public class GradingEvaluation {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "record_id", nullable = false)
    private GradingRecord record;

    @Column(nullable = false)
    private String techniqueId;

    @Column(nullable = false)
    private String rating;

    private String comment;

    // getters & setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public GradingRecord getRecord() {
        return record;
    }

    public void setRecord(GradingRecord record) {
        this.record = record;
    }

    public String getTechniqueId() {
        return techniqueId;
    }

    public void setTechniqueId(String techniqueId) {
        this.techniqueId = techniqueId;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}
