// import { useState, useRef, useEffect } from "react";
// import "../styles/AIWritingTest.css";
// import { trackActivity } from "../utils/trackActivity";

// const letters = Array.from({ length: 26 }, (_, i) =>
//   String.fromCharCode(65 + i)
// );

// export default function AIWritingTest() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [results, setResults] = useState([]);
//   const [showResult, setShowResult] = useState(false);

//   const canvasRef = useRef(null);
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//   console.warn("No userId found, using test_user");
// }

//   const currentLetter = letters[currentIndex];

//   // 🔥 Track page open
//   useEffect(() => {
//     if (userId) {
//       trackActivity({
//         userId,
//         action: "open_page",
//         screen: "ai-writing-test",
//         module: "letters",
//       });
//     }
//   }, [userId]);

//   // 🧹 Clear canvas
//   const handleClear = () => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, 400, 400);
//   };

//   // ✅ Check empty
//   const isCanvasEmpty = () => {
//     const canvas = canvasRef.current;
//     const blank = document.createElement("canvas");
//     blank.width = canvas.width;
//     blank.height = canvas.height;
//     return canvas.toDataURL() === blank.toDataURL();
//   };

//   // 🤖 AI analyze
//   const analyzeDrawing = async () => {
//     try {
//       const imageData = canvasRef.current.toDataURL("image/png");

//       const res = await fetch("http://localhost:5000/ai/analyze", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           letter: currentLetter,
//           drawing: imageData,
//         }),
//       });

//       const data = await res.json();

//       // 🔥 Save locally
//       setResults((prev) => [
//         ...prev,
//         {
//           letter: currentLetter,
//           score: data.score,
//           status: data.status,
//         },
//       ]);

//       // 🔥 Send to admin
//       trackActivity({
//         userId,
//         action: "ai_test",
//         screen: "ai-writing-test",
//         module: "letters",
//         score: data.score,
//         extraData: {
//           letter: currentLetter,
//           status: data.status,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 👉 Next
//   const handleNext = async () => {
//     if (isCanvasEmpty()) {
//       alert("✏️ Please complete the letter!");
//       return;
//     }

//     await analyzeDrawing();
//     handleClear();

//     if (currentIndex === letters.length - 1) {
//       setShowResult(true);
//       return;
//     }

//     setCurrentIndex((prev) => prev + 1);
//   };

//   // ✏️ Drawing
//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     let drawing = true;
//     const rect = canvas.getBoundingClientRect();

//     const getX = (event) =>
//       event.touches ? event.touches[0].clientX - rect.left : event.offsetX;

//     const getY = (event) =>
//       event.touches ? event.touches[0].clientY - rect.top : event.offsetY;

//     ctx.beginPath();
//     ctx.moveTo(getX(e), getY(e));
//     ctx.lineWidth = 6;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = "#1d3c34";

//     const draw = (event) => {
//       if (!drawing) return;
//       event.preventDefault();
//       ctx.lineTo(getX(event), getY(event));
//       ctx.stroke();
//     };

//     const stop = () => {
//       drawing = false;
//       window.removeEventListener("mousemove", draw);
//       window.removeEventListener("mouseup", stop);
//       window.removeEventListener("touchmove", draw);
//       window.removeEventListener("touchend", stop);
//     };

//     window.addEventListener("mousemove", draw);
//     window.addEventListener("mouseup", stop);
//     window.addEventListener("touchmove", draw, { passive: false });
//     window.addEventListener("touchend", stop);
//   };

//   // 📊 Average
//   const average =
//     results.length > 0
//       ? (results.reduce((a, b) => a + b.score, 0) / results.length).toFixed(1)
//       : 0;

//   const getClass = (status) => {
//     if (status === "correct") return "green";
//     if (status === "practice") return "orange";
//     return "red";
//   };

//   return (
//     <div className="ai-writing-page">
//       {!showResult ? (
//         <>
//           <h1>✏ AI Letter Writing Test</h1>

//           <h2>Write the letter:</h2>
//           <div className="big-letter">{currentLetter}</div>

//           <canvas
//             ref={canvasRef}
//             width="400"
//             height="400"
//             className="writing-canvas"
//             onMouseDown={startDrawing}
//             onTouchStart={startDrawing}
//           />

//           <div className="ai-writing-buttons">
//             <button onClick={handleClear}>Clear</button>
//             <button onClick={handleNext}>Next →</button>
//           </div>

//           <p>Letter {currentIndex + 1} / 26</p>
//         </>
//       ) : (
//         <div className="result-box">
//           <h2>🎉 Results</h2>

//           <h3>Average Score: {average}%</h3>

//           <div className="result-grid">
//             {results.map((r, index) => (
//               <div
//                 key={index}
//                 className={`result-item ${getClass(r.status)}`}
//               >
//                 {r.letter}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useRef, useEffect } from "react";
import "../styles/AIWritingTest.css";
import { trackActivity } from "../utils/trackActivity";
import { useGame } from "../context/GameContext"; // ✅ ADDED

const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function AIWritingTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const canvasRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const { addStars } = useGame(); // ✅ ADDED

  if (!userId) {
    console.warn("No userId found, using test_user");
  }

  const currentLetter = letters[currentIndex];

  useEffect(() => {
    if (userId) {
      trackActivity({
        userId,
        action: "open_page",
        screen: "ai-writing-test",
        module: "letters",
      });
    }
  }, [userId]);

  const handleClear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 400, 400);
  };

  const isCanvasEmpty = () => {
    const canvas = canvasRef.current;
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  };

  const analyzeDrawing = async () => {
    try {
      const imageData = canvasRef.current.toDataURL("image/png");

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

      setResults((prev) => [
        ...prev,
        {
          letter: currentLetter,
          score: data.score,
          status: data.status,
        },
      ]);

      trackActivity({
        userId,
        action: "ai_test",
        screen: "ai-writing-test",
        module: "letters",
        score: data.score,
        extraData: {
          letter: currentLetter,
          status: data.status,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = async () => {
    if (isCanvasEmpty()) {
      alert("✏️ Please complete the letter!");
      return;
    }

    await analyzeDrawing();
    handleClear();

    if (currentIndex === letters.length - 1) {
      setShowResult(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

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

  const average =
    results.length > 0
      ? (results.reduce((a, b) => a + b.score, 0) / results.length).toFixed(1)
      : 0;

  const getClass = (status) => {
    if (status === "correct") return "green";
    if (status === "practice") return "orange";
    return "red";
  };

  // ✅ ADD PROGRESS WHEN FINISHED
  useEffect(() => {
    if (showResult && results.length > 0) {
      addStars(Number(average), "AI Writing Test");
    }
  }, [showResult]); // 🔥 runs only once when finished

  return (
    <div className="ai-writing-page">
      {!showResult ? (
        <>
          <h1>✏ AI Letter Writing Test</h1>

          <h2>Write the letter:</h2>
          <div className="big-letter">{currentLetter}</div>

          <canvas
            ref={canvasRef}
            width="400"
            height="400"
            className="writing-canvas"
            onMouseDown={startDrawing}
            onTouchStart={startDrawing}
          />

          <div className="ai-writing-buttons">
            <button onClick={handleClear}>Clear</button>
            <button onClick={handleNext}>Next →</button>
          </div>

          <p>Letter {currentIndex + 1} / 26</p>
        </>
      ) : (
        <div className="result-box">
          <h2>🎉 Results</h2>

          <h3>Average Score: {average}%</h3>

          <div className="result-grid">
            {results.map((r, index) => (
              <div
                key={index}
                className={`result-item ${getClass(r.status)}`}
              >
                {r.letter}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}