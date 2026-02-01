package com.spring_boot.uni_market.config;

import com.spring_boot.uni_market.entity.Category;
import com.spring_boot.uni_market.repo.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepo categoryRepo;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepo.count() == 0) {
            List<Category> categories = Arrays.asList(
                    createCategory(1L, "Books"),
                    createCategory(2L, "Electronics"),
                    createCategory(3L, "Clothing"),
                    createCategory(4L, "Sports"),
                    createCategory(5L, "Furniture"),
                    createCategory(6L, "Other"));
            categoryRepo.saveAll(categories);
            System.out.println("✅ Initial Categories Seeded");
        }
    }

    private Category createCategory(Long id, String name) {
        Category category = new Category();
        // Do not set ID manually for IDENTITY generation strategy
        category.setName(name);
        return category;
    }
}
