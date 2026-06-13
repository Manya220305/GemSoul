package com.gemsoul.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Data
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String dob;
    private String purpose;

    private String zodiacName;
    private String zodiacSymbol;

    @ManyToOne
    @JoinColumn(name = "gemstone_id")
    private Gemstone gemstone;

    private Integer overallScore;
    private Integer zodiacMatchScore;
    private Integer elementMatchScore;
    private Integer purposeMatchScore;
}
