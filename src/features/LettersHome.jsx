import "../styles/LettersHome.css";
import BackIcon from "../components/BackIcon";

export default function LettersHome({ navigate, goBack }) {
  return (
    <div className="letters-home">

      {/* Navbar */}
      <div className="letters-navbar">
        <div className="nav-left">
          <BackIcon goBack={goBack} />
        </div>
        <h1>🌿 Letters Home</h1>
      </div>

      {/* Content */}
      <div className="letters-content">

        <p className="subtitle">
          Choose your zone and start learning ✨
        </p>

        <div className="zone-container">

          {/* Learning Zone */}
          <div
            className="zone-card"
            onClick={() => navigate("letters-learning-home")}
          >
            📚 Letter Learning Zone
          </div>

          {/* Gaming Zone */}
          <div
            className="zone-card"
            onClick={() => navigate("letters-game-home")}
          >
            🎮 Letter Gaming Zone
          </div>

        </div>

      </div>
    </div>
  );
}