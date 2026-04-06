import { useEffect, useState } from "react";
import API from "../api/api";

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get("/result/my");
        setResults(res.data);
      } catch (err) {
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

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
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quiz Results</h1>
        <p className="text-gray-600">Track your quiz performance</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No quiz results yet.</div>
          <p className="text-gray-400 mt-2">Take some quizzes to see your results here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Quiz #{result.quizId}</h3>
                  <p className="text-sm text-gray-600">Score: {result.score}</p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                  result.score >= 8 ? 'bg-green-500' :
                  result.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {result.score}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    result.score >= 8 ? 'bg-green-500' :
                    result.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(result.score / 10) * 100}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                {result.score >= 8 ? 'Excellent!' :
                 result.score >= 5 ? 'Good job!' : 'Keep practicing!'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;