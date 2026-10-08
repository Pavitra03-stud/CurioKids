import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "../styles/SentenceBuilder.css";
import useGameProgress from "../hooks/useGameProgress";

import sentenceBank from "../data/sentenceBank";

const GAME_ID = "sentence-builder";
const GAME_NAME = "Sentence Builder";
const TOTAL_QUESTIONS = 5;

const initialGameState = {
  questionIndex: 0,
  score: 0,
  currentSentence: null,
  selectedWords: [],
  answered: false,
  completed: false,
};

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

/* =========================================================
   SENTENCE ROTATION
========================================================= */

function getStorageKey() {
  const userId =
    localStorage.getItem("userId") ||
    "guest";

  return `sentence-builder-used-${userId}`;
}

function getUsedSentenceIndexes() {
  try {
    const saved = localStorage.getItem(
      getStorageKey()
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Could not read sentence rotation:",
      error
    );

    return [];
  }
}

function saveUsedSentenceIndexes(indexes) {
  try {
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify(indexes)
    );
  } catch (error) {
    console.error(
      "Could not save sentence rotation:",
      error
    );
  }
}

function getNextSentence() {
  let usedIndexes =
    getUsedSentenceIndexes();

  if (
    usedIndexes.length >=
    sentenceBank.length
  ) {
    usedIndexes = [];
  }

  const availableIndexes =
    sentenceBank
      .map((_, index) => index)
      .filter(
        (index) =>
          !usedIndexes.includes(index)
      );

  if (availableIndexes.length === 0) {
    usedIndexes = [];

    saveUsedSentenceIndexes([]);

    return getNextSentence();
  }

  const randomPosition =
    Math.floor(
      Math.random() *
        availableIndexes.length
    );

  const selectedIndex =
    availableIndexes[randomPosition];

  usedIndexes.push(selectedIndex);

  saveUsedSentenceIndexes(
    usedIndexes
  );

  const sentence =
    sentenceBank[selectedIndex];

  return {
    id: selectedIndex,
    words: [...sentence.words],
    shuffledWords: shuffleArray(
      sentence.words
    ),
    correctAnswer: sentence.answer,
  };
}

