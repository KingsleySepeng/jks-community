package com.example.service.model;

public class AttendanceSummary {
    private int total;
    private int present;
    private int notAttended;
    private double percentage;

    public AttendanceSummary() {}

    public AttendanceSummary(int total, int present, int notAttended, double percentage) {
        this.total = total;
        this.present = present;
        this.notAttended = notAttended;
        this.percentage = percentage;
    }

    // Getters and Setters
}
