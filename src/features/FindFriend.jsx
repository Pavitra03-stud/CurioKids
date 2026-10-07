// import { useState, useEffect } from "react";
// import "../styles/FindFriend.css";

// import { useGame } from "../context/GameContext";

// import { db } from "../firebase";
// import {
//   collection,
//   addDoc,
// } from "firebase/firestore";

// export default function FindFriend({ goBack }) {
//   const {
//     getGameProgress,
//     saveGameProgress,
//     completeGame,
//   } = useGame();

//   const GAME_ID = "find-friend";
//   const TOTAL_ROUNDS = 5;

//   const [items, setItems] = useState([]);
//   const [correctIndex, setCorrectIndex] = useState(null);
//   const [message, setMessage] = useState("");

//   const [score, setScore] = useState(0);
//   const [round, setRound] = useState(1);

//   const [loadingGame, setLoadingGame] = useState(true);

//   /* =====================================================
//      🎮 GENERATE GAME
//   ===================================================== */

//   const createRound = () => {
//     const base = "🐶";
//     const odd = "🐱";

//     const arr = Array(6).fill(base);

//     const randomIndex = Math.floor(
//       Math.random() * 6
//     );

//     arr[randomIndex] = odd;

//     return {
//       items: arr,
//       correctIndex: randomIndex,
//     };
//   };

//   /* =====================================================
//      🔄 LOAD SAVED GAME OR START NEW GAME
//   ===================================================== */

//   useEffect(() => {
//     const loadGame = async () => {
//       try {
//         const savedGame =
//           getGameProgress(GAME_ID);

//         if (savedGame) {
//           console.log(
//             "🔄 Resuming Find Friend:",
//             savedGame
//           );

//           /*
//            * Restore saved state
//            */
//           setScore(
//             Number(savedGame.score) || 0
//           );

//           setRound(
//             Number(savedGame.round) || 1
//           );

//           setItems(
//             Array.isArray(savedGame.items)
//               ? savedGame.items
//               : []
//           );

//           setCorrectIndex(
//             Number.isInteger(
//               savedGame.correctIndex
//             )
//               ? savedGame.correctIndex
//               : null
//           );

//           setMessage("");

//           /*
//            * If saved question data is incomplete,
//            * generate a fresh round.
//            */
//           if (
//             !Array.isArray(savedGame.items) ||
//             !Number.isInteger(
//               savedGame.correctIndex
//             )
//           ) {
//             const newRound =
//               createRound();

//             setItems(newRound.items);
//             setCorrectIndex(
//               newRound.correctIndex
//             );

//             await saveGameProgress({
//               gameId: GAME_ID,
//               round:
//                 Number(savedGame.round) || 1,
//               question:
//                 (Number(savedGame.round) || 1) - 1,
//               score:
//                 Number(savedGame.score) || 0,
//               items: newRound.items,
//               correctIndex:
//                 newRound.correctIndex,
//             });
//           }
//         } else {
//           /*
//            * 🆕 NO SAVED PROGRESS
//            * Start from round 1
//            */
//           const newRound =
//             createRound();

//           setItems(newRound.items);
//           setCorrectIndex(
//             newRound.correctIndex
//           );

//           console.log(
//             "🆕 Starting new Find Friend game"
//           );
//         }
//       } catch (error) {
//         console.error(
//           "❌ Error loading Find Friend:",
//           error
//         );

//         const newRound =
//           createRound();

//         setItems(newRound.items);
//         setCorrectIndex(
//           newRound.correctIndex
//         );
//       } finally {
//         setLoadingGame(false);
//       }
//     };

//     loadGame();
//   }, []);

//   /* =====================================================
//      💾 SAVE CURRENT GAME STATE
//   ===================================================== */

//   const saveCurrentGame = async ({
//     currentRound = round,
//     currentScore = score,
//     currentItems = items,
//     currentCorrectIndex = correctIndex,
//   } = {}) => {
//     await saveGameProgress({
//       gameId: GAME_ID,

//       /*
//        * round is the visible round number
//        */
//       round: currentRound,

//       /*
//        * question is useful for other games
//        */
//       question: currentRound - 1,

