import { useState, useEffect } from "react";

import "../styles/FindHidden.css";

// Firebase
import { db } from "../firebase";

import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// Router
import { useLocation } from "react-router-dom";

// Game Progress
import useGameProgress from "../hooks/useGameProgress";

export default function FindHidden() {
  const TOTAL_QUESTIONS = 5;

  // =========================================================
  // MODE
  // =========================================================

  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const mode = query.get("mode") || "letters";

  // =========================================================
  // GAME ID
  // =========================================================

  const GAME_ID = `find-hidden-${mode}`;

  // =========================================================
  // INITIAL STATE
  // =========================================================

  const INITIAL_STATE = {
    target: "",
    grid: [],
    score: 0,
    questionCount: 0,
    message: "",
    completed: false,
  };

  // =========================================================
  // GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );

  // =========================================================
  // STATE
  // =========================================================

  const [target, setTarget] = useState("");
  const [grid, setGrid] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] =
    useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] =
    useState(false);

  const [showWinningPopup, setShowWinningPopup] =
    useState(false);

  // =========================================================
  // GENERATE QUESTION
  // =========================================================

  const generateQuestion = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
            ]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
              ""
            );

      const randomTarget =
        base[
          Math.floor(
            Math.random() * base.length
          )
        ];

      const newGrid = Array(9)
        .fill(null)
        .map(
          () =>
            base[
              Math.floor(
                Math.random() * base.length
              )
            ]
        );

      const randomIndex =
        Math.floor(Math.random() * 9);

      newGrid[randomIndex] =
        randomTarget;

      setTarget(randomTarget);
      setGrid(newGrid);
    } catch (err) {
      console.error(
        "❌ Error generating question:",
        err
      );

      const fallbackTarget =
        mode === "numbers"
          ? "1"
          : "A";

      const fallbackGrid =
        mode === "numbers"
          ? [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
            ]
          : [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
            ];

      setTarget(fallbackTarget);
      setGrid(fallbackGrid);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESTORE SAVED GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;

    const restoreGame = async () => {
      console.log(
        "🎮 Find Hidden restore:",
        savedState
      );

    if (
      savedState &&
      savedState.target &&
      Array.isArray(savedState.grid) &&
      savedState.grid.length === 9
    ) {
      setTarget(savedState.target);
      setGrid(savedState.grid);

      setScore(
        savedState.score || 0
      );

      setQuestionCount(
        savedState.questionCount || 0
      );

      setMessage(
        savedState.message || ""
      );

      setLoading(false);

      const savedRoundIsComplete =
        Boolean(savedState.completed) ||
        Number(savedState.questionCount || 0) >=
          TOTAL_QUESTIONS;

      if (savedRoundIsComplete) {
        setQuestionCount(TOTAL_QUESTIONS);
        setShowWinningPopup(true);

        // Normalize older saved states so the completed
        // round is stored consistently.
        try {
          await save({
            target: savedState.target,
            grid: savedState.grid,
            score: savedState.score || 0,
            questionCount: TOTAL_QUESTIONS,
            message: "",
            completed: true,
          });
        } catch (error) {
          console.error(
            "❌ Completed state normalization error:",
            error
          );
        }
      } else {
        setShowWinningPopup(false);
      }
      } else {
        setScore(0);
        setQuestionCount(0);
        setMessage("");
        setShowWinningPopup(false);

        generateQuestion();
      }
    };

    restoreGame();
  }, [
    progressLoading,
    GAME_ID,
  ]);

  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem(
          "userId"
        );

      if (!userId) return;

      await addDoc(
        collection(
          db,
          "activity"
        ),
        {
          userId,
          action: "play",

          module:
            mode === "numbers"
              ? "math"
              : "letters",

          screen: `find-hidden-${mode}`,

          score: finalScore,

          timestamp:
            Timestamp.now(),
        }
      );

      console.log(
        "✅ Activity saved"
      );
    } catch (error) {
      console.error(
        "❌ Activity save error:",
        error
      );
    }
  };

  // =========================================================
  // SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) return;

        const userRef = doc(
          db,
          "users",
          userId
        );

        const gameResultsRef =
          collection(
            userRef,
            "game_results"
          );

        const accuracy =
          (finalScore /
            TOTAL_QUESTIONS) *
          100;

        await addDoc(
          gameResultsRef,
          {
            score: finalScore,
            totalQuestions:
              TOTAL_QUESTIONS,
            accuracy:
              accuracy.toFixed(2),
            createdAt:
              Timestamp.now(),
            game:
              `FindHidden_${mode}`,
          }
        );

        console.log(
          "✅ Game result saved"
        );
      } catch (error) {
        console.error(
          "❌ Firestore error:",
          error
        );
      }
    };

  // =========================================================
  // START NEW ROUND
  // =========================================================

  const startNewRound = async () => {
    setShowWinningPopup(false);
    setAnswering(false);
    setLoading(true);

    const base =
      mode === "numbers"
        ? [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
          ]
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
            ""
          );

    const newTarget =
      base[
        Math.floor(
          Math.random() * base.length
        )
      ];

    const newGrid = Array(9)
      .fill(null)
      .map(
        () =>
          base[
            Math.floor(
              Math.random() * base.length
            )
          ]
      );

    const randomIndex =
      Math.floor(Math.random() * 9);

    newGrid[randomIndex] =
      newTarget;

    setTarget(newTarget);
    setGrid(newGrid);

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setLoading(false);

    try {
      await save({
        target: newTarget,
        grid: newGrid,
        score: 0,
        questionCount: 0,
        message: "",
        completed: false,
      });
    } catch (error) {
      console.error(
        "❌ New round save error:",
        error
      );
    }
  };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = (item) => {
    if (answering) return;

    if (
      questionCount >=
      TOTAL_QUESTIONS
    ) {
      setShowWinningPopup(true);
      return;
    }

    setAnswering(true);

    const isCorrect =
      item === target;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const nextQuestionCount =
      questionCount + 1;

    const feedback =
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!";

    setMessage(feedback);

    // Save the current answer immediately.
    save({
      target,
      grid,
      score: updatedScore,
      questionCount:
        nextQuestionCount,
      message: feedback,
      completed: false,
    });

    setTimeout(
      async () => {
        setMessage("");

        // ===================================================
        // FINAL QUESTION
        // ===================================================

        if (
          nextQuestionCount ===
          TOTAL_QUESTIONS
        ) {
          const finalPercentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏁 Find Hidden completed:",
            updatedScore,
            finalPercentage
          );

          // Update the UI FIRST so the child immediately
          // sees the winning popup.
          setScore(updatedScore);
          setQuestionCount(
            nextQuestionCount
          );
          setShowWinningPopup(true);
          setAnswering(false);

          // Save completion/progress afterwards.
          // Errors here must not prevent the popup.
          try {
            await finish(
              finalPercentage,
              `Find Hidden (${mode})`
            );
          } catch (error) {
            console.error(
              "❌ Finish progress error:",
              error
            );
          }

          try {
            await logActivity(
              finalPercentage
            );
          } catch (error) {
            console.error(
              "❌ Activity logging error:",
              error
            );
          }

          try {
            await saveScoreToFirestore(
              updatedScore
            );
          } catch (error) {
            console.error(
              "❌ Score saving error:",
              error
            );
          }

          try {
            await save({
              target,
              grid,
              score: updatedScore,
              questionCount:
                nextQuestionCount,
              message: "",
              completed: true,
            });

            console.log(
              "✅ Find Hidden completed state saved"
            );
          } catch (error) {
            console.error(
              "❌ Completed state save error:",
              error
            );
          }

          return;
        }

        // ===================================================
        // NEXT QUESTION
        // ===================================================

        const base =
          mode === "numbers"
            ? [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ]
            : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
                ""
              );

        const nextTarget =
          base[
            Math.floor(
              Math.random() *
                base.length
            )
          ];

        const nextGrid = Array(9)
          .fill(null)
          .map(
            () =>
              base[
                Math.floor(
                  Math.random() *
                    base.length
                )
              ]
          );

        const randomIndex =
          Math.floor(
            Math.random() * 9
          );

        nextGrid[randomIndex] =
          nextTarget;

        setTarget(nextTarget);
        setGrid(nextGrid);

        setScore(updatedScore);

        setQuestionCount(
          nextQuestionCount
        );

        setMessage("");

        setAnswering(false);

        try {
          await save({
            target: nextTarget,
            grid: nextGrid,
            score: updatedScore,
            questionCount:
              nextQuestionCount,
            message: "",
            completed: false,
          });
        } catch (error) {
          console.error(
            "❌ Next question save error:",
            error
          );
        }
      },
      800
    );
  };

  // =========================================================
  // PERFORMANCE
  // =========================================================

  const getPerformanceMessage =
    () => {
      if (questionCount === 0) {
        return "";
      }

      const accuracy =
        (score /
          questionCount) *
        100;

      if (accuracy > 80) {
        return "🌟 Excellent!";
      }

      if (accuracy > 50) {
        return "👍 Good job!";
      }

      return "💡 Keep practicing!";
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (progressLoading) {
    return (
      <div className="blend-container loading-screen">
        <div className="loading-card">
          <div className="loading-icon">
            🔍
          </div>

          <h2>
            Find Hidden
          </h2>

          <p>
            ⏳ Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="blend-container">

      {/* =================================================
          WINNING POPUP
      ================================================= */}

      {showWinningPopup && (
        <div className="winning-overlay">
          <div className="winning-popup">

            <div className="winning-leaves">
              <span>🍃</span>
              <span>🌿</span>
            </div>

            <div className="winning-trophy">
              🏆
            </div>

            <div className="winning-badge">
              🎯 JUNGLE CHALLENGE COMPLETE
            </div>

            <h2>
              You Did It!
            </h2>

            <p className="winning-message">
              Amazing work! You found all
              the hidden{" "}
              {mode === "numbers"
                ? "numbers"
                : "letters"}{" "}
              in the jungle! 🌟
            </p>

            <div className="winning-score">
              <span className="winning-score-label">
                SCORE
              </span>

              <strong>
                {score}/{TOTAL_QUESTIONS}
              </strong>
            </div>

            <div className="winning-percentage">
              {(
                (score /
                  TOTAL_QUESTIONS) *
                100
              ).toFixed(0)}
              <span>%</span>
            </div>

            <p className="winning-feedback">
              {getPerformanceMessage()}
            </p>

            <button
              className="winning-play-btn"
              onClick={startNewRound}
            >
              🌱 Play Again
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          CENTERED GAME TITLE
      ================================================= */}

      <header className="blend-navbar">

        <div className="navbar-icon">
          🔍
        </div>

        <div>
          <span className="navbar-mini">
            CURIOKIDS
          </span>

          <h1>
            Find Hidden
          </h1>

          <p>
            {mode === "numbers"
              ? "Find the hidden number"
              : "Find the hidden letter"}
          </p>
        </div>

      </header>

      {/* =================================================
          MAIN WOODEN BOARD
      ================================================= */}

      <main className="blend-content">

        <section className="find-game-card">

          <div className="game-info-pill">

            <strong>
              Score: {score}
            </strong>

            <span>
              |
            </span>

            <strong>
              Question:{" "}
              {Math.min(
                questionCount + 1,
                TOTAL_QUESTIONS
              )}
              /{TOTAL_QUESTIONS}
            </strong>

          </div>

          <div className="game-area">

            <div className="look-badge">
              👀 Look carefully!
            </div>

            <h2>
              Find the hidden{" "}
              {mode === "numbers"
                ? "number"
                : "letter"}
              !
            </h2>

            <p className="game-description">
              Find the matching{" "}
              {mode === "numbers"
                ? "number"
                : "letter"}{" "}
              in the cards below.
            </p>

            <div className="target-card">

              <span className="target-label">
                FIND
              </span>

              <span className="target-value">
                {target || "..."}
              </span>

            </div>

            {loading ? (
              <div className="question-loading">

                <span>🔍</span>

                <p>
                  Preparing...
                </p>

              </div>
            ) : (
              <div className="hidden-grid">

                {grid.map(
                  (item, index) => (
                    <button
                      key={index}
                      className="hidden-option"
                      onClick={() =>
                        handleClick(
                          item
                        )
                      }
                      disabled={
                        answering
                      }
                    >
                      {item}
                    </button>
                  )
                )}

              </div>
            )}

            {message && (
              <div
                className={`find-feedback ${
                  message.includes(
                    "Correct"
                  )
                    ? "feedback-correct"
                    : "feedback-wrong"
                }`}
              >
                {message}
              </div>
            )}

            <div className="performance-message">

              <span>💡</span>

              <p>
                {getPerformanceMessage() ||
                  "Look carefully and choose the matching one!"}
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
