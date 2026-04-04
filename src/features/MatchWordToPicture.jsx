import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function MatchWordToPicture() {

  const TOTAL_QUESTIONS = 5;

  const [word, setWord] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI QUESTION
  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/generate-match-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!data.word || !data.options) {
        throw new Error("Invalid data");
      }

      setWord(data.word);
      setOptions(data.options);

    } catch (err) {
      console.error(err);

      setWord("Dog");
      setOptions([
        { word: "Dog", emoji: "🐶" },
        { word: "Cat", emoji: "🐱" },
        { word: "Ball", emoji: "⚽" },
        { word: "Fish", emoji: "🐟" }
      ]);
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
        game: "MatchWordToPicture_AI"
      });

    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 CLICK
  const handleClick = (item) => {

    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = item.word === word;
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

    if (accuracy > 80) return "🌟 Excellent!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Keep practicing!";
  };

  return (
    <div className="blend-container">

      <h2>🖼️ Match Word to Picture</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      <h2>Find: {word}</h2>

      <div className="options">
        {loading ? (
          <p>Loading...</p>
        ) : (
          options.map((item, i) => (
            <button key={i} onClick={() => handleClick(item)}>
              {item.emoji}
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