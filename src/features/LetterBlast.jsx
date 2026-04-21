// import { useState } from "react";
// import "../styles/gameCommon.css";

// // 🔤 ALL letters
// const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// export default function LetterBlast({ goBack }) {
//   const [game, setGame] = useState(generateGame());
//   const [selected, setSelected] = useState(null);
//   const [message, setMessage] = useState("");

//   // 🎯 Generate one round
//   function generateGame() {
//     const correct =
//       ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

//     // get 3 wrong letters
//     let options = [correct];
//     while (options.length < 4) {
//       const random =
//         ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

//       if (!options.includes(random)) {
//         options.push(random);
//       }
//     }

//     // shuffle
//     options = options.sort(() => Math.random() - 0.5);

//     return { correct, options };
//   }

//   const handleClick = (letter) => {
//     setSelected(letter);

//     if (letter === game.correct) {
//       setMessage("Boom! 💥 Correct");
//     } else {
//       setMessage("Oops! Try again 💛");
//     }
//   };

//   const next = () => {
//     setGame(generateGame());
//     setSelected(null);
//     setMessage("");
//   };

//   return (
//     <div className="game-page">

//       {/* Header */}
//       <div className="header">
//         <h1>Letter Blast</h1>
//       </div>

//       {/* Instruction */}
//       <p className="instruction">
//         Blast: <strong className="target">{game.correct}</strong>
//       </p>

//       {/* Options */}
//       <div className="options">
//         {game.options.map((l, i) => {
//           let stateClass = "";

//           if (selected === l) {
//             stateClass = l === game.correct ? "blast correct" : "wrong";
//           }

//           return (
//             <div
//               key={i}
//               className={`card floating ${stateClass}`}
//               onClick={() => handleClick(l)}
//             >
//               {l}
//             </div>
//           );
//         })}
//       </div>

//       {/* Feedback */}
//       <h2 className="feedback">{message}</h2>

//       {/* Next */}
//       {message.includes("Correct") && (
//         <button className="next-btn" onClick={next}>
//           Next →
//         </button>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import "../styles/gameCommon.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔤 ALL letters
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LetterBlast({ goBack }) {

  const TOTAL_ROUNDS = 5;

  const [game, setGame] = useState(generateGame());
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  // 🎯 Generate one round
  function generateGame() {
    const correct =
      ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

    let options = [correct];

    while (options.length < 4) {
      const random =
        ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

      if (!options.includes(random)) {
        options.push(random);
      }
    }

    options = options.sort(() => Math.random() - 0.5);

    return { correct, options };
  }

  // ☁️ SAVE
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userEmail = localStorage.getItem("loginEmail");

      if (!userEmail) return;

      const userRef = doc(db, "users", userEmail);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / TOTAL_ROUNDS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_ROUNDS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "LetterBlast"
      });

      console.log("✅ LetterBlast saved");

    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (letter) => {
    if (selected) return;

    setSelected(letter);

    if (letter === game.correct) {
      setScore((prev) => prev + 1);
      setMessage("Boom! 💥 Correct");
    } else {
      setMessage("Oops! Try again 💛");
    }
  };

  const next = async () => {

    if (round === TOTAL_ROUNDS) {

      await saveScoreToFirestore(score);

      alert(`🎯 Game Completed!\nScore: ${score}/${TOTAL_ROUNDS}`);

      // reset
      setScore(0);
      setRound(1);
      setGame(generateGame());
      setSelected(null);
      setMessage("");
      return;
    }

    setRound((prev) => prev + 1);
    setGame(generateGame());
    setSelected(null);
    setMessage("");
  };

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">
        <h1>Letter Blast</h1>
        <p>Round {round}/{TOTAL_ROUNDS} | Score: {score}</p>
      </div>

      {/* Instruction */}
      <p className="instruction">
        Blast: <strong className="target">{game.correct}</strong>
      </p>

      {/* Options */}
      <div className="options">
        {game.options.map((l, i) => {
          let stateClass = "";

          if (selected === l) {
            stateClass = l === game.correct ? "blast correct" : "wrong";
          }

          return (
            <div
              key={i}
              className={`card floating ${stateClass}`}
              onClick={() => handleClick(l)}
            >
              {l}
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      <h2 className="feedback">{message}</h2>

      {/* Next */}
      {message.includes("Correct") && (
        <button className="next-btn" onClick={next}>
          {round === TOTAL_ROUNDS ? "Finish 🎯" : "Next →"}
        </button>
      )}
    </div>
  );
}