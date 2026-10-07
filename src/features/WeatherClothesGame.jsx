// import React, { useEffect, useState } from "react";
// import "../styles/gameCommon.css";
// import "../styles/WeatherClothesGame.css";

// import { db } from "../firebase";
// import {
//   doc,
//   collection,
//   addDoc,
//   Timestamp,
// } from "firebase/firestore";

// import useGameProgress from "../hooks/useGameProgress";

// const GAME_ID = "weather-clothes";

// const weatherLearnData = [
//   {
//     weather: "Sunny",
//     image: "/images/sunny.png",
//     feel: "It is hot and bright",
//     info: "The sun shines strongly.",
//     clothes: [
//       { name: "Cap", emoji: "🧢", use: "Protects your head from sun" },
//       { name: "Sunglasses", emoji: "😎", use: "Protects your eyes" },
//       { name: "T-shirt", emoji: "👕", use: "Keeps you cool" },
//     ],
//   },
//   {
//     weather: "Rainy",
//     image: "/images/rain.png",
//     feel: "It is wet",
//     info: "Rain falls from the sky.",
//     clothes: [
//       { name: "Umbrella", emoji: "☂️", use: "Keeps you dry" },
//       { name: "Raincoat", emoji: "🧥", use: "Protects from rain" },
//       { name: "Boots", emoji: "👢", use: "Keeps feet dry" },
//     ],
//   },
//   {
//     weather: "Snowy",
//     image: "/images/snow.png",
//     feel: "Very cold",
//     info: "Snow covers everything.",
//     clothes: [
//       { name: "Jacket", emoji: "🧥", use: "Keeps body warm" },
//       { name: "Gloves", emoji: "🧤", use: "Keeps hands warm" },
//       { name: "Scarf", emoji: "🧣", use: "Protects neck" },
//     ],
//   },
//   {
//     weather: "Windy",
//     image: "/images/wind.png",
//     feel: "Strong wind",
//     info: "Wind blows fast.",
//     clothes: [
//       { name: "Jacket", emoji: "🧥", use: "Blocks cold wind" },
//     ],
//   },
//   {
//     weather: "Stormy",
//     image: "/images/storm.png",
//     feel: "Thunder and heavy rain",
//     info: "Lightning and thunder occur.",
//     clothes: [
//       { name: "Raincoat", emoji: "🧥", use: "Keeps you dry" },
//       { name: "Umbrella", emoji: "☂️", use: "Protects from rain" },
//     ],
//   },
//   {
//     weather: "Cold",
//     image: "/images/cold.png",
//     feel: "Very cold",
//     info: "You may shiver.",
//     clothes: [
//       { name: "Jacket", emoji: "🧥", use: "Keeps warm" },
//       { name: "Gloves", emoji: "🧤", use: "Protects hands" },
//       { name: "Sweater", emoji: "🧶", use: "Keeps body warm" },
//     ],
//   },
// ];

// const weatherGameData = [
//   {
//     weather: "Sunny",
//     image: "/images/sunny.png",
//     correctIndex: 0,
//     options: [
//       "/images/cap.png",
//       "/images/jacket.png",
//       "/images/umbrella.png",
//       "/images/gloves.png",
//     ],
//   },
//   {
//     weather: "Rainy",
//     image: "/images/rain.png",
//     correctIndex: 2,
//     options: [
//       "/images/cap.png",
//       "/images/shoes.png",
//       "/images/umbrella.png",
//       "/images/tshirt.png",
//     ],
//   },
//   {
//     weather: "Snowy",
//     image: "/images/snow.png",
//     correctIndex: 3,
//     options: [
//       "/images/tshirt.png",
//       "/images/cap.png",
//       "/images/slippers.png",
//       "/images/jacket.png",
//     ],
//   },
//   {
//     weather: "Windy",
//     image: "/images/wind.png",
//     correctIndex: 0,
//     options: [
//       "/images/jacket.png",
//       "/images/umbrella.png",
//       "/images/tshirt.png",
//       "/images/slippers.png",
//     ],
//   },
// ];

// export default function WeatherGame({ goBack }) {
//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(GAME_ID);

