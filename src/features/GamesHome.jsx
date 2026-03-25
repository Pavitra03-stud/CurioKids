import "../styles/GamesHome.css";
import BackIcon from "../components/BackIcon";

export default function GamesHome({ navigate, goBack }) {
  return (
    <div className="games-page">

      {/* Header */}
      <div className="games-header">
        <h1>🎮 Games</h1>
      </div>

      {/* Back Button */}
      <div className="games-back">
        <BackIcon goBack={goBack} />
      </div>

      {/* Sections */}
      <div className="games-container">

        {/* 📘 Learning Zone */}
        <div
          className="games-card learning"
          onClick={() => navigate("games-learning")}
        >
          📘 Learning Zone
        </div>

        {/* 🎮 Game Zone */}
        <div
          className="games-card play"
          onClick={() => navigate("games-play")}
        >
          🎮 Game Zone
        </div>

      </div>
    </div>
  );
}