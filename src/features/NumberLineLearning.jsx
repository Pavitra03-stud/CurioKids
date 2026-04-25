// import React, { useEffect, useMemo, useState } from "react";
// import "../styles/NumberLineLearning.css";

// const levels = [
//   { id: 1, title: "Level 1", subtitle: "Number Line 0 to 10", max: 10, step: 1 },
//   { id: 2, title: "Level 2", subtitle: "Number Line 0 to 50", max: 50, step: 5 },
//   { id: 3, title: "Level 3", subtitle: "Number Line 0 to 100", max: 100, step: 10 },
// ];

// function getRandomInt(min, max) {
//   const start = Math.ceil(min);
//   const end = Math.floor(max);
//   return Math.floor(Math.random() * (end - start + 1)) + start;
// }

// export default function NumberLineLearning() {
//   const [screen, setScreen] = useState("levels");
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [targetNumber, setTargetNumber] = useState(0);
//   const [frogPosition, setFrogPosition] = useState(0);
//   const [message, setMessage] = useState("Tap a level to start learning.");
//   const [voiceEnabled, setVoiceEnabled] = useState(true);
//   const [activityType, setActivityType] = useState("tap");
//   const [selectedAnswer, setSelectedAnswer] = useState(null);

//   const speak = (text) => {
//     if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
//     window.speechSynthesis.cancel();
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.rate = 0.9;
//     speech.pitch = 1;
//     speech.volume = 1;
//     window.speechSynthesis.speak(speech);
//   };

//   const numberLine = useMemo(() => {
//     if (!selectedLevel) return [];
//     return Array.from(
//       { length: Math.floor(selectedLevel.max / selectedLevel.step) + 1 },
//       (_, index) => index * selectedLevel.step
//     );
//   }, [selectedLevel]);

//   const generateActivity = (level, forcedType = null) => {
//     const types = ["tap", "beforeAfter", "jump"];
//     const nextType = forcedType || types[getRandomInt(0, types.length - 1)];

//     let nextTarget = 0;

//     if (nextType === "tap") {
//       nextTarget = numberLine[getRandomInt(0, numberLine.length - 1)] ?? 0;
//       setMessage(`Tap number ${nextTarget} on the number line.`);
//       speak(`Tap number ${nextTarget}`);
//     }

//     if (nextType === "beforeAfter") {
//       const validNumbers = numberLine.filter(
//         (num) => num !== 0 && num !== level.max
//       );
//       nextTarget = validNumbers[getRandomInt(0, validNumbers.length - 1)] ?? level.step;
//       setMessage(`Find the number before and after ${nextTarget}.`);
//       speak(`Find the number before and after ${nextTarget}`);
//     }

//     if (nextType === "jump") {
//       nextTarget = numberLine[getRandomInt(1, numberLine.length - 1)] ?? level.step;
//       setFrogPosition(0);
//       setMessage(`Help the frog jump to ${nextTarget}.`);
//       speak(`Help the frog jump to ${nextTarget}`);
//     }

//     setActivityType(nextType);
//     setTargetNumber(nextTarget);
//     setSelectedAnswer(null);
//   };

//   const handleSelectLevel = (level) => {
//     setSelectedLevel(level);
//     setScreen("lesson");
//     setFrogPosition(0);
//     setSelectedAnswer(null);

//     setTimeout(() => {
//       generateActivity(level, "tap");
//       speak(`Welcome to ${level.title}. This is number line learning.`);
//     }, 150);
//   };

//   const handleNumberClick = (num) => {
//     if (!selectedLevel) return;

//     if (activityType === "tap") {
//       if (num === targetNumber) {
//         setSelectedAnswer(num);
//         setMessage(`✅ Correct! This is number ${targetNumber}.`);
//         speak(`Good job. This is number ${targetNumber}`);
//       } else {
//         setMessage(`Try again. Find number ${targetNumber}.`);
//         speak(`Try again. Find number ${targetNumber}`);
//       }
//       return;
//     }

//     if (activityType === "beforeAfter") {
//       const before = targetNumber - selectedLevel.step;
//       const after = targetNumber + selectedLevel.step;

//       if (num === before || num === after) {
//         const nextAnswers = Array.isArray(selectedAnswer) ? [...selectedAnswer, num] : [num];
//         const uniqueAnswers = [...new Set(nextAnswers)];
//         setSelectedAnswer(uniqueAnswers);

