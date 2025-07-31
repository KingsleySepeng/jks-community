package com.example.service.dto;

public class AttendanceSummary {
    private int total;
    private int present;
    private int notAttended;
    private double percentage;

    public AttendanceSummary() {
    }

    public AttendanceSummary(int total, int present, int notAttended, double percentage) {
        this.total = total;
        this.present = present;
        this.notAttended = notAttended;
        this.percentage = percentage;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPresent() {
        return present;
    }

    public void setPresent(int present) {
        this.present = present;
    }

    public int getNotAttended() {
        return notAttended;
    }

    public void setNotAttended(int notAttended) {
        this.notAttended = notAttended;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

}
