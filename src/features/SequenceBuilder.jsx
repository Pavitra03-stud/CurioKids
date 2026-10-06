// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function SequenceBuilder() {

//   const TOTAL_QUESTIONS = 5;

//   // 🔥 MODE
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [sequence, setSequence] = useState([]);
//   const [options, setOptions] = useState([]);
//   const [answer, setAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI GENERATION
//   const generateQuestionAI = () => {
//     try {
//       setLoading(true);

//       if (mode === "numbers") {
//         const start = Math.floor(Math.random() * 5) + 1;

//         const correct = (start + 2).toString();

//         setSequence([
//           start.toString(),
//           (start + 1).toString(),
//           "_",
//           (start + 3).toString()
//         ]);

//         setAnswer(correct);

//         const opts = [
//           correct,
//           (start + 4).toString(),
//           (start + 1).toString()
//         ].sort(() => 0.5 - Math.random());

//         setOptions(opts);

//       } else {
//         const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
//         const index = Math.floor(Math.random() * 20);

//         const correct = letters[index + 2];

//         setSequence([
//           letters[index],
//           letters[index + 1],
//           "_",
//           letters[index + 3]
//         ]);

//         setAnswer(correct);

//         const opts = [
//           correct,
//           letters[index + 4],
//           letters[index + 1]
//         ].sort(() => 0.5 - Math.random());

//         setOptions(opts);
//       }

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setSequence(["A","B","_","D"]);
//       setOptions(["C","E","B"]);
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
//         game: `SequenceBuilder_${mode}`
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

//   // 📊 AI ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Pattern Master!";
//     if (accuracy > 50) return "👍 Good thinking!";
//     return "💡 Practice patterns!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🔢 Sequence Builder ({mode})</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       {/* SEQUENCE */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           sequence.map((s, i) => (
//             <span key={i} className="sound-box">
//               {s}
//             </span>
//           ))
//         )}
//       </div>

//       <h3>Fill the missing item</h3>

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
import { useLocation } from "react-router-dom";
import useGameProgress from "../hooks/useGameProgress";

