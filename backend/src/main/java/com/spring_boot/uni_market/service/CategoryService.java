package com.spring_boot.uni_market.service;

import com.spring_boot.uni_market.dto.CategoryDTO;
import com.spring_boot.uni_market.entity.Category;
import com.spring_boot.uni_market.repo.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    public String createCategory(CategoryDTO dto) {
        if (categoryRepo.existsByName(dto.getName())) {
            throw new RuntimeException("Category already exists");
        }
        Category category = new Category();
        category.setName(dto.getName());
        if (dto.getParentId() != null) {
            Category parent = categoryRepo.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent Category not found"));
            category.setParent(parent);
        }
        categoryRepo.save(category);
        return "Category Created Successfully";
    }

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }
}
