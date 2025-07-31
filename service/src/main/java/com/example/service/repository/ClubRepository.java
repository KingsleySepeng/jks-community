package com.example.service.repository;

import com.example.service.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ClubRepository extends JpaRepository<Club, UUID> {
    @Modifying
    @Query("UPDATE Club u SET u.isActive = false WHERE u.id = :id")
    void setInactive(@Param("id") UUID id);
}
