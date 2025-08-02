package com.example.service.dto;

import com.example.service.entity.Belt;
import com.example.service.entity.Role;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class UserResponseDto {

    private UUID id;
    private String memberId;
    private String firstName;
    private String lastName;
    private String email;
    private String belt;
    private boolean isActive;
    private List<Role> roles;
    private UUID clubId;
    private List<AttendanceResponseDto> attendance;

    public List<AttendanceResponseDto> getAttendance() {
        return attendance;
    }

    public void setAttendance(List<AttendanceResponseDto> attendance) {
        this.attendance = attendance;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBelt() {
        return belt;
    }

    public void setBelt(String belt) {
        this.belt = belt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public UUID getClubId() {
        return clubId;
    }

    public void setClubId(UUID clubId) {
        this.clubId = clubId;
    }

}
