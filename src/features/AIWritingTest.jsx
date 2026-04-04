import { useState, useRef } from "react";
import "../styles/AIWritingTest.css";

// 🔥 Generate A → Z automatically
const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function AIWritingTest({ goBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [teaching, setTeaching] = useState("");
  const canvasRef = useRef(null);

  const currentLetter = letters[currentIndex];

  // 🧹 Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFeedback("");
  };

  // 👉 Next letter
  const handleNext = () => {
    handleClear();

    if (currentIndex === letters.length - 1) {
      alert("🎉 Completed all letters!");
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // ✏️ Drawing logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
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

  // 🤖 Teach letter
  const handleTeach = async () => {
    try {
      const res = await fetch("http://localhost:5000/ai/teach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: `How to write letter ${currentLetter}`,
        }),
      });

      const data = await res.json();
      setTeaching(data.explanation);
    } catch (err) {
      console.error(err);
      setTeaching("⚠️ AI not connected");
    }
  };

  // 📊 Analyze drawing
  const handleAnalyze = async () => {
    try {
      const canvas = canvasRef.current;

      // Convert drawing to image
      const imageData = canvas.toDataURL("image/png");

      const res = await fetch("http://localhost:5000/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          letter: currentLetter,
          drawing: imageData,
        }),
      });

      const data = await res.json();
      setFeedback(data.analysis);
    } catch (err) {
      console.error(err);
      setFeedback("⚠️ AI analysis failed");
    }
  };

  return (
    <div className="ai-writing-page">
      <div className="ai-writing-header">
        <button className="ai-back-btn" onClick={() => NavigateEvent(-1)}>
          ←
        </button>
        <h1>✏ AI Letter Writing Test</h1>
      </div>

      <div className="ai-writing-content">
        <h2 className="write-text">Write the letter:</h2>

        <div className="big-letter">{currentLetter}</div>

        <div className="writing-card">
          <div className="letter-guide">{currentLetter}</div>

          <canvas
            ref={canvasRef}
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

        {/* 🤖 AI Actions */}
        <div style={{ marginTop: "20px" }}>
          <button className="clear-btn" onClick={handleTeach}>
            📘 Teach Me
          </button>

          <button
            className="next-btn"
            onClick={handleAnalyze}
            style={{ marginLeft: "10px" }}
          >
            📊 Check My Writing
          </button>
        </div>

        {/* 📘 Teaching Output */}
        {teaching && (
          <div className="ai-output">
            <h3>📘 How to write:</h3>
            <p>{teaching}</p>
          </div>
        )}

        {/* 📊 Feedback */}
        {feedback && (
          <div className="ai-output">
            <h3>📊 Feedback:</h3>
            <p>{feedback}</p>
          </div>
        )}

        {/* 🔥 Progress */}
        <p style={{ marginTop: "15px", fontWeight: "bold" }}>
          Letter {currentIndex + 1} / {letters.length}
        </p>
      </div>
    </div>
  );
}