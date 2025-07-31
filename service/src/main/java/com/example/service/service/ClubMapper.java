package com.example.service.service;

import com.example.service.dto.ClubRequestDto;
import com.example.service.dto.ClubResponseDto;
import com.example.service.entity.Club;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClubMapper {
    @Mapping(source = "id", target = "id")
    @Mapping(source = "clubCode", target = "clubCode")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "contactNumber", target = "contactNumber")
    @Mapping(source = "establishedDate", target = "establishedDate")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    @Mapping(source = "logoUrl", target = "logoUrl")
    @Mapping(source = "instructorId", target = "instructorId")
    @Mapping(source = "active", target = "active")
    ClubResponseDto toDto(Club club);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "clubCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "instructorId", ignore = true)
    @Mapping(source = "name", target = "name")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "contactNumber", target = "contactNumber")
    @Mapping(source = "establishedDate", target = "establishedDate")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "logoUrl", target = "logoUrl")
    @Mapping(source = "active", target = "active")
    Club toEntity(ClubRequestDto dto);
}

