import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";
import "../styles/ConfusingLetters.css";

export default function ConfusingLetters({ goBack }) {

  const levelSets = {
    1: ["b", "d", "p", "q"],
    2: ["m", "n", "u", "v", "i", "j"],
    3: ["c", "k", "g", "j", "s", "z"],
  };

  const [level, setLevel] = useState(1);
  const [letters, setLetters] = useState(levelSets[1]);

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [totalScore, setTotalScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);

  const [message, setMessage] = useState("");
  const [previousTarget, setPreviousTarget] = useState("");

  const [showLevelUp, setShowLevelUp] = useState(false);

  const [mistakes, setMistakes] = useState({});

  useEffect(() => {
    initializeLevel(1);
  }, []);

  // 🔹 Initialize Level
  const initializeLevel = (lvl) => {
    const set = levelSets[lvl];
    setLetters(set);

    const resetMistakes = {};
    set.forEach(letter => {
      resetMistakes[letter] = 0;
    });

    setMistakes(resetMistakes);
    setLevelScore(0);

    generateQuestion(set, resetMistakes);
  };

  // 🔹 Balanced Adaptive Generator
  const generateQuestion = (letterSet = letters, mistakeData = mistakes) => {

    const mostDifficult = Object.keys(mistakeData).reduce((a, b) =>
      mistakeData[a] > mistakeData[b] ? a : b
    );

    let randomTarget;

    // 30% chance reinforce weak letter
    if (mistakeData[mostDifficult] >= 2 && Math.random() < 0.3) {
      randomTarget = mostDifficult;
    } else {
      do {
        randomTarget =
          letterSet[Math.floor(Math.random() * letterSet.length)];
      } while (randomTarget === previousTarget);
    }

    const shuffled = [...letterSet]
      .sort(() => 0.5 - Math.random())
      .concat([...letterSet].sort(() => 0.5 - Math.random()))
      .slice(0, 8);

    setTarget(randomTarget);
    setPreviousTarget(randomTarget);
    setOptions(shuffled);
    setMessage("");

    speak(`Find all the letter ${randomTarget}`);
  };

  // 🔹 Handle Click
  const handleClick = (letter) => {

    if (letter === target) {

      const newLevelScore = levelScore + 1;
      const newTotalScore = totalScore + 1;

      setLevelScore(newLevelScore);
      setTotalScore(newTotalScore);

      setMessage("🎉 Correct! Great focus!");
      speak("Great job!");

      // 🌟 Level Up Condition
      if (newLevelScore >= 5 && level < 3) {

        const nextLevel = level + 1;

        setShowLevelUp(true);
        speak("Level Up!");

        setTimeout(() => {
          setShowLevelUp(false);
          setLevel(nextLevel);
          initializeLevel(nextLevel);
        }, 2000);

        return;
      }

    } else {

      setMessage("💛 Try again carefully.");
      speak("Try again");

      setMistakes(prev => ({
        ...prev,
        [target]: prev[target] + 1
      }));
    }
  };

  // 🔹 Save AI Data for Parent Dashboard
  useEffect(() => {

    const mostDifficult = Object.entries(mistakes || {}).length
  ? Object.entries(mistakes).sort((a, b) => b[1] - a[1])[0][0]
  : "b";


    const aiData = {
      level,
      totalScore,
      mostDifficultLetter: mostDifficult,
    };

    localStorage.setItem("aiProgress", JSON.stringify(aiData));

  }, [level, totalScore, mistakes]);

  return (
    <div className="confusing-page">

      {/* 🌴 NAVBAR */}
      <div className="confusing-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🔁 Adaptive Letter Trainer
        </div>
      </div>

      <div className="confusing-content">

        {/* 🎉 LEVEL UP ANIMATION */}
        {showLevelUp && (
          <div className="level-up-banner">
            🎉 LEVEL UP! 🎉
          </div>
        )}

        <h3 className="level-indicator">
          🌟 Level {level}
        </h3>

        <h2 className="instruction">
          Click all the letter:
          <span className="target"> {target}</span>
        </h2>

        <div className="letters-grid">
          {options.map((letter, index) => (
            <div
              key={index}
              className="letter-box"
              onClick={() => handleClick(letter)}
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="feedback">{message}</div>

        <div className="score">
          ⭐ Level Score: {levelScore} / 5
        </div>

        <div className="score">
          🏆 Total Score: {totalScore}
        </div>

        <button
          className="next-btn"
          onClick={() => generateQuestion()}
        >
          Next Round 🔄
        </button>

      </div>
    </div>
  );
}
