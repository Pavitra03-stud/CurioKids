// import React, { useMemo, useState } from "react";
// import "../styles/AlphabetLetterTracing.css";

// const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// const animalMap = {
//   A: { name: "Ant", emoji: "🐜" },
//   B: { name: "Bear", emoji: "🐻" },
//   C: { name: "Cat", emoji: "🐱" },
//   D: { name: "Dog", emoji: "🐶" },
//   E: { name: "Elephant", emoji: "🐘" },
//   F: { name: "Fish", emoji: "🐟" },
//   G: { name: "Goat", emoji: "🐐" },
//   H: { name: "Horse", emoji: "🐴" },
//   I: { name: "Iguana", emoji: "🦎" },
//   J: { name: "Jellyfish", emoji: "🪼" },
//   K: { name: "Koala", emoji: "🐨" },
//   L: { name: "Lion", emoji: "🦁" },
//   M: { name: "Monkey", emoji: "🐵" },
//   N: { name: "Nest Bird", emoji: "🐦" },
//   O: { name: "Owl", emoji: "🦉" },
//   P: { name: "Panda", emoji: "🐼" },
//   Q: { name: "Quail", emoji: "🐤" },
//   R: { name: "Rabbit", emoji: "🐰" },
//   S: { name: "Snake", emoji: "🐍" },
//   T: { name: "Tiger", emoji: "🐯" },
//   U: { name: "Unicorn", emoji: "🦄" },
//   V: { name: "Vulture", emoji: "🦅" },
//   W: { name: "Whale", emoji: "🐋" },
//   X: { name: "X-Ray Fish", emoji: "🐠" },
//   Y: { name: "Yak", emoji: "🐂" },
//   Z: { name: "Zebra", emoji: "🦓" }
// };

