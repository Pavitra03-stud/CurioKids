// // import { useState, useEffect } from "react";
// // import "../styles/FindCorrectLetter.css";

// // // 🔥 Firebase
// // import { db } from "../firebase";
// // import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // export default function FindCorrectLetter() {
// //   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// //   const TOTAL_QUESTIONS = 5;

// //   // 🤖 States
// //   const [targetLetter, setTargetLetter] = useState("");
// //   const [options, setOptions] = useState([]);
// //   const [feedback, setFeedback] = useState("");

// //   const [score, setScore] = useState(0);
// //   const [questionCount, setQuestionCount] = useState(0);

// //   // 🤖 AI Question Generator (SAFE VERSION)
// //   const generateQuestionAI = () => {
// //     if (!letters || letters.length === 0) {
// //       return {
// //         question: "A",
// //         options: ["A", "B", "C", "D", "E", "F"],
// //       };
// //     }

// //     const correct =
// //       letters[Math.floor(Math.random() * letters.length)];

// //     const wrong = letters
// //       .filter((l) => l !== correct)
// //       .sort(() => 0.5 - Math.random())
// //       .slice(0, 5);

// //     const options = [...wrong, correct].sort(
// //       () => 0.5 - Math.random()
// //     );

// //     return {
// //       question: correct,
// //       options,
// //     };
// //   };

// //   const loadNewQuestion = () => {
// //     const q = generateQuestionAI();

// //     // ✅ SAFETY CHECK (fix empty UI bug)
// //     if (!q.question || !q.options || q.options.length === 0) {
// //       setTargetLetter("A");
// //       setOptions(["A", "B", "C", "D", "E", "F"]);
// //       return;
// //     }

// //     setTargetLetter(q.question);
// //     setOptions(q.options);
// //   };

// //   useEffect(() => {
// //     loadNewQuestion();
// //   }, []);

// //   // 📊 Save to Firestore
// //   const saveScoreToFirestore = async (finalScore) => {
// //     try {
// //       const userEmail = "demo_user"; // later replace with logged user

// //       const userRef = doc(db, "users", userEmail);
// //       const gameResultsRef = collection(userRef, "game_results");

// //       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

// //       await addDoc(gameResultsRef, {
// //         score: finalScore,
// //         totalQuestions: TOTAL_QUESTIONS,
// //         accuracy: accuracy.toFixed(2),
// //         createdAt: Timestamp.now(),
// //         game: "FindCorrectLetter",
// //       });

// //       console.log("✅ Saved result");
// //     } catch (error) {
// //       console.error("❌ Error:", error);
// //     }
// //   };

// //   // 🎯 Handle Answer
// //   const handleClick = (letter) => {
// //     if (questionCount >= TOTAL_QUESTIONS) return;

// //     const isCorrect = letter === targetLetter;

// //     if (isCorrect) {
// //       setScore((prev) => prev + 1);
// //       setFeedback("correct");
// //     } else {
// //       setFeedback("wrong");
// //     }

// //     setTimeout(async () => {
// //       setFeedback("");

// //       const nextCount = questionCount + 1;
// //       const finalScore = score + (isCorrect ? 1 : 0);

// //       setQuestionCount(nextCount);

// //       // 🎯 END OF ROUND
// //       if (nextCount === TOTAL_QUESTIONS) {
// //         await saveScoreToFirestore(finalScore);

// //         alert(
// //           `🎯 Round Completed!\nScore: ${finalScore}/${TOTAL_QUESTIONS}`
// //         );

// //         // 🔁 RESET
// //         setScore(0);
// //         setQuestionCount(0);
// //         loadNewQuestion();
// //       } else {
// //         loadNewQuestion();
// //       }
// //     }, 800);
// //   };

// //   // 📊 AI Analysis
// //   const getPerformanceMessage = () => {
// //     if (questionCount === 0) return "";

// //     const accuracy = (score / questionCount) * 100;

// //     if (accuracy > 80) return "🌟 Excellent!";
// //     if (accuracy > 50) return "👍 Good job!";
// //     return "💡 Keep practicing!";
// //   };

// //   return (
// //     <div className="find-page">
// //       <div className="letter-navbar">
// //         <h2>🔎 AI Find the Correct Letter</h2>
// //       </div>

