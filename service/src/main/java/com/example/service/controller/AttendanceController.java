package com.example.service.controller;

import com.example.service.model.Attendance;
import com.example.service.repository.AttendanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepo;

    public AttendanceController(AttendanceRepository attendanceRepo) {
        this.attendanceRepo = attendanceRepo;
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> saveAttendance(@RequestBody List<Attendance> records) {
        attendanceRepo.saveAll(records);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(attendanceRepo.findByUserId(studentId));
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<Attendance>> getByClubAndDateRange(
            @PathVariable UUID clubId,
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(attendanceRepo.findByClubIdAndDateBetween(clubId, startDate.atStartOfDay(), endDate.atStartOfDay()));
    }
}
