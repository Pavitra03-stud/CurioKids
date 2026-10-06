// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc
// } from "firebase/firestore";

// export default function RewardChallenge() {

//   const TOTAL_QUESTIONS = 5;
//   const PASS_SCORE = 4;

//   const userEmail = "demo_user";

//   const [started, setStarted] = useState(false);

//   const [target, setTarget] = useState("");
//   const [options, setOptions] = useState([]);

//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [stars, setStars] = useState(0);
//   const [badges, setBadges] = useState([]);

//   const [message, setMessage] = useState("");

//   // 🔥 LOAD REWARDS
//   const loadRewards = async () => {
//     const ref = doc(db, "users", userEmail, "rewards", "summary");

//     const snap = await getDoc(ref);

//     if (snap.exists()) {
//       setStars(snap.data().stars || 0);
//       setBadges(snap.data().badges || []);
//     } else {
//       await setDoc(ref, {
//         stars: 0,
//         badges: []
//       });
//     }
//   };

//   useEffect(() => {
//     loadRewards();
//   }, []);

//   // 🤖 AI QUESTION
//   const generateQuestionAI = () => {
//     const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//     const correct =
//       letters[Math.floor(Math.random() * letters.length)];

//     const wrong = letters
//       .filter(l => l !== correct)
//       .sort(() => 0.5 - Math.random())
//       .slice(0, 3);

//     const opts = [correct, ...wrong].sort(() => 0.5 - Math.random());

//     setTarget(correct);
//     setOptions(opts);
//   };

//   // 🎯 START TEST
//   const startChallenge = () => {
//     setStarted(true);
//     setScore(0);
//     setQuestionCount(0);
//     generateQuestionAI();
//   };

//   // 🎯 HANDLE ANSWER
//   const handleClick = async (item) => {

//     const isCorrect = item === target;
//     const updatedScore = isCorrect ? score + 1 : score;

//     setScore(updatedScore);

//     const next = questionCount + 1;
//     setQuestionCount(next);

//     if (next === TOTAL_QUESTIONS) {

//       if (updatedScore >= PASS_SCORE) {
//         await giveReward(updatedScore);
//         setMessage("🏆 Reward Unlocked!");
//       } else {
//         setMessage("😢 Try Again to Unlock Reward");
//       }

//       setStarted(false);
//     } else {
//       generateQuestionAI();
//     }
//   };

//   // ⭐ GIVE REWARD
//   const giveReward = async (scoreAchieved) => {

//     const newStars = stars + scoreAchieved;
//     const newBadges = [...badges];

//     if (newStars >= 5 && !newBadges.includes("Beginner")) {
//       newBadges.push("Beginner");
//     }

//     if (newStars >= 10 && !newBadges.includes("Star Learner")) {
//       newBadges.push("Star Learner");
//     }

//     if (newStars >= 20 && !newBadges.includes("Champion")) {
//       newBadges.push("Champion");
//     }

//     const ref = doc(db, "users", userEmail, "rewards", "summary");

//     await updateDoc(ref, {
//       stars: newStars,
//       badges: newBadges
//     });

//     setStars(newStars);
//     setBadges(newBadges);
//   };

//   return (
//     <div className="blend-container">

//       <h2>🏆 AI Reward Challenge</h2>

//       <h3>⭐ Stars: {stars}</h3>

//       {/* 🎯 START */}
//       {!started ? (
//         <>
//           <button onClick={startChallenge}>
//             🚀 Start Challenge
//           </button>

//           <p>{message}</p>

//           <h3>🏅 Badges</h3>
//           {badges.length === 0 ? (
//             <p>No badges yet</p>
//           ) : (
//             badges.map((b, i) => <div key={i}>{b}</div>)
//           )}
//         </>
//       ) : (
//         <>
//           <h3>
//             Question {questionCount + 1} / {TOTAL_QUESTIONS}
//           </h3>

//           <h2>Find: {target}</h2>

//           <div className="options">
//             {options.map((opt, i) => (
//               <button key={i} onClick={() => handleClick(opt)}>
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </>
//       )}

//     </div>
//   );
// }





import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

import { useGame } from "../context/GameContext";
import useGameProgress from "../hooks/useGameProgress";

