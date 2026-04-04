import "../styles/GamesPlayHome.css";
export default function GamesPlayHome({ navigate, goBack }) {
  const games = [
    {
      title: "Sound Tap",
      subtitle: "Tap the number of sounds",
      screen: "sound-tap",
      icon: "🎧",
    },
    {
      title: "Find the Friend",
      subtitle: "Find the different one",
      screen: "find-friend",
      icon: "🐾",
    },
    {
      title: "Pattern Game",
      subtitle: "Follow the pattern",
      screen: "pattern-copy",
      icon: "🎯",
    },
    {
      title: "Memory Match",
      subtitle: "Match the pairs",
      screen: "memory-match",
      icon: "🧠",
    },
    {
      title: "Catch the Word",
      subtitle: "Catch the correct word",
      screen: "catch-word",
      icon: "🎯",
    },
    {
      title: "Fill the Bucket",
      subtitle: "Put the right number of items",
      screen: "fill-bucket",
      icon: "🧺",
    },
    {
      title: "Letter Blast",
      subtitle: "Tap the correct letter",
      screen: "letter-blast",
      icon: "💥",
    },
  ];
import { useNavigate } from "react-router-dom";

export default function GamesPlayHome() {
  const navigate = useNavigate(); // ✅ NEW
  return (
    <div className="games-play-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>
      <header className="games-play-topbar">
        <button className="games-play-back" onClick={goBack}>
          ←
        </button>
        <h1 className="games-play-topbar-title">🎮 Games Zone</h1>
      </header>

      <div className="games-play-header">
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>
        <p>Choose a fun game and start playing</p>
      </div>
      {/* ❌ BACK ICON REMOVED */}
      <div className="game-list">
        {games.map((item, i) => (
          <div
            key={i}
            className="game-item"
            onClick={() => navigate(item.screen)}
          >
            <div className="card-left">
              <div className="animal-icon">{item.icon}</div>
              <div className="card-text">
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
              </div>
            </div>

            <div className="arrow">→</div>
          </div>
        ))}
      </div>
=======
        <div
          className="game-item"
          onClick={() => navigate("/sound-tap")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🎧 Sound Tap</h2>
            <p>Tap the number of sounds</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/find-friend")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🐾 Find the Friend</h2>
            <p>Find the different one</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/pattern-copy")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🎯 Pattern Game</h2>
            <p>Follow the pattern</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/memory-match")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🧠 Memory Match</h2>
            <p>Match the pairs</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/catch-word")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🎯 Catch the Word</h2>
            <p>Catch the correct word</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/fill-bucket")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🧺 Fill the Bucket</h2>
            <p>Put the right number of items</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/letter-blast")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>💥 Letter Blast</h2>
            <p>Tap the correct letter</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/number-ninja")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🔢 Number Ninja</h2>
            <p>Slice the correct number</p>
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