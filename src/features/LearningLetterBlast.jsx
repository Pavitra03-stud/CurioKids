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




import { useMemo, useState } from "react";
import "../styles/LearningLetterBlast.css";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const gameFinished = currentIndex >= questions.length;

  const handleOptionClick = (letter) => {
    if (status) return;

    setSelected(letter);

    if (letter === currentQuestion.correct) {
      setStatus("correct");
      setScore((prev) => prev + 1);
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCurrentIndex(questions.length);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected("");
    setStatus("");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected("");
    setStatus("");
    setScore(0);
  };

  if (gameFinished) {
    return (
      <div className="learning-letter-blast-page">
        <header className="learning-letter-blast-topbar">
          <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
        </header>

        <div className="learning-letter-blast-decor decor-one"></div>
        <div className="learning-letter-blast-decor decor-two"></div>
        <div className="learning-letter-blast-decor decor-three"></div>

        <div className="blast-finish-card">
          <div className="finish-emoji">🏆</div>
          <h2>Great Job!</h2>
          <p>
            You got <span>{score}</span> out of <span>{questions.length}</span>
          </p>

          <div className="finish-buttons">
            <button className="primary-btn" onClick={handleRestart}>
              Play Again
            </button>
            <button className="secondary-btn" onClick={goBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-letter-blast-page">
      <header className="learning-letter-blast-topbar">
        <button className="learning-letter-blast-back" onClick={goBack}>
          ←
        </button>
        <h1 className="learning-letter-blast-title">💥 Letter Blast</h1>
      </header>

      <div className="learning-letter-blast-decor decor-one"></div>
      <div className="learning-letter-blast-decor decor-two"></div>
      <div className="learning-letter-blast-decor decor-three"></div>

      <div className="learning-letter-blast-content">
        <div className="blast-top-info">
          <div className="blast-score">⭐ Score: {score}</div>
          <div className="blast-progress">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="blast-card">
          <div className="blast-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="blast-image">{currentQuestion.image}</div>
          <div className="blast-word">{currentQuestion.word}</div>

          <p className="blast-question">Tap the first letter</p>

          <div className="blast-options">
            {currentQuestion.options.map((letter, index) => (
              <button
                key={index}
                className={`blast-option
                  ${selected === letter ? "selected" : ""}
                  ${
                    status === "correct" && letter === currentQuestion.correct
                      ? "correct"
                      : ""
                  }
                  ${
                    status === "wrong" && selected === letter
                      ? "wrong"
                      : ""
                  }
                `}
                onClick={() => handleOptionClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="blast-feedback-area">
            {!status && <p className="blast-hint">Look at the picture and choose carefully 👀</p>}

            {status === "correct" && (
              <p className="blast-feedback correct-text">
                ✅ Super! {currentQuestion.correct} for {currentQuestion.word}
              </p>
            )}

            {status === "wrong" && (
              <p className="blast-feedback wrong-text">
                ❌ Try again next time! Correct answer is {currentQuestion.correct}
              </p>
            )}
          </div>

          {status && (
            <button className="next-btn" onClick={handleNext}>
              {isLastQuestion ? "See Result" : "Next"}
            </button>
          )}
        </div>

        <div className="blast-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}