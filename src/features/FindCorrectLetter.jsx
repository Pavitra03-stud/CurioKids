import { useState, useEffect } from "react";
import "../styles/FindCorrectLetter.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function FindCorrectLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const TOTAL_QUESTIONS = 5;

  // 🤖 States
  const [targetLetter, setTargetLetter] = useState("");
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  // 🤖 AI Question Generator (SAFE VERSION)
  const generateQuestionAI = () => {
    if (!letters || letters.length === 0) {
      return {
        question: "A",
        options: ["A", "B", "C", "D", "E", "F"],
      };
    }

    const correct =
      letters[Math.floor(Math.random() * letters.length)];

    const wrong = letters
      .filter((l) => l !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const options = [...wrong, correct].sort(
      () => 0.5 - Math.random()
    );

    return {
      question: correct,
      options,
    };
  };

  const loadNewQuestion = () => {
    const q = generateQuestionAI();

    // ✅ SAFETY CHECK (fix empty UI bug)
    if (!q.question || !q.options || q.options.length === 0) {
      setTargetLetter("A");
      setOptions(["A", "B", "C", "D", "E", "F"]);
      return;
    }

    setTargetLetter(q.question);
    setOptions(q.options);
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  // 📊 Save to Firestore
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userEmail = "demo_user"; // later replace with logged user

      const userRef = doc(db, "users", userEmail);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "FindCorrectLetter",
      });

      console.log("✅ Saved result");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  // 🎯 Handle Answer
  const handleClick = (letter) => {
    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = letter === targetLetter;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    setTimeout(async () => {
      setFeedback("");

      const nextCount = questionCount + 1;
      const finalScore = score + (isCorrect ? 1 : 0);

      setQuestionCount(nextCount);

      // 🎯 END OF ROUND
      if (nextCount === TOTAL_QUESTIONS) {
        await saveScoreToFirestore(finalScore);

        alert(
          `🎯 Round Completed!\nScore: ${finalScore}/${TOTAL_QUESTIONS}`
        );

        // 🔁 RESET
        setScore(0);
        setQuestionCount(0);
        loadNewQuestion();
      } else {
        loadNewQuestion();
      }
    }, 800);
  };

  // 📊 AI Analysis
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Keep practicing!";
  };

  return (
    <div className="find-page">
      <div className="letter-navbar">
        <h2>🔎 AI Find the Correct Letter</h2>
      </div>

      <div className="game-info">
        <span>
          Question: {questionCount + 1}/{TOTAL_QUESTIONS}
        </span>
        <span>Score: {score}</span>
      </div>

      <h2 className="target-text">
        Find: <span>{targetLetter || "..."}</span>
      </h2>

      <div className="letter-grid">
        {options.length > 0 ? (
          options.map((letter, index) => (
            <button
              key={index}
              className="grid-letter"
              onClick={() => handleClick(letter)}
            >
              {letter}
            </button>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {feedback === "correct" && (
        <div className="feedback good">🎉 Correct!</div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong">❌ Try Again</div>
      )}

      {/* 📊 Analysis */}
      <div className="ai-analysis">
        <p>{getPerformanceMessage()}</p>
      </div>
    </div>
  );
}