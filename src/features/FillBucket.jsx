// import { useState } from "react";
// import "../styles/gameCommon.css";

// export default function FillBucket({ goBack }) {

//   // 🎯 random number generator
//   const getRandomNumber = () => {
//     return Math.floor(Math.random() * 6) + 2; // 2 to 7
//   };

//   const [target, setTarget] = useState(getRandomNumber());
//   const [bucket, setBucket] = useState([]);
//   const [message, setMessage] = useState("");

//   // 🎯 choose item based on number
//   const getItem = (num) => {
//     if (num <= 2) return "🍎";
//     if (num <= 4) return "🍌";
//     if (num <= 6) return "🍇";
//     return "🍓";
//   };

//   const item = getItem(target);

//   // 🟢 drag start
//   const handleDragStart = (e) => {
//     e.dataTransfer.setData("item", item);
//   };

//   // 🟢 allow drop
//   const allowDrop = (e) => {
//     e.preventDefault();
//   };

//   // 🟢 drop logic
//   const handleDrop = (e) => {
//     e.preventDefault();

//     if (bucket.length >= target) return;

//     const newItem = { id: Date.now() };
//     const newBucket = [...bucket, newItem];

//     setBucket(newBucket);

//     if (newBucket.length === target) {
//       setMessage("Perfect! 🎉");
//     }
//   };

//   // 🔄 reset game
//   const reset = () => {
//     setBucket([]);
//     setMessage("");
//     setTarget(getRandomNumber()); // 🔥 NEW RANDOM NUMBER
//   };

//   return (
//     <div className="game-page">

//       {/* Header */}
//       <div className="header">
//         <button onClick={goBack}>⬅</button>
//         <h1>Fill the Bucket</h1>
//       </div>

//       {/* Instruction */}
//       <p className="instruction">
//         Drag <strong>{target}</strong> {item} into bucket
//       </p>

//       {/* Item source */}
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

//       {/* Feedback */}
//       <h2>{message}</h2>

//       {/* Restart */}
//       {message && (
//         <button className="next-btn" onClick={reset}>
//           Play Again →
//         </button>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import "../styles/gameCommon.css";

// ✅ GameContext
import { useGame } from "../context/GameContext";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FillBucket({ goBack }) {

  const { addStars } = useGame(); // ✅ ADDED

  const TOTAL_ROUNDS = 5;

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 6) + 2;
  };

  const [target, setTarget] = useState(getRandomNumber());
  const [bucket, setBucket] = useState([]);
  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0); // ✅ NEW
  const [round, setRound] = useState(1); // ✅ NEW

  const getItem = (num) => {
    if (num <= 2) return "🍎";
    if (num <= 4) return "🍌";
    if (num <= 6) return "🍇";
    return "🍓";
  };

  const item = getItem(target);

  // ✅ ACTIVITY LOGGER
  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "play",
      module: "math",
      screen: "fill-bucket",
      score: finalScore,
      timestamp: new Date(),
    });
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("item", item);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();

    if (bucket.length >= target) return;

    const newItem = { id: Date.now() };
    const newBucket = [...bucket, newItem];

    setBucket(newBucket);

    if (newBucket.length === target) {
      setMessage("Perfect! 🎉");
      setScore((prev) => prev + 1);

      setTimeout(async () => {

        if (round === TOTAL_ROUNDS) {

          const finalPercentage = (score + 1) / TOTAL_ROUNDS * 100;

          // ✅ SAVE PROGRESS
          await addStars(finalPercentage, "Fill Bucket");

          // ✅ LOG ACTIVITY
          await logActivity(finalPercentage);

          alert(`🎯 Game Completed!\nScore: ${score + 1}/${TOTAL_ROUNDS}`);

          // RESET FULL GAME
          setScore(0);
          setRound(1);

        } else {
          setRound((prev) => prev + 1);
        }

        // NEXT ROUND RESET
        setBucket([]);
        setMessage("");
        setTarget(getRandomNumber());

      }, 800);
    }
  };

  const reset = () => {
    setBucket([]);
    setMessage("");
    setTarget(getRandomNumber());
  };

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">
        <button onClick={goBack}>⬅</button>
        <h1>Fill the Bucket</h1>
      </div>

      <p className="instruction">
        Drag <strong>{target}</strong> {item} into bucket
      </p>

      <p>Score: {score} | Round: {round}/{TOTAL_ROUNDS}</p>

      {/* Item */}
      <div className="apple-source">
        <div
          className="apple draggable"
          draggable
          onDragStart={handleDragStart}
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
          <div key={b.id} className="bucket-apple">
            {item}
          </div>
        ))}
      </div>

      <h2>{message}</h2>

      {message && (
        <button className="next-btn" onClick={reset}>
          Play Again →
        </button>
      )}
    </div>
  );
}