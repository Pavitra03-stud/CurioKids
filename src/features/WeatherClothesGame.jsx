import React, { useState, useEffect } from "react";
import "../styles/gameCommon.css";

/* 🌦️ LEARNING DATA */
const weatherLearnData = [
  {
    weather: "Sunny",
    image: "/images/sunny.png",
    feel: "It is hot and bright",
    info: "The sun shines strongly.",
    clothes: [
      { name: "Cap", emoji: "🧢", use: "Protects your head from sun" },
      { name: "Sunglasses", emoji: "😎", use: "Protects your eyes" },
      { name: "T-shirt", emoji: "👕", use: "Keeps you cool" }
    ]
  },
  {
    weather: "Rainy",
    image: "/images/rain.png",
    feel: "It is wet",
    info: "Rain falls from the sky.",
    clothes: [
      { name: "Umbrella", emoji: "☂️", use: "Keeps you dry" },
      { name: "Raincoat", emoji: "🧥", use: "Protects from rain" },
      { name: "Boots", emoji: "👢", use: "Keeps feet dry" }
    ]
  },
  {
    weather: "Snowy",
    image: "/images/snow.png",
    feel: "Very cold",
    info: "Snow covers everything.",
    clothes: [
      { name: "Jacket", emoji: "🧥", use: "Keeps body warm" },
      { name: "Gloves", emoji: "🧤", use: "Keeps hands warm" },
      { name: "Scarf", emoji: "🧣", use: "Protects neck" }
    ]
  },
  {
    weather: "Windy",
    image: "/images/wind.png",
    feel: "Strong wind",
    info: "Wind blows fast.",
    clothes: [
      { name: "Jacket", emoji: "🧥", use: "Blocks cold wind" }
    ]
  },
  {
    weather: "Stormy",
    image: "/images/storm.png",
    feel: "Thunder and heavy rain",
    info: "Lightning and thunder occur.",
    clothes: [
      { name: "Raincoat", emoji: "🧥", use: "Keeps you dry" },
      { name: "Umbrella", emoji: "☂️", use: "Protects from rain" }
    ]
  },
  {
    weather: "Cold",
    image: "/images/cold.png",
    feel: "Very cold",
    info: "You may shiver.",
    clothes: [
      { name: "Jacket", emoji: "🧥", use: "Keeps warm" },
      { name: "Gloves", emoji: "🧤", use: "Protects hands" },
      { name: "Sweater", emoji: "🧶", use: "Keeps body warm" }
    ]
  }
];

/* 🎮 GAME DATA */
const weatherGameData = [
  {
    weather: "Sunny",
    image: "/images/sunny.png",
    correctIndex: 0,
    options: ["/images/cap.png", "/images/jacket.png", "/images/umbrella.png", "/images/gloves.png"]
  },
  {
    weather: "Rainy",
    image: "/images/rain.png",
    correctIndex: 2,
    options: ["/images/cap.png", "/images/shoes.png", "/images/umbrella.png", "/images/tshirt.png"]
  },
  {
    weather: "Snowy",
    image: "/images/snow.png",
    correctIndex: 3,
    options: ["/images/tshirt.png", "/images/cap.png", "/images/slippers.png", "/images/jacket.png"]
  },
  {
    weather: "Windy",
    image: "/images/wind.png",
    correctIndex: 0,
    options: ["/images/jacket.png", "/images/umbrella.png", "/images/tshirt.png", "/images/slippers.png"]
  }
];

export default function WeatherGame({ goBack }) {

  const [mode, setMode] = useState("learn");
  const [learnIndex, setLearnIndex] = useState(0);

  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  /* 🔊 VOICE FUNCTION */
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.8;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  /* 🔊 AUTO SPEAK */
  useEffect(() => {
    if (mode === "learn") {
      const current = weatherLearnData[learnIndex];

      let text = `${current.weather}. ${current.feel}. ${current.info}. `;
      current.clothes.forEach(c => {
        text += `${c.name}. ${c.use}. `;
      });

      speak(text);
    }
  }, [learnIndex, mode]);

  /* 📘 LEARNING MODE */
  if (mode === "learn") {
    const current = weatherLearnData[learnIndex];

    return (
      <div className="soundtap-container">
        <button className="back-btn" onClick={goBack}>⬅ Back</button>

        <h1 className="soundtap-title">Learn Weather 🌦️</h1>

        <div className="soundtap-card">
          <img src={current.image} alt={current.weather} />

          <div className="soundtap-word">{current.weather}</div>

          <div style={{ marginTop: "10px" }}>
            🌡️ {current.feel}
          </div>

          <div style={{ marginTop: "10px", color: "#555" }}>
            {current.info}
          </div>

          {/* 👕 Clothes */}
          <div style={{ marginTop: "10px" }}>
            {current.clothes.map((c, i) => (
              <div key={i} style={{ marginBottom: "6px" }}>
                {c.emoji} <b>{c.name}</b> → {c.use}
              </div>
            ))}
          </div>

          <button
            className="audio-btn"
            onClick={() => {
              let text = `${current.weather}. ${current.feel}. ${current.info}. `;
              current.clothes.forEach(c => {
                text += `${c.name}. ${c.use}. `;
              });
              speak(text);
            }}
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
                setLearnIndex(i => Math.min(i + 1, weatherLearnData.length - 1))
              }
            >
              Next ➡
            </button>
          </div>

          {learnIndex === weatherLearnData.length - 1 && (
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
  const current = weatherGameData[gameIndex];

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

    if (gameIndex < weatherGameData.length - 1) {
      setGameIndex(prev => prev + 1);
    } else {
      setFeedback(`Game Over! Score: ${score}/${weatherGameData.length}`);
    }
  };

  return (
    <div className="soundtap-container">
      <button className="back-btn" onClick={goBack}>⬅ Back</button>

      <h1 className="soundtap-title">Weather Game 🌦️👕</h1>

      <div className="soundtap-card">
        <img src={current.image} alt={current.weather} class="weather-img" />

        <div className="soundtap-word">{current.weather}</div>

        <div className="circle-container">
          {current.options.map((img, i) => (
            <div
              key={i}
              className={`circle ${selected === i ? "selected" : ""}`}
              onClick={() => handleSelect(i)}
            >
              <img src={img} alt="option" className="option-img" />
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