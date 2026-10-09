// import React, { useEffect, useMemo, useRef, useState } from "react";
// import useGameProgress from "../hooks/useGameProgress";
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



// function createLetter(strokes) {

//   const points = [];

//   const pointMap = {};

//   const segments = [];

//   const guideParts = [];

//   let labelCount = 1;



//   const getKey = (p) => `${p.x}-${p.y}`;



//   const getPointIndex = (p) => {

//     const key = getKey(p);

//     if (pointMap[key] !== undefined) return pointMap[key];



//     const index = points.length;

//     points.push({ x: p.x, y: p.y, label: String(labelCount++) });

//     pointMap[key] = index;

//     return index;

//   };



//   strokes.forEach((stroke) => {

//     if (!stroke || stroke.length < 2) return;



//     guideParts.push(

//       `M ${stroke[0].x} ${stroke[0].y} ` +

//         stroke

//           .slice(1)

//           .map((p) => `L ${p.x} ${p.y}`)

//           .join(" ")

//     );



//     for (let i = 0; i < stroke.length - 1; i += 1) {

//       const from = getPointIndex(stroke[i]);

//       const to = getPointIndex(stroke[i + 1]);



//       segments.push({

//         path: `M ${stroke[i].x} ${stroke[i].y} L ${stroke[i + 1].x} ${stroke[i + 1].y}`,

//         from,

//         to

//       });

//     }

//   });



//   return {

//     guidePath: guideParts.join(" "),

//     points,

//     segments

//   };

// }



// const LETTER_MAP = {

//   A: createLetter([

//     [

//       { x: 160, y: 305 },

//       { x: 210, y: 200 },

//       { x: 250, y: 90 }

//     ],

//     [

//       { x: 250, y: 90 },

//       { x: 290, y: 200 },

//       { x: 340, y: 305 }

//     ],

//     [

//       { x: 195, y: 225 },

//       { x: 250, y: 225 },

//       { x: 305, y: 225 }

//     ]

//   ]),



//   B: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 170, y: 90 },

//       { x: 280, y: 105 },

//       { x: 295, y: 160 },

//       { x: 170, y: 190 }

//     ],

//     [

//       { x: 170, y: 190 },

//       { x: 290, y: 210 },

//       { x: 300, y: 270 },

//       { x: 170, y: 305 }

//     ]

//   ]),



//   C: createLetter([

//     [

//       { x: 320, y: 120 },

//       { x: 250, y: 95 },

//       { x: 185, y: 130 },

//       { x: 160, y: 198 },

//       { x: 185, y: 270 },

//       { x: 250, y: 300 },

//       { x: 320, y: 275 }

//     ]

//   ]),



//   D: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 170, y: 90 },

//       { x: 275, y: 105 },

//       { x: 320, y: 180 },

//       { x: 300, y: 260 },

//       { x: 170, y: 305 }

//     ]

//   ]),



//   E: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 170, y: 90 },

//       { x: 320, y: 90 }

//     ],

//     [

//       { x: 170, y: 198 },

//       { x: 285, y: 198 }

//     ],

//     [

//       { x: 170, y: 305 },

//       { x: 320, y: 305 }

//     ]

//   ]),



//   F: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 170, y: 90 },

//       { x: 320, y: 90 }

//     ],

//     [

//       { x: 170, y: 198 },

//       { x: 285, y: 198 }

//     ]

//   ]),



//   G: createLetter([

//     [

//       { x: 320, y: 120 },

//       { x: 250, y: 95 },

//       { x: 185, y: 130 },

//       { x: 160, y: 198 },

//       { x: 185, y: 270 },

//       { x: 250, y: 300 },

//       { x: 320, y: 275 }

//     ],

//     [

//       { x: 320, y: 275 },

//       { x: 320, y: 215 },

//       { x: 255, y: 215 }

//     ]

//   ]),



//   H: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 330, y: 90 },

//       { x: 330, y: 305 }

//     ],

//     [

//       { x: 170, y: 198 },

