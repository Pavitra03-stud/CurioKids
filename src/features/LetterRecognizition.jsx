// // import { useEffect, useState } from "react";
// // import { speak } from "../utils/speak";
// // import "../styles/ConfusingLetters.css";
// // import { db } from "../firebase";
// // import { doc, setDoc, getDoc } from "firebase/firestore";

// // export default function LetterRecognition() {

// //   const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

// //   const [target, setTarget] = useState("");
// //   const [options, setOptions] = useState([]);
// //   const [correctCount, setCorrectCount] = useState(0);
// //   const [roundCompleted, setRoundCompleted] = useState(false);

// //   // ✅ Logged user
// //   const userEmail = localStorage.getItem("loginEmail");

// //   useEffect(() => {
// //     generateQuestion();
// //   }, []);

// //   const generateQuestion = () => {
// //     const randomLetter =
// //       alphabet[Math.floor(Math.random() * alphabet.length)];

// //     const shuffled = [...alphabet]
// //       .sort(() => 0.5 - Math.random())
// //       .slice(0, 7);

// //     if (!shuffled.includes(randomLetter)) {
// //       shuffled[0] = randomLetter;
// //     }

// //     setTarget(randomLetter);
// //     setOptions(shuffled.sort(() => 0.5 - Math.random()));
// //     speak(`Click the letter ${randomLetter}`);
// //   };

// //   const handleClick = (letter) => {
// //     if (roundCompleted) return;

// //     if (letter === target) {
// //       const newCount = correctCount + 1;
// //       setCorrectCount(newCount);

// //       speak("Great job!");

// //       if (newCount >= 5) {
// //         completeRound(newCount);
// //       } else {
// //         generateQuestion();
// //       }
// //     } else {
// //       speak("Try again");
// //     }
// //   };

// //   /* 🔥 SAVE TO FIRESTORE */
// //   const saveProgressToFirestore = async (score) => {
// //     try {
// //       if (!userEmail) {
// //         console.log("❌ No user logged in");
// //         return;
// //       }

// //       const userRef = doc(db, "users", userEmail);
// //       const userSnap = await getDoc(userRef);

// //       let previousScore = 0;

// //       if (userSnap.exists()) {
// //         previousScore = userSnap.data().score || 0;
// //       }

// //       await setDoc(
// //         userRef,
// //         {
// //           email: userEmail,
// //           score: previousScore + score,
// //           lastGame: "Letter Recognition",
// //           lastPlayed: new Date().toISOString()
// //         },
// //         { merge: true }
// //       );

// //       console.log("✅ Score saved for:", userEmail);

// //     } catch (err) {
// //       console.error("❌ Firestore Error:", err);
// //     }
// //   };

// //   /* 🎉 COMPLETE ROUND */
// //   const completeRound = (finalScore) => {
// //     setRoundCompleted(true);
// //     speak("Amazing! You completed this round!");

// //     // 🔥 Save to Firebase
// //     saveProgressToFirestore(finalScore);

// //     // ✅ Local backup (optional)
// //     const existing = JSON.parse(localStorage.getItem("aiProgress")) || {
// //       roundsCompleted: 0,
// //       rewards: [],
// //     };

// //     existing.roundsCompleted += 1;
// //     existing.rewards.push("⭐ Letter Recognition Star");

// //     localStorage.setItem("aiProgress", JSON.stringify(existing));
// //   };

// //   const nextRound = () => {
// //     setCorrectCount(0);
// //     setRoundCompleted(false);
// //     generateQuestion();
// //   };

// //   return (
// //     <div className="confusing-page">

// //       {/* ❌ BACK ICON REMOVED */}

// //       <div className="confusing-navbar">
// //         <div className="navbar-title">
// //           🔤 Letter Recognition
// //         </div>
// //       </div>

// //       <div className="confusing-content">

// //         {!roundCompleted ? (
// //           <>
// //             <h2 className="instruction">
// //               Click the letter:
// //               <span className="target"> {target}</span>
// //             </h2>

// //             <div className="letters-grid">
// //               {options.map((letter, index) => (
// //                 <div
// //                   key={index}
// //                   className="letter-box"
// //                   onClick={() => handleClick(letter)}
// //                 >
// //                   {letter}
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="score">
// //               ⭐ Correct: {correctCount} / 5
// //             </div>
// //           </>
// //         ) : (
// //           <>
// //             <h2 className="instruction">
// //               🎉 Round Complete!
// //             </h2>

