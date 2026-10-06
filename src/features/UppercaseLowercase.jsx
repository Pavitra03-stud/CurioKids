// import { useState, useEffect } from "react";
// import "../styles/UppercaseLowercase.css";

// // 🔥 Firebase
// import { db, auth } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function UppercaseLowercase() {
//   const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//   // 🤖 States
//   const [currentUpper, setCurrentUpper] = useState("");
//   const [options, setOptions] = useState([]);
//   const [feedback, setFeedback] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const TOTAL_QUESTIONS = 5;

//   // 🤖 Generate Question
//   const generateQuestionAI = () => {
//     const randomUpper =
//       uppercase[Math.floor(Math.random() * uppercase.length)];

//     const correct = randomUpper.toLowerCase();

//     const allLower = "abcdefghijklmnopqrstuvwxyz".split("");

//     const wrong = allLower
//       .filter((l) => l !== correct)
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 3);

//     const options = [...wrong, correct].sort(
//       () => 0.5 - Math.random()
//     );

//     return {
//       question: randomUpper,
//       options,
//       answer: correct,
//     };
//   };

//   // Load first question
//   useEffect(() => {
//     loadNewQuestion();
//   }, []);

//   const loadNewQuestion = () => {
//     const q = generateQuestionAI();
//     setCurrentUpper(q.question);
//     setOptions(q.options);
//   };

//   // 🔥 Save to Firestore (per logged-in user)
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const user = auth.currentUser;

//       if (!user) {
//         console.log("❌ No user logged in");
//         return;
//       }

//       const userRef = doc(db, "users", user.uid);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: "Uppercase-Lowercase",
//         userEmail: user.email
//       });

//       console.log("✅ Saved for user:", user.email);
//     } catch (error) {
//       console.error("❌ Error saving:", error);
//     }
//   };

//   // 🎯 Handle Answer
//   const handleClick = (selected) => {
//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = selected === currentUpper.toLowerCase();

//     if (isCorrect) {
//       setScore((prev) => prev + 1);
//       setFeedback("correct");
//     } else {
//       setFeedback("wrong");
//     }

//     setTimeout(async () => {
//       setFeedback("");

//       const nextCount = questionCount + 1;
//       const finalScore = score + (isCorrect ? 1 : 0);

//       setQuestionCount(nextCount);

//       // 🔥 End of round
//       if (nextCount === TOTAL_QUESTIONS) {
//         await saveScoreToFirestore(finalScore);

//         alert(
//           `🎯 Round Completed!\nScore: ${finalScore} / ${TOTAL_QUESTIONS}`
//         );

//         // 🔁 Reset
//         setScore(0);
//         setQuestionCount(0);
//         loadNewQuestion();
//       } else {
//         loadNewQuestion();
//       }
//     }, 800);
//   };

//   // 📊 Performance Message
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Keep practicing!";
//   };

//   return (
//     <div className="case-page">
//       <div className="letter-navbar">
//         <h2>🔤 AI Letter Matching Game</h2>
//       </div>

//       <div className="instruction">
//         Question {questionCount + 1} of {TOTAL_QUESTIONS}
//       </div>

//       <div className="big-letter">
//         {currentUpper}
//       </div>

//       <div className="options-grid">
//         {options.map((letter) => (
//           <button
//             key={letter}
//             className="option-btn"
//             onClick={() => handleClick(letter)}
//           >
//             {letter}
//           </button>
//         ))}
//       </div>

//       {feedback === "correct" && (
//         <div className="feedback good">🎉 Correct!</div>
//       )}

//       {feedback === "wrong" && (
//         <div className="feedback wrong">❌ Try Again</div>
//       )}

//       {/* 📊 Score */}
//       <div className="ai-analysis">
//         <p>Score: {score} / {questionCount}</p>
//         <p>{getPerformanceMessage()}</p>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import "../styles/UppercaseLowercase.css";

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

const GAME_ID = "uppercase-lowercase";
const TOTAL_QUESTIONS = 5;

