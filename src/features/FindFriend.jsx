import { useEffect, useState } from "react";
import "../styles/FindFriend.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
} from "firebase/firestore";

// ✅ Central game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "find-friend";
const TOTAL_ROUNDS = 5;

const INITIAL_STATE = {
  items: [],
  correctIndex: null,
  message: "",
  score: 0,
  round: 1,
  completed: false,
};

export default function FindFriend({ goBack }) {
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
  // STATES
  // =========================================================

  const [items, setItems] = useState([]);

  const [correctIndex, setCorrectIndex] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [round, setRound] =
    useState(1);

  const [loadingGame, setLoadingGame] =
    useState(true);

  const [restored, setRestored] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // ⭐ NEW
  // Replaces browser alert()
  const [showCompletion, setShowCompletion] =
    useState(false);

  const [finalScore, setFinalScore] =
    useState(0);

  // =========================================================
  // CREATE ROUND
  // =========================================================

  const createRound = () => {
    const base = "🐶";
    const odd = "🐱";

    const arr = Array(6).fill(base);

    const randomIndex = Math.floor(
      Math.random() * 6
    );

    arr[randomIndex] = odd;

    return {
      items: arr,
      correctIndex: randomIndex,
    };
  };

  // =========================================================
  // RESTORE / START GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Find Friend saved state:",
      savedState
    );

    if (savedState) {
      const savedItems =
        Array.isArray(savedState.items)
          ? savedState.items
          : [];

      const savedCorrectIndex =
        Number.isInteger(
          savedState.correctIndex
        )
          ? savedState.correctIndex
          : null;

      setScore(
        Number(savedState.score) || 0
      );

      setRound(
        Number(savedState.round) || 1
      );

      setItems(savedItems);

      setCorrectIndex(
        savedCorrectIndex
      );

      setMessage("");

      // -------------------------------------------------------
      // INVALID SAVED QUESTION
      // -------------------------------------------------------

      if (
        savedItems.length !== 6 ||
        savedCorrectIndex === null
      ) {
        const newRound =
          createRound();

        setItems(
          newRound.items
        );

        setCorrectIndex(
          newRound.correctIndex
        );

        save({
          round:
            Number(
              savedState.round
            ) || 1,

          score:
            Number(
              savedState.score
            ) || 0,

          items:
            newRound.items,

          correctIndex:
            newRound.correctIndex,

          message: "",

          completed: false,
        });
      }
    } else {
      // -------------------------------------------------------
      // NEW GAME
      // -------------------------------------------------------

      const newRound =
        createRound();

      setItems(
        newRound.items
      );

      setCorrectIndex(
        newRound.correctIndex
      );

      save({
        round: 1,

        score: 0,

        items:
          newRound.items,

        correctIndex:
          newRound.correctIndex,

        message: "",

        completed: false,
      });

      console.log(
        "🆕 Starting new Find Friend game"
      );
    }

    setLoadingGame(false);
    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScoreValue
  ) => {
    try {
      const userId =
        localStorage.getItem(
          "userId"
        );

      if (!userId) return;

      await addDoc(
        collection(db, "activity"),
        {
          userId,

          action: "play",

          module: "visual",

          screen: "find-friend",

          score: finalScoreValue,

          timestamp: new Date(),
        }
      );

      console.log(
        "✅ Find Friend activity logged"
      );
    } catch (error) {
      console.error(
        "❌ Activity logging failed:",
        error
      );
    }
  };

  // =========================================================
  // START NEXT ROUND
  // =========================================================

  const startNextRound = async (
    nextRound,
    newScore
  ) => {
    const newGame =
      createRound();

    setRound(nextRound);

    setScore(newScore);

    setItems(newGame.items);

    setCorrectIndex(
      newGame.correctIndex
    );

    setMessage("");

    // Save NEW question immediately
    await save({
      round: nextRound,

      score: newScore,

      items: newGame.items,

      correctIndex:
        newGame.correctIndex,

      message: "",

      completed: false,
    });
  };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = async (
    index
  ) => {
    if (loadingGame) return;

    if (processing) return;

    if (message) return;

    if (correctIndex === null)
      return;

    // =======================================================
    // WRONG
    // =======================================================

    if (index !== correctIndex) {
      setMessage(
        "Try again 💛"
      );

      setProcessing(true);

      setTimeout(() => {
        setMessage("");
        setProcessing(false);
      }, 800);

      return;
    }

    // =======================================================
    // CORRECT
    // =======================================================

    const newScore =
      score + 1;

    setMessage(
      "Great job! 🌟"
    );

    setProcessing(true);

    // Save immediately
    await save({
      round,

      score: newScore,

      items,

      correctIndex,

      message:
        "Great job! 🌟",

      completed: false,
    });

    // =======================================================
    // NEXT ROUND / COMPLETE
    // =======================================================

    setTimeout(async () => {

      // -----------------------------------------------------
      // GAME COMPLETE
      // -----------------------------------------------------

      if (
        round ===
        TOTAL_ROUNDS
      ) {
        const finalPercentage =
          (newScore /
            TOTAL_ROUNDS) *
          100;

        console.log(
          "🏆 Find Friend completed:",
          finalPercentage
        );

        // ⭐ Central stars + history
        await finish(
          finalPercentage,
          "Find Friend"
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        // ⭐ SHOW OUR OWN COMPLETION GRID
        // instead of browser alert()
        setFinalScore(newScore);

        setShowCompletion(true);

        // ---------------------------------------------------
        // START FRESH ROUND
        // ---------------------------------------------------

        const freshGame =
          createRound();

        setScore(0);

        setRound(1);

        setItems(
          freshGame.items
        );

        setCorrectIndex(
          freshGame.correctIndex
        );

        setMessage("");

        setProcessing(false);

        await save({
          round: 1,

          score: 0,

          items:
            freshGame.items,

          correctIndex:
            freshGame.correctIndex,

          message: "",

          completed: false,
        });

        return;
      }

      // -----------------------------------------------------
      // NEXT ROUND
      // -----------------------------------------------------

      await startNextRound(
        round + 1,
        newScore
      );

      setProcessing(false);

    }, 800);
  };

  // =========================================================
  // CLOSE COMPLETION CARD
  // =========================================================

  const closeCompletion = () => {
    setShowCompletion(false);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    !restored ||
    loadingGame
  ) {
    return (
      <div className="find-page">

        <div className="find-header">

          <button
            className="back-btn"
            onClick={goBack}
          >
            ⬅
          </button>

          <h1>
            Find the Friend
          </h1>

        </div>

        <p className="find-text">
          Loading your progress...
        </p>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="find-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="find-header">

        <h1>
          Find the Friend
        </h1>

      </div>


      {/* ===================================================
          INSTRUCTION
      =================================================== */}

      <p className="find-text">
        Find the different one
      </p>


      {/* ===================================================
          SCORE
      =================================================== */}

      <p>
        Score: {score} | Round:{" "}
        {round}/{TOTAL_ROUNDS}
      </p>


      {/* ===================================================
          GAME GRID
      =================================================== */}

      <div className="find-grid">

        {items.map(
          (item, index) => (
            <div
              key={index}
              className="find-cell"
              onClick={() =>
                handleClick(index)
              }
            >
              {item}
            </div>
          )
        )}

      </div>


      {/* ===================================================
          FEEDBACK
      =================================================== */}

      <h2 className="feedback">
        {message}
      </h2>


      {/* ===================================================
          ⭐ GAME COMPLETION GRID
          Replaces JavaScript alert()
      =================================================== */}

      {showCompletion && (
        <div className="completion-overlay">

          <div className="completion-grid">

            {/* Decorative top */}

            <div className="completion-stars">
              ✨ ⭐ ✨
            </div>


            {/* Target */}

            <div className="completion-icon">
              🎯
            </div>


            {/* Title */}

            <h2 className="completion-title">
              Game Completed!
            </h2>


            {/* Score */}

            <div className="completion-score-box">

              <span className="completion-score-label">
                YOUR SCORE
              </span>

              <span className="completion-score">
                {finalScore}/{TOTAL_ROUNDS}
              </span>

            </div>


            {/* Percentage */}

            <div className="completion-percentage">
              {Math.round(
                (finalScore /
                  TOTAL_ROUNDS) *
                  100
              )}
              % Accuracy
            </div>


            {/* Message */}

            <p className="completion-message">
              🎉 Amazing work!
              <br />
              You found all the different friends!
            </p>


            {/* Button */}

            <button
              className="completion-btn"
              onClick={
                closeCompletion
              }
            >
              Awesome! 🌈
            </button>

          </div>

        </div>
      )}

    </div>
  );
}