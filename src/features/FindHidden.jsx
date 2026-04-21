// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function FindHidden() {

//   const TOTAL_QUESTIONS = 5;

//   // ✅ SAFE MODE HANDLING
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [target, setTarget] = useState("");
//   const [grid, setGrid] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION GENERATOR
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

//       // 🔥 fallback
//       setTarget("A");
//       setGrid(["A","B","C","D","E","F","G","H","I"]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, [mode]);

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

//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

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

//       {/* ✅ SAFE RENDER */}
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
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

// ✅ GameContext
import { useGame } from "../context/GameContext";

export default function FindHidden() {

  const { addStars } = useGame(); // ✅ ADDED

  const TOTAL_QUESTIONS = 5;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [target, setTarget] = useState("");
  const [grid, setGrid] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 GENERATE
  const generateQuestionAI = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? ["1","2","3","4","5","6","7","8","9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const randomTarget =
        base[Math.floor(Math.random() * base.length)];

      const newGrid = Array(9)
        .fill(null)
        .map(() => base[Math.floor(Math.random() * base.length)]);

      const randomIndex = Math.floor(Math.random() * 9);
      newGrid[randomIndex] = randomTarget;

      setTarget(randomTarget);
      setGrid(newGrid);

    } catch (err) {
      console.error("Error generating question:", err);

      setTarget("A");
      setGrid(["A","B","C","D","E","F","G","H","I"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestionAI();
  }, [mode]);

  // ✅ ACTIVITY LOGGER
  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "play",
      module: mode === "numbers" ? "math" : "letters",
      screen: `find-hidden-${mode}`,
      score: finalScore,
      timestamp: new Date(),
    });
  };

  // ☁️ SAVE (UPDATED USER-SPECIFIC)
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userId = localStorage.getItem("userId"); // ✅ FIXED
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: `FindHidden_${mode}`
      });

      console.log("✅ Saved");

    } catch (error) {
      console.error("Firestore error:", error);
    }
  };

  // 🎯 HANDLE CLICK
  const handleClick = (item) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = item === target;
    const updatedScore = isCorrect ? score + 1 : score;

    setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

    setTimeout(async () => {

      setMessage("");

      const next = questionCount + 1;
      setQuestionCount(next);

      if (next === TOTAL_QUESTIONS) {

        const finalPercentage = (updatedScore / TOTAL_QUESTIONS) * 100;

        // ✅ MAIN SYSTEM
        await addStars(finalPercentage, `Find Hidden (${mode})`);

        // ✅ ACTIVITY
        await logActivity(finalPercentage);

        // ✅ YOUR SAVE
        await saveScoreToFirestore(updatedScore);

        alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

        // RESET
        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        setScore(updatedScore);
        generateQuestionAI();
      }

    }, 800);
  };

  // 📊 ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Keep practicing!";
  };

  return (
    <div className="blend-container">

      <h2>🔍 Find Hidden ({mode})</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      <h2>Find: {target || "..."}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          className="options"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 80px)",
            gap: "15px",
            justifyContent: "center"
          }}
        >
          {grid.map((item, i) => (
            <button key={i} onClick={() => handleClick(item)}>
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