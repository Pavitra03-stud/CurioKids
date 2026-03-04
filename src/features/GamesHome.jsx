import "./GamesHome.css";

export default function GamesHome({ navigate, goBack }) {
  return (
    <div className="games-home-container">

      {/* Back Button */}
      <button className="games-back-btn" onClick={goBack}>
        ⬅ Back
      </button>

      {/* Title */}
      <h1 className="games-home-title">🎮 Games Zone</h1>

      {/* Games Grid */}
      <div className="games-grid">

        {/* Sound Tap Game */}
        <div
          className="game-card"
          onClick={() => navigate("sound-tap")}
        >
          <div className="game-icon">🔊</div>
          <h2>Sound Tap</h2>
          <p>Listen and tap the number of sounds</p>
        </div>

        {/* Placeholder for future games */}
        <div className="game-card disabled">
          <div className="game-icon">🧩</div>
          <h2>Coming Soon</h2>
          <p>More fun learning games!</p>
        </div>

      </div>
    </div>
  );
}