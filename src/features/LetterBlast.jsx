import { useState } from "react";
import "../styles/gameCommon.css";

// 🔤 ALL letters
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterBlast({ goBack }) {
  const [game, setGame] = useState(generateGame());
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  // 🎯 Generate one round
  function generateGame() {
    const correct =
      ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

    // get 3 wrong letters
    let options = [correct];
    while (options.length < 4) {
      const random =
        ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

      if (!options.includes(random)) {
        options.push(random);
      }
    }

    // shuffle
    options = options.sort(() => Math.random() - 0.5);

    return { correct, options };
  }

  const handleClick = (letter) => {
    setSelected(letter);

    if (letter === game.correct) {
      setMessage("Boom! 💥 Correct");
    } else {
      setMessage("Oops! Try again 💛");
    }
  };

  const next = () => {
    setGame(generateGame());
    setSelected(null);
    setMessage("");
  };

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">
        <h1>Letter Blast</h1>
      </div>

      {/* Instruction */}
      <p className="instruction">
        Blast: <strong className="target">{game.correct}</strong>
      </p>

      {/* Options */}
      <div className="options">
        {game.options.map((l, i) => {
          let stateClass = "";

          if (selected === l) {
            stateClass = l === game.correct ? "blast correct" : "wrong";
          }

          return (
            <div
              key={i}
              className={`card floating ${stateClass}`}
              onClick={() => handleClick(l)}
            >
              {l}
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <h2 className="feedback">{message}</h2>

      {/* Next */}
      {message.includes("Correct") && (
        <button className="next-btn" onClick={next}>
          Next →
        </button>
      )}
    </div>
  );
}