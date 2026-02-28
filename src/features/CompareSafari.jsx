import { useState } from "react";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";
import "../styles/compareSafari.css";

function generateQuestion() {
  const left = Math.floor(Math.random() * 6) + 1;
  const right = Math.floor(Math.random() * 6) + 1;
  return { left, right };
}

export default function CompareSafari({ goBack }) {
  const TOTAL_ROUNDS = 5;

  const [question, setQuestion] = useState(generateQuestion());
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [selected, setSelected] = useState(null);
  const [correctSide, setCorrectSide] = useState(null);

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    setQuestion(generateQuestion());
    setRound(prev => prev + 1);
    setMessage("");
    setSelected(null);
    setCorrectSide(null);
  };

  const handleChoice = (side) => {
    const { left, right } = question;

    let correct = "equal";
    if (left > right) correct = "left";
    if (right > left) correct = "right";

    setSelected(side);
    setCorrectSide(correct);

    if (side === correct) {
      speak("Great job");
      setScore(prev => prev + 1);
      setMessage("Correct! 🌟");
    } else {
      speak("Nice try");
      setMessage("Try again next round 🌿");
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
    setCorrectSide(null);
  };

  if (gameOver) {
    return (
      <div className="safari-page">
        <div className="finish-title">🦓 Safari Complete!</div>
        <div className="score-text">
          You scored {score} / {TOTAL_ROUNDS}
        </div>

        <button className="play-btn" onClick={restartGame}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="safari-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">🦓 Compare Safari</div>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
        />
      </div>

      <h2 className="question-text">
        Tap the jungle with more trees 🌴
      </h2>

      <div className="jungle-container">

        {/* LEFT */}
        <div
          className={`jungle-box 
            ${selected === "left" && correctSide === "left" ? "correct" : ""}
            ${selected === "left" && correctSide !== "left" ? "wrong" : ""}
          `}
          onClick={() => handleChoice("left")}
        >
          {Array.from({ length: question.left }).map((_, i) => (
            <span key={i} className="tree">🌴</span>
          ))}
        </div>

        {/* EQUAL OPTION */}
        {question.left === question.right && (
          <div
            className={`equal-box 
              ${selected === "equal" ? "correct" : ""}
            `}
            onClick={() => handleChoice("equal")}
          >
            Equal
          </div>
        )}

        {/* RIGHT */}
        <div
          className={`jungle-box 
            ${selected === "right" && correctSide === "right" ? "correct" : ""}
            ${selected === "right" && correctSide !== "right" ? "wrong" : ""}
          `}
          onClick={() => handleChoice("right")}
        >
          {Array.from({ length: question.right }).map((_, i) => (
            <span key={i} className="tree">🌴</span>
          ))}
        </div>

      </div>

      <p className="result-text">{message}</p>

      <div className="round-text">
        Round {round} of {TOTAL_ROUNDS}
      </div>

    </div>
  );
}