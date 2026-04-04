import { useMemo, useState } from "react";
import "../styles/OddLetter.css";

export default function OddLetter({ goBack }) {
  const questions = useMemo(
    () => [
      {
        letters: ["A", "A", "A", "a", "A", "A"],
        answerIndex: 3,
        differentLetter: "a",
        message: "Small a is different",
      },
      {
        letters: ["b", "b", "B", "b", "b", "b"],
        answerIndex: 2,
        differentLetter: "B",
        message: "Capital B is different",
      },
      {
        letters: ["D", "D", "d", "D", "D", "D"],
        answerIndex: 2,
        differentLetter: "d",
        message: "Small d is different",
      },
      {
        letters: ["m", "m", "m", "M", "m", "m"],
        answerIndex: 3,
        differentLetter: "M",
        message: "Capital M is different",
      },
      {
        letters: ["S", "S", "s", "S", "S", "S"],
        answerIndex: 2,
        differentLetter: "s",
        message: "Small s is different",
      },
      {
        letters: ["p", "p", "p", "P", "p", "p"],
        answerIndex: 3,
        differentLetter: "P",
        message: "Capital P is different",
      },
      {
        letters: ["R", "r", "R", "R", "R", "R"],
        answerIndex: 1,
        differentLetter: "r",
        message: "Small r is different",
      },
      {
        letters: ["q", "q", "Q", "q", "q", "q"],
        answerIndex: 2,
        differentLetter: "Q",
        message: "Capital Q is different",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const finished = currentIndex >= questions.length;

  const handleLetterClick = (index) => {
    if (status) return;

    setSelectedIndex(index);

    if (index === currentQuestion.answerIndex) {
      setStatus("correct");
      setScore((prev) => prev + 1);
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCurrentIndex(questions.length);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setStatus("");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setStatus("");
    setScore(0);
  };

  if (finished) {
    return (
      <div className="odd-letter-page">
        <header className="odd-letter-topbar">
          <button className="odd-letter-back" onClick={goBack}>
            ←
          </button>
          <h1 className="odd-letter-title">🔍 Odd Letter</h1>
        </header>

        <div className="odd-letter-decor decor-one"></div>
        <div className="odd-letter-decor decor-two"></div>
        <div className="odd-letter-decor decor-three"></div>

        <div className="odd-letter-finish-card">
          <div className="finish-emoji">🌟</div>
          <h2>Awesome Work!</h2>
          <p>
            You got <span>{score}</span> out of <span>{questions.length}</span>
          </p>

          <div className="odd-letter-finish-buttons">
            <button className="odd-primary-btn" onClick={handleRestart}>
              Play Again
            </button>
            <button className="odd-secondary-btn" onClick={goBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="odd-letter-page">
      <header className="odd-letter-topbar">
        <button className="odd-letter-back" onClick={goBack}>
          ←
        </button>
        <h1 className="odd-letter-title">🔍 Odd Letter</h1>
      </header>

      <div className="odd-letter-decor decor-one"></div>
      <div className="odd-letter-decor decor-two"></div>
      <div className="odd-letter-decor decor-three"></div>

      <div className="odd-letter-content">
        <div className="odd-letter-top-info">
          <div className="odd-score">⭐ Score: {score}</div>
          <div className="odd-progress">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="odd-letter-card">
          <div className="odd-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <h2>Find the different letter 👀</h2>
          <p className="odd-subtext">
            Look carefully and tap the one that is different
          </p>

          <div className="odd-grid">
            {currentQuestion.letters.map((letter, index) => {
              const isSelected = selectedIndex === index;
              const isCorrect = index === currentQuestion.answerIndex;

              return (
                <button
                  key={index}
                  className={`odd-letter-box
                    ${isSelected ? "selected" : ""}
                    ${status === "correct" && isCorrect ? "correct" : ""}
                    ${status === "wrong" && isSelected ? "wrong" : ""}
                    ${status === "wrong" && isCorrect ? "show-correct" : ""}
                  `}
                  onClick={() => handleLetterClick(index)}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          <div className="odd-feedback-area">
            {!status && (
              <p className="odd-hint">Check uppercase and lowercase carefully ✨</p>
            )}

            {status === "correct" && (
              <p className="odd-feedback correct-text">
                ✅ Great! {currentQuestion.message}
              </p>
            )}

            {status === "wrong" && (
              <p className="odd-feedback wrong-text">
                ❌ Oops! {currentQuestion.message}
              </p>
            )}
          </div>

          {status && (
            <button className="odd-next-btn" onClick={handleNext}>
              {isLastQuestion ? "See Result" : "Next"}
            </button>
          )}
        </div>

        <div className="odd-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}