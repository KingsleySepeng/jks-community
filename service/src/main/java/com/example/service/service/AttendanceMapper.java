package com.example.service.service;

import com.example.service.dto.AttendanceRequestDto;
import com.example.service.dto.AttendanceResponseDto;
import com.example.service.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "instructorId", target = "instructorId")
    @Mapping(source = "clubId", target = "clubId")
    @Mapping(source = "date", target = "date")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "comments", target = "comments")
    AttendanceResponseDto toDto(Attendance attendance);

    Attendance toEntity(AttendanceRequestDto dto);

    List<Attendance> toEntityList(List<AttendanceRequestDto> attendanceRequestDtos);
}