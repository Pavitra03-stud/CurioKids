import React, { useEffect, useMemo, useRef, useState } from "react";
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

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

function getStorageKey() {
  const userId =
    localStorage.getItem("userId") || "guest";

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

  /*
   * When the entire sentence bank has
   * been used, start a completely new
   * rotation.
   */
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

  /*
   * Safety fallback.
   */
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

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [currentSentence, setCurrentSentence] =
    useState(null);

  const [selectedWords, setSelectedWords] =
    useState([]);

  const [answered, setAnswered] =
    useState(false);

  const [feedback, setFeedback] =
    useState("");

  const [isCorrect, setIsCorrect] =
    useState(false);

  const [gameCompleted, setGameCompleted] =
    useState(false);

  const [starting, setStarting] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const restoredRef = useRef(false);

  /*
   * --------------------------------------------------
   * RESTORE / START GAME
   * --------------------------------------------------
   */
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

    /*
     * savedState is {} when there is no
     * saved game.
     */
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

      /*
       * If the previous game was already
       * completed, start a fresh game.
       */
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

  /*
   * --------------------------------------------------
   * START FRESH GAME
   * --------------------------------------------------
   */
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

  /*
   * --------------------------------------------------
   * CURRENT AVAILABLE WORDS
   * --------------------------------------------------
   *
   * If a sentence has:
   *
   * The dog is happy
   *
   * and user selects:
   *
   * The dog
   *
   * remaining buttons become:
   *
   * is happy
   */
  const availableWords = useMemo(() => {
    if (!currentSentence) {
      return [];
    }

    const usedCounts = {};

    selectedWords.forEach((word) => {
      usedCounts[word] =
        (usedCounts[word] || 0) + 1;
    });

    const result = [];

    currentSentence.shuffledWords.forEach(
      (word, index) => {
        const used =
          usedCounts[word] || 0;

        const totalAlreadyShown =
          result.filter(
            (item) =>
              item.word === word
          ).length;

        if (
          totalAlreadyShown <
          currentSentence.shuffledWords.filter(
            (item) => item === word
          ).length
        ) {
          result.push({
            word,
            originalIndex: index,
          });
        }
      }
    );

    /*
     * Remove already-selected occurrences
     * safely even when words repeat.
     */
    const remaining = [];

    const selectedCount = {};

    selectedWords.forEach((word) => {
      selectedCount[word] =
        (selectedCount[word] || 0) + 1;
    });

    const seenCount = {};

    currentSentence.shuffledWords.forEach(
      (word, index) => {
        seenCount[word] =
          (seenCount[word] || 0) + 1;

        if (
          seenCount[word] <=
          (currentSentence.shuffledWords.filter(
            (item) => item === word
          ).length -
            (selectedCount[word] || 0))
        ) {
          remaining.push({
            word,
            originalIndex: index,
          });
        }
      }
    );

    /*
     * Simpler and more reliable approach:
     * reconstruct available words from
     * counts.
     */
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

        const totalCount =
          currentSentence.shuffledWords.filter(
            (item) => item === word
          ).length;

        const selectedCountForWord =
          selectedMap[word] || 0;

        if (
          usedMap[word] >
          selectedCountForWord
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

  /*
   * --------------------------------------------------
   * SELECT WORD
   * --------------------------------------------------
   */
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

    /*
     * Save immediately so refresh does
     * not lose the built sentence.
     */
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

  /*
   * --------------------------------------------------
   * CHECK SENTENCE
   * --------------------------------------------------
   */
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

    /*
     * Save answer state first.
     */
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

    /*
     * If this is the final question,
     * complete the game.
     */
    if (
      questionIndex >=
      TOTAL_QUESTIONS - 1
    ) {
      await completeCurrentGame(
        newScore
      );
    }
  };

  /*
   * --------------------------------------------------
   * COMPLETE GAME
   * --------------------------------------------------
   */
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

      /*
       * completeGame from GameContext:
       *
       * 1. Adds stars
       * 2. Updates history
       * 3. Updates streak
       * 4. Clears active game
       */
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

  /*
   * --------------------------------------------------
   * NEXT QUESTION
   * --------------------------------------------------
   */
  const handleNext = async () => {
    if (
      !answered ||
      saving ||
      gameCompleted
    ) {
      return;
    }

    /*
     * If final question somehow reaches
     * here, complete instead.
     */
    if (
      questionIndex >=
      TOTAL_QUESTIONS - 1
    ) {
      await completeCurrentGame(score);
      return;
    }

    const nextIndex =
      questionIndex + 1;

    const nextQuestion =
      createQuestion();

    setQuestionIndex(
      nextIndex
    );

    setCurrentSentence(
      nextQuestion
    );

    setSelectedWords([]);

    setAnswered(false);

    setFeedback("");

    setIsCorrect(false);

    /*
     * IMPORTANT:
     * Save the NEW question to Firebase.
     *
     * This means refresh after clicking
     * Next will restore the new question.
     */
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

  /*
   * --------------------------------------------------
   * REMOVE LAST WORD
   * --------------------------------------------------
   */
  const handleUndo = async () => {
    if (
      answered ||
      saving ||
      selectedWords.length === 0
    ) {
      return;
    }

    const updatedWords =
      selectedWords.slice(
        0,
        -1
      );

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

  /*
   * --------------------------------------------------
   * RESET CURRENT SENTENCE
   * --------------------------------------------------
   */
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

  /*
   * --------------------------------------------------
   * LOADING
   * --------------------------------------------------
   */
  if (
    loading ||
    starting ||
    !currentSentence
  ) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.robot}>
            🤖
          </div>

          <h1 style={styles.loadingTitle}>
            Getting your words ready...
          </h1>

          <p style={styles.loadingText}>
            Your sentence adventure is
            loading ✨
          </p>

          <div style={styles.loadingDots}>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * COMPLETION SCREEN
   * --------------------------------------------------
   */
  if (gameCompleted) {
    const percentage =
      Math.round(
        (score /
          TOTAL_QUESTIONS) *
          100
      );

    return (
      <div style={styles.page}>
        <div style={styles.completionCard}>
          <div style={styles.confetti}>
            🎉 ✨ 🌟
          </div>

          <div style={styles.robotLarge}>
            🤖
          </div>

          <h1 style={styles.completionTitle}>
            Sentence Superstar!
          </h1>

          <p style={styles.completionText}>
            You finished all 5 sentences!
          </p>

          <div style={styles.scoreCircle}>
            <strong>
              {score}/{TOTAL_QUESTIONS}
            </strong>

            <span>
              {percentage}%
            </span>
          </div>

          <div style={styles.resultMessage}>
            {percentage === 100
              ? "🌟 Perfect! Amazing work!"
              : percentage >= 60
              ? "👏 Great job! Keep practising!"
              : "💚 Nice try! Let's practise some more!"}
          </div>

          <button
            style={styles.playAgainButton}
            onClick={startFreshGame}
            disabled={saving}
          >
            🚀 Play Again
          </button>
        </div>
      </div>
    );
  }

  const progress =
    ((questionIndex + 1) /
      TOTAL_QUESTIONS) *
    100;

  const builtSentence =
    selectedWords.join(" ");

  return (
    <div style={styles.page}>
      <div style={styles.backgroundStarOne}>
        ✦
      </div>

      <div style={styles.backgroundStarTwo}>
        ✨
      </div>

      <main style={styles.container}>
        {/* HEADER */}
        <section style={styles.headerCard}>
          <div style={styles.headerIcon}>
            📖
          </div>

          <div>
            <h1 style={styles.title}>
              Sentence Builder
            </h1>

            <p style={styles.subtitle}>
              Put the words in the right order!
            </p>
          </div>
        </section>

        {/* PROGRESS */}
        <section style={styles.progressCard}>
          <div style={styles.progressTop}>
            <span style={styles.progressLabel}>
              🌱 Your word adventure
            </span>

            <span style={styles.progressPercent}>
              {Math.round(progress)}%
            </span>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>

          <div style={styles.progressBottom}>
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
        <section style={styles.gameCard}>
          <div style={styles.instructionBadge}>
            💡 Build the sentence
          </div>

          <h2 style={styles.questionTitle}>
            Can you put these words
            together?
          </h2>

          <p style={styles.helperText}>
            Tap each word in the order
            that makes a sentence.
          </p>

          {/* ANSWER AREA */}
          <div style={styles.answerSection}>
            <div style={styles.answerLabel}>
              Your sentence
            </div>

            <div
              style={{
                ...styles.answerBox,
                ...(selectedWords.length === 0
                  ? styles.answerBoxEmpty
                  : {}),
              }}
            >
              {selectedWords.length ===
              0 ? (
                <span
                  style={
                    styles.placeholder
                  }
                >
                  Tap the words below to
                  start...
                </span>
              ) : (
                <div
                  style={
                    styles.selectedWords
                  }
                >
                  {selectedWords.map(
                    (word, index) => (
                      <span
                        key={`${word}-${index}`}
                        style={
                          styles.selectedWord
                        }
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
          <div style={styles.wordsSection}>
            <div style={styles.answerLabel}>
              Choose a word
            </div>

            <div style={styles.wordGrid}>
              {availableWords.map(
                (item, index) => (
                  <button
                    key={`${item.word}-${item.originalIndex}-${index}`}
                    type="button"
                    style={styles.wordButton}
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
            <div style={styles.controls}>
              <button
                type="button"
                style={
                  styles.secondaryButton
                }
                onClick={
                  handleUndo
                }
                disabled={
                  selectedWords.length ===
                    0 ||
                  saving
                }
              >
                ↩ Undo
              </button>

              <button
                type="button"
                style={
                  styles.secondaryButton
                }
                onClick={
                  handleResetWords
                }
                disabled={
                  selectedWords.length ===
                    0 ||
                  saving
                }
              >
                🔄 Clear
              </button>

              <button
                type="button"
                style={
                  styles.checkButton
                }
                onClick={
                  checkSentence
                }
                disabled={
                  selectedWords.length ===
                    0 ||
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
              style={{
                ...styles.feedback,
                ...(isCorrect
                  ? styles.feedbackCorrect
                  : styles.feedbackTry),
              }}
            >
              {feedback}

              {!isCorrect &&
                answered && (
                  <div
                    style={
                      styles.correctSentence
                    }
                  >
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
                style={
                  styles.nextButton
                }
                onClick={
                  handleNext
                }
                disabled={saving}
              >
                {questionIndex ===
                TOTAL_QUESTIONS - 1
                  ? "Finish Game 🎉"
                  : "Next Sentence →"}
              </button>
            )}

          {/* CURRENT SENTENCE */}
          {selectedWords.length >
            0 && (
            <div style={styles.preview}>
              <span>
                👀 Reading preview:
              </span>

              <strong>
                {builtSentence}
              </strong>
            </div>
          )}
        </section>

        {/* FOOTER TIP */}
        <div style={styles.tip}>
          🌈 Take your time. There is no
          rush — learning is an adventure!
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    padding: "30px 20px 50px",
    background:
      "linear-gradient(135deg, #f2fbea 0%, #e7f8df 45%, #fffbea 100%)",
    fontFamily:
      "'Nunito', 'Arial Rounded MT Bold', Arial, sans-serif",
    color: "#195c45",
    position: "relative",
    overflowX: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },

  backgroundStarOne: {
    position: "fixed",
    top: "120px",
    left: "50px",
    fontSize: "52px",
    opacity: 0.25,
    color: "#f4c94c",
    pointerEvents: "none",
  },

  backgroundStarTwo: {
    position: "fixed",
    bottom: "120px",
    right: "70px",
    fontSize: "50px",
    opacity: 0.2,
    color: "#72b957",
    pointerEvents: "none",
  },

  headerCard: {
    background: "#ffffff",
    borderRadius: "30px",
    padding: "25px 32px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 12px 35px rgba(43, 91, 65, 0.10)",
    marginBottom: "18px",
  },

  headerIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "22px",
    background: "#e7f8d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 43px)",
    fontWeight: 900,
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "5px 0 0",
    color: "#668579",
    fontSize: "17px",
    fontWeight: 700,
  },

  progressCard: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "22px",
    padding: "18px 24px",
    marginBottom: "18px",
    boxShadow:
      "0 8px 25px rgba(43, 91, 65, 0.07)",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  progressLabel: {
    fontSize: "15px",
    fontWeight: 900,
    color: "#527666",
  },

  progressPercent: {
    fontWeight: 900,
    color: "#297353",
  },

  progressTrack: {
    height: "12px",
    background: "#e5eee7",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #45b65c, #8acb43)",
    borderRadius: "20px",
    transition:
      "width 0.35s ease",
  },

  progressBottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "9px",
    fontSize: "13px",
    color: "#789387",
    fontWeight: 700,
  },

  gameCard: {
    background: "#ffffff",
    borderRadius: "34px",
    padding: "38px",
    boxShadow:
      "0 18px 50px rgba(43, 91, 65, 0.12)",
  },

  instructionBadge: {
    width: "fit-content",
    margin: "0 auto 14px",
    padding: "9px 17px",
    borderRadius: "30px",
    background: "#eff9df",
    color: "#4c8759",
    fontWeight: 900,
    fontSize: "14px",
  },

  questionTitle: {
    textAlign: "center",
    margin: "0",
    fontSize: "clamp(23px, 3vw, 32px)",
    color: "#185a43",
    fontWeight: 900,
  },

  helperText: {
    textAlign: "center",
    margin:
      "9px auto 28px",
    color: "#779084",
    fontSize: "16px",
    fontWeight: 700,
  },

  answerSection: {
    marginBottom: "28px",
  },

  answerLabel: {
    fontSize: "14px",
    fontWeight: 900,
    color: "#668579",
    marginBottom: "9px",
  },

  answerBox: {
    minHeight: "90px",
    borderRadius: "22px",
    border:
      "3px solid #d8efc9",
    background: "#fbfff9",
    padding: "17px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  answerBoxEmpty: {
    borderStyle: "dashed",
  },

  placeholder: {
    color: "#a1b4aa",
    fontSize: "17px",
    fontWeight: 700,
  },

  selectedWords: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },

  selectedWord: {
    padding: "11px 17px",
    background: "#e3f6d5",
    color: "#216648",
    borderRadius: "14px",
    fontSize: "19px",
    fontWeight: 900,
    boxShadow:
      "0 4px 10px rgba(73, 139, 75, 0.08)",
  },

  wordsSection: {
    marginBottom: "25px",
  },

  wordGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "14px",
  },

  wordButton: {
    border: "2px solid #d8edca",
    background: "#f8fff4",
    color: "#1d6349",
    borderRadius: "18px",
    padding: "17px 12px",
    fontSize: "19px",
    fontWeight: 900,
    cursor: "pointer",
    minHeight: "62px",
    transition:
      "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
  },

  controls: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "5px",
  },

  secondaryButton: {
    border: "2px solid #dcebdc",
    background: "#ffffff",
    color: "#527666",
    borderRadius: "16px",
    padding: "13px 20px",
    fontSize: "15px",
    fontWeight: 900,
    cursor: "pointer",
  },

  checkButton: {
    border: "none",
    background:
      "linear-gradient(135deg, #48b45b, #7cc843)",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow:
      "0 8px 18px rgba(72, 180, 91, 0.25)",
  },

  feedback: {
    marginTop: "22px",
    padding: "18px",
    borderRadius: "18px",
    textAlign: "center",
    fontSize: "17px",
    fontWeight: 900,
  },

  feedbackCorrect: {
    background: "#e8f8dd",
    color: "#287046",
  },

  feedbackTry: {
    background: "#fff6dd",
    color: "#876827",
  },

  correctSentence: {
    marginTop: "8px",
    fontSize: "15px",
  },

  nextButton: {
    display: "block",
    width: "100%",
    marginTop: "20px",
    border: "none",
    borderRadius: "18px",
    padding: "17px",
    background:
      "linear-gradient(135deg, #1d694d, #398d61)",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow:
      "0 9px 22px rgba(29, 105, 77, 0.2)",
  },

  preview: {
    marginTop: "20px",
    padding: "14px 18px",
    borderRadius: "16px",
    background: "#f5f9f3",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    textAlign: "center",
    color: "#779084",
    fontSize: "13px",
  },

  tip: {
    textAlign: "center",
    marginTop: "18px",
    color: "#668579",
    fontSize: "14px",
    fontWeight: 700,
  },

  loadingCard: {
    width: "min(520px, 90%)",
    margin: "100px auto",
    background: "#ffffff",
    borderRadius: "32px",
    padding: "50px 30px",
    textAlign: "center",
    boxShadow:
      "0 18px 50px rgba(43, 91, 65, 0.12)",
  },

  robot: {
    fontSize: "70px",
    marginBottom: "15px",
  },

  loadingTitle: {
    margin: 0,
    color: "#195c45",
    fontSize: "28px",
    fontWeight: 900,
  },

  loadingText: {
    color: "#789387",
    fontSize: "16px",
    fontWeight: 700,
  },

  loadingDots: {
    display: "flex",
    justifyContent: "center",
    gap: "7px",
    fontSize: "30px",
    color: "#6abd53",
  },

  completionCard: {
    width: "min(600px, 92%)",
    margin: "70px auto",
    background: "#ffffff",
    borderRadius: "35px",
    padding: "45px 30px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(43, 91, 65, 0.14)",
  },

  confetti: {
    fontSize: "28px",
    marginBottom: "10px",
  },

  robotLarge: {
    fontSize: "70px",
  },

  completionTitle: {
    margin: "10px 0 5px",
    fontSize: "34px",
    color: "#195c45",
    fontWeight: 900,
  },

  completionText: {
    color: "#789387",
    fontSize: "17px",
    fontWeight: 700,
  },

  scoreCircle: {
    width: "135px",
    height: "135px",
    borderRadius: "50%",
    margin: "25px auto",
    background:
      "linear-gradient(135deg, #e4f7d8, #f7ffe9)",
    border: "8px solid #d5efc6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#23694c",
  },

  resultMessage: {
    padding: "14px",
    borderRadius: "16px",
    background: "#f5faef",
    color: "#4e765f",
    fontWeight: 800,
    marginBottom: "22px",
  },

  playAgainButton: {
    width: "100%",
    border: "none",
    borderRadius: "18px",
    padding: "17px",
    background:
      "linear-gradient(135deg, #43ad58, #82c943)",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(67, 173, 88, 0.25)",
  },
};