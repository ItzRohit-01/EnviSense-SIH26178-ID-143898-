package com.example.demo.controller;

import com.example.demo.dto.PaymentVerifyRequest;
import com.example.demo.dto.RazorpayOrderResponse;
import com.example.demo.model.OrderTable;
import com.example.demo.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // =============================================
    // 🔑 STEP 1: Create Razorpay order
    // POST /api/payment/create-order?orderId=5
    // =============================================
    @PostMapping("/create-order")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(
            @RequestParam Long orderId) throws Exception {

        RazorpayOrderResponse response = paymentService.createRazorpayOrder(orderId);
        return ResponseEntity.ok(response);
    }

    // =============================================
    // ✅ STEP 2: Verify payment & confirm order
    // POST /api/payment/verify
    // Body: { orderId, razorpayOrderId, paymentId, signature }
    // =============================================
    @PostMapping("/verify")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<OrderTable> verifyPayment(
            @RequestBody PaymentVerifyRequest request) throws Exception {

        OrderTable order = paymentService.verifyAndConfirmPayment(request);
        return ResponseEntity.ok(order);
    }
}