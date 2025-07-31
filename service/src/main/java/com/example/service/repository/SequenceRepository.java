package com.example.service.repository;

import com.example.service.model.Sequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SequenceRepository extends JpaRepository<Sequence, String> {
}

