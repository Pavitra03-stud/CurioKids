import BackIcon from "../components/BackIcon";
import "../styles/numbersZone.css";

export default function NumbersGameHome({ navigate, goBack }) {

  return (
    <div className="numbers-zone-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🎮 Numbers Game Zone
        </div>
      </div>

      <div className="zone-container">

        <div onClick={() => navigate("strawberry-count")} className="zone-card">
          🍓 Strawberry Count
        </div>

        <div onClick={() => navigate("number-trail")} className="zone-card">
          🌿 Number Trail
        </div>

        <div onClick={() => navigate("frog-jump")} className="zone-card">
          🐸 Frog Jump
        </div>

        <div onClick={() => navigate("compare-safari")} className="zone-card">
          🦓 Compare Safari
        </div>

        <div onClick={() => navigate("skip-count")} className="zone-card">
          🔁 Skip Counting
        </div>

        <div onClick={() => navigate("number-line")} className="zone-card">
          📏 Number Line Move
        </div>

      </div>

    </div>
  );
}