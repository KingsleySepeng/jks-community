package com.example.service.service;

import com.example.service.dto.UserRequestDto;
import com.example.service.dto.UserResponseDto;
import com.example.service.entity.Club;
import com.example.service.entity.Role;
import com.example.service.entity.User;
import com.example.service.repository.ClubRepository;
import com.example.service.repository.UserRepository;
import com.example.service.service.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SequenceService sequenceService;
    private final ClubRepository clubRepository;
    private final UserMapper userMapper;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository, SequenceService sequenceService, UserMapper userMapper, ClubRepository clubRepository) {
        this.userRepository = userRepository;
        this.sequenceService = sequenceService;
        this.userMapper = userMapper;
        this.clubRepository = clubRepository;
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserResponseDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toDto(user);
    }

    public UserResponseDto createStudent(UserRequestDto dto) {
        User user = userMapper.toEntity(dto);
        user.setMemberId("MEM-" + sequenceService.getNextValue("member_seq"));

        // ✅ Fetch managed Club entity
        UUID clubId = dto.getClubId();  // ensure this is passed in DTO
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found with ID: " + clubId));
        user.setClub(club);

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(new BCryptPasswordEncoder().encode(tempPassword));
        user.setActive(true);
        user.setRoles(Collections.singleton(Role.STUDENT));
        log.info("Temporary password for {}: {}", user.getEmail(), tempPassword);
        log.info("Creating new student with email: {}", user.getEmail());
        return userMapper.toDto(userRepository.save(user));
    }


    public UserResponseDto updateUserPassword(UserRequestDto dto) {
        User existingUser = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        existingUser.setPassword(hashedPassword); // Preserve original password
        return userMapper.toDto(userRepository.save(existingUser));
    }

    public void deactivateUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.setInactive(id);
    }

    public void activateUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.setActive(id);
    }

    public Optional<UserResponseDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDto);
    }

    public List<UserResponseDto> getUsersByClub(UUID clubId) {
        return userRepository.findActiveStudentsByClub(clubId).stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserResponseDto updateUserProfile(UserRequestDto userDto) {
        User existingUser = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update fields from DTO
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setBelt(userDto.getBelt());
        existingUser.setRoles(userDto.getRoles());
        existingUser.setUpdatedAt(Instant.now());

        // Save and return updated user
        return userMapper.toDto(userRepository.save(existingUser));
    }
}