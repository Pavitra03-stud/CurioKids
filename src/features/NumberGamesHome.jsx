import { useNavigate } from "react-router-dom";
import "../styles/NumberGamesHome.css";

import colorTheNumberIcon from "../assets/01-color-the-number.png";
import connectTheNumbersIcon from "../assets/02-connect-the-numbers.png";
import arrangeNumbersIcon from "../assets/03-arrange-numbers.png";
import biggerOrSmallerIcon from "../assets/04-bigger-or-smaller.png";
import numberMatchAnimalsIcon from "../assets/05-number-match-animals.png";

export default function NumberGamesHome() {
  const navigate = useNavigate();

  const gameCards = [
    {
      icon: colorTheNumberIcon,
      title: "Color The Number",
      subtitle: "Color the Animals and Numbers",
      action: "PLAY NOW",
      path: "/color-number-animals",
      color: "yellow",
    },
    {
      icon: connectTheNumbersIcon,
      title: "Connect The Numbers",
      subtitle: "Connect the dots to form a picture",
      action: "CONNECT",
      path: "/connect-the-numbers-animal",
      color: "blue",
    },
    {
      icon: arrangeNumbersIcon,
      title: "Arrange Numbers",
      subtitle: "Arrange the numbers in the correct order",
      action: "ARRANGE",
      path: "/arrange-numbers-game",
      color: "pink",
    },
    {
      icon: biggerOrSmallerIcon,
      title: "Bigger or Smaller",
      subtitle: "Find the bigger or smaller number",
      action: "PLAY NOW",
      path: "/bigger-smaller-game",
      color: "purple",
    },
    {
      icon: numberMatchAnimalsIcon,
      title: "Number Match Animals",
      subtitle:
        "Match numbers with their corresponding animals",
      action: "MATCH NOW",
      path: "/number-match-animals",
      color: "green",
    },
  ];

  const handleNavigate = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

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

        {gameCards.map((card) => (
          <div
            key={card.path}
            className="number-games-card"
            onClick={() => handleNavigate(card.path)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                handleNavigate(card.path);
              }
            }}
            role="button"
            tabIndex={0}
          >

            {/* GAME IMAGE */}
            <div
              className={`number-games-icon ${card.color}`}
            >
              <img
                src={card.icon}
                alt={card.title}
                className="number-games-image"
              />
            </div>

            {/* CONTENT */}
            <div className="number-games-text">

              <h2>{card.title}</h2>

              <p>{card.subtitle}</p>

              {/* ACTION BUTTON */}
              <div className="number-games-arrow">
                {card.action}
                <span>→</span>
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="number-games-footer">
        <div className="number-games-progress">
          <h3>Game Zone</h3>

          <p>
            Play fun games to practice numbers.
          </p>
        </div>
      </div>

    </div>
  );
}