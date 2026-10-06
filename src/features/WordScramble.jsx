// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function WordScramble() {

//   const TOTAL_QUESTIONS = 5;

//   const [scrambled, setScrambled] = useState("");
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

//       const res = await fetch("http://localhost:5000/api/generate-scramble", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (!data.scrambled || !data.options || !data.answer) {
//         throw new Error("Invalid data");
//       }

//       setScrambled(data.scrambled);
//       setOptions(data.options);
//       setCorrectAnswer(data.answer);

//     } catch (err) {
//       console.error(err);

//       setScrambled("TAC");
//       setOptions(["cat","act","cut","bat"]);
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
//         game: "WordScramble_AI"
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

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice spelling!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🤖 Word Scramble</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <div className="big-letter">
//         {loading ? "..." : scrambled}
//       </div>

//       <h3>Unscramble the word</h3>

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

// 🔥 Game Progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "word-scramble";
const TOTAL_QUESTIONS = 5;

export default function WordScramble() {
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

  const [scrambled, setScrambled] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [correctAnswer, setCorrectAnswer] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  // =====================================================
  // GENERATE AI QUESTION
  // =====================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-scramble",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to generate question"
        );
      }

      const data = await res.json();

      if (
        !data.scrambled ||
        !data.options ||
        !data.answer
      ) {
        throw new Error(
          "Invalid AI data"
        );
      }

      return {
        scrambled: data.scrambled,
        options: data.options,
        correctAnswer: data.answer,
      };
    } catch (err) {
      console.error(
        "❌ AI Scramble Error:",
        err
      );

      // 🔥 Fallback question
      return {
        scrambled: "TAC",
        options: [
          "cat",
          "act",
          "cut",
          "bat",
        ],
        correctAnswer: "cat",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESTORE / INITIALIZE
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🤖 Word Scramble saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.scrambled &&
      Array.isArray(
        savedState.options
      ) &&
      savedState.correctAnswer
    ) {
      console.log(
        "✅ Resuming Word Scramble"
      );

      setScrambled(
        savedState.scrambled
      );

      setOptions(
        savedState.options
      );

      setCorrectAnswer(
        savedState.correctAnswer
      );

      setScore(
        savedState.score || 0
      );

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

      return;
    }

    console.log(
      "🆕 Starting new Word Scramble"
    );

    startNewQuestion();
  }, [progressLoading]);

  // =====================================================
  // START NEW QUESTION
  // =====================================================

  const startNewQuestion = async () => {
    const question =
      await generateQuestionAI();

    setScrambled(
      question.scrambled
    );

    setOptions(
      question.options
    );

    setCorrectAnswer(
      question.correctAnswer
    );

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setGameOver(false);
    setLocked(false);

    await save({
      scrambled:
        question.scrambled,
      options:
        question.options,
      correctAnswer:
        question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      gameOver: false,
    });
  };

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleClick = (word) => {
    if (
      locked ||
      gameOver ||
      loading ||
      questionCount >=
        TOTAL_QUESTIONS
    ) {
      return;
    }

    setLocked(true);

    const isCorrect =
      word === correctAnswer;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const feedback =
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!";

    setScore(updatedScore);

    setMessage(feedback);

    const next =
      questionCount + 1;

    setQuestionCount(next);

    // ===================================================
    // FINAL QUESTION
    // ===================================================

    if (
      next ===
      TOTAL_QUESTIONS
    ) {
      setTimeout(
        async () => {
          const percentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          // Save completed state
          await save({
            scrambled,
            options,
            correctAnswer,
            score: updatedScore,
            questionCount: next,
            message: feedback,
            gameOver: true,
          });

          // Save result
          await saveScoreToFirestore(
            updatedScore
          );

          // Global progress
          await finish(
            percentage,
            "Word Scramble"
          );

          setGameOver(true);
          setLocked(false);
        },
        800
      );

      return;
    }

    // ===================================================
    // NEXT AI QUESTION
    // ===================================================

    setTimeout(async () => {
      setMessage("");

      const question =
        await generateQuestionAI();

      setScrambled(
        question.scrambled
      );

      setOptions(
        question.options
      );

      setCorrectAnswer(
        question.correctAnswer
      );

      setLocked(false);

      await save({
        scrambled:
          question.scrambled,
        options:
          question.options,
        correctAnswer:
          question.correctAnswer,
        score: updatedScore,
        questionCount: next,
        message: "",
        gameOver: false,
      });
    }, 800);
  };

  // =====================================================
  // SAVE RESULT
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
            "❌ No Firebase user ID"
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
            game:
              "WordScramble_AI",
          }
        );

        console.log(
          "✅ Word Scramble result saved"
        );
      } catch (error) {
        console.error(
          "❌ Error saving result:",
          error
        );
      }
    };

  // =====================================================
  // PERFORMANCE
  // =====================================================

  const getPerformanceMessage =
    () => {
      if (
        questionCount === 0
      ) {
        return "";
      }

      const accuracy =
        (score /
          questionCount) *
        100;

      if (accuracy > 80) {
        return "🌟 Excellent!";
      }

      if (accuracy > 50) {
        return "👍 Good job!";
      }

      return "💡 Practice spelling!";
    };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = async () => {
    setLoading(true);

    const question =
      await generateQuestionAI();

    setScrambled(
      question.scrambled
    );

    setOptions(
      question.options
    );

    setCorrectAnswer(
      question.correctAnswer
    );

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setGameOver(false);
    setLocked(false);

    await save({
      scrambled:
        question.scrambled,
      options:
        question.options,
      correctAnswer:
        question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      gameOver: false,
    });
  };

  // =====================================================
  // LOADING PROGRESS
  // =====================================================

  if (progressLoading) {
    return (
      <div className="blend-container">

        <h2>
          🤖 Word Scramble
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
          🏆 Word Scramble Complete!
        </h2>

        <div className="game-info">
          Score: {score}/
          {TOTAL_QUESTIONS}
        </div>

        <div className="big-letter">
          {percentage.toFixed(0)}%
        </div>

        <div className="ai-analysis">
          <p>
            {getPerformanceMessage()}
          </p>
        </div>

        <button
          className="option-btn"
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
        🤖 Word Scramble
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}/
        {TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      <div className="big-letter">
        {loading
          ? "..."
          : scrambled}
      </div>

      <h3>
        Unscramble the word
      </h3>

      <div className="options">

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          options.map(
            (word, index) => (
              <button
                key={index}
                onClick={() =>
                  handleClick(
                    word
                  )
                }
                disabled={
                  locked
                }
              >
                {word}
              </button>
            )
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