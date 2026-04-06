package com.quizapp.quizapp.repository;

import com.quizapp.quizapp.entity.Quiz;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
   List<Quiz> findByCreatedBy(String createdBy);
   List<Quiz> findByCategory(String category);
}