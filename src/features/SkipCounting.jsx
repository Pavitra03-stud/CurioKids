import { useState } from "react";
import "../styles/skipCounting.css";
import { speak } from "../utils/speak";
import BackIcon from "../components/BackIcon";

const TOTAL_ROUNDS = 5;

function generateQuestion() {
  const steps = [2, 3, 5];
  const step = steps[Math.floor(Math.random() * steps.length)];
  const start = Math.floor(Math.random() * 10) + 1;

  const sequence = [];
  for (let i = 0; i < 5; i++) {
    sequence.push(start + i * step);
  }

  const missingIndex = Math.floor(Math.random() * 5);
  const correctAnswer = sequence[missingIndex];

  const displaySequence = [...sequence];
  displaySequence[missingIndex] = "?";

  const options = new Set();
  options.add(correctAnswer);

  while (options.size < 4) {
    const randomOffset = Math.floor(Math.random() * 6) - 3;
    const fakeOption = correctAnswer + randomOffset;
    if (fakeOption > 0) {
      options.add(fakeOption);
    }
  }

  return {
    step,
    displaySequence,
    correctAnswer,
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
}

export default function SkipCounting({ goBack }) {

  const [question, setQuestion] = useState(generateQuestion());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    setQuestion(generateQuestion());
    setRound(prev => prev + 1);
    setSelected(null);
    setMessage("");
    setLocked(false);
  };

  const handleAnswer = (value) => {
    if (locked) return;
    setLocked(true);
    setSelected(value);

    if (value === question.correctAnswer) {
      speak("Correct");
      setScore(prev => prev + 1);
      setMessage("Correct! 🐵");
    } else {
      speak("Try again");
      setMessage("Oops! Try the next one 🌿");
    }

    setTimeout(nextRound, 1200);
  };

  const restartGame = () => {
    setQuestion(generateQuestion());
    setRound(1);
    setScore(0);
    setGameOver(false);
    setMessage("");
    setSelected(null);
    setLocked(false);
  };

  if (gameOver) {
    return (
      <div className="skip-page">

        <div className="practice-navbar">
          <div className="navbar-left">
            <BackIcon goBack={goBack} />
          </div>
          <div className="navbar-title">
            🐒 Skip Counting
          </div>
        </div>

        <h1>Great Work!</h1>
        <h2>Score: {score} / {TOTAL_ROUNDS}</h2>

        <button onClick={restartGame} className="play-btn">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="skip-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🐒 Skip Counting
        </div>
      </div>

      <h2>Count by {question.step}s</h2>

      <div className="sequence-box">
        {question.displaySequence.map((num, i) => (
          <div key={i} className="sequence-item">
            {num}
          </div>
        ))}
      </div>

      <div className="options-container">
        {question.options.map((option, i) => (
          <button
            key={i}
            disabled={locked}
            className={`option-btn ${
              selected === option
                ? option === question.correctAnswer
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="result-text">{message}</p>

      <div className="round-text">
        Round {round} of {TOTAL_ROUNDS}
      </div>

    </div>
  );
}