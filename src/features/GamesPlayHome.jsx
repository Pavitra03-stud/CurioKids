// import "../styles/GamesPlayHome.css";

// export default function GamesPlayHome({ navigate, goBack }) {
//   const games = [
//     {
//       title: "Sound Tap",
//       subtitle: "Tap the number of sounds",
//       screen: "sound-tap",
//       icon: "🎧",
//     },
//     {
//       title: "Find the Friend",
//       subtitle: "Find the different one",
//       screen: "find-friend",
//       icon: "🐾",
//     },
//     {
//       title: "Pattern Game",
//       subtitle: "Follow the pattern",
//       screen: "pattern-copy",
//       icon: "🎯",
//     },
//     {
//       title: "Memory Match",
//       subtitle: "Match the pairs",
//       screen: "memory-match",
//       icon: "🧠",
//     },
//     {
//       title: "Catch the Word",
//       subtitle: "Catch the correct word",
//       screen: "catch-word",
//       icon: "🎯",
//     },
//     {
//       title: "Fill the Bucket",
//       subtitle: "Put the right number of items",
//       screen: "fill-bucket",
//       icon: "🧺",
//     },
//     {
//       title: "Letter Blast",
//       subtitle: "Tap the correct letter",
//       screen: "letter-blast",
//       icon: "💥",
//     },
//     {
//       title: "Number Ninja",
//       subtitle: "Slice the correct number",
//       screen: "number-ninja",
//       icon: "🔢",
//     },
//   ];

//   return (
//     <div className="games-play-page">
//       <div className="floating-bg bubble1"></div>
//       <div className="floating-bg bubble2"></div>
//       <div className="floating-bg bubble3"></div>

//       <header className="games-play-topbar">
//         <button className="games-play-back" onClick={goBack}>
//           ←
//         </button>
//         <h1 className="games-play-topbar-title">🎮 Games Zone</h1>
//       </header>

//       <div className="games-play-header">
//         <div className="header-mascots">
//           <span>🐯</span>
//           <span>🦊</span>
//           <span>🐻</span>
//         </div>
//         <p>Choose a fun game and start playing</p>
//       </div>

//       <div className="game-list">
//         {games.map((item, i) => (
//           <div
//             key={i}
//             className="game-item"
//             onClick={() => navigate(item.screen)}
//             style={{ cursor: "pointer" }}
//           >
//             <div className="card-left">
//               <div className="animal-icon">{item.icon}</div>
//               <div className="card-text">
//                 <h2>{item.title}</h2>
//                 <p>{item.subtitle}</p>
//               </div>
//             </div>

//             <div className="arrow">→</div>
//           </div>
//         ))}
//       </div>

//       <div className="bottom-animals">
//         <span>🦁</span>
//         <span>🐼</span>
//         <span>🐵</span>
//       </div>
//     </div>
//   );
// }



import "../styles/GamesPlayHome.css";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function GamesPlayHome({ navigate, goBack }) {

  const games = [
    {
      title: "Sound Tap",
      subtitle: "Tap the number of sounds",
      screen: "sound-tap",
      icon: "🎧",
    },
    {
      title: "Find the Friend",
      subtitle: "Find the different one",
      screen: "find-friend",
      icon: "🐾",
    },
    {
      title: "Pattern Game",
      subtitle: "Follow the pattern",
      screen: "pattern-copy",
      icon: "🎯",
    },
    {
      title: "Memory Match",
      subtitle: "Match the pairs",
      screen: "memory-match",
      icon: "🧠",
    },
    {
      title: "Catch the Word",
      subtitle: "Catch the correct word",
      screen: "catch-word",
      icon: "🎯",
    },
    {
      title: "Fill the Bucket",
      subtitle: "Put the right number of items",
      screen: "fill-bucket",
      icon: "🧺",
    },
    {
      title: "Letter Blast",
      subtitle: "Tap the correct letter",
      screen: "letter-blast",
      icon: "💥",
    },
    {
      title: "Number Ninja",
      subtitle: "Slice the correct number",
      screen: "number-ninja",
      icon: "🔢",
    },
  ];

  // ✅ ACTIVITY LOGGER
  const logGameClick = async (gameName) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "open-game",
      module: "games",
      screen: gameName,
      timestamp: new Date(),
    });
  };

  // ✅ HANDLE CLICK
  const handleClick = async (screen) => {
    await logGameClick(screen);
    navigate(screen);
  };

  return (
    <div className="games-play-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>

      <header className="games-play-topbar">
        <button className="games-play-back" onClick={goBack}>
          ←
        </button>
        <h1 className="games-play-topbar-title">🎮 Games Zone</h1>
      </header>

      <div className="games-play-header">
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>
        <p>Choose a fun game and start playing</p>
      </div>

      <div className="game-list">
        {games.map((item, i) => (
          <div
            key={i}
            className="game-item"
            onClick={() => handleClick(item.screen)} // ✅ UPDATED
            style={{ cursor: "pointer" }}
          >
            <div className="card-left">
              <div className="animal-icon">{item.icon}</div>
              <div className="card-text">
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
              </div>
            </div>

            <div className="arrow">→</div>
          </div>
        ))}
      </div>

      <div className="bottom-animals">
        <span>🦁</span>
        <span>🐼</span>
        <span>🐵</span>
      </div>
    </div>
  );
}