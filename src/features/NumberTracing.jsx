import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/NumberTracing.css";
import numberTracingImage from "../assets/number_tracing.png";

export default function NumberTracing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { level } = useParams();

  const isLevelPage = location.pathname.startsWith(
    "/number-tracing/level/"
  );

  /* =====================================================
     LEVEL INFORMATION
  ===================================================== */

  const levels = [
    {
      id: 1,
      title: "Level 1",
      subtitle: "Learn 1 to 10",
      startNumber: 1,
      maxNumber: 10,
      className: "level-one",
    },
    {
      id: 2,
      title: "Level 2",
      subtitle: "Learn 11 to 50",
      startNumber: 11,
      maxNumber: 50,
      className: "level-two",
    },
    {
      id: 3,
      title: "Level 3",
      subtitle: "Learn 51 to 100",
      startNumber: 51,
      maxNumber: 100,
      className: "level-three",
    },
  ];

  const selectedLevel =
    levels.find((item) => item.id === Number(level)) || levels[0];

  /* =====================================================
     CURRENT NUMBER
  ===================================================== */

  const [currentNumber, setCurrentNumber] = useState(
    selectedLevel.startNumber
  );

  /* =====================================================
     CANVAS
  ===================================================== */

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  /* =====================================================
     RESET WHEN RETURNING TO HOME
  ===================================================== */

  useEffect(() => {
    if (!isLevelPage) {
      setCurrentNumber(1);
    }
  }, [location.pathname, isLevelPage]);

  /* =====================================================
     CLEAR CANVAS WHEN NUMBER CHANGES
  ===================================================== */

  useEffect(() => {
    if (isLevelPage) {
      clearCanvas();
    }
  }, [currentNumber, isLevelPage]);

  /* =====================================================
     CANVAS HELPERS
  ===================================================== */

  const getCanvasPosition = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x:
        (event.clientX - rect.left) *
        (canvas.width / rect.width),

      y:
        (event.clientY - rect.top) *
        (canvas.height / rect.height),
    };
  };

  const startDrawing = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    isDrawing.current = true;

    const ctx = canvas.getContext("2d");

    const { x, y } = getCanvasPosition(event);

    ctx.beginPath();
    ctx.moveTo(x, y);

    canvas.setPointerCapture(event.pointerId);
  };

  const draw = (event) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const { x, y } = getCanvasPosition(event);

    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#3c9b55";

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };


  const clearCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };


  /* =====================================================
     SPEAK NUMBER
  ===================================================== */

  const speakNumber = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(
        numberToWord(currentNumber)
      );

      speech.rate = 0.8;
      speech.pitch = 1.1;

      window.speechSynthesis.speak(speech);
    }
  };

  /* =====================================================
     NUMBER TO WORD
  ===================================================== */

  const numberToWord = (number) => {
    const words = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
      "Twenty",
      "Twenty One",
      "Twenty Two",
      "Twenty Three",
      "Twenty Four",
      "Twenty Five",
      "Twenty Six",
      "Twenty Seven",
      "Twenty Eight",
      "Twenty Nine",
      "Thirty",
      "Thirty One",
      "Thirty Two",
      "Thirty Three",
      "Thirty Four",
      "Thirty Five",
      "Thirty Six",
      "Thirty Seven",
      "Thirty Eight",
      "Thirty Nine",
      "Forty",
      "Forty One",
      "Forty Two",
      "Forty Three",
      "Forty Four",
      "Forty Five",
      "Forty Six",
      "Forty Seven",
      "Forty Eight",
      "Forty Nine",
      "Fifty",
      "Fifty One",
      "Fifty Two",
      "Fifty Three",
      "Fifty Four",
      "Fifty Five",
      "Fifty Six",
      "Fifty Seven",
      "Fifty Eight",
      "Fifty Nine",
      "Sixty",
      "Sixty One",
      "Sixty Two",
      "Sixty Three",
      "Sixty Four",
      "Sixty Five",
      "Sixty Six",
      "Sixty Seven",
      "Sixty Eight",
      "Sixty Nine",
      "Seventy",
      "Seventy One",
      "Seventy Two",
      "Seventy Three",
      "Seventy Four",
      "Seventy Five",
      "Seventy Six",
      "Seventy Seven",
      "Seventy Eight",
      "Seventy Nine",
      "Eighty",
      "Eighty One",
      "Eighty Two",
      "Eighty Three",
      "Eighty Four",
      "Eighty Five",
      "Eighty Six",
      "Eighty Seven",
      "Eighty Eight",
      "Eighty Nine",
      "Ninety",
      "Ninety One",
      "Ninety Two",
      "Ninety Three",
      "Ninety Four",
      "Ninety Five",
      "Ninety Six",
      "Ninety Seven",
      "Ninety Eight",
      "Ninety Nine",
      "One Hundred",
    ];

    return words[number] || String(number);
  };

  /* =====================================================
     NEXT NUMBER
  ===================================================== */

  const nextNumber = () => {
    if (currentNumber < selectedLevel.maxNumber) {
      setCurrentNumber((prev) => prev + 1);
    }
  };

  /* =====================================================
     PREVIOUS NUMBER
  ===================================================== */

  const previousNumber = () => {
    if (currentNumber > 1) {
      setCurrentNumber((prev) => prev - 1);
    }
  };

  /* =====================================================
     LEVEL SELECTION PAGE
  ===================================================== */

  if (!isLevelPage) {
    return (
      <div className="nt-page">

        {/* HEADER */}
        <header className="nt-header">
          <h1>✏️ Number Tracing</h1>
        </header>

        {/* MAIN */}
        <main className="nt-content">

          <section className="nt-level-board">

            {/* ICON */}
            <div className="nt-level-icon">
              <img
                src={numberTracingImage}
                alt="Number Tracing"
              />
            </div>

            {/* TITLE */}
            <h2 className="nt-level-title">
              Choose a Level
            </h2>

            <p className="nt-level-subtitle">
              Learn numbers by tracing them step by step
            </p>

            {/* LEVEL CARDS */}
            <div className="nt-level-container">

              {levels.map((item) => (
                <div
                  key={item.id}
                  className={`nt-level-card ${item.className}`}
                  onClick={() =>
                    navigate(
                      `/number-tracing/level/${item.id}`
                    )
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();

                      navigate(
                        `/number-tracing/level/${item.id}`
                      );
                    }
                  }}
                >

                  <h2>
                    {item.title}
                  </h2>

                  <p>
                    {item.subtitle}
                  </p>

                  <div className="nt-level-arrow">
                    →
                  </div>

                </div>
              ))}

            </div>

          </section>

        </main>

      </div>
    );
  }

  /* =====================================================
     LEVEL LEARNING PAGE
  ===================================================== */

  return (
    <div className="nt-page">

      {/* HEADER */}
      <header className="nt-header">
        <h1>
          ✏️ Number Tracing
        </h1>
      </header>

      {/* CONTENT */}
      <main className="nt-learning-container">

        <section className="nt-learning-board">

          {/* LEVEL BADGE */}
          <div className="nt-learning-level-badge">
            {selectedLevel.title}
          </div>

          {/* NUMBER */}
          <div className="nt-learning-number">
            {currentNumber}
          </div>

          {/* WORD */}
          <h2 className="nt-learning-word">
            {numberToWord(currentNumber)}
          </h2>

          <p className="nt-learning-instruction">
            Trace the number with your finger
          </p>

          {/* TRACE AREA */}
          <div className="nt-trace-wrapper">

            <div className="nt-trace-guide">
              {currentNumber}
            </div>

            <canvas
              ref={canvasRef}
              className="nt-trace-canvas"
              width={600}
              height={330}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
            />

          </div>

          {/* MESSAGE */}
          <div className="nt-learning-message">
            Trace number {currentNumber} ✨
          </div>

          {/* BUTTONS */}
          <div className="nt-actions">

            <button
              className="nt-btn prev"
              onClick={previousNumber}
              disabled={currentNumber === 1}
            >
              ← Previous
            </button>

            {/* <button
              className="nt-btn.clear"
              onClick={clearCanvas}
            >
              🧹 Clear
            </button> */}
            <button
              type="button"
              className="nt-btn clear"
              onClick={clearCanvas}
            >
              🧹 Clear
            </button>

            <button
              className="nt-btn repeat"
              onClick={speakNumber}
            >
              🔊 Repeat
            </button>

            <button
              className="nt-btn next"
              onClick={nextNumber}
              disabled={
                currentNumber ===
                selectedLevel.maxNumber
              }
            >
              Next →
            </button>

          </div>

          {/* PROGRESS */}
          <div className="nt-progress">

            <span>
              Number {currentNumber}
            </span>

            <span>
              of {selectedLevel.maxNumber}
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}