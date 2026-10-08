import React, { useEffect, useMemo, useState } from "react";
import "../styles/ColorNumberAnimals.css";

import colorTheNumberIcon from "../assets/01-color-the-number.png";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "color-number-animals";

const animals = [
  {
    name: "Fish",
    parts: [
      { key: "body", label: "Body", number: 1, color: "#ff9f1c" },
      { key: "tail", label: "Tail", number: 2, color: "#3a86ff" },
      { key: "fin", label: "Fin", number: 3, color: "#ff4d4d" },
      { key: "eyeRing", label: "Eye Ring", number: 4, color: "#ffd60a" },
    ],
    render: (filled, click) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="290" cy="220" rx="170" ry="110"
          fill={filled.body}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("body")}
        />
        <polygon
          points="430,220 580,120 580,320"
          fill={filled.tail}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("tail")}
        />
        <polygon
          points="260,120 330,50 380,145"
          fill={filled.fin}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("fin")}
        />
        <circle
          cx="185" cy="195" r="30"
          fill={filled.eyeRing}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("eyeRing")}
        />
        <circle cx="193" cy="202" r="12" fill="#222" />

        <path
          d="M125 245 Q165 280 205 250"
          fill="none" stroke="#222" strokeWidth="5"
        />
        <path
          d="M280 140 Q330 220 280 300"
          fill="none" stroke="#222" strokeWidth="4"
        />
        <path
          d="M340 150 Q390 220 340 305"
          fill="none" stroke="#222" strokeWidth="4"
        />

        <text x="290" y="230" textAnchor="middle" className="part-number">1</text>
        <text x="520" y="230" textAnchor="middle" className="part-number">2</text>
        <text x="325" y="110" textAnchor="middle" className="part-number">3</text>
        <text x="185" y="202" textAnchor="middle" className="part-number small-number">4</text>
      </svg>
    ),
  },

  {
    name: "Cat",
    parts: [
      { key: "face", label: "Face", number: 1, color: "#f4a261" },
      { key: "leftEar", label: "Left Ear", number: 2, color: "#e76f51" },
      { key: "rightEar", label: "Right Ear", number: 3, color: "#2a9d8f" },
      { key: "nose", label: "Nose", number: 4, color: "#ff66b2" },
      { key: "bow", label: "Bow", number: 5, color: "#8338ec" },
    ],
    render: (filled, click) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <circle
          cx="350" cy="220" r="120"
          fill={filled.face}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("face")}
        />

        <polygon
          points="250,135 300,45 335,135"
          fill={filled.leftEar}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("leftEar")}
        />

        <polygon
          points="365,135 400,45 450,135"
          fill={filled.rightEar}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("rightEar")}
        />

        <polygon
          points="338,245 362,245 350,265"
          fill={filled.nose}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("nose")}
        />

        <circle cx="300" cy="195" r="12" fill="#222" />
        <circle cx="400" cy="195" r="12" fill="#222" />

        <path
          d="M350 265 Q325 285 315 305"
          fill="none" stroke="#222" strokeWidth="4"
        />
        <path
          d="M350 265 Q375 285 385 305"
          fill="none" stroke="#222" strokeWidth="4"
        />

        <line x1="230" y1="255" x2="310" y2="245" stroke="#222" strokeWidth="4" />
        <line x1="230" y1="280" x2="310" y2="270" stroke="#222" strokeWidth="4" />
        <line x1="390" y1="245" x2="470" y2="255" stroke="#222" strokeWidth="4" />
        <line x1="390" y1="270" x2="470" y2="280" stroke="#222" strokeWidth="4" />

        <circle
          cx="280" cy="340" r="24"
          fill={filled.bow}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("bow")}
        />
        <circle
          cx="330" cy="340" r="24"
          fill={filled.bow}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("bow")}
        />
        <circle
          cx="305" cy="340" r="14"
          fill={filled.bow}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("bow")}
        />

        <text x="350" y="228" textAnchor="middle" className="part-number">1</text>
        <text x="295" y="105" textAnchor="middle" className="part-number small-number">2</text>
        <text x="405" y="105" textAnchor="middle" className="part-number small-number">3</text>
        <text x="350" y="258" textAnchor="middle" className="part-number tiny-number">4</text>
        <text x="305" y="347" textAnchor="middle" className="part-number tiny-number">5</text>
      </svg>
    ),
  },

  {
    name: "Butterfly",
    parts: [
      { key: "leftTop", label: "Left Top Wing", number: 1, color: "#ff66b2" },
      { key: "leftBottom", label: "Left Bottom Wing", number: 2, color: "#8338ec" },
      { key: "rightTop", label: "Right Top Wing", number: 3, color: "#2ec4b6" },
      { key: "rightBottom", label: "Right Bottom Wing", number: 4, color: "#ff9f1c" },
      { key: "body", label: "Body", number: 5, color: "#8d6e63" },
    ],
    render: (filled, click) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="250" cy="145" rx="90" ry="75"
          fill={filled.leftTop}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("leftTop")}
        />
        <ellipse
          cx="250" cy="290" rx="90" ry="75"
          fill={filled.leftBottom}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("leftBottom")}
        />
        <ellipse
          cx="450" cy="145" rx="90" ry="75"
          fill={filled.rightTop}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("rightTop")}
        />
        <ellipse
          cx="450" cy="290" rx="90" ry="75"
          fill={filled.rightBottom}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("rightBottom")}
        />
        <rect
          x="330" y="100" width="40" height="220" rx="20"
          fill={filled.body}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("body")}
        />

        <circle cx="350" cy="78" r="26" fill="#fff" stroke="#222" strokeWidth="5" />
        <line x1="338" y1="56" x2="315" y2="20" stroke="#222" strokeWidth="4" />
        <line x1="362" y1="56" x2="385" y2="20" stroke="#222" strokeWidth="4" />
        <circle cx="315" cy="20" r="6" fill="#222" />
        <circle cx="385" cy="20" r="6" fill="#222" />

        <text x="250" y="153" textAnchor="middle" className="part-number">1</text>
        <text x="250" y="298" textAnchor="middle" className="part-number">2</text>
        <text x="450" y="153" textAnchor="middle" className="part-number">3</text>
        <text x="450" y="298" textAnchor="middle" className="part-number">4</text>
        <text x="350" y="220" textAnchor="middle" className="part-number">5</text>
      </svg>
    ),
  },

  {
    name: "Turtle",
    parts: [
      { key: "shell", label: "Shell", number: 1, color: "#6a994e" },
      { key: "head", label: "Head", number: 2, color: "#90be6d" },
      { key: "legs", label: "Legs", number: 3, color: "#43aa8b" },
      { key: "tail", label: "Tail", number: 4, color: "#f9c74f" },
    ],
    render: (filled, click) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="330" cy="210" rx="150" ry="105"
          fill={filled.shell}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("shell")}
        />

        <circle
          cx="510" cy="210" r="48"
          fill={filled.head}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("head")}
        />

        <ellipse cx="230" cy="130" rx="36" ry="24" fill={filled.legs} stroke="#222" strokeWidth="5" className="color-part" onClick={() => click("legs")} />
        <ellipse cx="430" cy="130" rx="36" ry="24" fill={filled.legs} stroke="#222" strokeWidth="5" className="color-part" onClick={() => click("legs")} />
        <ellipse cx="230" cy="300" rx="36" ry="24" fill={filled.legs} stroke="#222" strokeWidth="5" className="color-part" onClick={() => click("legs")} />
        <ellipse cx="430" cy="300" rx="36" ry="24" fill={filled.legs} stroke="#222" strokeWidth="5" className="color-part" onClick={() => click("legs")} />

        <polygon
          points="160,210 120,195 120,225"
          fill={filled.tail}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("tail")}
        />

        <circle cx="525" cy="200" r="6" fill="#222" />

        <path
          d="M308 125 L308 295 M252 160 L408 160 M252 260 L408 260 M252 160 L252 260 M408 160 L408 260"
          fill="none"
          stroke="#3d5a2b"
          strokeWidth="4"
        />

        <text x="330" y="220" textAnchor="middle" className="part-number">1</text>
        <text x="510" y="220" textAnchor="middle" className="part-number small-number">2</text>
        <text x="330" y="132" textAnchor="middle" className="part-number">3</text>
        <text x="138" y="214" textAnchor="middle" className="part-number tiny-number">4</text>
      </svg>
    ),
  },

  {
    name: "Rabbit",
    parts: [
      { key: "face", label: "Face", number: 1, color: "#f1faee" },
      { key: "leftEar", label: "Left Ear", number: 2, color: "#ffafcc" },
      { key: "rightEar", label: "Right Ear", number: 3, color: "#cdb4db" },
      { key: "nose", label: "Nose", number: 4, color: "#ff6b6b" },
      { key: "cheeks", label: "Cheeks", number: 5, color: "#ffd6a5" },
    ],
    render: (filled, click) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="350" cy="235" rx="120" ry="105"
          fill={filled.face}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("face")}
        />

        <ellipse
          cx="290" cy="92" rx="35" ry="95"
          fill={filled.leftEar}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("leftEar")}
        />

        <ellipse
          cx="410" cy="92" rx="35" ry="95"
          fill={filled.rightEar}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("rightEar")}
        />

        <circle
          cx="300" cy="272" r="28"
          fill={filled.cheeks}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("cheeks")}
        />
        <circle
          cx="400" cy="272" r="28"
          fill={filled.cheeks}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("cheeks")}
        />

        <polygon
          points="338,245 362,245 350,265"
          fill={filled.nose}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("nose")}
        />

        <circle cx="305" cy="210" r="11" fill="#222" />
        <circle cx="395" cy="210" r="11" fill="#222" />

        <path d="M350 265 Q330 285 320 300" fill="none" stroke="#222" strokeWidth="4" />
        <path d="M350 265 Q370 285 380 300" fill="none" stroke="#222" strokeWidth="4" />

        <text x="350" y="238" textAnchor="middle" className="part-number">1</text>
        <text x="290" y="100" textAnchor="middle" className="part-number small-number">2</text>
        <text x="410" y="100" textAnchor="middle" className="part-number small-number">3</text>
        <text x="350" y="258" textAnchor="middle" className="part-number tiny-number">4</text>
        <text x="350" y="315" textAnchor="middle" className="part-number">5</text>
      </svg>
    ),
  },

  {
    name: "Bird",
    parts: [
      { key: "body", label: "Body", number: 1, color: "#ffd166" },
      { key: "wing", label: "Wing", number: 2, color: "#06d6a0" },
      { key: "beak", label: "Beak", number: 3, color: "#f77f00" },
      { key: "tail", label: "Tail", number: 4, color: "#118ab2" },
    ],
    render: (filled, click) => (
      <svg viewBox="0 0 700 420" className="animal-svg">
        <ellipse
          cx="320" cy="230" rx="140" ry="95"
          fill={filled.body}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("body")}
        />

        <ellipse
          cx="330" cy="235" rx="65" ry="45"
          fill={filled.wing}
          stroke="#222" strokeWidth="4"
          className="color-part"
          onClick={() => click("wing")}
        />

        <polygon
          points="470,220 545,195 545,245"
          fill={filled.beak}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("beak")}
        />

        <polygon
          points="190,220 120,170 135,250"
          fill={filled.tail}
          stroke="#222" strokeWidth="5"
          className="color-part"
          onClick={() => click("tail")}
        />

        <circle cx="420" cy="200" r="10" fill="#222" />

        <line x1="280" y1="320" x2="270" y2="355" stroke="#222" strokeWidth="4" />
        <line x1="350" y1="320" x2="360" y2="355" stroke="#222" strokeWidth="4" />

        <text x="320" y="236" textAnchor="middle" className="part-number">1</text>
        <text x="330" y="242" textAnchor="middle" className="part-number small-number">2</text>
        <text x="518" y="225" textAnchor="middle" className="part-number small-number">3</text>
        <text x="145" y="220" textAnchor="middle" className="part-number small-number">4</text>
      </svg>
    ),
  },
];

