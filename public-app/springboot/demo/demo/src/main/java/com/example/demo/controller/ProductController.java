package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Product;
import com.example.demo.service.ProductService;

import java.io.File;
import java.io.IOException;

@RestController
//@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // =====================
    // GET ALL PRODUCTS (ADMIN)
    // =====================
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // =====================
    // GET AVAILABLE PRODUCTS (USER)
    // =====================
    @GetMapping
    public List<Product> getAvailableProducts() {
        return productService.getAvailableProducts();
    }

    // =====================
    // GET PRODUCT BY ID
    // =====================
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    @GetMapping("/category/{id}")
public List<Product> getByCategory(@PathVariable Long id) {
    return productService.getProductsByCategory(id);
}

    // =====================
    // ADD PRODUCT (WITHOUT IMAGE)
    // =====================
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product, @RequestParam Long categoryId,@RequestParam Long userId) {
        try {
            Product saved = productService.addProduct(product, categoryId,userId);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =====================
    // ADD PRODUCT WITH IMAGE (FIXED)
    // =====================
    @PostMapping("/add-with-image")
    public ResponseEntity<?> addProductWithImage(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam int stock,
            @RequestParam Long categoryId,
            @RequestParam Long userId,
            @RequestParam String createdBy,
            @RequestParam("image") MultipartFile image
    ) {

        try {

            // 🔥 FIXED PATH (project directory)
            String uploadDir = "C:/uploads/";

            File folder = new File(uploadDir);

            // 🔥 auto-create folder if not exists
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // 📄 file name
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            String filePath = uploadDir + fileName;

            // 💾 save file
            image.transferTo(new File(filePath));

            // 🌐 image URL
            String imageUrl = "http://localhost:8080/uploads/" + fileName;

            // 📦 create product
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);
            product.setCreatedBy(createdBy);
            product.setImageUrl(imageUrl);

            Product saved = productService.addProduct(product, categoryId,userId);

            return ResponseEntity.status(201).body(saved);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Image upload failed: " + e.getMessage());
        }
    }



    @PutMapping("/{id}/image")
public ResponseEntity<?> updateProductImage(
        @PathVariable Long id,
        @RequestParam("image") MultipartFile image
) {
    try {
        String uploadDir = "C:/uploads/";

        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        String filePath = uploadDir + fileName;

        image.transferTo(new File(filePath));

        String imageUrl = "http://localhost:8080/uploads/" + fileName;

        Product updatedProduct = productService.updateProductImage(id, imageUrl);

        return ResponseEntity.ok(updatedProduct);

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
    // =====================
    // UPDATE PRODUCT
    // =====================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =====================
    // DELETE PRODUCT
    // =====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.deleteProduct(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // =====================
    // LOW STOCK
    // =====================
    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productService.getLowStockProducts();
    }

    // =====================
    // REDUCE STOCK
    // =====================
    @PostMapping("/{id}/reduce-stock")
    public ResponseEntity<?> reduceStock(@PathVariable Long id, @RequestParam int quantity) {
        try {
            productService.reduceStock(id, quantity);
            return ResponseEntity.ok("Stock reduced successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =====================
    // INCREASE STOCK
    // =====================
    @PostMapping("/{id}/increase-stock")
    public ResponseEntity<?> increaseStock(@PathVariable Long id, @RequestParam int quantity) {
        try {
            productService.increaseStock(id, quantity);
            return ResponseEntity.ok("Stock increased successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // =====================
    // UPDATE RATING
    // =====================
    @PostMapping("/{id}/update-rating")
    public ResponseEntity<?> updateRating(@PathVariable Long id) {
        try {
            productService.updateProductRating(id);
            return ResponseEntity.ok("Rating updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}