package com.model.backend_lang.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookPayload {

    @NotBlank(message = "transaction_id is required")
    @JsonProperty("transaction_id")
    private String transactionId;

    @NotBlank(message = "status is required")
    private String status; // "SUCCESS", "COMPLETED", "FAILED"

    private BigDecimal amount;
}
