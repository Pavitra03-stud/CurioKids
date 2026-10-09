
import "../styles/GamesPlayHome.css";
import { useNavigate } from "react-router-dom";

const games = [
  {
    id: "weather",
    icon: "🌦️",
    title: "Weather Clothes",
    description: "Choose the right clothes for sunny, rainy and chilly days.",
    tag: "THINK",
    color: "sun",
    path: "/weather-clothes",
    helper: "Dress for the weather",
  },
  {
    id: "sound",
    icon: "🎧",
    title: "Sound Tap",
    description: "Listen carefully and tap the number of sounds you hear.",
    tag: "LISTEN",
    color: "sky",
    path: "/sound-tap",
    helper: "Listen & count",
  },
  {
    id: "friend",
    icon: "🐾",
    title: "Find the Friend",
    description: "Look closely and find the animal that is different.",
    tag: "FOCUS",
    color: "leaf",
    path: "/find-friend",
    helper: "Spot the difference",
  },
  {
    id: "pattern",
    icon: "🎯",
    title: "Pattern Game",
    description: "Spot the pattern and choose what comes next.",
    tag: "THINK",
    color: "berry",
    path: "/pattern-copy",
    helper: "Think ahead",
  },
  {
    id: "memory",
    icon: "🧠",
    title: "Memory Match",
    description: "Turn, remember and match the hidden jungle friends.",
    tag: "MEMORY",
    color: "violet",
    path: "/memory-match-game",
    helper: "Remember & match",
  },
  {
    id: "word",
    icon: "🎯",
    title: "Catch the Word",
    description: "Find the correct word before it disappears.",
    tag: "WORDS",
    color: "orange",
    path: "/catch-word",
    helper: "Read & catch",
  },
  {
    id: "bucket",
    icon: "🧺",
    title: "Fill the Bucket",
    description: "Count the objects and put the right number in the bucket.",
    tag: "NUMBERS",
    color: "aqua",
    path: "/fill-bucket",
    helper: "Count & choose",
  },
  {
    id: "blast",
    icon: "💥",
    title: "Letter Blast",
    description: "Blast the correct first letter of the jungle animal.",
    tag: "LETTERS",
    color: "coral",
    path: "/letter-blast",
    helper: "Find the first letter",
  },
];

export default function GamesPlayHome() {
  const navigate = useNavigate();

  return (
    <div className="games-play-page">
      <div className="jungle-canopy canopy-left" />
      <div className="jungle-canopy canopy-right" />
      <div className="jungle-mist mist-one" />
      <div className="jungle-mist mist-two" />

      <div className="floating-jungle-leaf leaf-a">🍃</div>
      <div className="floating-jungle-leaf leaf-b">🌿</div>
      <div className="floating-jungle-leaf leaf-c">🍂</div>
      <div className="floating-jungle-leaf leaf-d">🌿</div>

      {/* Centered Games Zone navbar */}
      <header className="games-header games-zone-navbar">
        <h1 className="games-zone-title">🎮 Games Zone</h1>
      </header>

      <main className="games-content">
        <section className="games-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span>✨</span>
              YOUR JUNGLE PLAYGROUND
            </div>

            <h1>
              Let&apos;s Play!
              <span>Adventure is waiting 🌈</span>
            </h1>

            <p>
              Choose a game, explore the jungle, and learn at your own pace.
              Every little try is a win.
            </p>

            <div className="hero-traits">
              <span>🧠 Think</span>
              <span>👀 Focus</span>
              <span>🎯 Play</span>
            </div>
          </div>
        </section>

        <section className="games-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR ADVENTURE MAP</span>
              <h2>Choose your game 🗺️</h2>
              <p>Pick one and let the jungle adventure begin!</p>
            </div>

            <div className="game-count">
              <strong>{games.length}</strong>
              <span>games to explore</span>
            </div>
          </div>

          <div className="games-grid">
            {games.map((game, index) => (
              <button
                key={game.id}
                type="button"
                className={`game-card game-card-${game.color}`}
                onClick={() => navigate(game.path)}
                style={{ "--game-delay": `${index * 60}ms` }}
              >
                <span className="card-glow" />

                <div className="card-top">
                  <span className="game-tag">{game.tag}</span>
                  <span className="game-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="game-icon-wrap">
                  <span className="game-icon">{game.icon}</span>
                </div>

                <div className="game-card-content">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <span className="game-helper">{game.helper}</span>
                </div>

                <span className="play-button">
                  PLAY
                  <b>›</b>
                </span>

                <span className="card-leaves">🍃</span>
              </button>
            ))}
          </div>
        </section>

        <section className="games-tip">
          <div className="tip-icon">🦥</div>
          <div>
            <span>JUNGLE TIP</span>
            <strong>
              Take your time. Your brain learns best when you feel happy! 💚
            </strong>
          </div>
          <div className="tip-plants">🌿 ✨ 🍃</div>
        </section>
      </main>
    </div>
  );
}
