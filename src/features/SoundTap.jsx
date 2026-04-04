import React, { useState, useEffect,useRef } from "react";
import "../styles/SoundTap.css";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const animalData = [
  { animal: "🐶 Dog", sound: "/sounds/dog.mp3" },
  { animal: "🐱 Cat", sound: "/sounds/cat.mp3" },
  { animal: "🐮 Cow", sound: "/sounds/cow.mp3" },
];

export default function SoundTapGame() {
  const [mode, setMode] = useState("level");
  const [level, setLevel] = useState("easy");

  const [index, setIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [analysis, setAnalysis] = useState("");

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const hasSaved = useRef(false); // 🔥 NEW
  const current = animalData[index];

  // ✅ SAVE PROGRESS
  const saveProgress = async () => {
    try {
      const email = localStorage.getItem("loginEmail");

      if (!email) return;

      await setDoc(
        doc(db, "users", email),
        {
          email,
          score,
          level,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      console.log("✅ Progress saved");
    } catch (err) {
      console.log("❌ SAVE ERROR:", err);
    }
  };

  useEffect(() => {
  if (mode === "result" && !hasSaved.current) {
    console.log("Result reached");
    saveProgress();
    hasSaved.current = true;
  }
}, [mode]);

  // 🤖 AI TEACH
  const teachAI = async () => {
    const res = await fetch("http://localhost:5000/ai/teach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: `${level} jungle animal sound counting`,
      }),
    });

    const data = await res.json();
    setAnalysis(data.explanation);
  };

  useEffect(() => {
    if (mode === "learn") teachAI();
  }, [mode]);

  // 🎧 PLAY SOUND
  const playSound = async () => {
    if (playing) return;

    let max = 4;
    if (level === "medium") max = 6;
    if (level === "hard") max = 8;

    const count = Math.floor(Math.random() * max) + 1;

    console.log("🎯 Correct Answer:", count);

    setCorrectAnswer(count);
    setPlaying(true);
    setSelected(null);
    setFeedback("");

    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => {
        const audio = new Audio(current.sound);
        audio.play();
        audio.onended = resolve;
      });

      await new Promise((r) => setTimeout(r, 300));
    }

    setPlaying(false);
  };

  // 🤖 ANALYZE
  const analyze = async (isCorrect) => {
    const res = await fetch("http://localhost:5000/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: { correct: isCorrect, level },
      }),
    });

    const data = await res.json();
    setAnalysis(data.analysis);
  };

  // 🎮 SELECT (🔥 FIXED)
  const handleSelect = async (num) => {
    // ❌ prevent clicking during sound
    if (playing) return;

    // ❌ must play sound first
    if (!correctAnswer) {
      setFeedback("⚠️ Play the sound first!");
      return;
    }

    // ❌ prevent double click
    if (selected !== null) return;

    setSelected(num);

    const isCorrect = num === correctAnswer;

    if (isCorrect) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`Oops! Correct answer is ${correctAnswer}`);
    }

    await analyze(isCorrect);
  };

  // 👉 NEXT
  const nextStep = () => {
    setSelected(null);
    setFeedback("");
    setCorrectAnswer(null);

    if (questionCount < 5) {
      setQuestionCount((q) => q + 1);
      setIndex((prev) => (prev + 1) % animalData.length);
    } else {
      setMode("result");
    }
  };

  // 👉 NEXT LEVEL
  const nextLevel = () => {
    if (level === "easy") setLevel("medium");
    else if (level === "medium") setLevel("hard");

    resetGame();
  };

  const resetGame = () => {
  hasSaved.current = false; // 🔥 ADD THIS

  setMode("learn");
  setScore(0);
  setQuestionCount(1);
  setRound((r) => r + 1);
};

  return (
    <div className="soundtap-container">

      {/* 🎯 LEVEL */}
      {mode === "level" && (
        <div className="soundtap-card">
          <h2>🌿 Choose Level</h2>

          <button onClick={() => { setLevel("easy"); setMode("learn"); }}>
            Easy 🌱
          </button>

          <button onClick={() => { setLevel("medium"); setMode("learn"); }}>
            Medium 🌿
          </button>

          <button onClick={() => { setLevel("hard"); setMode("learn"); }}>
            Hard 🔥
          </button>
        </div>
      )}

      {/* 📘 LEARN */}
      {mode === "learn" && (
        <div className="soundtap-card">
          <h2>🤖 AI Teacher ({level})</h2>
          <p>{analysis}</p>

          <button onClick={() => setMode("game")}>
            Start Game 🚀
          </button>
        </div>
      )}

      {/* 🎮 GAME */}
      {mode === "game" && (
        <div className="soundtap-card">
          <h2>🌿 Round {round} ({level})</h2>
          <p>Question {questionCount} / 5</p>

          <button onClick={playSound} disabled={playing}>
            {playing ? "Playing..." : "🔊 Play Sound"}
          </button>

          <div className="circle-container">
            {[1,2,3,4,5,6,7,8]
              .slice(0, level === "easy" ? 4 : level === "medium" ? 6 : 8)
              .map((num) => (
                <div
                  key={num}
                  className={`circle ${selected === num ? "selected" : ""}`}
                  onClick={() => handleSelect(num)}
                >
                  {num}
                </div>
              ))}
          </div>

          <div>{feedback}</div>

          {analysis && <div>🤖 {analysis}</div>}

          {selected !== null && (
            <button onClick={nextStep}>Next ➡</button>
          )}
        </div>
      )}

      {/* 📊 RESULT */}
      {mode === "result" && (
        <div className="soundtap-card">
          <h2>🎉 Round Complete</h2>
          <p>Score: {score} / 5</p>

          <p>
            {score >= 3
              ? "🌟 Great! Moving to next level"
              : "💡 Try again to improve"}
          </p>

          {score >= 3 && level !== "hard" && (
            <button onClick={nextLevel}>Next Level 🚀</button>
          )}

          {score < 3 && (
            <button onClick={resetGame}>Retry 🔁</button>
          )}

          {level === "hard" && score >= 3 && (
            <h3>🏆 You completed all levels!</h3>
          )}
        </div>
      )}
    </div>
  );
}