import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "../styles/NumberLineLearning.css";
import useGameProgress from "../hooks/useGameProgress";
import numberLineImage from "../assets/number_line_learning.png";

const GAME_ID = "number-line-learning";

const levels = [
  {
    id: 1,
    title: "Level 1",
    subtitle: "Learn 0 to 10",
    max: 10,
    step: 1,
  },
  {
    id: 2,
    title: "Level 2",
    subtitle: "Learn 0 to 50",
    max: 50,
    step: 5,
  },
  {
    id: 3,
    title: "Level 3",
    subtitle: "Learn 0 to 100",
    max: 100,
    step: 10,
  },
];

export default function NumberLineLearning() {
  const initialState = {
    screen: "levels",
    selectedLevelId: null,
    currentIndex: 0,
    voiceEnabled: true,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  const [screen, setScreen] =
    useState("levels");

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const [restored, setRestored] =
    useState(false);

  /* =========================================================
     VOICE
  ========================================================= */

  const speak = (text) => {
    if (
      !voiceEnabled ||
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  /* =========================================================
     RESTORE PROGRESS
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Number Line saved state:",
      savedState
    );

    if (savedState) {
      setScreen(
        savedState.screen || "levels"
      );

      const savedLevel =
        levels.find(
          (level) =>
            level.id ===
            savedState.selectedLevelId
        ) || null;

      setSelectedLevel(savedLevel);

      setCurrentIndex(
        savedState.currentIndex ?? 0
      );

      setVoiceEnabled(
        savedState.voiceEnabled ?? true
      );
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     NUMBER LINE
  ========================================================= */

  const numberLine = useMemo(() => {
    if (!selectedLevel) return [];

    return Array.from(
      {
        length:
          Math.floor(
            selectedLevel.max /
              selectedLevel.step
          ) + 1,
      },
      (_, index) =>
        index * selectedLevel.step
    );
  }, [selectedLevel]);

  const currentNumber =
    numberLine[currentIndex] ?? 0;

  const beforeNumber =
    currentIndex > 0
      ? numberLine[currentIndex - 1]
      : null;

  const afterNumber =
    currentIndex <
    numberLine.length - 1
      ? numberLine[currentIndex + 1]
      : null;

  /* =========================================================
     SAVE PROGRESS
  ========================================================= */

  const saveProgress = async (
    overrides = {}
  ) => {
    await save({
      screen,
      selectedLevelId:
        selectedLevel?.id ?? null,
      currentIndex,
      voiceEnabled,
      ...overrides,
    });
  };

  /* =========================================================
     SELECT LEVEL
  ========================================================= */

  const handleSelectLevel = async (
    level
  ) => {
    setSelectedLevel(level);
    setCurrentIndex(0);
    setScreen("learn");

    await save({
      screen: "learn",
      selectedLevelId: level.id,
      currentIndex: 0,
      voiceEnabled,
    });

    setTimeout(() => {
      speak(
        `${level.title}. This is a number line. Numbers on the left are smaller. Numbers on the right are bigger.`
      );
    }, 200);
  };

  /* =========================================================
     SPEAK CURRENT NUMBER
  ========================================================= */

  const handleSpeak = () => {
    let text =
      `This is number ${currentNumber}. `;

    if (beforeNumber !== null) {
      text +=
        `Before ${currentNumber} is ${beforeNumber}. `;
    }

    if (afterNumber !== null) {
      text +=
        `After ${currentNumber} is ${afterNumber}. `;
    }

    text +=
      "Numbers move from left to right.";

    speak(text);
  };

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePrevious = async () => {
    if (currentIndex === 0) {
      return;
    }

    const prevIndex =
      currentIndex - 1;

    const prevNumber =
      numberLine[prevIndex];

    const prevBefore =
      prevIndex > 0
        ? numberLine[prevIndex - 1]
        : null;

    const prevAfter =
      prevIndex <
      numberLine.length - 1
        ? numberLine[prevIndex + 1]
        : null;

    setCurrentIndex(prevIndex);

    await save({
      screen: "learn",
      selectedLevelId:
        selectedLevel.id,
      currentIndex: prevIndex,
      voiceEnabled,
    });

    let text =
      `This is number ${prevNumber}. `;

    if (prevBefore !== null) {
      text +=
        `Before ${prevNumber} is ${prevBefore}. `;
    }

    if (prevAfter !== null) {
      text +=
        `After ${prevNumber} is ${prevAfter}.`;
    }

    speak(text);
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNext = async () => {
    if (
      currentIndex >=
      numberLine.length - 1
    ) {
      return;
    }

    const nextIndex =
      currentIndex + 1;

    const nextNumber =
      numberLine[nextIndex];

    const nextBefore =
      nextIndex > 0
        ? numberLine[nextIndex - 1]
        : null;

    const nextAfter =
      nextIndex <
      numberLine.length - 1
        ? numberLine[nextIndex + 1]
        : null;

    setCurrentIndex(nextIndex);

    await save({
      screen: "learn",
      selectedLevelId:
        selectedLevel.id,
      currentIndex: nextIndex,
      voiceEnabled,
    });

    let text =
      `This is number ${nextNumber}. `;

    if (nextBefore !== null) {
      text +=
        `Before ${nextNumber} is ${nextBefore}. `;
    }

    if (nextAfter !== null) {
      text +=
        `After ${nextNumber} is ${nextAfter}.`;
    }

    speak(text);
  };

  /* =========================================================
     VOICE TOGGLE
  ========================================================= */

  const handleVoiceToggle = async () => {
    const newVoiceState =
      !voiceEnabled;

    setVoiceEnabled(
      newVoiceState
    );

    await save({
      screen,
      selectedLevelId:
        selectedLevel?.id ?? null,
      currentIndex,
      voiceEnabled:
        newVoiceState,
    });

    if (
      !newVoiceState &&
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }
  };

  /* =========================================================
     BACK TO LEVELS
  ========================================================= */

  const handleBack = async () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setScreen("levels");
    setSelectedLevel(null);
    setCurrentIndex(0);

    await save({
      screen: "levels",
      selectedLevelId: null,
      currentIndex: 0,
      voiceEnabled,
    });
  };

  /* =========================================================
     CLEANUP SPEECH
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="number-line-page">

        <div className="number-line-header">
          <h1>
            📏 Number Line Learning
          </h1>
        </div>

        <div className="number-line-content">

          <div className="level-top-box">

            <h2>
              Loading your lesson...
            </h2>

            <p>
              Restoring your progress ✨
            </p>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
   LEVEL SCREEN
========================================================= */

if (screen === "levels") {
  return (
    <div className="number-line-page">

      {/* GREEN HEADER */}
      <div className="number-line-header">
        <h1>
          📏 Number Line Learning
        </h1>
      </div>

      {/* BROWN BOARD */}
      <div className="number-line-levels-wrapper">

        {/* NUMBER LINE IMAGE + CHOOSE LEVEL */}
        <div className="level-top-section">

          <img
            src={numberLineImage}
            alt="Number Line"
            className="number-line-level-icon"
          />

          <div className="level-top-box">
            <h2>
              Choose a Level
            </h2>

            <p>
              Start learning the number
              line step by step.
            </p>
          </div>

        </div>

        {/* LEVEL CARDS */}
        <div className="level-grid">

          {levels.map((level) => (
            <button
              key={level.id}
              className="level-card"
              onClick={() =>
                handleSelectLevel(level)
              }
            >

              <div className="level-number">
                {level.id}
              </div>

              <h3>
                {level.title}
              </h3>

              <p>
                {level.subtitle}
              </p>

              {/* ONLY ONE ARROW */}
              <span className="level-arrow">
                →
              </span>

            </button>
          ))}

        </div>

        {/* VOICE */}
        <div className="bottom-controls single">

          <button
            className="speak-btn"
            onClick={handleVoiceToggle}
          >
            {voiceEnabled
              ? "🔊 Voice On"
              : "🔇 Voice Off"}
          </button>

        </div>

      </div>

    </div>
  );
}

  /* =========================================================
     LEARNING SCREEN
  ========================================================= */

  return (
    <div className="number-line-page">

      {/* GREEN HEADER */}

      <div className="number-line-header">
        <h1>
          📏 Number Line Learning
        </h1>
      </div>

      {/* BROWN BOARD */}

      <div className="number-line-content">

        {/* TOP LEARNING ROW */}

        <div className="top-learning-row">

          <div className="main-number-card">

            <div className="frog-icon">
              🐸
            </div>

            <div className="main-number">
              {currentNumber}
            </div>

            <div className="main-label">
              Current Number
            </div>

          </div>

          <div className="right-learning-card">

            <h2>
              Learn number position
            </h2>

            <div className="mini-card-row">

              <div className="mini-card">

                <span className="mini-title">
                  Before
                </span>

                <span className="mini-value">
                  {beforeNumber !== null
                    ? beforeNumber
                    : "-"}
                </span>

              </div>

              <div className="mini-card current-mini">

                <span className="mini-title">
                  Current
                </span>

                <span className="mini-value">
                  {currentNumber}
                </span>

              </div>

              <div className="mini-card">

                <span className="mini-title">
                  After
                </span>

                <span className="mini-value">
                  {afterNumber !== null
                    ? afterNumber
                    : "-"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* NUMBER LINE */}

        <div className="middle-learning-box">

          <h2>

            {beforeNumber !== null
              ? beforeNumber
              : "-"}

            {" "}, {currentNumber} ,{" "}

            {afterNumber !== null
              ? afterNumber
              : "-"}

          </h2>

          <div className="number-line-track-wrapper">

            <div className="number-line-track" />

            {numberLine.map(
              (num, index) => {

                const isCurrent =
                  index === currentIndex;

                const isBefore =
                  index ===
                  currentIndex - 1;

                const isAfter =
                  index ===
                  currentIndex + 1;

                return (
                  <div
                    key={num}
                    className="line-point-box"
                    style={{
                      left: `${
                        (num /
                          selectedLevel.max) *
                        100
                      }%`,
                    }}
                  >

                    {isCurrent && (
                      <div className="line-frog">
                        🐸
                      </div>
                    )}

                    <div
                      className={`line-point
                        ${
                          isCurrent
                            ? "current-point"
                            : ""
                        }
                        ${
                          isBefore
                            ? "before-point"
                            : ""
                        }
                        ${
                          isAfter
                            ? "after-point"
                            : ""
                        }
                      `}
                    >
                      {num}
                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* INFO */}

        <div className="info-row">

          <div className="info-bar">

            Learn: In number line,{" "}

            {beforeNumber !== null
              ? beforeNumber
              : "no number"}

            {" "}comes before{" "}

            <strong>
              {currentNumber}
            </strong>

            {" "}and{" "}

            {afterNumber !== null
              ? afterNumber
              : "no number"}

            {" "}comes after it.

          </div>

          <div className="level-badge-box">

            <span>
              Level:{" "}
              {selectedLevel.id}
            </span>

          </div>

        </div>

        {/* CONTROLS */}

        <div className="bottom-controls">

          <button
            className="speak-btn"
            onClick={handleSpeak}
          >
            🔊 Speak
          </button>

          <button
            className="nav-btn"
            onClick={handlePrevious}
            disabled={
              currentIndex === 0
            }
          >
            Previous
          </button>

          <button
            className="nav-btn next-nav-btn"
            onClick={handleNext}
            disabled={
              currentIndex ===
              numberLine.length - 1
            }
          >
            Next
          </button>

          <button
            className="back-action-btn"
            onClick={handleBack}
          >
            Back to Levels
          </button>

        </div>

        {/* PROGRESS */}

        <div className="progress-text">
          {currentIndex + 1} /{" "}
          {numberLine.length}
        </div>

      </div>

    </div>
  );
}