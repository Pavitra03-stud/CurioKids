import "../styles/strawberryCount.css";
import BackIcon from "../components/BackIcon";
import { useState } from "react";
import { speak } from "../utils/speak";

function getRandomCount() {
  return Math.floor(Math.random() * 5) + 1; // 1–5
}

function generateOptions(correct) {
  const options = new Set([correct]);
  while (options.size < 3) {
    options.add(Math.floor(Math.random() * 5) + 1);
  }
  return [...options].sort(() => Math.random() - 0.5);
}

export default function StrawberryCount({ goBack }) {

  const [answer, setAnswer] = useState(getRandomCount());
  const [options, setOptions] = useState(generateOptions(answer));
  const [message, setMessage] = useState("");

  const nextRound = () => {
    const newAns = getRandomCount();
    setAnswer(newAns);
    setOptions(generateOptions(newAns));
    setMessage("");
  };

  const checkAnswer = (num) => {
    if (num === answer) {
      setMessage("Great Job! 🎉");
      speak("Great job");
      setTimeout(nextRound, 1000);
    } else {
      setMessage("Try again 😊");
      speak("Try again");
    }
  };

  return (
    <div className="strawberry-page">

      {/* NAVBAR */}
      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>

        <div className="navbar-title">
          🍓 Strawberry Count
        </div>
      </div>

      {/* STRAWBERRIES */}
      <div className="strawberry-box">
        {"🍓".repeat(answer)}
      </div>

      <h3>How many strawberries?</h3>

      {/* OPTIONS */}
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

      {/* MESSAGE */}
      <p className="result-text">{message}</p>

    </div>
  );
}