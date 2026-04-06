package com.quizapp.quizapp.service;

import com.quizapp.quizapp.entity.UserEntity;
import com.quizapp.quizapp.repository.UserRepository;
import com.quizapp.quizapp.security.CustomUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public String register(String username, String password) {

        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setPassword(encoder.encode(password));

        // First user is SUPER_ADMIN
        if (repo.count() == 0) {
            user.setRole("SUPER_ADMIN");
        } else {
            user.setRole("USER");
        }

        repo.save(user);

        return "User registered successfully";
    }

    public UserDetails loadUserByUsername(String username) {
        return customUserDetailsService.loadUserByUsername(username);
    }
}