package com.example.service.service;

import com.example.service.entity.Sequence;
import com.example.service.repository.SequenceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SequenceService {

    @Autowired
    private SequenceRepository sequenceRepository;

    @Transactional
    public Long getNextValue(String seqName) {
        Sequence sequence = sequenceRepository.findById(seqName)
                .orElseThrow(() -> new RuntimeException("Sequence not found: " + seqName));

        Long nextValue = sequence.getSeqValue() + 1;
        sequence.setSeqValue(nextValue);
        sequenceRepository.save(sequence);

        return nextValue;
    }
}

