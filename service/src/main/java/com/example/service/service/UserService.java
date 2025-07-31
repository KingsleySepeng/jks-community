package com.example.service.service;

import com.example.service.dto.UserDto;
import com.example.service.dto.UserRequestDto;
import com.example.service.dto.UserResponseDto;
import com.example.service.entity.User;
import com.example.service.repository.UserRepository;
import com.example.service.service.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SequenceService sequenceService;
    private final UserMapper userMapper;
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, SequenceService sequenceService, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.sequenceService = sequenceService;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
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

    public UserResponseDto createUser(UserRequestDto dto) {
        User user = userMapper.toEntity(dto);
        user.setMemberId("MEM-" + sequenceService.getNextValue("member_seq"));

        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        user.setPassword(new BCryptPasswordEncoder().encode(tempPassword));
        user.setActive(true);

        log.info("Temporary password for {}: {}", user.getEmail(), tempPassword);

        return userMapper.toDto(userRepository.save(user));
    }

    public UserResponseDto updateUser(UUID id, UserRequestDto dto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User updated = userMapper.toEntity(dto);
        updated.setId(existing.getId());
        updated.setPassword(existing.getPassword()); // Preserve original password

        return userMapper.toDto(userRepository.save(updated));
    }

    public void deactivateUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.setInactive(id);
    }


    public Optional<UserResponseDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDto);
    }

    public Optional<UserResponseDto> partiallyUpdateUser(UUID id, UserRequestDto userDto) {
        return userRepository.findById(id).map(existingUser -> {
            if (userDto.getFirstName() != null) existingUser.setFirstName(userDto.getFirstName());
            if (userDto.getLastName() != null) existingUser.setLastName(userDto.getLastName());
            if (userDto.getPassword() != null) {
                existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }

            // Add additional fields as necessary
            existingUser.setUpdatedAt(Instant.now());
            userRepository.save(existingUser);
            return userMapper.toDto(existingUser);
        });
    }
}