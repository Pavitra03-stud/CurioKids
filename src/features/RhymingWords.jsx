// import { useState, useEffect } from "react";
// import "../styles/RhymingSound.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function RhymingWords() {

//   const TOTAL_QUESTIONS = 5;

//   const [currentWord, setCurrentWord] = useState({});
//   const [options, setOptions] = useState([]);

//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-rhyming", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       console.log("AI DATA:", data);

//       if (!data.word || !data.options || !data.answer) {
//         throw new Error("Invalid data");
//       }

//       setCurrentWord({
//         word: data.word,
//         emoji: data.emoji || "🔤"
//       });

//       setCorrectAnswer(data.answer);
//       setOptions(data.options);

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setCurrentWord({ word: "Cat", emoji: "🐱" });
//       setCorrectAnswer("Hat");
//       setOptions(["Hat","Log","Fun","Tall"]);
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
//         game: "RhymingWords_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (selected) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = selected === correctAnswer;
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
//         <h2>🤖 AI Rhyming Words</h2>
//       </div>

//       <div className="game-info">
//         <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
//         <span>Score: {score}</span>
//       </div>

//       <div className="word-display">
//         <div className="emoji">
//           {loading ? "⏳" : (currentWord?.emoji || "🔤")}
//         </div>
//         <h2>
//           {loading ? "Loading..." : (currentWord?.word || "Loading...")}
//         </h2>
//       </div>

//       <h3>Which word rhymes with:</h3>

//       <div className="options-grid">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           options.map((word, index) => (
//             <button
//               key={index}
//               className="option-btn"
//               onClick={() => handleClick(word)}
//             >
//               {word}
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
import "../styles/RhymingSound.css";

import useGameProgress from "../hooks/useGameProgress";

export default function RhymingWords() {
  const TOTAL_QUESTIONS = 5;

  const GAME_ID = "rhyming-words";

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [currentWord, setCurrentWord] = useState({});
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);

  /* =====================================================
     🤖 AI QUESTION
  ===================================================== */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-rhyming",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("🤖 AI DATA:", data);

      if (!data.word || !data.options || !data.answer) {
        throw new Error("Invalid AI data");
      }

      const question = {
        word: data.word,
        emoji: data.emoji || "🔤",
      };

      setCurrentWord(question);
      setCorrectAnswer(data.answer);
      setOptions(data.options);

      return {
        currentWord: question,
        correctAnswer: data.answer,
        options: data.options,
      };
    } catch (err) {
      console.error("AI generation failed:", err);

      // Fallback question
      const fallback = {
        currentWord: {
          word: "Cat",
          emoji: "🐱",
        },
        correctAnswer: "Hat",
        options: ["Hat", "Log", "Fun", "Tall"],
      };

      setCurrentWord(fallback.currentWord);
      setCorrectAnswer(fallback.correctAnswer);
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
          "🔥 Restoring Rhyming Words:",
          savedState
        );

        setCurrentWord(savedState.currentWord || {});
        setCorrectAnswer(savedState.correctAnswer || "");
        setOptions(savedState.options || []);

        setScore(savedState.score || 0);
        setQuestionCount(
          savedState.questionCount || 0
        );

        setFeedback(savedState.feedback || "");
        setCompleted(savedState.completed || false);

        setLoading(false);

        return;
      }

      console.log("🆕 Starting new Rhyming Words game");

      const question = await generateQuestionAI();

      await save({
        currentWord: question.currentWord,
        correctAnswer: question.correctAnswer,
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
     🎯 HANDLE ANSWER
  ===================================================== */

  const handleClick = (selected) => {
    if (
      loading ||
      completed ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    const isCorrect = selected === correctAnswer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setScore(updatedScore);

    setFeedback(
      isCorrect ? "correct" : "wrong"
    );

    setTimeout(async () => {
      const nextCount = questionCount + 1;

      setFeedback("");
      setQuestionCount(nextCount);

      /* ================================================
         🏆 FINAL QUESTION
      ================================================ */

      if (nextCount === TOTAL_QUESTIONS) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        await finish(
          percentage,
          "AI Rhyming Words"
        );

        setCompleted(true);
        setLoading(false);

        await save({
          currentWord,
          correctAnswer,
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

      const question = await generateQuestionAI();

      await save({
        currentWord: question.currentWord,
        correctAnswer: question.correctAnswer,
        options: question.options,
        score: updatedScore,
        questionCount: nextCount,
        feedback: "",
        completed: false,
      });
    }, 700);
  };

  /* =====================================================
     🔄 PLAY AGAIN
  ===================================================== */

  const playAgain = async () => {
    const question = await generateQuestionAI();

    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setCompleted(false);

    await save({
      currentWord: question.currentWord,
      correctAnswer: question.correctAnswer,
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
    if (questionCount === 0) return "";

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
     ⏳ PROGRESS LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="phonics-page">
        <div className="letter-navbar">
          <h2>🤖 AI Rhyming Words</h2>
        </div>

        <div className="word-display">
          <div className="emoji">⏳</div>

          <h2>Loading your progress...</h2>
        </div>
      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="phonics-page">

      <div className="letter-navbar">
        <h2>🤖 AI Rhyming Words</h2>
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
        <div className="word-display">

          <div className="emoji">
            🎉
          </div>

          <h2>
            Round Completed!
          </h2>

          <h3>
            Score: {score}/{TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Excellent rhyming skills!"
              : "💡 Keep practicing your rhyming words!"}
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
          {/* WORD */}
          <div className="word-display">

            <div className="emoji">
              {loading
                ? "⏳"
                : currentWord?.emoji || "🔤"}
            </div>

            <h2>
              {loading
                ? "Loading..."
                : currentWord?.word ||
                  "Loading..."}
            </h2>

          </div>

          <h3>
            Which word rhymes with:
          </h3>

          {/* OPTIONS */}
          <div className="options-grid">

            {loading ? (
              <p>Loading...</p>
            ) : (
              options.map((word, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() =>
                    handleClick(word)
                  }
                >
                  {word}
                </button>
              ))
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

          {/* AI ANALYSIS */}
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