// function getLetterData(letter) {
//   const map = {
//     A: {
//       guidePath: "M160 305 L250 90 L340 305 M195 225 L305 225",
//       points: [
//         { x: 160, y: 305, label: "1" },
//         { x: 250, y: 90, label: "2" },
//         { x: 340, y: 305, label: "3" },
//         { x: 195, y: 225, label: "4" },
//         { x: 305, y: 225, label: "5" }
//       ],
//       segments: [
//         "M160 305 L250 90",
//         "M250 90 L340 305",
//         "M195 225 L305 225"
//       ]
//     },
//     B: {
//       guidePath:
//         "M170 90 L170 305 M170 90 C315 90 315 190 170 190 M170 190 C315 190 315 305 170 305",
//       points: [
//         { x: 170, y: 90, label: "1" },
//         { x: 170, y: 305, label: "2" },
//         { x: 295, y: 140, label: "3" },
//         { x: 170, y: 190, label: "4" },
//         { x: 295, y: 255, label: "5" }
//       ],
//       segments: [
//         "M170 90 L170 305",
//         "M170 90 C315 90 315 190 170 190",
//         "M170 190 C315 190 315 305 170 305"
//       ]
//     },
//     C: {
//       guidePath: "M320 120 C230 80 160 120 160 198 C160 270 230 310 320 275",
//       points: [
//         { x: 320, y: 120, label: "1" },
//         { x: 235, y: 95, label: "2" },
//         { x: 160, y: 198, label: "3" },
//         { x: 235, y: 295, label: "4" },
//         { x: 320, y: 275, label: "5" }
//       ],
//       segments: [
//         "M320 120 C270 90 215 90 180 130",
//         "M180 130 C150 160 150 230 180 260",
//         "M180 260 C215 300 270 300 320 275"
//       ]
//     },
//     D: {
//       guidePath: "M180 90 L180 305 C340 285 340 110 180 90",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 180, y: 305, label: "2" },
//         { x: 315, y: 260, label: "3" },
//         { x: 315, y: 135, label: "4" },
//         { x: 180, y: 90, label: "5" }
//       ],
//       segments: [
//         "M180 90 L180 305",
//         "M180 305 C340 285 340 110 180 90"
//       ]
//     },
//     E: {
//       guidePath: "M310 90 L180 90 L180 305 L310 305 M180 198 L285 198",
//       points: [
//         { x: 310, y: 90, label: "1" },
//         { x: 180, y: 90, label: "2" },
//         { x: 180, y: 305, label: "3" },
//         { x: 285, y: 198, label: "4" },
//         { x: 310, y: 305, label: "5" }
//       ],
//       segments: [
//         "M310 90 L180 90",
//         "M180 90 L180 305",
//         "M180 198 L285 198",
//         "M180 305 L310 305"
//       ]
//     },
//     F: {
//       guidePath: "M180 90 L180 305 M180 90 L310 90 M180 198 L285 198",
//       points: [
//         { x: 180, y: 305, label: "1" },
//         { x: 180, y: 90, label: "2" },
//         { x: 310, y: 90, label: "3" },
//         { x: 180, y: 198, label: "4" },
//         { x: 285, y: 198, label: "5" }
//       ],
//       segments: [
//         "M180 305 L180 90",
//         "M180 90 L310 90",
//         "M180 198 L285 198"
//       ]
//     },
//     G: {
//       guidePath:
//         "M320 120 C235 80 160 120 160 198 C160 275 230 310 320 275 M250 215 L320 215",
//       points: [
//         { x: 320, y: 120, label: "1" },
//         { x: 235, y: 95, label: "2" },
//         { x: 160, y: 198, label: "3" },
//         { x: 235, y: 295, label: "4" },
//         { x: 320, y: 215, label: "5" }
//       ],
//       segments: [
//         "M320 120 C270 90 210 90 180 130",
//         "M180 130 C150 165 150 235 180 265",
//         "M180 265 C215 300 270 295 320 275",
//         "M250 215 L320 215"
//       ]
//     },
//     H: {
//       guidePath: "M170 90 L170 305 M330 90 L330 305 M170 198 L330 198",
//       points: [
//         { x: 170, y: 90, label: "1" },
//         { x: 170, y: 305, label: "2" },
//         { x: 330, y: 90, label: "3" },
//         { x: 330, y: 305, label: "4" },
//         { x: 250, y: 198, label: "5" }
//       ],
//       segments: [
//         "M170 90 L170 305",
//         "M330 90 L330 305",
//         "M170 198 L330 198"
//       ]
//     },
//     I: {
//       guidePath: "M220 90 L280 90 M250 90 L250 305 M220 305 L280 305",
//       points: [
//         { x: 220, y: 90, label: "1" },
//         { x: 280, y: 90, label: "2" },
//         { x: 250, y: 90, label: "3" },
//         { x: 250, y: 305, label: "4" },
//         { x: 280, y: 305, label: "5" }
//       ],
//       segments: [
//         "M220 90 L280 90",
//         "M250 90 L250 305",
//         "M220 305 L280 305"
//       ]
//     },
//     J: {
//       guidePath: "M310 90 L310 245 C310 315 190 315 190 245",
//       points: [
//         { x: 310, y: 90, label: "1" },
//         { x: 310, y: 245, label: "2" },
//         { x: 260, y: 305, label: "3" },
//         { x: 190, y: 245, label: "4" },
//         { x: 190, y: 225, label: "5" }
//       ],
//       segments: [
//         "M310 90 L310 245",
//         "M310 245 C310 315 190 315 190 245"
//       ]
//     },
//     K: {
//       guidePath: "M180 90 L180 305 M320 90 L180 198 L320 305",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 180, y: 305, label: "2" },
//         { x: 320, y: 90, label: "3" },
//         { x: 180, y: 198, label: "4" },
//         { x: 320, y: 305, label: "5" }
//       ],
//       segments: [
//         "M180 90 L180 305",
//         "M320 90 L180 198",
//         "M180 198 L320 305"
//       ]
//     },
//     L: {
//       guidePath: "M180 90 L180 305 L320 305",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 180, y: 305, label: "2" },
//         { x: 320, y: 305, label: "3" }
//       ],
//       segments: [
//         "M180 90 L180 305",
//         "M180 305 L320 305"
//       ]
//     },
//     M: {
//       guidePath: "M160 305 L160 90 L250 195 L340 90 L340 305",
//       points: [
//         { x: 160, y: 305, label: "1" },
//         { x: 160, y: 90, label: "2" },
//         { x: 250, y: 195, label: "3" },
//         { x: 340, y: 90, label: "4" },
//         { x: 340, y: 305, label: "5" }
//       ],
//       segments: [
//         "M160 305 L160 90",
//         "M160 90 L250 195",
//         "M250 195 L340 90",
//         "M340 90 L340 305"
//       ]
//     },
//     N: {
//       guidePath: "M170 305 L170 90 L330 305 L330 90",
//       points: [
//         { x: 170, y: 305, label: "1" },
//         { x: 170, y: 90, label: "2" },
//         { x: 330, y: 305, label: "3" },
//         { x: 330, y: 90, label: "4" }
//       ],
//       segments: [
//         "M170 305 L170 90",
//         "M170 90 L330 305",
//         "M330 305 L330 90"
//       ]
//     },
//     O: {
//       guidePath: "M250 90 C170 90 150 145 150 198 C150 260 185 305 250 305 C315 305 350 260 350 198 C350 145 330 90 250 90",
//       points: [
//         { x: 250, y: 90, label: "1" },
//         { x: 160, y: 145, label: "2" },
//         { x: 160, y: 260, label: "3" },
//         { x: 250, y: 305, label: "4" },
//         { x: 340, y: 198, label: "5" }
//       ],
//       segments: [
//         "M250 90 C170 90 150 145 150 198",
//         "M150 198 C150 260 185 305 250 305",
//         "M250 305 C315 305 350 260 350 198",
//         "M350 198 C350 145 330 90 250 90"
//       ]
//     },
//     P: {
//       guidePath: "M180 305 L180 90 M180 90 C320 90 320 198 180 198",
//       points: [
//         { x: 180, y: 305, label: "1" },
//         { x: 180, y: 90, label: "2" },
//         { x: 320, y: 140, label: "3" },
//         { x: 180, y: 198, label: "4" }
//       ],
//       segments: [
//         "M180 305 L180 90",
//         "M180 90 C320 90 320 198 180 198"
//       ]
//     },
//     Q: {
//       guidePath:
//         "M250 90 C170 90 150 145 150 198 C150 260 185 305 250 305 C315 305 350 260 350 198 C350 145 330 90 250 90 M280 250 L335 315",
//       points: [
//         { x: 250, y: 90, label: "1" },
//         { x: 160, y: 145, label: "2" },
//         { x: 160, y: 260, label: "3" },
//         { x: 250, y: 305, label: "4" },
//         { x: 320, y: 285, label: "5" }
//       ],
//       segments: [
//         "M250 90 C170 90 150 145 150 198",
//         "M150 198 C150 260 185 305 250 305",
//         "M250 305 C315 305 350 260 350 198",
//         "M350 198 C350 145 330 90 250 90",
//         "M280 250 L335 315"
//       ]
//     },
//     R: {
//       guidePath: "M180 305 L180 90 M180 90 C320 90 320 198 180 198 M180 198 L320 305",
//       points: [
//         { x: 180, y: 305, label: "1" },
//         { x: 180, y: 90, label: "2" },
//         { x: 320, y: 145, label: "3" },
//         { x: 180, y: 198, label: "4" },
//         { x: 320, y: 305, label: "5" }
//       ],
//       segments: [
//         "M180 305 L180 90",
//         "M180 90 C320 90 320 198 180 198",
//         "M180 198 L320 305"
//       ]
//     },
//     S: {
//       guidePath: "M320 120 C250 80 180 105 205 165 C230 220 320 205 305 260 C295 315 215 315 170 280",
//       points: [
//         { x: 320, y: 120, label: "1" },
//         { x: 230, y: 95, label: "2" },
//         { x: 205, y: 165, label: "3" },
//         { x: 305, y: 260, label: "4" },
//         { x: 170, y: 280, label: "5" }
//       ],
//       segments: [
//         "M320 120 C250 80 180 105 205 165",
//         "M205 165 C230 220 320 205 305 260",
//         "M305 260 C295 315 215 315 170 280"
//       ]
//     },
//     T: {
//       guidePath: "M160 90 L340 90 M250 90 L250 305",
//       points: [
//         { x: 160, y: 90, label: "1" },
//         { x: 340, y: 90, label: "2" },
//         { x: 250, y: 90, label: "3" },
//         { x: 250, y: 305, label: "4" }
//       ],
//       segments: [
//         "M160 90 L340 90",
//         "M250 90 L250 305"
//       ]
//     },
//     U: {
//       guidePath: "M180 90 L180 235 C180 315 320 315 320 235 L320 90",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 180, y: 235, label: "2" },
//         { x: 250, y: 305, label: "3" },
//         { x: 320, y: 235, label: "4" },
//         { x: 320, y: 90, label: "5" }
//       ],
//       segments: [
//         "M180 90 L180 235",
//         "M180 235 C180 315 320 315 320 235",
//         "M320 235 L320 90"
//       ]
//     },
//     V: {
//       guidePath: "M180 90 L250 305 L320 90",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 250, y: 305, label: "2" },
//         { x: 320, y: 90, label: "3" }
//       ],
//       segments: [
//         "M180 90 L250 305",
//         "M250 305 L320 90"
//       ]
//     },
//     W: {
//       guidePath: "M150 90 L190 305 L250 185 L310 305 L350 90",
//       points: [
//         { x: 150, y: 90, label: "1" },
//         { x: 190, y: 305, label: "2" },
//         { x: 250, y: 185, label: "3" },
//         { x: 310, y: 305, label: "4" },
//         { x: 350, y: 90, label: "5" }
//       ],
//       segments: [
//         "M150 90 L190 305",
//         "M190 305 L250 185",
//         "M250 185 L310 305",
//         "M310 305 L350 90"
//       ]
//     },
//     X: {
//       guidePath: "M180 90 L320 305 M320 90 L180 305",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 320, y: 305, label: "2" },
//         { x: 320, y: 90, label: "3" },
//         { x: 180, y: 305, label: "4" }
//       ],
//       segments: [
//         "M180 90 L320 305",
//         "M320 90 L180 305"
//       ]
//     },
//     Y: {
//       guidePath: "M180 90 L250 190 L320 90 M250 190 L250 305",
//       points: [
//         { x: 180, y: 90, label: "1" },
//         { x: 250, y: 190, label: "2" },
//         { x: 320, y: 90, label: "3" },
//         { x: 250, y: 190, label: "4" },
//         { x: 250, y: 305, label: "5" }
//       ],
//       segments: [
//         "M180 90 L250 190",
//         "M320 90 L250 190",
//         "M250 190 L250 305"
//       ]
//     },
//     Z: {
//       guidePath: "M180 100 L320 100 L180 305 L320 305",
//       points: [
//         { x: 180, y: 100, label: "1" },
//         { x: 320, y: 100, label: "2" },
//         { x: 180, y: 305, label: "3" },
//         { x: 320, y: 305, label: "4" }
//       ],
//       segments: [
//         "M180 100 L320 100",
//         "M320 100 L180 305",
//         "M180 305 L320 305"
//       ]
//     }
//   };

