// // import { useState } from "react";
// // import "../styles/gameCommon.css";

// // export default function FillBucket({ goBack }) {

// //   // 🎯 random number generator
// //   const getRandomNumber = () => {
// //     return Math.floor(Math.random() * 6) + 2; // 2 to 7
// //   };

// //   const [target, setTarget] = useState(getRandomNumber());
// //   const [bucket, setBucket] = useState([]);
// //   const [message, setMessage] = useState("");

// //   // 🎯 choose item based on number
// //   const getItem = (num) => {
// //     if (num <= 2) return "🍎";
// //     if (num <= 4) return "🍌";
// //     if (num <= 6) return "🍇";
// //     return "🍓";
// //   };

// //   const item = getItem(target);

// //   // 🟢 drag start
// //   const handleDragStart = (e) => {
// //     e.dataTransfer.setData("item", item);
// //   };

// //   // 🟢 allow drop
// //   const allowDrop = (e) => {
// //     e.preventDefault();
// //   };

// //   // 🟢 drop logic
// //   const handleDrop = (e) => {
// //     e.preventDefault();

// //     if (bucket.length >= target) return;

// //     const newItem = { id: Date.now() };
// //     const newBucket = [...bucket, newItem];

// //     setBucket(newBucket);

// //     if (newBucket.length === target) {
// //       setMessage("Perfect! 🎉");
// //     }
// //   };

// //   // 🔄 reset game
// //   const reset = () => {
// //     setBucket([]);
// //     setMessage("");
// //     setTarget(getRandomNumber()); // 🔥 NEW RANDOM NUMBER
// //   };

// //   return (
// //     <div className="game-page">

// //       {/* Header */}
// //       <div className="header">
// //         <button onClick={goBack}>⬅</button>
// //         <h1>Fill the Bucket</h1>
// //       </div>

// //       {/* Instruction */}
// //       <p className="instruction">
// //         Drag <strong>{target}</strong> {item} into bucket
// //       </p>

// //       {/* Item source */}
// //       <div className="apple-source">
// //         <div
// //           className="apple draggable"
// //           draggable
// //           onDragStart={handleDragStart}
// //         >
// //           {item}
// //         </div>
// //       </div>

// //       {/* Bucket */}
// //       <div
// //         className="bucket-area drop-zone"
// //         onDragOver={allowDrop}
// //         onDrop={handleDrop}
// //       >
// //         {bucket.map((b) => (
// //           <div key={b.id} className="bucket-apple">
// //             {item}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Feedback */}
// //       <h2>{message}</h2>

// //       {/* Restart */}
// //       {message && (
// //         <button className="next-btn" onClick={reset}>
// //           Play Again →
// //         </button>
// //       )}
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import "../styles/gameCommon.css";

// // ✅ GameContext
// import { useGame } from "../context/GameContext";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";

// export default function FillBucket({ goBack }) {

//   const { addStars } = useGame(); // ✅ ADDED

//   const TOTAL_ROUNDS = 5;

//   const getRandomNumber = () => {
//     return Math.floor(Math.random() * 6) + 2;
//   };

//   const [target, setTarget] = useState(getRandomNumber());
//   const [bucket, setBucket] = useState([]);
//   const [message, setMessage] = useState("");

//   const [score, setScore] = useState(0); // ✅ NEW
//   const [round, setRound] = useState(1); // ✅ NEW

//   const getItem = (num) => {
//     if (num <= 2) return "🍎";
//     if (num <= 4) return "🍌";
//     if (num <= 6) return "🍇";
//     return "🍓";
//   };

//   const item = getItem(target);

//   // ✅ ACTIVITY LOGGER
//   const logActivity = async (finalScore) => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     await addDoc(collection(db, "activity"), {
//       userId,
//       action: "play",
//       module: "math",
//       screen: "fill-bucket",
//       score: finalScore,
//       timestamp: new Date(),
//     });
//   };

//   const handleDragStart = (e) => {
//     e.dataTransfer.setData("item", item);
//   };

//   const allowDrop = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();

//     if (bucket.length >= target) return;

//     const newItem = { id: Date.now() };
//     const newBucket = [...bucket, newItem];

//     setBucket(newBucket);

//     if (newBucket.length === target) {
//       setMessage("Perfect! 🎉");
//       setScore((prev) => prev + 1);

//       setTimeout(async () => {

//         if (round === TOTAL_ROUNDS) {

