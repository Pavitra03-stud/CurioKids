import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

export default function SpotDifference() {

  const TOTAL_QUESTIONS = 5;

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);
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

      const newRow1 = Array(4)
        .fill(null)
        .map(() => base[Math.floor(Math.random() * base.length)]);

      const newRow2 = [...newRow1];

      const diffIndex = Math.floor(Math.random() * 4);

      let different;
      do {
        different = base[Math.floor(Math.random() * base.length)];
      } while (different === newRow1[diffIndex]);

      newRow2[diffIndex] = different;

      setRow1(newRow1);
      setRow2(newRow2);
      setAnswer(different);

    } catch (err) {
      console.error(err);

      // fallback
      setRow1(["A","B","C","D"]);
      setRow2(["A","B","X","D"]);
      setAnswer("X");
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
        game: `SpotDifference_${mode}`
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

    if (accuracy > 80) return "🌟 Eagle Eyes!";
    if (accuracy > 50) return "👍 Good spotting!";
    return "💡 Focus more!";
  };

  return (
    <div className="blend-container">

      <h2>👀 Spot the Difference ({mode})</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      {/* ROW 1 */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          row1.map((item, i) => (
            <span key={i} className="sound-box">
              {item}
            </span>
          ))
        )}
      </div>

      {/* ROW 2 */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          row2.map((item, i) => (
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