//   const [mode, setMode] = useState("learn");
//   const [learnIndex, setLearnIndex] = useState(0);
//   const [gameIndex, setGameIndex] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [locked, setLocked] = useState(false);

//   const speak = (text) => {
//     if (
//       typeof window === "undefined" ||
//       !("speechSynthesis" in window)
//     ) {
//       return;
//     }

//     const utter = new SpeechSynthesisUtterance(text);
//     utter.rate = 0.8;

//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utter);
//   };

//   useEffect(() => {
//     if (progressLoading) return;

//     if (savedState && savedState.mode) {
//       setMode(savedState.mode);
//       setLearnIndex(savedState.learnIndex || 0);
//       setGameIndex(savedState.gameIndex || 0);
//       setSelected(savedState.selected ?? null);
//       setFeedback(savedState.feedback || "");
//       setScore(savedState.score || 0);
//       setGameOver(savedState.gameOver || false);
//       setLocked(false);
//       return;
//     }

//     setMode("learn");
//     setLearnIndex(0);
//     setGameIndex(0);
//     setSelected(null);
//     setFeedback("");
//     setScore(0);
//     setGameOver(false);
//     setLocked(false);

//     save({
//       mode: "learn",
//       learnIndex: 0,
//       gameIndex: 0,
//       selected: null,
//       feedback: "",
//       score: 0,
//       gameOver: false,
//     });
//   }, [progressLoading, GAME_ID]);

//   useEffect(() => {
//     if (progressLoading || mode !== "learn") return;

//     const current = weatherLearnData[learnIndex];

//     if (!current) return;

//     let text =
//       `${current.weather}. ` +
//       `${current.feel}. ` +
//       `${current.info}. `;

//     current.clothes.forEach((clothing) => {
//       text += `${clothing.name}. ${clothing.use}. `;
//     });

//     speak(text);

//     return () => {
//       if (
//         typeof window !== "undefined" &&
//         window.speechSynthesis
//       ) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, [learnIndex, mode, progressLoading]);

//   /* =========================
//      LEARNING MODE
//   ========================= */

//   if (mode === "learn") {
//     const current = weatherLearnData[learnIndex];

//     const goPrevious = async () => {
//       const nextIndex = Math.max(learnIndex - 1, 0);

//       setLearnIndex(nextIndex);

//       await save({
//         mode: "learn",
//         learnIndex: nextIndex,
//         gameIndex,
//         selected: null,
//         feedback: "",
//         score,
//         gameOver: false,
//       });
//     };

//     const goNext = async () => {
//       const nextIndex = Math.min(
//         learnIndex + 1,
//         weatherLearnData.length - 1
//       );

//       setLearnIndex(nextIndex);

//       await save({
//         mode: "learn",
//         learnIndex: nextIndex,
//         gameIndex,
//         selected: null,
//         feedback: "",
//         score,
//         gameOver: false,
//       });
//     };

//     const startGame = async () => {
//       if (
//         typeof window !== "undefined" &&
//         window.speechSynthesis
//       ) {
//         window.speechSynthesis.cancel();
//       }

//       setMode("game");
//       setGameIndex(0);
//       setSelected(null);
//       setFeedback("");
//       setScore(0);
//       setGameOver(false);
//       setLocked(false);

//       await save({
//         mode: "game",
//         learnIndex,
//         gameIndex: 0,
//         selected: null,
//         feedback: "",
//         score: 0,
//         gameOver: false,
//       });
//     };

//     return (
//       <div className="weather-page">
//         <header className="weather-header">
         

//           <div className="brand">
//             <div className="brand-icon">🌴</div>
//             <div>
//               <strong>CurioKids</strong>
//               <span>JUNGLE GAMES</span>
//             </div>
//           </div>

//           <div className="header-pill">
//             🌿 Weather Adventure
//           </div>
//         </header>

//         <main className="weather-main">

//           <div className="jungle-title">
//             <span className="title-leaf">🌿</span>
//             <div>
//               <small>CURIOKIDS • JUNGLE ADVENTURE</small>
//               <h1>Learn Weather 🌦️</h1>
//             </div>
//             <span className="title-leaf">🍃</span>
//           </div>