// //             <p>Score saved to leaderboard 🚀</p>

// //             <button className="next-btn" onClick={nextRound}>
// //               Next Round 🔄
// //             </button>
// //           </>
// //         )}

// //       </div>
// //     </div>
// //   );
// // }




// import { useEffect, useState } from "react";
// import { speak } from "../utils/speak";
// import "../styles/ConfusingLetters.css";
// import { db } from "../firebase";
// import {
//   doc,
//   setDoc,
//   getDoc,
//   collection,
//   addDoc,
//   Timestamp
// } from "firebase/firestore";

// export default function LetterRecognition() {

//   const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

//   const [target, setTarget] = useState("");
//   const [options, setOptions] = useState([]);
//   const [correctCount, setCorrectCount] = useState(0);
//   const [roundCompleted, setRoundCompleted] = useState(false);

//   const TOTAL = 5;

//   // ✅ Logged user email from Login page
//   const userEmail = localStorage.getItem("loginEmail");

//   useEffect(() => {
//     generateQuestion();
//   }, []);

//   const generateQuestion = () => {
//     const randomLetter =
//       alphabet[Math.floor(Math.random() * alphabet.length)];

//     const shuffled = [...alphabet]
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 7);

//     if (!shuffled.includes(randomLetter)) {
//       shuffled[0] = randomLetter;
//     }

//     setTarget(randomLetter);
//     setOptions(shuffled.sort(() => 0.5 - Math.random()));

//     speak(`Click the letter ${randomLetter}`);
//   };

//   const handleClick = (letter) => {
//     if (roundCompleted) return;

//     if (letter === target) {

//       const newCount = correctCount + 1;
//       setCorrectCount(newCount);

//       speak("Great job!");

//       if (newCount >= TOTAL) {
//         completeRound(newCount);
//       } else {
//         generateQuestion();
//       }

//     } else {
//       speak("Try again");
//     }
//   };

//   /* SAVE TOTAL SCORE (existing logic — unchanged) */

//   const saveProgressToFirestore = async (score) => {
//     try {

//       if (!userEmail) {
//         console.log("No user logged in");
//         return;
//       }

//       const userRef = doc(db, "users", userEmail);
//       const userSnap = await getDoc(userRef);

//       let previousScore = 0;

//       if (userSnap.exists()) {
//         previousScore = userSnap.data().score || 0;
//       }

//       await setDoc(
//         userRef,
//         {
//           email: userEmail,
//           score: previousScore + score,
//           lastGame: "Letter Recognition",
//           lastPlayed: new Date().toISOString()
//         },
//         { merge: true }
//       );

//       console.log("Score updated");

//     } catch (err) {
//       console.error("Firestore Error:", err);
//     }
//   };

//   /* NEW — SAVE GAME RESULT HISTORY */

//   const saveGameResult = async (finalScore) => {
//     try {

//       if (!userEmail) return;

//       const userRef = doc(db, "users", userEmail);
//       const resultsRef = collection(userRef, "game_results");

//       const accuracy =
//         (finalScore / TOTAL) * 100;

//       await addDoc(resultsRef, {
//         game: "LetterRecognition",
//         score: finalScore,
//         totalQuestions: TOTAL,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now()
//       });

//       console.log("Game history saved");

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   /* COMPLETE ROUND */

//   const completeRound = async (finalScore) => {

//     setRoundCompleted(true);

//     speak(
//       "Amazing! You completed this round!"
//     );

//     // Save both

//     await saveProgressToFirestore(finalScore);

//     await saveGameResult(finalScore);

//     // Local backup (unchanged)

//     const existing =
//       JSON.parse(
//         localStorage.getItem("aiProgress")
//       ) || {
//         roundsCompleted: 0,
//         rewards: [],
//       };

//     existing.roundsCompleted += 1;

//     existing.rewards.push(
//       "⭐ Letter Recognition Star"
//     );

//     localStorage.setItem(
//       "aiProgress",
//       JSON.stringify(existing)
//     );
//   };

//   const nextRound = () => {
//     setCorrectCount(0);
//     setRoundCompleted(false);
//     generateQuestion();
//   };

//   return (
//     <div className="confusing-page">

//       <div className="confusing-navbar">
//         <div className="navbar-title">
//           🔤 Letter Recognition
//         </div>
//       </div>

//       <div className="confusing-content">

