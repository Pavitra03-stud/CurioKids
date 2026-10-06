// import React, { useState, useEffect } from "react";
// import "../styles/gameCommon.css";

// /* 🌦️ LEARNING DATA */
// const weatherLearnData = [
//   {
//     weather: "Sunny",
//     image: "/images/sunny.png",
//     feel: "It is hot and bright",
//     info: "The sun shines strongly.",
//     clothes: [
//       { name: "Cap", emoji: "🧢", use: "Protects your head from sun" },
//       { name: "Sunglasses", emoji: "😎", use: "Protects your eyes" },
//       { name: "T-shirt", emoji: "👕", use: "Keeps you cool" }
//     ]
//   },
//   {
//     weather: "Rainy",
//     image: "/images/rain.png",
//     feel: "It is wet",
//     info: "Rain falls from the sky.",
//     clothes: [
//       { name: "Umbrella", emoji: "☂️", use: "Keeps you dry" },
//       { name: "Raincoat", emoji: "🧥", use: "Protects from rain" },
//       { name: "Boots", emoji: "👢", use: "Keeps feet dry" }
//     ]
//   },
//   {
//     weather: "Snowy",
//     image: "/images/snow.png",
//     feel: "Very cold",
//     info: "Snow covers everything.",
//     clothes: [
//       { name: "Jacket", emoji: "🧥", use: "Keeps body warm" },
//       { name: "Gloves", emoji: "🧤", use: "Keeps hands warm" },
//       { name: "Scarf", emoji: "🧣", use: "Protects neck" }
//     ]
//   },
//   {
//     weather: "Windy",
//     image: "/images/wind.png",
//     feel: "Strong wind",
//     info: "Wind blows fast.",
//     clothes: [
//       { name: "Jacket", emoji: "🧥", use: "Blocks cold wind" }
//     ]
//   },
//   {
//     weather: "Stormy",
//     image: "/images/storm.png",
//     feel: "Thunder and heavy rain",
//     info: "Lightning and thunder occur.",
//     clothes: [
//       { name: "Raincoat", emoji: "🧥", use: "Keeps you dry" },
//       { name: "Umbrella", emoji: "☂️", use: "Protects from rain" }
//     ]
//   },
//   {
//     weather: "Cold",
//     image: "/images/cold.png",
//     feel: "Very cold",
//     info: "You may shiver.",
//     clothes: [
//       { name: "Jacket", emoji: "🧥", use: "Keeps warm" },
//       { name: "Gloves", emoji: "🧤", use: "Protects hands" },
//       { name: "Sweater", emoji: "🧶", use: "Keeps body warm" }
//     ]
//   }
// ];

// /* 🎮 GAME DATA */
// const weatherGameData = [
//   {
//     weather: "Sunny",
//     image: "/images/sunny.png",
//     correctIndex: 0,
//     options: ["/images/cap.png", "/images/jacket.png", "/images/umbrella.png", "/images/gloves.png"]
//   },
//   {
//     weather: "Rainy",
//     image: "/images/rain.png",
//     correctIndex: 2,
//     options: ["/images/cap.png", "/images/shoes.png", "/images/umbrella.png", "/images/tshirt.png"]
//   },
//   {
//     weather: "Snowy",
//     image: "/images/snow.png",
//     correctIndex: 3,
//     options: ["/images/tshirt.png", "/images/cap.png", "/images/slippers.png", "/images/jacket.png"]
//   },
//   {
//     weather: "Windy",
//     image: "/images/wind.png",
//     correctIndex: 0,
//     options: ["/images/jacket.png", "/images/umbrella.png", "/images/tshirt.png", "/images/slippers.png"]
//   }
// ];

// export default function WeatherGame({ goBack }) {

//   const [mode, setMode] = useState("learn");
//   const [learnIndex, setLearnIndex] = useState(0);

//   const [gameIndex, setGameIndex] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [feedback, setFeedback] = useState("");
//   const [score, setScore] = useState(0);

//   /* 🔊 VOICE FUNCTION */
//   const speak = (text) => {
//     const utter = new SpeechSynthesisUtterance(text);
//     utter.rate = 0.8;
//     speechSynthesis.cancel();
//     speechSynthesis.speak(utter);
//   };

