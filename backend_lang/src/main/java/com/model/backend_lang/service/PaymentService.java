package com.model.backend_lang.service;

import com.model.backend_lang.dto.CheckoutRequest;
import com.model.backend_lang.dto.CheckoutResponse;
import com.model.backend_lang.dto.PaymentResponse;
import com.model.backend_lang.dto.WebhookPayload;
import com.model.backend_lang.exception.InvalidWebhookSecretException;
import com.model.backend_lang.exception.ResourceNotFoundException;
import com.model.backend_lang.exception.UnauthorizedException;
import com.model.backend_lang.model.Payment;
import com.model.backend_lang.model.PaymentStatus;
import com.model.backend_lang.model.SubscriptionStatus;
import com.model.backend_lang.model.User;
import com.model.backend_lang.repository.PaymentRepository;
import com.model.backend_lang.repository.UserRepository;
import com.model.backend_lang.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Value("${app.payment.webhook-secret}")
    private String webhookSecret;

    @Transactional
    public CheckoutResponse initiateCheckout(CheckoutRequest request) {
        User currentUser = getRequiredUser();

        BigDecimal amount;
        if (request != null && request.getAmount() != null) {
            amount = request.getAmount();
        } else if (request != null && "PRO_LIFETIME".equalsIgnoreCase(request.getPlan())) {
            amount = new BigDecimal("49.99");
        } else {
            amount = new BigDecimal("19.99");
        }

        String transactionId = "txn_" + UUID.randomUUID().toString().replace("-", "").substring(0, 18);

        Payment payment = Payment.builder()
                .user(currentUser)
                .transactionId(transactionId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        log.info("Initiated checkout for user {} with transaction ID {}", currentUser.getEmail(), transactionId);

        return CheckoutResponse.builder()
                .transactionId(transactionId)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .message("Paywall checkout initiated. Complete payment and trigger webhook to unlock PRO features.")
                .webhookSimulatorUrl("/api/payments/webhook")
                .build();
    }

    @Transactional
    public PaymentResponse handleWebhook(String secretHeader, WebhookPayload payload) {
        if (secretHeader == null || !secretHeader.equals(webhookSecret)) {
            log.warn("Unauthorized webhook attempt with secret: {}", secretHeader);
            throw new InvalidWebhookSecretException("Unauthorized: Invalid webhook secret key");
        }

        Payment payment = paymentRepository.findByTransactionId(payload.getTransactionId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for transaction: " + payload.getTransactionId()));

        String statusStr = payload.getStatus() != null ? payload.getStatus().toUpperCase() : "FAILED";

        if ("SUCCESS".equals(statusStr) || "COMPLETED".equals(statusStr)) {
            payment.setStatus(PaymentStatus.SUCCESS);
            User user = payment.getUser();
            user.setSubscriptionStatus(SubscriptionStatus.PRO);
            userRepository.save(user);
            log.info("User {} successfully upgraded to PRO status via transaction {}", user.getEmail(), payment.getTransactionId());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            log.warn("Payment marked FAILED for transaction {}", payment.getTransactionId());
        }

        Payment updatedPayment = paymentRepository.save(payment);

        return PaymentResponse.builder()
                .id(updatedPayment.getId())
                .transactionId(updatedPayment.getTransactionId())
                .amount(updatedPayment.getAmount())
                .status(updatedPayment.getStatus())
                .createdAt(updatedPayment.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentHistory() {
        User currentUser = getRequiredUser();
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(p -> PaymentResponse.builder()
                        .id(p.getId())
                        .transactionId(p.getTransactionId())
                        .amount(p.getAmount())
                        .status(p.getStatus())
                        .createdAt(p.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private User getRequiredUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            return userRepository.findById(principal.getId())
                    .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
        }
        throw new UnauthorizedException("User is not authenticated");
    }
}
