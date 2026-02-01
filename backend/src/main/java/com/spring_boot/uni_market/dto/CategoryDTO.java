package com.spring_boot.uni_market.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long categoryId;
    private String name;
    private Long parentId;
}
