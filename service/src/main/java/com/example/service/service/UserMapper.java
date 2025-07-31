package com.example.service.service;

import com.example.service.dto.UserRequestDto;
import com.example.service.dto.UserResponseDto;
import com.example.service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // DTO → Entity
    @Mapping(source = "clubId", target = "club.id")
    User toEntity(UserRequestDto dto);

    // Entity → DTO
    @Mapping(source = "club.id", target = "clubId")
    UserResponseDto toDto(User user);
}

