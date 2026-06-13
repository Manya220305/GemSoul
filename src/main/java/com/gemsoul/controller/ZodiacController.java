package com.gemsoul.controller;

import com.gemsoul.dto.ZodiacResponse;
import com.gemsoul.service.ZodiacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/zodiac")
public class ZodiacController {

    @Autowired
    private ZodiacService zodiacService;

    @PostMapping("/calculate")
    public ResponseEntity<ZodiacResponse> calculateZodiac(@RequestBody Map<String, String> request) {
        String dob = request.get("dob");
        if (dob == null || dob.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ZodiacResponse res = zodiacService.getZodiacFromDate(dob);
        if (res == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(res);
    }
}
