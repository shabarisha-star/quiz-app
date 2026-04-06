import { useState } from "react";
import { Moon, Sun, User, Settings } from "lucide-react";

function Navbar({ page, setPage, setLoggedIn, userRole, darkMode, toggleDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setPage("login");
  };

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">QuizApp</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setPage("home")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                page === "home" ? "bg-blue-700 dark:bg-gray-700" : "hover:bg-blue-500 dark:hover:bg-gray-600"
              }`}
            >
              Home
            </button>

            {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
              <button
                onClick={() => setPage("admin")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  page === "admin" ? "bg-blue-700 dark:bg-gray-700" : "hover:bg-blue-500 dark:hover:bg-gray-600"
                }`}
              >
                Admin
              </button>
            )}

            <button
              onClick={() => setPage("results")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                page === "results" ? "bg-blue-700 dark:bg-gray-700" : "hover:bg-blue-500 dark:hover:bg-gray-600"
              }`}
            >
              Results
            </button>

            <button
              onClick={() => setPage("leaderboard")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                page === "leaderboard" ? "bg-blue-700 dark:bg-gray-700" : "hover:bg-blue-500 dark:hover:bg-gray-600"
              }`}
            >
              Leaderboard
            </button>

            <button
              onClick={() => setPage("profile")}
              className={`p-2 rounded-md ${
                page === "profile" ? "bg-blue-700 dark:bg-gray-700" : "hover:bg-blue-500 dark:hover:bg-gray-600"
              }`}
              title="Profile"
            >
              <User size={18} />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-blue-500 dark:hover:bg-gray-600"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => { setPage("home"); setMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 dark:hover:bg-gray-600 w-full text-left"
              >
                Home
              </button>

              {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
                <button
                  onClick={() => { setPage("admin"); setMenuOpen(false); }}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 dark:hover:bg-gray-600 w-full text-left"
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => { setPage("results"); setMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 dark:hover:bg-gray-600 w-full text-left"
              >
                Results
              </button>

              <button
                onClick={() => { setPage("leaderboard"); setMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 dark:hover:bg-gray-600 w-full text-left"
              >
                Leaderboard
              </button>

              <button
                onClick={() => { setPage("profile"); setMenuOpen(false); }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 dark:hover:bg-gray-600 w-full text-left"
              >
                <User size={18} className="mr-2" />
                Profile
              </button>

              <button
                onClick={() => { toggleDarkMode(); setMenuOpen(false); }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500 dark:hover:bg-gray-600 w-full text-left"
              >
                {darkMode ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              <button
                onClick={handleLogout}
                className="block px-3 py-2 rounded-md text-base font-medium bg-red-500 hover:bg-red-600 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;