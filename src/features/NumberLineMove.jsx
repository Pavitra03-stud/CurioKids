import { useState } from "react";
import "../styles/numberLineMove.css";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";

const TOTAL_ROUNDS = 5;

function generateQuestion() {
  const start = Math.floor(Math.random() * 10) + 5; // 5–14 safer range
  const step = Math.floor(Math.random() * 4) + 1;   // 1–4
  const direction = Math.random() > 0.5 ? "forward" : "backward";

  const target =
    direction === "forward" ? start + step : start - step;

  return { start, step, direction, target };
}

export default function NumberLineMove({ goBack }) {

  const [question, setQuestion] = useState(generateQuestion());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
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

  const handleClick = (num) => {
    if (locked) return;
    setLocked(true);
    setSelected(num);

    if (num === question.target) {
      speak("Correct");
      setScore(prev => prev + 1);
      setMessage("Great jump! 🐸");
    } else {
      speak("Try again");
      setMessage("Oops! Try next round 🌿");
    }

    setTimeout(nextRound, 1200);
  };

  const restartGame = () => {
    setQuestion(generateQuestion());
    setRound(1);
    setScore(0);
    setGameOver(false);
    setSelected(null);
    setMessage("");
    setLocked(false);
  };

  const numbers = Array.from({ length: 21 }, (_, i) => i);

  if (gameOver) {
    return (
      <div className="numberline-page">

        <div className="practice-navbar">
          <div className="navbar-left">
            <BackIcon goBack={goBack} />
          </div>
          <div className="navbar-title">
            📏 Number Line Move
          </div>
        </div>

        <h1>Well Done!</h1>
        <h2>Score: {score} / {TOTAL_ROUNDS}</h2>

        <button className="play-btn" onClick={restartGame}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="numberline-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          📏 Number Line Move
        </div>
      </div>

      <h2>
        Start at <strong>{question.start}</strong> and move{" "}
        <strong>{question.direction}</strong> {question.step}
      </h2>

      <div className="number-line">
        {numbers.map((num) => (
          <div
            key={num}
            className={`number-node 
              ${num === question.start ? "start" : ""}
              ${selected === num
                ? num === question.target
                  ? "correct"
                  : "wrong"
                : ""}
            `}
            onClick={() => handleClick(num)}
          >
            {num}
          </div>
        ))}
      </div>

      <p className="result-text">{message}</p>

      <div className="round-text">
        Round {round} of {TOTAL_ROUNDS}
      </div>

    </div>
  );
}