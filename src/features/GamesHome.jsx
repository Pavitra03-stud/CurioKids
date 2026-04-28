// import "../styles/GamesHome.css";
// import { useNavigate } from "react-router-dom";

// export default function GamesHome() {
//   const navigate = useNavigate();

//   return (
//     <div className="games-page">

//       <header className="games-topbar">


//         <button className="games-back" onClick={() => navigate(-1)}>
//           ←
//         </button>


//         <h1 className="games-topbar-title">🎮 Games</h1>
//       </header>

//       <div className="games-header">

//         <div className="header-mascots">
//           <span>🐯</span>
//           <span>🦊</span>
//           <span>🐻</span>
//         </div>


//       </div>

//       <div className="games-container">


//         <div
//           className="games-card play"
//           onClick={() => navigate("/games-play")}

//           style={{ cursor: "pointer" }}

//         >
//           🎮 Game Zone
//         </div>

//       </div>

  
//   );
// }


import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GamesHome.css";

export default function GamesHome() {
  const navigate = useNavigate();

  return (
    <div className="games-page">
      <header className="games-topbar">
        <button className="games-back" onClick={() => navigate(-1)}>
          ←
        </button>

        <h1 className="games-topbar-title">🎮 Games Home</h1>
      </header>

      <div className="games-header">
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>

        <p className="games-subtitle">
          Choose your zone and start playing ✨
        </p>
      </div>

      <div className="games-container">
        <div
          className="games-card learning"
          onClick={() => navigate("/games-learning")}
          style={{ cursor: "pointer" }}
        >
          <div className="games-card-icon">📚</div>
          <h2>Games Learning Zone</h2>
          <p>Learn sounds, patterns, weather and fun activities.</p>
        </div>

        <div
          className="games-card play"
          onClick={() => navigate("/games-play")}
          style={{ cursor: "pointer" }}
        >
          <div className="games-card-icon">🎮</div>
          <h2>Games Play Zone</h2>
          <p>Play joyful games and improve your skills quickly.</p>
        </div>
      </div>
    </div>
  );
}