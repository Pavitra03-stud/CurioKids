import "../styles/LettersGameHome.css";
import BackIcon from "../components/BackIcon";

export default function LettersGameHome({ navigate, goBack }) {
  const games = [
    {
      title: "Letter Blast",
      subtitle: "Tap the correct letter",
      screen: "letter-blast",
      icon: "💥",
    },
    {
      title: "Find the Odd Letter",
      subtitle: "Find the different letter",
      screen: "odd-letter",
      icon: "🧠",
    },
    {
      title: "Connect the Letters",
      subtitle: "Connect letters in order",
      screen: "connect-letters",
      icon: "🔗",
    },
    {
      title: "Word Builder",
      subtitle: "Build the correct word",
      screen: "word-builder",
      icon: "🧩",
    },
  ];

  return (
    <div className="game-page">
      <BackIcon goBack={goBack} />

      <h1 className="game-title">Letters Games</h1>

      <div className="game-list">
        {games.map((item, i) => (
          <div
            key={i}
            className="game-item"
            onClick={() => navigate(item.screen)}
          >
            <span className="icon">{item.icon}</span>

            <div className="text">
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
            </div>

            <span className="arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}