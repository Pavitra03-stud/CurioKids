// import React, { useRef, useState, useEffect } from "react";
// import "../styles/NumberTracing.css";

// const numbersData = [
//   { number: "1", word: "One" },
//   { number: "2", word: "Two" },
//   { number: "3", word: "Three" },
//   { number: "4", word: "Four" },
//   { number: "5", word: "Five" },
//   { number: "6", word: "Six" },
//   { number: "7", word: "Seven" },
//   { number: "8", word: "Eight" },
//   { number: "9", word: "Nine" },
//   { number: "10", word: "Ten" },
// ];

// export default function NumberTracing() {
//   const canvasRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [stage, setStage] = useState(1);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [glow, setGlow] = useState(false);

//   const currentNumber = numbersData[currentIndex];

//   useEffect(() => {
//     clearCanvas();
//     setGlow(false);
//   }, [currentIndex, stage]);

//   const getCanvasContext = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;
//     return canvas.getContext("2d");
//   };

//   const getPosition = (e) => {
//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();

//     if (e.touches) {
//       return {
//         x: e.touches[0].clientX - rect.left,
//         y: e.touches[0].clientY - rect.top,
//       };
//     }

//     return {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };
//   };

//   const startDrawing = (e) => {
//     const ctx = getCanvasContext();
//     if (!ctx) return;

//     const pos = getPosition(e);
//     ctx.beginPath();
//     ctx.moveTo(pos.x, pos.y);
//     setIsDrawing(true);
//     setGlow(true);
//   };

//   const draw = (e) => {
//     if (!isDrawing) return;
//     const ctx = getCanvasContext();
//     if (!ctx) return;

//     const pos = getPosition(e);
//     ctx.lineWidth = 8;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = "black";
//     ctx.lineTo(pos.x, pos.y);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const ctx = getCanvasContext();
//     if (!canvas || !ctx) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   };

//   const handleRepeat = () => {
//     clearCanvas();
//     setGlow(false);
//   };

//   const handleNext = () => {
//     if (stage < 3) {
//       setStage(stage + 1);
//     } else {
//       setStage(1);
//       setCurrentIndex((prev) => (prev + 1) % numbersData.length);
//     }
//   };

//   const handlePrev = () => {
//     if (stage > 1) {
//       setStage(stage - 1);
//     } else {
//       setStage(3);
//       setCurrentIndex((prev) =>
//         prev === 0 ? numbersData.length - 1 : prev - 1
//       );
//     }
//   };

//   const getGuideClass = () => {
//     if (stage === 1) return "guide dotted";
//     if (stage === 2) return "guide outline";
//     return "guide blank";
//   };

//   const getStageTitle = () => {
//     if (stage === 1) return "Level 1 - Dotted Trace";
//     if (stage === 2) return "Level 2 - Outline Trace";
//     return "Level 3 - Free Writing";
//   };

//   return (
//     <div className="number-trace-page">
//       <div className="trace-floating bubble1"></div>
//       <div className="trace-floating bubble2"></div>
//       <div className="trace-floating bubble3"></div>

//       <header className="number-trace-header">
//         <h1>🔢 Number Tracing</h1>
//         <p>{getStageTitle()}</p>
//       </header>

//       <div className="number-trace-card">
//         <div className="number-info">
//           <h2>
//             Number: {currentNumber.number} - {currentNumber.word}
//           </h2>
//           <p>Trace the number carefully and repeat writing practice</p>
//         </div>

//         <div className={`trace-board ${glow ? "active-glow" : ""}`}>
//           <div className={getGuideClass()}>
//             {stage !== 3 ? currentNumber.number : ""}
//           </div>

//           <canvas
//             ref={canvasRef}
//             width={350}
//             height={350}
//             className="trace-canvas"
//             onMouseDown={startDrawing}
//             onMouseMove={draw}
//             onMouseUp={stopDrawing}
//             onMouseLeave={stopDrawing}
//             onTouchStart={startDrawing}
//             onTouchMove={draw}
//             onTouchEnd={stopDrawing}
//           />
//         </div>

//         <div className="trace-stage-dots">
//           <span className={stage === 1 ? "active" : ""}>1</span>
//           <span className={stage === 2 ? "active" : ""}>2</span>
//           <span className={stage === 3 ? "active" : ""}>3</span>
//         </div>

//         <div className="trace-buttons">
//           <button onClick={handlePrev}>⬅ Previous</button>
//           <button onClick={handleRepeat}>🔄 Repeat</button>
//           <button onClick={handleNext}>Next ➡</button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import "../styles/NumberTracing.css";

