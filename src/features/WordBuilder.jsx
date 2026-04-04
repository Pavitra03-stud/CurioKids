import { useMemo, useState } from "react";
import "../styles/WordBuilder.css";

export default function WordBuilder({ goBack }) {
  const rounds = useMemo(
    () => [
      { image: "🐱", word: "CAT", letters: ["T", "C", "A"] },
      { image: "🐶", word: "DOG", letters: ["G", "D", "O"] },
      { image: "☀️", word: "SUN", letters: ["N", "S", "U"] },
      { image: "🎩", word: "HAT", letters: ["T", "H", "A"] },
      { image: "🐟", word: "FISH", letters: ["S", "F", "H", "I"] },
      { image: "🍎", word: "APPLE", letters: ["P", "A", "L", "E", "P"] },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);

  const current = rounds[index];
  const finished = index >= rounds.length;
  const isLastRound = index === rounds.length - 1;

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.8;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  const handleLetterClick = (letter, i) => {
    if (status) return;

    const expected = current.word[selected.length];

    if (letter === expected) {
      const updated = [...selected, { letter, i }];
      setSelected(updated);

      if (updated.length === current.word.length) {
        setStatus("correct");
        setScore((prev) => prev + 1);
        speak(current.word);
      }
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = () => {
    if (isLastRound) {
      setIndex(rounds.length);
      return;
    }

    setIndex((prev) => prev + 1);
    setSelected([]);
    setStatus("");
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected([]);
    setStatus("");
    setScore(0);
  };

  if (finished) {
    return (
      <div className="word-builder-page">
        <header className="word-builder-topbar">
          <button className="word-builder-back" onClick={goBack}>
            ←
          </button>
          <h1 className="word-builder-title">🧩 Word Builder</h1>
        </header>

        <div className="word-builder-content">
          <div className="word-finish-card">
            <div className="word-finish-emoji">🌟</div>
            <h2>Great Job!</h2>
            <p>
              You got <span>{score}</span> out of <span>{rounds.length}</span>
            </p>

            <div className="word-finish-buttons">
              <button className="word-primary-btn" onClick={handleRestart}>
                Play Again
              </button>
              <button className="word-secondary-btn" onClick={goBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const usedIndexes = selected.map((item) => item.i);

  return (
    <div className="word-builder-page">
      <header className="word-builder-topbar">
        <button className="word-builder-back" onClick={goBack}>
          ←
        </button>
        <h1 className="word-builder-title">🧩 Word Builder</h1>
      </header>

      <div className="word-builder-content">
        <div className="word-top-info">
          <div className="word-score">⭐ Score: {score}</div>
          <div className="word-progress">
            {index + 1} / {rounds.length}
          </div>
        </div>

        <div className="word-card">
          <div className="word-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="word-main-image">{current.image}</div>

          <button className="hear-word-btn" onClick={() => speak(current.word)}>
            🔊 Hear Word
          </button>

          <h2>Build the word</h2>
          <p className="word-subtitle">Tap the letters in the correct order</p>

          <div className="word-answer-preview">
            {current.word.split("").map((_, i) => (
              <div key={i} className="word-preview-box">
                {selected[i]?.letter || ""}
              </div>
            ))}
          </div>

          <div className="word-letters-grid">
            {current.letters.map((letter, i) => {
              const used = usedIndexes.includes(i);

              return (
                <button
                  key={i}
                  className={`word-letter-btn ${used ? "used" : ""}`}
                  onClick={() => handleLetterClick(letter, i)}
                  disabled={used || !!status}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <div className="word-feedback-area">
            {!status && (
              <p className="word-hint">Tap carefully and complete the word ✨</p>
            )}

            {status === "correct" && (
              <p className="word-feedback correct-text">
                ✅ Super! You built the word correctly
              </p>
            )}

            {status === "wrong" && (
              <p className="word-feedback wrong-text">
                ❌ Oops! Try the next word carefully
              </p>
            )}
          </div>

          {status && (
            <button className="word-next-btn" onClick={handleNext}>
              {isLastRound ? "See Result" : "Next"}
            </button>
          )}
        </div>

        <div className="word-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}