//           <div className="weather-learning-card">

//             <div className="weather-card-top">
//               <div className="weather-progress">
//                 WEATHER {learnIndex + 1}/{weatherLearnData.length}
//               </div>

//               <div className="weather-badge">
//                 🌿 Explore
//               </div>
//             </div>

//             <div className="learning-content">

//               <div className="weather-image-frame">
//                 <div className="leaf-corner leaf-one">🍃</div>
//                 <div className="leaf-corner leaf-two">🌿</div>

//                 <img
//                   src={current.image}
//                   alt={current.weather}
//                 />
//               </div>

//               <div className="learning-info">

//                 <div className="weather-label">
//                   TODAY'S WEATHER
//                 </div>

//                 <h2>{current.weather}</h2>

//                 <div className="weather-feel">
//                   🌡️ {current.feel}
//                 </div>

//                 <p className="weather-description">
//                   {current.info}
//                 </p>

//                 <div className="clothes-box">
//                   <div className="clothes-heading">
//                     🧺 What should we wear?
//                   </div>

//                   {current.clothes.map((clothing, index) => (
//                     <div
//                       className="clothing-row"
//                       key={index}
//                     >
//                       <span className="clothing-emoji">
//                         {clothing.emoji}
//                       </span>

//                       <div>
//                         <strong>{clothing.name}</strong>
//                         <span>{clothing.use}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   className="hear-btn"
//                   onClick={() => {
//                     let text =
//                       `${current.weather}. ` +
//                       `${current.feel}. ` +
//                       `${current.info}. `;

//                     current.clothes.forEach((clothing) => {
//                       text +=
//                         `${clothing.name}. ` +
//                         `${clothing.use}. `;
//                     });

//                     speak(text);
//                   }}
//                 >
//                   🔊 Hear Weather
//                 </button>
//               </div>
//             </div>

//             <div className="learning-navigation">

//               <button
//                 className="wood-btn secondary"
//                 onClick={goPrevious}
//                 disabled={learnIndex === 0}
//               >
//                 ← Previous
//               </button>

//               <div className="page-dots">
//                 {weatherLearnData.map((_, index) => (
//                   <span
//                     key={index}
//                     className={
//                       index === learnIndex
//                         ? "active"
//                         : ""
//                     }
//                   />
//                 ))}
//               </div>

//               <button
//                 className="wood-btn"
//                 onClick={goNext}
//                 disabled={
//                   learnIndex ===
//                   weatherLearnData.length - 1
//                 }
//               >
//                 Next →
//               </button>
//             </div>

//             {learnIndex === weatherLearnData.length - 1 && (
//               <button
//                 className="start-game-btn"
//                 onClick={startGame}
//               >
//                 🎮 Start Weather Adventure
//               </button>
//             )}

//           </div>

//           <div className="jungle-tip">
//             <span className="tip-icon">🦊</span>
//             <div>
//               <small>JUNGLE TIP</small>
//               <strong>
//                 Every weather day is an adventure!
//               </strong>
//             </div>
//             <span className="tip-leaves">🌿 ✨ 🍃</span>
//           </div>

//         </main>
//       </div>
//     );
//   }

//   /* =========================
//      COMPLETION SCREEN
//   ========================= */

//   if (gameOver) {
//     const percentage =
//       (score / weatherGameData.length) * 100;

//     return (
//       <div className="weather-page">

//         <header className="weather-header">
         

//           <div className="brand">
//             <div className="brand-icon">🌴</div>
//             <div>
//               <strong>CurioKids</strong>
//               <span>JUNGLE GAMES</span>
//             </div>
//           </div>

//           <div className="header-pill">
//             ⭐ Adventure Complete
//           </div>
//         </header>

//         <main className="weather-main completion-main">

//           <div className="completion-card">

//             <div className="completion-mascot">
//               🦊
//             </div>

//             <div className="completion-tag">
//               🌿 WEATHER ADVENTURE
//             </div>

//             <h1>Great Adventure! 🎉</h1>

