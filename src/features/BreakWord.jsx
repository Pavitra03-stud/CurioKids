// import { useState, useEffect } from "react";

// import "../styles/BreakWord.css";

// import { db } from "../firebase";

// import {
//   doc,
//   collection,
//   addDoc,
//   Timestamp,
// } from "firebase/firestore";

// import useGameProgress from "../hooks/useGameProgress";

// export default function BreakWord() {
//   const TOTAL_QUESTIONS = 5;
//   const GAME_ID = "break-word";

//   // =========================================================
//   // FIREBASE GAME PROGRESS
//   // =========================================================

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(GAME_ID);

//   // =========================================================
//   // GAME STATE
//   // =========================================================

//   const [word, setWord] = useState("");
//   const [options, setOptions] = useState([]);
//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [gameReady, setGameReady] = useState(false);

//   // =========================================================
//   // 🤖 GENERATE QUESTION
//   // =========================================================

//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/generate-break-word`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();

//       console.log("🤖 Break Word AI:", data);

//       if (
//         !data.word ||
//         !data.options ||
//         !data.answer
//       ) {
//         throw new Error("Invalid data");
//       }

//       setWord(data.word);
//       setOptions(data.options);
//       setCorrectAnswer(data.answer);

//       setLoading(false);

//       return data;
//     } catch (err) {
//       console.error(
//         "❌ Break Word error:",
//         err
//       );

//       const fallback = {
//         word: "CAT",
//         options: [
//           "c - a - t",
//           "ca - t",
//           "c - at",
//           "cat",
//         ],
//         answer: "c - a - t",
//       };

//       setWord(fallback.word);
//       setOptions(fallback.options);
//       setCorrectAnswer(fallback.answer);

//       setLoading(false);

//       return fallback;
//     }
//   };

//   // =========================================================
//   // 🔄 LOAD / RESUME
//   // =========================================================

//   useEffect(() => {
//     if (progressLoading) {
//       console.log(
//         "⏳ Waiting for Break Word Firebase progress..."
//       );

//       return;
//     }

//     const loadGame = async () => {
//       console.log(
//         "🎮 Break Word saved state:",
//         savedState
//       );

//       // =====================================================
//       // RESUME EXISTING GAME
//       // =====================================================

//       if (
//         savedState &&
//         savedState.word &&
//         Array.isArray(savedState.options) &&
//         savedState.options.length > 0 &&
//         savedState.correctAnswer
//       ) {
//         console.log(
//           "🔄 RESUMING BREAK WORD:",
//           savedState
//         );

//         setWord(savedState.word);

//         setOptions(savedState.options);

//         setCorrectAnswer(
//           savedState.correctAnswer
//         );

//         setQuestionCount(
//           Number(savedState.question) || 0
//         );

//         setScore(
//           Number(savedState.score) || 0
//         );

//         setLoading(false);
//         setGameReady(true);

//         return;
//       }

//       // =====================================================
//       // NEW GAME
//       // =====================================================

//       console.log(
//         "🆕 Starting new Break Word game"
//       );

//       const data =
//         await generateQuestionAI();

//       await save({
//         question: 0,
//         score: 0,
//         word: data.word,
//         options: data.options,
//         correctAnswer: data.answer,
//       });

//       setQuestionCount(0);
//       setScore(0);
//       setGameReady(true);
//     };

//     loadGame();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [progressLoading]);

//   // =========================================================
//   // 📊 ACTIVITY
//   // =========================================================

//   const logActivity = async (finalScore) => {
//     const userId =
//       localStorage.getItem("userId");

//     if (!userId) return;

//     try {
//       await addDoc(
//         collection(db, "activity"),
//         {
//           userId,
//           action: "play",
//           module: "phonics",
//           screen: "break-word",
//           score: finalScore,
//           timestamp: new Date(),
//         }
//       );

//       console.log(
//         "📊 Break Word activity saved"
//       );
//     } catch (error) {
//       console.error(
//         "❌ Activity error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // ☁️ FINAL RESULT
//   // =========================================================

//   const saveScoreToFirestore = async (
//     finalScore
//   ) => {
//     try {
//       const userId =
//         localStorage.getItem("userId");

//       if (!userId) return;

//       const userRef = doc(
//         db,
//         "users",
//         userId
//       );

//       const gameResultsRef =
//         collection(
//           userRef,
//           "game_results"
//         );

