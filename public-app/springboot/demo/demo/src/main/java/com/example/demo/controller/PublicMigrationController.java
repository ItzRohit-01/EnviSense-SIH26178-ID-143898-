package com.example.demo.controller;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;
import com.example.demo.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/migrate")
public class PublicMigrationController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    public PublicMigrationController(ProductService productService, CloudinaryService cloudinaryService) {
        this.productService = productService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/images")
    public ResponseEntity<String> migrateImages() {
        List<Product> products = productService.getAllProducts();
        int migrated = 0;
        int failed = 0;

        for (Product p : products) {
            String img = p.getImageUrl();
            if (img != null && !img.trim().isEmpty() && (img.contains("localhost") || !img.startsWith("http"))) {
                // Extract just the filename if it's a localhost URL
                String fileName = img;
                if (img.contains("/uploads/")) {
                    fileName = img.substring(img.lastIndexOf("/") + 1);
                }
                
                java.io.File localFile = new java.io.File("C:/uploads/" + fileName);
                if (localFile.exists()) {
                    try {
                        String newUrl = cloudinaryService.uploadImage(localFile);
                        productService.updateProductImage(p.getId(), newUrl);
                        migrated++;
                    } catch(Exception e) {
                        failed++;
                    }
                } else {
                    failed++;
                }
            }
        }
        return ResponseEntity.ok("Successfully migrated: " + migrated + " images. Failed or not found: " + failed);
    }
}
