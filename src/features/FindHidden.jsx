// // import { useState, useEffect } from "react";
// // import "../styles/BlendSounds.css";

// // // 🔥 Firebase
// // import { db } from "../firebase";
// // import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // // 🔥 Router
// // import { useLocation } from "react-router-dom";

// // export default function FindHidden() {

// //   const TOTAL_QUESTIONS = 5;

// //   // ✅ SAFE MODE HANDLING
// //   const location = useLocation();
// //   const query = new URLSearchParams(location.search);
// //   const mode = query.get("mode") || "letters";

// //   const [target, setTarget] = useState("");
// //   const [grid, setGrid] = useState([]);

// //   const [score, setScore] = useState(0);
// //   const [questionCount, setQuestionCount] = useState(0);

// //   const [message, setMessage] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   // 🤖 AI QUESTION GENERATOR
// //   const generateQuestionAI = () => {
// //     try {
// //       setLoading(true);

// //       const base =
// //         mode === "numbers"
// //           ? ["1","2","3","4","5","6","7","8","9"]
// //           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// //       const randomTarget =
// //         base[Math.floor(Math.random() * base.length)];

// //       const newGrid = Array(9)
// //         .fill(null)
// //         .map(() => base[Math.floor(Math.random() * base.length)]);

// //       const randomIndex = Math.floor(Math.random() * 9);
// //       newGrid[randomIndex] = randomTarget;

// //       setTarget(randomTarget);
// //       setGrid(newGrid);

// //     } catch (err) {
// //       console.error("Error generating question:", err);

// //       // 🔥 fallback
// //       setTarget("A");
// //       setGrid(["A","B","C","D","E","F","G","H","I"]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     generateQuestionAI();
// //   }, [mode]);

// //   // ☁️ SAVE
// //   const saveScoreToFirestore = async (finalScore) => {
// //     try {
// //       const userEmail = "demo_user";

// //       const userRef = doc(db, "users", userEmail);
// //       const gameResultsRef = collection(userRef, "game_results");

// //       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

// //       await addDoc(gameResultsRef, {
// //         score: finalScore,
// //         totalQuestions: TOTAL_QUESTIONS,
// //         accuracy: accuracy.toFixed(2),
// //         createdAt: Timestamp.now(),
// //         game: `FindHidden_${mode}`
// //       });

// //       console.log("✅ Saved");

// //     } catch (error) {
// //       console.error("Firestore error:", error);
// //     }
// //   };

// //   // 🎯 HANDLE CLICK
// //   const handleClick = (item) => {

// //     if (questionCount >= TOTAL_QUESTIONS) return;

// //     const isCorrect = item === target;
// //     const updatedScore = isCorrect ? score + 1 : score;

// //     setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

// //     setTimeout(async () => {

// //       setMessage("");

// //       const next = questionCount + 1;
// //       setQuestionCount(next);

// //       if (next === TOTAL_QUESTIONS) {

// //         await saveScoreToFirestore(updatedScore);

// //         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

// //         setScore(0);
// //         setQuestionCount(0);
// //         generateQuestionAI();

// //       } else {
// //         setScore(updatedScore);
// //         generateQuestionAI();
// //       }

// //     }, 800);
// //   };

// //   // 📊 ANALYSIS
// //   const getPerformanceMessage = () => {
// //     if (questionCount === 0) return "";

// //     const accuracy = (score / questionCount) * 100;

// //     if (accuracy > 80) return "🌟 Excellent!";
// //     if (accuracy > 50) return "👍 Good job!";
// //     return "💡 Keep practicing!";
// //   };

// //   return (
// //     <div className="blend-container">

// //       <h2>🔍 Find Hidden ({mode})</h2>

// //       <div className="game-info">
// //         Question {questionCount + 1}/5 | Score: {score}
// //       </div>

// //       <h2>Find: {target || "..."}</h2>

// //       {/* ✅ SAFE RENDER */}
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <div
// //           className="options"
// //           style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(3, 80px)",
// //             gap: "15px",
// //             justifyContent: "center"
// //           }}
// //         >
// //           {grid.map((item, i) => (
// //             <button key={i} onClick={() => handleClick(item)}>
// //               {item}
// //             </button>
// //           ))}
// //         </div>
// //       )}

// //       <p>{message}</p>

// //       <div className="ai-analysis">
// //         <p>{getPerformanceMessage()}</p>
// //       </div>

// //     </div>
// //   );
// // }




// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// // ✅ GameContext
// import { useGame } from "../context/GameContext";

// export default function FindHidden() {

//   const { addStars } = useGame(); // ✅ ADDED

//   const TOTAL_QUESTIONS = 5;

//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [target, setTarget] = useState("");
//   const [grid, setGrid] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 GENERATE
//   const generateQuestionAI = () => {
//     try {
//       setLoading(true);

