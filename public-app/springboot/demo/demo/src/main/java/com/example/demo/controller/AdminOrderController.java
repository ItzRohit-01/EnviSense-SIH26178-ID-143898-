package com.example.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.demo.model.OrderTable;
import com.example.demo.model.OrderStatus;
import com.example.demo.service.OrderService;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // =========================
    // 📦 VIEW ALL ORDERS (ADMIN)
    // =========================
    @GetMapping
    public List<OrderTable> getAllOrders() {
        return orderService.getAllOrders();
    }

    // =========================
    // 👨‍💼 UPDATE ORDER STATUS (ADMIN)
    // =========================
    @PutMapping("/{orderId}/status")
    public OrderTable updateStatus(@PathVariable Long orderId,
                                   @RequestParam OrderStatus status) {
        return orderService.updateStatus(orderId, status);
    }
}