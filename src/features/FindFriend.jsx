import { useState, useEffect } from "react";
import "../styles/FindFriend.css";

export default function FindFriend({ goBack }) {
  const [items, setItems] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generateGame();
  }, []);

  const generateGame = () => {
    const base = "🐶";
    const odd = "🐱";

    let arr = Array(6).fill(base);
    const randomIndex = Math.floor(Math.random() * 6);
    arr[randomIndex] = odd;

    setItems(arr);
    setCorrectIndex(randomIndex);
    setMessage("");
  };

  const handleClick = (index) => {
    if (index === correctIndex) {
      setMessage("Great job! 🌟");
    } else {
      setMessage("Try again 💛");
    }
  };

  return (
    <div className="find-page">

      {/* Header */}
      <div className="find-header">
        <button className="back-btn" onClick={goBack}>⬅</button>
        <h1>Find the Friend</h1>
      </div>

      {/* Instruction */}
      <p className="find-text">Find the different one</p>

      {/* Grid */}
      <div className="find-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className="find-cell"
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Feedback */}
      <h2 className="feedback">{message}</h2>

      {/* Next */}
      {message === "Great job! 🌟" && (
        <button className="next-btn" onClick={generateGame}>
          Next →
        </button>
      )}
    </div>
  );
}