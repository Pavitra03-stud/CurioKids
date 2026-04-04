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

  return (
    <div className="progress-page">
      <h1 className="title">📊 Your Jungle Journey</h1>

      {/* ⭐ STATS */}
      <div className="stats-grid">
        <div className="card">
          ⭐ <h2>{stars}</h2>
          <p>Total Stars</p>
        </div>

        <div className="card">
          🌿 <h2>{getLevel()}</h2>
          <p>Level</p>
        </div>

        <div className="card">
          🔥 <h2>{streak}</h2>
          <p>Day Streak</p>
        </div>
      </div>

      {/* 📈 GRAPH */}
      <div className="card">
        <h2>📈 Game Progress</h2>

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
      </div>

      {/* 📅 HISTORY */}
      <div className="card">
        <h2>📅 Recent Activity</h2>
        {history.slice(-5).reverse().map((h, i) => (
          <p key={i}>
            {h.date} → Score: {h.score} | ⭐ {h.stars}
          </p>
        ))}
      </div>

      {/* 🧠 AI INSIGHT */}
      <div className="card highlight">
        <h2>🧠 AI Insight</h2>
        <p>
          {stars < 5
            ? "Start your jungle journey 🌱"
            : stars < 15
            ? "You're improving quickly 🚀"
            : "Excellent progress! Keep going 🌟"}
        </p>
      </div>
    </div>
  );
}