package com.model.backend_lang.service;

import com.model.backend_lang.dto.UserProfileResponse;
import com.model.backend_lang.exception.UnauthorizedException;
import com.model.backend_lang.model.User;
import com.model.backend_lang.repository.UserRepository;
import com.model.backend_lang.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            User user = userRepository.findById(principal.getId())
                    .orElseThrow(() -> new UnauthorizedException("User not found"));
            return UserProfileResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .subscriptionStatus(user.getSubscriptionStatus())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt())
                    .build();
        }
        throw new UnauthorizedException("User is not authenticated");
    }
}
