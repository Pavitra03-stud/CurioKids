import BackIcon from "../components/BackIcon";
import "../styles/numbersZone.css";

export default function NumbersLearningHome({ navigate, goBack }) {

  return (
    <div className="numbers-zone-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          📚 Numbers Learning Zone
        </div>
      </div>

      <div className="zone-container">

        <div
          className="zone-card"
          onClick={() => navigate("concept-what-is-a-number")}
        >
          🔢 What is a Number?
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("concept-bigger-smaller")}
        >
          📏 Bigger & Smaller
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("concept-number-line")}
        >
          ➡ Number Line Basics
        </div>

        <div
          className="zone-card"
          onClick={() => navigate("concept-skip-counting")}
        >
          🔁 Skip Counting Concept
        </div>

      </div>

    </div>
  );
}