// // import React, { useEffect, useRef, useState } from "react";
// // import "../styles/NumberTracing.css";

// // const numbersData = [
// //   { number: "1", word: "One", objects: ["🍎"] },
// //   { number: "2", word: "Two", objects: ["🍎", "🍎"] },
// //   { number: "3", word: "Three", objects: ["🍎", "🍎", "🍎"] },
// //   { number: "4", word: "Four", objects: ["⭐", "⭐", "⭐", "⭐"] },
// //   { number: "5", word: "Five", objects: ["🎈", "🎈", "🎈", "🎈", "🎈"] },
// //   { number: "6", word: "Six", objects: ["🐝", "🐝", "🐝", "🐝", "🐝", "🐝"] },
// //   { number: "7", word: "Seven", objects: ["🌸", "🌸", "🌸", "🌸", "🌸", "🌸", "🌸"] },
// //   { number: "8", word: "Eight", objects: ["🦋", "🦋", "🦋", "🦋", "🦋", "🦋", "🦋", "🦋"] },
// //   { number: "9", word: "Nine", objects: ["🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇"] },
// //   { number: "10", word: "Ten", objects: ["🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟"] },
// // ];

// // export default function NumberTracing() {
// //   const canvasRef = useRef(null);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [step, setStep] = useState(1);
// //   const [isDrawing, setIsDrawing] = useState(false);
// //   const [glow, setGlow] = useState(false);
// //   const [message, setMessage] = useState("Trace the number carefully");
// //   const [completedSteps, setCompletedSteps] = useState({
// //     1: false,
// //     2: false,
// //     3: false,
// //   });

// //   const currentNumber = numbersData[currentIndex];

// //   useEffect(() => {
// //     resetBoard();
// //   }, [currentIndex, step]);

// //   const getCanvas = () => canvasRef.current;

// //   const getContext = () => {
// //     const canvas = getCanvas();
// //     if (!canvas) return null;
// //     return canvas.getContext("2d");
// //   };

// //   const clearCanvas = () => {
// //     const canvas = getCanvas();
// //     const ctx = getContext();
// //     if (!canvas || !ctx) return;
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);
// //   };

// //   const resetBoard = () => {
// //     clearCanvas();
// //     setGlow(false);
// //     setIsDrawing(false);
// //     setMessage(getStepMessage(step));
// //   };

// //   const getStepMessage = (currentStep) => {
// //     if (currentStep === 1) return "Trace on the dotted number";
// //     if (currentStep === 2) return "Trace on the outline number";
// //     return "Write the number by yourself";
// //   };

// //   const getPointerPosition = (event) => {
// //     const canvas = getCanvas();
// //     const rect = canvas.getBoundingClientRect();

// //     if (event.touches && event.touches.length > 0) {
// //       return {
// //         x: event.touches[0].clientX - rect.left,
// //         y: event.touches[0].clientY - rect.top,
// //       };
// //     }

// //     return {
// //       x: event.clientX - rect.left,
// //       y: event.clientY - rect.top,
// //     };
// //   };

// //   const startDrawing = (event) => {
// //     const ctx = getContext();
// //     if (!ctx) return;

// //     const pos = getPointerPosition(event);
// //     ctx.beginPath();
// //     ctx.moveTo(pos.x, pos.y);
// //     ctx.lineWidth = 8;
// //     ctx.lineCap = "round";
// //     ctx.lineJoin = "round";
// //     ctx.strokeStyle = "black";

// //     setIsDrawing(true);
// //     setGlow(true);
// //     setMessage("Good! Keep tracing...");
// //   };

// //   const draw = (event) => {
// //     if (!isDrawing) return;

// //     const ctx = getContext();
// //     if (!ctx) return;

// //     const pos = getPointerPosition(event);
// //     ctx.lineTo(pos.x, pos.y);
// //     ctx.stroke();
// //   };

// //   const stopDrawing = () => {
// //     if (!isDrawing) return;

// //     setIsDrawing(false);
// //     setGlow(true);
// //     setCompletedSteps((prev) => ({
// //       ...prev,
// //       [step]: true,
// //     }));

