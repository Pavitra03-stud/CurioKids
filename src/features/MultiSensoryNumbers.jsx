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
import { useNavigate, useParams } from "react-router-dom";

import "../styles/MultiSensoryNumbers.css";
import multiSensoryImage from "../assets/multi_sensory.png";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "multi-sensory-numbers";

const levels = {
  1: { label: "Level 1", min: 1, max: 10 },
  2: { label: "Level 2", min: 1, max: 50 },
  3: { label: "Level 3", min: 1, max: 100 },
};

/* =========================================================
   NUMBER WORDS
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
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
    14: "Fourteen",
    15: "Fifteen",
    16: "Sixteen",
    17: "Seventeen",
    18: "Eighteen",
    19: "Nineteen",
    20: "Twenty",
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

export default function MultiSensoryNumbers({ goBack }) {
  const navigate = useNavigate();
  const { level } = useParams();

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
  } = useGameProgress(GAME_ID, initialState);

  /* =========================================================
     STATES
  ========================================================= */

  const [selectedLevel, setSelectedLevel] = useState(null);

  const [current, setCurrent] = useState(1);

  const [visibleCount, setVisibleCount] = useState(0);

  const [message, setMessage] = useState(
    "Let’s learn slowly 😊"
  );

  const [restored, setRestored] = useState(false);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  /* =========================================================
     LEVEL FROM URL
     
     IMPORTANT:
     Whenever the URL changes to:
     
     /multi-sensory-numbers/level/1
     /multi-sensory-numbers/level/2
     /multi-sensory-numbers/level/3
     
     we ALWAYS start from number 1.
  ========================================================= */

  useEffect(() => {
    if (level) {
      const levelNumber = Number(level);

      if (levels[levelNumber]) {
        setSelectedLevel(levelNumber);

        // Always restart from 1
        setCurrent(1);

        // Number 1 has one object
        setVisibleCount(1);

        setMessage("Let’s learn slowly 😊");
      }
    } else {
      // Level selection page
      setSelectedLevel(null);
      setCurrent(1);
      setVisibleCount(0);
      setMessage("Let’s learn slowly 😊");
    }
  }, [level]);

  /* =========================================================
     WAIT FOR FIREBASE

     We DO NOT restore current number here.

     This is intentional because every time the user
     enters a level, learning must restart from 1.
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;

    if (!restored) {
      console.log(
        "🔥 Multi-Sensory Numbers saved state:",
        savedState
      );

      setRestored(true);
    }
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

    window.speechSynthesis.speak(utterance);
  };

  /* =========================================================
     CLEAR TIMERS
  ========================================================= */

  const clearTeachingTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  /* =========================================================
     START TEACHING
  ========================================================= */

  const startTeaching = async (number = current) => {
    if (!selectedLevel) return;

    const currentLevel = levels[selectedLevel];

    /*
      Safety check:
      Never allow a number outside the selected level.
    */

    if (
      number < currentLevel.min ||
      number > currentLevel.max
    ) {
      return;
    }

    clearTeachingTimers();

    const teachingMessage =
      `This is number ${number}`;

    setMessage(teachingMessage);

    /*
      EXACT NUMBER OF OBJECTS

      1  -> 1 object
      2  -> 2 objects
      5  -> 5 objects
      10 -> 10 objects
      20 -> 20 objects
      etc.
    */

    setVisibleCount(number);

    await save({
      selectedLevel,
      current: number,
      visibleCount: number,
      message: teachingMessage,
    });

    speakText(
      `This is number ${number}. ${getWord(number)}.`
    );

    /*
      After speaking, show completed message.
    */

    timeoutRef.current = setTimeout(async () => {
      const learnedMessage =
        `We learned number ${number} 🌟`;

      setMessage(learnedMessage);

      speakText(
        `Number ${number}. ${getWord(number)}.`
      );

      await save({
        selectedLevel,
        current: number,
        visibleCount: number,
        message: learnedMessage,
      });
    }, 1000);
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
     NEXT NUMBER
  ========================================================= */

  const nextNumber = async () => {
    if (!selectedLevel) return;

    const currentLevel = levels[selectedLevel];

    const next =
      current < currentLevel.max
        ? current + 1
        : currentLevel.min;

    setCurrent(next);

    /*
      Immediately show the correct number
      of objects.
    */

    setVisibleCount(next);

    const nextMessage =
      `This is number ${next}`;

    setMessage(nextMessage);

    await save({
      selectedLevel,
      current: next,
      visibleCount: next,
      message: nextMessage,
    });

    startTeaching(next);
  };

  /* =========================================================
     PREVIOUS NUMBER
  ========================================================= */

  const prevNumber = async () => {
    if (!selectedLevel) return;

    const currentLevel = levels[selectedLevel];

    const previous =
      current > currentLevel.min
        ? current - 1
        : currentLevel.max;

    setCurrent(previous);

    /*
      Immediately show the correct number
      of objects.
    */

    setVisibleCount(previous);

    const previousMessage =
      `This is number ${previous}`;

    setMessage(previousMessage);

    await save({
      selectedLevel,
      current: previous,
      visibleCount: previous,
      message: previousMessage,
    });

    startTeaching(previous);
  };

  /* =========================================================
     LOADING SCREEN
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
              <img
                src={multiSensoryImage}
                alt="Multi Sensory Numbers"
              />
            </div>

            <h2>
              Loading your lesson...
            </h2>

            <p>
              Preparing your lesson ✨
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     LEVEL SELECTION PAGE
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
              <img
                src={multiSensoryImage}
                alt="Multi Sensory Numbers"
              />
            </div>

            <h2>
              Choose a Level
            </h2>

            <p>
              Start learning numbers step by step
            </p>

            <div className="ms-home-level-grid">

              {/* =================================================
                  LEVEL 1
              ================================================= */}

              <div
                className="ms-home-level-card"
                onClick={() => {
                  setSelectedLevel(1);
                  setCurrent(1);
                  setVisibleCount(1);
                  setMessage(
                    "Let’s learn slowly 😊"
                  );

                  navigate(
                    "/multi-sensory-numbers/level/1"
                  );
                }}
              >
                <div className="ms-home-level-title">
                  Level 1
                </div>

                <div className="ms-home-level-subtitle">
                  Learn 1 to 10
                </div>
              </div>

              {/* =================================================
                  LEVEL 2
              ================================================= */}

              <div
                className="ms-home-level-card"
                onClick={() => {
                  setSelectedLevel(2);
                  setCurrent(1);
                  setVisibleCount(1);
                  setMessage(
                    "Let’s learn slowly 😊"
                  );

                  navigate(
                    "/multi-sensory-numbers/level/2"
                  );
                }}
              >
                <div className="ms-home-level-title">
                  Level 2
                </div>

                <div className="ms-home-level-subtitle">
                  Learn 1 to 50
                </div>
              </div>

              {/* =================================================
                  LEVEL 3
              ================================================= */}

              <div
                className="ms-home-level-card"
                onClick={() => {
                  setSelectedLevel(3);
                  setCurrent(1);
                  setVisibleCount(1);
                  setMessage(
                    "Let’s learn slowly 😊"
                  );

                  navigate(
                    "/multi-sensory-numbers/level/3"
                  );
                }}
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
          👀👂✋ {currentLevel.label}
        </h1>
      </header>

      <div className="ms-level-content">

        {/* =====================================================
            TOP ROW
        ===================================================== */}

        <div className="ms-level-top-row">

          {/* ===================================================
              BIG NUMBER CARD
          =================================================== */}

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

          {/* ===================================================
              OBJECT PANEL
          =================================================== */}

          <div className="ms-level-panel">

            <div className="ms-level-panel-title">
              Let’s learn number {current}
            </div>

            <div className="ms-level-objects-row">

              {Array.from({
                length: visibleCount,
              }).map((_, index) => (
                <div
                  key={index}
                  className="ms-level-object-card"
                >
                  {getEmoji(current)}
                </div>
              ))}

            </div>

            <div className="ms-level-example">
              Example: {current} objects
            </div>

          </div>

        </div>

        {/* =====================================================
            MESSAGE
        ===================================================== */}

        <div className="ms-level-message">
          {message}
        </div>

        {/* =====================================================
            BUTTONS
        ===================================================== */}

        <div className="ms-level-actions">

          <button
            className="ms-level-btn prev"
            onClick={prevNumber}
          >
            ← Previous
          </button>

          <button
            className="ms-level-btn repeat"
            onClick={() =>
              startTeaching(current)
            }
          >
            🔊 Repeat
          </button>

          <button
            className="ms-level-btn next"
            onClick={nextNumber}
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
}