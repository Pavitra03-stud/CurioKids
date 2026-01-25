import "../styles/GameButton.css";

export default function GameButton({ text, onClick }) {
  return (
    <button className="game-button" onClick={onClick}>
      {text}
    </button>
  );
}