//         {!roundCompleted ? (
//           <>
//             <h2 className="instruction">
//               Click the letter:
//               <span className="target">
//                 {" "}
//                 {target}
//               </span>
//             </h2>

//             <div className="letters-grid">
//               {options.map(
//                 (letter, index) => (
//                   <div
//                     key={index}
//                     className="letter-box"
//                     onClick={() =>
//                       handleClick(letter)
//                     }
//                   >
//                     {letter}
//                   </div>
//                 )
//               )}
//             </div>

//             <div className="score">
//               ⭐ Correct: {correctCount} / {TOTAL}
//             </div>
//           </>
//         ) : (
//           <>
//             <h2 className="instruction">
//               🎉 Round Complete!
//             </h2>

//             <p>
//               Score saved to leaderboard 🚀
//             </p>

//             <button
//               className="next-btn"
//               onClick={nextRound}
//             >
//               Next Round 🔄
//             </button>
//           </>
//         )}

//       </div>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { speak } from "../utils/speak";
// import "../styles/ConfusingLetters.css";

// import useGameProgress from "../hooks/useGameProgress";

// const GAME_ID = "letter-recognition";
// const TOTAL = 5;

// const alphabet =
//   "abcdefghijklmnopqrstuvwxyz".split("");

// const INITIAL_STATE = {
//   target: "",
//   options: [],
//   correctCount: 0,
//   roundCompleted: false,
// };

// export default function LetterRecognition() {
//   /* =========================================================
//      FIREBASE GAME PROGRESS
//   ========================================================= */

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(
//     GAME_ID,
//     INITIAL_STATE
//   );

//   /* =========================================================
//      STATES
//   ========================================================= */

//   const [target, setTarget] =
//     useState("");

//   const [options, setOptions] =
//     useState([]);

//   const [correctCount, setCorrectCount] =
//     useState(0);

//   const [roundCompleted, setRoundCompleted] =
//     useState(false);

//   const [restored, setRestored] =
//     useState(false);

//   const [answerLocked, setAnswerLocked] =
//     useState(false);

//   /* =========================================================
//      GENERATE QUESTION
//   ========================================================= */

//   const generateQuestion = () => {
//     const randomLetter =
//       alphabet[
//         Math.floor(
//           Math.random() *
//             alphabet.length
//         )
//       ];

//     const shuffled = [...alphabet]
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 7);

//     /*
//      * Make sure target is always present.
//      */
//     if (
//       !shuffled.includes(
//         randomLetter
//       )
//     ) {
//       shuffled[0] =
//         randomLetter;
//     }

//     const finalOptions =
//       shuffled.sort(
//         () => 0.5 - Math.random()
//       );

//     setTarget(
//       randomLetter
//     );

//     setOptions(
//       finalOptions
//     );

//     speak(
//       `Click the letter ${randomLetter}`
//     );

//     return {
//       target: randomLetter,
//       options: finalOptions,
//     };
//   };

//   /* =========================================================
//      RESTORE FIREBASE PROGRESS
//   ========================================================= */

//   useEffect(() => {
//     if (progressLoading) return;
//     if (restored) return;

//     console.log(
//       "🔥 Letter Recognition saved state:",
//       savedState
//     );

//     if (
//       savedState &&
//       savedState.target &&
//       savedState.options?.length
//     ) {
//       /*
//        * Resume exact question.
//        */
//       setTarget(
//         savedState.target
//       );

//       setOptions(
//         savedState.options
//       );

//       setCorrectCount(
//         savedState.correctCount ?? 0
//       );

//       setRoundCompleted(
//         savedState.roundCompleted ?? false
//       );

//       /*
//        * Only speak if the game
//        * is still active.
//        */
//       if (
//         !savedState.roundCompleted
//       ) {
//         speak(
//           `Click the letter ${savedState.target}`
//         );
//       }
//     } else {
//       /*
//        * First time opening game.
//        */
//       const question =
//         generateQuestion();

//       save({
//         target:
//           question.target,

//         options:
//           question.options,

//         correctCount: 0,

//         roundCompleted: false,
//       });
//     }

//     setRestored(true);
//   }, [
//     progressLoading,
//     savedState,
//     restored,
//   ]);

//   /* =========================================================
//      SAVE CURRENT PROGRESS
//   ========================================================= */

//   const saveCurrentProgress = async (
//     overrides = {}
//   ) => {
//     await save({
//       target,
//       options,
//       correctCount,
//       roundCompleted,
//       ...overrides,
//     });
//   };

