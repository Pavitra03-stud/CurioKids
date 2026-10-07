import { useEffect, useRef, useState } from "react";
import "../styles/SoundMatching.css";

import useGameProgress from "../hooks/useGameProgress";

import { auth, db } from "../firebase";

import {
  addDoc,
  collection,
  doc,
  Timestamp,
} from "firebase/firestore";

export default function SoundMatching() {
  // =====================================================
  // SETTINGS
  // =====================================================

  const TOTAL_QUESTIONS = 5;
  const GAME_ID = "sound-matching";
  const GAME_NAME = "AI Sound Matching";

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

  const [currentSound, setCurrentSound] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  const [isAnswering, setIsAnswering] = useState(false);

  // =====================================================
  // REFS
  // =====================================================

  const initializedRef = useRef(false);
  const answeringRef = useRef(false);

  const usedQuestionsRef = useRef([]);

  // =====================================================
  // FALLBACK QUESTIONS
  // =====================================================

  const FALLBACK_QUESTIONS = [
    {
      currentSound: "B",
      options: [
        { word: "Ball", sound: "B", emoji: "⚽" },
        { word: "Cat", sound: "C", emoji: "🐱" },
        { word: "Dog", sound: "D", emoji: "🐶" },
        { word: "Sun", sound: "S", emoji: "☀️" },
      ],
    },

    {
      currentSound: "C",
      options: [
        { word: "Cat", sound: "C", emoji: "🐱" },
        { word: "Ball", sound: "B", emoji: "⚽" },
        { word: "Fish", sound: "F", emoji: "🐟" },
        { word: "Moon", sound: "M", emoji: "🌙" },
      ],
    },

    {
      currentSound: "D",
      options: [
        { word: "Dog", sound: "D", emoji: "🐶" },
        { word: "Sun", sound: "S", emoji: "☀️" },
        { word: "Ball", sound: "B", emoji: "⚽" },
        { word: "Fish", sound: "F", emoji: "🐟" },
      ],
    },

    {
      currentSound: "F",
      options: [
        { word: "Fish", sound: "F", emoji: "🐟" },
        { word: "Cat", sound: "C", emoji: "🐱" },
        { word: "Moon", sound: "M", emoji: "🌙" },
        { word: "Dog", sound: "D", emoji: "🐶" },
      ],
    },

    {
      currentSound: "M",
      options: [
        { word: "Moon", sound: "M", emoji: "🌙" },
        { word: "Sun", sound: "S", emoji: "☀️" },
        { word: "Ball", sound: "B", emoji: "⚽" },
        { word: "Fish", sound: "F", emoji: "🐟" },
      ],
    },

    {
      currentSound: "S",
      options: [
        { word: "Sun", sound: "S", emoji: "☀️" },
        { word: "Dog", sound: "D", emoji: "🐶" },
        { word: "Cat", sound: "C", emoji: "🐱" },
        { word: "Moon", sound: "M", emoji: "🌙" },
      ],
    },

    {
      currentSound: "T",
      options: [
        { word: "Tiger", sound: "T", emoji: "🐯" },
        { word: "Apple", sound: "A", emoji: "🍎" },
        { word: "Ball", sound: "B", emoji: "⚽" },
        { word: "Fish", sound: "F", emoji: "🐟" },
      ],
    },

    {
      currentSound: "A",
      options: [
        { word: "Apple", sound: "A", emoji: "🍎" },
        { word: "Dog", sound: "D", emoji: "🐶" },
        { word: "Sun", sound: "S", emoji: "☀️" },
        { word: "Tiger", sound: "T", emoji: "🐯" },
      ],
    },

    {
      currentSound: "P",
      options: [
        { word: "Pencil", sound: "P", emoji: "✏️" },
        { word: "Moon", sound: "M", emoji: "🌙" },
        { word: "Cat", sound: "C", emoji: "🐱" },
        { word: "Ball", sound: "B", emoji: "⚽" },
      ],
    },

    {
      currentSound: "R",
      options: [
        { word: "Rabbit", sound: "R", emoji: "🐰" },
        { word: "Fish", sound: "F", emoji: "🐟" },
        { word: "Sun", sound: "S", emoji: "☀️" },
        { word: "Apple", sound: "A", emoji: "🍎" },
      ],
    },
  ];

  // =====================================================
  // QUESTION KEY
  // =====================================================

  const getQuestionKey = (question) => {
    if (!question) return "";

    const sound = String(question.currentSound || "")
      .trim()
      .toUpperCase();

    const words = Array.isArray(question.options)
      ? question.options
          .map((item) => item.word)
          .sort()
          .join("|")
      : "";

    return `${sound}-${words}`;
  };

  // =====================================================
  // FALLBACK QUESTION
  // =====================================================

  const getFallbackQuestion = () => {
    let available = FALLBACK_QUESTIONS.filter((question) => {
      const key = getQuestionKey(question);

      return !usedQuestionsRef.current.includes(key);
    });

    if (available.length === 0) {
      usedQuestionsRef.current = [];
      available = [...FALLBACK_QUESTIONS];
    }

    const randomIndex = Math.floor(
      Math.random() * available.length
    );

    const question = available[randomIndex];

    const key = getQuestionKey(question);

    usedQuestionsRef.current.push(key);

    return question;
  };

  // =====================================================
  // APPLY QUESTION
  // =====================================================

  const applyQuestion = (question) => {
    if (!question) return;

    setCurrentSound(
      String(question.currentSound || "")
        .trim()
        .toUpperCase()
    );

    setOptions(
      Array.isArray(question.options)
        ? question.options
        : []
    );

    setFeedback("");
    setIsAnswering(false);

    answeringRef.current = false;
  };

  // =====================================================
  // GENERATE AI QUESTION
  // =====================================================

  const generateQuestionAI = async () => {
    console.log("🤖 Generating Sound Matching question...");

    setLoading(true);

    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const controller = new AbortController();

          const timeout = setTimeout(() => {
            controller.abort();
          }, 8000);

          const response = await fetch(
            "http://localhost:5000/api/generate-sound-matching",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          );

          clearTimeout(timeout);

          if (!response.ok) {
            throw new Error(
              `API error: ${response.status}`
            );
          }

          const data = await response.json();

          console.log(
            "🤖 SOUND MATCHING API:",
            data
          );

          if (
            !data.sound ||
            !Array.isArray(data.options) ||
            data.options.length < 2
          ) {
            throw new Error("Invalid AI response");
          }

          const question = {
            currentSound: String(data.sound)
              .trim()
              .toUpperCase(),

            options: data.options.map((item) => ({
              word: String(item.word || "").trim(),

              sound: String(item.sound || "")
                .trim()
                .toUpperCase(),

              emoji: item.emoji || "🌟",
            })),
          };

          const key = getQuestionKey(question);

          if (
            usedQuestionsRef.current.includes(key)
          ) {
            console.log(
              "🔁 Duplicate question. Trying another..."
            );

            continue;
          }

          usedQuestionsRef.current.push(key);

          applyQuestion(question);

          return question;
        } catch (error) {
          console.warn(
            `⚠️ AI attempt ${attempt + 1} failed`,
            error
          );
        }
      }

      console.log("🛟 Using fallback question");

      const fallback = getFallbackQuestion();

      applyQuestion(fallback);

      return fallback;
    } catch (error) {
      console.error(
        "❌ Sound Matching generation failed:",
        error
      );

      const fallback = getFallbackQuestion();

      applyQuestion(fallback);

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SAVE GAME RESULT
  // =====================================================

  const saveGameResult = async (finalScore) => {
    try {
      const userId =
        auth.currentUser?.uid ||
        localStorage.getItem("userId");

      if (!userId) {
        console.warn("⚠️ No Firebase user");
        return;
      }

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(
        collection(
          doc(db, "users", userId),
          "game_results"
        ),
        {
          userId,
          gameId: GAME_ID,
          game: GAME_NAME,
          score: finalScore,
          totalQuestions: TOTAL_QUESTIONS,
          accuracy: Number(accuracy.toFixed(2)),
          completed: true,
          createdAt: Timestamp.now(),
        }
      );

      console.log("✅ Game result saved");
    } catch (error) {
      console.error(
        "❌ Game result save failed:",
        error
      );
    }
  };

  // =====================================================
  // ACTIVITY LOG
  // =====================================================

  const logActivity = async (finalScore) => {
    try {
      const userId =
        auth.currentUser?.uid ||
        localStorage.getItem("userId");

      if (!userId) return;

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(collection(db, "activity"), {
        userId,
        action: "game_completed",
        module: "Sound Matching",
        screen: "sound-matching",
        gameId: GAME_ID,
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: Number(accuracy.toFixed(2)),
        timestamp: Timestamp.now(),
      });

      console.log("✅ Activity logged");
    } catch (error) {
      console.error(
        "❌ Activity log failed:",
        error
      );
    }
  };

  // =====================================================
  // RESTORE / START
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    if (savedState === null) return;

    if (initializedRef.current) return;

    initializedRef.current = true;

    const startGame = async () => {
      // =================================================
      // RESUME
      // =================================================

      if (
        savedState &&
        Object.keys(savedState).length > 0 &&
        savedState.currentSound &&
        Array.isArray(savedState.options) &&
        savedState.options.length > 0
      ) {
        console.log(
          "🔥 Resuming Sound Matching:",
          savedState
        );

        setCurrentSound(
          savedState.currentSound
        );

        setOptions(savedState.options);

        setScore(
          Number(savedState.score) || 0
        );

        setQuestionCount(
          Number(savedState.questionCount) || 0
        );

        setCompleted(
          Boolean(savedState.completed)
        );

        setFeedback("");

        if (
          Array.isArray(savedState.usedQuestions)
        ) {
          usedQuestionsRef.current =
            savedState.usedQuestions;
        }

        setLoading(false);

        answeringRef.current = false;

        setIsAnswering(false);

        return;
      }

      // =================================================
      // NEW GAME
      // =================================================

      console.log(
        "🆕 Starting new Sound Matching game"
      );

      usedQuestionsRef.current = [];

      setScore(0);
      setQuestionCount(0);
      setCompleted(false);
      setFeedback("");

      const question =
        await generateQuestionAI();

      if (!question) return;

      await save({
        currentSound:
          question.currentSound,

        options:
          question.options,

        score: 0,

        questionCount: 0,

        feedback: "",

        completed: false,

        usedQuestions:
          usedQuestionsRef.current,
      });
    };

    startGame();
  }, [progressLoading, savedState]);

  // =====================================================
  // HANDLE ANSWER
  // =====================================================

  const handleAnswer = (item) => {
    if (
      loading ||
      completed ||
      isAnswering ||
      answeringRef.current
    ) {
      return;
    }

    answeringRef.current = true;

    setIsAnswering(true);

    const selectedSound = String(
      item.sound || ""
    )
      .trim()
      .toUpperCase();

    const correctSound = String(
      currentSound || ""
    )
      .trim()
      .toUpperCase();

    const isCorrect =
      selectedSound === correctSound;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    console.log("🎯 Selected:", item.word);

    console.log("🎯 Correct:", correctSound);

    setScore(updatedScore);

    setFeedback(
      isCorrect
        ? "correct"
        : "wrong"
    );

    // =================================================
    // MOVE AFTER FEEDBACK
    // =================================================

    setTimeout(async () => {
      try {
        const nextCount =
          questionCount + 1;

        // =================================================
        // COMPLETED
        // =================================================

        if (
          nextCount >= TOTAL_QUESTIONS
        ) {
          const percentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏆 Sound Matching completed",
            {
              score: updatedScore,
              percentage,
            }
          );

          await saveGameResult(
            updatedScore
          );

          await logActivity(
            updatedScore
          );

          await finish(
            percentage,
            GAME_NAME
          );

          setQuestionCount(
            TOTAL_QUESTIONS
          );

          setScore(updatedScore);

          setCompleted(true);

          setFeedback("");

          setLoading(false);

          setIsAnswering(false);

          answeringRef.current = false;

          return;
        }

        // =================================================
        // NEXT QUESTION
        // =================================================

        setLoading(true);

        setFeedback("");

        const nextQuestion =
          await generateQuestionAI();

        if (!nextQuestion) {
          throw new Error(
            "Next question failed"
          );
        }

        setQuestionCount(
          nextCount
        );

        // Save next state
        await save({
          currentSound:
            nextQuestion.currentSound,

          options:
            nextQuestion.options,

          score: updatedScore,

          questionCount:
            nextCount,

          feedback: "",

          completed: false,

          usedQuestions:
            usedQuestionsRef.current,
        });

        setLoading(false);

        setIsAnswering(false);

        answeringRef.current = false;
      } catch (error) {
        console.error(
          "❌ Next question error:",
          error
        );

        setLoading(false);

        setIsAnswering(false);

        answeringRef.current = false;
      }
    }, 650);
  };

  // =====================================================
  // PLAY AGAIN
  // =====================================================

  const playAgain = async () => {
    console.log(
      "🔄 Playing Sound Matching again"
    );

    setScore(0);

    setQuestionCount(0);

    setFeedback("");

    setCompleted(false);

    setLoading(true);

    setIsAnswering(false);

    answeringRef.current = false;

    usedQuestionsRef.current = [];

    const question =
      await generateQuestionAI();

    if (!question) {
      setLoading(false);
      return;
    }

    await save({
      currentSound:
        question.currentSound,

      options:
        question.options,

      score: 0,

      questionCount: 0,

      feedback: "",

      completed: false,

      usedQuestions:
        usedQuestionsRef.current,
    });

    setLoading(false);
  };

  // =====================================================
  // PERFORMANCE
  // =====================================================

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "🌱 Let's learn some sounds!";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy >= 80) {
      return "🌟 Amazing! Your sound skills are growing!";
    }

    if (accuracy >= 50) {
      return "💚 Great work! Keep going!";
    }

    return "🌱 Keep practicing. You can do it!";
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (
    progressLoading ||
    savedState === null
  ) {
    return (
      <div className="sound-page">
        <div className="sound-loading">
          <div className="loading-emoji">
            🐝
          </div>

          <h2>
            Getting your sounds ready...
          </h2>

          <p>
            Let's learn together! 🌱
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="sound-page">

      {/* Decorative jungle elements */}

      <div className="jungle-leaf leaf-left">
        🌿
      </div>

      <div className="jungle-leaf leaf-right">
        🍃
      </div>

      <div className="jungle-bird">
        🐦
      </div>

      {/* NAVBAR */}

      <header className="sound-navbar">
        <div className="sound-navbar-brand">
          🌴 CurioKids
        </div>

        <div className="sound-navbar-title">
          🔊 Sound Matching
        </div>
      </header>

      {/* MAIN */}

      <main className="sound-container">

        {/* GAME HEADER */}

        <section className="sound-header">

          <div className="header-icon">
            🔊
          </div>

          <div>
            <h1>
              Sound Match Adventure
            </h1>

            <p>
              Listen carefully and find the word that begins with the sound!
            </p>
          </div>

        </section>

        {/* STATS */}

        <section className="sound-stats">

          <div className="stat-card">
            <span className="stat-icon">
              🧩
            </span>

            <div>
              <small>
                Question
              </small>

              <strong>
                {completed
                  ? TOTAL_QUESTIONS
                  : Math.min(
                      questionCount + 1,
                      TOTAL_QUESTIONS
                    )}

                <span>
                  /{TOTAL_QUESTIONS}
                </span>
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">
              ⭐
            </span>

            <div>
              <small>
                Stars
              </small>

              <strong>
                {score}
              </strong>
            </div>
          </div>

        </section>

        {/* PROGRESS */}

        <div className="question-progress">

          <div className="progress-label">

            <span>
              🌿 Your adventure
            </span>

            <span>
              {Math.round(
                (questionCount /
                  TOTAL_QUESTIONS) *
                  100
              )}
              %
            </span>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${
                  Math.min(
                    (questionCount /
                      TOTAL_QUESTIONS) *
                      100,
                    100
                  )
                }%`,
              }}
            />

          </div>

        </div>

        {/* GAME CARD */}

        <section className="sound-card">

          {!completed ? (
            <>

              {/* QUESTION */}

              <div className="question-heading">

                <span>
                  👂 Listen carefully!
                </span>

                <h2>
                  Which word starts with this sound?
                </h2>

              </div>

              {/* SOUND */}

              <div
                className={`sound-letter ${
                  loading
                    ? "sound-letter-loading"
                    : ""
                }`}
              >
                {loading
                  ? "..."
                  : currentSound}
              </div>

              {!loading && (
                <p className="sound-hint">
                  Find the word beginning with{" "}
                  <strong>
                    {currentSound}
                  </strong>
                </p>
              )}

              {/* ANSWERS */}

              <div className="answer-grid">

                {loading ? (
                  <>
                    <div className="answer-skeleton" />
                    <div className="answer-skeleton" />
                    <div className="answer-skeleton" />
                    <div className="answer-skeleton" />
                  </>
                ) : (
                  options.map(
                    (item, index) => (
                      <button
                        key={`${item.word}-${index}`}
                        type="button"
                        className="answer-card"
                        onClick={() =>
                          handleAnswer(item)
                        }
                        disabled={
                          isAnswering ||
                          loading
                        }
                      >

                        <span className="answer-emoji">
                          {item.emoji || "🌟"}
                        </span>

                        <span className="answer-word">
                          {item.word}
                        </span>

                      </button>
                    )
                  )
                )}

              </div>

              {/* FEEDBACK */}

              {feedback === "correct" && (
                <div className="feedback-card correct-feedback">

                  <span>
                    🎉
                  </span>

                  <div>
                    <strong>
                      Fantastic!
                    </strong>

                    <p>
                      That's the correct sound!
                    </p>
                  </div>

                </div>
              )}

              {feedback === "wrong" && (
                <div className="feedback-card wrong-feedback">

                  <span>
                    💚
                  </span>

                  <div>
                    <strong>
                      Nice try!
                    </strong>

                    <p>
                      Keep listening and try the next one.
                    </p>
                  </div>

                </div>
              )}

              {/* ENCOURAGEMENT */}

              {!feedback && (
                <div className="encouragement">
                  {getPerformanceMessage()}
                </div>
              )}

            </>
          ) : (

            /* COMPLETION */

            <div className="completion-card">

              <div className="completion-stars">
                ⭐ ⭐ ⭐
              </div>

              <div className="completion-emoji">
                🥳
              </div>

              <h2>
                Sound Adventure Complete!
              </h2>

              <p>
                You did a wonderful job!
              </p>

              <div className="final-score">

                <span>
                  Your Score
                </span>

                <strong>
                  {score}
                  <small>
                    /{TOTAL_QUESTIONS}
                  </small>
                </strong>

              </div>

              <div className="completion-message">

                {score === TOTAL_QUESTIONS
                  ? "🌟 Perfect! You're a sound superstar!"
                  : score >= 3
                  ? "💚 Great job! Keep exploring sounds!"
                  : "🌱 Keep practicing. You're getting better!"}

              </div>

              <button
                type="button"
                className="play-again-button"
                onClick={playAgain}
                disabled={loading}
              >
                🔄
                <span>
                  Play Again
                </span>
              </button>

            </div>

          )}

        </section>

        {/* FOOTER */}

        <div className="sound-footer">

          <span>
            🌱 Learn
          </span>

          <span>
            💚 Practice
          </span>

          <span>
            ⭐ Grow
          </span>

        </div>

      </main>

    </div>
  );
}