package com.model.backend_lang.controller;

import com.model.backend_lang.dto.AdminStatsResponse;
import com.model.backend_lang.dto.AdminUserResponse;
import com.model.backend_lang.exception.UnauthorizedException;
import com.model.backend_lang.security.UserPrincipal;
import com.model.backend_lang.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getPlatformStats(
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey
    ) {
        verifyAdminAccess(adminKey);
        AdminStatsResponse stats = adminService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey
    ) {
        verifyAdminAccess(adminKey);
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/subscription")
    public ResponseEntity<AdminUserResponse> updateSubscription(
            @PathVariable("id") Long id,
            @RequestHeader(value = "X-Admin-Key", required = false) String adminKey,
            @RequestBody Map<String, String> body
    ) {
        verifyAdminAccess(adminKey);
        String status = body.getOrDefault("subscriptionStatus", "PRO");
        AdminUserResponse updated = adminService.updateSubscription(id, status);
        return ResponseEntity.ok(updated);
    }

    private void verifyAdminAccess(String adminKey) {
        if ("admin_japan_secret_key_2026".equals(adminKey)) {
            return;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal principal) {
            boolean isAdmin = principal.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))
                    || "admin@japan.com".equalsIgnoreCase(principal.getEmail())
                    || "admin".equalsIgnoreCase(principal.getActualUsername())
                    || "admin".equalsIgnoreCase(principal.getUsername());
            if (isAdmin) {
                return;
            }
        }
        throw new UnauthorizedException("Administrator access required for this operation.");
    }
}
