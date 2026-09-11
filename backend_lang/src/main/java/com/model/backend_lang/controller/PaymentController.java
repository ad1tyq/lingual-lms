package com.model.backend_lang.controller;

import com.model.backend_lang.dto.CheckoutRequest;
import com.model.backend_lang.dto.CheckoutResponse;
import com.model.backend_lang.dto.PaymentResponse;
import com.model.backend_lang.dto.WebhookPayload;
import com.model.backend_lang.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> initiateCheckout(@RequestBody(required = false) CheckoutRequest request) {
        CheckoutResponse response = paymentService.initiateCheckout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<PaymentResponse> handleWebhook(
            @RequestHeader(value = "X-Webhook-Secret", required = false) String webhookSecretHeader,
            @Valid @RequestBody WebhookPayload payload
    ) {
        PaymentResponse response = paymentService.handleWebhook(webhookSecretHeader, payload);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {
        List<PaymentResponse> history = paymentService.getPaymentHistory();
        return ResponseEntity.ok(history);
    }
}
