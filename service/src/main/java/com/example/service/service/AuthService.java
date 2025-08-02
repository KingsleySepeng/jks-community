package com.example.service.service;

import com.example.service.dto.LoginRequestDto;
import com.example.service.dto.LoginResponseDto;
import com.example.service.entity.User;
import com.example.service.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponseDto login(LoginRequestDto loginRequest) {
        log.info("Attempting login for email: {}", loginRequest.getEmail());

        return userRepository.findByEmail(loginRequest.getEmail())
                .filter(User::isActive)
                .filter(user -> passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()))
                .map(user -> {
                    log.info("Login successful for user: {}", user.getEmail());
                    return new LoginResponseDto(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(),user.getRoles(),user.getClub().getId());
                })
                .orElseThrow(() -> {
                    log.warn("Login failed for email: {}", loginRequest.getEmail());
                    return new RuntimeException("Invalid credentials or inactive user");
                });
    }
}
