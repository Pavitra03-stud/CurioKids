// // import { useMemo, useState } from "react";
// // import "../styles/LearningLetterBlast.css";

// // export default function LearningLetterBlast({ goBack }) {
// //   const questions = useMemo(
// //     () => [
// //       {
// //         image: "🍎",
// //         word: "Apple",
// //         correct: "A",
// //         options: ["A", "B", "C"],
// //       },
// //       {
// //         image: "🐶",
// //         word: "Dog",
// //         correct: "D",
// //         options: ["D", "B", "P"],
// //       },
// //       {
// //         image: "🐱",
// //         word: "Cat",
// //         correct: "C",
// //         options: ["C", "O", "G"],
// //       },
// //       {
// //         image: "🦁",
// //         word: "Lion",
// //         correct: "L",
// //         options: ["L", "I", "T"],
// //       },
// //       {
// //         image: "🥭",
// //         word: "Mango",
// //         correct: "M",
// //         options: ["M", "N", "W"],
// //       },
// //       {
// //         image: "🐘",
// //         word: "Elephant",
// //         correct: "E",
// //         options: ["E", "F", "L"],
// //       },
// //       {
// //         image: "🐟",
// //         word: "Fish",
// //         correct: "F",
// //         options: ["F", "P", "T"],
// //       },
// //       {
// //         image: "🍌",
// //         word: "Banana",
// //         correct: "B",
// //         options: ["B", "D", "R"],
// //       },
// //     ],
// //     []
// //   );

// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [selected, setSelected] = useState("");
// //   const [status, setStatus] = useState("");
// //   const [score, setScore] = useState(0);

// //   const currentQuestion = questions[currentIndex];
// //   const isLastQuestion = currentIndex === questions.length - 1;
// //   const gameFinished = currentIndex >= questions.length;

// //   const handleOptionClick = (letter) => {
// //     if (status) return;

// //     setSelected(letter);

// //     if (letter === currentQuestion.correct) {
// //       setStatus("correct");
// //       setScore((prev) => prev + 1);
// //     } else {
// //       setStatus("wrong");
// //     }
// //   };

// //   const handleNext = () => {
// //     if (isLastQuestion) {
// //       setCurrentIndex(questions.length);
// //       return;
// //     }

// //     setCurrentIndex((prev) => prev + 1);
// //     setSelected("");
// //     setStatus("");
// //   };

// //   const handleRestart = () => {
// //     setCurrentIndex(0);
// //     setSelected("");
// //     setStatus("");
// //     setScore(0);
// //   };

// //   if (gameFinished) {
// //     return (
// //       <div className="learning-letter-blast-page">
// //         <header className="learning-letter-blast-topbar">
// //           <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
// //         </header>

// //         <div className="learning-letter-blast-decor decor-one"></div>
// //         <div className="learning-letter-blast-decor decor-two"></div>
// //         <div className="learning-letter-blast-decor decor-three"></div>

// //         <div className="blast-finish-card">
// //           <div className="finish-emoji">🏆</div>
// //           <h2>Great Job!</h2>
// //           <p>
// //             You got <span>{score}</span> out of <span>{questions.length}</span>
// //           </p>

// //           <div className="finish-buttons">
// //             <button className="primary-btn" onClick={handleRestart}>
// //               Play Again
// //             </button>
// //             <button className="secondary-btn" onClick={goBack}>
// //               Back
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="learning-letter-blast-page">
// //       <header className="learning-letter-blast-topbar">
// //         <button className="learning-letter-blast-back" onClick={goBack}>
// //           ←
// //         </button>
// //         <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
// //       </header>

// //       <div className="learning-letter-blast-decor decor-one"></div>
// //       <div className="learning-letter-blast-decor decor-two"></div>
// //       <div className="learning-letter-blast-decor decor-three"></div>

// //       <div className="learning-letter-blast-content">
// //         <div className="blast-top-info">
// //           <div className="blast-score">⭐ Score: {score}</div>
// //           <div className="blast-progress">
// //             {currentIndex + 1} / {questions.length}
// //           </div>
// //         </div>

// //         <div className="blast-card">
// //           <div className="blast-helper-animals">
// //             <span>🐻</span>
// //             <span>🦊</span>
// //             <span>🐼</span>
// //           </div>

// //           <div className="blast-image">{currentQuestion.image}</div>
// //           <div className="blast-word">{currentQuestion.word}</div>

// //           <p className="blast-question">Tap the first letter</p>

// //           <div className="blast-options">
// //             {currentQuestion.options.map((letter, index) => (
// //               <button
// //                 key={index}
// //                 className={`blast-option
// //                   ${selected === letter ? "selected" : ""}
// //                   ${
// //                     status === "correct" && letter === currentQuestion.correct
// //                       ? "correct"
// //                       : ""
// //                   }
// //                   ${
// //                     status === "wrong" && selected === letter
// //                       ? "wrong"
// //                       : ""
// //                   }
// //                 `}
// //                 onClick={() => handleOptionClick(letter)}
// //               >
// //                 {letter}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="blast-feedback-area">
// //             {!status && <p className="blast-hint">Look at the picture and choose carefully 👀</p>}