//       score: currentScore,

//       items: currentItems,

//       correctIndex:
//         currentCorrectIndex,
//     });
//   };

//   /* =====================================================
//      📊 ACTIVITY LOGGER
//   ===================================================== */

//   const logActivity = async (
//     finalScore
//   ) => {
//     const userId =
//       localStorage.getItem("userId");

//     if (!userId) return;

//     try {
//       await addDoc(
//         collection(db, "activity"),
//         {
//           userId,

//           action: "play",

//           module: "visual",

//           screen: "find-friend",

//           score: finalScore,

//           timestamp: new Date(),
//         }
//       );

//       console.log(
//         "✅ Activity logged"
//       );
//     } catch (error) {
//       console.error(
//         "❌ Activity logging failed:",
//         error
//       );
//     }
//   };

//   /* =====================================================
//      ➡️ START NEXT ROUND
//   ===================================================== */

//   const startNextRound = async (
//     nextRound,
//     newScore
//   ) => {
//     const newGame =
//       createRound();

//     setRound(nextRound);

//     setScore(newScore);

//     setItems(newGame.items);

//     setCorrectIndex(
//       newGame.correctIndex
//     );

//     setMessage("");

//     /*
//      * 💾 Save the NEW round immediately
//      */
//     await saveGameProgress({
//       gameId: GAME_ID,

//       round: nextRound,

//       question:
//         nextRound - 1,

//       score: newScore,

//       items: newGame.items,

//       correctIndex:
//         newGame.correctIndex,
//     });
//   };

//   /* =====================================================
//      🖱️ HANDLE ANSWER
//   ===================================================== */

//   const handleClick = async (index) => {
//     if (loadingGame) return;

//     /*
//      * Prevent multiple clicks
//      */
//     if (message) return;

//     /* ---------------------------------------------
//        ❌ WRONG ANSWER
//     --------------------------------------------- */

//     if (index !== correctIndex) {
//       setMessage(
//         "Try again 💛"
//       );

//       setTimeout(() => {
//         setMessage("");
//       }, 800);

//       return;
//     }

//     /* ---------------------------------------------
//        ✅ CORRECT ANSWER
//     --------------------------------------------- */

//     const newScore =
//       score + 1;

//     setMessage(
//       "Great job! 🌟"
//     );

//     /*
//      * Save immediately so if the app closes
//      * during the success message, the score
//      * is still remembered.
//      */
//     await saveCurrentGame({
//       currentRound: round,

//       currentScore: newScore,

//       currentItems: items,

//       currentCorrectIndex:
//         correctIndex,
//     });

//     /* ---------------------------------------------
//        ⏳ MOVE TO NEXT ROUND / COMPLETE
//     --------------------------------------------- */

//     setTimeout(async () => {
//       /* -------------------------------------------
//          🏆 GAME COMPLETE
//       ------------------------------------------- */

//       if (
//         round === TOTAL_ROUNDS
//       ) {
//         const finalPercentage =
//           (newScore /
//             TOTAL_ROUNDS) *
//           100;

//         console.log(
//           "🏆 Find Friend completed:",
//           finalPercentage
//         );

//         /*
//          * ⭐ Add stars
//          *
//          * 🗑️ Clear resume progress
//          */
//         await completeGame(
//           finalPercentage,
//           "Find Friend",
//           GAME_ID
//         );

//         /*
//          * 📊 Log activity
//          */
//         await logActivity(
//           finalPercentage
//         );

//         alert(
//           `🎯 Game Completed!\nScore: ${newScore}/${TOTAL_ROUNDS}`
//         );

//         /*
//          * Reset local state
//          */
//         const freshGame =
//           createRound();

//         setScore(0);

//         setRound(1);

//         setItems(
//           freshGame.items
//         );

//         setCorrectIndex(
//           freshGame.correctIndex
//         );

//         setMessage("");

//         return;
//       }

//       /* -------------------------------------------
//          ➡️ NEXT ROUND
//       ------------------------------------------- */

//       await startNextRound(
//         round + 1,
//         newScore
//       );
//     }, 800);
//   };

//   /* =====================================================
//      ⏳ LOADING
//   ===================================================== */