//           const finalPercentage = (score + 1) / TOTAL_ROUNDS * 100;

//           // ✅ SAVE PROGRESS
//           await addStars(finalPercentage, "Fill Bucket");

//           // ✅ LOG ACTIVITY
//           await logActivity(finalPercentage);

//           alert(`🎯 Game Completed!\nScore: ${score + 1}/${TOTAL_ROUNDS}`);

//           // RESET FULL GAME
//           setScore(0);
//           setRound(1);

//         } else {
//           setRound((prev) => prev + 1);
//         }

//         // NEXT ROUND RESET
//         setBucket([]);
//         setMessage("");
//         setTarget(getRandomNumber());

//       }, 800);
//     }
//   };

//   const reset = () => {
//     setBucket([]);
//     setMessage("");
//     setTarget(getRandomNumber());
//   };

//   return (
//     <div className="game-page">

//       {/* Header */}
//       <div className="header">
//         <button onClick={goBack}>⬅</button>
//         <h1>Fill the Bucket</h1>
//       </div>

//       <p className="instruction">
//         Drag <strong>{target}</strong> {item} into bucket
//       </p>

//       <p>Score: {score} | Round: {round}/{TOTAL_ROUNDS}</p>

//       {/* Item */}
//       <div className="apple-source">
//         <div
//           className="apple draggable"
//           draggable
//           onDragStart={handleDragStart}
//         >
//           {item}
//         </div>
//       </div>

//       {/* Bucket */}
//       <div
//         className="bucket-area drop-zone"
//         onDragOver={allowDrop}
//         onDrop={handleDrop}
//       >
//         {bucket.map((b) => (
//           <div key={b.id} className="bucket-apple">
//             {item}
//           </div>
//         ))}
//       </div>

//       <h2>{message}</h2>

//       {message && (
//         <button className="next-btn" onClick={reset}>
//           Play Again →
//         </button>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import "../styles/gameCommon.css";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// ✅ Game progress
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "fill-bucket";
const TOTAL_ROUNDS = 5;

const INITIAL_STATE = {
  target: null,
  bucket: [],
  message: "",
  score: 0,
  round: 1,
  completed: false,
};

