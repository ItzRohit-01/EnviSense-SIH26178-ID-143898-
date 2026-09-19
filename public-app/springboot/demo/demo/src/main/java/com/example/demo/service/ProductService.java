package com.example.demo.service;
import java.util.Objects;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.model.Review;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ReviewRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
    }

    // =====================
    // ADD PRODUCT (ADMIN) ✅ FIXED
    // =====================
    public Product addProduct(Product product, Long categoryId,Long userId) {

        // validate categoryId
        if (categoryId == null) {
            throw new RuntimeException("Category is missing");
        }

        // fetch category from DB
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // attach category to product
        product.setCategory(category);
        product.setCreatedBy(String.valueOf(userId));
        product.setId(null);
        // default values
        product.setActive(product.getStock() > 0);
        product.setAverageRating(0.0);

        return productRepository.save(product);
    }
   
    public Product updateProductImage(Long id, String imageUrl) {
    Objects.requireNonNull(id, "Product ID must not be null");
    Objects.requireNonNull(imageUrl, "Image URL must not be null");
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    product.setImageUrl(imageUrl);

    return productRepository.save(product);
}   

    // =====================
    // GET ALL PRODUCTS (ADMIN)
    // =====================
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // =====================
    // GET AVAILABLE PRODUCTS (USER)
    // =====================
    public List<Product> getAvailableProducts() {
        return productRepository.findByActiveTrueAndStockGreaterThan(0);
    }

    // =====================
    // GET PRODUCT BY ID
    // =====================
    public Product getProductById(Long id) {
        Objects.requireNonNull(id, "Product ID must not be null");
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setAverageRating(getAverageRating(id));

        return product;
    }


    public List<Product> getProductsByCategory(Long categoryId) {
        Objects.requireNonNull(categoryId, "Category ID must not be null");
        return productRepository.findByCategory_Id(categoryId);
    }

    // =====================
    // UPDATE PRODUCT (ADMIN)
    // =====================
    public Product updateProduct(Long id, Product updatedProduct) {
        Objects.requireNonNull(id, "Product ID must not be null");
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(updatedProduct.getName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStock(updatedProduct.getStock());
        existing.setDescription(updatedProduct.getDescription());

        existing.setActive(updatedProduct.getStock() > 0);

        if (updatedProduct.getCategory() != null &&
            updatedProduct.getCategory().getId() != null) {

            Category category = categoryRepository.findById(Objects.requireNonNull(updatedProduct.getCategory().getId(),"Category ID must not be null")
            ).orElseThrow(() -> new RuntimeException("Category not found"));

            existing.setCategory(category);
        }

        return productRepository.save(existing);
    }

    // =====================
    // DELETE PRODUCT
    // =====================
    public String deleteProduct(Long id) {
        Objects.requireNonNull(id, "Product ID must not be null");
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }

        productRepository.deleteById(id);

        return "Product deleted successfully";
    }

    // =====================
    // REDUCE STOCK
    // =====================
    @Transactional
    public void reduceStock(Long productId, int quantity) {
        Objects.requireNonNull(productId, "Product ID must not be null");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        product.setStock(product.getStock() - quantity);
        product.setActive(product.getStock() > 0);

        productRepository.save(product);
    }

    // =====================
    // INCREASE STOCK
    // =====================
    @Transactional
    public void increaseStock(Long productId, int quantity) {
        Objects.requireNonNull(productId, "Product ID must not be null");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (quantity <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        product.setStock(product.getStock() + quantity);
        product.setActive(product.getStock() > 0);

        productRepository.save(product);
    }

    // =====================
    // LOW STOCK
    // =====================
    public List<Product> getLowStockProducts() {
        return productRepository.findByStockLessThan(5);
    }

    // =====================
    // AVERAGE RATING
    // =====================
    public double getAverageRating(Long productId) {
        Objects.requireNonNull(productId, "Product ID must not be null");

        List<Review> reviews = reviewRepository.findByProduct_Id(productId);

        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        }

        double sum = 0;

        for (Review r : reviews) {
            sum += r.getRating();
        }

        return sum / reviews.size();
    }

    // =====================
    // UPDATE RATING
    // =====================
    @Transactional
    public void updateProductRating(Long productId) {
        Objects.requireNonNull(productId, "Product ID must not be null");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setAverageRating(getAverageRating(productId));

        productRepository.save(product);
    }
}