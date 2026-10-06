// import React from "react";
// import "../styles/LettersHome.css";

// function LettersHome({ onBack, onLearningZone, onGamingZone }) {
//   return (
//     <div className="letters-home-page">
//       <div className="letters-home-header">
//         <button
//           className="letters-back-btn"
//           onClick={() => {
//             console.log("Back clicked");
//             onBack && onBack();
//           }}
//         >
//           ←
//         </button>

//         <h1>🌿 Letters Home</h1>
//       </div>

//       <div className="letters-home-content">
//         <p className="letters-home-subtitle">
//           Choose your zone and start learning ✨
//         </p>

//         <div className="letters-cards-grid">
//           <div
//             className="letters-feature-card"
//             onClick={() => {
//               console.log("Learning clicked");
//               onLearningZone && onLearningZone();
//             }}
//           >
//             <div className="letters-feature-icon learning-icon">📚</div>
//             <h2>Letter Learning Zone</h2>
//             <p>Practice letters, tracing, flashcards and more in a fun way.</p>
//           </div>

//           <div
//             className="letters-feature-card"
//             onClick={() => {
//               console.log("Gaming clicked");
//               onGamingZone && onGamingZone();
//             }}
//           >
//             <div className="letters-feature-icon gaming-icon">🎮</div>
//             <h2>Letter Gaming Zone</h2>
//             <p>Play fun letter games and improve quickly.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LettersHome;



// import React from "react";
// import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
// import "../styles/LettersHome.css";

// function LettersHome({ onBack }) {
//   const navigate = useNavigate();   // ✅ ADD THIS

//   return (
//     <div className="letters-home-page">
//       <div className="letters-home-header">
//         <h1>🌿 Letters Home</h1>
//       </div>

//       <div className="letters-home-content">
//         <p className="letters-home-subtitle">
//           Choose your zone and start learning ✨
//         </p>

//         <div className="letters-cards-grid">
          
//           {/* ✅ UPDATED LEARNING CLICK */}
//           <div
//             className="letters-feature-card"
//             onClick={() => {
//               console.log("Learning clicked");
//               navigate("/letter-learning");
//             }}
//           >
//             <div className="letters-feature-icon learning-icon">📚</div>
//             <h2>Letter Learning Zone</h2>
//             <p>Practice letters, tracing, flashcards and more in a fun way.</p>
//           </div>

//           {/* ✅ UPDATED GAMING CLICK */}
//           <div
//             className="letters-feature-card"
//             onClick={() => {
//               console.log("Gaming clicked");
//               navigate("/letter-gaming");
//             }}
//           >
//             <div className="letters-feature-icon gaming-icon">🎮</div>
//             <h2>Letter Gaming Zone</h2>
//             <p>Play fun letter games and improve quickly.</p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default LettersHome;



import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LettersHome.css";

function LettersHome() {
  const navigate = useNavigate();

  const handleKeyDown = (event, path) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="letters-home-page">

      {/* Header */}
      <div className="letters-home-header">
        <h1>🌿 Letters Home</h1>
      </div>

      {/* Content */}
      <div className="letters-home-content">

        <p className="letters-home-subtitle">
          Choose your zone and start learning ✨
        </p>

        <div className="letters-cards-grid">

          {/* =========================
              LETTER LEARNING
          ========================== */}
          <div
            className="letters-feature-card"
            onClick={() =>
              navigate("/letter-learning")
            }
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                "/letter-learning"
              )
            }
            role="button"
            tabIndex={0}
            aria-label="Open Letter Learning Zone"
          >
            <div className="letters-feature-icon learning-icon">
              📚
            </div>

            <h2>
              Letter Learning Zone
            </h2>

            <p>
              Practice letters, tracing,
              flashcards and more in a
              fun way.
            </p>
          </div>

          {/* =========================
              LETTER GAMING
          ========================== */}
          <div
            className="letters-feature-card"
            onClick={() =>
              navigate("/letter-gaming")
            }
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                "/letter-gaming"
              )
            }
            role="button"
            tabIndex={0}
            aria-label="Open Letter Gaming Zone"
          >
            <div className="letters-feature-icon gaming-icon">
              🎮
            </div>

            <h2>
              Letter Gaming Zone
            </h2>

            <p>
              Play fun letter games
              and improve quickly.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default LettersHome;