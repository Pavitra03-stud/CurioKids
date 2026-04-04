import { useState, useEffect } from "react";
import "../styles/UppercaseLowercase.css";

// 🔥 Firebase
import { db, auth } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function UppercaseLowercase() {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // 🤖 States
  const [currentUpper, setCurrentUpper] = useState("");
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const TOTAL_QUESTIONS = 5;

  // 🤖 Generate Question
  const generateQuestionAI = () => {
    const randomUpper =
      uppercase[Math.floor(Math.random() * uppercase.length)];

    const correct = randomUpper.toLowerCase();

    const allLower = "abcdefghijklmnopqrstuvwxyz".split("");

    const wrong = allLower
      .filter((l) => l !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...wrong, correct].sort(
      () => 0.5 - Math.random()
    );

    return {
      question: randomUpper,
      options,
      answer: correct,
    };
  };

  // Load first question
  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = () => {
    const q = generateQuestionAI();
    setCurrentUpper(q.question);
    setOptions(q.options);
  };

  // 🔥 Save to Firestore (per logged-in user)
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log("❌ No user logged in");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "Uppercase-Lowercase",
        userEmail: user.email
      });

      console.log("✅ Saved for user:", user.email);
    } catch (error) {
      console.error("❌ Error saving:", error);
    }
  };

  // 🎯 Handle Answer
  const handleClick = (selected) => {
    if (questionCount >= TOTAL_QUESTIONS) return;

    const isCorrect = selected === currentUpper.toLowerCase();

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

      // 🔥 End of round
      if (nextCount === TOTAL_QUESTIONS) {
        await saveScoreToFirestore(finalScore);

        alert(
          `🎯 Round Completed!\nScore: ${finalScore} / ${TOTAL_QUESTIONS}`
        );

        // 🔁 Reset
        setScore(0);
        setQuestionCount(0);
        loadNewQuestion();
      } else {
        loadNewQuestion();
      }
    }, 800);
  };

  // 📊 Performance Message
  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy = (score / questionCount) * 100;

    if (accuracy > 80) return "🌟 Excellent!";
    if (accuracy > 50) return "👍 Good job!";
    return "💡 Keep practicing!";
  };

  return (
    <div className="case-page">
      <div className="letter-navbar">
        <h2>🔤 AI Letter Matching Game</h2>
      </div>

      <div className="instruction">
        Question {questionCount + 1} of {TOTAL_QUESTIONS}
      </div>

      <div className="big-letter">
        {currentUpper}
      </div>

      <div className="options-grid">
        {options.map((letter) => (
          <button
            key={letter}
            className="option-btn"
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {feedback === "correct" && (
        <div className="feedback good">🎉 Correct!</div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong">❌ Try Again</div>
      )}

      {/* 📊 Score */}
      <div className="ai-analysis">
        <p>Score: {score} / {questionCount}</p>
        <p>{getPerformanceMessage()}</p>
      </div>
    </div>
  );
}