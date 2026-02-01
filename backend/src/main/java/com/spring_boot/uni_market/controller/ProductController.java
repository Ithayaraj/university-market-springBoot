package com.spring_boot.uni_market.controller;

import com.spring_boot.uni_market.dto.ProductDTO;
import com.spring_boot.uni_market.service.ProductService;
import com.spring_boot.uni_market.utils.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<StandardResponse> addProduct(@RequestBody ProductDTO dto) {
        String res = productService.addProduct(dto);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 201),
                HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<StandardResponse> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return new ResponseEntity<>(
                new StandardResponse("success", "Products Retrieved", products, 200),
                HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<StandardResponse> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDTO> products = productService.getProductsByCategory(categoryId);
        return new ResponseEntity<>(
                new StandardResponse("success", "Products Retrieved", products, 200),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return new ResponseEntity<>(
                new StandardResponse("success", "Product Retrieved", product, 200),
                HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<StandardResponse> deleteProduct(@PathVariable Long id) {
        String res = productService.deleteProduct(id);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 200),
                HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<StandardResponse> updateProduct(@RequestBody ProductDTO dto) {
        String res = productService.updateProduct(dto);
        return new ResponseEntity<>(
                new StandardResponse("success", res, null, 200),
                HttpStatus.OK);
    }
}
