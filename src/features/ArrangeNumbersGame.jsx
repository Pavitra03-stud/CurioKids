import React, { useEffect, useMemo, useState } from "react";

import "../styles/ArrangeNumbersGame.css";

import useGameProgress from "../hooks/useGameProgress";

// SAME IMAGE USED IN NUMBER GAMES HOME
import arrangeNumbersIcon from "../assets/03-arrange-numbers.png";

const GAME_ID = "arrange-numbers";

const levels = [
  {
    id: 1,
    title: "Easy",
    type: "ascending",
    range: 10,
    count: 5,
  },
  {
    id: 2,
    title: "Easy",
    type: "descending",
    range: 10,
    count: 5,
  },
  {
    id: 3,
    title: "Medium",
    type: "ascending",
    range: 50,
    count: 8,
  },
  {
    id: 4,
    title: "Medium",
    type: "descending",
    range: 50,
    count: 8,
  },
  {
    id: 5,
    title: "Hard",
    type: "ascending",
    range: 100,
    count: 10,
  },
  {
    id: 6,
    title: "Hard",
    type: "descending",
    range: 100,
    count: 10,
  },
];

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] = [
      newArray[j],
      newArray[i],
    ];
  }

  return newArray;
}

/* =========================================================
   GENERATE NUMBERS
========================================================= */

