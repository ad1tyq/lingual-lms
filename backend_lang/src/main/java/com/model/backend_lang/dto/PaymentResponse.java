package com.model.backend_lang.dto;

import com.model.backend_lang.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String transactionId;
    private BigDecimal amount;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
