import React, { useEffect, useMemo, useState } from "react";
import "../styles/BuildWord.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "build-word";
const GAME_NAME = "Build the Word";
const TOTAL_QUESTIONS = 5;

/* =========================================================
   QUESTION BANK
========================================================= */

const WORD_BANK = [
  {
    word: "SUN",
    emoji: "☀️",
    hint: "It shines in the sky.",
  },
  {
    word: "CAT",
    emoji: "🐱",
    hint: "A small animal that says meow.",
  },
  {
    word: "DOG",
    emoji: "🐶",
    hint: "A friendly animal that barks.",
  },
  {
    word: "FISH",
    emoji: "🐟",
    hint: "It swims in water.",
  },
  {
    word: "BOOK",
    emoji: "📚",
    hint: "You read this.",
  },
  {
    word: "MOON",
    emoji: "🌙",
    hint: "You can see it at night.",
  },
  {
    word: "STAR",
    emoji: "⭐",
    hint: "It twinkles in the night sky.",
  },
  {
    word: "TREE",
    emoji: "🌳",
    hint: "It has leaves and branches.",
  },
  {
    word: "BIRD",
    emoji: "🐦",
    hint: "It can fly in the sky.",
  },
  {
    word: "BALL",
    emoji: "⚽",
    hint: "You can kick or throw it.",
  },
  {
    word: "CAKE",
    emoji: "🎂",
    hint: "You may eat this on a birthday.",
  },
  {
    word: "FROG",
    emoji: "🐸",
    hint: "It can jump and says ribbit.",
  },
  {
    word: "FISH",
    emoji: "🐠",
    hint: "It lives underwater.",
  },
  {
    word: "RAIN",
    emoji: "🌧️",
    hint: "Water falls from the clouds.",
  },
  {
    word: "MILK",
    emoji: "🥛",
    hint: "A white drink.",
  },
  {
    word: "HAND",
    emoji: "✋",
    hint: "You have five fingers on it.",
  },
  {
    word: "SHIP",
    emoji: "🚢",
    hint: "It travels on water.",
  },
  {
    word: "STAR",
    emoji: "🌟",
    hint: "It shines in the sky.",
  },
  {
    word: "LION",
    emoji: "🦁",
    hint: "The king of the jungle.",
  },
  {
    word: "DUCK",
    emoji: "🦆",
    hint: "A bird that likes water.",
  },
  {
    word: "FARM",
    emoji: "🚜",
    hint: "A place where animals and crops are kept.",
  },
  {
    word: "APPLE",
    emoji: "🍎",
    hint: "A red or green fruit.",
  },
  {
    word: "HOUSE",
    emoji: "🏠",
    hint: "A place where people live.",
  },
  {
    word: "TIGER",
    emoji: "🐯",
    hint: "A big striped wild cat.",
  },
  {
    word: "HORSE",
    emoji: "🐴",
    hint: "An animal people can ride.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getMissingIndex(word) {
  return Math.floor(Math.random() * word.length);
}

function createQuestion(usedWords = []) {
  const available = WORD_BANK.filter(
    (item) => !usedWords.includes(item.word)
  );

  const pool =
    available.length > 0 ? available : WORD_BANK;

  const selected =
    pool[Math.floor(Math.random() * pool.length)];

  const missingIndex = getMissingIndex(
    selected.word
  );

  const missingLetter =
    selected.word[missingIndex];

  const wrongLetters = shuffle(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .filter(
        (letter) => letter !== missingLetter
      )
  ).slice(0, 3);

  const options = shuffle([
    missingLetter,
    ...wrongLetters,
  ]);

  return {
    ...selected,
    missingIndex,
    missingLetter,
    options,
  };
}

function createInitialState() {
  const firstQuestion = createQuestion();

  return {
    questionIndex: 0,
    score: 0,
    currentQuestion: firstQuestion,
    usedWords: [firstQuestion.word],
    answered: false,
    selectedLetter: null,
    message: "",
    completed: false,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BuildWord() {
  const initialState = useMemo(
    () => createInitialState(),
    []
  );

  const {
    savedState,
    loading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [currentQuestion, setCurrentQuestion] =
    useState(null);

  const [usedWords, setUsedWords] =
    useState([]);

  const [answered, setAnswered] =
    useState(false);

  const [selectedLetter, setSelectedLetter] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  /* =======================================================
     RESTORE GAME
  ======================================================= */

  useEffect(() => {
    if (loading) return;

    if (
      savedState &&
      Object.keys(savedState).length > 0 &&
      savedState.currentQuestion
    ) {
      setQuestionIndex(
        savedState.questionIndex || 0
      );

      setScore(
        savedState.score || 0
      );

      setCurrentQuestion(
        savedState.currentQuestion
      );

      setUsedWords(
        savedState.usedWords || []
      );

      setAnswered(
        savedState.answered || false
      );

      setSelectedLetter(
        savedState.selectedLetter || null
      );

      setMessage(
        savedState.message || ""
      );

      setCompleted(
        savedState.completed || false
      );

      console.log(
        "✅ Build Word restored:",
        savedState
      );

      return;
    }

    const fresh =
      createInitialState();

    setQuestionIndex(
      fresh.questionIndex
    );

    setScore(
      fresh.score
    );

    setCurrentQuestion(
      fresh.currentQuestion
    );

    setUsedWords(
      fresh.usedWords
    );

    setAnswered(false);
    setSelectedLetter(null);
    setMessage("");
    setCompleted(false);

    save({
      questionIndex:
        fresh.questionIndex,

      score:
        fresh.score,

      currentQuestion:
        fresh.currentQuestion,

      usedWords:
        fresh.usedWords,

      answered: false,

      selectedLetter: null,

      message: "",

      completed: false,
    });
  }, [loading, savedState]);

  /* =======================================================
     SAVE CURRENT STATE
  ======================================================= */

  const saveCurrentState = async (
    overrides = {}
  ) => {
    await save({
      questionIndex,
      score,
      currentQuestion,
      usedWords,
      answered,
      selectedLetter,
      message,
      completed,
      ...overrides,
    });
  };

  /* =======================================================
     SELECT LETTER
  ======================================================= */

  const handleLetterClick = async (
    letter
  ) => {
    if (
      !currentQuestion ||
      answered ||
      completed
    ) {
      return;
    }

    setSelectedLetter(letter);
    setAnswered(true);

    const isCorrect =
      letter ===
      currentQuestion.missingLetter;

    const newScore = isCorrect
      ? score + 1
      : score;

    const newMessage = isCorrect
      ? "🎉 Amazing! You built the word!"
      : `💛 Almost! The missing letter is ${currentQuestion.missingLetter}.`;

    setScore(newScore);
    setMessage(newMessage);

    await saveCurrentState({
      score: newScore,
      answered: true,
      selectedLetter: letter,
      message: newMessage,
    });
  };

  /* =======================================================
     NEXT QUESTION
  ======================================================= */

  const handleNext = async () => {
    if (
      !currentQuestion ||
      !answered ||
      completed
    ) {
      return;
    }

    /* LAST QUESTION */

    if (
      questionIndex >=
      TOTAL_QUESTIONS - 1
    ) {
      const finalScore = score;

      const percentage = Math.round(
        (finalScore /
          TOTAL_QUESTIONS) *
          100
      );

      setCompleted(true);

      await saveCurrentState({
        completed: true,
        answered: true,
      });

      await finish(
        percentage,
        GAME_NAME
      );

      return;
    }

    /* NEW QUESTION */

    const nextQuestion =
      createQuestion(usedWords);

    const newUsedWords = [
      ...usedWords,
      nextQuestion.word,
    ];

    const nextIndex =
      questionIndex + 1;

    setQuestionIndex(nextIndex);

    setCurrentQuestion(
      nextQuestion
    );

    setUsedWords(
      newUsedWords
    );

    setAnswered(false);

    setSelectedLetter(null);

    setMessage("");

    await save({
      questionIndex:
        nextIndex,

      score,

      currentQuestion:
        nextQuestion,

      usedWords:
        newUsedWords,

      answered: false,

      selectedLetter: null,

      message: "",

      completed: false,
    });
  };

  /* =======================================================
     PLAY AGAIN
  ======================================================= */

  const handlePlayAgain = async () => {
    const fresh =
      createInitialState();

    setQuestionIndex(0);

    setScore(0);

    setCurrentQuestion(
      fresh.currentQuestion
    );

    setUsedWords(
      fresh.usedWords
    );

    setAnswered(false);

    setSelectedLetter(null);

    setMessage("");

    setCompleted(false);

    await save({
      questionIndex: 0,
      score: 0,
      currentQuestion:
        fresh.currentQuestion,
      usedWords:
        fresh.usedWords,
      answered: false,
      selectedLetter: null,
      message: "",
      completed: false,
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading ||
    !currentQuestion
  ) {
    return (
      <div className="build-word-page">

        <nav className="build-navbar">

          <div className="build-brand">
            <span>🌿</span>
            CurioKids
          </div>

          <div className="build-navbar-title">
            🧩 Build the Word
          </div>

        </nav>

        <main className="build-main">

          <div className="build-loading-card">

            <div className="build-loading-icon">
              🧩
            </div>

            <h2>
              Building your game...
            </h2>

            <p>
              Getting some fun words ready!
            </p>

          </div>

        </main>

      </div>
    );
  }

  /* =======================================================
     COMPLETED SCREEN
  ======================================================= */

  if (completed) {
    const percentage =
      Math.round(
        (score /
          TOTAL_QUESTIONS) *
          100
      );

    return (
      <div className="build-word-page">

        <nav className="build-navbar">

          <div className="build-brand">
            <span>🌿</span>
            CurioKids
          </div>

          <div className="build-navbar-title">
            🧩 Build the Word
          </div>

        </nav>

        <main className="build-main">

          <div className="build-complete-card">

            <div className="build-trophy">
              🏆
            </div>

            <div className="build-complete-label">
              ROUND COMPLETED
            </div>

            <h1>
              Word Builder Champion!
            </h1>

            <p className="build-complete-text">
              You finished building all the words!
            </p>

            <div className="build-result-grid">

              <div className="build-result-card">

                <span>
                  SCORE
                </span>

                <strong>
                  {score}/{TOTAL_QUESTIONS}
                </strong>

              </div>

              <div className="build-result-card">

                <span>
                  ACCURACY
                </span>

                <strong>
                  {percentage}%
                </strong>

              </div>

            </div>

            <div className="build-celebration">

              {percentage >= 80
                ? "🌟 Fantastic word building!"
                : "🌱 Great effort! Keep practicing!"}

            </div>

            <button
              className="build-play-again"
              onClick={handlePlayAgain}
            >
              🔄 Build Again
            </button>

          </div>

        </main>

      </div>
    );
  }

  /* =======================================================
     WORD DISPLAY
  ======================================================= */

  const wordLetters =
    currentQuestion.word.split("");

  return (
    <div className="build-word-page">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="build-navbar">

        <div className="build-brand">
          <span>🌿</span>
          CurioKids
        </div>

        <div className="build-navbar-title">
          🧩 Build the Word
        </div>

      </nav>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="build-main">

        <section className="build-game-card">

          {/* =================================================
              STATS
          ================================================= */}

          <div className="build-stats">

            <div className="build-stat-pill">

              <span>
                Question
              </span>

              <strong>
                {questionIndex + 1}
                <small>
                  /{TOTAL_QUESTIONS}
                </small>
              </strong>

            </div>

            <div className="build-stat-pill">

              <span>
                ⭐ Score
              </span>

              <strong>
                {score}
              </strong>

            </div>

          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <div className="build-progress">

            <div className="build-progress-text">

              <span>
                Word Journey
              </span>

              <strong>
                {Math.round(
                  ((questionIndex + 1) /
                    TOTAL_QUESTIONS) *
                    100
                )}
                %
              </strong>

            </div>

            <div className="build-progress-track">

              <div
                className="build-progress-fill"
                style={{
                  width: `${
                    ((questionIndex + 1) /
                      TOTAL_QUESTIONS) *
                    100
                  }%`,
                }}
              />

            </div>

          </div>

          {/* =================================================
              CLUE PANEL
          ================================================= */}

          <section className="build-clue-panel">

            <div className="build-clue-label">
              WORD CLUE
            </div>

            <div className="build-clue-content">

              <div className="build-clue-emoji">
                {currentQuestion.emoji}
              </div>

              <p>
                {currentQuestion.hint}
              </p>

            </div>

          </section>

          {/* =================================================
              QUESTION
          ================================================= */}

          <h2 className="build-question-title">
            Complete the word
          </h2>

          {/* =================================================
              WORD SLOTS
          ================================================= */}

          <div className="build-word-slots">

            {wordLetters.map(
              (letter, index) => {

                const isMissing =
                  index ===
                  currentQuestion.missingIndex;

                let displayedLetter =
                  "";

                if (!isMissing) {
                  displayedLetter =
                    letter;
                } else if (
                  selectedLetter
                ) {
                  displayedLetter =
                    selectedLetter;
                }

                return (
                  <div
                    key={`${currentQuestion.word}-${index}`}
                    className={[
                      "build-letter-slot",

                      isMissing
                        ? "build-missing-slot"
                        : "build-filled-slot",

                      selectedLetter &&
                      isMissing
                        ? selectedLetter ===
                          currentQuestion.missingLetter
                          ? "build-correct-slot"
                          : "build-wrong-slot"
                        : "",
                    ].join(" ")}
                  >
                    {displayedLetter || "?"}
                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              INSTRUCTION
          ================================================= */}

          <div className="build-instruction">
            💡 Tap a letter to fill the empty space
          </div>

          {/* =================================================
              LETTER OPTIONS
          ================================================= */}

          <section className="build-letter-section">

            <p className="build-choose-label">
              Which letter belongs here?
            </p>

            <div className="build-letter-options">

              {currentQuestion.options.map(
                (letter) => {

                  const isSelected =
                    selectedLetter ===
                    letter;

                  const isCorrect =
                    isSelected &&
                    letter ===
                      currentQuestion.missingLetter;

                  const isWrong =
                    isSelected &&
                    letter !==
                      currentQuestion.missingLetter;

                  return (
                    <button
                      key={letter}
                      type="button"
                      className={[
                        "build-letter-button",

                        isSelected
                          ? "build-selected-letter"
                          : "",

                        isCorrect
                          ? "build-correct-letter"
                          : "",

                        isWrong
                          ? "build-wrong-letter"
                          : "",
                      ].join(" ")}
                      onClick={() =>
                        handleLetterClick(
                          letter
                        )
                      }
                      disabled={answered}
                    >
                      {letter}
                    </button>
                  );
                }
              )}

            </div>

          </section>

          {/* =================================================
              FEEDBACK
          ================================================= */}

          {message && (
            <div
              className={`build-feedback ${
                selectedLetter ===
                currentQuestion.missingLetter
                  ? "build-feedback-good"
                  : "build-feedback-wrong"
              }`}
            >
              {message}
            </div>
          )}

          {/* =================================================
              NEXT
          ================================================= */}

          {answered && (
            <button
              type="button"
              className="build-next-button"
              onClick={handleNext}
            >
              {questionIndex ===
              TOTAL_QUESTIONS - 1
                ? "🏆 Finish Game"
                : "Next Word →"}
            </button>
          )}

        </section>

      </main>

    </div>
  );
}