//         if (uniqueAnswers.length === 2) {
//           setMessage(`✅ Correct! Before ${targetNumber} is ${before}, after is ${after}.`);
//           speak(`Correct. Before ${targetNumber} is ${before}. After is ${after}`);
//         } else {
//           setMessage(`Good! Now find the other number near ${targetNumber}.`);
//           speak(`Good. Find the other number.`);
//         }
//       } else {
//         setMessage(`Try again. Look near ${targetNumber} on the number line.`);
//         speak(`Try again`);
//       }
//       return;
//     }

//     if (activityType === "jump") {
//       if (num === targetNumber) {
//         setFrogPosition(num);
//         setSelectedAnswer(num);
//         setMessage(`✅ Great! The frog jumped to ${targetNumber}.`);
//         speak(`Great. The frog jumped to ${targetNumber}`);
//       } else {
//         setMessage(`Tap ${targetNumber} so the frog can jump there.`);
//         speak(`Tap ${targetNumber}`);
//       }
//     }
//   };

//   const handleReset = () => {
//     if (!selectedLevel) return;
//     setSelectedAnswer(null);
//     setFrogPosition(activityType === "jump" ? 0 : frogPosition);
//     generateActivity(selectedLevel, activityType);
//   };

//   const handleNextExample = () => {
//     if (!selectedLevel) return;
//     setSelectedAnswer(null);
//     setFrogPosition(0);
//     generateActivity(selectedLevel);
//   };

//   const handleBack = () => {
//     if (typeof window !== "undefined" && window.speechSynthesis) {
//       window.speechSynthesis.cancel();
//     }
//     setScreen("levels");
//     setSelectedLevel(null);
//     setTargetNumber(0);
//     setFrogPosition(0);
//     setMessage("Tap a level to start learning.");
//     setSelectedAnswer(null);
//   };

//   const getTeachingText = () => {
//     if (!selectedLevel) return "";
//     if (selectedLevel.id === 1) {
//       return "Numbers on the left are smaller. Numbers on the right are bigger.";
//     }
//     if (selectedLevel.id === 2) {
//       return "Move from left to right to reach bigger numbers.";
//     }
//     return "Use the number line to find positions, before, after, and jumps.";
//   };

//   const isBeforeAfterCorrect = () => {
//     if (!selectedLevel || activityType !== "beforeAfter" || !Array.isArray(selectedAnswer)) {
//       return false;
//     }
//     return selectedAnswer.length === 2;
//   };

//   useEffect(() => {
//     return () => {
//       if (typeof window !== "undefined" && window.speechSynthesis) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   if (screen === "levels") {
//     return (
//       <div className="numberline-page">
//         <div className="numberline-card">
//           <div className="top-section">
//             <h1>📏 Number Line Learning</h1>
//             <p>Learn numbers, positions, before, after, and jumps.</p>
//           </div>

//           <div className="rule-box">
//             <h2>Number Line Rule</h2>
//             <p>
//               Left side means <strong>smaller</strong> numbers.
//             </p>
//             <p>
//               Right side means <strong>bigger</strong> numbers.
//             </p>
//           </div>

//           <div className="voice-toggle-box">
//             <button
//               className="voice-btn"
//               onClick={() => setVoiceEnabled((prev) => !prev)}
//             >
//               {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
//             </button>
//           </div>

//           <div className="levels-grid">
//             {levels.map((level) => (
//               <button
//                 key={level.id}
//                 className="level-box"
//                 onClick={() => handleSelectLevel(level)}
//               >
//                 <div className="level-circle">{level.id}</div>
//                 <h3>{level.title}</h3>
//                 <p>{level.subtitle}</p>
//                 <span>Tap to Learn</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="numberline-page">
//       <div className="numberline-card">
//         <div className="top-section lesson-top">
//           <button className="back-btn" onClick={handleBack}>
//             ← Back
//           </button>
//           <h1>{selectedLevel.title}</h1>
//           <p>{selectedLevel.subtitle}</p>
//         </div>

//         <div className="lesson-layout">
//           <div className="lesson-main">
//             <div className="teach-box">
//               <h2>Teaching Method</h2>
//               <p>{getTeachingText()}</p>
//               <p className="example-text">
//                 Follow the number line from left to right.
//               </p>

//               <div className="teach-actions">
//                 <button
//                   className="voice-btn"
//                   onClick={() => speak(message)}
//                 >
//                   🔊 Play Instruction
//                 </button>
//               </div>
//             </div>

