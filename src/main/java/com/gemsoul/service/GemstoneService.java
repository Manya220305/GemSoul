package com.gemsoul.service;

import com.gemsoul.entity.Gemstone;
import com.gemsoul.repository.GemstoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GemstoneService {
    @Autowired
    private GemstoneRepository gemstoneRepository;

    public List<Gemstone> getAllGemstones() {
        return gemstoneRepository.findAll();
    }
}
