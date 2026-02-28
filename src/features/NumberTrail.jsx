import "../styles/strawberryCount.css";
import BackIcon from "../components/BackIcon";
import { useState } from "react";
import { speak } from "../utils/speak";

/* 🔢 Better generator */
function generateNumbers() {
  const count = Math.floor(Math.random() * 3) + 4; // 4–6 numbers
  const start = Math.floor(Math.random() * 15) + 1; // 1–15 range
  const numbers = Array.from({ length: count }, (_, i) => start + i);

  // Proper shuffle
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

export default function NumberTrail({ goBack }) {

  const TOTAL_ROUNDS = 5;

  const [numbers, setNumbers] = useState(generateNumbers());
  const [trail, setTrail] = useState([]);
  const [expected, setExpected] = useState(Math.min(...numbers));
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setGameOver(true);
      return;
    }

    const newNumbers = generateNumbers();
    setNumbers(newNumbers);
    setExpected(Math.min(...newNumbers));
    setTrail([]);
    setFeedback("");
    setRound(prev => prev + 1);
  };

  const handleClick = (num) => {

    if (num === expected) {

      speak(num.toString());

      const newTrail = [...trail, num];
      setTrail(newTrail);
      setNumbers(prev => prev.filter(n => n !== num));

      const max = Math.max(...numbers);

      if (num === max) {
        setFeedback("🌟 Amazing! Trail completed!");
        setTimeout(nextRound, 1200);
      } else {
        setExpected(prev => prev + 1);
      }

    } else {

      // Gentle correction
      const nextCorrect = expected;

      setFeedback(
        `🌟 You reached ${trail.length}! Next number was ${nextCorrect}`
      );

      speak("Good try");

      setTimeout(nextRound, 1500);
    }
  };

  const restartGame = () => {
    const newNumbers = generateNumbers();
    setNumbers(newNumbers);
    setExpected(Math.min(...newNumbers));
    setTrail([]);
    setRound(1);
    setFeedback("");
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div className="strawberry-page">

        <div style={{ fontSize: "50px", marginBottom: "20px" }}>
          🦁 Jungle Explorer!
        </div>

        <div style={{ fontSize: "26px", marginBottom: "30px" }}>
          You completed 5 trails and grew stronger each round 🌿
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
          🦁 Number Trail
        </div>
      </div>

      <h2 className="question-text">
        Tap numbers in order!
      </h2>

      {/* TOP NUMBERS */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        marginTop: "40px",
        minHeight: "100px"
      }}>
        {numbers.map((num) => (
          <button
            key={num}
            className="option-btn"
            onClick={() => handleClick(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* TRAIL */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        marginTop: "40px",
        minHeight: "100px"
      }}>
        {trail.map((num, index) => (
          <div
            key={index}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#4CAF50",
              color: "white",
              fontSize: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* FEEDBACK */}
      <div style={{ marginTop: "25px", fontSize: "22px", minHeight: "40px" }}>
        {feedback}
      </div>

      <div style={{ marginTop: "10px", fontSize: "20px" }}>
        Round {round} of {TOTAL_ROUNDS}
      </div>

    </div>
  );
}