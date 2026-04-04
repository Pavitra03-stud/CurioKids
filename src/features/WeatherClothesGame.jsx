import React, { useState } from "react";
import "../styles/gameCommon.css";

const weatherData = [
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
    weather: "Foggy",
    image: "/images/fog.png",
    correctIndex: 1,
    options: ["/images/tshirt.png", "/images/jacket.png", "/images/cap.png", "/images/slippers.png"]
  },
  {
    weather: "Windy",
    image: "/images/wind.png",
    correctIndex: 0,
    options: ["/images/jacket.png", "/images/umbrella.png", "/images/tshirt.png", "/images/slippers.png"]
  },
  {
    weather: "Cloudy",
    image: "/images/cloud.png",
    correctIndex: 2,
    options: ["/images/gloves.png", "/images/jacket.png", "/images/tshirt.png", "/images/umbrella.png"]
  },
  {
    weather: "Stormy",
    image: "/images/storm.png",
    correctIndex: 1,
    options: ["/images/tshirt.png", "/images/umbrella.png", "/images/cap.png", "/images/slippers.png"]
  },
  {
    weather: "Hot",
    image: "/images/hot.png",
    correctIndex: 2,
    options: ["/images/jacket.png", "/images/gloves.png", "/images/tshirt.png", "/images/umbrella.png"]
  },
  {
    weather: "Cold",
    image: "/images/cold.png",
    correctIndex: 0,
    options: ["/images/jacket.png", "/images/tshirt.png", "/images/cap.png", "/images/slippers.png"]
  }
];

export default function WeatherGame({ goBack }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const current = weatherData[index];

  const handleSelect = (i) => {
    setSelected(i);

    if (i === current.correctIndex) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("Oops! Try again 💛");
    }
  };

  const next = () => {
    setSelected(null);
    setFeedback("");

    if (index < weatherData.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setFeedback(`Game Over! Score: ${score}/${weatherData.length}`);
    }
  };

  return (
    <div className="soundtap-container">
      <button className="back-btn" onClick={goBack}>⬅ Back</button>

      <h1 className="soundtap-title">Weather & Clothes 🌦️👕</h1>

      <div className="soundtap-card">
        {/* 🌦️ Weather */}
        <img src={current.image} alt={current.weather} />

        <div className="soundtap-word">{current.weather}</div>

        {/* 👕 Options */}
        <div className="circle-container">
          {current.options.map((img, i) => (
            <div
              key={i}
              className={`circle ${selected === i ? "selected" : ""}`}
              onClick={() => handleSelect(i)}
            >
              <img
                src={img}
                alt="option"
                className="option-img"
                />
            </div>
          ))}
        </div>

        {/* 💬 Feedback */}
        <div className="feedback">{feedback}</div>

        {/* ➡ Next */}
        {selected !== null && (
          <button className="next-btn" onClick={next}>
            Next ➡
          </button>
        )}

        {/* 📊 Score */}
        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          Score: {score}
        </div>
      </div>
    </div>
  );
}