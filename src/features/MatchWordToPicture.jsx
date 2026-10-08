// import { useState, useEffect } from "react";
// import "../styles/MatchWordToPicture.css";
// import useGameProgress from "../hooks/useGameProgress";

// const GAME_ID = "match-word-to-picture";
// const TOTAL_QUESTIONS = 5;

// export default function MatchWordToPicture() {
//   /* =========================================================
//      INITIAL STATE
//   ========================================================= */

//   const initialState = {
//     word: "",
//     options: [],
//     score: 0,
//     questionCount: 0,
//     message: "",
//     loading: true,
//     completed: false,
//   };

//   /* =========================================================
//      FIREBASE GAME PROGRESS
//   ========================================================= */

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//     finish,
//   } = useGameProgress(
//     GAME_ID,
//     initialState
//   );

//   /* =========================================================
//      STATES
//   ========================================================= */

//   const [word, setWord] = useState("");
//   const [options, setOptions] = useState([]);
//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [completed, setCompleted] = useState(false);
//   const [restored, setRestored] = useState(false);
//   const [answerLocked, setAnswerLocked] = useState(false);

//   /* =========================================================
//      🤖 AI QUESTION
//   ========================================================= */

//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/ai-match-word`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = await res.json();

//       if (!data.word || !data.options) {
//         throw new Error("Invalid data");
//       }

//       setWord(data.word);
//       setOptions(data.options);

//       return {
//         word: data.word,
//         options: data.options,
//       };
//     } catch (err) {
//       console.error(
//         "❌ Match Word AI error:",
//         err
//       );

//       const fallback = {
//         word: "Dog",
//         options: [
//           {
//             word: "Dog",
//             emoji: "🐶",
//           },
//           {
//             word: "Cat",
//             emoji: "🐱",
//           },
//           {
//             word: "Ball",
//             emoji: "⚽",
//           },
//           {
//             word: "Fish",
//             emoji: "🐟",
//           },
//         ],
//       };

//       setWord(fallback.word);
//       setOptions(fallback.options);

//       return fallback;
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================================
//      🔥 RESTORE SAVED GAME
//   ========================================================= */

//   useEffect(() => {
//     if (progressLoading) return;
//     if (restored) return;

//     console.log(
//       "🔥 Match Word To Picture saved state:",
//       savedState
//     );

//     if (
//       savedState &&
//       savedState.word &&
//       savedState.options?.length
//     ) {
//       setWord(savedState.word);
//       setOptions(savedState.options);

//       setScore(
//         savedState.score ?? 0
//       );

//       setQuestionCount(
//         savedState.questionCount ?? 0
//       );

//       setMessage(
//         savedState.message || ""
//       );

//       setCompleted(
//         Boolean(savedState.completed)
//       );

//       setLoading(false);
//     } else {
//       generateQuestionAI();
//     }

//     setRestored(true);
//   }, [
//     progressLoading,
//     savedState,
//     restored,
//   ]);

//   /* =========================================================
//      💾 SAVE CURRENT STATE
//   ========================================================= */

//   const saveCurrentState = async (
//     overrides = {}
//   ) => {
//     await save({
//       word,
//       options,
//       score,
//       questionCount,
//       message,
//       loading: false,
//       completed,
//       ...overrides,
//     });
//   };

//   /* =========================================================
//      🎯 HANDLE ANSWER
//   ========================================================= */

//   const handleClick = async (item) => {
//     if (answerLocked) return;
//     if (completed) return;
//     if (loading) return;

//     if (
//       questionCount >=
//       TOTAL_QUESTIONS
//     ) {
//       return;
//     }

//     setAnswerLocked(true);

//     const isCorrect =
//       item.word === word;

//     const updatedScore =
//       isCorrect
//         ? score + 1
//         : score;

//     const feedback =
//       isCorrect
//         ? "✅ Correct!"
//         : "❌ Try again!";

//     setMessage(feedback);

//     await saveCurrentState({
//       score: updatedScore,
//       message: feedback,
//     });

//     setTimeout(async () => {
//       const next =
//         questionCount + 1;

