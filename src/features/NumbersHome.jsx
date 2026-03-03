import BackIcon from "../components/BackIcon";
import "../styles/numbersZone.css";

export default function NumbersHome({ navigate, goBack }) {

  return (
    <div className="numbers-zone-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🔢 Numbers
        </div>
      </div>

      <div className="zone-container">

        <div
          className="zone-card"
          onClick={() => navigate("numbers-learning-home")}
        >
          📚 Learning Zone
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("numbers-game-home")}
        >
          🎮 Game Zone
        </div>

      </div>

    </div>
  );
}