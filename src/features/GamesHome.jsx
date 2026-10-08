import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesHome() {
  const navigate = useNavigate();

  const goToGames = () => {
    navigate("/games-play");
  };

  return (
    <div className="games-page">

      {/* =========================
          FIXED SMALL TOP HEADER
          ========================= */}
      <header className="games-topbar">
        <h1 className="games-topbar-title">
          
        </h1>
      </header>


      {/* =========================
          ANIMAL HEADER
          ========================= */}
      <section className="games-mascot-area">
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>
      </section>


      {/* =========================
          GAME ZONE BOARD
          ========================= */}
      <main className="games-main">

        <button
          className="games-card"
          onClick={goToGames}
          type="button"
        >
          <span className="games-card-icon">
            🎮
          </span>

          <span className="games-card-title">
            Game Zone
          </span>
        </button>

      </main>

    </div>
  );
}