// //       <div className="game-info">
// //         <span>
// //           Question: {questionCount + 1}/{TOTAL_QUESTIONS}
// //         </span>
// //         <span>Score: {score}</span>
// //       </div>

// //       <h2 className="target-text">
// //         Find: <span>{targetLetter || "..."}</span>
// //       </h2>

// //       <div className="letter-grid">
// //         {options.length > 0 ? (
// //           options.map((letter, index) => (
// //             <button
// //               key={index}
// //               className="grid-letter"
// //               onClick={() => handleClick(letter)}
// //             >
// //               {letter}
// //             </button>
// //           ))
// //         ) : (
// //           <p>Loading...</p>
// //         )}
// //       </div>

// //       {feedback === "correct" && (
// //         <div className="feedback good">🎉 Correct!</div>
// //       )}

// //       {feedback === "wrong" && (
// //         <div className="feedback wrong">❌ Try Again</div>
// //       )}

// //       {/* 📊 Analysis */}
// //       <div className="ai-analysis">
// //         <p>{getPerformanceMessage()}</p>
// //       </div>
// //     </div>
// //   );
// // }



// import { useState, useEffect } from "react";
// import "../styles/FindCorrectLetter.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function FindCorrectLetter() {
//   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//   const TOTAL_QUESTIONS = 5;

//   // 🤖 States
//   const [targetLetter, setTargetLetter] = useState("");
//   const [options, setOptions] = useState([]);
//   const [feedback, setFeedback] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   // 🤖 AI Question Generator (SAFE VERSION)
//   const generateQuestionAI = () => {
//     if (!letters || letters.length === 0) {
//       return {
//         question: "A",
//         options: ["A", "B", "C", "D", "E", "F"],
//       };
//     }

//     const correct =
//       letters[Math.floor(Math.random() * letters.length)];

//     const wrong = letters
//       .filter((l) => l !== correct)
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 5);

//     const options = [...wrong, correct].sort(
//       () => 0.5 - Math.random()
//     );

//     return {
//       question: correct,
//       options,
//     };
//   };

//   const loadNewQuestion = () => {
//     const q = generateQuestionAI();

//     // ✅ SAFETY CHECK (fix empty UI bug)
//     if (!q.question || !q.options || q.options.length === 0) {
//       setTargetLetter("A");
//       setOptions(["A", "B", "C", "D", "E", "F"]);
//       return;
//     }

//     setTargetLetter(q.question);
//     setOptions(q.options);
//   };

//   useEffect(() => {
//     loadNewQuestion();
//   }, []);

//   // 📊 Save to Firestore
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userEmail = "demo_user"; // later replace with logged user

//       const userRef = doc(db, "users", userEmail);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: "FindCorrectLetter",
//       });

//       console.log("✅ Saved result");
//     } catch (error) {
//       console.error("❌ Error:", error);
//     }
//   };

//   // 🎯 Handle Answer
//   const handleClick = (letter) => {
//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = letter === targetLetter;

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

//       // 🎯 END OF ROUND
//       if (nextCount === TOTAL_QUESTIONS) {
//         await saveScoreToFirestore(finalScore);

//         alert(
//           `🎯 Round Completed!\nScore: ${finalScore}/${TOTAL_QUESTIONS}`
//         );

//         // 🔁 RESET
//         setScore(0);
//         setQuestionCount(0);
//         loadNewQuestion();
//       } else {
//         loadNewQuestion();
//       }
//     }, 800);
//   };

//   // 📊 AI Analysis
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Keep practicing!";
//   };

//   return (
//     <div className="find-page">
//       <div className="letter-navbar">
//         <h2>🔎 AI Find the Correct Letter</h2>
//       </div>

//       <div className="game-info">
//         <span>
//           Question: {questionCount + 1}/{TOTAL_QUESTIONS}
//         </span>
//         <span>Score: {score}</span>
//       </div>

//       <h2 className="target-text">
//         Find: <span>{targetLetter || "..."}</span>
//       </h2>

//       <div className="letter-grid">
//         {options.length > 0 ? (
//           options.map((letter, index) => (
//             <button
//               key={index}
//               className="grid-letter"
//               onClick={() => handleClick(letter)}
//             >
//               {letter}
//             </button>
//           ))
//         ) : (
//           <p>Loading...</p>
//         )}
//       </div>