//       /* =====================================================
//          🏁 ROUND COMPLETE
//       ===================================================== */

//       if (
//         next === TOTAL_QUESTIONS
//       ) {
//         const percentage =
//           (updatedScore /
//             TOTAL_QUESTIONS) *
//           100;

//         console.log(
//           "🏁 Match Word To Picture completed:",
//           {
//             score: updatedScore,
//             total: TOTAL_QUESTIONS,
//             percentage,
//           }
//         );

//         setScore(updatedScore);
//         setQuestionCount(next);
//         setCompleted(true);

//         setMessage(
//           `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`
//         );

//         await finish(
//           percentage,
//           "Match Word To Picture"
//         );

//         await save({
//           word,
//           options,
//           score: updatedScore,
//           questionCount: next,
//           message:
//             `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`,
//           loading: false,
//           completed: true,
//         });

//         setAnswerLocked(false);

//         return;
//       }

//       /* =====================================================
//          ➡️ NEXT AI QUESTION
//       ===================================================== */

//       const nextQuestion =
//         await generateQuestionAI();

//       setScore(updatedScore);
//       setQuestionCount(next);
//       setMessage("");

//       await save({
//         word: nextQuestion.word,
//         options: nextQuestion.options,
//         score: updatedScore,
//         questionCount: next,
//         message: "",
//         loading: false,
//         completed: false,
//       });

//       setAnswerLocked(false);
//     }, 900);
//   };

//   /* =========================================================
//      🔄 PLAY AGAIN
//   ========================================================= */

//   const handleRestart = async () => {
//     setScore(0);
//     setQuestionCount(0);
//     setMessage("");
//     setCompleted(false);
//     setAnswerLocked(false);

//     const newQuestion =
//       await generateQuestionAI();

//     await save({
//       word: newQuestion.word,
//       options: newQuestion.options,
//       score: 0,
//       questionCount: 0,
//       message: "",
//       loading: false,
//       completed: false,
//     });
//   };

//   /* =========================================================
//      📊 PERFORMANCE
//   ========================================================= */

//   const getPerformanceMessage = () => {
//     if (questionCount === 0) {
//       return "";
//     }

//     const accuracy =
//       (score / questionCount) * 100;

//     if (accuracy > 80) {
//       return "🌟 Excellent!";
//     }

//     if (accuracy > 50) {
//       return "👍 Good job!";
//     }

//     return "💡 Keep practicing!";
//   };

//   /* =========================================================
//      ⏳ LOADING
//   ========================================================= */

//   if (
//     progressLoading ||
//     !restored
//   ) {
//     return (
//       <div className="blend-page">
//         <nav className="blend-navbar">
//           <div className="brand-title">
//             🌿 CurioKids
//           </div>

//           <div className="game-title">
//             🖼️ Match Word to Picture
//           </div>
//         </nav>

//         <main className="blend-content">
//           <div className="blend-card loading-card">
//             <div className="loading-icon">
//               🦋
//             </div>

//             <h2>
//               Restoring your game...
//             </h2>

//             <p>
//               🌱 Getting your adventure ready!
//             </p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   /* =========================================================
//      🏆 COMPLETED SCREEN
//   ========================================================= */

//   if (completed) {
//     return (
//       <div className="blend-page">
//         <nav className="blend-navbar">
//           <div className="brand-title">
//             🌿 CurioKids
//           </div>

//           <div className="game-title">
//             🖼️ Match Word to Picture
//           </div>
//         </nav>

//         <main className="blend-content">
//           <div className="blend-card completion-card">

//             <div className="completion-icon">
//               🏆
//             </div>

//             <h1>
//               Picture Match Complete!
//             </h1>

//             <div className="score-pill">
//               ⭐ Score: {score}/
//               {TOTAL_QUESTIONS}
//             </div>

//             <div className="percentage-box">
//               {(
//                 (score /
//                   TOTAL_QUESTIONS) *
//                 100
//               ).toFixed(0)}
//               %
//             </div>

//             <div className="ai-analysis">
//               <span>🧠</span>

