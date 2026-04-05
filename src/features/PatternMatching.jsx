import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

export default function PatternMatching() {

  const TOTAL_QUESTIONS = 5;

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [pattern, setPattern] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI GENERATOR
  const generateQuestionAI = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? ["1","2","3","4","5","6","7","8","9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const a = base[Math.floor(Math.random() * base.length)];
      let b;

      do {
        b = base[Math.floor(Math.random() * base.length)];
      } while (b === a);

      const type = Math.random();

      let newPattern, correct;

      if (type < 0.5) {
        // ABAB_
        newPattern = [a, b, a, b, "?"];
        correct = a;
      } else {
        // AABB_
        newPattern = [a, a, b, b, "?"];
        correct = b;
      }

      const wrong = base
        .filter((l) => l !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const opts = [correct, ...wrong].sort(() => 0.5 - Math.random());

      setPattern(newPattern);
      setAnswer(correct);
      setOptions(opts);

    } catch (err) {
      console.error(err);

      // fallback
      setPattern(["A","B","A","B","?"]);
      setOptions(["A","C","D"]);
      setAnswer("A");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestionAI();
  }, [mode]);

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
        game: `PatternMatching_${mode}`
      });

    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 CLICK
  const handleClick = (item) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = item === answer;
    const updatedScore = isCorrect ? score + 1 : score;

    setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

    setTimeout(async () => {

      setMessage("");

      const next = questionCount + 1;
      setQuestionCount(next);

      if (next === TOTAL_QUESTIONS) {

        await saveScoreToFirestore(updatedScore);

        alert(`🎯 Completed!\nScore: ${updatedScore}/5`);

        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        setScore(updatedScore);
        generateQuestionAI();
      }

    }, 800);
  };

  // 📊 AI ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Pattern Genius!";
    if (accuracy > 50) return "👍 Nice thinking!";
    return "💡 Practice patterns!";
  };

  return (
    <div className="blend-container">

      <h2>🧠 Pattern Matching ({mode})</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      {/* PATTERN */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          pattern.map((item, i) => (
            <span key={i} className="sound-box">
              {item}
            </span>
          ))
        )}
      </div>

      <h3>What comes next?</h3>

      {/* OPTIONS */}
      <div className="options">
        {loading ? (
          <p>Loading...</p>
        ) : (
          options.map((opt, i) => (
            <button key={i} onClick={() => handleClick(opt)}>
              {opt}
            </button>
          ))
        )}
      </div>

      <p>{message}</p>

      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>

    </div>
  );
}