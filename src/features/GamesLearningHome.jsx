import "../styles/GamesPlayHome.css";
import BackIcon from "../components/BackIcon";

export default function GamesLearningHome({ navigate, goBack }) {
  return (
    <div className="games-play-page">

      {/* Back */}
      <div className="top-bar">
        <BackIcon goBack={goBack} />
      </div>

      {/* Title */}
      <h1 className="title">Learning Zone 📘</h1>

      {/* Learning Games List */}
      <div className="game-list">

        <div
          className="game-item"
          onClick={() => navigate("sound-tap")}
        >
          <div>
            <h2>🎧 Sound Tap</h2>
            <p>Learn sounds</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("weather-clothes")}
        >
          <div>
            <h2>🌦️ Weather & Clothes</h2>
            <p>Learn what to wear</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("animal-home")}
        >
          <div>
            <h2>🏠 Animal Homes</h2>
            <p>Where animals live</p>
          </div>
        </div>

      </div>
    </div>
  );
}