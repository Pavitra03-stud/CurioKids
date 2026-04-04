import { useRef, useState, useEffect } from "react";
import "../styles/LetterTracing.css";

export default function LetterTracing() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  /* ------------------ CANVAS SETUP ------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 300;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1b4332";

    ctxRef.current = ctx;

    drawGuideLetter(uppercaseLetters[currentIndex]);
  }, []);

  /* ------------------ GUIDE LETTER ------------------ */
  const drawGuideLetter = (letter) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "180px Arial";
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
  };

  useEffect(() => {
    if (ctxRef.current) {
      drawGuideLetter(uppercaseLetters[currentIndex]);
    }
  }, [currentIndex]);

  /* ------------------ DRAW ------------------ */
  const getPosition = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();

    if (event.touches) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setDrawing(true);
    setHasDrawn(true);
  };

  const endDrawing = (e) => {
    e.preventDefault();
    setDrawing(false);
    ctxRef.current.beginPath();
  };

  const draw = (e) => {
    if (!drawing) return;

    const { x, y } = getPosition(e);

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const clearCanvas = () => {
    drawGuideLetter(uppercaseLetters[currentIndex]);
    setHasDrawn(false);
  };

  /* ------------------ SMART AI EVALUATION ------------------ */
  const evaluateDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let drawnPixels = 0;
    let correctZonePixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      const isDrawn = r < 100 || g < 100 || b < 100;
      const isGuide = r > 100 && r < 200 && alpha > 0;

      if (isDrawn) {
        drawnPixels++;

        if (isGuide) {
          correctZonePixels++;
        }
      }
    }

    const coverage = (drawnPixels / (canvas.width * canvas.height)) * 100;
    const accuracy = (correctZonePixels / drawnPixels) * 100 || 0;

    console.log("Coverage:", coverage);
    console.log("Accuracy:", accuracy);

    if (coverage < 10) return "wrong";

    if (accuracy > 70 && coverage > 40) return "good";
    if (accuracy > 40) return "practice";
    return "wrong";
  };

  /* ------------------ FRIENDLY FEEDBACK ------------------ */
  const getFriendlyFeedback = (grade) => {
    if (grade === "good")
      return "🌟 Great job! You followed the letter very well!";

    if (grade === "practice")
      return "💛 Nice try! Follow the letter shape more carefully.";

    return "🧠 Let’s try again slowly. You can do it!";
  };

  /* ------------------ AI ANALYSIS ------------------ */
  const analyzeWithAI = async (resultData) => {
    try {
      const res = await fetch("http://localhost:5000/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: resultData }),
      });

      const data = await res.json();
      setAiAnalysis(data.analysis);
    } catch {
      setAiAnalysis("✨ Keep practicing! You're improving!");
    }
  };

  /* ------------------ NEXT ------------------ */
  const handleNext = () => {
    if (!hasDrawn) {
      alert("Write the letter first!");
      return;
    }

    const grade = evaluateDrawing();
    const letter = uppercaseLetters[currentIndex];

    const updatedResults = {
      ...results,
      [letter]: grade,
    };

    setResults(updatedResults);

    // 👇 immediate friendly feedback
    setAiAnalysis(getFriendlyFeedback(grade));

    if (currentIndex === 25) {
      setShowResultCard(true);
      analyzeWithAI(updatedResults);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setHasDrawn(false);
    }
  };

  /* ------------------ RESULT ------------------ */
  if (showResultCard) {
    return (
      <div className="letter-page">
        <div className="letter-navbar">
          <div className="navbar-title">📊 AI Result</div>
        </div>

        <div className="result-card">
          <h2>Writing Test Result</h2>

          <div className="result-grid">
            {uppercaseLetters.map((letter) => (
              <div key={letter} className={`result-box ${results[letter]}`}>
                {letter}
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "20px" }}>🤖 AI Feedback:</h3>
          <p>{aiAnalysis}</p>
        </div>
      </div>
    );
  }

  /* ------------------ MAIN ------------------ */
  return (
    <div className="letter-page">
      <div className="letter-navbar">
        <div className="navbar-title">✏ AI Letter Writing Test</div>
      </div>

      <div className="letter-content">
        <h2>Write the letter:</h2>

        <div className="big-letter">
          {uppercaseLetters[currentIndex]}
        </div>

        <canvas
          ref={canvasRef}
          className="writing-canvas"
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchMove={draw}
        />

        <div className="button-row">
          <button className="clear-btn" onClick={clearCanvas}>
            Clear
          </button>

          <button className="next-btn" onClick={handleNext}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}