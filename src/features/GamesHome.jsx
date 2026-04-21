import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesHome() {
  const navigate = useNavigate();

  return (
    <div className="games-page">

      <header className="games-topbar">
<<<<<<< HEAD
=======
        <button className="games-back" onClick={() => navigate(-1)}>
          ←
        </button>

>>>>>>> 93e4b59 (restored sound tap with AI voice, first-time learning flow, and 12 animals)
        <h1 className="games-topbar-title">🎮 Games</h1>
      </header>

      <div className="games-header">
<<<<<<< HEAD
=======
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>

>>>>>>> 93e4b59 (restored sound tap with AI voice, first-time learning flow, and 12 animals)
        <p>Choose a zone and start playing</p>
      </div>

      <div className="games-container">

        <div
          className="games-card learning"
          onClick={() => navigate("/games-learning")}
<<<<<<< HEAD
          style={{ cursor: "pointer" }}
=======
>>>>>>> 93e4b59 (restored sound tap with AI voice, first-time learning flow, and 12 animals)
        >
          📘 Learning Zone
        </div>

        <div
          className="games-card play"
          onClick={() => navigate("/games-play")}
<<<<<<< HEAD
          style={{ cursor: "pointer" }}
=======
>>>>>>> 93e4b59 (restored sound tap with AI voice, first-time learning flow, and 12 animals)
        >
          🎮 Game Zone
        </div>

      </div>

    </div>
  );
}