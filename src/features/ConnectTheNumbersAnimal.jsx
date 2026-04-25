// import React, { useMemo, useRef, useState } from "react";
// import "../styles/ConnectTheNumbersAnimal.css";

// const HIT_RADIUS = 22;

// const levelsData = [
//   {
//     id:1,
//     title: "Level 1",
//     subtitle: "Easy",
//     unlocked: true,
//     animals: [
//       {
//         id: "fish",
//         name: "Fish",
//         emoji: "🐟",
//         points: [
//           { x: 550, y: 210 },
//           { x: 480, y: 140 },
//           { x: 380, y: 100 },
//           { x: 260, y: 100 },
//           { x: 170, y: 140 },
//           { x: 120, y: 210 },
//           { x: 170, y: 280 },
//           { x: 260, y: 320 },
//           { x: 380, y: 320 },
//           { x: 480, y: 280 },
//           { x: 550, y: 210 },
//           { x: 620, y: 140 },
//           { x: 620, y: 280 },
//           { x: 550, y: 210 },
//         ],
//         decorate: () => (
//           <>
//             <circle cx="210" cy="200" r="18" fill="white" stroke="#222" strokeWidth="4" />
//             <circle cx="215" cy="205" r="8" fill="#222" />
//             <path d="M160 235 Q200 260 240 235" fill="none" stroke="#222" strokeWidth="4" />
//           </>
//         ),
//       },
//       {
//         id: "bird",
//         name: "Bird",
//         emoji: "🐦",
//         points: [
//           { x: 180, y: 230 },
//           { x: 230, y: 160 },
//           { x: 320, y: 130 },
//           { x: 410, y: 150 },
//           { x: 470, y: 200 },
//           { x: 520, y: 185 },
//           { x: 570, y: 205 },
//           { x: 520, y: 230 },
//           { x: 470, y: 250 },
//           { x: 430, y: 310 },
//           { x: 350, y: 330 },
//           { x: 260, y: 310 },
//           { x: 200, y: 270 },
//           { x: 180, y: 230 },
//         ],
//         decorate: () => (
//           <>
//             <circle cx="435" cy="190" r="8" fill="#222" />
//             <line x1="320" y1="330" x2="310" y2="360" stroke="#222" strokeWidth="4" />
//             <line x1="380" y1="330" x2="390" y2="360" stroke="#222" strokeWidth="4" />
//           </>
//         ),
//       },
//       {
//         id: "turtle",
//         name: "Turtle",
//         emoji: "🐢",
//         points: [
//           { x: 150, y: 220 },
//           { x: 220, y: 140 },
//           { x: 320, y: 100 },
//           { x: 430, y: 130 },
//           { x: 520, y: 200 },
//           { x: 500, y: 270 },
//           { x: 420, y: 320 },
//           { x: 320, y: 350 },
//           { x: 220, y: 320 },
//           { x: 150, y: 260 },
//           { x: 150, y: 220 },
//         ],
//         decorate: () => (
//           <>
//             <circle cx="520" cy="200" r="10" fill="#222" />
//             <path
//               d="M260 160 L260 280 M210 210 L410 210 M210 210 L260 160 M260 160 L410 210 M210 210 L260 280 M260 280 L410 210"
//               fill="none"
//               stroke="#355b44"
//               strokeWidth="4"
//             />
//           </>
//         ),
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Level 2",
//     subtitle: "Basic",
//     unlocked: true,
//     animals: [
//       {
//         id: "rabbit",
//         name: "Rabbit",
//         emoji: "🐰",
//         points: [
//           { x: 300, y: 320 },
//           { x: 270, y: 220 },
//           { x: 280, y: 120 },
//           { x: 300, y: 40 },
//           { x: 330, y: 120 },
//           { x: 350, y: 160 },
//           { x: 370, y: 120 },
//           { x: 390, y: 40 },
//           { x: 410, y: 120 },
//           { x: 420, y: 220 },
//           { x: 390, y: 320 },
//           { x: 350, y: 350 },
//           { x: 320, y: 350 },
//           { x: 300, y: 320 },
//         ],
//         decorate: () => (
//           <>
//             <circle cx="320" cy="210" r="8" fill="#222" />
//             <circle cx="380" cy="210" r="8" fill="#222" />
//             <polygon points="340,240 360,240 350,258" fill="#ff6b6b" stroke="#222" strokeWidth="3" />
//           </>
//         ),
//       },
//       {
//         id: "butterfly",
//         name: "Butterfly",
//         emoji: "🦋",
//         points: [
//           { x: 350, y: 70 },
//           { x: 250, y: 120 },
//           { x: 200, y: 200 },
//           { x: 250, y: 300 },
//           { x: 330, y: 260 },
//           { x: 350, y: 210 },
//           { x: 370, y: 260 },
//           { x: 450, y: 300 },
//           { x: 500, y: 200 },
//           { x: 450, y: 120 },
//           { x: 350, y: 70 },
//         ],
//         decorate: () => (
//           <>
//             <line x1="350" y1="70" x2="350" y2="320" stroke="#222" strokeWidth="4" />
//             <circle cx="350" cy="60" r="14" fill="white" stroke="#222" strokeWidth="4" />
//           </>
//         ),
//       },
//       {
//         id: "cat",
//         name: "Cat",
//         emoji: "🐱",
//         points: [
//           { x: 220, y: 300 },
//           { x: 220, y: 180 },
//           { x: 270, y: 80 },
//           { x: 320, y: 160 },
//           { x: 380, y: 160 },
//           { x: 430, y: 80 },
//           { x: 480, y: 180 },
//           { x: 480, y: 300 },
//           { x: 400, y: 350 },
//           { x: 300, y: 350 },
//           { x: 220, y: 300 },
//         ],
//         decorate: () => (
//           <>
//             <circle cx="320" cy="230" r="10" fill="#222" />
//             <circle cx="380" cy="230" r="10" fill="#222" />
//             <polygon points="340,260 360,260 350,280" fill="#ff66b2" />
//           </>
//         ),
//       },
//     ],
//   },
// ];

