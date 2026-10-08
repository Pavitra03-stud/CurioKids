import { useState, useEffect } from "react";

import "../styles/BreakWord.css";

import { db } from "../firebase";

import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

export default function BreakWord() {
  const TOTAL_QUESTIONS = 5;
  const GAME_ID = "break-word";

  // =========================================================
  // FIREBASE GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =========================================================
  // GAME STATE
  // =========================================================

  const [word, setWord] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [gameReady, setGameReady] = useState(false);

  // =========================================================
  // 🤖 GENERATE QUESTION
  // =========================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-break-word",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("🤖 Break Word AI:", data);

      if (
        !data.word ||
        !data.options ||
        !data.answer
      ) {
        throw new Error("Invalid data");
      }

      setWord(data.word);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

      setLoading(false);

      return data;
    } catch (err) {
      console.error(
        "❌ Break Word error:",
        err
      );

      const fallback = {
        word: "CAT",
        options: [
          "c - a - t",
          "ca - t",
          "c - at",
          "cat",
        ],
        answer: "c - a - t",
      };

      setWord(fallback.word);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.answer);

      setLoading(false);

      return fallback;
    }
  };

  // =========================================================
  // 🔄 LOAD / RESUME
  // =========================================================

  useEffect(() => {
    if (progressLoading) {
      console.log(
        "⏳ Waiting for Break Word Firebase progress..."
      );

      return;
    }

    const loadGame = async () => {
      console.log(
        "🎮 Break Word saved state:",
        savedState
      );

      // =====================================================
      // RESUME EXISTING GAME
      // =====================================================

      if (
        savedState &&
        savedState.word &&
        Array.isArray(savedState.options) &&
        savedState.options.length > 0 &&
        savedState.correctAnswer
      ) {
        console.log(
          "🔄 RESUMING BREAK WORD:",
          savedState
        );

        setWord(savedState.word);

        setOptions(savedState.options);

        setCorrectAnswer(
          savedState.correctAnswer
        );

        setQuestionCount(
          Number(savedState.question) || 0
        );

        setScore(
          Number(savedState.score) || 0
        );

        setLoading(false);
        setGameReady(true);

        return;
      }

      // =====================================================
      // NEW GAME
      // =====================================================

      console.log(
        "🆕 Starting new Break Word game"
      );

      const data =
        await generateQuestionAI();

      await save({
        question: 0,
        score: 0,
        word: data.word,
        options: data.options,
        correctAnswer: data.answer,
      });

      setQuestionCount(0);
      setScore(0);
      setGameReady(true);
    };

    loadGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoading]);

  // =========================================================
  // 📊 ACTIVITY
  // =========================================================

  const logActivity = async (finalScore) => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "phonics",
          screen: "break-word",
          score: finalScore,
          timestamp: new Date(),
        }
      );

      console.log(
        "📊 Break Word activity saved"
      );
    } catch (error) {
      console.error(
        "❌ Activity error:",
        error
      );
    }
  };

  // =========================================================
  // ☁️ FINAL RESULT
  // =========================================================

  const saveScoreToFirestore = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

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
        (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "BreakWord_AI",
      });

      console.log(
        "☁️ Break Word result saved"
      );
    } catch (error) {
      console.error(
        "❌ Result save error:",
        error
      );
    }
  };

  // =========================================================
  // 🎯 ANSWER
  // =========================================================

  const handleClick = (option) => {
    if (loading) return;
    if (message) return;
    if (!gameReady) return;

    const isCorrect =
      option === correctAnswer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    if (isCorrect) {
      setScore(updatedScore);
      setMessage("correct");
    } else {
      setMessage("wrong");
    }

    setTimeout(async () => {
      setMessage("");

      const nextCount =
        questionCount + 1;

      // =====================================================
      // 🏆 COMPLETE ROUND
      // =====================================================

      if (nextCount === TOTAL_QUESTIONS) {
        const finalPercentage =
          (updatedScore / TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏆 Break Word completed:",
          updatedScore,
          "/",
          TOTAL_QUESTIONS
        );

        await finish(
          finalPercentage,
          "Break Word"
        );

        await logActivity(
          finalPercentage
        );

        await saveScoreToFirestore(
          updatedScore
        );

        alert(
          `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // ===================================================
        // NEW ROUND
        // ===================================================

        setScore(0);
        setQuestionCount(0);

        const newData =
          await generateQuestionAI();

        await save({
          question: 0,
          score: 0,
          word: newData.word,
          options: newData.options,
          correctAnswer:
            newData.answer,
        });

        return;
      }

      // =====================================================
      // ➡️ NEXT QUESTION
      // =====================================================

      setLoading(true);

      const newData =
        await generateQuestionAI();

      setQuestionCount(nextCount);

      await save({
        question: nextCount,
        score: updatedScore,
        word: newData.word,
        options: newData.options,
        correctAnswer:
          newData.answer,
      });

      console.log(
        "💾 Break Word progress saved:",
        {
          question: nextCount,
          score: updatedScore,
        }
      );
    }, 900);
  };

  // =========================================================
  // 📊 PERFORMANCE
  // =========================================================

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent segmentation!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice breaking words!";
  };

  // =========================================================
  // ⏳ LOADING SCREEN
  // =========================================================

  if (!gameReady) {
    return (
      <div className="break-page">

        <nav className="break-navbar">

          <div className="break-brand">
            <span className="break-brand-icon">
              🌿
            </span>
            CurioKids
          </div>

          <div className="break-navbar-title">
            Break the Word
          </div>

        </nav>

        <main className="break-main">

          <section className="break-game-card break-loading-card">

            <div className="break-loading-icon">
              🤖
            </div>

            <h2>
              Getting Your Challenge Ready
            </h2>

            <p>
              Preparing a fun word puzzle for you...
            </p>

          </section>

        </main>

      </div>
    );
  }

  // =========================================================
  // 🎮 MAIN GAME UI
  // =========================================================

  return (
    <div className="break-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="break-navbar">

        <div className="break-brand">
          <span className="break-brand-icon">
            🌿
          </span>

          CurioKids
        </div>

        <div className="break-navbar-title">
          🤖 Break the Word
        </div>

      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="break-main">

        <section className="break-game-card">

          {/* =================================================
              SCORE / QUESTION
          ================================================= */}

          <div className="break-stats">

            <div className="break-stat-pill">

              <span className="break-stat-label">
                Question
              </span>

              <strong>
                {questionCount + 1}
                <span className="break-stat-total">
                  /{TOTAL_QUESTIONS}
                </span>
              </strong>

            </div>

            <div className="break-stat-pill">

              <span className="break-stat-star">
                ⭐
              </span>

              <span className="break-stat-label">
                Score
              </span>

              <strong>
                {score}
              </strong>

            </div>

          </div>

          {/* =================================================
              WORD AREA
          ================================================= */}

          <section className="break-word-panel">

            <div className="break-word-heading">
              FIND THE SOUNDS
            </div>

            <div className="break-word-display">

              {loading ? (
                <span className="break-word-loading">
                  ...
                </span>
              ) : (
                word
              )}

            </div>

            <div className="break-word-question">
              Break this word into sounds
            </div>

          </section>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <section className="break-options-section">

            <div className="break-options-heading">
              Choose the correct breakdown
            </div>

            <div className="break-options-grid">

              {loading ? (
                <div className="break-options-loading">
                  Loading...
                </div>
              ) : (
                options.map((opt, index) => {

                  const isCorrect =
                    message === "correct" &&
                    opt === correctAnswer;

                  const isWrong =
                    message === "wrong" &&
                    opt !== correctAnswer;

                  return (
                    <button
                      key={index}
                      type="button"
                      className={`break-option-card ${
                        isCorrect
                          ? "break-option-correct"
                          : ""
                      } ${
                        isWrong
                          ? "break-option-disabled"
                          : ""
                      }`}
                      onClick={() =>
                        handleClick(opt)
                      }
                      disabled={!!message}
                    >
                      <span>
                        {opt}
                      </span>
                    </button>
                  );
                })
              )}

            </div>

          </section>

          {/* =================================================
              FEEDBACK
          ================================================= */}

          <div
            className={`break-feedback ${
              message === "correct"
                ? "break-feedback-correct"
                : ""
            } ${
              message === "wrong"
                ? "break-feedback-wrong"
                : ""
            }`}
          >
            {message === "correct"
              ? "🎉 Correct! Great job!"
              : message === "wrong"
              ? "💡 Not quite! Keep going!"
              : ""}
          </div>

          {/* =================================================
              PERFORMANCE
          ================================================= */}

          <div className="break-performance">
            {getPerformanceMessage()}
          </div>

        </section>

      </main>

    </div>
  );
}