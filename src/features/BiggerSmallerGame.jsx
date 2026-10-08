import React, { useEffect, useState } from "react";

import "../styles/BiggerSmallerGame.css";

import useGameProgress from "../hooks/useGameProgress";

// SAME ICON USED IN NUMBERS HOME
import biggerSmallerIcon from "../assets/04-bigger-or-smaller.png";

const GAME_ID = "bigger-smaller";

/* =========================================================
   CREATE DIFFERENT NUMBERS
========================================================= */

function getDifferentNumbers() {
  const first =
    Math.floor(Math.random() * 10) + 1;

  let second =
    Math.floor(Math.random() * 10) + 1;

  while (second === first) {
    second =
      Math.floor(Math.random() * 10) + 1;
  }

  return [first, second];
}

/* =========================================================
   QUESTION TYPE
========================================================= */

function getQuestionType() {
  return Math.random() > 0.5
    ? "bigger"
    : "smaller";
}

/* =========================================================
   CREATE ROUND
========================================================= */

function createRound() {
  const [first, second] =
    getDifferentNumbers();

  return {
    leftNumber: first,
    rightNumber: second,
    questionType: getQuestionType(),
    message: "Tap the correct number.",
    score: 0,
    answered: false,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BiggerSmallerGame() {
  const [initialState] =
    useState(() => createRound());

  /* =======================================================
     FIREBASE
  ======================================================= */

  const {
    savedState,
    loading,
    save,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [leftNumber, setLeftNumber] =
    useState(initialState.leftNumber);

  const [rightNumber, setRightNumber] =
    useState(initialState.rightNumber);

  const [questionType, setQuestionType] =
    useState(initialState.questionType);

  const [message, setMessage] =
    useState(initialState.message);

  const [score, setScore] =
    useState(initialState.score);

  const [answered, setAnswered] =
    useState(initialState.answered);

  const [restored, setRestored] =
    useState(false);

  /* =======================================================
     POPUP STATE
  ======================================================= */

  const [
    showPopup,
    setShowPopup,
  ] = useState(false);

  const [
    popupType,
    setPopupType,
  ] = useState("correct");

  /* =======================================================
     RESTORE SAVED GAME
  ======================================================= */

  useEffect(() => {
    if (loading) return;

    if (
      savedState &&
      Object.keys(savedState).length > 0 &&
      !restored
    ) {
      setLeftNumber(
        savedState.leftNumber ??
          initialState.leftNumber
      );

      setRightNumber(
        savedState.rightNumber ??
          initialState.rightNumber
      );

      setQuestionType(
        savedState.questionType ??
          initialState.questionType
      );

      setMessage(
        savedState.message ??
          "Tap the correct number."
      );

      setScore(
        Number(savedState.score) || 0
      );

      setAnswered(
        Boolean(savedState.answered)
      );

      setRestored(true);
    } else {
      setRestored(true);
    }
  }, [
    loading,
    savedState,
    restored,
    initialState,
  ]);

  /* =======================================================
     SAVE PROGRESS
  ======================================================= */

  useEffect(() => {
    if (loading || !restored) {
      return;
    }

    void save({
      score,
      leftNumber,
      rightNumber,
      questionType,
      message,
      answered,
    });
  }, [
    loading,
    restored,
    score,
    leftNumber,
    rightNumber,
    questionType,
    message,
    answered,
  ]);

  /* =======================================================
     NEW ROUND
  ======================================================= */

  const generateRound = () => {
    const [first, second] =
      getDifferentNumbers();

    const type = getQuestionType();

    setLeftNumber(first);
    setRightNumber(second);
    setQuestionType(type);

    setMessage(
      "Tap the correct number."
    );

    setAnswered(false);

    setShowPopup(false);
  };

  /* =======================================================
     ANSWER
  ======================================================= */

  const handleAnswer = (selectedNumber) => {
    if (answered) return;

    const correctNumber =
      questionType === "bigger"
        ? Math.max(
            leftNumber,
            rightNumber
          )
        : Math.min(
            leftNumber,
            rightNumber
          );

    /* =====================================================
       CORRECT
    ===================================================== */

    if (selectedNumber === correctNumber) {
      const newScore = score + 1;

      const successMessage =
        `🎉 Correct! ${correctNumber} is ${
          questionType === "bigger"
            ? "bigger"
            : "smaller"
        }.`;

      setScore(newScore);

      setMessage(successMessage);

      setAnswered(true);

      setPopupType("correct");

      /*
       * POPUP IMMEDIATELY
       */
      setShowPopup(true);

      /*
       * SAVE IN BACKGROUND
       */
      void save({
        score: newScore,
        leftNumber,
        rightNumber,
        questionType,
        message: successMessage,
        answered: true,
      });

      return;
    }

    /* =====================================================
       WRONG
    ===================================================== */

    const wrongMessage =
      `❌ That's not correct.`;

    setMessage(wrongMessage);

    /*
     * Do NOT lock the question.
     */
    setAnswered(false);

    setPopupType("wrong");

    /*
     * SHOW TRY AGAIN POPUP
     */
    setShowPopup(true);

    void save({
      score,
      leftNumber,
      rightNumber,
      questionType,
      message: wrongMessage,
      answered: false,
    });
  };

  /* =======================================================
     TRY AGAIN
  ======================================================= */

  const handleTryAgain = () => {
    setShowPopup(false);

    setPopupType("correct");

    setMessage(
      "Try again. Look carefully!"
    );

    setAnswered(false);
  };

  /* =======================================================
     NEXT QUESTION
  ======================================================= */

  const handleNext = () => {
    generateRound();
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    const [first, second] =
      getDifferentNumbers();

    const type = getQuestionType();

    setScore(0);

    setLeftNumber(first);

    setRightNumber(second);

    setQuestionType(type);

    setMessage(
      "Tap the correct number."
    );

    setAnswered(false);

    setShowPopup(false);

    void save({
      score: 0,
      leftNumber: first,
      rightNumber: second,
      questionType: type,
      message: "Tap the correct number.",
      answered: false,
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="bigger-page">

        <div className="bigger-card loading-card">

          <div className="bigger-header">

            <div className="bigger-title-area">

              <img
                src={biggerSmallerIcon}
                alt="Bigger or Smaller"
                className="bigger-icon animated-game-icon"
              />

              <div>
                <h1>
                  Bigger or Smaller
                </h1>

                <p>
                  Loading your progress...
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="bigger-page">

      <div className="bigger-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bigger-header">

          <div className="bigger-title-area">

            <img
              src={biggerSmallerIcon}
              alt="Bigger or Smaller"
              className="bigger-icon animated-game-icon"
            />

            <div>

              <h1>
                Bigger or Smaller
              </h1>

              <p>
                Compare the numbers
              </p>

            </div>

          </div>

          <div className="score-badge">
            ⭐ {score}
          </div>

        </div>

        {/* =================================================
            QUESTION
        ================================================= */}

        <div className="question-card">

          <div className="question-icon">
            {questionType === "bigger"
              ? "⬆️"
              : "⬇️"}
          </div>

          <div>

            <h2>
              Tap the{" "}
              {questionType === "bigger"
                ? "BIGGER"
                : "SMALLER"}{" "}
              number
            </h2>

            <p>
              Look carefully and choose one!
            </p>

          </div>

        </div>

        {/* =================================================
            NUMBERS
        ================================================= */}

        <div className="numbers-box">

          <button
            className="number-button"
            onClick={() =>
              handleAnswer(leftNumber)
            }
            disabled={answered}
          >
            {leftNumber}
          </button>

          <div className="vs-circle">
            OR
          </div>

          <button
            className="number-button"
            onClick={() =>
              handleAnswer(rightNumber)
            }
            disabled={answered}
          >
            {rightNumber}
          </button>

        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        <div
          className={`message-box ${
            popupType === "correct" &&
            answered
              ? "success-message"
              : ""
          }`}
        >
          <p>
            {message}
          </p>
        </div>

        {/* =================================================
            SCORE
        ================================================= */}

        <div className="score-box">

          <span>
            🏆 Score: {score}
          </span>

        </div>

        {/* =================================================
            RESET
        ================================================= */}

        <button
          className="reset-btn"
          onClick={handleReset}
        >
          🔄 Reset Game
        </button>

      </div>

      {/* ===================================================
          RESULT POPUP
      =================================================== */}

      {showPopup && (
        <div className="completion-overlay">

          <div
            className={`completion-popup ${
              popupType === "wrong"
                ? "wrong-popup"
                : "correct-popup"
            }`}
          >

            {/* SAME HOME ICON */}
            <div className="popup-image-circle">

              <img
                src={biggerSmallerIcon}
                alt="Bigger or Smaller"
                className="popup-icon animated-game-icon"
              />

            </div>

            {/* CORRECT */}
            {popupType === "correct" ? (
              <>
                <div className="popup-stars">
                  ⭐ ⭐ ⭐
                </div>

                <h2>
                  Great Job!
                </h2>

                <p>
                  You chose the correct number!
                </p>

                <div className="popup-score">
                  🏆 Score: {score}
                </div>

                <button
                  className="popup-next-btn"
                  onClick={handleNext}
                >
                  NEXT →
                </button>
              </>
            ) : (
              /* WRONG */
              <>
                <div className="try-again-symbol">
                  💭
                </div>

                <h2>
                  Try Again!
                </h2>

                <p>
                  Look at both numbers carefully
                  and try once more.
                </p>

                <button
                  className="popup-try-btn"
                  onClick={handleTryAgain}
                >
                  TRY AGAIN
                </button>
              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
}