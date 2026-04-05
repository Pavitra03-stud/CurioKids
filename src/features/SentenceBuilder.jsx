import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function SentenceBuilder() {

  const TOTAL_QUESTIONS = 5;

  const [shuffled, setShuffled] = useState([]);
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

      const res = await fetch("http://localhost:5000/api/generate-sentence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!data.shuffled || !data.options || !data.answer) {
        throw new Error("Invalid data");
      }

      setShuffled(data.shuffled);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

    } catch (err) {
      console.error(err);

      setShuffled(["the","cat","is"]);
      setOptions(["the cat is","cat is the","is the cat"]);
      setCorrectAnswer("the cat is");
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
        game: "SentenceBuilder_AI"
      });

    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 HANDLE CLICK
  const handleClick = (sentence) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = sentence === correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

    setTimeout(async () => {

      setMessage("");

      const next = questionCount + 1;
      setQuestionCount(next);

      if (next === TOTAL_QUESTIONS) {

        await saveScoreToFirestore(updatedScore);

        alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        setScore(updatedScore);
        generateQuestionAI();
      }

    }, 900);
  };

  // 📊 ANALYSIS
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent sentence building!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Practice sentence formation!";
  };

  return (
    <div className="blend-container">

      <h2>🤖 Sentence Builder</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      {/* 🔤 SHUFFLED WORDS */}
      <div className="sounds">
        {loading ? (
          <p>Loading...</p>
        ) : (
          shuffled.map((w, i) => (
            <span key={i} className="sound-box">
              {w}
            </span>
          ))
        )}
      </div>

      <h3>Choose the correct sentence</h3>

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