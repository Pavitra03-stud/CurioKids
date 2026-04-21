import React, { useState, useEffect } from "react";
import "../styles/gameCommon.css";

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
  }
];

/* 🎮 GAME DATA */
const animalGameData = [
  {
    animal: "Dog",
    image: "/images/dog.png",
    correctIndex: 0,
    options: ["House 🏠", "Nest 🪹", "Water 🌊", "Jungle 🌴"]
  },
  {
    animal: "Bird",
    image: "/images/bird.png",
    correctIndex: 1,
    options: ["Farm 🚜", "Nest 🪹", "Water 🌊", "House 🏠"]
  },
  {
    animal: "Fish",
    image: "/images/fish.png",
    correctIndex: 2,
    options: ["House 🏠", "Nest 🪹", "Water 🌊", "Farm 🚜"]
  },
  {
    animal: "Lion",
    image: "/images/lion.png",
    correctIndex: 3,
    options: ["House 🏠", "Farm 🚜", "Nest 🪹", "Jungle 🌴"]
  },
  {
    animal: "Cow",
    image: "/images/cow.png",
    correctIndex: 1,
    options: ["Water 🌊", "Farm 🚜", "Nest 🪹", "Jungle 🌴"]
  }
];

export default function AnimalHomesGame({ goBack }) {

  const [mode, setMode] = useState("learn");
  const [learnIndex, setLearnIndex] = useState(0);

  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  /* 🔊 VOICE */
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.8;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  /* 🔊 AUTO SPEAK */
  useEffect(() => {
    if (mode === "learn") {
      const current = animalLearnData[learnIndex];
      const text = `${current.animal}. Lives in ${current.home}. ${current.info}`;
      speak(text);
    }
  }, [learnIndex, mode]);

  /* 📘 LEARNING MODE */
  if (mode === "learn") {
    const current = animalLearnData[learnIndex];

    return (
      <div className="soundtap-container">
        <button className="back-btn" onClick={goBack}>⬅ Back</button>

        <h1 className="soundtap-title">Animal Homes 🐾</h1>

        <div className="soundtap-card">
          <img src={current.image} className="weather-img" alt={current.animal} />

          <div className="soundtap-word">{current.animal}</div>

          <div style={{ marginTop: "10px" }}>
            Lives in: {current.emoji} <b>{current.home}</b>
          </div>

          <div style={{ marginTop: "10px", color: "#555" }}>
            {current.info}
          </div>

          <button
            className="audio-btn"
            onClick={() =>
              speak(`${current.animal} lives in ${current.home}. ${current.info}`)
            }
          >
            🔊 Hear
          </button>

          <div style={{ marginTop: "20px" }}>
            <button
              className="next-btn"
              onClick={() => setLearnIndex(i => Math.max(i - 1, 0))}
            >
              ⬅ Prev
            </button>

            <button
              className="next-btn"
              onClick={() =>
                setLearnIndex(i => Math.min(i + 1, animalLearnData.length - 1))
              }
            >
              Next ➡
            </button>
          </div>

          {learnIndex === animalLearnData.length - 1 && (
            <button
              className="next-btn"
              style={{ marginTop: "15px" }}
              onClick={() => setMode("game")}
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

  const handleSelect = (i) => {
    setSelected(i);

    if (i === current.correctIndex) {
      setFeedback("Correct! 🎉");
      setScore(prev => prev + 1);
    } else {
      setFeedback("Oops! Try again 💛");
    }
  };

  const next = () => {
    setSelected(null);
    setFeedback("");

    if (gameIndex < animalGameData.length - 1) {
      setGameIndex(prev => prev + 1);
    } else {
      setFeedback(`Game Over! Score: ${score}/${animalGameData.length}`);
    }
  };

  return (
    <div className="soundtap-container">
      <button className="back-btn" onClick={goBack}>⬅ Back</button>

      <h1 className="soundtap-title">Where Do Animals Live? 🐾🏠</h1>

      <div className="soundtap-card">
        <img src={current.image} className="weather-img" alt={current.animal} />

        <div className="soundtap-word">{current.animal}</div>

        <div className="circle-container">
          {current.options.map((opt, i) => (
            <div
              key={i}
              className={`circle ${selected === i ? "selected" : ""}`}
              onClick={() => handleSelect(i)}
            >
              {opt}
            </div>
          ))}
        </div>

        <div className="feedback">{feedback}</div>

        {selected !== null && (
          <button className="next-btn" onClick={next}>
            Next ➡
          </button>
        )}

        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          Score: {score}
        </div>
      </div>
    </div>
  );
}