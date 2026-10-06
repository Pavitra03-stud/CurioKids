// // import { useState } from "react";
// // import BackIcon from "../components/BackIcon";
// // import { speak } from "../utils/speak";
// // import "../styles/compareSafari.css";

// // function generateQuestion() {
// //   const left = Math.floor(Math.random() * 6) + 1;
// //   const right = Math.floor(Math.random() * 6) + 1;
// //   return { left, right };
// // }

// // export default function CompareSafari({ goBack }) {
// //   const TOTAL_ROUNDS = 5;

// //   const [question, setQuestion] = useState(generateQuestion());
// //   const [round, setRound] = useState(1);
// //   const [score, setScore] = useState(0);
// //   const [message, setMessage] = useState("");
// //   const [gameOver, setGameOver] = useState(false);
// //   const [selected, setSelected] = useState(null);
// //   const [correctSide, setCorrectSide] = useState(null);

// //   const nextRound = () => {
// //     if (round >= TOTAL_ROUNDS) {
// //       setGameOver(true);
// //       return;
// //     }

// //     setQuestion(generateQuestion());
// //     setRound(prev => prev + 1);
// //     setMessage("");
// //     setSelected(null);
// //     setCorrectSide(null);
// //   };

// //   const handleChoice = (side) => {
// //     const { left, right } = question;

// //     let correct = "equal";
// //     if (left > right) correct = "left";
// //     if (right > left) correct = "right";

// //     setSelected(side);
// //     setCorrectSide(correct);

// //     if (side === correct) {
// //       speak("Great job");
// //       setScore(prev => prev + 1);
// //       setMessage("Correct! 🌟");
// //     } else {
// //       speak("Nice try");
// //       setMessage("Try again next round 🌿");
// //     }

// //     setTimeout(nextRound, 1200);
// //   };

// //   const restartGame = () => {
// //     setQuestion(generateQuestion());
// //     setRound(1);
// //     setScore(0);
// //     setGameOver(false);
// //     setMessage("");
// //     setSelected(null);
// //     setCorrectSide(null);
// //   };

// //   if (gameOver) {
// //     return (
// //       <div className="safari-page">
// //         <div className="finish-title">🦓 Safari Complete!</div>
// //         <div className="score-text">
// //           You scored {score} / {TOTAL_ROUNDS}
// //         </div>

// //         <button className="play-btn" onClick={restartGame}>
// //           Play Again
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="safari-page">

// //       <div className="practice-navbar">
// //         <div className="navbar-left">
// //           <BackIcon goBack={goBack} />
// //         </div>
// //         <div className="navbar-title">🦓 Compare Safari</div>
// //       </div>

// //       <div className="progress-container">
// //         <div
// //           className="progress-bar"
// //           style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
// //         />
// //       </div>

// //       <h2 className="question-text">
// //         Tap the jungle with more trees 🌴
// //       </h2>

// //       <div className="jungle-container">

// //         {/* LEFT */}
// //         <div
// //           className={`jungle-box 
// //             ${selected === "left" && correctSide === "left" ? "correct" : ""}
// //             ${selected === "left" && correctSide !== "left" ? "wrong" : ""}
// //           `}
// //           onClick={() => handleChoice("left")}
// //         >
// //           {Array.from({ length: question.left }).map((_, i) => (
// //             <span key={i} className="tree">🌴</span>
// //           ))}
// //         </div>

// //         {/* EQUAL OPTION */}
// //         {question.left === question.right && (
// //           <div
// //             className={`equal-box 
// //               ${selected === "equal" ? "correct" : ""}
// //             `}
// //             onClick={() => handleChoice("equal")}
// //           >
// //             Equal
// //           </div>
// //         )}

// //         {/* RIGHT */}
// //         <div
// //           className={`jungle-box 
// //             ${selected === "right" && correctSide === "right" ? "correct" : ""}
// //             ${selected === "right" && correctSide !== "right" ? "wrong" : ""}
// //           `}
// //           onClick={() => handleChoice("right")}
// //         >
// //           {Array.from({ length: question.right }).map((_, i) => (
// //             <span key={i} className="tree">🌴</span>
// //           ))}
// //         </div>

