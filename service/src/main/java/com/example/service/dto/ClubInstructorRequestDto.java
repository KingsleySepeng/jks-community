package com.example.service.dto;

public class ClubInstructorRequestDto {
    private ClubRequestDto club;
    private UserRequestDto instructor;

    public ClubRequestDto getClub() {
        return club;
    }

    public void setClub(ClubRequestDto club) {
        this.club = club;
    }

    public UserRequestDto getInstructor() {
        return instructor;
    }

    public void setInstructor(UserRequestDto instructor) {
        this.instructor = instructor;
    }
}