//       { x: 330, y: 198 }

//     ]

//   ]),



//   I: createLetter([

//     [

//       { x: 180, y: 90 },

//       { x: 320, y: 90 }

//     ],

//     [

//       { x: 250, y: 90 },

//       { x: 250, y: 305 }

//     ],

//     [

//       { x: 180, y: 305 },

//       { x: 320, y: 305 }

//     ]

//   ]),



//   J: createLetter([

//     [

//       { x: 180, y: 90 },

//       { x: 320, y: 90 }

//     ],

//     [

//       { x: 250, y: 90 },

//       { x: 250, y: 260 },

//       { x: 220, y: 305 },

//       { x: 170, y: 290 }

//     ]

//   ]),



//   K: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 320, y: 90 },

//       { x: 170, y: 198 }

//     ],

//     [

//       { x: 170, y: 198 },

//       { x: 330, y: 305 }

//     ]

//   ]),



//   L: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 170, y: 305 },

//       { x: 320, y: 305 }

//     ]

//   ]),



//   M: createLetter([

//     [

//       { x: 150, y: 305 },

//       { x: 150, y: 90 }

//     ],

//     [

//       { x: 150, y: 90 },

//       { x: 230, y: 210 },

//       { x: 250, y: 240 }

//     ],

//     [

//       { x: 250, y: 240 },

//       { x: 270, y: 210 },

//       { x: 350, y: 90 }

//     ],

//     [

//       { x: 350, y: 90 },

//       { x: 350, y: 305 }

//     ]

//   ]),



//   N: createLetter([

//     [

//       { x: 160, y: 305 },

//       { x: 160, y: 90 }

//     ],

//     [

//       { x: 160, y: 90 },

//       { x: 340, y: 305 }

//     ],

//     [

//       { x: 340, y: 305 },

//       { x: 340, y: 90 }

//     ]

//   ]),



//   O: createLetter([

//     [

//       { x: 250, y: 90 },

//       { x: 310, y: 115 },

//       { x: 340, y: 198 },

//       { x: 310, y: 280 },

//       { x: 250, y: 305 },

//       { x: 190, y: 280 },

//       { x: 160, y: 198 },

//       { x: 190, y: 115 },

//       { x: 250, y: 90 }

//     ]

//   ]),



//   P: createLetter([

//     [

//       { x: 170, y: 305 },

//       { x: 170, y: 90 }

//     ],

//     [

//       { x: 170, y: 90 },

//       { x: 290, y: 105 },

//       { x: 305, y: 160 },

//       { x: 170, y: 190 }

//     ]

//   ]),



//   Q: createLetter([

//     [

//       { x: 250, y: 90 },

//       { x: 310, y: 115 },

//       { x: 340, y: 198 },

//       { x: 310, y: 280 },

//       { x: 250, y: 305 },

//       { x: 190, y: 280 },

//       { x: 160, y: 198 },

//       { x: 190, y: 115 },

//       { x: 250, y: 90 }

//     ],

//     [

//       { x: 270, y: 250 },

//       { x: 335, y: 315 }

//     ]

//   ]),



//   R: createLetter([

//     [

//       { x: 170, y: 305 },

//       { x: 170, y: 90 }

//     ],

//     [

//       { x: 170, y: 90 },

//       { x: 285, y: 105 },

//       { x: 300, y: 160 },

//       { x: 170, y: 190 }

//     ],

//     [

//       { x: 170, y: 190 },

//       { x: 320, y: 305 }

//     ]

//   ]),



//   S: createLetter([

//     [

//       { x: 315, y: 120 },

//       { x: 250, y: 95 },

//       { x: 185, y: 125 },

//       { x: 250, y: 190 },

//       { x: 315, y: 255 },

//       { x: 250, y: 300 },

//       { x: 180, y: 280 }

//     ]

//   ]),



//   T: createLetter([

//     [

//       { x: 160, y: 90 },

//       { x: 340, y: 90 }

//     ],

//     [

//       { x: 250, y: 90 },

