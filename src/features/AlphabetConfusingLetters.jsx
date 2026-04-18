// import { useEffect, useMemo, useRef, useState } from "react";
// import "../styles/AnimalPathLetters.css";
// import BackIcon from "../components/BackIcon";

// const LETTERS = [
//   { letter: "A", animal: "Ant", emoji: "🐜", sound: "A says /a/" },
//   { letter: "B", animal: "Bear", emoji: "🐻", sound: "B says /b/" },
//   { letter: "C", animal: "Cat", emoji: "🐱", sound: "C says /c/" },
//   { letter: "D", animal: "Dog", emoji: "🐶", sound: "D says /d/" },
//   { letter: "E", animal: "Elephant", emoji: "🐘", sound: "E says /e/" },
//   { letter: "F", animal: "Fish", emoji: "🐟", sound: "F says /f/" },
//   { letter: "G", animal: "Goat", emoji: "🐐", sound: "G says /g/" },
//   { letter: "H", animal: "Horse", emoji: "🐴", sound: "H says /h/" },
//   { letter: "I", animal: "Iguana", emoji: "🦎", sound: "I says /i/" },
//   { letter: "J", animal: "Jellyfish", emoji: "🪼", sound: "J says /j/" },
//   { letter: "K", animal: "Koala", emoji: "🐨", sound: "K says /k/" },
//   { letter: "L", animal: "Lion", emoji: "🦁", sound: "L says /l/" },
//   { letter: "M", animal: "Monkey", emoji: "🐵", sound: "M says /m/" },
//   { letter: "N", animal: "Nest bird", emoji: "🐦", sound: "N says /n/" },
//   { letter: "O", animal: "Owl", emoji: "🦉", sound: "O says /o/" },
//   { letter: "P", animal: "Panda", emoji: "🐼", sound: "P says /p/" },
//   { letter: "Q", animal: "Quail", emoji: "🐤", sound: "Q says /q/" },
//   { letter: "R", animal: "Rabbit", emoji: "🐰", sound: "R says /r/" },
//   { letter: "S", animal: "Snake", emoji: "🐍", sound: "S says /s/" },
//   { letter: "T", animal: "Tiger", emoji: "🐯", sound: "T says /t/" },
//   { letter: "U", animal: "Urial", emoji: "🐏", sound: "U says /u/" },
//   { letter: "V", animal: "Vulture", emoji: "🦅", sound: "V says /v/" },
//   { letter: "W", animal: "Whale", emoji: "🐋", sound: "W says /w/" },
//   { letter: "X", animal: "Fox", emoji: "🦊", sound: "X sounds like /ks/" },
//   { letter: "Y", animal: "Yak", emoji: "🐂", sound: "Y says /y/" },
//   { letter: "Z", animal: "Zebra", emoji: "🦓", sound: "Z says /z/" },
// ];

// const createOptions = (correctLetter) => {
//   const others = LETTERS.filter((item) => item.letter !== correctLetter);
//   const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 5);
//   return [...shuffled, LETTERS.find((item) => item.letter === correctLetter)].sort(
//     () => Math.random() - 0.5
//   );
// };

// export default function AnimalPathLetters({ goBack }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [message, setMessage] = useState("Tap the correct letter for the animal path!");
//   const [score, setScore] = useState(0);
//   const [selectedLetter, setSelectedLetter] = useState("");
//   const [shakeTile, setShakeTile] = useState("");
//   const [pathStep, setPathStep] = useState(0);
//   const [showFinish, setShowFinish] = useState(false);

//   const utteranceRef = useRef(null);
//   const currentItem = LETTERS[currentIndex];

//   const pathDots = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => ({
//       id: i + 1,
//       active: i < pathStep,
//     }));
//   }, [pathStep]);

//   const options = useMemo(() => createOptions(currentItem.letter), [currentItem]);

//   useEffect(() => {
//     setSelectedLetter("");
//     setShakeTile("");
//     setPathStep(0);
//     setShowFinish(false);
//     setMessage("Tap the correct letter for the animal path!");
//   }, [currentIndex]);

