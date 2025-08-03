package com.example.service.repository;

import com.example.service.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ResourceRepository extends JpaRepository<Resource, UUID> {
    List<Resource> findAllByClubId(UUID clubId);
}
