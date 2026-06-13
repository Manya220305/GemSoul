package com.gemsoul.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "gemstones")
@Data
public class Gemstone {
    @Id
    private String id; // e.g., 'ruby', 'emerald'

    private String name;
    private String emoji;
    private String image;
    private String color;
    private String colorName;
    private String planet;
    private String element;
    
    @ElementCollection
    @CollectionTable(name="gemstone_zodiac_signs", joinColumns=@JoinColumn(name="gemstone_id"))
    @Column(name="sign")
    private List<String> zodiacSigns;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name="gemstone_benefits", joinColumns=@JoinColumn(name="gemstone_id"))
    @Column(name="benefit")
    private List<String> benefits;

    @Column(columnDefinition = "TEXT")
    private String wearingInstructions;

    @Column(columnDefinition = "TEXT")
    private String careInstructions;

    @ElementCollection
    @CollectionTable(name="gemstone_purposes", joinColumns=@JoinColumn(name="gemstone_id"))
    @Column(name="purpose")
    private List<String> purpose;
}
