// // import { useState, useEffect } from "react";
// // import "../styles/BlendSounds.css";

// // // 🔥 Firebase
// // import { db } from "../firebase";
// // import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // // 🔥 Router
// // import { useLocation } from "react-router-dom";

// // export default function LeftRightPractice() {

// //   const TOTAL_QUESTIONS = 5;

// //   // 🔥 MODE
// //   const location = useLocation();
// //   const query = new URLSearchParams(location.search);
// //   const mode = query.get("mode") || "letters";

// //   const [line, setLine] = useState([]);
// //   const [target, setTarget] = useState("");
// //   const [direction, setDirection] = useState("");
// //   const [answer, setAnswer] = useState("");

// //   const [score, setScore] = useState(0);
// //   const [questionCount, setQuestionCount] = useState(0);

// //   const [message, setMessage] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   // 🤖 AI GENERATION
// //   const generateQuestionAI = () => {
// //     try {
// //       setLoading(true);

// //       let base =
// //         mode === "numbers"
// //           ? ["1","2","3","4","5","6","7","8","9"]
// //           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// //       const startIndex = Math.floor(Math.random() * (base.length - 4));
// //       const slice = base.slice(startIndex, startIndex + 4);

// //       const targetIndex = Math.floor(Math.random() * 4);
// //       const chosenTarget = slice[targetIndex];

// //       let dir, correct;

// //       if (targetIndex === 0) {
// //         dir = "RIGHT";
// //         correct = slice[1];
// //       } else if (targetIndex === 3) {
// //         dir = "LEFT";
// //         correct = slice[2];
// //       } else {
// //         if (Math.random() > 0.5) {
// //           dir = "RIGHT";
// //           correct = slice[targetIndex + 1];
// //         } else {
// //           dir = "LEFT";
// //           correct = slice[targetIndex - 1];
// //         }
// //       }

// //       setLine(slice);
// //       setTarget(chosenTarget);
// //       setDirection(dir);
// //       setAnswer(correct);

// //     } catch (err) {
// //       console.error(err);

// //       // fallback
// //       setLine(["A","B","C","D"]);
// //       setTarget("B");
// //       setDirection("RIGHT");
// //       setAnswer("C");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     generateQuestionAI();
// //   }, [mode]);

// //   // ☁️ SAVE
// //   const saveScoreToFirestore = async (finalScore) => {
// //     try {
// //       const userEmail = "demo_user";

// //       const userRef = doc(db, "users", userEmail);
// //       const gameResultsRef = collection(userRef, "game_results");

// //       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

// //       await addDoc(gameResultsRef, {
// //         score: finalScore,
// //         totalQuestions: TOTAL_QUESTIONS,
// //         accuracy: accuracy.toFixed(2),
// //         createdAt: Timestamp.now(),
// //         game: `LeftRight_${mode}`
// //       });

// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   // 🎯 CLICK
// //   const handleClick = (item) => {

// //     if (questionCount >= TOTAL_QUESTIONS) return;

// //     const isCorrect = item === answer;
// //     const updatedScore = isCorrect ? score + 1 : score;

// //     setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

// //     setTimeout(async () => {

// //       setMessage("");

// //       const next = questionCount + 1;
// //       setQuestionCount(next);

// //       if (next === TOTAL_QUESTIONS) {

// //         await saveScoreToFirestore(updatedScore);

// //         alert(`🎯 Completed!\nScore: ${updatedScore}/5`);

// //         setScore(0);
// //         setQuestionCount(0);
// //         generateQuestionAI();

// //       } else {
// //         setScore(updatedScore);
// //         generateQuestionAI();
// //       }

// //     }, 800);
// //   };

// //   // 📊 ANALYSIS
// //   const getPerformanceMessage = () => {
// //     if (questionCount === 0) return "";

// //     const accuracy = (score / questionCount) * 100;

// //     if (accuracy > 80) return "🌟 Direction Master!";
// //     if (accuracy > 50) return "👍 Good job!";
// //     return "💡 Practice left/right!";
// //   };

