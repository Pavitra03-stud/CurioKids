import { useState, useEffect } from "react";
import "../styles/AnimalPathLetters.css";

const DATA = [
  { letter: "A", word: "Ant", emoji: "🐜" },
  { letter: "B", word: "Bear", emoji: "🐻" },
  { letter: "C", word: "Cat", emoji: "🐱" },
  { letter: "D", word: "Dog", emoji: "🐶" },
  { letter: "E", word: "Elephant", emoji: "🐘" }
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function AnimalPathGame() {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("Choose the correct letter");

  const current = DATA[step];

  // 🔊 Voice
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const others = DATA.filter((d) => d.letter !== current.letter);
    const random = shuffle(others).slice(0, 2);
    setOptions(shuffle([current, ...random]));

    speak(`${current.letter} for ${current.word}`);
  }, [step]);

  const handleClick = (item) => {
    if (item.letter === current.letter) {
      setMessage("Yay! Move forward 🎉");
      speak("Correct");

      setTimeout(() => {
        if (step < DATA.length - 1) {
          setStep(step + 1);
        } else {
          setMessage("You reached the end! 🏁");
          speak("You finished");
        }
      }, 800);
    } else {
      setMessage("Try again 😊");
      speak("Try again");
    }
  };

  return (
    <div className="path-container">

      <h1>🐾 Animal Path Game</h1>

      {/* 🛤️ PATH */}
      <div className="path">
        {DATA.map((_, index) => (
          <div key={index} className="step">
            <div className={`circle ${index <= step ? "active" : ""}`}>
              {index === step && (
                <span className="animal">🐜</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🎯 CURRENT CARD */}
      <div className="card">
        <div className="emoji">{current.emoji}</div>
        <h2>{current.word}</h2>
      </div>

      {/* 🔘 OPTIONS */}
      <div className="options">
        {options.map((item) => (
          <button
            key={item.letter}
            onClick={() => handleClick(item)}
            className="option-btn"
          >
            {item.letter}
          </button>
        ))}
      </div>

      <p>{message}</p>

    </div>
  );
}