//   /* =========================================================
//      HANDLE LETTER CLICK
//   ========================================================= */

//   const handleClick = async (
//     letter
//   ) => {
//     if (roundCompleted) return;
//     if (answerLocked) return;

//     if (!target) return;

//     /* -----------------------------------------
//        WRONG ANSWER
//     ----------------------------------------- */

//     if (letter !== target) {
//       speak("Try again");
//       return;
//     }

//     /* -----------------------------------------
//        CORRECT ANSWER
//     ----------------------------------------- */

//     setAnswerLocked(true);

//     const newCount =
//       correctCount + 1;

//     setCorrectCount(
//       newCount
//     );

//     speak(
//       "Great job!"
//     );

//     /* =======================================================
//        ROUND COMPLETE
//     ======================================================= */

//     if (newCount >= TOTAL) {
//       await completeRound(
//         newCount
//       );

//       return;
//     }

//     /* =======================================================
//        NEXT QUESTION
//     ======================================================= */

//     const nextQuestion =
//       generateQuestion();

//     await save({
//       target:
//         nextQuestion.target,

//       options:
//         nextQuestion.options,

//       correctCount:
//         newCount,

//       roundCompleted: false,
//     });

//     setAnswerLocked(false);
//   };

//   /* =========================================================
//      COMPLETE ROUND
//   ========================================================= */

//   const completeRound = async (
//     finalScore
//   ) => {
//     setRoundCompleted(
//       true
//     );

//     speak(
//       "Amazing! You completed this round!"
//     );

//     const accuracy =
//       (finalScore / TOTAL) *
//       100;

//     console.log(
//       "🏁 Letter Recognition completed:",
//       {
//         score: finalScore,
//         total: TOTAL,
//         accuracy,
//       }
//     );

//     /*
//      * ⭐ Add stars + history
//      */
//     await finish(
//       accuracy,
//       "Letter Recognition"
//     );

//     /*
//      * Save completed state.
//      */
//     await save({
//       target,
//       options,
//       correctCount:
//         finalScore,
//       roundCompleted: true,
//       completed: true,
//     });

//     /*
//      * Unlock after Firebase operations.
//      */
//     setAnswerLocked(false);
//   };

//   /* =========================================================
//      NEXT ROUND
//   ========================================================= */

//   const nextRound = async () => {
//     setCorrectCount(0);
//     setRoundCompleted(false);
//     setAnswerLocked(false);

//     const question =
//       generateQuestion();

//     await save({
//       target:
//         question.target,

//       options:
//         question.options,

//       correctCount: 0,

//       roundCompleted: false,

//       completed: false,
//     });
//   };

//   /* =========================================================
//      LOADING
//   ========================================================= */

//   if (
//     progressLoading ||
//     !restored
//   ) {
//     return (
//       <div className="confusing-page">

//         <div className="confusing-navbar">
//           <div className="navbar-title">
//             🔤 Letter Recognition
//           </div>
//         </div>

//         <div className="confusing-content">
//           <h2 className="instruction">
//             Restoring your progress...
//           </h2>
//         </div>

//       </div>
//     );
//   }

//   /* =========================================================
//      UI
//   ========================================================= */

//   return (
//     <div className="confusing-page">

//       {/* Navbar */}
//       <div className="confusing-navbar">
//         <div className="navbar-title">
//           🔤 Letter Recognition
//         </div>
//       </div>

//       <div className="confusing-content">

//         {!roundCompleted ? (
//           <>
//             {/* Instruction */}
//             <h2 className="instruction">
//               Click the letter:

//               <span className="target">
//                 {" "}
//                 {target}
//               </span>
//             </h2>

//             {/* Letters */}
//             <div className="letters-grid">

//               {options.map(
//                 (
//                   letter,
//                   index
//                 ) => (
//                   <div
//                     key={index}
//                     className="letter-box"
//                     onClick={() =>
//                       handleClick(
//                         letter
//                       )
//                     }
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(
//                       event
//                     ) => {
//                       if (
//                         event.key ===
//                           "Enter" ||
//                         event.key ===
//                           " "
//                       ) {
//                         event.preventDefault();

//                         handleClick(
//                           letter
//                         );
//                       }
//                     }}
//                   >
//                     {letter}
//                   </div>
//                 )
//               )}

//             </div>

//             {/* Score */}
//             <div className="score">
//               ⭐ Correct:{" "}
//               {correctCount} /{" "}
//               {TOTAL}
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Completed */}
//             <h2 className="instruction">
//               🎉 Round Complete!
//             </h2>

