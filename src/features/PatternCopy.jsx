import { useState, useEffect } from "react";
import "../styles/PatternCopy.css";

const COLORS = ["🔴", "🔵", "🟢", "🟡"];

export default function PatternCopy({ goBack }) {
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [showPattern, setShowPattern] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generatePattern();
  }, []);

  const generatePattern = () => {
    const newPattern = Array.from({ length: 3 }, () =>
      COLORS[Math.floor(Math.random() * COLORS.length)]
    );
    setPattern(newPattern);
    setUserInput([]);
    setShowPattern(true);
    setMessage("");

    setTimeout(() => setShowPattern(false), 2000);
  };

  const handleClick = (color) => {
    if (showPattern) return;

    const newInput = [...userInput, color];
    setUserInput(newInput);

    if (newInput.length === pattern.length) {
      if (JSON.stringify(newInput) === JSON.stringify(pattern)) {
        setMessage("Great job! 🌟");
      } else {
        setMessage("Try again 💛");
      }
    }
  };

  return (
    <div className="pattern-page">

      {/* Header */}
      <div className="pattern-header">
        <button className="back-btn" onClick={goBack}>⬅</button>
        <h1>Pattern Copy Game</h1>
      </div>

      {/* Instruction */}
      <p className="pattern-text">
        {showPattern ? "Remember the pattern" : "Repeat the pattern"}
      </p>

      {/* Pattern Display */}
      <div className="pattern-box">
        {showPattern
          ? pattern.map((c, i) => <span key={i}>{c}</span>)
          : userInput.map((c, i) => <span key={i}>{c}</span>)
        }
      </div>

      {/* Choices */}
      <div className="color-options">
        {COLORS.map((c, i) => (
          <div
            key={i}
            className="color-btn"
            onClick={() => handleClick(c)}
          >
            {c}
          </div>
        ))}
      </div>

      {/* Feedback */}
      <h2 className="feedback">{message}</h2>

      {/* Next */}
      {message && (
        <button className="next-btn" onClick={generatePattern}>
          Next →
        </button>
      )}
    </div>
  );
}