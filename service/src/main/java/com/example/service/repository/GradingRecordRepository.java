package com.example.service.repository;

import com.example.service.entity.GradingRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GradingRecordRepository extends JpaRepository<GradingRecord, UUID> {
    List<GradingRecord> findByClubId(UUID clubId);
}
