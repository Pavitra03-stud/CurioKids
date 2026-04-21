// import { useState, useEffect } from "react";
// import "../styles/BeginningSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function BeginningSounds() {

//   const TOTAL_QUESTIONS = 5;

//   const [currentWord, setCurrentWord] = useState({});
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION (API)
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-beginning-sound", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       console.log("AI DATA:", data);

//       if (!data.word || !data.sound || !data.options) {
//         throw new Error("Invalid AI response");
//       }

//       setCurrentWord({
//         word: data.word,
//         sound: data.sound,
//         emoji: data.emoji || "🔤"
//       });

//       setOptions(data.options);

//     } catch (err) {
//       console.error("AI Error:", err);

//       // 🔥 fallback
//       const fallback = {
//         word: "Dog",
//         sound: "D",
//         emoji: "🐶",
//         options: ["D","B","M","S"]
//       };

//       setCurrentWord(fallback);
//       setOptions(fallback.options);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ LOAD FIRST QUESTION
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
//         game: "BeginningSounds_AI"
//       });

//       console.log("✅ Saved!");
//     } catch (error) {
//       console.error("❌ Firestore Error:", error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (letter) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = letter === currentWord.sound;
//     const updatedScore = isCorrect ? score + 1 : score;

//     if (isCorrect) {
//       setScore(updatedScore);
//       setFeedback("correct");
//     } else {
//       setFeedback("wrong");
//     }

//     setTimeout(async () => {

//       setFeedback("");

//       const nextCount = questionCount + 1;
//       setQuestionCount(nextCount);

//       // 🎯 END ROUND
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

//     }, 700);
//   };

//   // 📊 AI ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice more!";
//   };

//   return (
//     <div className="phonics-page">

//       <div className="letter-navbar">
//         <h2>🤖 AI Beginning Sounds</h2>
//       </div>

//       <div className="game-info">
//         <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
//         <span>Score: {score}</span>
//       </div>

//       {/* 🔥 WORD DISPLAY */}
//       <div className="word-display">
//         <div className="emoji">
//           {loading ? "⏳" : (currentWord?.emoji || "🔤")}
//         </div>
//         <h2>
//           {loading ? "Loading..." : (currentWord?.word || "Loading...")}
//         </h2>
//       </div>

//       <h3>What sound does it start with?</h3>

//       {/* 🔥 OPTIONS */}
//       <div className="options-grid">
//         {loading ? (
//           <p>Loading question...</p>
//         ) : (
//           options.map((letter, index) => (
//             <button
//               key={index}
//               className="option-btn"
//               onClick={() => handleClick(letter)}
//             >
//               {letter}
//             </button>
//           ))
//         )}
//       </div>

//       {/* 🔥 FEEDBACK */}
//       {feedback === "correct" && (
//         <div className="feedback good">🎉 Correct!</div>
//       )}

//       {feedback === "wrong" && (
//         <div className="feedback wrong">❌ Try Again</div>
//       )}

//       {/* 📊 ANALYSIS */}
//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }




import { useState, useEffect } from "react";
import "../styles/BeginningSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ GameContext
import { useGame } from "../context/GameContext";

export default function BeginningSounds() {

  const { addStars } = useGame(); // ✅ ADDED

  const TOTAL_QUESTIONS = 5;

  const [currentWord, setCurrentWord] = useState({});
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI QUESTION
  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/generate-beginning-sound", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!data.word || !data.sound || !data.options) {
        throw new Error("Invalid AI response");
      }

      setCurrentWord({
        word: data.word,
        sound: data.sound,
        emoji: data.emoji || "🔤"
      });

      setOptions(data.options);

    } catch (err) {
      console.error("AI Error:", err);

      const fallback = {
        word: "Dog",
        sound: "D",
        emoji: "🐶",
        options: ["D","B","M","S"]
      };

      setCurrentWord(fallback);
      setOptions(fallback.options);
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
      screen: "beginning-sounds",
      score: finalScore,
      timestamp: new Date(),
    });
  };

  // ☁️ SAVE RESULT (UPDATED USER SPECIFIC)
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
        game: "BeginningSounds_AI"
      });

    } catch (error) {
      console.error("❌ Firestore Error:", error);
    }
  };

  // 🎯 HANDLE CLICK
  const handleClick = (letter) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = letter === currentWord.sound;
    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(updatedScore);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    setTimeout(async () => {

      setFeedback("");

      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      if (nextCount === TOTAL_QUESTIONS) {

        // 🎯 FINAL SCORE %
        const finalPercentage = (updatedScore / TOTAL_QUESTIONS) * 100;

        // ✅ GameContext (MAIN SYSTEM)
        await addStars(finalPercentage, "Beginning Sounds");

        // ✅ Activity log
        await logActivity(finalPercentage);

        // ✅ Your existing Firestore save (kept)
        await saveScoreToFirestore(updatedScore);

        alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

        // RESET
        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        generateQuestionAI();
      }

    }, 700);
  };

  // 📊 AI ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Practice more!";
  };

  return (
    <div className="phonics-page">

      <div className="letter-navbar">
        <h2>🤖 AI Beginning Sounds</h2>
      </div>

      <div className="game-info">
        <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
        <span>Score: {score}</span>
      </div>

      <div className="word-display">
        <div className="emoji">
          {loading ? "⏳" : (currentWord?.emoji || "🔤")}
        </div>
        <h2>
          {loading ? "Loading..." : (currentWord?.word || "Loading...")}
        </h2>
      </div>

      <h3>What sound does it start with?</h3>

      <div className="options-grid">
        {loading ? (
          <p>Loading question...</p>
        ) : (
          options.map((letter, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => handleClick(letter)}
            >
              {letter}
            </button>
          ))
        )}
      </div>

      {feedback === "correct" && (
        <div className="feedback good">🎉 Correct!</div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong">❌ Try Again</div>
      )}

      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>

    </div>
  );
}