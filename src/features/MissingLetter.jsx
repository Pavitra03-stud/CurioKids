import { useEffect, useState } from "react";
import "../styles/MissingLetter.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "missing-letter";
const TOTAL_QUESTIONS = 5;

const INITIAL_STATE = {
  displayWord: "",
  options: [],
  correctAnswer: "",
  score: 0,
  questionCount: 0,
  message: "",
  completed: false,
};

export default function MissingLetter() {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [displayWord, setDisplayWord] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);
  const [restored, setRestored] = useState(false);

  const [answerLocked, setAnswerLocked] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("");

  /*
  ============================================================
  🤖 GENERATE AI QUESTION
  ============================================================
  */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/generate-missing-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const data = await response.json();

      if (
        !data.display ||
        !Array.isArray(data.options) ||
        !data.answer
      ) {
        throw new Error("Invalid AI question");
      }

      const question = {
        displayWord: data.display,
        options: data.options.map((item) =>
          String(item).toLowerCase()
        ),
        correctAnswer: String(data.answer).toLowerCase(),
      };

      setDisplayWord(question.displayWord);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);
      setMessage("");
      setSelectedLetter("");

      return question;
    } catch (error) {
      console.error("❌ Missing Letter AI error:", error);

      /*
        Fallback questions.
        These keep the game working even if AI is temporarily unavailable.
      */

      const fallbackQuestions = [
        {
          displayWord: "C _ T",
          options: ["a", "e", "i", "o"],
          correctAnswer: "a",
        },
        {
          displayWord: "D _ G",
          options: ["a", "e", "i", "o"],
          correctAnswer: "o",
        },
        {
          displayWord: "S _ N",
          options: ["a", "e", "i", "o"],
          correctAnswer: "u",
        },
        {
          displayWord: "P _ N",
          options: ["a", "e", "i", "o"],
          correctAnswer: "e",
        },
        {
          displayWord: "F _ SH",
          options: ["a", "i", "o", "u"],
          correctAnswer: "i",
        },
      ];

      const fallback =
        fallbackQuestions[
          Math.floor(Math.random() * fallbackQuestions.length)
        ];

      setDisplayWord(fallback.displayWord);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.correctAnswer);
      setMessage("");
      setSelectedLetter("");

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  🔥 RESTORE FROM FIREBASE
  ============================================================
  */

  useEffect(() => {
    if (progressLoading || restored) {
      return;
    }

    const restoreGame = async () => {
      console.log("🔎 Missing Letter restore:", savedState);

      if (
        savedState &&
        savedState.displayWord &&
        Array.isArray(savedState.options) &&
        savedState.options.length > 0
      ) {
        console.log("✅ Resuming Missing Letter");

        setDisplayWord(savedState.displayWord);
        setOptions(savedState.options);
        setCorrectAnswer(savedState.correctAnswer || "");

        setScore(savedState.score ?? 0);
        setQuestionCount(savedState.questionCount ?? 0);

        setMessage(savedState.message || "");
        setCompleted(Boolean(savedState.completed));
      } else {
        console.log("🆕 Starting new Missing Letter game");

        const question = await generateQuestionAI();

        await save({
          displayWord: question.displayWord,
          options: question.options,
          correctAnswer: question.correctAnswer,
          score: 0,
          questionCount: 0,
          message: "",
          completed: false,
        });
      }

      setRestored(true);
    };

    restoreGame();
  }, [progressLoading, restored, savedState]);

  /*
  ============================================================
  💾 SAVE GAME
  ============================================================
  */

  const saveCurrentState = async (overrides = {}) => {
    await save({
      displayWord,
      options,
      correctAnswer,
      score,
      questionCount,
      message,
      completed,
      ...overrides,
    });
  };

  /*
  ============================================================
  🎯 ANSWER
  ============================================================
  */

  const handleAnswer = async (letter) => {
    if (answerLocked || completed || loading) {
      return;
    }

    if (questionCount >= TOTAL_QUESTIONS) {
      return;
    }

    setAnswerLocked(true);
    setSelectedLetter(letter);

    const isCorrect =
      letter.toLowerCase() === correctAnswer.toLowerCase();

    const updatedScore = isCorrect ? score + 1 : score;

    const feedback = isCorrect
      ? "Amazing! You found the missing letter! 🌟"
      : `Good try! The missing letter is ${correctAnswer.toUpperCase()}.`;

    setMessage(feedback);

    /*
      Save immediately so refresh during feedback
      does not lose the answer.
    */

    await saveCurrentState({
      score: updatedScore,
      message: feedback,
    });

    setTimeout(async () => {
      const nextQuestionNumber = questionCount + 1;

      /*
      ========================================================
      🏆 COMPLETE
      ========================================================
      */

      if (nextQuestionNumber === TOTAL_QUESTIONS) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        setScore(updatedScore);
        setQuestionCount(nextQuestionNumber);
        setCompleted(true);

        const completionMessage =
          `You scored ${updatedScore} out of ${TOTAL_QUESTIONS}! 🎉`;

        setMessage(completionMessage);

        /*
          IMPORTANT:
          finish() awards stars and clears active game.
        */

        await finish(
          percentage,
          "Missing Letter"
        );

        /*
          DO NOT call save() after finish().
          finish() clears activeGames.
        */

        setAnswerLocked(false);

        return;
      }

      /*
      ========================================================
      ➡️ NEXT QUESTION
      ========================================================
      */

      const nextQuestion = await generateQuestionAI();

      setScore(updatedScore);
      setQuestionCount(nextQuestionNumber);
      setMessage("");
      setSelectedLetter("");

      await save({
        displayWord: nextQuestion.displayWord,
        options: nextQuestion.options,
        correctAnswer: nextQuestion.correctAnswer,
        score: updatedScore,
        questionCount: nextQuestionNumber,
        message: "",
        completed: false,
      });

      setAnswerLocked(false);
    }, 700);
  };

  /*
  ============================================================
  🔄 PLAY AGAIN
  ============================================================
  */

  const handlePlayAgain = async () => {
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);
    setAnswerLocked(false);
    setSelectedLetter("");

    const newQuestion = await generateQuestionAI();

    await save({
      displayWord: newQuestion.displayWord,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      completed: false,
    });
  };

  /*
  ============================================================
  📊 PERFORMANCE
  ============================================================
  */

  const getPerformance = () => {
    if (questionCount === 0) {
      return {
        title: "Ready to explore!",
        text: "Look carefully at the word and find the missing letter.",
        emoji: "🔎",
      };
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy >= 80) {
      return {
        title: "Letter Detective! 🌟",
        text: "You are doing an amazing job finding missing letters.",
        emoji: "🏆",
      };
    }

    if (accuracy >= 50) {
      return {
        title: "Great exploring! ⭐",
        text: "Keep looking carefully. You are getting better!",
        emoji: "🧩",
      };
    }

    return {
      title: "Keep practicing! 💚",
      text: "Take your time and look at each letter carefully.",
      emoji: "🌱",
    };
  };

  /*
  ============================================================
  ⏳ LOADING
  ============================================================
  */

  if (progressLoading || !restored) {
    return (
      <div className="missing-page">
        <div className="missing-loading">
          <div className="detective-icon">🔎</div>

          <h2>Getting your letter puzzle ready...</h2>

          <p>
            Finding a fun word for you!
          </p>

          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  /*
  ============================================================
  🏆 COMPLETED SCREEN
  ============================================================
  */

  if (completed) {
    const performance = getPerformance();

    return (
      <div className="missing-page">
        <div className="missing-shell">
          <div className="completion-card">

            <div className="completion-icon">
              🎉
            </div>

            <div className="completion-stars">
              ⭐ ⭐ ⭐
            </div>

            <p className="completion-label">
              MISSION COMPLETE
            </p>

            <h1>
              Letter Detective!
            </h1>

            <p className="completion-subtitle">
              You found all the missing letters!
            </p>

            <div className="final-score">
              <span>Your score</span>

              <strong>
                {score}
                <small> / {TOTAL_QUESTIONS}</small>
              </strong>
            </div>

            <div className="performance-card">
              <span className="performance-emoji">
                {performance.emoji}
              </span>

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
              className="play-again-btn"
              onClick={handlePlayAgain}
            >
              🔄 Find More Letters
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress =
    (questionCount / TOTAL_QUESTIONS) * 100;

  return (
    <div className="missing-page">

      <div className="missing-shell">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="missing-header">

          <div className="detective-badge">
            🔎
          </div>

          <div>
            <p className="eyebrow">
              LETTER DETECTIVE
            </p>

            <h1>
              Missing Letter
            </h1>

            <p>
              Can you discover which letter is hiding?
            </p>
          </div>

        </header>

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="missing-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              🧩
            </div>

            <div>
              <span>PUZZLE</span>

              <strong>
                {questionCount + 1}
                <small> / {TOTAL_QUESTIONS}</small>
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon yellow">
              ⭐
            </div>

            <div>
              <span>SCORE</span>

              <strong>
                {score}
              </strong>
            </div>

          </div>

        </div>

        {/* ==================================================
            PROGRESS
        ================================================== */}

        <div className="missing-progress">

          <div className="progress-heading">
            <span>
              Detective progress
            </span>

            <strong>
              {Math.round(progress)}%
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-value"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>

        {/* ==================================================
            MAIN GAME
        ================================================== */}

        <main className="detective-card">

          <div className="case-tag">
            🕵️ CASE #{questionCount + 1}
          </div>

          <h2>
            A letter is hiding!
          </h2>

          <p className="question-description">
            Look at the word carefully and discover
            the missing letter.
          </p>

          {/* WORD */}

          <div className="mystery-word">

            {loading ? (
              <div className="word-loading">
                🔎
              </div>
            ) : (
              displayWord
                .split("")
                .map((character, index) => (
                  <span
                    key={`${character}-${index}`}
                    className={
                      character === "_"
                        ? "mystery-letter"
                        : "normal-letter"
                    }
                  >
                    {character === "_"
                      ? selectedLetter
                        ? selectedLetter.toUpperCase()
                        : "?"
                      : character.toUpperCase()}
                  </span>
                ))
            )}

          </div>

          {/* HINT */}

          <div className="detective-hint">

            <span className="hint-icon">
              💡
            </span>

            <div>
              <strong>
                Detective hint
              </strong>

              <p>
                Say the word slowly and listen
                for the missing sound.
              </p>
            </div>

          </div>

          {/* QUESTION */}

          <div className="answer-heading">
            <span>
              What letter belongs here?
            </span>
          </div>

          {/* OPTIONS */}

          <div className="letter-circles">

            {loading ? (
              <div className="answer-loading">
                Finding letters...
              </div>
            ) : (
              options.map((letter, index) => {

                const isSelected =
                  selectedLetter === letter;

                const isCorrect =
                  isSelected &&
                  letter.toLowerCase() ===
                    correctAnswer.toLowerCase();

                const isWrong =
                  isSelected &&
                  letter.toLowerCase() !==
                    correctAnswer.toLowerCase();

                return (
                  <button
                    key={`${letter}-${index}`}
                    className={[
                      "letter-circle",
                      `circle-${index % 4}`,
                      isCorrect
                        ? "letter-correct"
                        : "",
                      isWrong
                        ? "letter-wrong"
                        : "",
                    ].join(" ")}
                    onClick={() =>
                      handleAnswer(letter)
                    }
                    disabled={
                      answerLocked ||
                      loading
                    }
                  >
                    <span>
                      {letter.toUpperCase()}
                    </span>
                  </button>
                );
              })
            )}

          </div>

          {/* FEEDBACK */}

          {message && (
            <div
              className={
                message.includes("Amazing")
                  ? "answer-feedback correct-feedback"
                  : "answer-feedback wrong-feedback"
              }
            >
              {message}
            </div>
          )}

        </main>

        {/* ==================================================
            BOTTOM TIP
        ================================================== */}

        <div className="detective-tip">
          <span>🌱</span>

          <p>
            Take your time — there is no need to rush.
          </p>
        </div>

      </div>
    </div>
  );
}