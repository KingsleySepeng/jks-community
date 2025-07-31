package com.example.service.controller;

import com.example.service.dto.ClubRequestDto;
import com.example.service.dto.ClubResponseDto;
import com.example.service.entity.Club;
import com.example.service.repository.ClubRepository;
import com.example.service.service.ClubService;
import com.example.service.service.SequenceService;
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
    private static final Logger log = LoggerFactory.getLogger(ClubController.class);

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping
    public List<ClubResponseDto> getAll() {
        return clubService.getAllClubs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    @PostMapping
    public ResponseEntity<ClubResponseDto> create(@Valid @RequestBody ClubRequestDto clubRequest) {
        return ResponseEntity.ok(clubService.createClub(clubRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClubResponseDto> update(@PathVariable UUID id, @Valid @RequestBody ClubRequestDto clubRequest) {
        return ResponseEntity.ok(clubService.updateClub(id, clubRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        clubService.deactivateClub(id);
        return ResponseEntity.noContent().build();
    }
}
