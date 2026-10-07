// import { useState, useEffect } from "react";
// import "../styles/FindHidden.css";

// // Firebase
// import { db } from "../firebase";
// import {
//   doc,
//   collection,
//   addDoc,
//   Timestamp,
// } from "firebase/firestore";

// // Router
// import { useLocation } from "react-router-dom";

// // Game Progress
// import useGameProgress from "../hooks/useGameProgress";

// export default function FindHidden() {
//   const TOTAL_QUESTIONS = 5;

//   // =========================================================
//   // MODE FROM URL
//   // =========================================================

//   const location = useLocation();

//   const query = new URLSearchParams(location.search);

//   const mode = query.get("mode") || "letters";

//   // =========================================================
//   // UNIQUE GAME ID
//   // =========================================================

//   const GAME_ID = `find-hidden-${mode}`;

//   // =========================================================
//   // INITIAL STATE
//   // =========================================================

//   const INITIAL_STATE = {
//     target: "",
//     grid: [],
//     score: 0,
//     questionCount: 0,
//     message: "",
//     completed: false,
//   };

//   // =========================================================
//   // GAME PROGRESS
//   // =========================================================

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(GAME_ID, INITIAL_STATE);

//   // =========================================================
//   // GAME STATE
//   // =========================================================

//   const [target, setTarget] = useState("");
//   const [grid, setGrid] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [answering, setAnswering] = useState(false);

//   // =========================================================
//   // GENERATE QUESTION
//   // =========================================================

//   const generateQuestion = () => {
//     try {
//       setLoading(true);

//       const base =
//         mode === "numbers"
//           ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
//           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//       // Pick target
//       const randomTarget =
//         base[Math.floor(Math.random() * base.length)];

//       // Create grid
//       const newGrid = Array(9)
//         .fill(null)
//         .map(
//           () =>
//             base[
//               Math.floor(
//                 Math.random() * base.length
//               )
//             ]
//         );

//       // Put correct target somewhere in grid
//       const randomIndex = Math.floor(Math.random() * 9);

//       newGrid[randomIndex] = randomTarget;

//       setTarget(randomTarget);
//       setGrid(newGrid);
//     } catch (err) {
//       console.error(
//         "❌ Error generating question:",
//         err
//       );

//       const fallbackTarget =
//         mode === "numbers" ? "1" : "A";

//       const fallbackGrid =
//         mode === "numbers"
//           ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
//           : ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

//       setTarget(fallbackTarget);
//       setGrid(fallbackGrid);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // RESTORE SAVED GAME
//   // =========================================================

//   useEffect(() => {
//     if (progressLoading) return;

//     console.log(
//       "🎮 Find Hidden restore:",
//       savedState
//     );

//     if (
//       savedState &&
//       savedState.target &&
//       Array.isArray(savedState.grid) &&
//       savedState.grid.length === 9
//     ) {
//       console.log("✅ Resuming Find Hidden");

//       setTarget(savedState.target);
//       setGrid(savedState.grid);

//       setScore(savedState.score || 0);
//       setQuestionCount(
//         savedState.questionCount || 0
//       );
//       setMessage(savedState.message || "");

//       setLoading(false);
//     } else {
//       console.log(
//         "🆕 Starting new Find Hidden game"
//       );

//       setScore(0);
//       setQuestionCount(0);
//       setMessage("");

//       generateQuestion();
//     }
//   }, [progressLoading, GAME_ID]);

//   // =========================================================
//   // ACTIVITY LOGGER
//   // =========================================================

//   const logActivity = async (finalScore) => {
//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         console.warn(
//           "⚠️ No Firebase userId found"
//         );
//         return;
//       }

//       await addDoc(collection(db, "activity"), {
//         userId,
//         action: "play",
//         module:
//           mode === "numbers"
//             ? "math"
//             : "letters",
//         screen: `find-hidden-${mode}`,
//         score: finalScore,
//         timestamp: Timestamp.now(),
//       });

