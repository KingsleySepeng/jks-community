package com.example.service.service;

import com.example.service.dto.ResourceRequestDto;
import com.example.service.dto.ResourceResponseDto;
import com.example.service.entity.Resource;
import com.example.service.repository.ResourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class ResourceService {
    private final ResourceRepository resourceRepository;
    private static final Logger log = LoggerFactory.getLogger(ResourceService.class);

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public ResourceResponseDto create(ResourceRequestDto dto, MultipartFile file) throws IOException {
        Resource r = new Resource();
        r.setClubId(dto.clubId());
        r.setTitle(dto.title());
        r.setDescription(dto.description());
        r.setData(file.getBytes());
        r.setContentType(file.getContentType());
        r.setUploadedAt(Instant.now());
        r = resourceRepository.save(r);
        String b64 = Base64.getEncoder().encodeToString(r.getData());
        return new ResourceResponseDto(
                r.getId(), r.getClubId(), r.getTitle(), r.getDescription(),
                r.getContentType(), b64, r.getUploadedAt()
        );
    }


//    public List<ResourceResponseDto> listAll() {
//        return resourceRepository.findAll().stream().map(r -> {
//            String b64 = Base64.getEncoder().encodeToString(r.getData());
//            return new ResourceResponseDto(
//                    r.getId(),r.getClubId(), r.getTitle(), r.getDescription(),
//                    r.getContentType(), b64, r.getUploadedAt()
//            );
//        }).toList();
//    }

    @Transactional(readOnly = true)
    public List<ResourceResponseDto> listByClub(UUID clubId) {
        return resourceRepository.findAllByClubId(clubId).stream().map(r -> {
            String b64 = Base64.getEncoder().encodeToString(r.getData());
            return new ResourceResponseDto(
                    r.getId(), r.getClubId(), r.getTitle(), r.getDescription(),
                    r.getContentType(), b64, r.getUploadedAt()
            );
        }).toList();
    }

    public void delete(UUID id) {
        resourceRepository.deleteById(id);
    }
}
