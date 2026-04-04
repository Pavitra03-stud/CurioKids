import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

export default function SequenceBuilder() {

  const TOTAL_QUESTIONS = 5;

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI GENERATION
  const generateQuestionAI = () => {
    try {
      setLoading(true);

      if (mode === "numbers") {
        const start = Math.floor(Math.random() * 5) + 1;

        const correct = (start + 2).toString();

        setSequence([
          start.toString(),
          (start + 1).toString(),
          "_",
          (start + 3).toString()
        ]);

        setAnswer(correct);

        const opts = [
          correct,
          (start + 4).toString(),
          (start + 1).toString()
        ].sort(() => 0.5 - Math.random());

        setOptions(opts);

      } else {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const index = Math.floor(Math.random() * 20);

        const correct = letters[index + 2];

        setSequence([
          letters[index],
          letters[index + 1],
          "_",
          letters[index + 3]
        ]);

        setAnswer(correct);

        const opts = [
          correct,
          letters[index + 4],
          letters[index + 1]
        ].sort(() => 0.5 - Math.random());

        setOptions(opts);
      }

    } catch (err) {
      console.error(err);

      // fallback
      setSequence(["A","B","_","D"]);
      setOptions(["C","E","B"]);
      setAnswer("C");
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
        game: `SequenceBuilder_${mode}`
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

    if (accuracy > 80) return "🌟 Pattern Master!";
    if (accuracy > 50) return "👍 Good thinking!";
    return "💡 Practice patterns!";
  };

  return (
    <div className="blend-container">

      <h2>🔢 Sequence Builder ({mode})</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      {/* SEQUENCE */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          sequence.map((s, i) => (
            <span key={i} className="sound-box">
              {s}
            </span>
          ))
        )}
      </div>

      <h3>Fill the missing item</h3>

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