// //     if (step === 1) {
// //       setMessage("Great! Dotted tracing done");
// //     } else if (step === 2) {
// //       setMessage("Awesome! Outline tracing done");
// //     } else {
// //       setMessage("Wonderful! Free writing done");
// //     }
// //   };

// //   const handleRepeat = () => {
// //     clearCanvas();
// //     setGlow(false);
// //     setMessage(getStepMessage(step));
// //   };

// //   const handleNext = () => {
// //     if (step < 3) {
// //       setStep((prev) => prev + 1);
// //       return;
// //     }

// //     setStep(1);
// //     setCompletedSteps({
// //       1: false,
// //       2: false,
// //       3: false,
// //     });
// //     setCurrentIndex((prev) => (prev + 1) % numbersData.length);
// //   };

// //   const handlePrev = () => {
// //     if (step > 1) {
// //       setStep((prev) => prev - 1);
// //       return;
// //     }

// //     const previousIndex =
// //       currentIndex === 0 ? numbersData.length - 1 : currentIndex - 1;

// //     setCurrentIndex(previousIndex);
// //     setStep(3);
// //     setCompletedSteps({
// //       1: false,
// //       2: false,
// //       3: false,
// //     });
// //   };

// //   const getGuideClass = () => {
// //     if (step === 1) return "trace-guide dotted-guide";
// //     if (step === 2) return "trace-guide outline-guide";
// //     return "trace-guide free-guide";
// //   };

// //   const getStepTitle = () => {
// //     if (step === 1) return "Step 1 - Dotted Trace";
// //     if (step === 2) return "Step 2 - Outline Trace";
// //     return "Step 3 - Free Writing";
// //   };

// //   return (
// //     <div className="number-tracing-page">
// //       <div className="trace-bg bubble1"></div>
// //       <div className="trace-bg bubble2"></div>
// //       <div className="trace-bg bubble3"></div>

// //       <header className="number-tracing-header">
// //         <h1>🔢 Magic Number Writing</h1>
// //         <p>See → Trace → Repeat → Write</p>
// //       </header>

// //       <div className="number-tracing-card">
// //         <div className="number-top-section">
// //           <div className="number-display-box">
// //             <div className="main-number">{currentNumber.number}</div>
// //             <div className="main-word">{currentNumber.word}</div>
// //           </div>

// //           <div className="objects-display-box">
// //             <h3>Count the objects</h3>
// //             <div className="objects-row">
// //               {currentNumber.objects.map((item, index) => (
// //                 <span key={index} className="object-item">
// //                   {item}
// //                 </span>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         <div className="practice-header">
// //           <h2>{getStepTitle()}</h2>
// //           <p>{message}</p>
// //         </div>

// //         <div className={`trace-board ${glow ? "board-glow" : ""}`}>
// //           {step !== 3 && (
// //             <div className={getGuideClass()}>{currentNumber.number}</div>
// //           )}

// //           {step === 3 && (
// //             <div className="free-write-placeholder">
// //               Write {currentNumber.number} here
// //             </div>
// //           )}

// //           <canvas
// //             ref={canvasRef}
// //             width={420}
// //             height={320}
// //             className="trace-canvas"
// //             onMouseDown={startDrawing}
// //             onMouseMove={draw}
// //             onMouseUp={stopDrawing}
// //             onMouseLeave={stopDrawing}
// //             onTouchStart={startDrawing}
// //             onTouchMove={draw}
// //             onTouchEnd={stopDrawing}
// //           />
// //         </div>

// //         <div className="step-progress">
// //           <div className={`step-dot ${step === 1 ? "active" : ""} ${completedSteps[1] ? "done" : ""}`}>
// //             1
// //           </div>
// //           <div className={`step-line ${completedSteps[1] ? "done-line" : ""}`}></div>
// //           <div className={`step-dot ${step === 2 ? "active" : ""} ${completedSteps[2] ? "done" : ""}`}>
// //             2
// //           </div>
// //           <div className={`step-line ${completedSteps[2] ? "done-line" : ""}`}></div>
// //           <div className={`step-dot ${step === 3 ? "active" : ""} ${completedSteps[3] ? "done" : ""}`}>
// //             3
// //           </div>
// //         </div>

