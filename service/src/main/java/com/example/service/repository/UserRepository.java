package com.example.service.repository;

import com.example.service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.id = :id")
    void setInactive(@Param("id") UUID id);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.active = true WHERE u.id = :id")
    void setActive(@Param("id") UUID id);

    @Query("""
    SELECT u FROM User u 
    WHERE u.club.id = :clubId 
      AND u.active = true 
      AND (
        'STUDENT' MEMBER OF u.roles 
        OR 'SUB_INSTRUCTOR' MEMBER OF u.roles
      )
    """)
    List<User> findActiveStudentsByClub(@Param("clubId") UUID clubId);



}
