package com.spring_boot.uni_market.dto;

import com.spring_boot.uni_market.enums.ProductCondition;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {
    private Long productId;
    private Long sellerId;
    private Long categoryId;
    private String title;
    private String description;
    private BigDecimal price;
    private ProductCondition condition;
    private String location;
    private String contactPhone;
    private String sellerName;
    private String categoryName;
    private List<String> imageUrls;
    private java.time.LocalDateTime createdAt;
}
