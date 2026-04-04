import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

export default function TimedChallenge() {

  const TOTAL_QUESTIONS = 5;
  const TIME_LIMIT = 5; // seconds

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [message, setMessage] = useState("");

  // 🤖 AI QUESTION
  const generateQuestionAI = () => {
    const base =
      mode === "numbers"
        ? ["1","2","3","4","5","6","7","8","9"]
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const correct =
      base[Math.floor(Math.random() * base.length)];

    const wrong = base
      .filter(l => l !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const opts = [correct, ...wrong].sort(() => 0.5 - Math.random());

    setTarget(correct);
    setOptions(opts);
    setTimeLeft(TIME_LIMIT);
  };

  useEffect(() => {
    generateQuestionAI();
  }, [mode]);

  // ⏳ TIMER
  useEffect(() => {
    if (questionCount >= TOTAL_QUESTIONS) return;

    if (timeLeft === 0) {
      handleNext(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // 🎯 HANDLE ANSWER
  const handleClick = (item) => {
    const isCorrect = item === target;
    handleNext(isCorrect);
  };

  const handleNext = async (isCorrect) => {

    const updatedScore = isCorrect ? score + 1 : score;

    setMessage(
      isCorrect ? "⚡ Correct!" : "⏳ Time up / Wrong!"
    );

    setTimeout(async () => {

      setMessage("");

      const next = questionCount + 1;
      setQuestionCount(next);

      if (next === TOTAL_QUESTIONS) {

        await saveScoreToFirestore(updatedScore);

        alert(`🏁 Finished!\nScore: ${updatedScore}/5`);

        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        setScore(updatedScore);
        generateQuestionAI();
      }

    }, 800);
  };

  // ☁️ SAVE
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userEmail = "demo_user";

      const userRef = doc(db, "users", userEmail);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: `TimedChallenge_${mode}`
      });

    } catch (error) {
      console.error(error);
    }
  };

  // 📊 ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🚀 Super fast!";
    if (accuracy > 50) return "👍 Good speed!";
    return "💡 Try faster!";
  };

  return (
    <div className="blend-container">

      <h2>⏱️ Timed Challenge ({mode})</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      <h1>⏳ {timeLeft}s</h1>

      <h2>Find: {target}</h2>

      <div className="options">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleClick(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <p>{message}</p>

      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>

    </div>
  );
}