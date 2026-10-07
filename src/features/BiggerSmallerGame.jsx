import React, { useEffect, useState } from "react";
import "../styles/BiggerSmallerGame.css";
import useGameProgress from "../hooks/useGameProgress";

function getDifferentNumbers() {
  const first = Math.floor(Math.random() * 10) + 1;

  let second = Math.floor(Math.random() * 10) + 1;

  while (second === first) {
    second = Math.floor(Math.random() * 10) + 1;
  }

  return [first, second];
}

function getQuestionType() {
  return Math.random() > 0.5
    ? "bigger"
    : "smaller";
}

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

export default function BiggerSmallerGame() {
  // =====================================================
  // 🎮 GAME ID
  // =====================================================

  const GAME_ID = "bigger-smaller";

  // =====================================================
  // 🎮 INITIAL STATE
  // =====================================================

  const [
    initialState,
  ] = useState(() => createRound());

  // =====================================================
  // 🔥 FIREBASE GAME PROGRESS
  // =====================================================

  const {
    savedState,
    loading,
    save,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  // =====================================================
  // 🎮 LOCAL GAME STATE
  // =====================================================

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

  // =====================================================
  // 🔄 RESTORE SAVED GAME
  // =====================================================

  useEffect(() => {
    if (loading) return;

    if (
      savedState &&
      Object.keys(savedState).length > 0 &&
      !restored
    ) {
      console.log(
        "🔄 Restoring Bigger & Smaller:",
        savedState
      );

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

  // =====================================================
  // 💾 SAVE GAME AUTOMATICALLY
  // =====================================================

  useEffect(() => {
    if (loading || !restored) {
      return;
    }

    const saveCurrentGame =
      async () => {
        await save({
          question: 0,

          score,

          leftNumber,

          rightNumber,

          questionType,

          message,

          answered,
        });
      };

    saveCurrentGame();
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

  // =====================================================
  // 🔄 GENERATE NEW ROUND
  // =====================================================

  const generateRound = () => {
    const [
      first,
      second,
    ] = getDifferentNumbers();

    const type =
      getQuestionType();

    setLeftNumber(first);

    setRightNumber(second);

    setQuestionType(type);

    setMessage(
      "Tap the correct number."
    );

    setAnswered(false);
  };

  // =====================================================
  // 🎯 ANSWER
  // =====================================================

  const handleAnswer = (
    selectedNumber
  ) => {
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

    if (
      selectedNumber ===
      correctNumber
    ) {
      setMessage(
        `✅ Good job! ${correctNumber} is ${
          questionType === "bigger"
            ? "bigger"
            : "smaller"
        }.`
      );

      setScore(
        (prev) => prev + 1
      );
    } else {
      setMessage(
        `❌ Try again next round! Correct answer is ${correctNumber}.`
      );
    }

    setAnswered(true);
  };

  // =====================================================
  // 🔄 RESET
  // =====================================================

  const handleReset = () => {
    setScore(0);

    generateRound();
  };

  // =====================================================
  // ➡️ NEXT
  // =====================================================

  const handleNext = () => {
    generateRound();
  };

  // =====================================================
  // ⏳ LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="bigger-page">
        <div className="bigger-card">
          <div className="top-bar">
            <h1>
              🔢 Bigger & Smaller
            </h1>

            <p>
              Loading your game...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // 🎨 UI
  // =====================================================

  return (
    <div className="bigger-page">

      <div className="bigger-card">

        {/* =============================================
            HEADER
        ============================================== */}

        <div className="top-bar">

          <h1>
            🔢 Bigger & Smaller
          </h1>

          <p>
            Tap the correct number
          </p>

        </div>

        {/* =============================================
            QUESTION
        ============================================== */}

        <div className="question-box">

          <h2>
            Tap the{" "}
            {questionType ===
            "bigger"
              ? "bigger"
              : "smaller"}{" "}
            number
          </h2>

        </div>

        {/* =============================================
            NUMBERS
        ============================================== */}

        <div className="numbers-box">

          <button
            className="number-button"
            onClick={() =>
              handleAnswer(
                leftNumber
              )
            }
            disabled={answered}
          >
            {leftNumber}
          </button>

          <button
            className="number-button"
            onClick={() =>
              handleAnswer(
                rightNumber
              )
            }
            disabled={answered}
          >
            {rightNumber}
          </button>

        </div>

        {/* =============================================
            MESSAGE
        ============================================== */}

        <div className="message-box">

          <p>
            {message}
          </p>

        </div>

        {/* =============================================
            SCORE
        ============================================== */}

        <div className="score-box">

          <span>
            Score: {score}
          </span>

        </div>

        {/* =============================================
            BUTTONS
        ============================================== */}

        <div className="button-group">

          <button
            className="reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            className="next-btn"
            onClick={handleNext}
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}