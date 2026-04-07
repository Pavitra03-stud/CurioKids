import React from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import BackIcon from "../components/BackIcon";
import "../styles/numbersZone.css";

export default function NumbersHome({ goBack }) {
  const navigate = useNavigate();   // ✅ ADD THIS

  return (
    <div className="numbers-zone-page">

      {/* Header */}
      <div className="numbers-zone-header">
        <div className="navbar-left">
          <BackIcon goBack={goBack ? goBack : () => navigate(-1)} />
        </div>
        <h1>🔢 Numbers</h1>
      </div>

      {/* Cards */}
      <div className="zone-container">

        {/* Learning */}
        <div
          className="zone-card"
          onClick={() => {
            console.log("Numbers Learning clicked");
            navigate("/numbers-learning-home");   // ✅ UPDATED
          }}
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
          onClick={() => {
            console.log("Numbers Gaming clicked");
            navigate("/numbers-game-home");   // ✅ UPDATED
          }}
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