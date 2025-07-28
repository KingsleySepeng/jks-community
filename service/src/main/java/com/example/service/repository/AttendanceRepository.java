package com.example.service.repository;

import com.example.service.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByClubIdAndDateBetween(String clubId, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByUserId(String studentId);
}