// //       </div>

// //       <p className="result-text">{message}</p>

// //       <div className="round-text">
// //         Round {round} of {TOTAL_ROUNDS}
// //       </div>

// //     </div>
// //   );
// // }





// import { useState } from "react";
// import BackIcon from "../components/BackIcon";
// import { speak } from "../utils/speak";
// import "../styles/compareSafari.css";

// // ✅ GameContext
// import { useGame } from "../context/GameContext";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";

// function generateQuestion() {
//   const left = Math.floor(Math.random() * 6) + 1;
//   const right = Math.floor(Math.random() * 6) + 1;
//   return { left, right };
// }

// export default function CompareSafari({ goBack }) {
//   const { addStars } = useGame(); // ✅ ADDED

//   const TOTAL_ROUNDS = 5;

//   const [question, setQuestion] = useState(generateQuestion());
//   const [round, setRound] = useState(1);
//   const [score, setScore] = useState(0);
//   const [message, setMessage] = useState("");
//   const [gameOver, setGameOver] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [correctSide, setCorrectSide] = useState(null);

//   // ✅ ACTIVITY LOGGER
//   const logActivity = async (finalScore) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     await addDoc(collection(db, "activity"), {
//       userId,
//       action: "play",
//       module: "math",
//       screen: "compare-safari",
//       score: finalScore,
//       timestamp: new Date(),
//     });
//   };

//   const nextRound = async () => {
//     if (round >= TOTAL_ROUNDS) {
//       setGameOver(true);

//       const finalPercentage = (score / TOTAL_ROUNDS) * 100;

//       // ✅ SAVE PROGRESS
//       await addStars(finalPercentage, "Compare Safari");

//       // ✅ LOG ACTIVITY
//       await logActivity(finalPercentage);

//       return;
//     }

//     setQuestion(generateQuestion());
//     setRound(prev => prev + 1);
//     setMessage("");
//     setSelected(null);
//     setCorrectSide(null);
//   };

//   const handleChoice = (side) => {
//     const { left, right } = question;

//     let correct = "equal";
//     if (left > right) correct = "left";
//     if (right > left) correct = "right";

//     setSelected(side);
//     setCorrectSide(correct);

//     if (side === correct) {
//       speak("Great job");
//       setScore(prev => prev + 1);
//       setMessage("Correct! 🌟");
//     } else {
//       speak("Nice try");
//       setMessage("Try again next round 🌿");
//     }

//     setTimeout(nextRound, 1200);
//   };

//   const restartGame = () => {
//     setQuestion(generateQuestion());
//     setRound(1);
//     setScore(0);
//     setGameOver(false);
//     setMessage("");
//     setSelected(null);
//     setCorrectSide(null);
//   };

//   if (gameOver) {
//     return (
//       <div className="safari-page">
//         <div className="finish-title">🦓 Safari Complete!</div>
//         <div className="score-text">
//           You scored {score} / {TOTAL_ROUNDS}
//         </div>

//         <button className="play-btn" onClick={restartGame}>
//           Play Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="safari-page">

//       <div className="practice-navbar">
//         <div className="navbar-left">
//           <BackIcon goBack={goBack} />
//         </div>
//         <div className="navbar-title">🦓 Compare Safari</div>
//       </div>

//       <div className="progress-container">
//         <div
//           className="progress-bar"
//           style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
//         />
//       </div>

//       <h2 className="question-text">
//         Tap the jungle with more trees 🌴
//       </h2>

//       <div className="jungle-container">

//         {/* LEFT */}
//         <div
//           className={`jungle-box 
//             ${selected === "left" && correctSide === "left" ? "correct" : ""}
//             ${selected === "left" && correctSide !== "left" ? "wrong" : ""}
//           `}
//           onClick={() => handleChoice("left")}
//         >
//           {Array.from({ length: question.left }).map((_, i) => (
//             <span key={i} className="tree">🌴</span>
//           ))}
//         </div>

