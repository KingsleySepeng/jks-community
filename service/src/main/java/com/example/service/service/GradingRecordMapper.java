package com.example.service.service;

import com.example.service.dto.GradingEvaluationDto;
import com.example.service.dto.GradingRecordRequestDto;
import com.example.service.dto.GradingRecordResponseDto;
import com.example.service.entity.GradingEvaluation;
import com.example.service.entity.GradingRecord;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface GradingRecordMapper {

    // --- Entity -> DTO mappings ---
    GradingEvaluationDto toDto(GradingEvaluation evaluation);

    List<GradingEvaluationDto> toGradingEvaluationDtoList(List<GradingEvaluation> evaluations);

    @Mapping(source = "evaluations", target = "evaluations", qualifiedByName = "evalsToDtoList")
    GradingRecordResponseDto toDto(GradingRecord record);

    @Named("evalsToDtoList")
    default List<GradingEvaluationDto> evalsToDtoList(List<GradingEvaluation> evaluations) {
        return evaluations.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // --- DTO -> Entity mappings ---
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "evaluations", ignore = true) // will link after mapping
    GradingRecord toEntity(GradingRecordRequestDto dto);

    GradingEvaluation toEvaluationEntity(GradingEvaluationDto dto);

    @AfterMapping
    default void linkEvaluations(
            GradingRecordRequestDto dto,
            @MappingTarget GradingRecord entity
    ) {
        List<GradingEvaluation> evals = dto.evaluations().stream()
                .map(d -> {
                    GradingEvaluation e = toEvaluationEntity(d);
                    e.setRecord(entity);
                    return e;
                })
                .collect(Collectors.toList());
        entity.setEvaluations(evals);
    }

    // --- Convenience methods for lists ---
    default List<GradingRecordResponseDto> toDtoList(List<GradingRecord> records) {
        return records.stream().map(this::toDto).collect(Collectors.toList());
    }

    default List<GradingRecord> toEntityList(List<GradingRecordRequestDto> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }
}