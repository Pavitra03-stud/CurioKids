// import { useState } from "react";
// import "../styles/skipCounting.css";
// import { speak } from "../utils/speak";
// import BackIcon from "../components/BackIcon";

// const TOTAL_ROUNDS = 5;

// function generateQuestion() {
//   const steps = [2, 3, 5];
//   const step = steps[Math.floor(Math.random() * steps.length)];
//   const start = Math.floor(Math.random() * 10) + 1;

//   const sequence = [];
//   for (let i = 0; i < 5; i++) {
//     sequence.push(start + i * step);
//   }

//   const missingIndex = Math.floor(Math.random() * 5);
//   const correctAnswer = sequence[missingIndex];

//   const displaySequence = [...sequence];
//   displaySequence[missingIndex] = "?";

//   const options = new Set();
//   options.add(correctAnswer);

//   while (options.size < 4) {
//     const randomOffset = Math.floor(Math.random() * 6) - 3;
//     const fakeOption = correctAnswer + randomOffset;
//     if (fakeOption > 0) {
//       options.add(fakeOption);
//     }
//   }

//   return {
//     step,
//     displaySequence,
//     correctAnswer,
//     options: Array.from(options).sort(() => Math.random() - 0.5)
//   };
// }

// export default function SkipCounting({ goBack }) {

//   const [question, setQuestion] = useState(generateQuestion());
//   const [round, setRound] = useState(1);
//   const [score, setScore] = useState(0);
//   const [message, setMessage] = useState("");
//   const [selected, setSelected] = useState(null);
//   const [gameOver, setGameOver] = useState(false);
//   const [locked, setLocked] = useState(false);

//   const nextRound = () => {
//     if (round >= TOTAL_ROUNDS) {
//       setGameOver(true);
//       return;
//     }

//     setQuestion(generateQuestion());
//     setRound(prev => prev + 1);
//     setSelected(null);
//     setMessage("");
//     setLocked(false);
//   };

//   const handleAnswer = (value) => {
//     if (locked) return;
//     setLocked(true);
//     setSelected(value);

//     if (value === question.correctAnswer) {
//       speak("Correct");
//       setScore(prev => prev + 1);
//       setMessage("Correct! 🐵");
//     } else {
//       speak("Try again");
//       setMessage("Oops! Try the next one 🌿");
//     }

//     setTimeout(nextRound, 1200);
//   };

//   const restartGame = () => {
//     setQuestion(generateQuestion());
//     setRound(1);
//     setScore(0);
//     setGameOver(false);
//     setMessage("");
//     setSelected(null);
//     setLocked(false);
//   };

//   if (gameOver) {
//     return (
//       <div className="skip-page">

//         <div className="practice-navbar">
//           <div className="navbar-left">
//             <BackIcon goBack={goBack} />
//           </div>
//           <div className="navbar-title">
//             🐒 Skip Counting
//           </div>
//         </div>

//         <h1>Great Work!</h1>
//         <h2>Score: {score} / {TOTAL_ROUNDS}</h2>

//         <button onClick={restartGame} className="play-btn">
//           Play Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="skip-page">

//       <div className="practice-navbar">
//         <div className="navbar-left">
//           <BackIcon goBack={goBack} />
//         </div>
//         <div className="navbar-title">
//           🐒 Skip Counting
//         </div>
//       </div>

//       <h2>Count by {question.step}s</h2>

//       <div className="sequence-box">
//         {question.displaySequence.map((num, i) => (
//           <div key={i} className="sequence-item">
//             {num}
//           </div>
//         ))}
//       </div>

//       <div className="options-container">
//         {question.options.map((option, i) => (
//           <button
//             key={i}
//             disabled={locked}
//             className={`option-btn ${
//               selected === option
//                 ? option === question.correctAnswer
//                   ? "correct"
//                   : "wrong"
//                 : ""
//             }`}
//             onClick={() => handleAnswer(option)}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       <p className="result-text">{message}</p>

//       <div className="round-text">
//         Round {round} of {TOTAL_ROUNDS}
//       </div>

//     </div>
//   );
// }





import { useState, useEffect } from "react";
import "../styles/skipCounting.css";
import { speak } from "../utils/speak";
import BackIcon from "../components/BackIcon";
import useGameProgress from "../hooks/useGameProgress";

const TOTAL_ROUNDS = 5;
const GAME_ID = "skip-counting";

/* =====================================================
   🔢 GENERATE QUESTION
===================================================== */

function generateQuestion() {
  const steps = [2, 3, 5];

  const step =
    steps[Math.floor(Math.random() * steps.length)];

  const start =
    Math.floor(Math.random() * 10) + 1;

  const sequence = [];

  for (let i = 0; i < 5; i++) {
    sequence.push(start + i * step);
  }

  const missingIndex =
    Math.floor(Math.random() * 5);

  const correctAnswer =
    sequence[missingIndex];

  const displaySequence = [...sequence];

  displaySequence[missingIndex] = "?";

  const options = new Set();

  options.add(correctAnswer);

  while (options.size < 4) {
    const randomOffset =
      Math.floor(Math.random() * 6) - 3;

    const fakeOption =
      correctAnswer + randomOffset;

    if (fakeOption > 0) {
      options.add(fakeOption);
    }
  }

  return {
    step,
    displaySequence,
    correctAnswer,
    options: Array.from(options).sort(
      () => Math.random() - 0.5
    ),
  };
}

/* =====================================================
   🎮 COMPONENT
===================================================== */

