package com.model.backend_lang.security;

import com.model.backend_lang.model.SubscriptionStatus;
import com.model.backend_lang.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String email;
    private final String actualUsername;
    private final String password;
    private final SubscriptionStatus subscriptionStatus;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(
            Long id,
            String email,
            String actualUsername,
            String password,
            SubscriptionStatus subscriptionStatus,
            Collection<? extends GrantedAuthority> authorities
    ) {
        this.id = id;
        this.email = email;
        this.actualUsername = actualUsername;
        this.password = password;
        this.subscriptionStatus = subscriptionStatus;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        String role = (user.getRole() != null && !user.getRole().trim().isEmpty()) ? user.getRole() : "USER";
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getSubscriptionStatus().name()),
                new SimpleGrantedAuthority("ROLE_" + role)
        );
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getSubscriptionStatus(),
                authorities
        );
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getActualUsername() {
        return actualUsername;
    }

    public SubscriptionStatus getSubscriptionStatus() {
        return subscriptionStatus;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