export default function RewardChallenge() {
  const TOTAL_QUESTIONS = 5;
  const PASS_SCORE = 4;

  const GAME_ID = "reward-challenge";

  const { stars: totalStars } = useGame();

  const {
    savedState,
    loading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [started, setStarted] = useState(false);

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");

  const [completed, setCompleted] = useState(false);

  /* =====================================================
     🤖 GENERATE QUESTION
  ===================================================== */

  const generateQuestion = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const correct =
      letters[Math.floor(Math.random() * letters.length)];

    const wrong = letters
      .filter((letter) => letter !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const opts = [correct, ...wrong].sort(
      () => 0.5 - Math.random()
    );

    setTarget(correct);
    setOptions(opts);

    return {
      target: correct,
      options: opts,
    };
  };

  /* =====================================================
     🔥 RESTORE SAVED GAME
  ===================================================== */

  useEffect(() => {
    if (loading) return;

    if (savedState) {
      console.log(
        "🔥 Restoring Reward Challenge:",
        savedState
      );

      setStarted(savedState.started ?? false);
      setTarget(savedState.target ?? "");
      setOptions(savedState.options ?? []);
      setScore(savedState.score ?? 0);
      setQuestionCount(savedState.questionCount ?? 0);
      setMessage(savedState.message ?? "");
      setCompleted(savedState.completed ?? false);

      return;
    }

    console.log("🆕 Starting fresh Reward Challenge");

    setStarted(false);
    setTarget("");
    setOptions([]);
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);
  }, [loading, savedState]);

  /* =====================================================
     🎯 START CHALLENGE
  ===================================================== */

  const startChallenge = async () => {
    const question = generateQuestion();

    setStarted(true);
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);

    await save({
      started: true,
      target: question.target,
      options: question.options,
      score: 0,
      questionCount: 0,
      message: "",
      completed: false,
    });
  };

  /* =====================================================
     🎯 HANDLE ANSWER
  ===================================================== */

  const handleClick = async (item) => {
    if (!started || completed) return;

    const isCorrect = item === target;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const nextQuestion = questionCount + 1;

    setScore(updatedScore);
    setQuestionCount(nextQuestion);

    /* =================================================
       🏆 FINAL QUESTION
    ================================================= */

    if (nextQuestion === TOTAL_QUESTIONS) {
      const passed = updatedScore >= PASS_SCORE;

      if (passed) {
        const percentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        /*
         * completeGame() handles the global stars
         * through GameContext / Firestore.
         */
        await finish(
          percentage,
          "AI Reward Challenge"
        );

        setMessage(
          `🏆 Reward Unlocked! You scored ${updatedScore}/${TOTAL_QUESTIONS}`
        );
      } else {
        setMessage(
          `😢 Try Again! You scored ${updatedScore}/${TOTAL_QUESTIONS}`
        );
      }

      setStarted(false);
      setCompleted(true);

      await save({
        started: false,
        target,
        options,
        score: updatedScore,
        questionCount: nextQuestion,
        message: passed
          ? `🏆 Reward Unlocked! You scored ${updatedScore}/${TOTAL_QUESTIONS}`
          : `😢 Try Again! You scored ${updatedScore}/${TOTAL_QUESTIONS}`,
        completed: true,
      });

      return;
    }

    /* =================================================
       ➡️ NEXT QUESTION
    ================================================= */

    const question = generateQuestion();

    await save({
      started: true,
      target: question.target,
      options: question.options,
      score: updatedScore,
      questionCount: nextQuestion,
      message: "",
      completed: false,
    });
  };

  /* =====================================================
     🔄 PLAY AGAIN
  ===================================================== */

  const playAgain = async () => {
    const question = generateQuestion();

    setStarted(true);
    setScore(0);
    setQuestionCount(0);
    setMessage("");
    setCompleted(false);

    await save({
      started: true,
      target: question.target,
      options: question.options,
      score: 0,
      questionCount: 0,
      message: "",
      completed: false,
    });
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="blend-container">
        <h2>🏆 AI Reward Challenge</h2>

        <p>🌱 Loading your challenge...</p>
      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="blend-container">

      <h2>🏆 AI Reward Challenge</h2>

      {/* REAL GLOBAL STARS */}
      <h3>
        ⭐ Stars: {totalStars}
      </h3>

      {/* =================================================
          COMPLETION SCREEN
      ================================================= */}

      {completed ? (
        <>
          <h2>
            {score >= PASS_SCORE
              ? "🎉 Challenge Completed!"
              : "💪 Keep Practicing!"}
          </h2>

          <h3>
            Score: {score}/{TOTAL_QUESTIONS}
          </h3>

          <p>{message}</p>

          {score >= PASS_SCORE && (
            <p>
              ⭐ You earned reward stars!
            </p>
          )}

          <button onClick={playAgain}>
            🚀 Play Again
          </button>
        </>
      ) : !started ? (
        <>
          {/* =================================================
              START SCREEN
          ================================================= */}

          <p>
            Answer at least {PASS_SCORE} out of{" "}
            {TOTAL_QUESTIONS} correctly to unlock the reward!
          </p>

          <button onClick={startChallenge}>
            🚀 Start Challenge
          </button>

          {message && <p>{message}</p>}
        </>
      ) : (
        <>
          {/* =================================================
              QUESTION
          ================================================= */}

          <h3>
            Question {questionCount + 1} /{" "}
            {TOTAL_QUESTIONS}
          </h3>

          <h2>Find: {target}</h2>

          <div className="options">
            {options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleClick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <p>
            Score: {score}
          </p>
        </>
      )}

    </div>
  );
}