//             <p className="completion-subtitle">
//               You explored the weather jungle!
//             </p>

//             <div className="score-board">
//               <span>YOUR SCORE</span>

//               <strong>
//                 {score}/{weatherGameData.length}
//               </strong>

//               <small>
//                 {percentage.toFixed(0)}% accuracy
//               </small>
//             </div>

//             <div className="completion-message">
//               {percentage === 100 ? (
//                 <>
//                   🌟 Perfect!
//                   <span>You know your weather!</span>
//                 </>
//               ) : percentage >= 50 ? (
//                 <>
//                   🌈 Great Job!
//                   <span>You're learning fast!</span>
//                 </>
//               ) : (
//                 <>
//                   🌱 Keep Exploring!
//                   <span>Every try makes you stronger!</span>
//                 </>
//               )}
//             </div>

//             <button
//               className="start-game-btn"
//               onClick={async () => {
//                 setMode("game");
//                 setGameIndex(0);
//                 setSelected(null);
//                 setFeedback("");
//                 setScore(0);
//                 setGameOver(false);
//                 setLocked(false);

//                 const first = weatherGameData[0];

//                 await save({
//                   mode: "game",
//                   learnIndex,
//                   gameIndex: 0,
//                   selected: null,
//                   feedback: "",
//                   score: 0,
//                   gameOver: false,
//                   currentWeather: first.weather,
//                 });
//               }}
//             >
//               🔄 Play Again
//             </button>

//           </div>

//         </main>
//       </div>
//     );
//   }

//   /* =========================
//      GAME MODE
//   ========================= */

//   const current = weatherGameData[gameIndex];

//   const handleSelect = async (index) => {
//     if (locked || selected !== null) {
//       return;
//     }

//     setLocked(true);
//     setSelected(index);

//     const isCorrect =
//       index === current.correctIndex;

//     const updatedScore =
//       score + (isCorrect ? 1 : 0);

//     const feedbackText = isCorrect
//       ? "Correct! 🎉"
//       : "Oops! Try again 💛";

//     setFeedback(feedbackText);
//     setScore(updatedScore);

//     await save({
//       mode: "game",
//       learnIndex,
//       gameIndex,
//       selected: index,
//       feedback: feedbackText,
//       score: updatedScore,
//       gameOver: false,
//     });
//   };

//   const next = async () => {
//     if (selected === null) {
//       return;
//     }

//     if (
//       gameIndex <
//       weatherGameData.length - 1
//     ) {
//       const nextIndex = gameIndex + 1;

//       setGameIndex(nextIndex);
//       setSelected(null);
//       setFeedback("");
//       setLocked(false);

//       await save({
//         mode: "game",
//         learnIndex,
//         gameIndex: nextIndex,
//         selected: null,
//         feedback: "",
//         score,
//         gameOver: false,
//       });

//       return;
//     }

//     const percentage =
//       (score / weatherGameData.length) * 100;

//     await save({
//       mode: "game",
//       learnIndex,
//       gameIndex,
//       selected,
//       feedback,
//       score,
//       gameOver: true,
//     });

//     await finish(
//       percentage,
//       "Weather Clothes"
//     );

//     setGameOver(true);
//     setLocked(false);
//   };

//   return (
//     <div className="weather-page">

//       <header className="weather-header">
       

//         <div className="brand">
//           <div className="brand-icon">🌴</div>
//           <div>
//             <strong>CurioKids</strong>
//             <span>JUNGLE GAMES</span>
//           </div>
//         </div>

//         <div className="header-pill">
//           🌿 Weather Adventure
//         </div>
//       </header>

//       <main className="weather-main game-main">

//         <div className="game-heading">

//           <div className="game-tag">
//             🌿 JUNGLE WEATHER CHALLENGE
//           </div>

//           <h1>
//             What should Foxy wear? 🦊
//           </h1>

//           <p>
//             Look at the weather and choose the right clothing!
//           </p>

//         </div>

//         <div className="game-card">

//           <div className="game-topbar">

