package com.quizapp.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultDTO {
    private Long id;
    private String username;
    private Long quizId;
    private int score;
    private int totalQuestions;
    private long timeTaken;
    private String submittedAt;
}