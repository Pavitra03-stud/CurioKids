import { useRef, useState, useEffect } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/LetterTracing.css";

export default function LetterTracing({ goBack }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);

  /* ------------------ CANVAS SETUP ------------------ */
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1b4332";

    ctxRef.current = ctx;

    drawGuideLetter(uppercaseLetters[currentIndex]);
  }, []);

  /* ------------------ DRAW GUIDE LETTER ------------------ */
  const drawGuideLetter = (letter) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "250px Arial";
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = "#1b4332";
    ctx.lineWidth = 10;
  };

  /* Redraw guide when letter changes */
  useEffect(() => {
    if (ctxRef.current) {
      drawGuideLetter(uppercaseLetters[currentIndex]);
    }
  }, [currentIndex]);

  /* ------------------ DRAWING ------------------ */
  const startDrawing = (e) => {
    setDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const endDrawing = () => {
    setDrawing(false);
    ctxRef.current.beginPath();
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const clearCanvas = () => {
    drawGuideLetter(uppercaseLetters[currentIndex]);
    setHasDrawn(false);
  };

  /* ------------------ EVALUATION ------------------ */
  const evaluateDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let drawnPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        drawnPixels++;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    const coverage = drawnPixels / totalPixels;

    if (coverage >= 0.06) return "good";
    if (coverage >= 0.03) return "practice";
    return "wrong";
  };

  /* ------------------ NEXT BUTTON ------------------ */
  const handleNext = () => {
    if (!hasDrawn) {
      alert("Please write the letter before moving to next.");
      return;
    }

    const grade = evaluateDrawing();
    const currentLetter = uppercaseLetters[currentIndex];

    setResults((prev) => ({
      ...prev,
      [currentLetter]: grade,
    }));

    if (currentIndex === 25) {
      setShowResultCard(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setHasDrawn(false);
    }
  };

  /* ------------------ RESULT CARD ------------------ */
  if (showResultCard) {
    return (
      <div className="letter-page">
        <div className="letter-navbar">
          <div className="navbar-left">
            <BackIcon goBack={goBack} />
          </div>
          <div className="navbar-title">📊 Round Result</div>
        </div>

        <div className="result-card">
          <h2>Writing Test Result</h2>

          <div className="result-grid">
            {uppercaseLetters.map((letter) => {
              const grade = results[letter];

              return (
                <div key={letter} className={`result-box ${grade}`}>
                  {letter}
                </div>
              );
            })}
          </div>

          <div className="legend">
            <div><span className="good-dot"></span> Good</div>
            <div><span className="practice-dot"></span> Needs Practice</div>
            <div><span className="wrong-dot"></span> Wrong</div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------ MAIN SCREEN ------------------ */
  return (
    <div className="letter-page">
      <div className="letter-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          ✏ AI Letter Writing Test
        </div>
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