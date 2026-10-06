// import { useMemo, useState } from "react";
// import "../styles/OddLetter.css";

// export default function OddLetter({ goBack }) {
//   const questions = useMemo(
//     () => [
//       {
//         letters: ["A", "A", "A", "a", "A", "A"],
//         answerIndex: 3,
//         differentLetter: "a",
//         message: "Small a is different",
//       },
//       {
//         letters: ["b", "b", "B", "b", "b", "b"],
//         answerIndex: 2,
//         differentLetter: "B",
//         message: "Capital B is different",
//       },
//       {
//         letters: ["D", "D", "d", "D", "D", "D"],
//         answerIndex: 2,
//         differentLetter: "d",
//         message: "Small d is different",
//       },
//       {
//         letters: ["m", "m", "m", "M", "m", "m"],
//         answerIndex: 3,
//         differentLetter: "M",
//         message: "Capital M is different",
//       },
//       {
//         letters: ["S", "S", "s", "S", "S", "S"],
//         answerIndex: 2,
//         differentLetter: "s",
//         message: "Small s is different",
//       },
//       {
//         letters: ["p", "p", "p", "P", "p", "p"],
//         answerIndex: 3,
//         differentLetter: "P",
//         message: "Capital P is different",
//       },
//       {
//         letters: ["R", "r", "R", "R", "R", "R"],
//         answerIndex: 1,
//         differentLetter: "r",
//         message: "Small r is different",
//       },
//       {
//         letters: ["q", "q", "Q", "q", "q", "q"],
//         answerIndex: 2,
//         differentLetter: "Q",
//         message: "Capital Q is different",
//       },
//     ],
//     []
//   );

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [status, setStatus] = useState("");
//   const [score, setScore] = useState(0);

//   const currentQuestion = questions[currentIndex];
//   const isLastQuestion = currentIndex === questions.length - 1;
//   const finished = currentIndex >= questions.length;

//   const handleLetterClick = (index) => {
//     if (status) return;

//     setSelectedIndex(index);

//     if (index === currentQuestion.answerIndex) {
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
//     setSelectedIndex(null);
//     setStatus("");
//   };

//   const handleRestart = () => {
//     setCurrentIndex(0);
//     setSelectedIndex(null);
//     setStatus("");
//     setScore(0);
//   };

//   if (finished) {
//     return (
//       <div className="odd-letter-page">
//         <header className="odd-letter-topbar">
//           <button className="odd-letter-back" onClick={goBack}>
//             ←
//           </button>
//           <h1 className="odd-letter-title">🔍 Odd Letter</h1>
//         </header>

//         <div className="odd-letter-decor decor-one"></div>
//         <div className="odd-letter-decor decor-two"></div>
//         <div className="odd-letter-decor decor-three"></div>

//         <div className="odd-letter-finish-card">
//           <div className="finish-emoji">🌟</div>
//           <h2>Awesome Work!</h2>
//           <p>
//             You got <span>{score}</span> out of <span>{questions.length}</span>
//           </p>

//           <div className="odd-letter-finish-buttons">
//             <button className="odd-primary-btn" onClick={handleRestart}>
//               Play Again
//             </button>
//             <button className="odd-secondary-btn" onClick={goBack}>
//               Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="odd-letter-page">
//       <header className="odd-letter-topbar">
//         <button className="odd-letter-back" onClick={goBack}>
//           ←
//         </button>
//         <h1 className="odd-letter-title">🔍 Odd Letter</h1>
//       </header>

//       <div className="odd-letter-decor decor-one"></div>
//       <div className="odd-letter-decor decor-two"></div>
//       <div className="odd-letter-decor decor-three"></div>

//       <div className="odd-letter-content">
//         <div className="odd-letter-top-info">
//           <div className="odd-score">⭐ Score: {score}</div>
//           <div className="odd-progress">
//             {currentIndex + 1} / {questions.length}
//           </div>
//         </div>

//         <div className="odd-letter-card">
//           <div className="odd-helper-animals">
//             <span>🐻</span>
//             <span>🦊</span>
//             <span>🐼</span>
//           </div>

//           <h2>Find the different letter 👀</h2>
//           <p className="odd-subtext">
//             Look carefully and tap the one that is different
//           </p>

//           <div className="odd-grid">
//             {currentQuestion.letters.map((letter, index) => {
//               const isSelected = selectedIndex === index;
//               const isCorrect = index === currentQuestion.answerIndex;

//               return (
//                 <button
//                   key={index}
//                   className={`odd-letter-box
//                     ${isSelected ? "selected" : ""}
//                     ${status === "correct" && isCorrect ? "correct" : ""}
//                     ${status === "wrong" && isSelected ? "wrong" : ""}
//                     ${status === "wrong" && isCorrect ? "show-correct" : ""}
//                   `}
//                   onClick={() => handleLetterClick(index)}
//                 >
//                   {letter}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="odd-feedback-area">
//             {!status && (
//               <p className="odd-hint">Check uppercase and lowercase carefully ✨</p>
//             )}

