import { useEffect, useState } from "react";
import "../styles/WordScramble.css";

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

const GAME_ID = "word-scramble";
const TOTAL_QUESTIONS = 5;

export default function WordScramble() {
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

  const [scrambled, setScrambled] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  // =====================================================
  // GENERATE AI QUESTION
  // =====================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate-word-scramble`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate question");
      }

      const data = await res.json();

      if (
        !data.scrambled ||
        !data.options ||
        !data.answer
      ) {
        throw new Error("Invalid AI data");
      }

      return {
        scrambled: data.scrambled,
        options: data.options,
        correctAnswer: data.answer,
      };
    } catch (err) {
      console.error("❌ AI Scramble Error:", err);

      // 🔥 Fallback question
      return {
        scrambled: "TAC",
        options: ["cat", "act", "cut", "bat"],
        correctAnswer: "cat",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESTORE / INITIALIZE
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🤖 Word Scramble saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.scrambled &&
      Array.isArray(savedState.options) &&
      savedState.correctAnswer
    ) {
      console.log("✅ Resuming Word Scramble");

      setScrambled(savedState.scrambled);
      setOptions(savedState.options);
      setCorrectAnswer(savedState.correctAnswer);

      setScore(savedState.score || 0);
      setQuestionCount(savedState.questionCount || 0);
      setMessage(savedState.message || "");
      setGameOver(savedState.gameOver || false);

      setLocked(false);

      return;
    }

    console.log("🆕 Starting new Word Scramble");

    startNewQuestion();
  }, [progressLoading]);

  // =====================================================
  // START NEW QUESTION
  // =====================================================

  const startNewQuestion = async () => {
    const question = await generateQuestionAI();

    setScrambled(question.scrambled);
    setOptions(question.options);
    setCorrectAnswer(question.correctAnswer);

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setGameOver(false);
    setLocked(false);

    await save({
      scrambled: question.scrambled,
      options: question.options,
      correctAnswer: question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      gameOver: false,
    });
  };

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleClick = (word) => {
    if (
      locked ||
      gameOver ||
      loading ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    setLocked(true);

    const isCorrect = word === correctAnswer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const feedback = isCorrect
      ? "✅ Correct!"
      : "❌ Try again!";

    setScore(updatedScore);
    setMessage(feedback);

    const next = questionCount + 1;

    setQuestionCount(next);

    // ===================================================
    // FINAL QUESTION
    // ===================================================

    if (next === TOTAL_QUESTIONS) {
      setTimeout(async () => {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        // Save completed state
        await save({
          scrambled,
          options,
          correctAnswer,
          score: updatedScore,
          questionCount: next,
          message: feedback,
          gameOver: true,
        });

        // Save result
        await saveScoreToFirestore(updatedScore);

        // Global progress
        await finish(
          percentage,
          "Word Scramble"
        );

        setGameOver(true);
        setLocked(false);
      }, 800);

      return;
    }

    // ===================================================
    // NEXT AI QUESTION
    // ===================================================

    setTimeout(async () => {
      setMessage("");

      const question = await generateQuestionAI();

      setScrambled(question.scrambled);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);

      setLocked(false);

      await save({
        scrambled: question.scrambled,
        options: question.options,
        correctAnswer: question.correctAnswer,
        score: updatedScore,
        questionCount: next,
        message: "",
        gameOver: false,
      });
    }, 800);
  };

  // =====================================================
  // SAVE RESULT
  // =====================================================

  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn("❌ No Firebase user ID");
        return;
      }

      const userRef = doc(
        db,
        "users",
        userId
      );

      const gameResultsRef = collection(
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
        game: "WordScramble_AI",
      });

      console.log(
        "✅ Word Scramble result saved"
      );
    } catch (error) {
      console.error(
        "❌ Error saving result:",
        error
      );
    }
  };

  // =====================================================
  // PERFORMANCE
  // =====================================================

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice spelling!";
  };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = async () => {
    setLoading(true);

    const question = await generateQuestionAI();

    setScrambled(question.scrambled);
    setOptions(question.options);
    setCorrectAnswer(question.correctAnswer);

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setGameOver(false);
    setLocked(false);

    await save({
      scrambled: question.scrambled,
      options: question.options,
      correctAnswer: question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      gameOver: false,
    });
  };

  // =====================================================
  // LOADING PROGRESS
  // =====================================================

  if (progressLoading) {
    return (
      <div className="blend-page">
        <nav className="blend-navbar">
          <div className="brand-title">
            🌿 CurioKids
          </div>

          <div className="game-title">
            🤖 Word Scramble
          </div>
        </nav>

        <main className="blend-content">
          <div className="blend-card loading-card">
            <div className="loading-icon">
              🦋
            </div>

            <h2>Loading your adventure...</h2>

            <p>
              🌱 Getting your game ready!
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
      (score / TOTAL_QUESTIONS) * 100;

    return (
      <div className="blend-page">
        <nav className="blend-navbar">
          <div className="brand-title">
            🌿 CurioKids
          </div>

          <div className="game-title">
            🤖 Word Scramble
          </div>
        </nav>

        <main className="blend-content">
          <div className="blend-card completion-card">

            <div className="completion-icon">
              🏆
            </div>

            <h1>
              Word Scramble Complete!
            </h1>

            <div className="score-pill">
              ⭐ Score: {score}/{TOTAL_QUESTIONS}
            </div>

            <div className="percentage-box">
              {percentage.toFixed(0)}%
            </div>

            <div className="ai-analysis">
              <span>🌟</span>
              <p>
                {getPerformanceMessage()}
              </p>
            </div>

            <button
              className="play-again-btn"
              onClick={playAgain}
            >
              🔄 Play Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // GAME UI
  // =====================================================

  return (
    <div className="blend-page">

      {/* NAVBAR */}
      <nav className="blend-navbar">
        <div className="brand-title">
          🌿 CurioKids
        </div>

        <div className="game-title">
          🤖 Word Scramble
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="blend-content">

        <div className="blend-card">

          {/* GAME HEADER */}
          <div className="game-header">

            <div className="instruction-badge">
              ✨ Word Adventure
            </div>

            <div className="game-info">
              <span>
                Question {questionCount + 1}/
                {TOTAL_QUESTIONS}
              </span>

              <span className="divider">
                •
              </span>

              <span>
                ⭐ Score: {score}
              </span>
            </div>

          </div>

          {/* SCRAMBLED WORD */}
          <div className="scramble-section">

            <div className="scramble-label">
              🔤 Unscramble Me!
            </div>

            <div className="big-letter">
              {loading ? "..." : scrambled}
            </div>

            <p className="question-text">
              Rearrange the letters and find
              the correct word!
            </p>

          </div>

          {/* OPTIONS */}
          <div className="options-section">

            <h3>
              🌟 Choose the correct word
            </h3>

            <div className="options">

              {loading ? (
                <div className="loading-options">
                  <span>🌱</span>
                  Loading...
                </div>
              ) : (
                options.map((word, index) => (
                  <button
                    key={index}
                    className="word-option"
                    onClick={() =>
                      handleClick(word)
                    }
                    disabled={locked}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span>
                      {word}
                    </span>
                  </button>
                ))
              )}

            </div>

          </div>

          {/* FEEDBACK */}
          {message && (
            <div
              className={`feedback-message ${
                message.includes("Correct")
                  ? "correct"
                  : "wrong"
              }`}
            >
              {message}
            </div>
          )}

          {/* AI ANALYSIS */}
          <div className="ai-analysis">
            <span>🧠</span>

            <p>
              {getPerformanceMessage()}
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}