//               <p>
//                 {getPerformanceMessage()}
//               </p>
//             </div>

//             <button
//               className="play-again-btn"
//               onClick={handleRestart}
//             >
//               🔄 Play Again
//             </button>

//           </div>
//         </main>
//       </div>
//     );
//   }

//   /* =========================================================
//      🎮 GAME UI
//   ========================================================= */

//   return (
//     <div className="blend-page">

//       {/* NAVBAR */}
//       <nav className="blend-navbar">

//         <div className="brand-title">
//           🌿 CurioKids
//         </div>

//         <div className="game-title">
//           🖼️ Match Word to Picture
//         </div>

//       </nav>

//       {/* MAIN CONTENT */}
//       <main className="blend-content">

//         <div className="blend-card">

//           {/* HEADER */}
//           <div className="game-header">

//             <div className="instruction-badge">
//               ✨ Picture Adventure
//             </div>

//             <div className="game-info">

//               <span>
//                 Question {questionCount + 1}/
//                 {TOTAL_QUESTIONS}
//               </span>

//               <span className="divider">
//                 •
//               </span>

//               <span>
//                 ⭐ Score: {score}
//               </span>

//             </div>

//           </div>

//           {/* QUESTION */}
//           <div className="scramble-section">

//             <div className="scramble-label">
//               🔎 Find the Picture!
//             </div>

//             <div className="big-letter word-question">
//               {loading
//                 ? "..."
//                 : word}
//             </div>

//             <p className="question-text">
//               Which picture matches this word?
//             </p>

//           </div>

//           {/* OPTIONS */}
//           <div className="options-section">

//             <h3>
//               🌟 Choose the correct picture
//             </h3>

//             <div className="picture-options">

//               {loading ? (
//                 <div className="loading-options">
//                   <span>🌱</span>
//                   Loading...
//                 </div>
//               ) : (
//                 options.map(
//                   (item, index) => (
//                     <button
//                       key={index}
//                       className="picture-option"
//                       onClick={() =>
//                         handleClick(item)
//                       }
//                       disabled={
//                         answerLocked
//                       }
//                     >
//                       <span className="picture-option-letter">
//                         {String.fromCharCode(
//                           65 + index
//                         )}
//                       </span>

//                       <span className="picture-emoji">
//                         {item.emoji}
//                       </span>

//                       <span className="picture-word">
//                         {item.word}
//                       </span>
//                     </button>
//                   )
//                 )
//               )}

//             </div>

//           </div>

//           {/* FEEDBACK */}
//           {message && (
//             <div
//               className={`feedback-message ${
//                 message.includes("Correct")
//                   ? "correct"
//                   : "wrong"
//               }`}
//             >
//               {message}
//             </div>
//           )}

//           {/* PERFORMANCE */}
//           <div className="ai-analysis">
//             <span>🧠</span>

//             <p>
//               {getPerformanceMessage()}
//             </p>
//           </div>

//         </div>

//       </main>

//     </div>
//   );
// }




import { useState, useEffect, useRef } from "react";
import "../styles/MatchWordToPicture.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "match-word-to-picture";
const TOTAL_QUESTIONS = 5;

const FALLBACK_QUESTIONS = [
  {
    word: "Dog",
    options: [
      { word: "Dog", emoji: "🐶" },
      { word: "Cat", emoji: "🐱" },
      { word: "Ball", emoji: "⚽" },
      { word: "Fish", emoji: "🐟" },
    ],
  },
  {
    word: "Apple",
    options: [
      { word: "Banana", emoji: "🍌" },
      { word: "Apple", emoji: "🍎" },
      { word: "Car", emoji: "🚗" },
      { word: "Sun", emoji: "☀️" },
    ],
  },
  {
    word: "Fish",
    options: [
      { word: "Tree", emoji: "🌳" },
      { word: "Fish", emoji: "🐟" },
      { word: "House", emoji: "🏠" },
      { word: "Flower", emoji: "🌸" },
    ],
  },
  {
    word: "Lion",
    options: [
      { word: "Lion", emoji: "🦁" },
      { word: "Panda", emoji: "🐼" },
      { word: "Bird", emoji: "🐦" },
      { word: "Frog", emoji: "🐸" },
    ],
  },
  {
    word: "Sun",
    options: [
      { word: "Moon", emoji: "🌙" },
      { word: "Cloud", emoji: "☁️" },
      { word: "Sun", emoji: "☀️" },
      { word: "Star", emoji: "⭐" },
    ],
  },
];

