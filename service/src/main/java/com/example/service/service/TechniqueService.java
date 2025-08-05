package com.example.service.service;

import com.example.service.dto.TechniqueDto;
import com.example.service.entity.Technique;
import com.example.service.repository.TechniqueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TechniqueService {
    private final TechniqueRepository techniqueRepository;

    public TechniqueService(TechniqueRepository techniqueRepository) {
        this.techniqueRepository = techniqueRepository;
    }

    public List<TechniqueDto> getByBelt(String belt) {
        List<Technique> entities = techniqueRepository.findByBelt(belt);
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    private TechniqueDto toDto(Technique entity) {
        TechniqueDto dto = new TechniqueDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setCategory(entity.getCategory());
        dto.setBelt(entity.getBelt());
        return dto;
    }
}

