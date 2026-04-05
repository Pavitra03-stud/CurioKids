import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

export default function LeftRightPractice() {

  const TOTAL_QUESTIONS = 5;

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [line, setLine] = useState([]);
  const [target, setTarget] = useState("");
  const [direction, setDirection] = useState("");
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI GENERATION
  const generateQuestionAI = () => {
    try {
      setLoading(true);

      let base =
        mode === "numbers"
          ? ["1","2","3","4","5","6","7","8","9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const startIndex = Math.floor(Math.random() * (base.length - 4));
      const slice = base.slice(startIndex, startIndex + 4);

      const targetIndex = Math.floor(Math.random() * 4);
      const chosenTarget = slice[targetIndex];

      let dir, correct;

      if (targetIndex === 0) {
        dir = "RIGHT";
        correct = slice[1];
      } else if (targetIndex === 3) {
        dir = "LEFT";
        correct = slice[2];
      } else {
        if (Math.random() > 0.5) {
          dir = "RIGHT";
          correct = slice[targetIndex + 1];
        } else {
          dir = "LEFT";
          correct = slice[targetIndex - 1];
        }
      }

      setLine(slice);
      setTarget(chosenTarget);
      setDirection(dir);
      setAnswer(correct);

    } catch (err) {
      console.error(err);

      // fallback
      setLine(["A","B","C","D"]);
      setTarget("B");
      setDirection("RIGHT");
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
        game: `LeftRight_${mode}`
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

  // 📊 ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Direction Master!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Practice left/right!";
  };

  return (
    <div className="blend-container">

      <h2>👈👉 Left / Right Practice ({mode})</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      <h3>
        Which is to the <b>{direction}</b> of <b>{target}</b>?
      </h3>

      {/* LINE */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          line.map((item, i) => (
            <span key={i} className="sound-box">
              {item}
            </span>
          ))
        )}
      </div>

      {/* OPTIONS */}
      <div className="options">
        {loading ? (
          <p>Loading...</p>
        ) : (
          line.map((item, i) => (
            <button key={i} onClick={() => handleClick(item)}>
              {item}
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