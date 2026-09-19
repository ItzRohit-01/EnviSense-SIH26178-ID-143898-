package com.example.demo.service;
import java.util.Objects;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.model.*;
import com.example.demo.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // =====================
    // ⭐ ADD REVIEW
    // =====================
    @Transactional
    public Review addReview(Long userId, ReviewRequest request) {

        if (userId == null) {
            throw new RuntimeException("UserId is missing in URL");
        }

        if (request.getProductId() == null) {
            throw new RuntimeException("ProductId is missing in request body");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(Objects.requireNonNull(request.getProductId()))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ❌ Prevent duplicate review
        reviewRepository.findByUser_IdAndProduct_Id(userId, request.getProductId())
                .ifPresent(r -> {
                    throw new RuntimeException("You already reviewed this product");
                });

        // ✅ Save review
        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        // 🔥 UPDATE AVERAGE RATING
        updateProductRating(product.getId());

        return review;
    }

    // =====================
    // ⭐ UPDATE RATING METHOD (REUSABLE)
    // =====================
    private void updateProductRating(Long productId) {

        List<Review> reviews = reviewRepository.findByProduct_Id(productId);

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        Objects.requireNonNull(productId, "Product ID must not be null");
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setAverageRating(avg);

        // ✅ DO NOT TOUCH ACTIVE HERE (important)

        productRepository.save(product);
    }

    // =====================
    // 📄 GET REVIEWS BY PRODUCT
    // =====================
    public List<Review> getReviewsByProduct(Long productId) {

        if (productId == null) {
            throw new RuntimeException("ProductId is missing");
        }

        return reviewRepository.findByProduct_Id(productId);
    }

    // =====================
    // ❌ DELETE REVIEW
    // =====================
    @Transactional
    public void deleteReview(Long reviewId) {

        if (reviewId == null) {
            throw new RuntimeException("ReviewId is missing");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Long productId = review.getProduct().getId();

        reviewRepository.deleteById(reviewId);

        // 🔥 RECALCULATE RATING AFTER DELETE
        updateProductRating(productId);
    }
}