export default function SequenceBuilder() {
  const TOTAL_QUESTIONS = 5;

  /* =====================================================
     🔥 MODE
  ===================================================== */

  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const mode = query.get("mode") || "letters";

  /*
   * Separate progress for:
   * sequence-builder-letters
   * sequence-builder-numbers
   */
  const GAME_ID = `sequence-builder-${mode}`;

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  /* =====================================================
     📌 STATE
  ===================================================== */

  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);

  /* =====================================================
     🤖 GENERATE QUESTION
  ===================================================== */

  const generateQuestionAI = () => {
    try {
      setLoading(true);

      if (mode === "numbers") {
        const start =
          Math.floor(Math.random() * 5) + 1;

        const correct = (start + 2).toString();

        const newSequence = [
          start.toString(),
          (start + 1).toString(),
          "_",
          (start + 3).toString(),
        ];

        const newOptions = [
          correct,
          (start + 4).toString(),
          (start + 1).toString(),
        ].sort(() => 0.5 - Math.random());

        setSequence(newSequence);
        setAnswer(correct);
        setOptions(newOptions);

        return {
          sequence: newSequence,
          options: newOptions,
          answer: correct,
        };
      }

      /* =================================================
         🔤 LETTER MODE
      ================================================= */

      const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const index =
        Math.floor(Math.random() * 20);

      const correct =
        letters[index + 2];

      const newSequence = [
        letters[index],
        letters[index + 1],
        "_",
        letters[index + 3],
      ];

      const newOptions = [
        correct,
        letters[index + 4],
        letters[index + 1],
      ].sort(() => 0.5 - Math.random());

      setSequence(newSequence);
      setAnswer(correct);
      setOptions(newOptions);

      return {
        sequence: newSequence,
        options: newOptions,
        answer: correct,
      };
    } catch (err) {
      console.error(err);

      const fallback = {
        sequence:
          mode === "numbers"
            ? ["1", "2", "_", "4"]
            : ["A", "B", "_", "D"],

        options:
          mode === "numbers"
            ? ["3", "5", "2"]
            : ["C", "E", "B"],

        answer:
          mode === "numbers"
            ? "3"
            : "C",
      };

      setSequence(fallback.sequence);
      setOptions(fallback.options);
      setAnswer(fallback.answer);

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🔥 RESTORE PROGRESS
  ===================================================== */

  useEffect(() => {
    if (progressLoading) return;

    const restoreGame = async () => {
      if (savedState) {
        console.log(
          "🔥 Restoring Sequence Builder:",
          savedState
        );

        setSequence(
          savedState.sequence || []
        );

        setOptions(
          savedState.options || []
        );

        setAnswer(
          savedState.answer || ""
        );

        setScore(
          savedState.score || 0
        );

        setQuestionCount(
          savedState.questionCount || 0
        );

        setMessage(
          savedState.message || ""
        );

        setCompleted(
          savedState.completed || false
        );

        setLoading(false);

        return;
      }

      /* ================================================
         🆕 NEW GAME
      ================================================ */

      console.log(
        "🆕 Starting Sequence Builder:",
        mode
      );

      const question =
        generateQuestionAI();

      await save({
        sequence: question.sequence,
        options: question.options,
        answer: question.answer,
        score: 0,
        questionCount: 0,
        message: "",
        completed: false,
      });
    };

    restoreGame();
  }, [progressLoading, savedState, mode]);

  /* =====================================================
     🎯 HANDLE ANSWER
  ===================================================== */

  const handleClick = (item) => {
    if (
      loading ||
      completed ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    const isCorrect = item === answer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setMessage(
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!"
    );

    setTimeout(async () => {
      const nextQuestion =
        questionCount + 1;

      setMessage("");
      setQuestionCount(nextQuestion);

      /* ================================================
         🏆 FINAL QUESTION
      ================================================ */

      if (
        nextQuestion === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) *
          100;

        await finish(
          percentage,
          `Sequence Builder (${mode})`
        );

        setScore(updatedScore);
        setCompleted(true);
        setLoading(false);

        await save({
          sequence,
          options,
          answer,
          score: updatedScore,
          questionCount: nextQuestion,
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
        generateQuestionAI();

      await save({
        sequence: question.sequence,
        options: question.options,
        answer: question.answer,
        score: updatedScore,
        questionCount: nextQuestion,
        message: "",
        completed: false,
      });
    }, 800);
  };

  /* =====================================================
     🔄 PLAY AGAIN
  ===================================================== */

  const playAgain = async () => {
    const question =
      generateQuestionAI();

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);

    await save({
      sequence: question.sequence,
      options: question.options,
      answer: question.answer,
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
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Pattern Master!";
    }

    if (accuracy > 50) {
      return "👍 Good thinking!";
    }

    return "💡 Practice patterns!";
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="blend-container">
        <h2>
          🔢 Sequence Builder ({mode})
        </h2>

        <p>🌱 Loading your progress...</p>
      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="blend-container">

      <h2>
        🔢 Sequence Builder ({mode})
      </h2>

      <div className="game-info">
        Question{" "}
        {completed
          ? TOTAL_QUESTIONS
          : questionCount + 1}
        /{TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      {/* =================================================
          COMPLETION
      ================================================= */}

      {completed ? (
        <div className="ai-analysis">

          <h2>🎉 Completed!</h2>

          <h3>
            Score: {score}/{TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Pattern Master!"
              : "💡 Keep practicing patterns!"}
          </p>

          <button onClick={playAgain}>
            🔄 Play Again
          </button>

        </div>
      ) : (
        <>
          {/* =================================================
              SEQUENCE
          ================================================= */}

          <div className="sounds">
            {loading ? (
              <p>Loading...</p>
            ) : (
              sequence.map((item, index) => (
                <span
                  key={index}
                  className="sound-box"
                >
                  {item}
                </span>
              ))
            )}
          </div>

          <h3>
            Fill the missing item
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