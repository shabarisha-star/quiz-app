package com.quizapp.quizapp.service;

import com.quizapp.quizapp.dto.UserStatsDTO;
import com.quizapp.quizapp.entity.Quiz;
import com.quizapp.quizapp.entity.Result;
import com.quizapp.quizapp.repository.QuizRepository;
import com.quizapp.quizapp.repository.ResultRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResultService {

    @Autowired
    private ResultRepository resultRepo;

    @Autowired
    private QuizRepository quizRepo;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public List<Result> getMyResults() {
        String username = getCurrentUsername();
        return resultRepo.findByUsername(username);
    }

    public List<Result> getLeaderboard() {
    return resultRepo.findAllByOrderByScoreDesc();
}

    // 🔥 Get comprehensive user stats
    public UserStatsDTO getUserStats(String username) {
        List<Result> results = resultRepo.findByUsername(username);
        if (results.isEmpty()) {
            return new UserStatsDTO(0, 0.0, 0, 0.0, new ArrayList<>(), new ArrayList<>());
        }

        int totalQuizzes = results.size();
        double avgScore = results.stream().mapToInt(Result::getScore).average().orElse(0.0);
        int bestScore = results.stream().mapToInt(Result::getScore).max().orElse(0);
        double avgTime = results.stream().mapToLong(Result::getTimeTaken).average().orElse(0.0);

        // Get recent results (last 10)
        List<UserStatsDTO.RecentResultDTO> recentResults = results.stream()
            .sorted((a, b) -> b.getSubmittedAt().compareTo(a.getSubmittedAt()))
            .limit(10)
            .map(result -> {
                Quiz quiz = quizRepo.findById(result.getQuizId()).orElse(null);
                String quizTitle = quiz != null ? quiz.getTitle() : "Unknown Quiz";
                String category = quiz != null ? quiz.getCategory() : "Unknown";
                String timeTaken = formatTime(result.getTimeTaken());
                return new UserStatsDTO.RecentResultDTO(
                    quizTitle, category, result.getScore(),
                    result.getTotalQuestions(), timeTaken, result.getSubmittedAt()
                );
            })
            .collect(Collectors.toList());

        // Category stats
        Map<String, List<Result>> resultsByCategory = results.stream()
            .collect(Collectors.groupingBy(result -> {
                Quiz quiz = quizRepo.findById(result.getQuizId()).orElse(null);
                return quiz != null ? quiz.getCategory() : "Unknown";
            }));

        List<UserStatsDTO.CategoryStatsDTO> categoryStats = resultsByCategory.entrySet().stream()
            .map(entry -> {
                String category = entry.getKey();
                List<Result> categoryResults = entry.getValue();
                int catTotalQuizzes = categoryResults.size();
                double catAvgScore = categoryResults.stream()
                    .mapToInt(Result::getScore).average().orElse(0.0);
                return new UserStatsDTO.CategoryStatsDTO(category, catTotalQuizzes, catAvgScore);
            })
            .collect(Collectors.toList());

        return new UserStatsDTO(totalQuizzes, avgScore, bestScore, avgTime, recentResults, categoryStats);
    }

    private String formatTime(long seconds) {
        if (seconds < 60) {
            return seconds + "s";
        }
        long minutes = seconds / 60;
        long remainingSeconds = seconds % 60;
        return minutes + "m " + remainingSeconds + "s";
    }
}