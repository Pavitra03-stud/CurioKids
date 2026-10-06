// import React, { useState, useEffect } from "react";
// import "../styles/gameCommon.css";

// /* 📘 LEARNING DATA */
// const animalLearnData = [
//   {
//     animal: "Dog",
//     image: "/images/dog.png",
//     home: "House",
//     emoji: "🏠",
//     info: "Dogs live with humans in houses.",
//   },
//   {
//     animal: "Bird",
//     image: "/images/bird.png",
//     home: "Nest",
//     emoji: "🪹",
//     info: "Birds build nests on trees.",
//   },
//   {
//     animal: "Fish",
//     image: "/images/fish.png",
//     home: "Water",
//     emoji: "🌊",
//     info: "Fish live in water.",
//   },
//   {
//     animal: "Lion",
//     image: "/images/lion.png",
//     home: "Jungle",
//     emoji: "🌴",
//     info: "Lions live in jungles.",
//   },
//   {
//     animal: "Cow",
//     image: "/images/cow.png",
//     home: "Farm",
//     emoji: "🚜",
//     info: "Cows live on farms.",
//   },
//   {
//     animal: "Bee",
//     image: "/images/bee.png",
//     home: "Hive",
//     emoji: "🍯",
//     info: "Bees live in hives.",
//   }
// ];

// /* 🎮 GAME DATA */
// const animalGameData = [
//   {
//     animal: "Dog",
//     image: "/images/dog.png",
//     correctIndex: 0,
//     options: ["House 🏠", "Nest 🪹", "Water 🌊", "Jungle 🌴"]
//   },
//   {
//     animal: "Bird",
//     image: "/images/bird.png",
//     correctIndex: 1,
//     options: ["Farm 🚜", "Nest 🪹", "Water 🌊", "House 🏠"]
//   },
//   {
//     animal: "Fish",
//     image: "/images/fish.png",
//     correctIndex: 2,
//     options: ["House 🏠", "Nest 🪹", "Water 🌊", "Farm 🚜"]
//   },
//   {
//     animal: "Lion",
//     image: "/images/lion.png",
//     correctIndex: 3,
//     options: ["House 🏠", "Farm 🚜", "Nest 🪹", "Jungle 🌴"]
//   },
//   {
//     animal: "Cow",
//     image: "/images/cow.png",
//     correctIndex: 1,
//     options: ["Water 🌊", "Farm 🚜", "Nest 🪹", "Jungle 🌴"]
//   }
// ];

// export default function AnimalHomesGame({ goBack }) {

//   const [mode, setMode] = useState("learn");
//   const [learnIndex, setLearnIndex] = useState(0);

//   const [gameIndex, setGameIndex] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState(0);

//   /* 🔊 VOICE */
//   const speak = (text) => {
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.rate = 0.8;
//     speechSynthesis.cancel();
//     speechSynthesis.speak(utter);
//   };

//   /* 🔊 AUTO SPEAK */
//   useEffect(() => {
//     if (mode === "learn") {
//       const current = animalLearnData[learnIndex];
//       const text = `${current.animal}. Lives in ${current.home}. ${current.info}`;
//       speak(text);
//     }
//   }, [learnIndex, mode]);

//   /* 📘 LEARNING MODE */
//   if (mode === "learn") {
//     const current = animalLearnData[learnIndex];

//     return (
//       <div className="soundtap-container">
//         <button className="back-btn" onClick={goBack}>⬅ Back</button>

//         <h1 className="soundtap-title">Animal Homes 🐾</h1>

//         <div className="soundtap-card">
//           <img src={current.image} className="weather-img" alt={current.animal} />

//           <div className="soundtap-word">{current.animal}</div>

//           <div style={{ marginTop: "10px" }}>
//             Lives in: {current.emoji} <b>{current.home}</b>
//           </div>

//           <div style={{ marginTop: "10px", color: "#555" }}>
//             {current.info}
//           </div>

//           <button
//             className="audio-btn"
//             onClick={() =>
//               speak(`${current.animal} lives in ${current.home}. ${current.info}`)
//             }
//           >
//             🔊 Hear
//           </button>

//           <div style={{ marginTop: "20px" }}>
//             <button
//               className="next-btn"
//               onClick={() => setLearnIndex(i => Math.max(i - 1, 0))}
//             >
//               ⬅ Prev
//             </button>

