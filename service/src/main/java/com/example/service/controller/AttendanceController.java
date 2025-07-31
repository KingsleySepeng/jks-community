package com.example.service.controller;

import com.example.service.dto.AttendanceSummary;
import com.example.service.entity.Attendance;
import com.example.service.repository.AttendanceRepository;
import com.example.service.service.AttendanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping()
    public ResponseEntity<Void> saveAttendance(@RequestBody List<Attendance> records) {
        log.info("Saving {} attendance records", records.size());
        attendanceService.saveAll(records);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable UUID studentId) {
        log.info("Fetching attendance for student ID {}", studentId);
        return ResponseEntity.ok(attendanceService.getByStudentId(studentId));
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<AttendanceSummary> getAttendanceSummaryForClub(
            @PathVariable UUID clubId,
            @RequestParam String start,
            @RequestParam String end) {

        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        log.info("Generating attendance summary for club {} from {} to {}", clubId, startDate, endDate);
        AttendanceSummary summary = attendanceService.getSummaryForClub(clubId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}
