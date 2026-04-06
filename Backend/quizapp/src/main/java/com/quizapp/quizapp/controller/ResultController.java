package com.quizapp.quizapp.controller;

import com.quizapp.quizapp.dto.UserStatsDTO;
import com.quizapp.quizapp.entity.Result;
import com.quizapp.quizapp.service.ResultService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/result")
@CrossOrigin
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping("/my")
    public List<Result> getMyResults() {
        return resultService.getMyResults();
    }

    @GetMapping("/leaderboard")
    public List<Result> getLeaderboard() {
    return resultService.getLeaderboard();
}

    @GetMapping("/stats")
    public UserStatsDTO getMyStats() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return resultService.getUserStats(username);
    }
}