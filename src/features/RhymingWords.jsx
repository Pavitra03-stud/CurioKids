import { useEffect, useRef, useState } from "react";
import "../styles/RhymingSound.css";
import useGameProgress from "../hooks/useGameProgress";

export default function RhymingWords() {
  const TOTAL_QUESTIONS = 5;
  const GAME_ID = "rhyming-words";

  // =====================================================
  // FIREBASE GAME PROGRESS
  // =====================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =====================================================
  // GAME STATE
  // =====================================================

  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const [isAnswering, setIsAnswering] = useState(false);

  const initializedRef = useRef(false);
  const answeringRef = useRef(false);

  // =====================================================
  // GENERATE AI QUESTION
  // =====================================================

  const generateQuestionAI = async () => {
    console.log("🤖 Generating Rhyming Words question...");

    setLoading(true);

    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 8000);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate-rhyming`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Rhyming API failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("🤖 RHYMING API RESPONSE:", data);

      // =================================================
      // VALIDATE RESPONSE
      // =================================================

      if (
        !data.word ||
        !data.answer ||
        !Array.isArray(data.options) ||
        data.options.length < 2
      ) {
        throw new Error("Invalid rhyming API response");
      }

      const question = {
        word: data.word,
        emoji: data.emoji || "🔤",
      };

      // =================================================
      // SET NEW QUESTION
      // =================================================

      setCurrentWord(question);
      setCorrectAnswer(data.answer);
      setOptions(data.options);

      setFeedback("");
      setIsAnswering(false);
      answeringRef.current = false;

      console.log("✅ New question ready:", {
        word: data.word,
        answer: data.answer,
        options: data.options,
      });

      return {
        currentWord: question,
        correctAnswer: data.answer,
        options: data.options,
      };
    } catch (error) {
      console.error("❌ Rhyming API error:", error);

      // =================================================
      // FALLBACK QUESTIONS
      // =================================================

      const fallbackQuestions = [
        {
          currentWord: {
            word: "Cat",
            emoji: "🐱",
          },
          correctAnswer: "Hat",
          options: ["Hat", "Log", "Fun", "Tall"],
        },
        {
          currentWord: {
            word: "Sun",
            emoji: "☀️",
          },
          correctAnswer: "Fun",
          options: ["Fun", "Dog", "Book", "Rain"],
        },
        {
          currentWord: {
            word: "Dog",
            emoji: "🐶",
          },
          correctAnswer: "Log",
          options: ["Log", "Bell", "Cat", "Fish"],
        },
        {
          currentWord: {
            word: "Star",
            emoji: "⭐",
          },
          correctAnswer: "Car",
          options: ["Car", "Moon", "Tree", "Book"],
        },
        {
          currentWord: {
            word: "Rain",
            emoji: "🌧️",
          },
          correctAnswer: "Train",
          options: ["Train", "Sun", "Dog", "Hat"],
        },
        {
          currentWord: {
            word: "Bell",
            emoji: "🔔",
          },
          correctAnswer: "Shell",
          options: ["Shell", "Book", "Cat", "Rain"],
        },
        {
          currentWord: {
            word: "Cake",
            emoji: "🎂",
          },
          correctAnswer: "Lake",
          options: ["Lake", "Dog", "Sun", "Fish"],
        },
        {
          currentWord: {
            word: "Tree",
            emoji: "🌳",
          },
          correctAnswer: "Bee",
          options: ["Bee", "Car", "Moon", "Hat"],
        },
        {
          currentWord: {
            word: "Light",
            emoji: "💡",
          },
          correctAnswer: "Night",
          options: ["Night", "Dog", "Bell", "Rain"],
        },
        {
          currentWord: {
            word: "Ball",
            emoji: "⚽",
          },
          correctAnswer: "Tall",
          options: ["Tall", "Book", "Sun", "Fish"],
        },
      ];

      const randomIndex = Math.floor(
        Math.random() * fallbackQuestions.length
      );

      const fallbackQuestion =
        fallbackQuestions[randomIndex];

      setCurrentWord(fallbackQuestion.currentWord);
      setCorrectAnswer(fallbackQuestion.correctAnswer);
      setOptions(fallbackQuestion.options);

      setFeedback("");
      setIsAnswering(false);
      answeringRef.current = false;

      console.log(
        "🛟 Using fallback question:",
        fallbackQuestion
      );

      return fallbackQuestion;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESTORE SAVED GAME / START NEW GAME
  // =====================================================

  useEffect(() => {
    if (progressLoading) {
      console.log(
        "⏳ Waiting for GameContext Firebase load..."
      );
      return;
    }

    if (savedState === null) {
      console.log(
        "⏳ Waiting for savedState from Firebase..."
      );
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const initializeGame = async () => {
      console.log(
        "🎮 Rhyming Words restore:",
        savedState
      );

      // =================================================
      // RESTORE SAVED GAME
      // =================================================

      if (
        savedState &&
        Object.keys(savedState).length > 0 &&
        savedState.currentWord &&
        Array.isArray(savedState.options) &&
        savedState.correctAnswer
      ) {
        console.log(
          "🔥 Restoring Rhyming Words:",
          savedState
        );

        setCurrentWord(savedState.currentWord);

        setOptions(savedState.options);

        setCorrectAnswer(
          savedState.correctAnswer
        );

        setScore(
          Number(savedState.score) || 0
        );

        setQuestionCount(
          Number(savedState.questionCount) || 0
        );

        setFeedback("");

        setCompleted(
          Boolean(savedState.completed)
        );

        setIsAnswering(false);
        answeringRef.current = false;

        setLoading(false);

        console.log(
          "✅ Rhyming Words resumed successfully"
        );

        return;
      }

      // =================================================
      // START NEW GAME
      // =================================================

      console.log(
        "🆕 Starting new Rhyming Words game"
      );

      setScore(0);
      setQuestionCount(0);
      setCompleted(false);
      setFeedback("");

      setIsAnswering(false);
      answeringRef.current = false;

      const question =
        await generateQuestionAI();

      if (!question) {
        return;
      }

      // =================================================
      // SAVE INITIAL QUESTION
      // =================================================

      await save({
        currentWord: question.currentWord,
        correctAnswer: question.correctAnswer,
        options: question.options,
        score: 0,
        questionCount: 0,
        feedback: "",
        completed: false,
      });

      console.log(
        "💾 Initial Rhyming Words question saved"
      );
    };

    initializeGame();
  }, [progressLoading, savedState]);

  // =====================================================
  // ANSWER QUESTION
  // =====================================================

  const handleAnswer = (selectedAnswer) => {
    if (
      loading ||
      completed ||
      isAnswering ||
      answeringRef.current
    ) {
      console.log(
        "⛔ Answer blocked:",
        {
          loading,
          completed,
          isAnswering,
          answering: answeringRef.current,
        }
      );

      return;
    }

    // Lock immediately
    answeringRef.current = true;
    setIsAnswering(true);

    const isCorrect =
      selectedAnswer === correctAnswer;

    const newScore = isCorrect
      ? score + 1
      : score;

    console.log("🎯 Selected:", selectedAnswer);
    console.log("🎯 Correct:", correctAnswer);
    console.log("🎯 Is correct:", isCorrect);

    // =====================================================
    // SHOW FEEDBACK
    // =====================================================

    setFeedback(
      isCorrect
        ? "correct"
        : "wrong"
    );

    setScore(newScore);

    // =====================================================
    // WAIT BEFORE NEXT QUESTION
    // =====================================================

    setTimeout(async () => {
      try {
        const nextQuestionNumber =
          questionCount + 1;

        // =================================================
        // LAST QUESTION
        // =================================================

        if (
          nextQuestionNumber >=
          TOTAL_QUESTIONS
        ) {
          const percentage =
            (newScore / TOTAL_QUESTIONS) * 100;

          console.log(
            "🏆 Rhyming Words completed",
            {
              score: newScore,
              percentage,
            }
          );

          // finish clears Firebase activeGames
          await finish(
            percentage,
            "AI Rhyming Words"
          );

          setQuestionCount(
            TOTAL_QUESTIONS
          );

          setCompleted(true);
          setLoading(false);
          setFeedback("");

          setIsAnswering(false);
          answeringRef.current = false;

          console.log(
            "🎉 Rhyming Words completed successfully"
          );

          return;
        }

        // =================================================
        // NEXT QUESTION
        // =================================================

        console.log(
          `➡️ Loading question ${
            nextQuestionNumber + 1
          }/${TOTAL_QUESTIONS}`
        );

        setLoading(true);
        setFeedback("");

        const nextQuestion =
          await generateQuestionAI();

        if (!nextQuestion) {
          setIsAnswering(false);
          answeringRef.current = false;
          return;
        }

        const updatedQuestionCount =
          nextQuestionNumber;

        setQuestionCount(
          updatedQuestionCount
        );

        // =================================================
        // SAVE NEXT QUESTION
        // =================================================

        await save({
          currentWord:
            nextQuestion.currentWord,
          correctAnswer:
            nextQuestion.correctAnswer,
          options:
            nextQuestion.options,
          score: newScore,
          questionCount:
            updatedQuestionCount,
          feedback: "",
          completed: false,
        });

        console.log(
          "💾 Next Rhyming question saved"
        );

        setLoading(false);
        setIsAnswering(false);
        answeringRef.current = false;
      } catch (error) {
        console.error(
          "❌ Error processing answer:",
          error
        );

        setLoading(false);
        setIsAnswering(false);
        answeringRef.current = false;
      }
    }, 800);
  };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const handlePlayAgain = async () => {
    console.log(
      "🔄 Starting Rhyming Words again..."
    );

    setScore(0);
    setQuestionCount(0);
    setCompleted(false);
    setFeedback("");

    setIsAnswering(false);
    answeringRef.current = false;

    setLoading(true);

    const question =
      await generateQuestionAI();

    if (!question) {
      return;
    }

    await save({
      currentWord: question.currentWord,
      correctAnswer: question.correctAnswer,
      options: question.options,
      score: 0,
      questionCount: 0,
      feedback: "",
      completed: false,
    });

    console.log(
      "💾 New Rhyming Words game saved"
    );
  };

  // =====================================================
  // PERFORMANCE MESSAGE
  // =====================================================

  const getPerformanceMessage = () => {
    const percentage =
      (score / TOTAL_QUESTIONS) * 100;

    if (percentage === 100) {
      return "Amazing! You are a rhyming superstar! 🌟";
    }

    if (percentage >= 80) {
      return "Excellent work! Your rhyming skills are great! 🎉";
    }

    if (percentage >= 60) {
      return "Good job! Keep practicing your rhyming skills! 😊";
    }

    return "Nice try! Let's practice some more rhyming words! 💪";
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (
    progressLoading ||
    loading ||
    !currentWord
  ) {
    return (
      <div className="phonics-page">
        <nav className="phonics-navbar">
          <div className="phonics-navbar-title">
            🌿 CurioKids
          </div>

          <div className="phonics-navbar-game">
            🤖 AI Rhyming Words
          </div>
        </nav>

        <main className="phonics-content loading-content">
          <div className="word-display">
            <div className="emoji">⏳</div>

            <h2>
              Getting your rhyming challenge ready...
            </h2>

            <p className="loading-text">
              🌴 The jungle is preparing a word for you!
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // COMPLETED SCREEN
  // =====================================================

  if (completed) {
    return (
      <div className="phonics-page">
        <nav className="phonics-navbar">
          <div className="phonics-navbar-title">
            🌿 CurioKids
          </div>

          <div className="phonics-navbar-game">
            🤖 AI Rhyming Words
          </div>
        </nav>

        <main className="phonics-content completed-content">
          <div className="word-display completion-display">
            <div className="emoji">🎉</div>

            <h2>Round Completed!</h2>

            <div className="final-score">
              <span className="score-label">
                Your Score
              </span>

              <span className="score-number">
                {score}/{TOTAL_QUESTIONS}
              </span>
            </div>

            <h3>
              {getPerformanceMessage()}
            </h3>

            <button
              className="option-btn play-again-btn"
              onClick={handlePlayAgain}
            >
              🔄 Play Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =====================================================
  // MAIN GAME UI
  // =====================================================

  return (
    <div className="phonics-page">
      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="phonics-navbar">
        <div className="phonics-navbar-title">
          🌿 CurioKids
        </div>

        <div className="phonics-navbar-game">
          🤖 AI Rhyming Words
        </div>
      </nav>

      {/* =================================================
          GAME CONTENT
      ================================================= */}

      <main className="phonics-content">
        <div className="game-info">
          <span>
            Question{" "}
            <strong>
              {questionCount + 1}
            </strong>{" "}
            / {TOTAL_QUESTIONS}
          </span>

          <span>
            ⭐ Score:{" "}
            <strong>{score}</strong>
          </span>
        </div>

        {/* =================================================
            CURRENT WORD
        ================================================= */}

        <div className="word-display">
          <div className="emoji">
            {currentWord.emoji}
          </div>

          <h2>{currentWord.word}</h2>
        </div>

        {/* =================================================
            QUESTION
        ================================================= */}

        <h3>
          Which word rhymes with{" "}
          <span className="highlight-word">
            "{currentWord.word}"
          </span>
          ?
        </h3>

        {/* =================================================
            OPTIONS
        ================================================= */}

        <div className="options-grid">
          {options.map(
            (option, index) => (
              <button
                key={`${option}-${index}`}
                className={`option-btn ${
                  feedback === "correct" &&
                  option === correctAnswer
                    ? "correct-option"
                    : ""
                } ${
                  feedback === "wrong" &&
                  option === correctAnswer
                    ? "correct-option"
                    : ""
                }`}
                onClick={() =>
                  handleAnswer(option)
                }
                disabled={
                  isAnswering ||
                  loading
                }
              >
                <span className="option-word">
                  {option}
                </span>
              </button>
            )
          )}
        </div>

        {/* =================================================
            FEEDBACK
        ================================================= */}

        {feedback && (
          <div
            className={`feedback ${
              feedback === "correct"
                ? "good"
                : "wrong"
            }`}
          >
            {feedback === "correct" ? (
              <>
                🎉 Great job!
                <span>
                  That's a rhyming word!
                </span>
              </>
            ) : (
              <>
                💭 Keep trying!
                <span>
                  The correct answer is{" "}
                  <strong>
                    {correctAnswer}
                  </strong>
                </span>
              </>
            )}
          </div>
        )}

        {/* =================================================
            AI INFO
        ================================================= */}

        <div className="ai-analysis">
          🤖 AI-powered rhyming challenge
        </div>
      </main>
    </div>
  );
}