// export default function ConnectNumbersAllInOne() {
//   const [screen, setScreen] = useState("levels");
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [selectedAnimal, setSelectedAnimal] = useState(null);

//   const [currentStep, setCurrentStep] = useState(1);
//   const [connectedLines, setConnectedLines] = useState([]);
//   const [message, setMessage] = useState("Start tracing from number 1.");
//   const [completed, setCompleted] = useState(false);
//   const [isTracing, setIsTracing] = useState(false);
//   const [dragLine, setDragLine] = useState(null);

//   const svgRef = useRef(null);

//   const numberedPoints = useMemo(() => {
//     if (!selectedAnimal) return [];
//     return selectedAnimal.points.map((point, index) => ({
//       ...point,
//       number: index + 1,
//     }));
//   }, [selectedAnimal]);

//   const resetGameState = () => {
//     setCurrentStep(1);
//     setConnectedLines([]);
//     setMessage("Start tracing from number 1.");
//     setCompleted(false);
//     setIsTracing(false);
//     setDragLine(null);
//   };

//   const handleSelectLevel = (level) => {
//     setSelectedLevel(level);
//     setScreen("animals");
//   };

//   const handleSelectAnimal = (animal) => {
//     setSelectedAnimal(animal);
//     resetGameState();
//     setScreen("game");
//   };

//   const handleBackToLevels = () => {
//     setSelectedLevel(null);
//     setSelectedAnimal(null);
//     resetGameState();
//     setScreen("levels");
//   };

//   const handleBackToAnimals = () => {
//     setSelectedAnimal(null);
//     resetGameState();
//     setScreen("animals");
//   };

//   const getSvgPoint = (event) => {
//     const svg = svgRef.current;
//     if (!svg) return null;

//     const rect = svg.getBoundingClientRect();
//     const scaleX = 700 / rect.width;
//     const scaleY = 420 / rect.height;

//     return {
//       x: (event.clientX - rect.left) * scaleX,
//       y: (event.clientY - rect.top) * scaleY,
//     };
//   };

//   const distance = (a, b) => {
//     return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
//   };

//   const handlePointerDown = (event) => {
//     if (completed || !selectedAnimal) return;

//     const point = getSvgPoint(event);
//     const startDot = numberedPoints[currentStep - 1];

//     if (!point || !startDot) return;

//     if (distance(point, startDot) <= HIT_RADIUS) {
//       setIsTracing(true);
//       setDragLine({
//         x1: startDot.x,
//         y1: startDot.y,
//         x2: point.x,
//         y2: point.y,
//       });
//       setMessage(
//         currentStep === numberedPoints.length
//           ? `Trace to finish at number ${currentStep}.`
//           : `Now trace from ${currentStep} to ${currentStep + 1}.`
//       );
//     } else {
//       setMessage(`Start from number ${currentStep}.`);
//     }
//   };

