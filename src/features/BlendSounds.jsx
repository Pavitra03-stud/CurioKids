import { useState } from "react";
import "../styles/BlendSounds.css";

const questions = [
  {
    sounds: ["c", "a", "t"],
    options: ["cat", "cap", "can"],
    answer: "cat"
  },
  {
    sounds: ["d", "o", "g"],
    options: ["dig", "dog", "dot"],
    answer: "dog"
  },
  {
    sounds: ["p", "e", "n"],
    options: ["pen", "pan", "pin"],
    answer: "pen"
  }
];

export default function BlendSounds() {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");

  const q = questions[index];

  const checkAnswer = (option) => {
    if (option === q.answer) {
      setMessage("✅ Correct!");
      setTimeout(() => {
        setMessage("");
        setIndex((prev) => (prev + 1) % questions.length);
      }, 1200);
    } else {
      setMessage("❌ Try again!");
    }
  };

  return (
    <div className="blend-container">
      <h2>🔊 Blend the Sounds</h2>

      <div className="sounds">
        {q.sounds.map((s, i) => (
          <span key={i} className="sound-box">
            {s}
          </span>
        ))}
      </div>

      <div className="options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => checkAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="message">{message}</p>
    </div>
  );
}