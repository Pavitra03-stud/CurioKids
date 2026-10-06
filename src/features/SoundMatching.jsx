// import { useState, useEffect } from "react";
// import "../styles/BeginningSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function SoundMatching() {

//   const TOTAL_QUESTIONS = 5;

//   const [currentSound, setCurrentSound] = useState("");
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-sound-matching", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       console.log("AI DATA:", data);

//       if (!data.sound || !data.options) {
//         throw new Error("Invalid data");
//       }

//       setCurrentSound(data.sound);
//       setOptions(data.options);

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setCurrentSound("B");
//       setOptions([
//         { word: "Ball", sound: "B", emoji: "⚽" },
//         { word: "Cat", sound: "C", emoji: "🐱" },
//         { word: "Dog", sound: "D", emoji: "🐶" },
//         { word: "Sun", sound: "S", emoji: "☀️" }
//       ]);
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
//         game: "SoundMatching_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (item) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = item.sound === currentSound;
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

//       if (nextCount === TOTAL_QUESTIONS) {

//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         generateQuestionAI();
//       }

//     }, 700);
//   };

//   // 📊 ANALYSIS
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
//         <h2>🤖 AI Sound Matching</h2>
//       </div>

//       <div className="game-info">
//         <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
//         <span>Score: {score}</span>
//       </div>

//       <h3>Which word starts with:</h3>

//       <div className="big-letter">
//         {loading ? "..." : `/ ${currentSound} /`}
//       </div>

//       <div className="options-grid">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           options.map((item, index) => (
//             <button
//               key={index}
//               className="option-btn"
//               onClick={() => handleClick(item)}
//             >
//               {item.emoji} {item.word}
//             </button>
//           ))
//         )}
//       </div>

//       {feedback === "correct" && (
//         <div className="feedback good">🎉 Correct!</div>
//       )}

//       {feedback === "wrong" && (
//         <div className="feedback wrong">❌ Try Again</div>
//       )}

//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }





import { useState, useEffect } from "react";
import "../styles/BeginningSounds.css";

import useGameProgress from "../hooks/useGameProgress";

