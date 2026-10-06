import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { useGame } from "../context/GameContext";
import useGameProgress from "../hooks/useGameProgress";

export default function BlendSounds() {
  const TOTAL_QUESTIONS = 5;
  const GAME_ID = "blend-sounds";

  const { finish } = useGameProgress(GAME_ID);

  const {
    savedState,
    loading: progressLoading,
    save,
    finish: completeGame,
  } = useGameProgress(GAME_ID);

  const [sounds, setSounds] = useState([]);
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

  const fetchQuestion = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-blend",
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

      console.log("🤖 Blend Sounds AI DATA:", data);

      if (
        !data.sounds ||
        !data.options ||
        !data.answer
      ) {
        throw new Error("Invalid AI data");
      }

      setSounds(data.sounds);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

      setLoading(false);

      return data;
    } catch (err) {
      console.error("❌ Blend Sounds AI error:", err);

      const fallback = {
        sounds: ["c", "a", "t"],
        options: ["cat", "cap", "can"],
        answer: "cat",
      };

      setSounds(fallback.sounds);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.answer);

      setLoading(false);

      return fallback;
    }
  };

  // =========================================================
  // 🔄 RESTORE / START GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) {
      console.log(
        "⏳ Waiting for Blend Sounds Firebase progress..."
      );
      return;
    }

    const loadGame = async () => {
      console.log(
        "🎮 Blend Sounds saved state:",
        savedState
      );

      // =====================================================
      // 🔄 RESUME
      // =====================================================

      if (
        savedState &&
        Array.isArray(savedState.sounds) &&
        savedState.sounds.length > 0 &&
        Array.isArray(savedState.options) &&
        savedState.options.length > 0 &&
        savedState.correctAnswer
      ) {
        console.log(
          "🔄 RESUMING BLEND SOUNDS:",
          savedState
        );

        setSounds(savedState.sounds);
        setOptions(savedState.options);
        setCorrectAnswer(savedState.correctAnswer);

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
        "🆕 No saved Blend Sounds game. Generating..."
      );

      const data = await fetchQuestion();

      await save({
        question: 0,
        score: 0,
        sounds: data.sounds,
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
  // ☁️ ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "phonics",
        screen: "blend-sounds",
        score: finalScore,
        timestamp: new Date(),
      });

      console.log("📊 Blend Sounds activity saved");
    } catch (error) {
      console.error(
        "❌ Activity log error:",
        error
      );
    }
  };

  // =========================================================
  // ☁️ SAVE FINAL GAME RESULT
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
        game: "BlendSounds_AI",
      });

      console.log(
        "☁️ Blend Sounds final result saved"
      );
    } catch (error) {
      console.error(
        "❌ Final result save error:",
        error
      );
    }
  };

  // =========================================================
  // 🎯 ANSWER
  // =========================================================

  const checkAnswer = (option) => {
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
      // 🏆 GAME COMPLETED
      // =====================================================

      if (nextCount === TOTAL_QUESTIONS) {
        const finalPercentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        console.log(
          "🏆 Blend Sounds completed:",
          updatedScore,
          "/",
          TOTAL_QUESTIONS
        );

        // ⭐ Stars + history + clear active game
        await completeGame(
          finalPercentage,
          "Blend Sounds"
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        // ☁️ Existing game result
        await saveScoreToFirestore(
          updatedScore
        );

        alert(
          `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // Reset for a fresh round
        setScore(0);
        setQuestionCount(0);

        const newData =
          await fetchQuestion();

        // Save fresh Question 1
        await save({
          question: 0,
          score: 0,
          sounds: newData.sounds,
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
        await fetchQuestion();

      setQuestionCount(nextCount);

      // 💾 Save exact next question
      await save({
        question: nextCount,
        score: updatedScore,
        sounds: newData.sounds,
        options: newData.options,
        correctAnswer: newData.answer,
      });

      console.log(
        "💾 Blend Sounds progress saved:",
        {
          question: nextCount,
          score: updatedScore,
          answer: newData.answer,
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
      return "🌟 Excellent blending!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice blending sounds!";
  };

  // =========================================================
  // ⏳ INITIAL LOADING
  // =========================================================

  if (!gameReady) {
    return (
      <div className="blend-container">
        <h2>🤖 AI Blend the Sounds</h2>

        <div className="sounds">
          <p>⏳ Loading your game...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // 🎮 UI
  // =========================================================

  return (
    <div className="blend-container">

      <h2>
        🤖 AI Blend the Sounds
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

      {/* 🔊 SOUNDS */}

      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          sounds.map((s, i) => (
            <span
              key={i}
              className="sound-box"
            >
              {s}
            </span>
          ))
        )}
      </div>

      {/* OPTIONS */}

      <div className="options">
        {loading ? (
          <p>
            Loading options...
          </p>
        ) : (
          options.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() =>
                checkAnswer(opt)
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