//   if (loadingGame) {
//     return (
//       <div className="find-page">
//         <div className="find-header">
//           <button
//             className="back-btn"
//             onClick={goBack}
//           >
//             ⬅
//           </button>

//           <h1>
//             Find the Friend
//           </h1>
//         </div>

//         <p className="find-text">
//           Loading your progress...
//         </p>
//       </div>
//     );
//   }

//   /* =====================================================
//      🎨 UI
//   ===================================================== */

//   return (
//     <div className="find-page">

//       {/* Header */}
//       <div className="find-header">

//         <button
//           className="back-btn"
//           onClick={goBack}
//         >
//           ⬅
//         </button>

//         <h1>
//           Find the Friend
//         </h1>

//       </div>

//       {/* Instruction */}
//       <p className="find-text">
//         Find the different one
//       </p>

//       {/* Score */}
//       <p>
//         Score: {score} | Round:{" "}
//         {round}/{TOTAL_ROUNDS}
//       </p>

//       {/* Game Grid */}
//       <div className="find-grid">

//         {items.map(
//           (item, index) => (
//             <div
//               key={index}
//               className="find-cell"
//               onClick={() =>
//                 handleClick(index)
//               }
//             >
//               {item}
//             </div>
//           )
//         )}

//       </div>

//       {/* Feedback */}
//       <h2 className="feedback">
//         {message}
//       </h2>

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import "../styles/FindFriend.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
} from "firebase/firestore";

// ✅ Central game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "find-friend";
const TOTAL_ROUNDS = 5;

const INITIAL_STATE = {
  items: [],
  correctIndex: null,
  message: "",
  score: 0,
  round: 1,
  completed: false,
};