//       const accuracy =
//         (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: "BreakWord_AI",
//       });

//       console.log(
//         "☁️ Break Word result saved"
//       );
//     } catch (error) {
//       console.error(
//         "❌ Result save error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // 🎯 ANSWER
//   // =========================================================

//   const handleClick = (option) => {
//     if (loading) return;
//     if (message) return;
//     if (!gameReady) return;

//     const isCorrect =
//       option === correctAnswer;

//     const updatedScore = isCorrect
//       ? score + 1
//       : score;

//     if (isCorrect) {
//       setScore(updatedScore);
//       setMessage("correct");
//     } else {
//       setMessage("wrong");
//     }

//     setTimeout(async () => {
//       setMessage("");

//       const nextCount =
//         questionCount + 1;

//       // =====================================================
//       // 🏆 COMPLETE ROUND
//       // =====================================================

//       if (nextCount === TOTAL_QUESTIONS) {
//         const finalPercentage =
//           (updatedScore / TOTAL_QUESTIONS) *
//           100;

//         console.log(
//           "🏆 Break Word completed:",
//           updatedScore,
//           "/",
//           TOTAL_QUESTIONS
//         );

//         await finish(
//           finalPercentage,
//           "Break Word"
//         );

//         await logActivity(
//           finalPercentage
//         );

//         await saveScoreToFirestore(
//           updatedScore
//         );

//         alert(
//           `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
//         );

//         // ===================================================
//         // NEW ROUND
//         // ===================================================

//         setScore(0);
//         setQuestionCount(0);

//         const newData =
//           await generateQuestionAI();

//         await save({
//           question: 0,
//           score: 0,
//           word: newData.word,
//           options: newData.options,
//           correctAnswer:
//             newData.answer,
//         });

//         return;
//       }

//       // =====================================================
//       // ➡️ NEXT QUESTION
//       // =====================================================

//       setLoading(true);

//       const newData =
//         await generateQuestionAI();

//       setQuestionCount(nextCount);

//       await save({
//         question: nextCount,
//         score: updatedScore,
//         word: newData.word,
//         options: newData.options,
//         correctAnswer:
//           newData.answer,
//       });

//       console.log(
//         "💾 Break Word progress saved:",
//         {
//           question: nextCount,
//           score: updatedScore,
//         }
//       );
//     }, 900);
//   };

//   // =========================================================
//   // 📊 PERFORMANCE
//   // =========================================================

//   const getPerformanceMessage = () => {
//     if (questionCount === 0) {
//       return "";
//     }

//     const accuracy =
//       (score / questionCount) * 100;

//     if (accuracy > 80) {
//       return "🌟 Excellent segmentation!";
//     }

//     if (accuracy > 50) {
//       return "👍 Good job!";
//     }

//     return "💡 Practice breaking words!";
//   };

//   // =========================================================
//   // ⏳ LOADING SCREEN
//   // =========================================================

//   if (!gameReady) {
//     return (
//       <div className="break-page">

//         <nav className="break-navbar">

//           <div className="break-brand">
//             <span className="break-brand-icon">
//               🌿
//             </span>
//             CurioKids
//           </div>

//           <div className="break-navbar-title">
//             Break the Word
//           </div>

//         </nav>

//         <main className="break-main">

//           <section className="break-game-card break-loading-card">

//             <div className="break-loading-icon">
//               🤖
//             </div>

//             <h2>
//               Getting Your Challenge Ready
//             </h2>

//             <p>
//               Preparing a fun word puzzle for you...
//             </p>

//           </section>

//         </main>

//       </div>
//     );
//   }

//   // =========================================================
//   // 🎮 MAIN GAME UI
//   // =========================================================

//   return (
//     <div className="break-page">

//       {/* =====================================================
//           NAVBAR
//       ===================================================== */}

//       <nav className="break-navbar">

//         <div className="break-brand">
//           <span className="break-brand-icon">
//             🌿
//           </span>

//           CurioKids
//         </div>

//         <div className="break-navbar-title">
//           🤖 Break the Word
//         </div>

//       </nav>

//       {/* =====================================================
//           MAIN
//       ===================================================== */}

//       <main className="break-main">

//         <section className="break-game-card">

//           {/* =================================================
//               SCORE / QUESTION
//           ================================================= */}

//           <div className="break-stats">

