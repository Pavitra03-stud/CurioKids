// import React, { useEffect, useMemo, useState } from "react";
// import "../styles/DescendingOrderLearning.css";

// const levels = [
//   { id: 1, title: "Level 1", subtitle: "Descending 1 to 10", range: 10, count: 4 },
//   { id: 2, title: "Level 2", subtitle: "Descending 1 to 50", range: 50, count: 5 },
//   { id: 3, title: "Level 3", subtitle: "Descending 1 to 100", range: 100, count: 6 },
// ];

// function shuffleArray(array) {
//   const copy = [...array];
//   for (let i = copy.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [copy[i], copy[j]] = [copy[j], copy[i]];
//   }
//   return copy;
// }

// function generateUniqueNumbers(range, count) {
//   const allNumbers = Array.from({ length: range }, (_, index) => index + 1);
//   return shuffleArray(allNumbers).slice(0, count);
// }

// export default function DescendingOrderLearning() {
//   const [screen, setScreen] = useState("levels");
//   const [selectedLevel, setSelectedLevel] = useState(null);
//   const [numbers, setNumbers] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState([]);
//   const [message, setMessage] = useState("Start from the biggest number.");
//   const [completed, setCompleted] = useState(false);

//   const correctOrder = useMemo(() => {
//     return [...numbers].sort((a, b) => b - a);
//   }, [numbers]);

//   const currentExpected = correctOrder[selectedOrder.length];

//   const generateLesson = (level) => {
//     const newNumbers = generateUniqueNumbers(level.range, level.count);
//     setNumbers(newNumbers);
//     setSelectedOrder([]);
//     setCompleted(false);
//     setMessage("Start from the biggest number.");
//   };

//   const handleSelectLevel = (level) => {
//     setSelectedLevel(level);
//     generateLesson(level);
//     setScreen("lesson");
//   };

//   const handleNumberClick = (num) => {
//     if (completed) return;
//     if (selectedOrder.includes(num)) return;

//     if (num === currentExpected) {
//       const updated = [...selectedOrder, num];
//       setSelectedOrder(updated);

//       if (updated.length === correctOrder.length) {
//         setCompleted(true);
//         setMessage(`🎉 Great! Descending order is ${correctOrder.join(" → ")}`);
//       } else {
//         setMessage(`Good! Next find the biggest number from the remaining ones.`);
//       }
//     } else {
//       setMessage(`Try again. Start from the biggest number.`);
//     }
//   };

//   const handleReset = () => {
//     setSelectedOrder([]);
//     setCompleted(false);
//     setMessage("Start from the biggest number.");
//   };

//   const handleNextExample = () => {
//     if (!selectedLevel) return;
//     generateLesson(selectedLevel);
//   };

//   const handleBack = () => {
//     setScreen("levels");
//     setSelectedLevel(null);
//     setNumbers([]);
//     setSelectedOrder([]);
//     setCompleted(false);
//     setMessage("Start from the biggest number.");
//   };

//   const getHintText = () => {
//     if (!selectedLevel) return "";
//     if (selectedLevel.id === 1) {
//       return "Look for the biggest number first, then go down.";
//     }
//     if (selectedLevel.id === 2) {
//       return "Compare the numbers carefully and choose the biggest remaining number.";
//     }
//     return "Find the largest number each time and arrange from big to small.";
//   };

//   if (screen === "levels") {
//     return (
//       <div className="descending-page">
//         <div className="descending-card">
//           <div className="top-section">
//             <h1>⬇️ Descending Order Learning</h1>
//             <p>Learn how to arrange numbers from biggest to smallest.</p>
//           </div>

//           <div className="rule-box">
//             <h2>Rule</h2>
//             <p>Descending order means: <strong>Big number → Small number</strong></p>
//             <p>Example: <strong>9 → 7 → 5 → 2</strong></p>
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
//     <div className="descending-page">
//       <div className="descending-card">
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
//               <p>{getHintText()}</p>
//               <p className="example-text">
//                 Descending order means going <strong>down</strong> from the biggest number.
//               </p>
//             </div>

