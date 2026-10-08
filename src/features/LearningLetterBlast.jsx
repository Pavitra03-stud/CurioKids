import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/LearningLetterBlast.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "learning-letter-blast";

export default function LearningLetterBlast() {
  const questions = useMemo(
    () => [
      {
        image: "🍎",
        word: "Apple",
        correct: "A",
        options: ["A", "B", "C"],
      },
      {
        image: "🐶",
        word: "Dog",
        correct: "D",
        options: ["D", "B", "P"],
      },
      {
        image: "🐱",
        word: "Cat",
        correct: "C",
        options: ["C", "O", "G"],
      },
      {
        image: "🦁",
        word: "Lion",
        correct: "L",
        options: ["L", "I", "T"],
      },
      {
        image: "🥭",
        word: "Mango",
        correct: "M",
        options: ["M", "N", "W"],
      },
      {
        image: "🐘",
        word: "Elephant",
        correct: "E",
        options: ["E", "F", "L"],
      },
      {
        image: "🐟",
        word: "Fish",
        correct: "F",
        options: ["F", "P", "T"],
      },
      {
        image: "🍌",
        word: "Banana",
        correct: "B",
        options: ["B", "D", "R"],
      },
    ],
    []
  );

  const INITIAL_STATE = {
    currentIndex: 0,
    selected: "",
    status: "",
    score: 0,
    completed: false,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [restored, setRestored] = useState(false);
  const [blasting, setBlasting] = useState(false);

  const timerRef = useRef(null);

  const safeIndex =
    currentIndex >= 0 && currentIndex < questions.length
      ? currentIndex
      : 0;

  const currentQuestion = questions[safeIndex];
  const isLastQuestion = safeIndex === questions.length - 1;

  // Display the three options in different positions for each question.
  // The correct answer is no longer always the first option.
  const displayedOptions = useMemo(() => {
    if (!currentQuestion) return [];

    const options = [...currentQuestion.options];

    // Rotate by question number, then swap on alternating questions.
    // This gives a stable order while the question is on screen.
    const shift = (safeIndex + 1) % options.length;
    const rotated = [
      ...options.slice(shift),
      ...options.slice(0, shift),
    ];

    if (safeIndex % 2 === 1) {
      [rotated[0], rotated[1]] = [rotated[1], rotated[0]];
    }

    return rotated;
  }, [currentQuestion, safeIndex]);

  /* Restore saved progress once. */
  useEffect(() => {
    if (progressLoading || restored) return;

    if (savedState) {
      /*
       * Restore only durable progress.
       *
       * Do NOT restore selected/status here.
       * If the user previously answered correctly, Firebase may contain
       * status: "correct". Restoring that status would disable the buttons
       * and leave the game permanently sitting on that question after reload.
       *
       * The question index and score are enough to continue the game.
       */
      setCurrentIndex(0);
      setSelected("");
      setStatus("");
      // Start this play session from score 0.
      // Old Firebase score must not appear when the page opens.
      setScore(0);
      setGameFinished(savedState.completed ?? false);
      setBlasting(false);
    }

    setRestored(true);
  }, [progressLoading, savedState, restored]);

  /* Clean up the automatic-next timer if the page is left. */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const moveToNextQuestion = (updatedScore) => {
    setBlasting(false);

    if (isLastQuestion) {
      setGameFinished(true);
      setSelected("");
      setStatus("");

      const finalPercentage =
        (updatedScore / questions.length) * 100;

      /* Save/finish in the background. Do not block the UI. */
      Promise.resolve(
        finish(finalPercentage, "Learning Letter Blast")
      ).catch((error) => {
        console.error("Learning Letter Blast finish error:", error);
      });

      Promise.resolve(
        save({
          currentIndex: questions.length,
          selected: "",
          status: "",
          score: updatedScore,
          completed: true,
        })
      ).catch((error) => {
        console.error("Learning Letter Blast save error:", error);
      });

      return;
    }

    const nextIndex = safeIndex + 1;

    /* Update the screen immediately. */
    setCurrentIndex(nextIndex);
    setSelected("");
    setStatus("");
    setScore(updatedScore);

    /* Save in the background. It must not block the next question. */
    Promise.resolve(
      save({
        currentIndex: nextIndex,
        selected: "",
        status: "",
        score: updatedScore,
        completed: false,
      })
    ).catch((error) => {
      console.error("Learning Letter Blast save error:", error);
    });
  };

  const handleOptionClick = (letter) => {
    if (status || gameFinished || blasting) return;

    const isCorrect = letter === currentQuestion.correct;
    const newStatus = isCorrect ? "correct" : "wrong";
    const updatedScore = isCorrect ? score + 1 : score;

    setSelected(letter);
    setStatus(newStatus);
    setScore(updatedScore);

    if (!isCorrect) {
      /* Wrong answers still wait for the user to press Next. */
      Promise.resolve(
        save({
          currentIndex,
          selected: letter,
          status: "wrong",
          score: updatedScore,
          completed: false,
        })
      ).catch((error) => {
        console.error("Learning Letter Blast save error:", error);
      });

      return;
    }

    /* Correct answer: show blast immediately. */
    setBlasting(true);

    /*
      IMPORTANT:
      Do NOT await Firebase here.
      The old version waited for save() before starting the timer,
      which could leave the game stuck on the correct-answer screen.
    */
    timerRef.current = window.setTimeout(() => {
      moveToNextQuestion(updatedScore);
    }, 750);
  };

  const handleNext = () => {
    if (!status || status === "correct" || blasting) return;

    moveToNextQuestion(score);
  };

  const handleRestart = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setCurrentIndex(0);
    setSelected("");
    setStatus("");
    setScore(0);
    setGameFinished(false);
    setBlasting(false);

    Promise.resolve(
      save({
        currentIndex: 0,
        selected: "",
        status: "",
        score: 0,
        completed: false,
      })
    ).catch((error) => {
      console.error("Learning Letter Blast restart save error:", error);
    });
  };

  if (progressLoading || !restored) {
    return (
      <div className="learning-letter-blast-page">
        <header className="learning-letter-blast-topbar">
          <h1 className="learning-letter-blast-title">
            💥 Letter Blast
          </h1>
        </header>

        <div className="learning-letter-blast-content">
          <div className="blast-card">
            <h2>Restoring your progress...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="learning-letter-blast-page">
        <header className="learning-letter-blast-topbar">
          <h1 className="learning-letter-blast-title">
            💥 Letter Blast
          </h1>
        </header>

        <div className="learning-letter-blast-decor decor-one"></div>
        <div className="learning-letter-blast-decor decor-two"></div>
        <div className="learning-letter-blast-decor decor-three"></div>

        <div className="blast-finish-card">
          <div className="finish-emoji">🏆</div>

          <h2>Great Job!</h2>

          <p>
            You got <span>{score}</span> out of{" "}
            <span>{questions.length}</span>
          </p>

          <div className="finish-buttons">
            <button className="primary-btn" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-letter-blast-page">
      {/* No Back button here, as requested. */}
      <header className="learning-letter-blast-topbar">
        <h1 className="learning-letter-blast-title">
          💥 Letter Blast
        </h1>
      </header>

      <div className="learning-letter-blast-decor decor-one"></div>
      <div className="learning-letter-blast-decor decor-two"></div>
      <div className="learning-letter-blast-decor decor-three"></div>

      <div className="learning-letter-blast-content">
        <div className="blast-top-info">
          <div className="blast-score">
            ⭐ Score: {score}
          </div>

          <div className="blast-progress">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="blast-card">
          <div className="blast-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="blast-image">
            {currentQuestion.image}
          </div>

          <div className="blast-word">
            {currentQuestion.word}
          </div>

          <p className="blast-question">
            Tap the first letter
          </p>

          <div className="blast-options">
            {displayedOptions.map((letter, index) => {
              const isCorrectOption =
                letter === currentQuestion.correct;

              const optionIsBlasting =
                blasting && isCorrectOption;

              return (
                <button
                  key={index}
                  className={`blast-option
                    ${
                      selected === letter
                        ? "selected"
                        : ""
                    }
                    ${
                      status === "correct" &&
                      isCorrectOption
                        ? "correct"
                        : ""
                    }
                    ${
                      status === "wrong" &&
                      selected === letter
                        ? "wrong"
                        : ""
                    }
                    ${
                      optionIsBlasting
                        ? "blast-explode"
                        : ""
                    }
                  `}
                  onClick={() =>
                    handleOptionClick(letter)
                  }
                  disabled={
                    Boolean(status) || blasting
                  }
                >
                  {letter}

                  {optionIsBlasting && (
                    <span
                      className="blast-burst"
                      aria-hidden="true"
                    >
                      💥
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="blast-feedback-area">
            {!status && (
              <p className="blast-hint">
                Look at the picture and choose carefully 👀
              </p>
            )}

            {status === "correct" && (
              <p className="blast-feedback correct-text">
                🎉 Super! {currentQuestion.correct} for{" "}
                {currentQuestion.word}
              </p>
            )}

            {status === "wrong" && (
              <p className="blast-feedback wrong-text">
                ❌ Try again next time! Correct answer is{" "}
                {currentQuestion.correct}
              </p>
            )}
          </div>

          {/* Only wrong answers need a manual Next button. */}
          {status === "wrong" && (
            <button
              className="next-btn"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>

        <div className="blast-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}
