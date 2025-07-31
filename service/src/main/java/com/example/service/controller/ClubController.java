package com.example.service.controller;

import com.example.service.model.Club;
import com.example.service.repository.ClubRepository;
import com.example.service.repository.SequenceRepository;
import com.example.service.service.SequenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/clubs")
public class ClubController {

    private final ClubRepository clubRepository;
    private final SequenceService sequenceService;

    public ClubController(ClubRepository clubRepository, SequenceService sequenceService) {
        this.clubRepository = clubRepository;
        this.sequenceService = sequenceService;
    }

    @GetMapping
    public List<Club> all() {
        return clubRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> one(@PathVariable UUID id) {
        return clubRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Club create(@RequestBody Club club) { //TODO CREATE DTOS
        // Generate a new ID using the sequence repository
        long nextValue = sequenceService.getNextValue("club_seq");
        club.setClubCode("CLUB-" + nextValue); // Example club code generation
        // Set other fields as necessary
        return clubRepository.save(club);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> update(@PathVariable UUID id, @RequestBody Club club) {
        return clubRepository.findById(id)
                .map(existing -> {
                    club.setId(existing.getId());
                    return ResponseEntity.ok(clubRepository.save(club));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (clubRepository.existsById(id)) {
            clubRepository.setInactive(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
