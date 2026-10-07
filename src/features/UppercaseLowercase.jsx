import { useEffect, useState } from "react";
import "../styles/UppercaseLowercase.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// 🔥 Game Progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "uppercase-lowercase";
const TOTAL_QUESTIONS = 5;

export default function UppercaseLowercase() {
  const uppercase =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // =====================================================
  // GAME PROGRESS
  // =====================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =====================================================
  // STATES
  // =====================================================

  const [currentUpper, setCurrentUpper] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  // =====================================================
  // GENERATE QUESTION
  // =====================================================

  const generateQuestionAI = () => {
    const randomUpper =
      uppercase[
        Math.floor(
          Math.random() * uppercase.length
        )
      ];

    const correct =
      randomUpper.toLowerCase();

    const allLower =
      "abcdefghijklmnopqrstuvwxyz".split("");

    const wrong = allLower
      .filter(
        (letter) =>
          letter !== correct
      )
      .sort(
        () =>
          0.5 - Math.random()
      )
      .slice(0, 3);

    const questionOptions = [
      ...wrong,
      correct,
    ].sort(
      () =>
        0.5 - Math.random()
    );

    return {
      question: randomUpper,
      options: questionOptions,
      answer: correct,
    };
  };

  // =====================================================
  // RESTORE / INITIALIZE
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🎮 Uppercase Lowercase saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.currentUpper &&
      Array.isArray(savedState.options)
    ) {
      console.log(
        "✅ Resuming Uppercase Lowercase"
      );

      setCurrentUpper(
        savedState.currentUpper
      );

      setOptions(
        savedState.options
      );

      setScore(
        savedState.score || 0
      );

      setQuestionCount(
        savedState.questionCount || 0
      );

      setFeedback(
        savedState.feedback || ""
      );

      setGameOver(
        savedState.gameOver || false
      );

      setLocked(false);

      return;
    }

    console.log(
      "🆕 Starting new Uppercase Lowercase game"
    );

    const question =
      generateQuestionAI();

    setCurrentUpper(
      question.question
    );

    setOptions(
      question.options
    );

    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setGameOver(false);
    setLocked(false);

    save({
      currentUpper:
        question.question,

      options:
        question.options,

      score: 0,
      questionCount: 0,
      feedback: "",
      gameOver: false,
    });
  }, [
    progressLoading,
    GAME_ID,
  ]);

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleClick = (selected) => {
    if (
      locked ||
      gameOver ||
      questionCount >=
        TOTAL_QUESTIONS
    ) {
      return;
    }

    setLocked(true);

    const isCorrect =
      selected ===
      currentUpper.toLowerCase();

    const updatedScore =
      score +
      (isCorrect ? 1 : 0);

    const nextCount =
      questionCount + 1;

    const feedbackMessage =
      isCorrect
        ? "correct"
        : "wrong";

    setScore(updatedScore);

    setFeedback(
      feedbackMessage
    );

    setQuestionCount(
      nextCount
    );

    // ===================================================
    // FINAL QUESTION
    // ===================================================

    if (
      nextCount ===
      TOTAL_QUESTIONS
    ) {
      const percentage =
        (updatedScore /
          TOTAL_QUESTIONS) *
        100;

      setTimeout(
        async () => {
          // Save completed state
          await save({
            currentUpper,
            options,
            score: updatedScore,
            questionCount:
              nextCount,
            feedback:
              feedbackMessage,
            gameOver: true,
          });

          // Save individual game result
          await saveScoreToFirestore(
            updatedScore
          );

          // 🔥 Update global progress
          await finish(
            percentage,
            "Uppercase Lowercase"
          );

          setGameOver(true);
          setLocked(false);
        },
        800
      );

      return;
    }

    // ===================================================
    // NEXT QUESTION
    // ===================================================

    setTimeout(async () => {
      const question =
        generateQuestionAI();

      setCurrentUpper(
        question.question
      );

      setOptions(
        question.options
      );

      setFeedback("");

      setLocked(false);

      await save({
        currentUpper:
          question.question,

        options:
          question.options,

        score: updatedScore,

        questionCount:
          nextCount,

        feedback: "",

        gameOver: false,
      });
    }, 800);
  };

  // =====================================================
  // SAVE RESULT
  // =====================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {
          console.log(
            "❌ No Firebase user ID"
          );

          return;
        }

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
              "Uppercase-Lowercase",
          }
        );

        console.log(
          "✅ Uppercase Lowercase result saved"
        );
      } catch (error) {
        console.error(
          "❌ Error saving result:",
          error
        );
      }
    };

  // =====================================================
  // PERFORMANCE MESSAGE
  // =====================================================

  const getPerformanceMessage =
    () => {
      if (
        questionCount === 0
      ) {
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

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = async () => {
    const question =
      generateQuestionAI();

    setCurrentUpper(
      question.question
    );

    setOptions(
      question.options
    );

    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setGameOver(false);
    setLocked(false);

    await save({
      currentUpper:
        question.question,

      options:
        question.options,

      score: 0,
      questionCount: 0,
      feedback: "",
      gameOver: false,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (progressLoading) {
    return (
      <div className="case-page">

        <div className="case-navbar">

          <div className="case-brand">
            <span className="case-brand-icon">
              🌴
            </span>

            <div>
              <strong>CurioKids</strong>
              <small>Jungle Practice</small>
            </div>
          </div>

          <div className="case-navbar-title">
            🔤 Uppercase & Lowercase
          </div>

        </div>

        <main className="case-main">

          <div className="case-loading-card">

            <div className="case-loading-icon">
              🌿
            </div>

            <h2>
              Loading your adventure...
            </h2>

            <p>
              Getting your letters ready!
            </p>

          </div>

        </main>
      </div>
    );
  }

  // =====================================================
  // COMPLETION SCREEN
  // =====================================================

  if (gameOver) {
    const percentage =
      (score /
        TOTAL_QUESTIONS) *
      100;

    return (
      <div className="case-page">

        <div className="case-navbar">

          <div className="case-brand">
            <span className="case-brand-icon">
              🌴
            </span>

            <div>
              <strong>CurioKids</strong>
              <small>Jungle Practice</small>
            </div>
          </div>

          <div className="case-navbar-title">
            🔤 Uppercase & Lowercase
          </div>

        </div>

        <main className="case-main">

          <section className="case-game-card case-complete-card">

            <span className="case-leaf case-leaf-one">
              🍃
            </span>

            <span className="case-leaf case-leaf-two">
              🌿
            </span>

            <div className="completion-content">

              <div className="completion-icon">
                🎉
              </div>

              <span className="completion-kicker">
                JUNGLE PRACTICE COMPLETE
              </span>

              <h1>
                Amazing Work!
              </h1>

              <p>
                You matched uppercase and
                lowercase letters beautifully!
              </p>

              <div className="final-score-box">

                <span>⭐</span>

                <strong>
                  {score}
                </strong>

                <small>
                  / {TOTAL_QUESTIONS}
                </small>

              </div>

              <div className="percentage-box">
                {percentage.toFixed(0)}%
              </div>

              <div className="performance-message">
                {getPerformanceMessage()}
              </div>

              <button
                className="play-again-btn"
                onClick={playAgain}
              >
                <span>🔄</span>
                Play Again
                <b>→</b>
              </button>

            </div>

          </section>

        </main>

        <div className="case-floating-helper">
          🤖
        </div>

      </div>
    );
  }

  // =====================================================
  // GAME UI
  // =====================================================

  return (
    <div className="case-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="case-navbar">

        <div className="case-brand">

          <span className="case-brand-icon">
            🌴
          </span>

          <div>
            <strong>CurioKids</strong>
            <small>Jungle Practice</small>
          </div>

        </div>

        <div className="case-navbar-title">
          <span>🔤</span>
          Uppercase & Lowercase
        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="case-main">

        {/* PAGE TITLE */}

        <section className="case-heading">

          <span className="case-kicker">
            CURIOKIDS • JUNGLE PRACTICE
          </span>

          <h1>
            Match the Letters 🔤
          </h1>

          <p>
            Find the lowercase letter that
            matches the uppercase letter.
          </p>

        </section>

        {/* =================================================
            GAME CARD
        ================================================= */}

        <section className="case-game-card">

          <span className="case-leaf case-leaf-one">
            🍃
          </span>

          <span className="case-leaf case-leaf-two">
            🌿
          </span>

          {/* GAME HEADER */}

          <div className="case-game-header">

            <div>

              <span className="case-game-label">
                LETTER MATCHING
              </span>

              <h2>
                Find its lowercase partner
              </h2>

            </div>

            <div className="case-progress">

              <strong>
                {questionCount + 1}
              </strong>

              <span>
                / {TOTAL_QUESTIONS}
              </span>

              <small>
                Question
              </small>

            </div>

          </div>

          {/* =================================================
              LETTER MATCH AREA
          ================================================= */}

          <div className="letter-match-area">

            {/* UPPERCASE */}

            <div className="letter-display-box">

              <span className="display-label">
                UPPERCASE
              </span>

              <div className="big-letter">
                {currentUpper}
              </div>

            </div>

            {/* MATCH ARROW */}

            <div className="match-arrow">
              ↓
            </div>

            {/* INSTRUCTION */}

            <div className="match-instruction">

              <span>
                👀
              </span>

              <div>
                <strong>
                  Which lowercase letter
                  matches?
                </strong>

                <small>
                  Choose the correct partner below
                </small>
              </div>

            </div>

          </div>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <div className="options-title">
            <span>🌿</span>
            CHOOSE YOUR ANSWER
          </div>

          <div className="options-grid">

            {options.map(
              (letter) => (
                <button
                  key={letter}
                  className={`option-btn ${
                    feedback === "correct" &&
                    letter ===
                      currentUpper.toLowerCase()
                      ? "correct-option"
                      : ""
                  }`}
                  onClick={() =>
                    handleClick(letter)
                  }
                  disabled={locked}
                >
                  {letter}

                  <span className="option-check">
                    ✓
                  </span>
                </button>
              )
            )}

          </div>

          {/* =================================================
              FEEDBACK
          ================================================= */}

          {feedback === "correct" && (
            <div className="feedback good">
              🎉 Correct! Great matching!
            </div>
          )}

          {feedback === "wrong" && (
            <div className="feedback wrong">
              💡 Try again! Look carefully.
            </div>
          )}

          {/* =================================================
              SCORE
          ================================================= */}

          <div className="case-bottom-row">

            <div className="score-pill">

              <span>⭐</span>

              <strong>
                Score
              </strong>

              <b>
                {score}
              </b>

              <span>
                / {questionCount}
              </span>

            </div>

            <div className="performance-pill">
              {getPerformanceMessage()}
            </div>

          </div>

        </section>

      </main>

      <div className="case-floating-helper">
        🤖
      </div>

    </div>
  );
}