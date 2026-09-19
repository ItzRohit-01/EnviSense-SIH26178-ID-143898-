package com.example.demo.controller;

import com.example.demo.dto.ReviewRequest;
import com.example.demo.model.Review;
import com.example.demo.service.ReviewService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ADD REVIEW
    @PostMapping("/{userId}")
    public Review addReview(@PathVariable Long userId,
                            @RequestBody ReviewRequest request) {
        return reviewService.addReview(userId, request);
    }

    // GET REVIEWS OF PRODUCT
    @GetMapping("/product/{productId}")
    public List<Review> getReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    // DELETE REVIEW
    @DeleteMapping("/{reviewId}")
    public String deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return "Review deleted successfully";
    }
}