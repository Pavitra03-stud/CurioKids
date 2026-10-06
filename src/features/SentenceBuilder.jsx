// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function SentenceBuilder() {

//   const TOTAL_QUESTIONS = 5;

//   const [shuffled, setShuffled] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-sentence", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (!data.shuffled || !data.options || !data.answer) {
//         throw new Error("Invalid data");
//       }

//       setShuffled(data.shuffled);
//       setOptions(data.options);
//       setCorrectAnswer(data.answer);

//     } catch (err) {
//       console.error(err);

//       setShuffled(["the","cat","is"]);
//       setOptions(["the cat is","cat is the","is the cat"]);
//       setCorrectAnswer("the cat is");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, []);

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
//         game: "SentenceBuilder_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (sentence) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = sentence === correctAnswer;
//     const updatedScore = isCorrect ? score + 1 : score;

//     setMessage(isCorrect ? "✅ Correct!" : "❌ Try again!");

//     setTimeout(async () => {

//       setMessage("");

//       const next = questionCount + 1;
//       setQuestionCount(next);

//       if (next === TOTAL_QUESTIONS) {

//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         setScore(updatedScore);
//         generateQuestionAI();
//       }

//     }, 900);
//   };

//   // 📊 ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent sentence building!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice sentence formation!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🤖 Sentence Builder</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       {/* 🔤 SHUFFLED WORDS */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           shuffled.map((w, i) => (
//             <span key={i} className="sound-box">
//               {w}
//             </span>
//           ))
//         )}
//       </div>

//       <h3>Choose the correct sentence</h3>

//       {/* OPTIONS */}
//       <div className="options">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           options.map((opt, i) => (
//             <button key={i} onClick={() => handleClick(opt)}>
//               {opt}
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




import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

import useGameProgress from "../hooks/useGameProgress";

export default function SentenceBuilder() {
  const TOTAL_QUESTIONS = 5;

  const GAME_ID = "sentence-builder";

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [shuffled, setShuffled] = useState([]);
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  /* =====================================================
     🤖 AI QUESTION
  ===================================================== */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-sentence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (
        !data.shuffled ||
        !data.options ||
        !data.answer
      ) {
        throw new Error("Invalid data");
      }

      const question = {
        shuffled: data.shuffled,
        options: data.options,
        correctAnswer: data.answer,
      };

      setShuffled(question.shuffled);
      setOptions(question.options);
      setCorrectAnswer(question.correctAnswer);

      return question;
    } catch (err) {
      console.error("AI sentence generation failed:", err);

      const fallback = {
        shuffled: ["the", "cat", "is"],
        options: [
          "the cat is",
          "cat is the",
          "is the cat",
        ],
        correctAnswer: "the cat is",
      };

      setShuffled(fallback.shuffled);
      setOptions(fallback.options);
      setCorrectAnswer(fallback.correctAnswer);

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🔥 RESTORE SAVED GAME
  ===================================================== */

  useEffect(() => {
    if (progressLoading) return;

    const restoreGame = async () => {
      if (savedState) {
        console.log(
          "🔥 Restoring Sentence Builder:",
          savedState
        );

        setShuffled(savedState.shuffled || []);
        setOptions(savedState.options || []);
        setCorrectAnswer(
          savedState.correctAnswer || ""
        );

        setScore(savedState.score || 0);

        setQuestionCount(
          savedState.questionCount || 0
        );

        setMessage(savedState.message || "");

        setCompleted(
          savedState.completed || false
        );

        setLoading(false);

        return;
      }

      console.log(
        "🆕 Starting new Sentence Builder"
      );

      const question = await generateQuestionAI();

      await save({
        shuffled: question.shuffled,
        options: question.options,
        correctAnswer: question.correctAnswer,
        score: 0,
        questionCount: 0,
        message: "",
        completed: false,
      });
    };

    restoreGame();
  }, [progressLoading, savedState]);

  /* =====================================================
     🎯 HANDLE ANSWER
  ===================================================== */

  const handleClick = (sentence) => {
    if (
      loading ||
      completed ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    const isCorrect =
      sentence === correctAnswer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setMessage(
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!"
    );

    setTimeout(async () => {
      const nextQuestionCount =
        questionCount + 1;

      setMessage("");

      setQuestionCount(nextQuestionCount);

      /* ================================================
         🏆 FINAL QUESTION
      ================================================ */

      if (
        nextQuestionCount === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        await finish(
          percentage,
          "AI Sentence Builder"
        );

        setScore(updatedScore);
        setCompleted(true);
        setLoading(false);

        await save({
          shuffled,
          options,
          correctAnswer,
          score: updatedScore,
          questionCount: nextQuestionCount,
          message: "",
          completed: true,
        });

        return;
      }

      /* ================================================
         ➡️ NEXT QUESTION
      ================================================ */

      setScore(updatedScore);

      const question =
        await generateQuestionAI();

      await save({
        shuffled: question.shuffled,
        options: question.options,
        correctAnswer: question.correctAnswer,
        score: updatedScore,
        questionCount: nextQuestionCount,
        message: "",
        completed: false,
      });
    }, 900);
  };

  /* =====================================================
     🔄 PLAY AGAIN
  ===================================================== */

  const playAgain = async () => {
    const question =
      await generateQuestionAI();

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);

    await save({
      shuffled: question.shuffled,
      options: question.options,
      correctAnswer: question.correctAnswer,
      score: 0,
      questionCount: 0,
      message: "",
      completed: false,
    });
  };

  /* =====================================================
     📊 PERFORMANCE
  ===================================================== */

  const getPerformanceMessage = () => {
    if (questionCount === 0) return "";

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent sentence building!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice sentence formation!";
  };

  /* =====================================================
     ⏳ PROGRESS LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="blend-container">
        <h2>🤖 Sentence Builder</h2>

        <p>🌱 Loading your progress...</p>
      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="blend-container">

      <h2>🤖 Sentence Builder</h2>

      <div className="game-info">
        Question{" "}
        {completed
          ? TOTAL_QUESTIONS
          : questionCount + 1}
        /{TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      {/* =================================================
          COMPLETION SCREEN
      ================================================= */}

      {completed ? (
        <div className="ai-analysis">

          <h2>🎉 Round Completed!</h2>

          <h3>
            Score: {score}/{TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Excellent sentence building!"
              : "💡 Keep practicing sentence formation!"}
          </p>

          <button onClick={playAgain}>
            🔄 Play Again
          </button>

        </div>
      ) : (
        <>
          {/* =================================================
              SHUFFLED WORDS
          ================================================= */}

          <div className="sounds">
            {loading ? (
              <p>Loading...</p>
            ) : (
              shuffled.map((word, index) => (
                <span
                  key={index}
                  className="sound-box"
                >
                  {word}
                </span>
              ))
            )}
          </div>

          <h3>
            Choose the correct sentence
          </h3>

          {/* =================================================
              OPTIONS
          ================================================= */}

          <div className="options">
            {loading ? (
              <p>Loading...</p>
            ) : (
              options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleClick(option)
                  }
                >
                  {option}
                </button>
              ))
            )}
          </div>

          <p>{message}</p>

          <div className="ai-analysis">
            <p>
              {getPerformanceMessage()}
            </p>
          </div>
        </>
      )}

    </div>
  );
}