// //         <div className="button-row">
// //           <button className="trace-btn" onClick={handlePrev}>
// //             ⬅ Previous
// //           </button>
// //           <button className="trace-btn repeat-btn" onClick={handleRepeat}>
// //             🔄 Repeat
// //           </button>
// //           <button className="trace-btn" onClick={handleNext}>
// //             Next ➡
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useEffect, useRef, useState } from "react";
// import "../styles/NumberTracing.css";

// /* ---------- OBJECT IMAGES ---------- */

// const objectIcons = [
//   "🍎",
//   "⭐",
//   "🎈",
//   "🐝",
//   "🌸",
//   "🦋",
//   "🍇",
//   "🌟",
//   "🚗",
//   "🐟",
// ];

// /* ---------- GENERATE NUMBERS ---------- */

// const generateNumbers = (max) => {
//   const data = [];

//   for (let i = 1; i <= max; i++) {
//     const icon =
//       objectIcons[(i - 1) % objectIcons.length];

//     data.push({
//       number: i.toString(),
//       word: i.toString(),
//       objects: Array(
//         i > 10 ? 10 : i
//       ).fill(icon),
//     });
//   }

//   return data;
// };

// export default function NumberTracing() {
//   const canvasRef = useRef(null);

//   /* SCREEN CONTROL */

//   const [screen, setScreen] =
//     useState("levels");

//   const [level, setLevel] =
//     useState(null);

//   const [numbersData, setNumbersData] =
//     useState([]);

//   /* EXISTING STATES */

//   const [currentIndex, setCurrentIndex] =
//     useState(0);

//   const [step, setStep] =
//     useState(1);

//   const [isDrawing, setIsDrawing] =
//     useState(false);

//   const [glow, setGlow] =
//     useState(false);

//   const [message, setMessage] =
//     useState(
//       "Trace the number carefully"
//     );

//   const currentNumber =
//     numbersData[currentIndex] || {
//       number: "",
//       word: "",
//       objects: [],
//     };

//   /* ---------- LEVEL CLICK ---------- */

//   const handleLevelClick = (lvl) => {
//     setLevel(lvl);
//     setCurrentIndex(0);

//     if (lvl === 1)
//       setNumbersData(generateNumbers(10));

//     if (lvl === 2)
//       setNumbersData(generateNumbers(50));

//     if (lvl === 3)
//       setNumbersData(generateNumbers(100));

//     setScreen("tracing");
//   };

//   /* ---------- CANVAS ---------- */

//   useEffect(() => {
//     resetBoard();
//   }, [currentIndex, step]);

//   const getCanvas = () => canvasRef.current;

//   const getContext = () => {
//     const canvas = getCanvas();
//     if (!canvas) return null;
//     return canvas.getContext("2d");
//   };

//   const clearCanvas = () => {
//     const canvas = getCanvas();
//     const ctx = getContext();

//     if (!canvas || !ctx) return;

//     ctx.clearRect(
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );
//   };

//   const resetBoard = () => {
//     clearCanvas();
//     setGlow(false);
//     setIsDrawing(false);
//     setMessage(getStepMessage(step));
//   };

//   const getStepMessage = (s) => {
//     if (s === 1)
//       return "Trace on the dotted number";

//     if (s === 2)
//       return "Trace on the outline number";

//     return "Write the number yourself";
//   };

//   const getPointerPosition = (event) => {
//     const canvas = getCanvas();
//     const rect =
//       canvas.getBoundingClientRect();

//     if (event.touches) {
//       return {
//         x:
//           event.touches[0].clientX -
//           rect.left,
//         y:
//           event.touches[0].clientY -
//           rect.top,
//       };
//     }

//     return {
//       x: event.clientX - rect.left,
//       y: event.clientY - rect.top,
//     };
//   };

//   const startDrawing = (event) => {
//     const ctx = getContext();
//     if (!ctx) return;

//     const pos =
//       getPointerPosition(event);

