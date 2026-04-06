import { useEffect, useState } from "react";
import API from "../api/api";
import { Plus, Edit, Trash2, Save, X, BarChart3, BookOpen, HelpCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    questions: []
  });
  const [questionFormData, setQuestionFormData] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A"
  });

  useEffect(() => {
    if (activeTab === "dashboard" || activeTab === "quizzes") {
      fetchQuizzes();
    }
    if (activeTab === "questions") {
      fetchQuestions();
    }
  }, [activeTab]);

  const fetchQuizzes = async () => {
    try {
      const res = await API.get("/admin/quiz");
      setQuizzes(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load quizzes");
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      // For questions tab, fetch all quizzes and their questions
      const res = await API.get("/admin/quiz");
      const allQuestions = res.data.flatMap(quiz =>
        quiz.questions.map(q => ({ ...q, quizTitle: quiz.title, quizId: quiz.id }))
      );
      setQuestions(allQuestions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load questions");
    }
  };

  const handleCreateQuiz = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      await API.post("/admin/quiz", formData);
      toast.success("Quiz created successfully");
      setShowCreateForm(false);
      setFormData({ title: "", category: "", questions: [] });
      fetchQuizzes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create quiz");
    }
  };

  const handleUpdateQuiz = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      await API.put(`/admin/quiz/${editingQuiz.id}`, formData);
      toast.success("Quiz updated successfully");
      setEditingQuiz(null);
      setFormData({ title: "", category: "", questions: [] });
      fetchQuizzes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await API.delete(`/admin/quiz/${quizId}`);
      toast.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete quiz");
    }
  };

  const handleAddQuestion = async () => {
    if (!questionFormData.questionText.trim() || !selectedQuiz) {
      toast.error("Question text and quiz selection are required");
      return;
    }

    try {
      await API.post("/admin/question", {
        ...questionFormData,
        quizId: selectedQuiz.id
      });
      toast.success("Question added successfully");
      setShowQuestionForm(false);
      setQuestionFormData({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A"
      });
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!questionFormData.questionText.trim()) {
      toast.error("Question text is required");
      return;
    }

    try {
      await API.put(`/admin/question/${editingQuestion.id}`, questionFormData);
      toast.success("Question updated successfully");
      setEditingQuestion(null);
      setQuestionFormData({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A"
      });
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await API.delete(`/admin/question/${questionId}`);
      toast.success("Question deleted successfully");
      fetchQuestions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  const startEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      category: quiz.category,
      questions: quiz.questions?.map(q => ({
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer
      })) || []
    });
  };

  const startEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionFormData({
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer
    });
  };

  const cancelEdit = () => {
    setEditingQuiz(null);
    setEditingQuestion(null);
    setFormData({ title: "", category: "", questions: [] });
    setQuestionFormData({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A"
    });
  };

  const addQuestionToForm = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, {
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A"
      }]
    }));
  };

  const updateQuestionInForm = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestionFromForm = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "quizzes", label: "Quizzes", icon: BookOpen },
    { id: "questions", label: "Questions", icon: HelpCircle }
  ];

  if (loading && activeTab === "dashboard") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  activeTab === item.id
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
                {activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Overview of your quiz system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <HelpCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {quizzes.reduce((acc, quiz) => acc + (quiz.questions?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Set(quizzes.map(q => q.category)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Create, edit, and delete quizzes</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Create Quiz
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Create/Edit Form */}
            {(showCreateForm || editingQuiz) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      cancelEdit();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter category"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Questions
                      </label>
                      <button
                        onClick={addQuestionToForm}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add Question
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {formData.questions.map((question, qIndex) => (
                        <div key={qIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Question {qIndex + 1}
                            </span>
                            <button
                              onClick={() => removeQuestionFromForm(qIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={question.questionText}
                            onChange={(e) => updateQuestionInForm(qIndex, "questionText", e.target.value)}
                            className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter question"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            {["A", "B", "C", "D"].map((opt, optIndex) => (
                              <div key={opt} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={question.correctAnswer === opt}
                                  onChange={() => updateQuestionInForm(qIndex, "correctAnswer", opt)}
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={question[`option${opt}`]}
                                  onChange={(e) => updateQuestionInForm(qIndex, `option${opt}`, e.target.value)}
                                  className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                  placeholder={`Option ${opt}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save size={20} />
                      {editingQuiz ? "Update Quiz" : "Create Quiz"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        cancelEdit();
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quizzes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{quiz.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                        {quiz.category}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {quiz.questions?.length || 0} questions
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditQuiz(quiz)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {quizzes.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg">No quizzes found.</div>
                <p className="text-gray-400 dark:text-gray-500 mt-2">Create your first quiz to get started!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Question Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Add, edit, and delete questions</p>
              </div>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Question
              </button>
            </div>

            {/* Add/Edit Question Form */}
            {(showQuestionForm || editingQuestion) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowQuestionForm(false);
                      cancelEdit();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {!editingQuestion && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Select Quiz
                      </label>
                      <select
                        value={selectedQuiz?.id || ""}
                        onChange={(e) => setSelectedQuiz(quizzes.find(q => q.id == e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Choose a quiz</option>
                        {quizzes.map(quiz => (
                          <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Text
                    </label>
                    <textarea
                      value={questionFormData.questionText}
                      onChange={(e) => setQuestionFormData(prev => ({ ...prev, questionText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter question text"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Option {opt}
                        </label>
                        <input
                          type="text"
                          value={questionFormData[`option${opt}`]}
                          onChange={(e) => setQuestionFormData(prev => ({ ...prev, [`option${opt}`]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          placeholder={`Enter option ${opt}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correct Answer
                    </label>
                    <select
                      value={questionFormData.correctAnswer}
                      onChange={(e) => setQuestionFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save size={20} />
                      {editingQuestion ? "Update Question" : "Add Question"}
                    </button>
                    <button
                      onClick={() => {
                        setShowQuestionForm(false);
                        cancelEdit();
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Questions</h3>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                            {question.quizTitle}
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium mb-2">
                            {question.questionText}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className={question.correctAnswer === "A" ? "text-green-600 font-semibold" : "text-gray-600 dark:text-gray-400"}>
                              A: {question.optionA}
                            </p>
                            <p className={question.correctAnswer === "B" ? "text-green-600 font-semibold" : "text-gray-600 dark:text-gray-400"}>
                              B: {question.optionB}
                            </p>
                            <p className={question.correctAnswer === "C" ? "text-green-600 font-semibold" : "text-gray-600 dark:text-gray-400"}>
                              C: {question.optionC}
                            </p>
                            <p className={question.correctAnswer === "D" ? "text-green-600 font-semibold" : "text-gray-600 dark:text-gray-400"}>
                              D: {question.optionD}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditQuestion(question)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {questions.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400 text-lg">No questions found.</div>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">Add questions to quizzes to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;