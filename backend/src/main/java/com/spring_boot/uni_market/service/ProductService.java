package com.spring_boot.uni_market.service;

import com.spring_boot.uni_market.dto.ProductDTO;
import com.spring_boot.uni_market.entity.Category;
import com.spring_boot.uni_market.entity.Product;
import com.spring_boot.uni_market.entity.ProductImage;
import com.spring_boot.uni_market.entity.User;
import com.spring_boot.uni_market.enums.ProductStatus;
import com.spring_boot.uni_market.repo.CategoryRepo;
import com.spring_boot.uni_market.repo.ProductImageRepo;
import com.spring_boot.uni_market.repo.ProductRepo;
import com.spring_boot.uni_market.repo.UserProfileRepo;
import com.spring_boot.uni_market.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    private ProductImageRepo productImageRepo;
    @Autowired
    private UserProfileRepo userProfileRepo;

    public String addProduct(ProductDTO dto) {
        System.out.println("Adding Product: " + dto);

        if (dto.getSellerId() == null) {
            throw new RuntimeException("Seller ID cannot be null");
        }
        if (dto.getCategoryId() == null) {
            throw new RuntimeException("Category ID cannot be null");
        }

        User seller = userRepo.findById(dto.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found with ID: " + dto.getSellerId()));
        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + dto.getCategoryId()));

        Product product = new Product();
        product.setSeller(seller);
        product.setCategory(category);
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCondition(dto.getCondition());
        product.setLocation(dto.getLocation());
        product.setStatus(ProductStatus.AVAILABLE);

        Product savedProduct = productRepo.save(product);

        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            boolean isFirst = true;
            for (String url : dto.getImageUrls()) {
                ProductImage image = new ProductImage();
                image.setProduct(savedProduct);
                image.setImageUrl(url);
                image.setPrimary(isFirst);
                productImageRepo.save(image);
                isFirst = false;
            }
        }
        return "Product Added Successfully";
    }

    public List<ProductDTO> getAllProducts() {
        return productRepo.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepo.findByCategory_CategoryId(categoryId).stream().map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    public String deleteProduct(Long productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepo.delete(product);
        return "Product Deleted Successfully";
    }

    public String updateProduct(ProductDTO dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Basic fields update
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCondition(dto.getCondition());
        product.setLocation(dto.getLocation());
        product.setContactPhone(dto.getContactPhone());

        // Category update if changed
        if (!product.getCategory().getCategoryId().equals(dto.getCategoryId())) {
            Category category = categoryRepo.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        productRepo.save(product);
        return "Product Updated Successfully";
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setSellerId(product.getSeller().getUserId());
        dto.setCategoryId(product.getCategory().getCategoryId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCondition(product.getCondition());
        dto.setLocation(product.getLocation());

        // Get phone and name from UserProfile instead of Product entity
        userProfileRepo.findByUser(product.getSeller()).ifPresent(profile -> {
            dto.setContactPhone(profile.getPhone());
            dto.setSellerName(profile.getFullName());
        });

        List<ProductImage> images = productImageRepo.findByProduct(product);
        List<String> imageUrls = images.stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
        dto.setImageUrls(imageUrls);
        dto.setCreatedAt(product.getCreatedAt());

        return dto;
    }
}