//       { x: 250, y: 305 }

//     ]

//   ]),



//   U: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 170, y: 245 },

//       { x: 200, y: 300 },

//       { x: 250, y: 305 },

//       { x: 300, y: 300 },

//       { x: 330, y: 245 },

//       { x: 330, y: 90 }

//     ]

//   ]),



//   V: createLetter([

//     [

//       { x: 160, y: 90 },

//       { x: 250, y: 305 },

//       { x: 340, y: 90 }

//     ]

//   ]),



//   W: createLetter([

//     [

//       { x: 140, y: 90 },

//       { x: 185, y: 305 },

//       { x: 250, y: 200 },

//       { x: 315, y: 305 },

//       { x: 360, y: 90 }

//     ]

//   ]),



//   X: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 330, y: 305 }

//     ],

//     [

//       { x: 330, y: 90 },

//       { x: 170, y: 305 }

//     ]

//   ]),



//   Y: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 250, y: 180 }

//     ],

//     [

//       { x: 330, y: 90 },

//       { x: 250, y: 180 }

//     ],

//     [

//       { x: 250, y: 180 },

//       { x: 250, y: 305 }

//     ]

//   ]),



//   Z: createLetter([

//     [

//       { x: 170, y: 90 },

//       { x: 330, y: 90 }

//     ],

//     [

//       { x: 330, y: 90 },

//       { x: 170, y: 305 }

//     ],

//     [

//       { x: 170, y: 305 },

//       { x: 330, y: 305 }

//     ]

//   ])

// };



// function getLetterData(letter) {

//   return LETTER_MAP[letter] || LETTER_MAP.A;

// }



// function distance(a, b) {

//   return Math.hypot(a.x - b.x, a.y - b.y);

// }



// function distanceToSegment(point, start, end) {

//   const dx = end.x - start.x;

//   const dy = end.y - start.y;



//   if (dx === 0 && dy === 0) return distance(point, start);



//   const t =

//     ((point.x - start.x) * dx + (point.y - start.y) * dy) /

//     (dx * dx + dy * dy);



//   const clampedT = Math.max(0, Math.min(1, t));



//   const closestX = start.x + clampedT * dx;

//   const closestY = start.y + clampedT * dy;



//   return Math.hypot(point.x - closestX, point.y - closestY);

// }



// function getSvgPoint(event, svgElement) {

//   const rect = svgElement.getBoundingClientRect();



//   const clientX =

//     event.touches && event.touches.length ? event.touches[0].clientX : event.clientX;

//   const clientY =

//     event.touches && event.touches.length ? event.touches[0].clientY : event.clientY;



//   const scaleX = 500 / rect.width;

//   const scaleY = 380 / rect.height;



//   return {

//     x: (clientX - rect.left) * scaleX,

//     y: (clientY - rect.top) * scaleY

//   };

// }



// export default function AlphabetLetterTracing({ goBack }) {
//   const GAME_ID = "alphabet-letter-tracing";

//   const [currentLetter, setCurrentLetter] = useState("A");
//   const [currentSegment, setCurrentSegment] = useState(0);
//   const [completed, setCompleted] = useState(false);
//   const [status, setStatus] = useState("Tap the glowing big dot");
//   const [drawnPaths, setDrawnPaths] = useState([]);
//   const [currentStroke, setCurrentStroke] = useState("");
//   const [isTracing, setIsTracing] = useState(false);
//   const [gameLoading, setGameLoading] = useState(true);

//   const svgRef = useRef(null);

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//   } = useGameProgress(GAME_ID, {
//     currentLetter: "A",
//     currentSegment: 0,
//     completed: false,
//     status: "Tap the glowing big dot",
//     drawnPaths: [],
//   });

//   const animal = animalMap[currentLetter];
//   const letterData = useMemo(() => getLetterData(currentLetter), [currentLetter]);
//   const { guidePath, points, segments } = letterData;

