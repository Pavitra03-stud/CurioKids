import React, { useEffect, useState } from "react";
import "../styles/BiggerSmallerGame.css";

function getDifferentNumbers() {
  const first = Math.floor(Math.random() * 10) + 1;
  let second = Math.floor(Math.random() * 10) + 1;

  while (second === first) {
    second = Math.floor(Math.random() * 10) + 1;
  }

  return [first, second];
}

function getQuestionType() {
  return Math.random() > 0.5 ? "bigger" : "smaller";
}

export default function BiggerSmallerGame() {
  const [leftNumber, setLeftNumber] = useState(0);
  const [rightNumber, setRightNumber] = useState(0);
  const [questionType, setQuestionType] = useState("bigger");
  const [message, setMessage] = useState("Tap the correct number.");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const generateRound = () => {
    const [first, second] = getDifferentNumbers();
    setLeftNumber(first);
    setRightNumber(second);
    setQuestionType(getQuestionType());
    setMessage("Tap the correct number.");
    setAnswered(false);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (selectedNumber) => {
    if (answered) return;

    const correctNumber =
      questionType === "bigger"
        ? Math.max(leftNumber, rightNumber)
        : Math.min(leftNumber, rightNumber);

    if (selectedNumber === correctNumber) {
      setMessage(
        `✅ Good job! ${correctNumber} is ${
          questionType === "bigger" ? "bigger" : "smaller"
        }.`
      );
      setScore((prev) => prev + 1);
    } else {
      setMessage(
        `❌ Try again next round! Correct answer is ${correctNumber}.`
      );
    }

    setAnswered(true);
  };

  const handleReset = () => {
    setScore(0);
    generateRound();
  };

  const handleNext = () => {
    generateRound();
  };

  return (
    <div className="bigger-page">
      <div className="bigger-card">
        <div className="top-bar">
          <h1>🔢 Bigger & Smaller</h1>
          <p>Tap the correct number</p>
        </div>

        <div className="question-box">
          <h2>
            Tap the {questionType === "bigger" ? "bigger" : "smaller"} number
          </h2>
        </div>

        <div className="numbers-box">
          <button
            className="number-button"
            onClick={() => handleAnswer(leftNumber)}
            disabled={answered}
          >
            {leftNumber}
          </button>

          <button
            className="number-button"
            onClick={() => handleAnswer(rightNumber)}
            disabled={answered}
          >
            {rightNumber}
          </button>
        </div>

        <div className="message-box">
          <p>{message}</p>
        </div>

        <div className="score-box">
          <span>Score: {score}</span>
        </div>

        <div className="button-group">
          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}