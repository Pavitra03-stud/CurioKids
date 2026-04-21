// import { useEffect, useState } from "react";
// import { speak } from "../utils/speak";
// import "../styles/ConfusingLetters.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function ConfusingLetters() {

//   const TOTAL_QUESTIONS = 5;

//   const [target, setTarget] = useState("");
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");

//   const [mistakes, setMistakes] = useState({});
//   const [locked, setLocked] = useState(false);

//   // 🤖 AI API CALL
//   const generateQuestionAI = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/generate-confusing-letter", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ mistakes })
//       });

//       const data = await res.json();

//       console.log("AI DATA:", data);

//       if (!data.target || !data.options) {
//         throw new Error("Invalid data");
//       }

//       // ✅ FIX: avoid same letter
//       let newTarget = data.target;

//       if (newTarget === target) {
//         const letters = ["b","d","p","q","m","n","u","v","c","k","g","j","s","z"];
//         newTarget = letters[Math.floor(Math.random() * letters.length)];
//       }

//       setTarget(newTarget);
//       setOptions(data.options);

//       speak(`Find the letter ${newTarget}`);

//     } catch (err) {
//       console.error("Frontend AI error:", err);

//       // 🔥 fallback
//       setTarget("b");
//       setOptions(["b","d","p","q","b","d","p","q"]);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, []);

//   // ☁️ Save to Firestore
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
//         game: "ConfusingLetters_AI"
//       });

//       console.log("✅ Saved!");
//     } catch (error) {
//       console.error("❌ Error:", error);
//     }
//   };

//   // 🎯 Handle Click
//   const handleClick = (letter) => {

//     if (locked) return;
//     setLocked(true);

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = letter === target;
//     const updatedScore = isCorrect ? score + 1 : score;

//     if (isCorrect) {
//       setScore(updatedScore);
//       setMessage("🎉 Correct!");
//       speak("Great job!");
//     } else {
//       setMessage("💛 Try again");
//       speak("Try again");

//       setMistakes(prev => ({
//         ...prev,
//         [target]: (prev[target] || 0) + 1
//       }));
//     }

//     setTimeout(async () => {

//       setMessage("");
//       setLocked(false);

//       const nextCount = questionCount + 1;
//       setQuestionCount(nextCount);

//       // 🎯 END OF ROUND
//       if (nextCount === TOTAL_QUESTIONS) {

//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

//         // 🔁 RESET
//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         generateQuestionAI();
//       }

//     }, 800);
//   };

//   // 📊 AI Analysis
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice more!";
//   };

//   return (
//     <div className="confusing-page">

//       <div className="confusing-navbar">
//         <div className="navbar-title">
//           🤖 AI Letter Trainer
//         </div>
//       </div>

//       <div className="confusing-content">

//         <h3>
//           Question {questionCount + 1} / {TOTAL_QUESTIONS}
//         </h3>

//         <h2 className="instruction">
//           Find: <span className="target"> {target || "..."}</span>
//         </h2>

//         <div className="letters-grid">
//           {options.length > 0 ? (
//             options.map((letter, index) => (
//               <div
//                 key={index}
//                 className="letter-box"
//                 onClick={() => handleClick(letter)}
//               >
//                 {letter}
//               </div>
//             ))
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>

//         <div className="feedback">{message}</div>

//         <div className="score">
//           ⭐ Score: {score}
//         </div>

//         <div className="ai-analysis">
//           {getPerformanceMessage()}
//         </div>

//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { speak } from "../utils/speak";
import "../styles/ConfusingLetters.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ GameContext
import { useGame } from "../context/GameContext";

export default function ConfusingLetters() {

  const { addStars } = useGame(); // ✅ ADDED

  const TOTAL_QUESTIONS = 5;

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");

  const [mistakes, setMistakes] = useState({});
  const [locked, setLocked] = useState(false);

  // 🤖 AI API CALL
  const generateQuestionAI = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/generate-confusing-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mistakes })
      });

      const data = await res.json();

      if (!data.target || !data.options) {
        throw new Error("Invalid data");
      }

      let newTarget = data.target;

      if (newTarget === target) {
        const letters = ["b","d","p","q","m","n","u","v","c","k","g","j","s","z"];
        newTarget = letters[Math.floor(Math.random() * letters.length)];
      }

      setTarget(newTarget);
      setOptions(data.options);

      speak(`Find the letter ${newTarget}`);

    } catch (err) {
      console.error("Frontend AI error:", err);

      setTarget("b");
      setOptions(["b","d","p","q","b","d","p","q"]);
    }
  };

  useEffect(() => {
    generateQuestionAI();
  }, []);

  // ✅ ACTIVITY LOGGER
  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "play",
      module: "letters",
      screen: "confusing-letters",
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
        game: "ConfusingLetters_AI"
      });

      console.log("✅ Saved!");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  // 🎯 Handle Click
  const handleClick = (letter) => {

    if (locked) return;
    setLocked(true);

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = letter === target;
    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(updatedScore);
      setMessage("🎉 Correct!");
      speak("Great job!");
    } else {
      setMessage("💛 Try again");
      speak("Try again");

      setMistakes(prev => ({
        ...prev,
        [target]: (prev[target] || 0) + 1
      }));
    }

    setTimeout(async () => {

      setMessage("");
      setLocked(false);

      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      if (nextCount === TOTAL_QUESTIONS) {

        const finalPercentage = (updatedScore / TOTAL_QUESTIONS) * 100;

        // ✅ MAIN SYSTEM
        await addStars(finalPercentage, "Confusing Letters");

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
        generateQuestionAI();
      }

    }, 800);
  };

  // 📊 AI Analysis
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Practice more!";
  };

  return (
    <div className="confusing-page">

      <div className="confusing-navbar">
        <div className="navbar-title">
          🤖 AI Letter Trainer
        </div>
      </div>

      <div className="confusing-content">

        <h3>
          Question {questionCount + 1} / {TOTAL_QUESTIONS}
        </h3>

        <h2 className="instruction">
          Find: <span className="target"> {target || "..."}</span>
        </h2>

        <div className="letters-grid">
          {options.length > 0 ? (
            options.map((letter, index) => (
              <div
                key={index}
                className="letter-box"
                onClick={() => handleClick(letter)}
              >
                {letter}
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="feedback">{message}</div>

        <div className="score">
          ⭐ Score: {score}
        </div>

        <div className="ai-analysis">
          {getPerformanceMessage()}
        </div>

      </div>
    </div>
  );
}