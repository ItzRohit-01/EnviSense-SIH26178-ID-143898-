package com.example.demo.service;

import java.util.List;
import java.util.UUID;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.CheckoutRequest;
import com.example.demo.model.*;
import com.example.demo.repository.*;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;

    public OrderService(CartRepository cartRepository,
                        UserRepository userRepository,
                        OrderRepository orderRepository,
                        ProductService productService,
                        ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.productRepository = productRepository;
    }

    // =========================
    // 🛒 CHECKOUT (JWT FIXED)
    // =========================
    @Transactional
    public OrderTable checkout(CheckoutRequest request) {

        // 🔥 GET USER FROM JWT (NOT FRONTEND)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartRepository.findByUser_Id(user.getId());

        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // ✅ VALIDATE STOCK
        for (CartItem item : cartItems) {
            Product cartProduct = Objects.requireNonNull(item.getProduct(), "Product cannot be null");
            Long productId = Objects.requireNonNull(cartProduct.getId(), "Product ID cannot be null");

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }
        }

        // ✅ TOTAL PRICE
        double total = cartItems.stream()
                .mapToDouble(c -> c.getProduct().getPrice() * c.getQuantity())
                .sum();

        // ✅ CREATE ORDER
        OrderTable order = new OrderTable();

        order.setUser(user);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.ORDER_PLACED);
        order.setPaymentStatus("PENDING");

        // 📍 DELIVERY DETAILS
        order.setName(request.getName());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setPincode(request.getPincode());
        order.setPaymentMethod(request.getPaymentMethod());

        // 📦 ORDER ITEMS
        List<OrderItem> orderItems = cartItems.stream().map(c -> {

            OrderItem item = new OrderItem();
            item.setProductId(c.getProduct().getId());
            item.setProductName(c.getProduct().getName());
            item.setPrice(c.getProduct().getPrice());
            item.setQuantity(c.getQuantity());
            item.setOrder(order);

            return item;

        }).toList();

        order.setItems(orderItems);

        // 📉 REDUCE STOCK
        for (CartItem item : cartItems) {
            productService.reduceStock(
                    item.getProduct().getId(),
                    item.getQuantity()
            );
        }

        OrderTable savedOrder = orderRepository.save(order);

        cartRepository.deleteAll(cartItems);

        return savedOrder;
    }

    // =========================
    // 💳 PAYMENT
    // =========================
    public OrderTable makePayment(Long orderId, String method) {

        Objects.requireNonNull(orderId, "Order ID cannot be null");

        OrderTable order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot pay cancelled order");
        }

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new RuntimeException("Already paid");
        }

        order.setPaymentStatus("PAID");
        order.setPaymentMethod(method.toUpperCase());
        order.setPaymentId("TXN-" + UUID.randomUUID().toString().substring(0, 8));

        order.setStatus(OrderStatus.CONFIRMED);

        return orderRepository.save(order);
    }

    // =========================
    // 👤 USER ORDERS (JWT BASED)
    // =========================
    public List<OrderTable> getOrdersByUserFromToken() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser_Id(user.getId());
    }

    // =========================
    // 📦 ALL ORDERS (ADMIN)
    // =========================
    public List<OrderTable> getAllOrders() {
        return orderRepository.findAll();
    }

    // =========================
    // 🚚 TRACK ORDER
    // =========================
    public OrderStatus getOrderStatus(Long orderId) {

        Objects.requireNonNull(orderId, "Order ID cannot be null");

        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"))
                .getStatus();
    }

    // =========================
    // 🛠 UPDATE STATUS (ADMIN)
    // =========================
    public OrderTable updateStatus(Long orderId, OrderStatus status) {

        Objects.requireNonNull(orderId, "Order ID cannot be null");

        OrderTable order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Already delivered");
        }

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // =========================
    // ❌ CANCEL ORDER
    // =========================
    @Transactional
    public OrderTable cancelOrder(Long orderId) {

        Objects.requireNonNull(orderId, "Order ID cannot be null");

        OrderTable order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Already cancelled");
        }

        // restore stock
        for (OrderItem item : order.getItems()) {

            Long productId = Objects.requireNonNull(item.getProductId(), "Product ID cannot be null");
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            productService.increaseStock(product.getId(), item.getQuantity());
        }

        order.setStatus(OrderStatus.CANCELLED);

        return orderRepository.save(order);
    }
    public OrderTable getOrderById(Long id) {
    return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
            
}
}