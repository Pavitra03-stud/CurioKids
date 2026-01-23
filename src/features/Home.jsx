import GameButton from "../components/Gamebutton";
import "../styles/Home.css";

export default function Home({ goTo }) {
  return (
    <div className="world">

      {/* 🌤 Sky */}
      <div className="layer sky"></div>

      {/* 🌲 Far forest */}
      <div className="layer forest-back"></div>

      {/* 🌳 Mid forest */}
      <div className="layer forest-mid"></div>

      {/* 🌿 Ground */}
      <div className="layer ground"></div>

      {/* 🦊 Characters */}
      <img
        src="/assets/characters/fox_idle.png"
        className="character fox"
        alt="Fox mascot"
      />

      {/* 🎮 UI */}
      <div className="ui">
        <h1>🌱 CurioKids</h1>
        <p>Play • Explore • Grow</p>

        <GameButton text="🎮 Play" onClick={() => goTo("child")} />
      </div>

    </div>
  );
}
