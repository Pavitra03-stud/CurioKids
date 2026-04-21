// import { useState, useEffect } from "react";
// import "../styles/FindFriend.css";

// export default function FindFriend({ goBack }) {
//   const [items, setItems] = useState([]);
//   const [correctIndex, setCorrectIndex] = useState(null);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     generateGame();
//   }, []);

//   const generateGame = () => {
//     const base = "🐶";
//     const odd = "🐱";

//     let arr = Array(6).fill(base);
//     const randomIndex = Math.floor(Math.random() * 6);
//     arr[randomIndex] = odd;

//     setItems(arr);
//     setCorrectIndex(randomIndex);
//     setMessage("");
//   };

//   const handleClick = (index) => {
//     if (index === correctIndex) {
//       setMessage("Great job! 🌟");
//     } else {
//       setMessage("Try again 💛");
//     }
//   };

//   return (
//     <div className="find-page">

//       {/* Header */}
//       <div className="find-header">
//         <button className="back-btn" onClick={goBack}>⬅</button>
//         <h1>Find the Friend</h1>
//       </div>

//       {/* Instruction */}
//       <p className="find-text">Find the different one</p>

//       {/* Grid */}
//       <div className="find-grid">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="find-cell"
//             onClick={() => handleClick(index)}
//           >
//             {item}
//           </div>
//         ))}
//       </div>

//       {/* Feedback */}
//       <h2 className="feedback">{message}</h2>

//       {/* Next */}
//       {message === "Great job! 🌟" && (
//         <button className="next-btn" onClick={generateGame}>
//           Next →
//         </button>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import "../styles/FindFriend.css";

// ✅ GameContext
import { useGame } from "../context/GameContext";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FindFriend({ goBack }) {

  const { addStars } = useGame(); // ✅ ADDED

  const TOTAL_ROUNDS = 5;

  const [items, setItems] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0); // ✅ NEW
  const [round, setRound] = useState(1); // ✅ NEW

  useEffect(() => {
    generateGame();
  }, []);

  const generateGame = () => {
    const base = "🐶";
    const odd = "🐱";

    let arr = Array(6).fill(base);
    const randomIndex = Math.floor(Math.random() * 6);
    arr[randomIndex] = odd;

    setItems(arr);
    setCorrectIndex(randomIndex);
    setMessage("");
  };

  // ✅ ACTIVITY LOGGER
  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "play",
      module: "visual",
      screen: "find-friend",
      score: finalScore,
      timestamp: new Date(),
    });
  };

  const handleClick = async (index) => {

    if (message) return;

    if (index === correctIndex) {
      setMessage("Great job! 🌟");
      setScore((prev) => prev + 1);

      setTimeout(async () => {

        if (round === TOTAL_ROUNDS) {

          const finalPercentage = ((score + 1) / TOTAL_ROUNDS) * 100;

          // ✅ SAVE PROGRESS
          await addStars(finalPercentage, "Find Friend");

          // ✅ LOG ACTIVITY
          await logActivity(finalPercentage);

          alert(`🎯 Game Completed!\nScore: ${score + 1}/${TOTAL_ROUNDS}`);

          // RESET FULL GAME
          setScore(0);
          setRound(1);

        } else {
          setRound((prev) => prev + 1);
        }

        generateGame();

      }, 800);

    } else {
      setMessage("Try again 💛");

      setTimeout(() => {
        setMessage("");
      }, 800);
    }
  };

  return (
    <div className="find-page">

      {/* Header */}
      <div className="find-header">
        <button className="back-btn" onClick={goBack}>⬅</button>
        <h1>Find the Friend</h1>
      </div>

      <p className="find-text">Find the different one</p>

      {/* 🆕 Score Display */}
      <p>Score: {score} | Round: {round}/{TOTAL_ROUNDS}</p>

      <div className="find-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className="find-cell"
            onClick={() => handleClick(index)}
          >
            {item}
          </div>
        ))}
      </div>

      <h2 className="feedback">{message}</h2>

      {/* Keep your original next button */}
      {message === "Great job! 🌟" && (
        <button className="next-btn" onClick={generateGame}>
          Next →
        </button>
      )}
    </div>
  );
}