// //   return (
// //     <div className="blend-container">

// //       <h2>👈👉 Left / Right Practice ({mode})</h2>

// //       <div className="game-info">
// //         Question {questionCount + 1}/5 | Score: {score}
// //       </div>

// //       <h3>
// //         Which is to the <b>{direction}</b> of <b>{target}</b>?
// //       </h3>

// //       {/* LINE */}
// //       <div className="sounds">
// //         {loading ? (
// //           <p>Loading...</p>
// //         ) : (
// //           line.map((item, i) => (
// //             <span key={i} className="sound-box">
// //               {item}
// //             </span>
// //           ))
// //         )}
// //       </div>

// //       {/* OPTIONS */}
// //       <div className="options">
// //         {loading ? (
// //           <p>Loading...</p>
// //         ) : (
// //           line.map((item, i) => (
// //             <button key={i} onClick={() => handleClick(item)}>
// //               {item}
// //             </button>
// //           ))
// //         )}
// //       </div>

// //       <p>{message}</p>

// //       <div className="ai-analysis">
// //         <p>{getPerformanceMessage()}</p>
// //       </div>

// //     </div>
// //   );
// // }




// // import { useMemo, useState } from "react";
// // import "../styles/LearningLetterBlast.css";

// // // 🔥 Firebase
// // import { db } from "../firebase";
// // import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // export default function LearningLetterBlast({ goBack }) {
// //   const questions = useMemo(
// //     () => [
// //       { image: "🍎", word: "Apple", correct: "A", options: ["A", "B", "C"] },
// //       { image: "🐶", word: "Dog", correct: "D", options: ["D", "B", "P"] },
// //       { image: "🐱", word: "Cat", correct: "C", options: ["C", "O", "G"] },
// //       { image: "🦁", word: "Lion", correct: "L", options: ["L", "I", "T"] },
// //       { image: "🥭", word: "Mango", correct: "M", options: ["M", "N", "W"] },
// //       { image: "🐘", word: "Elephant", correct: "E", options: ["E", "F", "L"] },
// //       { image: "🐟", word: "Fish", correct: "F", options: ["F", "P", "T"] },
// //       { image: "🍌", word: "Banana", correct: "B", options: ["B", "D", "R"] },
// //     ],
// //     []
// //   );

// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [selected, setSelected] = useState("");
// //   const [status, setStatus] = useState("");
// //   const [score, setScore] = useState(0);

// //   const currentQuestion = questions[currentIndex];
// //   const isLastQuestion = currentIndex === questions.length - 1;
// //   const gameFinished = currentIndex >= questions.length;

// //   // 🔥 SAVE RESULT
// //   const saveScoreToFirestore = async (finalScore) => {
// //     try {
// //       const userEmail = localStorage.getItem("loginEmail"); // ✅ REAL USER

// //       if (!userEmail) return;

// //       const userRef = doc(db, "users", userEmail);
// //       const gameResultsRef = collection(userRef, "game_results");

// //       const accuracy = (finalScore / questions.length) * 100;

// //       await addDoc(gameResultsRef, {
// //         score: finalScore,
// //         totalQuestions: questions.length,
// //         accuracy: accuracy.toFixed(2),
// //         createdAt: Timestamp.now(),
// //         game: "LearningLetterBlast",
// //       });

// //       console.log("✅ Saved to Firebase");
// //     } catch (error) {
// //       console.error("❌ Firestore error:", error);
// //     }
// //   };

// //   const handleOptionClick = (letter) => {
// //     if (status) return;

// //     setSelected(letter);

// //     if (letter === currentQuestion.correct) {
// //       setStatus("correct");
// //       setScore((prev) => prev + 1);
// //     } else {
// //       setStatus("wrong");
// //     }
// //   };

// //   const handleNext = async () => {
// //     if (isLastQuestion) {
// //       await saveScoreToFirestore(score); // 🔥 SAVE HERE
// //       setCurrentIndex(questions.length);
// //       return;
// //     }