//             <div className="activity-box">
//               <h3>
//                 {activityType === "tap" && `Tap number ${targetNumber}`}
//                 {activityType === "beforeAfter" && `Before and After ${targetNumber}`}
//                 {activityType === "jump" && `Frog Jump to ${targetNumber}`}
//               </h3>
//             </div>

//             <div className="number-line-wrapper">
//               <div className="line-track" />

//               {numberLine.map((num) => {
//                 const isTarget = num === targetNumber;
//                 const isSelectedSingle = selectedAnswer === num;
//                 const isSelectedMulti =
//                   Array.isArray(selectedAnswer) && selectedAnswer.includes(num);
//                 const isFrogHere = frogPosition === num;

//                 return (
//                   <div
//                     key={num}
//                     className="line-point"
//                     style={{
//                       left: `${(num / selectedLevel.max) * 100}%`,
//                     }}
//                   >
//                     {isFrogHere && <div className="frog-marker">🐸</div>}

//                     <button
//                       className={`point-btn 
//                         ${isTarget && activityType === "tap" ? "target-btn" : ""}
//                         ${isSelectedSingle || isSelectedMulti ? "selected-btn" : ""}
//                       `}
//                       onClick={() => handleNumberClick(num)}
//                     >
//                       {num}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="message-box">
//               <p>{message}</p>
//             </div>

//             {activityType === "beforeAfter" && isBeforeAfterCorrect() && (
//               <div className="done-box">
//                 🎉 You found both the before and after numbers!
//               </div>
//             )}

//             {activityType === "jump" && selectedAnswer === targetNumber && (
//               <div className="done-box">
//                 🎉 The frog reached the correct number!
//               </div>
//             )}

//             {activityType === "tap" && selectedAnswer === targetNumber && (
//               <div className="done-box">
//                 🎉 You found the correct number on the line!
//               </div>
//             )}
//           </div>

//           <div className="lesson-side">
//             <div className="side-card">
//               <h3>Remember</h3>
//               <p>1. Left is smaller</p>
//               <p>2. Right is bigger</p>
//               <p>3. Each point shows a position</p>
//             </div>

//             <div className="side-card">
//               <h3>Activities</h3>
//               <p>• Tap the number</p>
//               <p>• Find before and after</p>
//               <p>• Help the frog jump</p>
//             </div>

//             <div className="button-group">
//               <button className="reset-btn" onClick={handleReset}>
//                 Reset
//               </button>
//               <button className="next-btn" onClick={handleNextExample}>
//                 Next Example
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import "../styles/NumberLineLearning.css";

const levels = [
  { id: 1, title: "Level 1", subtitle: "Learn 0 to 10", max: 10, step: 1 },
  { id: 2, title: "Level 2", subtitle: "Learn 0 to 50", max: 50, step: 5 },
  { id: 3, title: "Level 3", subtitle: "Learn 0 to 100", max: 100, step: 10 },
];

