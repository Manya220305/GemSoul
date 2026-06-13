package com.gemsoul.repository;

import com.gemsoul.entity.Gemstone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GemstoneRepository extends JpaRepository<Gemstone, String> {
}
