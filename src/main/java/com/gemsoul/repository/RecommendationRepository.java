package com.gemsoul.repository;

import com.gemsoul.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findAllByOrderByDateDesc();
    List<Recommendation> findByDateAfter(LocalDateTime date);
}