function createQuestion() {
  return getNextSentence();
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SentenceBuilder() {
  const {
    savedState,
    loading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialGameState
  );

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const [score, setScore] =
    useState(0);

  const [
    currentSentence,
    setCurrentSentence,
  ] = useState(null);

  const [
    selectedWords,
    setSelectedWords,
  ] = useState([]);

  const [answered, setAnswered] =
    useState(false);

  const [feedback, setFeedback] =
    useState("");

  const [isCorrect, setIsCorrect] =
    useState(false);

  const [
    gameCompleted,
    setGameCompleted,
  ] = useState(false);

  const [starting, setStarting] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const restoredRef = useRef(false);

  /* =========================================================
     RESTORE / START
  ========================================================= */

  useEffect(() => {
    if (loading) {
      return;
    }

    if (restoredRef.current) {
      return;
    }

    restoredRef.current = true;

    console.log(
      "🧩 Sentence Builder restore:",
      savedState
    );

    const hasSavedGame =
      savedState &&
      Object.keys(savedState).length > 0 &&
      savedState.currentSentence;

    if (hasSavedGame) {
      console.log(
        "🔄 Resuming Sentence Builder:",
        savedState
      );

      setQuestionIndex(
        Number(
          savedState.questionIndex || 0
        )
      );

      setScore(
        Number(savedState.score || 0)
      );

      setCurrentSentence(
        savedState.currentSentence
      );

      setSelectedWords(
        Array.isArray(
          savedState.selectedWords
        )
          ? savedState.selectedWords
          : []
      );

      setAnswered(
        Boolean(savedState.answered)
      );

      if (savedState.completed) {
        startFreshGame();
      } else {
        setStarting(false);
      }

      return;
    }

    console.log(
      "🆕 Starting new Sentence Builder game"
    );

    startFreshGame();
  }, [loading, savedState]);

  /* =========================================================
     START FRESH GAME
  ========================================================= */

  const startFreshGame = async () => {
    const firstQuestion =
      createQuestion();

    setQuestionIndex(0);
    setScore(0);
    setCurrentSentence(
      firstQuestion
    );
    setSelectedWords([]);
    setAnswered(false);
    setFeedback("");
    setIsCorrect(false);
    setGameCompleted(false);
    setStarting(false);

    try {
      await save({
        questionIndex: 0,
        score: 0,
        currentSentence:
          firstQuestion,
        selectedWords: [],
        answered: false,
        completed: false,
      });

      console.log(
        "💾 First Sentence Builder question saved"
      );
    } catch (error) {
      console.error(
        "Failed to save first question:",
        error
      );
    }
  };

  /* =========================================================
     AVAILABLE WORDS
  ========================================================= */

  const availableWords = useMemo(() => {
    if (!currentSentence) {
      return [];
    }

    const selectedMap = {};

    selectedWords.forEach((word) => {
      selectedMap[word] =
        (selectedMap[word] || 0) + 1;
    });

    const usedMap = {};
    const finalResult = [];

    currentSentence.shuffledWords.forEach(
      (word, index) => {
        usedMap[word] =
          (usedMap[word] || 0) + 1;

        const selectedCount =
          selectedMap[word] || 0;

        if (
          usedMap[word] >
          selectedCount
        ) {
          finalResult.push({
            word,
            originalIndex: index,
          });
        }
      }
    );

    return finalResult;
  }, [
    currentSentence,
    selectedWords,
  ]);

  /* =========================================================
     SELECT WORD
  ========================================================= */

  const handleWordClick = async (
    word
  ) => {
    if (
      answered ||
      saving ||
      gameCompleted
    ) {
      return;
    }

    const newSelectedWords = [
      ...selectedWords,
      word,
    ];

    setSelectedWords(
      newSelectedWords
    );

    try {
      await save({
        questionIndex,
        score,
        currentSentence,
        selectedWords:
          newSelectedWords,
        answered: false,
        completed: false,
      });
    } catch (error) {
      console.error(
        "Failed to save selected word:",
        error
      );
    }
  };

  /* =========================================================
     CHECK SENTENCE
  ========================================================= */

  const checkSentence = async () => {
    if (
      answered ||
      !currentSentence ||
      saving
    ) {
      return;
    }

    if (
      selectedWords.length !==
      currentSentence.words.length
    ) {
      setFeedback(
        "✨ Choose all the words first!"
      );

      setIsCorrect(false);

      return;
    }

    const builtSentence =
      selectedWords.join(" ");

    const correctSentence =
      currentSentence.correctAnswer;

    const correct =
      builtSentence ===
      correctSentence;

    console.log(
      "📝 Built:",
      builtSentence
    );

    console.log(
      "✅ Correct:",
      correctSentence
    );

    setAnswered(true);
    setIsCorrect(correct);

    const newScore = correct
      ? score + 1
      : score;

    setScore(newScore);

    if (correct) {
      setFeedback(
        "🎉 Wonderful! You built the sentence!"
      );
    } else {
      setFeedback(
        `💡 Almost! The sentence is "${correctSentence}".`
      );
    }

    try {
      await save({
        questionIndex,
        score: newScore,
        currentSentence,
        selectedWords,
        answered: true,
        completed:
          questionIndex >=
          TOTAL_QUESTIONS - 1,
      });
    } catch (error) {
      console.error(
        "Failed to save answer:",
        error
      );
    }

    if (
      questionIndex >=
      TOTAL_QUESTIONS - 1
    ) {
      await completeCurrentGame(
        newScore
      );
    }
  };

  /* =========================================================
     COMPLETE GAME
  ========================================================= */

  const completeCurrentGame = async (
    finalScore
  ) => {
    setSaving(true);

    try {
      const percentage =
        Math.round(
          (finalScore /
            TOTAL_QUESTIONS) *
            100
        );

      console.log(
        "🏁 Sentence Builder completed:",
        {
          score: finalScore,
          percentage,
        }
      );

      await finish(
        percentage,
        GAME_NAME
      );

      console.log(
        "⭐ Sentence Builder Firebase completion saved"
      );

      setGameCompleted(true);
    } catch (error) {
      console.error(
        "Failed to complete Sentence Builder:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     NEXT QUESTION
  ========================================================= */

  const handleNext = async () => {
    if (
      !answered ||
      saving ||
      gameCompleted
    ) {
      return;
    }

    if (
      questionIndex >=
      TOTAL_QUESTIONS - 1
    ) {
      await completeCurrentGame(
        score
      );

      return;
    }

    const nextIndex =
      questionIndex + 1;

    const nextQuestion =
      createQuestion();

    setQuestionIndex(nextIndex);

    setCurrentSentence(
      nextQuestion
    );

    setSelectedWords([]);
    setAnswered(false);
    setFeedback("");
    setIsCorrect(false);

    try {
      await save({
        questionIndex:
          nextIndex,
        score,
        currentSentence:
          nextQuestion,
        selectedWords: [],
        answered: false,
        completed: false,
      });

      console.log(
        "➡️ Next Sentence Builder question saved"
      );
    } catch (error) {
      console.error(
        "Failed to save next question:",
        error
      );
    }
  };

  /* =========================================================
     UNDO
  ========================================================= */

  const handleUndo = async () => {
    if (
      answered ||
      saving ||
      selectedWords.length === 0
    ) {
      return;
    }

    const updatedWords =
      selectedWords.slice(0, -1);

    setSelectedWords(
      updatedWords
    );

    try {
      await save({
        questionIndex,
        score,
        currentSentence,
        selectedWords:
          updatedWords,
        answered: false,
        completed: false,
      });
    } catch (error) {
      console.error(
        "Failed to save undo:",
        error
      );
    }
  };

  /* =========================================================
     CLEAR WORDS
  ========================================================= */

  const handleResetWords = async () => {
    if (
      answered ||
      saving
    ) {
      return;
    }

    setSelectedWords([]);
    setFeedback("");

    try {
      await save({
        questionIndex,
        score,
        currentSentence,
        selectedWords: [],
        answered: false,
        completed: false,
      });
    } catch (error) {
      console.error(
        "Failed to save reset:",
        error
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    loading ||
    starting ||
    !currentSentence
  ) {
    return (
      <div className="sentence-page">

        <nav className="sentence-navbar">
          <div className="sentence-brand">
            🌿 CurioKids
          </div>

          <div className="sentence-game-title">
            📖 Sentence Builder
          </div>
        </nav>

        <main className="sentence-main">
          <div className="sentence-loading-card">

            <div className="loading-character">
              🤖
            </div>

            <h1>
              Getting your words ready...
            </h1>

            <p>
              Your sentence adventure is
              loading ✨
            </p>

            <div className="loading-dots">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>

          </div>
        </main>

      </div>
    );
  }

  /* =========================================================
     COMPLETION
  ========================================================= */

  if (gameCompleted) {
    const percentage =
      Math.round(
        (score /
          TOTAL_QUESTIONS) *
          100
      );

    return (
      <div className="sentence-page">

        <nav className="sentence-navbar">
          <div className="sentence-brand">
            🌿 CurioKids
          </div>

          <div className="sentence-game-title">
            📖 Sentence Builder
          </div>
        </nav>

        <main className="sentence-main">

          <div className="sentence-completion-card">

            <div className="confetti">
              🎉 ✨ 🌟
            </div>

            <div className="completion-character">
              🤖
            </div>

            <h1>
              Sentence Superstar!
            </h1>

            <p className="completion-text">
              You finished all 5 sentences!
            </p>

            <div className="sentence-score-circle">

              <strong>
                {score}/{TOTAL_QUESTIONS}
              </strong>

              <span>
                {percentage}%
              </span>

            </div>

            <div className="result-message">
              {percentage === 100
                ? "🌟 Perfect! Amazing work!"
                : percentage >= 60
                ? "👏 Great job! Keep practising!"
                : "💚 Nice try! Let's practise some more!"}
            </div>

            <button
              className="play-again-button"
              onClick={startFreshGame}
              disabled={saving}
            >
              🚀 Play Again
            </button>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     GAME DATA
  ========================================================= */

  const progress =
    ((questionIndex + 1) /
      TOTAL_QUESTIONS) *
    100;

  const builtSentence =
    selectedWords.join(" ");

  /* =========================================================
     GAME UI
  ========================================================= */

  return (
    <div className="sentence-page">

      {/* NAVBAR */}

      <nav className="sentence-navbar">

        <div className="sentence-brand">
          🌿 CurioKids
        </div>

        <div className="sentence-game-title">
          📖 Sentence Builder
        </div>

      </nav>

      <main className="sentence-main">

        {/* HEADER */}

        <section className="sentence-header-card">

          <div className="sentence-header-icon">
            📖
          </div>

          <div>
            <h1>
              Sentence Builder
            </h1>

            <p>
              Put the words in the right order!
            </p>
          </div>

        </section>

        {/* PROGRESS */}

        <section className="sentence-progress-card">

          <div className="progress-top">

            <span>
              🌱 Your word adventure
            </span>

            <span>
              {Math.round(progress)}%
            </span>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="progress-bottom">

            <span>
              Question{" "}
              {questionIndex + 1} of{" "}
              {TOTAL_QUESTIONS}
            </span>

            <span>
              ⭐ {score} correct
            </span>

          </div>

        </section>

        {/* GAME CARD */}

        <section className="sentence-game-card">

          <div className="instruction-badge">
            💡 Build the sentence
          </div>

          <h2>
            Can you put these words
            together?
          </h2>

          <p className="helper-text">
            Tap each word in the order
            that makes a sentence.
          </p>

          {/* ANSWER AREA */}

          <div className="answer-section">

            <div className="section-label">
              Your sentence
            </div>

            <div
              className={`answer-box ${
                selectedWords.length === 0
                  ? "answer-box-empty"
                  : ""
              }`}
            >

              {selectedWords.length === 0 ? (
                <span className="placeholder">
                  Tap the words below to
                  start...
                </span>
              ) : (
                <div className="selected-words">

                  {selectedWords.map(
                    (word, index) => (
                      <span
                        key={`${word}-${index}`}
                        className="selected-word"
                      >
                        {word}
                      </span>
                    )
                  )}

                </div>
              )}

            </div>

          </div>

          {/* WORD OPTIONS */}

          <div className="words-section">

            <div className="section-label">
              Choose a word
            </div>

            <div className="word-grid">

              {availableWords.map(
                (item, index) => (
                  <button
                    key={`${item.word}-${item.originalIndex}-${index}`}
                    type="button"
                    className="word-button"
                    onClick={() =>
                      handleWordClick(
                        item.word
                      )
                    }
                    disabled={
                      answered ||
                      saving
                    }
                  >
                    {item.word}
                  </button>
                )
              )}

            </div>

          </div>

          {/* CONTROLS */}

          {!answered && (
            <div className="sentence-controls">

              <button
                type="button"
                className="secondary-button"
                onClick={handleUndo}
                disabled={
                  selectedWords.length === 0 ||
                  saving
                }
              >
                ↩ Undo
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleResetWords}
                disabled={
                  selectedWords.length === 0 ||
                  saving
                }
              >
                🔄 Clear
              </button>

              <button
                type="button"
                className="check-button"
                onClick={checkSentence}
                disabled={
                  selectedWords.length === 0 ||
                  saving
                }
              >
                ✨ Check
              </button>

            </div>
          )}

          {/* FEEDBACK */}

          {feedback && (
            <div
              className={`sentence-feedback ${
                isCorrect
                  ? "feedback-correct"
                  : "feedback-try"
              }`}
            >

              {feedback}

              {!isCorrect &&
                answered && (
                  <div className="correct-sentence">
                    Correct sentence:
                    <strong>
                      {" "}
                      {
                        currentSentence.correctAnswer
                      }
                    </strong>
                  </div>
                )}

            </div>
          )}

          {/* NEXT */}

          {answered &&
            !gameCompleted && (
              <button
                type="button"
                className="next-sentence-button"
                onClick={handleNext}
                disabled={saving}
              >
                {questionIndex ===
                TOTAL_QUESTIONS - 1
                  ? "Finish Game 🎉"
                  : "Next Sentence →"}
              </button>
            )}

          {/* PREVIEW */}

          {selectedWords.length > 0 && (
            <div className="sentence-preview">

              <span>
                👀 Reading preview:
              </span>

              <strong>
                {builtSentence}
              </strong>

            </div>
          )}

        </section>

        {/* TIP */}

        <div className="sentence-tip">
          🌈 Take your time. There is no
          rush — learning is an adventure!
        </div>

      </main>

    </div>
  );
}