package com.quizapp.quizapp.service;

import com.quizapp.quizapp.dto.QuizRequestDTO;
import com.quizapp.quizapp.dto.QuestionRequestDTO;
import com.quizapp.quizapp.entity.Question;
import com.quizapp.quizapp.entity.Quiz;
import com.quizapp.quizapp.entity.Result;
import com.quizapp.quizapp.exception.ResourceNotFoundException;
import com.quizapp.quizapp.repository.QuestionRepository;
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

    @Autowired
    private QuestionRepository questionRepo;

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

    // Admin methods

    // Create quiz from DTO
    public Quiz createQuizFromDTO(QuizRequestDTO dto) {
        Quiz quiz = new Quiz();
        quiz.setTitle(dto.getTitle());
        quiz.setCategory(dto.getCategory());
        quiz.setCreatedBy(getCurrentUsername());

        List<Question> questions = dto.getQuestions().stream().map(qDto -> {
            Question q = new Question();
            q.setQuestionText(qDto.getQuestionText());
            q.setOptionA(qDto.getOptionA());
            q.setOptionB(qDto.getOptionB());
            q.setOptionC(qDto.getOptionC());
            q.setOptionD(qDto.getOptionD());
            q.setCorrectAnswer(qDto.getCorrectAnswer());
            q.setQuiz(quiz);
            return q;
        }).toList();

        quiz.setQuestions(questions);
        return quizRepo.save(quiz);
    }

    // Update quiz from DTO
    public Quiz updateQuizFromDTO(Long id, QuizRequestDTO dto) {
        Quiz quiz = quizRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        quiz.setTitle(dto.getTitle());
        quiz.setCategory(dto.getCategory());

        // Clear existing questions and add new ones
        quiz.getQuestions().clear();
        List<Question> questions = dto.getQuestions().stream().map(qDto -> {
            Question q = new Question();
            q.setQuestionText(qDto.getQuestionText());
            q.setOptionA(qDto.getOptionA());
            q.setOptionB(qDto.getOptionB());
            q.setOptionC(qDto.getOptionC());
            q.setOptionD(qDto.getOptionD());
            q.setCorrectAnswer(qDto.getCorrectAnswer());
            q.setQuiz(quiz);
            return q;
        }).toList();
        quiz.getQuestions().addAll(questions);

        return quizRepo.save(quiz);
    }

    // Delete quiz (admin)
    public void deleteQuizAdmin(Long id) {
        Quiz quiz = quizRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        quizRepo.delete(quiz);
    }

    // Get all quizzes for admin
    public List<Quiz> getAllQuizzesAdmin() {
        return quizRepo.findAll();
    }

    // Add question to quiz
    public Question addQuestionToQuiz(Long quizId, QuestionRequestDTO dto) {
        Quiz quiz = quizRepo.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        Question question = new Question();
        question.setQuestionText(dto.getQuestionText());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setQuiz(quiz);

        return questionRepo.save(question);
    }

    // Update question
    public Question updateQuestion(Long questionId, QuestionRequestDTO dto) {
        Question question = questionRepo.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        question.setQuestionText(dto.getQuestionText());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectAnswer(dto.getCorrectAnswer());

        return questionRepo.save(question);
    }

    // Delete question
    public void deleteQuestion(Long questionId) {
        Question question = questionRepo.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        questionRepo.delete(question);
    }
     
}