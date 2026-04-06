package com.quizapp.quizapp.controller;

import com.quizapp.quizapp.entity.Quiz;
import com.quizapp.quizapp.entity.Result;
import com.quizapp.quizapp.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quiz")
@CrossOrigin
public class QuizController {

    @Autowired
    private QuizService quizService;

    // 🔥 Create quiz (secured)
    @PostMapping({"", "/create"})
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizService.createQuiz(quiz);
    }

    // 🔥 Get all quizzes (with optional category filter)
    @GetMapping
    public List<Quiz> getAll(@RequestParam(required = false) String category,
                            @RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return quizService.searchQuizzes(search);
        }
        return quizService.getAllQuizzes(category);
    }

    // 🔥 Update quiz
    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
        return quizService.updateQuiz(id, quiz);
    }

    @GetMapping("/my")
    public List<Quiz> getMyQuizzes() {
    return quizService.getMyQuizzes();
}

   @PostMapping("/submit/{id}")
   public Result submitQuiz(@PathVariable Long id,@RequestBody Map<String, Object> payload) {

    @SuppressWarnings("unchecked")
    Map<Long, String> answers = (Map<Long, String>) payload.get("answers");
    long timeTaken = ((Number) payload.get("timeTaken")).longValue();

    return quizService.submitQuiz(id, answers, timeTaken);
}

    @DeleteMapping("/{id}")
    public String deleteQuiz(@PathVariable Long id) {
    quizService.deleteQuiz(id);
    return "Quiz deleted successfully";
}

    @GetMapping("/{id}")
    public Quiz getQuiz(@PathVariable Long id) {
        return quizService.getQuizById(id);
    }
}