//   const handlePointerMove = (event) => {
//     if (!isTracing || completed || !selectedAnimal) return;

//     const point = getSvgPoint(event);
//     const startDot = numberedPoints[currentStep - 1];

//     if (!point || !startDot) return;

//     setDragLine({
//       x1: startDot.x,
//       y1: startDot.y,
//       x2: point.x,
//       y2: point.y,
//     });
//   };

//   const handlePointerUp = (event) => {
//     if (!isTracing || completed || !selectedAnimal) return;

//     const point = getSvgPoint(event);
//     const startDot = numberedPoints[currentStep - 1];
//     const nextDot = numberedPoints[currentStep];

//     if (!point || !startDot) {
//       setIsTracing(false);
//       setDragLine(null);
//       return;
//     }

//     if (!nextDot) {
//       setIsTracing(false);
//       setDragLine(null);
//       setCompleted(true);
//       setMessage(`Awesome! You finished the ${selectedAnimal.emoji} ${selectedAnimal.name}.`);
//       return;
//     }

//     if (distance(point, nextDot) <= HIT_RADIUS) {
//       setConnectedLines((prev) => [
//         ...prev,
//         {
//           x1: startDot.x,
//           y1: startDot.y,
//           x2: nextDot.x,
//           y2: nextDot.y,
//         },
//       ]);

//       const newStep = currentStep + 1;
//       setCurrentStep(newStep);

//       if (newStep === numberedPoints.length) {
//         setCompleted(true);
//         setMessage(`Awesome! You finished the ${selectedAnimal.emoji} ${selectedAnimal.name}.`);
//       } else {
//         setMessage(`Good! Now trace from ${newStep} to ${newStep + 1}.`);
//       }
//     } else {
//       setMessage(`Try again. Trace from ${currentStep} to ${currentStep + 1}.`);
//     }

//     setIsTracing(false);
//     setDragLine(null);
//   };

//   if (screen === "levels") {
//     return (
//       <div className="connect-page">
//         <div className="connect-card">
//           <div className="top-section">
//             <h1>🔢 Connect the Numbers</h1>
//             <p>Choose a level and start tracing the animal dots.</p>
//           </div>

//           <div className="levels-grid">
//             {levelsData.map((level) => (
//               <button
//                 key={level.id}
//                 className={`level-card ${!level.unlocked ? "locked" : ""}`}
//                 onClick={() => level.unlocked && handleSelectLevel(level)}
//                 disabled={!level.unlocked}
//               >
//                 <div className="level-badge">{level.id}</div>
//                 <h2>{level.title}</h2>
//                 <p>{level.subtitle}</p>
//                 <span>{level.unlocked ? "Open" : "Locked"}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (screen === "animals" && selectedLevel) {
//     return (
//       <div className="connect-page">
//         <div className="connect-card">
//           <div className="top-section">
//             <button className="back-btn" onClick={handleBackToLevels}>
//               ← Back
//             </button>
//             <h1>{selectedLevel.title} - Animals</h1>
//             <p>Choose an animal to start tracing.</p>
//           </div>

//           <div className="animals-grid">
//             {selectedLevel.animals.map((animal) => (
//               <button
//                 key={animal.id}
//                 className="animal-card"
//                 onClick={() => handleSelectAnimal(animal)}
//               >
//                 <div className="animal-emoji">{animal.emoji}</div>
//                 <h2>{animal.name}</h2>
//                 <p>{animal.points.length} dots</p>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="connect-page">
//       <div className="connect-card">
//         <div className="top-section">
//           <button className="back-btn" onClick={handleBackToAnimals}>
//             ← Back
//           </button>
//           <h1>
//             {selectedAnimal.emoji} {selectedAnimal.name}
//           </h1>
//           <p>Trace the dots in correct order.</p>
//         </div>