export default function FillBucket({ goBack }) {
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
  // HELPERS
  // =========================================================

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 6) + 2;
  };

  const getItem = (num) => {
    if (num <= 2) return "🍎";
    if (num <= 4) return "🍌";
    if (num <= 6) return "🍇";
    return "🍓";
  };

  // =========================================================
  // STATES
  // =========================================================

  const [target, setTarget] = useState(
    getRandomNumber()
  );

  const [bucket, setBucket] = useState([]);

  const [message, setMessage] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [round, setRound] =
    useState(1);

  const [gameFinished, setGameFinished] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // =========================================================
  // CURRENT ITEM
  // =========================================================

  const item = getItem(target);

  // =========================================================
  // RESTORE FIREBASE PROGRESS
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Fill Bucket saved state:",
      savedState
    );

    if (savedState) {
      setTarget(
        savedState.target ??
          getRandomNumber()
      );

      setBucket(
        savedState.bucket ?? []
      );

      setMessage(
        savedState.message ?? ""
      );

      setScore(
        savedState.score ?? 0
      );

      setRound(
        savedState.round ?? 1
      );

      setGameFinished(
        savedState.completed ?? false
      );
    } else {
      const initialTarget =
        getRandomNumber();

      setTarget(initialTarget);

      save({
        target: initialTarget,
        bucket: [],
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

  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "math",
          screen: "fill-bucket",
          score: finalScore,
          timestamp: new Date(),
        }
      );

      console.log(
        "✅ Fill Bucket activity logged"
      );
    } catch (error) {
      console.error(
        "❌ Activity logging failed:",
        error
      );
    }
  };

  // =========================================================
  // DRAG START
  // =========================================================

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "item",
      item
    );
  };

  // =========================================================
  // ALLOW DROP
  // =========================================================

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // =========================================================
  // DROP
  // =========================================================

  const handleDrop = async (e) => {
    e.preventDefault();

    if (processing) return;

    if (gameFinished) return;

    if (bucket.length >= target)
      return;

    const newItem = {
      id: Date.now(),
    };

    const newBucket = [
      ...bucket,
      newItem,
    ];

    setBucket(newBucket);

    // -------------------------------------------------------
    // BUCKET NOT FULL YET
    // -------------------------------------------------------

    if (newBucket.length < target) {
      await save({
        target,
        bucket: newBucket,
        message: "",
        score,
        round,
        completed: false,
      });

      return;
    }

    // -------------------------------------------------------
    // ROUND COMPLETED
    // -------------------------------------------------------

    const updatedScore =
      score + 1;

    setMessage(
      "Perfect! 🎉"
    );

    setScore(updatedScore);

    setProcessing(true);

    // Save completed round state
    await save({
      target,
      bucket: newBucket,
      message: "Perfect! 🎉",
      score: updatedScore,
      round,
      completed: false,
    });

    setTimeout(async () => {
      // =====================================================
      // FINAL ROUND
      // =====================================================

      if (round === TOTAL_ROUNDS) {
        const finalPercentage =
          (updatedScore /
            TOTAL_ROUNDS) *
          100;

        console.log(
          "🏁 Fill Bucket completed:",
          {
            score: updatedScore,
            total: TOTAL_ROUNDS,
            percentage:
              finalPercentage,
          }
        );

        setGameFinished(true);

        // ⭐ Add stars + history
        await finish(
          finalPercentage,
          "Fill Bucket"
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        // Reset visual state for completion
        setBucket([]);

        setMessage("");

        setProcessing(false);

        return;
      }

      // =====================================================
      // NEXT ROUND
      // =====================================================

      const nextRound =
        round + 1;

      const nextTarget =
        getRandomNumber();

      setRound(nextRound);
      setBucket([]);
      setMessage("");
      setTarget(nextTarget);

      await save({
        target: nextTarget,
        bucket: [],
        message: "",
        score: updatedScore,
        round: nextRound,
        completed: false,
      });

      setProcessing(false);
    }, 800);
  };

  // =========================================================
  // RESET / PLAY AGAIN
  // =========================================================

  const reset = async () => {
    const newTarget =
      getRandomNumber();

    setTarget(newTarget);
    setBucket([]);
    setMessage("");
    setScore(0);
    setRound(1);
    setGameFinished(false);
    setProcessing(false);

    await save({
      target: newTarget,
      bucket: [],
      message: "",
      score: 0,
      round: 1,
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
      <div className="game-page">

        <div className="header">
          <button onClick={goBack}>
            ⬅
          </button>

          <h1>
            Fill the Bucket
          </h1>
        </div>

        <h2>
          Restoring your progress...
        </h2>

      </div>
    );
  }

  // =========================================================
  // COMPLETED
  // =========================================================

  if (gameFinished) {
    const percentage =
      (score /
        TOTAL_ROUNDS) *
      100;

    return (
      <div className="game-page">

        <div className="header">
          <button onClick={goBack}>
            ⬅
          </button>

          <h1>
            Fill the Bucket
          </h1>
        </div>

        <div className="game-info">

          <h2>
            🎉 Game Completed!
          </h2>

          <p>
            🎯 Score:{" "}
            {score}/
            {TOTAL_ROUNDS}
          </p>

          <p>
            ⭐ Accuracy:{" "}
            {percentage.toFixed(0)}%
          </p>

        </div>

        <h2>
          Amazing work! 🪣🍎
        </h2>

        <button
          className="next-btn"
          onClick={reset}
        >
          Play Again →
        </button>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="game-page">

      {/* Header */}

      <div className="header">

        <button
          onClick={goBack}
          disabled={processing}
        >
          ⬅
        </button>

        <h1>
          Fill the Bucket
        </h1>

      </div>

      {/* Instruction */}

      <p className="instruction">

        Drag{" "}
        <strong>
          {target}
        </strong>{" "}
        {item} into bucket

      </p>

      {/* Score */}

      <p>
        Score: {score} | Round:{" "}
        {round}/{TOTAL_ROUNDS}
      </p>

      {/* Item */}

      <div className="apple-source">

        <div
          className="apple draggable"
          draggable={!processing}
          onDragStart={
            handleDragStart
          }
        >
          {item}
        </div>

      </div>

      {/* Bucket */}

      <div
        className="bucket-area drop-zone"
        onDragOver={allowDrop}
        onDrop={handleDrop}
      >

        {bucket.map((b) => (
          <div
            key={b.id}
            className="bucket-apple"
          >
            {item}
          </div>
        ))}

      </div>

      {/* Message */}

      <h2>
        {message}
      </h2>

    </div>
  );
}