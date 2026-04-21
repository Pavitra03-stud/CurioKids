import { useNavigate } from "react-router-dom";
import "../styles/NumberGamesHome.css";

export default function NumberGamesHome() {
  const navigate = useNavigate();

  const gameCards = [
    {
      icon: "🎯",
      title: "Color The Number",
      subtitle: "Color the Animals and Numbers",
      path: "/color-number-animals",
      color: "yellow",
    },
    {
      icon: "🔢🐟",
      title: "Connect The Numbers",
      subtitle: "Connect the dots to form a picture",
      path: "/connect-the-numbers-animal",
      color: "blue",
    },
    {
      icon: "🔢",
      title: "Arrange Numbers",
      subtitle: "Arrange the numbers in the correct order",
      path: "/arrange-numbers-game",
      color: "pink",
    },
    {
      icon: "⚡",
      title: "Bigger or Smaller",
      subtitle: "Find the bigger or smaller number",
      path: "/bigger-smaller-game",
      color: "purple",
    },
    {
      icon: "🏆",
      title: "Number Match Animals",
      subtitle: "Match numbers with their corresponding animals",
      path: "/number-match-animals",
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