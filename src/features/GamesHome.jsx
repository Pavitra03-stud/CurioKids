import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesHome() {
  const navigate = useNavigate(); // ✅ NEW

  return (
    <div className="games-page">

      {/* Header */}
      <div className="games-header">
        <h1>🎮 Games</h1>
      </div>

      {/* ❌ REMOVED BACK BUTTON */}

      {/* Sections */}
      <div className="games-container">

        {/* 📘 Learning Zone */}
        <div
          className="games-card learning"
          onClick={() => navigate("/games-learning")}
          style={{ cursor: "pointer" }}
        >
          📘 Learning Zone
        </div>

        {/* 🎮 Game Zone */}
        <div
          className="games-card play"
          onClick={() => navigate("/games-play")}
          style={{ cursor: "pointer" }}
        >
          🎮 Game Zone
        </div>

      </div>
    </div>
  );
}