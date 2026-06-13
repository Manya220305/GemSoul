package com.gemsoul.service;

import com.gemsoul.dto.AdminStatsResponse;
import com.gemsoul.entity.Recommendation;
import com.gemsoul.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.WeekFields;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    
    @Autowired
    private RecommendationRepository recommendationRepository;

    public AdminStatsResponse getStats() {
        List<Recommendation> all = recommendationRepository.findAll();
        
        AdminStatsResponse stats = new AdminStatsResponse();
        stats.setTotalRecs(all.size());
        
        Map<String, Long> weekly = new HashMap<>();
        Map<String, Long> gemCounts = new HashMap<>();
        Map<String, Long> zodiacCounts = new HashMap<>();
        
        for (Recommendation r : all) {
            String gemName = r.getGemstone().getName();
            gemCounts.put(gemName, gemCounts.getOrDefault(gemName, 0L) + 1);
            
            String zodName = r.getZodiacName();
            zodiacCounts.put(zodName, zodiacCounts.getOrDefault(zodName, 0L) + 1);
            
            // ISO Week mapping
            int year = r.getDate().getYear();
            int week = r.getDate().get(WeekFields.ISO.weekOfWeekBasedYear());
            String weekKey = year + "-W" + week;
            weekly.put(weekKey, weekly.getOrDefault(weekKey, 0L) + 1);
        }
        
        stats.setGemCounts(gemCounts);
        stats.setZodiacCounts(zodiacCounts);
        stats.setWeeklyRecs(weekly);
        
        return stats;
    }
}