// //     setCurrentIndex((prev) => prev + 1);
// //     setSelected("");
// //     setStatus("");
// //   };

// //   const handleRestart = () => {
// //     setCurrentIndex(0);
// //     setSelected("");
// //     setStatus("");
// //     setScore(0);
// //   };

// //   if (gameFinished) {
// //     return (
// //       <div className="learning-letter-blast-page">
// //         <header className="learning-letter-blast-topbar">
// //           <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
// //         </header>

// //         <div className="learning-letter-blast-decor decor-one"></div>
// //         <div className="learning-letter-blast-decor decor-two"></div>
// //         <div className="learning-letter-blast-decor decor-three"></div>

// //         <div className="blast-finish-card">
// //           <div className="finish-emoji">🏆</div>
// //           <h2>Great Job!</h2>
// //           <p>
// //             You got <span>{score}</span> out of <span>{questions.length}</span>
// //           </p>

// //           <div className="finish-buttons">
// //             <button className="primary-btn" onClick={handleRestart}>
// //               Play Again
// //             </button>
// //             <button className="secondary-btn" onClick={goBack}>
// //               Back
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="learning-letter-blast-page">
// //       <header className="learning-letter-blast-topbar">
// //         <button className="learning-letter-blast-back" onClick={goBack}>
// //           ←
// //         </button>
// //         <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
// //       </header>

// //       <div className="learning-letter-blast-decor decor-one"></div>
// //       <div className="learning-letter-blast-decor decor-two"></div>
// //       <div className="learning-letter-blast-decor decor-three"></div>

// //       <div className="learning-letter-blast-content">
// //         <div className="blast-top-info">
// //           <div className="blast-score">⭐ Score: {score}</div>
// //           <div className="blast-progress">
// //             {currentIndex + 1} / {questions.length}
// //           </div>
// //         </div>

// //         <div className="blast-card">
// //           <div className="blast-helper-animals">
// //             <span>🐻</span>
// //             <span>🦊</span>
// //             <span>🐼</span>
// //           </div>

// //           <div className="blast-image">{currentQuestion.image}</div>
// //           <div className="blast-word">{currentQuestion.word}</div>

// //           <p className="blast-question">Tap the first letter</p>

// //           <div className="blast-options">
// //             {currentQuestion.options.map((letter, index) => (
// //               <button
// //                 key={index}
// //                 className={`blast-option
// //                   ${selected === letter ? "selected" : ""}
// //                   ${
// //                     status === "correct" && letter === currentQuestion.correct
// //                       ? "correct"
// //                       : ""
// //                   }
// //                   ${
// //                     status === "wrong" && selected === letter
// //                       ? "wrong"
// //                       : ""
// //                   }
// //                 `}
// //                 onClick={() => handleOptionClick(letter)}
// //               >
// //                 {letter}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="blast-feedback-area">
// //             {!status && (
// //               <p className="blast-hint">
// //                 Look at the picture and choose carefully 👀
// //               </p>
// //             )}

// //             {status === "correct" && (
// //               <p className="blast-feedback correct-text">
// //                 ✅ Super! {currentQuestion.correct} for {currentQuestion.word}
// //               </p>
// //             )}

// //             {status === "wrong" && (
// //               <p className="blast-feedback wrong-text">
// //                 ❌ Try again next time! Correct answer is {currentQuestion.correct}
// //               </p>
// //             )}
// //           </div>

// //           {status && (
// //             <button className="next-btn" onClick={handleNext}>
// //               {isLastQuestion ? "See Result" : "Next"}
// //             </button>
// //           )}
// //         </div>

// //         <div className="blast-bottom-animals">
// //           <span>🦁</span>
// //           <span>🐯</span>
// //           <span>🐵</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useMemo, useState } from "react";
// import "../styles/LearningLetterBlast.css";
// import useGameProgress from "../hooks/useGameProgress";

