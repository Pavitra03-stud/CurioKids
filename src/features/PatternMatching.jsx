// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function PatternMatching() {

//   const TOTAL_QUESTIONS = 5;

//   // 🔥 MODE
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [pattern, setPattern] = useState([]);
//   const [options, setOptions] = useState([]);
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

//       const a = base[Math.floor(Math.random() * base.length)];
//       let b;

//       do {
//         b = base[Math.floor(Math.random() * base.length)];
//       } while (b === a);

//       const type = Math.random();

//       let newPattern, correct;

//       if (type < 0.5) {
//         // ABAB_
//         newPattern = [a, b, a, b, "?"];
//         correct = a;
//       } else {
//         // AABB_
//         newPattern = [a, a, b, b, "?"];
//         correct = b;
//       }

//       const wrong = base
//         .filter((l) => l !== correct)
//         .sort(() => 0.5 - Math.random())
//         .slice(0, 2);

//       const opts = [correct, ...wrong].sort(() => 0.5 - Math.random());

//       setPattern(newPattern);
//       setAnswer(correct);
//       setOptions(opts);

//     } catch (err) {
//       console.error(err);

//       // fallback
//       setPattern(["A","B","A","B","?"]);
//       setOptions(["A","C","D"]);
//       setAnswer("A");
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
//         game: `PatternMatching_${mode}`
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

//     if (accuracy > 80) return "🌟 Pattern Genius!";
//     if (accuracy > 50) return "👍 Nice thinking!";
//     return "💡 Practice patterns!";
//   };

//   return (
//     <div className="blend-container">

//       <h2>🧠 Pattern Matching ({mode})</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       {/* PATTERN */}
//       <div className="sounds">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           pattern.map((item, i) => (
//             <span key={i} className="sound-box">
//               {item}
//             </span>
//           ))
//         )}
//       </div>

//       <h3>What comes next?</h3>

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



import { useEffect, useState } from "react";
import "../styles/BlendSounds.css";

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { useLocation } from "react-router-dom";
import useGameProgress from "../hooks/useGameProgress";

