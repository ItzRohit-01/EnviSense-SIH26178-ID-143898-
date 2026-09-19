package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 Product reference
    private Long productId;

    // 🔥 Snapshot data (VERY IMPORTANT)
    private String productName;
    private double price;
    private int quantity;

    // 🔗 Many items → One order
    @ManyToOne(fetch = FetchType.LAZY)   // ✅ FIXED
    @JoinColumn(name = "order_id", nullable = false) // ✅ IMPROVED
    @JsonBackReference
    private OrderTable order;

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public OrderTable getOrder() {
        return order;
    }

    public void setOrder(OrderTable order) {
        this.order = order;
    }
}