export default function MatchWordToPicture() {
  const initialState = {
    word: "",
    options: [],
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
  } = useGameProgress(GAME_ID, initialState);

  const [word, setWord] = useState("");
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);

  const usedWordsRef = useRef(new Set());

  const rememberWord = (value) => {
    if (!value) return;

    usedWordsRef.current.add(
      String(value).trim().toLowerCase()
    );
  };

  const pickFallbackQuestion = () => {
    const unused = FALLBACK_QUESTIONS.find(
      (question) =>
        !usedWordsRef.current.has(
          question.word.toLowerCase()
        )
    );

    const question =
      unused || FALLBACK_QUESTIONS[
        Math.floor(
          Math.random() *
            FALLBACK_QUESTIONS.length
        )
      ];

    rememberWord(question.word);

    return question;
  };

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      let lastCandidate = null;

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/generate-match-image?fresh=${Date.now()}-${attempt}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            `Server returned ${res.status}`
          );
        }

        const data = await res.json();

        if (
          !data.word ||
          !Array.isArray(data.options) ||
          data.options.length < 2
        ) {
          throw new Error("Invalid match data");
        }

        lastCandidate = {
          word: String(data.word).trim(),
          options: data.options,
        };

        const normalizedWord =
          lastCandidate.word.toLowerCase();

        if (
          !usedWordsRef.current.has(
            normalizedWord
          )
        ) {
          rememberWord(lastCandidate.word);

          setWord(lastCandidate.word);
          setOptions(lastCandidate.options);

          return lastCandidate;
        }
      }

      const fallback =
        pickFallbackQuestion();

      setWord(fallback.word);
      setOptions(fallback.options);

      return fallback;
    } catch (err) {
      console.error(
        "❌ Match Word AI error:",
        err
      );

      const fallback =
        pickFallbackQuestion();

      setWord(fallback.word);
      setOptions(fallback.options);

      return fallback;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (progressLoading || restored) return;

    if (
      savedState &&
      savedState.word &&
      savedState.options?.length
    ) {
      setWord(savedState.word);
      setOptions(savedState.options);
      setScore(savedState.score ?? 0);
      setQuestionCount(
        savedState.questionCount ?? 0
      );
      setMessage(savedState.message || "");
      setCompleted(
        Boolean(savedState.completed)
      );

      rememberWord(savedState.word);
      setLoading(false);
    } else {
      generateQuestionAI();
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

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

  const handleClick = async (item) => {
    if (answerLocked || completed || loading) {
      return;
    }

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

    await saveCurrentState({
      score: updatedScore,
      message: feedback,
    });

    setTimeout(async () => {
      const next =
        questionCount + 1;

      if (
        next === TOTAL_QUESTIONS
      ) {
        const percentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        const completedMessage =
          `🎯 Round Completed! Score: ${updatedScore}/${TOTAL_QUESTIONS}`;

        setScore(updatedScore);
        setQuestionCount(next);
        setCompleted(true);
        setMessage(completedMessage);

        await finish(
          percentage,
          "Match Word To Picture"
        );

        await save({
          word,
          options,
          score: updatedScore,
          questionCount: next,
          message: completedMessage,
          loading: false,
          completed: true,
        });

        setAnswerLocked(false);
        return;
      }

      const nextQuestion =
        await generateQuestionAI();

      setScore(updatedScore);
      setQuestionCount(next);
      setMessage("");

      await save({
        word: nextQuestion.word,
        options: nextQuestion.options,
        score: updatedScore,
        questionCount: next,
        message: "",
        loading: false,
        completed: false,
      });

      setAnswerLocked(false);
    }, 850);
  };

  const handleRestart = async () => {
    usedWordsRef.current.clear();

    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);
    setAnswerLocked(false);

    const newQuestion =
      await generateQuestionAI();

    await save({
      word: newQuestion.word,
      options: newQuestion.options,
      score: 0,
      questionCount: 0,
      message: "",
      loading: false,
      completed: false,
    });
  };

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Excellent!";
    }

    if (accuracy > 50) {
      return "👍 Good job!";
    }

    return "💡 Keep practicing!";
  };

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="blend-page">
        <nav className="blend-navbar">
          <div className="brand-title">
            🌿 CurioKids
          </div>

          <div className="game-title">
            🖼️ Match Word to Picture
          </div>
        </nav>

        <main className="blend-content">
          <div className="blend-card loading-card">
            <div className="loading-icon">
              🦋
            </div>

            <h2>Restoring your game...</h2>

            <p>
              🌱 Getting your adventure ready!
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="blend-page">
        <nav className="blend-navbar">
          <div className="brand-title">
            🌿 CurioKids
          </div>

          <div className="game-title">
            🖼️ Match Word to Picture
          </div>
        </nav>

        <main className="blend-content">
          <div className="blend-card completion-card">
            <div className="completion-icon">
              🏆
            </div>

            <span className="completion-kicker">
              Jungle Challenge Complete
            </span>

            <h1>
              Picture Match Complete!
            </h1>

            <div className="completion-summary">
              <div className="score-pill">
                ⭐ Score: {score}/{TOTAL_QUESTIONS}
              </div>

              <div className="percentage-box">
                {(
                  (score /
                    TOTAL_QUESTIONS) *
                  100
                ).toFixed(0)}
                <span>%</span>
              </div>
            </div>

            <div className="ai-analysis">
              <span>🧠</span>

              <p>
                {getPerformanceMessage()}
              </p>
            </div>

            <button
              className="play-again-btn"
              onClick={handleRestart}
            >
              🔄 Play Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="blend-page">
      <nav className="blend-navbar">
        <div className="brand-title">
          🌿 CurioKids
        </div>

        <div className="game-title">
          🖼️ Match Word to Picture
        </div>
      </nav>

      <main className="blend-content">
        <div className="blend-card">

          <div className="game-header">
            <div className="instruction-badge">
              🌿 Picture Adventure
            </div>

            <div className="game-info">
              <span>
                Question: {Math.min(
                  questionCount + 1,
                  TOTAL_QUESTIONS
                )}/{TOTAL_QUESTIONS}
              </span>

              <span className="divider">
                •
              </span>

              <span>
                ⭐ Score: {score}
              </span>
            </div>
          </div>

          <section className="scramble-section">
            <div className="scramble-label">
              🔎 MATCH THE WORD
            </div>

            <div className="big-letter word-question">
              {loading ? "..." : word}
            </div>

            <p className="question-text">
              Which picture matches this word?
            </p>

            <div className="jungle-mini-decor">
              <span>🍃</span>
              <span>🦋</span>
              <span>🌿</span>
            </div>
          </section>

          <section className="options-section">
            <h3>
              🌟 Choose the correct picture
            </h3>

            <div className="picture-options">
              {loading ? (
                <div className="loading-options">
                  <span>🌱</span>
                  Loading pictures...
                </div>
              ) : (
                options.map((item, index) => (
                  <button
                    key={`${item.word}-${index}`}
                    className="picture-option"
                    onClick={() =>
                      handleClick(item)
                    }
                    disabled={answerLocked}
                  >
                    <span className="picture-option-letter">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="picture-emoji">
                      {item.emoji}
                    </span>

                    <span className="picture-word">
                      {item.word}
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>

          {message && (
            <div
              className={`feedback-message ${
                message.includes("Correct")
                  ? "correct"
                  : "wrong"
              }`}
            >
              {message}
            </div>
          )}

          <div className="ai-analysis">
            <span>🧠</span>

            <p>
              {getPerformanceMessage()}
            </p>
          </div>

          <div className="jungle-hint">
            🍃 Think • Match • Grow
          </div>

        </div>
      </main>
    </div>
  );
}