//             <div className="numbers-box">
//               {numbers.map((num) => {
//                 const isSelected = selectedOrder.includes(num);
//                 const isCurrentHint = !completed && num === currentExpected;

//                 return (
//                   <button
//                     key={num}
//                     className={`number-btn ${isSelected ? "selected-btn" : ""} ${
//                       selectedLevel.id === 1 && isCurrentHint ? "hint-btn" : ""
//                     }`}
//                     onClick={() => handleNumberClick(num)}
//                     disabled={isSelected}
//                   >
//                     {num}
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="answer-box">
//               <h3>Descending Order</h3>
//               <div className="answer-row">
//                 {correctOrder.map((_, index) => (
//                   <div key={index} className="answer-slot">
//                     {selectedOrder[index] ?? "?"}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="message-box">
//               <p>{message}</p>
//             </div>
//           </div>

//           <div className="lesson-side">
//             <div className="side-card">
//               <h3>Remember</h3>
//               <p>1. Find the biggest number</p>
//               <p>2. Put it first</p>
//               <p>3. Continue until smallest</p>
//             </div>

//             <div className="side-card">
//               <h3>Example</h3>
//               <div className="arrow-example">
//                 <span>10</span>
//                 <span>⬇️</span>
//                 <span>8</span>
//                 <span>⬇️</span>
//                 <span>5</span>
//               </div>
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
import "../styles/DescendingOrderLearning.css";

const levels = [
  { id: 1, title: "Level 1", subtitle: "Descending 1 to 10", range: 10, count: 4 },
  { id: 2, title: "Level 2", subtitle: "Descending 1 to 50", range: 50, count: 5 },
  { id: 3, title: "Level 3", subtitle: "Descending 1 to 100", range: 100, count: 6 },
];

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateUniqueNumbers(range, count) {
  const allNumbers = Array.from({ length: range }, (_, index) => index + 1);
  return shuffleArray(allNumbers).slice(0, count);
}

