package com.example.demo.service;

import com.example.demo.dto.PaymentVerifyRequest;
import com.example.demo.dto.RazorpayOrderResponse;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.OrderTable;
import com.example.demo.repository.OrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class PaymentService {

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // =============================================
    // 🔑 STEP 1: Create Razorpay order for a DB order
    // =============================================
    public RazorpayOrderResponse createRazorpayOrder(Long orderId) throws RazorpayException {

        OrderTable order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new RuntimeException("Order is already paid");
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put("amount", (int)(order.getTotalAmount() * 100)); // paise
        options.put("currency", "INR");
        options.put("receipt", "rcpt_" + orderId + "_" + System.currentTimeMillis());

        Order razorpayOrder = client.orders.create(options);
        String razorpayOrderId = razorpayOrder.get("id");

        // Store razorpay order id in our order for later verification
        order.setPaymentId(razorpayOrderId);
        orderRepository.save(order);

        return new RazorpayOrderResponse(
                orderId,
                razorpayOrderId,
                order.getTotalAmount(),
                "INR",
                keyId
        );
    }

    // =============================================
    // ✅ STEP 2: Verify Razorpay payment signature
    // =============================================
    public OrderTable verifyAndConfirmPayment(PaymentVerifyRequest request) throws Exception {

        OrderTable order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Build the signature verification string: razorpayOrderId|razorpayPaymentId
        String data = request.getRazorpayOrderId() + "|" + request.getPaymentId();

        // HMAC-SHA256 using key secret
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        // Convert to hex string
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        String generatedSignature = hexString.toString();

        if (!generatedSignature.equals(request.getSignature())) {
            throw new RuntimeException("Payment verification failed: signature mismatch");
        }

        // ✅ Signature valid — mark order as PAID
        order.setPaymentStatus("PAID");
        order.setPaymentId(request.getPaymentId());
        order.setPaymentMethod("RAZORPAY");
        order.setStatus(OrderStatus.CONFIRMED);

        return orderRepository.save(order);
    }

    // Legacy method kept for backward compatibility
    public String createOrder(int amount) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", "order_rcptid_" + System.currentTimeMillis());
        Order order = client.orders.create(options);
        return order.toString();
    }
}