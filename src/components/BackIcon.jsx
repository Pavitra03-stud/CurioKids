import "../styles/BackIcon.css";

export default function BackIcon({ goBack }) {
  if (!goBack) return null;

  return (
    <button
      onClick={goBack}
      className="back-icon"
      aria-label="Go back"
    >
      ⬅
    </button>
  );
}
