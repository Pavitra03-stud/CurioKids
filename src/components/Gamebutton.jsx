import "../styles/GameButton.css";

export default function GameButton({ text, onClick }) {
  return (
    <button className="game-btn" onClick={onClick}>
      {text}
    </button>
  );
}
