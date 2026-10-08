// import { useEffect, useState } from "react";
// import { speak } from "../utils/speak";
// import "../styles/ConfusingLetters.css";

// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// import useGameProgress from "../hooks/useGameProgress";

// export default function ConfusingLetters() {
//   const GAME_ID = "confusing-letters";
//   const TOTAL_QUESTIONS = 5;

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(GAME_ID, {
//     target: "",
//     options: [],
//     score: 0,
//     questionCount: 0,
//     mistakes: {},
//     message: "",
//   });

//   const [target, setTarget] = useState("");
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [mistakes, setMistakes] = useState({});
//   const [locked, setLocked] = useState(false);

//   const [gameLoading, setGameLoading] = useState(true);

//   // --------------------------------------------------
//   // 🤖 AI QUESTION GENERATOR
//   // --------------------------------------------------

//   const generateQuestionAI = async (
//     currentMistakes = mistakes,
//     previousTarget = target
//   ) => {
//     try {
//       setGameLoading(true);

//       const res = await fetch(
//        `${import.meta.env.VITE_API_URL}/api/generate-confusing-letter`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             mistakes: currentMistakes,
//           }),
//         }
//       );

//       const data = await res.json();

//       console.log("🤖 AI DATA:", data);

//       if (!data.target || !data.options) {
//         throw new Error("Invalid AI response");
//       }

//       let newTarget = String(data.target).toLowerCase();

//       // Avoid repeating previous target
//       if (newTarget === previousTarget) {
//         const letters = [
//           "b",
//           "d",
//           "p",
//           "q",
//           "m",
//           "n",
//           "u",
//           "v",
//           "c",
//           "k",
//           "g",
//           "j",
//           "s",
//           "z",
//         ];

//         newTarget =
//           letters[Math.floor(Math.random() * letters.length)];
//       }

//       const newOptions = data.options.map((letter) =>
//         String(letter).toLowerCase()
//       );

//       setTarget(newTarget);
//       setOptions(newOptions);

//       speak(`Find the letter ${newTarget}`);

//       return {
//         target: newTarget,
//         options: newOptions,
//       };
//     } catch (err) {
//       console.error("❌ Frontend AI error:", err);

//       const fallbackTarget = "b";

//       const fallbackOptions = [
//         "b",
//         "d",
//         "p",
//         "q",
//         "b",
//         "d",
//         "p",
//         "q",
//       ];

//       setTarget(fallbackTarget);
//       setOptions(fallbackOptions);

//       return {
//         target: fallbackTarget,
//         options: fallbackOptions,
//       };
//     } finally {
//       setGameLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // 🔥 RESTORE / START GAME
//   // --------------------------------------------------

//   useEffect(() => {
//     if (progressLoading) return;

//     let cancelled = false;

//     const initializeGame = async () => {
//       if (savedState) {
//         console.log(
//           "🔥 Resuming Confusing Letters:",
//           savedState
//         );

//         setTarget(savedState.target || "");
//         setOptions(savedState.options || []);

//         setScore(savedState.score || 0);
//         setQuestionCount(savedState.questionCount || 0);

//         setMistakes(savedState.mistakes || {});
//         setMessage(savedState.message || "");

//         if (
//           savedState.target &&
//           savedState.options &&
//           savedState.options.length > 0
//         ) {
//           setGameLoading(false);

//           speak(
//             `Find the letter ${savedState.target}`
//           );

//           return;
//         }
//       }

//       // No saved game → create first question
//       const question = await generateQuestionAI(
//         savedState?.mistakes || {},
//         savedState?.target || ""
//       );

//       if (cancelled) return;

//       await save({
//         target: question.target,
//         options: question.options,
//         score: savedState?.score || 0,
//         questionCount: savedState?.questionCount || 0,
//         mistakes: savedState?.mistakes || {},
//         message: "",
//       });
//     };

//     initializeGame();

//     return () => {
//       cancelled = true;
//     };
//   }, [progressLoading]);

//   // --------------------------------------------------
//   // 📊 ACTIVITY LOGGER
//   // --------------------------------------------------

//   const logActivity = async (finalScore) => {
//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         console.warn(
//           "⚠️ No userId found. Activity not saved."
//         );
//         return;
//       }

//       await addDoc(collection(db, "activity"), {
//         userId,
//         action: "play",
//         module: "letters",
//         screen: "confusing-letters",
//         score: finalScore,
//         timestamp: new Date(),
//       });

//       console.log("✅ Activity logged");
//     } catch (error) {
//       console.error(
//         "❌ Activity logging error:",
//         error
//       );
//     }
//   };

//   // --------------------------------------------------
//   // ☁️ SAVE FINAL SCORE
//   // --------------------------------------------------

//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         console.warn(
//           "⚠️ No userId found. Score not saved."
//         );
//         return;
//       }

//       const userRef = doc(db, "users", userId);
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
//         game: "ConfusingLetters_AI",
//       });

//       console.log("✅ Game result saved");
//     } catch (error) {
//       console.error(
//         "❌ Error saving game result:",
//         error
//       );
//     }
//   };

//   // --------------------------------------------------
//   // 🎯 HANDLE LETTER CLICK
//   // --------------------------------------------------

//   const handleClick = async (letter) => {
//     if (locked || gameLoading) return;

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     setLocked(true);

//     const isCorrect = letter === target;

//     const updatedScore = isCorrect
//       ? score + 1
//       : score;

//     const updatedMistakes = isCorrect
//       ? mistakes
//       : {
//           ...mistakes,
//           [target]: (mistakes[target] || 0) + 1,
//         };

//     setMistakes(updatedMistakes);

//     if (isCorrect) {
//       setScore(updatedScore);
//       setMessage("🎉 Correct!");

//       speak("Great job!");
//     } else {
//       setMessage("💛 Try again");

//       speak("Try again");
//     }

//     // Save current answer state
//     await save({
//       target,
//       options,
//       score: updatedScore,
//       questionCount,
//       mistakes: updatedMistakes,
//       message: isCorrect
//         ? "🎉 Correct!"
//         : "💛 Try again",
//     });

//     setTimeout(async () => {
//       const nextCount = questionCount + 1;

//       setMessage("");
//       setLocked(false);

//       setQuestionCount(nextCount);

//       // ------------------------------------------------
//       // 🏁 ROUND COMPLETED
//       // ------------------------------------------------

//       if (nextCount === TOTAL_QUESTIONS) {
//         const finalPercentage =
//           (updatedScore / TOTAL_QUESTIONS) * 100;

//         console.log(
//           "🏁 Confusing Letters completed:",
//           updatedScore,
//           finalPercentage
//         );

//         // ⭐ Main progress system
//         await finish(
//           finalPercentage,
//           "Confusing Letters"
//         );

//         // 📊 Activity
//         await logActivity(finalPercentage);

//         // ☁️ Original game result
//         await saveScoreToFirestore(updatedScore);

//         alert(
//           `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
//         );

//         // Reset
//         setScore(0);
//         setQuestionCount(0);
//         setMistakes({});
//         setMessage("");

//         // Generate fresh question
//         const nextQuestion =
//           await generateQuestionAI({}, target);

//         await save({
//           target: nextQuestion.target,
//           options: nextQuestion.options,
//           score: 0,
//           questionCount: 0,
//           mistakes: {},
//           message: "",
//         });
//       } else {
//         // ------------------------------------------------
//         // ➡️ NEXT QUESTION
//         // ------------------------------------------------

//         const nextQuestion =
//           await generateQuestionAI(
//             updatedMistakes,
//             target
//           );

//         await save({
//           target: nextQuestion.target,
//           options: nextQuestion.options,
//           score: updatedScore,
//           questionCount: nextCount,
//           mistakes: updatedMistakes,
//           message: "",
//         });
//       }
//     }, 800);
//   };

//   // --------------------------------------------------
//   // 📊 PERFORMANCE MESSAGE
//   // --------------------------------------------------

//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy =
//       (score / questionCount) * 100;

//     if (accuracy > 80) {
//       return "🌟 Excellent!";
//     }

//     if (accuracy > 50) {
//       return "👍 Good job!";
//     }

//     return "💡 Practice more!";
//   };

//   // --------------------------------------------------
//   // ⏳ LOADING
//   // --------------------------------------------------

//   if (progressLoading || gameLoading) {
//     return (
//       <div className="confusing-page">
//         <div className="confusing-navbar">
//           <div className="navbar-title">
//             🤖 AI Letter Trainer
//           </div>
//         </div>

//         <div className="confusing-content">
//           <p>Loading your game...</p>
//         </div>
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // 🎨 UI
//   // --------------------------------------------------

//   return (
//     <div className="confusing-page">
//       <div className="confusing-navbar">
//         <div className="navbar-title">
//           🤖 AI Letter Trainer
//         </div>
//       </div>

//       <div className="confusing-content">
//         <h3>
//           Question {questionCount + 1} /{" "}
//           {TOTAL_QUESTIONS}
//         </h3>

//         <h2 className="instruction">
//           Find:
//           <span className="target">
//             {" "}
//             {target || "..."}
//           </span>
//         </h2>

//         <div className="letters-grid">
//           {options.length > 0 ? (
//             options.map((letter, index) => (
//               <div
//                 key={index}
//                 className="letter-box"
//                 onClick={() =>
//                   handleClick(letter)
//                 }
//               >
//                 {letter}
//               </div>
//             ))
//           ) : (
//             <p>Loading...</p>
//           )}
//         </div>

//         <div className="feedback">
//           {message}
//         </div>

//         <div className="score">
//           ⭐ Score: {score}
//         </div>

//         <div className="ai-analysis">
//           {getPerformanceMessage()}
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";

import { speak } from "../utils/speak";
import "../styles/ConfusingLetters.css";

import { db } from "../firebase";

import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

export default function ConfusingLetters() {
  const GAME_ID = "confusing-letters";
  const TOTAL_QUESTIONS = 5;

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    target: "",
    options: [],
    score: 0,
    questionCount: 0,
    mistakes: {},
    message: "",
    completed: false,
  });

  // =========================================================
  // STATES
  // =========================================================

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [mistakes, setMistakes] = useState({});

  const [locked, setLocked] = useState(false);
  const [gameLoading, setGameLoading] = useState(true);

  // Winning popup
  const [showWinningPopup, setShowWinningPopup] =
    useState(false);

  // =========================================================
  // AI QUESTION GENERATOR
  // =========================================================

  const generateQuestionAI = async (
    currentMistakes = mistakes,
    previousTarget = target
  ) => {
    try {
      setGameLoading(true);

      const apiBase =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000";

      const res = await fetch(
        `${apiBase}/api/generate-confusing-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mistakes: currentMistakes,
          }),
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(
          `Server returned ${res.status}`
        );
      }

      const data = await res.json();

      console.log("🤖 AI DATA:", data);

      if (!data.target || !data.options) {
        throw new Error("Invalid AI response");
      }

      let newTarget = String(
        data.target
      ).toLowerCase();

      // Avoid repeating the previous target
      if (newTarget === previousTarget) {
        const letters = [
          "b",
          "d",
          "p",
          "q",
          "m",
          "n",
          "u",
          "v",
          "c",
          "k",
          "g",
          "j",
          "s",
          "z",
        ];

        const differentLetters =
          letters.filter(
            (letter) =>
              letter !== previousTarget
          );

        newTarget =
          differentLetters[
            Math.floor(
              Math.random() *
                differentLetters.length
            )
          ];
      }

      const newOptions = data.options
        .map((letter) =>
          String(letter).toLowerCase()
        );

      setTarget(newTarget);
      setOptions(newOptions);

      speak(
        `Find the letter ${newTarget}`
      );

      return {
        target: newTarget,
        options: newOptions,
      };
    } catch (err) {
      console.error(
        "❌ Frontend AI error:",
        err
      );

      const fallbackTargets = [
        "b",
        "d",
        "p",
        "q",
        "m",
        "n",
        "u",
        "v",
        "c",
        "k",
        "g",
        "j",
        "s",
        "z",
      ];

      const availableTargets =
        fallbackTargets.filter(
          (letter) =>
            letter !== previousTarget
        );

      const fallbackTarget =
        availableTargets[
          Math.floor(
            Math.random() *
              availableTargets.length
          )
        ] || "b";

      const fallbackOptions =
        [fallbackTarget];

      const fallbackPool =
        fallbackTargets.filter(
          (letter) =>
            letter !==
              fallbackTarget &&
            !fallbackOptions.includes(
              letter
            )
        );

      while (
        fallbackOptions.length < 8 &&
        fallbackPool.length > 0
      ) {
        const randomIndex =
          Math.floor(
            Math.random() *
              fallbackPool.length
          );

        fallbackOptions.push(
          fallbackPool.splice(
            randomIndex,
            1
          )[0]
        );
      }

      setTarget(fallbackTarget);
      setOptions(fallbackOptions);

      return {
        target: fallbackTarget,
        options: fallbackOptions,
      };
    } finally {
      setGameLoading(false);
    }
  };

  // =========================================================
  // RESTORE / START GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;

    let cancelled = false;

    const initializeGame = async () => {
      if (savedState) {
        console.log(
          "🔥 Resuming Confusing Letters:",
          savedState
        );

        setTarget(
          savedState.target || ""
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

        setMistakes(
          savedState.mistakes || {}
        );

        setMessage(
          savedState.message || ""
        );

        const savedRoundCompleted =
          Boolean(
            savedState.completed
          ) ||
          Number(
            savedState.questionCount || 0
          ) >= TOTAL_QUESTIONS;

        if (
          savedRoundCompleted
        ) {
          setGameLoading(false);
          setShowWinningPopup(true);
          setLocked(true);

          return;
        }

        if (
          savedState.target &&
          savedState.options &&
          savedState.options.length > 0
        ) {
          setGameLoading(false);

          speak(
            `Find the letter ${savedState.target}`
          );

          return;
        }
      }

      // No saved game → create first question
      const question =
        await generateQuestionAI(
          savedState?.mistakes || {},
          savedState?.target || ""
        );

      if (cancelled) return;

      await save({
        target: question.target,
        options: question.options,
        score:
          savedState?.score || 0,
        questionCount:
          savedState?.questionCount || 0,
        mistakes:
          savedState?.mistakes || {},
        message: "",
        completed: false,
      });
    };

    initializeGame();

    return () => {
      cancelled = true;
    };
  }, [progressLoading]);

  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (finalScore) => {
    try {
      const userId =
        localStorage.getItem(
          "userId"
        );

      if (!userId) {
        console.warn(
          "⚠️ No userId found. Activity not saved."
        );
        return;
      }

      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "letters",
          screen: "confusing-letters",
          score: finalScore,
          timestamp: Timestamp.now(),
        }
      );

      console.log(
        "✅ Activity logged"
      );
    } catch (error) {
      console.error(
        "❌ Activity logging error:",
        error
      );
    }
  };

  // =========================================================
  // SAVE FINAL SCORE
  // =========================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {
          console.warn(
            "⚠️ No userId found. Score not saved."
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
              "ConfusingLetters_AI",
          }
        );

        console.log(
          "✅ Game result saved"
        );
      } catch (error) {
        console.error(
          "❌ Error saving game result:",
          error
        );
      }
    };

  // =========================================================
  // PLAY AGAIN
  // =========================================================

  const playAgain = async () => {
    setShowWinningPopup(false);
    setLocked(false);

    setScore(0);
    setQuestionCount(0);
    setMistakes({});
    setMessage("");

    try {
      const nextQuestion =
        await generateQuestionAI(
          {},
          target
        );

      await save({
        target: nextQuestion.target,
        options: nextQuestion.options,
        score: 0,
        questionCount: 0,
        mistakes: {},
        message: "",
        completed: false,
      });
    } catch (error) {
      console.error(
        "❌ Play Again error:",
        error
      );
    }
  };

  // =========================================================
  // HANDLE LETTER CLICK
  // =========================================================

  const handleClick = async (letter) => {
    if (
      locked ||
      gameLoading ||
      showWinningPopup
    ) {
      return;
    }

    if (
      questionCount >=
      TOTAL_QUESTIONS
    ) {
      return;
    }

    setLocked(true);

    const isCorrect =
      letter === target;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const updatedMistakes =
      isCorrect
        ? mistakes
        : {
            ...mistakes,
            [target]:
              (mistakes[target] || 0) +
              1,
          };

    setMistakes(
      updatedMistakes
    );

    if (isCorrect) {
      setScore(updatedScore);
      setMessage("🎉 Correct!");

      speak("Great job!");
    } else {
      setMessage("💛 Try again");

      speak("Try again");
    }

    // Save current answer state
    try {
      await save({
        target,
        options,
        score: updatedScore,
        questionCount,
        mistakes:
          updatedMistakes,
        message: isCorrect
          ? "🎉 Correct!"
          : "💛 Try again",
        completed: false,
      });
    } catch (error) {
      console.error(
        "❌ Answer save error:",
        error
      );
    }

    setTimeout(
      async () => {
        const nextCount =
          questionCount + 1;

        setMessage("");

        // =================================================
        // ROUND COMPLETED
        // =================================================

        if (
          nextCount ===
          TOTAL_QUESTIONS
        ) {
          const finalPercentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏁 Confusing Letters completed:",
            updatedScore,
            finalPercentage
          );

          // Update the visible UI FIRST.
          // Firebase operations below must not block
          // the winning screen.
          setScore(updatedScore);
          setQuestionCount(
            nextCount
          );

          setShowWinningPopup(true);

          setLocked(true);

          // Save completed state
          try {
            await save({
              target,
              options,
              score: updatedScore,
              questionCount:
                TOTAL_QUESTIONS,
              mistakes:
                updatedMistakes,
              message: "",
              completed: true,
            });
          } catch (error) {
            console.error(
              "❌ Completed state save error:",
              error
            );
          }

          // ⭐ Main progress system
          try {
            await finish(
              finalPercentage,
              "Confusing Letters"
            );
          } catch (error) {
            console.error(
              "❌ Finish progress error:",
              error
            );
          }

          // 📊 Activity
          try {
            await logActivity(
              finalPercentage
            );
          } catch (error) {
            console.error(
              "❌ Activity logging error:",
              error
            );
          }

          // ☁️ Original game result
          try {
            await saveScoreToFirestore(
              updatedScore
            );
          } catch (error) {
            console.error(
              "❌ Score saving error:",
              error
            );
          }

          return;
        }

        // =================================================
        // NEXT QUESTION
        // =================================================

        setQuestionCount(
          nextCount
        );

        const nextQuestion =
          await generateQuestionAI(
            updatedMistakes,
            target
          );

        await save({
          target: nextQuestion.target,
          options: nextQuestion.options,
          score: updatedScore,
          questionCount: nextCount,
          mistakes:
            updatedMistakes,
          message: "",
          completed: false,
        });

        setScore(updatedScore);
        setMessage("");
        setLocked(false);
      },
      800
    );
  };

  // =========================================================
  // PERFORMANCE MESSAGE
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

      return "💡 Practice more!";
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    gameLoading
  ) {
    return (
      <div className="confusing-page">
        <div className="confusing-navbar">
          <div className="navbar-title">
            🤖 AI Letter Trainer
          </div>
        </div>

        <div className="confusing-content">
          <p>
            Loading your game...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="confusing-page">

      {/* =================================================
          WINNING POPUP
      ================================================= */}

      {showWinningPopup && (
        <div className="winning-overlay">

          <div className="winning-popup">

            <div className="winning-leaves">
              <span>🍃</span>
              <span>🌿</span>
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
              Amazing work! You found all
              the confusing letters! 🌟
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
              <span>%</span>
            </div>

            <p className="winning-feedback">
              {getPerformanceMessage()}
            </p>

            <button
              className="winning-play-btn"
              onClick={playAgain}
            >
              🌱 Play Again
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          NAVBAR
      ================================================= */}

      <div className="confusing-navbar">
        <div className="navbar-title">
          🤖 AI Letter Trainer
        </div>
      </div>

      {/* =================================================
          GAME CONTENT
      ================================================= */}

      <div className="confusing-content">

        <h3>
          Question {Math.min(
            questionCount + 1,
            TOTAL_QUESTIONS
          )}{" "}
          /{" "}
          {TOTAL_QUESTIONS}
        </h3>

        <h2 className="instruction">
          Find:

          <span className="target">
            {" "}
            {target || "..."}
          </span>
        </h2>

        <div className="letters-grid">

          {options.length > 0 ? (
            options.map(
              (letter, index) => (
                <div
                  key={`${letter}-${index}`}
                  className="letter-box"
                  onClick={() =>
                    handleClick(letter)
                  }
                  style={{
                    pointerEvents:
                      locked
                        ? "none"
                        : "auto",
                  }}
                >
                  {letter}
                </div>
              )
            )
          ) : (
            <p>
              Loading...
            </p>
          )}

        </div>

        <div className="feedback">
          {message}
        </div>

        <div className="score">
          ⭐ Score: {score}
        </div>

        <div className="ai-analysis">
          {getPerformanceMessage()}
        </div>

      </div>

    </div>
  );
}
