// import "../styles/LettersGameHome.css";

// export default function LettersGameHome({ navigate, goBack }) {
//   const games = [
//     {
//       title: "Letter Blast",
//       subtitle: "Tap the correct letter",
//       screen: "letter-blast",
//       icon: "💥",
//     },
//     {
//       title: "Find the Odd Letter",
//       subtitle: "Find the different letter",
//       screen: "odd-letter",
//       icon: "🧠",
//     },
//     {
//       title: "Connect the Letters",
//       subtitle: "Connect letters in order",
//       screen: "connect-letters",
//       icon: "🔗",
//     },
//     {
//       title: "Word Builder",
//       subtitle: "Build the correct word",
//       screen: "word-builder",
//       icon: "🧩",
//     },
//   ];

//   return (
//     <div className="letters-game-page">
//       <div className="floating-bg bubble1"></div>
//       <div className="floating-bg bubble2"></div>
//       <div className="floating-bg bubble3"></div>

//       <header className="letters-game-topbar">
//         <button className="letters-game-back" onClick={goBack}>
//           ←
//         </button>
//         <h1 className="letters-game-topbar-title">🎮 Letters Games</h1>
//       </header>

//       <div className="letters-game-header">
//         <div className="header-mascots">
//           <span>🐯</span>
//           <span>🦊</span>
//           <span>🐻</span>
//         </div>
//         <p>Choose a fun game and start playing</p>
//       </div>

//       <div className="letters-game-container">
//         {games.map((item, i) => (
//           <div
//             key={i}
//             className="game-card"
//             onClick={() => navigate(item.screen)}
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


import { useNavigate } from "react-router-dom";
import "../styles/LettersGameHome.css";

export default function LettersGameHome() {
  const navigate = useNavigate();

  const games = [
    {
      title: "Letter Blast",
      subtitle: "Tap the correct letter",
      screen: "/learning-letter-blast",
      icon: "💥",
    },
    {
      title: "Find the Odd Letter",
      subtitle: "Find the different letter",
      screen: "/odd-letter",
      icon: "🧠",
    },
    {
      title: "Connect the Letters",
      subtitle: "Connect letters in order",
      screen: "/connect-letters",
      icon: "🔗",
    },
    {
      title: "Word Builder",
      subtitle: "Build the correct word",
      screen: "/word-builder",
      icon: "🧩",
    },
  ];

  return (
    <div className="letters-game-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>

      <header className="letters-game-topbar">
        <h1 className="letters-game-topbar-title">🎮 Letters Games</h1>
      </header>

      <div className="letters-game-header">
        <div className="header-mascots">
          <span>🐯</span>
          <span>🦊</span>
          <span>🐻</span>
        </div>
        <p>Choose a fun game and start playing</p>
      </div>

      <div className="letters-game-container">
        {games.map((item, i) => (
          <div
            key={i}
            className="game-card"
            onClick={() => navigate(item.screen)}
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