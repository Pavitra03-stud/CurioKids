import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/BeginningSounds.css"; // reuse phonics style

const wordBank = [
  { word: "Ball", sound: "B", emoji: "⚽" },
  { word: "Cat", sound: "C", emoji: "🐱" },
  { word: "Dog", sound: "D", emoji: "🐶" },
  { word: "Sun", sound: "S", emoji: "☀️" },
  { word: "Fish", sound: "F", emoji: "🐟" },
  { word: "Hat", sound: "H", emoji: "🎩" },
  { word: "Book", sound: "B", emoji: "📘" },
  { word: "Cup", sound: "C", emoji: "☕" }
];

export default function SoundMatching({ goBack }) {

  const getRandomSound = () => {
    const random = wordBank[Math.floor(Math.random() * wordBank.length)];
    return random.sound;
  };

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);

  const [currentSound, setCurrentSound] = useState(getRandomSound());

  const generateOptions = (sound) => {
    const correctWords = wordBank.filter(w => w.sound === sound);
    const correct = correctWords[Math.floor(Math.random() * correctWords.length)];

    const wrong = wordBank
      .filter(w => w.sound !== sound)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [correct, ...wrong].sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState(generateOptions(currentSound));

  const nextRound = () => {
    const newSound = getRandomSound();
    setCurrentSound(newSound);
    setOptions(generateOptions(newSound));
    setFeedback("");
  };

  const handleClick = (selectedWord) => {
    if (selectedWord.sound === currentSound) {
      setFeedback("correct");
      setScore(prev => prev + 10);
      setProgress(prev => prev + 1);

      setTimeout(() => {
        if (progress + 1 >= 5) {
          setLevelComplete(true);
        } else {
          nextRound();
        }
      }, 700);
    } else {
      setFeedback("wrong");
    }
  };

  const startNextLevel = () => {
    setLevel(prev => prev + 1);
    setProgress(0);
    setLevelComplete(false);
    nextRound();
  };

  if (levelComplete) {
    return (
      <div className="phonics-page">
        <div className="letter-navbar">
          <BackIcon goBack={goBack} />
          <h2>🎉 Level {level} Complete!</h2>
        </div>

        <div className="level-card">
          <h3>Your Score: {score}</h3>

          {level < 3 ? (
            <button className="next-level-btn" onClick={startNextLevel}>
              🚀 Start Level {level + 1}
            </button>
          ) : (
            <h2>🏆 You Finished All Levels!</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="phonics-page">
      <div className="letter-navbar">
        <BackIcon goBack={goBack} />
        <h2>🎧 Sound Matching</h2>
      </div>

      <div className="game-info">
        <span>Level: {level}</span>
        <span>Score: {score}</span>
        <span>Progress: {progress}/5</span>
      </div>

      <h3>Which word starts with:</h3>

      <div className="big-letter">
        / {currentSound} /
      </div>

      <div className="options-grid">
        {options.map((item, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleClick(item)}
          >
            {item.emoji} {item.word}
          </button>
        ))}
      </div>

      {feedback === "correct" && (
        <div className="feedback good">🎉 Correct!</div>
      )}

      {feedback === "wrong" && (
        <div className="feedback wrong">❌ Try Again</div>
      )}
    </div>
  );
}