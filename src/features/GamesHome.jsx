import React from "react";
import "../styles/GamesHome.css";

function GamesHome({ navigate, goBack }) {
  return (
    <div className="games-home-page">

      {/* Header */}
      <div className="games-home-header">
        <button className="games-back-btn" onClick={goBack}>
          ←
        </button>

        <h1>🎮 Games Home</h1>
      </div>

      {/* Content */}
      <div className="games-home-content">
        <p className="games-home-subtitle">
          Choose your zone and start playing ✨
        </p>

        <div className="games-cards-grid">

          {/* Learning */}
          <div
            className="games-feature-card"
            onClick={() => navigate("games-learning")}
          >
            <div className="games-feature-icon learning-icon">📘</div>
            <h2>Games Learning Zone</h2>
            <p>Practice fun activities and simple learning tasks.</p>
          </div>

          {/* Play */}
          <div
            className="games-feature-card"
            onClick={() => navigate("games-play")}
          >
            <div className="games-feature-icon gaming-icon">🎮</div>
            <h2>Games Play Zone</h2>
            <p>Play exciting games and improve quickly.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GamesHome;