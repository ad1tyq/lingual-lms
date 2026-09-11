package com.model.backend_lang.dto;

import com.model.backend_lang.model.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String email;
    private String username;
    private SubscriptionStatus subscriptionStatus;
    private String role;
    private LocalDateTime createdAt;
    private long lessonsCompleted;
    private long coursesEnrolled;
    private String lastActive;
}