//     ctx.beginPath();
//     ctx.moveTo(pos.x, pos.y);
//     ctx.lineWidth = 8;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = "black";

//     setIsDrawing(true);
//     setGlow(true);
//     setMessage(
//       "Good! Keep tracing..."
//     );
//   };

//   const draw = (event) => {
//     if (!isDrawing) return;

//     const ctx = getContext();
//     if (!ctx) return;

//     const pos =
//       getPointerPosition(event);

//     ctx.lineTo(pos.x, pos.y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     if (!isDrawing) return;

//     setIsDrawing(false);
//     setGlow(true);
//   };

//   /* ---------- BUTTONS ---------- */

//   const handleRepeat = () => {
//     clearCanvas();
//     setGlow(false);
//   };

//   const handleNext = () => {
//     if (step < 3) {
//       setStep(step + 1);
//       return;
//     }

//     setStep(1);

//     setCurrentIndex((prev) =>
//       prev + 1 < numbersData.length
//         ? prev + 1
//         : 0
//     );
//   };

//   const handlePrev = () => {
//     if (step > 1) {
//       setStep(step - 1);
//       return;
//     }

//     const previousIndex =
//       currentIndex === 0
//         ? numbersData.length - 1
//         : currentIndex - 1;

//     setCurrentIndex(previousIndex);
//     setStep(3);
//   };

//   const getGuideClass = () => {
//     if (step === 1)
//       return "trace-guide dotted-guide";

//     if (step === 2)
//       return "trace-guide outline-guide";

//     return "trace-guide free-guide";
//   };

//   const getStepTitle = () => {
//     if (step === 1)
//       return "Step 1 - Dotted Trace";

//     if (step === 2)
//       return "Step 2 - Outline Trace";

//     return "Step 3 - Free Writing";
//   };

//   /* ================= LEVEL PAGE ================= */

//   if (screen === "levels") {
//     return (
//       <div className="number-tracing-page">

//         <header className="number-tracing-header">
//           <h1>Choose a Level</h1>
//         </header>

//         <div className="level-container">

//           <button
//             className="level-card"
//             onClick={() =>
//               handleLevelClick(1)
//             }
//           >
//             Level 1
//             <br />
//             Learn 1 to 10
//           </button>

//           <button
//             className="level-card"
//             onClick={() =>
//               handleLevelClick(2)
//             }
//           >
//             Level 2
//             <br />
//             Learn 1 to 50
//           </button>

//           <button
//             className="level-card"
//             onClick={() =>
//               handleLevelClick(3)
//             }
//           >
//             Level 3
//             <br />
//             Learn 1 to 100
//           </button>

//         </div>

//       </div>
//     );
//   }

//   /* ================= TRACING PAGE ================= */

//   return (
//     <div className="number-tracing-page">

//       <button
//         className="trace-btn"
//         onClick={() =>
//           setScreen("levels")
//         }
//       >
//         ⬅ Back to Levels
//       </button>

//       <div className="number-tracing-card">

//         <div className="number-top-section">

//           <div className="number-display-box">
//             <div className="main-number">
//               {currentNumber.number}
//             </div>

//             <div className="main-word">
//               {currentNumber.word}
//             </div>
//           </div>

//           <div className="objects-display-box">
//             <h3>Count the objects</h3>

//             <div className="objects-row">
//               {currentNumber.objects.map(
//                 (item, index) => (
//                   <span
//                     key={index}
//                     className="object-item"
//                   >
//                     {item}
//                   </span>
//                 )
//               )}
//             </div>

//           </div>

//         </div>

//         <div className="practice-header">
//           <h2>{getStepTitle()}</h2>
//           <p>{message}</p>
//         </div>

//         <div
//           className={`trace-board ${
//             glow ? "board-glow" : ""
//           }`}
//         >

//           {step !== 3 && (
//             <div
//               className={
//                 getGuideClass()
//               }
//             >
//               {
//                 currentNumber.number
//               }
//             </div>
//           )}

