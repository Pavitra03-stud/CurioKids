import React, { useState } from "react";
import "../styles/SoundTap.css";

const wordsData = [
  { word: "cat", sounds: 3 },
  { word: "dog", sounds: 3 },
  { word: "me", sounds: 2 },
  { word: "sun", sounds: 3 },
  { word: "fish", sounds: 3 }
];

export default function SoundTapGame({ goBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  const currentWord = wordsData[currentIndex];

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.rate = 0.6; // slow for dyslexia
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleSelect = (num) => {
    setSelected(num);

    if (num === currentWord.sounds) {
      setFeedback("Great job! 🌟");
    } else {
      setFeedback("Let's try again slowly 💛");
    }
  };

  const nextWord = () => {
    setSelected(null);
    setFeedback("");
    setCurrentIndex((prev) => (prev + 1) % wordsData.length);
  };

  return (
    <div className="soundtap-container">
       <button className="back-btn" onClick={goBack}>
      ⬅ Back
    </button>
      <h1 className="soundtap-title">Sound Tap Game</h1>

      <div className="soundtap-card">
        <div className="soundtap-word">
          {currentWord.word}
        </div>

        <button className="audio-btn" onClick={speakWord}>
          🔊 Hear Word
        </button>

        <div className="circle-container">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`circle ${selected === num ? "selected" : ""}`}
              onClick={() => handleSelect(num)}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="feedback">{feedback}</div>

        {feedback === "Great job! 🌟" && (
          <button className="next-btn" onClick={nextWord}>
            Next Word
          </button>
        )}
      </div>
    </div>
  );
}