import { useState, useEffect } from "react";
import "../styles/LearningLetterBlast.css";
import BackIcon from "../components/BackIcon";

export default function LetterBlast({ goBack }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const [target, setTarget] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);

  // generate bubbles
  useEffect(() => {
    generateGame();
  }, []);

  const generateGame = () => {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setTarget(randomLetter);

    const newBubbles = Array.from({ length: 10 }, () => {
      return letters[Math.floor(Math.random() * letters.length)];
    });

    newBubbles[Math.floor(Math.random() * 10)] = randomLetter;
    setBubbles(newBubbles);
  };

  const handleClick = (letter) => {
    if (letter === target) {
      setScore(score + 1);
      generateGame();
    } else {
      alert("Try again!");
    }
  };

  return (
    <div className="blast-page">
      <BackIcon goBack={goBack} />

      <h1>💥 Letter Blast</h1>
      <h2>Find: {target}</h2>
      <h3>Score: {score}</h3>

      <div className="bubble-container">
        {bubbles.map((item, i) => (
          <div
            key={i}
            className="bubble"
            onClick={() => handleClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}