//         <div className="game-layout">
//           <div className="canvas-box">
//             <svg
//               ref={svgRef}
//               viewBox="0 0 700 420"
//               className="connect-svg"
//               onPointerDown={handlePointerDown}
//               onPointerMove={handlePointerMove}
//               onPointerUp={handlePointerUp}
//               onPointerLeave={handlePointerUp}
//             >
//               {connectedLines.map((line, index) => (
//                 <line
//                   key={index}
//                   x1={line.x1}
//                   y1={line.y1}
//                   x2={line.x2}
//                   y2={line.y2}
//                   stroke="#222"
//                   strokeWidth="4"
//                   strokeLinecap="round"
//                 />
//               ))}

//               {dragLine && (
//                 <line
//                   x1={dragLine.x1}
//                   y1={dragLine.y1}
//                   x2={dragLine.x2}
//                   y2={dragLine.y2}
//                   stroke="#222"
//                   strokeWidth="4"
//                   strokeLinecap="round"
//                 />
//               )}

//               {completed && selectedAnimal.decorate()}

//               {numberedPoints.map((point) => {
//                 const isCurrent = point.number === currentStep;
//                 const isDone = point.number < currentStep || completed;

//                 return (
//                   <g key={point.number}>
//                     <circle
//                       cx={point.x}
//                       cy={point.y}
//                       r={isCurrent ? 7 : 4}
//                       fill={isCurrent ? "#73c943" : "#222"}
//                       stroke={isCurrent ? "#184c35" : "none"}
//                       strokeWidth={isCurrent ? 2 : 0}
//                     />
//                     <text
//                       x={point.x - 14}
//                       y={point.y - 8}
//                       textAnchor="middle"
//                       className={`dot-number ${isDone ? "done-dot-number" : ""}`}
//                     >
//                       {point.number}
//                     </text>
//                   </g>
//                 );
//               })}
//             </svg>

//             <div className="status-box">
//               <p>{message}</p>
//               <span>
//                 Step: {Math.min(currentStep, numberedPoints.length)} / {numberedPoints.length}
//               </span>
//             </div>

//             {completed && (
//               <div className="done-box">
//                 🎉 {selectedAnimal.emoji} You completed the animal!
//               </div>
//             )}
//           </div>

//           <div className="side-box">
//             <h3>How to Play</h3>

//             <div className="info-card">
//               <p>1. Start from the green dot</p>
//               <p>2. Drag to the next number</p>
//               <p>3. Complete the full animal</p>
//             </div>

//             <div className="preview-card">
//               <div className="preview-circle">{completed ? "✓" : currentStep}</div>
//               <span>{completed ? "Finished" : "Current Step"}</span>
//             </div>

//             <div className="btn-group">
//               <button className="reset-btn" onClick={resetGameState}>
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useMemo, useRef, useState } from "react";
import "../styles/ConnectTheNumbersAnimal.css";

const HIT_RADIUS = 24;

