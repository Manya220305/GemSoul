package com.gemsoul.dto;

import com.gemsoul.entity.Gemstone;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RecommendationResponse {
    private Long id;
    private LocalDateTime date;
    private String name;
    private String email;
    private String dob;
    private String purpose;
    private String zodiacName;
    private String zodiacSymbol;
    private String gemstoneId;
    private String gemstoneName;
    private Scores scores;
    
    @Data
    @AllArgsConstructor
    public static class Scores {
        private Integer overall;
        private Integer zodiacMatch;
        private Integer elementMatch;
        private Integer purposeMatch;
    }
}
