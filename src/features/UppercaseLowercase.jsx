import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/UppercaseLowercase.css";

export default function UppercaseLowercase({ goBack }) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");

  const getRandomLetter = () =>
    uppercase[Math.floor(Math.random() * uppercase.length)];

  const [currentUpper, setCurrentUpper] = useState(getRandomLetter());
  const [feedback, setFeedback] = useState("");

  const generateOptions = (upper) => {
    const correctLower = upper.toLowerCase();

    const wrongOptions = lowercase
      .filter((l) => l !== correctLower)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [...wrongOptions, correctLower].sort(
      () => 0.5 - Math.random()
    );
  };

  const [options, setOptions] = useState(
    generateOptions(currentUpper)
  );

  const handleClick = (selected) => {
    if (selected === currentUpper.toLowerCase()) {
      setFeedback("correct");

      setTimeout(() => {
        const newUpper = getRandomLetter();
        setCurrentUpper(newUpper);
        setOptions(generateOptions(newUpper));
        setFeedback("");
      }, 800);
    } else {
      setFeedback("wrong");
    }
  };

  return (
    <div className="case-page">
      <div className="letter-navbar">
        <BackIcon goBack={goBack} />
        <h2>🔤 Uppercase vs Lowercase</h2>
      </div>

      <div className="instruction">
        Match the lowercase letter:
      </div>

      <div className="big-letter">
        {currentUpper}
      </div>

      <div className="options-grid">
        {options.map((letter) => (
          <button
            key={letter}
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