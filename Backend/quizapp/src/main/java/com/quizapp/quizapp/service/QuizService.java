package com.quizapp.quizapp.service;

import com.quizapp.quizapp.entity.Question;
import com.quizapp.quizapp.entity.Quiz;
import com.quizapp.quizapp.entity.Result;
import com.quizapp.quizapp.repository.QuizRepository;
import com.quizapp.quizapp.repository.ResultRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepo;

    @Autowired
    private ResultRepository resultRepo;

    // 🔥 Get logged-in user
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    // 🔥 Create Quiz
    public Quiz createQuiz(Quiz quiz) {

        // set logged user
        String username = getCurrentUsername();
        quiz.setCreatedBy(username);

        // set relationship
        for (Question q : quiz.getQuestions()) {
            q.setQuiz(quiz);
        }

        return quizRepo.save(quiz);
    }

// 🔥 Submit Quiz
    public Result submitQuiz(Long quizId, Map<Long, String> answers, long timeTaken) {

    Quiz quiz = quizRepo.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));

    String username = getCurrentUsername();

    // 🔥 CHECK IF ALREADY ATTEMPTED
    Optional<Result> existing = resultRepo.findByUsernameAndQuizId(username, quizId);

    if (existing.isPresent()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "You have already attempted this quiz"
        );
    }

    int score = 0;

    for (Question q : quiz.getQuestions()) {

        String userAnswer = answers.get(q.getId());

        if (q.getCorrectAnswer().equals(userAnswer)) {
            score++;
        }
    }

    Result result = new Result();
    result.setUsername(username);
    result.setQuizId(quizId);
    result.setScore(score);
    result.setTotalQuestions(quiz.getQuestions().size());
    result.setTimeTaken(timeTaken);
    result.setSubmittedAt(java.time.LocalDateTime.now().toString());
    return resultRepo.save(result);
}

    // 🔥 Get all quizzes (with category filter)
    public List<Quiz> getAllQuizzes(String category) {
        if (category != null && !category.isEmpty()) {
            return quizRepo.findByCategory(category);
        }
        return quizRepo.findAll();
    }

    // 🔥 Search quizzes
    public List<Quiz> searchQuizzes(String query) {
        return quizRepo.findAll().stream()
                .filter(q -> q.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                           q.getCategory().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }

    // 🔥 Update quiz
    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {
        Quiz quiz = quizRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        String username = getCurrentUsername();
        if (!quiz.getCreatedBy().equals(username)) {
            throw new RuntimeException("You can only update your own quizzes");
        }

        quiz.setTitle(updatedQuiz.getTitle());
        quiz.setCategory(updatedQuiz.getCategory());
        // Update questions
        quiz.getQuestions().clear();
        for (Question q : updatedQuiz.getQuestions()) {
            q.setQuiz(quiz);
            quiz.getQuestions().add(q);
        }

        return quizRepo.save(quiz);
    }

    public List<Quiz> getMyQuizzes() {
    String username = getCurrentUsername();
    return quizRepo.findByCreatedBy(username);
}


// delete quiz
   public void deleteQuiz(Long id) {

    Quiz quiz = quizRepo.findById(id)
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found")
            );

    String username = getCurrentUsername();

    // 🔥 Authorization check
    if (!quiz.getCreatedBy().equals(username)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this quiz");
    }

    quizRepo.deleteById(id);
}

    // 🔥 Get quiz by id
    public Quiz getQuizById(Long id) {
        return quizRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
     
}