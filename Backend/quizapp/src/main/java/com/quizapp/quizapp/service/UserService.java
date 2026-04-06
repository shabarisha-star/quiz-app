package com.quizapp.quizapp.service;

import com.quizapp.quizapp.dto.UserStatsDTO;
import com.quizapp.quizapp.entity.UserEntity;
import com.quizapp.quizapp.exception.ResourceNotFoundException;
import com.quizapp.quizapp.exception.UnauthorizedException;
import com.quizapp.quizapp.repository.UserRepository;
import com.quizapp.quizapp.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ResultService resultService;
    
    public UserEntity getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
    
    public UserEntity getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }
    
    public UserStatsDTO getUserStats(Long userId) {
        UserEntity user = getUserById(userId);
        return resultService.getUserStats(user.getUsername());
    }
    
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        UserEntity user = getUserById(userId);
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new UnauthorizedException("Old password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public UserEntity updateUser(Long userId, String email) {
        UserEntity user = getUserById(userId);
        if (email != null && !email.isEmpty()) {
            user.setEmail(email);
        }
        return userRepository.save(user);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }
    
    public UserEntity createAdminUser(String username, String password, String email) {
        if (existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole("ADMIN");
        
        return userRepository.save(user);
    }
}
