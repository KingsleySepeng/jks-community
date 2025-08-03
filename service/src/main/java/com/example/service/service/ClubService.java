package com.example.service.service;

import com.example.service.dto.*;
import com.example.service.entity.Belt;
import com.example.service.entity.Club;
import com.example.service.entity.Role;
import com.example.service.entity.User;
import com.example.service.repository.ClubRepository;
import com.example.service.repository.UserRepository;
import com.example.service.service.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final SequenceService sequenceService;
    private final UserRepository userRepository;
    private final ClubMapper clubMapper;
    private final UserMapper userMapper;
    private static final Logger log = LoggerFactory.getLogger(ClubService.class);

    public ClubService(ClubRepository clubRepository, SequenceService sequenceService, ClubMapper clubMapper,UserRepository userRepository,UserMapper userMapper) {
        this.clubRepository = clubRepository;
        this.sequenceService = sequenceService;
        this.clubMapper = clubMapper;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    public ClubResponseDto createClubAndInstructor(ClubRequestDto clubDto, UserRequestDto userDto) {
        Club club = clubMapper.toEntity(clubDto);
        long nextValue = sequenceService.getNextValue("club_seq");
        club.setClubCode("CLUB-" + nextValue);
        club.setId(UUID.randomUUID());
        club.setActive(true);
        club.setCreatedAt(Instant.now());
        club.setUpdatedAt(Instant.now());
        log.info("Creating new club with code: {}", club.getClubCode());
        Club savedClub = clubRepository.save(club);

        User instructor = userMapper.toEntity(userDto);
        instructor.setId(UUID.randomUUID());
        instructor.setBelt(Belt.BLACK);
        instructor.setRoles(Collections.singleton(Role.INSTRUCTOR));
        instructor.setMemberId("MEM-" + sequenceService.getNextValue("member_seq"));
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        instructor.setPassword(passwordEncoder.encode(UUID.randomUUID().toString().substring(0, 8)));
        instructor.setClub(savedClub); // Link instructor to newly created club
        instructor.setActive(true);
        instructor.setCreatedAt(Instant.now());
        instructor.setUpdatedAt(Instant.now());
        User savedUser = userRepository.save(instructor);
        savedClub.setInstructorId(savedUser.getId());
        clubRepository.save(savedClub); // Save club again to update instructor ID
        return clubMapper.toDto(savedClub);
    }


    public List<ClubResponseDto> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(clubMapper::toDto)
                .toList();
    }

    public ClubResponseDto getClubById(UUID id) {
        log.info("Fetching club with ID: {}", id);
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));
        return clubMapper.toDto(club);
    }


    public ClubResponseDto updateClubProfile(UUID id, ClubRequestDto dto) {
        Club existing = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found"));
        Club updated = clubMapper.toEntity(dto);
        existing.setName(dto.getName());
        existing.setContactNumber(dto.getContactNumber());
        existing.setDescription(dto.getDescription());
        existing.setAddress(dto.getAddress());
        existing.setLogoUrl(dto.getLogoUrl());
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