//   const activeSegmentData = segments[currentSegment];
//   const startPoint = activeSegmentData ? points[activeSegmentData.from] : null;
//   const endPoint = activeSegmentData ? points[activeSegmentData.to] : null;

//   const startThreshold = 26;
//   const endThreshold = 28;
//   const pathTolerance = 26;

//   useEffect(() => {
//     if (progressLoading) return;

//     if (savedState) {
//       const restoredLetter = alphabetList.includes(savedState.currentLetter)
//         ? savedState.currentLetter
//         : "A";

//       const restoredData = getLetterData(restoredLetter);
//       const maxSegment = restoredData.segments.length;
//       const restoredSegment = Math.min(
//         Math.max(Number(savedState.currentSegment ?? 0), 0),
//         maxSegment
//       );

//       setCurrentLetter(restoredLetter);
//       setCurrentSegment(restoredSegment);
//       setCompleted(Boolean(savedState.completed));
//       setStatus(savedState.status || "Tap the glowing big dot");
//       setDrawnPaths(Array.isArray(savedState.drawnPaths) ? savedState.drawnPaths : []);
//     }

//     setCurrentStroke("");
//     setIsTracing(false);
//     setGameLoading(false);
//   }, [progressLoading, savedState]);

//   const saveProgress = async ({
//     letter = currentLetter,
//     segment = currentSegment,
//     isCompleted = completed,
//     message = status,
//     paths = drawnPaths,
//   } = {}) => {
//     await save({
//       currentLetter: letter,
//       currentSegment: segment,
//       completed: isCompleted,
//       status: message,
//       drawnPaths: paths,
//     });
//   };

//   const resetTracing = async () => {
//     const message = "Tap the glowing big dot";

//     setCurrentSegment(0);
//     setCompleted(false);
//     setStatus(message);
//     setDrawnPaths([]);
//     setCurrentStroke("");
//     setIsTracing(false);

//     await saveProgress({
//       segment: 0,
//       isCompleted: false,
//       message,
//       paths: [],
//     });
//   };

//   const changeLetter = async (nextLetter) => {
//     const message = "Tap the glowing big dot";

//     setCurrentLetter(nextLetter);
//     setCurrentSegment(0);
//     setCompleted(false);
//     setStatus(message);
//     setDrawnPaths([]);
//     setCurrentStroke("");
//     setIsTracing(false);

//     await save({
//       currentLetter: nextLetter,
//       currentSegment: 0,
//       completed: false,
//       status: message,
//       drawnPaths: [],
//     });
//   };

//   const goNext = () => {
//     const currentIndex = alphabetList.indexOf(currentLetter);
//     const nextIndex = (currentIndex + 1) % alphabetList.length;
//     changeLetter(alphabetList[nextIndex]);
//   };

//   const goPrevious = () => {
//     const currentIndex = alphabetList.indexOf(currentLetter);
//     const prevIndex = (currentIndex - 1 + alphabetList.length) % alphabetList.length;
//     changeLetter(alphabetList[prevIndex]);
//   };

//   const handlePointerDown = (e) => {
//     if (!svgRef.current || completed || !startPoint) return;

//     const pos = getSvgPoint(e, svgRef.current);
//     const isNearStart = distance(pos, startPoint) <= startThreshold;

//     if (!isNearStart) {
//       setStatus(`Start from dot ${points[activeSegmentData.from].label}`);
//       return;
//     }

//     setIsTracing(true);
//     setCurrentStroke(`M ${startPoint.x} ${startPoint.y} L ${pos.x} ${pos.y}`);
//     setStatus(`Trace to dot ${points[activeSegmentData.to].label}`);
//   };

//   const handlePointerMove = (e) => {
//     if (!isTracing || !svgRef.current || !startPoint || !endPoint) return;

//     if (e.touches) e.preventDefault();

//     const pos = getSvgPoint(e, svgRef.current);
//     const segmentDistance = distanceToSegment(pos, startPoint, endPoint);

//     if (segmentDistance > pathTolerance) {
//       setStatus("Stay on the letter path");
//       return;
//     }

