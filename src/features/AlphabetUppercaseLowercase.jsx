import { useEffect, useMemo, useState } from "react";
import "../styles/AlphabetUppercaseLowercase.css";

const letterData = [
  { upper: "A", lower: "a", word: "Apple", image: "🍎", color: "#ff8a3d" },
  { upper: "B", lower: "b", word: "Bread", image: "🍞", color: "#28c7d9" },
  { upper: "C", lower: "c", word: "Car", image: "🚕", color: "#ffcc33" },
  { upper: "D", lower: "d", word: "Dinosaur", image: "🦎", color: "#6dcf63" },
  { upper: "E", lower: "e", word: "Elephant", image: "🐘", color: "#8f8f8f" },
  { upper: "F", lower: "f", word: "Flower", image: "🌸", color: "#ff6fa8" },
  { upper: "G", lower: "g", word: "Goat", image: "🐐", color: "#57b85a" },
  { upper: "H", lower: "h", word: "Horse", image: "🐎", color: "#b8804d" },
  { upper: "I", lower: "i", word: "Igloo", image: "🧊", color: "#84d8ff" },
  { upper: "J", lower: "j", word: "Jelly", image: "🍮", color: "#ff7b7b" },
  { upper: "K", lower: "k", word: "Kite", image: "🪁", color: "#7f9cff" },
  { upper: "L", lower: "l", word: "Leaf", image: "🍃", color: "#6fcf5c" },
  { upper: "M", lower: "m", word: "Moon", image: "🌙", color: "#b9b9d9" },
  { upper: "N", lower: "n", word: "Nail", image: "📌", color: "#b0b0b0" },
  { upper: "O", lower: "o", word: "Orange", image: "🍊", color: "#ff9d2f" },
  { upper: "P", lower: "p", word: "Puppet", image: "🪆", color: "#f08b5b" },
  { upper: "Q", lower: "q", word: "Queen", image: "👑", color: "#d8b04b" },
  { upper: "R", lower: "r", word: "Robot", image: "🤖", color: "#8ba5c9" },
  { upper: "S", lower: "s", word: "Sock", image: "🧦", color: "#5ba7ff" },
  { upper: "T", lower: "t", word: "Tiger", image: "🐯", color: "#9a75ff" },
  { upper: "U", lower: "u", word: "Unicorn", image: "🦄", color: "#ff9be6" },
  { upper: "V", lower: "v", word: "Van", image: "🚐", color: "#70b6ff" },
  { upper: "W", lower: "w", word: "Windmill", image: "🌬️", color: "#8ad4d0" },
  { upper: "X", lower: "x", word: "Xylophone", image: "🎼", color: "#c59263" },
  { upper: "Y", lower: "y", word: "Yarn", image: "🧶", color: "#ff7fa0" },
  { upper: "Z", lower: "z", word: "Zebra", image: "🦓", color: "#999999" }
];

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function AlphabetUppercaseLowercase({ goBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageMode, setPageMode] = useState("learn");
  const [selectedTile, setSelectedTile] = useState(null);
  const [placedUpper, setPlacedUpper] = useState(false);
  const [placedLower, setPlacedLower] = useState(false);
  const [message, setMessage] = useState("Learn the uppercase and lowercase letters");
  const [stars, setStars] = useState(0);
  const [shakeUpper, setShakeUpper] = useState(false);
  const [shakeLower, setShakeLower] = useState(false);

  const current = letterData[currentIndex];

  const gridTiles = useMemo(() => {
    const wrongUpper = shuffleArray(
      letterData.filter((item) => item.upper !== current.upper)
    )
      .slice(0, 5)
      .map((item) => ({
        id: `u-${item.upper}`,
        type: "upper",
        value: item.upper
      }));

    const wrongLower = shuffleArray(
      letterData.filter((item) => item.lower !== current.lower)
    )
      .slice(0, 5)
      .map((item) => ({
        id: `l-${item.lower}`,
        type: "lower",
        value: item.lower
      }));

    const correctTiles = [
      { id: `u-${current.upper}`, type: "upper", value: current.upper },
      { id: `l-${current.lower}`, type: "lower", value: current.lower }
    ];

    return shuffleArray([...wrongUpper, ...wrongLower, ...correctTiles]);
  }, [current]);

  useEffect(() => {
    setSelectedTile(null);
    setPlacedUpper(false);
    setPlacedLower(false);

    if (pageMode === "learn") {
      setMessage("Learn the uppercase and lowercase letters");
      const speech = new SpeechSynthesisUtterance(
        `This is capital ${current.upper}. This is small ${current.lower}. ${current.upper} for ${current.word}`
      );
      speech.rate = 0.85;
      speech.pitch = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    } else {
      setMessage("Tap the correct tiles and complete the identify page");
      const speech = new SpeechSynthesisUtterance(
        `Find capital ${current.upper} and small ${current.lower}`
      );
      speech.rate = 0.85;
      speech.pitch = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speech);
    }

    return () => window.speechSynthesis.cancel();
  }, [currentIndex, pageMode, current]);

  const speakLearn = () => {
    const speech = new SpeechSynthesisUtterance(
      `Capital ${current.upper}. Small ${current.lower}. ${current.upper} for ${current.word}`
    );
    speech.rate = 0.85;
    speech.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const speakIdentify = () => {
    const speech = new SpeechSynthesisUtterance(
      `Find capital ${current.upper} and small ${current.lower}`
    );
    speech.rate = 0.85;
    speech.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
    setMessage(`Selected ${tile.value}. Now tap the matching box.`);
  };

  const handleDropBoxClick = (boxType) => {
    if (!selectedTile) {
      setMessage("First tap a tile from the grid");
      return;
    }

    if (boxType === "upper") {
      if (selectedTile.type === "upper" && selectedTile.value === current.upper) {
        setPlacedUpper(true);
        setSelectedTile(null);
        setMessage("Great! Now find the lowercase letter");
      } else {
        setShakeUpper(true);
        setMessage("Oops! That is not the correct uppercase letter");
        setTimeout(() => setShakeUpper(false), 400);
      }
    }

    if (boxType === "lower") {
      if (selectedTile.type === "lower" && selectedTile.value === current.lower) {
        setPlacedLower(true);
        setSelectedTile(null);
        setMessage("Nice! You found the lowercase letter");
      } else {
        setShakeLower(true);
        setMessage("Oops! That is not the correct lowercase letter");
        setTimeout(() => setShakeLower(false), 400);
      }
    }
  };

  const isComplete = placedUpper && placedLower;

  useEffect(() => {
    if (pageMode === "identify" && isComplete) {
      setStars((prev) => prev + 1);
      setMessage(`Awesome! ${current.upper} and ${current.lower} matched`);

      const successSpeech = new SpeechSynthesisUtterance(
        `Excellent! Capital ${current.upper} and small ${current.lower}. ${current.upper} for ${current.word}`
      );
      successSpeech.rate = 0.9;
      successSpeech.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(successSpeech);
    }
  }, [isComplete, pageMode, current]);

  const goToIdentifyPage = () => {
    setPageMode("identify");
    setSelectedTile(null);
    setPlacedUpper(false);
    setPlacedLower(false);
    setMessage("Now identify the uppercase and lowercase letters");
  };

  const goToLearnPage = () => {
    setPageMode("learn");
    setSelectedTile(null);
    setPlacedUpper(false);
    setPlacedLower(false);
    setMessage("Learn the uppercase and lowercase letters");
  };

  const nextLetter = () => {
    if (currentIndex < letterData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPageMode("learn");
      setSelectedTile(null);
      setPlacedUpper(false);
      setPlacedLower(false);
    } else {
      setMessage("Yay! You finished all letters");
    }
  };

  return (
    <div className="ul-puzzle-page">
      <div className="ul-puzzle-header">
        <h1>Uppercase & Lowercase Learning</h1>
      </div>

      <div className="ul-puzzle-content">
        {pageMode === "learn" ? (
          <>
            <div className="ul-top-row">
              <div className="ul-big-card" style={{ borderColor: current.color }}>
                <div className="ul-card-image">{current.image}</div>
                <div className="ul-card-word">{current.word}</div>
              </div>

              <div className="ul-grid-panel">
                <div className="ul-grid-title">Learn both letters together</div>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: "20px"
                  }}
                >
                  <div
                    className="ul-grid-tile"
                    style={{
                      minWidth: "150px",
                      minHeight: "180px",
                      fontSize: "40px",
                      border: `4px solid ${current.color}`
                    }}
                  >
                    <span className="tile-type">UPPERCASE</span>
                    <span className="tile-main" style={{ fontSize: "64px" }}>
                      {current.upper}
                    </span>
                  </div>

                  <div
                    className="ul-grid-tile"
                    style={{
                      minWidth: "150px",
                      minHeight: "180px",
                      fontSize: "40px",
                      border: `4px solid ${current.color}`
                    }}
                  >
                    <span className="tile-type">lowercase</span>
                    <span className="tile-main" style={{ fontSize: "64px" }}>
                      {current.lower}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ul-bottom-row">
              <div className="ul-puzzle-area">
                <div className="ul-puzzle-title">
                  {current.upper} and {current.lower} are the same letter
                </div>

                <div className="ul-puzzle-visual">
                  <div className="ul-split-piece left-piece" style={{ borderColor: current.color }}>
                    <div className="piece-letter">{current.upper}</div>
                    <div className="piece-image">{current.image}</div>
                  </div>

                  <div className="ul-split-piece right-piece" style={{ borderColor: current.color }}>
                    <div className="piece-image">{current.image}</div>
                    <div className="piece-letter">{current.lower}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ul-info-row">
              <div className="ul-message">
                Learn: Capital {current.upper} and Small {current.lower} — {current.word}
              </div>
              <div className="ul-score">⭐ Stars: {stars}</div>
            </div>

            <div className="ul-actions">
              <button className="ul-action-btn speak" onClick={speakLearn}>
                🔊 Speak
              </button>

              <button className="ul-action-btn next" onClick={goToIdentifyPage}>
                Go to Identify Page
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ul-top-row">
              <div className="ul-big-card" style={{ borderColor: current.color }}>
                <div className="ul-card-letter upper">{current.upper}</div>
                <div className="ul-card-image">{current.image}</div>
                <div className="ul-card-divider" />
                <div className="ul-card-letter lower">{current.lower}</div>
                <div className="ul-card-word">{current.word}</div>
              </div>

              <div className="ul-grid-panel">
                <div className="ul-grid-title">Choose the correct letters</div>
                <div className="ul-grid">
                  {gridTiles.map((tile) => (
                    <button
                      key={tile.id}
                      className={`ul-grid-tile ${
                        selectedTile?.id === tile.id ? "selected" : ""
                      }`}
                      onClick={() => handleTileClick(tile)}
                      disabled={
                        (placedUpper && tile.type === "upper" && tile.value === current.upper) ||
                        (placedLower && tile.type === "lower" && tile.value === current.lower)
                      }
                    >
                      <span className="tile-main">{tile.value}</span>
                      <span className="tile-type">
                        {tile.type === "upper" ? "BIG" : "small"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ul-bottom-row">
              <div className="ul-puzzle-area">
                <div className="ul-puzzle-title">Complete the identify page</div>

                <div className="ul-puzzle-visual">
                  <div className="ul-split-piece left-piece" style={{ borderColor: current.color }}>
                    <div className="piece-letter">{placedUpper ? current.upper : "?"}</div>
                    <div className="piece-image">{current.image}</div>
                  </div>

                  <div className="ul-split-piece right-piece" style={{ borderColor: current.color }}>
                    <div className="piece-image">{current.image}</div>
                    <div className="piece-letter">{placedLower ? current.lower : "?"}</div>
                  </div>
                </div>

                <div className="ul-drop-zones">
                  <button
                    className={`ul-drop-box ${placedUpper ? "done" : ""} ${shakeUpper ? "shake" : ""}`}
                    onClick={() => handleDropBoxClick("upper")}
                  >
                    {placedUpper ? current.upper : "Place UPPERCASE"}
                  </button>

                  <button
                    className={`ul-drop-box ${placedLower ? "done" : ""} ${shakeLower ? "shake" : ""}`}
                    onClick={() => handleDropBoxClick("lower")}
                  >
                    {placedLower ? current.lower : "Place lowercase"}
                  </button>
                </div>
              </div>
            </div>

            <div className="ul-info-row">
              <div className="ul-message">{message}</div>
              <div className="ul-score">⭐ Stars: {stars}</div>
            </div>

            <div className="ul-actions">
              <button className="ul-action-btn speak" onClick={speakIdentify}>
                🔊 Speak
              </button>

              <button className="ul-action-btn speak" onClick={goToLearnPage}>
                Back to Learn
              </button>

              <button
                className="ul-action-btn next"
                onClick={nextLetter}
                disabled={!isComplete}
              >
                Next Letter
              </button>
            </div>
          </>
        )}

        <div className="ul-progress">
          {currentIndex + 1} / {letterData.length}
        </div>
      </div>
    </div>
  );
}






// // import { useEffect, useMemo, useState } from "react";
// // import "../styles/AlphabetUppercaseLowercase.css";
// // import { useGame } from "../context/GameContext";
// // import { db } from "../firebase";
// // import { collection, addDoc } from "firebase/firestore";

// // const letterData = [
// //   { upper: "A", lower: "a", word: "Apple", image: "🍎", color: "#ff8a3d" },
// //   { upper: "B", lower: "b", word: "Bread", image: "🍞", color: "#28c7d9" },
// //   { upper: "C", lower: "c", word: "Car", image: "🚕", color: "#ffcc33" },
// //   { upper: "D", lower: "d", word: "Dinosaur", image: "🦎", color: "#6dcf63" },
// //   { upper: "E", lower: "e", word: "Elephant", image: "🐘", color: "#8f8f8f" },
// //   { upper: "F", lower: "f", word: "Flower", image: "🌸", color: "#ff6fa8" },
// //   { upper: "G", lower: "g", word: "Goat", image: "🐐", color: "#57b85a" },
// //   { upper: "H", lower: "h", word: "Horse", image: "🐎", color: "#b8804d" },
// //   { upper: "I", lower: "i", word: "Igloo", image: "🧊", color: "#84d8ff" },
// //   { upper: "J", lower: "j", word: "Jelly", image: "🍮", color: "#ff7b7b" },
// //   { upper: "K", lower: "k", word: "Kite", image: "🪁", color: "#7f9cff" },
// //   { upper: "L", lower: "l", word: "Leaf", image: "🍃", color: "#6fcf5c" },
// //   { upper: "M", lower: "m", word: "Moon", image: "🌙", color: "#b9b9d9" },
// //   { upper: "N", lower: "n", word: "Nail", image: "📌", color: "#b0b0b0" },
// //   { upper: "O", lower: "o", word: "Orange", image: "🍊", color: "#ff9d2f" },
// //   { upper: "P", lower: "p", word: "Puppet", image: "🪆", color: "#f08b5b" },
// //   { upper: "Q", lower: "q", word: "Queen", image: "👑", color: "#d8b04b" },
// //   { upper: "R", lower: "r", word: "Robot", image: "🤖", color: "#8ba5c9" },
// //   { upper: "S", lower: "s", word: "Sock", image: "🧦", color: "#5ba7ff" },
// //   { upper: "T", lower: "t", word: "Tiger", image: "🐯", color: "#9a75ff" },
// //   { upper: "U", lower: "u", word: "Unicorn", image: "🦄", color: "#ff9be6" },
// //   { upper: "V", lower: "v", word: "Van", image: "🚐", color: "#70b6ff" },
// //   { upper: "W", lower: "w", word: "Windmill", image: "🌬️", color: "#8ad4d0" },
// //   { upper: "X", lower: "x", word: "Xylophone", image: "🎼", color: "#c59263" },
// //   { upper: "Y", lower: "y", word: "Yarn", image: "🧶", color: "#ff7fa0" },
// //   { upper: "Z", lower: "z", word: "Zebra", image: "🦓", color: "#999999" }
// // ];

// // function shuffleArray(arr) {
// //   return [...arr].sort(() => Math.random() - 0.5);
// // }

// // export default function AlphabetUppercaseLowercase({ goBack }) {
// //   const { addStars } = useGame();

// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [pageMode, setPageMode] = useState("learn");
// //   const [selectedTile, setSelectedTile] = useState(null);
// //   const [placedUpper, setPlacedUpper] = useState(false);
// //   const [placedLower, setPlacedLower] = useState(false);
// //   const [message, setMessage] = useState("Learn the uppercase and lowercase letters");
// //   const [stars, setStars] = useState(0);
// //   const [shakeUpper, setShakeUpper] = useState(false);
// //   const [shakeLower, setShakeLower] = useState(false);

// //   const current = letterData[currentIndex];

// //   const logActivity = async (score) => {
// //     const userId = localStorage.getItem("userId");
// //     if (!userId) return;

// //     await addDoc(collection(db, "activity"), {
// //       userId,
// //       action: "play",
// //       module: "letters",
// //       screen: "uppercase-lowercase",
// //       score,
// //       timestamp: new Date(),
// //     });
// //   };

// //   const gridTiles = useMemo(() => {
// //     const wrongUpper = shuffleArray(
// //       letterData.filter((item) => item.upper !== current.upper)
// //     ).slice(0, 5).map((item) => ({
// //       id: `u-${item.upper}`,
// //       type: "upper",
// //       value: item.upper
// //     }));

// //     const wrongLower = shuffleArray(
// //       letterData.filter((item) => item.lower !== current.lower)
// //     ).slice(0, 5).map((item) => ({
// //       id: `l-${item.lower}`,
// //       type: "lower",
// //       value: item.lower
// //     }));

// //     const correctTiles = [
// //       { id: `u-${current.upper}`, type: "upper", value: current.upper },
// //       { id: `l-${current.lower}`, type: "lower", value: current.lower }
// //     ];

// //     return shuffleArray([...wrongUpper, ...wrongLower, ...correctTiles]);
// //   }, [current]);

// //   const isComplete = placedUpper && placedLower;

// //   useEffect(() => {
// //     if (pageMode === "identify" && isComplete) {
// //       setStars((prev) => prev + 1);

// //       const score = 100;

// //       addStars(score, "Uppercase Lowercase");
// //       logActivity(score);

// //       setMessage(`Awesome! ${current.upper} and ${current.lower} matched`);
// //     }
// //   }, [isComplete, pageMode]);

// //   useEffect(() => {
// //     setSelectedTile(null);
// //     setPlacedUpper(false);
// //     setPlacedLower(false);

// //     const speech = new SpeechSynthesisUtterance(
// //       pageMode === "learn"
// //         ? `Capital ${current.upper}. Small ${current.lower}. ${current.upper} for ${current.word}`
// //         : `Find capital ${current.upper} and small ${current.lower}`
// //     );

// //     window.speechSynthesis.cancel();
// //     window.speechSynthesis.speak(speech);
// //   }, [currentIndex, pageMode]);

// //   const handleTileClick = (tile) => {
// //     setSelectedTile(tile);
// //     setMessage(`Selected ${tile.value}`);
// //   };

// //   const handleDropBoxClick = (type) => {
// //     if (!selectedTile) return;

// //     if (type === "upper" && selectedTile.value === current.upper) {
// //       setPlacedUpper(true);
// //     } else if (type === "lower" && selectedTile.value === current.lower) {
// //       setPlacedLower(true);
// //     }
// //   };

// //   const nextLetter = () => {
// //     if (currentIndex < letterData.length - 1) {
// //       setCurrentIndex((prev) => prev + 1);
// //       setPageMode("learn");
// //     }
// //   };

// //   return (
// //     <div className="ul-puzzle-page">
// //       <h1>Uppercase & Lowercase Learning</h1>

// //       <div className="ul-message">{message}</div>
// //       <div className="ul-score">⭐ {stars}</div>

// //       <div className="ul-grid">
// //         {gridTiles.map((tile) => (
// //           <button key={tile.id} onClick={() => handleTileClick(tile)}>
// //             {tile.value}
// //           </button>
// //         ))}
// //       </div>

// //       <button onClick={() => handleDropBoxClick("upper")}>Place Upper</button>
// //       <button onClick={() => handleDropBoxClick("lower")}>Place Lower</button>

// //       <button onClick={() => setPageMode("identify")}>Start Game</button>
// //       <button onClick={nextLetter}>Next</button>
// //     </div>
// //   );
// // }