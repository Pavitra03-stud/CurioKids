// // import { useState, useEffect } from "react";
// // import "../styles/BeginningSounds.css";

// // // 🔥 Firebase
// // import { db } from "../firebase";
// // import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // export default function EndingSounds() {

// //   const TOTAL_QUESTIONS = 5;

// //   const [currentWord, setCurrentWord] = useState({});
// //   const [options, setOptions] = useState([]);

// //   const [score, setScore] = useState(0);
// //   const [questionCount, setQuestionCount] = useState(0);

// //   const [feedback, setFeedback] = useState("");
// //   const [loading, setLoading] = useState(true);

// //   // 🤖 AI QUESTION
// //   const generateQuestionAI = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await fetch("http://localhost:5000/api/generate-ending-sound", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json"
// //         }
// //       });

// //       const data = await res.json();

// //       console.log("AI DATA:", data);

// //       if (!data.word || !data.sound || !data.options) {
// //         throw new Error("Invalid data");
// //       }

// //       setCurrentWord({
// //         word: data.word,
// //         sound: data.sound,
// //         emoji: data.emoji || "🔤"
// //       });

// //       setOptions(data.options);

// //     } catch (err) {
// //       console.error(err);

// //       // fallback
// //       const fallback = {
// //         word: "Dog",
// //         sound: "G",
// //         emoji: "🐶",
// //         options: ["G","D","M","S"]
// //       };

// //       setCurrentWord(fallback);
// //       setOptions(fallback.options);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ✅ LOAD FIRST QUESTION
// //   useEffect(() => {
// //     generateQuestionAI();
// //   }, []);

// //   // ☁️ SAVE
// //   const saveScoreToFirestore = async (finalScore) => {
// //     try {
// //       const userEmail = "demo_user";

// //       const userRef = doc(db, "users", userEmail);
// //       const gameResultsRef = collection(userRef, "game_results");

// //       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

// //       await addDoc(gameResultsRef, {
// //         score: finalScore,
// //         totalQuestions: TOTAL_QUESTIONS,
// //         accuracy: accuracy.toFixed(2),
// //         createdAt: Timestamp.now(),
// //         game: "EndingSounds_AI"
// //       });

// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   // 🎯 HANDLE CLICK
// //   const handleClick = (letter) => {

// //     if (questionCount >= TOTAL_QUESTIONS) return;

// //     const isCorrect = letter === currentWord.sound;
// //     const updatedScore = isCorrect ? score + 1 : score;

// //     if (isCorrect) {
// //       setScore(updatedScore);
// //       setFeedback("correct");
// //     } else {
// //       setFeedback("wrong");
// //     }

// //     setTimeout(async () => {

// //       setFeedback("");

// //       const nextCount = questionCount + 1;
// //       setQuestionCount(nextCount);

// //       if (nextCount === TOTAL_QUESTIONS) {

// //         await saveScoreToFirestore(updatedScore);

// //         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

// //         setScore(0);
// //         setQuestionCount(0);
// //         generateQuestionAI();

// //       } else {
// //         generateQuestionAI();
// //       }

// //     }, 700);
// //   };

// //   // 📊 ANALYSIS
// //   const getPerformanceMessage = () => {
// //     if (questionCount === 0) return "";

// //     const accuracy = (score / questionCount) * 100;

// //     if (accuracy > 80) return "🌟 Excellent!";
// //     if (accuracy > 50) return "👍 Good job!";
// //     return "💡 Practice more!";
// //   };

// //   return (
// //     <div className="phonics-page">

// //       <div className="letter-navbar">
// //         <h2>🤖 AI Ending Sounds</h2>
// //       </div>

// //       <div className="game-info">
// //         <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
// //         <span>Score: {score}</span>
// //       </div>

// //       <div className="word-display">
// //         <div className="emoji">
// //           {loading ? "⏳" : (currentWord?.emoji || "🔤")}
// //         </div>
// //         <h2>
// //           {loading ? "Loading..." : (currentWord?.word || "Loading...")}
// //         </h2>
// //       </div>

// //       <h3>What sound does it END with?</h3>

// //       <div className="options-grid">
// //         {loading ? (
// //           <p>Loading question...</p>
// //         ) : (
// //           options.map((letter, index) => (
// //             <button
// //               key={index}
// //               className="option-btn"
// //               onClick={() => handleClick(letter)}
// //             >
// //               {letter}
// //             </button>
// //           ))
// //         )}
// //       </div>

