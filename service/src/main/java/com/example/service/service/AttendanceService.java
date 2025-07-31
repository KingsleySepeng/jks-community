package com.example.service.service;

import com.example.service.dto.AttendanceSummary;
import com.example.service.entity.Attendance;
import com.example.service.entity.AttendanceStatus;
import com.example.service.repository.AttendanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepo;
    private static final Logger log = LoggerFactory.getLogger(AttendanceService.class);

    public AttendanceService(AttendanceRepository attendanceRepo) {
        this.attendanceRepo = attendanceRepo;
    }

    public void saveAll(List<Attendance> records) {
        log.debug("Saving attendance records: {}", records);
        attendanceRepo.saveAll(records);
    }

    public List<Attendance> getByStudentId(UUID studentId) {
        return attendanceRepo.findByUserId(studentId);
    }

    public AttendanceSummary getSummaryForClub(UUID clubId, LocalDate start, LocalDate end) {
        List<Attendance> attendances = attendanceRepo.findByClubIdAndDateBetween(
                clubId,
                start.atStartOfDay(),
                end.plusDays(1).atStartOfDay()
        );

        int total = attendances.size();
        long present = attendances.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long notAttended = attendances.stream().filter(a -> a.getStatus() != AttendanceStatus.PRESENT).count();
        double percentage = total > 0 ? (present * 100.0) / total : 0.0;

        return new AttendanceSummary(total, (int) present, (int) notAttended, percentage);
    }
}