//             <div className="round-counter">
//               <span>ROUND</span>
//               <strong>
//                 {gameIndex + 1}
//               </strong>
//               <small>
//                 / {weatherGameData.length}
//               </small>
//             </div>

//             <div className="score-pill">
//               ⭐ {score} Stars
//             </div>

//           </div>

//           <div className="game-weather-area">

//             <div className="game-image-frame">

//               <span className="floating-leaf left">
//                 🍃
//               </span>

//               <img
//                 src={current.image}
//                 alt={current.weather}
//                 className="weather-game-image"
//               />

//               <span className="floating-leaf right">
//                 🌿
//               </span>

//             </div>

//             <div className="game-weather-name">
//               {current.weather}
//             </div>

//             <div className="game-question">
//               🧺 Choose the right clothes!
//             </div>

//           </div>

//           <div className="options-title">
//             Pick one to help Foxy:
//           </div>

//           <div className="clothing-options">

//             {current.options.map((img, index) => {

//               const isSelected =
//                 selected === index;

//               const isCorrect =
//                 index === current.correctIndex;

//               let optionClass = "clothing-option";

//               if (isSelected) {
//                 optionClass += " selected";

//                 if (isCorrect) {
//                   optionClass += " correct";
//                 } else {
//                   optionClass += " wrong";
//                 }
//               }

//               return (
//                 <button
//                   key={index}
//                   className={optionClass}
//                   onClick={() => handleSelect(index)}
//                   disabled={locked}
//                 >
//                   <div className="option-number">
//                     {index + 1}
//                   </div>

//                   <div className="option-image-box">
//                     <img
//                       src={img}
//                       alt="clothing option"
//                       className="option-img"
//                     />
//                   </div>

//                   {isSelected && (
//                     <span className="option-result">
//                       {isCorrect ? "✓" : "×"}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}

//           </div>

//           <div
//             className={`game-feedback ${
//               feedback
//                 ? feedback.startsWith("Correct")
//                   ? "success"
//                   : "error"
//                 : ""
//             }`}
//           >
//             {feedback}
//           </div>

//           {selected !== null && (
//             <button
//               className="game-next-btn"
//               onClick={next}
//             >
//               {gameIndex ===
//               weatherGameData.length - 1
//                 ? "🏁 Finish Adventure"
//                 : "Next Challenge →"}
//             </button>
//           )}

//           <div className="game-progress-bar">
//             <div
//               style={{
//                 width: `${
//                   ((gameIndex + 1) /
//                     weatherGameData.length) *
//                   100
//                 }%`,
//               }}
//             />
//           </div>

//         </div>

//         <div className="game-tip">
//           🦊
//           <span>
//             Think carefully, choose wisely, and have fun!
//           </span>
//           🌿
//         </div>

//       </main>
//     </div>
//   );
// }



import { useRef, useState, useEffect } from "react";
import "../styles/LetterTracing.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "letter-tracing";

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const INITIAL_STATE = {
  currentIndex: 0,
  results: {},
  hasDrawn: false,
  showResultCard: false,
  aiAnalysis: "",
};

