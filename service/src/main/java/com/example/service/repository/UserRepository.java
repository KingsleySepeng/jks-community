package com.example.service.repository;

import com.example.service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.isActive = false WHERE u.id = :id")
    void setInactive(@Param("id") UUID id);
}