export default function PatternMatching() {
  const TOTAL_QUESTIONS = 5;

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  /*
   * Each mode has its own saved game.
   * This prevents letters and numbers progress
   * from overwriting each other.
   */
  const GAME_ID = `pattern-matching-${mode}`;

  const initialState = {
    pattern: [],
    options: [],
    answer: "",
    score: 0,
    questionCount: 0,
    message: "",
    completed: false,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, initialState);

  const [pattern, setPattern] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [restored, setRestored] = useState(false);
  const [completed, setCompleted] = useState(false);

  // =========================================================
  // 🤖 GENERATE QUESTION
  // =========================================================

  const generateQuestionAI = async (shouldSave = true) => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const a =
        base[Math.floor(Math.random() * base.length)];

      let b;

      do {
        b =
          base[Math.floor(Math.random() * base.length)];
      } while (b === a);

      const type = Math.random();

      let newPattern;
      let correct;

      if (type < 0.5) {
        // ABAB_
        newPattern = [a, b, a, b, "?"];
        correct = a;
      } else {
        // AABB_
        newPattern = [a, a, b, b, "?"];
        correct = b;
      }

      const wrong = base
        .filter((item) => item !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const opts = [correct, ...wrong].sort(
        () => 0.5 - Math.random()
      );

      setPattern(newPattern);
      setAnswer(correct);
      setOptions(opts);
      setMessage("");

      // 💾 Save exact generated question
      if (shouldSave) {
        await save({
          pattern: newPattern,
          options: opts,
          answer: correct,
          score,
          questionCount,
          message: "",
          completed: false,
        });
      }
    } catch (err) {
      console.error("❌ Pattern generation error:", err);

      const fallbackPattern = [
        "A",
        "B",
        "A",
        "B",
        "?",
      ];

      const fallbackOptions = [
        "A",
        "C",
        "D",
      ];

      setPattern(fallbackPattern);
      setOptions(fallbackOptions);
      setAnswer("A");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🔥 RESTORE / START GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (!savedState) return;
    if (restored) return;

    console.log(
      "🔥 Pattern Matching saved state:",
      savedState
    );

    /*
     * If saved question exists, restore it exactly.
     */
    if (
      savedState.pattern?.length &&
      savedState.options?.length &&
      savedState.answer
    ) {
      setPattern(savedState.pattern);
      setOptions(savedState.options);
      setAnswer(savedState.answer);

      setScore(savedState.score || 0);
      setQuestionCount(
        savedState.questionCount || 0
      );

      setMessage(savedState.message || "");
      setCompleted(
        Boolean(savedState.completed)
      );

      setLoading(false);
      setRestored(true);

      return;
    }

    /*
     * No saved question → generate first question.
     */
    setRestored(true);

    const startGame = async () => {
      await generateQuestionAI(false);
    };

    startGame();
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // ☁️ SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        console.log(
          "❌ No userId found for game result"
        );
        return;
      }

      const userRef = doc(
        db,
        "users",
        userId
      );

      const gameResultsRef = collection(
        userRef,
        "game_results"
      );

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: `PatternMatching_${mode}`,
      });

      console.log(
        "✅ Pattern Matching result saved"
      );
    } catch (error) {
      console.error(
        "❌ Failed to save game result:",
        error
      );
    }
  };

  // =========================================================
  // 🎯 ANSWER
  // =========================================================

  const handleClick = async (item) => {
    if (loading) return;

    if (questionCount >= TOTAL_QUESTIONS) {
      return;
    }

    const isCorrect = item === answer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const nextQuestion =
      questionCount + 1;

    setMessage(
      isCorrect
        ? "✅ Correct!"
        : "❌ Try again!"
    );

    // Prevent multiple clicks during delay
    setLoading(true);

    setTimeout(async () => {
      try {
        setMessage("");

        // =================================================
        // 🏁 FINAL QUESTION
        // =================================================

        if (
          nextQuestion ===
          TOTAL_QUESTIONS
        ) {
          const percentage =
            (updatedScore /
              TOTAL_QUESTIONS) *
            100;

          console.log(
            "🏁 Pattern Matching completed:",
            {
              updatedScore,
              percentage,
            }
          );

          // Save individual game result
          await saveScoreToFirestore(
            updatedScore
          );

          // ⭐ Add stars + history
          await finish(
            percentage,
            `Pattern Matching (${mode})`
          );

          setCompleted(true);

          await save({
            pattern: [],
            options: [],
            answer: "",
            score: updatedScore,
            questionCount: TOTAL_QUESTIONS,
            message: "",
            completed: true,
          });

          alert(
            `🎯 Completed!\nScore: ${updatedScore}/5`
          );

          return;
        }

        // =================================================
        // ➡️ NEXT QUESTION
        // =================================================

        setScore(updatedScore);
        setQuestionCount(nextQuestion);

        /*
         * Generate the next question first.
         */
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

        const a =
          base[
            Math.floor(
              Math.random() * base.length
            )
          ];

        let b;

        do {
          b =
            base[
              Math.floor(
                Math.random() *
                  base.length
              )
            ];
        } while (b === a);

        const type = Math.random();

        let newPattern;
        let correct;

        if (type < 0.5) {
          newPattern = [
            a,
            b,
            a,
            b,
            "?",
          ];

          correct = a;
        } else {
          newPattern = [
            a,
            a,
            b,
            b,
            "?",
          ];

          correct = b;
        }

        const wrong = base
          .filter(
            (item) => item !== correct
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        const newOptions = [
          correct,
          ...wrong,
        ].sort(() => 0.5 - Math.random());

        setPattern(newPattern);
        setAnswer(correct);
        setOptions(newOptions);

        // 💾 Save exact next question
        await save({
          pattern: newPattern,
          options: newOptions,
          answer: correct,
          score: updatedScore,
          questionCount: nextQuestion,
          message: "",
          completed: false,
        });
      } catch (error) {
        console.error(
          "❌ Error moving to next question:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  // =========================================================
  // 📊 PERFORMANCE
  // =========================================================

  const getPerformanceMessage = () => {
    if (questionCount === 0) {
      return "";
    }

    const accuracy =
      (score / questionCount) * 100;

    if (accuracy > 80) {
      return "🌟 Pattern Genius!";
    }

    if (accuracy > 50) {
      return "👍 Nice thinking!";
    }

    return "💡 Practice patterns!";
  };

  // =========================================================
  // ⏳ FIREBASE LOADING
  // =========================================================

  if (progressLoading || !restored) {
    return (
      <div className="blend-container">
        <h2>
          🧠 Pattern Matching ({mode})
        </h2>

        <p>Loading your game... 🌱</p>
      </div>
    );
  }

  // =========================================================
  // 🏆 COMPLETED
  // =========================================================

  if (completed) {
    const percentage =
      (score / TOTAL_QUESTIONS) * 100;

    return (
      <div className="blend-container">

        <h2>
          🎉 Pattern Matching Complete!
        </h2>

        <div className="game-info">
          Score: {score}/{TOTAL_QUESTIONS}
        </div>

        <div className="ai-analysis">
          <p>
            {percentage > 80
              ? "🌟 Pattern Genius!"
              : percentage > 50
              ? "👍 Nice thinking!"
              : "💡 Keep practicing!"}
          </p>
        </div>

        <button
          onClick={async () => {
            setScore(0);
            setQuestionCount(0);
            setCompleted(false);
            setMessage("");

            await generateQuestionAI(false);

            await save({
              pattern: [],
              options: [],
              answer: "",
              score: 0,
              questionCount: 0,
              message: "",
              completed: false,
            });
          }}
        >
          🔄 Play Again
        </button>

      </div>
    );
  }

  // =========================================================
  // 🎮 UI
  // =========================================================

  return (
    <div className="blend-container">

      <h2>
        🧠 Pattern Matching ({mode})
      </h2>

      <div className="game-info">
        Question{" "}
        {questionCount + 1}/
        {TOTAL_QUESTIONS} | Score:{" "}
        {score}
      </div>

      {/* PATTERN */}
      <div className="sounds">

        {loading ? (
          <p>Loading...</p>
        ) : (
          pattern.map((item, i) => (
            <span
              key={i}
              className="sound-box"
            >
              {item}
            </span>
          ))
        )}

      </div>

      <h3>
        What comes next?
      </h3>

      {/* OPTIONS */}
      <div className="options">

        {loading ? (
          <p>Loading...</p>
        ) : (
          options.map((opt, i) => (
            <button
              key={i}
              onClick={() =>
                handleClick(opt)
              }
              disabled={loading}
            >
              {opt}
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