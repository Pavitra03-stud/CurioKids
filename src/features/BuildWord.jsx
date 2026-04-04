import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function BuildWord() {

  const TOTAL_QUESTIONS = 5;

  const [displayWord, setDisplayWord] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI
  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/generate-build-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      setDisplayWord(data.display);
      setOptions(data.options);
      setCorrectAnswer(data.answer);

    } catch (err) {
      console.error(err);

      setDisplayWord("_ A T");
      setOptions(["c","b","m","s"]);
      setCorrectAnswer("c");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateQuestionAI();
  }, []);

  // ☁️ SAVE
  const saveScoreToFirestore = async (finalScore) => {
    const userRef = doc(db, "users", "demo_user");
    const gameResultsRef = collection(userRef, "game_results");

    await addDoc(gameResultsRef, {
      score: finalScore,
      totalQuestions: TOTAL_QUESTIONS,
      createdAt: Timestamp.now(),
      game: "BuildWord_AI"
    });
  };

  const handleClick = (letter) => {

    const isCorrect = letter === correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;

    setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

    setTimeout(async () => {

      setMessage("");

      const next = questionCount + 1;
      setQuestionCount(next);

      if (next === TOTAL_QUESTIONS) {

        await saveScoreToFirestore(updatedScore);

        alert(`Score: ${updatedScore}/${TOTAL_QUESTIONS}`);

        setScore(0);
        setQuestionCount(0);
        generateQuestionAI();

      } else {
        setScore(updatedScore);
        generateQuestionAI();
      }

    }, 800);
  };

  return (
    <div className="blend-container">

      <h2>🤖 Build the Word</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      <div className="big-letter">
        {loading ? "..." : displayWord}
      </div>

      <div className="options">
        {options.map((l, i) => (
          <button key={i} onClick={() => handleClick(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <p>{message}</p>

    </div>
  );
}