// //             {status === "correct" && (
// //               <p className="blast-feedback correct-text">
// //                 ✅ Super! {currentQuestion.correct} for {currentQuestion.word}
// //               </p>
// //             )}

// //             {status === "wrong" && (
// //               <p className="blast-feedback wrong-text">
// //                 ❌ Try again next time! Correct answer is {currentQuestion.correct}
// //               </p>
// //             )}
// //           </div>

// //           {status && (
// //             <button className="next-btn" onClick={handleNext}>
// //               {isLastQuestion ? "See Result" : "Next"}
// //             </button>
// //           )}
// //         </div>

// //         <div className="blast-bottom-animals">
// //           <span>🦁</span>
// //           <span>🐯</span>
// //           <span>🐵</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// import { useMemo, useState } from "react";
// import "../styles/LearningLetterBlast.css";

// export default function LearningLetterBlast({ goBack }) {
//   const questions = useMemo(
//     () => [
//       {
//         image: "🍎",
//         word: "Apple",
//         correct: "A",
//         options: ["A", "B", "C"],
//       },
//       {
//         image: "🐶",
//         word: "Dog",
//         correct: "D",
//         options: ["D", "B", "P"],
//       },
//       {
//         image: "🐱",
//         word: "Cat",
//         correct: "C",
//         options: ["C", "O", "G"],
//       },
//       {
//         image: "🦁",
//         word: "Lion",
//         correct: "L",
//         options: ["L", "I", "T"],
//       },
//       {
//         image: "🥭",
//         word: "Mango",
//         correct: "M",
//         options: ["M", "N", "W"],
//       },
//       {
//         image: "🐘",
//         word: "Elephant",
//         correct: "E",
//         options: ["E", "F", "L"],
//       },
//       {
//         image: "🐟",
//         word: "Fish",
//         correct: "F",
//         options: ["F", "P", "T"],
//       },
//       {
//         image: "🍌",
//         word: "Banana",
//         correct: "B",
//         options: ["B", "D", "R"],
//       },
//     ],
//     []
//   );

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selected, setSelected] = useState("");
//   const [status, setStatus] = useState("");
//   const [score, setScore] = useState(0);

//   const currentQuestion = questions[currentIndex];
//   const isLastQuestion = currentIndex === questions.length - 1;
//   const gameFinished = currentIndex >= questions.length;

//   const handleOptionClick = (letter) => {
//     if (status) return;

//     setSelected(letter);

//     if (letter === currentQuestion.correct) {
//       setStatus("correct");
//       setScore((prev) => prev + 1);
//     } else {
//       setStatus("wrong");
//     }
//   };

//   const handleNext = () => {
//     if (isLastQuestion) {
//       setCurrentIndex(questions.length);
//       return;
//     }

//     setCurrentIndex((prev) => prev + 1);
//     setSelected("");
//     setStatus("");
//   };

//   const handleRestart = () => {
//     setCurrentIndex(0);
//     setSelected("");
//     setStatus("");
//     setScore(0);
//   };

//   if (gameFinished) {
//     return (
//       <div className="learning-letter-blast-page">
//         <header className="learning-letter-blast-topbar">
//           <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
//         </header>

//         <div className="learning-letter-blast-decor decor-one"></div>
//         <div className="learning-letter-blast-decor decor-two"></div>
//         <div className="learning-letter-blast-decor decor-three"></div>

//         <div className="blast-finish-card">
//           <div className="finish-emoji">🏆</div>
//           <h2>Great Job!</h2>
//           <p>
//             You got <span>{score}</span> out of <span>{questions.length}</span>
//           </p>

//           <div className="finish-buttons">
//             <button className="primary-btn" onClick={handleRestart}>
//               Play Again
//             </button>
//             <button className="secondary-btn" onClick={goBack}>
//               Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="learning-letter-blast-page">
//       <header className="learning-letter-blast-topbar">
//         <button className="learning-letter-blast-back" onClick={goBack}>
//           ←
//         </button>
//         <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
//       </header>

//       <div className="learning-letter-blast-decor decor-one"></div>
//       <div className="learning-letter-blast-decor decor-two"></div>
//       <div className="learning-letter-blast-decor decor-three"></div>

//       <div className="learning-letter-blast-content">
//         <div className="blast-top-info">
//           <div className="blast-score">⭐ Score: {score}</div>
//           <div className="blast-progress">
//             {currentIndex + 1} / {questions.length}
//           </div>
//         </div>

