import { useEffect, useState } from "react";
import API from "../api/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

function Quiz({ quizId, setQuizId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [error, setError] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [result, setResult] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && quiz && !reviewMode) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !reviewMode) {
      handleSubmit();
    }
  }, [timeLeft, quiz, reviewMode]);

  const handleAnswer = (qid, option) => {
    if (reviewMode) return; // Prevent changes in review mode
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length && !reviewMode) {
      if (!confirm("You haven't answered all questions. Submit anyway?")) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const startTime = Date.now();
      const res = await API.post(`/quiz/submit/${quizId}`, {
        answers,
        timeTaken
      });
      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000);

      setResult(res.data);
      setTimeTaken(timeSpent);
      setReviewMode(true);
      toast.success(`Quiz submitted! Score: ${res.data.score}/${quiz.questions.length}`);
    } catch (err) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionResult = (question) => {
    const userAnswer = answers[question.id];
    const correctAnswer = question.correctAnswer;
    return userAnswer === correctAnswer;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => setQuizId(null)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
          <div className="flex items-center space-x-4">
            {!reviewMode && (
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</div>
                <div className={`text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            )}
            {reviewMode && (
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <Clock size={16} />
                  {formatTime(timeTaken)}
                </div>
              </div>
            )}
            <button
              onClick={() => setQuizId(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Exit Quiz
            </button>
          </div>
        </div>

        {reviewMode && result && (
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Quiz Completed!</h3>
                <p className="text-blue-700 dark:text-blue-200">
                  Your Score: <span className="font-bold">{result.score}/{quiz.questions.length}</span>
                  ({Math.round((result.score / quiz.questions.length) * 100)}%)
                </p>
              </div>
              <div className="text-3xl">
                {result.score / quiz.questions.length >= 0.7 ? "🎉" : result.score / quiz.questions.length >= 0.5 ? "👍" : "💪"}
              </div>
            </div>
          </div>
        )}

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {Object.keys(answers).length} of {quiz.questions.length} questions answered
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions.map((q, index) => {
          const isCorrect = reviewMode ? getQuestionResult(q) : null;
          const userAnswer = answers[q.id];
          const correctAnswer = q.correctAnswer;

          return (
            <div key={q.id} className={`rounded-xl shadow-md p-6 border ${
              reviewMode
                ? isCorrect
                  ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700"
                  : "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {index + 1}. {q.questionText}
                </h3>
                {reviewMode && (
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                    ) : (
                      <XCircle className="text-red-600 dark:text-red-400" size={24} />
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((opt) => {
                  const isSelected = userAnswer === opt;
                  const isCorrectOption = correctAnswer === opt;
                  let buttonClass = "p-4 border-2 rounded-lg text-left transition-all duration-200 ";

                  if (reviewMode) {
                    if (isCorrectOption) {
                      buttonClass += "border-green-500 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200";
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += "border-red-500 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200";
                    } else {
                      buttonClass += "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300";
                    }
                  } else {
                    buttonClass += isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      disabled={reviewMode}
                      className={buttonClass}
                    >
                      <span className="font-semibold mr-2">{opt}.</span>
                      {q[`option${opt}`]}
                    </button>
                  );
                })}
              </div>

              {reviewMode && !isCorrect && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Correct Answer:</strong> {correctAnswer}. {q[`option${correctAnswer}`]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit/Review Button */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center">
          {!reviewMode ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={() => setQuizId(null)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold text-lg"
            >
              Back to Quiz List
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;