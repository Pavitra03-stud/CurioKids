import "../styles/strawberryCount.css";
import BackIcon from "../components/BackIcon";
import { useState } from "react";
import { speak } from "../utils/speak";

function generateQuestion() {
  const start = Math.floor(Math.random() * 6) + 1;
  const sequence = [start, start + 1, start + 2, start + 3];
  const missingIndex = Math.floor(Math.random() * 4);
  const correctAnswer = sequence[missingIndex];

  sequence[missingIndex] = "_";

  return { sequence, correctAnswer };
}

function generateOptions(correct) {
  const options = new Set([correct]);
  while (options.size < 3) {
    options.add(Math.floor(Math.random() * 10) + 1);
  }
  return [...options].sort(() => Math.random() - 0.5);
}

export default function MissingNumber({ goBack }) {

  const TOTAL_QUESTIONS = 5;

  const [question, setQuestion] = useState(generateQuestion());
  const [options, setOptions] = useState(generateOptions(question.correctAnswer));
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const nextRound = () => {
    if (round >= TOTAL_QUESTIONS) {
      setGameOver(true);
      return;
    }

    const newQuestion = generateQuestion();
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.correctAnswer));
    setRound(round + 1);
    setMessage("");
  };

  const checkAnswer = (num) => {
    if (num === question.correctAnswer) {
      setScore(score + 1);
      setMessage("Great Job! 🎉");
      speak("Great job");
      setTimeout(nextRound, 800);
    } else {
      setMessage("Try Again 😊");
      speak("Try again");
    }
  };

  const restartGame = () => {
    const newQuestion = generateQuestion();
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.correctAnswer));
    setScore(0);
    setRound(1);
    setGameOver(false);
    setMessage("");
  };

  if (gameOver) {
    return (
      <div className="strawberry-page">
        <div style={{ fontSize: "50px", marginBottom: "20px" }}>
          🎉 Game Complete!
        </div>

        <div style={{ fontSize: "35px", marginBottom: "30px" }}>
          Your Score: {score} / {TOTAL_QUESTIONS}
        </div>

        <button className="option-btn" onClick={restartGame}>
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
          🐯 Missing Number
        </div>
      </div>

      <div style={{ fontSize: "60px", margin: "40px" }}>
        {question.sequence.map((num, index) => (
          <span key={index} style={{ margin: "20px" }}>
            {num}
          </span>
        ))}
      </div>

      <h3 className="question-text">
        Question {round} of {TOTAL_QUESTIONS}
      </h3>

      <div className="option-row">
        {options.map((num) => (
          <button
            key={num}
            className="option-btn"
            onClick={() => checkAnswer(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <p className="result-text">{message}</p>

    </div>
  );
}