// import { useState, useEffect } from "react";
// import "../styles/BeginningSounds.css";

// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// import useGameProgress from "../hooks/useGameProgress";

// export default function BeginningSounds() {
//   const GAME_ID = "beginning-sounds";
//   const GAME_NAME = "Beginning Sounds";
//   const TOTAL_QUESTIONS = 5;

//   // =========================================================
//   // 🎮 GAME PROGRESS
//   // =========================================================

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(GAME_ID, {
//     question: 0,
//     score: 0,
//     currentWord: {},
//     options: [],
//   });

//   // =========================================================
//   // 🎯 GAME STATE
//   // =========================================================

//   const [currentWord, setCurrentWord] = useState({});
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [gameReady, setGameReady] = useState(false);

//   // =========================================================
//   // 🤖 GENERATE AI QUESTION
//   // =========================================================

//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/generate-beginning-sound`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();

//       if (!data.word || !data.sound || !data.options) {
//         throw new Error("Invalid AI response");
//       }

//       const question = {
//         word: data.word,
//         sound: data.sound,
//         emoji: data.emoji || "🔤",
//       };

//       setCurrentWord(question);
//       setOptions(data.options);

//       return {
//         currentWord: question,
//         options: data.options,
//       };
//     } catch (err) {
//       console.error("AI Error:", err);

//       // Fallback question
//       const fallback = {
//         word: "Dog",
//         sound: "D",
//         emoji: "🐶",
//       };

//       const fallbackOptions = ["D", "B", "M", "S"];

//       setCurrentWord(fallback);
//       setOptions(fallbackOptions);

//       return {
//         currentWord: fallback,
//         options: fallbackOptions,
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // 🔄 LOAD / RESUME GAME
//   // =========================================================

//   useEffect(() => {
//     if (progressLoading || !savedState || gameReady) return;

//     const loadSavedGame = async () => {
//       const savedQuestion =
//         Number(savedState.question) || 0;

//       const savedScore =
//         Number(savedState.score) || 0;

//       setQuestionCount(savedQuestion);
//       setScore(savedScore);

//       // If Firebase already has the current question,
//       // restore it instead of generating a new one.
//       if (
//         savedState.currentWord &&
//         savedState.currentWord.word &&
//         Array.isArray(savedState.options) &&
//         savedState.options.length > 0
//       ) {
//         // Restore exact saved question
//         setCurrentWord(savedState.currentWord);
//         setOptions(savedState.options);

//         // Firebase question is already loaded
//         setLoading(false);

//         console.log(
//           "🔄 Beginning Sounds resumed:",
//           savedState
//         );
//       } else {
//         const generated = await generateQuestionAI();

//         await save({
//           question: savedQuestion,
//           score: savedScore,
//           currentWord: generated.currentWord,
//           options: generated.options,
//         });
//       }

//       setGameReady(true);
//     };

//     loadSavedGame();
//   }, [progressLoading, savedState, gameReady]);

//   // =========================================================
//   // 📊 ACTIVITY LOGGER
//   // =========================================================

//   const logActivity = async (finalScore) => {
//     const userId = localStorage.getItem("userId");

//     if (!userId) return;

//     try {
//       await addDoc(collection(db, "activity"), {
//         userId,
//         action: "play",
//         module: "phonics",
//         screen: "beginning-sounds",
//         score: finalScore,
//         timestamp: new Date(),
//       });

//       console.log("✅ Activity logged");
//     } catch (error) {
//       console.error(
//         "❌ Activity log error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // ☁️ SAVE GAME RESULT
//   // =========================================================

//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) return;

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
//         game: "BeginningSounds_AI",
//       });

//       console.log("✅ Game result saved");
//     } catch (error) {
//       console.error(
//         "❌ Firestore result error:",
//         error
//       );
//     }
//   };

//   // =========================================================
//   // 🎯 HANDLE ANSWER
//   // =========================================================

//   const handleClick = async (letter) => {
//     if (
//       loading ||
//       !gameReady ||
//       questionCount >= TOTAL_QUESTIONS ||
//       feedback
//     ) {
//       return;
//     }

//     const isCorrect =
//       letter === currentWord.sound;

//     const updatedScore = isCorrect
//       ? score + 1
//       : score;

//     if (isCorrect) {
//       setScore(updatedScore);
//       setFeedback("correct");
//     } else {
//       setFeedback("wrong");
//     }

//     setTimeout(async () => {
//       setFeedback("");

//       const nextQuestion =
//         questionCount + 1;

//       // =====================================================
//       // 🏁 GAME COMPLETED
//       // =====================================================

//       if (nextQuestion >= TOTAL_QUESTIONS) {
//         const finalPercentage =
//           (updatedScore / TOTAL_QUESTIONS) * 100;

//         console.log(
//           "🏁 Beginning Sounds completed:",
//           finalPercentage
//         );

//         // ⭐ ADD STARS + HISTORY
//         // 🗑️ CLEAR RESUME DATA
//         await finish(
//           finalPercentage,
//           GAME_NAME
//         );

//         // 📊 ACTIVITY
//         await logActivity(finalPercentage);

//         // ☁️ DETAILED RESULT
//         await saveScoreToFirestore(updatedScore);

//         alert(
//           `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
//         );

//         // Reset local state
//         setScore(0);
//         setQuestionCount(0);
//         setCurrentWord({});
//         setOptions([]);

//         // Start a completely new round
//         const generated =
//           await generateQuestionAI();

//         await save({
//           question: 0,
//           score: 0,
//           currentWord:
//             generated.currentWord,
//           options: generated.options,
//         });

//         return;
//       }

//       // =====================================================
//       // ➡️ NEXT QUESTION
//       // =====================================================

//       setQuestionCount(nextQuestion);
//       setScore(updatedScore);

//       const generated =
//         await generateQuestionAI();

//       // 💾 SAVE RESUME PROGRESS
//       await save({
//         question: nextQuestion,
//         score: updatedScore,
//         currentWord:
//           generated.currentWord,
//         options: generated.options,
//       });

//       console.log(
//         "💾 Beginning Sounds progress saved"
//       );
//     }, 700);
//   };

//   // =========================================================
//   // 📊 PERFORMANCE MESSAGE
//   // =========================================================

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

//   // =========================================================
//   // ⏳ WAIT FOR FIREBASE PROGRESS
//   // =========================================================

//   if (progressLoading || !gameReady) {
//     return (
//       <div className="phonics-page">
//         <div className="phonics-navbar">
//           <div className="phonics-navbar-title">
//             🔤 AI Beginning Sounds
//           </div>
//         </div>

//         <div className="phonics-content">
//           <div className="word-display">
//             <div className="emoji">
//               ⏳
//             </div>

//             <h2>
//               Loading your game...
//             </h2>

//             <p className="feedback">
//               Checking your saved progress...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // 🎨 UI
//   // =========================================================

//   return (
//     <div className="phonics-page">

//       {/* =====================================================
//           NAVBAR
//           ===================================================== */}

//       <div className="phonics-navbar">
//         <div className="phonics-navbar-title">
//           🔤 AI Beginning Sounds
//         </div>
//       </div>


//       {/* =====================================================
//           WOODEN GAME CARD
//           ===================================================== */}

//       <div className="phonics-content">

//         {/* QUESTION + SCORE */}
//         <div className="game-info">

//           <span>
//             Question:{" "}
//             {questionCount + 1}/
//             {TOTAL_QUESTIONS}
//           </span>

//           <span>
//             ⭐ Score: {score}
//           </span>

//         </div>


//         {/* WORD / IMAGE */}
//         <div className="word-display">

//           <div className="emoji">
//             {loading
//               ? "⏳"
//               : currentWord?.emoji || "🔤"}
//           </div>

//           <h2>
//             {loading
//               ? "Loading..."
//               : currentWord?.word ||
//                 "Loading..."}
//           </h2>

//         </div>


//         {/* QUESTION */}
//         <h3 className="phonics-question">
//           What sound does it start with?
//         </h3>


//         {/* ANSWER OPTIONS */}
//         <div className="options-grid">

//           {loading ? (
//             <p className="feedback">
//               Loading question...
//             </p>
//           ) : (
//             options.map((letter, index) => (
//               <button
//                 key={index}
//                 className="option-btn"
//                 onClick={() =>
//                   handleClick(letter)
//                 }
//                 disabled={!!feedback}
//               >
//                 {letter}
//               </button>
//             ))
//           )}

//         </div>


//         {/* CORRECT FEEDBACK */}
//         {feedback === "correct" && (
//           <div className="feedback good">
//             🎉 Correct!
//           </div>
//         )}


//         {/* WRONG FEEDBACK */}
//         {feedback === "wrong" && (
//           <div className="feedback wrong">
//             ❌ Try Again
//           </div>
//         )}


//         {/* AI PERFORMANCE */}
//         <div className="ai-analysis">
//           <p>
//             {getPerformanceMessage()}
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";

import "../styles/BeginningSounds.css";

import { db } from "../firebase";

import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

const API_URL = import.meta.env.VITE_API_URL;

export default function BeginningSounds() {
  const GAME_ID = "beginning-sounds";
  const GAME_NAME = "Beginning Sounds";
  const TOTAL_QUESTIONS = 5;

  // =========================================================
  // 🎮 GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    question: 0,
    score: 0,
    currentWord: {},
    options: [],
  });

  // =========================================================
  // 🎯 GAME STATE
  // =========================================================

  const [currentWord, setCurrentWord] =
    useState({});

  const [options, setOptions] =
    useState([]);

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [feedback, setFeedback] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [gameReady, setGameReady] =
    useState(false);

  // 🏆 Winning popup
  const [showWinningPopup, setShowWinningPopup] =
    useState(false);

  // =========================================================
  // 🤖 GENERATE AI QUESTION
  // =========================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/generate-beginning-sound`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          `Server returned ${res.status}`
        );
      }

      const data = await res.json();

      if (
        !data.word ||
        !data.sound ||
        !data.options
      ) {
        throw new Error(
          "Invalid AI response"
        );
      }

      const question = {
        word: data.word,
        sound: data.sound,
        emoji: data.emoji || "🔤",
      };

      setCurrentWord(question);
      setOptions(data.options);

      return {
        currentWord: question,
        options: data.options,
      };
    } catch (err) {
      console.error(
        "AI Error:",
        err
      );

      // =====================================================
      // FALLBACK QUESTION
      // =====================================================

      const fallback = {
        word: "Dog",
        sound: "D",
        emoji: "🐶",
      };

      const fallbackOptions = [
        "D",
        "B",
        "M",
        "S",
      ];

      setCurrentWord(fallback);
      setOptions(
        fallbackOptions
      );

      return {
        currentWord: fallback,
        options: fallbackOptions,
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🔄 LOAD / RESUME GAME
  // =========================================================

  useEffect(() => {
    if (
      progressLoading ||
      !savedState ||
      gameReady
    ) {
      return;
    }

    const loadSavedGame =
      async () => {
        const savedQuestion =
          Number(
            savedState.question
          ) || 0;

        const savedScore =
          Number(
            savedState.score
          ) || 0;

        setQuestionCount(
          savedQuestion
        );

        setScore(
          savedScore
        );

        // ===================================================
        // RESTORE SAVED QUESTION
        // ===================================================

        if (
          savedState.currentWord &&
          savedState.currentWord.word &&
          Array.isArray(
            savedState.options
          ) &&
          savedState.options.length > 0
        ) {
          setCurrentWord(
            savedState.currentWord
          );

          setOptions(
            savedState.options
          );

          setLoading(false);

          console.log(
            "🔄 Beginning Sounds resumed:",
            savedState
          );
        } else {
          // =================================================
          // CREATE FIRST QUESTION
          // =================================================

          const generated =
            await generateQuestionAI();

          await save({
            question:
              savedQuestion,

            score:
              savedScore,

            currentWord:
              generated.currentWord,

            options:
              generated.options,
          });
        }

        setGameReady(true);
      };

    loadSavedGame();
  }, [
    progressLoading,
    savedState,
    gameReady,
  ]);

  // =========================================================
  // 📊 ACTIVITY LOGGER
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
              "beginning-sounds",

            score: finalScore,

            timestamp:
              Timestamp.now(),
          }
        );

        console.log(
          "✅ Activity logged"
        );
      } catch (error) {
        console.error(
          "❌ Activity log error:",
          error
        );
      }
    };

  // =========================================================
  // ☁️ SAVE GAME RESULT
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
              "BeginningSounds_AI",
          }
        );

        console.log(
          "✅ Game result saved"
        );
      } catch (error) {
        console.error(
          "❌ Firestore result error:",
          error
        );
      }
    };

  // =========================================================
  // 🌱 PLAY AGAIN
  // =========================================================

  const playAgain =
    async () => {
      setShowWinningPopup(
        false
      );

      setFeedback("");

      setScore(0);

      setQuestionCount(0);

      setCurrentWord({});

      setOptions([]);

      setLoading(true);

      try {
        const generated =
          await generateQuestionAI();

        await save({
          question: 0,

          score: 0,

          currentWord:
            generated.currentWord,

          options:
            generated.options,
        });
      } catch (error) {
        console.error(
          "❌ Play Again error:",
          error
        );
      }
    };

  // =========================================================
  // 🎯 HANDLE ANSWER
  // =========================================================

  const handleClick =
    async (letter) => {
      if (
        loading ||
        !gameReady ||
        questionCount >=
          TOTAL_QUESTIONS ||
        feedback ||
        showWinningPopup
      ) {
        return;
      }

      const isCorrect =
        letter ===
        currentWord.sound;

      const updatedScore =
        isCorrect
          ? score + 1
          : score;

      if (isCorrect) {
        setScore(
          updatedScore
        );

        setFeedback(
          "correct"
        );
      } else {
        setFeedback(
          "wrong"
        );
      }

      setTimeout(
        async () => {
          setFeedback("");

          const nextQuestion =
            questionCount + 1;

          // =================================================
          // 🏆 GAME COMPLETED
          // =================================================

          if (
            nextQuestion >=
            TOTAL_QUESTIONS
          ) {
            const finalPercentage =
              (updatedScore /
                TOTAL_QUESTIONS) *
              100;

            console.log(
              "🏁 Beginning Sounds completed:",
              updatedScore,
              finalPercentage
            );

            // =================================================
            // SHOW WINNING POPUP FIRST
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
            // SAVE EVERYTHING
            // =================================================

            try {
              await finish(
                finalPercentage,
                GAME_NAME
              );
            } catch (error) {
              console.error(
                "❌ Finish progress error:",
                error
              );
            }

            try {
              await logActivity(
                finalPercentage
              );
            } catch (error) {
              console.error(
                "❌ Activity log error:",
                error
              );
            }

            try {
              await saveScoreToFirestore(
                updatedScore
              );
            } catch (error) {
              console.error(
                "❌ Firestore result error:",
                error
              );
            }

            return;
          }

          // =================================================
          // ➡️ NEXT QUESTION
          // =================================================

          setQuestionCount(
            nextQuestion
          );

          setScore(
            updatedScore
          );

          const generated =
            await generateQuestionAI();

          // =================================================
          // 💾 SAVE RESUME PROGRESS
          // =================================================

          await save({
            question:
              nextQuestion,

            score:
              updatedScore,

            currentWord:
              generated.currentWord,

            options:
              generated.options,
          });

          console.log(
            "💾 Beginning Sounds progress saved"
          );
        },
        700
      );
    };

  // =========================================================
  // 📊 PERFORMANCE MESSAGE
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
        return "🌟 Excellent!";
      }

      if (
        accuracy > 50
      ) {
        return "👍 Good job!";
      }

      return "💡 Practice more!";
    };

  // =========================================================
  // ⏳ WAIT FOR FIREBASE
  // =========================================================

  if (
    progressLoading ||
    !gameReady
  ) {
    return (
      <div className="phonics-page">

        <div className="word-display">

          <div className="emoji">
            ⏳
          </div>

          <h2>
            Loading your game...
          </h2>

          <p>
            Checking your saved progress...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // 🎨 MAIN UI
  // =========================================================

  return (
    <div className="phonics-page">

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
              Amazing work! You found
              all the beginning sounds
              in the jungle! 🌟
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
          NAVBAR
      ===================================================== */}

      <div className="letter-navbar">

        <h2>
          🤖 AI Beginning Sounds
        </h2>

      </div>

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

      <div className="word-display">

        <div className="emoji">

          {loading
            ? "⏳"
            : currentWord?.emoji ||
              "🔤"}

        </div>

        <h2>

          {loading
            ? "Loading..."
            : currentWord?.word ||
              "Loading..."}

        </h2>

      </div>

      {/* =====================================================
          QUESTION
      ===================================================== */}

      <h3>
        What sound does it start with?
      </h3>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

      <div className="options-grid">

        {loading ? (
          <p>
            Loading question...
          </p>
        ) : (
          options.map(
            (letter, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() =>
                  handleClick(
                    letter
                  )
                }
                disabled={
                  !!feedback ||
                  showWinningPopup
                }
              >
                {letter}
              </button>
            )
          )
        )}

      </div>

      {/* =====================================================
          FEEDBACK
      ===================================================== */}

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