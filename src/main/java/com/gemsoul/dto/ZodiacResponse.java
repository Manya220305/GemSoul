package com.gemsoul.dto;

import lombok.Data;
import java.util.List;

@Data
public class ZodiacResponse {
    private String name;
    private String symbol;
    private String emoji;
    private String dateRange;
    private String element;
    private String elementEmoji;
    private String planet;
    private List<String> traits;
    private List<String> strengths;
    private List<String> weaknesses;
    private String description;
    private List<String> luckyColors;
    private String gemstone;
    private String color;
    private String wheelColor;
    private Integer angle;
}
