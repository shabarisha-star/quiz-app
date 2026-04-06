package com.quizapp.quizapp.repository;

import com.quizapp.quizapp.entity.Result;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByUsernameAndQuizId(String username, Long quizId);
    List<Result> findByUsername(String username);
    List<Result> findAllByOrderByScoreDesc();
}