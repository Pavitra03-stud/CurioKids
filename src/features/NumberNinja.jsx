import { useState, useEffect } from "react";
import "../styles/gameCommon.css";

export default function NumberNinja({ goBack }) {

  const randomNumber = () => Math.floor(Math.random() * 9) + 1;

  const [target, setTarget] = useState(randomNumber());
  const [numbers, setNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [sliceLine, setSliceLine] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // 🏆 high score from storage
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("ninjaHighScore")) || 0
  );

  // 🎯 falling numbers
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newNum = {
        value: randomNumber(),
        id: Date.now() + Math.random(),
        left: Math.random() * 80 + "%",
        sliced: false
      };

      setNumbers((prev) => [...prev, newNum]);

      setTimeout(() => {
        setNumbers((prev) =>
          prev.filter((n) => n.id !== newNum.id)
        );
      }, 4000);
    }, 900);

    return () => clearInterval(interval);
  }, [gameOver]);

  // 🔪 slice
  const handleSlice = (num, e) => {
    if (gameOver) return;

    setSliceLine({ x: e.clientX, y: e.clientY });
    setTimeout(() => setSliceLine(null), 150);

    setNumbers((prev) =>
      prev.map((n) =>
        n.id === num.id ? { ...n, sliced: true } : n
      )
    );

    if (num.value === target) {
      // ✅ correct
      const newScore = score + 1;
      setScore(newScore);

      // 🏆 update high score
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("ninjaHighScore", newScore);
      }

      setTarget(randomNumber());
    } else {
      // ❌ wrong → GAME OVER
      setGameOver(true);
    }

    setTimeout(() => {
      setNumbers((prev) =>
        prev.filter((n) => n.id !== num.id)
      );
    }, 300);
  };

  // 🔄 restart
  const restart = () => {
    setScore(0);
    setGameOver(false);
    setNumbers([]);
    setTarget(randomNumber());
  };

  return (
    <div className="game-page">

      {/* Header */}
      <div className="header">
        <button onClick={goBack}>⬅</button>
        <h1>Number Ninja 🔢</h1>
      </div>

      {/* Score */}
      <div className="score-board">
        <span>⭐ Score: {score}</span>
        <span>🏆 High: {highScore}</span>
        <span>🎯 Target: {target}</span>
      </div>

      {/* Game Area */}
      <div className="fall-area">
        {numbers.map((n) => (
          <div
            key={n.id}
            className="hitbox"
            style={{ left: n.left }}
            onClick={(e) => handleSlice(n, e)}
            onTouchStart={(e) => handleSlice(n, e)}
          >
            <div className="falling-number">
              {n.sliced ? (
                <>
                  <span className="half top">{n.value}</span>
                  <span className="half bottom">{n.value}</span>
                </>
              ) : (
                n.value
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✨ Slice line */}
      {sliceLine && (
        <div
          className="slice-line"
          style={{ left: sliceLine.x, top: sliceLine.y }}
        ></div>
      )}

      {/* 💀 GAME OVER SCREEN */}
      {gameOver && (
        <div className="game-over">
          <h2>Game Over 💀</h2>
          <p>Your Score: {score}</p>
          <p>High Score: {highScore}</p>

          <button className="next-btn" onClick={restart}>
            Play Again →
          </button>
        </div>
      )}
    </div>
  );
}