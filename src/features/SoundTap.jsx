import React, { useState, useRef } from "react";
import "../styles/SoundTap.css";

const animalData = [
  { animal: "Dog", image: "/images/dog.png", sound: "/sounds/dog.mp3", correctIndex: 0, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/cow.mp3","/sounds/lion.mp3"] },
  { animal: "Cat", image: "/images/cat.png", sound: "/sounds/cat.mp3", correctIndex: 1, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/duck.mp3","/sounds/lion.mp3"] },
  { animal: "Cow", image: "/images/cow.png", sound: "/sounds/cow.mp3", correctIndex: 2, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/cow.mp3","/sounds/horse.mp3"] },
  { animal: "Duck", image: "/images/duck.png", sound: "/sounds/duck.mp3", correctIndex: 3, options: ["/sounds/lion.mp3","/sounds/cat.mp3","/sounds/dog.mp3","/sounds/duck.mp3"] },
  { animal: "Lion", image: "/images/lion.png", sound: "/sounds/lion.mp3", correctIndex: 0, options: ["/sounds/lion.mp3","/sounds/dog.mp3","/sounds/cat.mp3","/sounds/cow.mp3"] },
  { animal: "Horse", image: "/images/horse.png", sound: "/sounds/horse.mp3", correctIndex: 1, options: ["/sounds/dog.mp3","/sounds/horse.mp3","/sounds/cat.mp3","/sounds/duck.mp3"] },
  { animal: "Sheep", image: "/images/sheep.png", sound: "/sounds/sheep.mp3", correctIndex: 2, options: ["/sounds/cow.mp3","/sounds/dog.mp3","/sounds/sheep.mp3","/sounds/cat.mp3"] },
  { animal: "Frog", image: "/images/frog.png", sound: "/sounds/frog.mp3", correctIndex: 3, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/lion.mp3","/sounds/frog.mp3"] },
  { animal: "Elephant", image: "/images/elephant.png", sound: "/sounds/elephant.mp3", correctIndex: 0, options: ["/sounds/elephant.mp3","/sounds/cat.mp3","/sounds/dog.mp3","/sounds/cow.mp3"] },
  { animal: "Pig", image: "/images/pig.png", sound: "/sounds/pig.mp3", correctIndex: 1, options: ["/sounds/cow.mp3","/sounds/pig.mp3","/sounds/dog.mp3","/sounds/cat.mp3"] },
  { animal: "Chicken", image: "/images/chicken.png", sound: "/sounds/chicken.mp3", correctIndex: 2, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/chicken.mp3","/sounds/lion.mp3"] },
  { animal: "Goat", image: "/images/goat.png", sound: "/sounds/goat.mp3", correctIndex: 3, options: ["/sounds/cow.mp3","/sounds/dog.mp3","/sounds/cat.mp3","/sounds/goat.mp3"] }
];

export default function SoundTapGame({ goBack }) {
  const [mode, setMode] = useState("learn");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [audio, setAudio] = useState(null);

  const startX = useRef(0);

  const current = animalData[index];

  // 🔊 Play sound
  const playSound = (path) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(path);
    newAudio.play().catch(() => {});
    setAudio(newAudio);
  };

  // 🔊 Speak animal
  const speakAnimal = () => {
    const utterance = new SpeechSynthesisUtterance(current.animal);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // 👉 Swipe handlers
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) nextLearn();        // swipe left
    if (diff < -50) prevLearn();       // swipe right
  };

  // 👉 Flashcard navigation
  const nextLearn = () => {
    if (index < animalData.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setIndex(0);
      setMode("game");
    }
  };

  const prevLearn = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
  };

  // 👉 Game logic
  const handleSelect = (i) => {
    setSelected(i);
    playSound(current.options[i]);

    if (i === current.correctIndex) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("Oops! 💛");
    }
  };

  const nextGame = () => {
    setSelected(null);
    setFeedback("");

    if (index < animalData.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setFeedback(`Game Over! Score: ${score}/${animalData.length}`);
    }
  };

  return (
    <div className="soundtap-container">
      <button className="back-btn" onClick={goBack}>⬅ Back</button>

      {/* 📘 FLASHCARDS WITH SWIPE */}
      {mode === "learn" && (
        <>
          <h1 className="soundtap-title">Learn Animals 🐾</h1>

          <div
            className="soundtap-card"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* 📊 Progress */}
            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
              {index + 1} / {animalData.length}
            </div>

            <img src={current.image} alt={current.animal} />

            <div className="soundtap-word">{current.animal}</div>

            <button className="audio-btn" onClick={() => playSound(current.sound)}>
              🔊 Hear Sound
            </button>

            <button className="next-btn" onClick={nextLearn}>
              {index === animalData.length - 1 ? "Start Game 🚀" : "Next ➡"}
            </button>
          </div>
        </>
      )}

      {/* 🎮 GAME */}
      {mode === "game" && (
        <>
          <h1 className="soundtap-title">Animal Sound Game 🎮</h1>

          <div className="soundtap-card">
            <div className="soundtap-word">{current.animal}</div>

            <button className="audio-btn" onClick={speakAnimal}>
              🔊 Hear Animal
            </button>

            <div className="circle-container">
              {current.options.map((sound, i) => (
                <div
                  key={i}
                  className={`circle ${selected === i ? "selected" : ""}`}
                  onMouseEnter={() => playSound(sound)}
                  onClick={() => handleSelect(i)}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="feedback">{feedback}</div>

            {selected !== null && (
              <button className="next-btn" onClick={nextGame}>
                Next ➡
              </button>
            )}

            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              Score: {score}
            </div>
          </div>
        </>
      )}
    </div>
  );
}