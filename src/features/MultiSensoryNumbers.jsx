// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import "../styles/MultiSensoryNumbers.css";

// const levels = {
//   1: { label: "Level 1", min: 1, max: 10 },
//   2: { label: "Level 2", min: 1, max: 50 },
//   3: { label: "Level 3", min: 1, max: 100 },
// };

// function getWord(n) {
//   const words = {
//     1: "One",
//     2: "Two",
//     3: "Three",
//     4: "Four",
//     5: "Five",
//     6: "Six",
//     7: "Seven",
//     8: "Eight",
//     9: "Nine",
//     10: "Ten",
//   };
//   return words[n] || `${n}`;
// }

// function getEmoji(n) {
//   const arr = ["🍎", "⭐", "🦆", "🚗", "🎈", "🐠", "🌈", "🧸", "🌸", "⚽"];
//   return arr[(n - 1) % arr.length];
// }

// export default function MultiSensoryNumbers({ goBack }) {
//   const navigate = useNavigate();

//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [current, setCurrent] = useState(1);
//   const [visibleCount, setVisibleCount] = useState(0);
//   const [message, setMessage] = useState("Let’s learn slowly 😊");

//   const currentLevel = selectedLevel ? levels[selectedLevel] : null;

//   useEffect(() => {
//     if (selectedLevel) {
//       setCurrent(levels[selectedLevel].min);
//     }
//   }, [selectedLevel]);

//   useEffect(() => {
//     if (selectedLevel) {
//       startTeaching();
//     }
//   }, [current, selectedLevel]);

//   const speakText = (text) => {
//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.75;
//       utterance.pitch = 1;
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const startTeaching = () => {
//     setVisibleCount(0);
//     setMessage(`This is number ${current}`);

//     speakText(`This is number ${current}. ${getWord(current)}.`);

//     let count = 0;
//     const maxShow = Math.min(current, 10);

//     const interval = setInterval(() => {
//       count += 1;
//       setVisibleCount(count);

//       if (count >= maxShow) {
//         clearInterval(interval);
//         setTimeout(() => {
//           speakText(`Number ${current}. ${getWord(current)}.`);
//           setMessage(`We learned number ${current} 🌟`);
//         }, 500);
//       }
//     }, 500);
//   };

//   const nextNumber = () => {
//     if (!currentLevel) return;
//     setCurrent((prev) => (prev < currentLevel.max ? prev + 1 : currentLevel.min));
//   };

//   const prevNumber = () => {
//     if (!currentLevel) return;
//     setCurrent((prev) => (prev > currentLevel.min ? prev - 1 : currentLevel.max));
//   };

//   if (!selectedLevel) {
//     return (
//       <div className="ms-home-page">
//         <header className="ms-home-header">
//           <BackIcon goBack={goBack ? goBack : () => navigate(-1)} />
//           <h1>👀👂✋ Multi-Sensory Numbers</h1>
//         </header>

//         <div className="ms-home-content">
//           <div className="ms-home-center-card">
//             <div className="ms-home-icon">🔢</div>
//             <h2>Choose a Level</h2>
//             <p>Start learning numbers step by step</p>

//             <div className="ms-home-level-grid">
//               <div
//                 className="ms-home-level-card"
//                 onClick={() => setSelectedLevel(1)}
//               >
//                 <div className="ms-home-level-title">Level 1</div>
//                 <div className="ms-home-level-subtitle">Learn 1 to 10</div>
//               </div>

//               <div
//                 className="ms-home-level-card"
//                 onClick={() => setSelectedLevel(2)}
//               >
//                 <div className="ms-home-level-title">Level 2</div>
//                 <div className="ms-home-level-subtitle">Learn 1 to 50</div>
//               </div>

//               <div
//                 className="ms-home-level-card"
//                 onClick={() => setSelectedLevel(3)}
//               >
//                 <div className="ms-home-level-title">Level 3</div>
//                 <div className="ms-home-level-subtitle">Learn 1 to 100</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="ms-level-page">
//       <header className="ms-level-header">
//         <BackIcon goBack={() => setSelectedLevel(null)} />
//         <h1>👀👂✋ {currentLevel.label}</h1>
//       </header>

//       <div className="ms-level-content">
//         <div className="ms-level-top-row">
//           <div className="ms-level-big-card">
//             <div className="ms-level-badge">{currentLevel.label}</div>
//             <div className="ms-level-number">{current}</div>
//             <div className="ms-level-emoji">{getEmoji(current)}</div>
//             <div className="ms-level-word">{getWord(current)}</div>
//             <div className="ms-level-desc">See • Hear • Count • Learn</div>
//           </div>

//           <div className="ms-level-panel">
//             <div className="ms-level-panel-title">
//               Let’s learn number {current}
//             </div>

//             <div className="ms-level-objects-row">
//               {Array.from({ length: visibleCount }).map((_, index) => (
//                 <div key={index} className="ms-level-object-card">
//                   {getEmoji(current)}
//                 </div>
//               ))}
//             </div>

//             <div className="ms-level-example">
//               Example: {current} objects
//             </div>
//           </div>
//         </div>

//         <div className="ms-level-message">{message}</div>

//         <div className="ms-level-actions">
//           <button className="ms-level-btn prev" onClick={prevNumber}>
//             ← Previous
//           </button>
//           <button className="ms-level-btn repeat" onClick={startTeaching}>
//             🔊 Repeat
//           </button>
//           <button className="ms-level-btn next" onClick={nextNumber}>
//             Next →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MultiSensoryNumbers.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "multi-sensory-numbers";

const levels = {
  1: { label: "Level 1", min: 1, max: 10 },
  2: { label: "Level 2", min: 1, max: 50 },
  3: { label: "Level 3", min: 1, max: 100 },
};

/* =========================================================
   NUMBER WORD
========================================================= */

function getWord(n) {
  const words = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
  };

  return words[n] || `${n}`;
}