//         <div className="blast-card">
//           <div className="blast-helper-animals">
//             <span>🐻</span>
//             <span>🦊</span>
//             <span>🐼</span>
//           </div>

//           <div className="blast-image">{currentQuestion.image}</div>
//           <div className="blast-word">{currentQuestion.word}</div>

//           <p className="blast-question">Tap the first letter</p>

//           <div className="blast-options">
//             {currentQuestion.options.map((letter, index) => (
//               <button
//                 key={index}
//                 className={`blast-option
//                   ${selected === letter ? "selected" : ""}
//                   ${
//                     status === "correct" && letter === currentQuestion.correct
//                       ? "correct"
//                       : ""
//                   }
//                   ${
//                     status === "wrong" && selected === letter
//                       ? "wrong"
//                       : ""
//                   }
//                 `}
//                 onClick={() => handleOptionClick(letter)}
//               >
//                 {letter}
//               </button>
//             ))}
//           </div>

//           <div className="blast-feedback-area">
//             {!status && <p className="blast-hint">Look at the picture and choose carefully 👀</p>}

//             {status === "correct" && (
//               <p className="blast-feedback correct-text">
//                 ✅ Super! {currentQuestion.correct} for {currentQuestion.word}
//               </p>
//             )}

//             {status === "wrong" && (
//               <p className="blast-feedback wrong-text">
//                 ❌ Try again next time! Correct answer is {currentQuestion.correct}
//               </p>
//             )}
//           </div>

//           {status && (
//             <button className="next-btn" onClick={handleNext}>
//               {isLastQuestion ? "See Result" : "Next"}
//             </button>
//           )}
//         </div>

//         <div className="blast-bottom-animals">
//           <span>🦁</span>
//           <span>🐯</span>
//           <span>🐵</span>
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useMemo, useState } from "react";
import "../styles/LearningLetterBlast.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "learning-letter-blast";

