package com.gemsoul.controller;

import com.gemsoul.dto.RecommendationRequest;
import com.gemsoul.dto.RecommendationResponse;
import com.gemsoul.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<RecommendationResponse> createRecommendation(@Valid @RequestBody RecommendationRequest request) {
        RecommendationResponse res = recommendationService.createRecommendation(request);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<RecommendationResponse>> getAllRecommendations() {
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }
}