//   const speakText = (text) => {
//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.9;
//       utterance.pitch = 1.1;
//       utteranceRef.current = utterance;
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const handleSpeakAnimal = () => {
//     speakText(`${currentItem.animal}. ${currentItem.letter}. ${currentItem.sound}`);
//   };

//   const handleTileClick = (item) => {
//     setSelectedLetter(item.letter);

//     if (item.letter === currentItem.letter) {
//       setMessage(`Super! ${currentItem.animal} starts with ${currentItem.letter}`);
//       setScore((prev) => prev + 1);
//       speakText(`Great job! ${currentItem.animal} starts with ${currentItem.letter}`);
//       setPathStep(6);
//       setShowFinish(true);
//     } else {
//       setMessage(`Oops! Try again. ${currentItem.animal} does not start with ${item.letter}`);
//       setShakeTile(item.letter);
//       speakText("Try again");
//       setTimeout(() => {
//         setShakeTile("");
//       }, 400);
//     }
//   };

//   const handleStartPath = () => {
//     if (!showFinish) return;
//     speakText(`Follow the animal path for ${currentItem.letter}`);
//   };

//   const handleNext = () => {
//     if (currentIndex < LETTERS.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       setCurrentIndex(0);
//       setScore(0);
//       setMessage("Yay! You finished all animal letters. Let’s play again!");
//     }
//   };

//   return (
//     <div className="animal-path-page">
//       <header className="animal-path-header">
//         <BackIcon goBack={goBack} />
//         <h1>Animal Path Letters</h1>
//       </header>

//       <div className="animal-path-content">
//         <div className="animal-top-row">
//           <div className="animal-big-card">
//             <div className="animal-card-letter">{currentItem.letter}</div>
//             <div className="animal-card-emoji">{currentItem.emoji}</div>
//             <div className="animal-card-name">{currentItem.animal}</div>
//             <div className="animal-card-sound">{currentItem.sound}</div>
//           </div>

//           <div className="animal-grid-panel">
//             <div className="animal-grid-title">Choose the correct letter</div>
//             <div className="animal-grid">
//               {options.map((item) => (
//                 <button
//                   key={item.letter}
//                   className={`animal-grid-tile ${
//                     selectedLetter === item.letter ? "selected" : ""
//                   } ${shakeTile === item.letter ? "shake" : ""}`}
//                   onClick={() => handleTileClick(item)}
//                 >
//                   <span className="animal-tile-main">{item.letter}</span>
//                   <span className="animal-tile-sub">{item.animal}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="animal-bottom-row">
//           <div className="animal-path-area">
//             <div className="animal-path-title">Follow the animal path</div>

//             <div className="animal-track-wrap">
//               <div className="animal-track-line"></div>

//               {pathDots.map((dot) => (
//                 <div
//                   key={dot.id}
//                   className={`animal-track-dot ${dot.active ? "active" : ""}`}
//                 >
//                   {dot.id}
//                 </div>
//               ))}

//               <div className={`animal-friend ${showFinish ? "move-finish" : ""}`}>
//                 {currentItem.emoji}
//               </div>
//             </div>

//             <div className="animal-drop-zones">
//               <button
//                 className={`animal-drop-box ${showFinish ? "done" : ""}`}
//                 onClick={handleStartPath}
//               >
//                 {showFinish
//                   ? `Path complete for ${currentItem.letter}`
//                   : "Choose correct letter first"}
//               </button>
//             </div>

//             <div className="animal-info-row">
//               <div className="animal-message">{message}</div>
//               <div className="animal-score">Score: {score}</div>
//             </div>

//             <div className="animal-actions">
//               <button className="animal-action-btn speak" onClick={handleSpeakAnimal}>
//                 🔊 Hear Sound
//               </button>
//               <button
//                 className="animal-action-btn next"
//                 onClick={handleNext}
//                 disabled={!showFinish}
//               >
//                 Next
//               </button>
//             </div>

//             <div className="animal-progress">
//               Letter {currentIndex + 1} / {LETTERS.length}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import "../styles/AlphabetConfusingLetters.css";
import BackIcon from "../components/BackIcon";

const LETTERS = [
  { letter: "a", compare: "o", emoji: "🍎" },
  { letter: "b", compare: "d", emoji: "⚽" },
  { letter: "c", compare: "e", emoji: "🐱" },
  { letter: "d", compare: "b", emoji: "🐶" },
  { letter: "e", compare: "c", emoji: "🥚" },
  { letter: "f", compare: "t", emoji: "🐟" },
  { letter: "g", compare: "q", emoji: "🐐" },
  { letter: "h", compare: "n", emoji: "🏠" },
  { letter: "i", compare: "j", emoji: "🍦" },
  { letter: "j", compare: "i", emoji: "🍓" },
  { letter: "k", compare: "x", emoji: "🪁" },
  { letter: "l", compare: "i", emoji: "🦁" },
  { letter: "m", compare: "n", emoji: "🌙" },
  { letter: "n", compare: "m", emoji: "🪺" },
  { letter: "o", compare: "a", emoji: "🍊" },
  { letter: "p", compare: "q", emoji: "🐼" },
  { letter: "q", compare: "p", emoji: "👑" },
  { letter: "r", compare: "n", emoji: "🤖" },
  { letter: "s", compare: "z", emoji: "🐍" },
  { letter: "t", compare: "f", emoji: "🌴" },
  { letter: "u", compare: "v", emoji: "☂️" },
  { letter: "v", compare: "u", emoji: "🚐" },
  { letter: "w", compare: "v", emoji: "🌊" },
  { letter: "x", compare: "k", emoji: "❌" },
  { letter: "y", compare: "v", emoji: "🧶" },
  { letter: "z", compare: "s", emoji: "🦓" }
];

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function ConfusingLetters({ goBack }) {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [pageMode, setPageMode] = useState("learn");
  const [message, setMessage] = useState("Learn the letters");
  const [score, setScore] = useState(0);
  const [targetStep, setTargetStep] = useState("main");
  const [selectedValue, setSelectedValue] = useState("");
  const [placedMain, setPlacedMain] = useState(false);
  const [placedCompare, setPlacedCompare] = useState(false);
  const [shakeValue, setShakeValue] = useState("");
  const [shakeBox, setShakeBox] = useState("");

  const current = LETTERS[currentIndex];
  const currentTarget = targetStep === "main" ? current.letter : current.compare;

  const options = useMemo(() => {
    const others = LETTERS.filter(
      (item) => item.letter !== current.letter && item.letter !== current.compare
    ).map((item) => item.letter);

    const randomWrong = shuffleArray(others).slice(0, 4);
    return shuffleArray([current.letter, current.compare, ...randomWrong]);
  }, [current]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    setSelectedValue("");
    setPlacedMain(false);
    setPlacedCompare(false);
    setShakeValue("");
    setShakeBox("");

    if (pageMode === "learn") {
      setMessage(`Learn ${current.letter} and ${current.compare}`);
    }

    if (pageMode === "identify") {
      setTargetStep("main");
      setMessage(`Choose and place letter ${current.letter}`);
      speak(`This is ${current.letter}. Choose ${current.letter} and place it.`);
    }

    if (pageMode === "compare") {
      setMessage(`Compare ${current.letter} and ${current.compare}`);
    }
  }, [currentIndex, pageMode, current]);

  const goToIdentify = () => {
    setPageMode("identify");
    setTargetStep("main");
    setSelectedValue("");
    setPlacedMain(false);
    setPlacedCompare(false);
    setMessage(`Choose and place letter ${current.letter}`);
    speak(`This is ${current.letter}. Choose ${current.letter} and place it.`);
  };

  const handleTileClick = (value) => {
    setSelectedValue(value);
    setMessage(`Selected ${value}. Now place it in the correct card.`);
  };

  const handlePlaceLetter = (boxType) => {
    const expectedLetter = boxType === "main" ? current.letter : current.compare;

    if (!selectedValue) {
      setMessage(`First choose letter ${expectedLetter}`);
      speak(`First choose letter ${expectedLetter}`);
      return;
    }

    if (selectedValue !== expectedLetter) {
      setShakeValue(selectedValue);
      setShakeBox(boxType);
      setMessage(`Wrong letter. This is ${expectedLetter}. Place ${expectedLetter}`);
      speak(`This is ${expectedLetter}. Place ${expectedLetter}`);
      setTimeout(() => {
        setShakeValue("");
        setShakeBox("");
      }, 500);
      return;
    }

    if (boxType === "main") {
      setPlacedMain(true);
      setSelectedValue("");
      setScore((prev) => prev + 1);
      setTargetStep("compare");
      setMessage(`Good! Now choose and place letter ${current.compare}`);
      speak(`Good job. Now choose and place ${current.compare}`);
      return;
    }

    if (boxType === "compare") {
      setPlacedCompare(true);
      setSelectedValue("");
      setScore((prev) => prev + 1);
      setMessage(`Super! You placed ${current.letter} and ${current.compare}`);
      speak(`Excellent. You placed ${current.letter} and ${current.compare}`);
      setTimeout(() => {
        setPageMode("compare");
      }, 700);
    }
  };

  const nextLetter = () => {
    if (currentIndex < LETTERS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPageMode("learn");
    } else {
      setCurrentIndex(0);
      setPageMode("learn");
      setScore(0);
      setMessage("Yay! You finished all confusing letters");
    }
  };

  return (
    <div className="conf-page">
      <div className="conf-header">
        <div className="conf-back">
          <BackIcon goBack={goBack} />
        </div>
        <h1>Confusing Letters</h1>
      </div>

      <div className="conf-content">
        {pageMode === "learn" && (
          <>
            <div className="conf-top">
              <div className="conf-card">
                <div className="conf-letter">{current.letter}</div>
                <div className="emoji">{current.emoji}</div>
                <div className="conf-card-text">Letter {current.letter}</div>
              </div>

              <div className="conf-card">
                <div className="conf-letter">{current.compare}</div>
                <div className="emoji">{current.emoji}</div>
                <div className="conf-card-text">Letter {current.compare}</div>
              </div>
            </div>

            <div className="message">
              Learn these confusing letters: <span>{current.letter}</span> and <span>{current.compare}</span>
            </div>
            <div className="score">Score: {score}</div>

            <div className="actions">
              <button className="btn" onClick={() => speak(`${current.letter} and ${current.compare}`)}>
                🔊 Hear
              </button>
              <button className="btn" onClick={goToIdentify}>
                Go to Identify
              </button>
            </div>
          </>
        )}

        {pageMode === "identify" && (
          <>
            <div className="conf-top">
              <div className="conf-card">
                <div className="conf-letter">{current.letter}</div>
                <div className="emoji">{current.emoji}</div>
                <div className="conf-card-text">
                  {placedMain ? "Matched" : "Place this letter"}
                </div>
              </div>

              <div className={`conf-card ${!placedMain ? "blur" : ""}`}>
                <div className="conf-letter">{current.compare}</div>
                <div className="emoji">{current.emoji}</div>
                <div className="conf-card-text">
                  {placedMain ? "Now place this" : "Next letter"}
                </div>
              </div>
            </div>

            <div className="conf-place-section">
              <h2 className="conf-place-title">
                {targetStep === "main"
                  ? `Place the letter ${current.letter}`
                  : `Place the letter ${current.compare}`}
              </h2>

              <div className="conf-place-cards">
                <div
                  className={`conf-place-card ${
                    placedMain ? "done" : ""
                  } ${shakeBox === "main" ? "shake" : ""}`}
                  onClick={() => handlePlaceLetter("main")}
                >
                  <div className="conf-place-label">Place Here</div>
                  <div className="conf-place-value">
                    {placedMain ? current.letter : "?"}
                  </div>
                </div>

                <div
                  className={`conf-place-card ${
                    placedCompare ? "done" : ""
                  } ${shakeBox === "compare" ? "shake" : ""} ${
                    !placedMain ? "locked" : ""
                  }`}
                  onClick={() => placedMain && handlePlaceLetter("compare")}
                >
                  <div className="conf-place-label">Next Place</div>
                  <div className="conf-place-value">
                    {placedCompare ? current.compare : !placedMain ? "?" : current.compare}
                  </div>
                </div>
              </div>
            </div>

            <div className="conf-card conf-option-card">
              <div className="question">
                {targetStep === "main"
                  ? `Choose the letter ${current.letter}`
                  : `Choose the letter ${current.compare}`}
              </div>

              <div className="options">
                {options.map((value, index) => (
                  <button
                    key={`${value}-${index}`}
                    className={`opt ${
                      selectedValue === value ? "selected" : ""
                    } ${shakeValue === value ? "wrong" : ""}`}
                    onClick={() => handleTileClick(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="message">{message}</div>
            <div className="score">Score: {score}</div>

            <div className="actions">
              <button
                className="btn"
                onClick={() => speak(`This is ${currentTarget}. Place ${currentTarget}`)}
              >
                🔊 Repeat Letter
              </button>

              <button className="btn" onClick={() => setPageMode("learn")}>
                Back
              </button>
            </div>
          </>
        )}

        {pageMode === "compare" && (
          <>
            <div className="conf-top">
              <div className="conf-card">
                <div className="conf-letter">{current.letter}</div>
                <div className="emoji">{current.emoji}</div>
                <div className="conf-card-text">This is {current.letter}</div>
              </div>

              <div className="conf-card">
                <div className="conf-letter">{current.compare}</div>
                <div className="emoji">{current.emoji}</div>
                <div className="conf-card-text">This is {current.compare}</div>
              </div>
            </div>

            <div className="message">
              Compare <span>{current.letter}</span> and <span>{current.compare}</span>
            </div>
            <div className="score">Score: {score}</div>

            <div className="actions">
              <button className="btn" onClick={() => speak(`${current.letter} and ${current.compare}`)}>
                🔊 Hear Again
              </button>

              <button className="btn" onClick={nextLetter}>
                Next Letter
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}