export default function NumberLineLearning() {
  const [screen, setScreen] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speak = (text) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  const numberLine = useMemo(() => {
    if (!selectedLevel) return [];
    return Array.from(
      { length: Math.floor(selectedLevel.max / selectedLevel.step) + 1 },
      (_, index) => index * selectedLevel.step
    );
  }, [selectedLevel]);

  const currentNumber = numberLine[currentIndex] ?? 0;
  const beforeNumber = currentIndex > 0 ? numberLine[currentIndex - 1] : null;
  const afterNumber = currentIndex < numberLine.length - 1 ? numberLine[currentIndex + 1] : null;

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setCurrentIndex(0);
    setScreen("learn");

    setTimeout(() => {
      speak(
        `${level.title}. This is a number line. Numbers on the left are smaller. Numbers on the right are bigger.`
      );
    }, 200);
  };

  const handleSpeak = () => {
    let text = `This is number ${currentNumber}. `;
    if (beforeNumber !== null) text += `Before ${currentNumber} is ${beforeNumber}. `;
    if (afterNumber !== null) text += `After ${currentNumber} is ${afterNumber}. `;
    text += `Numbers move from left to right.`;
    speak(text);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);

      const prevNumber = numberLine[prevIndex];
      const prevBefore = prevIndex > 0 ? numberLine[prevIndex - 1] : null;
      const prevAfter = prevIndex < numberLine.length - 1 ? numberLine[prevIndex + 1] : null;

      let text = `This is number ${prevNumber}. `;
      if (prevBefore !== null) text += `Before ${prevNumber} is ${prevBefore}. `;
      if (prevAfter !== null) text += `After ${prevNumber} is ${prevAfter}.`;
      speak(text);
    }
  };

  const handleNext = () => {
    if (currentIndex < numberLine.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      const nextNumber = numberLine[nextIndex];
      const nextBefore = nextIndex > 0 ? numberLine[nextIndex - 1] : null;
      const nextAfter = nextIndex < numberLine.length - 1 ? numberLine[nextIndex + 1] : null;

      let text = `This is number ${nextNumber}. `;
      if (nextBefore !== null) text += `Before ${nextNumber} is ${nextBefore}. `;
      if (nextAfter !== null) text += `After ${nextNumber} is ${nextAfter}.`;
      speak(text);
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setScreen("levels");
    setSelectedLevel(null);
    setCurrentIndex(0);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (screen === "levels") {
    return (
      <div className="number-line-page">
        <div className="number-line-header">
          <h1>Number Line Learning</h1>
        </div>

        <div className="number-line-levels-wrapper">
          <div className="level-top-box">
            <h2>Choose a Level</h2>
            <p>Start learning the number line step by step.</p>
          </div>

          <div className="level-grid">
            {levels.map((level) => (
              <button
                key={level.id}
                className="level-card"
                onClick={() => handleSelectLevel(level)}
              >
                <div className="level-number">{level.id}</div>
                <h3>{level.title}</h3>
                <p>{level.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="bottom-controls single">
            <button
              className="speak-btn"
              onClick={() => setVoiceEnabled((prev) => !prev)}
            >
              {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="number-line-page">
      <div className="number-line-header">
        <h1>Number Line Learning</h1>
      </div>

      <div className="number-line-content">
        <div className="top-learning-row">
          <div className="main-number-card">
            <div className="frog-icon">🐸</div>
            <div className="main-number">{currentNumber}</div>
            <div className="main-label">Current Number</div>
          </div>

          <div className="right-learning-card">
            <h2>Learn number position</h2>

            <div className="mini-card-row">
              <div className="mini-card">
                <span className="mini-title">Before</span>
                <span className="mini-value">
                  {beforeNumber !== null ? beforeNumber : "-"}
                </span>
              </div>

              <div className="mini-card current-mini">
                <span className="mini-title">Current</span>
                <span className="mini-value">{currentNumber}</span>
              </div>

              <div className="mini-card">
                <span className="mini-title">After</span>
                <span className="mini-value">
                  {afterNumber !== null ? afterNumber : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="middle-learning-box">
          <h2>
            {beforeNumber !== null ? beforeNumber : "-"} , {currentNumber} ,{" "}
            {afterNumber !== null ? afterNumber : "-"}
          </h2>

          <div className="number-line-track-wrapper">
            <div className="number-line-track" />

            {numberLine.map((num, index) => {
              const isCurrent = index === currentIndex;
              const isBefore = index === currentIndex - 1;
              const isAfter = index === currentIndex + 1;

              return (
                <div
                  key={num}
                  className="line-point-box"
                  style={{ left: `${(num / selectedLevel.max) * 100}%` }}
                >
                  {isCurrent && <div className="line-frog">🐸</div>}

                  <div
                    className={`line-point 
                      ${isCurrent ? "current-point" : ""}
                      ${isBefore ? "before-point" : ""}
                      ${isAfter ? "after-point" : ""}
                    `}
                  >
                    {num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="info-row">
          <div className="info-bar">
            Learn: In number line, {beforeNumber !== null ? beforeNumber : "no number"} comes
            before <strong> {currentNumber} </strong>
            and {afterNumber !== null ? afterNumber : "no number"} comes after it.
          </div>

          <div className="level-badge-box">
            <span>Level: {selectedLevel.id}</span>
          </div>
        </div>

        <div className="bottom-controls">
          <button className="speak-btn" onClick={handleSpeak}>
            🔊 Speak
          </button>

          <button className="nav-btn" onClick={handlePrevious} disabled={currentIndex === 0}>
            Previous
          </button>

          <button
            className="nav-btn next-nav-btn"
            onClick={handleNext}
            disabled={currentIndex === numberLine.length - 1}
          >
            Next
          </button>

          <button className="back-action-btn" onClick={handleBack}>
            Back to Levels
          </button>
        </div>

        <div className="progress-text">
          {currentIndex + 1} / {numberLine.length}
        </div>
      </div>
    </div>
  );
}