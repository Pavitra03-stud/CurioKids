import React, { useEffect, useState } from "react";
import "../styles/gameCommon.css";
import "../styles/WeatherClothesGame.css";

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
      { name: "Cap", emoji: "🧢", use: "Protects your head from sun" },
      { name: "Sunglasses", emoji: "😎", use: "Protects your eyes" },
      { name: "T-shirt", emoji: "👕", use: "Keeps you cool" },
    ],
  },
  {
    weather: "Rainy",
    image: "/images/rain.png",
    feel: "It is wet",
    info: "Rain falls from the sky.",
    clothes: [
      { name: "Umbrella", emoji: "☂️", use: "Keeps you dry" },
      { name: "Raincoat", emoji: "🧥", use: "Protects from rain" },
      { name: "Boots", emoji: "👢", use: "Keeps feet dry" },
    ],
  },
  {
    weather: "Snowy",
    image: "/images/snow.png",
    feel: "Very cold",
    info: "Snow covers everything.",
    clothes: [
      { name: "Jacket", emoji: "🧥", use: "Keeps body warm" },
      { name: "Gloves", emoji: "🧤", use: "Keeps hands warm" },
      { name: "Scarf", emoji: "🧣", use: "Protects neck" },
    ],
  },
  {
    weather: "Windy",
    image: "/images/wind.png",
    feel: "Strong wind",
    info: "Wind blows fast.",
    clothes: [
      { name: "Jacket", emoji: "🧥", use: "Blocks cold wind" },
    ],
  },
  {
    weather: "Stormy",
    image: "/images/storm.png",
    feel: "Thunder and heavy rain",
    info: "Lightning and thunder occur.",
    clothes: [
      { name: "Raincoat", emoji: "🧥", use: "Keeps you dry" },
      { name: "Umbrella", emoji: "☂️", use: "Protects from rain" },
    ],
  },
  {
    weather: "Cold",
    image: "/images/cold.png",
    feel: "Very cold",
    info: "You may shiver.",
    clothes: [
      { name: "Jacket", emoji: "🧥", use: "Keeps warm" },
      { name: "Gloves", emoji: "🧤", use: "Protects hands" },
      { name: "Sweater", emoji: "🧶", use: "Keeps body warm" },
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
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  const [mode, setMode] = useState("learn");
  const [learnIndex, setLearnIndex] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  const speak = (text) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.8;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (progressLoading) return;

    if (savedState && savedState.mode) {
      setMode(savedState.mode);
      setLearnIndex(savedState.learnIndex || 0);
      setGameIndex(savedState.gameIndex || 0);
      setSelected(savedState.selected ?? null);
      setFeedback(savedState.feedback || "");
      setScore(savedState.score || 0);
      setGameOver(savedState.gameOver || false);
      setLocked(false);
      return;
    }

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

  useEffect(() => {
    if (progressLoading || mode !== "learn") return;

    const current = weatherLearnData[learnIndex];

    if (!current) return;

    let text =
      `${current.weather}. ` +
      `${current.feel}. ` +
      `${current.info}. `;

    current.clothes.forEach((clothing) => {
      text += `${clothing.name}. ${clothing.use}. `;
    });

    speak(text);

    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, [learnIndex, mode, progressLoading]);

  /* =========================
     LEARNING MODE
  ========================= */

  if (mode === "learn") {
    const current = weatherLearnData[learnIndex];

    const goPrevious = async () => {
      const nextIndex = Math.max(learnIndex - 1, 0);

      setLearnIndex(nextIndex);

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

    const goNext = async () => {
      const nextIndex = Math.min(
        learnIndex + 1,
        weatherLearnData.length - 1
      );

      setLearnIndex(nextIndex);

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

    const startGame = async () => {
      if (
        typeof window !== "undefined" &&
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
      <div className="weather-page">
        <header className="weather-header">
         

          <div className="brand">
            <div className="brand-icon">🌴</div>
            <div>
              <strong>CurioKids</strong>
              <span>JUNGLE GAMES</span>
            </div>
          </div>

          <div className="header-pill">
            🌿 Weather Adventure
          </div>
        </header>

        <main className="weather-main">

          <div className="jungle-title">
            <span className="title-leaf">🌿</span>
            <div>
              <small>CURIOKIDS • JUNGLE ADVENTURE</small>
              <h1>Learn Weather 🌦️</h1>
            </div>
            <span className="title-leaf">🍃</span>
          </div>

          <div className="weather-learning-card">

            <div className="weather-card-top">
              <div className="weather-progress">
                WEATHER {learnIndex + 1}/{weatherLearnData.length}
              </div>

              <div className="weather-badge">
                🌿 Explore
              </div>
            </div>

            <div className="learning-content">

              <div className="weather-image-frame">
                <div className="leaf-corner leaf-one">🍃</div>
                <div className="leaf-corner leaf-two">🌿</div>

                <img
                  src={current.image}
                  alt={current.weather}
                />
              </div>

              <div className="learning-info">

                <div className="weather-label">
                  TODAY'S WEATHER
                </div>

                <h2>{current.weather}</h2>

                <div className="weather-feel">
                  🌡️ {current.feel}
                </div>

                <p className="weather-description">
                  {current.info}
                </p>

                <div className="clothes-box">
                  <div className="clothes-heading">
                    🧺 What should we wear?
                  </div>

                  {current.clothes.map((clothing, index) => (
                    <div
                      className="clothing-row"
                      key={index}
                    >
                      <span className="clothing-emoji">
                        {clothing.emoji}
                      </span>

                      <div>
                        <strong>{clothing.name}</strong>
                        <span>{clothing.use}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="hear-btn"
                  onClick={() => {
                    let text =
                      `${current.weather}. ` +
                      `${current.feel}. ` +
                      `${current.info}. `;

                    current.clothes.forEach((clothing) => {
                      text +=
                        `${clothing.name}. ` +
                        `${clothing.use}. `;
                    });

                    speak(text);
                  }}
                >
                  🔊 Hear Weather
                </button>
              </div>
            </div>

            <div className="learning-navigation">

              <button
                className="wood-btn secondary"
                onClick={goPrevious}
                disabled={learnIndex === 0}
              >
                ← Previous
              </button>

              <div className="page-dots">
                {weatherLearnData.map((_, index) => (
                  <span
                    key={index}
                    className={
                      index === learnIndex
                        ? "active"
                        : ""
                    }
                  />
                ))}
              </div>

              <button
                className="wood-btn"
                onClick={goNext}
                disabled={
                  learnIndex ===
                  weatherLearnData.length - 1
                }
              >
                Next →
              </button>
            </div>

            {learnIndex === weatherLearnData.length - 1 && (
              <button
                className="start-game-btn"
                onClick={startGame}
              >
                🎮 Start Weather Adventure
              </button>
            )}

          </div>

          <div className="jungle-tip">
            <span className="tip-icon">🦊</span>
            <div>
              <small>JUNGLE TIP</small>
              <strong>
                Every weather day is an adventure!
              </strong>
            </div>
            <span className="tip-leaves">🌿 ✨ 🍃</span>
          </div>

        </main>
      </div>
    );
  }

  /* =========================
     COMPLETION SCREEN
  ========================= */

  if (gameOver) {
    const percentage =
      (score / weatherGameData.length) * 100;

    return (
      <div className="weather-page">

        <header className="weather-header">
         

          <div className="brand">
            <div className="brand-icon">🌴</div>
            <div>
              <strong>CurioKids</strong>
              <span>JUNGLE GAMES</span>
            </div>
          </div>

          <div className="header-pill">
            ⭐ Adventure Complete
          </div>
        </header>

        <main className="weather-main completion-main">

          <div className="completion-card">

            <div className="completion-mascot">
              🦊
            </div>

            <div className="completion-tag">
              🌿 WEATHER ADVENTURE
            </div>

            <h1>Great Adventure! 🎉</h1>

            <p className="completion-subtitle">
              You explored the weather jungle!
            </p>

            <div className="score-board">
              <span>YOUR SCORE</span>

              <strong>
                {score}/{weatherGameData.length}
              </strong>

              <small>
                {percentage.toFixed(0)}% accuracy
              </small>
            </div>

            <div className="completion-message">
              {percentage === 100 ? (
                <>
                  🌟 Perfect!
                  <span>You know your weather!</span>
                </>
              ) : percentage >= 50 ? (
                <>
                  🌈 Great Job!
                  <span>You're learning fast!</span>
                </>
              ) : (
                <>
                  🌱 Keep Exploring!
                  <span>Every try makes you stronger!</span>
                </>
              )}
            </div>

            <button
              className="start-game-btn"
              onClick={async () => {
                setMode("game");
                setGameIndex(0);
                setSelected(null);
                setFeedback("");
                setScore(0);
                setGameOver(false);
                setLocked(false);

                const first = weatherGameData[0];

                await save({
                  mode: "game",
                  learnIndex,
                  gameIndex: 0,
                  selected: null,
                  feedback: "",
                  score: 0,
                  gameOver: false,
                  currentWeather: first.weather,
                });
              }}
            >
              🔄 Play Again
            </button>

          </div>

        </main>
      </div>
    );
  }

  /* =========================
     GAME MODE
  ========================= */

  const current = weatherGameData[gameIndex];

  const handleSelect = async (index) => {
    if (locked || selected !== null) {
      return;
    }

    setLocked(true);
    setSelected(index);

    const isCorrect =
      index === current.correctIndex;

    const updatedScore =
      score + (isCorrect ? 1 : 0);

    const feedbackText = isCorrect
      ? "Correct! 🎉"
      : "Oops! Try again 💛";

    setFeedback(feedbackText);
    setScore(updatedScore);

    await save({
      mode: "game",
      learnIndex,
      gameIndex,
      selected: index,
      feedback: feedbackText,
      score: updatedScore,
      gameOver: false,
    });
  };

  const next = async () => {
    if (selected === null) {
      return;
    }

    if (
      gameIndex <
      weatherGameData.length - 1
    ) {
      const nextIndex = gameIndex + 1;

      setGameIndex(nextIndex);
      setSelected(null);
      setFeedback("");
      setLocked(false);

      await save({
        mode: "game",
        learnIndex,
        gameIndex: nextIndex,
        selected: null,
        feedback: "",
        score,
        gameOver: false,
      });

      return;
    }

    const percentage =
      (score / weatherGameData.length) * 100;

    await save({
      mode: "game",
      learnIndex,
      gameIndex,
      selected,
      feedback,
      score,
      gameOver: true,
    });

    await finish(
      percentage,
      "Weather Clothes"
    );

    setGameOver(true);
    setLocked(false);
  };

  return (
    <div className="weather-page">

      <header className="weather-header">
       

        <div className="brand">
          <div className="brand-icon">🌴</div>
          <div>
            <strong>CurioKids</strong>
            <span>JUNGLE GAMES</span>
          </div>
        </div>

        <div className="header-pill">
          🌿 Weather Adventure
        </div>
      </header>

      <main className="weather-main game-main">

        <div className="game-heading">

          <div className="game-tag">
            🌿 JUNGLE WEATHER CHALLENGE
          </div>

          <h1>
            What should Foxy wear? 🦊
          </h1>

          <p>
            Look at the weather and choose the right clothing!
          </p>

        </div>

        <div className="game-card">

          <div className="game-topbar">

            <div className="round-counter">
              <span>ROUND</span>
              <strong>
                {gameIndex + 1}
              </strong>
              <small>
                / {weatherGameData.length}
              </small>
            </div>

            <div className="score-pill">
              ⭐ {score} Stars
            </div>

          </div>

          <div className="game-weather-area">

            <div className="game-image-frame">

              <span className="floating-leaf left">
                🍃
              </span>

              <img
                src={current.image}
                alt={current.weather}
                className="weather-game-image"
              />

              <span className="floating-leaf right">
                🌿
              </span>

            </div>

            <div className="game-weather-name">
              {current.weather}
            </div>

            <div className="game-question">
              🧺 Choose the right clothes!
            </div>

          </div>

          <div className="options-title">
            Pick one to help Foxy:
          </div>

          <div className="clothing-options">

            {current.options.map((img, index) => {

              const isSelected =
                selected === index;

              const isCorrect =
                index === current.correctIndex;

              let optionClass = "clothing-option";

              if (isSelected) {
                optionClass += " selected";

                if (isCorrect) {
                  optionClass += " correct";
                } else {
                  optionClass += " wrong";
                }
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleSelect(index)}
                  disabled={locked}
                >
                  <div className="option-number">
                    {index + 1}
                  </div>

                  <div className="option-image-box">
                    <img
                      src={img}
                      alt="clothing option"
                      className="option-img"
                    />
                  </div>

                  {isSelected && (
                    <span className="option-result">
                      {isCorrect ? "✓" : "×"}
                    </span>
                  )}
                </button>
              );
            })}

          </div>

          <div
            className={`game-feedback ${
              feedback
                ? feedback.startsWith("Correct")
                  ? "success"
                  : "error"
                : ""
            }`}
          >
            {feedback}
          </div>

          {selected !== null && (
            <button
              className="game-next-btn"
              onClick={next}
            >
              {gameIndex ===
              weatherGameData.length - 1
                ? "🏁 Finish Adventure"
                : "Next Challenge →"}
            </button>
          )}

          <div className="game-progress-bar">
            <div
              style={{
                width: `${
                  ((gameIndex + 1) /
                    weatherGameData.length) *
                  100
                }%`,
              }}
            />
          </div>

        </div>

        <div className="game-tip">
          🦊
          <span>
            Think carefully, choose wisely, and have fun!
          </span>
          🌿
        </div>

      </main>
    </div>
  );
}