export default function LearningLetterBlast({ goBack }) {
  const questions = useMemo(
    () => [
      {
        image: "🍎",
        word: "Apple",
        correct: "A",
        options: ["A", "B", "C"],
      },
      {
        image: "🐶",
        word: "Dog",
        correct: "D",
        options: ["D", "B", "P"],
      },
      {
        image: "🐱",
        word: "Cat",
        correct: "C",
        options: ["C", "O", "G"],
      },
      {
        image: "🦁",
        word: "Lion",
        correct: "L",
        options: ["L", "I", "T"],
      },
      {
        image: "🥭",
        word: "Mango",
        correct: "M",
        options: ["M", "N", "W"],
      },
      {
        image: "🐘",
        word: "Elephant",
        correct: "E",
        options: ["E", "F", "L"],
      },
      {
        image: "🐟",
        word: "Fish",
        correct: "F",
        options: ["F", "P", "T"],
      },
      {
        image: "🍌",
        word: "Banana",
        correct: "B",
        options: ["B", "D", "R"],
      },
    ],
    []
  );

  const INITIAL_STATE = {
    currentIndex: 0,
    selected: "",
    status: "",
    score: 0,
    completed: false,
  };

  // =========================================================
  // FIREBASE GAME PROGRESS
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

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selected, setSelected] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [gameFinished, setGameFinished] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion =
    questions[currentIndex];

  const isLastQuestion =
    currentIndex ===
    questions.length - 1;

  // =========================================================
  // RESTORE PROGRESS
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Learning Letter Blast saved state:",
      savedState
    );

    if (savedState) {
      setCurrentIndex(
        savedState.currentIndex ?? 0
      );

      setSelected(
        savedState.selected ?? ""
      );

      setStatus(
        savedState.status ?? ""
      );

      setScore(
        savedState.score ?? 0
      );

      setGameFinished(
        savedState.completed ?? false
      );
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // ANSWER
  // =========================================================

  const handleOptionClick = async (
    letter
  ) => {
    if (status) return;
    if (gameFinished) return;

    const isCorrect =
      letter ===
      currentQuestion.correct;

    const newStatus =
      isCorrect
        ? "correct"
        : "wrong";

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    setSelected(letter);
    setStatus(newStatus);
    setScore(updatedScore);

    await save({
      currentIndex,
      selected: letter,
      status: newStatus,
      score: updatedScore,
      completed: false,
    });
  };

  // =========================================================
  // NEXT
  // =========================================================

  const handleNext = async () => {
    if (!status) return;

    // -------------------------------------------------------
    // LAST QUESTION
    // -------------------------------------------------------

    if (isLastQuestion) {
      const finalPercentage =
        (score /
          questions.length) *
        100;

      console.log(
        "🏁 Learning Letter Blast completed:",
        {
          score,
          total: questions.length,
          percentage: finalPercentage,
        }
      );

      setGameFinished(true);

      // ⭐ Firebase stars + history
      await finish(
        finalPercentage,
        "Learning Letter Blast"
      );

      // Save completion state
      await save({
        currentIndex,
        selected,
        status,
        score,
        completed: true,
      });

      return;
    }

    // -------------------------------------------------------
    // NEXT QUESTION
    // -------------------------------------------------------

    const nextIndex =
      currentIndex + 1;

    setCurrentIndex(nextIndex);
    setSelected("");
    setStatus("");

    await save({
      currentIndex: nextIndex,
      selected: "",
      status: "",
      score,
      completed: false,
    });
  };

  // =========================================================
  // RESTART
  // =========================================================

  const handleRestart = async () => {
    setCurrentIndex(0);
    setSelected("");
    setStatus("");
    setScore(0);
    setGameFinished(false);

    await save({
      currentIndex: 0,
      selected: "",
      status: "",
      score: 0,
      completed: false,
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="learning-letter-blast-page">
        <header className="learning-letter-blast-topbar">
          <h1 className="learning-letter-blast-title">
            💥 Letter Blast
          </h1>
        </header>

        <div className="learning-letter-blast-content">
          <div className="blast-card">
            <h2>
              Restoring your progress...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // FINISHED
  // =========================================================

  if (gameFinished) {
    return (
      <div className="learning-letter-blast-page">

        <header className="learning-letter-blast-topbar">
          <h1 className="learning-letter-blast-title">
            💥 Letter Blast
          </h1>
        </header>

        <div className="learning-letter-blast-decor decor-one"></div>
        <div className="learning-letter-blast-decor decor-two"></div>
        <div className="learning-letter-blast-decor decor-three"></div>

        <div className="blast-finish-card">

          <div className="finish-emoji">
            🏆
          </div>

          <h2>
            Great Job!
          </h2>

          <p>
            You got{" "}
            <span>{score}</span>{" "}
            out of{" "}
            <span>
              {questions.length}
            </span>
          </p>

          <div className="finish-buttons">

            <button
              className="primary-btn"
              onClick={handleRestart}
            >
              Play Again
            </button>

            <button
              className="secondary-btn"
              onClick={goBack}
            >
              Back
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN GAME
  // =========================================================

  return (
    <div className="learning-letter-blast-page">

      <header className="learning-letter-blast-topbar">

        {/* <button
          className="learning-letter-blast-back"
          onClick={goBack}
        >
          ←
        </button> */}

        <h1 className="learning-letter-blast-title">
          💥 Letter Blast
        </h1>

      </header>

      <div className="learning-letter-blast-decor decor-one"></div>
      <div className="learning-letter-blast-decor decor-two"></div>
      <div className="learning-letter-blast-decor decor-three"></div>

      <div className="learning-letter-blast-content">

        {/* Score + Progress */}
        <div className="blast-top-info">

          <div className="blast-score">
            ⭐ Score: {score}
          </div>

          <div className="blast-progress">
            {currentIndex + 1} /{" "}
            {questions.length}
          </div>

        </div>

        {/* Question Card */}
        <div className="blast-card">

          <div className="blast-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="blast-image">
            {currentQuestion.image}
          </div>

          <div className="blast-word">
            {currentQuestion.word}
          </div>

          <p className="blast-question">
            Tap the first letter
          </p>

          {/* Options */}
          <div className="blast-options">

            {currentQuestion.options.map(
              (letter, index) => (
                <button
                  key={index}
                  className={`blast-option
                    ${
                      selected === letter
                        ? "selected"
                        : ""
                    }
                    ${
                      status === "correct" &&
                      letter ===
                        currentQuestion.correct
                        ? "correct"
                        : ""
                    }
                    ${
                      status === "wrong" &&
                      selected === letter
                        ? "wrong"
                        : ""
                    }
                  `}
                  onClick={() =>
                    handleOptionClick(
                      letter
                    )
                  }
                  disabled={Boolean(status)}
                >
                  {letter}
                </button>
              )
            )}

          </div>

          {/* Feedback */}
          <div className="blast-feedback-area">

            {!status && (
              <p className="blast-hint">
                Look at the picture and
                choose carefully 👀
              </p>
            )}

            {status === "correct" && (
              <p className="blast-feedback correct-text">
                ✅ Super!{" "}
                {currentQuestion.correct}{" "}
                for{" "}
                {currentQuestion.word}
              </p>
            )}

            {status === "wrong" && (
              <p className="blast-feedback wrong-text">
                ❌ Try again next time!
                Correct answer is{" "}
                {currentQuestion.correct}
              </p>
            )}

          </div>

          {/* Next */}
          {status && (
            <button
              className="next-btn"
              onClick={handleNext}
            >
              {isLastQuestion
                ? "See Result"
                : "Next"}
            </button>
          )}

        </div>

        {/* Bottom animals */}
        <div className="blast-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>

      </div>
    </div>
  );
}