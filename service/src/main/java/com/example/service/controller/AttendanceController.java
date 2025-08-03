package com.example.service.controller;

import com.example.service.dto.AttendanceRequestDto;
import com.example.service.dto.AttendanceResponseDto;
import com.example.service.dto.AttendanceSummary;
import com.example.service.entity.Attendance;
import com.example.service.service.AttendanceMapper;
import com.example.service.service.AttendanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<?> saveAttendance(@RequestBody List<AttendanceRequestDto> attendanceRequestDtos) {
        log.info("Received {} attendance records", attendanceRequestDtos.size());
        try {
            attendanceService.saveAll(attendanceRequestDtos);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            log.error("Failed to save attendance", ex);
            return ResponseEntity.internalServerError().body("Failed to save attendance records.");
        }
    }

    @GetMapping("/club/{clubId}/records")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendanceRecordsForClub(
            @PathVariable UUID clubId,
            @RequestParam String start,
            @RequestParam String end
    ) {
        try {
            List<AttendanceResponseDto> response = attendanceService.findByClubIdAndDateBetween(clubId, start, end);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to fetch detailed attendance", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/club/{clubId}/summary")
    public ResponseEntity<List<AttendanceSummary>> getAttendanceSummaryForClub(
            @PathVariable UUID clubId,
            @RequestParam String start,
            @RequestParam String end
    ) {
        try {
            List<AttendanceSummary> summary = attendanceService.getAttendanceSummaries(clubId, start, end);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Failed to fetch attendance summary", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
