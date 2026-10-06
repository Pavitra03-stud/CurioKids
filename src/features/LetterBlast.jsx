// // import { useState } from "react";
// // import "../styles/gameCommon.css";

// // // 🔤 ALL letters
// // const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// // export default function LetterBlast({ goBack }) {
// //   const [game, setGame] = useState(generateGame());
// //   const [selected, setSelected] = useState(null);
// //   const [message, setMessage] = useState("");

// //   // 🎯 Generate one round
// //   function generateGame() {
// //     const correct =
// //       ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

// //     // get 3 wrong letters
// //     let options = [correct];
// //     while (options.length < 4) {
// //       const random =
// //         ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

// //       if (!options.includes(random)) {
// //         options.push(random);
// //       }
// //     }

// //     // shuffle
// //     options = options.sort(() => Math.random() - 0.5);

// //     return { correct, options };
// //   }

// //   const handleClick = (letter) => {
// //     setSelected(letter);

// //     if (letter === game.correct) {
// //       setMessage("Boom! 💥 Correct");
// //     } else {
// //       setMessage("Oops! Try again 💛");
// //     }
// //   };

// //   const next = () => {
// //     setGame(generateGame());
// //     setSelected(null);
// //     setMessage("");
// //   };

// //   return (
// //     <div className="game-page">

// //       {/* Header */}
// //       <div className="header">
// //         <h1>Letter Blast</h1>
// //       </div>

// //       {/* Instruction */}
// //       <p className="instruction">
// //         Blast: <strong className="target">{game.correct}</strong>
// //       </p>

// //       {/* Options */}
// //       <div className="options">
// //         {game.options.map((l, i) => {
// //           let stateClass = "";

// //           if (selected === l) {
// //             stateClass = l === game.correct ? "blast correct" : "wrong";
// //           }

// //           return (
// //             <div
// //               key={i}
// //               className={`card floating ${stateClass}`}
// //               onClick={() => handleClick(l)}
// //             >
// //               {l}
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* Feedback */}
// //       <h2 className="feedback">{message}</h2>

// //       {/* Next */}
// //       {message.includes("Correct") && (
// //         <button className="next-btn" onClick={next}>
// //           Next →
// //         </button>
// //       )}
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import "../styles/gameCommon.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔤 ALL letters
// const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// export default function LetterBlast({ goBack }) {

//   const TOTAL_ROUNDS = 5;

//   const [game, setGame] = useState(generateGame());
//   const [selected, setSelected] = useState(null);
//   const [message, setMessage] = useState("");

//   const [score, setScore] = useState(0);
//   const [round, setRound] = useState(1);

//   // 🎯 Generate one round
//   function generateGame() {
//     const correct =
//       ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

//     let options = [correct];

//     while (options.length < 4) {
//       const random =
//         ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

//       if (!options.includes(random)) {
//         options.push(random);
//       }
//     }

//     options = options.sort(() => Math.random() - 0.5);

//     return { correct, options };
//   }

//   // ☁️ SAVE
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userEmail = localStorage.getItem("loginEmail");

//       if (!userEmail) return;

//       const userRef = doc(db, "users", userEmail);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_ROUNDS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_ROUNDS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: "LetterBlast"
//       });

