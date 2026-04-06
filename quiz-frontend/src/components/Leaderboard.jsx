import { useEffect, useState } from "react";
import API from "../api/api";

function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/result/leaderboard");
        setData(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 border-yellow-300";
      case 2:
        return "bg-gray-100 border-gray-300";
      case 3:
        return "bg-orange-100 border-orange-300";
      default:
        return "bg-white border-gray-200";
    }
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
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-600">Top quiz performers</p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No results yet.</div>
          <p className="text-gray-400 mt-2">Be the first to take a quiz!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((result, index) => {
            const rank = index + 1;
            return (
              <div
                key={index}
                className={`rounded-xl shadow-md p-6 border-2 ${getRankColor(rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-700 w-12 text-center">
                      {getRankIcon(rank)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{result.username}</h3>
                      <p className="text-sm text-gray-600">Quiz #{result.quizId}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{result.score}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>

                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      rank === 1 ? 'bg-yellow-500' :
                      rank === 2 ? 'bg-gray-500' :
                      rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${(result.score / Math.max(...data.map(r => r.score))) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;