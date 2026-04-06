package com.quizapp.quizapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private Environment environment;

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "QuizApp Backend");

        // Check database connectivity
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) { // 5 second timeout
                health.put("database", "UP");
            } else {
                health.put("database", "DOWN");
                health.put("status", "DOWN");
            }
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("status", "DOWN");
        }

        // Add version info
        health.put("version", environment.getProperty("app.version", "1.0.0"));
        health.put("java.version", System.getProperty("java.version"));

        return health.get("status").equals("UP") ?
            ResponseEntity.ok(health) :
            ResponseEntity.status(503).body(health);
    }
}