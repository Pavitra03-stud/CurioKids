import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesHome() {
  const navigate = useNavigate();

  return (
    <div className="games-page">

      <header className="games-topbar">


        <button className="games-back" onClick={() => navigate(-1)}>
          ←
        </button>


        <h1 className="games-topbar-title">🎮 Games</h1>
      </header>

      <div className="games-header">

        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>


      </div>

<<<<<<< HEAD
=======
      <div className="games-container">

>>>>>>> 737ddcc (New changes)

        <div
          className="games-card play"
          onClick={() => navigate("/games-play")}

          style={{ cursor: "pointer" }}

        >
          🎮 Game Zone
        </div>

      </div>

  
  );
}