export default function SoundMatching() {
  const TOTAL_QUESTIONS = 5;

  const GAME_ID = "sound-matching";

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [currentSound, setCurrentSound] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] =
    useState(0);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] =
    useState(false);

  /* =====================================================
     🤖 AI QUESTION
  ===================================================== */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-sound-matching",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("🤖 AI DATA:", data);

      if (!data.sound || !data.options) {
        throw new Error("Invalid AI data");
      }

      const question = {
        currentSound: data.sound,
        options: data.options,
      };

      setCurrentSound(question.currentSound);
      setOptions(question.options);

      return question;
    } catch (err) {
      console.error(
        "Sound Matching AI generation failed:",
        err
      );

      const fallback = {
        currentSound: "B",
        options: [
          {
            word: "Ball",
            sound: "B",
            emoji: "⚽",
          },
          {
            word: "Cat",
            sound: "C",
            emoji: "🐱",
          },
          {
            word: "Dog",
            sound: "D",
            emoji: "🐶",
          },
          {
            word: "Sun",
            sound: "S",
            emoji: "☀️",
          },
        ],
      };

      setCurrentSound(fallback.currentSound);
      setOptions(fallback.options);

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🔥 RESTORE SAVED GAME
  ===================================================== */

  useEffect(() => {
    if (progressLoading) return;

    const restoreGame = async () => {
      if (savedState) {
        console.log(
          "🔥 Restoring Sound Matching:",
          savedState
        );

        setCurrentSound(
          savedState.currentSound || ""
        );

        setOptions(
          savedState.options || []
        );

        setScore(
          savedState.score || 0
        );

        setQuestionCount(
          savedState.questionCount || 0
        );

        setFeedback(
          savedState.feedback || ""
        );

        setCompleted(
          savedState.completed || false
        );

        setLoading(false);

        return;
      }

      /* ================================================
         🆕 NEW GAME
      ================================================ */

      console.log(
        "🆕 Starting Sound Matching"
      );

      const question =
        await generateQuestionAI();

      await save({
        currentSound:
          question.currentSound,
        options: question.options,
        score: 0,
        questionCount: 0,
        feedback: "",
        completed: false,
      });
    };

    restoreGame();
  }, [progressLoading, savedState]);

  /* =====================================================
     🎯 HANDLE CLICK
  ===================================================== */

  const handleClick = (item) => {
    if (
      loading ||
      completed ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    const isCorrect =
      item.sound === currentSound;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setScore(updatedScore);

    setFeedback(
      isCorrect
        ? "correct"
        : "wrong"
    );

    setTimeout(async () => {
      const nextCount =
        questionCount + 1;

      setFeedback("");
      setQuestionCount(nextCount);

      /* ================================================
         🏆 FINAL QUESTION
      ================================================ */

      if (
        nextCount === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) *
          100;

        await finish(
          percentage,
          "AI Sound Matching"
        );

        setCompleted(true);
        setLoading(false);

        await save({
          currentSound,
          options,
          score: updatedScore,
          questionCount: nextCount,
          feedback: "",
          completed: true,
        });

        return;
      }

      /* ================================================
         ➡️ NEXT QUESTION
      ================================================ */

      const question =
        await generateQuestionAI();

      await save({
        currentSound:
          question.currentSound,
        options: question.options,
        score: updatedScore,
        questionCount: nextCount,
        feedback: "",
        completed: false,
      });

      setScore(updatedScore);
    }, 700);
  };

  /* =====================================================
     🔄 PLAY AGAIN
  ===================================================== */

  const playAgain = async () => {
    const question =
      await generateQuestionAI();

    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setCompleted(false);

    await save({
      currentSound:
        question.currentSound,
      options: question.options,
      score: 0,
      questionCount: 0,
      feedback: "",
      completed: false,
    });
  };

  /* =====================================================
     📊 PERFORMANCE
  ===================================================== */

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice more!";
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="phonics-page">

        <div className="letter-navbar">
          <h2>
            🤖 AI Sound Matching
          </h2>
        </div>

        <div className="big-letter">
          🌱
        </div>

        <p>
          Loading your progress...
        </p>

      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="phonics-page">

      <div className="letter-navbar">
        <h2>
          🤖 AI Sound Matching
        </h2>
      </div>

      {/* GAME INFO */}

      <div className="game-info">

        <span>
          Question:{" "}
          {completed
            ? TOTAL_QUESTIONS
            : questionCount + 1}
          /{TOTAL_QUESTIONS}
        </span>

        <span>
          Score: {score}
        </span>

      </div>

      {/* =================================================
          COMPLETION SCREEN
      ================================================= */}

      {completed ? (
        <div className="big-letter">

          <div>🎉</div>

          <h2>
            Round Completed!
          </h2>

          <h3>
            Score: {score}/{TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Excellent sound matching!"
              : "💡 Keep practicing sounds!"}
          </p>

          <button
            className="option-btn"
            onClick={playAgain}
          >
            🔄 Play Again
          </button>

        </div>
      ) : (
        <>
          {/* QUESTION */}

          <h3>
            Which word starts with:
          </h3>

          <div className="big-letter">
            {loading
              ? "..."
              : `/ ${currentSound} /`}
          </div>

          {/* OPTIONS */}

          <div className="options-grid">

            {loading ? (
              <p>Loading...</p>
            ) : (
              options.map(
                (item, index) => (
                  <button
                    key={index}
                    className="option-btn"
                    onClick={() =>
                      handleClick(item)
                    }
                  >
                    {item.emoji}{" "}
                    {item.word}
                  </button>
                )
              )
            )}

          </div>

          {/* FEEDBACK */}

          {feedback === "correct" && (
            <div className="feedback good">
              🎉 Correct!
            </div>
          )}

          {feedback === "wrong" && (
            <div className="feedback wrong">
              ❌ Try Again
            </div>
          )}

          {/* PERFORMANCE */}

          <div className="ai-analysis">
            <p>
              {getPerformanceMessage()}
            </p>
          </div>
        </>
      )}

    </div>
  );
}