// const GAME_ID = "learning-letter-blast";

// export default function LearningLetterBlast() {
//   const questions = useMemo(
//     () => [
//       {
//         image: "🍎",
//         word: "Apple",
//         correct: "A",
//         options: ["A", "B", "C"],
//       },
//       {
//         image: "🐶",
//         word: "Dog",
//         correct: "D",
//         options: ["D", "B", "P"],
//       },
//       {
//         image: "🐱",
//         word: "Cat",
//         correct: "C",
//         options: ["C", "O", "G"],
//       },
//       {
//         image: "🦁",
//         word: "Lion",
//         correct: "L",
//         options: ["L", "I", "T"],
//       },
//       {
//         image: "🥭",
//         word: "Mango",
//         correct: "M",
//         options: ["M", "N", "W"],
//       },
//       {
//         image: "🐘",
//         word: "Elephant",
//         correct: "E",
//         options: ["E", "F", "L"],
//       },
//       {
//         image: "🐟",
//         word: "Fish",
//         correct: "F",
//         options: ["F", "P", "T"],
//       },
//       {
//         image: "🍌",
//         word: "Banana",
//         correct: "B",
//         options: ["B", "D", "R"],
//       },
//     ],
//     []
//   );

//   const INITIAL_STATE = {
//     currentIndex: 0,
//     selected: "",
//     status: "",
//     score: 0,
//     completed: false,
//   };

