package com.example.service.repository;

import com.example.service.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ClubRepository extends JpaRepository<Club, UUID> {
    @Modifying
    @Query("UPDATE Club u SET u.active = false WHERE u.id = :id")
    void setInactive(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Club u SET u.instructorId = :id1 WHERE u.id = :id")
    void setInstructor(UUID id, UUID id1);
}
