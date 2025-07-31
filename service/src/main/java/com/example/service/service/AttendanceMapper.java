package com.example.service.service;

import com.example.service.dto.AttendanceDto;
import com.example.service.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "date", target = "date")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "instructorId", target = "instructorId")
    @Mapping(source = "comments", target = "comments")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "clubId", target = "clubId")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    AttendanceDto toDTO(Attendance entity);
    Attendance toEntity(AttendanceDto dto);
}