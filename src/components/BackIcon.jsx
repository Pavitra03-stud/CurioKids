import "../styles/BackIcon.css";

export default function BackIcon({ goBack }) {
  return (
    <button className="back-btn" onClick={goBack}>
      ←
    </button>
  );
}
