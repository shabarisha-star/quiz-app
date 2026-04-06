import { useState, useEffect } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import QuizList from "./components/QuizList";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Leaderboard from "./components/Leaderboard";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [quizId, setQuizId] = useState(null);
  const [page, setPage] = useState("login");
  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return "USER";
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ? payload.role.replace(/^ROLE_/, "") : "USER";
    } catch {
      return "USER";
    }
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem("darkMode", newDark.toString());
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 🔐 AUTH FLOW
  if (!loggedIn) {
    if (page === "register") {
      return <Register setPage={setPage} />;
    }

    return <Login setLoggedIn={setLoggedIn} setPage={setPage} setUserRole={setUserRole} />;
  }

  // 🏠 MAIN APP
  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar
        page={page}
        setPage={setPage}
        setLoggedIn={setLoggedIn}
        userRole={userRole}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 🔥 ROUTES */}
        {page === "home" && !quizId && (
          <QuizList setQuizId={setQuizId} />
        )}

        {(page === "admin" && userRole === "ADMIN") && (
          <AdminDashboard />
        )}

        {page === "profile" && (
          <Profile />
        )}

        {quizId && <Quiz quizId={quizId} setQuizId={setQuizId} />}

        {page === "results" && <Results />}

        {page === "leaderboard" && <Leaderboard />}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;