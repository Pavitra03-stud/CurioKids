import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import useGameProgress from "../hooks/useGameProgress";
import "../styles/PatternMatching.css";

const TOTAL_QUESTIONS = 5;

/* =========================================================
   QUESTION POOLS
========================================================= */

const LETTER_QUESTIONS = [
  {
    pattern: ["A", "B", "A", "B", "?"],
    answer: "A",
    options: ["A", "C", "D"],
  },
  {
    pattern: ["C", "C", "D", "D", "?"],
    answer: "E",
    options: ["E", "F", "B"],
  },
  {
    pattern: ["F", "G", "F", "G", "?"],
    answer: "F",
    options: ["F", "H", "J"],
  },
  {
    pattern: ["J", "K", "L", "J", "K", "?"],
    answer: "L",
    options: ["L", "M", "N"],
  },
  {
    pattern: ["P", "Q", "P", "Q", "?"],
    answer: "P",
    options: ["P", "R", "S"],
  },
  {
    pattern: ["R", "R", "S", "S", "?"],
    answer: "T",
    options: ["T", "U", "Q"],
  },
  {
    pattern: ["W", "X", "Y", "W", "X", "?"],
    answer: "Y",
    options: ["Y", "Z", "V"],
  },
  {
    pattern: ["B", "D", "B", "D", "?"],
    answer: "B",
    options: ["B", "C", "E"],
  },
  {
    pattern: ["H", "I", "J", "H", "I", "?"],
    answer: "J",
    options: ["J", "K", "L"],
  },
  {
    pattern: ["M", "N", "O", "M", "N", "?"],
    answer: "O",
    options: ["O", "P", "Q"],
  },
  {
    pattern: ["T", "U", "T", "U", "?"],
    answer: "T",
    options: ["T", "V", "W"],
  },
  {
    pattern: ["D", "E", "F", "D", "E", "?"],
    answer: "F",
    options: ["F", "G", "H"],
  },
];