export default function FindFriend({ goBack }) {
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

  const [items, setItems] = useState([]);

  const [correctIndex, setCorrectIndex] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [round, setRound] =
    useState(1);

  const [loadingGame, setLoadingGame] =
    useState(true);

  const [restored, setRestored] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // =========================================================
  // CREATE ROUND
  // =========================================================

  const createRound = () => {
    const base = "🐶";
    const odd = "🐱";

    const arr = Array(6).fill(base);

    const randomIndex = Math.floor(
      Math.random() * 6
    );

    arr[randomIndex] = odd;

    return {
      items: arr,
      correctIndex: randomIndex,
    };
  };

  // =========================================================
  // RESTORE / START GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Find Friend saved state:",
      savedState
    );

    if (savedState) {
      const savedItems =
        Array.isArray(
          savedState.items
        )
          ? savedState.items
          : [];

      const savedCorrectIndex =
        Number.isInteger(
          savedState.correctIndex
        )
          ? savedState.correctIndex
          : null;

      setScore(
        Number(savedState.score) || 0
      );

      setRound(
        Number(savedState.round) || 1
      );

      setItems(savedItems);

      setCorrectIndex(
        savedCorrectIndex
      );

      setMessage("");

      // -------------------------------------------------------
      // INVALID SAVED QUESTION
      // -------------------------------------------------------

      if (
        savedItems.length !== 6 ||
        savedCorrectIndex === null
      ) {
        const newRound =
          createRound();

        setItems(
          newRound.items
        );

        setCorrectIndex(
          newRound.correctIndex
        );

        save({
          round:
            Number(
              savedState.round
            ) || 1,
          score:
            Number(
              savedState.score
            ) || 0,
          items:
            newRound.items,
          correctIndex:
            newRound.correctIndex,
          message: "",
          completed: false,
        });
      }
    } else {
      // -------------------------------------------------------
      // NEW GAME
      // -------------------------------------------------------

      const newRound =
        createRound();

      setItems(
        newRound.items
      );

      setCorrectIndex(
        newRound.correctIndex
      );

      save({
        round: 1,
        score: 0,
        items:
          newRound.items,
        correctIndex:
          newRound.correctIndex,
        message: "",
        completed: false,
      });

      console.log(
        "🆕 Starting new Find Friend game"
      );
    }

    setLoadingGame(false);
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
        localStorage.getItem(
          "userId"
        );

      if (!userId) return;

      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "visual",
          screen: "find-friend",
          score: finalScore,
          timestamp: new Date(),
        }
      );

      console.log(
        "✅ Find Friend activity logged"
      );
    } catch (error) {
      console.error(
        "❌ Activity logging failed:",
        error
      );
    }
  };

  // =========================================================
  // START NEXT ROUND
  // =========================================================

  const startNextRound = async (
    nextRound,
    newScore
  ) => {
    const newGame =
      createRound();

    setRound(nextRound);
    setScore(newScore);
    setItems(newGame.items);
    setCorrectIndex(
      newGame.correctIndex
    );
    setMessage("");

    // Save NEW question immediately
    await save({
      round: nextRound,
      score: newScore,
      items: newGame.items,
      correctIndex:
        newGame.correctIndex,
      message: "",
      completed: false,
    });
  };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleClick = async (
    index
  ) => {
    if (loadingGame) return;
    if (processing) return;
    if (message) return;
    if (correctIndex === null)
      return;

    // =======================================================
    // WRONG
    // =======================================================

    if (index !== correctIndex) {
      setMessage(
        "Try again 💛"
      );

      setProcessing(true);

      setTimeout(() => {
        setMessage("");
        setProcessing(false);
      }, 800);

      return;
    }

    // =======================================================
    // CORRECT
    // =======================================================

    const newScore =
      score + 1;

    setMessage(
      "Great job! 🌟"
    );

    setProcessing(true);

    // Save immediately
    await save({
      round,
      score: newScore,
      items,
      correctIndex,
      message:
        "Great job! 🌟",
      completed: false,
    });

    // =======================================================
    // NEXT ROUND / COMPLETE
    // =======================================================

    setTimeout(async () => {
      // -----------------------------------------------------
      // GAME COMPLETE
      // -----------------------------------------------------

      if (
        round ===
        TOTAL_ROUNDS
      ) {
        const finalPercentage =
          (newScore /
            TOTAL_ROUNDS) *
          100;

        console.log(
          "🏆 Find Friend completed:",
          finalPercentage
        );

        // ⭐ Central stars + history
        await finish(
          finalPercentage,
          "Find Friend"
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        alert(
          `🎯 Game Completed!\nScore: ${newScore}/${TOTAL_ROUNDS}`
        );

        // ---------------------------------------------------
        // START FRESH ROUND
        // ---------------------------------------------------

        const freshGame =
          createRound();

        setScore(0);
        setRound(1);
        setItems(
          freshGame.items
        );
        setCorrectIndex(
          freshGame.correctIndex
        );
        setMessage("");
        setProcessing(false);

        await save({
          round: 1,
          score: 0,
          items:
            freshGame.items,
          correctIndex:
            freshGame.correctIndex,
          message: "",
          completed: false,
        });

        return;
      }

      // -----------------------------------------------------
      // NEXT ROUND
      // -----------------------------------------------------

      await startNextRound(
        round + 1,
        newScore
      );

      setProcessing(false);
    }, 800);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    !restored ||
    loadingGame
  ) {
    return (
      <div className="find-page">

        <div className="find-header">

          <button
            className="back-btn"
            onClick={goBack}
          >
            ⬅
          </button>

          <h1>
            Find the Friend
          </h1>

        </div>

        <p className="find-text">
          Loading your progress...
        </p>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="find-page">

      {/* Header */}

      <div className="find-header">

        {/* <button
          className="back-btn"
          onClick={goBack}
          disabled={processing}
        >
          ⬅
        </button> */}

        <h1>
          Find the Friend
        </h1>

      </div>

      {/* Instruction */}

      <p className="find-text">
        Find the different one
      </p>

      {/* Score */}

      <p>
        Score: {score} | Round:{" "}
        {round}/{TOTAL_ROUNDS}
      </p>

      {/* Game Grid */}

      <div className="find-grid">

        {items.map(
          (item, index) => (
            <div
              key={index}
              className="find-cell"
              onClick={() =>
                handleClick(index)
              }
            >
              {item}
            </div>
          )
        )}

      </div>

      {/* Feedback */}

      <h2 className="feedback">
        {message}
      </h2>

    </div>
  );
}