//       const base =
//         mode === "numbers"
//           ? ["1","2","3","4","5","6","7","8","9"]
//           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//       const randomTarget =
//         base[Math.floor(Math.random() * base.length)];

//       const newGrid = Array(9)
//         .fill(null)
//         .map(() => base[Math.floor(Math.random() * base.length)]);

//       const randomIndex = Math.floor(Math.random() * 9);
//       newGrid[randomIndex] = randomTarget;

//       setTarget(randomTarget);
//       setGrid(newGrid);

//     } catch (err) {
//       console.error("Error generating question:", err);

//       setTarget("A");
//       setGrid(["A","B","C","D","E","F","G","H","I"]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, [mode]);

//   // ✅ ACTIVITY LOGGER
//   const logActivity = async (finalScore) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     await addDoc(collection(db, "activity"), {
//       userId,
//       action: "play",
//       module: mode === "numbers" ? "math" : "letters",
//       screen: `find-hidden-${mode}`,
//       score: finalScore,
//       timestamp: new Date(),
//     });
//   };

//   // ☁️ SAVE (UPDATED USER-SPECIFIC)
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userId = localStorage.getItem("userId"); // ✅ FIXED
//       if (!userId) return;

//       const userRef = doc(db, "users", userId);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: `FindHidden_${mode}`
//       });

//       console.log("✅ Saved");

//     } catch (error) {
//       console.error("Firestore error:", error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (item) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = item === target;
//     const updatedScore = isCorrect ? score + 1 : score;

//     setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

//     setTimeout(async () => {

//       setMessage("");

//       const next = questionCount + 1;
//       setQuestionCount(next);

//       if (next === TOTAL_QUESTIONS) {

//         const finalPercentage = (updatedScore / TOTAL_QUESTIONS) * 100;

//         // ✅ MAIN SYSTEM
//         await addStars(finalPercentage, `Find Hidden (${mode})`);

//         // ✅ ACTIVITY
//         await logActivity(finalPercentage);

//         // ✅ YOUR SAVE
//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

//         // RESET
//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         setScore(updatedScore);
//         generateQuestionAI();
//       }

//     }, 800);
//   };

//   // 📊 ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Keep practicing!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🔍 Find Hidden ({mode})</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <h2>Find: {target || "..."}</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div
//           className="options"
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 80px)",
//             gap: "15px",
//             justifyContent: "center"
//           }}
//         >
//           {grid.map((item, i) => (
//             <button key={i} onClick={() => handleClick(item)}>
//               {item}
//             </button>
//           ))}
//         </div>
//       )}

//       <p>{message}</p>

//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }





import { useState, useEffect } from "react";
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

// 🎮 Game Progress
import useGameProgress from "../hooks/useGameProgress";

