import { useNavigate } from "react-router-dom";
import "../styles/NumberGamesHome.css";

export default function NumberGamesHome() {
  const navigate = useNavigate();

  const gameCards = [
    {
      icon: "🎯",
      title: "Number Matching",
      subtitle: "Match numbers with objects",
      path: "/number-matching-game",
      color: "yellow",
    },
    {
      icon: "🧠",
      title: "Memory Game",
      subtitle: "Remember and find numbers",
      path: "/number-memory-game",
      color: "blue",
    },
    {
      icon: "🔢",
      title: "Count the Objects",
      subtitle: "Count and choose the correct number",
      path: "/count-objects-game",
      color: "pink",
    },
    {
      icon: "⚡",
      title: "Quick Select",
      subtitle: "Find the correct number fast",
      path: "/quick-select-game",
      color: "purple",
    },
    {
      icon: "🏆",
      title: "Number Quiz",
      subtitle: "Answer simple number questions",
      path: "/number-quiz-game",
      color: "green",
    },
  ];

  return (
    <div className="number-games-page">

      {/* HEADER */}
      <div className="number-games-topbar">
        <h1 className="number-games-title">
          🎮 Number Games
        </h1>
      </div>

      {/* DECOR */}
      <div className="number-games-decor decor-top-left"></div>
      <div className="number-games-decor decor-middle-right"></div>
      <div className="number-games-decor decor-bottom-left"></div>

      {/* TOP ICONS */}
      <div className="number-games-header">
        <div className="number-games-animals top-animals">
          <span>🎲</span>
          <span>🧮</span>
          <span>✨</span>
        </div>
      </div>

      {/* GAME CARDS */}
      <div className="number-games-list">
        {gameCards.map((card, index) => (
          <div
            key={index}
            className="number-games-card"
            onClick={() => {
              console.log("Navigating to:", card.path);
              navigate(card.path);
            }}
          >
            <div className={`number-games-icon ${card.color}`}>
              {card.icon}
            </div>

            <div className="number-games-text">
              <h2>{card.title}</h2>
              <p>{card.subtitle}</p>
            </div>

            <div className="number-games-arrow">→</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="number-games-footer">
        <div className="number-games-progress">
          <h3>Game Zone</h3>
          <p>Play fun games to practice numbers.</p>
        </div>
      </div>

    </div>
  );
}