//   /* 🔊 AUTO SPEAK */
//   useEffect(() => {
//     if (mode === "learn") {
//       const current = weatherLearnData[learnIndex];

//       let text = `${current.weather}. ${current.feel}. ${current.info}. `;
//       current.clothes.forEach(c => {
//         text += `${c.name}. ${c.use}. `;
//       });

//       speak(text);
//     }
//   }, [learnIndex, mode]);

//   /* 📘 LEARNING MODE */
//   if (mode === "learn") {
//     const current = weatherLearnData[learnIndex];

//     return (
//       <div className="soundtap-container">
//         <button className="back-btn" onClick={goBack}>⬅ Back</button>

//         <h1 className="soundtap-title">Learn Weather 🌦️</h1>

//         <div className="soundtap-card">
//           <img src={current.image} alt={current.weather} />

//           <div className="soundtap-word">{current.weather}</div>

//           <div style={{ marginTop: "10px" }}>
//             🌡️ {current.feel}
//           </div>

//           <div style={{ marginTop: "10px", color: "#555" }}>
//             {current.info}
//           </div>

//           {/* 👕 Clothes */}
//           <div style={{ marginTop: "10px" }}>
//             {current.clothes.map((c, i) => (
//               <div key={i} style={{ marginBottom: "6px" }}>
//                 {c.emoji} <b>{c.name}</b> → {c.use}
//               </div>
//             ))}
//           </div>

//           <button
//             className="audio-btn"
//             onClick={() => {
//               let text = `${current.weather}. ${current.feel}. ${current.info}. `;
//               current.clothes.forEach(c => {
//                 text += `${c.name}. ${c.use}. `;
//               });
//               speak(text);
//             }}
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
//                 setLearnIndex(i => Math.min(i + 1, weatherLearnData.length - 1))
//               }
//             >
//               Next ➡
//             </button>
//           </div>

//           {learnIndex === weatherLearnData.length - 1 && (
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
//   const current = weatherGameData[gameIndex];

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

//     if (gameIndex < weatherGameData.length - 1) {
//       setGameIndex(prev => prev + 1);
//     } else {
//       setFeedback(`Game Over! Score: ${score}/${weatherGameData.length}`);
//     }
//   };

//   return (
//     <div className="soundtap-container">
//       <button className="back-btn" onClick={goBack}>⬅ Back</button>

//       <h1 className="soundtap-title">Weather Game 🌦️👕</h1>

//       <div className="soundtap-card">
//         <img src={current.image} alt={current.weather} class="weather-img" />

//         <div className="soundtap-word">{current.weather}</div>

//         <div className="circle-container">
//           {current.options.map((img, i) => (
//             <div
//               key={i}
//               className={`circle ${selected === i ? "selected" : ""}`}
//               onClick={() => handleSelect(i)}
//             >
//               <img src={img} alt="option" className="option-img" />
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

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "weather-clothes";

