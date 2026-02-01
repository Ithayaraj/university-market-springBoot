package com.spring_boot.uni_market.controller;

import com.spring_boot.uni_market.dto.CategoryDTO;
import com.spring_boot.uni_market.entity.Category;
import com.spring_boot.uni_market.service.CategoryService;
import com.spring_boot.uni_market.utils.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<StandardResponse> createCategory(@RequestBody CategoryDTO dto) {
        String res = categoryService.createCategory(dto);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 201),
                HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<StandardResponse> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(
                new StandardResponse("success", "Categories Retrieved", categories, 200),
                HttpStatus.OK);
    }
}
