import { useEffect, useState } from "react";
import "../styles/SightWords.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "sight-words";
const TOTAL_QUESTIONS = 5;

const INITIAL_STATE = {
  emoji: "",
  options: [],
  correctAnswer: "",
  score: 0,
  questionCount: 0,
  message: "",
  completed: false,
};

export default function SightWords() {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [emoji, setEmoji] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);
  const [restored, setRestored] = useState(false);

  const [selectedWord, setSelectedWord] = useState("");
  const [answerLocked, setAnswerLocked] = useState(false);

  /* =========================================================
     AI QUESTION
  ========================================================= */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate-sight-word`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Sight word API failed");
      }

      const data = await response.json();

      if (
        !data.emoji ||
        !Array.isArray(data.options) ||
        data.options.length < 2 ||
        !data.answer
      ) {
        throw new Error("Invalid sight word data");
      }

      const question = {
        emoji: data.emoji,
        options: data.options.map((word) =>
          String(word).trim()
        ),
        correctAnswer: String(data.answer).trim(),
      };

      setEmoji(question.emoji);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);
      setSelectedWord("");
      setMessage("");

      return question;
    } catch (error) {
      console.error(
        "❌ Sight Words AI generation failed:",
        error
      );

      const fallbackQuestions = [
        {
          emoji: "🐱",
          options: ["cat", "tree", "book", "sun"],
          correctAnswer: "cat",
        },
        {
          emoji: "☀️",
          options: ["moon", "sun", "fish", "ball"],
          correctAnswer: "sun",
        },
        {
          emoji: "🐶",
          options: ["dog", "car", "cake", "rain"],
          correctAnswer: "dog",
        },
        {
          emoji: "📚",
          options: ["book", "shoe", "apple", "star"],
          correctAnswer: "book",
        },
        {
          emoji: "🍎",
          options: ["house", "apple", "bird", "chair"],
          correctAnswer: "apple",
        },
      ];

      const fallback =
        fallbackQuestions[
          Math.floor(
            Math.random() *
              fallbackQuestions.length
          )
        ];

      setEmoji(fallback.emoji);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.correctAnswer);
      setSelectedWord("");
      setMessage("");

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESTORE GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading || restored) {
      return;
    }

    const restoreGame = async () => {
      console.log(
        "🌱 Sight Words saved state:",
        savedState
      );

      if (
        savedState &&
        savedState.emoji &&
        Array.isArray(savedState.options) &&
        savedState.options.length > 0 &&
        savedState.correctAnswer
      ) {
        console.log(
          "✅ Resuming Sight Words from Firebase"
        );

        setEmoji(savedState.emoji);
        setOptions(savedState.options);
        setCorrectAnswer(
          savedState.correctAnswer
        );

        setScore(savedState.score ?? 0);
        setQuestionCount(
          savedState.questionCount ?? 0
        );

        setMessage(
          savedState.message || ""
        );

        setCompleted(
          Boolean(savedState.completed)
        );

        setLoading(false);
      } else {
        console.log(
          "🆕 Starting new Sight Words"
        );

        const question =
          await generateQuestionAI();

        await save({
          emoji: question.emoji,
          options: question.options,
          correctAnswer:
            question.correctAnswer,
          score: 0,
          questionCount: 0,
          message: "",
          completed: false,
        });
      }

      setRestored(true);
    };

    restoreGame();
  }, [
    progressLoading,
    restored,
    savedState,
  ]);

  /* =========================================================
     SAVE CURRENT GAME
  ========================================================= */

  const saveCurrentState = async (
    overrides = {}
  ) => {
    await save({
      emoji,
      options,
      correctAnswer,
      score,
      questionCount,
      message,
      completed,
      ...overrides,
    });
  };

  /* =========================================================
     SELECT WORD
  ========================================================= */

  const handleWordClick = async (word) => {
    if (
      loading ||
      completed ||
      answerLocked ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    setAnswerLocked(true);
    setSelectedWord(word);

    const isCorrect =
      word.trim().toLowerCase() ===
      correctAnswer.trim().toLowerCase();

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const feedback = isCorrect
      ? "Wonderful reading! 🌼"
      : `Nice try! Look carefully — the answer is "${correctAnswer}".`;

    setMessage(feedback);

    await saveCurrentState({
      score: updatedScore,
      message: feedback,
    });

    setTimeout(async () => {
      const nextQuestionNumber =
        questionCount + 1;

      /* =====================================================
         ROUND COMPLETE
      ===================================================== */

      if (
        nextQuestionNumber ===
        TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        const finalMessage =
          `You collected ${updatedScore} flowers! 🌸`;

        setScore(updatedScore);
        setQuestionCount(
          nextQuestionNumber
        );
        setCompleted(true);
        setMessage(finalMessage);

        await finish(
          percentage,
          "Sight Words"
        );

        setAnswerLocked(false);

        return;
      }

      /* =====================================================
         NEXT WORD
      ===================================================== */

      const nextQuestion =
        await generateQuestionAI();

      setScore(updatedScore);

      setQuestionCount(
        nextQuestionNumber
      );

      setSelectedWord("");
      setMessage("");

      await save({
        emoji: nextQuestion.emoji,
        options: nextQuestion.options,
        correctAnswer:
          nextQuestion.correctAnswer,
        score: updatedScore,
        questionCount:
          nextQuestionNumber,
        message: "",
        completed: false,
      });

      setAnswerLocked(false);
    }, 750);
  };

  /* =========================================================
     PLAY AGAIN
  ========================================================= */

  const playAgain = async () => {
    setLoading(true);
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);
    setSelectedWord("");
    setAnswerLocked(false);

    const question =
      await generateQuestionAI();

    await save({
      emoji: question.emoji,
      options: question.options,
      correctAnswer:
        question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      completed: false,
    });
  };

  /* =========================================================
     PERFORMANCE
  ========================================================= */

  const getPerformance = () => {
    if (score >= 5) {
      return {
        emoji: "🌟",
        title: "Amazing Reader!",
        text:
          "You recognized every sight word!",
      };
    }

    if (score >= 4) {
      return {
        emoji: "🌼",
        title: "Wonderful Reading!",
        text:
          "Your sight-word skills are growing beautifully!",
      };
    }

    if (score >= 3) {
      return {
        emoji: "🌱",
        title: "Great Growing!",
        text:
          "Keep practicing and your reading garden will grow!",
      };
    }

    return {
      emoji: "💚",
      title: "Keep Exploring!",
      text:
        "Every word you practice makes you a stronger reader.",
    };
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="sight-page">

        <nav className="sight-navbar">

          <div className="sight-brand">
            <span>🌿</span>
            CurioKids
          </div>

          <div className="sight-navbar-title">
            🌼 Sight Words
          </div>

        </nav>

        <main className="sight-main">

          <div className="sight-loading-card">

            <div className="loading-flower">
              🌼
            </div>

            <h2>
              Growing your word garden...
            </h2>

            <p>
              Finding a special word for you!
            </p>

            <div className="loading-leaves">
              <span>🌱</span>
              <span>🌿</span>
              <span>🌱</span>
            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     COMPLETION
  ========================================================= */

  if (completed) {
    const performance =
      getPerformance();

    return (
      <div className="sight-page">

        <nav className="sight-navbar">

          <div className="sight-brand">
            <span>🌿</span>
            CurioKids
          </div>

          <div className="sight-navbar-title">
            🌼 Sight Words
          </div>

        </nav>

        <main className="sight-main">

          <div className="garden-complete">

            <div className="garden-sun">
              ☀️
            </div>

            <div className="flower-burst">
              🌸 🌼 🌷
            </div>

            <p className="complete-label">
              WORD GARDEN COMPLETE
            </p>

            <h1>
              Your Garden Grew! 🌱
            </h1>

            <p className="complete-subtitle">
              You discovered all your sight words.
            </p>

            <div className="flower-score">

              <div className="score-flower">
                🌼
              </div>

              <div>

                <span>
                  FLOWERS COLLECTED
                </span>

                <strong>
                  {score}
                  <small>
                    / {TOTAL_QUESTIONS}
                  </small>
                </strong>

              </div>

            </div>

            <div className="reading-result">

              <div className="result-icon">
                {performance.emoji}
              </div>

              <div>

                <strong>
                  {performance.title}
                </strong>

                <p>
                  {performance.text}
                </p>

              </div>

            </div>

            <button
              className="grow-more-button"
              onClick={playAgain}
            >
              🌱 Grow Another Garden
            </button>

          </div>

        </main>

      </div>
    );
  }

  const progress =
    (questionCount /
      TOTAL_QUESTIONS) *
    100;

  /* =========================================================
     MAIN GAME
  ========================================================= */

  return (
    <div className="sight-page">

      <nav className="sight-navbar">

        <div className="sight-brand">
          <span>🌿</span>
          CurioKids
        </div>

        <div className="sight-navbar-title">
          🌼 Sight Words
        </div>

      </nav>

      <main className="sight-main">

        <section className="sight-game-card">

          {/* =================================================
              PROGRESS
          ================================================= */}

          <section className="garden-progress-card">

            <div className="garden-progress-top">

              <div>

                <span>
                  YOUR GARDEN
                </span>

                <strong>
                  {questionCount}
                  <small>
                    / {TOTAL_QUESTIONS}
                  </small>
                </strong>

              </div>

              <div className="mini-flowers">

                {Array.from({
                  length: TOTAL_QUESTIONS,
                }).map((_, index) => (

                  <span
                    key={index}
                    className={
                      index < score
                        ? "flower-filled"
                        : "flower-empty"
                    }
                  >
                    🌼
                  </span>

                ))}

              </div>

            </div>

            <div className="garden-track">

              <div
                className="garden-fill"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="garden-progress-bottom">

              <span>
                Keep growing!
              </span>

              <strong>
                {Math.round(progress)}%
              </strong>

            </div>

          </section>

          {/* =================================================
              MAIN GAME
          ================================================= */}

          <main className="word-garden-card">

            <div className="garden-question-tag">
              📖 WORD OF THE MOMENT
            </div>

            <h2>
              Which word matches the picture?
            </h2>

            <p className="garden-instruction">
              Look at the picture, then tap the
              word you know.
            </p>

            {/* =================================================
                PICTURE
            ================================================= */}

            <div className="picture-garden">

              <div className="sun-decoration">
                ☀️
              </div>

              <div className="picture-circle">
                {loading
                  ? "🌱"
                  : emoji}
              </div>

              <div className="grass">
                🌿 🌱 🌿
              </div>

            </div>

            {/* =================================================
                WORD OPTIONS
            ================================================= */}

            <div className="word-options">

              {loading ? (

                <div className="word-loading">
                  <span>🌱</span>
                  Finding words...
                </div>

              ) : (

                options.map(
                  (word, index) => {

                    const selected =
                      selectedWord === word;

                    const correct =
                      selected &&
                      word
                        .trim()
                        .toLowerCase() ===
                        correctAnswer
                          .trim()
                          .toLowerCase();

                    const wrong =
                      selected &&
                      !correct;

                    return (
                      <button
                        key={`${word}-${index}`}
                        type="button"
                        className={[
                          "word-card",
                          `word-card-${index}`,
                          selected
                            ? "word-selected"
                            : "",
                          correct
                            ? "word-correct"
                            : "",
                          wrong
                            ? "word-wrong"
                            : "",
                        ].join(" ")}
                        onClick={() =>
                          handleWordClick(word)
                        }
                        disabled={
                          answerLocked ||
                          loading
                        }
                      >

                        <span className="word-number">
                          {index + 1}
                        </span>

                        <span className="word-text">
                          {word}
                        </span>

                        <span className="word-leaf">
                          {correct
                            ? "🌸"
                            : "🍃"}
                        </span>

                      </button>
                    );
                  }
                )

              )}

            </div>

            {/* =================================================
                FEEDBACK
            ================================================= */}

            {message && (
              <div
                className={
                  message.includes(
                    "Wonderful"
                  )
                    ? "sight-feedback feedback-good"
                    : "sight-feedback feedback-try"
                }
              >
                {message}
              </div>
            )}

          </main>

        </section>

        {/* =====================================================
            TIP
        ===================================================== */}

        <div className="reading-tip">

          <span>💡</span>

          <p>
            Sight words are words we learn to
            recognize quickly while reading.
          </p>

        </div>

      </main>

    </div>
  );
}