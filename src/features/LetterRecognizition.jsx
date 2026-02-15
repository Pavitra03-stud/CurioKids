import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";
import "../styles/ConfusingLetters.css";

export default function LetterRecognition({ goBack }) {

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const randomLetter =
      alphabet[Math.floor(Math.random() * alphabet.length)];

    const shuffled = [...alphabet]
      .sort(() => 0.5 - Math.random())
      .slice(0, 7);

    if (!shuffled.includes(randomLetter)) {
      shuffled[0] = randomLetter;
    }

    setTarget(randomLetter);
    setOptions(shuffled.sort(() => 0.5 - Math.random()));
    speak(`Click the letter ${randomLetter}`);
  };

  const handleClick = (letter) => {
    if (roundCompleted) return;

    if (letter === target) {
      const newCount = correctCount + 1;
      setCorrectCount(newCount);

      speak("Great job!");

      if (newCount >= 5) {
        completeRound();
      } else {
        generateQuestion();
      }
    } else {
      speak("Try again");
    }
  };

  const completeRound = () => {
    setRoundCompleted(true);
    speak("Amazing! You completed this round!");

    const existing = JSON.parse(localStorage.getItem("aiProgress")) || {
      roundsCompleted: 0,
      rewards: [],
    };

    existing.roundsCompleted += 1;
    existing.rewards.push("⭐ Letter Recognition Star");

    localStorage.setItem("aiProgress", JSON.stringify(existing));
  };

  const nextRound = () => {
    setCorrectCount(0);
    setRoundCompleted(false);
    generateQuestion();
  };

  return (
    <div className="confusing-page">

      <div className="confusing-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🔤 Letter Recognition
        </div>
      </div>

      <div className="confusing-content">

        {!roundCompleted ? (
          <>
            <h2 className="instruction">
              Click the letter:
              <span className="target"> {target}</span>
            </h2>

            <div className="letters-grid">
              {options.map((letter, index) => (
                <div
                  key={index}
                  className="letter-box"
                  onClick={() => handleClick(letter)}
                >
                  {letter}
                </div>
              ))}
            </div>

            <div className="score">
              ⭐ Correct: {correctCount} / 5
            </div>
          </>
        ) : (
          <>
            <h2 className="instruction">
              🎉 Round Complete!
            </h2>

            <button className="next-btn" onClick={nextRound}>
              Next Round 🔄
            </button>
          </>
        )}

      </div>
    </div>
  );
}