//   return map[letter] || map.A;
// }

// export default function AlphabetLetterTracing({ goBack }) {
//   const [currentLetter, setCurrentLetter] = useState("A");
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completed, setCompleted] = useState(false);
//   const [wrongDot, setWrongDot] = useState(null);

//   const animal = animalMap[currentLetter];
//   const letterData = useMemo(() => getLetterData(currentLetter), [currentLetter]);
//   const { guidePath, points, segments } = letterData;

//   const activeSegmentCount = Math.min(currentStep, segments.length);

//   const handleDotClick = (index) => {
//     if (completed) return;

//     if (index === currentStep) {
//       const nextStep = currentStep + 1;
//       setCurrentStep(nextStep);
//       setWrongDot(null);

//       if (nextStep === points.length) {
//         setCompleted(true);
//       }
//     } else {
//       setWrongDot(index);
//       setTimeout(() => {
//         setWrongDot(null);
//       }, 500);
//     }
//   };

//   const resetTracing = () => {
//     setCurrentStep(0);
//     setCompleted(false);
//     setWrongDot(null);
//   };

//   const goNext = () => {
//     const currentIndex = alphabetList.indexOf(currentLetter);
//     const nextIndex = (currentIndex + 1) % alphabetList.length;
//     setCurrentLetter(alphabetList[nextIndex]);
//     setCurrentStep(0);
//     setCompleted(false);
//     setWrongDot(null);
//   };

