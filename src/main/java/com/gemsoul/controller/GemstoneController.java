package com.gemsoul.controller;

import com.gemsoul.entity.Gemstone;
import com.gemsoul.service.GemstoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gemstones")
public class GemstoneController {

    @Autowired
    private GemstoneService gemstoneService;

    @GetMapping
    public ResponseEntity<List<Gemstone>> getAllGemstones() {
        return ResponseEntity.ok(gemstoneService.getAllGemstones());
    }
}