const weatherLearnData = [
  {
    weather: "Sunny",
    image: "/images/sunny.png",
    feel: "It is hot and bright",
    info: "The sun shines strongly.",
    clothes: [
      {
        name: "Cap",
        emoji: "🧢",
        use: "Protects your head from sun",
      },
      {
        name: "Sunglasses",
        emoji: "😎",
        use: "Protects your eyes",
      },
      {
        name: "T-shirt",
        emoji: "👕",
        use: "Keeps you cool",
      },
    ],
  },
  {
    weather: "Rainy",
    image: "/images/rain.png",
    feel: "It is wet",
    info: "Rain falls from the sky.",
    clothes: [
      {
        name: "Umbrella",
        emoji: "☂️",
        use: "Keeps you dry",
      },
      {
        name: "Raincoat",
        emoji: "🧥",
        use: "Protects from rain",
      },
      {
        name: "Boots",
        emoji: "👢",
        use: "Keeps feet dry",
      },
    ],
  },
  {
    weather: "Snowy",
    image: "/images/snow.png",
    feel: "Very cold",
    info: "Snow covers everything.",
    clothes: [
      {
        name: "Jacket",
        emoji: "🧥",
        use: "Keeps body warm",
      },
      {
        name: "Gloves",
        emoji: "🧤",
        use: "Keeps hands warm",
      },
      {
        name: "Scarf",
        emoji: "🧣",
        use: "Protects neck",
      },
    ],
  },
  {
    weather: "Windy",
    image: "/images/wind.png",
    feel: "Strong wind",
    info: "Wind blows fast.",
    clothes: [
      {
        name: "Jacket",
        emoji: "🧥",
        use: "Blocks cold wind",
      },
    ],
  },
  {
    weather: "Stormy",
    image: "/images/storm.png",
    feel: "Thunder and heavy rain",
    info: "Lightning and thunder occur.",
    clothes: [
      {
        name: "Raincoat",
        emoji: "🧥",
        use: "Keeps you dry",
      },
      {
        name: "Umbrella",
        emoji: "☂️",
        use: "Protects from rain",
      },
    ],
  },
  {
    weather: "Cold",
    image: "/images/cold.png",
    feel: "Very cold",
    info: "You may shiver.",
    clothes: [
      {
        name: "Jacket",
        emoji: "🧥",
        use: "Keeps warm",
      },
      {
        name: "Gloves",
        emoji: "🧤",
        use: "Protects hands",
      },
      {
        name: "Sweater",
        emoji: "🧶",
        use: "Keeps body warm",
      },
    ],
  },
];

const weatherGameData = [
  {
    weather: "Sunny",
    image: "/images/sunny.png",
    correctIndex: 0,
    options: [
      "/images/cap.png",
      "/images/jacket.png",
      "/images/umbrella.png",
      "/images/gloves.png",
    ],
  },
  {
    weather: "Rainy",
    image: "/images/rain.png",
    correctIndex: 2,
    options: [
      "/images/cap.png",
      "/images/shoes.png",
      "/images/umbrella.png",
      "/images/tshirt.png",
    ],
  },
  {
    weather: "Snowy",
    image: "/images/snow.png",
    correctIndex: 3,
    options: [
      "/images/tshirt.png",
      "/images/cap.png",
      "/images/slippers.png",
      "/images/jacket.png",
    ],
  },
  {
    weather: "Windy",
    image: "/images/wind.png",
    correctIndex: 0,
    options: [
      "/images/jacket.png",
      "/images/umbrella.png",
      "/images/tshirt.png",
      "/images/slippers.png",
    ],
  },
];

