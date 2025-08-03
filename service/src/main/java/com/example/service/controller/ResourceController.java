package com.example.service.controller;

import com.example.service.dto.ResourceRequestDto;
import com.example.service.dto.ResourceResponseDto;
import com.example.service.service.ResourceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {
    private final ResourceService service;
    private static final Logger log = LoggerFactory.getLogger(ResourceController.class);

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResourceResponseDto> create(
            @RequestPart("info") ResourceRequestDto dto,
            @RequestPart("file") MultipartFile file) {
        try {
            ResourceResponseDto resourceResponseDto = service.create(dto, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(resourceResponseDto);
        } catch (IOException e) {
            log.error("Upload failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/club/{clubId}")
    public ResponseEntity<List<ResourceResponseDto>> listByClub(@PathVariable UUID clubId) {
        return ResponseEntity.ok(service.listByClub(clubId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

