// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function MissingLetter() {

//   const TOTAL_QUESTIONS = 5;

//   const [displayWord, setDisplayWord] = useState("");
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

//       const res = await fetch("http://localhost:5000/api/generate-missing-letter", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (!data.display || !data.options || !data.answer) {
//         throw new Error("Invalid data");
//       }

//       setDisplayWord(data.display);
//       setOptions(data.options);
//       setCorrectAnswer(data.answer);

//     } catch (err) {
//       console.error(err);

//       setDisplayWord("C _ T");
//       setOptions(["a","e","i","o"]);
//       setCorrectAnswer("a");
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
//         game: "MissingLetter_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (letter) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = letter === correctAnswer;
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

//     }, 800);
//   };

//   // 📊 ANALYSIS
//   const getPerformanceMessage = () => {
//     if (questionCount === 0) return "";

//     const accuracy = (score / questionCount) * 100;

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Practice more!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🤖 Missing Letter</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <div className="big-letter">
//         {loading ? "..." : displayWord}
//       </div>

//       <h3>Fill the missing letter</h3>

//       <div className="options">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           options.map((l, i) => (
//             <button key={i} onClick={() => handleClick(l)}>
//               {l.toUpperCase()}
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




import { useEffect, useState } from "react";
import "../styles/BlendSounds.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "missing-letter";
const TOTAL_QUESTIONS = 5;

