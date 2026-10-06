// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function TimedChallenge() {

//   const TOTAL_QUESTIONS = 5;
//   const TIME_LIMIT = 5; // seconds

//   // 🔥 MODE
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [target, setTarget] = useState("");
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
//   const [message, setMessage] = useState("");

//   // 🤖 AI QUESTION
//   const generateQuestionAI = () => {
//     const base =
//       mode === "numbers"
//         ? ["1","2","3","4","5","6","7","8","9"]
//         : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//     const correct =
//       base[Math.floor(Math.random() * base.length)];

//     const wrong = base
//       .filter(l => l !== correct)
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 3);

//     const opts = [correct, ...wrong].sort(() => 0.5 - Math.random());

//     setTarget(correct);
//     setOptions(opts);
//     setTimeLeft(TIME_LIMIT);
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, [mode]);

//   // ⏳ TIMER
//   useEffect(() => {
//     if (questionCount >= TOTAL_QUESTIONS) return;

//     if (timeLeft === 0) {
//       handleNext(false);
//       return;
//     }

//     const timer = setTimeout(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [timeLeft]);

//   // 🎯 HANDLE ANSWER
//   const handleClick = (item) => {
//     const isCorrect = item === target;
//     handleNext(isCorrect);
//   };

//   const handleNext = async (isCorrect) => {

//     const updatedScore = isCorrect ? score + 1 : score;

//     setMessage(
//       isCorrect ? "⚡ Correct!" : "⏳ Time up / Wrong!"
//     );

//     setTimeout(async () => {

//       setMessage("");

//       const next = questionCount + 1;
//       setQuestionCount(next);

//       if (next === TOTAL_QUESTIONS) {

//         await saveScoreToFirestore(updatedScore);

//         alert(`🏁 Finished!\nScore: ${updatedScore}/5`);

//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         setScore(updatedScore);
//         generateQuestionAI();
//       }

//     }, 800);
//   };

//   // ☁️ SAVE
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userEmail = "demo_user";

//       const userRef = doc(db, "users", userEmail);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: `TimedChallenge_${mode}`
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 📊 ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🚀 Super fast!";
//     if (accuracy > 50) return "👍 Good speed!";
//     return "💡 Try faster!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>⏱️ Timed Challenge ({mode})</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <h1>⏳ {timeLeft}s</h1>

//       <h2>Find: {target}</h2>

//       <div className="options">
//         {options.map((opt, i) => (
//           <button key={i} onClick={() => handleClick(opt)}>
//             {opt}
//           </button>
//         ))}
//       </div>

//       <p>{message}</p>

//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

// 🔥 Game Progress
import useGameProgress from "../hooks/useGameProgress";