//             <p>
//               Score saved to
//               your progress 🚀
//             </p>

//             <p className="score">
//               ⭐ Score:{" "}
//               {correctCount} /{" "}
//               {TOTAL}
//             </p>

//             <button
//               className="next-btn"
//               onClick={
//                 nextRound
//               }
//             >
//               Next Round 🔄
//             </button>
//           </>
//         )}

//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { speak } from "../utils/speak";
import "../styles/LetterRecognition.css";

import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "letter-recognition";
const TOTAL = 5;

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const INITIAL_STATE = {
  target: "",
  options: [],
  correctCount: 0,
  roundCompleted: false,
};

export default function LetterRecognition() {
  /* =========================================================
     FIREBASE GAME PROGRESS
  ========================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  /* =========================================================
     STATES
  ========================================================= */

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);

  /* =========================================================
     GENERATE QUESTION
  ========================================================= */

  const generateQuestion = () => {
    const randomLetter =
      alphabet[Math.floor(Math.random() * alphabet.length)];

    const shuffled = [...alphabet]
      .sort(() => 0.5 - Math.random())
      .slice(0, 7);

    /* Make sure target is always present */
    if (!shuffled.includes(randomLetter)) {
      shuffled[0] = randomLetter;
    }

    const finalOptions = shuffled.sort(() => 0.5 - Math.random());

    setTarget(randomLetter);
    setOptions(finalOptions);

    speak(`Click the letter ${randomLetter}`);

    return {
      target: randomLetter,
      options: finalOptions,
    };
  };

  /* =========================================================
     RESTORE FIREBASE PROGRESS
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Letter Recognition saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.target &&
      savedState.options?.length
    ) {
      /* Resume exact question */

      setTarget(savedState.target);
      setOptions(savedState.options);

      setCorrectCount(savedState.correctCount ?? 0);

      setRoundCompleted(
        savedState.roundCompleted ?? false
      );

      /* Speak only if game is still active */

      if (!savedState.roundCompleted) {
        speak(
          `Click the letter ${savedState.target}`
        );
      }
    } else {
      /* First time opening game */

      const question = generateQuestion();

      save({
        target: question.target,
        options: question.options,
        correctCount: 0,
        roundCompleted: false,
      });
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     SAVE CURRENT PROGRESS
  ========================================================= */

  const saveCurrentProgress = async (
    overrides = {}
  ) => {
    await save({
      target,
      options,
      correctCount,
      roundCompleted,
      ...overrides,
    });
  };

  /* =========================================================
     HANDLE LETTER CLICK
  ========================================================= */

  const handleClick = async (letter) => {
    if (roundCompleted) return;
    if (answerLocked) return;
    if (!target) return;

    /* WRONG ANSWER */

    if (letter !== target) {
      speak("Try again");
      return;
    }

    /* CORRECT ANSWER */

    setAnswerLocked(true);

    const newCount = correctCount + 1;

    setCorrectCount(newCount);

    speak("Great job!");

    /* =======================================================
       ROUND COMPLETE
    ======================================================= */

    if (newCount >= TOTAL) {
      await completeRound(newCount);
      return;
    }

    /* =======================================================
       NEXT QUESTION
    ======================================================= */

    const nextQuestion = generateQuestion();

    await save({
      target: nextQuestion.target,
      options: nextQuestion.options,
      correctCount: newCount,
      roundCompleted: false,
    });

    setAnswerLocked(false);
  };

  /* =========================================================
     COMPLETE ROUND
  ========================================================= */

  const completeRound = async (finalScore) => {
    setRoundCompleted(true);

    speak(
      "Amazing! You completed this round!"
    );

    const accuracy =
      (finalScore / TOTAL) * 100;

    console.log(
      "🏁 Letter Recognition completed:",
      {
        score: finalScore,
        total: TOTAL,
        accuracy,
      }
    );

    /* Add stars + history */

    await finish(
      accuracy,
      "Letter Recognition"
    );

    /* Save completed state */

    await save({
      target,
      options,
      correctCount: finalScore,
      roundCompleted: true,
      completed: true,
    });

    /* Unlock after Firebase operations */

    setAnswerLocked(false);
  };

  /* =========================================================
     NEXT ROUND
  ========================================================= */

  const nextRound = async () => {
    setCorrectCount(0);
    setRoundCompleted(false);
    setAnswerLocked(false);

    const question = generateQuestion();

    await save({
      target: question.target,
      options: question.options,
      correctCount: 0,
      roundCompleted: false,
      completed: false,
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (progressLoading || !restored) {
    return (
      <div className="letter-recognition-page">
        <div className="lr-navbar">
          <div className="lr-brand">
            <span className="lr-brand-icon">
              🌴
            </span>

            <div>
              <strong>CurioKids</strong>
              <small>Jungle Practice</small>
            </div>
          </div>

          <div className="lr-navbar-title">
            🔤 Letter Recognition
          </div>
        </div>

        <main className="lr-main">
          <div className="lr-loading-card">
            <div className="lr-loading-icon">
              🌿
            </div>

            <h2>Restoring your progress...</h2>

            <p>
              Get ready for your jungle
              learning adventure!
            </p>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="letter-recognition-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="lr-navbar">

        <div className="lr-brand">
          <span className="lr-brand-icon">
            🌴
          </span>

          <div>
            <strong>CurioKids</strong>
            <small>Jungle Practice</small>
          </div>
        </div>

        <div className="lr-navbar-title">
          <span>🔤</span>
          Letter Recognition
        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="lr-main">

        {/* PAGE INTRO */}

        <section className="lr-heading">

          <span className="lr-kicker">
            CURIOKIDS • JUNGLE PRACTICE
          </span>

          <h1>
            Find the Letter 🔤
          </h1>

          <p>
            Look carefully and choose the
            letter you hear.
          </p>

        </section>

        {/* ===================================================
            GAME CARD
        =================================================== */}

        <section className="lr-game-card">

          {/* Decorative leaves */}

          <span className="lr-leaf lr-leaf-one">
            🍃
          </span>

          <span className="lr-leaf lr-leaf-two">
            🌿
          </span>

          {/* GAME HEADER */}

          <div className="lr-game-header">

            <div>
              <span className="lr-game-label">
                LETTER RECOGNITION
              </span>

              <h2>
                Which letter is it?
              </h2>
            </div>

            <div className="lr-progress">
              <strong>
                {correctCount}
              </strong>

              <span>
                / {TOTAL}
              </span>

              <small>
                Correct
              </small>
            </div>

          </div>

          {!roundCompleted ? (
            <>
              {/* ===========================================
                  INSTRUCTION
              =========================================== */}

              <div className="lr-instruction">

                <span className="lr-instruction-icon">
                  👀
                </span>

                <div>
                  <span>
                    LOOK CAREFULLY
                  </span>

                  <strong>
                    Click the letter:
                  </strong>
                </div>

                <div className="lr-target-letter">
                  {target.toUpperCase()}
                </div>

              </div>

              {/* ===========================================
                  OPTIONS
              =========================================== */}

              <div className="lr-options">

                {options.map(
                  (letter, index) => (
                    <button
                      key={index}
                      type="button"
                      className="lr-letter-button"
                      onClick={() =>
                        handleClick(letter)
                      }
                      disabled={answerLocked}
                    >
                      {letter.toUpperCase()}
                    </button>
                  )
                )}

              </div>

              {/* ===========================================
                  SCORE
              =========================================== */}

              <div className="lr-score">

                <span>
                  ⭐
                </span>

                <strong>
                  Correct:
                </strong>

                <b>
                  {correctCount}
                </b>

                <span>
                  / {TOTAL}
                </span>

              </div>

              <p className="lr-helper">
                Take your time — you can do it! 🌿
              </p>

            </>
          ) : (
            /* =============================================
               ROUND COMPLETE
            ============================================= */

            <div className="lr-complete">

              <div className="lr-complete-icon">
                🎉
              </div>

              <span className="lr-complete-kicker">
                JUNGLE ADVENTURE COMPLETE
              </span>

              <h2>
                Amazing Work!
              </h2>

              <p>
                You completed this round and
                your score has been saved to
                your progress.
              </p>

              <div className="lr-final-score">

                <span>
                  ⭐
                </span>

                <strong>
                  {correctCount}
                </strong>

                <small>
                  / {TOTAL} Correct
                </small>

              </div>

              <button
                type="button"
                className="lr-next-round"
                onClick={nextRound}
              >
                Next Round
                <span>→</span>
              </button>

            </div>
          )}

        </section>

      </main>

      {/* Floating helper */}

      <div className="lr-floating-helper">
        🤖
      </div>

    </div>
  );
}