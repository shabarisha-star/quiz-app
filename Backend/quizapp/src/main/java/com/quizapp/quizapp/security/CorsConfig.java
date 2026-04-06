package com.quizapp.quizapp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;

import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔥 Allow frontend (React)
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // 🔥 Allow everything
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("*"));

        // 🔥 Apply to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}