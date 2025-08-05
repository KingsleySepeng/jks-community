package com.example.service.repository;

import com.example.service.entity.Technique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TechniqueRepository extends JpaRepository<Technique, UUID> {
    @Query("SELECT t FROM Technique t WHERE t.belt = ?1")
    List<Technique> findByBelt(String belt);
}
