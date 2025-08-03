package com.example.service.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "grading_records")
public class GradingRecord {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private UUID studentId;

    @Column(nullable = false)
    private UUID examinerId;

    @Column(nullable = false)
    private UUID clubId;

    @Column(nullable = false)
    private Instant date;

    private String currentBelt;
    private String testingForBelt;
    private String overallDecision;
    private String overallComment;

    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GradingEvaluation> evaluations;

    // getters & setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getExaminerId() {
        return examinerId;
    }

    public void setExaminerId(UUID examinerId) {
        this.examinerId = examinerId;
    }

    public UUID getClubId() {
        return clubId;
    }

    public void setClubId(UUID clubId) {
        this.clubId = clubId;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public String getCurrentBelt() {
        return currentBelt;
    }

    public void setCurrentBelt(String currentBelt) {
        this.currentBelt = currentBelt;
    }

    public String getTestingForBelt() {
        return testingForBelt;
    }

    public void setTestingForBelt(String testingForBelt) {
        this.testingForBelt = testingForBelt;
    }

    public String getOverallDecision() {
        return overallDecision;
    }

    public void setOverallDecision(String overallDecision) {
        this.overallDecision = overallDecision;
    }

    public String getOverallComment() {
        return overallComment;
    }

    public void setOverallComment(String overallComment) {
        this.overallComment = overallComment;
    }

    public List<GradingEvaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<GradingEvaluation> evaluations) {
        this.evaluations = evaluations;
    }
}