function generateUniqueNumbers(range, count) {
  const allNumbers = Array.from(
    { length: range },
    (_, i) => i + 1
  );

  return shuffleArray(allNumbers).slice(0, count);
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ArrangeNumbersGame() {
  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(GAME_ID, {
    currentLevelIndex: 0,
    questionNumbers: [],
    shuffledNumbers: [],
    selectedNumbers: [],
    message: "Arrange the numbers",
    completed: false,
  });

  const [currentLevelIndex, setCurrentLevelIndex] =
    useState(0);

  const [questionNumbers, setQuestionNumbers] =
    useState([]);

  const [shuffledNumbers, setShuffledNumbers] =
    useState([]);

  const [selectedNumbers, setSelectedNumbers] =
    useState([]);

  const [message, setMessage] = useState(
    "Arrange the numbers"
  );

  const [completed, setCompleted] = useState(false);

  const [restored, setRestored] = useState(false);

  const [showCompletionPopup, setShowCompletionPopup] =
    useState(false);

  const [wholeGameCompleted, setWholeGameCompleted] =
    useState(false);

  const currentLevel = levels[currentLevelIndex];

  /* =========================================================
     CORRECT ORDER
  ========================================================= */

  const correctOrder = useMemo(() => {
    const sorted = [...questionNumbers].sort(
      (a, b) => a - b
    );

    if (currentLevel.type === "ascending") {
      return sorted;
    }

    return sorted.reverse();
  }, [questionNumbers, currentLevel]);

  /* =========================================================
     RESTORE FIREBASE PROGRESS
  ========================================================= */

  useEffect(() => {
    if (progressLoading || !savedState) return;

    const savedLevel =
      savedState.currentLevelIndex ?? 0;

    const safeLevel =
      savedLevel >= 0 &&
      savedLevel < levels.length
        ? savedLevel
        : 0;

    setCurrentLevelIndex(safeLevel);

    setQuestionNumbers(
      Array.isArray(savedState.questionNumbers)
        ? savedState.questionNumbers
        : []
    );

    setShuffledNumbers(
      Array.isArray(savedState.shuffledNumbers)
        ? savedState.shuffledNumbers
        : []
    );

    setSelectedNumbers(
      Array.isArray(savedState.selectedNumbers)
        ? savedState.selectedNumbers
        : []
    );

    setMessage(
      savedState.message ||
        "Arrange the numbers"
    );

    setCompleted(
      savedState.completed ?? false
    );

    setRestored(true);
  }, [progressLoading, savedState]);

  /* =========================================================
     CREATE FIRST QUESTION
  ========================================================= */

  useEffect(() => {
    if (!restored) return;

    if (
      questionNumbers.length === 0 &&
      shuffledNumbers.length === 0
    ) {
      const numbers = generateUniqueNumbers(
        currentLevel.range,
        currentLevel.count
      );

      const shuffled = shuffleArray(numbers);

      const initialMessage =
        currentLevel.type === "ascending"
          ? "Arrange from smallest to biggest"
          : "Arrange from biggest to smallest";

      setQuestionNumbers(numbers);
      setShuffledNumbers(shuffled);
      setSelectedNumbers([]);
      setCompleted(false);
      setMessage(initialMessage);

      void save({
        currentLevelIndex,
        questionNumbers: numbers,
        shuffledNumbers: shuffled,
        selectedNumbers: [],
        message: initialMessage,
        completed: false,
      });
    }
  }, [restored, currentLevelIndex]);

  /* =========================================================
     NUMBER CLICK
  ========================================================= */

  const handleNumberClick = (number) => {
    if (
      completed ||
      selectedNumbers.includes(number)
    ) {
      return;
    }

    const nextIndex = selectedNumbers.length;

    const expectedNumber =
      correctOrder[nextIndex];

    /* =======================================================
       CORRECT NUMBER
    ======================================================= */

    if (number === expectedNumber) {
      const updatedNumbers = [
        ...selectedNumbers,
        number,
      ];

      setSelectedNumbers(updatedNumbers);

      /* =====================================================
         COMPLETED
      ===================================================== */

      if (
        updatedNumbers.length ===
        correctOrder.length
      ) {
        const successMessage =
          "🎉 Amazing! All numbers are correct!";

        const isLastLevel =
          currentLevelIndex ===
          levels.length - 1;

        setCompleted(true);

        setMessage(successMessage);

        setWholeGameCompleted(isLastLevel);

        /*
         * SHOW POPUP IMMEDIATELY
         *
         * Do NOT wait for Firebase.
         */
        setShowCompletionPopup(true);

        /*
         * Save in background
         */
        void save({
          currentLevelIndex,
          questionNumbers,
          shuffledNumbers,
          selectedNumbers: updatedNumbers,
          message: successMessage,
          completed: true,
        });

        return;
      }

      /* =====================================================
         NOT FINISHED YET
      ===================================================== */

      const nextNumber =
        correctOrder[updatedNumbers.length];

      const nextMessage =
        `Good! Next number is ${nextNumber}`;

      setMessage(nextMessage);

      void save({
        currentLevelIndex,
        questionNumbers,
        shuffledNumbers,
        selectedNumbers: updatedNumbers,
        message: nextMessage,
        completed: false,
      });

      return;
    }

    /* =======================================================
       WRONG NUMBER
    ======================================================= */

    const wrongMessage =
      `Oops! Choose ${expectedNumber}`;

    setMessage(wrongMessage);

    void save({
      currentLevelIndex,
      questionNumbers,
      shuffledNumbers,
      selectedNumbers,
      message: wrongMessage,
      completed: false,
    });
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    const resetMessage =
      currentLevel.type === "ascending"
        ? "Arrange from smallest to biggest"
        : "Arrange from biggest to smallest";

    setSelectedNumbers([]);

    setCompleted(false);

    setShowCompletionPopup(false);

    setWholeGameCompleted(false);

    setMessage(resetMessage);

    void save({
      currentLevelIndex,
      questionNumbers,
      shuffledNumbers,
      selectedNumbers: [],
      message: resetMessage,
      completed: false,
    });
  };

  /* =========================================================
     NEXT LEVEL
  ========================================================= */

  const handleNextLevel = () => {
    const nextIndex =
      currentLevelIndex + 1;

    /*
     * FINAL LEVEL
     * Start again from level 1
     */

    if (nextIndex >= levels.length) {
      const firstLevel = levels[0];

      const numbers = generateUniqueNumbers(
        firstLevel.range,
        firstLevel.count
      );

      const shuffled = shuffleArray(numbers);

      const nextMessage =
        firstLevel.type === "ascending"
          ? "Arrange from smallest to biggest"
          : "Arrange from biggest to smallest";

      setCurrentLevelIndex(0);

      setQuestionNumbers(numbers);

      setShuffledNumbers(shuffled);

      setSelectedNumbers([]);

      setCompleted(false);

      setMessage(nextMessage);

      setShowCompletionPopup(false);

      setWholeGameCompleted(false);

      void save({
        currentLevelIndex: 0,
        questionNumbers: numbers,
        shuffledNumbers: shuffled,
        selectedNumbers: [],
        message: nextMessage,
        completed: false,
      });

      return;
    }

    /*
     * NEXT NORMAL LEVEL
     */

    const nextLevel = levels[nextIndex];

    const numbers = generateUniqueNumbers(
      nextLevel.range,
      nextLevel.count
    );

    const shuffled = shuffleArray(numbers);

    const nextMessage =
      nextLevel.type === "ascending"
        ? "Arrange from smallest to biggest"
        : "Arrange from biggest to smallest";

    setCurrentLevelIndex(nextIndex);

    setQuestionNumbers(numbers);

    setShuffledNumbers(shuffled);

    setSelectedNumbers([]);

    setCompleted(false);

    setMessage(nextMessage);

    setShowCompletionPopup(false);

    setWholeGameCompleted(false);

    void save({
      currentLevelIndex: nextIndex,
      questionNumbers: numbers,
      shuffledNumbers: shuffled,
      selectedNumbers: [],
      message: nextMessage,
      completed: false,
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (progressLoading || !restored) {
    return (
      <div className="arrange-page">

        <div className="arrange-card loading-card">

          <div className="arrange-header">

            <img
              src={arrangeNumbersIcon}
              alt="Arrange Numbers"
              className="arrange-icon"
            />

            <div>
              <h1>Arrange the Numbers</h1>

              <p>
                Loading your progress...
              </p>
            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="arrange-page">

      <div className="arrange-card">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="arrange-header">

          <div className="arrange-title-area">

            <img
              src={arrangeNumbersIcon}
              alt="Arrange Numbers"
              className="arrange-icon"
            />

            <div>

              <h1>
                Arrange the Numbers
              </h1>

              <p>
                Tap numbers in the correct order
              </p>

            </div>

          </div>

          <div className="level-badge">
            LEVEL {currentLevel.id}
          </div>

        </div>

        {/* ===================================================
            INSTRUCTION
        =================================================== */}

        <div className="instruction-card">

          <div className="instruction-icon">
            {currentLevel.type === "ascending"
              ? "⬆️"
              : "⬇️"}
          </div>

          <div>

            <strong>
              {currentLevel.type === "ascending"
                ? "Smallest → Biggest"
                : "Biggest → Smallest"}
            </strong>

            <span>
              {currentLevel.title} •{" "}
              {currentLevel.count} numbers
            </span>

          </div>

        </div>

        {/* ===================================================
            NUMBER OPTIONS
        =================================================== */}

        <div className="numbers-card">

          <h2>
            🔢 Choose the numbers
          </h2>

          <div className="numbers-grid">

            {shuffledNumbers.map((number) => (
              <button
                key={number}
                className={`number-chip ${
                  selectedNumbers.includes(number)
                    ? "used"
                    : ""
                }`}
                onClick={() =>
                  handleNumberClick(number)
                }
                disabled={
                  selectedNumbers.includes(number) ||
                  completed
                }
              >
                {number}
              </button>
            ))}

          </div>

        </div>

        {/* ===================================================
            ANSWER
        =================================================== */}

        <div className="answer-card">

          <h2>
            ✨ Your Answer
          </h2>

          <div className="answer-row">

            {correctOrder.map((_, index) => (
              <div
                key={index}
                className={`answer-slot ${
                  selectedNumbers[index] !==
                  undefined
                    ? "filled"
                    : ""
                }`}
              >
                {selectedNumbers[index] ?? ""}
              </div>
            ))}

          </div>

        </div>

        {/* ===================================================
            MESSAGE
        =================================================== */}

        <div
          className={`message-card ${
            completed
              ? "message-success"
              : ""
          }`}
        >
          {message}
        </div>

        {/* ===================================================
            RESET ONLY
            No useless arrow / next button here
        =================================================== */}

        <button
          className="reset-btn"
          onClick={handleReset}
        >
          🔄 Reset
        </button>

      </div>

      {/* =====================================================
          COMPLETION POPUP
      ===================================================== */}

      {showCompletionPopup && (
        <div className="completion-overlay">

          <div className="completion-popup">

            <div className="popup-image-circle">

              <img
                src={arrangeNumbersIcon}
                alt="Arrange Numbers"
                className="popup-icon"
              />

            </div>

            <div className="popup-stars">
              ⭐ ⭐ ⭐
            </div>

            <h2>
              {wholeGameCompleted
                ? "Amazing! You Did It!"
                : "Great Job!"}
            </h2>

            <p>
              {wholeGameCompleted
                ? "You completed all 6 levels!"
                : `You completed Level ${currentLevel.id} perfectly!`}
            </p>

            <button
              className="popup-next-btn"
              onClick={handleNextLevel}
            >
              {wholeGameCompleted
                ? "START AGAIN →"
                : "NEXT LEVEL →"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}