// //       {feedback === "correct" && (
// //         <div className="feedback good">🎉 Correct!</div>
// //       )}

// //       {feedback === "wrong" && (
// //         <div className="feedback wrong">❌ Try Again</div>
// //       )}

// //       <div className="ai-analysis">
// //         <p>{getPerformanceMessage()}</p>
// //       </div>

// //     </div>
// //   );
// // }



// import { useState, useEffect } from "react";
// import "../styles/BeginningSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // ✅ GameContext
// import { useGame } from "../context/GameContext";

// export default function EndingSounds() {

//   const { addStars } = useGame(); // ✅ ADDED

//   const TOTAL_QUESTIONS = 5;

//   const [currentWord, setCurrentWord] = useState({});
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [feedback, setFeedback] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/generate-ending-sound", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await res.json();

//       if (!data.word || !data.sound || !data.options) {
//         throw new Error("Invalid data");
//       }

//       setCurrentWord({
//         word: data.word,
//         sound: data.sound,
//         emoji: data.emoji || "🔤"
//       });

//       setOptions(data.options);

//     } catch (err) {
//       console.error(err);

//       const fallback = {
//         word: "Dog",
//         sound: "G",
//         emoji: "🐶",
//         options: ["G","D","M","S"]
//       };

//       setCurrentWord(fallback);
//       setOptions(fallback.options);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateQuestionAI();
//   }, []);

//   // ✅ ACTIVITY LOGGER
//   const logActivity = async (finalScore) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     await addDoc(collection(db, "activity"), {
//       userId,
//       action: "play",
//       module: "phonics",
//       screen: "ending-sounds",
//       score: finalScore,
//       timestamp: new Date(),
//     });
//   };

//   // ☁️ SAVE (UPDATED USER-SPECIFIC)
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userId = localStorage.getItem("userId"); // ✅ FIXED
//       if (!userId) return;

//       const userRef = doc(db, "users", userId);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: "EndingSounds_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // 🎯 HANDLE CLICK
//   const handleClick = (letter) => {

//     if (questionCount >= TOTAL_QUESTIONS) return;

//     const isCorrect = letter === currentWord.sound;
//     const updatedScore = isCorrect ? score + 1 : score;

//     if (isCorrect) {
//       setScore(updatedScore);
//       setFeedback("correct");
//     } else {
//       setFeedback("wrong");
//     }

//     setTimeout(async () => {

//       setFeedback("");

//       const nextCount = questionCount + 1;
//       setQuestionCount(nextCount);

//       if (nextCount === TOTAL_QUESTIONS) {

//         const finalPercentage = (updatedScore / TOTAL_QUESTIONS) * 100;

//         // ✅ MAIN SYSTEM
//         await addStars(finalPercentage, "Ending Sounds");

//         // ✅ ACTIVITY
//         await logActivity(finalPercentage);

//         // ✅ YOUR SAVE
//         await saveScoreToFirestore(updatedScore);

//         alert(`🎯 Round Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`);

//         // RESET
//         setScore(0);
//         setQuestionCount(0);
//         generateQuestionAI();

//       } else {
//         generateQuestionAI();
//       }

//     }, 700);
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
//     <div className="phonics-page">

//       <div className="letter-navbar">
//         <h2>🤖 AI Ending Sounds</h2>
//       </div>

//       <div className="game-info">
//         <span>Question: {questionCount + 1}/{TOTAL_QUESTIONS}</span>
//         <span>Score: {score}</span>
//       </div>

//       <div className="word-display">
//         <div className="emoji">
//           {loading ? "⏳" : (currentWord?.emoji || "🔤")}
//         </div>
//         <h2>
//           {loading ? "Loading..." : (currentWord?.word || "Loading...")}
//         </h2>
//       </div>

//       <h3>What sound does it END with?</h3>

//       <div className="options-grid">
//         {loading ? (
//           <p>Loading question...</p>
//         ) : (
//           options.map((letter, index) => (
//             <button
//               key={index}
//               className="option-btn"
//               onClick={() => handleClick(letter)}
//             >
//               {letter}
//             </button>
//           ))
//         )}
//       </div>

//       {feedback === "correct" && (
//         <div className="feedback good">🎉 Correct!</div>
//       )}

//       {feedback === "wrong" && (
//         <div className="feedback wrong">❌ Try Again</div>
//       )}

//       <div className="ai-analysis">
//         <p>{getPerformanceMessage()}</p>
//       </div>

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import "../styles/BeginningSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// ✅ Game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "ending-sounds";

const TOTAL_QUESTIONS = 5;

