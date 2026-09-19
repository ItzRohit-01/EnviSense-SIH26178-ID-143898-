package com.example.demo.controller;

import com.example.demo.model.Wishlist;
import com.example.demo.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {

    private final WishlistService service;

    public WishlistController(WishlistService service) {
        this.service = service;
    }

    // ✅ GET wishlist
    @GetMapping("/{userId}")
    public List<Wishlist> get(@PathVariable Long userId) {
        return service.getWishlist(userId);
    }

    // ✅ ADD to wishlist (FIXED PATH STYLE)
    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<String> add(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        return ResponseEntity.ok(service.addToWishlist(userId, productId));
    }

    // ✅ REMOVE from wishlist (FIXED PATH STYLE)
    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<String> remove(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        return ResponseEntity.ok(service.removeFromWishlist(userId, productId));
    }
}