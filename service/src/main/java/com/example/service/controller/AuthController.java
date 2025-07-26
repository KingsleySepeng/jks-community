package com.example.service.controller;

import com.example.service.model.User;
import com.example.service.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        log.info("User '{}' logged in successfully", email);
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }
}