//   const goPrevious = () => {
//     const currentIndex = alphabetList.indexOf(currentLetter);
//     const prevIndex = (currentIndex - 1 + alphabetList.length) % alphabetList.length;
//     setCurrentLetter(alphabetList[prevIndex]);
//     setCurrentStep(0);
//     setCompleted(false);
//     setWrongDot(null);
//   };

//   return (
//     <div className="trace-page">
//       <div className="trace-header">
//         <button className="trace-back-btn" onClick={goBack}>←</button>
//         <h1>Letter Tracing</h1>
//       </div>

//       <div className="trace-content">
//         <div className="trace-main-card">
//           <div className="trace-animal">{animal.emoji}</div>
//           <div className="trace-letter-small">{currentLetter}</div>

//           <h2 className="trace-title">
//             {animal.name} Letter {currentLetter}
//           </h2>

//           <p className="trace-subtitle">
//             Tap the dots in order and follow the path
//           </p>

//           <div className="trace-board-wrap">
//             <div className="trace-board">
//               <svg viewBox="0 0 500 380" className="trace-svg">
//                 <path d={guidePath} className="trace-guide-path" />

//                 {segments.slice(0, activeSegmentCount).map((seg, i) => (
//                   <path
//                     key={i}
//                     d={seg}
//                     className="trace-active-path"
//                   />
//                 ))}

//                 {points.map((point, index) => {
//                   const isDone = index < currentStep;
//                   const isActive = index === currentStep && !completed;
//                   const isWrong = wrongDot === index;

//                   return (
//                     <g key={index}>
//                       <circle
//                         cx={point.x}
//                         cy={point.y}
//                         r="24"
//                         onClick={() => handleDotClick(index)}
//                         className={`trace-dot ${
//                           isDone
//                             ? "done"
//                             : isActive
//                             ? "active"
//                             : "locked"
//                         } ${isWrong ? "wrong" : ""}`}
//                       />
//                       <text
//                         x={point.x}
//                         y={point.y + 6}
//                         textAnchor="middle"
//                         className="trace-dot-number"
//                       >
//                         {point.label}
//                       </text>
//                     </g>
//                   );
//                 })}
//               </svg>
//             </div>
//           </div>

