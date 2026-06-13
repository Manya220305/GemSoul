package com.gemsoul.service;

import com.gemsoul.dto.ZodiacResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class ZodiacService {

    private static class ZodiacDef {
        int startMonth, startDay, endMonth, endDay;
        ZodiacResponse response;
        public ZodiacDef(int sm, int sd, int em, int ed, ZodiacResponse r) {
            this.startMonth = sm; this.startDay = sd; this.endMonth = em; this.endDay = ed; this.response = r;
        }
    }

    private final List<ZodiacDef> zodiacData = Arrays.asList(
        new ZodiacDef(3, 21, 4, 19, createZodiac("Aries", "♈", "🐏", "Mar 21 – Apr 19", "Fire", "🔥", "Mars", 
            Arrays.asList("Bold", "Courageous", "Energetic", "Impulsive"), 
            Arrays.asList("Courageous", "Determined", "Confident", "Leadership"), 
            Arrays.asList("Impatient", "Aggressive", "Impulsive", "Moody"), 
            "Aries is the first sign of the zodiac, representing new beginnings and raw energy. Arians are natural-born leaders with an unstoppable drive.", 
            Arrays.asList("#e53e3e", "#ed8936", "#f6e05e"), "Ruby", "#cc1a1a", "#e53e3e", 90)),
        new ZodiacDef(4, 20, 5, 20, createZodiac("Taurus", "♉", "🐂", "Apr 20 – May 20", "Earth", "🌿", "Venus",
            Arrays.asList("Reliable", "Patient", "Practical", "Devoted"),
            Arrays.asList("Reliable", "Patient", "Devoted", "Responsible"),
            Arrays.asList("Stubborn", "Possessive", "Materialistic", "Uncompromising"),
            "Taurus values security, beauty, and comfort. Steadfast and dependable, they bring stability and grace wherever they go.",
            Arrays.asList("#38a169", "#48bb78", "#9ae6b4"), "Emerald", "#16a34a", "#38a169", 120)),
        new ZodiacDef(5, 21, 6, 20, createZodiac("Gemini", "♊", "👯", "May 21 – Jun 20", "Air", "💨", "Mercury",
            Arrays.asList("Curious", "Versatile", "Witty", "Communicative"),
            Arrays.asList("Adaptable", "Outgoing", "Intelligent", "Communicative"),
            Arrays.asList("Inconsistent", "Superficial", "Indecisive", "Nosy"),
            "Gemini is the sign of duality and intellectual curiosity. Quick-witted and adaptable, they can see both sides of every story.",
            Arrays.asList("#ecc94b", "#f6e05e", "#bee3f8"), "Agate", "#d4a017", "#ecc94b", 150)),
        new ZodiacDef(6, 21, 7, 22, createZodiac("Cancer", "♋", "🦀", "Jun 21 – Jul 22", "Water", "💧", "Moon",
            Arrays.asList("Nurturing", "Intuitive", "Loyal", "Protective"),
            Arrays.asList("Tenacious", "Loyal", "Intuitive", "Sympathetic"),
            Arrays.asList("Moody", "Pessimistic", "Suspicious", "Manipulative"),
            "Cancer is deeply intuitive and sentimental. They are the great caretakers of the zodiac, with a strong sense of home and family.",
            Arrays.asList("#90cdf4", "#bee3f8", "#e9d8fd"), "Pearl", "#90cdf4", "#4299e1", 180)),
        new ZodiacDef(7, 23, 8, 22, createZodiac("Leo", "♌", "🦁", "Jul 23 – Aug 22", "Fire", "🔥", "Sun",
            Arrays.asList("Confident", "Creative", "Leader", "Dramatic"),
            Arrays.asList("Creative", "Passionate", "Generous", "Humorous"),
            Arrays.asList("Arrogant", "Stubborn", "Self-centered", "Inflexible"),
            "Leo is the royalty of the zodiac — bold, dramatic, and magnetic. They command every room they enter and inspire greatness in others.",
            Arrays.asList("#f6ad55", "#ed8936", "#fbd38d"), "Peridot", "#ed8936", "#ed8936", 210)),
        new ZodiacDef(8, 23, 9, 22, createZodiac("Virgo", "♍", "👰", "Aug 23 – Sep 22", "Earth", "🌿", "Mercury",
            Arrays.asList("Analytical", "Precise", "Helpful", "Diligent"),
            Arrays.asList("Loyal", "Analytical", "Kind", "Hardworking"),
            Arrays.asList("Critical", "Perfectionist", "Overthinking", "Worry-prone"),
            "Virgo seeks perfection through careful analysis and practical service. Their attention to detail and dedication makes them invaluable.",
            Arrays.asList("#68d391", "#9ae6b4", "#f0fff4"), "Sapphire", "#2b6cb0", "#68d391", 240)),
        new ZodiacDef(9, 23, 10, 22, createZodiac("Libra", "♎", "⚖️", "Sep 23 – Oct 22", "Air", "💨", "Venus",
            Arrays.asList("Balanced", "Diplomatic", "Gracious", "Social"),
            Arrays.asList("Diplomatic", "Gracious", "Fair-minded", "Social"),
            Arrays.asList("Indecisive", "Avoidant", "Self-pitying", "Grudge-holding"),
            "Libra seeks balance, beauty, and justice. They are natural diplomats who strive for harmony in all aspects of life.",
            Arrays.asList("#f687b3", "#fbb6ce", "#bee3f8"), "Opal", "#d53f8c", "#f687b3", 270)),
        new ZodiacDef(10, 23, 11, 21, createZodiac("Scorpio", "♏", "🦂", "Oct 23 – Nov 21", "Water", "💧", "Pluto",
            Arrays.asList("Intense", "Mysterious", "Passionate", "Perceptive"),
            Arrays.asList("Resourceful", "Brave", "Passionate", "Loyal"),
            Arrays.asList("Distrustful", "Jealous", "Secretive", "Violent"),
            "Scorpio is the sign of transformation and depth. Their magnetic intensity and keen perception pierce through every illusion.",
            Arrays.asList("#702459", "#b7791f", "#1a202c"), "Topaz", "#702459", "#9b2335", 300)),
        new ZodiacDef(11, 22, 12, 21, createZodiac("Sagittarius", "♐", "🏹", "Nov 22 – Dec 21", "Fire", "🔥", "Jupiter",
            Arrays.asList("Adventurous", "Optimistic", "Honest", "Philosophical"),
            Arrays.asList("Generous", "Idealistic", "Great sense of humor", "Adventurous"),
            Arrays.asList("Promises more than delivers", "Impatient", "Tactless", "Restless"),
            "Sagittarius is the eternal seeker — chasing wisdom, adventure, and freedom across all of life's horizons.",
            Arrays.asList("#f6ad55", "#63b3ed", "#48bb78"), "Turquoise", "#0694a2", "#f6ad55", 330)),
        new ZodiacDef(12, 22, 1, 19, createZodiac("Capricorn", "♑", "🐐", "Dec 22 – Jan 19", "Earth", "🌿", "Saturn",
            Arrays.asList("Disciplined", "Responsible", "Ambitious", "Practical"),
            Arrays.asList("Responsible", "Disciplined", "Self-control", "Managerial"),
            Arrays.asList("Know-it-all", "Unforgiving", "Condescending", "Pessimistic"),
            "Capricorn is the master builder of the zodiac. Their discipline and ambition allow them to climb any mountain and achieve lasting success.",
            Arrays.asList("#718096", "#4a5568", "#2d3748"), "Garnet", "#742a2a", "#718096", 0)),
        new ZodiacDef(1, 20, 2, 18, createZodiac("Aquarius", "♒", "🏺", "Jan 20 – Feb 18", "Air", "💨", "Uranus",
            Arrays.asList("Progressive", "Original", "Humanitarian", "Independent"),
            Arrays.asList("Progressive", "Original", "Humanitarian", "Intellectual"),
            Arrays.asList("Runs from emotions", "Temperamental", "Uncompromising", "Aloof"),
            "Aquarius is the visionary rebel — unconventional, forward-thinking, and deeply committed to the betterment of humanity.",
            Arrays.asList("#63b3ed", "#90cdf4", "#bee3f8"), "Amethyst", "#6b46c1", "#63b3ed", 30)),
        new ZodiacDef(2, 19, 3, 20, createZodiac("Pisces", "♓", "🐟", "Feb 19 – Mar 20", "Water", "💧", "Neptune",
            Arrays.asList("Empathetic", "Artistic", "Gentle", "Wise"),
            Arrays.asList("Compassionate", "Artistic", "Intuitive", "Gentle"),
            Arrays.asList("Fearful", "Overly trusting", "Escapist", "Victim tendency"),
            "Pisces is the dreamer of the zodiac — compassionate, mystical, and deeply connected to the spiritual realm and universal love.",
            Arrays.asList("#9f7aea", "#b794f4", "#e9d8fd"), "Aquamarine", "#319795", "#9f7aea", 60))
    );

    public ZodiacResponse getZodiacFromDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) return null;
        try {
            LocalDate date = LocalDate.parse(dateStr);
            int month = date.getMonthValue();
            int day = date.getDayOfMonth();
            
            for (ZodiacDef z : zodiacData) {
                if (z.startMonth == 12 && z.endMonth == 1) {
                    if ((month == 12 && day >= z.startDay) || (month == 1 && day <= z.endDay)) {
                        return z.response;
                    }
                } else {
                    if ((month == z.startMonth && day >= z.startDay) || (month == z.endMonth && day <= z.endDay)) {
                        return z.response;
                    }
                }
            }
        } catch (Exception e) {}
        return zodiacData.get(0).response;
    }

    public ZodiacResponse getZodiacByName(String name) {
        for (ZodiacDef z : zodiacData) {
            if (z.response.getName().equalsIgnoreCase(name)) {
                return z.response;
            }
        }
        return null;
    }
    
    private ZodiacResponse createZodiac(String name, String symbol, String emoji, String dateRange, 
        String element, String elementEmoji, String planet, List<String> traits, 
        List<String> strengths, List<String> weaknesses, String description, 
        List<String> luckyColors, String gemstone, String color, String wheelColor, Integer angle) {
        ZodiacResponse z = new ZodiacResponse();
        z.setName(name); z.setSymbol(symbol); z.setEmoji(emoji); z.setDateRange(dateRange);
        z.setElement(element); z.setElementEmoji(elementEmoji); z.setPlanet(planet);
        z.setTraits(traits); z.setStrengths(strengths); z.setWeaknesses(weaknesses);
        z.setDescription(description); z.setLuckyColors(luckyColors); z.setGemstone(gemstone);
        z.setColor(color); z.setWheelColor(wheelColor); z.setAngle(angle);
        return z;
    }
}
