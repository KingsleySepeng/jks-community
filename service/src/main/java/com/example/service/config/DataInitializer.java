package com.example.service.config;

import com.example.service.model.Belt;
import com.example.service.model.Club;
import com.example.service.model.Role;
import com.example.service.model.User;
import com.example.service.repository.ClubRepository;
import com.example.service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository userRepository, ClubRepository clubRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setId(UUID.randomUUID().toString());
                admin.setMemberId("SYS-ADMIN-001");
                admin.setEmail("kingsley@gmail.com");
                admin.setFirstName("Kingsley");
                admin.setLastName("Sepeng");
                admin.setClubId("system");
                admin.setProfileImageUrl("");
                admin.setBelt(Belt.BLACK);
                admin.setRoles(Set.of(Role.SYSTEM_ADMIN));
                admin.setPassword("admin123");
                admin.setActive(true);
                admin.setCreatedAt(Instant.now());
                admin.setUpdatedAt(Instant.now());
                userRepository.save(admin);
            }
            if (clubRepository.count() == 0) {
                Club club = new Club();
                club.setId("system");
                club.setName("System Club");
                club.setAddress("");
                club.setCreatedAt(Instant.now());
                club.setUpdatedAt(Instant.now());
                clubRepository.save(club);
            }
        };
    }
}
