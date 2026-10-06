import { useEffect, useState } from "react";
import { speak } from "../utils/speak";
import "../styles/ConfusingLetters.css";

import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

export default function ConfusingLetters() {
  const GAME_ID = "confusing-letters";
  const TOTAL_QUESTIONS = 5;

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    target: "",
    options: [],
    score: 0,
    questionCount: 0,
    mistakes: {},
    message: "",
  });

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [mistakes, setMistakes] = useState({});
  const [locked, setLocked] = useState(false);

  const [gameLoading, setGameLoading] = useState(true);

  // --------------------------------------------------
  // 🤖 AI QUESTION GENERATOR
  // --------------------------------------------------

  const generateQuestionAI = async (
    currentMistakes = mistakes,
    previousTarget = target
  ) => {
    try {
      setGameLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-confusing-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mistakes: currentMistakes,
          }),
        }
      );

      const data = await res.json();

      console.log("🤖 AI DATA:", data);

      if (!data.target || !data.options) {
        throw new Error("Invalid AI response");
      }

      let newTarget = String(data.target).toLowerCase();

      // Avoid repeating previous target
      if (newTarget === previousTarget) {
        const letters = [
          "b",
          "d",
          "p",
          "q",
          "m",
          "n",
          "u",
          "v",
          "c",
          "k",
          "g",
          "j",
          "s",
          "z",
        ];

        newTarget =
          letters[Math.floor(Math.random() * letters.length)];
      }

      const newOptions = data.options.map((letter) =>
        String(letter).toLowerCase()
      );

      setTarget(newTarget);
      setOptions(newOptions);

      speak(`Find the letter ${newTarget}`);

      return {
        target: newTarget,
        options: newOptions,
      };
    } catch (err) {
      console.error("❌ Frontend AI error:", err);

      const fallbackTarget = "b";

      const fallbackOptions = [
        "b",
        "d",
        "p",
        "q",
        "b",
        "d",
        "p",
        "q",
      ];

      setTarget(fallbackTarget);
      setOptions(fallbackOptions);

      return {
        target: fallbackTarget,
        options: fallbackOptions,
      };
    } finally {
      setGameLoading(false);
    }
  };

  // --------------------------------------------------
  // 🔥 RESTORE / START GAME
  // --------------------------------------------------

  useEffect(() => {
    if (progressLoading) return;

    let cancelled = false;

    const initializeGame = async () => {
      if (savedState) {
        console.log(
          "🔥 Resuming Confusing Letters:",
          savedState
        );

        setTarget(savedState.target || "");
        setOptions(savedState.options || []);

        setScore(savedState.score || 0);
        setQuestionCount(savedState.questionCount || 0);

        setMistakes(savedState.mistakes || {});
        setMessage(savedState.message || "");

        if (
          savedState.target &&
          savedState.options &&
          savedState.options.length > 0
        ) {
          setGameLoading(false);

          speak(
            `Find the letter ${savedState.target}`
          );

          return;
        }
      }

      // No saved game → create first question
      const question = await generateQuestionAI(
        savedState?.mistakes || {},
        savedState?.target || ""
      );

      if (cancelled) return;

      await save({
        target: question.target,
        options: question.options,
        score: savedState?.score || 0,
        questionCount: savedState?.questionCount || 0,
        mistakes: savedState?.mistakes || {},
        message: "",
      });
    };

    initializeGame();

    return () => {
      cancelled = true;
    };
  }, [progressLoading]);

  // --------------------------------------------------
  // 📊 ACTIVITY LOGGER
  // --------------------------------------------------

  const logActivity = async (finalScore) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn(
          "⚠️ No userId found. Activity not saved."
        );
        return;
      }

      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "letters",
        screen: "confusing-letters",
        score: finalScore,
        timestamp: new Date(),
      });

      console.log("✅ Activity logged");
    } catch (error) {
      console.error(
        "❌ Activity logging error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // ☁️ SAVE FINAL SCORE
  // --------------------------------------------------

  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn(
          "⚠️ No userId found. Score not saved."
        );
        return;
      }

      const userRef = doc(db, "users", userId);
      const gameResultsRef = collection(
        userRef,
        "game_results"
      );

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "ConfusingLetters_AI",
      });

      console.log("✅ Game result saved");
    } catch (error) {
      console.error(
        "❌ Error saving game result:",
        error
      );
    }
  };

  // --------------------------------------------------
  // 🎯 HANDLE LETTER CLICK
  // --------------------------------------------------

  const handleClick = async (letter) => {
    if (locked || gameLoading) return;

    if (questionCount >= TOTAL_QUESTIONS) return;

    setLocked(true);

    const isCorrect = letter === target;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const updatedMistakes = isCorrect
      ? mistakes
      : {
          ...mistakes,
          [target]: (mistakes[target] || 0) + 1,
        };

    setMistakes(updatedMistakes);

    if (isCorrect) {
      setScore(updatedScore);
      setMessage("🎉 Correct!");

      speak("Great job!");
    } else {
      setMessage("💛 Try again");

      speak("Try again");
    }

    // Save current answer state
    await save({
      target,
      options,
      score: updatedScore,
      questionCount,
      mistakes: updatedMistakes,
      message: isCorrect
        ? "🎉 Correct!"
        : "💛 Try again",
    });

    setTimeout(async () => {
      const nextCount = questionCount + 1;

      setMessage("");
      setLocked(false);

      setQuestionCount(nextCount);

      // ------------------------------------------------
      // 🏁 ROUND COMPLETED
      // ------------------------------------------------

      if (nextCount === TOTAL_QUESTIONS) {
        const finalPercentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        console.log(
          "🏁 Confusing Letters completed:",
          updatedScore,
          finalPercentage
        );

        // ⭐ Main progress system
        await finish(
          finalPercentage,
          "Confusing Letters"
        );

        // 📊 Activity
        await logActivity(finalPercentage);

        // ☁️ Original game result
        await saveScoreToFirestore(updatedScore);

        alert(
          `🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // Reset
        setScore(0);
        setQuestionCount(0);
        setMistakes({});
        setMessage("");

        // Generate fresh question
        const nextQuestion =
          await generateQuestionAI({}, target);

        await save({
          target: nextQuestion.target,
          options: nextQuestion.options,
          score: 0,
          questionCount: 0,
          mistakes: {},
          message: "",
        });
      } else {
        // ------------------------------------------------
        // ➡️ NEXT QUESTION
        // ------------------------------------------------

        const nextQuestion =
          await generateQuestionAI(
            updatedMistakes,
            target
          );

        await save({
          target: nextQuestion.target,
          options: nextQuestion.options,
          score: updatedScore,
          questionCount: nextCount,
          mistakes: updatedMistakes,
          message: "",
        });
      }
    }, 800);
  };

  // --------------------------------------------------
  // 📊 PERFORMANCE MESSAGE
  // --------------------------------------------------

  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice more!";
  };

  // --------------------------------------------------
  // ⏳ LOADING
  // --------------------------------------------------

  if (progressLoading || gameLoading) {
    return (
      <div className="confusing-page">
        <div className="confusing-navbar">
          <div className="navbar-title">
            🤖 AI Letter Trainer
          </div>
        </div>

        <div className="confusing-content">
          <p>Loading your game...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 🎨 UI
  // --------------------------------------------------

  return (
    <div className="confusing-page">
      <div className="confusing-navbar">
        <div className="navbar-title">
          🤖 AI Letter Trainer
        </div>
      </div>

      <div className="confusing-content">
        <h3>
          Question {questionCount + 1} /{" "}
          {TOTAL_QUESTIONS}
        </h3>

        <h2 className="instruction">
          Find:
          <span className="target">
            {" "}
            {target || "..."}
          </span>
        </h2>

        <div className="letters-grid">
          {options.length > 0 ? (
            options.map((letter, index) => (
              <div
                key={index}
                className="letter-box"
                onClick={() =>
                  handleClick(letter)
                }
              >
                {letter}
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="feedback">
          {message}
        </div>

        <div className="score">
          ⭐ Score: {score}
        </div>

        <div className="ai-analysis">
          {getPerformanceMessage()}
        </div>
      </div>
    </div>
  );
}