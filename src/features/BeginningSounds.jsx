import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/BeginningSounds.css";

const wordBank = [
  { word: "Dog", sound: "D", emoji: "🐶" },
  { word: "Cat", sound: "C", emoji: "🐱" },
  { word: "Ball", sound: "B", emoji: "⚽" },
  { word: "Monkey", sound: "M", emoji: "🐵" },
  { word: "Fish", sound: "F", emoji: "🐟" },
  { word: "Sun", sound: "S", emoji: "☀️" },
  { word: "Lion", sound: "L", emoji: "🦁" },
  { word: "Apple", sound: "A", emoji: "🍎" }
];

export default function BeginningSounds({ goBack }) {

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);

  const getRandomWord = () =>
    wordBank[Math.floor(Math.random() * wordBank.length)];

  const [currentWord, setCurrentWord] = useState(getRandomWord());

  const generateOptions = (correctSound) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const wrong = letters
      .filter((l) => l !== correctSound)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [...wrong, correctSound].sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState(
    generateOptions(currentWord.sound)
  );

  const nextRound = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setOptions(generateOptions(newWord.sound));
    setFeedback("");
  };

  const handleClick = (letter) => {
    if (letter === currentWord.sound) {
      setFeedback("correct");
      setScore((prev) => prev + 10);
      setProgress((prev) => prev + 1);

      setTimeout(() => {
        if (progress + 1 >= 5) {
          setLevelComplete(true);
        } else {
          nextRound();
        }
      }, 700);
    } else {
      setFeedback("wrong");
    }
  };

  const startNextLevel = () => {
    setLevel((prev) => prev + 1);
    setProgress(0);
    setLevelComplete(false);
    nextRound();
  };

  if (levelComplete) {
    return (
      <div className="phonics-page">
        <div className="letter-navbar">
          <BackIcon goBack={goBack} />
          <h2>🎉 Level {level} Complete!</h2>
        </div>

        <div className="level-card">
          <h3>Your Score: {score}</h3>

          {level < 3 ? (
            <button className="next-level-btn" onClick={startNextLevel}>
              🚀 Start Level {level + 1}
            </button>
          ) : (
            <h2>🏆 You Finished All Levels!</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="phonics-page">
      <div className="letter-navbar">
        <BackIcon goBack={goBack} />
        <h2>🔊 Beginning Sounds</h2>
      </div>

      <div className="game-info">
        <span>Level: {level}</span>
        <span>Score: {score}</span>
        <span>Progress: {progress}/5</span>
      </div>

      <div className="word-display">
        <div className="emoji">{currentWord.emoji}</div>
        <h2>{currentWord.word}</h2>
      </div>

      <h3>What sound does it start with?</h3>

      <div className="options-grid">
        {options.map((letter, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {feedback === "correct" && (
        <div className="feedback good">🎉 Correct!</div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong">❌ Try Again</div>
      )}
    </div>
  );
}