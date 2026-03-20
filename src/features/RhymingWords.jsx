import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/RhymingSound.css"; // reuse phonics styling

const rhymeBank = [
  { word: "Cat", rhyme: "Hat", emoji: "🐱" },
  { word: "Dog", rhyme: "Log", emoji: "🐶" },
  { word: "Sun", rhyme: "Fun", emoji: "☀️" },
  { word: "Ball", rhyme: "Tall", emoji: "⚽" },
  { word: "Fish", rhyme: "Dish", emoji: "🐟" },
  { word: "Book", rhyme: "Cook", emoji: "📘" },
  { word: "Car", rhyme: "Star", emoji: "🚗" }
];

export default function RhymingWords({ goBack }) {

  const getRandomPair = () =>
    rhymeBank[Math.floor(Math.random() * rhymeBank.length)];

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [levelComplete, setLevelComplete] = useState(false);

  const [currentPair, setCurrentPair] = useState(getRandomPair());

  const generateOptions = (correctRhyme) => {
    const wrong = rhymeBank
      .map(item => item.rhyme)
      .filter(word => word !== correctRhyme)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [correctRhyme, ...wrong].sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState(
    generateOptions(currentPair.rhyme)
  );

  const nextRound = () => {
    const newPair = getRandomPair();
    setCurrentPair(newPair);
    setOptions(generateOptions(newPair.rhyme));
    setFeedback("");
  };

  const handleClick = (selected) => {
    if (selected === currentPair.rhyme) {
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
        <h2>🎵 Rhyming Words</h2>
      </div>

      <div className="game-info">
        <span>Level: {level}</span>
        <span>Score: {score}</span>
        <span>Progress: {progress}/5</span>
      </div>

      <div className="word-display">
        <div className="emoji">{currentPair.emoji}</div>
        <h2>{currentPair.word}</h2>
      </div>

      <h3>Which word rhymes with:</h3>

      <div className="options-grid">
        {options.map((word, index) => (
          <button
            key={index}
            className="option-btn"
            onClick={() => handleClick(word)}
          >
            {word}
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