//           <canvas
//             ref={canvasRef}
//             width={420}
//             height={320}
//             className="trace-canvas"
//             onMouseDown={
//               startDrawing
//             }
//             onMouseMove={draw}
//             onMouseUp={
//               stopDrawing
//             }
//             onMouseLeave={
//               stopDrawing
//             }
//             onTouchStart={
//               startDrawing
//             }
//             onTouchMove={draw}
//             onTouchEnd={
//               stopDrawing
//             }
//           />

//         </div>

//         <div className="button-row">

//           <button
//             className="trace-btn"
//             onClick={handlePrev}
//           >
//             ⬅ Previous
//           </button>

//           <button
//             className="trace-btn repeat-btn"
//             onClick={handleRepeat}
//           >
//             🔄 Repeat
//           </button>

//           <button
//             className="trace-btn"
//             onClick={handleNext}
//           >
//             Next ➡
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import "../styles/NumberTracing.css";
import useGameProgress from "../hooks/useGameProgress";

/* ---------- GAME ID ---------- */

const GAME_ID = "number-tracing";

/* ---------- OBJECT IMAGES ---------- */

const objectIcons = [
  "🍎",
  "⭐",
  "🎈",
  "🐝",
  "🌸",
  "🦋",
  "🍇",
  "🌟",
  "🚗",
  "🐟",
];

/* ---------- GENERATE NUMBERS ---------- */

const generateNumbers = (max) => {
  const data = [];

  for (let i = 1; i <= max; i++) {
    const icon =
      objectIcons[(i - 1) % objectIcons.length];

    data.push({
      number: i.toString(),
      word: i.toString(),
      objects: Array(
        i > 10 ? 10 : i
      ).fill(icon),
    });
  }

  return data;
};

