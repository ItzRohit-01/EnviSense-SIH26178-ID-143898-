package com.example.demo.service;

import com.example.demo.model.Wishlist;
import com.example.demo.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository repo;

    public WishlistService(WishlistRepository repo) {
        this.repo = repo;
    }

    // ADD TO WISHLIST
    public String addToWishlist(Long userId, Long productId) {

        Optional<Wishlist> existing =
                repo.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            return "Already in wishlist";
        }

        Wishlist w = new Wishlist();
        w.setUserId(userId);
        w.setProductId(productId);

        repo.save(w);

        return "Added to wishlist";
    }

    // GET WISHLIST
    public List<Wishlist> getWishlist(Long userId) {
        return repo.findByUserId(userId);
    }

    // ✅ ONLY CHANGE HERE (FIX)
    @Transactional
    public String removeFromWishlist(Long userId, Long productId) {

        Optional<Wishlist> existing =
                repo.findByUserIdAndProductId(userId, productId);

        if (existing.isEmpty()) {
            return "Item not found in wishlist";
        }

        repo.deleteByUserIdAndProductId(userId, productId);

        return "Removed from wishlist";
    }
}