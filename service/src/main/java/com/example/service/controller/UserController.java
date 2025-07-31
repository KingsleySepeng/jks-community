package com.example.service.controller;

import com.example.service.ServiceApplication;
import com.example.service.model.User;
import com.example.service.repository.UserRepository;
import com.example.service.service.SequenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final SequenceService sequenceService;
    static Logger log = LoggerFactory.getLogger(UserController.class);

    public UserController(UserRepository userRepository,SequenceService sequenceService) {
        this.userRepository = userRepository;
        this.sequenceService = sequenceService;
    }

    @GetMapping
    public List<User> all() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> one(@PathVariable UUID id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User create(@RequestBody User user) {
        long nextValue = sequenceService.getNextValue("member_seq");
        user.setMemberId("MEM-" + nextValue); // Example member code generation
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(UUID.randomUUID().toString().substring(0,8));
        log.info("Generated password for user: {}", user.getPassword());
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        user.setActive(true); // Set user as active by default
        return userRepository.save(user);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable UUID id,@RequestBody User user) {
        return userRepository.findById(id)
                .map(existing -> {
                    user.setId(existing.getId());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id); // TODO: MAKE INACTIVE TO 1/TRUE
            // Instead of deleting, you might want to set the user as inactive
            userRepository.setInactive(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