//           <div className="trace-status-row">
//             <div className="trace-message">
//               {completed
//                 ? `Super! ${currentLetter} completed 🎉`
//                 : wrongDot !== null
//                 ? "Oops! That is the wrong dot"
//                 : "Tap the glowing big dot"}
//             </div>

//             <div className="trace-score-box">
//               ⭐ Step {Math.min(currentStep + 1, points.length)} / {points.length}
//             </div>
//           </div>

//           <div className="trace-actions">
//             <button className="trace-action-btn prev" onClick={goPrevious}>
//               Previous
//             </button>
//             <button className="trace-action-btn reset" onClick={resetTracing}>
//               Reset
//             </button>
//             <button className="trace-action-btn next" onClick={goNext}>
//               Next
//             </button>
//           </div>

//           <div className="trace-progress">
//             {alphabetList.indexOf(currentLetter) + 1} / 26
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useMemo, useRef, useState } from "react";
import "../styles/AlphabetLetterTracing.css";

const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const animalMap = {
  A: { name: "Ant", emoji: "🐜" },
  B: { name: "Bear", emoji: "🐻" },
  C: { name: "Cat", emoji: "🐱" },
  D: { name: "Dog", emoji: "🐶" },
  E: { name: "Elephant", emoji: "🐘" },
  F: { name: "Fish", emoji: "🐟" },
  G: { name: "Goat", emoji: "🐐" },
  H: { name: "Horse", emoji: "🐴" },
  I: { name: "Iguana", emoji: "🦎" },
  J: { name: "Jellyfish", emoji: "🪼" },
  K: { name: "Koala", emoji: "🐨" },
  L: { name: "Lion", emoji: "🦁" },
  M: { name: "Monkey", emoji: "🐵" },
  N: { name: "Nest Bird", emoji: "🐦" },
  O: { name: "Owl", emoji: "🦉" },
  P: { name: "Panda", emoji: "🐼" },
  Q: { name: "Quail", emoji: "🐤" },
  R: { name: "Rabbit", emoji: "🐰" },
  S: { name: "Snake", emoji: "🐍" },
  T: { name: "Tiger", emoji: "🐯" },
  U: { name: "Unicorn", emoji: "🦄" },
  V: { name: "Vulture", emoji: "🦅" },
  W: { name: "Whale", emoji: "🐋" },
  X: { name: "X-Ray Fish", emoji: "🐠" },
  Y: { name: "Yak", emoji: "🐂" },
  Z: { name: "Zebra", emoji: "🦓" }
};

function createLetter(strokes) {
  const points = [];
  const pointMap = {};
  const segments = [];
  const guideParts = [];
  let labelCount = 1;

  const getKey = (p) => `${p.x}-${p.y}`;

  const getPointIndex = (p) => {
    const key = getKey(p);
    if (pointMap[key] !== undefined) return pointMap[key];

    const index = points.length;
    points.push({ x: p.x, y: p.y, label: String(labelCount++) });
    pointMap[key] = index;
    return index;
  };

  strokes.forEach((stroke) => {
    if (!stroke || stroke.length < 2) return;

    guideParts.push(
      `M ${stroke[0].x} ${stroke[0].y} ` +
        stroke
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ")
    );

    for (let i = 0; i < stroke.length - 1; i += 1) {
      const from = getPointIndex(stroke[i]);
      const to = getPointIndex(stroke[i + 1]);

      segments.push({
        path: `M ${stroke[i].x} ${stroke[i].y} L ${stroke[i + 1].x} ${stroke[i + 1].y}`,
        from,
        to
      });
    }
  });

  return {
    guidePath: guideParts.join(" "),
    points,
    segments
  };
}