/* =========================================================
   EMOJI
========================================================= */

function getEmoji(n) {
  const arr = [
    "🍎",
    "⭐",
    "🦆",
    "🚗",
    "🎈",
    "🐠",
    "🌈",
    "🧸",
    "🌸",
    "⚽",
  ];

  return arr[(n - 1) % arr.length];
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MultiSensoryNumbers({
  goBack,
}) {
  const navigate = useNavigate();

  /* =========================================================
     FIREBASE PROGRESS
  ========================================================= */

  const initialState = {
    selectedLevel: null,
    current: 1,
    visibleCount: 0,
    message: "Let’s learn slowly 😊",
  };

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  const [current, setCurrent] =
    useState(1);

  const [visibleCount, setVisibleCount] =
    useState(0);

  const [message, setMessage] =
    useState(
      "Let’s learn slowly 😊"
    );

  const [restored, setRestored] =
    useState(false);

  const intervalRef =
    useRef(null);

  const timeoutRef =
    useRef(null);

  /* =========================================================
     RESTORE PROGRESS
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Multi-Sensory Numbers saved state:",
      savedState
    );

    if (savedState) {
      setSelectedLevel(
        savedState.selectedLevel ?? null
      );

      setCurrent(
        savedState.current ?? 1
      );

      setVisibleCount(
        savedState.visibleCount ?? 0
      );

      setMessage(
        savedState.message ||
          "Let’s learn slowly 😊"
      );
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     SPEECH
  ========================================================= */

  const speakText = (text) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 0.75;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(
      utterance
    );
  };

  /* =========================================================
     CLEAN TIMERS
  ========================================================= */

  const clearTeachingTimers = () => {
    if (intervalRef.current) {
      clearInterval(
        intervalRef.current
      );

      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(
        timeoutRef.current
      );

      timeoutRef.current = null;
    }
  };

  /* =========================================================
     START TEACHING
  ========================================================= */

  const startTeaching = async (
    number = current
  ) => {
    if (!selectedLevel) return;

    clearTeachingTimers();

    setVisibleCount(0);

    const teachingMessage =
      `This is number ${number}`;

    setMessage(teachingMessage);

    await save({
      selectedLevel,
      current: number,
      visibleCount: 0,
      message: teachingMessage,
    });

    speakText(
      `This is number ${number}. ${getWord(
        number
      )}.`
    );

    let count = 0;

    const maxShow = Math.min(
      number,
      10
    );

    intervalRef.current =
      setInterval(() => {
        count += 1;

        setVisibleCount(count);

        if (
          count >= maxShow
        ) {
          clearTeachingTimers();

          timeoutRef.current =
            setTimeout(async () => {
              const learnedMessage =
                `We learned number ${number} 🌟`;

              setMessage(
                learnedMessage
              );

              speakText(
                `Number ${number}. ${getWord(
                  number
                )}.`
              );

              await save({
                selectedLevel,
                current: number,
                visibleCount:
                  maxShow,
                message:
                  learnedMessage,
              });
            }, 500);
        }
      }, 500);
  };

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      clearTeachingTimers();

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* =========================================================
     LEVEL CHANGE
  ========================================================= */

  useEffect(() => {
    if (!selectedLevel) return;
    if (!restored) return;

    /*
      Don't automatically restart the saved number here.
      The restored current number should remain.
    */
  }, [
    selectedLevel,
    restored,
  ]);

  /* =========================================================
     NEXT NUMBER
  ========================================================= */

  const nextNumber = async () => {
    if (!selectedLevel) return;

    const currentLevel =
      levels[selectedLevel];

    const next =
      current <
      currentLevel.max
        ? current + 1
        : currentLevel.min;

    setCurrent(next);
    setVisibleCount(0);

    const nextMessage =
      `This is number ${next}`;

    setMessage(nextMessage);

    await save({
      selectedLevel,
      current: next,
      visibleCount: 0,
      message: nextMessage,
    });

    startTeaching(next);
  };

  /* =========================================================
     PREVIOUS NUMBER
  ========================================================= */

  const prevNumber = async () => {
    if (!selectedLevel) return;

    const currentLevel =
      levels[selectedLevel];

    const previous =
      current >
      currentLevel.min
        ? current - 1
        : currentLevel.max;

    setCurrent(previous);
    setVisibleCount(0);

    const previousMessage =
      `This is number ${previous}`;

    setMessage(previousMessage);

    await save({
      selectedLevel,
      current: previous,
      visibleCount: 0,
      message: previousMessage,
    });

    startTeaching(previous);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="ms-home-page">
        <header className="ms-home-header">
          <h1>
            👀👂✋ Multi-Sensory Numbers
          </h1>
        </header>

        <div className="ms-home-content">
          <div className="ms-home-center-card">
            <div className="ms-home-icon">
              🔢
            </div>

            <h2>
              Loading your lesson...
            </h2>

            <p>
              Restoring your progress ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     LEVEL SELECTION
  ========================================================= */

  if (!selectedLevel) {
    return (
      <div className="ms-home-page">

        <header className="ms-home-header">

          <h1>
            👀👂✋ Multi-Sensory Numbers
          </h1>

        </header>

        <div className="ms-home-content">

          <div className="ms-home-center-card">

            <div className="ms-home-icon">
              🔢
            </div>

            <h2>
              Choose a Level
            </h2>

            <p>
              Start learning numbers
              step by step
            </p>

            <div className="ms-home-level-grid">

              <div
                className="ms-home-level-card"
                onClick={() =>
                  setSelectedLevel(1)
                }
              >
                <div className="ms-home-level-title">
                  Level 1
                </div>

                <div className="ms-home-level-subtitle">
                  Learn 1 to 10
                </div>
              </div>

              <div
                className="ms-home-level-card"
                onClick={() =>
                  setSelectedLevel(2)
                }
              >
                <div className="ms-home-level-title">
                  Level 2
                </div>

                <div className="ms-home-level-subtitle">
                  Learn 1 to 50
                </div>
              </div>

              <div
                className="ms-home-level-card"
                onClick={() =>
                  setSelectedLevel(3)
                }
              >
                <div className="ms-home-level-title">
                  Level 3
                </div>

                <div className="ms-home-level-subtitle">
                  Learn 1 to 100
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     CURRENT LEVEL
  ========================================================= */

  const currentLevel =
    levels[selectedLevel];

  /* =========================================================
     LEARNING PAGE
  ========================================================= */

  return (
    <div className="ms-level-page">

      <header className="ms-level-header">

        <h1>
          👀👂✋{" "}
          {currentLevel.label}
        </h1>

      </header>

      <div className="ms-level-content">

        {/* TOP ROW */}
        <div className="ms-level-top-row">

          <div className="ms-level-big-card">

            <div className="ms-level-badge">
              {currentLevel.label}
            </div>

            <div className="ms-level-number">
              {current}
            </div>

            <div className="ms-level-emoji">
              {getEmoji(current)}
            </div>

            <div className="ms-level-word">
              {getWord(current)}
            </div>

            <div className="ms-level-desc">
              See • Hear • Count • Learn
            </div>

          </div>

          {/* OBJECTS */}
          <div className="ms-level-panel">

            <div className="ms-level-panel-title">
              Let’s learn number{" "}
              {current}
            </div>

            <div className="ms-level-objects-row">

              {Array.from({
                length: visibleCount,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="ms-level-object-card"
                  >
                    {getEmoji(current)}
                  </div>
                )
              )}

            </div>

            <div className="ms-level-example">
              Example: {current} objects
            </div>

          </div>

        </div>

        {/* MESSAGE */}
        <div className="ms-level-message">
          {message}
        </div>

        {/* ACTIONS */}
        <div className="ms-level-actions">

          <button
            className="ms-level-btn prev"
            onClick={
              prevNumber
            }
          >
            ← Previous
          </button>

          <button
            className="ms-level-btn repeat"
            onClick={() =>
              startTeaching(
                current
              )
            }
          >
            🔊 Repeat
          </button>

          <button
            className="ms-level-btn next"
            onClick={
              nextNumber
            }
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
}