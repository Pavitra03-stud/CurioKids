// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function MatchWordToPicture() {

//   const TOTAL_QUESTIONS = 5;

//   const [word, setWord] = useState("");
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-match-image", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (!data.word || !data.options) {
//         throw new Error("Invalid data");
//       }

//       setWord(data.word);
//       setOptions(data.options);

//     } catch (err) {
//       console.error(err);

//       setWord("Dog");
//       setOptions([
//         { word: "Dog", emoji: "🐶" },
//         { word: "Cat", emoji: "🐱" },
//         { word: "Ball", emoji: "⚽" },
//         { word: "Fish", emoji: "🐟" }
//       ]);
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
//         game: "MatchWordToPicture_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 CLICK
//   const handleClick = (item) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = item.word === word;
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

//     if (accuracy > 80) return "🌟 Excellent!";
//     if (accuracy > 50) return "👍 Good job!";
//     return "💡 Keep practicing!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🖼️ Match Word to Picture</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <h2>Find: {word}</h2>

//       <div className="options">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           options.map((item, i) => (
//             <button key={i} onClick={() => handleClick(item)}>
//               {item.emoji}
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

const GAME_ID = "match-word-to-picture";
const TOTAL_QUESTIONS = 5;

export default function MatchWordToPicture() {
  /* =========================================================
     INITIAL STATE
  ========================================================= */

  const initialState = {
    word: "",
    options: [],
    score: 0,
    questionCount: 0,
    message: "",
    loading: true,
    completed: false,
  };

  /* =========================================================
     FIREBASE GAME PROGRESS
  ========================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [word, setWord] =
    useState("");

  const [options, setOptions] =
    useState([]);

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
        "http://localhost:5000/api/generate-match-image",
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
        !data.word ||
        !data.options
      ) {
        throw new Error(
          "Invalid data"
        );
      }

      setWord(data.word);
      setOptions(data.options);

      return {
        word: data.word,
        options: data.options,
      };
    } catch (err) {
      console.error(
        "❌ Match Word AI error:",
        err
      );

      const fallback = {
        word: "Dog",
        options: [
          {
            word: "Dog",
            emoji: "🐶",
          },
          {
            word: "Cat",
            emoji: "🐱",
          },
          {
            word: "Ball",
            emoji: "⚽",
          },
          {
            word: "Fish",
            emoji: "🐟",
          },
        ],
      };

      setWord(
        fallback.word
      );

      setOptions(
        fallback.options
      );

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
      "🔥 Match Word To Picture saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.word &&
      savedState.options?.length
    ) {
      setWord(
        savedState.word
      );

      setOptions(
        savedState.options
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
        Boolean(
          savedState.completed
        )
      );

      setLoading(false);
    } else {
      /*
       * No saved game.
       * Generate first AI question.
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
      word,
      options,
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
    item
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
      item.word === word;

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
     * Save answer immediately.
     */
    await saveCurrentState({
      score: updatedScore,
      message: feedback,
    });

    setTimeout(async () => {
      const next =
        questionCount + 1;

      /* =====================================================
         🏁 ROUND COMPLETE
      ===================================================== */

      if (
        next === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏁 Match Word To Picture completed:",
          {
            score:
              updatedScore,
            total:
              TOTAL_QUESTIONS,
            percentage,
          }
        );

        setScore(
          updatedScore
        );

        setQuestionCount(
          next
        );

        setCompleted(true);

        setMessage(
          `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        /*
         * ⭐ Save stars + history
         */
        await finish(
          percentage,
          "Match Word To Picture"
        );

        /*
         * Save completed state.
         */
        await save({
          word,
          options,
          score:
            updatedScore,
          questionCount:
            next,
          message:
            `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`,
          loading: false,
          completed: true,
        });

        setAnswerLocked(false);

        return;
      }

      /* =====================================================
         ➡️ NEXT AI QUESTION
      ===================================================== */

      const nextQuestion =
        await generateQuestionAI();

      setScore(
        updatedScore
      );

      setQuestionCount(
        next
      );

      setMessage("");

      /*
       * Save the new AI-generated question.
       */
      await save({
        word:
          nextQuestion.word,

        options:
          nextQuestion.options,

        score:
          updatedScore,

        questionCount:
          next,

        message: "",

        loading: false,

        completed: false,
      });

      setAnswerLocked(false);
    }, 900);
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
      word:
        newQuestion.word,

      options:
        newQuestion.options,

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
    if (
      questionCount === 0
    ) {
      return "";
    }

    const accuracy =
      (score /
        questionCount) *
      100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Keep practicing!";
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
          🖼️ Match Word to Picture
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
     🏆 COMPLETED SCREEN
  ========================================================= */

  if (completed) {
    return (
      <div className="blend-container">

        <h2>
          🖼️ Match Word to Picture
        </h2>

        <div className="game-info">
          🎯 Round Completed!
        </div>

        <div className="big-letter">
          🌟
        </div>

        <h3>
          Score: {score}/
          {TOTAL_QUESTIONS}
        </h3>

        <div className="ai-analysis">
          <p>
            {getPerformanceMessage()}
          </p>
        </div>

        <button
          onClick={
            handleRestart
          }
          style={{
            marginTop:
              "20px",
            padding:
              "12px 24px",
            borderRadius:
              "10px",
            border:
              "none",
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
        🖼️ Match Word to Picture
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}/
        {TOTAL_QUESTIONS}{" "}
        | Score: {score}
      </div>

      <h2>
        Find: {word}
      </h2>

      <div className="options">

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          options.map(
            (item, index) => (
              <button
                key={index}
                onClick={() =>
                  handleClick(
                    item
                  )
                }
                disabled={
                  answerLocked
                }
              >
                {item.emoji}
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