//     setCurrentStroke((prev) => `${prev} L ${pos.x} ${pos.y}`);
//   };

//   const finishSegment = async (success) => {
//     if (!success) {
//       setCurrentStroke("");
//       setIsTracing(false);
//       return;
//     }

//     const updatedPaths = currentStroke
//       ? [...drawnPaths, currentStroke]
//       : drawnPaths;

//     const nextSegment = currentSegment + 1;

//     setCurrentStroke("");
//     setIsTracing(false);
//     setDrawnPaths(updatedPaths);

//     if (nextSegment >= segments.length) {
//       const message = `Super! ${currentLetter} completed 🎉`;

//       setCurrentSegment(nextSegment);
//       setCompleted(true);
//       setStatus(message);

//       await save({
//         currentLetter,
//         currentSegment: nextSegment,
//         completed: true,
//         status: message,
//         drawnPaths: updatedPaths,
//       });
//     } else {
//       const nextFrom = points[segments[nextSegment].from].label;
//       const nextTo = points[segments[nextSegment].to].label;
//       const message = `Great! Now connect dot ${nextFrom} to dot ${nextTo}`;

//       setCurrentSegment(nextSegment);
//       setStatus(message);

//       await save({
//         currentLetter,
//         currentSegment: nextSegment,
//         completed: false,
//         status: message,
//         drawnPaths: updatedPaths,
//       });
//     }
//   };

//   const handlePointerUp = (e) => {
//     if (!isTracing || !svgRef.current || !endPoint) return;

//     const pos = getSvgPoint(e, svgRef.current);
//     const isNearEnd = distance(pos, endPoint) <= endThreshold;

//     if (isNearEnd) {
//       finishSegment(true);
//     } else {
//       setStatus(`Trace till dot ${points[activeSegmentData.to].label}`);
//       finishSegment(false);
//     }
//   };

//   const getDotState = (index) => {
//     if (completed) return "done";

//     for (let i = 0; i < currentSegment; i += 1) {
//       if (segments[i].to === index || segments[i].from === index) return "done";
//     }

//     if (activeSegmentData && activeSegmentData.from === index) return "active";
//     if (activeSegmentData && activeSegmentData.to === index) return "next";

//     return "locked";
//   };

//   if (progressLoading || gameLoading) {
//     return (
//       <div className="trace-page">
//         <div className="trace-header">
//           {goBack && (
//             <button className="trace-back-btn" onClick={goBack}>
//               ←
//             </button>
//           )}
//           <h1>Letter Tracing</h1>
//         </div>
//         <div className="trace-content">
//           <div className="trace-main-card">
//             <div className="trace-status-row">
//               <div className="trace-message">Loading your progress...</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="trace-page">
//       <div className="trace-header">
//         {goBack && (
//           <button className="trace-back-btn" onClick={goBack}>
//             ←
//           </button>
//         )}
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
//             Trace from one glowing dot to the next dot
//           </p>

//           <div className="trace-board-wrap">
//             <div className="trace-board">
//               <svg
//                 ref={svgRef}
//                 viewBox="0 0 500 380"
//                 className="trace-svg"
//                 style={{ touchAction: "none" }}
//                 onMouseDown={handlePointerDown}
//                 onMouseMove={handlePointerMove}
//                 onMouseUp={handlePointerUp}
//                 onMouseLeave={() => isTracing && finishSegment(false)}
//                 onTouchStart={handlePointerDown}
//                 onTouchMove={handlePointerMove}
//                 onTouchEnd={handlePointerUp}
//               >
//                 <path d={guidePath} className="trace-guide-path" />

//                 {drawnPaths.map((path, i) => (
//                   <path key={i} d={path} className="trace-user-path" />
//                 ))}

//                 {currentStroke && (
//                   <path d={currentStroke} className="trace-user-path" />
//                 )}

//                 {points.map((point, index) => {
//                   const dotState = getDotState(index);