export default function SkipCounting({ goBack }) {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [question, setQuestion] = useState(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  /* =====================================================
     🔥 RESTORE SAVED PROGRESS
  ===================================================== */

  useEffect(() => {
    if (progressLoading) return;

    if (savedState) {
      console.log(
        "🔥 Restoring Skip Counting:",
        savedState
      );

      setQuestion(
        savedState.question || generateQuestion()
      );

      setRound(
        savedState.round || 1
      );

      setScore(
        savedState.score || 0
      );

      setMessage(
        savedState.message || ""
      );

      setSelected(
        savedState.selected ?? null
      );

      setGameOver(
        savedState.gameOver || false
      );

      /*
       * A previous click should not remain locked
       * after a page refresh.
       */
      setLocked(false);

      return;
    }

    /* =================================================
       🆕 NEW GAME
    ================================================= */

    const newQuestion = generateQuestion();

    setQuestion(newQuestion);

    save({
      question: newQuestion,
      round: 1,
      score: 0,
      message: "",
      selected: null,
      gameOver: false,
    });
  }, [progressLoading, savedState]);

  /* =====================================================
     ➡️ NEXT ROUND
  ===================================================== */

  const nextRound = async (
    updatedScore
  ) => {
    if (round >= TOTAL_ROUNDS) {
      const percentage =
        (updatedScore / TOTAL_ROUNDS) * 100;

      await finish(
        percentage,
        "Skip Counting"
      );

      setGameOver(true);

      await save({
        question,
        round,
        score: updatedScore,
        message,
        selected,
        gameOver: true,
      });

      return;
    }

    const newQuestion = generateQuestion();

    const nextRoundNumber = round + 1;

    setQuestion(newQuestion);
    setRound(nextRoundNumber);
    setSelected(null);
    setMessage("");
    setLocked(false);

    await save({
      question: newQuestion,
      round: nextRoundNumber,
      score: updatedScore,
      message: "",
      selected: null,
      gameOver: false,
    });
  };

  /* =====================================================
     🎯 HANDLE ANSWER
  ===================================================== */

  const handleAnswer = (value) => {
    if (
      locked ||
      !question ||
      gameOver
    ) {
      return;
    }

    setLocked(true);
    setSelected(value);

    const isCorrect =
      value === question.correctAnswer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const updatedMessage = isCorrect
      ? "Correct! 🐵"
      : "Oops! Try the next one 🌿";

    setScore(updatedScore);
    setMessage(updatedMessage);

    if (isCorrect) {
      speak("Correct");
    } else {
      speak("Try again");
    }

    /*
     * Save the current answer immediately.
     * This means a refresh during the feedback
     * period does not lose the latest score.
     */
    save({
      question,
      round,
      score: updatedScore,
      message: updatedMessage,
      selected: value,
      gameOver: false,
    });

    setTimeout(() => {
      nextRound(updatedScore);
    }, 1200);
  };

  /* =====================================================
     🔄 RESTART
  ===================================================== */

  const restartGame = async () => {
    const newQuestion = generateQuestion();

    setQuestion(newQuestion);
    setRound(1);
    setScore(0);
    setGameOver(false);
    setMessage("");
    setSelected(null);
    setLocked(false);

    await save({
      question: newQuestion,
      round: 1,
      score: 0,
      message: "",
      selected: null,
      gameOver: false,
    });
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (progressLoading || !question) {
    return (
      <div className="skip-page">
        <div className="practice-navbar">
          <div className="navbar-left">
            <BackIcon goBack={goBack} />
          </div>

          <div className="navbar-title">
            🐒 Skip Counting
          </div>
        </div>

        <h2>🌱 Loading your progress...</h2>
      </div>
    );
  }

  /* =====================================================
     🏆 GAME OVER
  ===================================================== */

  if (gameOver) {
    return (
      <div className="skip-page">

        <div className="practice-navbar">
          <div className="navbar-left">
            <BackIcon goBack={goBack} />
          </div>

          <div className="navbar-title">
            🐒 Skip Counting
          </div>
        </div>

        <h1>Great Work! 🎉</h1>

        <h2>
          Score: {score} / {TOTAL_ROUNDS}
        </h2>

        <button
          onClick={restartGame}
          className="play-btn"
        >
          Play Again
        </button>

      </div>
    );
  }

  /* =====================================================
     🎨 GAME UI
  ===================================================== */

  return (
    <div className="skip-page">

      <div className="practice-navbar">

        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>

        <div className="navbar-title">
          🐒 Skip Counting
        </div>

      </div>

      <h2>
        Count by {question.step}s
      </h2>

      {/* SEQUENCE */}
      <div className="sequence-box">

        {question.displaySequence.map(
          (num, index) => (
            <div
              key={index}
              className="sequence-item"
            >
              {num}
            </div>
          )
        )}

      </div>

      {/* OPTIONS */}
      <div className="options-container">

        {question.options.map(
          (option, index) => (
            <button
              key={index}
              disabled={locked}
              className={`option-btn ${
                selected === option
                  ? option ===
                    question.correctAnswer
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              onClick={() =>
                handleAnswer(option)
              }
            >
              {option}
            </button>
          )
        )}

      </div>

      {/* FEEDBACK */}
      <p className="result-text">
        {message}
      </p>

      {/* ROUND */}
      <div className="round-text">
        Round {round} of {TOTAL_ROUNDS}
      </div>

    </div>
  );
}