import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesHome() {
  const navigate = useNavigate();

  return (
    <div className="games-page">

      <header className="games-topbar">
        <h1 className="games-topbar-title">🎮 Games</h1>
      </header>

      <div className="games-header">
        <p>Choose a zone and start playing</p>
      </div>

      <div className="games-container">

        <div
          className="games-card learning"
          onClick={() => navigate("/games-learning")}
          style={{ cursor: "pointer" }}
        >
          📘 Learning Zone
        </div>

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