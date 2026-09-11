package com.model.backend_lang.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private String plan; // e.g. "PRO_MONTHLY", "PRO_LIFETIME"
    private BigDecimal amount; // optional custom amount, defaults to plan amount if null
}
