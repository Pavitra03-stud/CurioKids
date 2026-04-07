import React from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import BackIcon from "../components/BackIcon";
import "../styles/numbersZone.css";

export default function NumbersLearningHome({ goBack }) {
  const navigate = useNavigate();   // ✅ ADD THIS

  return (
    <div className="numbers-zone-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack ? goBack : () => navigate(-1)} />
        </div>
        <div className="navbar-title">
          📚 Numbers Learning Zone
        </div>
      </div>

      <div className="zone-container">

        <div
          className="zone-card"
          onClick={() => navigate("/concept-what-is-a-number")}   // ✅ UPDATED
        >
          🔢 What is a Number?
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("/concept-bigger-smaller")}   // ✅ UPDATED
        >
          📏 Bigger & Smaller
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("/concept-number-line")}   // ✅ UPDATED
        >
          ➡ Number Line Basics
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("/concept-skip-counting")}   // ✅ UPDATED
        >
          🔁 Skip Counting Concept
        </div>

      </div>

    </div>
  );
}