//       console.log("✅ Activity saved");
//     } catch (error) {
//       console.error(
//         "❌ Activity save error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // SAVE GAME RESULT
//   // =========================================================

//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userId =
//         localStorage.getItem("userId");

//       if (!userId) {
//         console.warn(
//           "⚠️ No Firebase userId found"
//         );
//         return;
//       }

//       const userRef = doc(
//         db,
//         "users",
//         userId
//       );

//       const gameResultsRef = collection(
//         userRef,
//         "game_results"
//       );

//       const accuracy =
//         (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: `FindHidden_${mode}`,
//       });

//       console.log(
//         "✅ Game result saved"
//       );
//     } catch (error) {
//       console.error(
//         "❌ Firestore error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // SAVE CURRENT GAME STATE
//   // =========================================================

//   const saveCurrentState = async ({
//     newScore = score,
//     newQuestionCount = questionCount,
//     newMessage = message,
//     newTarget = target,
//     newGrid = grid,
//   } = {}) => {
//     await save({
//       target: newTarget,
//       grid: newGrid,
//       score: newScore,
//       questionCount: newQuestionCount,
//       message: newMessage,
//       completed: false,
//     });
//   };

//   // =========================================================
//   // HANDLE CLICK
//   // =========================================================

//   const handleClick = (item) => {
//     if (answering) return;

//     if (questionCount >= TOTAL_QUESTIONS) {
//       return;
//     }

//     setAnswering(true);

//     const isCorrect = item === target;

//     const updatedScore = isCorrect
//       ? score + 1
//       : score;

//     const nextQuestionCount =
//       questionCount + 1;

//     const feedback = isCorrect
//       ? "✅ Correct!"
//       : "❌ Try again!";

//     setMessage(feedback);

//     // Save answer immediately
//     save({
//       target,
//       grid,
//       score: updatedScore,
//       questionCount: nextQuestionCount,
//       message: feedback,
//       completed: false,
//     });

//     setTimeout(async () => {
//       setMessage("");

//       // =====================================================
//       // FINAL QUESTION
//       // =====================================================

//       if (
//         nextQuestionCount ===
//         TOTAL_QUESTIONS
//       ) {
//         const finalPercentage =
//           (updatedScore / TOTAL_QUESTIONS) *
//           100;

//         console.log(
//           "🏁 Find Hidden completed:",
//           updatedScore,
//           finalPercentage
//         );

//         // Main progress system
//         await finish(
//           finalPercentage,
//           `Find Hidden (${mode})`
//         );

//         // Activity
//         await logActivity(
//           finalPercentage
//         );

//         // Detailed game result
//         await saveScoreToFirestore(
//           updatedScore
//         );

//         alert(
//           `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
//         );

//         // =====================================================
//         // START NEW ROUND
//         // =====================================================

//         const base =
//           mode === "numbers"
//             ? [
//                 "1",
//                 "2",
//                 "3",
//                 "4",
//                 "5",
//                 "6",
//                 "7",
//                 "8",
//                 "9",
//               ]
//             : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
//                 ""
//               );

//         const newTarget =
//           base[
//             Math.floor(
//               Math.random() * base.length
//             )
//           ];

//         const newGrid = Array(9)
//           .fill(null)
//           .map(
//             () =>
//               base[
//                 Math.floor(
//                   Math.random() * base.length
//                 )
//               ]
//           );

//         const randomIndex =
//           Math.floor(
//             Math.random() * 9
//           );

//         newGrid[randomIndex] =
//           newTarget;

//         setTarget(newTarget);
//         setGrid(newGrid);

//         setScore(0);
//         setQuestionCount(0);
//         setMessage("");
//         setAnswering(false);

//         await save({
//           target: newTarget,
//           grid: newGrid,
//           score: 0,
//           questionCount: 0,
//           message: "",
//           completed: false,
//         });

//         return;
//       }

//       // =====================================================
//       // NEXT QUESTION
//       // =====================================================

//       const base =
//         mode === "numbers"
//           ? [
//               "1",
//               "2",
//               "3",
//               "4",
//               "5",
//               "6",
//               "7",
//               "8",
//               "9",
//             ]
//           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
//               ""
//             );