export default function MissingLetter() {
  const initialState = {
    displayWord: "",
    options: [],
    correctAnswer: "",
    score: 0,
    questionCount: 0,
    message: "",
    loading: true,
    completed: false,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  const [displayWord, setDisplayWord] =
    useState("");

  const [options, setOptions] =
    useState([]);

  const [correctAnswer, setCorrectAnswer] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [completed, setCompleted] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [answerLocked, setAnswerLocked] =
    useState(false);

  /* =========================================================
     🤖 AI QUESTION
  ========================================================= */

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-missing-letter",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const data = await res.json();

      if (
        !data.display ||
        !data.options ||
        !data.answer
      ) {
        throw new Error(
          "Invalid AI question data"
        );
      }

      setDisplayWord(data.display);
      setOptions(data.options);
      setCorrectAnswer(data.answer);
      setMessage("");

      return {
        displayWord: data.display,
        options: data.options,
        correctAnswer: data.answer,
      };
    } catch (err) {
      console.error(
        "❌ Missing Letter AI error:",
        err
      );

      const fallback = {
        displayWord: "C _ T",
        options: [
          "a",
          "e",
          "i",
          "o",
        ],
        correctAnswer: "a",
      };

      setDisplayWord(
        fallback.displayWord
      );

      setOptions(
        fallback.options
      );

      setCorrectAnswer(
        fallback.correctAnswer
      );

      setMessage("");

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     🔥 RESTORE SAVED GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Missing Letter saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.displayWord &&
      savedState.options?.length
    ) {
      setDisplayWord(
        savedState.displayWord
      );

      setOptions(
        savedState.options
      );

      setCorrectAnswer(
        savedState.correctAnswer
      );

      setScore(
        savedState.score ?? 0
      );

      setQuestionCount(
        savedState.questionCount ?? 0
      );

      setMessage(
        savedState.message || ""
      );

      setCompleted(
        Boolean(savedState.completed)
      );

      setLoading(false);
    } else {
      /*
       * No saved game.
       * Generate the first AI question.
       */
      generateQuestionAI();
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     💾 SAVE CURRENT STATE
  ========================================================= */

  const saveCurrentState = async (
    overrides = {}
  ) => {
    await save({
      displayWord,
      options,
      correctAnswer,
      score,
      questionCount,
      message,
      loading: false,
      completed,
      ...overrides,
    });
  };

  /* =========================================================
     🎯 HANDLE ANSWER
  ========================================================= */

  const handleClick = async (
    letter
  ) => {
    if (answerLocked) return;
    if (completed) return;
    if (loading) return;

    if (
      questionCount >=
      TOTAL_QUESTIONS
    ) {
      return;
    }

    setAnswerLocked(true);

    const isCorrect =
      letter === correctAnswer;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const feedback =
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!";

    setMessage(feedback);

    /*
     * Save the current answer immediately.
     * This prevents refresh during feedback
     * from losing the score.
     */
    await saveCurrentState({
      score: updatedScore,
      message: feedback,
    });

    setTimeout(async () => {
      const next =
        questionCount + 1;

      /* =========================================
         🏁 ROUND COMPLETE
      ========================================= */

      if (
        next === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏁 Missing Letter completed:",
          {
            score: updatedScore,
            total:
              TOTAL_QUESTIONS,
            percentage,
          }
        );

        setScore(updatedScore);
        setQuestionCount(next);
        setCompleted(true);
        setMessage(
          `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        /*
         * ⭐ GameContext handles:
         * - stars
         * - history
         * - active game cleanup
         */
        await finish(
          percentage,
          "Missing Letter"
        );

        /*
         * Save the completed result
         * for restoring the result screen.
         */
        await save({
          displayWord,
          options,
          correctAnswer,
          score: updatedScore,
          questionCount: next,
          message:
            `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`,
          loading: false,
          completed: true,
        });

        setAnswerLocked(false);

        return;
      }

      /* =========================================
         ➡️ NEXT QUESTION
      ========================================= */

      const nextQuestion =
        await generateQuestionAI();

      const nextMessage = "";

      setScore(updatedScore);
      setQuestionCount(next);
      setMessage(nextMessage);

      /*
       * Save the NEW AI question together with
       * the updated score.
       */
      await save({
        displayWord:
          nextQuestion.displayWord,

        options:
          nextQuestion.options,

        correctAnswer:
          nextQuestion.correctAnswer,

        score: updatedScore,

        questionCount: next,

        message: nextMessage,

        loading: false,

        completed: false,
      });

      setAnswerLocked(false);
    }, 800);
  };

  /* =========================================================
     🔄 PLAY AGAIN
  ========================================================= */

  const handleRestart = async () => {
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);
    setAnswerLocked(false);

    const newQuestion =
      await generateQuestionAI();

    await save({
      displayWord:
        newQuestion.displayWord,

      options:
        newQuestion.options,

      correctAnswer:
        newQuestion.correctAnswer,

      score: 0,

      questionCount: 0,

      message: "",

      loading: false,

      completed: false,
    });
  };

  /* =========================================================
     📊 PERFORMANCE
  ========================================================= */

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) *
      100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Practice more!";
  };

  /* =========================================================
     ⏳ LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="blend-container">
        <h2>
          🤖 Missing Letter
        </h2>

        <div className="big-letter">
          ...
        </div>

        <p>
          Restoring your game...
        </p>
      </div>
    );
  }

  /* =========================================================
     🏆 COMPLETED
  ========================================================= */

  if (completed) {
    return (
      <div className="blend-container">

        <h2>
          🤖 Missing Letter
        </h2>

        <div className="game-info">
          Round Completed!
        </div>

        <div className="big-letter">
          🎯
        </div>

        <h3>
          You scored{" "}
          {score} /{" "}
          {TOTAL_QUESTIONS}
        </h3>

        <div className="ai-analysis">
          <p>
            {getPerformanceMessage()}
          </p>
        </div>

        <button
          onClick={handleRestart}
          style={{
            marginTop: "20px",
            padding:
              "12px 24px",
            borderRadius:
              "10px",
            border: "none",
            cursor:
              "pointer",
            fontSize:
              "16px",
          }}
        >
          🔄 Play Again
        </button>

      </div>
    );
  }

  /* =========================================================
     🎮 GAME UI
  ========================================================= */

  return (
    <div className="blend-container">

      <h2>
        🤖 Missing Letter
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}
        /{TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      <div className="big-letter">
        {loading
          ? "..."
          : displayWord}
      </div>

      <h3>
        Fill the missing letter
      </h3>

      <div className="options">

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          options.map(
            (letter, index) => (
              <button
                key={index}
                onClick={() =>
                  handleClick(
                    letter
                  )
                }
                disabled={
                  answerLocked
                }
              >
                {letter.toUpperCase()}
              </button>
            )
          )
        )}

      </div>

      <p>
        {message}
      </p>

      <div className="ai-analysis">
        <p>
          {getPerformanceMessage()}
        </p>
      </div>

    </div>
  );
}