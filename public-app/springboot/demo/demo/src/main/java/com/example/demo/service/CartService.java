package com.example.demo.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       UserRepository userRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ✅ ADD TO CART
    @Transactional
    public CartItem addToCart(Long productId, int quantity) {

    String email = SecurityContextHolder.getContext()
            .getAuthentication().getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Objects.requireNonNull(productId, "Product ID must not be null");

    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    CartItem cart = new CartItem();
    cart.setUser(user);
    cart.setProduct(product);
    cart.setQuantity(quantity);

    return cartRepository.save(cart);
}

   public List<CartItem> getCart() {

    String email = SecurityContextHolder.getContext()
            .getAuthentication().getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return cartRepository.findByUser_Id(user.getId());
}
public int getCartCount(Long userId) {
    return cartRepository.countByUserId(userId);
}

    // ✅ DELETE WITH ERROR MESSAGE
    @Transactional
    public void removeItem(Long cartId) {

        Objects.requireNonNull(cartId, "Cart ID must not be null");

        cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found with id: " + cartId));

        cartRepository.deleteById(cartId);
    }

    // ✅ TOTAL PRICE
    public double getTotal(Long userId) {
        Objects.requireNonNull(userId, "User ID must not be null");
        List<CartItem> items = cartRepository.findByUser_Id(userId);

        return items.stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum();
    }

    // ✅ UPDATE QUANTITY
    @Transactional
    public CartItem updateQuantity(Long cartId, int quantity) {
        Objects.requireNonNull(cartId, "Cart ID must not be null");
        Objects.requireNonNull(quantity, "Quantity must not be null");


        CartItem item = cartRepository.findById(cartId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found with id: " + cartId));

        item.setQuantity(quantity);

        return cartRepository.save(item);
    }
}