package com.example.service.service;

import com.example.service.dto.GradingEvaluationDto;
import com.example.service.dto.GradingRecordRequestDto;
import com.example.service.dto.GradingRecordResponseDto;
import com.example.service.entity.GradingEvaluation;
import com.example.service.entity.GradingRecord;
import com.example.service.repository.GradingRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;


@Service
public class GradingService {
    private static final Logger log = LoggerFactory.getLogger(GradingService.class);

    private final GradingRecordRepository recordRepo;
    private final GradingRecordMapper mapper;

    public GradingService(GradingRecordRepository recordRepo, GradingRecordMapper mapper) {
        this.recordRepo = recordRepo;
        this.mapper = mapper;
    }

    /**
     * Persist a batch of grading records and return their DTO representations.
     */
    @Transactional
    public List<GradingRecordResponseDto> saveAll(List<GradingRecordRequestDto> dtos) {
        // Map request DTOs to entities
        List<GradingRecord> entities = mapper.toEntityList(dtos);
        // Log the batch save operation
        log.info("Saving batch of {} grading records", entities.size());
        // Save all records (and cascading evaluations)
        List<GradingRecord> saved = recordRepo.saveAll(entities);
        // Map saved entities back to response DTOs
        List<GradingRecordResponseDto> responses = mapper.toDtoList(saved);
        log.info("Saved batch of {} grading records successfully", responses.size());
        return responses;
    }

    /**
     * Retrieve all grading records for a given club.
     */
    @Transactional(readOnly = true)
    public List<GradingRecordResponseDto> findByClub(UUID clubId) {
        log.info("Fetching grading records for club {}", clubId);
        List<GradingRecord> records = recordRepo.findByClubId(clubId);
        return mapper.toDtoList(records);
    }

    /**
     * Delete a specific grading record by its ID.
     */
    @Transactional
    public void deleteRecord(UUID id) {
        log.info("Deleting grading record {}", id);
        recordRepo.deleteById(id);
    }
}