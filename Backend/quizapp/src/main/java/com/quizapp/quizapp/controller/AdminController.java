package com.quizapp.quizapp.controller;

import com.quizapp.quizapp.dto.QuizRequestDTO;
import com.quizapp.quizapp.dto.QuestionRequestDTO;
import com.quizapp.quizapp.entity.Question;
import com.quizapp.quizapp.entity.Quiz;
import com.quizapp.quizapp.entity.UserEntity;
import com.quizapp.quizapp.service.QuizService;
import com.quizapp.quizapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    // Quiz Management

    @PostMapping("/quiz")
    public ResponseEntity<Quiz> createQuiz(@Valid @RequestBody QuizRequestDTO dto) {
        Quiz quiz = quizService.createQuizFromDTO(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(quiz);
    }

    @PutMapping("/quiz/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @Valid @RequestBody QuizRequestDTO dto) {
        Quiz quiz = quizService.updateQuizFromDTO(id, dto);
        return ResponseEntity.ok(quiz);
    }

    @DeleteMapping("/quiz/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuizAdmin(id);
        return ResponseEntity.ok("Quiz deleted successfully");
    }

    @GetMapping("/quiz")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzesAdmin();
        return ResponseEntity.ok(quizzes);
    }

    // Question Management

    @PostMapping("/question")
    public ResponseEntity<Question> addQuestion(@RequestParam Long quizId, @Valid @RequestBody QuestionRequestDTO dto) {
        Question question = quizService.addQuestionToQuiz(quizId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @PutMapping("/question/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionRequestDTO dto) {
        Question question = quizService.updateQuestion(id, dto);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        quizService.deleteQuestion(id);
        return ResponseEntity.ok("Question deleted successfully");
    }

    // User Management
    @PostMapping("/user/admin")
    public ResponseEntity<UserEntity> createAdminUser(@RequestBody UserEntity user) {
        UserEntity adminUser = userService.createAdminUser(user.getUsername(), user.getPassword(), user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(adminUser);
    }
}