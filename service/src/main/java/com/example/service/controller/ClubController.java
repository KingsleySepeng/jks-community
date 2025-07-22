package com.example.service.controller;

import com.example.service.model.Club;
import com.example.service.repository.ClubRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubRepository clubRepository;

    public ClubController(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    @GetMapping
    public List<Club> all() {
        return clubRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Club> one(@PathVariable String id) {
        return clubRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Club create(@RequestBody Club club) {
        return clubRepository.save(club);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> update(@PathVariable String id, @RequestBody Club club) {
        return clubRepository.findById(id)
                .map(existing -> {
                    club.setId(existing.getId());
                    return ResponseEntity.ok(clubRepository.save(club));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (clubRepository.existsById(id)) {
            clubRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
