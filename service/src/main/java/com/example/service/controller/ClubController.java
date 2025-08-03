package com.example.service.controller;

import com.example.service.dto.*;
import com.example.service.service.ClubService;
import com.example.service.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/clubs")
public class ClubController {

    private final ClubService clubService;
    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(ClubController.class);

    public ClubController(ClubService clubService,UserService userService) {
        this.clubService = clubService;
        this.userService = userService;
    }

    @GetMapping
    public List<ClubResponseDto> getAll() {
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @GetMapping("/{clubId}/users")
    public ResponseEntity<List<UserResponseDto>> getUsersByClub(@PathVariable UUID clubId) {
        List<UserResponseDto> users = userService.getUsersByClub(clubId);
        return ResponseEntity.ok(users != null ? users : List.of());
    }

    @PostMapping
    public ResponseEntity<ClubResponseDto> createClubAndInstructor(@Valid @RequestBody ClubInstructorRequestDto clubInstructorRequestDto) {
        ClubRequestDto clubRequest = clubInstructorRequestDto.getClub();
        UserRequestDto userRequestDto = clubInstructorRequestDto.getInstructor();
        return ResponseEntity.ok(clubService.createClubAndInstructor(clubRequest, userRequestDto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ClubResponseDto> update(@PathVariable UUID id, @Valid @RequestBody ClubRequestDto clubRequest) {
        return ResponseEntity.ok(clubService.updateClubProfile(id, clubRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        clubService.deactivateClub(id);
        return ResponseEntity.noContent().build();
    }
}
