package com.gemsoul.dto;

import lombok.Data;
import java.util.Map;

@Data
public class AdminStatsResponse {
    private long totalRecs;
    private Map<String, Long> weeklyRecs;
    private Map<String, Long> gemCounts;
    private Map<String, Long> zodiacCounts;
}