export default function UppercaseLowercase() {
  const uppercase =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

  const [currentUpper, setCurrentUpper] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  // =====================================================
  // GENERATE QUESTION
  // =====================================================

  const generateQuestionAI = () => {
    const randomUpper =
      uppercase[
        Math.floor(
          Math.random() *
            uppercase.length
        )
      ];

    const correct =
      randomUpper.toLowerCase();

    const allLower =
      "abcdefghijklmnopqrstuvwxyz".split("");

    const wrong = allLower
      .filter(
        (letter) =>
          letter !== correct
      )
      .sort(
        () =>
          0.5 -
          Math.random()
      )
      .slice(0, 3);

    const questionOptions = [
      ...wrong,
      correct,
    ].sort(
      () =>
        0.5 -
        Math.random()
    );

    return {
      question: randomUpper,
      options: questionOptions,
      answer: correct,
    };
  };

  // =====================================================
  // RESTORE / INITIALIZE
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🎮 Uppercase Lowercase saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.currentUpper &&
      Array.isArray(savedState.options)
    ) {
      console.log(
        "✅ Resuming Uppercase Lowercase"
      );

      setCurrentUpper(
        savedState.currentUpper
      );

      setOptions(
        savedState.options
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

      setGameOver(
        savedState.gameOver || false
      );

      setLocked(false);

      return;
    }

    console.log(
      "🆕 Starting new Uppercase Lowercase game"
    );

    const question =
      generateQuestionAI();

    setCurrentUpper(
      question.question
    );

    setOptions(
      question.options
    );

    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setGameOver(false);
    setLocked(false);

    save({
      currentUpper:
        question.question,
      options:
        question.options,
      score: 0,
      questionCount: 0,
      feedback: "",
      gameOver: false,
    });
  }, [
    progressLoading,
    GAME_ID,
  ]);

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleClick = (selected) => {
    if (
      locked ||
      gameOver ||
      questionCount >=
        TOTAL_QUESTIONS
    ) {
      return;
    }

    setLocked(true);

    const isCorrect =
      selected ===
      currentUpper.toLowerCase();

    const updatedScore =
      score +
      (isCorrect ? 1 : 0);

    const nextCount =
      questionCount + 1;

    const feedbackMessage =
      isCorrect
        ? "correct"
        : "wrong";

    setScore(updatedScore);

    setFeedback(
      feedbackMessage
    );

    setQuestionCount(
      nextCount
    );

    // ===================================================
    // FINAL QUESTION
    // ===================================================

    if (
      nextCount ===
      TOTAL_QUESTIONS
    ) {
      const percentage =
        (updatedScore /
          TOTAL_QUESTIONS) *
        100;

      setTimeout(
        async () => {
          // Save completed state
          await save({
            currentUpper,
            options,
            score: updatedScore,
            questionCount:
              nextCount,
            feedback:
              feedbackMessage,
            gameOver: true,
          });

          // Save individual game result
          await saveScoreToFirestore(
            updatedScore
          );

          // 🔥 Update global progress
          await finish(
            percentage,
            "Uppercase Lowercase"
          );

          setGameOver(true);
          setLocked(false);
        },
        800
      );

      return;
    }

    // ===================================================
    // NEXT QUESTION
    // ===================================================

    setTimeout(async () => {
      const question =
        generateQuestionAI();

      setCurrentUpper(
        question.question
      );

      setOptions(
        question.options
      );

      setFeedback("");

      setLocked(false);

      await save({
        currentUpper:
          question.question,
        options:
          question.options,
        score: updatedScore,
        questionCount:
          nextCount,
        feedback: "",
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
          console.log(
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
              "Uppercase-Lowercase",
          }
        );

        console.log(
          "✅ Uppercase Lowercase result saved"
        );
      } catch (error) {
        console.error(
          "❌ Error saving result:",
          error
        );
      }
    };

  // =====================================================
  // PERFORMANCE MESSAGE
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

      return "💡 Keep practicing!";
    };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = async () => {
    const question =
      generateQuestionAI();

    setCurrentUpper(
      question.question
    );

    setOptions(
      question.options
    );

    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setGameOver(false);
    setLocked(false);

    await save({
      currentUpper:
        question.question,
      options:
        question.options,
      score: 0,
      questionCount: 0,
      feedback: "",
      gameOver: false,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (progressLoading) {
    return (
      <div className="case-page">

        <div className="letter-navbar">
          <h2>
            🔤 AI Letter Matching Game
          </h2>
        </div>

        <div className="instruction">
          🌱 Loading your progress...
        </div>

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
      <div className="case-page">

        <div className="letter-navbar">
          <h2>
            🔤 AI Letter Matching Game
          </h2>
        </div>

        <div className="instruction">
          🏆 Round Completed!
        </div>

        <div className="big-letter">
          {percentage.toFixed(0)}%
        </div>

        <div className="ai-analysis">
          <p>
            Score: {score} /{" "}
            {TOTAL_QUESTIONS}
          </p>

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
    <div className="case-page">

      <div className="letter-navbar">
        <h2>
          🔤 AI Letter Matching Game
        </h2>
      </div>

      <div className="instruction">
        Question{" "}
        {questionCount + 1} of{" "}
        {TOTAL_QUESTIONS}
      </div>

      <div className="big-letter">
        {currentUpper}
      </div>

      <div className="options-grid">

        {options.map(
          (letter) => (
            <button
              key={letter}
              className="option-btn"
              onClick={() =>
                handleClick(letter)
              }
              disabled={locked}
            >
              {letter}
            </button>
          )
        )}

      </div>

      {feedback ===
        "correct" && (
        <div className="feedback good">
          🎉 Correct!
        </div>
      )}

      {feedback ===
        "wrong" && (
        <div className="feedback wrong">
          ❌ Try Again
        </div>
      )}

      <div className="ai-analysis">
        <p>
          Score: {score} /{" "}
          {questionCount}
        </p>

        <p>
          {getPerformanceMessage()}
        </p>
      </div>

    </div>
  );
}