//       console.log("✅ LetterBlast saved");

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleClick = (letter) => {
//     if (selected) return;

//     setSelected(letter);

//     if (letter === game.correct) {
//       setScore((prev) => prev + 1);
//       setMessage("Boom! 💥 Correct");
//     } else {
//       setMessage("Oops! Try again 💛");
//     }
//   };

//   const next = async () => {

//     if (round === TOTAL_ROUNDS) {

//       await saveScoreToFirestore(score);

//       alert(`🎯 Game Completed!\nScore: ${score}/${TOTAL_ROUNDS}`);

//       // reset
//       setScore(0);
//       setRound(1);
//       setGame(generateGame());
//       setSelected(null);
//       setMessage("");
//       return;
//     }

//     setRound((prev) => prev + 1);
//     setGame(generateGame());
//     setSelected(null);
//     setMessage("");
//   };

//   return (
//     <div className="game-page">

//       {/* Header */}
//       <div className="header">
//         <h1>Letter Blast</h1>
//         <p>Round {round}/{TOTAL_ROUNDS} | Score: {score}</p>
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
//           {round === TOTAL_ROUNDS ? "Finish 🎯" : "Next →"}
//         </button>
//       )}
//     </div>
//   );
// }/




import { useEffect, useState } from "react";
import "../styles/gameCommon.css";
import useGameProgress from "../hooks/useGameProgress";

// 🔤 ALL letters
const ALL_LETTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const GAME_ID = "letter-blast";
const TOTAL_ROUNDS = 5;

const INITIAL_STATE = {
  correct: "",
  options: [],
  selected: null,
  message: "",
  score: 0,
  round: 1,
  completed: false,
};

export default function LetterBlast() {
  /* =========================================================
     FIREBASE GAME PROGRESS
  ========================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [game, setGame] = useState({
    correct: "",
    options: [],
  });

  const [selected, setSelected] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [round, setRound] =
    useState(1);

  const [completed, setCompleted] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  /* =========================================================
     GENERATE GAME
  ========================================================= */

  function generateGame() {
    const correct =
      ALL_LETTERS[
        Math.floor(
          Math.random() *
            ALL_LETTERS.length
        )
      ];

    let options = [correct];

    while (options.length < 4) {
      const random =
        ALL_LETTERS[
          Math.floor(
            Math.random() *
              ALL_LETTERS.length
          )
        ];

      if (
        !options.includes(random)
      ) {
        options.push(random);
      }
    }

    options = options.sort(
      () => Math.random() - 0.5
    );

    return {
      correct,
      options,
    };
  }

  /* =========================================================
     RESTORE SAVED GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Letter Blast saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.correct &&
      savedState.options?.length
    ) {
      setGame({
        correct:
          savedState.correct,

        options:
          savedState.options,
      });

      setSelected(
        savedState.selected ?? null
      );

      setMessage(
        savedState.message || ""
      );

      setScore(
        savedState.score ?? 0
      );

      setRound(
        savedState.round ?? 1
      );

      setCompleted(
        savedState.completed ?? false
      );
    } else {
      /*
       * First time opening game.
       */
      const newGame =
        generateGame();

      setGame(newGame);

      save({
        correct:
          newGame.correct,

        options:
          newGame.options,

        selected: null,

        message: "",

        score: 0,

        round: 1,

        completed: false,
      });
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     HANDLE CLICK
  ========================================================= */

  const handleClick = async (
    letter
  ) => {
    /*
     * Prevent selecting another
     * letter after an answer.
     */
    if (selected) return;
    if (completed) return;

    setSelected(letter);

    const isCorrect =
      letter === game.correct;

    const updatedScore =
      isCorrect
        ? score + 1
        : score;

    const feedback = isCorrect
      ? "Boom! 💥 Correct"
      : "Oops! Try again 💛";

    setScore(
      updatedScore
    );

    setMessage(
      feedback
    );

    /*
     * Save current answer.
     */
    await save({
      correct:
        game.correct,

      options:
        game.options,

      selected: letter,

      message: feedback,

      score:
        updatedScore,

      round,

      completed: false,
    });
  };

  /* =========================================================
     NEXT / FINISH
  ========================================================= */

  const next = async () => {
    /*
     * If this was the final round,
     * complete the game.
     */
    if (
      round === TOTAL_ROUNDS
    ) {
      const finalPercentage =
        (score /
          TOTAL_ROUNDS) *
        100;

      console.log(
        "🏁 Letter Blast completed:",
        {
          score,
          total:
            TOTAL_ROUNDS,
          percentage:
            finalPercentage,
        }
      );

      setCompleted(true);

      /*
       * ⭐ Add stars + history
       */
      await finish(
        finalPercentage,
        "Letter Blast"
      );

      /*
       * Save completion state.
       */
      await save({
        correct:
          game.correct,

        options:
          game.options,

        selected,

        message:
          `🎯 Game Completed! Score: ${score}/${TOTAL_ROUNDS}`,

        score,

        round,

        completed: true,
      });

      return;
    }

    /*
     * Generate next round.
     */
    const nextGame =
      generateGame();

    const nextRound =
      round + 1;

    setRound(
      nextRound
    );

    setGame(
      nextGame
    );

    setSelected(null);

    setMessage("");

    /*
     * Save next round immediately.
     */
    await save({
      correct:
        nextGame.correct,

      options:
        nextGame.options,

      selected: null,

      message: "",

      score,

      round:
        nextRound,

      completed: false,
    });
  };

  /* =========================================================
     PLAY AGAIN
  ========================================================= */

  const playAgain = async () => {
    const newGame =
      generateGame();

    setGame(
      newGame
    );

    setSelected(null);

    setMessage("");

    setScore(0);

    setRound(1);

    setCompleted(false);

    await save({
      correct:
        newGame.correct,

      options:
        newGame.options,

      selected: null,

      message: "",

      score: 0,

      round: 1,

      completed: false,
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="game-page">

        <div className="header">
          <h1>
            Letter Blast
          </h1>
        </div>

        <p className="instruction">
          Restoring your game...
        </p>

      </div>
    );
  }

  /* =========================================================
     COMPLETED
  ========================================================= */

  if (completed) {
    return (
      <div className="game-page">

        <div className="header">
          <h1>
            Letter Blast 💥
          </h1>
        </div>

        <h2 className="feedback">
          🎯 Game Completed!
        </h2>

        <p className="instruction">
          Score:{" "}
          <strong>
            {score}/
            {TOTAL_ROUNDS}
          </strong>
        </p>

        <button
          className="next-btn"
          onClick={
            playAgain
          }
        >
          Play Again 🔄
        </button>

      </div>
    );
  }

  /* =========================================================
     MAIN GAME
  ========================================================= */

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">

        <h1>
          Letter Blast
        </h1>

        <p>
          Round {round}/
          {TOTAL_ROUNDS}{" "}
          | Score: {score}
        </p>

      </div>

      {/* Instruction */}
      <p className="instruction">
        Blast:{" "}
        <strong className="target">
          {game.correct}
        </strong>
      </p>

      {/* Options */}
      <div className="options">

        {game.options.map(
          (letter, index) => {
            let stateClass = "";

            if (
              selected ===
              letter
            ) {
              stateClass =
                letter ===
                game.correct
                  ? "blast correct"
                  : "wrong";
            }

            return (
              <div
                key={index}
                className={`card floating ${stateClass}`}
                onClick={() =>
                  handleClick(
                    letter
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                      "Enter" ||
                    event.key ===
                      " "
                  ) {
                    event.preventDefault();

                    handleClick(
                      letter
                    );
                  }
                }}
              >
                {letter}
              </div>
            );
          }
        )}

      </div>

      {/* Feedback */}
      <h2 className="feedback">
        {message}
      </h2>

      {/* Next */}
      {message.includes(
        "Correct"
      ) && (
        <button
          className="next-btn"
          onClick={next}
        >
          {round ===
          TOTAL_ROUNDS
            ? "Finish 🎯"
            : "Next →"}
        </button>
      )}

    </div>
  );
}