export default function ColorTheAnimal() {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const TOTAL_ANIMALS = animals.length;

  const [animalIndex, setAnimalIndex] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const [message, setMessage] = useState(
    "Choose a number and fill the matching part."
  );

  const [gameReady, setGameReady] = useState(false);

  // Popup state
  const [showCompletion, setShowCompletion] = useState(false);
  const [wholeGameCompleted, setWholeGameCompleted] = useState(false);

  const currentAnimal = animals[animalIndex];

  const createEmptyParts = (animal) => {
    const obj = {};

    animal.parts.forEach((part) => {
      obj[part.key] = "#ffffff";
    });

    return obj;
  };

  const initialFilledParts = useMemo(
    () => createEmptyParts(currentAnimal),
    [currentAnimal]
  );

  const [filledParts, setFilledParts] =
    useState(initialFilledParts);

  // Restore Firebase progress
  useEffect(() => {
    if (progressLoading) return;

    const loadGame = async () => {
      if (
        savedState &&
        typeof savedState.animalIndex === "number" &&
        savedState.filledParts
      ) {
        const savedIndex = Math.min(
          Math.max(savedState.animalIndex, 0),
          TOTAL_ANIMALS - 1
        );

        setAnimalIndex(savedIndex);
        setFilledParts(savedState.filledParts);
        setSelectedNumber(savedState.selectedNumber ?? null);

        setMessage(
          savedState.message ||
            "Choose a number and fill the matching part."
        );

        setGameReady(true);
        return;
      }

      const emptyParts = createEmptyParts(animals[0]);

      setAnimalIndex(0);
      setFilledParts(emptyParts);
      setSelectedNumber(null);

      setMessage(
        "Choose a number and fill the matching part."
      );

      await save({
        animalIndex: 0,
        selectedNumber: null,
        filledParts: emptyParts,
        message:
          "Choose a number and fill the matching part.",
      });

      setGameReady(true);
    };

    loadGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoading]);

  // Color an animal part
  const handlePartClick = async (partKey) => {
    const part = currentAnimal.parts.find(
      (item) => item.key === partKey
    );

    if (!part) return;

    if (!selectedNumber) {
      setMessage("Select a number color first.");
      return;
    }

    if (selectedNumber === part.number) {
      const updatedParts = {
        ...filledParts,
        [part.key]: part.color,
      };

      const newMessage =
        `Good job! Number ${part.number} matched correctly.`;

      setFilledParts(updatedParts);
      setMessage(newMessage);

      await save({
        animalIndex,
        selectedNumber,
        filledParts: updatedParts,
        message: newMessage,
      });

      // Check completion AFTER this click
      const completedAfterClick =
        currentAnimal.parts.every(
          (item) =>
            updatedParts[item.key] === item.color
        );

      if (completedAfterClick) {
        setWholeGameCompleted(
          animalIndex === TOTAL_ANIMALS - 1
        );

        // Small delay so the child sees the final color first
        setTimeout(() => {
          setShowCompletion(true);
        }, 350);
      }

      return;
    }

    const newMessage =
      `Oops! That part needs number ${part.number}.`;

    setMessage(newMessage);

    await save({
      animalIndex,
      selectedNumber,
      filledParts,
      message: newMessage,
    });
  };

  // Reset current animal
  const handleReset = async () => {
    const emptyParts =
      createEmptyParts(currentAnimal);

    const newMessage =
      "Game reset. Choose a number again.";

    setFilledParts(emptyParts);
    setSelectedNumber(null);
    setMessage(newMessage);

    setShowCompletion(false);
    setWholeGameCompleted(false);

    await save({
      animalIndex,
      selectedNumber: null,
      filledParts: emptyParts,
      message: newMessage,
    });
  };

  const completedCount =
    currentAnimal.parts.filter(
      (part) =>
        filledParts[part.key] === part.color
    ).length;

  const isCompleted =
    completedCount === currentAnimal.parts.length;

  // Activity logging
  const logActivity = async (finalPercentage) => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "games",
          screen: "color-number-animals",
          score: finalPercentage,
          timestamp: new Date(),
        }
      );
    } catch (error) {
      console.error(
        "Activity error:",
        error
      );
    }
  };

  // Save final result
  const saveGameResult = async (finalPercentage) => {
    const userId =
      localStorage.getItem("userId");

    if (!userId) return;

    try {
      const gameResultsRef = collection(
        db,
        "users",
        userId,
        "game_results"
      );

      await addDoc(gameResultsRef, {
        game: "ColorNumberAnimals",
        score: finalPercentage,
        accuracy: finalPercentage.toFixed(2),
        totalAnimals: TOTAL_ANIMALS,
        animalsCompleted: TOTAL_ANIMALS,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(
        "Result error:",
        error
      );
    }
  };

  // Move to next animal
  const handleNextAnimal = async () => {
    if (!isCompleted) {
      setMessage(
        `Finish coloring the ${currentAnimal.name} first! 🎨`
      );
      return;
    }

    setShowCompletion(false);

    // Entire game finished
    if (animalIndex === TOTAL_ANIMALS - 1) {
      await finish(
        100,
        "Color By Number Animals"
      );

      await logActivity(100);
      await saveGameResult(100);

      const emptyParts =
        createEmptyParts(animals[0]);

      setAnimalIndex(0);
      setFilledParts(emptyParts);
      setSelectedNumber(null);

      setMessage(
        "Choose a number and fill the matching part."
      );

      setWholeGameCompleted(false);

      await save({
        animalIndex: 0,
        selectedNumber: null,
        filledParts: emptyParts,
        message:
          "Choose a number and fill the matching part.",
      });

      return;
    }

    const nextIndex = animalIndex + 1;
    const nextAnimal = animals[nextIndex];

    const emptyParts =
      createEmptyParts(nextAnimal);

    const newMessage =
      "Choose a number and fill the matching part.";

    setAnimalIndex(nextIndex);
    setFilledParts(emptyParts);
    setSelectedNumber(null);
    setMessage(newMessage);
    setWholeGameCompleted(false);

    await save({
      animalIndex: nextIndex,
      selectedNumber: null,
      filledParts: emptyParts,
      message: newMessage,
    });
  };

  if (
    progressLoading ||
    !gameReady ||
    !currentAnimal
  ) {
    return (
      <div className="color-animal-page">
        <div className="color-animal-card">
          <div className="top-bar">
            <h1>
              <img
                src={colorTheNumberIcon}
                alt="Color By Number"
                className="title-icon"
              />
              Color By Number Animal
            </h1>

            <p>
              ⏳ Loading your saved game...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="color-animal-page">

      <div className="color-animal-card">

        {/* HEADER */}
        <div className="top-bar">

          <h1>
            <img
              src={colorTheNumberIcon}
              alt="Color By Number"
              className="title-icon"
            />
            Color By Number Animal
          </h1>

          <p>
            Pick the number and color the matching
            animal part.
          </p>

          <p>
            Animal {animalIndex + 1} / {TOTAL_ANIMALS}
          </p>

        </div>

        {/* GAME */}
        <div className="game-layout">

          {/* ANIMAL */}
          <div className="sketch-box">

            <h2>
              {currentAnimal.name}
            </h2>

            {currentAnimal.render(
              filledParts,
              handlePartClick
            )}

            <div className="message-box">
              <p>{message}</p>

              <span>
                Completed: {completedCount} /{" "}
                {currentAnimal.parts.length}
              </span>
            </div>

            {isCompleted && (
              <div className="success-box">
                🎉 Awesome! You finished the{" "}
                {currentAnimal.name}!
              </div>
            )}

          </div>

          {/* TOOLS */}
          <div className="tools-box">

            <h3>Pick a Number</h3>

            <div className="number-palette">

              {currentAnimal.parts.map(
                (part) => (
                  <button
                    key={part.key}
                    className={`number-color-btn ${
                      selectedNumber ===
                      part.number
                        ? "active"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        part.color,
                    }}
                    onClick={() =>
                      setSelectedNumber(
                        part.number
                      )
                    }
                  >
                    {part.number}
                  </button>
                )
              )}

            </div>

            <div className="selected-preview">

              <span>
                Selected Number
              </span>

              <div className="selected-number-box">
                {selectedNumber || "-"}
              </div>

            </div>

            <div className="legend-box">

              <h4>Color Guide</h4>

              {currentAnimal.parts.map(
                (part) => (
                  <div
                    key={part.key}
                    className="legend-item"
                  >
                    <div
                      className="legend-color"
                      style={{
                        backgroundColor:
                          part.color,
                      }}
                    >
                      {part.number}
                    </div>

                    <span>
                      {part.label}
                    </span>
                  </div>
                )
              )}

            </div>

            <div className="action-buttons">

              <button
                className="reset-btn"
                onClick={handleReset}
              >
                Reset
              </button>

              <button
                className="next-btn"
                onClick={handleNextAnimal}
              >
                Next Animal →
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================================
          COMPLETION POPUP
      ================================= */}

      {showCompletion && (
        <div className="completion-overlay">

          <div className="completion-modal">

            <div className="completion-stars">
              ⭐ ⭐ ⭐
            </div>

            <div className="completion-icon">
              🎉
            </div>

            <h2>
              {wholeGameCompleted
                ? "Amazing! You Did It!"
                : "Great Job!"}
            </h2>

            <p>
              {wholeGameCompleted
                ? "You completed all the animals!"
                : `You finished coloring the ${currentAnimal.name}!`}
            </p>

            <div className="completion-score">
              <span>Completed</span>
              <strong>
                {completedCount} /{" "}
                {currentAnimal.parts.length}
              </strong>
            </div>

            <button
              className="completion-next-btn"
              onClick={handleNextAnimal}
            >
              {wholeGameCompleted
                ? "START AGAIN →"
                : "NEXT ANIMAL →"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}