export default function LetterTracing() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [restored, setRestored] = useState(false);

  /* =========================================================
     RESTORE SAVED GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    if (savedState) {
      setCurrentIndex(savedState.currentIndex ?? 0);
      setResults(savedState.results ?? {});
      setHasDrawn(savedState.hasDrawn ?? false);
      setShowResultCard(savedState.showResultCard ?? false);
      setAiAnalysis(savedState.aiAnalysis ?? "");
    }

    setRestored(true);
  }, [progressLoading, savedState, restored]);

  /* =========================================================
     CANVAS SETUP
  ========================================================= */

  useEffect(() => {
    if (!restored) return;
    if (showResultCard) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.width = 300;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1b4332";

    ctxRef.current = ctx;

    drawGuideLetter(uppercaseLetters[currentIndex]);
  }, [restored, showResultCard]);

  /* =========================================================
     GUIDE LETTER
  ========================================================= */

  const drawGuideLetter = (letter) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.font = "180px Arial";
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      letter,
      canvas.width / 2,
      canvas.height / 2
    );
  };

  /* =========================================================
     CHANGE LETTER
  ========================================================= */

  useEffect(() => {
    if (!ctxRef.current) return;
    if (!canvasRef.current) return;
    if (showResultCard) return;

    drawGuideLetter(
      uppercaseLetters[currentIndex]
    );
  }, [currentIndex, showResultCard]);

  /* =========================================================
     SPEECH
  ========================================================= */

  const speakLetter = () => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const letter =
      uppercaseLetters[currentIndex];

    const utter =
      new SpeechSynthesisUtterance(
        `This is the letter ${letter}. Trace the letter carefully.`
      );

    utter.rate = 0.75;

    window.speechSynthesis.speak(utter);
  };

  /* =========================================================
     CANVAS POSITION
  ========================================================= */

  const getPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

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
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  };

  /* =========================================================
     START DRAWING
  ========================================================= */

  const startDrawing = (e) => {
    e.preventDefault();

    const { x, y } = getPosition(e);

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);

    setDrawing(true);
    setHasDrawn(true);
  };

  /* =========================================================
     END DRAWING
  ========================================================= */

  const endDrawing = (e) => {
    e.preventDefault();

    setDrawing(false);

    if (ctxRef.current) {
      ctxRef.current.beginPath();
    }
  };

  /* =========================================================
     DRAW
  ========================================================= */

  const draw = (e) => {
    if (!drawing) return;

    e.preventDefault();

    const { x, y } = getPosition(e);

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  /* =========================================================
     CLEAR CANVAS
  ========================================================= */

  const clearCanvas = async () => {
    drawGuideLetter(
      uppercaseLetters[currentIndex]
    );

    setHasDrawn(false);

    await save({
      currentIndex,
      results,
      hasDrawn: false,
      showResultCard,
      aiAnalysis,
    });
  };

  /* =========================================================
     SMART EVALUATION
  ========================================================= */

  const evaluateDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const data = imageData.data;

    let drawnPixels = 0;
    let correctZonePixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      const isDrawn =
        r < 100 ||
        g < 100 ||
        b < 100;

      const isGuide =
        r > 100 &&
        r < 200 &&
        alpha > 0;

      if (isDrawn) {
        drawnPixels++;

        if (isGuide) {
          correctZonePixels++;
        }
      }
    }

    const coverage =
      (drawnPixels /
        (canvas.width * canvas.height)) *
      100;

    const accuracy =
      (correctZonePixels / drawnPixels) *
        100 || 0;

    if (coverage < 10) {
      return "wrong";
    }

    if (
      accuracy > 70 &&
      coverage > 40
    ) {
      return "good";
    }

    if (accuracy > 40) {
      return "practice";
    }

    return "wrong";
  };

  /* =========================================================
     FRIENDLY FEEDBACK
  ========================================================= */

  const getFriendlyFeedback = (grade) => {
    if (grade === "good") {
      return "🌟 Great job! You followed the letter very well!";
    }

    if (grade === "practice") {
      return "💛 Nice try! Follow the letter shape more carefully.";
    }

    return "🧠 Let’s try again slowly. You can do it!";
  };

  /* =========================================================
     AI ANALYSIS
  ========================================================= */

  const analyzeWithAI = async (resultData) => {
    try {
      const res = await fetch(
        "http://localhost:5000/ai/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            answers: resultData,
          }),
        }
      );

      const data = await res.json();

      setAiAnalysis(data.analysis);

      return data.analysis;
    } catch (error) {
      console.error(
        "AI analysis error:",
        error
      );

      const fallback =
        "✨ Keep practicing! You're improving!";

      setAiAnalysis(fallback);

      return fallback;
    }
  };

  /* =========================================================
     NEXT LETTER
  ========================================================= */

  const handleNext = async () => {
    if (!hasDrawn) {
      alert("Trace the letter first!");
      return;
    }

    const grade = evaluateDrawing();

    const letter =
      uppercaseLetters[currentIndex];

    const updatedResults = {
      ...results,
      [letter]: grade,
    };

    setResults(updatedResults);

    const friendlyFeedback =
      getFriendlyFeedback(grade);

    setAiAnalysis(friendlyFeedback);

    /* LAST LETTER */
    if (currentIndex === 25) {
      const analysis =
        await analyzeWithAI(
          updatedResults
        );

      setAiAnalysis(analysis);
      setShowResultCard(true);

      const totalScore =
        Object.values(
          updatedResults
        ).reduce(
          (total, result) => {
            if (result === "good") {
              return total + 100;
            }

            if (result === "practice") {
              return total + 50;
            }

            return total;
          },
          0
        );

      const finalPercentage =
        totalScore /
        uppercaseLetters.length;

      await finish(
        finalPercentage,
        "AI Letter Writing Test"
      );

      await save({
        currentIndex,
        results: updatedResults,
        hasDrawn: true,
        showResultCard: true,
        aiAnalysis: analysis,
        completed: true,
      });

      return;
    }

    /* NEXT */
    const nextIndex =
      currentIndex + 1;

    setCurrentIndex(nextIndex);
    setHasDrawn(false);

    await save({
      currentIndex: nextIndex,
      results: updatedResults,
      hasDrawn: false,
      showResultCard: false,
      aiAnalysis: friendlyFeedback,
      completed: false,
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="letter-page">

        <header className="letter-navbar">
          <div className="brand">
            <div className="brand-icon">
              🌴
            </div>

            <div className="brand-text">
              <strong>CurioKids</strong>
              <span>JUNGLE PRACTICE</span>
            </div>
          </div>
        </header>

        <main className="letter-main">
          <div className="loading-card">
            🌿 Restoring your adventure...
          </div>
        </main>

      </div>
    );
  }

  /* =========================================================
     RESULT SCREEN
  ========================================================= */

  if (showResultCard) {
    return (
      <div className="letter-page">

        <header className="letter-navbar">

          <div className="brand">

            <div className="brand-icon">
              🌴
            </div>

            <div className="brand-text">
              <strong>CurioKids</strong>
              <span>JUNGLE PRACTICE</span>
            </div>

          </div>

          <div className="header-pill">
            ⭐ Adventure Complete
          </div>

        </header>

        <main className="letter-main">

          <div className="letter-title">

            <span>🌿</span>

            <div>
              <small>
                CURIOKIDS • JUNGLE ADVENTURE
              </small>

              <h1>
                Letter Adventure ✏️
              </h1>
            </div>

            <span>🍃</span>

          </div>

          <div className="result-card">

            <div className="result-mascot">
              🦊
            </div>

            <div className="result-tag">
              🌿 LETTER TRACING
            </div>

            <h2>
              Great Writing Adventure! 🎉
            </h2>

            <p className="result-subtitle">
              You explored all 26 letters!
            </p>

            <div className="result-grid">

              {uppercaseLetters.map(
                (letter) => (
                  <div
                    key={letter}
                    className={`result-box ${
                      results[letter] || ""
                    }`}
                  >
                    {letter}
                  </div>
                )
              )}

            </div>

            <div className="ai-feedback">

              <span>🤖</span>

              <div>
                <strong>
                  AI Jungle Coach
                </strong>

                <p>
                  {aiAnalysis}
                </p>
              </div>

            </div>

          </div>

        </main>

      </div>
    );
  }

  const currentLetter =
    uppercaseLetters[currentIndex];

  /* =========================================================
     MAIN GAME
  ========================================================= */

  return (
    <div className="letter-page">

      {/* HEADER */}
      <header className="letter-navbar">

        <div className="brand">

          <div className="brand-icon">
            🌴
          </div>

          <div className="brand-text">
            <strong>CurioKids</strong>
            <span>JUNGLE PRACTICE</span>
          </div>

        </div>

        <div className="header-pill">
          ✏️ Letter Adventure
        </div>

      </header>

      {/* MAIN */}
      <main className="letter-main">

        {/* TITLE */}

        <div className="letter-title">

          <span className="title-leaf">
            🌿
          </span>

          <div>

            <small>
              CURIOKIDS • JUNGLE ADVENTURE
            </small>

            <h1>
              Learn Letters ✏️
            </h1>

          </div>

          <span className="title-leaf">
            🍃
          </span>

        </div>


        {/* BIG LEARNING CARD */}

        <div className="letter-learning-card">

          {/* TOP */}

          <div className="letter-card-top">

            <div className="letter-progress">
              LETTER {currentIndex + 1}/26
            </div>

            <div className="letter-badge">
              🌿 Trace & Learn
            </div>

          </div>


          {/* CONTENT */}

          <div className="letter-learning-content">

            {/* LEFT — LETTER */}

            <div className="letter-practice-area">

              <div className="letter-frame">

                <span className="frame-leaf left">
                  🍃
                </span>

                <div className="letter-guide">
                  {currentLetter}
                </div>

                <span className="frame-leaf right">
                  🌿
                </span>

              </div>

              <div className="letter-name">
                Letter {currentLetter}
              </div>

            </div>


            {/* RIGHT — INSTRUCTIONS */}

            <div className="letter-info">

              <div className="letter-label">
                TODAY'S LETTER
              </div>

              <h2>
                {currentLetter}
              </h2>

              <div className="letter-feel">
                ✏️ Trace it carefully
              </div>

              <p className="letter-description">
                Follow the light letter shape
                and draw the same letter on
                the tracing board.
              </p>


              {/* INSTRUCTION BOX */}

              <div className="trace-box">

                <div className="trace-heading">
                  🪵 How to trace
                </div>

                <div className="trace-step">
                  <span>1</span>
                  <div>
                    <strong>Look</strong>
                    <small>
                      Watch the letter shape.
                    </small>
                  </div>
                </div>

                <div className="trace-step">
                  <span>2</span>
                  <div>
                    <strong>Trace</strong>
                    <small>
                      Draw over the letter.
                    </small>
                  </div>
                </div>

                <div className="trace-step">
                  <span>3</span>
                  <div>
                    <strong>Check</strong>
                    <small>
                      See how well you did!
                    </small>
                  </div>
                </div>

              </div>


              <button
                className="hear-letter-btn"
                onClick={speakLetter}
              >
                🔊 Hear Letter
              </button>

            </div>

          </div>


          {/* ACTUAL CANVAS */}

          <div className="canvas-section">

            <div className="canvas-heading">
              ✏️ Trace {currentLetter} here
            </div>

            <div className="canvas-wrapper">

              <canvas
                ref={canvasRef}
                className="writing-canvas"
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={draw}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={endDrawing}
                onTouchMove={draw}
                style={{
                  touchAction: "none",
                }}
              />

            </div>

            <div className="canvas-hint">
              Follow the faded letter and
              write slowly 🌱
            </div>

          </div>


          {/* NAVIGATION */}

          <div className="letter-navigation">

            <button
              className="wood-btn secondary"
              onClick={async () => {
                const previousIndex =
                  Math.max(
                    currentIndex - 1,
                    0
                  );

                setCurrentIndex(
                  previousIndex
                );

                setHasDrawn(false);

                await save({
                  currentIndex:
                    previousIndex,
                  results,
                  hasDrawn: false,
                  showResultCard: false,
                  aiAnalysis,
                });
              }}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>


            <div className="page-dots">

              {uppercaseLetters.map(
                (_, index) => (
                  <span
                    key={index}
                    className={
                      index === currentIndex
                        ? "active"
                        : ""
                    }
                  />
                )
              )}

            </div>


            <button
              className="clear-small-btn"
              onClick={clearCanvas}
            >
              🔄 Clear
            </button>


            <button
              className="wood-btn"
              onClick={handleNext}
            >
              {currentIndex === 25
                ? "🏁 Finish"
                : "Next →"}
            </button>

          </div>

        </div>


        {/* JUNGLE TIP */}

        <div className="jungle-tip">

          <span className="tip-icon">
            🦊
          </span>

          <div>
            <small>
              JUNGLE TIP
            </small>

            <strong>
              Slow and steady makes
              beautiful letters!
            </strong>
          </div>

          <span className="tip-leaves">
            🌿 ✨ 🍃
          </span>

        </div>

      </main>

    </div>
  );
}