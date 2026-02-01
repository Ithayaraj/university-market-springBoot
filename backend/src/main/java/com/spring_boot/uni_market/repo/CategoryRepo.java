package com.spring_boot.uni_market.repo;

import com.spring_boot.uni_market.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}
