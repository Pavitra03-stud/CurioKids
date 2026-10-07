// // import "../styles/GamesPlayHome.css";
// // import { useNavigate } from "react-router-dom";

// // export default function GamesPlayHome() {
// //   const navigate = useNavigate();

// //   const games = [
// //     { title:"Sound Tap", screen:"/sound-tap", icon:"🎧" },
// //     { title:"Find the Friend", screen:"/find-friend", icon:"🐾" },
// //     { title:"Pattern Game", screen:"/pattern-copy", icon:"🎯" },
// //     { title:"Memory Match", screen:"/memory-match", icon:"🧠" },
// //     { title:"Catch the Word", screen:"/catch-word", icon:"🎯" },
// //     { title:"Fill the Bucket", screen:"/fill-bucket", icon:"🧺" },
// //      { title:"Weather Clothes", screen:"/weather-clothes", icon:"🌦️👕" }
// //   ];

// //   return (
// //     <div className="games-play-page">

// //       <header className="games-play-topbar">
       

// //         <h1>🎮 Games Zone</h1>
// //       </header>

// //       <div className="game-list">
// //         {games.map((item,i)=>(
// //           <div
// //             key={i}
// //             className="game-item"
// //             onClick={() => navigate(item.screen)}
// //           >
// //             <div>
// //               {item.icon} {item.title}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //     </div>
// //   );
// // }



// import "../styles/GamesPlayHome.css";
// import { useNavigate } from "react-router-dom";

// export default function GamesPlayHome() {
//   const navigate = useNavigate();

//   return (
//     <div className="games-play-page">
//       {/* ================= TITLE ================= */}
//       <h1 className="title">Games Zone</h1>

//       {/* ================= GAME LIST ================= */}
//       <div className="game-list">
//         <div
//           className="game-item"
//           onClick={() => navigate("/weather-clothes")}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") {
//               navigate("/weather-clothes");
//             }
//           }}
//           role="button"
//           tabIndex={0}
//           style={{ cursor: "pointer" }}
//         >
//           <div>
//             <h2>Weather Clothes</h2>

//             <p>
//               Find how to dress according to the weather
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import "../styles/GamesPlayHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesPlayHome() {
  const navigate = useNavigate();

  return (
    <div className="games-play-page">

      {/* ================= TITLE ================= */}
      <h1 className="title">Games Zone</h1>

      {/* ================= GAME LIST ================= */}
      <div className="game-list">

        {/* 🌦️ Weather Clothes */}
        <div
          className="game-item"
          onClick={() => navigate("/weather-clothes")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🌦️ Weather Clothes</h2>
            <p>Find how to dress according to the weather</p>
          </div>
        </div>

        {/* 🎧 Sound Tap */}
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

        {/* 🐾 Find Friend */}
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

        {/* 🎯 Pattern Game */}
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

        {/* 🧠 Memory Match */}
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

        {/* 🎯 Catch Word */}
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

        {/* 🧺 Fill Bucket */}
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

        {/* 💥 Letter Blast */}
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

        {/* 🔢 Number Ninja
        <div
          className="game-item"
          onClick={() => navigate("/number-ninja")}
          style={{ cursor: "pointer" }}
        >
          <div>
            <h2>🔢 Number Ninja</h2>
            <p>Slice the correct number</p>
          </div>
        </div> */}

      </div>
    </div>
  );
}