//         {/* EQUAL */}
//         {question.left === question.right && (
//           <div
//             className={`equal-box 
//               ${selected === "equal" ? "correct" : ""}
//             `}
//             onClick={() => handleChoice("equal")}
//           >
//             Equal
//           </div>
//         )}

//         {/* RIGHT */}
//         <div
//           className={`jungle-box 
//             ${selected === "right" && correctSide === "right" ? "correct" : ""}
//             ${selected === "right" && correctSide !== "right" ? "wrong" : ""}
//           `}
//           onClick={() => handleChoice("right")}
//         >
//           {Array.from({ length: question.right }).map((_, i) => (
//             <span key={i} className="tree">🌴</span>
//           ))}
//         </div>

//       </div>

//       <p className="result-text">{message}</p>

//       <div className="round-text">
//         Round {round} of {TOTAL_ROUNDS}
//       </div>

//     </div>
//   );
// }



import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";
import "../styles/compareSafari.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// 🎮 Game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "compare-safari";
const TOTAL_ROUNDS = 5;

function generateQuestion() {
  const left =
    Math.floor(Math.random() * 6) + 1;

  const right =
    Math.floor(Math.random() * 6) + 1;

  return {
    left,
    right,
  };
}

export default function CompareSafari({
  goBack,
}) {

  // =========================================================
  // 🎮 GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =========================================================
  // 🎯 STATE
  // =========================================================

  const [question, setQuestion] =
    useState(null);

  const [round, setRound] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [gameOver, setGameOver] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const [correctSide, setCorrectSide] =
    useState(null);

  const [gameReady, setGameReady] =
    useState(false);

  // Prevent multiple clicks while waiting
  const [answerLocked, setAnswerLocked] =
    useState(false);

  // =========================================================
  // 🔄 LOAD / RESUME GAME
  // =========================================================

  useEffect(() => {

    if (progressLoading) {
      console.log(
        "⏳ Waiting for Compare Safari Firebase progress..."
      );
      return;
    }

    const loadGame = async () => {

      console.log(
        "🎮 Compare Safari saved state:",
        savedState
      );

      // =====================================================
      // 🔄 RESUME
      // =====================================================

      if (
        savedState &&
        savedState.question &&
        typeof savedState.round ===
          "number"
      ) {

        console.log(
          "🔄 RESUMING COMPARE SAFARI:",
          savedState
        );

        setQuestion(
          savedState.question
        );

        setRound(
          savedState.round
        );

        setScore(
          Number(savedState.score) || 0
        );

        setMessage(
          savedState.message || ""
        );

        setSelected(
          savedState.selected || null
        );

        setCorrectSide(
          savedState.correctSide ||
            null
        );

        setGameOver(
          savedState.gameOver === true
        );

        setGameReady(true);

        return;
      }

      // =====================================================
      // 🆕 NEW GAME
      // =====================================================

      const newQuestion =
        generateQuestion();

      console.log(
        "🆕 Starting new Compare Safari"
      );

      setQuestion(
        newQuestion
      );

      setRound(1);
      setScore(0);
      setMessage("");
      setSelected(null);
      setCorrectSide(null);
      setGameOver(false);

      await save({
        question:
          newQuestion,

        round: 1,

        score: 0,

        message: "",

        selected: null,

        correctSide: null,

        gameOver: false,
      });

      setGameReady(true);
    };

    loadGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoading]);

  // =========================================================
  // 📊 ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {

    const userId =
      localStorage.getItem(
        "userId"
      );

    if (!userId) return;

    try {

      await addDoc(
        collection(
          db,
          "activity"
        ),
        {
          userId,

          action: "play",

          module: "math",

          screen:
            "compare-safari",

          score:
            finalScore,

          timestamp:
            new Date(),
        }
      );

      console.log(
        "📊 Compare Safari activity saved"
      );

    } catch (error) {

      console.error(
        "❌ Activity error:",
        error
      );
    }
  };

  // =========================================================
  // ☁️ SAVE DETAILED RESULT
  // =========================================================

  const saveGameResult = async (
    finalScore,
    finalPercentage
  ) => {

    const userId =
      localStorage.getItem(
        "userId"
      );

    if (!userId) return;

    try {

      const resultsRef =
        collection(
          db,
          "users",
          userId,
          "game_results"
        );

      await addDoc(
        resultsRef,
        {
          game:
            "CompareSafari",

          score:
            finalScore,

          totalQuestions:
            TOTAL_ROUNDS,

          accuracy:
            finalPercentage,

          createdAt:
            Timestamp.now(),
        }
      );

      console.log(
        "☁️ Compare Safari result saved"
      );

    } catch (error) {

      console.error(
        "❌ Result save error:",
        error
      );
    }
  };

  // =========================================================
  // ➡️ NEXT ROUND
  // =========================================================

  const nextRound = async (
    updatedScore
  ) => {

    // =====================================================
    // 🏆 GAME COMPLETE
    // =====================================================

    if (
      round >= TOTAL_ROUNDS
    ) {

      const finalPercentage =
        (
          updatedScore /
          TOTAL_ROUNDS
        ) * 100;

      console.log(
        "🏆 Compare Safari completed:",
        updatedScore,
        "/",
        TOTAL_ROUNDS
      );

      // ⭐ STARS + HISTORY
      // 🧹 CLEAR ACTIVE GAME
      await finish(
        finalPercentage,
        "Compare Safari"
      );

      // 📊 ACTIVITY
      await logActivity(
        finalPercentage
      );

      // ☁️ RESULT
      await saveGameResult(
        updatedScore,
        finalPercentage
      );

      setScore(
        updatedScore
      );

      setGameOver(true);

      setAnswerLocked(false);

      return;
    }

    // =====================================================
    // ➡️ CONTINUE
    // =====================================================

    const newQuestion =
      generateQuestion();

    const nextRoundNumber =
      round + 1;

    setQuestion(
      newQuestion
    );

    setRound(
      nextRoundNumber
    );

    setScore(
      updatedScore
    );

    setMessage("");

    setSelected(null);

    setCorrectSide(null);

    setAnswerLocked(false);

    // 💾 SAVE EXACT NEXT QUESTION
    await save({

      question:
        newQuestion,

      round:
        nextRoundNumber,

      score:
        updatedScore,

      message: "",

      selected: null,

      correctSide: null,

      gameOver: false,
    });

    console.log(
      "💾 Compare Safari progress saved:",
      {
        round:
          nextRoundNumber,

        score:
          updatedScore,

        question:
          newQuestion,
      }
    );
  };

  // =========================================================
  // 🎯 HANDLE CHOICE
  // =========================================================

  const handleChoice = (
    side
  ) => {

    if (
      answerLocked ||
      !question
    ) {
      return;
    }

    setAnswerLocked(true);

    const {
      left,
      right,
    } = question;

    let correct =
      "equal";

    if (
      left > right
    ) {
      correct =
        "left";
    }

    if (
      right > left
    ) {
      correct =
        "right";
    }

    const isCorrect =
      side === correct;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    setSelected(
      side
    );

    setCorrectSide(
      correct
    );

    if (isCorrect) {

      speak(
        "Great job"
      );

      setScore(
        updatedScore
      );

      setMessage(
        "Correct! 🌟"
      );

    } else {

      speak(
        "Nice try"
      );

      setMessage(
        "Try again next round 🌿"
      );
    }

    // =======================================================
    // SAVE ANSWER STATE
    // =======================================================

    save({

      question,

      round,

      score:
        updatedScore,

      message:
        isCorrect
          ? "Correct! 🌟"
          : "Try again next round 🌿",

      selected:
        side,

      correctSide:
        correct,

      gameOver: false,
    });

    // =======================================================
    // MOVE AFTER FEEDBACK
    // =======================================================

    setTimeout(() => {

      nextRound(
        updatedScore
      );

    }, 1200);
  };

  // =========================================================
  // 🔄 RESTART
  // =========================================================

  const restartGame =
    async () => {

      const newQuestion =
        generateQuestion();

      setQuestion(
        newQuestion
      );

      setRound(1);

      setScore(0);

      setGameOver(false);

      setMessage("");

      setSelected(null);

      setCorrectSide(null);

      setAnswerLocked(false);

      // 💾 SAVE NEW GAME
      await save({

        question:
          newQuestion,

        round: 1,

        score: 0,

        message: "",

        selected: null,

        correctSide: null,

        gameOver: false,
      });

      console.log(
        "🔄 Compare Safari restarted"
      );
    };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (
    progressLoading ||
    !gameReady ||
    !question
  ) {

    return (
      <div className="safari-page">

        <div className="finish-title">
          🦓 Compare Safari
        </div>

        <div className="score-text">
          ⏳ Loading your saved game...
        </div>

      </div>
    );
  }

  // =========================================================
  // 🏆 GAME OVER
  // =========================================================

  if (gameOver) {

    return (
      <div className="safari-page">

        <div className="finish-title">
          🦓 Safari Complete!
        </div>

        <div className="score-text">
          You scored{" "}
          {score} /{" "}
          {TOTAL_ROUNDS}
        </div>

        <button
          className="play-btn"
          onClick={
            restartGame
          }
        >
          Play Again
        </button>

      </div>
    );
  }

  // =========================================================
  // 🎨 GAME UI
  // =========================================================

  return (
    <div className="safari-page">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <div className="practice-navbar">

        <div className="navbar-left">

          <BackIcon
            goBack={
              goBack
            }
          />

        </div>

        <div className="navbar-title">
          🦓 Compare Safari
        </div>

      </div>

      {/* ===================================================
          PROGRESS
      =================================================== */}

      <div className="progress-container">

        <div
          className="progress-bar"
          style={{
            width:
              `${
                (round /
                  TOTAL_ROUNDS) *
                100
              }%`,
          }}
        />

      </div>

      {/* ===================================================
          QUESTION
      =================================================== */}

      <h2 className="question-text">

        Tap the jungle with more
        trees 🌴

      </h2>

      {/* ===================================================
          JUNGLE OPTIONS
      =================================================== */}

      <div className="jungle-container">

        {/* LEFT */}

        <div
          className={`jungle-box
            ${
              selected ===
                "left" &&
              correctSide ===
                "left"
                ? "correct"
                : ""
            }
            ${
              selected ===
                "left" &&
              correctSide !==
                "left"
                ? "wrong"
                : ""
            }
          `}
          onClick={() =>
            handleChoice(
              "left"
            )
          }
        >

          {Array.from(
            {
              length:
                question.left,
            }
          ).map(
            (_, i) => (

              <span
                key={i}
                className="tree"
              >
                🌴
              </span>

            )
          )}

        </div>

        {/* EQUAL OPTION */}

        {question.left ===
          question.right && (

          <div
            className={`equal-box
              ${
                selected ===
                "equal"
                  ? "correct"
                  : ""
              }
            `}
            onClick={() =>
              handleChoice(
                "equal"
              )
            }
          >
            Equal
          </div>

        )}

        {/* RIGHT */}

        <div
          className={`jungle-box
            ${
              selected ===
                "right" &&
              correctSide ===
                "right"
                ? "correct"
                : ""
            }
            ${
              selected ===
                "right" &&
              correctSide !==
                "right"
                ? "wrong"
                : ""
            }
          `}
          onClick={() =>
            handleChoice(
              "right"
            )
          }
        >

          {Array.from(
            {
              length:
                question.right,
            }
          ).map(
            (_, i) => (

              <span
                key={i}
                className="tree"
              >
                🌴
              </span>

            )
          )}

        </div>

      </div>

      {/* ===================================================
          MESSAGE
      =================================================== */}

      <p className="result-text">
        {message}
      </p>

      {/* ===================================================
          ROUND
      =================================================== */}

      <div className="round-text">

        Round{" "}
        {round}
        {" "}
        of{" "}
        {TOTAL_ROUNDS}

      </div>

    </div>
  );
}