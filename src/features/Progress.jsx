import "../styles/Progress.css";
import { useGame } from "../context/GameContext";

export default function Progress() {
  const { stars, history, streak } = useGame();

  const getLevel = () => {
    if (stars < 5) return "🌱 Beginner";
    if (stars < 15) return "🌿 Explorer";
    if (stars < 30) return "🌳 Jungle Hero";
    return "🏆 Jungle Master";
  };

  const progressPercent = Math.min((stars / 30) * 100, 100);

  return (
    <div className="progress-page">

      {/* TITLE */}
      <h1 className="title">🌴 Jungle Progress Dashboard</h1>

      {/* ⭐ TOP STATS */}
      <div className="stats-grid">

        <div className="card glow">
          <h2>⭐ {stars}</h2>
          <p>Total Stars</p>
        </div>

        <div className="card glow">
          <h2>{getLevel()}</h2>
          <p>Level</p>
        </div>

        <div className="card glow">
          <h2>🔥 {streak}</h2>
          <p>Day Streak</p>
        </div>

      </div>

      {/* 🔥 MAIN GRID (SIDE-BY-SIDE) */}
      <div className="progress-grid">

        {/* 📊 PROGRESS */}
        <div className="card">
          <h2>📊 Overall Progress</h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p>{Math.round(progressPercent)}% Completed</p>
        </div>

        {/* 📈 PERFORMANCE */}
        <div className="card">
          <h2>📈 Performance</h2>

          {history.length === 0 ? (
            <p>No data yet 🚀</p>
          ) : (
            <div className="graph">
              {history.map((h, i) => (
                <div key={i} className="bar-box">
                  <div
                    className="bar-fill"
                    style={{ height: `${h.score}%` }}
                  ></div>
                  <span>{h.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📅 RECENT ACTIVITY */}
        <div className="card">
          <h2>📅 Recent Activity</h2>

          {history.length === 0 ? (
            <p>No activity yet 🚀</p>
          ) : (
            history.slice(-5).reverse().map((h, i) => (
              <div key={i} className="history-item">
                <span>{h.date}</span>
                <span>Score: {h.score}</span>
                <span>⭐ {h.stars}</span>
              </div>
            ))
          )}
        </div>

        {/* 🧠 AI INSIGHT */}
        <div className="card highlight">
          <h2>🧠 AI Insight</h2>
          <p>
            {stars < 5
              ? "🌱 Start your journey with simple games!"
              : stars < 15
              ? "🚀 You're improving fast! Keep practicing."
              : stars < 30
              ? "🌟 Great work! Try advanced challenges."
              : "🏆 You’re a Jungle Master!"}
          </p>
        </div>

      </div>

    </div>
  );
}