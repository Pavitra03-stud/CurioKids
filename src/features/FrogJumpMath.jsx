import "../styles/strawberryCount.css";
import BackIcon from "../components/BackIcon";
import { useState, useEffect } from "react";
import { speak } from "../utils/speak";

function generateQuestion() {
  const num1 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  const correct = num1 + num2;

  const options = new Set([correct]);
  while (options.size < 3) {
    options.add(Math.floor(Math.random() * 10) + 1);
  }

  return {
    num1,
    num2,
    correct,
    options: [...options].sort(() => Math.random() - 0.5)
  };
}

export default function FrogJumpMath({ goBack }) {

  const TOTAL_ROUNDS = 5;

  const [question, setQuestion] = useState(generateQuestion());
  const [round, setRound] = useState(1);
  const [showSecondGroup, setShowSecondGroup] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setShowSecondGroup(false);

    const timer = setTimeout(() => {
      setShowSecondGroup(true);
    }, 800); // second group appears after 0.8 sec

    return () => clearTimeout(timer);
  }, [question]);

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    setQuestion(generateQuestion());
    setFeedback("");
    setRound(prev => prev + 1);
  };

  const handleAnswer = (num) => {

    if (num === question.correct) {
      speak("Correct!");
      setFeedback("🐸 Yes! The frog counted correctly!");
      setTimeout(nextRound, 1200);
    } else {
      speak("Try again");
      setFeedback("🌿 Count both groups carefully.");
    }
  };

  if (gameOver) {
    return (
      <div className="strawberry-page">
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>
          🐸 Pond Star!
        </div>
        <button className="option-btn" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="strawberry-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🐸 Frog Jump Addition
        </div>
      </div>

      <h2 className="question-text">
        The frog sees some flies...
      </h2>

      {/* First Group */}
      <div style={{ fontSize: "60px", marginTop: "40px" }}>
        {"🪰".repeat(question.num1)}
      </div>

      {/* Second Group Appears */}
      {showSecondGroup && (
        <div style={{ fontSize: "60px", marginTop: "20px" }}>
          {"🪰".repeat(question.num2)}
        </div>
      )}

      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        How many flies are there now?
      </div>

      {/* Options */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        marginTop: "40px"
      }}>
        {question.options.map((num) => (
          <button
            key={num}
            className="option-btn"
            onClick={() => handleAnswer(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: "25px",
        fontSize: "22px",
        minHeight: "40px"
      }}>
        {feedback}
      </div>

      <div style={{ marginTop: "10px", fontSize: "20px" }}>
        Round {round} of {TOTAL_ROUNDS}
      </div>

    </div>
  );
}