// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function SpotDifference() {

//   const TOTAL_QUESTIONS = 5;

//   // 🔥 MODE
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [row1, setRow1] = useState([]);
//   const [row2, setRow2] = useState([]);
//   const [answer, setAnswer] = useState("");

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI GENERATOR
//   const generateQuestionAI = () => {
//     try {
//       setLoading(true);

//       const base =
//         mode === "numbers"
//           ? ["1","2","3","4","5","6","7","8","9"]
//           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//       const newRow1 = Array(4)
//         .fill(null)
//         .map(() => base[Math.floor(Math.random() * base.length)]);

//       const newRow2 = [...newRow1];

//       const diffIndex = Math.floor(Math.random() * 4);

//       let different;
//       do {
//         different = base[Math.floor(Math.random() * base.length)];
//       } while (different === newRow1[diffIndex]);

//       newRow2[diffIndex] = different;

//       setRow1(newRow1);
//       setRow2(newRow2);
//       setAnswer(different);

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setRow1(["A","B","C","D"]);
//       setRow2(["A","B","X","D"]);
//       setAnswer("X");
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
//         game: `SpotDifference_${mode}`
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

//     if (accuracy > 80) return "🌟 Eagle Eyes!";
//     if (accuracy > 50) return "👍 Good spotting!";
//     return "💡 Focus more!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>👀 Spot the Difference ({mode})</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       {/* ROW 1 */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           row1.map((item, i) => (
//             <span key={i} className="sound-box">
//               {item}
//             </span>
//           ))
//         )}
//       </div>

//       {/* ROW 2 */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           row2.map((item, i) => (
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




import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";
import { useLocation } from "react-router-dom";
import useGameProgress from "../hooks/useGameProgress";

export default function SpotDifference() {
  const TOTAL_QUESTIONS = 5;

  /* =====================================================
     🔥 MODE
  ===================================================== */

  const location = useLocation();

  const query = new URLSearchParams(
    location.search
  );

  const mode = query.get("mode") || "letters";

  const GAME_ID = `spot-difference-${mode}`;

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  /* =====================================================
     📌 STATE
  ===================================================== */

  const [row1, setRow1] = useState([]);
  const [row2, setRow2] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] =
    useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] =
    useState(false);

  /* =====================================================
     🤖 GENERATE QUESTION
  ===================================================== */

  const generateQuestionAI = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
            ]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const newRow1 = Array(4)
        .fill(null)
        .map(
          () =>
            base[
              Math.floor(
                Math.random() * base.length
              )
            ]
        );

      const newRow2 = [...newRow1];

      const diffIndex =
        Math.floor(Math.random() * 4);

      let different;

      do {
        different =
          base[
            Math.floor(
              Math.random() * base.length
            )
          ];
      } while (
        different === newRow1[diffIndex]
      );

      newRow2[diffIndex] = different;

      setRow1(newRow1);
      setRow2(newRow2);
      setAnswer(different);

      return {
        row1: newRow1,
        row2: newRow2,
        answer: different,
      };
    } catch (err) {
      console.error(err);

      const fallback = {
        row1: ["A", "B", "C", "D"],
        row2: ["A", "B", "X", "D"],
        answer: "X",
      };

      setRow1(fallback.row1);
      setRow2(fallback.row2);
      setAnswer(fallback.answer);

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
          "🔥 Restoring Spot Difference:",
          savedState
        );

        setRow1(
          savedState.row1 || []
        );

        setRow2(
          savedState.row2 || []
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
        "🆕 Starting Spot Difference:",
        mode
      );

      const question =
        generateQuestionAI();

      await save({
        row1: question.row1,
        row2: question.row2,
        answer: question.answer,
        score: 0,
        questionCount: 0,
        message: "",
        completed: false,
      });
    };

    restoreGame();
  }, [
    progressLoading,
    savedState,
    mode,
  ]);

  /* =====================================================
     🎯 HANDLE CLICK
  ===================================================== */

  const handleClick = (item) => {
    if (
      loading ||
      completed ||
      questionCount >= TOTAL_QUESTIONS
    ) {
      return;
    }

    const isCorrect =
      item === answer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const resultMessage = isCorrect
      ? "✅ Correct!"
      : "❌ Try again!";

    setMessage(resultMessage);

    setTimeout(async () => {
      const nextQuestionCount =
        questionCount + 1;

      setMessage("");

      setQuestionCount(
        nextQuestionCount
      );

      /* ================================================
         🏆 FINAL QUESTION
      ================================================ */

      if (
        nextQuestionCount ===
        TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        await finish(
          percentage,
          `Spot Difference (${mode})`
        );

        setScore(updatedScore);
        setCompleted(true);
        setLoading(false);

        await save({
          row1,
          row2,
          answer,
          score: updatedScore,
          questionCount:
            nextQuestionCount,
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
        row1: question.row1,
        row2: question.row2,
        answer: question.answer,
        score: updatedScore,
        questionCount:
          nextQuestionCount,
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
      row1: question.row1,
      row2: question.row2,
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
      return "🌟 Eagle Eyes!";
    }

    if (accuracy > 50) {
      return "👍 Good spotting!";
    }

    return "💡 Focus more!";
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (progressLoading) {
    return (
      <div className="blend-container">

        <h2>
          👀 Spot the Difference ({mode})
        </h2>

        <p>
          🌱 Loading your progress...
        </p>

      </div>
    );
  }

  /* =====================================================
     🎉 COMPLETION
  ===================================================== */

  if (completed) {
    return (
      <div className="blend-container">

        <h2>
          👀 Spot the Difference ({mode})
        </h2>

        <div className="ai-analysis">

          <h2>
            🎉 Completed!
          </h2>

          <h3>
            Score: {score}/
            {TOTAL_QUESTIONS}
          </h3>

          <p>
            {score >= 4
              ? "🌟 Eagle Eyes!"
              : "💡 Keep practicing!"}
          </p>

          <button onClick={playAgain}>
            🔄 Play Again
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="blend-container">

      <h2>
        👀 Spot the Difference ({mode})
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}/
        {TOTAL_QUESTIONS}
        {" | "}
        Score: {score}
      </div>

      {/* ================================================
          ROW 1
      ================================================ */}

      <div className="sounds">

        {loading ? (
          <p>Loading...</p>
        ) : (
          row1.map((item, index) => (
            <span
              key={index}
              className="sound-box"
            >
              {item}
            </span>
          ))
        )}

      </div>

      {/* ================================================
          ROW 2
      ================================================ */}

      <div className="sounds">

        {loading ? (
          <p>Loading...</p>
        ) : (
          row2.map((item, index) => (
            <button
              key={index}
              onClick={() =>
                handleClick(item)
              }
            >
              {item}
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

    </div>
  );
}