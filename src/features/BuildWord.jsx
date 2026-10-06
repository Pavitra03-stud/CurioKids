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

export default function BuildWord() {
  const TOTAL_QUESTIONS = 5;
  const GAME_ID = "build-word";

  // =========================================================
  // 🎮 GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =========================================================
  // 🎯 GAME STATE
  // =========================================================

  const [displayWord, setDisplayWord] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [gameReady, setGameReady] = useState(false);

  // =========================================================
  // 🤖 AI QUESTION
  // =========================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-build-word",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("🤖 Build Word AI:", data);

      if (
        !data.display ||
        !Array.isArray(data.options) ||
        !data.answer
      ) {
        throw new Error("Invalid AI response");
      }

      setDisplayWord(data.display);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

      setLoading(false);

      return data;
    } catch (err) {
      console.error(
        "❌ Build Word AI error:",
        err
      );

      const fallback = {
        display: "_ A T",
        options: ["c", "b", "m", "s"],
        answer: "c",
      };

      setDisplayWord(fallback.display);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.answer);

      setLoading(false);

      return fallback;
    }
  };

  // =========================================================
  // 🔄 LOAD / RESUME GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) {
      console.log(
        "⏳ Waiting for Build Word Firebase progress..."
      );
      return;
    }

    const loadGame = async () => {
      console.log(
        "🎮 Build Word saved state:",
        savedState
      );

      // =====================================================
      // 🔄 RESUME EXISTING GAME
      // =====================================================

      if (
        savedState &&
        savedState.displayWord &&
        Array.isArray(savedState.options) &&
        savedState.options.length > 0 &&
        savedState.correctAnswer
      ) {
        console.log(
          "🔄 RESUMING BUILD WORD:",
          savedState
        );

        setDisplayWord(
          savedState.displayWord
        );

        setOptions(
          savedState.options
        );

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
        "🆕 Starting new Build Word game"
      );

      const data =
        await generateQuestionAI();

      await save({
        question: 0,
        score: 0,
        displayWord: data.display,
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
  // 📊 ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (finalScore) => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "phonics",
        screen: "build-word",
        score: finalScore,
        timestamp: new Date(),
      });

      console.log(
        "📊 Build Word activity saved"
      );
    } catch (error) {
      console.error(
        "❌ Activity log error:",
        error
      );
    }
  };

  // =========================================================
  // ☁️ SAVE FINAL RESULT
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
        totalQuestions:
          TOTAL_QUESTIONS,
        accuracy:
          accuracy.toFixed(2),
        createdAt:
          Timestamp.now(),
        game: "BuildWord_AI",
      });

      console.log(
        "☁️ Build Word result saved"
      );
    } catch (error) {
      console.error(
        "❌ Result save error:",
        error
      );
    }
  };

  // =========================================================
  // 🎯 HANDLE ANSWER
  // =========================================================

  const handleClick = (letter) => {
    if (loading) return;
    if (message) return;
    if (!gameReady) return;

    const isCorrect =
      letter === correctAnswer;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    setMessage(
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!"
    );

    setTimeout(async () => {
      setMessage("");

      const next =
        questionCount + 1;

      // =====================================================
      // 🏆 GAME COMPLETED
      // =====================================================

      if (
        next === TOTAL_QUESTIONS
      ) {
        const finalPercentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏆 Build Word completed:",
          updatedScore,
          "/",
          TOTAL_QUESTIONS
        );

        // ⭐ STARS + HISTORY
        // 🗑️ CLEAR RESUME PROGRESS
        await finish(
          finalPercentage,
          "Build Word"
        );

        // 📊 ACTIVITY
        await logActivity(
          finalPercentage
        );

        // ☁️ DETAILED RESULT
        await saveScoreToFirestore(
          updatedScore
        );

        alert(
          `🎯 Score: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // ===================================================
        // 🆕 START FRESH ROUND
        // ===================================================

        setScore(0);
        setQuestionCount(0);

        const newData =
          await generateQuestionAI();

        await save({
          question: 0,
          score: 0,
          displayWord:
            newData.display,
          options:
            newData.options,
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

      setQuestionCount(next);
      setScore(updatedScore);

      // 💾 SAVE EXACT NEXT QUESTION
      await save({
        question: next,
        score: updatedScore,
        displayWord:
          newData.display,
        options:
          newData.options,
        correctAnswer:
          newData.answer,
      });

      console.log(
        "💾 Build Word progress saved:",
        {
          question: next,
          score: updatedScore,
        }
      );
    }, 800);
  };

  // =========================================================
  // ⏳ WAIT FOR FIREBASE
  // =========================================================

  if (!gameReady) {
    return (
      <div className="blend-container">
        <h2>
          🤖 Build the Word
        </h2>

        <div className="big-letter">
          ⏳
        </div>

        <p>
          Loading your saved game...
        </p>
      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="blend-container">

      <h2>
        🤖 Build the Word
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}/
        {TOTAL_QUESTIONS}
        {" | "}
        Score: {score}
      </div>

      <div className="big-letter">
        {loading
          ? "..."
          : displayWord}
      </div>

      <div className="options">
        {options.map(
          (letter, index) => (
            <button
              key={index}
              onClick={() =>
                handleClick(letter)
              }
              disabled={
                !!message ||
                loading
              }
            >
              {letter.toUpperCase()}
            </button>
          )
        )}
      </div>

      <p>{message}</p>

    </div>
  );
}