// import "../styles/GamesPlayHome.css";
// import { useNavigate } from "react-router-dom";

// export default function GamesPlayHome() {
//   const navigate = useNavigate(); // ✅ NEW

//   return (
//     <div className="games-play-page">

//       {/* ❌ BACK ICON REMOVED */}

//       {/* Title */}
//       <h1 className="title">Games Zone</h1>

//       {/* Game List */}
//       <div className="game-list">

//         <div
//           className="game-item"
//           onClick={() => navigate("/sound-tap")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🎧 Sound Tap</h2>
//             <p>Tap the number of sounds</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/find-friend")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🐾 Find the Friend</h2>
//             <p>Find the different one</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/pattern-copy")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🎯 Pattern Game</h2>
//             <p>Follow the pattern</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/memory-match")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🧠 Memory Match</h2>
//             <p>Match the pairs</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/catch-word")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🎯 Catch the Word</h2>
//             <p>Catch the correct word</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/fill-bucket")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🧺 Fill the Bucket</h2>
//             <p>Put the right number of items</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/letter-blast")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>💥 Letter Blast</h2>
//             <p>Tap the correct letter</p>
//           </div>
//         </div>

//         <div
//           className="game-item"
//           onClick={() => navigate("/number-ninja")}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>🔢 Number Ninja</h2>
//             <p>Slice the correct number</p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




import "../styles/GamesPlayHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesPlayHome() {
  const navigate = useNavigate(); // ✅ NEW

  return (
    <div className="games-play-page">

      {/* ❌ BACK ICON REMOVED */}

      {/* Title */}
      <h1 className="title">Games Zone</h1>

      {/* Game List */}
      <div className="game-list">

        <div
          className="game-item"
          onClick={() => navigate("/sound-tap")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🎧 Sound Tap</h2>
            <p>Tap the number of sounds</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/find-friend")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🐾 Find the Friend</h2>
            <p>Find the different one</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/pattern-copy")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🎯 Pattern Game</h2>
            <p>Follow the pattern</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/memory-match")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🧠 Memory Match</h2>
            <p>Match the pairs</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/catch-word")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🎯 Catch the Word</h2>
            <p>Catch the correct word</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/fill-bucket")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🧺 Fill the Bucket</h2>
            <p>Put the right number of items</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/letter-blast")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>💥 Letter Blast</h2>
            <p>Tap the correct letter</p>
          </div>
        </div>

        <div
          className="game-item"
          onClick={() => navigate("/number-ninja")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🔢 Number Ninja</h2>
            <p>Slice the correct number</p>
          </div>
        </div>

      </div>
    </div>
  );
}