import "../styles/practiceHome.css";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";

export default function NumbersHome({ navigate, goBack }) {

  const speakText = (text) => {
    speak(text);
  };

  // 🔢 All Number Games (Scalable Structure)
  const games = [
    { name: "Strawberry Count", screen: "strawberry-count", icon: "🍓" },
    { name: "Missing Number", screen: "missing-number", icon: "🐯" },
    { name: "Number Trail", screen: "number-trail", icon: "🦁" },
    { name: "Frog Jump Math", screen: "frog-jump", icon: "🐸" },
    { name: "Compare Safari", screen: "compare-safari", icon: "🦓" },
    { name: "Number Line Move", screen: "number-line", icon: "🐢" },
    { name: "Skip Counting", screen: "skip-count", icon: "🐒" }
  ];

  return (
    <div className="practice-home">

      {/* NAVBAR */}
      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>

        <div className="navbar-title">
          🔢 Numbers Jungle
        </div>
      </div>

      <div className="practice-content">

        <p className="practice-intro">
          Choose a number adventure and explore the jungle 🌿
        </p>

        {/* NUMBER GAMES */}
        <div className="practice-section">
          <h2 className="section-title">🔢 Number Games Zone</h2>

          <div className="practice-grid">

            {games.map((game, index) => (
              <div
                key={index}
                className="practice-card"
                onClick={() => navigate(game.screen)}
                onMouseEnter={() => speakText(game.name)}
              >
                {game.name} {game.icon}
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}