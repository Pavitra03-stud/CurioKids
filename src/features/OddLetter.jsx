import React, { useState } from "react";
import "../styles/OddLetter.css";

export default function OddLetter({ goBack }) {
  const questions = [
    { letters: ["b", "d", "b", "b"], answer: "d" },
    { letters: ["p", "p", "q", "p"], answer: "q" },
    { letters: ["a", "a", "a", "e"], answer: "e" },
    { letters: ["m", "n", "m", "m"], answer: "n" }
  ];

  const [current, setCurrent] = useState(0);
  const [message, setMessage] = useState("");

  const handleClick = (letter) => {
    if (letter === questions[current].answer) {
      setMessage("✅ Correct!");
      setTimeout(() => {
        setMessage("");
        setCurrent((prev) => (prev + 1) % questions.length);
      }, 1000);
    } else {
      setMessage("❌ Try Again!");
    }
  };

  return (
    <div className="odd-container">
      <button className="back-btn" onClick={goBack}>⬅ Back</button>

      <h1>Find the Odd Letter</h1>

      <div className="letters-box">
        {questions[current].letters.map((letter, index) => (
          <button
            key={index}
            className="letter-btn"
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <p className="message">{message}</p>
    </div>
  );
}