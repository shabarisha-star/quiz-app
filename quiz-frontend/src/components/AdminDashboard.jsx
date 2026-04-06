import { useEffect, useState } from "react";
import API from "../api/api";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    questions: []
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await API.get("/quiz");
      setQuizzes(res.data);
    } catch (err) {
      setError("Failed to load quizzes");
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      await API.post("/quiz", formData);
      toast.success("Quiz created successfully");
      setShowCreateForm(false);
      setFormData({ title: "", category: "", questions: [] });
      fetchQuizzes();
    } catch (err) {
      toast.error("Failed to create quiz");
    }
  };

  const handleUpdateQuiz = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      await API.put(`/quiz/${editingQuiz.id}`, formData);
      toast.success("Quiz updated successfully");
      setEditingQuiz(null);
      setFormData({ title: "", category: "", questions: [] });
      fetchQuizzes();
    } catch (err) {
      toast.error("Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await API.delete(`/quiz/${quizId}`);
      toast.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (err) {
      toast.error("Failed to delete quiz");
    }
  };

  const startEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      category: quiz.category,
      questions: quiz.questions?.map(q => ({
        questionText: q.questionText || q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer || "A"
      })) || []
    });
  };

  const cancelEdit = () => {
    setEditingQuiz(null);
    setFormData({ title: "", category: "", questions: [] });
  };

  const addQuestion = () => {
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

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (qIndex, optIndex, value) => {
    const optionKey = `option${String.fromCharCode(65 + optIndex)}`;
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIndex ? { ...q, [optionKey]: value } : q
      )
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage quizzes and questions</p>
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
                  onClick={addQuestion}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {formData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question {qIndex + 1}
                      </span>
                      <button
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter question"
                    />

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(qIndex, "correctAnswer", optIndex)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder={`Option ${optIndex + 1}`}
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
                  onClick={() => startEdit(quiz)}
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
  );
}

export default AdminDashboard;