import { useState, useEffect } from "react";
import "../styles/MemoryMatch.css";

const EMOJIS = ["🐶", "🐱", "🐸", "🐵", "🐰", "🦊"];

export default function MemoryMatch({ goBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startGame();
  }, []);

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const doubled = [...EMOJIS, ...EMOJIS];
    const shuffled = shuffle(doubled).map((emoji, index) => ({
      id: index,
      emoji,
    }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMessage("");
  };

  const handleClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setMessage("Amazing! 🎉");
    }
  }, [matched, cards]);

  return (
    <div className="memory-page">

      {/* Header */}
      <div className="memory-header">
        <button className="back-btn" onClick={goBack}>⬅</button>
        <h1>Memory Match</h1>
      </div>

      {/* Instruction */}
      <p className="memory-text">Match the pairs</p>

      {/* Grid */}
      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped =
            flipped.includes(card.id) || matched.includes(card.id);

          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleClick(card)}
            >
              {isFlipped ? card.emoji : "❓"}
            </div>
          );
        })}
      </div>

      {/* Message */}
      <h2 className="feedback">{message}</h2>

      {/* Restart */}
      {message && (
        <button className="next-btn" onClick={startGame}>
          Play Again →
        </button>
      )}
    </div>
  );
}