//             <div className="break-stat-pill">

//               <span className="break-stat-label">
//                 Question
//               </span>

//               <strong>
//                 {questionCount + 1}
//                 <span className="break-stat-total">
//                   /{TOTAL_QUESTIONS}
//                 </span>
//               </strong>

//             </div>

//             <div className="break-stat-pill">

//               <span className="break-stat-star">
//                 ⭐
//               </span>

//               <span className="break-stat-label">
//                 Score
//               </span>

//               <strong>
//                 {score}
//               </strong>

//             </div>

//           </div>

//           {/* =================================================
//               WORD AREA
//           ================================================= */}

//           <section className="break-word-panel">

//             <div className="break-word-heading">
//               FIND THE SOUNDS
//             </div>

//             <div className="break-word-display">

//               {loading ? (
//                 <span className="break-word-loading">
//                   ...
//                 </span>
//               ) : (
//                 word
//               )}

//             </div>

//             <div className="break-word-question">
//               Break this word into sounds
//             </div>

//           </section>

//           {/* =================================================
//               OPTIONS
//           ================================================= */}

//           <section className="break-options-section">

//             <div className="break-options-heading">
//               Choose the correct breakdown
//             </div>

//             <div className="break-options-grid">

//               {loading ? (
//                 <div className="break-options-loading">
//                   Loading...
//                 </div>
//               ) : (
//                 options.map((opt, index) => {

//                   const isCorrect =
//                     message === "correct" &&
//                     opt === correctAnswer;

//                   const isWrong =
//                     message === "wrong" &&
//                     opt !== correctAnswer;

//                   return (
//                     <button
//                       key={index}
//                       type="button"
//                       className={`break-option-card ${
//                         isCorrect
//                           ? "break-option-correct"
//                           : ""
//                       } ${
//                         isWrong
//                           ? "break-option-disabled"
//                           : ""
//                       }`}
//                       onClick={() =>
//                         handleClick(opt)
//                       }
//                       disabled={!!message}
//                     >
//                       <span>
//                         {opt}
//                       </span>
//                     </button>
//                   );
//                 })
//               )}

//             </div>

//           </section>

//           {/* =================================================
//               FEEDBACK
//           ================================================= */}

//           <div
//             className={`break-feedback ${
//               message === "correct"
//                 ? "break-feedback-correct"
//                 : ""
//             } ${
//               message === "wrong"
//                 ? "break-feedback-wrong"
//                 : ""
//             }`}
//           >
//             {message === "correct"
//               ? "🎉 Correct! Great job!"
//               : message === "wrong"
//               ? "💡 Not quite! Keep going!"
//               : ""}
//           </div>

//           {/* =================================================
//               PERFORMANCE
//           ================================================= */}

//           <div className="break-performance">
//             {getPerformanceMessage()}
//           </div>

//         </section>

//       </main>

//     </div>
//   );
// }




import { useState, useEffect } from "react";

import "../styles/BreakWord.css";

import { db } from "../firebase";

import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

