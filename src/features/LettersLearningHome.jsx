import { useState } from "react";
import BackIcon from "../components/BackIcon";

export default function LettersLearningHome({ goBack }) {

  const alphabet = [
    { letter: "A", word: "Apple", emoji: "🍎" },
    { letter: "B", word: "Ball", emoji: "⚽" },
    { letter: "C", word: "Cat", emoji: "🐱" },
    { letter: "D", word: "Dog", emoji: "🐶" },
    { letter: "E", word: "Elephant", emoji: "🐘" },
    { letter: "F", word: "Fish", emoji: "🐟" },
    { letter: "G", word: "Grapes", emoji: "🍇" },
    { letter: "H", word: "Hat", emoji: "🎩" },
    { letter: "I", word: "Ice Cream", emoji: "🍦" },
    { letter: "J", word: "Juice", emoji: "🧃" }
  ];

  const [index, setIndex] = useState(0);

  const speak = () => {
    const text = `${alphabet[index].letter} for ${alphabet[index].word}`;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const nextLetter = () => {
    if (index < alphabet.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevLetter = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>

      <BackIcon goBack={goBack} />

      <h1>📘 Learn Letters</h1>

      <h2 style={{ fontSize: "80px" }}>
        {alphabet[index].letter}
      </h2>

      <h3 style={{ fontSize: "30px" }}>
        {alphabet[index].emoji} {alphabet[index].word}
      </h3>

      <br />

      <button onClick={speak}>
        🔊 Hear
      </button>

      <br /><br />

      <button onClick={prevLetter}>
        ⬅ Previous
      </button>

      <button onClick={nextLetter} style={{ marginLeft: "10px" }}>
        Next ➡
      </button>

    </div>
  );
}