//   // =========================================================
//   // FIREBASE GAME PROGRESS
//   // =========================================================

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(
//     GAME_ID,
//     INITIAL_STATE
//   );

//   // =========================================================
//   // STATES
//   // =========================================================

//   const [currentIndex, setCurrentIndex] =
//     useState(0);

//   const [selected, setSelected] =
//     useState("");

//   const [status, setStatus] =
//     useState("");

//   const [score, setScore] =
//     useState(0);

//   const [gameFinished, setGameFinished] =
//     useState(false);

//   const [restored, setRestored] =
//     useState(false);

//   // =========================================================
//   // CURRENT QUESTION
//   // =========================================================

//   const currentQuestion =
//     questions[currentIndex];

//   const isLastQuestion =
//     currentIndex ===
//     questions.length - 1;

//   // =========================================================
//   // RESTORE SAVED PROGRESS
//   // =========================================================

//   useEffect(() => {
//     if (progressLoading) return;
//     if (restored) return;

//     console.log(
//       "🔥 Learning Letter Blast saved state:",
//       savedState
//     );

//     if (savedState) {
//       setCurrentIndex(
//         savedState.currentIndex ?? 0
//       );

//       setSelected(
//         savedState.selected ?? ""
//       );

//       setStatus(
//         savedState.status ?? ""
//       );

//       setScore(
//         savedState.score ?? 0
//       );

//       setGameFinished(
//         savedState.completed ?? false
//       );
//     }

//     setRestored(true);
//   }, [
//     progressLoading,
//     savedState,
//     restored,
//   ]);

//   // =========================================================
//   // ANSWER
//   // =========================================================

//   const handleOptionClick = async (
//     letter
//   ) => {
//     if (status) return;
//     if (gameFinished) return;

//     const isCorrect =
//       letter ===
//       currentQuestion.correct;

//     const newStatus =
//       isCorrect
//         ? "correct"
//         : "wrong";

//     const updatedScore =
//       isCorrect
//         ? score + 1
//         : score;

//     setSelected(letter);
//     setStatus(newStatus);
//     setScore(updatedScore);

//     await save({
//       currentIndex,
//       selected: letter,
//       status: newStatus,
//       score: updatedScore,
//       completed: false,
//     });
//   };

//   // =========================================================
//   // NEXT QUESTION
//   // =========================================================

//   const handleNext = async () => {
//     if (!status) return;

//     // =======================================================
//     // LAST QUESTION
//     // =======================================================

//     if (isLastQuestion) {
//       const finalPercentage =
//         (score /
//           questions.length) *
//         100;

//       console.log(
//         "🏁 Learning Letter Blast completed:",
//         {
//           score,
//           total: questions.length,
//           percentage: finalPercentage,
//         }
//       );

//       setGameFinished(true);

//       // ⭐ Add stars + history
//       await finish(
//         finalPercentage,
//         "Learning Letter Blast"
//       );

//       // Save completed state
//       await save({
//         currentIndex,
//         selected,
//         status,
//         score,
//         completed: true,
//       });

//       return;
//     }

//     // =======================================================
//     // NEXT QUESTION
//     // =======================================================

//     const nextIndex =
//       currentIndex + 1;

//     setCurrentIndex(nextIndex);
//     setSelected("");
//     setStatus("");

//     await save({
//       currentIndex: nextIndex,
//       selected: "",
//       status: "",
//       score,
//       completed: false,
//     });
//   };

//   // =========================================================
//   // RESTART
//   // =========================================================

//   const handleRestart = async () => {
//     setCurrentIndex(0);
//     setSelected("");
//     setStatus("");
//     setScore(0);
//     setGameFinished(false);

//     await save({
//       currentIndex: 0,
//       selected: "",
//       status: "",
//       score: 0,
//       completed: false,
//     });
//   };

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (
//     progressLoading ||
//     !restored
//   ) {
//     return (
//       <div className="learning-letter-blast-page">

//         <header className="learning-letter-blast-topbar">
//           <h1 className="learning-letter-blast-title">
//             💥 Letter Blast
//           </h1>
//         </header>

//         <div className="learning-letter-blast-content">
//           <div className="blast-card">
//             <h2>
//               Restoring your progress...
//             </h2>
//           </div>
//         </div>

//       </div>
//     );
//   }

//   // =========================================================
//   // FINISHED
//   // =========================================================

//   if (gameFinished) {
//     return (
//       <div className="learning-letter-blast-page">

//         <header className="learning-letter-blast-topbar">
//           <h1 className="learning-letter-blast-title">
//             💥 Letter Blast
//           </h1>
//         </header>

//         <div className="learning-letter-blast-decor decor-one"></div>
//         <div className="learning-letter-blast-decor decor-two"></div>
//         <div className="learning-letter-blast-decor decor-three"></div>

//         <div className="blast-finish-card">

//           <div className="finish-emoji">
//             🏆
//           </div>

//           <h2>
//             Great Job!
//           </h2>

//           <p>
//             You got{" "}
//             <span>{score}</span>{" "}
//             out of{" "}
//             <span>
//               {questions.length}
//             </span>
//           </p>

//           <div className="finish-buttons">

//             <button
//               className="primary-btn"
//               onClick={handleRestart}
//             >
//               Play Again
//             </button>

//           </div>

//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // MAIN GAME
//   // =========================================================

//   return (
//     <div className="learning-letter-blast-page">

//       <header className="learning-letter-blast-topbar">

//         <h1 className="learning-letter-blast-title">
//           💥 Letter Blast
//         </h1>

//       </header>

//       <div className="learning-letter-blast-decor decor-one"></div>
//       <div className="learning-letter-blast-decor decor-two"></div>
//       <div className="learning-letter-blast-decor decor-three"></div>

//       <div className="learning-letter-blast-content">

//         {/* Score */}
//         <div className="blast-top-info">

//           <div className="blast-score">
//             ⭐ Score: {score}
//           </div>

//           <div className="blast-progress">
//             {currentIndex + 1} /{" "}
//             {questions.length}
//           </div>

//         </div>

//         {/* Question */}
//         <div className="blast-card">

//           <div className="blast-helper-animals">
//             <span>🐻</span>
//             <span>🦊</span>
//             <span>🐼</span>
//           </div>

//           <div className="blast-image">
//             {currentQuestion.image}
//           </div>

//           <div className="blast-word">
//             {currentQuestion.word}
//           </div>

//           <p className="blast-question">
//             Tap the first letter
//           </p>

//           {/* Options */}
//           <div className="blast-options">

//             {currentQuestion.options.map(
//               (letter, index) => (
//                 <button
//                   key={index}
//                   className={`blast-option
//                     ${
//                       selected === letter
//                         ? "selected"
//                         : ""
//                     }
//                     ${
//                       status === "correct" &&
//                       letter ===
//                         currentQuestion.correct
//                         ? "correct"
//                         : ""
//                     }
//                     ${
//                       status === "wrong" &&
//                       selected === letter
//                         ? "wrong"
//                         : ""
//                     }
//                   `}
//                   onClick={() =>
//                     handleOptionClick(
//                       letter
//                     )
//                   }
//                   disabled={Boolean(status)}
//                 >
//                   {letter}
//                 </button>
//               )
//             )}

//           </div>

//           {/* Feedback */}
//           <div className="blast-feedback-area">

//             {!status && (
//               <p className="blast-hint">
//                 Look at the picture and
//                 choose carefully 👀
//               </p>
//             )}

//             {status === "correct" && (
//               <p className="blast-feedback correct-text">
//                 ✅ Super!{" "}
//                 {currentQuestion.correct}{" "}
//                 for{" "}
//                 {currentQuestion.word}
//               </p>
//             )}

//             {status === "wrong" && (
//               <p className="blast-feedback wrong-text">
//                 ❌ Try again next time!
//                 Correct answer is{" "}
//                 {currentQuestion.correct}
//               </p>
//             )}

//           </div>

//           {/* Next */}
//           {status && (
//             <button
//               className="next-btn"
//               onClick={handleNext}
//             >
//               {isLastQuestion
//                 ? "See Result"
//                 : "Next"}
//             </button>
//           )}

//         </div>

//         {/* Bottom animals */}
//         <div className="blast-bottom-animals">
//           <span>🦁</span>
//           <span>🐯</span>
//           <span>🐵</span>
//         </div>

//       </div>
//     </div>
//   );
// }






import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useGameProgress from "../hooks/useGameProgress";
import "../styles/LeftRightPractice.css";

const TOTAL_QUESTIONS = 5;

export default function LeftRightPractice() {
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const GAME_ID =
    mode === "numbers"
      ? "left-right-numbers"
      : "left-right-letters";

  // =========================================================
  // QUESTION DATA
  // =========================================================

  const questions = useMemo(() => {
    if (mode === "numbers") {
      return [
        {
          items: ["2", "5", "8", "3"],
          target: "5",
          direction: "RIGHT",
          answer: "8",
        },
        {
          items: ["7", "4", "9", "2"],
          target: "9",
          direction: "LEFT",
          answer: "4",
        },
        {
          items: ["3", "6", "1", "8"],
          target: "3",
          direction: "RIGHT",
          answer: "6",
        },
        {
          items: ["5", "2", "7", "4"],
          target: "7",
          direction: "LEFT",
          answer: "2",
        },
        {
          items: ["9", "1", "6", "3"],
          target: "1",
          direction: "RIGHT",
          answer: "6",
        },
      ];
    }

    // =======================================================
    // LETTER MODE
    // =======================================================

    return [
      {
        items: ["A", "B", "C", "D"],
        target: "B",
        direction: "RIGHT",
        answer: "C",
      },
      {
        items: ["E", "F", "G", "H"],
        target: "G",
        direction: "LEFT",
        answer: "F",
      },
      {
        items: ["J", "K", "L", "M"],
        target: "J",
        direction: "RIGHT",
        answer: "K",
      },
      {
        items: ["P", "Q", "R", "S"],
        target: "R",
        direction: "LEFT",
        answer: "Q",
      },
      {
        items: ["W", "X", "Y", "Z"],
        target: "X",
        direction: "RIGHT",
        answer: "Y",
      },
    ];
  }, [mode]);

  // =========================================================
  // INITIAL STATE
  // =========================================================

  const INITIAL_STATE = {
    questionIndex: 0,
    score: 0,
    completed: false,
  };

  // =========================================================
  // FIREBASE PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  // =========================================================
  // LOCAL STATE
  // =========================================================

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [restored, setRestored] = useState(false);

  const currentQuestion = questions[questionIndex];

  // =========================================================
  // RESTORE SAVED PROGRESS
  // =========================================================

  useEffect(() => {
    if (progressLoading || restored) return;

    if (savedState && Object.keys(savedState).length > 0) {
      setQuestionIndex(savedState.questionIndex ?? 0);
      setScore(savedState.score ?? 0);
      setCompleted(savedState.completed ?? false);
    }

    setRestored(true);
  }, [progressLoading, savedState, restored]);

  // =========================================================
  // ANSWER
  // =========================================================

  const handleAnswer = async (value) => {
    if (selected || completed) return;

    const isCorrect = value === currentQuestion.answer;

    const newScore = isCorrect ? score + 1 : score;

    setSelected(value);
    setScore(newScore);

    if (isCorrect) {
      setMessage("🎉 Correct! Great job!");
    } else {
      setMessage(
        `💡 Good try! Look ${currentQuestion.direction.toLowerCase()} of ${currentQuestion.target}.`
      );
    }

    // Save current question progress
    await save({
      questionIndex,
      score: newScore,
      completed: false,
    });

    setTimeout(async () => {
      const isLastQuestion =
        questionIndex === questions.length - 1;

      // =====================================================
      // GAME COMPLETE
      // =====================================================

      if (isLastQuestion) {
        const percentage =
          (newScore / questions.length) * 100;

        setCompleted(true);

        await finish(
          percentage,
          mode === "numbers"
            ? "Left Right Numbers"
            : "Left Right Letters"
        );

        return;
      }

      // =====================================================
      // NEXT QUESTION
      // =====================================================

      const nextIndex = questionIndex + 1;

      setQuestionIndex(nextIndex);
      setSelected("");
      setMessage("");

      await save({
        questionIndex: nextIndex,
        score: newScore,
        completed: false,
      });
    }, 900);
  };

  // =========================================================
  // RESTART
  // =========================================================

  const handleRestart = async () => {
    setQuestionIndex(0);
    setScore(0);
    setSelected("");
    setMessage("");
    setCompleted(false);

    await save({
      questionIndex: 0,
      score: 0,
      completed: false,
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (progressLoading || !restored) {
    return (
      <div className="lr-page">
        <div className="lr-loading-card">
          <div className="lr-loading-icon">🧭</div>

          <h2>Getting your adventure ready...</h2>

          <p>Loading your saved progress ✨</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // COMPLETED
  // =========================================================

  if (completed) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="lr-page">
        <div className="lr-finish-card">

          <div className="lr-finish-emoji">
            {percentage >= 80 ? "🏆" : "🌟"}
          </div>

          <h1>Direction Master!</h1>

          <p>
            You finished the{" "}
            {mode === "numbers"
              ? "Number"
              : "Letter"}{" "}
            adventure!
          </p>

          <div className="lr-result">

            <div className="lr-result-box">
              <strong>
                {score}/{questions.length}
              </strong>
              <span>Score</span>
            </div>

            <div className="lr-result-box">
              <strong>{percentage}%</strong>
              <span>Accuracy</span>
            </div>

          </div>

          <div className="lr-stars">
            {percentage >= 90
              ? "⭐⭐⭐"
              : percentage >= 70
                ? "⭐⭐"
                : "⭐"}
          </div>

          <button
            className="lr-play-again"
            onClick={handleRestart}
          >
            🔄 Play Again
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="lr-page">

      {/* Decorative elements */}
      <div className="lr-decoration lr-one">✨</div>
      <div className="lr-decoration lr-two">🌿</div>
      <div className="lr-decoration lr-three">⭐</div>

      <main className="lr-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="lr-header">

          <div className="lr-header-icon">
            {mode === "numbers" ? "🔢" : "🔤"}
          </div>

          <div>
            <h1>
              {mode === "numbers"
                ? "Number Directions"
                : "Letter Directions"}
            </h1>

            <p>
              Learn what comes before and after!
            </p>
          </div>

        </header>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="lr-stats">

          <div className="lr-stat-card">

            <div className="lr-stat-icon">
              🧩
            </div>

            <div>
              <small>QUESTION</small>

              <strong>
                {questionIndex + 1}
                <span> / {TOTAL_QUESTIONS}</span>
              </strong>
            </div>

          </div>

          <div className="lr-stat-card">

            <div className="lr-stat-icon">
              ⭐
            </div>

            <div>
              <small>SCORE</small>

              <strong>{score}</strong>
            </div>

          </div>

        </section>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <section className="lr-progress-card">

          <div className="lr-progress-top">
            <span>Your adventure</span>

            <strong>
              {Math.round(
                (questionIndex / TOTAL_QUESTIONS) * 100
              )}
              %
            </strong>
          </div>

          <div className="lr-progress-track">

            <div
              className="lr-progress-fill"
              style={{
                width: `${
                  (questionIndex / TOTAL_QUESTIONS) *
                  100
                }%`,
              }}
            />

          </div>

        </section>

        {/* =================================================
            QUESTION
        ================================================= */}

        <section className="lr-game-card">

          <div className="lr-badge">
            👀 Look carefully!
          </div>

          <h2>
            Which is to the{" "}
            <span>{currentQuestion.direction}</span>{" "}
            of{" "}
            <span className="lr-target">
              {currentQuestion.target}
            </span>
            ?
          </h2>

          <p className="lr-helper">
            Tap the correct item in the line below.
          </p>

          {/* =================================================
              LINE
          ================================================= */}

          <div className="lr-line">

            {currentQuestion.items.map(
              (item, index) => {

                const isTarget =
                  item === currentQuestion.target;

                const isSelected =
                  selected === item;

                const isCorrect =
                  isSelected &&
                  item === currentQuestion.answer;

                const isWrong =
                  isSelected &&
                  item !== currentQuestion.answer;

                return (
                  <div
                    key={`${item}-${index}`}
                    className="lr-item-wrapper"
                  >

                    <button
                      className={`
                        lr-item
                        ${isTarget ? "lr-target-item" : ""}
                        ${isCorrect ? "lr-correct" : ""}
                        ${isWrong ? "lr-wrong" : ""}
                      `}
                      onClick={() =>
                        handleAnswer(item)
                      }
                      disabled={
                        Boolean(selected) ||
                        isTarget
                      }
                    >
                      {item}
                    </button>

                    {isTarget && (
                      <span className="lr-target-label">
                        TARGET
                      </span>
                    )}

                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              DIRECTION INDICATOR
          ================================================= */}

          <div className="lr-direction">

            <div className="lr-arrow left">
              ←
            </div>

            <span>
              {currentQuestion.direction === "LEFT"
                ? "Look to the left"
                : "Look to the right"}
            </span>

            <div className="lr-arrow right">
              →
            </div>

          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          <div className="lr-message">

            {!message && (
              <p>
                💡 Find the item that is{" "}
                <strong>
                  {currentQuestion.direction.toLowerCase()}
                </strong>{" "}
                of{" "}
                <strong>
                  {currentQuestion.target}
                </strong>
                .
              </p>
            )}

            {message && (
              <p
                className={
                  message.includes("Correct")
                    ? "lr-success"
                    : "lr-hint"
                }
              >
                {message}
              </p>
            )}

          </div>

        </section>

        {/* =================================================
            TIP
        ================================================= */}

        <section className="lr-tip">

          <div className="lr-tip-icon">
            💡
          </div>

          <div>
            <strong>Direction tip</strong>

            <p>
              Start from the target and move one step{" "}
              {currentQuestion.direction.toLowerCase()}.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}