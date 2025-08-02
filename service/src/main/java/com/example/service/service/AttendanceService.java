package com.example.service.service;

import com.example.service.dto.AttendanceRequestDto;
import com.example.service.dto.AttendanceResponseDto;
import com.example.service.dto.AttendanceSummary;
import com.example.service.entity.Attendance;
import com.example.service.entity.AttendanceStatus;
import com.example.service.entity.User;
import com.example.service.repository.AttendanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;
    private static final Logger log = LoggerFactory.getLogger(AttendanceService.class);

    public AttendanceService(AttendanceRepository attendanceRepository, AttendanceMapper attendanceMapper) {
        this.attendanceRepository = attendanceRepository;
        this.attendanceMapper = attendanceMapper;
    }

    public void saveAll(List<AttendanceRequestDto> attendanceRequestDtos) {
        try {
            List<Attendance> attendanceEntities = attendanceMapper.toEntityList(attendanceRequestDtos);
            attendanceEntities.forEach(attendance -> log.debug("Attendance record: {}", attendance));
            List<Attendance> records = attendanceRequestDtos.stream().map(dto -> {
                Attendance a = new Attendance();
                User user = new User();
                user.setId(dto.userId());
                a.setUser(user);
                a.setInstructorId(dto.instructorId());
                a.setClubId(dto.clubId());
                a.setDate(Instant.parse(dto.date()));
                log.info("Date to save attendance is: {}", dto.date());
                a.setStatus(AttendanceStatus.valueOf(dto.status()));
                a.setComments(dto.comments());
                return a;
            }).toList();

            attendanceRepository.saveAll(records);
            log.info("Saved {} attendance records", records.size());
        } catch (Exception e) {
            log.error("Error saving attendance records", e);
            throw new RuntimeException("Failed to save attendance", e);
        }
    }



    public List<AttendanceResponseDto> findByClubIdAndDateBetween(UUID clubId, String startInstant, String endInstant) {
        Instant start = Instant.parse(startInstant);
        Instant end = Instant.parse(endInstant).plus(1, ChronoUnit.DAYS); // make it inclusive
        List<Attendance> records = attendanceRepository.findByClubIdAndDateBetween(clubId, start, end);
        return records.stream().map(attendanceMapper::toDto).toList();
    }

//    public AttendanceSummary getAttendanceRange(UUID clubId, LocalDate start, LocalDate end) {
//        Instant startInstant = start.atStartOfDay().toInstant(ChronoUnit.DAYS.getBaseUnit().getRules().getOffset(start));
//        Instant endInstant = end.atTime(23, 59, 59).toInstant(ChronoUnit.DAYS.getBaseUnit().getRules().getOffset(end));
//
//        List<Attendance> records = attendanceRepository.findByClubIdAndDateBetween(clubId, startInstant, endInstant);
//
//        long totalRecords = records.size();
//        long presentCount = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
//        long absentCount = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
//
//        return new AttendanceSummary(totalRecords, presentCount, absentCount);
//    }
}