const animals = [
  {
    id: "fish",
    name: "Fish",
    emoji: "🐟",
    points: [
      { x: 520, y: 210 },
      { x: 470, y: 145 },
      { x: 390, y: 110 },
      { x: 290, y: 100 },
      { x: 200, y: 120 },
      { x: 140, y: 165 },
      { x: 120, y: 210 },
      { x: 140, y: 255 },
      { x: 200, y: 300 },
      { x: 290, y: 320 },
      { x: 390, y: 310 },
      { x: 470, y: 275 },
      { x: 520, y: 210 },
      { x: 600, y: 145 },
      { x: 600, y: 275 },
      { x: 520, y: 210 },
    ],
    guide: () => (
      <>
        <ellipse cx="315" cy="210" rx="200" ry="112" className="guide-shape" />
        <polygon points="520,210 600,145 600,275" className="guide-shape" />
        <polygon points="290,105 355,55 390,135" className="guide-shape" />
        <circle cx="190" cy="190" r="20" className="guide-shape" />
        <path d="M155 228 Q185 245 218 228" className="guide-line" />
        <path d="M295 132 Q330 210 295 288" className="guide-line" />
        <path d="M355 142 Q390 210 355 278" className="guide-line" />
      </>
    ),
    decorate: () => (
      <>
        <ellipse cx="315" cy="210" rx="200" ry="112" className="final-shape" />
        <polygon points="520,210 600,145 600,275" className="final-shape" />
        <polygon points="290,105 355,55 390,135" className="final-shape" />
        <circle cx="190" cy="190" r="20" fill="white" stroke="#222" strokeWidth="4" />
        <circle cx="196" cy="196" r="8" fill="#222" />
        <path d="M155 228 Q185 245 218 228" fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <path d="M295 132 Q330 210 295 288" fill="none" stroke="#222" strokeWidth="4" />
        <path d="M355 142 Q390 210 355 278" fill="none" stroke="#222" strokeWidth="4" />
      </>
    ),
  },
  {
    id: "turtle",
    name: "Turtle",
    emoji: "🐢",
    points: [
      { x: 170, y: 220 },
      { x: 220, y: 145 },
      { x: 315, y: 110 },
      { x: 415, y: 125 },
      { x: 500, y: 180 },
      { x: 550, y: 205 },
      { x: 520, y: 245 },
      { x: 485, y: 250 },
      { x: 440, y: 315 },
      { x: 390, y: 285 },
      { x: 315, y: 335 },
      { x: 240, y: 285 },
      { x: 190, y: 315 },
      { x: 150, y: 250 },
      { x: 170, y: 220 },
    ],
    guide: () => (
      <>
        <ellipse cx="330" cy="220" rx="165" ry="105" className="guide-shape" />
        <circle cx="545" cy="205" r="28" className="guide-shape" />
        <ellipse cx="225" cy="138" rx="26" ry="18" className="guide-shape" />
        <ellipse cx="430" cy="138" rx="26" ry="18" className="guide-shape" />
        <ellipse cx="225" cy="304" rx="26" ry="18" className="guide-shape" />
        <ellipse cx="430" cy="304" rx="26" ry="18" className="guide-shape" />
        <polygon points="155,220 122,208 122,232" className="guide-shape" />
        <path d="M280 145 L280 295" className="guide-line" />
        <path d="M220 185 L440 185" className="guide-line" />
        <path d="M220 255 L440 255" className="guide-line" />
        <path d="M220 185 L280 145 L440 185 L440 255 L280 295 L220 255 Z" className="guide-line" />
      </>
    ),
    decorate: () => (
      <>
        <ellipse cx="330" cy="220" rx="165" ry="105" className="final-shape" />
        <circle cx="545" cy="205" r="28" className="final-shape" />
        <ellipse cx="225" cy="138" rx="26" ry="18" className="final-shape" />
        <ellipse cx="430" cy="138" rx="26" ry="18" className="final-shape" />
        <ellipse cx="225" cy="304" rx="26" ry="18" className="final-shape" />
        <ellipse cx="430" cy="304" rx="26" ry="18" className="final-shape" />
        <polygon points="155,220 122,208 122,232" className="final-shape" />
        <circle cx="552" cy="198" r="4" fill="#222" />
        <path d="M280 145 L280 295" fill="none" stroke="#355b44" strokeWidth="4" />
        <path d="M220 185 L440 185" fill="none" stroke="#355b44" strokeWidth="4" />
        <path d="M220 255 L440 255" fill="none" stroke="#355b44" strokeWidth="4" />
        <path d="M220 185 L280 145 L440 185 L440 255 L280 295 L220 255 Z" fill="none" stroke="#355b44" strokeWidth="4" />
      </>
    ),
  },
  {
    id: "rabbit",
    name: "Rabbit",
    emoji: "🐰",
    points: [
      { x: 280, y: 315 },
      { x: 250, y: 225 },
      { x: 255, y: 130 },
      { x: 280, y: 40 },
      { x: 315, y: 130 },
      { x: 350, y: 160 },
      { x: 385, y: 130 },
      { x: 410, y: 40 },
      { x: 435, y: 130 },
      { x: 440, y: 225 },
      { x: 410, y: 315 },
      { x: 360, y: 352 },
      { x: 320, y: 330 },
      { x: 290, y: 352 },
      { x: 280, y: 315 },
    ],
    guide: () => (
      <>
        <ellipse cx="345" cy="230" rx="100" ry="105" className="guide-shape" />
        <ellipse cx="292" cy="86" rx="28" ry="82" className="guide-shape" />
        <ellipse cx="398" cy="86" rx="28" ry="82" className="guide-shape" />
        <circle cx="312" cy="215" r="10" className="guide-eye" />
        <circle cx="378" cy="215" r="10" className="guide-eye" />
        <polygon points="335,242 355,242 345,258" className="guide-shape" />
        <path d="M345 258 Q332 275 325 290" className="guide-line" />
        <path d="M345 258 Q358 275 365 290" className="guide-line" />
      </>
    ),
    decorate: () => (
      <>
        <ellipse cx="345" cy="230" rx="100" ry="105" className="final-shape" />
        <ellipse cx="292" cy="86" rx="28" ry="82" className="final-shape" />
        <ellipse cx="398" cy="86" rx="28" ry="82" className="final-shape" />
        <circle cx="312" cy="215" r="10" fill="#222" />
        <circle cx="378" cy="215" r="10" fill="#222" />
        <polygon points="335,242 355,242 345,258" fill="#ff6b6b" stroke="#222" strokeWidth="3" />
        <path d="M345 258 Q332 275 325 290" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M345 258 Q358 275 365 290" fill="none" stroke="#222" strokeWidth="3" />
      </>
    ),
  },
  {
    id: "butterfly",
    name: "Butterfly",
    emoji: "🦋",
    points: [
      { x: 350, y: 70 },
      { x: 250, y: 115 },
      { x: 195, y: 190 },
      { x: 245, y: 295 },
      { x: 325, y: 255 },
      { x: 350, y: 205 },
      { x: 375, y: 255 },
      { x: 455, y: 295 },
      { x: 505, y: 190 },
      { x: 450, y: 115 },
      { x: 350, y: 70 },
      { x: 350, y: 320 },
    ],
    guide: () => (
      <>
        <ellipse cx="270" cy="155" rx="82" ry="68" className="guide-shape" />
        <ellipse cx="270" cy="270" rx="82" ry="62" className="guide-shape" />
        <ellipse cx="430" cy="155" rx="82" ry="68" className="guide-shape" />
        <ellipse cx="430" cy="270" rx="82" ry="62" className="guide-shape" />
        <rect x="334" y="92" width="32" height="190" rx="16" className="guide-shape" />
        <circle cx="350" cy="70" r="18" className="guide-shape" />
        <path d="M342 54 L325 25" className="guide-line" />
        <path d="M358 54 L375 25" className="guide-line" />
      </>
    ),
    decorate: () => (
      <>
        <ellipse cx="270" cy="155" rx="82" ry="68" className="final-shape" />
        <ellipse cx="270" cy="270" rx="82" ry="62" className="final-shape" />
        <ellipse cx="430" cy="155" rx="82" ry="68" className="final-shape" />
        <ellipse cx="430" cy="270" rx="82" ry="62" className="final-shape" />
        <rect x="334" y="92" width="32" height="190" rx="16" className="final-shape" />
        <circle cx="350" cy="70" r="18" className="final-shape" />
        <path d="M342 54 L325 25" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M358 54 L375 25" fill="none" stroke="#222" strokeWidth="3" />
        <circle cx="325" cy="25" r="4" fill="#222" />
        <circle cx="375" cy="25" r="4" fill="#222" />
      </>
    ),
  },
  {
    id: "cat",
    name: "Cat",
    emoji: "🐱",
    points: [
      { x: 230, y: 300 },
      { x: 230, y: 180 },
      { x: 275, y: 85 },
      { x: 322, y: 160 },
      { x: 378, y: 160 },
      { x: 425, y: 85 },
      { x: 470, y: 180 },
      { x: 470, y: 300 },
      { x: 400, y: 350 },
      { x: 300, y: 350 },
      { x: 230, y: 300 },
    ],
    guide: () => (
      <>
        <circle cx="350" cy="235" r="118" className="guide-shape" />
        <polygon points="260,150 290,72 325,150" className="guide-shape" />
        <polygon points="375,150 410,72 440,150" className="guide-shape" />
        <circle cx="315" cy="225" r="10" className="guide-eye" />
        <circle cx="385" cy="225" r="10" className="guide-eye" />
        <polygon points="340,255 360,255 350,272" className="guide-shape" />
        <path d="M350 272 Q332 288 324 302" className="guide-line" />
        <path d="M350 272 Q368 288 376 302" className="guide-line" />
        <path d="M240 250 L315 245" className="guide-line" />
        <path d="M240 270 L315 265" className="guide-line" />
        <path d="M385 245 L460 250" className="guide-line" />
        <path d="M385 265 L460 270" className="guide-line" />
      </>
    ),
    decorate: () => (
      <>
        <circle cx="350" cy="235" r="118" className="final-shape" />
        <polygon points="260,150 290,72 325,150" className="final-shape" />
        <polygon points="375,150 410,72 440,150" className="final-shape" />
        <circle cx="315" cy="225" r="10" fill="#222" />
        <circle cx="385" cy="225" r="10" fill="#222" />
        <polygon points="340,255 360,255 350,272" fill="#ff66b2" stroke="#222" strokeWidth="3" />
        <path d="M350 272 Q332 288 324 302" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M350 272 Q368 288 376 302" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M240 250 L315 245" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M240 270 L315 265" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M385 245 L460 250" fill="none" stroke="#222" strokeWidth="3" />
        <path d="M385 265 L460 270" fill="none" stroke="#222" strokeWidth="3" />
      </>
    ),
  },
  {
    id: "bird",
    name: "Bird",
    emoji: "🐦",
    points: [
      { x: 190, y: 230 },
      { x: 240, y: 160 },
      { x: 325, y: 130 },
      { x: 410, y: 145 },
      { x: 470, y: 190 },
      { x: 535, y: 180 },
      { x: 575, y: 205 },
      { x: 535, y: 230 },
      { x: 480, y: 248 },
      { x: 440, y: 312 },
      { x: 360, y: 335 },
      { x: 275, y: 310 },
      { x: 210, y: 270 },
      { x: 190, y: 230 },
    ],
    guide: () => (
      <>
        <ellipse cx="335" cy="230" rx="155" ry="102" className="guide-shape" />
        <ellipse cx="350" cy="235" rx="70" ry="46" className="guide-shape" />
        <polygon points="470,190 548,170 548,210" className="guide-shape" />
        <polygon points="195,225 132,178 145,255" className="guide-shape" />
        <circle cx="420" cy="195" r="9" className="guide-eye" />
        <line x1="290" y1="325" x2="282" y2="356" className="guide-line" />
        <line x1="360" y1="325" x2="368" y2="356" className="guide-line" />
      </>
    ),
    decorate: () => (
      <>
        <ellipse cx="335" cy="230" rx="155" ry="102" className="final-shape" />
        <ellipse cx="350" cy="235" rx="70" ry="46" className="final-shape" />
        <polygon points="470,190 548,170 548,210" className="final-shape" />
        <polygon points="195,225 132,178 145,255" className="final-shape" />
        <circle cx="420" cy="195" r="9" fill="#222" />
        <line x1="290" y1="325" x2="282" y2="356" stroke="#222" strokeWidth="4" />
        <line x1="360" y1="325" x2="368" y2="356" stroke="#222" strokeWidth="4" />
      </>
    ),
  },
];

