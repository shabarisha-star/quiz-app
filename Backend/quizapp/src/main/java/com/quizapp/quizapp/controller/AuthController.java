package com.quizapp.quizapp.controller;

import com.quizapp.quizapp.dto.AuthResponse;
import com.quizapp.quizapp.entity.UserEntity;
import com.quizapp.quizapp.security.JwtUtil;
import com.quizapp.quizapp.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    @PostMapping("/register")
    public String register(@RequestBody UserEntity user) {
        return authService.register(user.getUsername(), user.getPassword());
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public AuthResponse login(@RequestBody UserEntity user) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );

        final UserDetails userDetails = authService.loadUserByUsername(user.getUsername());
        String authority = Optional.ofNullable(userDetails.getAuthorities().stream().findFirst().orElse(null))
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        String role = authority.replaceFirst("^ROLE_", "");
        String token = jwtUtil.generateToken(user.getUsername(), role);

        return new AuthResponse(token, role);
    }
}