//             <button
//               className="next-btn"
//               onClick={() =>
//                 setLearnIndex(i => Math.min(i + 1, animalLearnData.length - 1))
//               }
//             >
//               Next ➡
//             </button>
//           </div>

//           {learnIndex === animalLearnData.length - 1 && (
//             <button
//               className="next-btn"
//               style={{ marginTop: "15px" }}
//               onClick={() => setMode("game")}
//             >
//               🎮 Start Game
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   /* 🎮 GAME MODE */
//   const current = animalGameData[gameIndex];

//   const handleSelect = (i) => {
//     setSelected(i);

//     if (i === current.correctIndex) {
//       setFeedback("Correct! 🎉");
//       setScore(prev => prev + 1);
//     } else {
//       setFeedback("Oops! Try again 💛");
//     }
//   };

//   const next = () => {
//     setSelected(null);
//     setFeedback("");

//     if (gameIndex < animalGameData.length - 1) {
//       setGameIndex(prev => prev + 1);
//     } else {
//       setFeedback(`Game Over! Score: ${score}/${animalGameData.length}`);
//     }
//   };

//   return (
//     <div className="soundtap-container">
//       <button className="back-btn" onClick={goBack}>⬅ Back</button>

//       <h1 className="soundtap-title">Where Do Animals Live? 🐾🏠</h1>

//       <div className="soundtap-card">
//         <img src={current.image} className="weather-img" alt={current.animal} />

//         <div className="soundtap-word">{current.animal}</div>

//         <div className="circle-container">
//           {current.options.map((opt, i) => (
//             <div
//               key={i}
//               className={`circle ${selected === i ? "selected" : ""}`}
//               onClick={() => handleSelect(i)}
//             >
//               {opt}
//             </div>
//           ))}
//         </div>

//         <div className="feedback">{feedback}</div>

//         {selected !== null && (
//           <button className="next-btn" onClick={next}>
//             Next ➡
//           </button>
//         )}

//         <div style={{ marginTop: "10px", fontWeight: "bold" }}>
//           Score: {score}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import "../styles/gameCommon.css";
import useGameProgress from "../hooks/useGameProgress";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

/* 📘 LEARNING DATA */
const animalLearnData = [
  {
    animal: "Dog",
    image: "/images/dog.png",
    home: "House",
    emoji: "🏠",
    info: "Dogs live with humans in houses.",
  },
  {
    animal: "Bird",
    image: "/images/bird.png",
    home: "Nest",
    emoji: "🪹",
    info: "Birds build nests on trees.",
  },
  {
    animal: "Fish",
    image: "/images/fish.png",
    home: "Water",
    emoji: "🌊",
    info: "Fish live in water.",
  },
  {
    animal: "Lion",
    image: "/images/lion.png",
    home: "Jungle",
    emoji: "🌴",
    info: "Lions live in jungles.",
  },
  {
    animal: "Cow",
    image: "/images/cow.png",
    home: "Farm",
    emoji: "🚜",
    info: "Cows live on farms.",
  },
  {
    animal: "Bee",
    image: "/images/bee.png",
    home: "Hive",
    emoji: "🍯",
    info: "Bees live in hives.",
  },
];

/* 🎮 GAME DATA */
const animalGameData = [
  {
    animal: "Dog",
    image: "/images/dog.png",
    correctIndex: 0,
    options: ["House 🏠", "Nest 🪹", "Water 🌊", "Jungle 🌴"],
  },
  {
    animal: "Bird",
    image: "/images/bird.png",
    correctIndex: 1,
    options: ["Farm 🚜", "Nest 🪹", "Water 🌊", "House 🏠"],
  },
  {
    animal: "Fish",
    image: "/images/fish.png",
    correctIndex: 2,
    options: ["House 🏠", "Nest 🪹", "Water 🌊", "Farm 🚜"],
  },
  {
    animal: "Lion",
    image: "/images/lion.png",
    correctIndex: 3,
    options: ["House 🏠", "Farm 🚜", "Nest 🪹", "Jungle 🌴"],
  },
  {
    animal: "Cow",
    image: "/images/cow.png",
    correctIndex: 1,
    options: ["Water 🌊", "Farm 🚜", "Nest 🪹", "Jungle 🌴"],
  },
];

