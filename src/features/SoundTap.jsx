import React, { useState, useEffect } from "react";
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

export default function SoundTap({ goBack }) {

  // FIRST-TIME LOGIC
  const firstVisit = !localStorage.getItem("soundtapLearned");

  const [mode, setMode] = useState(
    firstVisit ? "learn" : "game"
  );

  // LEARNING STATE
  const [learnIndex, setLearnIndex] = useState(0);

  // GAME STATE
  const [gameIndex, setGameIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  // AI
  const [aiMessage, setAiMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const currentLearn = animalData[learnIndex];
  const currentGame = animalData[gameIndex];

  // VOICE
  const speakAI = (text) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.85;
    utter.pitch = 1.1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const playAnimalSound = (sound) => {
    new Audio(sound).play();
  };

  const playOptionSound = (sound) => {
    new Audio(sound).play();
  };

  // AI TEACHER (works even if backend down)
  const teachAI = async () => {
    const fallback = `This is a ${currentLearn.animal}. Listen carefully to its sound. Try to remember how it sounds.`;

    setAiMessage(fallback);
    speakAI(fallback);

    try {
      setLoadingAI(true);

      const res = await fetch(
        "http://localhost:5000/ai/teach",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            topic: `Teach a child about ${currentLearn.animal} sound`
          })
        }
      );

      if (!res.ok) throw new Error("AI server unavailable");

      const data = await res.json();

      if (data.explanation) {
        setAiMessage(data.explanation);
        speakAI(data.explanation);
      }

    } catch (e) {
      console.log("Using fallback AI", e);
    } finally {
      setLoadingAI(false);
    }
  };

  // Auto teach on each learning card
  useEffect(() => {
    if (mode === "learn") {
      teachAI();
    }
  }, [learnIndex, mode]);

  // GAME HINT AI
  const getHint = async () => {
    const hint = "Listen to the animal again, then hover over each option and compare the sounds.";

    setAiMessage(hint);
    speakAI(hint);

    try {
      const res = await fetch(
        "http://localhost:5000/ai/teach",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            topic: `Give listening hint for ${currentGame.animal}`
          })
        }
      );

      if (!res.ok) throw new Error("Hint AI unavailable");

      const data = await res.json();

      if (data.explanation) {
        setAiMessage(data.explanation);
        speakAI(data.explanation);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const handleSelect = (i) => {
    if (selected !== null) return;

    setSelected(i);

    if (i === currentGame.correctIndex) {
      const msg = "Correct. Great listening.";
      setFeedback("Correct! 🎉");
      setAiMessage(msg);
      speakAI(msg);
      setScore(prev => prev + 1);
    }
    else {
      const msg = "Not quite. Compare the sounds again next time.";
      setFeedback("Oops! Try again 💛");
      setAiMessage(msg);
      speakAI(msg);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");
    setAiMessage("");

    if (gameIndex < animalData.length - 1) {
      setGameIndex(prev => prev + 1);
    }
    else {
      setMode("result");
    }
  };

  // ---------- LEARNING SCREEN ----------
  if (mode === "learn") {
    return (
      <div className="soundtap-container">

        <button className="back-btn" onClick={goBack}>
          ⬅ Back
        </button>

        <h1 className="soundtap-title">
          Learn Animal Sounds 🐾
        </h1>

        <div className="soundtap-card">

          <img
            src={currentLearn.image}
            alt={currentLearn.animal}
          />

          <div className="soundtap-word">
            {currentLearn.animal}
          </div>

          <button
            className="audio-btn"
            onClick={() => playAnimalSound(currentLearn.sound)}
          >
            🔊 Hear Me
          </button>

          <button
            className="audio-btn"
            onClick={teachAI}
          >
            {loadingAI ? "Thinking..." : "🤖 AI Teach"}
          </button>

          {aiMessage && (
            <div className="feedback">
              🤖 {aiMessage}
            </div>
          )}

          <button
            className="next-btn"
            onClick={() => {
              if (learnIndex < animalData.length - 1) {
                setLearnIndex(prev => prev + 1);
              }
              else {
                localStorage.setItem(
                  "soundtapLearned",
                  "true"
                );
                setMode("game");
              }
            }}
          >
            {
              learnIndex < animalData.length - 1
                ? "Next ➡"
                : "Start Game 🎮"
            }
          </button>

        </div>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (mode === "result") {
    return (
      <div className="soundtap-container">
        <div className="soundtap-card">

          <h2>🎉 Game Complete</h2>

          <p>
            Score: {score}/{animalData.length}
          </p>

          <button
            className="next-btn"
            onClick={() => {
              setGameIndex(0);
              setSelected(null);
              setScore(0);
              setFeedback("");
              setMode("game");
            }}
          >
            Play Again 🔁
          </button>

        </div>
      </div>
    );
  }

  // ---------- GAME ONLY ----------
  return (
    <div className="soundtap-container">

      <button className="back-btn" onClick={goBack}>
        ⬅ Back
      </button>

      <h1 className="soundtap-title">
        Match the Sound 🎧
      </h1>

      <div className="soundtap-card">

        {/* Enabled only after first-time learning completed */}
        {!firstVisit && (
          <button
            className="audio-btn"
            onClick={() => {
              setLearnIndex(0);
              setMode("learn");
            }}
          >
            📘 Learn Again
          </button>
        )}

        <img
          src={currentGame.image}
          alt={currentGame.animal}
        />

        <div className="soundtap-word">
          {currentGame.animal}
        </div>

        <button
          className="audio-btn"
          onClick={() => playAnimalSound(currentGame.sound)}
        >
          🔊 Hear Me
        </button>

        <button
          className="audio-btn"
          onClick={getHint}
        >
          🤖 Hint
        </button>

        <div className="circle-container">
          {[1,2,3,4].map((num,i)=>(
            <div
              key={i}
              className={`circle ${selected===i ? "selected" : ""}`}
              onMouseEnter={() =>
                playOptionSound(currentGame.options[i])
              }
              onClick={() => handleSelect(i)}
            >
              Option {num}
            </div>
          ))}
        </div>

        <div className="feedback">
          {feedback}
        </div>

        {aiMessage && (
          <div className="feedback">
            🤖 {aiMessage}
          </div>
        )}

        {selected !== null && (
          <button
            className="next-btn"
            onClick={nextQuestion}
          >
            Next ➡
          </button>
        )}

      </div>
    </div>
  );
}
