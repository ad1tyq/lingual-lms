package com.model.backend_lang.dto;

import com.model.backend_lang.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String transactionId;
    private BigDecimal amount;
    private PaymentStatus status;
    private String message;
    private String webhookSimulatorUrl;
}
