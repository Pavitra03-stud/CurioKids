// import { useState } from "react";
// import BackIcon from "../components/BackIcon";
// import "../styles/FindCorrectLetter.css";

// export default function FindCorrectLetter({ goBack }) {
//   const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//   const getRandomLetter = () =>
//     letters[Math.floor(Math.random() * letters.length)];

//   const [targetLetter, setTargetLetter] = useState(getRandomLetter());
//   const [options, setOptions] = useState(generateGrid(targetLetter));
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState(0);
//   const [level, setLevel] = useState(1);
//   const [answered, setAnswered] = useState(0);
//   const [levelComplete, setLevelComplete] = useState(false);

//   function generateGrid(correct) {
//     const gridSize = level === 1 ? 6 : level === 2 ? 9 : 12;

//     const wrongLetters = letters
//       .filter((l) => l !== correct)
//       .sort(() => 0.5 - Math.random())
//       .slice(0, gridSize - 1);

//     return [...wrongLetters, correct].sort(() => 0.5 - Math.random());
//   }

//   const nextRound = () => {
//     const newLetter = getRandomLetter();
//     setTargetLetter(newLetter);
//     setOptions(generateGrid(newLetter));
//     setFeedback("");
//   };

//   const handleClick = (letter) => {
//     if (letter === targetLetter) {
//       setFeedback("correct");
//       setScore((prev) => prev + 10);
//       setAnswered((prev) => prev + 1);

//       setTimeout(() => {
//         if (answered + 1 >= 5) {
//           setLevelComplete(true);
//         } else {
//           nextRound();
//         }
//       }, 700);
//     } else {
//       setFeedback("wrong");
//     }
//   };

//   const startNextLevel = () => {
//     setLevel((prev) => prev + 1);
//     setAnswered(0);
//     setLevelComplete(false);
//     nextRound();
//   };

//   if (levelComplete) {
//     return (
//       <div className="find-page">
//         <div className="letter-navbar">
//           <BackIcon goBack={goBack} />
//           <h2>🎉 Level {level} Complete!</h2>
//         </div>

//         <div className="level-card">
//           <h3>Your Score: {score}</h3>

//           {level < 3 ? (
//             <button className="next-level-btn" onClick={startNextLevel}>
//               🚀 Start Level {level + 1}
//             </button>
//           ) : (
//             <h2>🏆 You Finished All Levels!</h2>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="find-page">
//       <div className="letter-navbar">
//         <BackIcon goBack={goBack} />
//         <h2>🔎 Find the Correct Letter</h2>
//       </div>

//       <div className="game-info">
//         <span>Level: {level}</span>
//         <span>Score: {score}</span>
//         <span>Progress: {answered}/5</span>
//       </div>

//       <h2 className="target-text">
//         Find the letter: <span>{targetLetter}</span>
//       </h2>

//       <div className="letter-grid">
//         {options.map((letter, index) => (
//           <button
//             key={index}
//             className="grid-letter"
//             onClick={() => handleClick(letter)}
//           >
//             {letter}
//           </button>
//         ))}
//       </div>

//       {feedback === "correct" && (
//         <div className="feedback good">🎉 Correct!</div>
//       )}

//       {feedback === "wrong" && (
//         <div className="feedback wrong">❌ Try Again</div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/FindCorrectLetter.css";

export default function FindCorrectLetter({ goBack }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getRandomLetter = () =>
    letters[Math.floor(Math.random() * letters.length)];

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);

  const [targetLetter, setTargetLetter] = useState(getRandomLetter());

  /* FIXED: pass level as parameter */
  const generateGrid = (correct, currentLevel) => {
    const gridSize =
      currentLevel === 1 ? 6 :
      currentLevel === 2 ? 9 :
      12;

    const wrongLetters = letters
      .filter((l) => l !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, gridSize - 1);

    return [...wrongLetters, correct].sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState(
    generateGrid(targetLetter, level)
  );

  const nextRound = () => {
    const newLetter = getRandomLetter();
    setTargetLetter(newLetter);
    setOptions(generateGrid(newLetter, level));
    setFeedback("");
  };

  const handleClick = (letter) => {
    if (letter === targetLetter) {
      setFeedback("correct");
      setScore((prev) => prev + 10);
      setAnswered((prev) => prev + 1);

      setTimeout(() => {
        if (answered + 1 >= 5) {
          setLevelComplete(true);
        } else {
          nextRound();
        }
      }, 700);
    } else {
      setFeedback("wrong");
    }
  };

  const startNextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setAnswered(0);
    setLevelComplete(false);

    const newLetter = getRandomLetter();
    setTargetLetter(newLetter);
    setOptions(generateGrid(newLetter, newLevel));
    setFeedback("");
  };

  if (levelComplete) {
    return (
      <div className="find-page">
        <div className="letter-navbar">
          <BackIcon goBack={goBack} />
          <h2>🎉 Level {level} Complete!</h2>
        </div>

        <div className="level-card">
          <h3>Your Score: {score}</h3>

          {level < 3 ? (
            <button className="next-level-btn" onClick={startNextLevel}>
              🚀 Start Level {level + 1}
            </button>
          ) : (
            <h2>🏆 You Finished All Levels!</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="find-page">
      <div className="letter-navbar">
        <BackIcon goBack={goBack} />
        <h2>🔎 Find the Correct Letter</h2>
      </div>

      <div className="game-info">
        <span>Level: {level}</span>
        <span>Score: {score}</span>
        <span>Progress: {answered}/5</span>
      </div>

      <h2 className="target-text">
        Find the letter: <span>{targetLetter}</span>
      </h2>

      <div className="letter-grid">
        {options.map((letter, index) => (
          <button
            key={index}
            className="grid-letter"
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {feedback === "correct" && (
        <div className="feedback good">🎉 Correct!</div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong">❌ Try Again</div>
      )}
    </div>
  );
}