export default function BreakWord() {
  const TOTAL_QUESTIONS = 5;
  const GAME_ID = "break-word";

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =========================================================
  // 🎮 GAME STATE
  // =========================================================

  const [word, setWord] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] =
    useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [gameReady, setGameReady] =
    useState(false);

  // 🏆 Winning popup
  const [showWinningPopup, setShowWinningPopup] =
    useState(false);

  // =========================================================
  // 🤖 GENERATE QUESTION
  // =========================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

      const res = await fetch(
        `${API_URL}/api/generate-break-word`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to generate question: ${res.status}`
        );
      }

      const data = await res.json();

      console.log(
        "🤖 Break Word AI:",
        data
      );

      if (
        !data.word ||
        !data.options ||
        !data.answer
      ) {
        throw new Error(
          "Invalid data"
        );
      }

      setWord(data.word);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

      setLoading(false);

      return data;
    } catch (err) {
      console.error(
        "❌ Break Word error:",
        err
      );

      const fallback = {
        word: "CAT",
        options: [
          "c - a - t",
          "ca - t",
          "c - at",
          "cat",
        ],
        answer: "c - a - t",
      };

      setWord(fallback.word);
      setOptions(
        fallback.options
      );
      setCorrectAnswer(
        fallback.answer
      );

      setLoading(false);

      return fallback;
    }
  };

  // =========================================================
  // 🔄 LOAD / RESUME
  // =========================================================

  useEffect(() => {
    if (progressLoading) {
      console.log(
        "⏳ Waiting for Break Word Firebase progress..."
      );

      return;
    }

    const loadGame =
      async () => {
        console.log(
          "🎮 Break Word saved state:",
          savedState
        );

        // ===================================================
        // 🔄 RESUME EXISTING GAME
        // ===================================================

        if (
          savedState &&
          savedState.word &&
          Array.isArray(
            savedState.options
          ) &&
          savedState.options.length > 0 &&
          savedState.correctAnswer
        ) {
          console.log(
            "🔄 RESUMING BREAK WORD:",
            savedState
          );

          setWord(
            savedState.word
          );

          setOptions(
            savedState.options
          );

          setCorrectAnswer(
            savedState.correctAnswer
          );

          setQuestionCount(
            Number(
              savedState.question
            ) || 0
          );

          setScore(
            Number(
              savedState.score
            ) || 0
          );

          setLoading(false);
          setGameReady(true);

          return;
        }

        // ===================================================
        // 🆕 NEW GAME
        // ===================================================

        console.log(
          "🆕 Starting new Break Word game"
        );

        const data =
          await generateQuestionAI();

        await save({
          question: 0,
          score: 0,
          word: data.word,
          options:
            data.options,
          correctAnswer:
            data.answer,
        });

        setQuestionCount(0);
        setScore(0);
        setGameReady(true);
      };

    loadGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoading]);

  // =========================================================
  // 📊 ACTIVITY
  // =========================================================

  const logActivity =
    async (finalScore) => {
      const userId =
        localStorage.getItem(
          "userId"
        );

      if (!userId) {
        return;
      }

      try {
        await addDoc(
          collection(
            db,
            "activity"
          ),
          {
            userId,
            action: "play",
            module: "phonics",
            screen:
              "break-word",
            score: finalScore,
            timestamp:
              Timestamp.now(),
          }
        );

        console.log(
          "📊 Break Word activity saved"
        );
      } catch (error) {
        console.error(
          "❌ Activity error:",
          error
        );
      }
    };

  // =========================================================
  // ☁️ FINAL RESULT
  // =========================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {
          return;
        }

        const userRef =
          doc(
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
              "BreakWord_AI",
          }
        );

        console.log(
          "☁️ Break Word result saved"
        );
      } catch (error) {
        console.error(
          "❌ Result save error:",
          error
        );
      }
    };

  // =========================================================
  // 🌱 PLAY AGAIN
  // =========================================================

  const playAgain = async () => {
    setShowWinningPopup(false);

    setScore(0);
    setQuestionCount(0);

    setWord("");
    setOptions([]);
    setCorrectAnswer("");

    setMessage("");
    setLoading(true);

    try {
      const newData =
        await generateQuestionAI();

      await save({
        question: 0,
        score: 0,
        word: newData.word,
        options:
          newData.options,
        correctAnswer:
          newData.answer,
      });

      setQuestionCount(0);
      setScore(0);

      console.log(
        "🌱 Break Word new round started"
      );
    } catch (error) {
      console.error(
        "❌ Break Word Play Again error:",
        error
      );
    }
  };

  // =========================================================
  // 🎯 ANSWER
  // =========================================================

  const handleClick = (
    option
  ) => {
    if (loading) return;
    if (message) return;
    if (!gameReady) return;
    if (showWinningPopup) return;

    const isCorrect =
      option ===
      correctAnswer;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    if (isCorrect) {
      setScore(
        updatedScore
      );

      setMessage(
        "✅ Correct!"
      );
    } else {
      setMessage(
        "❌ Try again!"
      );
    }

    setTimeout(
      async () => {
        setMessage("");

        const nextCount =
          questionCount + 1;

        // ===================================================
        // 🏆 COMPLETE
        // ===================================================

        if (
          nextCount ===
          TOTAL_QUESTIONS
        ) {
          const finalPercentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏆 Break Word completed:",
            updatedScore,
            "/",
            TOTAL_QUESTIONS
          );

          // =================================================
          // 🏆 SHOW WINNING POPUP FIRST
          // =================================================

          setScore(
            updatedScore
          );

          setQuestionCount(
            TOTAL_QUESTIONS
          );

          setShowWinningPopup(
            true
          );

          // =================================================
          // 💾 SAVE RESULTS
          // =================================================

          try {
            await finish(
              finalPercentage,
              "Break Word"
            );
          } catch (error) {
            console.error(
              "❌ Break Word progress error:",
              error
            );
          }

          try {
            await logActivity(
              finalPercentage
            );
          } catch (error) {
            console.error(
              "❌ Break Word activity error:",
              error
            );
          }

          try {
            await saveScoreToFirestore(
              updatedScore
            );
          } catch (error) {
            console.error(
              "❌ Break Word result error:",
              error
            );
          }

          return;
        }

        // ===================================================
        // ➡️ NEXT QUESTION
        // ===================================================

        setLoading(true);

        const newData =
          await generateQuestionAI();

        setQuestionCount(
          nextCount
        );

        try {
          await save({
            question:
              nextCount,
            score:
              updatedScore,
            word:
              newData.word,
            options:
              newData.options,
            correctAnswer:
              newData.answer,
          });

          console.log(
            "💾 Break Word progress saved:",
            {
              question:
                nextCount,
              score:
                updatedScore,
            }
          );
        } catch (error) {
          console.error(
            "❌ Break Word progress save error:",
            error
          );
        }
      },
      900
    );
  };

  // =========================================================
  // 📊 PERFORMANCE
  // =========================================================

  const getPerformanceMessage =
    () => {
      if (
        questionCount ===
        0
      ) {
        return "";
      }

      const accuracy =
        (score /
          questionCount) *
        100;

      if (
        accuracy > 80
      ) {
        return "🌟 Excellent segmentation!";
      }

      if (
        accuracy > 50
      ) {
        return "👍 Good job!";
      }

      return "💡 Practice breaking words!";
    };

  // =========================================================
  // ⏳ INITIAL LOADING
  // =========================================================

  if (!gameReady) {
    return (
      <div className="blend-container">

        <h2>
          🤖 Break the Word
        </h2>

        <div className="big-letter">
          ⏳
        </div>

        <p>
          Loading your saved game...
        </p>

      </div>
    );
  }

  // =========================================================
  // 🎮 UI
  // =========================================================

  return (
    <div className="blend-container">

      {/* =====================================================
          🏆 WINNING POPUP
      ===================================================== */}

      {showWinningPopup && (
        <div className="winning-overlay">

          <div className="winning-popup">

            <div className="winning-leaves">
              <span>
                🍃
              </span>

              <span>
                🌿
              </span>
            </div>

            <div className="winning-trophy">
              🏆
            </div>

            <div className="winning-badge">
              🎯 JUNGLE CHALLENGE COMPLETE
            </div>

            <h2>
              You Did It!
            </h2>

            <p className="winning-message">
              Amazing work! You broke all
              the words in the jungle! 🌟
            </p>

            <div className="winning-score">

              <span className="winning-score-label">
                SCORE
              </span>

              <strong>
                {score}/{TOTAL_QUESTIONS}
              </strong>

            </div>

            <div className="winning-percentage">

              {(
                (score /
                  TOTAL_QUESTIONS) *
                100
              ).toFixed(0)}

              <span>
                %
              </span>

            </div>

            <p className="winning-feedback">
              {getPerformanceMessage()}
            </p>

            <button
              className="winning-play-btn"
              onClick={
                playAgain
              }
            >
              🌱 Play Again
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          GAME TITLE
      ===================================================== */}

      <h2>
        🤖 Break the Word
      </h2>

      {/* =====================================================
          GAME INFO
      ===================================================== */}

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

      {/* =====================================================
          WORD
      ===================================================== */}

      <div className="big-letter">
        {loading
          ? "..."
          : word}
      </div>

      {/* =====================================================
          QUESTION
      ===================================================== */}

      <h3>
        Break this word into sounds
      </h3>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

      <div className="options">

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          options.map(
            (opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() =>
                  handleClick(
                    opt
                  )
                }
                disabled={
                  !!message ||
                  showWinningPopup
                }
              >
                {opt}
              </button>
            )
          )
        )}

      </div>

      {/* =====================================================
          FEEDBACK
      ===================================================== */}

      <p className="message">
        {message}
      </p>

      {/* =====================================================
          AI ANALYSIS
      ===================================================== */}

      <div className="ai-analysis">

        <p>
          {getPerformanceMessage()}
        </p>

      </div>

    </div>
  );
}
