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




import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesHome() {
  const navigate = useNavigate();

  return (
    <div className="games-page">
      {/* ================= TOP BAR ================= */}
      <header className="games-topbar">
        <button
          className="games-back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ←
        </button>

        <h1 className="games-topbar-title">
          🎮 Games
        </h1>
      </header>

      {/* ================= HEADER ================= */}
      <div className="games-header">
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>
      </div>

      {/* ================= GAME ZONE ================= */}
      <div
        className="games-card play"
        onClick={() => navigate("/games-play")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/games-play");
          }
        }}
      >
        🎮 Game Zone
      </div>
    </div>
  );
}