export default function NumberTracing() {
  const canvasRef = useRef(null);

  /* =========================================================
     FIREBASE GAME PROGRESS
  ========================================================= */

  const initialProgress = {
    screen: "levels",
    level: null,
    currentIndex: 0,
    step: 1,
    numbersData: [],
    message: "Trace the number carefully",
  };

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(
    GAME_ID,
    initialProgress
  );

  /* =========================================================
     SCREEN CONTROL
  ========================================================= */

  const [screen, setScreen] =
    useState("levels");

  const [level, setLevel] =
    useState(null);

  const [numbersData, setNumbersData] =
    useState([]);

  /* =========================================================
     EXISTING STATES
  ========================================================= */

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [step, setStep] =
    useState(1);

  const [isDrawing, setIsDrawing] =
    useState(false);

  const [glow, setGlow] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Trace the number carefully"
    );

  const [restored, setRestored] =
    useState(false);

  /* =========================================================
     RESTORE FIREBASE PROGRESS
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Number Tracing saved state:",
      savedState
    );

    if (savedState) {
      setScreen(
        savedState.screen || "levels"
      );

      setLevel(
        savedState.level ?? null
      );

      setCurrentIndex(
        savedState.currentIndex ?? 0
      );

      setStep(
        savedState.step ?? 1
      );

      setNumbersData(
        savedState.numbersData || []
      );

      setMessage(
        savedState.message ||
          "Trace the number carefully"
      );
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     SAVE CURRENT GAME STATE
  ========================================================= */

  const saveCurrentState = async (
    overrides = {}
  ) => {
    await save({
      screen,
      level,
      currentIndex,
      step,
      numbersData,
      message,
      ...overrides,
    });
  };

  /* =========================================================
     LEVEL CLICK
  ========================================================= */

  const handleLevelClick = async (lvl) => {
    let generatedNumbers = [];

    if (lvl === 1) {
      generatedNumbers =
        generateNumbers(10);
    }

    if (lvl === 2) {
      generatedNumbers =
        generateNumbers(50);
    }

    if (lvl === 3) {
      generatedNumbers =
        generateNumbers(100);
    }

    setLevel(lvl);
    setCurrentIndex(0);
    setStep(1);
    setNumbersData(generatedNumbers);
    setMessage(
      "Trace the number carefully"
    );
    setScreen("tracing");

    /* 💾 SAVE LEVEL */
    await save({
      screen: "tracing",
      level: lvl,
      currentIndex: 0,
      step: 1,
      numbersData: generatedNumbers,
      message:
        "Trace the number carefully",
    });
  };

  /* =========================================================
     CURRENT NUMBER
  ========================================================= */

  const currentNumber =
    numbersData[currentIndex] || {
      number: "",
      word: "",
      objects: [],
    };

  /* =========================================================
     CANVAS
  ========================================================= */

  useEffect(() => {
    if (
      !restored ||
      progressLoading ||
      screen !== "tracing"
    ) {
      return;
    }

    resetBoard();
  }, [
    currentIndex,
    step,
    restored,
    progressLoading,
    screen,
  ]);

  const getCanvas = () =>
    canvasRef.current;

  const getContext = () => {
    const canvas = getCanvas();

    if (!canvas) return null;

    return canvas.getContext("2d");
  };

  const clearCanvas = () => {
    const canvas = getCanvas();
    const ctx = getContext();

    if (!canvas || !ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  const resetBoard = () => {
    clearCanvas();

    setGlow(false);
    setIsDrawing(false);

    setMessage(
      getStepMessage(step)
    );
  };

  const getStepMessage = (s) => {
    if (s === 1)
      return "Trace on the dotted number";

    if (s === 2)
      return "Trace on the outline number";

    return "Write the number yourself";
  };

  /* =========================================================
     POINTER POSITION
  ========================================================= */

  const getPointerPosition = (event) => {
    const canvas = getCanvas();

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect =
      canvas.getBoundingClientRect();

    if (event.touches) {
      return {
        x:
          event.touches[0].clientX -
          rect.left,
        y:
          event.touches[0].clientY -
          rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  /* =========================================================
     DRAWING
  ========================================================= */

  const startDrawing = (event) => {
    event.preventDefault();

    const ctx = getContext();

    if (!ctx) return;

    const pos =
      getPointerPosition(event);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    setIsDrawing(true);
    setGlow(true);
    setMessage(
      "Good! Keep tracing..."
    );
  };

  const draw = (event) => {
    event.preventDefault();

    if (!isDrawing) return;

    const ctx = getContext();

    if (!ctx) return;

    const pos =
      getPointerPosition(event);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!isDrawing) return;

    setIsDrawing(false);
    setGlow(true);
  };

  /* =========================================================
     REPEAT
  ========================================================= */

  const handleRepeat = async () => {
    clearCanvas();
    setGlow(false);

    const resetMessage =
      getStepMessage(step);

    setMessage(resetMessage);

    await saveCurrentState({
      message: resetMessage,
    });
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = async () => {
    /* -----------------------------------------
       STEP 1 → STEP 2
    ----------------------------------------- */

    if (step < 3) {
      const nextStep = step + 1;

      const nextMessage =
        getStepMessage(nextStep);

      setStep(nextStep);
      setMessage(nextMessage);

      await save({
        screen: "tracing",
        level,
        currentIndex,
        step: nextStep,
        numbersData,
        message: nextMessage,
      });

      return;
    }

    /* -----------------------------------------
       STEP 3 → NEXT NUMBER
    ----------------------------------------- */

    setStep(1);

    const nextIndex =
      currentIndex + 1 <
      numbersData.length
        ? currentIndex + 1
        : 0;

    const nextMessage =
      getStepMessage(1);

    setCurrentIndex(nextIndex);
    setMessage(nextMessage);

    await save({
      screen: "tracing",
      level,
      currentIndex: nextIndex,
      step: 1,
      numbersData,
      message: nextMessage,
    });
  };

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePrev = async () => {
    /* -----------------------------------------
       STEP 3 → STEP 2
    ----------------------------------------- */

    if (step > 1) {
      const previousStep =
        step - 1;

      const previousMessage =
        getStepMessage(previousStep);

      setStep(previousStep);
      setMessage(previousMessage);

      await save({
        screen: "tracing",
        level,
        currentIndex,
        step: previousStep,
        numbersData,
        message: previousMessage,
      });

      return;
    }

    /* -----------------------------------------
       STEP 1 → PREVIOUS NUMBER STEP 3
    ----------------------------------------- */

    const previousIndex =
      currentIndex === 0
        ? numbersData.length - 1
        : currentIndex - 1;

    const previousMessage =
      getStepMessage(3);

    setCurrentIndex(previousIndex);
    setStep(3);
    setMessage(previousMessage);

    await save({
      screen: "tracing",
      level,
      currentIndex: previousIndex,
      step: 3,
      numbersData,
      message: previousMessage,
    });
  };

  /* =========================================================
     BACK TO LEVELS
  ========================================================= */

  const handleBackToLevels = async () => {
    setScreen("levels");

    await save({
      screen: "levels",
      level,
      currentIndex,
      step,
      numbersData,
      message,
    });
  };

  /* =========================================================
     GUIDE CLASS
  ========================================================= */

  const getGuideClass = () => {
    if (step === 1)
      return "trace-guide dotted-guide";

    if (step === 2)
      return "trace-guide outline-guide";

    return "trace-guide free-guide";
  };

  /* =========================================================
     STEP TITLE
  ========================================================= */

  const getStepTitle = () => {
    if (step === 1)
      return "Step 1 - Dotted Trace";

    if (step === 2)
      return "Step 2 - Outline Trace";

    return "Step 3 - Free Writing";
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (progressLoading || !restored) {
    return (
      <div className="number-tracing-page">
        <div className="number-tracing-card">
          <div className="practice-header">
            <h2>
              Loading your practice...
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
     LEVEL PAGE
  ========================================================= */

  if (screen === "levels") {
    return (
      <div className="number-tracing-page">

        <header className="number-tracing-header">
          <h1>Choose a Level</h1>
        </header>

        <div className="level-container">

          <button
            className="level-card"
            onClick={() =>
              handleLevelClick(1)
            }
          >
            Level 1
            <br />
            Learn 1 to 10
          </button>

          <button
            className="level-card"
            onClick={() =>
              handleLevelClick(2)
            }
          >
            Level 2
            <br />
            Learn 1 to 50
          </button>

          <button
            className="level-card"
            onClick={() =>
              handleLevelClick(3)
            }
          >
            Level 3
            <br />
            Learn 1 to 100
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     TRACING PAGE
  ========================================================= */

  return (
    <div className="number-tracing-page">

      <button
        className="trace-btn"
        onClick={
          handleBackToLevels
        }
      >
        ⬅ Back to Levels
      </button>

      <div className="number-tracing-card">

        <div className="number-top-section">

          <div className="number-display-box">

            <div className="main-number">
              {currentNumber.number}
            </div>

            <div className="main-word">
              {currentNumber.word}
            </div>

          </div>

          <div className="objects-display-box">

            <h3>
              Count the objects
            </h3>

            <div className="objects-row">

              {currentNumber.objects.map(
                (item, index) => (
                  <span
                    key={index}
                    className="object-item"
                  >
                    {item}
                  </span>
                )
              )}

            </div>

          </div>

        </div>

        <div className="practice-header">

          <h2>
            {getStepTitle()}
          </h2>

          <p>
            {message}
          </p>

        </div>

        <div
          className={`trace-board ${
            glow ? "board-glow" : ""
          }`}
        >

          {step !== 3 && (
            <div
              className={
                getGuideClass()
              }
            >
              {
                currentNumber.number
              }
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={420}
            height={320}
            className="trace-canvas"
            onMouseDown={
              startDrawing
            }
            onMouseMove={draw}
            onMouseUp={
              stopDrawing
            }
            onMouseLeave={
              stopDrawing
            }
            onTouchStart={
              startDrawing
            }
            onTouchMove={draw}
            onTouchEnd={
              stopDrawing
            }
          />

        </div>

        <div className="button-row">

          <button
            className="trace-btn"
            onClick={handlePrev}
          >
            ⬅ Previous
          </button>

          <button
            className="trace-btn repeat-btn"
            onClick={handleRepeat}
          >
            🔄 Repeat
          </button>

          <button
            className="trace-btn"
            onClick={handleNext}
          >
            Next ➡
          </button>

        </div>

      </div>

    </div>
  );
}