import { useState, useEffect } from "react";
import "../styles/gameCommon.css";

import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

const words = ["cat", "dog", "sun", "bat"];

const TOTAL_ROUNDS = 5;
const GAME_ID = "catch-word";

function randomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

export default function CatchWord({ goBack }) {

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

  const [target, setTarget] = useState("");
  const [fallingWords, setFallingWords] = useState([]);

  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const [gameReady, setGameReady] = useState(false);

  // =========================================================
  // 🔄 LOAD / RESUME GAME
  // =========================================================

  useEffect(() => {

    if (progressLoading) {
      console.log(
        "⏳ Waiting for Catch Word Firebase progress..."
      );
      return;
    }

    const loadGame = async () => {

      console.log(
        "🎮 Catch Word saved state:",
        savedState
      );

      // =====================================================
      // 🔄 RESUME
      // =====================================================

      if (
        savedState &&
        savedState.target
      ) {

        console.log(
          "🔄 RESUMING CATCH WORD:",
          savedState
        );

        setTarget(savedState.target);

        setRound(
          Number(savedState.round) || 0
        );

        setScore(
          Number(savedState.score) || 0
        );

        setMessage("");

        setGameReady(true);

        return;
      }

      // =====================================================
      // 🆕 NEW GAME
      // =====================================================

      console.log(
        "🆕 Starting new Catch Word game"
      );

      const newTarget = randomWord();

      setTarget(newTarget);
      setRound(0);
      setScore(0);

      await save({
        round: 0,
        score: 0,
        target: newTarget,
      });

      setGameReady(true);
    };

    loadGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoading]);

  // =========================================================
  // 🎯 GENERATE FALLING WORDS
  // =========================================================

  useEffect(() => {

    if (!gameReady) return;

    const interval = setInterval(() => {

      const newWord = {
        text:
          words[
            Math.floor(
              Math.random() *
              words.length
            )
          ],

        id:
          Date.now() +
          Math.random(),

        left:
          Math.random() * 80 + "%",
      };

      setFallingWords((prev) => [
        ...prev,
        newWord,
      ]);

      // Remove after 3 seconds
      setTimeout(() => {

        setFallingWords((prev) =>
          prev.filter(
            (w) => w.id !== newWord.id
          )
        );

      }, 3000);

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [gameReady]);

  // =========================================================
  // 📊 ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {

    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {

      await addDoc(
        collection(db, "activity"),
        {
          userId,

          action: "play",

          module: "games",

          screen: "catch-word",

          score: finalScore,

          timestamp: new Date(),
        }
      );

      console.log(
        "📊 Catch Word activity saved"
      );

    } catch (error) {

      console.error(
        "❌ Activity logging error:",
        error
      );
    }
  };

  // =========================================================
  // ☁️ SAVE DETAILED RESULT
  // =========================================================

  const saveGameResult = async (
    finalScore
  ) => {

    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {

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

      await addDoc(
        gameResultsRef,
        {
          game: "CatchWord",

          score: finalScore,

          totalQuestions:
            TOTAL_ROUNDS,

          accuracy:
            (
              (finalScore /
                TOTAL_ROUNDS) *
              100
            ).toFixed(2),

          createdAt:
            Timestamp.now(),
        }
      );

      console.log(
        "☁️ Catch Word result saved"
      );

    } catch (error) {

      console.error(
        "❌ Result save error:",
        error
      );
    }
  };

  // =========================================================
  // 🎯 CLICK FALLING WORD
  // =========================================================

  const handleClick = (
    wordObj
  ) => {

    if (!gameReady) return;

    if (message) return;

    const isCorrect =
      wordObj.text === target;

    if (isCorrect) {

      setMessage(
        "Nice catch! 🎉"
      );

    } else {

      setMessage(
        "Oops! 💛"
      );
    }

    setFallingWords((prev) =>
      prev.filter(
        (w) => w.id !== wordObj.id
      )
    );

    // Don't update score here directly.
    // Next button handles the round.
  };

  // =========================================================
  // ➡️ NEXT ROUND
  // =========================================================

  const next = async () => {

    if (!message) return;

    const isCorrect =
      message.includes("Nice");

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const nextRound =
      round + 1;

    // =====================================================
    // 🏆 GAME COMPLETED
    // =====================================================

    if (
      nextRound === TOTAL_ROUNDS
    ) {

      const finalPercentage =
        (
          updatedScore /
          TOTAL_ROUNDS
        ) * 100;

      console.log(
        "🏆 Catch Word completed:",
        updatedScore,
        "/",
        TOTAL_ROUNDS
      );

      // ⭐ ADD STARS + HISTORY
      // 🗑️ CLEAR ACTIVE GAME
      await finish(
        finalPercentage,
        "Catch Word"
      );

      // 📊 ACTIVITY
      await logActivity(
        finalPercentage
      );

      // ☁️ DETAILED RESULT
      await saveGameResult(
        updatedScore
      );

      alert(
        `🎯 Game Completed!\nScore: ${updatedScore}/${TOTAL_ROUNDS}`
      );

      // ===================================================
      // 🆕 START NEW ROUND
      // ===================================================

      const newTarget =
        randomWord();

      setScore(0);
      setRound(0);
      setTarget(newTarget);
      setMessage("");
      setFallingWords([]);

      await save({
        round: 0,
        score: 0,
        target: newTarget,
      });

      return;
    }

    // =====================================================
    // ➡️ CONTINUE
    // =====================================================

    const newTarget =
      randomWord();

    setScore(updatedScore);
    setRound(nextRound);
    setTarget(newTarget);
    setMessage("");
    setFallingWords([]);

    // 💾 SAVE EXACT CURRENT PROGRESS
    await save({
      round: nextRound,
      score: updatedScore,
      target: newTarget,
    });

    console.log(
      "💾 Catch Word progress saved:",
      {
        round: nextRound,
        score: updatedScore,
        target: newTarget,
      }
    );
  };

  // =========================================================
  // ⏳ WAIT FOR FIREBASE
  // =========================================================

  if (!gameReady) {

    return (
      <div className="game-page">

        <div className="header">

          <button onClick={goBack}>
            ⬅
          </button>

          <h1>
            Catch the Word
          </h1>

        </div>

        <h2>
          ⏳ Loading your saved game...
        </h2>

      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="game-page">

      {/* Header */}

      <div className="header">
{/* 
        <button onClick={goBack}>
          ⬅
        </button> */}

        <h1>
          Catch the Word
        </h1>

      </div>

      <p className="instruction">

        Catch:{" "}

        <strong>
          {target}
        </strong>

      </p>

      <p>
        Score: {score}
        {" | "}
        Round: {round + 1}/
        {TOTAL_ROUNDS}
      </p>

      {/* Falling Area */}

      <div className="fall-area">

        {fallingWords.map(
          (word) => (

            <div
              key={word.id}
              className="falling-word"
              style={{
                left: word.left,
              }}
              onClick={() =>
                handleClick(word)
              }
            >
              {word.text}
            </div>

          )
        )}

      </div>

      <h2>
        {message}
      </h2>

      {message.includes(
        "Nice"
      ) && (

        <button
          className="next-btn"
          onClick={next}
        >
          Next →
        </button>

      )}

      {message.includes(
        "Oops"
      ) && (

        <button
          className="next-btn"
          onClick={next}
        >
          Next →
        </button>

      )}

    </div>
  );
}