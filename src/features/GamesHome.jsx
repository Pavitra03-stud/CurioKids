import "../styles/GamesHome.css";
import BackIcon from "../components/BackIcon";

export default function GamesHome({ navigate, goBack }) {
  return (
    <div className="games-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>

      <header className="games-topbar">
        <button className="games-back" onClick={goBack}>
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
        <p>Choose a zone and start playing</p>
      </div>

      <div className="games-container">
        <div
          className="games-card learning"
          onClick={() => navigate("games-learning-home")}
          style={{ cursor: "pointer" }}
        >
          📘 Learning Zone
        </div>

        <div
          className="games-card play"
          onClick={() => navigate("games-play-home")}
          style={{ cursor: "pointer" }}
        >
          🎮 Game Zone
        </div>
      </div>

      <div className="bottom-animals">
        <span>🦁</span>
        <span>🐼</span>
        <span>🐵</span>
      </div>
    </div>
  );
}