const GAME_ID = "animal-homes";

export default function AnimalHomesGame({ goBack }) {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    mode: "learn",
    learnIndex: 0,
    gameIndex: 0,
    selected: null,
    feedback: "",
    score: 0,
  });

  const [mode, setMode] = useState("learn");
  const [learnIndex, setLearnIndex] = useState(0);

  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const [gameFinished, setGameFinished] = useState(false);

  /* 🔄 RESTORE SAVED PROGRESS */
  useEffect(() => {
    if (progressLoading || !savedState) return;

    console.log("🐾 Animal Homes saved state:", savedState);

    setMode(savedState.mode ?? "learn");
    setLearnIndex(savedState.learnIndex ?? 0);
    setGameIndex(savedState.gameIndex ?? 0);
    setSelected(savedState.selected ?? null);
    setFeedback(savedState.feedback ?? "");
    setScore(savedState.score ?? 0);
  }, [progressLoading, savedState]);

  /* 💾 SAVE CURRENT PROGRESS */
  const saveCurrentProgress = async (overrides = {}) => {
    await save({
      mode,
      learnIndex,
      gameIndex,
      selected,
      feedback,
      score,
      ...overrides,
    });
  };

  /* 🔊 VOICE */
  const speak = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);

    utter.rate = 0.8;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  /* 🔊 AUTO SPEAK */
  useEffect(() => {
    if (progressLoading) return;

    if (mode === "learn") {
      const current = animalLearnData[learnIndex];

      if (!current) return;

      const text = `${current.animal}. Lives in ${current.home}. ${current.info}`;

      speak(text);
    }
  }, [learnIndex, mode, progressLoading]);

  /* 🧹 STOP SPEECH WHEN LEAVING */
  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ⏳ LOADING */
  if (progressLoading) {
    return (
      <div className="soundtap-container">
        <h1 className="soundtap-title">
          🐾 Loading Animal Homes...
        </h1>
      </div>
    );
  }

  /* 📘 LEARNING MODE */
  if (mode === "learn") {
    const current = animalLearnData[learnIndex];

    const handlePreviousLearn = async () => {
      const newIndex = Math.max(learnIndex - 1, 0);

      setLearnIndex(newIndex);

      await save({
        mode: "learn",
        learnIndex: newIndex,
        gameIndex,
        selected: null,
        feedback: "",
        score,
      });
    };

    const handleNextLearn = async () => {
      const newIndex = Math.min(
        learnIndex + 1,
        animalLearnData.length - 1
      );

      setLearnIndex(newIndex);

      await save({
        mode: "learn",
        learnIndex: newIndex,
        gameIndex,
        selected: null,
        feedback: "",
        score,
      });
    };

    const handleStartGame = async () => {
      setMode("game");
      setGameIndex(0);
      setSelected(null);
      setFeedback("");
      setScore(0);

      await save({
        mode: "game",
        learnIndex,
        gameIndex: 0,
        selected: null,
        feedback: "",
        score: 0,
      });
    };

    return (
      <div className="soundtap-container">
        <button className="back-btn" onClick={goBack}>
          ⬅ Back
        </button>

        <h1 className="soundtap-title">
          Animal Homes 🐾
        </h1>

        <div className="soundtap-card">
          <img
            src={current.image}
            className="weather-img"
            alt={current.animal}
          />

          <div className="soundtap-word">
            {current.animal}
          </div>

          <div style={{ marginTop: "10px" }}>
            Lives in: {current.emoji}{" "}
            <b>{current.home}</b>
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "#555",
            }}
          >
            {current.info}
          </div>

          <button
            className="audio-btn"
            onClick={() =>
              speak(
                `${current.animal} lives in ${current.home}. ${current.info}`
              )
            }
          >
            🔊 Hear
          </button>

          <div style={{ marginTop: "20px" }}>
            <button
              className="next-btn"
              onClick={handlePreviousLearn}
              disabled={learnIndex === 0}
            >
              ⬅ Prev
            </button>

            <button
              className="next-btn"
              onClick={handleNextLearn}
              disabled={
                learnIndex === animalLearnData.length - 1
              }
            >
              Next ➡
            </button>
          </div>

          {learnIndex === animalLearnData.length - 1 && (
            <button
              className="next-btn"
              style={{ marginTop: "15px" }}
              onClick={handleStartGame}
            >
              🎮 Start Game
            </button>
          )}
        </div>
      </div>
    );
  }

  /* 🎮 GAME MODE */
  const current = animalGameData[gameIndex];

  /* 🎯 ACTIVITY LOGGER */
  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "animals",
        screen: "animal-homes",
        score: finalScore,
        timestamp: new Date(),
      });

      console.log("✅ Animal Homes activity logged");
    } catch (err) {
      console.error(
        "❌ Animal Homes activity log error:",
        err
      );
    }
  };

  /* 🖱️ SELECT ANSWER */
  const handleSelect = async (i) => {
    // Prevent selecting another answer after one has already been selected
    if (selected !== null || gameFinished) return;

    setSelected(i);

    let newScore = score;

    if (i === current.correctIndex) {
      newScore = score + 1;

      setScore(newScore);
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Oops! Try again 💛");
    }

    await save({
      mode: "game",
      learnIndex,
      gameIndex,
      selected: i,
      feedback:
        i === current.correctIndex
          ? "Correct! 🎉"
          : "Oops! Try again 💛",
      score: newScore,
    });
  };

  /* ➡️ NEXT QUESTION */
  const next = async () => {
    if (selected === null || gameFinished) return;

    if (gameIndex < animalGameData.length - 1) {
      const newGameIndex = gameIndex + 1;

      setGameIndex(newGameIndex);
      setSelected(null);
      setFeedback("");

      await save({
        mode: "game",
        learnIndex,
        gameIndex: newGameIndex,
        selected: null,
        feedback: "",
        score,
      });
    } else {
      /* 🏁 FINAL SCORE */

      const finalScore = score;
      const percentage = Math.round(
        (finalScore / animalGameData.length) * 100
      );

      setGameFinished(true);

      setFeedback(
        `Game Over! Score: ${finalScore}/${animalGameData.length}`
      );

      /*
       * Complete the game only once.
       * finish() handles the Firebase completion/star logic.
       */
      try {
        await finish(
          percentage,
          "Animal Homes"
        );

        await logActivity(percentage);

        console.log(
          "🏆 Animal Homes completed:",
          percentage
        );
      } catch (err) {
        console.error(
          "❌ Failed to complete Animal Homes:",
          err
        );
      }
    }
  };

  /* 🔄 PLAY AGAIN */
  const playAgain = async () => {
    setMode("learn");
    setLearnIndex(0);

    setGameIndex(0);
    setSelected(null);
    setFeedback("");
    setScore(0);
    setGameFinished(false);

    await save({
      mode: "learn",
      learnIndex: 0,
      gameIndex: 0,
      selected: null,
      feedback: "",
      score: 0,
    });
  };

  return (
    <div className="soundtap-container">
      <button className="back-btn" onClick={goBack}>
        ⬅ Back
      </button>

      <h1 className="soundtap-title">
        Where Do Animals Live? 🐾🏠
      </h1>

      <div className="soundtap-card">
        <img
          src={current.image}
          className="weather-img"
          alt={current.animal}
        />

        <div className="soundtap-word">
          {current.animal}
        </div>

        <div className="circle-container">
          {current.options.map((opt, i) => (
            <div
              key={i}
              className={`circle ${
                selected === i ? "selected" : ""
              }`}
              onClick={() => handleSelect(i)}
              style={{
                cursor:
                  selected !== null || gameFinished
                    ? "default"
                    : "pointer",
                opacity:
                  selected !== null &&
                  selected !== i
                    ? 0.65
                    : 1,
              }}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="feedback">
          {feedback}
        </div>

        {!gameFinished && selected !== null && (
          <button
            className="next-btn"
            onClick={next}
          >
            {gameIndex === animalGameData.length - 1
              ? "Finish 🎉"
              : "Next ➡"}
          </button>
        )}

        {gameFinished && (
          <button
            className="next-btn"
            onClick={playAgain}
          >
            🔄 Play Again
          </button>
        )}

        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          Score: {score}/{animalGameData.length}
        </div>
      </div>
    </div>
  );
}