const LETTER_MAP = {
  A: createLetter([
    [
      { x: 160, y: 305 },
      { x: 210, y: 200 },
      { x: 250, y: 90 }
    ],
    [
      { x: 250, y: 90 },
      { x: 290, y: 200 },
      { x: 340, y: 305 }
    ],
    [
      { x: 195, y: 225 },
      { x: 250, y: 225 },
      { x: 305, y: 225 }
    ]
  ]),

  B: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 170, y: 90 },
      { x: 280, y: 105 },
      { x: 295, y: 160 },
      { x: 170, y: 190 }
    ],
    [
      { x: 170, y: 190 },
      { x: 290, y: 210 },
      { x: 300, y: 270 },
      { x: 170, y: 305 }
    ]
  ]),

  C: createLetter([
    [
      { x: 320, y: 120 },
      { x: 250, y: 95 },
      { x: 185, y: 130 },
      { x: 160, y: 198 },
      { x: 185, y: 270 },
      { x: 250, y: 300 },
      { x: 320, y: 275 }
    ]
  ]),

  D: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 170, y: 90 },
      { x: 275, y: 105 },
      { x: 320, y: 180 },
      { x: 300, y: 260 },
      { x: 170, y: 305 }
    ]
  ]),

  E: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 170, y: 90 },
      { x: 320, y: 90 }
    ],
    [
      { x: 170, y: 198 },
      { x: 285, y: 198 }
    ],
    [
      { x: 170, y: 305 },
      { x: 320, y: 305 }
    ]
  ]),

  F: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 170, y: 90 },
      { x: 320, y: 90 }
    ],
    [
      { x: 170, y: 198 },
      { x: 285, y: 198 }
    ]
  ]),

  G: createLetter([
    [
      { x: 320, y: 120 },
      { x: 250, y: 95 },
      { x: 185, y: 130 },
      { x: 160, y: 198 },
      { x: 185, y: 270 },
      { x: 250, y: 300 },
      { x: 320, y: 275 }
    ],
    [
      { x: 320, y: 275 },
      { x: 320, y: 215 },
      { x: 255, y: 215 }
    ]
  ]),

  H: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 330, y: 90 },
      { x: 330, y: 305 }
    ],
    [
      { x: 170, y: 198 },
      { x: 330, y: 198 }
    ]
  ]),

  I: createLetter([
    [
      { x: 180, y: 90 },
      { x: 320, y: 90 }
    ],
    [
      { x: 250, y: 90 },
      { x: 250, y: 305 }
    ],
    [
      { x: 180, y: 305 },
      { x: 320, y: 305 }
    ]
  ]),

  J: createLetter([
    [
      { x: 180, y: 90 },
      { x: 320, y: 90 }
    ],
    [
      { x: 250, y: 90 },
      { x: 250, y: 260 },
      { x: 220, y: 305 },
      { x: 170, y: 290 }
    ]
  ]),

  K: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 320, y: 90 },
      { x: 170, y: 198 }
    ],
    [
      { x: 170, y: 198 },
      { x: 330, y: 305 }
    ]
  ]),

  L: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 170, y: 305 },
      { x: 320, y: 305 }
    ]
  ]),

  M: createLetter([
    [
      { x: 150, y: 305 },
      { x: 150, y: 90 }
    ],
    [
      { x: 150, y: 90 },
      { x: 230, y: 210 },
      { x: 250, y: 240 }
    ],
    [
      { x: 250, y: 240 },
      { x: 270, y: 210 },
      { x: 350, y: 90 }
    ],
    [
      { x: 350, y: 90 },
      { x: 350, y: 305 }
    ]
  ]),

  N: createLetter([
    [
      { x: 160, y: 305 },
      { x: 160, y: 90 }
    ],
    [
      { x: 160, y: 90 },
      { x: 340, y: 305 }
    ],
    [
      { x: 340, y: 305 },
      { x: 340, y: 90 }
    ]
  ]),

  O: createLetter([
    [
      { x: 250, y: 90 },
      { x: 310, y: 115 },
      { x: 340, y: 198 },
      { x: 310, y: 280 },
      { x: 250, y: 305 },
      { x: 190, y: 280 },
      { x: 160, y: 198 },
      { x: 190, y: 115 },
      { x: 250, y: 90 }
    ]
  ]),

  P: createLetter([
    [
      { x: 170, y: 305 },
      { x: 170, y: 90 }
    ],
    [
      { x: 170, y: 90 },
      { x: 290, y: 105 },
      { x: 305, y: 160 },
      { x: 170, y: 190 }
    ]
  ]),

  Q: createLetter([
    [
      { x: 250, y: 90 },
      { x: 310, y: 115 },
      { x: 340, y: 198 },
      { x: 310, y: 280 },
      { x: 250, y: 305 },
      { x: 190, y: 280 },
      { x: 160, y: 198 },
      { x: 190, y: 115 },
      { x: 250, y: 90 }
    ],
    [
      { x: 270, y: 250 },
      { x: 335, y: 315 }
    ]
  ]),

  R: createLetter([
    [
      { x: 170, y: 305 },
      { x: 170, y: 90 }
    ],
    [
      { x: 170, y: 90 },
      { x: 285, y: 105 },
      { x: 300, y: 160 },
      { x: 170, y: 190 }
    ],
    [
      { x: 170, y: 190 },
      { x: 320, y: 305 }
    ]
  ]),

  S: createLetter([
    [
      { x: 315, y: 120 },
      { x: 250, y: 95 },
      { x: 185, y: 125 },
      { x: 250, y: 190 },
      { x: 315, y: 255 },
      { x: 250, y: 300 },
      { x: 180, y: 280 }
    ]
  ]),

  T: createLetter([
    [
      { x: 160, y: 90 },
      { x: 340, y: 90 }
    ],
    [
      { x: 250, y: 90 },
      { x: 250, y: 305 }
    ]
  ]),

  U: createLetter([
    [
      { x: 170, y: 90 },
      { x: 170, y: 245 },
      { x: 200, y: 300 },
      { x: 250, y: 305 },
      { x: 300, y: 300 },
      { x: 330, y: 245 },
      { x: 330, y: 90 }
    ]
  ]),

  V: createLetter([
    [
      { x: 160, y: 90 },
      { x: 250, y: 305 },
      { x: 340, y: 90 }
    ]
  ]),

  W: createLetter([
    [
      { x: 140, y: 90 },
      { x: 185, y: 305 },
      { x: 250, y: 200 },
      { x: 315, y: 305 },
      { x: 360, y: 90 }
    ]
  ]),

  X: createLetter([
    [
      { x: 170, y: 90 },
      { x: 330, y: 305 }
    ],
    [
      { x: 330, y: 90 },
      { x: 170, y: 305 }
    ]
  ]),

  Y: createLetter([
    [
      { x: 170, y: 90 },
      { x: 250, y: 180 }
    ],
    [
      { x: 330, y: 90 },
      { x: 250, y: 180 }
    ],
    [
      { x: 250, y: 180 },
      { x: 250, y: 305 }
    ]
  ]),

  Z: createLetter([
    [
      { x: 170, y: 90 },
      { x: 330, y: 90 }
    ],
    [
      { x: 330, y: 90 },
      { x: 170, y: 305 }
    ],
    [
      { x: 170, y: 305 },
      { x: 330, y: 305 }
    ]
  ])
};

