package com.spring_boot.uni_market.repo;

import com.spring_boot.uni_market.entity.ProductImage;
import com.spring_boot.uni_market.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepo extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProduct(Product product);
}
