import { useEffect, useState } from "react";
import "../styles/FindCorrectLetter.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// ✅ Game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "find-correct-letter";
const TOTAL_QUESTIONS = 5;

const LETTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const INITIAL_STATE = {
  targetLetter: "",
  options: [],
  feedback: "",
  score: 0,
  questionCount: 0,
  completed: false,
};

export default function FindCorrectLetter() {

  // =========================================================
  // GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );

  // =========================================================
  // STATES
  // =========================================================

  const [targetLetter, setTargetLetter] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [gameFinished, setGameFinished] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // =========================================================
  // QUESTION GENERATOR
  // =========================================================

  const generateQuestion = () => {

    if (
      !LETTERS ||
      LETTERS.length === 0
    ) {
      return {
        question: "A",
        options: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ],
      };
    }

    const correct =
      LETTERS[
        Math.floor(
          Math.random() *
            LETTERS.length
        )
      ];

    const wrong = LETTERS
      .filter(
        (letter) =>
          letter !== correct
      )
      .sort(
        () =>
          0.5 - Math.random()
      )
      .slice(0, 5);

    const generatedOptions = [
      ...wrong,
      correct,
    ].sort(
      () =>
        0.5 - Math.random()
    );

    return {
      question: correct,
      options: generatedOptions,
    };
  };

  // =========================================================
  // LOAD QUESTION
  // =========================================================

  const loadNewQuestion = async (
    shouldSave = false,
    currentScore = score,
    currentQuestionCount =
      questionCount
  ) => {

    const q =
      generateQuestion();

    if (
      !q.question ||
      !q.options ||
      q.options.length === 0
    ) {

      setTargetLetter("A");

      setOptions([
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ]);

      return {
        targetLetter: "A",
        options: [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ],
      };
    }

    setTargetLetter(
      q.question
    );

    setOptions(
      q.options
    );

    if (shouldSave) {
      await save({
        targetLetter:
          q.question,

        options:
          q.options,

        feedback: "",

        score:
          currentScore,

        questionCount:
          currentQuestionCount,

        completed: false,
      });
    }

    return {
      targetLetter:
        q.question,

      options:
        q.options,
    };
  };

  // =========================================================
  // RESTORE PROGRESS
  // =========================================================

  useEffect(() => {

    if (progressLoading) return;

    if (restored) return;

    console.log(
      "🔥 Find Correct Letter saved state:",
      savedState
    );

    if (savedState) {

      setTargetLetter(
        savedState.targetLetter ?? ""
      );

      setOptions(
        savedState.options ?? []
      );

      setFeedback(
        savedState.feedback ?? ""
      );

      setScore(
        savedState.score ?? 0
      );

      setQuestionCount(
        savedState.questionCount ?? 0
      );

      setGameFinished(
        savedState.completed ?? false
      );

      // Safety: if no saved question,
      // generate one.
      if (
        !savedState.targetLetter ||
        !savedState.options?.length
      ) {
        loadNewQuestion();
      }

    } else {

      loadNewQuestion();

    }

    setRestored(true);

  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore =
    async (finalScore) => {

      try {

        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) return;

        const gameResultsRef =
          collection(
            db,
            "users",
            userId,
            "game_results"
          );

        const accuracy =
          (finalScore /
            TOTAL_QUESTIONS) *
          100;

        await addDoc(
          gameResultsRef,
          {
            score:
              finalScore,

            totalQuestions:
              TOTAL_QUESTIONS,

            accuracy:
              accuracy.toFixed(2),

            createdAt:
              Timestamp.now(),

            game:
              "FindCorrectLetter",
          }
        );

        console.log(
          "✅ Find Correct Letter result saved"
        );

      } catch (error) {

        console.error(
          "❌ Error saving result:",
          error
        );

      }
    };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = async (
    letter
  ) => {

    if (processing) return;

    if (gameFinished) return;

    if (
      questionCount >=
      TOTAL_QUESTIONS
    ) {
      return;
    }

    setProcessing(true);

    const isCorrect =
      letter === targetLetter;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const newFeedback =
      isCorrect
        ? "correct"
        : "wrong";

    setFeedback(
      newFeedback
    );

    setScore(
      updatedScore
    );

    // -------------------------------------------------------
    // SAVE ANSWER
    // -------------------------------------------------------

    await save({
      targetLetter,

      options,

      feedback:
        newFeedback,

      score:
        updatedScore,

      questionCount,

      completed: false,
    });

    // -------------------------------------------------------
    // NEXT QUESTION
    // -------------------------------------------------------

    setTimeout(async () => {

      setFeedback("");

      const nextCount =
        questionCount + 1;

      setQuestionCount(
        nextCount
      );

      // =====================================================
      // FINAL QUESTION
      // =====================================================

      if (
        nextCount ===
        TOTAL_QUESTIONS
      ) {

        const finalPercentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏁 Find Correct Letter completed:",
          {
            score:
              updatedScore,

            total:
              TOTAL_QUESTIONS,

            percentage:
              finalPercentage,
          }
        );

        setGameFinished(true);

        // ⭐ Central stars/history
        await finish(
          finalPercentage,
          "Find Correct Letter"
        );

        // 💾 Detailed game result
        await saveScoreToFirestore(
          updatedScore
        );

        // Save completion state
        await save({
          targetLetter,

          options,

          feedback: "",

          score:
            updatedScore,

          questionCount:
            TOTAL_QUESTIONS,

          completed: true,
        });

        setProcessing(false);

        return;
      }

      // =====================================================
      // NEXT QUESTION
      // =====================================================

      const nextQuestion =
        generateQuestion();

      setTargetLetter(
        nextQuestion.question
      );

      setOptions(
        nextQuestion.options
      );

      await save({
        targetLetter:
          nextQuestion.question,

        options:
          nextQuestion.options,

        feedback: "",

        score:
          updatedScore,

        questionCount:
          nextCount,

        completed: false,
      });

      setProcessing(false);

    }, 800);
  };

  // =========================================================
  // PERFORMANCE
  // =========================================================

  const getPerformanceMessage =
    () => {

      if (
        questionCount === 0
      ) {
        return "";
      }

      const accuracy =
        (score /
          questionCount) *
        100;

      if (accuracy > 80)
        return "🌟 Excellent!";

      if (accuracy > 50)
        return "👍 Good job!";

      return "💡 Keep practicing!";
    };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    !restored
  ) {

    return (
      <div className="find-page">

        <div className="find-navbar">

          <div className="find-brand">

            <span className="find-brand-icon">
              🌴
            </span>

            <div>
              <strong>
                CurioKids
              </strong>

              <small>
                Jungle Practice
              </small>
            </div>

          </div>

          <div className="find-navbar-title">
            🔎 Find the Correct Letter
          </div>

        </div>

        <main className="find-main">

          <div className="find-loading-card">

            <div className="loading-icon">
              🌿
            </div>

            <h2>
              Restoring your adventure...
            </h2>

            <p>
              Getting your letters ready!
            </p>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // COMPLETION SCREEN
  // =========================================================

  if (gameFinished) {

    const percentage =
      (score /
        TOTAL_QUESTIONS) *
      100;

    return (
      <div className="find-page">

        <div className="find-navbar">

          <div className="find-brand">

            <span className="find-brand-icon">
              🌴
            </span>

            <div>
              <strong>
                CurioKids
              </strong>

              <small>
                Jungle Practice
              </small>
            </div>

          </div>

          <div className="find-navbar-title">
            🔎 Find the Correct Letter
          </div>

        </div>

        <main className="find-main">

          <section className="find-card completion-card">

            <span className="find-leaf leaf-one">
              🍃
            </span>

            <span className="find-leaf leaf-two">
              🌿
            </span>

            <div className="completion-content">

              <div className="completion-icon">
                🎉
              </div>

              <span className="completion-kicker">
                JUNGLE PRACTICE COMPLETE
              </span>

              <h1>
                Amazing Work!
              </h1>

              <p>
                You found the correct
                letters!
              </p>

              <div className="final-score">

                <span>
                  ⭐
                </span>

                <strong>
                  {score}
                </strong>

                <small>
                  / {TOTAL_QUESTIONS}
                </small>

              </div>

              <div className="accuracy">
                {percentage.toFixed(0)}%
              </div>

              <div className="performance">
                {getPerformanceMessage()}
              </div>

              <button
                className="play-again-btn"
                onClick={async () => {

                  const firstQuestion =
                    generateQuestion();

                  setTargetLetter(
                    firstQuestion.question
                  );

                  setOptions(
                    firstQuestion.options
                  );

                  setFeedback("");

                  setScore(0);

                  setQuestionCount(0);

                  setGameFinished(
                    false
                  );

                  setProcessing(
                    false
                  );

                  await save({
                    targetLetter:
                      firstQuestion.question,

                    options:
                      firstQuestion.options,

                    feedback: "",

                    score: 0,

                    questionCount: 0,

                    completed: false,
                  });
                }}
              >
                <span>🔄</span>

                Play Again

                <b>→</b>
              </button>

            </div>

          </section>

        </main>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="find-page">

      {/* NAVBAR */}

      <header className="find-navbar">

        <div className="find-brand">

          <span className="find-brand-icon">
            🌴
          </span>

          <div>
            <strong>
              CurioKids
            </strong>

            <small>
              Jungle Practice
            </small>
          </div>

        </div>

        <div className="find-navbar-title">
          <span>🔎</span>
          Find the Correct Letter
        </div>

      </header>

      {/* MAIN */}

      <main className="find-main">

        <section className="find-heading">

          <span className="find-kicker">
            CURIOKIDS • JUNGLE PRACTICE
          </span>

          <h1>
            Find the Letter 🔎
          </h1>

          <p>
            Look carefully and find the
            correct letter!
          </p>

        </section>

        {/* GAME CARD */}

        <section className="find-card">

          <span className="find-leaf leaf-one">
            🍃
          </span>

          <span className="find-leaf leaf-two">
            🌿
          </span>

          {/* HEADER */}

          <div className="find-game-header">

            <div>

              <span className="find-game-label">
                LETTER HUNT
              </span>

              <h2>
                Find the correct letter
              </h2>

            </div>

            <div className="find-progress">

              <strong>
                {Math.min(
                  questionCount + 1,
                  TOTAL_QUESTIONS
                )}
              </strong>

              <span>
                / {TOTAL_QUESTIONS}
              </span>

              <small>
                Question
              </small>

            </div>

          </div>

          {/* TARGET */}

          <div className="target-area">

            <span className="target-label">
              FIND THIS LETTER
            </span>

            <div className="target-letter">
              {targetLetter || "..."}
            </div>

            <p>
              👀 Look at all the choices
              and tap the matching letter!
            </p>

          </div>

          {/* OPTIONS */}

          <div className="options-title">
            <span>🌿</span>
            CHOOSE YOUR ANSWER
          </div>

          <div className="letter-grid">

            {options.length > 0 ? (

              options.map(
                (letter, index) => (

                  <button
                    key={index}
                    className={`grid-letter ${
                      feedback === "correct" &&
                      letter === targetLetter
                        ? "correct-letter"
                        : ""
                    }`}
                    onClick={() =>
                      handleClick(letter)
                    }
                    disabled={processing}
                  >
                    {letter}

                    <span className="letter-check">
                      ✓
                    </span>

                  </button>

                )
              )

            ) : (

              <p className="loading-text">
                Loading...
              </p>

            )}

          </div>

          {/* FEEDBACK */}

          {feedback ===
            "correct" && (

            <div className="feedback good">
              🎉 Correct! Great job!
            </div>

          )}

          {feedback ===
            "wrong" && (

            <div className="feedback wrong">
              💡 Try again! Look carefully.
            </div>

          )}

          {/* BOTTOM */}

          <div className="find-bottom">

            <div className="score-pill">

              <span>
                ⭐
              </span>

              <strong>
                Score
              </strong>

              <b>
                {score}
              </b>

              <span>
                / {questionCount}
              </span>

            </div>

            <div className="performance-pill">
              {getPerformanceMessage()}
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}