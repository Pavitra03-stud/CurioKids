import "../styles/GamesPlayHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesPlayHome() {
  const navigate = useNavigate(); // ✅ NEW

  return (
    <div className="games-play-page">

      {/* ❌ BACK ICON REMOVED */}

      {/* Title */}
      <h1 className="title">Games Zone</h1>

      {/* Game List */}
      <div className="game-list">

        <div
          className="game-item"
          onClick={() => navigate("/weather-clothes")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>Weather Clothes</h2>
            <p>Find how to dress according to the weather</p>
          </div>
        </div>

        
      </div>
    </div>
  );
}