package com.spring_boot.uni_market.repo;

import com.spring_boot.uni_market.entity.Product;
import com.spring_boot.uni_market.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    List<Product> findBySeller(User seller);

    List<Product> findByCategory_CategoryId(Long categoryId);
}