export default function DescendingOrderLearning() {
  const [screen, setScreen] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [message, setMessage] = useState("Start from the biggest number.");
  const [completed, setCompleted] = useState(false);
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

  const correctOrder = useMemo(() => {
    return [...numbers].sort((a, b) => b - a);
  }, [numbers]);

  const currentExpected = correctOrder[selectedOrder.length];

  const getHintText = () => {
    if (!selectedLevel) return "";
    if (selectedLevel.id === 1) {
      return "Look for the biggest number first, then go down.";
    }
    if (selectedLevel.id === 2) {
      return "Compare the numbers carefully and choose the biggest remaining number.";
    }
    return "Find the largest number each time and arrange from big to small.";
  };

  const getLevelInstructionVoice = (level) => {
    if (level.id === 1) {
      return "Welcome to level 1. Descending order means start from the biggest number and go down.";
    }
    if (level.id === 2) {
      return "Welcome to level 2. Find the biggest remaining number each time.";
    }
    return "Welcome to level 3. Arrange the numbers from biggest to smallest.";
  };

  const generateLesson = (level) => {
    const newNumbers = generateUniqueNumbers(level.range, level.count);
    setNumbers(newNumbers);
    setSelectedOrder([]);
    setCompleted(false);
    setMessage("Start from the biggest number.");

    setTimeout(() => {
      speak("Find the biggest number first.");
    }, 150);
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setScreen("lesson");
    generateLesson(level);

    setTimeout(() => {
      speak(getLevelInstructionVoice(level));
    }, 300);
  };

  const handleNumberClick = (num) => {
    if (completed) return;
    if (selectedOrder.includes(num)) return;

    if (num === currentExpected) {
      const updated = [...selectedOrder, num];
      setSelectedOrder(updated);

      if (updated.length === correctOrder.length) {
        setCompleted(true);
        setMessage(`🎉 Great! Descending order is ${correctOrder.join(" → ")}`);
        speak(`Excellent. Descending order is ${correctOrder.join(", ")}`);
      } else {
        setMessage("Good! Now find the biggest number from the remaining ones.");
        speak(`Good job. ${num} is correct.`);
      }
    } else {
      setMessage("Try again. Start from the biggest number.");
      speak("Try again. Find the biggest number.");
    }
  };

  const handleReset = () => {
    setSelectedOrder([]);
    setCompleted(false);
    setMessage("Start from the biggest number.");
    speak("Lesson reset. Start from the biggest number.");
  };

  const handleNextExample = () => {
    if (!selectedLevel) return;
    generateLesson(selectedLevel);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setScreen("levels");
    setSelectedLevel(null);
    setNumbers([]);
    setSelectedOrder([]);
    setCompleted(false);
    setMessage("Start from the biggest number.");
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
      <div className="descending-page">
        <div className="descending-card">
          <div className="top-section">
            <h1>⬇️ Descending Order Learning</h1>
            <p>Learn how to arrange numbers from biggest to smallest.</p>
          </div>

          <div className="rule-box">
            <h2>Rule</h2>
            <p>
              Descending order means: <strong>Big number → Small number</strong>
            </p>
            <p>
              Example: <strong>9 → 7 → 5 → 2</strong>
            </p>
          </div>

          <div className="voice-toggle-box">
            <button
              className="voice-btn"
              onClick={() => setVoiceEnabled((prev) => !prev)}
            >
              {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
            </button>
          </div>

          <div className="levels-grid">
            {levels.map((level) => (
              <button
                key={level.id}
                className="level-box"
                onClick={() => handleSelectLevel(level)}
              >
                <div className="level-circle">{level.id}</div>
                <h3>{level.title}</h3>
                <p>{level.subtitle}</p>
                <span>Tap to Learn</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="descending-page">
      <div className="descending-card">
        <div className="top-section lesson-top">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>{selectedLevel.title}</h1>
          <p>{selectedLevel.subtitle}</p>
        </div>

        <div className="lesson-layout">
          <div className="lesson-main">
            <div className="teach-box">
              <h2>Teaching Method</h2>
              <p>{getHintText()}</p>
              <p className="example-text">
                Descending order means going <strong>down</strong> from the biggest number.
              </p>

              <div className="teach-actions">
                <button
                  className="voice-btn"
                  onClick={() => speak("Start from the biggest number.")}
                >
                  🔊 Play Instruction
                </button>

                <button
                  className="voice-btn secondary-voice-btn"
                  onClick={() => setVoiceEnabled((prev) => !prev)}
                >
                  {voiceEnabled ? "🔇 Mute Voice" : "🔊 Unmute Voice"}
                </button>
              </div>
            </div>

            <div className="numbers-box">
              {numbers.map((num) => {
                const isSelected = selectedOrder.includes(num);
                const isCurrentHint = !completed && num === currentExpected;

                return (
                  <button
                    key={num}
                    className={`number-btn ${isSelected ? "selected-btn" : ""} ${
                      selectedLevel.id === 1 && isCurrentHint ? "hint-btn" : ""
                    }`}
                    onClick={() => handleNumberClick(num)}
                    disabled={isSelected}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="answer-box">
              <h3>Descending Order</h3>
              <div className="answer-row">
                {correctOrder.map((_, index) => (
                  <div key={index} className="answer-slot">
                    {selectedOrder[index] ?? "?"}
                  </div>
                ))}
              </div>
            </div>

            <div className="message-box">
              <p>{message}</p>
            </div>
          </div>

          <div className="lesson-side">
            <div className="side-card">
              <h3>Remember</h3>
              <p>1. Find the biggest number</p>
              <p>2. Put it first</p>
              <p>3. Continue until smallest</p>
            </div>

            <div className="side-card">
              <h3>Example</h3>
              <div className="arrow-example">
                <span>10</span>
                <span>⬇️</span>
                <span>8</span>
                <span>⬇️</span>
                <span>5</span>
              </div>
            </div>

            <div className="button-group">
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
              <button className="next-btn" onClick={handleNextExample}>
                Next Example
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}