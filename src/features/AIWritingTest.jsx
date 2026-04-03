import { useState } from "react";
import "../styles/AIWritingTest.css";

// 🔥 Generate A → Z automatically
const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function AIWritingTest({ goBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentLetter = letters[currentIndex];

  const handleClear = () => {
    const canvas = document.getElementById("writingCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleNext = () => {
    handleClear();

    if (currentIndex === letters.length - 1) {
      alert("🎉 Completed all letters!");
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const startDrawing = (e) => {
    const canvas = document.getElementById("writingCanvas");
    const ctx = canvas.getContext("2d");

    let drawing = true;
    const rect = canvas.getBoundingClientRect();

    const getX = (event) =>
      event.touches ? event.touches[0].clientX - rect.left : event.offsetX;

    const getY = (event) =>
      event.touches ? event.touches[0].clientY - rect.top : event.offsetY;

    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1d3c34";

    const draw = (event) => {
      if (!drawing) return;
      event.preventDefault();
      ctx.lineTo(getX(event), getY(event));
      ctx.stroke();
    };

    const stop = () => {
      drawing = false;
      window.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", draw);
      window.removeEventListener("touchend", stop);
    };

    window.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener("touchend", stop);
  };

  return (
    <div className="ai-writing-page">
      <div className="ai-writing-header">
        <button className="ai-back-btn" onClick={goBack}>←</button>
        <h1>✏ AI Letter Writing Test</h1>
      </div>

      <div className="ai-writing-content">
        <h2 className="write-text">Write the letter:</h2>

        <div className="big-letter">{currentLetter}</div>

        <div className="writing-card">
          <div className="letter-guide">{currentLetter}</div>

          <canvas
            id="writingCanvas"
            width="400"
            height="400"
            className="writing-canvas"
            onMouseDown={startDrawing}
            onTouchStart={startDrawing}
          />
        </div>

        <div className="ai-writing-buttons">
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>

          <button className="next-btn" onClick={handleNext}>
            Next →
          </button>
        </div>

        {/* 🔥 Progress indicator */}
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>
          Letter {currentIndex + 1} / {letters.length}
        </p>
      </div>
    </div>
  );
}