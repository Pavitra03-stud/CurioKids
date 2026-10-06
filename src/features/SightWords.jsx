// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function SightWords() {

//   const TOTAL_QUESTIONS = 5;

//   const [emoji, setEmoji] = useState("");
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

//       const res = await fetch("http://localhost:5000/api/generate-sight-word", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (!data.emoji || !data.options || !data.answer) {
//         throw new Error("Invalid data");
//       }

//       setEmoji(data.emoji);
//       setOptions(data.options);
//       setCorrectAnswer(data.answer);

//     } catch (err) {
//       console.error(err);

//       setEmoji("🐱");
//       setOptions(["cat","dog","sun","pen"]);
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
//         game: "SightWords_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (word) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = word === correctAnswer;
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

//     if (accuracy > 80) return "🌟 Excellent reading!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice more sight words!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🤖 Sight Words</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <div className="big-letter">
//         {loading ? "..." : emoji}
//       </div>

//       <h3>Tap the correct word</h3>

//       <div className="options">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           options.map((w, i) => (
//             <button key={i} onClick={() => handleClick(w)}>
//               {w}
//             </button>
//           ))
//         )}
//       </div>

//       <p>{message}</p>

//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }





import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

import useGameProgress from "../hooks/useGameProgress";

export default function SightWords() {
  const TOTAL_QUESTIONS = 5;

  const GAME_ID = "sight-words";

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [emoji, setEmoji] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);

  /* =====================================================
     🤖 AI QUESTION
  ===================================================== */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-sight-word",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (
        !data.emoji ||
        !data.options ||
        !data.answer
      ) {
        throw new Error("Invalid AI data");
      }

      const question = {
        emoji: data.emoji,
        options: data.options,
        correctAnswer: data.answer,
      };

      setEmoji(question.emoji);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);

      return question;
    } catch (err) {
      console.error(
        "Sight Words AI generation failed:",
        err
      );

      const fallback = {
        emoji: "🐱",
        options: ["cat", "dog", "sun", "pen"],
        correctAnswer: "cat",
      };

      setEmoji(fallback.emoji);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.correctAnswer);

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
          "🔥 Restoring Sight Words:",
          savedState
        );

        setEmoji(savedState.emoji || "");
        setOptions(savedState.options || []);
        setCorrectAnswer(
          savedState.correctAnswer || ""
        );

        setScore(savedState.score || 0);

        setQuestionCount(
          savedState.questionCount || 0
        );

        setMessage(savedState.message || "");

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
        "🆕 Starting new Sight Words game"
      );

      const question =
        await generateQuestionAI();

      await save({
        emoji: question.emoji,
        options: question.options,
        correctAnswer: question.correctAnswer,
        score: 0,
        questionCount: 0,
        message: "",
        completed: false,
      });
    };

    restoreGame();
  }, [progressLoading, savedState]);

  /* =====================================================
     🎯 HANDLE CLICK
  ===================================================== */

  const handleClick = (word) => {
    if (
      loading ||
      completed ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    const isCorrect =
      word === correctAnswer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setMessage(
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!"
    );

    setTimeout(async () => {
      const nextQuestion =
        questionCount + 1;

      setMessage("");
      setQuestionCount(nextQuestion);

      /* ================================================
         🏆 FINAL QUESTION
      ================================================ */

      if (
        nextQuestion === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) *
          100;

        await finish(
          percentage,
          "AI Sight Words"
        );

        setScore(updatedScore);
        setCompleted(true);
        setLoading(false);

        await save({
          emoji,
          options,
          correctAnswer,
          score: updatedScore,
          questionCount: nextQuestion,
          message: "",
          completed: true,
        });

        return;
      }

      /* ================================================
         ➡️ NEXT QUESTION
      ================================================ */

      setScore(updatedScore);

      const question =
        await generateQuestionAI();

      await save({
        emoji: question.emoji,
        options: question.options,
        correctAnswer: question.correctAnswer,
        score: updatedScore,
        questionCount: nextQuestion,
        message: "",
        completed: false,
      });
    }, 800);
  };

  /* =====================================================
     🔄 PLAY AGAIN
  ===================================================== */

  const playAgain = async () => {
    const question =
      await generateQuestionAI();

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);

    await save({
      emoji: question.emoji,
      options: question.options,
      correctAnswer: question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
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
      return "🌟 Excellent reading!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice more sight words!";
  };

  /* =====================================================
     ⏳ PROGRESS LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="blend-container">
        <h2>🤖 Sight Words</h2>

        <p>🌱 Loading your progress...</p>
      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="blend-container">

      <h2>🤖 Sight Words</h2>

      <div className="game-info">
        Question{" "}
        {completed
          ? TOTAL_QUESTIONS
          : questionCount + 1}
        /{TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      {/* =================================================
          COMPLETION SCREEN
      ================================================= */}

      {completed ? (
        <div className="ai-analysis">

          <div className="big-letter">
            🎉
          </div>

          <h2>Round Completed!</h2>

          <h3>
            Score: {score}/{TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Excellent reading!"
              : "💡 Keep practicing sight words!"}
          </p>

          <button onClick={playAgain}>
            🔄 Play Again
          </button>

        </div>
      ) : (
        <>
          {/* =================================================
              EMOJI
          ================================================= */}

          <div className="big-letter">
            {loading
              ? "..."
              : emoji}
          </div>

          <h3>
            Tap the correct word
          </h3>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <div className="options">
            {loading ? (
              <p>Loading...</p>
            ) : (
              options.map((word, index) => (
                <button
                  key={index}
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
          <p>{message}</p>

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