export default function TimedChallenge() {
  const TOTAL_QUESTIONS = 5;
  const TIME_LIMIT = 5;

  // =====================================================
  // MODE
  // =====================================================

  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const mode = query.get("mode") || "letters";

  // Separate progress for letters and numbers
  const GAME_ID = `timed-challenge-${mode}`;

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

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [timeLeft, setTimeLeft] =
    useState(TIME_LIMIT);

  const [message, setMessage] = useState("");

  const [gameOver, setGameOver] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  // =====================================================
  // QUESTION GENERATOR
  // =====================================================

  const generateQuestionAI = () => {
    const base =
      mode === "numbers"
        ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const correct =
      base[
        Math.floor(
          Math.random() * base.length
        )
      ];

    const wrong = base
      .filter((item) => item !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const opts = [
      correct,
      ...wrong,
    ].sort(() => 0.5 - Math.random());

    setTarget(correct);
    setOptions(opts);
    setTimeLeft(TIME_LIMIT);
  };

  // =====================================================
  // RESTORE / INITIALIZE
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🎮 Timed Challenge saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.target &&
      Array.isArray(savedState.options)
    ) {
      console.log(
        "✅ Resuming Timed Challenge"
      );

      setTarget(savedState.target);

      setOptions(savedState.options);

      setScore(savedState.score || 0);

      setQuestionCount(
        savedState.questionCount || 0
      );

      setMessage(
        savedState.message || ""
      );

      setGameOver(
        savedState.gameOver || false
      );

      setLocked(false);

      /*
       * Never restore an old timer value.
       * Give the child a fresh 5 seconds for
       * the question they were viewing.
       */
      setTimeLeft(TIME_LIMIT);

      return;
    }

    console.log(
      "🆕 Starting new Timed Challenge"
    );

    setTarget("");
    setOptions([]);
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setGameOver(false);
    setLocked(false);

    generateQuestionAI();
  }, [GAME_ID, mode, progressLoading]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    if (gameOver) return;

    if (locked) return;

    if (questionCount >= TOTAL_QUESTIONS) {
      return;
    }

    if (!target) return;

    if (timeLeft === 0) {
      handleNext(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (previous) => previous - 1
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    timeLeft,
    questionCount,
    target,
    locked,
    gameOver,
    progressLoading,
  ]);

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleClick = (item) => {
    if (locked || gameOver) return;

    const isCorrect = item === target;

    handleNext(isCorrect);
  };

  // =====================================================
  // NEXT QUESTION
  // =====================================================

  const handleNext = async (isCorrect) => {
    if (locked || gameOver) return;

    setLocked(true);

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setScore(updatedScore);

    setMessage(
      isCorrect
        ? "⚡ Correct!"
        : "⏳ Time up / Wrong!"
    );

    const next =
      questionCount + 1;

    setQuestionCount(next);

    // ===================================================
    // FINAL QUESTION
    // ===================================================

    if (next === TOTAL_QUESTIONS) {
      const finalPercentage =
        (updatedScore /
          TOTAL_QUESTIONS) *
        100;

      await save({
        target,
        options,
        score: updatedScore,
        questionCount: next,
        timeLeft: 0,
        message:
          isCorrect
            ? "⚡ Correct!"
            : "⏳ Time up / Wrong!",
        gameOver: true,
      });

      await saveScoreToFirestore(
        updatedScore
      );

      /*
       * 🔥 Global progress
       *
       * This updates:
       * - stars
       * - history
       * - activeGames
       */
      await finish(
        finalPercentage,
        `Timed Challenge (${mode})`
      );

      setTimeout(() => {
        setGameOver(true);
        setLocked(false);
      }, 800);

      return;
    }

    // ===================================================
    // NEXT QUESTION
    // ===================================================

    setTimeout(async () => {
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
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const correct =
        base[
          Math.floor(
            Math.random() *
              base.length
          )
        ];

      const wrong = base
        .filter(
          (item) =>
            item !== correct
        )
        .sort(
          () =>
            0.5 -
            Math.random()
        )
        .slice(0, 3);

      const opts = [
        correct,
        ...wrong,
      ].sort(
        () =>
          0.5 -
          Math.random()
      );

      setTarget(correct);
      setOptions(opts);
      setTimeLeft(TIME_LIMIT);
      setMessage("");
      setLocked(false);

      await save({
        target: correct,
        options: opts,
        score: updatedScore,
        questionCount: next,
        timeLeft: TIME_LIMIT,
        message: "",
        gameOver: false,
      });
    }, 800);
  };

  // =====================================================
  // SAVE GAME RESULT
  // =====================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {
          console.warn(
            "⚠️ No Firebase user ID found"
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
            game: `TimedChallenge_${mode}`,
          }
        );

        console.log(
          "☁️ Timed Challenge result saved"
        );
      } catch (error) {
        console.error(
          "❌ Failed to save result:",
          error
        );
      }
    };

  // =====================================================
  // PERFORMANCE MESSAGE
  // =====================================================

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
        return "🚀 Super fast!";
      }

      if (accuracy > 50) {
        return "👍 Good speed!";
      }

      return "💡 Try faster!";
    };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = async () => {
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
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const correct =
      base[
        Math.floor(
          Math.random() * base.length
        )
      ];

    const wrong = base
      .filter(
        (item) =>
          item !== correct
      )
      .sort(
        () =>
          0.5 -
          Math.random()
      )
      .slice(0, 3);

    const opts = [
      correct,
      ...wrong,
    ].sort(
      () =>
        0.5 -
        Math.random()
    );

    setTarget(correct);
    setOptions(opts);
    setScore(0);
    setQuestionCount(0);
    setTimeLeft(TIME_LIMIT);
    setMessage("");
    setGameOver(false);
    setLocked(false);

    await save({
      target: correct,
      options: opts,
      score: 0,
      questionCount: 0,
      timeLeft: TIME_LIMIT,
      message: "",
      gameOver: false,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (progressLoading) {
    return (
      <div className="blend-container">
        <h2>
          ⏱️ Timed Challenge
        </h2>

        <p>
          🌱 Loading your progress...
        </p>
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
      <div className="blend-container">

        <h2>
          🏁 Challenge Complete!
        </h2>

        <div className="game-info">
          Final Score:{" "}
          {score}/{TOTAL_QUESTIONS}
        </div>

        <h1>
          {percentage.toFixed(0)}%
        </h1>

        <div className="ai-analysis">
          <p>
            {getPerformanceMessage()}
          </p>
        </div>

        <button
          className="sb-play-btn"
          onClick={playAgain}
        >
          🔄 Play Again
        </button>

      </div>
    );
  }

  // =====================================================
  // GAME UI
  // =====================================================

  return (
    <div className="blend-container">

      <h2>
        ⏱️ Timed Challenge ({mode})
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}/
        {TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      <h1>
        ⏳ {timeLeft}s
      </h1>

      <h2>
        Find: {target}
      </h2>

      <div className="options">

        {options.map(
          (opt, index) => (
            <button
              key={index}
              onClick={() =>
                handleClick(opt)
              }
              disabled={locked}
            >
              {opt}
            </button>
          )
        )}

      </div>

      <p>{message}</p>

      <div className="ai-analysis">
        <p>
          {getPerformanceMessage()}
        </p>
      </div>

    </div>
  );
}