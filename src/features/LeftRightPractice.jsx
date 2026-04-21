// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function LeftRightPractice() {

//   const TOTAL_QUESTIONS = 5;

//   // 🔥 MODE
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [line, setLine] = useState([]);
//   const [target, setTarget] = useState("");
//   const [direction, setDirection] = useState("");
//   const [answer, setAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI GENERATION
//   const generateQuestionAI = () => {
//     try {
//       setLoading(true);

//       let base =
//         mode === "numbers"
//           ? ["1","2","3","4","5","6","7","8","9"]
//           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//       const startIndex = Math.floor(Math.random() * (base.length - 4));
//       const slice = base.slice(startIndex, startIndex + 4);

//       const targetIndex = Math.floor(Math.random() * 4);
//       const chosenTarget = slice[targetIndex];

//       let dir, correct;

//       if (targetIndex === 0) {
//         dir = "RIGHT";
//         correct = slice[1];
//       } else if (targetIndex === 3) {
//         dir = "LEFT";
//         correct = slice[2];
//       } else {
//         if (Math.random() > 0.5) {
//           dir = "RIGHT";
//           correct = slice[targetIndex + 1];
//         } else {
//           dir = "LEFT";
//           correct = slice[targetIndex - 1];
//         }
//       }

//       setLine(slice);
//       setTarget(chosenTarget);
//       setDirection(dir);
//       setAnswer(correct);

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setLine(["A","B","C","D"]);
//       setTarget("B");
//       setDirection("RIGHT");
//       setAnswer("C");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, [mode]);

//   // ☁️ SAVE
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userEmail = "demo_user";

//       const userRef = doc(db, "users", userEmail);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: `LeftRight_${mode}`
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 CLICK
//   const handleClick = (item) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = item === answer;
//     const updatedScore = isCorrect ? score + 1 : score;

//     setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

//     setTimeout(async () => {

//       setMessage("");

//       const next = questionCount + 1;
//       setQuestionCount(next);

//       if (next === TOTAL_QUESTIONS) {

//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Completed!\nScore: ${updatedScore}/5`);

//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         setScore(updatedScore);
//         generateQuestionAI();
//       }

//     }, 800);
//   };

//   // 📊 ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Direction Master!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice left/right!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>👈👉 Left / Right Practice ({mode})</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <h3>
//         Which is to the <b>{direction}</b> of <b>{target}</b>?
//       </h3>

//       {/* LINE */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           line.map((item, i) => (
//             <span key={i} className="sound-box">
//               {item}
//             </span>
//           ))
//         )}
//       </div>

//       {/* OPTIONS */}
//       <div className="options">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           line.map((item, i) => (
//             <button key={i} onClick={() => handleClick(item)}>
//               {item}
//             </button>
//           ))
//         )}
//       </div>

//       <p>{message}</p>

//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }




import { useMemo, useState } from "react";
import "../styles/LearningLetterBlast.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function LearningLetterBlast({ goBack }) {
  const questions = useMemo(
    () => [
      { image: "🍎", word: "Apple", correct: "A", options: ["A", "B", "C"] },
      { image: "🐶", word: "Dog", correct: "D", options: ["D", "B", "P"] },
      { image: "🐱", word: "Cat", correct: "C", options: ["C", "O", "G"] },
      { image: "🦁", word: "Lion", correct: "L", options: ["L", "I", "T"] },
      { image: "🥭", word: "Mango", correct: "M", options: ["M", "N", "W"] },
      { image: "🐘", word: "Elephant", correct: "E", options: ["E", "F", "L"] },
      { image: "🐟", word: "Fish", correct: "F", options: ["F", "P", "T"] },
      { image: "🍌", word: "Banana", correct: "B", options: ["B", "D", "R"] },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const gameFinished = currentIndex >= questions.length;

  // 🔥 SAVE RESULT
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userEmail = localStorage.getItem("loginEmail"); // ✅ REAL USER

      if (!userEmail) return;

      const userRef = doc(db, "users", userEmail);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / questions.length) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: questions.length,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "LearningLetterBlast",
      });

      console.log("✅ Saved to Firebase");
    } catch (error) {
      console.error("❌ Firestore error:", error);
    }
  };

  const handleOptionClick = (letter) => {
    if (status) return;

    setSelected(letter);

    if (letter === currentQuestion.correct) {
      setStatus("correct");
      setScore((prev) => prev + 1);
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      await saveScoreToFirestore(score); // 🔥 SAVE HERE
      setCurrentIndex(questions.length);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected("");
    setStatus("");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected("");
    setStatus("");
    setScore(0);
  };

  if (gameFinished) {
    return (
      <div className="learning-letter-blast-page">
        <header className="learning-letter-blast-topbar">
          <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
        </header>

        <div className="learning-letter-blast-decor decor-one"></div>
        <div className="learning-letter-blast-decor decor-two"></div>
        <div className="learning-letter-blast-decor decor-three"></div>

        <div className="blast-finish-card">
          <div className="finish-emoji">🏆</div>
          <h2>Great Job!</h2>
          <p>
            You got <span>{score}</span> out of <span>{questions.length}</span>
          </p>

          <div className="finish-buttons">
            <button className="primary-btn" onClick={handleRestart}>
              Play Again
            </button>
            <button className="secondary-btn" onClick={goBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-letter-blast-page">
      <header className="learning-letter-blast-topbar">
        <button className="learning-letter-blast-back" onClick={goBack}>
          ←
        </button>
        <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
      </header>

      <div className="learning-letter-blast-decor decor-one"></div>
      <div className="learning-letter-blast-decor decor-two"></div>
      <div className="learning-letter-blast-decor decor-three"></div>

      <div className="learning-letter-blast-content">
        <div className="blast-top-info">
          <div className="blast-score">⭐ Score: {score}</div>
          <div className="blast-progress">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="blast-card">
          <div className="blast-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="blast-image">{currentQuestion.image}</div>
          <div className="blast-word">{currentQuestion.word}</div>

          <p className="blast-question">Tap the first letter</p>

          <div className="blast-options">
            {currentQuestion.options.map((letter, index) => (
              <button
                key={index}
                className={`blast-option
                  ${selected === letter ? "selected" : ""}
                  ${
                    status === "correct" && letter === currentQuestion.correct
                      ? "correct"
                      : ""
                  }
                  ${
                    status === "wrong" && selected === letter
                      ? "wrong"
                      : ""
                  }
                `}
                onClick={() => handleOptionClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="blast-feedback-area">
            {!status && (
              <p className="blast-hint">
                Look at the picture and choose carefully 👀
              </p>
            )}

            {status === "correct" && (
              <p className="blast-feedback correct-text">
                ✅ Super! {currentQuestion.correct} for {currentQuestion.word}
              </p>
            )}

            {status === "wrong" && (
              <p className="blast-feedback wrong-text">
                ❌ Try again next time! Correct answer is {currentQuestion.correct}
              </p>
            )}
          </div>

          {status && (
            <button className="next-btn" onClick={handleNext}>
              {isLastQuestion ? "See Result" : "Next"}
            </button>
          )}
        </div>

        <div className="blast-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}