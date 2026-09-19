package com.example.demo.dto;

public class RazorpayOrderResponse {

    private Long orderId;           // Our DB order ID
    private String razorpayOrderId; // Razorpay order ID (order_xxx)
    private double amount;          // Amount in rupees
    private String currency;
    private String keyId;           // Razorpay Key ID (for frontend)

    public RazorpayOrderResponse(Long orderId, String razorpayOrderId,
                                  double amount, String currency, String keyId) {
        this.orderId = orderId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.keyId = keyId;
    }

    public Long getOrderId() { return orderId; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public double getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getKeyId() { return keyId; }
}