function getLetterData(letter) {
  return LETTER_MAP[letter] || LETTER_MAP.A;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (dx === 0 && dy === 0) return distance(point, start);

  const t =
    ((point.x - start.x) * dx + (point.y - start.y) * dy) /
    (dx * dx + dy * dy);

  const clampedT = Math.max(0, Math.min(1, t));

  const closestX = start.x + clampedT * dx;
  const closestY = start.y + clampedT * dy;

  return Math.hypot(point.x - closestX, point.y - closestY);
}

function getSvgPoint(event, svgElement) {
  const rect = svgElement.getBoundingClientRect();

  const clientX =
    event.touches && event.touches.length ? event.touches[0].clientX : event.clientX;
  const clientY =
    event.touches && event.touches.length ? event.touches[0].clientY : event.clientY;

  const scaleX = 500 / rect.width;
  const scaleY = 380 / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

export default function AlphabetLetterTracing({ goBack }) {
  const [currentLetter, setCurrentLetter] = useState("A");
  const [currentSegment, setCurrentSegment] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState("Tap the glowing big dot");
  const [drawnPaths, setDrawnPaths] = useState([]);
  const [currentStroke, setCurrentStroke] = useState("");
  const [isTracing, setIsTracing] = useState(false);

  const svgRef = useRef(null);

  const animal = animalMap[currentLetter];
  const letterData = useMemo(() => getLetterData(currentLetter), [currentLetter]);
  const { guidePath, points, segments } = letterData;

  const activeSegmentData = segments[currentSegment];
  const startPoint = activeSegmentData ? points[activeSegmentData.from] : null;
  const endPoint = activeSegmentData ? points[activeSegmentData.to] : null;

  const startThreshold = 26;
  const endThreshold = 28;
  const pathTolerance = 26;

  const resetTracing = () => {
    setCurrentSegment(0);
    setCompleted(false);
    setStatus("Tap the glowing big dot");
    setDrawnPaths([]);
    setCurrentStroke("");
    setIsTracing(false);
  };

  const changeLetter = (nextLetter) => {
    setCurrentLetter(nextLetter);
    setCurrentSegment(0);
    setCompleted(false);
    setStatus("Tap the glowing big dot");
    setDrawnPaths([]);
    setCurrentStroke("");
    setIsTracing(false);
  };

  const goNext = () => {
    const currentIndex = alphabetList.indexOf(currentLetter);
    const nextIndex = (currentIndex + 1) % alphabetList.length;
    changeLetter(alphabetList[nextIndex]);
  };

  const goPrevious = () => {
    const currentIndex = alphabetList.indexOf(currentLetter);
    const prevIndex = (currentIndex - 1 + alphabetList.length) % alphabetList.length;
    changeLetter(alphabetList[prevIndex]);
  };

  const handlePointerDown = (e) => {
    if (!svgRef.current || completed || !startPoint) return;

    const pos = getSvgPoint(e, svgRef.current);
    const isNearStart = distance(pos, startPoint) <= startThreshold;

    if (!isNearStart) {
      setStatus(`Start from dot ${points[activeSegmentData.from].label}`);
      return;
    }

    setIsTracing(true);
    setCurrentStroke(`M ${startPoint.x} ${startPoint.y} L ${pos.x} ${pos.y}`);
    setStatus(
      `Trace to dot ${points[activeSegmentData.to].label}`
    );
  };

  const handlePointerMove = (e) => {
    if (!isTracing || !svgRef.current || !startPoint || !endPoint) return;

    if (e.touches) e.preventDefault();

    const pos = getSvgPoint(e, svgRef.current);
    const segmentDistance = distanceToSegment(pos, startPoint, endPoint);

    if (segmentDistance > pathTolerance) {
      setStatus("Stay on the letter path");
      return;
    }

    setCurrentStroke((prev) => `${prev} L ${pos.x} ${pos.y}`);
  };

  const finishSegment = (success) => {
    if (!success) {
      setCurrentStroke("");
      setIsTracing(false);
      return;
    }

    if (currentStroke) {
      setDrawnPaths((prev) => [...prev, currentStroke]);
    }

    const nextSegment = currentSegment + 1;
    setCurrentStroke("");
    setIsTracing(false);

    if (nextSegment >= segments.length) {
      setCurrentSegment(nextSegment);
      setCompleted(true);
      setStatus(`Super! ${currentLetter} completed 🎉`);
    } else {
      const nextFrom = points[segments[nextSegment].from].label;
      const nextTo = points[segments[nextSegment].to].label;
      setCurrentSegment(nextSegment);
      setStatus(`Great! Now connect dot ${nextFrom} to dot ${nextTo}`);
    }
  };

  const handlePointerUp = (e) => {
    if (!isTracing || !svgRef.current || !endPoint) return;

    const pos = getSvgPoint(e, svgRef.current);
    const isNearEnd = distance(pos, endPoint) <= endThreshold;

    if (isNearEnd) {
      finishSegment(true);
    } else {
      setStatus(`Trace till dot ${points[activeSegmentData.to].label}`);
      finishSegment(false);
    }
  };

  const getDotState = (index) => {
    if (completed) return "done";

    for (let i = 0; i < currentSegment; i += 1) {
      if (segments[i].to === index || segments[i].from === index) return "done";
    }

    if (activeSegmentData && activeSegmentData.from === index) {
      return "active";
    }

    if (activeSegmentData && activeSegmentData.to === index) {
      return "next";
    }

    return "locked";
  };

  return (
    <div className="trace-page">
      <div className="trace-header">
        <h1>Letter Tracing</h1>
      </div>

      <div className="trace-content">
        <div className="trace-main-card">
          <div className="trace-animal">{animal.emoji}</div>
          <div className="trace-letter-small">{currentLetter}</div>

          <h2 className="trace-title">
            {animal.name} Letter {currentLetter}
          </h2>

          <p className="trace-subtitle">
            Trace from one glowing dot to the next dot
          </p>

          <div className="trace-board-wrap">
            <div className="trace-board">
              <svg
                ref={svgRef}
                viewBox="0 0 500 380"
                className="trace-svg"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={() => isTracing && finishSegment(false)}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              >
                <path d={guidePath} className="trace-guide-path" />

                {drawnPaths.map((path, i) => (
                  <path key={i} d={path} className="trace-user-path" />
                ))}

                {currentStroke && (
                  <path d={currentStroke} className="trace-user-path" />
                )}

                {points.map((point, index) => {
                  const dotState = getDotState(index);

                  return (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="24"
                        className={`trace-dot ${dotState}`}
                      />
                      <text
                        x={point.x}
                        y={point.y + 6}
                        textAnchor="middle"
                        className="trace-dot-number"
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="trace-status-row">
            <div className="trace-message">{status}</div>

            <div className="trace-score-box">
              ⭐ Step {Math.min(currentSegment + 1, segments.length)} / {segments.length}
            </div>
          </div>

          <div className="trace-actions">
            <button className="trace-action-btn prev" onClick={goPrevious}>
              Previous
            </button>
            <button className="trace-action-btn reset" onClick={resetTracing}>
              Reset
            </button>
            <button className="trace-action-btn next" onClick={goNext}>
              Next
            </button>
          </div>

          <div className="trace-progress">
            {alphabetList.indexOf(currentLetter) + 1} / 26
          </div>
        </div>
      </div>
    </div>
  );
}