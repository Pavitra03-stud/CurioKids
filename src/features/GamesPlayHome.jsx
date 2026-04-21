import "../styles/GamesPlayHome.css";
import { useNavigate } from "react-router-dom";

export default function GamesPlayHome() {
  const navigate = useNavigate();

  const games = [
    { title:"Sound Tap", screen:"/sound-tap", icon:"🎧" },
    { title:"Find the Friend", screen:"/find-friend", icon:"🐾" },
    { title:"Pattern Game", screen:"/pattern-copy", icon:"🎯" },
    { title:"Memory Match", screen:"/memory-match", icon:"🧠" },
    { title:"Catch the Word", screen:"/catch-word", icon:"🎯" },
    { title:"Fill the Bucket", screen:"/fill-bucket", icon:"🧺" }
  ];

  return (
    <div className="games-play-page">

      <header className="games-play-topbar">
        <button onClick={() => navigate(-1)}>
          ←
        </button>

        <h1>🎮 Games Zone</h1>
      </header>

      <div className="game-list">
        {games.map((item,i)=>(
          <div
            key={i}
            className="game-item"
            onClick={() => navigate(item.screen)}
          >
            <div>
              {item.icon} {item.title}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}