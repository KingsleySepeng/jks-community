package com.example.service.controller;

import com.example.service.model.Attendance;
import com.example.service.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepo;

    @PostMapping("/bulk")
    public ResponseEntity<Void> saveAttendance(@RequestBody List<Attendance> records) {
        attendanceRepo.saveAll(records);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceRepo.findByUserId(studentId));
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<Attendance>> getByClubAndDateRange(
            @PathVariable String clubId,
            @RequestParam String start,
            @RequestParam String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return ResponseEntity.ok(attendanceRepo.findByClubIdAndDateBetween(clubId, startDate, endDate));
    }
}
