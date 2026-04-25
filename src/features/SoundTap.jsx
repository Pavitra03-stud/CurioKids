import React, { useState, useEffect } from "react";
import "../styles/SoundTap.css";

const animalData = [
  { animal: "Dog", image: "/images/dog.png", sound: "/sounds/dog.mp3", correctIndex: 0, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/cow.mp3","/sounds/lion.mp3"] },
  { animal: "Cat", image: "/images/cat.png", sound: "/sounds/cat.mp3", correctIndex: 1, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/duck.mp3","/sounds/lion.mp3"] },
  { animal: "Cow", image: "/images/cow.png", sound: "/sounds/cow.mp3", correctIndex: 2, options: ["/sounds/dog.mp3","/sounds/cat.mp3","/sounds/cow.mp3","/sounds/horse.mp3"] },
  { animal: "Duck", image: "/images/duck.png", sound: "/sounds/duck.mp3", correctIndex: 3, options: ["/sounds/lion.mp3","/sounds/cat.mp3","/sounds/dog.mp3","/sounds/duck.mp3"] },
  { animal: "Lion", image: "/images/lion.png", sound: "/sounds/lion.mp3", correctIndex: 0, options: ["/sounds/lion.mp3","/sounds/dog.mp3","/sounds/cat.mp3","/sounds/cow.mp3"] },
  { animal: "Horse", image: "/images/horse.png", sound: "/sounds/horse.mp3", correctIndex: 1, options: ["/sounds/dog.mp3","/sounds/horse.mp3","/sounds/cat.mp3","/sounds/duck.mp3"] }
];

export default function SoundTap() {

  const firstVisit = !localStorage.getItem("soundtapLearned");

  const [mode, setMode] = useState(firstVisit ? "learn" : "game");

  const [learnIndex, setLearnIndex] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const [aiMessage, setAiMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const currentLearn = animalData[learnIndex];
  const currentGame = animalData[gameIndex];

  // 🎤 SPEAK
  const speakAI = (text) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const playAnimalSound = (sound) => new Audio(sound).play();
  const playOptionSound = (sound) => new Audio(sound).play();

  // 🤖 AI TEACH
  const teachAI = async () => {
    if (loadingAI) return;

    const fallback = `This is a ${currentLearn.animal}. Listen carefully to its sound.`;

    setAiMessage(fallback);
    speakAI(fallback);

    try {
      setLoadingAI(true);

      const res = await fetch("http://localhost:5000/ai/teach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Teach a child about ${currentLearn.animal} sound`
        })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.explanation) {
        setAiMessage(data.explanation);
        speakAI(data.explanation);
      }

    } catch {
      console.log("Using fallback AI");
    } finally {
      setLoadingAI(false);
    }
  };

  // ✅ RUN AI ONLY WHEN CARD CHANGES (no flicker)
  useEffect(() => {
    if (mode === "learn") {
      teachAI();
    }
  }, [learnIndex]);

  // 🎯 GAME SELECT
  const handleSelect = (i) => {
    if (selected !== null) return;

    setSelected(i);

    if (i === currentGame.correctIndex) {
      const msg = "Correct. Great listening.";
      setFeedback("Correct! 🎉");
      setAiMessage(msg);
      speakAI(msg);
      setScore(prev => prev + 1);
    } else {
      const msg = "Not quite. Try again.";
      setFeedback("Oops! Try again 💛");
      setAiMessage(msg);
      speakAI(msg);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");

    if (gameIndex < animalData.length - 1) {
      setGameIndex(prev => prev + 1);
    } else {
      setMode("result");
    }
  };

  // 📘 LEARN MODE
  if (mode === "learn") {
    return (
      <div className="soundtap-container">

        <h1 className="soundtap-title">Learn Animal Sounds 🐾</h1>

        <div className="soundtap-card">

          <img src={currentLearn.image} alt={currentLearn.animal} />

          <div className="soundtap-word">{currentLearn.animal}</div>

          <button onClick={() => playAnimalSound(currentLearn.sound)}>
            🔊 Hear Me
          </button>

          <button onClick={teachAI}>
            {loadingAI ? "Thinking..." : "🤖 AI Teach"}
          </button>

          {aiMessage && (
            <div className="feedback">🤖 {aiMessage}</div>
          )}

          <button
            onClick={() => {
              if (learnIndex < animalData.length - 1) {
                setLearnIndex(prev => prev + 1);
                setAiMessage(""); // clear ONLY on manual next
              } else {
                localStorage.setItem("soundtapLearned", "true");
                setMode("game");
              }
            }}
          >
            {learnIndex < animalData.length - 1 ? "Next ➡" : "Start Game 🎮"}
          </button>

        </div>
      </div>
    );
  }

  // 🎉 RESULT
  if (mode === "result") {
    return (
      <div className="soundtap-container">
        <div className="soundtap-card">
          <h2>🎉 Game Complete</h2>
          <p>Score: {score}/{animalData.length}</p>

          <button
            onClick={() => {
              setGameIndex(0);
              setSelected(null);
              setScore(0);
              setMode("game");
            }}
          >
            Play Again 🔁
          </button>
        </div>
      </div>
    );
  }

  // 🎮 GAME MODE
  return (
    <div className="soundtap-container">

      <h1 className="soundtap-title">Match the Sound 🎧</h1>

      <div className="soundtap-card">

        <img src={currentGame.image} alt={currentGame.animal} />

        <div className="soundtap-word">{currentGame.animal}</div>

        <button onClick={() => playAnimalSound(currentGame.sound)}>
          🔊 Hear Me
        </button>

        <div className="circle-container">
          {[1,2,3,4].map((num,i)=>(
            <div
              key={i}
              className={`circle ${selected===i ? "selected" : ""}`}
              onMouseEnter={() => playOptionSound(currentGame.options[i])}
              onClick={() => handleSelect(i)}
            >
              Option {num}
            </div>
          ))}
        </div>

        <div className="feedback">{feedback}</div>

        {aiMessage && (
          <div className="feedback">🤖 {aiMessage}</div>
        )}

        {selected !== null && (
          <button onClick={nextQuestion}>
            Next ➡
          </button>
        )}

      </div>
    </div>
  );
}