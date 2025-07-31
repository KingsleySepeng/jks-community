package com.example.service.config;

import com.example.service.entity.*;
import com.example.service.repository.ClubRepository;
import com.example.service.repository.UserRepository;
import com.example.service.service.SequenceService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.service.repository.SequenceRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository userRepository,
                           ClubRepository clubRepository,
                           SequenceRepository sequenceRepository,
                           SequenceService sequenceService) {
        return args -> {
            // Create club_seq and member_seq if not present
            if (!sequenceRepository.existsById("club_seq")) {
                Sequence clubSeq = new Sequence();
                clubSeq.setSeqName("club_seq");
                clubSeq.setSeqValue(0L);
                sequenceRepository.save(clubSeq);
            }

            if (!sequenceRepository.existsById("member_seq")) {
                Sequence memberSeq = new Sequence();
                memberSeq.setSeqName("member_seq");
                memberSeq.setSeqValue(0L);
                sequenceRepository.save(memberSeq);
            }

            // Always ensure a club exists (create if needed)
            Club userClub = clubRepository.findAll().stream().findFirst().orElseGet(() -> {
                Club club = new Club();
                club.setId(UUID.randomUUID());
                club.setName("System Club");
                club.setActive(true);
                club.setAddress("123 Default St");
                club.setCreatedAt(Instant.now());
                club.setUpdatedAt(Instant.now());
                return clubRepository.save(club);
            });

            // Create system admin user if none exists
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setId(UUID.randomUUID());

                long nextMemberValue = sequenceService.getNextValue("member_seq");
                admin.setMemberId("MEM-" + nextMemberValue);
                admin.setEmail("sepengkingsley52@gmail.com");
                admin.setFirstName("Kingsley");
                admin.setLastName("Sepeng");
                admin.setClub(userClub);
                admin.setProfileImageUrl("");
                admin.setBelt(Belt.BLACK);
                admin.setRoles(Set.of(Role.SYSTEM_ADMIN));
                admin.setActive(true);
                admin.setCreatedAt(Instant.now());
                admin.setUpdatedAt(Instant.now());

                // Encode password
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                String hashedPassword = passwordEncoder.encode("admin123");
                admin.setPassword(hashedPassword);

                userRepository.save(admin);
            }
        };
    }
}
