package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.CartItem;
import com.example.demo.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ADD TO CART
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToCart(
            @PathVariable Long productId,
            @RequestParam int quantity,
            Authentication authentication
    ) {
        authentication.getName(); // ensure user is authenticated

        return ResponseEntity.ok(
                cartService.addToCart(productId, quantity)
        );
    }

    // GET CART
   @GetMapping
    public List<CartItem> getCart() {
        return cartService.getCart();
    }
     
    @GetMapping("/count/{userId}")
public ResponseEntity<Integer> getCartCount(@PathVariable Long userId) {
    int count = cartService.getCartCount(userId);
    return ResponseEntity.ok(count);
}
    // DELETE ITEM
    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> delete(@PathVariable Long cartId) {
        cartService.removeItem(cartId);
        return ResponseEntity.ok("Removed");
    }

    // TOTAL
    @GetMapping("/total")
    public double getTotal(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        return cartService.getTotal(userId);
    }

    // UPDATE QTY
    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateQty(
            @PathVariable Long cartId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(cartId, quantity));
    }
}