export default function FindHidden() {
  const TOTAL_QUESTIONS = 5;

  // 🔥 Get mode from URL
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  // 🎮 Unique game ID for each mode
  const GAME_ID = `find-hidden-${mode}`;

  const INITIAL_STATE = {
    target: "",
    grid: [],
    score: 0,
    questionCount: 0,
    message: "",
    completed: false,
  };

  // 🎮 Firebase progress
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [target, setTarget] = useState("");
  const [grid, setGrid] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [answering, setAnswering] = useState(false);

  // =========================================================
  // 🤖 GENERATE QUESTION
  // =========================================================

  const generateQuestion = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const randomTarget =
        base[Math.floor(Math.random() * base.length)];

      const newGrid = Array(9)
        .fill(null)
        .map(
          () => base[Math.floor(Math.random() * base.length)]
        );

      // Put correct target somewhere in the grid
      const randomIndex = Math.floor(Math.random() * 9);
      newGrid[randomIndex] = randomTarget;

      setTarget(randomTarget);
      setGrid(newGrid);
    } catch (err) {
      console.error("❌ Error generating question:", err);

      const fallbackTarget = mode === "numbers" ? "1" : "A";

      const fallbackGrid =
        mode === "numbers"
          ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
          : ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

      setTarget(fallbackTarget);
      setGrid(fallbackGrid);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🔥 RESTORE SAVED GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log("🎮 Find Hidden restore:", savedState);

    if (
      savedState &&
      savedState.target &&
      Array.isArray(savedState.grid) &&
      savedState.grid.length === 9
    ) {
      console.log("✅ Resuming Find Hidden");

      setTarget(savedState.target);
      setGrid(savedState.grid);

      setScore(savedState.score || 0);
      setQuestionCount(savedState.questionCount || 0);
      setMessage(savedState.message || "");

      setLoading(false);
    } else {
      console.log("🆕 Starting new Find Hidden game");

      setScore(0);
      setQuestionCount(0);
      setMessage("");

      generateQuestion();
    }
  }, [progressLoading, GAME_ID]);

  // =========================================================
  // ☁️ ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (finalScore) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn("⚠️ No Firebase userId found");
        return;
      }

      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: mode === "numbers" ? "math" : "letters",
        screen: `find-hidden-${mode}`,
        score: finalScore,
        timestamp: Timestamp.now(),
      });

      console.log("✅ Activity saved");
    } catch (error) {
      console.error("❌ Activity save error:", error);
    }
  };

  // =========================================================
  // ☁️ SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn("⚠️ No Firebase userId found");
        return;
      }

      const userRef = doc(db, "users", userId);

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
        game: `FindHidden_${mode}`,
      });

      console.log("✅ Game result saved");
    } catch (error) {
      console.error("❌ Firestore error:", error);
    }
  };

  // =========================================================
  // 💾 SAVE CURRENT GAME STATE
  // =========================================================

  const saveCurrentState = async ({
    newScore = score,
    newQuestionCount = questionCount,
    newMessage = message,
    newTarget = target,
    newGrid = grid,
  } = {}) => {
    await save({
      target: newTarget,
      grid: newGrid,
      score: newScore,
      questionCount: newQuestionCount,
      message: newMessage,
      completed: false,
    });
  };

  // =========================================================
  // 🎯 HANDLE CLICK
  // =========================================================

  const handleClick = (item) => {
    if (answering) return;

    if (questionCount >= TOTAL_QUESTIONS) return;

    setAnswering(true);

    const isCorrect = item === target;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const nextQuestionCount = questionCount + 1;

    const feedback = isCorrect
      ? "✅ Correct!"
      : "❌ Try again!";

    setMessage(feedback);

    // Save answer immediately
    save({
      target,
      grid,
      score: updatedScore,
      questionCount: nextQuestionCount,
      message: feedback,
      completed: false,
    });

    setTimeout(async () => {
      setMessage("");

      // =====================================================
      // 🏁 FINAL QUESTION
      // =====================================================

      if (nextQuestionCount === TOTAL_QUESTIONS) {
        const finalPercentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        console.log(
          "🏁 Find Hidden completed:",
          updatedScore,
          finalPercentage
        );

        // ⭐ Main progress system
        await finish(
          finalPercentage,
          `Find Hidden (${mode})`
        );

        // 📊 Activity
        await logActivity(finalPercentage);

        // ☁️ Detailed game result
        await saveScoreToFirestore(updatedScore);

        alert(
          `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // =====================================================
        // 🔄 START NEW ROUND
        // =====================================================

        const base =
          mode === "numbers"
            ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
            : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        const newTarget =
          base[Math.floor(Math.random() * base.length)];

        const newGrid = Array(9)
          .fill(null)
          .map(
            () =>
              base[Math.floor(Math.random() * base.length)]
          );

        const randomIndex = Math.floor(Math.random() * 9);

        newGrid[randomIndex] = newTarget;

        setTarget(newTarget);
        setGrid(newGrid);
        setScore(0);
        setQuestionCount(0);
        setMessage("");
        setAnswering(false);

        // Start next round
        await save({
          target: newTarget,
          grid: newGrid,
          score: 0,
          questionCount: 0,
          message: "",
          completed: false,
        });

        return;
      }

      // =====================================================
      // ➡️ NEXT QUESTION
      // =====================================================

      const base =
        mode === "numbers"
          ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const nextTarget =
        base[Math.floor(Math.random() * base.length)];

      const nextGrid = Array(9)
        .fill(null)
        .map(
          () =>
            base[Math.floor(Math.random() * base.length)]
        );

      const randomIndex = Math.floor(Math.random() * 9);

      nextGrid[randomIndex] = nextTarget;

      setTarget(nextTarget);
      setGrid(nextGrid);

      setScore(updatedScore);
      setQuestionCount(nextQuestionCount);
      setMessage("");
      setAnswering(false);

      // 💾 Save exact next question
      await save({
        target: nextTarget,
        grid: nextGrid,
        score: updatedScore,
        questionCount: nextQuestionCount,
        message: "",
        completed: false,
      });
    }, 800);
  };

  // =========================================================
  // 📊 PERFORMANCE
  // =========================================================

  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Keep practicing!";
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (progressLoading) {
    return (
      <div className="blend-container">
        <h2>🔍 Find Hidden</h2>
        <p>⏳ Loading your progress...</p>
      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="blend-container">
      <h2>🔍 Find Hidden ({mode})</h2>

      <div className="game-info">
        Question{" "}
        {Math.min(questionCount + 1, TOTAL_QUESTIONS)}
        /{TOTAL_QUESTIONS} | Score: {score}
      </div>

      <h2>
        Find: {target || "..."}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="options"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 80px)",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          {grid.map((item, i) => (
            <button
              key={i}
              onClick={() => handleClick(item)}
              disabled={answering}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <p>{message}</p>

      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>
    </div>
  );
}