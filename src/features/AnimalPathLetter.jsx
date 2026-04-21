import { useEffect, useMemo, useState } from "react";
import "../styles/AlphabetConfusingLetters.css";
import BackIcon from "../components/BackIcon";
import { trackActivity } from "../utils/trackActivity";

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
  const [currentIndex, setCurrentIndex] = useState(0);
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
  const currentTarget =
    targetStep === "main" ? current.letter : current.compare;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      trackActivity({
        userId,
        action: "open_game",
        screen: "confusing-letters",
        module: "letters",
      });
    }
  }, [userId]);

  const options = useMemo(() => {
    const others = LETTERS.filter(
      (item) =>
        item.letter !== current.letter &&
        item.letter !== current.compare
    ).map((item) => item.letter);

    const randomWrong = shuffleArray(others).slice(0, 4);
    return shuffleArray([
      current.letter,
      current.compare,
      ...randomWrong,
    ]);
  }, [current]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
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
      setMessage(`Place ${current.letter}`);
    }

    if (pageMode === "compare") {
      setMessage(`Compare ${current.letter} and ${current.compare}`);
    }
  }, [currentIndex, pageMode, current]);

  const handleTileClick = (value) => {
    setSelectedValue(value);
  };

  const handlePlaceLetter = (boxType) => {
    const expected =
      boxType === "main" ? current.letter : current.compare;

    if (selectedValue !== expected) {
      setShakeValue(selectedValue);
      setShakeBox(boxType);
      setTimeout(() => {
        setShakeValue("");
        setShakeBox("");
      }, 400);
      return;
    }

    if (boxType === "main") {
      setPlacedMain(true);
      setSelectedValue("");
      setScore((s) => s + 1);
      setTargetStep("compare");
      return;
    }

    if (boxType === "compare") {
      setPlacedCompare(true);
      setSelectedValue("");
      setScore((s) => s + 1);
      setPageMode("compare");
    }
  };

  const nextLetter = () => {
    if (currentIndex < LETTERS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setPageMode("learn");
    } else {
      if (userId) {
        trackActivity({
          userId,
          action: "game_play",
          screen: "confusing-letters",
          module: "letters",
          score,
        });
      }
      setCurrentIndex(0);
      setScore(0);
      setPageMode("learn");
    }
  };

  return (
    <div className="conf-page">
      <div className="conf-header">
        <BackIcon goBack={goBack} />
        <h1>Confusing Letters</h1>
      </div>

      <div className="conf-content">
        {pageMode === "learn" && (
          <>
            <h2>
              {current.letter} vs {current.compare}
            </h2>

            <button onClick={() => setPageMode("identify")}>
              Start
            </button>
          </>
        )}

        {pageMode === "identify" && (
          <>
            <h2>Choose {currentTarget}</h2>

            <div>
              {options.map((value) => (
                <button
                  key={value}
                  onClick={() => handleTileClick(value)}
                >
                  {value}
                </button>
              ))}
            </div>

            <button onClick={() => handlePlaceLetter("main")}>
              Place Main
            </button>

            <button onClick={() => handlePlaceLetter("compare")}>
              Place Compare
            </button>
          </>
        )}

        {pageMode === "compare" && (
          <>
            <h2>
              {current.letter} vs {current.compare}
            </h2>

            <button onClick={nextLetter}>Next</button>
          </>
        )}

        <p>{message}</p>
        <p>Score: {score}</p>
      </div>
    </div>
  );
}