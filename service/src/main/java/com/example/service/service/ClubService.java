package com.example.service.service;

import com.example.service.dto.ClubRequestDto;
import com.example.service.dto.ClubResponseDto;
import com.example.service.entity.Club;
import com.example.service.repository.ClubRepository;
import com.example.service.service.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final SequenceService sequenceService;
    private final ClubMapper clubMapper;
    private static final Logger log = LoggerFactory.getLogger(ClubService.class);

    public ClubService(ClubRepository clubRepository, SequenceService sequenceService, ClubMapper clubMapper) {
        this.clubRepository = clubRepository;
        this.sequenceService = sequenceService;
        this.clubMapper = clubMapper;
    }

    public List<ClubResponseDto> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(clubMapper::toDto)
                .toList();
    }

    public ClubResponseDto getClubById(UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));
        return clubMapper.toDto(club);
    }

    public ClubResponseDto createClub(ClubRequestDto dto) {
        Club club = clubMapper.toEntity(dto);
        long nextValue = sequenceService.getNextValue("club_seq");
        club.setClubCode("CLUB-" + nextValue);
        club.setActive(true);
        log.info("Creating new club with code: {}", club.getClubCode());
        return clubMapper.toDto(clubRepository.save(club));
    }

    public ClubResponseDto updateClub(UUID id, ClubRequestDto dto) {
        Club existing = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));
        Club updated = clubMapper.toEntity(dto);
        updated.setId(existing.getId());
        updated.setClubCode(existing.getClubCode());
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setActive(existing.isActive());
        return clubMapper.toDto(clubRepository.save(updated));
    }

    public void deactivateClub(UUID id) {
        if (!clubRepository.existsById(id)) {
            throw new ResourceNotFoundException("Club not found");
        }
        log.info("Soft-deleting club with ID: {}", id);
        clubRepository.setInactive(id);
    }
}