const INITIAL_STATE = {
  currentWord: null,
  options: [],
  score: 0,
  questionCount: 0,
  feedback: "",
  completed: false,
};

export default function EndingSounds() {
  // =========================================================
  // GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );

  // =========================================================
  // STATES
  // =========================================================

  const [currentWord, setCurrentWord] =
    useState(null);

  const [options, setOptions] =
    useState([]);

  const [score, setScore] =
    useState(0);

  const [questionCount, setQuestionCount] =
    useState(0);

  const [feedback, setFeedback] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [gameFinished, setGameFinished] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // =========================================================
  // FALLBACK QUESTION
  // =========================================================

  const fallbackQuestion = {
    word: "Dog",
    sound: "G",
    emoji: "🐶",
    options: ["G", "D", "M", "S"],
  };

  // =========================================================
  // GENERATE AI QUESTION
  // =========================================================

  const generateQuestionAI = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/generate-ending-sound",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (
        !data.word ||
        !data.sound ||
        !data.options
      ) {
        throw new Error(
          "Invalid AI response"
        );
      }

      const question = {
        word: data.word,
        sound: data.sound,
        emoji: data.emoji || "🔤",
      };

      setCurrentWord(question);
      setOptions(data.options);

      return {
        currentWord: question,
        options: data.options,
      };
    } catch (err) {
      console.error(
        "❌ Ending sound AI error:",
        err
      );

      setCurrentWord(fallbackQuestion);
      setOptions(
        fallbackQuestion.options
      );

      return {
        currentWord: fallbackQuestion,
        options:
          fallbackQuestion.options,
      };
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESTORE SAVED PROGRESS
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Ending Sounds saved state:",
      savedState
    );

    if (savedState) {
      setScore(
        savedState.score ?? 0
      );

      setQuestionCount(
        savedState.questionCount ?? 0
      );

      setFeedback(
        savedState.feedback ?? ""
      );

      setGameFinished(
        savedState.completed ?? false
      );

      if (savedState.currentWord) {
        setCurrentWord(
          savedState.currentWord
        );

        setOptions(
          savedState.options ?? []
        );

        setLoading(false);
      } else {
        generateQuestionAI();
      }
    } else {
      generateQuestionAI();
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "phonics",
          screen: "ending-sounds",
          score: finalScore,
          timestamp: new Date(),
        }
      );

      console.log(
        "✅ Ending Sounds activity logged"
      );
    } catch (error) {
      console.error(
        "❌ Activity logging failed:",
        error
      );
    }
  };

  // =========================================================
  // SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

      const gameResultsRef = collection(
        db,
        "users",
        userId,
        "game_results"
      );

      const accuracy =
        (finalScore /
          TOTAL_QUESTIONS) *
        100;

      await addDoc(
        gameResultsRef,
        {
          score: finalScore,
          totalQuestions:
            TOTAL_QUESTIONS,
          accuracy:
            accuracy.toFixed(2),
          createdAt: Timestamp.now(),
          game: "EndingSounds_AI",
        }
      );

      console.log(
        "✅ Ending Sounds result saved"
      );
    } catch (error) {
      console.error(
        "❌ Game result save failed:",
        error
      );
    }
  };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = async (letter) => {
    if (processing) return;
    if (loading) return;
    if (gameFinished) return;
    if (questionCount >= TOTAL_QUESTIONS)
      return;

    setProcessing(true);

    const isCorrect =
      letter === currentWord.sound;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const newFeedback = isCorrect
      ? "correct"
      : "wrong";

    setFeedback(newFeedback);
    setScore(updatedScore);

    // -------------------------------------------------------
    // SAVE CURRENT ANSWER
    // -------------------------------------------------------

    await save({
      currentWord,
      options,
      score: updatedScore,
      questionCount,
      feedback: newFeedback,
      completed: false,
    });

    // -------------------------------------------------------
    // WAIT BEFORE NEXT QUESTION
    // -------------------------------------------------------

    setTimeout(async () => {
      const nextCount =
        questionCount + 1;

      setFeedback("");
      setQuestionCount(nextCount);

      // =====================================================
      // ROUND COMPLETED
      // =====================================================

      if (
        nextCount ===
        TOTAL_QUESTIONS
      ) {
        const finalPercentage =
          (updatedScore /
            TOTAL_QUESTIONS) *
          100;

        console.log(
          "🏁 Ending Sounds completed:",
          {
            score: updatedScore,
            total: TOTAL_QUESTIONS,
            percentage:
              finalPercentage,
          }
        );

        setGameFinished(true);

        // ⭐ Central game completion
        await finish(
          finalPercentage,
          "Ending Sounds"
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        // 💾 Detailed game result
        await saveScoreToFirestore(
          updatedScore
        );

        // Save completion state
        await save({
          currentWord,
          options,
          score: updatedScore,
          questionCount:
            TOTAL_QUESTIONS,
          feedback: "",
          completed: true,
        });

        setProcessing(false);

        return;
      }

      // =====================================================
      // NEXT QUESTION
      // =====================================================

      const nextQuestion =
        await generateQuestionAI();

      setScore(updatedScore);

      await save({
        currentWord:
          nextQuestion.currentWord,
        options:
          nextQuestion.options,
        score: updatedScore,
        questionCount:
          nextCount,
        feedback: "",
        completed: false,
      });

      setProcessing(false);
    }, 700);
  };

  // =========================================================
  // PERFORMANCE MESSAGE
  // =========================================================

  const getPerformanceMessage = () => {
    if (questionCount === 0)
      return "";

    const accuracy =
      (score /
        questionCount) *
      100;

    if (accuracy > 80)
      return "🌟 Excellent!";

    if (accuracy > 50)
      return "👍 Good job!";

    return "💡 Practice more!";
  };

  // =========================================================
  // LOADING / RESTORING
  // =========================================================

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="phonics-page">

        <div className="letter-navbar">
          <h2>
            🤖 AI Ending Sounds
          </h2>
        </div>

        <div className="word-display">
          <div className="emoji">
            ⏳
          </div>

          <h2>
            Restoring your progress...
          </h2>
        </div>

      </div>
    );
  }

  // =========================================================
  // COMPLETION SCREEN
  // =========================================================

  if (gameFinished) {
    const percentage =
      (score /
        TOTAL_QUESTIONS) *
      100;

    return (
      <div className="phonics-page">

        <div className="letter-navbar">
          <h2>
            🤖 AI Ending Sounds
          </h2>
        </div>

        <div className="word-display">

          <div className="emoji">
            🏆
          </div>

          <h2>
            Round Completed!
          </h2>

          <p>
            🎯 Score:{" "}
            {score}/
            {TOTAL_QUESTIONS}
          </p>

          <p>
            ⭐ Accuracy:{" "}
            {percentage.toFixed(0)}%
          </p>

          <button
            className="option-btn"
            onClick={async () => {
              setScore(0);
              setQuestionCount(0);
              setFeedback("");
              setGameFinished(false);
              setCurrentWord(null);
              setOptions([]);

              const nextQuestion =
                await generateQuestionAI();

              await save({
                currentWord:
                  nextQuestion.currentWord,
                options:
                  nextQuestion.options,
                score: 0,
                questionCount: 0,
                feedback: "",
                completed: false,
              });
            }}
          >
            🎮 Play Again
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN GAME UI
  // =========================================================

  return (
    <div className="phonics-page">

      <div className="letter-navbar">
        <h2>
          🤖 AI Ending Sounds
        </h2>
      </div>

      {/* GAME INFO */}

      <div className="game-info">

        <span>
          Question:{" "}
          {Math.min(
            questionCount + 1,
            TOTAL_QUESTIONS
          )}
          /
          {TOTAL_QUESTIONS}
        </span>

        <span>
          Score: {score}
        </span>

      </div>

      {/* WORD */}

      <div className="word-display">

        <div className="emoji">
          {loading
            ? "⏳"
            : currentWord?.emoji ||
              "🔤"}
        </div>

        <h2>
          {loading
            ? "Loading..."
            : currentWord?.word ||
              "Loading..."}
        </h2>

      </div>

      <h3>
        What sound does it END with?
      </h3>

      {/* OPTIONS */}

      <div className="options-grid">

        {loading ? (
          <p>
            Loading question...
          </p>
        ) : (
          options.map(
            (letter, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() =>
                  handleClick(letter)
                }
                disabled={
                  processing
                }
              >
                {letter}
              </button>
            )
          )
        )}

      </div>

      {/* FEEDBACK */}

      {feedback ===
        "correct" && (
        <div className="feedback good">
          🎉 Correct!
        </div>
      )}

      {feedback ===
        "wrong" && (
        <div className="feedback wrong">
          ❌ Try Again
        </div>
      )}

      {/* PERFORMANCE */}

      <div className="ai-analysis">
        <p>
          {getPerformanceMessage()}
        </p>
      </div>

    </div>
  );
}