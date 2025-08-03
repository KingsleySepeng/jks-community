package com.example.service.controller;

import com.example.service.dto.UserRequestDto;
import com.example.service.dto.UserResponseDto;
import com.example.service.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponseDto> all() {
        return userService.getAllUsers();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDto> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping()
    public ResponseEntity<UserResponseDto> updateUserPassword(@RequestBody UserRequestDto userDto) {
        UserResponseDto updatedUser = userService.updateUserPassword(userDto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponseDto> updateUserProfile(@RequestBody UserRequestDto userDto) {
        UserResponseDto updatedUser = userService.updateUserProfile(userDto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> one(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> create(@Valid @RequestBody UserRequestDto userRequest) {
        return ResponseEntity.ok(userService.createStudent(userRequest));
    }


    @PatchMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("{id}/activate")
    public ResponseEntity<Void> activate(@PathVariable UUID id) {
        userService.activateUser(id);
        return ResponseEntity.noContent().build();
    }
}