//                   return (
//                     <g key={index}>
//                       <circle
//                         cx={point.x}
//                         cy={point.y}
//                         r="24"
//                         className={`trace-dot ${dotState}`}
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
//             <div className="trace-message">{status}</div>
//             <div className="trace-score-box">
//               ⭐ Step {Math.min(currentSegment + 1, segments.length)} / {segments.length}
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






import React, { useEffect, useMemo, useRef, useState } from "react";

import useGameProgress from "../hooks/useGameProgress";

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
  const svgPoint = svgElement.createSVGPoint();
  svgPoint.x = event.clientX;
  svgPoint.y = event.clientY;

  const matrix = svgElement.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };

  const point = svgPoint.matrixTransform(matrix.inverse());
  return { x: point.x, y: point.y };
}

export default function AlphabetLetterTracing({ goBack }) {

  const GAME_ID = "alphabet-letter-tracing";

  const [currentLetter, setCurrentLetter] = useState("A");

  const [currentSegment, setCurrentSegment] = useState(0);

  const [completed, setCompleted] = useState(false);

  const [status, setStatus] = useState("Tap the glowing big dot");

  const [drawnPaths, setDrawnPaths] = useState([]);

  const [currentStroke, setCurrentStroke] = useState("");

  const [isTracing, setIsTracing] = useState(false);

  const [gameLoading, setGameLoading] = useState(true);

  const svgRef = useRef(null);

  const {

    savedState,

    loading: progressLoading,

    save,

  } = useGameProgress(GAME_ID, {

    currentLetter: "A",

    currentSegment: 0,

    completed: false,

    status: "Tap the glowing big dot",

    drawnPaths: [],

  });

  const animal = animalMap[currentLetter];

  const letterData = useMemo(() => getLetterData(currentLetter), [currentLetter]);

  const { guidePath, points, segments } = letterData;

  const activeSegmentData = segments[currentSegment];

  const startPoint = activeSegmentData ? points[activeSegmentData.from] : null;

  const endPoint = activeSegmentData ? points[activeSegmentData.to] : null;

  const startThreshold = 26;

  const endThreshold = 28;

  const pathTolerance = 26;

  useEffect(() => {

    if (progressLoading) return;

    if (savedState) {

      const restoredLetter = alphabetList.includes(savedState.currentLetter)

        ? savedState.currentLetter

        : "A";

      const restoredData = getLetterData(restoredLetter);

      const maxSegment = restoredData.segments.length;

      const restoredSegment = Math.min(

        Math.max(Number(savedState.currentSegment ?? 0), 0),

        maxSegment

      );

      setCurrentLetter(restoredLetter);

      setCurrentSegment(restoredSegment);

      setCompleted(Boolean(savedState.completed));

      setStatus(savedState.status || "Tap the glowing big dot");

      setDrawnPaths(Array.isArray(savedState.drawnPaths) ? savedState.drawnPaths : []);

    }

    setCurrentStroke("");

    setIsTracing(false);

    setGameLoading(false);

  }, [progressLoading, savedState]);

  const saveProgress = async ({

    letter = currentLetter,

    segment = currentSegment,

    isCompleted = completed,

    message = status,

    paths = drawnPaths,

  } = {}) => {

    await save({

      currentLetter: letter,

      currentSegment: segment,

      completed: isCompleted,

      status: message,

      drawnPaths: paths,

    });

  };

  const resetTracing = async () => {

    const message = "Tap the glowing big dot";

    setCurrentSegment(0);

    setCompleted(false);

    setStatus(message);

    setDrawnPaths([]);

    setCurrentStroke("");

    setIsTracing(false);

    await saveProgress({

      segment: 0,

      isCompleted: false,

      message,

      paths: [],

    });

  };

  const changeLetter = async (nextLetter) => {

    const message = "Tap the glowing big dot";

    setCurrentLetter(nextLetter);

    setCurrentSegment(0);

    setCompleted(false);

    setStatus(message);

    setDrawnPaths([]);

    setCurrentStroke("");

    setIsTracing(false);

    await save({

      currentLetter: nextLetter,

      currentSegment: 0,

      completed: false,

      status: message,

      drawnPaths: [],

    });

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
    if (!svgRef.current || completed || !startPoint || !activeSegmentData) return;

    e.preventDefault();
    const pos = getSvgPoint(e, svgRef.current);

    if (distance(pos, startPoint) > startThreshold) {
      setStatus(`Start from dot ${points[activeSegmentData.from].label}`);
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture may not be available in every embedded browser.
    }

    setIsTracing(true);
    setCurrentStroke(`M ${startPoint.x} ${startPoint.y} L ${pos.x} ${pos.y}`);
    setStatus(`Trace to dot ${points[activeSegmentData.to].label}`);
  };

  const handlePointerMove = (e) => {
    if (!isTracing || !svgRef.current || !startPoint || !endPoint) return;

    e.preventDefault();
    const pos = getSvgPoint(e, svgRef.current);
    const segmentDistance = distanceToSegment(pos, startPoint, endPoint);

    if (segmentDistance > pathTolerance) {
      setStatus("Stay on the letter path");
      return;
    }

    setCurrentStroke((prev) => `${prev} L ${pos.x} ${pos.y}`);
  };

  const finishSegment = async (success) => {
    if (!success) {
      setCurrentStroke("");
      setIsTracing(false);
      return;
    }

    const updatedPaths = currentStroke
      ? [...drawnPaths, currentStroke]
      : drawnPaths;
    const nextSegment = currentSegment + 1;

    setCurrentStroke("");
    setIsTracing(false);
    setDrawnPaths(updatedPaths);

    if (nextSegment >= segments.length) {
      const message = `Super! ${currentLetter} completed 🎉`;
      setCurrentSegment(nextSegment);
      setCompleted(true);
      setStatus(message);

      await save({
        currentLetter,
        currentSegment: nextSegment,
        completed: true,
        status: message,
        drawnPaths: updatedPaths,
      });
    } else {
      const nextFrom = points[segments[nextSegment].from].label;
      const nextTo = points[segments[nextSegment].to].label;
      const message = `Great! Now connect dot ${nextFrom} to dot ${nextTo}`;

      setCurrentSegment(nextSegment);
      setStatus(message);

      await save({
        currentLetter,
        currentSegment: nextSegment,
        completed: false,
        status: message,
        drawnPaths: updatedPaths,
      });
    }
  };

  const handlePointerUp = (e) => {
    if (!isTracing || !svgRef.current || !endPoint || !activeSegmentData) return;

    e.preventDefault();
    const pos = getSvgPoint(e, svgRef.current);
    const isNearEnd = distance(pos, endPoint) <= endThreshold;

    if (isNearEnd) {
      finishSegment(true);
    } else {
      setStatus(`Trace till dot ${points[activeSegmentData.to].label}`);
      finishSegment(false);
    }
  };

  const handlePointerCancel = () => {
    if (isTracing) finishSegment(false);
  };

  const getDotState = (index) => {

    if (completed) return "done";

    for (let i = 0; i < currentSegment; i += 1) {

      if (segments[i].to === index || segments[i].from === index) return "done";

    }

    if (activeSegmentData && activeSegmentData.from === index) return "active";

    if (activeSegmentData && activeSegmentData.to === index) return "next";

    return "locked";

  };

  if (progressLoading || gameLoading) {

    return (

      <div className="trace-page">

        <div className="trace-header">

          {goBack && (

            <button className="trace-back-btn" onClick={goBack}>

              ←

            </button>

          )}

          <h1>Letter Tracing</h1>

        </div>

        <div className="trace-content">

          <div className="trace-main-card">

            <div className="trace-status-row">

              <div className="trace-message">Loading your progress...</div>

            </div>

          </div>

        </div>

      </div>

    );

  }

  return (

    <div className="trace-page">

      <div className="trace-header">

        {goBack && (

          <button className="trace-back-btn" onClick={goBack}>

            ←

          </button>

        )}

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

                style={{
                  touchAction: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}

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
