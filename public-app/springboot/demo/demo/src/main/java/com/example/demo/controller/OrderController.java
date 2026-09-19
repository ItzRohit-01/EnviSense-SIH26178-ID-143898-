package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

import com.example.demo.model.OrderTable;
import com.example.demo.model.User;
import com.example.demo.dto.CheckoutRequest;
import com.example.demo.model.OrderStatus;
import com.example.demo.service.OrderService;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService,
                           UserRepository userRepository,
                           OrderRepository orderRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    // =========================
    // 🛒 CHECKOUT
    // =========================
    @PostMapping("/checkout")
    @PreAuthorize("hasAuthority('USER')")
    public OrderTable checkout(@RequestBody CheckoutRequest request) {
        return orderService.checkout(request);
    }

    // =========================
    // 💳 PAYMENT
    // =========================
    @PutMapping("/pay/{orderId}")
    @PreAuthorize("hasAuthority('USER')")
    public OrderTable pay(@PathVariable Long orderId,
                          @RequestParam String method) {
        return orderService.makePayment(orderId, method);
    }

    // =========================
    // 👤 MY ORDERS (FIXED)
    // =========================
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public List<OrderTable> getMyOrders(Authentication auth) {

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ FIXED (no stream, direct DB query)
        return orderRepository.findByUser_Id(user.getId());
    }

    // =========================
    // 🔍 GET ORDER BY ID
    // =========================
    @GetMapping("/{orderId}")
@PreAuthorize("hasAnyAuthority('USER','ADMIN')")
public OrderTable getOrderById(
        @PathVariable Long orderId,
        Authentication authentication
) {
    OrderTable order = orderService.getOrderById(orderId);

    if (order == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
    }

    // ✅ GET LOGGED-IN USER
    String email = authentication.getName();

    User loggedUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Long orderUserId = order.getUser().getId();
    Long loggedUserId = loggedUser.getId();

    // 🔥 COMPARE USING ID (NOT EMAIL)
    if (!Objects.equals(orderUserId, loggedUserId)) {

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to view this order"
            );
        }
    }

    return order;
}
    // =========================
    // 🚚 TRACK ORDER
    // =========================
    @GetMapping("/track/{orderId}")
    @PreAuthorize("hasAnyAuthority('USER','ADMIN')")
    public OrderStatus trackOrder(@PathVariable Long orderId) {
        return orderService.getOrderStatus(orderId);
    }

    // =========================
    // ❌ CANCEL ORDER
    // =========================
    @PutMapping("/cancel/{orderId}")
    @PreAuthorize("hasAuthority('USER')")
    public OrderTable cancel(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }

    // =========================
    // 🧾 ADMIN: ALL ORDERS
    // =========================
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<OrderTable> getAllOrders() {
        return orderService.getAllOrders();
    }

    // =========================
    // 🚚 ADMIN: UPDATE STATUS
    // =========================
    @PutMapping("/status/{orderId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public OrderTable updateStatus(@PathVariable Long orderId,
                                   @RequestParam OrderStatus status) {
        return orderService.updateStatus(orderId, status);
    }
}