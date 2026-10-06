import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

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

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

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
      console.error("❌ Break Word error:", err);

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
      // 🔄 RESUME EXISTING GAME
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
      // 🆕 NEW GAME
      // =====================================================

      console.log(
        "🆕 Starting new Break Word game"
      );

      const data = await generateQuestionAI();

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
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "phonics",
        screen: "break-word",
        score: finalScore,
        timestamp: new Date(),
      });

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

  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

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
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Try again!");
    }

    setTimeout(async () => {
      setMessage("");

      const nextCount =
        questionCount + 1;

      // =====================================================
      // 🏆 COMPLETE
      // =====================================================

      if (nextCount === TOTAL_QUESTIONS) {
        const finalPercentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        console.log(
          "🏆 Break Word completed:",
          updatedScore,
          "/",
          TOTAL_QUESTIONS
        );

        // ⭐ Stars + history + clear resume
        await finish(
          finalPercentage,
          "Break Word"
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        // ☁️ Detailed result
        await saveScoreToFirestore(
          updatedScore
        );

        alert(
          `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // ===================================================
        // 🆕 START NEW ROUND
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
          correctAnswer: newData.answer,
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
        correctAnswer: newData.answer,
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
  // ⏳ INITIAL LOADING
  // =========================================================

  if (!gameReady) {
    return (
      <div className="blend-container">
        <h2>🤖 Break the Word</h2>

        <div className="big-letter">
          ⏳
        </div>

        <p>Loading your saved game...</p>
      </div>
    );
  }

  // =========================================================
  // 🎮 UI
  // =========================================================

  return (
    <div className="blend-container">

      <h2>
        🤖 Break the Word
      </h2>

      <div className="game-info">
        <span>
          Question:{" "}
          {questionCount + 1}/
          {TOTAL_QUESTIONS}
        </span>

        <span>
          Score: {score}
        </span>
      </div>

      {/* WORD */}

      <div className="big-letter">
        {loading ? "..." : word}
      </div>

      <h3>
        Break this word into sounds
      </h3>

      {/* OPTIONS */}

      <div className="options">
        {loading ? (
          <p>Loading...</p>
        ) : (
          options.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() =>
                handleClick(opt)
              }
              disabled={!!message}
            >
              {opt}
            </button>
          ))
        )}
      </div>

      <p className="message">
        {message}
      </p>

      <div className="ai-analysis">
        <p>
          {getPerformanceMessage()}
        </p>
      </div>

    </div>
  );
}