const numbersData = [
  { number: "1", word: "One", objects: ["🍎"] },
  { number: "2", word: "Two", objects: ["🍎", "🍎"] },
  { number: "3", word: "Three", objects: ["🍎", "🍎", "🍎"] },
  { number: "4", word: "Four", objects: ["⭐", "⭐", "⭐", "⭐"] },
  { number: "5", word: "Five", objects: ["🎈", "🎈", "🎈", "🎈", "🎈"] },
  { number: "6", word: "Six", objects: ["🐝", "🐝", "🐝", "🐝", "🐝", "🐝"] },
  { number: "7", word: "Seven", objects: ["🌸", "🌸", "🌸", "🌸", "🌸", "🌸", "🌸"] },
  { number: "8", word: "Eight", objects: ["🦋", "🦋", "🦋", "🦋", "🦋", "🦋", "🦋", "🦋"] },
  { number: "9", word: "Nine", objects: ["🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇", "🍇"] },
  { number: "10", word: "Ten", objects: ["🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟", "🌟"] },
];

export default function NumberTracing() {
  const canvasRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [glow, setGlow] = useState(false);
  const [message, setMessage] = useState("Trace the number carefully");
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
  });

  const currentNumber = numbersData[currentIndex];

  useEffect(() => {
    resetBoard();
  }, [currentIndex, step]);

  const getCanvas = () => canvasRef.current;

  const getContext = () => {
    const canvas = getCanvas();
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const clearCanvas = () => {
    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const resetBoard = () => {
    clearCanvas();
    setGlow(false);
    setIsDrawing(false);
    setMessage(getStepMessage(step));
  };

  const getStepMessage = (currentStep) => {
    if (currentStep === 1) return "Trace on the dotted number";
    if (currentStep === 2) return "Trace on the outline number";
    return "Write the number by yourself";
  };

  const getPointerPosition = (event) => {
    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    const ctx = getContext();
    if (!ctx) return;

    const pos = getPointerPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";

    setIsDrawing(true);
    setGlow(true);
    setMessage("Good! Keep tracing...");
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const ctx = getContext();
    if (!ctx) return;

    const pos = getPointerPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setGlow(true);
    setCompletedSteps((prev) => ({
      ...prev,
      [step]: true,
    }));

    if (step === 1) {
      setMessage("Great! Dotted tracing done");
    } else if (step === 2) {
      setMessage("Awesome! Outline tracing done");
    } else {
      setMessage("Wonderful! Free writing done");
    }
  };

  const handleRepeat = () => {
    clearCanvas();
    setGlow(false);
    setMessage(getStepMessage(step));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    setStep(1);
    setCompletedSteps({
      1: false,
      2: false,
      3: false,
    });
    setCurrentIndex((prev) => (prev + 1) % numbersData.length);
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      return;
    }

    const previousIndex =
      currentIndex === 0 ? numbersData.length - 1 : currentIndex - 1;

    setCurrentIndex(previousIndex);
    setStep(3);
    setCompletedSteps({
      1: false,
      2: false,
      3: false,
    });
  };

  const getGuideClass = () => {
    if (step === 1) return "trace-guide dotted-guide";
    if (step === 2) return "trace-guide outline-guide";
    return "trace-guide free-guide";
  };

  const getStepTitle = () => {
    if (step === 1) return "Step 1 - Dotted Trace";
    if (step === 2) return "Step 2 - Outline Trace";
    return "Step 3 - Free Writing";
  };

  return (
    <div className="number-tracing-page">
      <div className="trace-bg bubble1"></div>
      <div className="trace-bg bubble2"></div>
      <div className="trace-bg bubble3"></div>

      <header className="number-tracing-header">
        <h1>🔢 Magic Number Writing</h1>
        <p>See → Trace → Repeat → Write</p>
      </header>

      <div className="number-tracing-card">
        <div className="number-top-section">
          <div className="number-display-box">
            <div className="main-number">{currentNumber.number}</div>
            <div className="main-word">{currentNumber.word}</div>
          </div>

          <div className="objects-display-box">
            <h3>Count the objects</h3>
            <div className="objects-row">
              {currentNumber.objects.map((item, index) => (
                <span key={index} className="object-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="practice-header">
          <h2>{getStepTitle()}</h2>
          <p>{message}</p>
        </div>

        <div className={`trace-board ${glow ? "board-glow" : ""}`}>
          {step !== 3 && (
            <div className={getGuideClass()}>{currentNumber.number}</div>
          )}

          {step === 3 && (
            <div className="free-write-placeholder">
              Write {currentNumber.number} here
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={420}
            height={320}
            className="trace-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="step-progress">
          <div className={`step-dot ${step === 1 ? "active" : ""} ${completedSteps[1] ? "done" : ""}`}>
            1
          </div>
          <div className={`step-line ${completedSteps[1] ? "done-line" : ""}`}></div>
          <div className={`step-dot ${step === 2 ? "active" : ""} ${completedSteps[2] ? "done" : ""}`}>
            2
          </div>
          <div className={`step-line ${completedSteps[2] ? "done-line" : ""}`}></div>
          <div className={`step-dot ${step === 3 ? "active" : ""} ${completedSteps[3] ? "done" : ""}`}>
            3
          </div>
        </div>

        <div className="button-row">
          <button className="trace-btn" onClick={handlePrev}>
            ⬅ Previous
          </button>
          <button className="trace-btn repeat-btn" onClick={handleRepeat}>
            🔄 Repeat
          </button>
          <button className="trace-btn" onClick={handleNext}>
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}