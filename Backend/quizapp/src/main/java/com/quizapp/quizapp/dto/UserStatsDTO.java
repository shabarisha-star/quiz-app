package com.quizapp.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsDTO {
    private int totalQuizzes;
    private double averageScore;
    private int bestScore;
    private double averageTime; // in seconds
    private List<RecentResultDTO> recentResults;
    private List<CategoryStatsDTO> categoryStats;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentResultDTO {
        private String quizTitle;
        private String category;
        private int score;
        private int totalQuestions;
        private String timeTaken;
        private String submittedAt;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryStatsDTO {
        private String category;
        private int totalQuizzes;
        private double averageScore;
    }
}