const NUMBER_QUESTIONS = [
  {
    pattern: ["1", "2", "1", "2", "?"],
    answer: "1",
    options: ["1", "3", "4"],
  },
  {
    pattern: ["3", "3", "4", "4", "?"],
    answer: "5",
    options: ["5", "6", "2"],
  },
  {
    pattern: ["5", "6", "5", "6", "?"],
    answer: "5",
    options: ["5", "7", "8"],
  },
  {
    pattern: ["2", "4", "6", "2", "4", "?"],
    answer: "6",
    options: ["6", "8", "3"],
  },
  {
    pattern: ["7", "8", "7", "8", "?"],
    answer: "7",
    options: ["7", "9", "6"],
  },
  {
    pattern: ["1", "1", "2", "2", "?"],
    answer: "3",
    options: ["3", "4", "5"],
  },
  {
    pattern: ["4", "5", "6", "4", "5", "?"],
    answer: "6",
    options: ["6", "7", "8"],
  },
  {
    pattern: ["8", "9", "8", "9", "?"],
    answer: "8",
    options: ["8", "7", "6"],
  },
  {
    pattern: ["2", "3", "4", "2", "3", "?"],
    answer: "4",
    options: ["4", "5", "6"],
  },
  {
    pattern: ["6", "6", "7", "7", "?"],
    answer: "8",
    options: ["8", "9", "5"],
  },
  {
    pattern: ["3", "5", "3", "5", "?"],
    answer: "3",
    options: ["3", "4", "6"],
  },
  {
    pattern: ["4", "5", "4", "5", "?"],
    answer: "4",
    options: ["4", "6", "7"],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createRoundQuestions(pool) {
  return shuffle(pool)
    .slice(0, TOTAL_QUESTIONS)
    .map((question) => ({
      pattern: [...question.pattern],
      answer: question.answer,
      options: shuffle(question.options),
    }));
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PatternMatching() {
  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const mode =
    query.get("mode") === "numbers"
      ? "numbers"
      : "letters";

  const GAME_ID = `pattern-matching-${mode}`;

  const pool = useMemo(
    () =>
      mode === "numbers"
        ? NUMBER_QUESTIONS
        : LETTER_QUESTIONS,
    [mode]
  );

  const initialState = {
    questions: [],
    questionIndex: 0,
    score: 0,
    selected: "",
    completed: false,
  };

  /* =========================================================
     FIREBASE GAME PROGRESS
  ========================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, initialState);

  /* =========================================================
     STATE
  ========================================================= */

  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");

  const [gameReady, setGameReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [processing, setProcessing] = useState(false);

  /* =========================================================
     CURRENT QUESTION
  ========================================================= */

  const currentQuestion =
    questions[questionIndex];

  /* =========================================================
     RESTORE / START
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;

    if (
      savedState &&
      savedState.questions?.length > 0 &&
      savedState.questionIndex !== undefined
    ) {
      console.log(
        "🔄 Restoring Pattern Matching:",
        savedState
      );

      setQuestions(savedState.questions);
      setQuestionIndex(
        savedState.questionIndex || 0
      );
      setScore(savedState.score || 0);
      setSelected("");
      setCompleted(
        Boolean(savedState.completed)
      );

      setGameReady(true);

      return;
    }

    /* =====================================================
       NEW GAME
    ===================================================== */

    const newQuestions =
      createRoundQuestions(pool);

    console.log(
      "🧠 New Pattern Matching round:",
      newQuestions
    );

    setQuestions(newQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelected("");
    setMessage("");
    setCompleted(false);

    setGameReady(true);

    // Save in background.
    save({
      questions: newQuestions,
      questionIndex: 0,
      score: 0,
      selected: "",
      completed: false,
    });
  }, [progressLoading, savedState, pool]);

  /* =========================================================
     SAVE RESULT
  ========================================================= */

  const saveGameResult = async (finalScore) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        console.warn(
          "⚠️ No userId found. Result not saved."
        );
        return;
      }

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) * 100;

      const userRef = doc(
        db,
        "users",
        userId
      );

      const resultsRef = collection(
        userRef,
        "game_results"
      );

      await addDoc(resultsRef, {
        game: `PatternMatching_${mode}`,
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: Number(accuracy.toFixed(2)),
        mode,
        createdAt: Timestamp.now(),
      });

      console.log(
        "✅ Pattern Matching result saved"
      );
    } catch (error) {
      console.error(
        "❌ Pattern result save failed:",
        error
      );
    }
  };

  /* =========================================================
     ANSWER
  ========================================================= */

  const handleAnswer = async (option) => {
    if (
      processing ||
      completed ||
      !currentQuestion
    ) {
      return;
    }

    setProcessing(true);
    setSelected(option);

    const isCorrect =
      option === currentQuestion.answer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setScore(updatedScore);

    setMessage(
      isCorrect
        ? "🎉 Correct! Amazing thinking!"
        : `💡 Nice try! The answer is ${currentQuestion.answer}.`
    );

    const isLast =
      questionIndex ===
      TOTAL_QUESTIONS - 1;

    /* =====================================================
       LAST QUESTION
    ===================================================== */

    if (isLast) {
      const percentage =
        (updatedScore / TOTAL_QUESTIONS) * 100;

      // Save result first.
      await saveGameResult(updatedScore);

      // Save completion state BEFORE finish().
      await save({
        questions,
        questionIndex,
        score: updatedScore,
        selected: option,
        completed: true,
      });

      // ⭐ Adds stars + clears active game.
      await finish(
        percentage,
        `Pattern Matching (${mode})`
      );

      setTimeout(() => {
        setCompleted(true);
        setProcessing(false);
      }, 650);

      return;
    }

    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    const nextIndex =
      questionIndex + 1;

    await save({
      questions,
      questionIndex: nextIndex,
      score: updatedScore,
      selected: "",
      completed: false,
    });

    setTimeout(() => {
      setQuestionIndex(nextIndex);
      setSelected("");
      setMessage("");
      setProcessing(false);
    }, 650);
  };

  /* =========================================================
     PLAY AGAIN
  ========================================================= */

  const playAgain = async () => {
    const newQuestions =
      createRoundQuestions(pool);

    setQuestions(newQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelected("");
    setMessage("");
    setCompleted(false);
    setProcessing(false);

    await save({
      questions: newQuestions,
      questionIndex: 0,
      score: 0,
      selected: "",
      completed: false,
    });
  };

  /* =========================================================
     PERFORMANCE
  ========================================================= */

  const getPerformanceMessage = () => {
    if (score === 5) {
      return "🌟 Pattern Superstar!";
    }

    if (score >= 4) {
      return "🎉 Excellent pattern spotting!";
    }

    if (score >= 3) {
      return "👏 Great thinking!";
    }

    if (score >= 2) {
      return "💪 Keep practicing!";
    }

    return "🌱 Every pattern helps you learn!";
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (progressLoading || !gameReady) {
    return (
      <div className="pattern-page">
        <div className="pattern-loading">

          <div className="pattern-loading-icon">
            🧠
          </div>

          <h2>
            Getting your puzzle ready...
          </h2>

          <p>
            Your pattern adventure is starting ✨
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     COMPLETED
  ========================================================= */

  if (completed) {
    const percentage = Math.round(
      (score / TOTAL_QUESTIONS) * 100
    );

    return (
      <div className="pattern-page">

        <div className="pattern-complete">

          <div className="pattern-complete-icon">
            {percentage === 100
              ? "🏆"
              : percentage >= 60
                ? "🌟"
                : "🌱"}
          </div>

          <h1>
            Pattern Adventure Complete!
          </h1>

          <p>
            You did a wonderful job spotting
            the patterns.
          </p>

          <div className="pattern-result">

            <div>
              <strong>
                {score}/{TOTAL_QUESTIONS}
              </strong>

              <span>
                Score
              </span>
            </div>

            <div>
              <strong>
                {percentage}%
              </strong>

              <span>
                Accuracy
              </span>
            </div>

          </div>

          <div className="pattern-stars">
            {percentage >= 90
              ? "⭐⭐⭐"
              : percentage >= 70
                ? "⭐⭐"
                : "⭐"}
          </div>

          <div className="pattern-performance">
            {getPerformanceMessage()}
          </div>

          <button
            className="pattern-play-again"
            onClick={playAgain}
          >
            🔄 Play Again
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="pattern-page">

      <div className="pattern-decoration pattern-star">
        ⭐
      </div>

      <div className="pattern-decoration pattern-brain">
        🧠
      </div>

      <main className="pattern-container">

        {/* HEADER */}

        <header className="pattern-header">

          <div className="pattern-icon">
            🧠
          </div>

          <div>
            <h1>
              Pattern Matching
            </h1>

            <p>
              {mode === "numbers"
                ? "Look at the numbers and discover what comes next!"
                : "Look at the letters and discover what comes next!"}
            </p>
          </div>

        </header>

        {/* STATS */}

        <section className="pattern-stats">

          <div className="pattern-stat">

            <div className="pattern-stat-icon">
              🧩
            </div>

            <div>
              <small>
                QUESTION
              </small>

              <strong>
                {questionIndex + 1}
                <span>
                  /{TOTAL_QUESTIONS}
                </span>
              </strong>
            </div>

          </div>

          <div className="pattern-stat">

            <div className="pattern-stat-icon">
              ⭐
            </div>

            <div>
              <small>
                SCORE
              </small>

              <strong>
                {score}
              </strong>
            </div>

          </div>

        </section>

        {/* PROGRESS */}

        <section className="pattern-progress">

          <div className="pattern-progress-top">

            <span>
              Your puzzle journey
            </span>

            <strong>
              {Math.round(
                ((questionIndex) /
                  TOTAL_QUESTIONS) *
                  100
              )}
              %
            </strong>

          </div>

          <div className="pattern-progress-track">

            <div
              className="pattern-progress-fill"
              style={{
                width: `${
                  (questionIndex /
                    TOTAL_QUESTIONS) *
                  100
                }%`,
              }}
            />

          </div>

        </section>

        {/* GAME */}

        <section className="pattern-game">

          <div className="pattern-badge">
            👀 Look carefully!
          </div>

          <h2>
            What comes next?
          </h2>

          <p className="pattern-instruction">
            Find the pattern and choose
            the missing item.
          </p>

          {/* PATTERN */}

          <div className="pattern-row">

            {currentQuestion?.pattern.map(
              (item, index) => (

                <div
                  key={`${item}-${index}`}
                  className={
                    item === "?"
                      ? "pattern-box pattern-question"
                      : "pattern-box"
                  }
                >
                  {item}
                </div>

              )
            )}

          </div>

          {/* OPTIONS */}

          <h3>
            Choose your answer
          </h3>

          <div className="pattern-options">

            {currentQuestion?.options.map(
              (option, index) => {

                const isSelected =
                  selected === option;

                const isCorrect =
                  isSelected &&
                  option ===
                    currentQuestion.answer;

                const isWrong =
                  isSelected &&
                  option !==
                    currentQuestion.answer;

                return (
                  <button
                    key={`${option}-${index}`}
                    className={`
                      pattern-option
                      ${isCorrect ? "correct" : ""}
                      ${isWrong ? "wrong" : ""}
                    `}
                    onClick={() =>
                      handleAnswer(option)
                    }
                    disabled={
                      processing ||
                      Boolean(selected)
                    }
                  >
                    {option}
                  </button>
                );
              }
            )}

          </div>

          {/* MESSAGE */}

          <div className="pattern-message">

            {message ? (
              <p>
                {message}
              </p>
            ) : (
              <p>
                💡 Take your time and look
                for the repeating pattern.
              </p>
            )}

          </div>

        </section>

        {/* TIP */}

        <section className="pattern-tip">

          <div>
            💡
          </div>

          <div>
            <strong>
              Pattern detective tip
            </strong>

            <p>
              Look for things that repeat,
              alternate, or follow a sequence.
            </p>
          </div>

        </section>

      </main>

    </div>
  );
}