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

  // IMPORTANT:
  // State is used for button disabled/rendering.
  // Ref is used only as a second safety lock.
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
        "http://localhost:5000/api/generate-rhyming",
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

      // ⭐ VERY IMPORTANT
      // New question must always be clickable.
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
      // FALLBACK QUESTION
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

      // Pick random fallback question
      const randomIndex = Math.floor(
        Math.random() * fallbackQuestions.length
      );

      const fallbackQuestion =
        fallbackQuestions[randomIndex];

      setCurrentWord(fallbackQuestion.currentWord);
      setCorrectAnswer(fallbackQuestion.correctAnswer);
      setOptions(fallbackQuestion.options);

      // ⭐ RESET ANSWER LOCK
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
    // Firebase progress is still loading
    if (progressLoading) {
      console.log(
        "⏳ Waiting for GameContext Firebase load..."
      );
      return;
    }

    // VERY IMPORTANT:
    // useGameProgress initially returns null.
    // Wait until it has actually checked Firebase.
    if (savedState === null) {
      console.log(
        "⏳ Waiting for savedState from Firebase..."
      );
      return;
    }

    // Prevent duplicate initialization
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
    // Prevent clicks while:
    // - loading
    // - completed
    // - another answer is being processed
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
            (newScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏆 Rhyming Words completed",
            {
              score: newScore,
              percentage,
            }
          );

          // ⭐ IMPORTANT:
          // finish clears Firebase activeGames.
          // Do NOT call save() after this.
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

        // Show loading screen while AI generates
        setLoading(true);

        setFeedback("");

        const nextQuestion =
          await generateQuestionAI();

        if (!nextQuestion) {
          throw new Error(
            "Next question was not generated"
          );
        }

        // Update question number AFTER
        // successful generation
        setQuestionCount(
          nextQuestionNumber
        );

        // ⭐ generateQuestionAI already unlocks
        // the answer state.
        setIsAnswering(false);
        answeringRef.current = false;

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
            nextQuestionNumber,

          feedback: "",

          completed: false,
        });

        console.log(
          "💾 Next Rhyming Words question saved"
        );

        // Safety unlock
        setIsAnswering(false);
        answeringRef.current = false;
      } catch (error) {
        console.error(
          "❌ Error loading next question:",
          error
        );

        // NEVER leave game locked
        setIsAnswering(false);
        answeringRef.current = false;
        setLoading(false);
      }
    }, 800);
  };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const handlePlayAgain = async () => {
    console.log(
      "🔄 Starting Rhyming Words again"
    );

    // Reset everything FIRST
    setScore(0);
    setQuestionCount(0);
    setFeedback("");
    setCompleted(false);
    setLoading(true);

    setIsAnswering(false);
    answeringRef.current = false;

    const question =
      await generateQuestionAI();

    if (!question) {
      return;
    }

    await save({
      currentWord:
        question.currentWord,

      correctAnswer:
        question.correctAnswer,

      options:
        question.options,

      score: 0,

      questionCount: 0,

      feedback: "",

      completed: false,
    });

    setLoading(false);

    console.log(
      "💾 New Rhyming Words round saved"
    );
  };

  // =====================================================
  // PERFORMANCE MESSAGE
  // =====================================================

  const getPerformanceMessage = () => {
    if (loading) {
      return "";
    }

    if (!feedback && !completed) {
      return "";
    }

    if (completed) {
      const finalAccuracy =
        (score /
          TOTAL_QUESTIONS) *
        100;

      if (finalAccuracy >= 80) {
        return "🌟 Excellent rhyming skills!";
      }

      if (finalAccuracy >= 50) {
        return "👍 Good job! Keep going!";
      }

      return "💡 Keep practicing!";
    }

    if (questionCount <= 0) {
      return "";
    }

    const accuracy =
      (score /
        questionCount) *
      100;

    if (accuracy >= 80) {
      return "🌟 Excellent!";
    }

    if (accuracy >= 50) {
      return "👍 Good job!";
    }

    return "💡 Keep practicing!";
  };

  // =====================================================
  // FIREBASE LOADING SCREEN
  // =====================================================

  if (progressLoading || savedState === null) {
    return (
      <div className="phonics-page">
        <div className="letter-navbar">
          <h2>🤖 AI Rhyming Words</h2>
        </div>

        <div className="word-display">
          <div className="emoji">
            ⏳
          </div>

          <h2>
            Loading your progress...
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="phonics-page">

      {/* HEADER */}

      <div className="letter-navbar">
        <h2>
          🤖 AI Rhyming Words
        </h2>
      </div>

      {/* GAME INFO */}

      <div className="game-info">
        <span>
          Question:{" "}
          {completed
            ? TOTAL_QUESTIONS
            : Math.min(
                questionCount + 1,
                TOTAL_QUESTIONS
              )}
          /{TOTAL_QUESTIONS}
        </span>

        <span>
          Score: {score}
        </span>
      </div>

      {/* COMPLETED */}

      {completed ? (
        <div className="word-display">

          <div className="emoji">
            🎉
          </div>

          <h2>
            Round Completed!
          </h2>

          <h3>
            Score: {score}/
            {TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Excellent rhyming skills!"
              : score >= 3
              ? "👍 Great job! Keep practicing!"
              : "💡 Keep practicing your rhyming words!"}
          </p>

          <button
            className="option-btn"
            onClick={handlePlayAgain}
            disabled={loading}
          >
            🔄 Play Again
          </button>
        </div>
      ) : (
        <>
          {/* WORD */}

          <div className="word-display">

            <div className="emoji">
              {loading
                ? "⏳"
                : currentWord?.emoji ||
                  "🔤"}
            </div>

            <h2>
              {loading
                ? "Loading..."
                : currentWord?.word ||
                  "Loading..."}
            </h2>

          </div>

          {/* QUESTION */}

          <h3>
            Which word rhymes with:
          </h3>

          {/* OPTIONS */}

          <div className="options-grid">

            {loading ? (
              <p>
                Generating a question...
              </p>
            ) : (
              options.map(
                (word, index) => (
                  <button
                    key={`${word}-${index}`}
                    type="button"
                    className="option-btn"
                    onClick={() =>
                      handleAnswer(word)
                    }
                    disabled={
                      loading ||
                      completed ||
                      isAnswering
                    }
                  >
                    {word}
                  </button>
                )
              )
            )}

          </div>

          {/* FEEDBACK */}

          {feedback === "correct" && (
            <div className="feedback good">
              🎉 Correct!
            </div>
          )}

          {feedback === "wrong" && (
            <div className="feedback wrong">
              ❌ Try again!
            </div>
          )}

          {/* PERFORMANCE */}

          <div className="ai-analysis">
            <p>
              {getPerformanceMessage()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}