import { useMemo, useState } from "react";
import "../styles/ConnectLetters.css";

export default function ConnectLetters({ goBack }) {
  const rounds = useMemo(
    () => [
      {
        type: "word",
        image: "🐱",
        title: "Connect the word",
        subtitle: "Tap the letters in the correct order",
        targetWord: "CAT",
        letters: ["C", "A", "T"],
      },
      {
        type: "missing",
        image: "🐶",
        title: "Fill the missing letter",
        subtitle: "Choose the missing letter to complete the word",
        wordPattern: ["D", "", "G"],
        options: ["O", "A", "E"],
        answer: "O",
        completedWord: "DOG",
      },
      {
        type: "match-case",
        image: "🔤",
        title: "Match uppercase and lowercase",
        subtitle: "Tap the matching pairs",
        pairs: [
          ["A", "a"],
          ["B", "b"],
          ["C", "c"],
        ],
      },
      {
        type: "word",
        image: "☀️",
        title: "Connect the word",
        subtitle: "Tap the letters in the correct order",
        targetWord: "SUN",
        letters: ["S", "U", "N"],
      },
      {
        type: "missing",
        image: "🎩",
        title: "Fill the missing letter",
        subtitle: "Choose the missing letter to complete the word",
        wordPattern: ["H", "", "T"],
        options: ["A", "O", "U"],
        answer: "A",
        completedWord: "HAT",
      },
      {
        type: "match-case",
        image: "🔠",
        title: "Match uppercase and lowercase",
        subtitle: "Tap the matching pairs",
        pairs: [
          ["D", "d"],
          ["M", "m"],
          ["P", "p"],
        ],
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");
  const [selectedWordLetters, setSelectedWordLetters] = useState([]);
  const [selectedMissing, setSelectedMissing] = useState("");
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [tempUpper, setTempUpper] = useState(null);

  const currentRound = rounds[currentIndex];
  const isLastRound = currentIndex === rounds.length - 1;
  const finished = currentIndex >= rounds.length;

  const resetRoundState = () => {
    setStatus("");
    setSelectedWordLetters([]);
    setSelectedMissing("");
    setMatchedPairs([]);
    setTempUpper(null);
  };

  const handleNext = () => {
    if (isLastRound) {
      setCurrentIndex(rounds.length);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    resetRoundState();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    resetRoundState();
  };

  const handleWordLetterClick = (letter, index) => {
    if (status) return;

    const expectedLetter = currentRound.targetWord[selectedWordLetters.length];

    if (letter === expectedLetter) {
      const updated = [...selectedWordLetters, { letter, index }];
      setSelectedWordLetters(updated);

      if (updated.length === currentRound.targetWord.length) {
        setStatus("correct");
        setScore((prev) => prev + 1);
      }
    } else {
      setStatus("wrong");
    }
  };

  const handleMissingOptionClick = (option) => {
    if (status) return;

    setSelectedMissing(option);

    if (option === currentRound.answer) {
      setStatus("correct");
      setScore((prev) => prev + 1);
    } else {
      setStatus("wrong");
    }
  };

  const handleUpperClick = (upper) => {
    if (status) return;
    setTempUpper(upper);
  };

  const handleLowerClick = (lower) => {
    if (status || !tempUpper) return;

    const isCorrectPair = currentRound.pairs.some(
      ([upper, small]) => upper === tempUpper && small === lower
    );

    const alreadyMatched = matchedPairs.some(
      ([upper, small]) => upper === tempUpper || small === lower
    );

    if (alreadyMatched) return;

    if (isCorrectPair) {
      const updatedPairs = [...matchedPairs, [tempUpper, lower]];
      setMatchedPairs(updatedPairs);
      setTempUpper(null);

      if (updatedPairs.length === currentRound.pairs.length) {
        setStatus("correct");
        setScore((prev) => prev + 1);
      }
    } else {
      setStatus("wrong");
    }
  };

  if (finished) {
    return (
      <div className="connect-letters-page">
        <header className="connect-letters-topbar">
          <button className="connect-letters-back" onClick={goBack}>
            ←
          </button>
          <h1 className="connect-letters-title">🔗 Connect Letters</h1>
        </header>

        <div className="connect-letters-content">
          <div className="connect-finish-card">
            <div className="connect-finish-emoji">🌟</div>
            <h2>Great Job!</h2>
            <p>
              You got <span>{score}</span> out of <span>{rounds.length}</span>
            </p>

            <div className="connect-finish-buttons">
              <button className="connect-primary-btn" onClick={handleRestart}>
                Play Again
              </button>
              <button className="connect-secondary-btn" onClick={goBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-letters-page">
      <header className="connect-letters-topbar">
        <button className="connect-letters-back" onClick={goBack}>
          ←
        </button>
        <h1 className="connect-letters-title">🔗 Connect Letters</h1>
      </header>

      <div className="connect-letters-content">
        <div className="connect-top-info">
          <div className="connect-score">⭐ Score: {score}</div>
          <div className="connect-progress">
            {currentIndex + 1} / {rounds.length}
          </div>
        </div>

        <div className="connect-card">
          <div className="connect-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="connect-main-image">{currentRound.image}</div>
          <h2>{currentRound.title}</h2>
          <p className="connect-subtitle">{currentRound.subtitle}</p>

          {currentRound.type === "word" && (
            <div className="connect-word-section">
              <div className="connect-word-row">
                {currentRound.letters.map((letter, index) => {
                  const picked = selectedWordLetters.some(
                    (item) => item.index === index
                  );

                  return (
                    <button
                      key={index}
                      className={`connect-letter-btn ${picked ? "picked" : ""}`}
                      onClick={() => handleWordLetterClick(letter, index)}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>

              <div className="connect-answer-preview">
                {currentRound.targetWord.split("").map((_, index) => (
                  <div key={index} className="preview-box">
                    {selectedWordLetters[index]?.letter || ""}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentRound.type === "missing" && (
            <div className="connect-missing-section">
              <div className="connect-missing-word">
                {currentRound.wordPattern.map((letter, index) => (
                  <div key={index} className="missing-box">
                    {letter === "" ? (selectedMissing || "_") : letter}
                  </div>
                ))}
              </div>

              <div className="connect-options-row">
                {currentRound.options.map((option, index) => (
                  <button
                    key={index}
                    className={`connect-option-btn ${
                      selectedMissing === option ? "picked" : ""
                    }`}
                    onClick={() => handleMissingOptionClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentRound.type === "match-case" && (
            <div className="connect-match-section">
              <div className="match-columns">
                <div className="match-column">
                  <h3>Uppercase</h3>
                  <div className="match-list">
                    {currentRound.pairs.map(([upper]) => {
                      const used = matchedPairs.some(([u]) => u === upper);

                      return (
                        <button
                          key={upper}
                          className={`match-btn uppercase-btn ${
                            tempUpper === upper ? "active" : ""
                          } ${used ? "matched" : ""}`}
                          onClick={() => handleUpperClick(upper)}
                        >
                          {upper}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="match-column">
                  <h3>Lowercase</h3>
                  <div className="match-list">
                    {currentRound.pairs.map(([, lower]) => {
                      const used = matchedPairs.some(([, l]) => l === lower);

                      return (
                        <button
                          key={lower}
                          className={`match-btn lowercase-btn ${
                            used ? "matched" : ""
                          }`}
                          onClick={() => handleLowerClick(lower)}
                        >
                          {lower}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="matched-preview">
                {matchedPairs.map(([upper, lower], index) => (
                  <div key={index} className="matched-pill">
                    {upper} → {lower}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="connect-feedback-area">
            {!status && (
              <p className="connect-hint">Tap carefully and complete the activity ✨</p>
            )}

            {status === "correct" && (
              <p className="connect-feedback correct-text">
                ✅ Super! You did it correctly
              </p>
            )}

            {status === "wrong" && (
              <p className="connect-feedback wrong-text">
                ❌ Oops! Try the next one carefully
              </p>
            )}
          </div>

          {status && (
            <button className="connect-next-btn" onClick={handleNext}>
              {isLastRound ? "See Result" : "Next"}
            </button>
          )}
        </div>

        <div className="connect-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}