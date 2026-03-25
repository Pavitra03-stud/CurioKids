import { useState, useEffect } from "react";
import "../styles/gameCommon.css";

const words = ["cat", "dog", "sun", "bat"];

export default function CatchWord({ goBack }) {
  const [target, setTarget] = useState(randomWord());
  const [fallingWords, setFallingWords] = useState([]);
  const [message, setMessage] = useState("");

  function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  // 🎯 Generate falling words
  useEffect(() => {
    const interval = setInterval(() => {
      const newWord = {
        text: words[Math.floor(Math.random() * words.length)],
        id: Date.now(),
        left: Math.random() * 80 + "%", // random horizontal position
      };

      setFallingWords((prev) => [...prev, newWord]);

      // remove after 3 seconds
      setTimeout(() => {
        setFallingWords((prev) =>
          prev.filter((w) => w.id !== newWord.id)
        );
      }, 3000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🎯 Click handler
  const handleClick = (wordObj) => {
    if (wordObj.text === target) {
      setMessage("Nice catch! 🎉");
    } else {
      setMessage("Oops! 💛");
    }

    // remove clicked word
    setFallingWords((prev) =>
      prev.filter((w) => w.id !== wordObj.id)
    );
  };

  const next = () => {
    setTarget(randomWord());
    setMessage("");
  };

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">
        <button onClick={goBack}>⬅</button>
        <h1>Catch the Word</h1>
      </div>

      <p className="instruction">
        Catch: <strong>{target}</strong>
      </p>

      {/* Falling Area */}
      <div className="fall-area">
        {fallingWords.map((w) => (
          <div
            key={w.id}
            className="falling-word"
            style={{ left: w.left }}
            onClick={() => handleClick(w)}
          >
            {w.text}
          </div>
        ))}
      </div>

      <h2>{message}</h2>

      {message.includes("Nice") && (
        <button className="next-btn" onClick={next}>
          Next →
        </button>
      )}
    </div>
  );
}