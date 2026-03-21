import "../styles/BackIcon.css";

export default function BackIcon({ goBack, onClick }) {
  return (
    <button
      className="back-btn"
      onClick={onClick || goBack}
    >
      ←
    </button>
  );
}