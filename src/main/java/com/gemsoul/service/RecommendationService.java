package com.gemsoul.service;

import com.gemsoul.dto.RecommendationRequest;
import com.gemsoul.dto.RecommendationResponse;
import com.gemsoul.dto.ZodiacResponse;
import com.gemsoul.entity.Gemstone;
import com.gemsoul.entity.Recommendation;
import com.gemsoul.entity.User;
import com.gemsoul.repository.GemstoneRepository;
import com.gemsoul.repository.RecommendationRepository;
import com.gemsoul.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RecommendationService {

    @Autowired
    private ZodiacService zodiacService;

    @Autowired
    private GemstoneRepository gemstoneRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Map<String, List<String>> PURPOSE_GEM_AFFINITY = new HashMap<>();
    private static final Map<String, String> ZODIAC_GEMSTONE_MAP = new HashMap<>();

    static {
        PURPOSE_GEM_AFFINITY.put("career", Arrays.asList("ruby", "sapphire", "citrine", "topaz", "garnet"));
        PURPOSE_GEM_AFFINITY.put("wealth", Arrays.asList("citrine", "ruby", "topaz", "emerald", "sapphire"));
        PURPOSE_GEM_AFFINITY.put("education", Arrays.asList("emerald", "sapphire", "amethyst", "agate", "turquoise"));
        PURPOSE_GEM_AFFINITY.put("relationships", Arrays.asList("emerald", "pearl", "opal", "aquamarine", "agate"));
        PURPOSE_GEM_AFFINITY.put("health", Arrays.asList("pearl", "turquoise", "amethyst", "aquamarine", "garnet"));
        PURPOSE_GEM_AFFINITY.put("confidence", Arrays.asList("ruby", "citrine", "topaz", "amethyst", "opal"));

        ZODIAC_GEMSTONE_MAP.put("Aries", "ruby");
        ZODIAC_GEMSTONE_MAP.put("Taurus", "emerald");
        ZODIAC_GEMSTONE_MAP.put("Gemini", "agate");
        ZODIAC_GEMSTONE_MAP.put("Cancer", "pearl");
        ZODIAC_GEMSTONE_MAP.put("Leo", "citrine");
        ZODIAC_GEMSTONE_MAP.put("Virgo", "sapphire");
        ZODIAC_GEMSTONE_MAP.put("Libra", "opal");
        ZODIAC_GEMSTONE_MAP.put("Scorpio", "topaz");
        ZODIAC_GEMSTONE_MAP.put("Sagittarius", "turquoise");
        ZODIAC_GEMSTONE_MAP.put("Capricorn", "garnet");
        ZODIAC_GEMSTONE_MAP.put("Aquarius", "amethyst");
        ZODIAC_GEMSTONE_MAP.put("Pisces", "aquamarine");
    }

    public RecommendationResponse createRecommendation(RecommendationRequest request) {
        ZodiacResponse zodiac = zodiacService.getZodiacFromDate(request.getDob());
        
        List<Gemstone> allGems = gemstoneRepository.findAll();
        Gemstone recommendedGem = getBestGemstone(zodiac.getName(), request.getPurpose(), allGems);
        
        RecommendationResponse.Scores scores = calculateMatchScore(zodiac, request.getPurpose(), recommendedGem);

        User user = userRepository.findByEmail(request.getEmail())
            .orElseGet(() -> {
                User u = new User();
                u.setName(request.getName());
                u.setEmail(request.getEmail());
                return userRepository.save(u);
            });

        Recommendation rec = new Recommendation();
        rec.setUser(user);
        rec.setDob(request.getDob());
        rec.setPurpose(request.getPurpose());
        rec.setZodiacName(zodiac.getName());
        rec.setZodiacSymbol(zodiac.getSymbol());
        rec.setGemstone(recommendedGem);
        rec.setDate(LocalDateTime.now());
        rec.setOverallScore(scores.getOverall());
        rec.setZodiacMatchScore(scores.getZodiacMatch());
        rec.setElementMatchScore(scores.getElementMatch());
        rec.setPurposeMatchScore(scores.getPurposeMatch());
        
        recommendationRepository.save(rec);

        return buildResponse(rec, scores);
    }

    public List<RecommendationResponse> getAllRecommendations() {
        return recommendationRepository.findAllByOrderByDateDesc().stream().map(rec -> {
            RecommendationResponse.Scores scores = new RecommendationResponse.Scores(
                rec.getOverallScore(), rec.getZodiacMatchScore(), rec.getElementMatchScore(), rec.getPurposeMatchScore()
            );
            return buildResponse(rec, scores);
        }).toList();
    }

    private Gemstone getBestGemstone(String zodiacName, String purpose, List<Gemstone> allGems) {
        String zodiacGemId = ZODIAC_GEMSTONE_MAP.get(zodiacName);
        List<String> purposeGems = PURPOSE_GEM_AFFINITY.getOrDefault(purpose, Collections.emptyList());

        String bestId = zodiacGemId;
        int bestScore = 0;

        for (Gemstone gem : allGems) {
            int score = 0;
            if (gem.getId().equals(zodiacGemId)) score += 40;
            if (purposeGems.contains(gem.getId())) score += 35 - purposeGems.indexOf(gem.getId()) * 5;
            if (gem.getZodiacSigns().contains(zodiacName)) score += 25;
            
            if (score > bestScore) {
                bestScore = score;
                bestId = gem.getId();
            }
        }
        
        String finalId = bestId;
        return allGems.stream().filter(g -> g.getId().equals(finalId)).findFirst().orElse(allGems.get(0));
    }

    private RecommendationResponse.Scores calculateMatchScore(ZodiacResponse zodiac, String purpose, Gemstone gemstone) {
        int zodiacMatch = gemstone.getZodiacSigns().contains(zodiac.getName()) ? 95 : 78;
        int elementMatch = (gemstone.getElement().equalsIgnoreCase(zodiac.getElement())) ? 92 : 75;
        
        List<String> purposeGems = PURPOSE_GEM_AFFINITY.getOrDefault(purpose, Collections.emptyList());
        int purposeIdx = purposeGems.indexOf(gemstone.getId());
        int purposeMatch = purposeIdx >= 0 ? Math.max(90 - purposeIdx * 5, 70) : 65;
        
        int overall = (int) Math.round((zodiacMatch * 0.4) + (elementMatch * 0.3) + (purposeMatch * 0.3));
        
        return new RecommendationResponse.Scores(overall, zodiacMatch, elementMatch, purposeMatch);
    }

    private RecommendationResponse buildResponse(Recommendation rec, RecommendationResponse.Scores scores) {
        RecommendationResponse res = new RecommendationResponse();
        res.setId(rec.getId());
        res.setDate(rec.getDate());
        res.setName(rec.getUser().getName());
        res.setEmail(rec.getUser().getEmail());
        res.setDob(rec.getDob());
        res.setPurpose(rec.getPurpose());
        res.setZodiacName(rec.getZodiacName());
        res.setZodiacSymbol(rec.getZodiacSymbol());
        res.setGemstoneId(rec.getGemstone().getId());
        res.setGemstoneName(rec.getGemstone().getName());
        res.setScores(scores);
        return res;
    }
}
