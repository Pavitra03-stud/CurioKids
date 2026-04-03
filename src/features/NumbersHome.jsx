import BackIcon from "../components/BackIcon";
import "../styles/numbersZone.css";

export default function NumbersHome({ navigate, goBack }) {
  return (
    <div className="numbers-zone-page">

      {/* Header */}
      <div className="numbers-zone-header">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <h1>🔢 Numbers</h1>
      </div>

      {/* Cards */}
      <div className="zone-container">

        {/* Learning */}
        <div
          className="zone-card"
          onClick={() => navigate("numbers-learning-home")}
        >
          <div className="zone-icon">📚</div>

          <div className="zone-text">
            <h2>Learning Zone</h2>
            <p>Learn numbers with fun concepts</p>
          </div>

          <div className="zone-arrow">→</div>
        </div>

        {/* Gaming */}
        <div
          className="zone-card"
          onClick={() => navigate("numbers-game-home")}
        >
          <div className="zone-icon">🎮</div>

          <div className="zone-text">
            <h2>Game Zone</h2>
            <p>Play games and improve your skills</p>
          </div>

          <div className="zone-arrow">→</div>
        </div>

      </div>

    </div>
  );
}