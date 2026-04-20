import React from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../components/BackIcon";
import "../styles/NumbersHome.css";

export default function NumbersHome({ goBack }) {
  const navigate = useNavigate();

  return (
    <div className="numbers-home-page">
      <div className="numbers-home-header">
        <button
          className="numbers-back-btn"
          onClick={goBack ? goBack : () => navigate(-1)}
        >
          <BackIcon goBack={goBack ? goBack : () => navigate(-1)} />
        </button>
        <h1>🔢 Numbers Home</h1>
      </div>

      <div className="numbers-home-content">
        <p className="numbers-home-subtitle">
          Choose a fun zone and start learning
        </p>

        <div className="numbers-cards-grid">
          <div
            className="numbers-feature-card"
            onClick={() => navigate("/numbers-learning-home")}
          >
            <div className="numbers-feature-icon learning-icon">📚</div>
            <h2>Learning Zone</h2>
            <p>Learn numbers with fun concepts</p>
          </div>

          <div
            className="numbers-feature-card"
            onClick={() => navigate("/numbers-game-home")}
          >
            <div className="numbers-feature-icon gaming-icon">🎮</div>
            <h2>Game Zone</h2>
            <p>Play games and improve your skills</p>
          </div>
        </div>
      </div>
    </div>
  );
}