//       const nextTarget =
//         base[
//           Math.floor(
//             Math.random() * base.length
//           )
//         ];

//       const nextGrid = Array(9)
//         .fill(null)
//         .map(
//           () =>
//             base[
//               Math.floor(
//                 Math.random() * base.length
//               )
//             ]
//         );

//       const randomIndex =
//         Math.floor(
//           Math.random() * 9
//         );

//       nextGrid[randomIndex] =
//         nextTarget;

//       setTarget(nextTarget);
//       setGrid(nextGrid);

//       setScore(updatedScore);
//       setQuestionCount(
//         nextQuestionCount
//       );
//       setMessage("");
//       setAnswering(false);

//       await save({
//         target: nextTarget,
//         grid: nextGrid,
//         score: updatedScore,
//         questionCount:
//           nextQuestionCount,
//         message: "",
//         completed: false,
//       });
//     }, 800);
//   };

//   // =========================================================
//   // PERFORMANCE
//   // =========================================================

//   const getPerformanceMessage = () => {
//     if (questionCount === 0) {
//       return "";
//     }

//     const accuracy =
//       (score / questionCount) * 100;

//     if (accuracy > 80) {
//       return "🌟 Excellent!";
//     }

//     if (accuracy > 50) {
//       return "👍 Good job!";
//     }