export default function WeatherGame({ goBack }) {
  // =====================================================
  // GAME PROGRESS
  // =====================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =====================================================
  // STATES
  // =====================================================

  const [mode, setMode] = useState("learn");

  const [learnIndex, setLearnIndex] =
    useState(0);

  const [gameIndex, setGameIndex] =
    useState(0);

  const [selected, setSelected] =
    useState(null);

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  // =====================================================
  // 🔊 VOICE
  // =====================================================

  const speak = (text) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    const utter =
      new SpeechSynthesisUtterance(text);

    utter.rate = 0.8;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // =====================================================
  // RESTORE PROGRESS
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🌦️ Weather Game saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.mode
    ) {
      console.log(
        "✅ Resuming Weather Game"
      );

      setMode(
        savedState.mode
      );

      setLearnIndex(
        savedState.learnIndex || 0
      );

      setGameIndex(
        savedState.gameIndex || 0
      );

      setSelected(
        savedState.selected ??
          null
      );

      setFeedback(
        savedState.feedback || ""
      );

      setScore(
        savedState.score || 0
      );

      setGameOver(
        savedState.gameOver || false
      );

      setLocked(false);

      return;
    }

    console.log(
      "🆕 Starting Weather Game"
    );

    setMode("learn");
    setLearnIndex(0);
    setGameIndex(0);
    setSelected(null);
    setFeedback("");
    setScore(0);
    setGameOver(false);
    setLocked(false);

    save({
      mode: "learn",
      learnIndex: 0,
      gameIndex: 0,
      selected: null,
      feedback: "",
      score: 0,
      gameOver: false,
    });
  }, [progressLoading, GAME_ID]);

  // =====================================================
  // 🔊 AUTO SPEAK LEARNING
  // =====================================================

  useEffect(() => {
    if (
      progressLoading ||
      mode !== "learn"
    ) {
      return;
    }

    const current =
      weatherLearnData[learnIndex];

    if (!current) return;

    let text =
      `${current.weather}. ` +
      `${current.feel}. ` +
      `${current.info}. `;

    current.clothes.forEach(
      (clothing) => {
        text +=
          `${clothing.name}. ` +
          `${clothing.use}. `;
      }
    );

    speak(text);

    return () => {
      if (
        typeof window !==
          "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, [
    learnIndex,
    mode,
    progressLoading,
  ]);

  // =====================================================
  // 📘 LEARNING MODE
  // =====================================================

  if (mode === "learn") {
    const current =
      weatherLearnData[learnIndex];

    const goPrevious =
      async () => {
        const nextIndex =
          Math.max(
            learnIndex - 1,
            0
          );

        setLearnIndex(
          nextIndex
        );

        await save({
          mode: "learn",
          learnIndex: nextIndex,
          gameIndex,
          selected: null,
          feedback: "",
          score,
          gameOver: false,
        });
      };

    const goNext =
      async () => {
        const nextIndex =
          Math.min(
            learnIndex + 1,
            weatherLearnData.length -
              1
          );

        setLearnIndex(
          nextIndex
        );

        await save({
          mode: "learn",
          learnIndex: nextIndex,
          gameIndex,
          selected: null,
          feedback: "",
          score,
          gameOver: false,
        });
      };

    const startGame =
      async () => {
        if (
          typeof window !==
            "undefined" &&
          window.speechSynthesis
        ) {
          window.speechSynthesis.cancel();
        }

        setMode("game");
        setGameIndex(0);
        setSelected(null);
        setFeedback("");
        setScore(0);
        setGameOver(false);
        setLocked(false);

        await save({
          mode: "game",
          learnIndex,
          gameIndex: 0,
          selected: null,
          feedback: "",
          score: 0,
          gameOver: false,
        });
      };

    return (
      <div className="soundtap-container">

        <button
          className="back-btn"
          onClick={goBack}
        >
          ⬅ Back
        </button>

        <h1 className="soundtap-title">
          Learn Weather 🌦️
        </h1>

        <div className="soundtap-card">

          <img
            src={current.image}
            alt={current.weather}
          />

          <div className="soundtap-word">
            {current.weather}
          </div>

          <div
            style={{
              marginTop: "10px",
            }}
          >
            🌡️ {current.feel}
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "#555",
            }}
          >
            {current.info}
          </div>

          {/* CLOTHES */}

          <div
            style={{
              marginTop: "10px",
            }}
          >
            {current.clothes.map(
              (clothing, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom:
                      "6px",
                  }}
                >
                  {clothing.emoji}{" "}
                  <b>
                    {clothing.name}
                  </b>{" "}
                  →{" "}
                  {clothing.use}
                </div>
              )
            )}
          </div>

          {/* HEAR */}

          <button
            className="audio-btn"
            onClick={() => {
              let text =
                `${current.weather}. ` +
                `${current.feel}. ` +
                `${current.info}. `;

              current.clothes.forEach(
                (clothing) => {
                  text +=
                    `${clothing.name}. ` +
                    `${clothing.use}. `;
                }
              );

              speak(text);
            }}
          >
            🔊 Hear
          </button>

          {/* NAVIGATION */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <button
              className="next-btn"
              onClick={
                goPrevious
              }
              disabled={
                learnIndex === 0
              }
            >
              ⬅ Prev
            </button>

            <button
              className="next-btn"
              onClick={
                goNext
              }
              disabled={
                learnIndex ===
                weatherLearnData.length -
                  1
              }
            >
              Next ➡
            </button>
          </div>

          {/* START GAME */}

          {learnIndex ===
            weatherLearnData.length -
              1 && (
            <button
              className="next-btn"
              style={{
                marginTop: "15px",
              }}
              onClick={
                startGame
              }
            >
              🎮 Start Game
            </button>
          )}

        </div>
      </div>
    );
  }

  // =====================================================
  // COMPLETION SCREEN
  // =====================================================

  if (gameOver) {
    const percentage =
      (score /
        weatherGameData.length) *
      100;

    return (
      <div className="soundtap-container">

        <button
          className="back-btn"
          onClick={goBack}
        >
          ⬅ Back
        </button>

        <h1 className="soundtap-title">
          Weather Game 🌦️👕
        </h1>

        <div className="soundtap-card">

          <h2>
            🏆 Game Complete!
          </h2>

          <div className="soundtap-word">
            {score}/
            {weatherGameData.length}
          </div>

          <p>
            Accuracy:{" "}
            {percentage.toFixed(
              0
            )}
            %
          </p>

          {percentage === 100 ? (
            <p>
              🌟 Perfect! Amazing!
            </p>
          ) : percentage >= 50 ? (
            <p>
              👍 Good job!
            </p>
          ) : (
            <p>
              💛 Keep practicing!
            </p>
          )}

          <button
            className="next-btn"
            onClick={async () => {
              setMode("game");
              setGameIndex(0);
              setSelected(null);
              setFeedback("");
              setScore(0);
              setGameOver(false);
              setLocked(false);

              const first =
                weatherGameData[0];

              await save({
                mode: "game",
                learnIndex,
                gameIndex: 0,
                selected: null,
                feedback: "",
                score: 0,
                gameOver: false,
                currentWeather:
                  first.weather,
              });
            }}
          >
            🔄 Play Again
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // 🎮 GAME MODE
  // =====================================================

  const current =
    weatherGameData[gameIndex];

  const handleSelect =
    async (index) => {
      if (
        locked ||
        selected !== null
      ) {
        return;
      }

      setLocked(true);
      setSelected(index);

      const isCorrect =
        index ===
        current.correctIndex;

      const updatedScore =
        score +
        (isCorrect ? 1 : 0);

      const feedbackText =
        isCorrect
          ? "Correct! 🎉"
          : "Oops! Try again 💛";

      setFeedback(
        feedbackText
      );

      setScore(
        updatedScore
      );

      await save({
        mode: "game",
        learnIndex,
        gameIndex,
        selected: index,
        feedback:
          feedbackText,
        score:
          updatedScore,
        gameOver: false,
      });
    };

  const next =
    async () => {
      if (selected === null) {
        return;
      }

      if (
        gameIndex <
        weatherGameData.length -
          1
      ) {
        const nextIndex =
          gameIndex + 1;

        setGameIndex(
          nextIndex
        );

        setSelected(null);
        setFeedback("");
        setLocked(false);

        await save({
          mode: "game",
          learnIndex,
          gameIndex:
            nextIndex,
          selected: null,
          feedback: "",
          score,
          gameOver: false,
        });

        return;
      }

      // =================================================
      // FINAL QUESTION
      // =================================================

      const percentage =
        (score /
          weatherGameData.length) *
        100;

      await save({
        mode: "game",
        learnIndex,
        gameIndex,
        selected,
        feedback,
        score,
        gameOver: true,
      });

      /*
       * 🔥 Global stars/history
       */
      await finish(
        percentage,
        "Weather Clothes"
      );

      setGameOver(true);
      setLocked(false);
    };

  // =====================================================
  // GAME UI
  // =====================================================

  return (
    <div className="soundtap-container">

      <button
        className="back-btn"
        onClick={goBack}
      >
        ⬅ Back
      </button>

      <h1 className="soundtap-title">
        Weather Game 🌦️👕
      </h1>

      <div className="soundtap-card">

        <img
          src={current.image}
          alt={current.weather}
          className="weather-img"
        />

        <div className="soundtap-word">
          {current.weather}
        </div>

        <div className="circle-container">

          {current.options.map(
            (img, index) => (
              <div
                key={index}
                className={`circle ${
                  selected === index
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleSelect(
                    index
                  )
                }
              >
                <img
                  src={img}
                  alt="option"
                  className="option-img"
                />
              </div>
            )
          )}

        </div>

        <div className="feedback">
          {feedback}
        </div>

        {selected !== null && (
          <button
            className="next-btn"
            onClick={next}
          >
            {gameIndex ===
            weatherGameData.length -
              1
              ? "🏁 Finish"
              : "Next ➡"}
          </button>
        )}

        <div
          style={{
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          Score: {score}
        </div>

      </div>
    </div>
  );
}