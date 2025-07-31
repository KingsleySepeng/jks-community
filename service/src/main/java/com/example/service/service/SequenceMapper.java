package com.example.service.service;

import com.example.service.dto.SequenceDto;
import com.example.service.entity.Sequence;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SequenceMapper {
    @Mapping(source = "seqName", target = "seqName")
    @Mapping(source = "seqValue", target = "seqValue")
    SequenceDto toDTO(Sequence sequence);
    Sequence toEntity(SequenceDto dto);
}
