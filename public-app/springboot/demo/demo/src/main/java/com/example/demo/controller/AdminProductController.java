package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.config.JwtUtil;
import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

import jakarta.servlet.http.HttpServletRequest;

import com.example.demo.service.CloudinaryService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails; // adjust package if different

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;
    private final JwtUtil jwtUtil;

    public AdminProductController(ProductService productService,
                                 CloudinaryService cloudinaryService,
                                 JwtUtil jwtUtil) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
        this.jwtUtil = jwtUtil;
    }

    // =====================
    // ADD PRODUCT
    // =====================
@PostMapping
public ResponseEntity<?> addProduct(
        @RequestBody Product product,
        @RequestParam Long categoryId,
        HttpServletRequest request
) {

    String header = request.getHeader("Authorization");
    String token = header.substring(7);

    Long userId = jwtUtil.extractUserId(token); // ✅ from token

    product.setCreatedBy(String.valueOf(userId));

    return ResponseEntity.ok(
            productService.addProduct(product, categoryId, userId)
    );
}

    // =====================
    // UPDATE PRODUCT
    // =====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {
        return ResponseEntity.ok(
                productService.updateProduct(id, product)
        );
    }

    // =====================
    // DELETE PRODUCT
    // =====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(
                productService.deleteProduct(id)
        );
    }

    // =====================
    // GET ALL PRODUCTS (ADMIN)
    // =====================
    @GetMapping
    public List<Product> getAllProductsAdmin() {
        return productService.getAllProducts();
    }

    // =====================
    // UPLOAD IMAGE (CLOUDINARY)
    // =====================
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = cloudinaryService.uploadImage(file);
        return ResponseEntity.ok(imageUrl);
    }

    // =====================
    // MIGRATE OLD LOCAL IMAGES TO CLOUDINARY
    // =====================
    @PostMapping("/migrate-images")
    public ResponseEntity<String> migrateImages() {
        List<Product> products = productService.getAllProducts();
        int migrated = 0;
        int failed = 0;

        for (Product p : products) {
            String img = p.getImageUrl();
            // If the image is not a web URL (Cloudinary usually starts with http)
            if (img != null && !img.trim().isEmpty() && !img.startsWith("http")) {
                // It was stored locally in C:/uploads/
                java.io.File localFile = new java.io.File("C:/uploads/" + img);
                
                if (localFile.exists()) {
                    try {
                        String newUrl = cloudinaryService.uploadImage(localFile);
                        productService.updateProductImage(p.getId(), newUrl);
                        migrated++;
                    } catch(Exception e) {
                        failed++;
                    }
                } else {
                    failed++; // File not found on this computer
                }
            }
        }
        return ResponseEntity.ok("Successfully migrated: " + migrated + " images. Failed or not found: " + failed);
    }
}