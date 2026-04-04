import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function BreakWord() {

  const TOTAL_QUESTIONS = 5;

  const [word, setWord] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI QUESTION
  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/generate-break-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      console.log("AI DATA:", data);

      if (!data.word || !data.options || !data.answer) {
        throw new Error("Invalid data");
      }

      setWord(data.word);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

    } catch (err) {
      console.error(err);

      // fallback
      setWord("CAT");
      setOptions(["c - a - t","ca - t","c - at","cat"]);
      setCorrectAnswer("c - a - t");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestionAI();
  }, []);

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
        game: "BreakWord_AI"
      });

    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 HANDLE CLICK
  const handleClick = (option) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = option === correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(updatedScore);
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Try again!");
    }

    setTimeout(async () => {

      setMessage("");

      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      if (nextCount === TOTAL_QUESTIONS) {

        await saveScoreToFirestore(updatedScore);

        alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        generateQuestionAI();
      }

    }, 900);
  };

  // 📊 ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent segmentation!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Practice breaking words!";
  };

  return (
    <div className="blend-container">

      <h2>🤖 Break the Word</h2>

      <div className="game-info">
        <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
        <span>Score: {score}</span>
      </div>

      {/* WORD */}
      <div className="big-letter">
        {loading ? "..." : word}
      </div>

      <h3>Break this word into sounds</h3>

      {/* OPTIONS */}
      <div className="options">
        {loading ? (
          <p>Loading...</p>
        ) : (
          options.map((opt, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() => handleClick(opt)}
            >
              {opt}
            </button>
          ))
        )}
      </div>

      <p className="message">{message}</p>

      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>

    </div>
  );
}