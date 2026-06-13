package com.gemsoul.config;

import com.gemsoul.entity.Gemstone;
import com.gemsoul.repository.GemstoneRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(GemstoneRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                // Insert default gemstones
                repo.save(createGemstone("ruby", "Ruby", "🔴", "images/ruby.png", "#cc2936", "Deep Crimson Red", "Sun & Mars", "fire",
                        Arrays.asList("Aries", "Leo", "Scorpio"),
                        "The Ruby, known as the \"King of Gemstones,\" radiates passion, power, and protection. It ignites the inner fire and amplifies courage.",
                        Arrays.asList("Boosts confidence and courage", "Enhances vitality and energy", "Attracts prosperity and success", "Stimulates the heart chakra"),
                        "Wear on the ring finger of the right hand, set in gold, on a Sunday morning after sunrise.",
                        "Cleanse monthly under running water. Charge under Sunday sunlight for 3 hours.",
                        Arrays.asList("career", "confidence", "wealth")
                ));
                repo.save(createGemstone("emerald", "Emerald", "💚", "images/emerald.png", "#16a34a", "Vivid Forest Green", "Mercury & Venus", "earth",
                        Arrays.asList("Taurus", "Virgo", "Cancer"),
                        "Emerald is the stone of infinite patience and divine love. It opens the heart chakra and brings harmony, wisdom, and abundant growth.",
                        Arrays.asList("Enhances intelligence and memory", "Attracts love and loyalty", "Promotes healing and balance", "Brings financial abundance"),
                        "Set in silver or gold and wear on the little finger of the right hand on a Wednesday morning.",
                        "Wipe gently with a soft cloth. Avoid harsh chemicals. Recharge under moonlight.",
                        Arrays.asList("education", "relationships", "health", "wealth")
                ));
                repo.save(createGemstone("sapphire", "Blue Sapphire", "💙", "images/sapphire.png", "#1e40af", "Royal Midnight Blue", "Saturn", "air",
                        Arrays.asList("Virgo", "Libra", "Capricorn"),
                        "Blue Sapphire is one of the most powerful and fast-acting gemstones. Known as \"Neelam,\" it brings discipline, wisdom, and swift success.",
                        Arrays.asList("Accelerates career growth", "Enhances focus and clarity", "Brings financial discipline", "Protects from negative energy"),
                        "Wear on the middle finger of the right hand, set in silver, on a Saturday evening.",
                        "Clean with mild soap and warm water. Store separately to avoid scratches.",
                        Arrays.asList("career", "education", "wealth")
                ));
                repo.save(createGemstone("amethyst", "Amethyst", "💜", "images/amethyst.png", "#7c3aed", "Ethereal Violet Purple", "Jupiter & Neptune", "air",
                        Arrays.asList("Aquarius", "Pisces", "Sagittarius"),
                        "Amethyst is the stone of spiritual wisdom and inner peace. This royal purple gem calms the mind, enhances intuition, and invites divine insight.",
                        Arrays.asList("Calms anxiety and stress", "Enhances psychic ability", "Promotes restful sleep", "Strengthens intuition"),
                        "Wear on the index finger of either hand. Best worn as a pendant near the heart chakra.",
                        "Cleanse in saltwater monthly. Avoid prolonged sunlight as it may fade the color.",
                        Arrays.asList("health", "education", "confidence")
                ));
                repo.save(createGemstone("pearl", "Pearl", "🤍", "images/pearl.png", "#e2e8f0", "Lustrous Ivory White", "Moon", "water",
                        Arrays.asList("Cancer", "Pisces", "Scorpio"),
                        "Pearl is the gem of the Moon — pure, luminous, and deeply connected to feminine energy, intuition, and emotional healing.",
                        Arrays.asList("Enhances emotional balance", "Strengthens family bonds", "Promotes inner peace", "Boosts confidence in women"),
                        "Wear on the little finger of the right hand, set in silver, on a Monday morning.",
                        "Wipe with a soft damp cloth after wearing. Avoid perfume and chemicals. Store in silk.",
                        Arrays.asList("relationships", "health", "confidence")
                ));
                repo.save(createGemstone("citrine", "Citrine", "🌟", "images/citrine.png", "#d97706", "Warm Golden Amber", "Sun", "fire",
                        Arrays.asList("Leo", "Aries", "Sagittarius"),
                        "Citrine is the \"Merchant's Stone\" — the ultimate crystal of prosperity, joy, and manifestation. It radiates warmth like bottled sunshine.",
                        Arrays.asList("Attracts wealth and prosperity", "Boosts optimism and joy", "Enhances creativity", "Clears negative energy"),
                        "Wear as a ring on the index finger of the right hand. Works powerfully as a bracelet on the left wrist.",
                        "Cleanse under morning sunlight monthly. Avoid extended sun exposure to prevent color fading.",
                        Arrays.asList("wealth", "career", "confidence")
                ));
                repo.save(createGemstone("opal", "Opal", "🌈", "images/opal.png", "#f0f4ff", "Rainbow Iridescent", "Venus", "water",
                        Arrays.asList("Libra", "Cancer", "Pisces"),
                        "Opal is the gem of inspiration and creativity. Its mesmerizing play of colors represents the full spectrum of human emotion and cosmic connection.",
                        Arrays.asList("Ignites creativity and inspiration", "Enhances love and passion", "Amplifies emotional expression", "Attracts good luck"),
                        "Wear on the ring finger set in silver. Best worn during Venus hours (Fridays).",
                        "Keep slightly moist. Avoid extreme temperature changes. Store in a damp cloth.",
                        Arrays.asList("relationships", "career", "confidence")
                ));
                repo.save(createGemstone("garnet", "Garnet", "❤️", "images/garnet.png", "#991b1b", "Deep Burgundy Red", "Mars & Saturn", "earth",
                        Arrays.asList("Capricorn", "Virgo", "Scorpio"),
                        "Garnet is the stone of commitment, passion, and regeneration. It grounds the spirit and fuels ambition with steady, determined energy.",
                        Arrays.asList("Grounds and stabilizes energy", "Boosts physical strength", "Enhances commitment and loyalty", "Promotes career success"),
                        "Wear on the ring or middle finger set in gold. Best activated on a Saturday.",
                        "Clean with warm soapy water. Avoid ultrasonic cleaning. Recharge on black tourmaline.",
                        Arrays.asList("career", "health", "wealth")
                ));
                repo.save(createGemstone("turquoise", "Turquoise", "🩵", "images/turquoise.png", "#0694a2", "Sky Turquoise Blue", "Jupiter", "air",
                        Arrays.asList("Sagittarius", "Pisces", "Aquarius"),
                        "Turquoise is one of the oldest sacred stones, revered across civilizations. It is a master healer that bridges heaven and earth.",
                        Arrays.asList("Enhances communication", "Brings spiritual protection", "Promotes healing and wholeness", "Attracts good fortune in travel"),
                        "Wear set in silver on the index or middle finger. Best worn on Thursdays.",
                        "Avoid water and sweat. Wipe with a dry soft cloth. Store away from other stones.",
                        Arrays.asList("health", "education", "relationships")
                ));
                repo.save(createGemstone("topaz", "Imperial Topaz", "🟡", "images/topaz.png", "#b45309", "Golden Imperial Yellow", "Jupiter & Sun", "fire",
                        Arrays.asList("Scorpio", "Sagittarius", "Leo"),
                        "Imperial Topaz is the stone of royalty and abundance. Its golden fire attracts manifestation, divine favor, and magnificent success.",
                        Arrays.asList("Manifests wealth and abundance", "Boosts leadership qualities", "Enhances confidence and charisma", "Attracts powerful allies"),
                        "Wear on the index finger of the right hand set in gold. Activate on Thursdays at sunrise.",
                        "Clean with mild soapy water and soft brush. Store in a padded box away from hard stones.",
                        Arrays.asList("wealth", "career", "confidence")
                ));
                repo.save(createGemstone("agate", "Blue Lace Agate", "🔵", "images/agate.png", "#60a5fa", "Soft Powder Blue", "Mercury", "air",
                        Arrays.asList("Gemini", "Libra", "Aquarius"),
                        "Blue Lace Agate is the stone of articulation and calm communication. It soothes turbulent emotions and gives voice to inner truth.",
                        Arrays.asList("Enhances communication skills", "Calms anxiety and stress", "Promotes clear thinking", "Supports throat chakra"),
                        "Wear as a pendant near the throat chakra or on the index finger. Best on Wednesdays.",
                        "Rinse in cool water. Charge under the light of a full moon for heightened effect.",
                        Arrays.asList("education", "relationships", "health")
                ));
                repo.save(createGemstone("aquamarine", "Aquamarine", "🩵", "images/aquamarine.png", "#22d3ee", "Crystal Sea Blue-Green", "Neptune & Moon", "water",
                        Arrays.asList("Pisces", "Cancer", "Gemini"),
                        "Aquamarine is the stone of the sea — tranquil, purifying, and deeply connected to the flow of life. It calms the mind and clarifies perception.",
                        Arrays.asList("Enhances clarity of thought", "Promotes emotional healing", "Strengthens courage", "Harmonizes relationships"),
                        "Wear set in silver on the middle finger. Charge by placing it near natural water bodies.",
                        "Clean in lukewarm soapy water. Avoid harsh ultrasonic cleaners. Recharge under a full moon.",
                        Arrays.asList("relationships", "health", "education")
                ));
            }
        };
    }

    private Gemstone createGemstone(String id, String name, String emoji, String image, String color, String colorName,
                                    String planet, String element, java.util.List<String> zodiacs, String description,
                                    java.util.List<String> benefits, String wearing, String care, java.util.List<String> purposes) {
        Gemstone g = new Gemstone();
        g.setId(id);
        g.setName(name);
        g.setEmoji(emoji);
        g.setImage(image);
        g.setColor(color);
        g.setColorName(colorName);
        g.setPlanet(planet);
        g.setElement(element);
        g.setZodiacSigns(zodiacs);
        g.setDescription(description);
        g.setBenefits(benefits);
        g.setWearingInstructions(wearing);
        g.setCareInstructions(care);
        g.setPurpose(purposes);
        return g;
    }
}
