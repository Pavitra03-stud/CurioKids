// import React, { useEffect, useRef, useState } from "react";
// import "../styles/SlowLearning.css";

// /*
// Slow Learning Flow:

// 1. Watch animation
// 2. Trace number
// 3. Color feedback
// 4. Repeat if needed
// 5. Mini game
// 6. Next number
// */

// const generateNumbers = (max) => {
//   const data = [];

//   for (let i = 1; i <= max; i++) {
//     data.push({
//       number: i,
//       objects: Array(i > 5 ? 5 : i).fill("🍎"),
//     });
//   }

//   return data;
// };

// export default function SlowLearning() {
//   const canvasRef = useRef(null);

//   const [numbers] = useState(generateNumbers(10));
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [step, setStep] = useState("animation");
//   const [repeatCount, setRepeatCount] = useState(0);
//   const [boardColor, setBoardColor] = useState("#fffef8");

//   const currentNumber = numbers[currentIndex];

//   /* Animation before tracing */

//   useEffect(() => {
//     if (step === "animation") {
//       const timer = setTimeout(() => {
//         setStep("tracing");
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [step]);

//   /* Canvas helpers */

//   const getContext = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;
//     return canvas.getContext("2d");
//   };

//   const clearCanvas = () => {
//     const ctx = getContext();
//     if (!ctx) return;

//     ctx.clearRect(0, 0, 420, 320);
//   };

//   const startDrawing = (e) => {
//     if (step !== "tracing") return;

//     const ctx = getContext();
//     if (!ctx) return;

//     ctx.beginPath();
//     ctx.moveTo(
//       e.nativeEvent.offsetX,
//       e.nativeEvent.offsetY
//     );
//   };

//   const draw = (e) => {
//     if (step !== "tracing") return;

//     const ctx = getContext();
//     if (!ctx) return;

//     ctx.lineWidth = 8;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = "black";

//     ctx.lineTo(
//       e.nativeEvent.offsetX,
//       e.nativeEvent.offsetY
//     );

//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     if (step !== "tracing") return;

//     /* Color feedback */

//     const success = Math.random() > 0.3;

//     if (success) {
//       setBoardColor("#6fd16f");

//       setTimeout(() => {
//         setStep("game");
//       }, 1000);

//     } else {
//       setBoardColor("#ffa726");

//       if (repeatCount < 2) {
//         setRepeatCount((c) => c + 1);

//         setTimeout(() => {
//           clearCanvas();
//           setBoardColor("#fffef8");
//         }, 1500);

//       } else {
//         setStep("game");
//       }
//     }
//   };

//   /* Mini game answer */

//   const handleAnswer = (num) => {
//     if (num === currentNumber.number) {
//       alert("Great job! ⭐");

//       nextNumber();
//     } else {
//       alert("Try again");
//     }
//   };

//   const nextNumber = () => {
//     setCurrentIndex((prev) =>
//       (prev + 1) % numbers.length
//     );

//     setStep("animation");
//     setRepeatCount(0);
//     setBoardColor("#fffef8");

//     clearCanvas();
//   };

//   return (
//     <div className="slow-learning-page">

//       <header className="slow-header">
//         <h1>Slow Learning Mode</h1>
//       </header>

//       <div className="slow-card">

//         <div className="number-box">
//           <div className="number-text">
//             {currentNumber.number}
//           </div>
//         </div>

//         {step === "animation" && (
//           <h2>
//             Watch how to write the number...
//           </h2>
//         )}

//         {step === "tracing" && (
//           <h2>
//             Trace the number
//           </h2>
//         )}

//         <div
//           className="trace-board"
//           style={{
//             background: boardColor,
//           }}
//         >
//           <canvas
//             ref={canvasRef}
//             width={420}
//             height={320}
//             className="trace-canvas"
//             onMouseDown={startDrawing}
//             onMouseMove={draw}
//             onMouseUp={stopDrawing}
//             onMouseLeave={stopDrawing}
//           />
//         </div>

//         {step === "game" && (
//           <div className="game-section">

//             <h3>
//               Count the objects
//             </h3>

//             <div className="objects-row">
//               {currentNumber.objects.map(
//                 (o, i) => (
//                   <span
//                     key={i}
//                     className="object-item"
//                   >
//                     {o}
//                   </span>
//                 )
//               )}
//             </div>

//             <div className="answer-buttons">
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <button
//                   key={n}
//                   className="answer-btn"
//                   onClick={() =>
//                     handleAnswer(n)
//                   }
//                 >
//                   {n}
//                 </button>
//               ))}
//             </div>

//           </div>
//         )}

//       </div>

//     </div>
//   );
// }





import React, { useState } from "react";
import "../styles/NumberTracing.css";

/*
IDEA 2: NUMBER – OBJECT ASSOCIATION

FLOW:
1. Show objects
2. Child counts objects
3. Child selects correct number
4. Feedback message shown
*/

const icons = ["🍎", "⭐", "🎈", "🐝", "🌸"];

const generateQuestion = () => {
  const number = Math.floor(Math.random() * 5) + 1; // 1 to 5

  return {
    number,
    objects: Array(number).fill(
      icons[Math.floor(Math.random() * icons.length)]
    ),
  };
};

export default function NumberObjectAssociation() {
  const [question, setQuestion] = useState(generateQuestion());
  const [message, setMessage] = useState(
    "Count the objects and choose the number"
  );

  const handleChoice = (num) => {
    if (num === question.number) {
      setMessage("Great job! ⭐");

      setTimeout(() => {
        setQuestion(generateQuestion());
        setMessage(
          "Count the objects and choose the number"
        );
      }, 1500);

    } else {
      setMessage("Let's try again");
    }
  };

  return (
    <div className="number-tracing-page">

      <header className="number-tracing-header">
        <h1>Number Association</h1>
        <p>{message}</p>
      </header>

      <div className="number-tracing-card">

        {/* OBJECTS DISPLAY */}

        <div className="objects-display-box">
          <h3>Count the objects</h3>

          <div className="objects-row">
            {question.objects.map((item, index) => (
              <span
                key={index}
                className="object-item"
              >
                {item}
              </span>
            ))}
          </div>

        </div>

        {/* NUMBER OPTIONS */}

        <div className="button-row">

          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className="trace-btn"
              onClick={() => handleChoice(n)}
            >
              {n}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}