export default function ConnectTheNumbersAnimal() {
  const [animalIndex, setAnimalIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [connectedLines, setConnectedLines] = useState([]);
  const [message, setMessage] = useState("Start tracing from number 1.");
  const [completed, setCompleted] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [dragLine, setDragLine] = useState(null);

  const svgRef = useRef(null);
  const animal = animals[animalIndex];

  const numberedPoints = useMemo(() => {
    return animal.points.map((point, index) => ({
      ...point,
      number: index + 1,
    }));
  }, [animal]);

  const resetGame = () => {
    setCurrentStep(1);
    setConnectedLines([]);
    setMessage("Start tracing from number 1.");
    setCompleted(false);
    setIsTracing(false);
    setDragLine(null);
  };

  const nextAnimal = () => {
    const nextIndex = (animalIndex + 1) % animals.length;
    setAnimalIndex(nextIndex);
    setCurrentStep(1);
    setConnectedLines([]);
    setMessage("Start tracing from number 1.");
    setCompleted(false);
    setIsTracing(false);
    setDragLine(null);
  };

  const getSvgPoint = (event) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    const scaleX = 700 / rect.width;
    const scaleY = 420 / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const distance = (a, b) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  };

  const handlePointerDown = (event) => {
    if (completed) return;

    const point = getSvgPoint(event);
    const startDot = numberedPoints[currentStep - 1];

    if (!point || !startDot) return;

    if (distance(point, startDot) <= HIT_RADIUS) {
      setIsTracing(true);
      setDragLine({
        x1: startDot.x,
        y1: startDot.y,
        x2: point.x,
        y2: point.y,
      });
      setMessage(
        currentStep === numberedPoints.length
          ? `Trace to finish at number ${currentStep}.`
          : `Now trace from ${currentStep} to ${currentStep + 1}.`
      );
    } else {
      setMessage(`Start from number ${currentStep}.`);
    }
  };

  const handlePointerMove = (event) => {
    if (!isTracing || completed) return;

    const point = getSvgPoint(event);
    const startDot = numberedPoints[currentStep - 1];

    if (!point || !startDot) return;

    setDragLine({
      x1: startDot.x,
      y1: startDot.y,
      x2: point.x,
      y2: point.y,
    });
  };

  const handlePointerUp = (event) => {
    if (!isTracing || completed) return;

    const point = getSvgPoint(event);
    const startDot = numberedPoints[currentStep - 1];
    const nextDot = numberedPoints[currentStep];

    if (!point || !startDot) {
      setIsTracing(false);
      setDragLine(null);
      return;
    }

    if (!nextDot) {
      setIsTracing(false);
      setDragLine(null);
      setCompleted(true);
      setMessage(`Awesome! You finished the ${animal.emoji} ${animal.name}.`);
      return;
    }

    if (distance(point, nextDot) <= HIT_RADIUS) {
      setConnectedLines((prev) => [
        ...prev,
        {
          x1: startDot.x,
          y1: startDot.y,
          x2: nextDot.x,
          y2: nextDot.y,
        },
      ]);

      const newStep = currentStep + 1;
      setCurrentStep(newStep);

      if (newStep === numberedPoints.length) {
        setCompleted(true);
        setMessage(`Awesome! You finished the ${animal.emoji} ${animal.name}.`);
      } else {
        setMessage(`Good! Now trace from ${newStep} to ${newStep + 1}.`);
      }
    } else {
      setMessage(`Try again. Trace from ${currentStep} to ${currentStep + 1}.`);
    }

    setIsTracing(false);
    setDragLine(null);
  };

  return (
    <div className="connect-animal-page">
      <div className="connect-animal-card">
        <div className="connect-top-bar">
          <h1>🔢 Connect the Numbers Animals</h1>
          <p>Clear guide picture + tracing dots for each animal.</p>
        </div>

        <div className="connect-layout">
          <div className="canvas-box">
            <h2>
              {animal.emoji} {animal.name}
            </h2>

            <svg
              ref={svgRef}
              viewBox="0 0 700 420"
              className="connect-svg"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {!completed && animal.guide()}

              {connectedLines.map((line, index) => (
                <line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#222"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ))}

              {dragLine && (
                <line
                  x1={dragLine.x1}
                  y1={dragLine.y1}
                  x2={dragLine.x2}
                  y2={dragLine.y2}
                  stroke="#222"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}

              {completed && animal.decorate()}

              {numberedPoints.map((point) => {
                const isCurrent = point.number === currentStep;
                const isDone = point.number < currentStep || completed;

                return (
                  <g key={point.number}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isCurrent ? 8 : 5}
                      className={isCurrent ? "current-dot" : "normal-dot"}
                    />
                    <text
                      x={point.x - 14}
                      y={point.y - 10}
                      textAnchor="middle"
                      className={`dot-number ${isDone ? "done-dot-number" : ""}`}
                    >
                      {point.number}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="status-box">
              <p>{message}</p>
              <span>
                Step: {Math.min(currentStep, numberedPoints.length)} / {numberedPoints.length}
              </span>
            </div>

            {completed && (
              <div className="done-box">
                🎉 {animal.emoji} You completed the {animal.name}!
              </div>
            )}
          </div>

          <div className="side-box">
            <h3>How to Play</h3>

            <div className="info-card">
              <p>1. Start from the green dot</p>
              <p>2. Drag to the next number</p>
              <p>3. Follow the clear animal guide</p>
            </div>

            <div className="preview-card">
              <div className="preview-circle">{completed ? "✓" : currentStep}</div>
              <span>{completed ? "Finished" : "Current Step"}</span>
            </div>

            <div className="animal-list-box">
              <h4>Animals</h4>
              <div className="animal-list">
                {animals.map((item, index) => (
                  <button
                    key={item.id}
                    className={`animal-switch ${animalIndex === index ? "active-switch" : ""}`}
                    onClick={() => {
                      setAnimalIndex(index);
                      resetGame();
                    }}
                  >
                    {item.emoji} {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="btn-group">
              <button className="reset-btn" onClick={resetGame}>
                Reset
              </button>
              <button className="next-btn" onClick={nextAnimal}>
                Next Animal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}