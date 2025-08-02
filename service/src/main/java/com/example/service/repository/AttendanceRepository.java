package com.example.service.repository;

import com.example.service.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByClubIdAndDateBetween(UUID clubId, Instant start, Instant end);

}