//     return "💡 Keep practicing!";
//   };

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (progressLoading) {
//     return (
//       <div className="blend-container loading-screen">
//         <div className="loading-card">
//           <div className="loading-icon">
//             🔎
//           </div>

//           <h2>Find Hidden</h2>

//           <p>
//             ⏳ Loading your progress...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="blend-container">

//       {/* ===================================================
//           NAVBAR
//       =================================================== */}

//       <header className="blend-navbar">
//         <div className="navbar-brand">
//           <span className="navbar-logo">
//             🌿
//           </span>

//           <div>
//             <span className="navbar-mini">
//               CURIOKIDS
//             </span>

//             <h1>
//               🔍 Find Hidden
//             </h1>
//           </div>
//         </div>

//         <div className="navbar-mode">
//           {mode === "numbers"
//             ? "🔢 Numbers"
//             : "🔤 Letters"}
//         </div>
//       </header>

//       <main className="blend-content">

//         {/* =================================================
//             STATUS
//         ================================================= */}

//         <section className="find-status-row">

//           <div className="find-status-card">
//             <span className="status-icon">
//               🔎
//             </span>

//             <div>
//               <span className="status-label">
//                 QUESTION
//               </span>

//               <strong>
//                 {Math.min(
//                   questionCount + 1,
//                   TOTAL_QUESTIONS
//                 )}
//               </strong>

//               <span className="status-total">
//                 /{TOTAL_QUESTIONS}
//               </span>
//             </div>
//           </div>

//           <div className="find-status-card">
//             <span className="status-icon">
//               ⭐
//             </span>

//             <div>
//               <span className="status-label">
//                 SCORE
//               </span>

//               <strong>
//                 {score}
//               </strong>

//               <span className="status-total">
//                 /{TOTAL_QUESTIONS}
//               </span>
//             </div>
//           </div>

//         </section>

//         {/* =================================================
//             PROGRESS
//         ================================================= */}

//         <section className="find-progress-card">

//           <div className="progress-heading">
//             <span>
//               Your adventure
//             </span>

//             <strong>
//               {Math.round(
//                 (questionCount /
//                   TOTAL_QUESTIONS) *
//                   100
//               )}
//               %
//             </strong>
//           </div>

//           <div className="progress-track">
//             <div
//               className="progress-fill"
//               style={{
//                 width: `${
//                   (questionCount /
//                     TOTAL_QUESTIONS) *
//                   100
//                 }%`,
//               }}
//             />
//           </div>

//         </section>

//         {/* =================================================
//             MAIN GAME
//         ================================================= */}

//         <section className="find-game-card">

//           <div className="game-card-inner">

//             <div className="find-badge">
//               👀 Look carefully!
//             </div>

//             <h2>
//               Find the hidden{" "}
//               {mode === "numbers"
//                 ? "number"
//                 : "letter"}
//               !
//             </h2>

//             <p className="find-description">
//               Look at the target and find
//               the matching item in the
//               grid.
//             </p>

//             {/* TARGET */}

//             <div className="target-card">

//               <span className="target-label">
//                 FIND
//               </span>

//               <div className="target-value">
//                 {target || "..."}
//               </div>

//             </div>

//             {/* GRID */}

//             {loading ? (
//               <div className="question-loading">

//                 <span>🔎</span>

//                 <p>
//                   Preparing your challenge...
//                 </p>

//               </div>
//             ) : (
//               <div className="hidden-grid">

//                 {grid.map(
//                   (item, i) => (
//                     <button
//                       key={i}
//                       className={`hidden-option ${
//                         answering
//                           ? "option-disabled"
//                           : ""
//                       }`}
//                       onClick={() =>
//                         handleClick(item)
//                       }
//                       disabled={answering}
//                     >
//                       {item}
//                     </button>
//                   )
//                 )}

//               </div>
//             )}

//             {/* FEEDBACK */}

//             {message && (
//               <div
//                 className={`find-feedback ${
//                   message.includes("Correct")
//                     ? "feedback-correct"
//                     : "feedback-wrong"
//                 }`}
//               >
//                 {message}
//               </div>
//             )}

//             {/* PERFORMANCE */}

//             <div className="ai-analysis">

//               <span className="analysis-icon">
//                 💡
//               </span>

//               <div>
//                 <span className="analysis-title">
//                   Detective progress
//                 </span>

//                 <p>
//                   {getPerformanceMessage() ||
//                     "Look carefully and find the hidden one!"}
//                 </p>
//               </div>

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             TIP
//         ================================================= */}

//         <section className="find-tip">

//           <span className="tip-icon">
//             🕵️
//           </span>

//           <div>
//             <strong>
//               Detective Tip
//             </strong>

//             <p>
//               Compare the target carefully
//               with every box. Take your time!
//             </p>
//           </div>

//         </section>

//       </main>

//       {/* ===================================================
//           DECORATIONS
//       =================================================== */}

//       <div className="forest-decoration decor-1">
//         🍃
//       </div>

//       <div className="forest-decoration decor-2">
//         🌿
//       </div>

//       <div className="forest-decoration decor-3">
//         🍄
//       </div>

//     </div>
//   );
// }



import { useState, useEffect } from "react";
import "../styles/FindHidden.css";

// Firebase
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// Router
import { useLocation } from "react-router-dom";

// Game Progress
import useGameProgress from "../hooks/useGameProgress";

export default function FindHidden() {
  const TOTAL_QUESTIONS = 5;

  // =========================================================
  // MODE
  // =========================================================

  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const mode = query.get("mode") || "letters";

  // =========================================================
  // GAME ID
  // =========================================================

  const GAME_ID = `find-hidden-${mode}`;

  // =========================================================
  // INITIAL STATE
  // =========================================================

  const INITIAL_STATE = {
    target: "",
    grid: [],
    score: 0,
    questionCount: 0,
    message: "",
    completed: false,
  };

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
  // STATE
  // =========================================================

  const [target, setTarget] = useState("");
  const [grid, setGrid] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] =
    useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] =
    useState(false);

  // =========================================================
  // GENERATE QUESTION
  // =========================================================

  const generateQuestion = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
            ]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
              ""
            );

      const randomTarget =
        base[
          Math.floor(
            Math.random() * base.length
          )
        ];

      const newGrid = Array(9)
        .fill(null)
        .map(
          () =>
            base[
              Math.floor(
                Math.random() *
                  base.length
              )
            ]
        );

      const randomIndex =
        Math.floor(Math.random() * 9);

      newGrid[randomIndex] =
        randomTarget;

      setTarget(randomTarget);
      setGrid(newGrid);
    } catch (err) {
      console.error(
        "❌ Error generating question:",
        err
      );

      const fallbackTarget =
        mode === "numbers"
          ? "1"
          : "A";

      const fallbackGrid =
        mode === "numbers"
          ? [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
            ]
          : [
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
            ];

      setTarget(fallbackTarget);
      setGrid(fallbackGrid);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESTORE SAVED GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🎮 Find Hidden restore:",
      savedState
    );

    if (
      savedState &&
      savedState.target &&
      Array.isArray(savedState.grid) &&
      savedState.grid.length === 9
    ) {
      setTarget(savedState.target);
      setGrid(savedState.grid);

      setScore(
        savedState.score || 0
      );

      setQuestionCount(
        savedState.questionCount || 0
      );

      setMessage(
        savedState.message || ""
      );

      setLoading(false);
    } else {
      setScore(0);
      setQuestionCount(0);
      setMessage("");

      generateQuestion();
    }
  }, [
    progressLoading,
    GAME_ID,
  ]);

  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem(
          "userId"
        );

      if (!userId) return;

      await addDoc(
        collection(
          db,
          "activity"
        ),
        {
          userId,

          action: "play",

          module:
            mode === "numbers"
              ? "math"
              : "letters",

          screen: `find-hidden-${mode}`,

          score: finalScore,

          timestamp:
            Timestamp.now(),
        }
      );

      console.log(
        "✅ Activity saved"
      );
    } catch (error) {
      console.error(
        "❌ Activity save error:",
        error
      );
    }
  };

  // =========================================================
  // SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) return;

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

            game: `FindHidden_${mode}`,
          }
        );

        console.log(
          "✅ Game result saved"
        );
      } catch (error) {
        console.error(
          "❌ Firestore error:",
          error
        );
      }
    };

  // =========================================================
  // SAVE CURRENT STATE
  // =========================================================

  const saveCurrentState =
    async ({
      newScore = score,
      newQuestionCount =
        questionCount,
      newMessage = message,
      newTarget = target,
      newGrid = grid,
    } = {}) => {
      await save({
        target: newTarget,
        grid: newGrid,
        score: newScore,
        questionCount:
          newQuestionCount,
        message: newMessage,
        completed: false,
      });
    };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = (item) => {
    if (answering) return;

    if (
      questionCount >=
      TOTAL_QUESTIONS
    ) {
      return;
    }

    setAnswering(true);

    const isCorrect =
      item === target;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const nextQuestionCount =
      questionCount + 1;

    const feedback =
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!";

    setMessage(feedback);

    save({
      target,
      grid,
      score: updatedScore,
      questionCount:
        nextQuestionCount,
      message: feedback,
      completed: false,
    });

    setTimeout(
      async () => {
        setMessage("");

        // ===================================================
        // FINAL QUESTION
        // ===================================================

        if (
          nextQuestionCount ===
          TOTAL_QUESTIONS
        ) {
          const finalPercentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏁 Find Hidden completed:",
            updatedScore,
            finalPercentage
          );

          await finish(
            finalPercentage,
            `Find Hidden (${mode})`
          );

          await logActivity(
            finalPercentage
          );

          await saveScoreToFirestore(
            updatedScore
          );

          alert(
            `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
          );

          // New round

          const base =
            mode === "numbers"
              ? [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                ]
              : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
                  ""
                );

          const newTarget =
            base[
              Math.floor(
                Math.random() *
                  base.length
              )
            ];

          const newGrid = Array(9)
            .fill(null)
            .map(
              () =>
                base[
                  Math.floor(
                    Math.random() *
                      base.length
                  )
                ]
            );

          const randomIndex =
            Math.floor(
              Math.random() * 9
            );

          newGrid[randomIndex] =
            newTarget;

          setTarget(newTarget);
          setGrid(newGrid);

          setScore(0);
          setQuestionCount(0);
          setMessage("");
          setAnswering(false);

          await save({
            target: newTarget,
            grid: newGrid,
            score: 0,
            questionCount: 0,
            message: "",
            completed: false,
          });

          return;
        }

        // ===================================================
        // NEXT QUESTION
        // ===================================================

        const base =
          mode === "numbers"
            ? [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ]
            : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
                ""
              );

        const nextTarget =
          base[
            Math.floor(
              Math.random() *
                base.length
            )
          ];

        const nextGrid = Array(9)
          .fill(null)
          .map(
            () =>
              base[
                Math.floor(
                  Math.random() *
                    base.length
                )
              ]
          );

        const randomIndex =
          Math.floor(
            Math.random() * 9
          );

        nextGrid[randomIndex] =
          nextTarget;

        setTarget(nextTarget);
        setGrid(nextGrid);

        setScore(updatedScore);

        setQuestionCount(
          nextQuestionCount
        );

        setMessage("");

        setAnswering(false);

        await save({
          target: nextTarget,
          grid: nextGrid,
          score: updatedScore,
          questionCount:
            nextQuestionCount,
          message: "",
          completed: false,
        });
      },
      800
    );
  };

  // =========================================================
  // PERFORMANCE
  // =========================================================

  const getPerformanceMessage =
    () => {
      if (questionCount === 0) {
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

  // =========================================================
  // LOADING
  // =========================================================

  if (progressLoading) {
    return (
      <div className="blend-container loading-screen">
        <div className="loading-card">
          <div className="loading-icon">
            🔍
          </div>

          <h2>
            Find Hidden
          </h2>

          <p>
            ⏳ Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="blend-container">

      {/* CENTERED GAME TITLE */}

      <header className="blend-navbar">

        <div className="navbar-icon">
          🔍
        </div>

        <div>
          <span className="navbar-mini">
            CURIOKIDS
          </span>

          <h1>
            Find Hidden
          </h1>

          <p>
            {mode === "numbers"
              ? "Find the hidden number"
              : "Find the hidden letter"}
          </p>
        </div>

      </header>

      {/* MAIN WOODEN BOARD */}

      <main className="blend-content">

        <section className="find-game-card">

          {/* INFO PILL */}

          <div className="game-info-pill">
            <strong>
              Score: {score}
            </strong>

            <span>
              |
            </span>

            <strong>
              Question:{" "}
              {Math.min(
                questionCount + 1,
                TOTAL_QUESTIONS
              )}
              /{TOTAL_QUESTIONS}
            </strong>
          </div>

          {/* GAME */}

          <div className="game-area">

            <div className="look-badge">
              👀 Look carefully!
            </div>

            <h2>
              Find the hidden{" "}
              {mode === "numbers"
                ? "number"
                : "letter"}
              !
            </h2>

            <p className="game-description">
              Find the matching{" "}
              {mode === "numbers"
                ? "number"
                : "letter"}{" "}
              in the cards below.
            </p>

            {/* TARGET */}

            <div className="target-card">

              <span className="target-label">
                FIND
              </span>

              <span className="target-value">
                {target || "..."}
              </span>

            </div>

            {/* ANSWERS */}

            {loading ? (
              <div className="question-loading">
                <span>🔍</span>

                <p>
                  Preparing...
                </p>
              </div>
            ) : (
              <div className="hidden-grid">

                {grid.map(
                  (item, index) => (
                    <button
                      key={index}
                      className="hidden-option"
                      onClick={() =>
                        handleClick(
                          item
                        )
                      }
                      disabled={
                        answering
                      }
                    >
                      {item}
                    </button>
                  )
                )}

              </div>
            )}

            {/* FEEDBACK */}

            {message && (
              <div
                className={`find-feedback ${
                  message.includes(
                    "Correct"
                  )
                    ? "feedback-correct"
                    : "feedback-wrong"
                }`}
              >
                {message}
              </div>
            )}

            {/* PROGRESS MESSAGE */}

            <div className="performance-message">

              <span>💡</span>

              <p>
                {getPerformanceMessage() ||
                  "Look carefully and choose the matching one!"}
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}