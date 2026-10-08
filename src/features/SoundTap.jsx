import React, { useState, useEffect, useRef } from "react";
import "../styles/SoundTap.css";

const animalData = [
  {
    animal: "Dog",
    image: "/images/dog.png",
    sound: "/sounds/dog.mp3",
    correctIndex: 0,
    options: [
      "/sounds/dog.mp3",
      "/sounds/cat.mp3",
      "/sounds/cow.mp3",
      "/sounds/lion.mp3",
    ],
  },
  {
    animal: "Cat",
    image: "/images/cat.png",
    sound: "/sounds/cat.mp3",
    correctIndex: 1,
    options: [
      "/sounds/dog.mp3",
      "/sounds/cat.mp3",
      "/sounds/duck.mp3",
      "/sounds/lion.mp3",
    ],
  },
  {
    animal: "Cow",
    image: "/images/cow.png",
    sound: "/sounds/cow.mp3",
    correctIndex: 2,
    options: [
      "/sounds/dog.mp3",
      "/sounds/cat.mp3",
      "/sounds/cow.mp3",
      "/sounds/horse.mp3",
    ],
  },
  {
    animal: "Duck",
    image: "/images/duck.png",
    sound: "/sounds/duck.mp3",
    correctIndex: 3,
    options: [
      "/sounds/lion.mp3",
      "/sounds/cat.mp3",
      "/sounds/dog.mp3",
      "/sounds/duck.mp3",
    ],
  },
  {
    animal: "Lion",
    image: "/images/lion.png",
    sound: "/sounds/lion.mp3",
    correctIndex: 0,
    options: [
      "/sounds/lion.mp3",
      "/sounds/dog.mp3",
      "/sounds/cat.mp3",
      "/sounds/cow.mp3",
    ],
  },
  {
    animal: "Horse",
    image: "/images/horse.png",
    sound: "/sounds/horse.mp3",
    correctIndex: 1,
    options: [
      "/sounds/dog.mp3",
      "/sounds/horse.mp3",
      "/sounds/cat.mp3",
      "/sounds/duck.mp3",
    ],
  },
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

  const audioRef = useRef(null);
  const autoNextTimer = useRef(null);

  const currentLearn = animalData[learnIndex];
  const currentGame = animalData[gameIndex];

  // =========================================================
  // STOP CURRENT AUDIO
  // =========================================================

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  // =========================================================
  // PLAY SOUND
  // Only ONE sound can play at a time.
  // =========================================================

  const playSound = (sound) => {
    stopAudio();

    try {
      const audio = new Audio(sound);

      audioRef.current = audio;

      audio.play().catch((error) => {
        console.error("Unable to play sound:", error);
      });

      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
      };
    } catch (error) {
      console.error("Unable to create audio:", error);
    }
  };

  // =========================================================
  // 🔊 SPEAK
  // =========================================================

  const speakAI = (text) => {
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  // =========================================================
  // 🤖 AI TEACH
  // =========================================================

  const teachAI = async () => {
    if (loadingAI) return;

    const fallback = `This is a ${currentLearn.animal}. Listen carefully to its sound.`;

    setAiMessage(fallback);
    speakAI(fallback);

    try {
      setLoadingAI(true);

      const res = await fetch(
        "http://localhost:5000/ai/teach",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: `Teach a child about ${currentLearn.animal} sound`,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("AI request failed");
      }

      const data = await res.json();

      if (data.explanation) {
        setAiMessage(data.explanation);
        speakAI(data.explanation);
      }
    } catch (error) {
      console.log("Using fallback AI");
    } finally {
      setLoadingAI(false);
    }
  };

  // =========================================================
  // AI WHEN LEARN CARD CHANGES
  // =========================================================

  useEffect(() => {
    if (mode === "learn") {
      teachAI();
    }
  }, [learnIndex, mode]);

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      stopAudio();

      if (autoNextTimer.current) {
        clearTimeout(autoNextTimer.current);
      }

      speechSynthesis.cancel();
    };
  }, []);

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const nextQuestion = () => {
    stopAudio();

    if (autoNextTimer.current) {
      clearTimeout(autoNextTimer.current);
      autoNextTimer.current = null;
    }

    setSelected(null);
    setFeedback("");
    setAiMessage("");

    if (gameIndex < animalData.length - 1) {
      setGameIndex((prev) => prev + 1);
    } else {
      setMode("result");
    }
  };

  // =========================================================
  // OPTION CLICK
  // =========================================================

  const handleSelect = (i) => {
    // Correct answer already selected
    if (selected !== null) return;

    // Play ONLY the clicked option.
    // No hover audio.
    playSound(currentGame.options[i]);

    if (i === currentGame.correctIndex) {
      const msg = "Correct. Great listening.";

      setSelected(i);
      setFeedback("Correct! 🎉");
      setAiMessage(msg);

      setScore((prev) => prev + 1);

      speakAI(msg);

      // Automatically move forward.
      autoNextTimer.current = setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      // Wrong answer does NOT lock the question.
      setFeedback("Oops! Try again 💛");

      setAiMessage("Not quite. Try again.");

      speakAI("Not quite. Try again.");
    }
  };

  // =========================================================
  // LEARN MODE
  // =========================================================

  if (mode === "learn") {
    return (
      <div className="soundtap-container">

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

          <div className="soundtap-actions">

            <button
              className="audio-btn"
              onClick={() =>
                playSound(currentLearn.sound)
              }
            >
              🔊 Hear Me
            </button>

            <button
              className="ai-btn"
              onClick={teachAI}
              disabled={loadingAI}
            >
              {loadingAI
                ? "Thinking..."
                : "🤖 AI Teach"}
            </button>

          </div>

          {aiMessage && (
            <div className="feedback ai-feedback">
              🤖 {aiMessage}
            </div>
          )}

          <button
            className="next-btn"
            onClick={() => {

              stopAudio();

              if (
                learnIndex <
                animalData.length - 1
              ) {
                setLearnIndex(
                  (prev) => prev + 1
                );

                setAiMessage("");
              } else {
                localStorage.setItem(
                  "soundtapLearned",
                  "true"
                );

                setAiMessage("");
                setMode("game");
              }

            }}
          >
            {learnIndex <
            animalData.length - 1
              ? "Next ➡"
              : "Start Game 🎮"}
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // RESULT
  // =========================================================

  if (mode === "result") {
    return (
      <div className="soundtap-container">

        <h1 className="soundtap-title">
          Match the Sound 🎧
        </h1>

        <div className="soundtap-card result-card">

          <div className="result-emoji">
            🎉
          </div>

          <h2 className="result-title">
            Game Complete!
          </h2>

          <p className="result-score">
            Score: {score}/{animalData.length}
          </p>

          <button
            className="next-btn"
            onClick={() => {

              stopAudio();

              setGameIndex(0);
              setSelected(null);
              setFeedback("");
              setAiMessage("");
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

  // =========================================================
  // GAME MODE
  // =========================================================

  return (
    <div className="soundtap-container">

      <h1 className="soundtap-title">
        Match the Sound 🎧
      </h1>

      <div className="soundtap-card">

        {/* ANIMAL IMAGE */}

        <img
          className="animal-image"
          src={currentGame.image}
          alt={currentGame.animal}
        />

        {/* ANIMAL NAME */}

        <div className="soundtap-word">
          {currentGame.animal}
        </div>

        {/* HEAR BUTTON */}

        <div className="soundtap-actions">

          <button
            className="audio-btn"
            onClick={() =>
              playSound(currentGame.sound)
            }
          >
            🔊 Hear Me
          </button>

        </div>

        {/* OPTIONS */}

        <div className="circle-container">

          {[1, 2, 3, 4].map(
            (num, i) => (
              <button
                key={i}
                type="button"
                className={`circle ${
                  selected === i
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleSelect(i)
                }
              >
                Option {num}
              </button>
            )
          )}

        </div>

        {/* FEEDBACK */}

        {feedback && (
          <div
            className={`feedback ${
              feedback.startsWith(
                "Correct"
              )
                ? "feedback-correct"
                : "feedback-wrong"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* AI MESSAGE */}

        {aiMessage && (
          <div className="feedback ai-feedback">
            🤖 {aiMessage}
          </div>
        )}

        {/* BACKUP NEXT BUTTON
            Correct answer normally advances automatically. */}

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