//       {feedback === "correct" && (
//         <div className="feedback good">🎉 Correct!</div>
//       )}

//       {feedback === "wrong" && (
//         <div className="feedback wrong">❌ Try Again</div>
//       )}

//       {/* 📊 Analysis */}
//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import "../styles/FindCorrectLetter.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// ✅ Game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "find-correct-letter";
const TOTAL_QUESTIONS = 5;

const LETTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const INITIAL_STATE = {
  targetLetter: "",
  options: [],
  feedback: "",
  score: 0,
  questionCount: 0,
  completed: false,
};

export default function FindCorrectLetter() {
  // =========================================================
  // GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );

  // =========================================================
  // STATES
  // =========================================================

  const [targetLetter, setTargetLetter] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [gameFinished, setGameFinished] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // =========================================================
  // QUESTION GENERATOR
  // =========================================================

  const generateQuestion = () => {
    if (
      !LETTERS ||
      LETTERS.length === 0
    ) {
      return {
        question: "A",
        options: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ],
      };
    }

    const correct =
      LETTERS[
        Math.floor(
          Math.random() *
            LETTERS.length
        )
      ];

    const wrong = LETTERS
      .filter(
        (letter) =>
          letter !== correct
      )
      .sort(
        () =>
          0.5 - Math.random()
      )
      .slice(0, 5);

    const generatedOptions = [
      ...wrong,
      correct,
    ].sort(
      () =>
        0.5 - Math.random()
    );

    return {
      question: correct,
      options: generatedOptions,
    };
  };

  // =========================================================
  // LOAD QUESTION
  // =========================================================

  const loadNewQuestion = async (
    shouldSave = false,
    currentScore = score,
    currentQuestionCount =
      questionCount
  ) => {
    const q = generateQuestion();

    if (
      !q.question ||
      !q.options ||
      q.options.length === 0
    ) {
      setTargetLetter("A");

      setOptions([
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ]);

      return {
        targetLetter: "A",
        options: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ],
      };
    }

    setTargetLetter(q.question);
    setOptions(q.options);

    if (shouldSave) {
      await save({
        targetLetter: q.question,
        options: q.options,
        feedback: "",
        score: currentScore,
        questionCount:
          currentQuestionCount,
        completed: false,
      });
    }

    return {
      targetLetter: q.question,
      options: q.options,
    };
  };

  // =========================================================
  // RESTORE PROGRESS
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Find Correct Letter saved state:",
      savedState
    );

    if (savedState) {
      setTargetLetter(
        savedState.targetLetter ?? ""
      );

      setOptions(
        savedState.options ?? []
      );

      setFeedback(
        savedState.feedback ?? ""
      );

      setScore(
        savedState.score ?? 0
      );

      setQuestionCount(
        savedState.questionCount ?? 0
      );

      setGameFinished(
        savedState.completed ?? false
      );

      // Safety: if no saved question,
      // generate one.
      if (
        !savedState.targetLetter ||
        !savedState.options?.length
      ) {
        loadNewQuestion();
      }
    } else {
      loadNewQuestion();
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

      const gameResultsRef =
        collection(
          db,
          "users",
          userId,
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
            "FindCorrectLetter",
        }
      );

      console.log(
        "✅ Find Correct Letter result saved"
      );
    } catch (error) {
      console.error(
        "❌ Error saving result:",
        error
      );
    }
  };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = async (
    letter
  ) => {
    if (processing) return;
    if (gameFinished) return;

    if (
      questionCount >=
      TOTAL_QUESTIONS
    ) {
      return;
    }

    setProcessing(true);

    const isCorrect =
      letter === targetLetter;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const newFeedback =
      isCorrect
        ? "correct"
        : "wrong";

    setFeedback(newFeedback);
    setScore(updatedScore);

    // -------------------------------------------------------
    // SAVE ANSWER
    // -------------------------------------------------------

    await save({
      targetLetter,
      options,
      feedback: newFeedback,
      score: updatedScore,
      questionCount,
      completed: false,
    });

    // -------------------------------------------------------
    // NEXT QUESTION
    // -------------------------------------------------------

    setTimeout(async () => {
      setFeedback("");

      const nextCount =
        questionCount + 1;

      setQuestionCount(nextCount);

      // =====================================================
      // FINAL QUESTION
      // =====================================================

      if (
        nextCount ===
        TOTAL_QUESTIONS
      ) {
        const finalPercentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏁 Find Correct Letter completed:",
          {
            score: updatedScore,
            total:
              TOTAL_QUESTIONS,
            percentage:
              finalPercentage,
          }
        );

        setGameFinished(true);

        // ⭐ Central stars/history
        await finish(
          finalPercentage,
          "Find Correct Letter"
        );

        // 💾 Detailed game result
        await saveScoreToFirestore(
          updatedScore
        );

        // Save completion state
        await save({
          targetLetter,
          options,
          feedback: "",
          score: updatedScore,
          questionCount:
            TOTAL_QUESTIONS,
          completed: true,
        });

        setProcessing(false);

        return;
      }

      // =====================================================
      // NEXT QUESTION
      // =====================================================

      const nextQuestion =
        generateQuestion();

      setTargetLetter(
        nextQuestion.question
      );

      setOptions(
        nextQuestion.options
      );

      await save({
        targetLetter:
          nextQuestion.question,
        options:
          nextQuestion.options,
        feedback: "",
        score: updatedScore,
        questionCount:
          nextCount,
        completed: false,
      });

      setProcessing(false);
    }, 800);
  };

  // =========================================================
  // PERFORMANCE
  // =========================================================

  const getPerformanceMessage =
    () => {
      if (questionCount === 0)
        return "";

      const accuracy =
        (score /
          questionCount) *
        100;

      if (accuracy > 80)
        return "🌟 Excellent!";

      if (accuracy > 50)
        return "👍 Good job!";

      return "💡 Keep practicing!";
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="find-page">

        <div className="letter-navbar">
          <h2>
            🔎 AI Find the Correct Letter
          </h2>
        </div>

        <div className="target-text">
          Restoring your progress...
        </div>

      </div>
    );
  }

  // =========================================================
  // COMPLETION SCREEN
  // =========================================================

  if (gameFinished) {
    const percentage =
      (score /
        TOTAL_QUESTIONS) *
      100;

    return (
      <div className="find-page">

        <div className="letter-navbar">
          <h2>
            🔎 AI Find the Correct Letter
          </h2>
        </div>

        <div className="target-text">

          <h2>
            🏆 Round Completed!
          </h2>

          <p>
            🎯 Score:{" "}
            {score}/
            {TOTAL_QUESTIONS}
          </p>

          <p>
            ⭐ Accuracy:{" "}
            {percentage.toFixed(0)}%
          </p>

          <button
            className="grid-letter"
            onClick={async () => {
              const firstQuestion =
                generateQuestion();

              setTargetLetter(
                firstQuestion.question
              );

              setOptions(
                firstQuestion.options
              );

              setFeedback("");
              setScore(0);
              setQuestionCount(0);
              setGameFinished(false);
              setProcessing(false);

              await save({
                targetLetter:
                  firstQuestion.question,
                options:
                  firstQuestion.options,
                feedback: "",
                score: 0,
                questionCount: 0,
                completed: false,
              });
            }}
          >
            🎮 Play Again
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="find-page">

      {/* Navbar */}

      <div className="letter-navbar">
        <h2>
          🔎 AI Find the Correct Letter
        </h2>
      </div>

      {/* Game Info */}

      <div className="game-info">

        <span>
          Question:{" "}
          {Math.min(
            questionCount + 1,
            TOTAL_QUESTIONS
          )}
          /
          {TOTAL_QUESTIONS}
        </span>

        <span>
          Score: {score}
        </span>

      </div>

      {/* Target */}

      <h2 className="target-text">
        Find:{" "}
        <span>
          {targetLetter || "..."}
        </span>
      </h2>

      {/* Options */}

      <div className="letter-grid">

        {options.length > 0 ? (
          options.map(
            (letter, index) => (
              <button
                key={index}
                className="grid-letter"
                onClick={() =>
                  handleClick(letter)
                }
                disabled={processing}
              >
                {letter}
              </button>
            )
          )
        ) : (
          <p>
            Loading...
          </p>
        )}

      </div>

      {/* Feedback */}

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

      {/* Analysis */}

      <div className="ai-analysis">
        <p>
          {getPerformanceMessage()}
        </p>
      </div>

    </div>
  );
}