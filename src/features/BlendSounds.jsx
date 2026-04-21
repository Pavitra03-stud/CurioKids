// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function BlendSounds() {

//   const TOTAL_QUESTIONS = 5;

//   const [sounds, setSounds] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-blend", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       console.log("AI DATA:", data);

//       if (!data.sounds || !data.options || !data.answer) {
//         throw new Error("Invalid data");
//       }

//       setSounds(data.sounds);
//       setOptions(data.options);
//       setCorrectAnswer(data.answer);

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setSounds(["c","a","t"]);
//       setOptions(["cat","cap","can"]);
//       setCorrectAnswer("cat");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, []);

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
//         game: "BlendSounds_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const checkAnswer = (option) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = option === correctAnswer;
//     const updatedScore = isCorrect ? score + 1 : score;

//     if (isCorrect) {
//       setScore(updatedScore);
//       setMessage("✅ Correct!");
//     } else {
//       setMessage("❌ Try again!");
//     }

//     setTimeout(async () => {

//       setMessage("");

//       const nextCount = questionCount + 1;
//       setQuestionCount(nextCount);

//       if (nextCount === TOTAL_QUESTIONS) {

//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         generateQuestionAI();
//       }

//     }, 900);
//   };

//   // 📊 ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent blending!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice blending sounds!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🤖 AI Blend the Sounds</h2>

//       <div className="game-info">
//         <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
//         <span>Score: {score}</span>
//       </div>

//       {/* 🔊 SOUNDS */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           sounds.map((s, i) => (
//             <span key={i} className="sound-box">
//               {s}
//             </span>
//           ))
//         )}
//       </div>

//       {/* OPTIONS */}
//       <div className="options">
//         {loading ? (
//           <p>Loading options...</p>
//         ) : (
//           options.map((opt, i) => (
//             <button
//               key={i}
//               className="option-btn"
//               onClick={() => checkAnswer(opt)}
//             >
//               {opt}
//             </button>
//           ))
//         )}
//       </div>

//       <p className="message">{message}</p>

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

// ✅ GameContext
import { useGame } from "../context/GameContext";

export default function BlendSounds() {

  const { addStars } = useGame(); // ✅ ADDED

  const TOTAL_QUESTIONS = 5;

  const [sounds, setSounds] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI QUESTION
  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/generate-blend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!data.sounds || !data.options || !data.answer) {
        throw new Error("Invalid data");
      }

      setSounds(data.sounds);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

    } catch (err) {
      console.error(err);

      // fallback
      setSounds(["c","a","t"]);
      setOptions(["cat","cap","can"]);
      setCorrectAnswer("cat");
    } finally {
      setLoading(false);
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
      module: "phonics",
      screen: "blend-sounds",
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
        game: "BlendSounds_AI"
      });

    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 HANDLE CLICK
  const checkAnswer = (option) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = option === correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(updatedScore);
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Try again!");
    }

    setTimeout(async () => {

      setMessage("");

      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      if (nextCount === TOTAL_QUESTIONS) {

        const finalPercentage = (updatedScore / TOTAL_QUESTIONS) * 100;

        // ✅ MAIN SYSTEM
        await addStars(finalPercentage, "Blend Sounds");

        // ✅ ACTIVITY
        await logActivity(finalPercentage);

        // ✅ YOUR EXISTING SAVE
        await saveScoreToFirestore(updatedScore);

        alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

        // RESET
        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        generateQuestionAI();
      }

    }, 900);
  };

  // 📊 ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent blending!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Practice blending sounds!";
  };

  return (
    <div className="blend-container">

      <h2>🤖 AI Blend the Sounds</h2>

      <div className="game-info">
        <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
        <span>Score: {score}</span>
      </div>

      {/* 🔊 SOUNDS */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          sounds.map((s, i) => (
            <span key={i} className="sound-box">
              {s}
            </span>
          ))
        )}
      </div>

      {/* OPTIONS */}
      <div className="options">
        {loading ? (
          <p>Loading options...</p>
        ) : (
          options.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() => checkAnswer(opt)}
            >
              {opt}
            </button>
          ))
        )}
      </div>

      <p className="message">{message}</p>

      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>

    </div>
  );
}