//             {status === "correct" && (
//               <p className="odd-feedback correct-text">
//                 ✅ Great! {currentQuestion.message}
//               </p>
//             )}

//             {status === "wrong" && (
//               <p className="odd-feedback wrong-text">
//                 ❌ Oops! {currentQuestion.message}
//               </p>
//             )}
//           </div>

//           {status && (
//             <button className="odd-next-btn" onClick={handleNext}>
//               {isLastQuestion ? "See Result" : "Next"}
//             </button>
//           )}
//         </div>

//         <div className="odd-bottom-animals">
//           <span>🦁</span>
//           <span>🐯</span>
//           <span>🐵</span>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import "../styles/OddLetter.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "odd-letter";

export default function OddLetter({ goBack }) {
  const questions = useMemo(
    () => [
      {
        letters: ["A", "A", "A", "a", "A", "A"],
        answerIndex: 3,
        differentLetter: "a",
        message: "Small a is different",
      },
      {
        letters: ["b", "b", "B", "b", "b", "b"],
        answerIndex: 2,
        differentLetter: "B",
        message: "Capital B is different",
      },
      {
        letters: ["D", "D", "d", "D", "D", "D"],
        answerIndex: 2,
        differentLetter: "d",
        message: "Small d is different",
      },
      {
        letters: ["m", "m", "m", "M", "m", "m"],
        answerIndex: 3,
        differentLetter: "M",
        message: "Capital M is different",
      },
      {
        letters: ["S", "S", "s", "S", "S", "S"],
        answerIndex: 2,
        differentLetter: "s",
        message: "Small s is different",
      },
      {
        letters: ["p", "p", "p", "P", "p", "p"],
        answerIndex: 3,
        differentLetter: "P",
        message: "Capital P is different",
      },
      {
        letters: ["R", "r", "R", "R", "R", "R"],
        answerIndex: 1,
        differentLetter: "r",
        message: "Small r is different",
      },
      {
        letters: ["q", "q", "Q", "q", "q", "q"],
        answerIndex: 2,
        differentLetter: "Q",
        message: "Capital Q is different",
      },
    ],
    []
  );

  const initialState = {
    currentIndex: 0,
    selectedIndex: null,
    status: "",
    score: 0,
    finished: false,
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

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedIndex, setSelectedIndex] =
    useState(null);

  const [status, setStatus] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  // =========================================================
  // 🔥 RESTORE SAVED GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Odd Letter saved state:",
      savedState
    );

    if (savedState) {
      setCurrentIndex(
        savedState.currentIndex ?? 0
      );

      setSelectedIndex(
        savedState.selectedIndex ?? null
      );

      setStatus(
        savedState.status || ""
      );

      setScore(
        savedState.score ?? 0
      );

      setFinished(
        Boolean(savedState.finished)
      );
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  // =========================================================
  // 🎯 CURRENT QUESTION
  // =========================================================

  const currentQuestion =
    questions[currentIndex];

  const isLastQuestion =
    currentIndex ===
    questions.length - 1;

  // =========================================================
  // 🎯 LETTER CLICK
  // =========================================================

  const handleLetterClick = async (
    index
  ) => {
    if (status) return;
    if (!currentQuestion) return;

    const isCorrect =
      index ===
      currentQuestion.answerIndex;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const updatedStatus =
      isCorrect
        ? "correct"
        : "wrong";

    setSelectedIndex(index);
    setStatus(updatedStatus);
    setScore(updatedScore);

    // 💾 SAVE ANSWER STATE
    await save({
      currentIndex,
      selectedIndex: index,
      status: updatedStatus,
      score: updatedScore,
      finished: false,
    });
  };

  // =========================================================
  // ➡️ NEXT QUESTION
  // =========================================================

  const handleNext = async () => {
    // =======================================================
    // 🏁 LAST QUESTION
    // =======================================================

    if (isLastQuestion) {
      const percentage =
        (score / questions.length) *
        100;

      console.log(
        "🏁 Odd Letter completed:",
        {
          score,
          total: questions.length,
          percentage,
        }
      );

      // ⭐ Award stars + save history
      await finish(
        percentage,
        "Odd Letter"
      );

      setFinished(true);

      await save({
        currentIndex:
          questions.length,
        selectedIndex,
        status,
        score,
        finished: true,
      });

      return;
    }

    // =======================================================
    // ➡️ NEXT
    // =======================================================

    const nextIndex =
      currentIndex + 1;

    setCurrentIndex(nextIndex);
    setSelectedIndex(null);
    setStatus("");

    // 💾 SAVE NEXT QUESTION
    await save({
      currentIndex: nextIndex,
      selectedIndex: null,
      status: "",
      score,
      finished: false,
    });
  };

  // =========================================================
  // 🔄 RESTART
  // =========================================================

  const handleRestart = async () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setStatus("");
    setScore(0);
    setFinished(false);

    await save({
      currentIndex: 0,
      selectedIndex: null,
      status: "",
      score: 0,
      finished: false,
    });
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (progressLoading || !restored) {
    return (
      <div className="odd-letter-page">
        <header className="odd-letter-topbar">
          <button
            className="odd-letter-back"
            onClick={goBack}
          >
            ←
          </button>

          <h1 className="odd-letter-title">
            🔍 Odd Letter
          </h1>
        </header>

        <div className="odd-letter-finish-card">
          <div className="finish-emoji">
            🌱
          </div>

          <h2>
            Loading your game...
          </h2>
        </div>
      </div>
    );
  }

  // =========================================================
  // 🏆 FINISH SCREEN
  // =========================================================

  if (finished) {
    return (
      <div className="odd-letter-page">

        <header className="odd-letter-topbar">
          <button
            className="odd-letter-back"
            onClick={goBack}
          >
            ←
          </button>

          <h1 className="odd-letter-title">
            🔍 Odd Letter
          </h1>
        </header>

        <div className="odd-letter-decor decor-one"></div>
        <div className="odd-letter-decor decor-two"></div>
        <div className="odd-letter-decor decor-three"></div>

        <div className="odd-letter-finish-card">

          <div className="finish-emoji">
            🌟
          </div>

          <h2>
            Awesome Work!
          </h2>

          <p>
            You got{" "}
            <span>{score}</span>{" "}
            out of{" "}
            <span>
              {questions.length}
            </span>
          </p>

          <div className="odd-letter-finish-buttons">

            <button
              className="odd-primary-btn"
              onClick={handleRestart}
            >
              Play Again
            </button>

            <button
              className="odd-secondary-btn"
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
  // 🎮 GAME SCREEN
  // =========================================================

  return (
    <div className="odd-letter-page">

      <header className="odd-letter-topbar">

        <button
          className="odd-letter-back"
          onClick={goBack}
        >
          ←
        </button>

        <h1 className="odd-letter-title">
          🔍 Odd Letter
        </h1>

      </header>

      <div className="odd-letter-decor decor-one"></div>
      <div className="odd-letter-decor decor-two"></div>
      <div className="odd-letter-decor decor-three"></div>

      <div className="odd-letter-content">

        {/* TOP INFO */}
        <div className="odd-letter-top-info">

          <div className="odd-score">
            ⭐ Score: {score}
          </div>

          <div className="odd-progress">
            {currentIndex + 1} /{" "}
            {questions.length}
          </div>

        </div>

        {/* GAME CARD */}
        <div className="odd-letter-card">

          <div className="odd-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <h2>
            Find the different letter 👀
          </h2>

          <p className="odd-subtext">
            Look carefully and tap the one
            that is different
          </p>

          {/* LETTER GRID */}
          <div className="odd-grid">

            {currentQuestion.letters.map(
              (letter, index) => {

                const isSelected =
                  selectedIndex === index;

                const isCorrect =
                  index ===
                  currentQuestion.answerIndex;

                return (
                  <button
                    key={index}
                    className={`
                      odd-letter-box
                      ${
                        isSelected
                          ? "selected"
                          : ""
                      }
                      ${
                        status ===
                          "correct" &&
                        isCorrect
                          ? "correct"
                          : ""
                      }
                      ${
                        status ===
                          "wrong" &&
                        isSelected
                          ? "wrong"
                          : ""
                      }
                      ${
                        status ===
                          "wrong" &&
                        isCorrect
                          ? "show-correct"
                          : ""
                      }
                    `}
                    onClick={() =>
                      handleLetterClick(
                        index
                      )
                    }
                  >
                    {letter}
                  </button>
                );
              }
            )}

          </div>

          {/* FEEDBACK */}
          <div className="odd-feedback-area">

            {!status && (
              <p className="odd-hint">
                Check uppercase and lowercase
                carefully ✨
              </p>
            )}

            {status === "correct" && (
              <p className="odd-feedback correct-text">
                ✅ Great!{" "}
                {currentQuestion.message}
              </p>
            )}

            {status === "wrong" && (
              <p className="odd-feedback wrong-text">
                ❌ Oops!{" "}
                {currentQuestion.message}
              </p>
            )}

          </div>

          {/* NEXT */}
          {status && (
            <button
              className="odd-next-btn"
              onClick={handleNext}
            >
              {isLastQuestion
                ? "See Result"
                : "Next"}
            </button>
          )}

        </div>

        {/* BOTTOM ANIMALS */}
        <div className="odd-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>

      </div>

    </div>
  );
}