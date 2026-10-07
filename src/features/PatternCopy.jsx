// import { useState, useEffect } from "react";
// import "../styles/PatternCopy.css";

// const COLORS = ["🔴", "🔵", "🟢", "🟡"];

// export default function PatternCopy({ goBack }) {
//   const [pattern, setPattern] = useState([]);
//   const [userInput, setUserInput] = useState([]);
//   const [showPattern, setShowPattern] = useState(true);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     generatePattern();
//   }, []);

//   const generatePattern = () => {
//     const newPattern = Array.from({ length: 3 }, () =>
//       COLORS[Math.floor(Math.random() * COLORS.length)]
//     );
//     setPattern(newPattern);
//     setUserInput([]);
//     setShowPattern(true);
//     setMessage("");

//     setTimeout(() => setShowPattern(false), 2000);
//   };

//   const handleClick = (color) => {
//     if (showPattern) return;

//     const newInput = [...userInput, color];
//     setUserInput(newInput);

//     if (newInput.length === pattern.length) {
//       if (JSON.stringify(newInput) === JSON.stringify(pattern)) {
//         setMessage("Great job! 🌟");
//       } else {
//         setMessage("Try again 💛");
//       }
//     }
//   };

//   return (
//     <div className="pattern-page">

//       {/* Header */}
//       <div className="pattern-header">
//         <button className="back-btn" onClick={goBack}>⬅</button>
//         <h1>Pattern Copy Game</h1>
//       </div>

//       {/* Instruction */}
//       <p className="pattern-text">
//         {showPattern ? "Remember the pattern" : "Repeat the pattern"}
//       </p>

//       {/* Pattern Display */}
//       <div className="pattern-box">
//         {showPattern
//           ? pattern.map((c, i) => <span key={i}>{c}</span>)
//           : userInput.map((c, i) => <span key={i}>{c}</span>)
//         }
//       </div>

//       {/* Choices */}
//       <div className="color-options">
//         {COLORS.map((c, i) => (
//           <div
//             key={i}
//             className="color-btn"
//             onClick={() => handleClick(c)}
//           >
//             {c}
//           </div>
//         ))}
//       </div>

//       {/* Feedback */}
//       <h2 className="feedback">{message}</h2>

//       {/* Next */}
//       {message && (
//         <button className="next-btn" onClick={generatePattern}>
//           Next →
//         </button>
//       )}
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import "../styles/PatternCopy.css";
import useGameProgress from "../hooks/useGameProgress";

const COLORS = ["🔴", "🔵", "🟢", "🟡"];

const GAME_ID = "pattern-copy";

const INITIAL_STATE = {
  pattern: [],
  userInput: [],
  showPattern: true,
  message: "",
};

export default function PatternCopy({ goBack }) {
  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [showPattern, setShowPattern] = useState(true);
  const [message, setMessage] = useState("");

  const [restored, setRestored] = useState(false);
  const [timer, setTimer] = useState(null);

  // =========================================================
  // 🔥 RESTORE SAVED GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Pattern Copy saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.pattern?.length
    ) {
      setPattern(savedState.pattern);
      setUserInput(
        savedState.userInput || []
      );
      setShowPattern(
        savedState.showPattern ?? true
      );
      setMessage(
        savedState.message || ""
      );

      setRestored(true);

      /*
       * If the saved game was still showing
       * the pattern, continue the timer.
       */
      if (savedState.showPattern) {
        const timeout = setTimeout(() => {
          setShowPattern(false);

          save({
            pattern: savedState.pattern,
            userInput:
              savedState.userInput || [],
            showPattern: false,
            message:
              savedState.message || "",
          });
        }, 2000);

        setTimer(timeout);
      }

      return;
    }

    // No saved game → start a new pattern
    setRestored(true);
    generatePattern();

    return;
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // 🧹 CLEANUP TIMER
  // =========================================================

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  // =========================================================
  // 🎲 GENERATE PATTERN
  // =========================================================

  const generatePattern = async () => {
    const newPattern = Array.from(
      { length: 3 },
      () =>
        COLORS[
          Math.floor(
            Math.random() * COLORS.length
          )
        ]
    );

    setPattern(newPattern);
    setUserInput([]);
    setShowPattern(true);
    setMessage("");

    // 💾 Save newly generated pattern
    await save({
      pattern: newPattern,
      userInput: [],
      showPattern: true,
      message: "",
    });

    const timeout = setTimeout(async () => {
      setShowPattern(false);

      await save({
        pattern: newPattern,
        userInput: [],
        showPattern: false,
        message: "",
      });
    }, 2000);

    setTimer(timeout);
  };

  // =========================================================
  // 🎯 COLOR CLICK
  // =========================================================

  const handleClick = async (color) => {
    if (showPattern) return;

    /*
     * Don't allow more clicks after
     * the answer has already been completed.
     */
    if (userInput.length >= pattern.length) {
      return;
    }

    const newInput = [
      ...userInput,
      color,
    ];

    setUserInput(newInput);

    // =======================================================
    // 💾 SAVE PARTIAL ANSWER
    // =======================================================

    if (newInput.length < pattern.length) {
      await save({
        pattern,
        userInput: newInput,
        showPattern: false,
        message: "",
      });

      return;
    }

    // =======================================================
    // 🏆 CHECK ANSWER
    // =======================================================

    const isCorrect =
      JSON.stringify(newInput) ===
      JSON.stringify(pattern);

    const newMessage = isCorrect
      ? "Great job! 🌟"
      : "Try again 💛";

    setMessage(newMessage);

    // 💾 Save completed attempt
    await save({
      pattern,
      userInput: newInput,
      showPattern: false,
      message: newMessage,
    });
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (progressLoading || !restored) {
    return (
      <div className="pattern-page">
        <div className="pattern-header">
          <button
            className="back-btn"
            onClick={goBack}
          >
            ⬅
          </button>

          <h1>Pattern Copy Game</h1>
        </div>

        <p className="pattern-text">
          Loading your game... 🌱
        </p>
      </div>
    );
  }

  // =========================================================
  // 🎮 UI
  // =========================================================

  return (
    <div className="pattern-page">

      {/* Header */}
      <div className="pattern-header">

        {/* <button
          className="back-btn"
          onClick={goBack}
        >
          ⬅
        </button> */}

        <h1>
          Pattern Copy Game
        </h1>

      </div>

      {/* Instruction */}
      <p className="pattern-text">
        {showPattern
          ? "Remember the pattern"
          : "Repeat the pattern"}
      </p>

      {/* Pattern Display */}
      <div className="pattern-box">

        {showPattern
          ? pattern.map((color, i) => (
              <span key={i}>
                {color}
              </span>
            ))
          : userInput.map((color, i) => (
              <span key={i}>
                {color}
              </span>
            ))}

      </div>

      {/* Choices */}
      <div className="color-options">

        {COLORS.map((color, i) => (
          <div
            key={i}
            className="color-btn"
            onClick={() =>
              handleClick(color)
            }
          >
            {color}
          </div>
        ))}

      </div>

      {/* Feedback */}
      <h2 className="feedback">
        {message}
      </h2>

      {/* Next */}
      {message && (
        <button
          className="next-btn"
          onClick={generatePattern}
        >
          Next →
        </button>
      )}

    </div>
  );
}