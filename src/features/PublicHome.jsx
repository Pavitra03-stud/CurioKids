import GameButton from "../components/Gamebutton";
import Mascot from "../components/Mascot";
import "../styles/PublicHome.css";

export default function PublicHome({ onComplete }) {
  return (
    <div className="public-home">
      <div className="center-content">
        <img
          src="src/assets/board.png"
          className="board-img"
          alt="wooden board"
        />

        <div className="board-content">
          <h1 className="title">CurioKids</h1>

          <p className="subtitle">
            A jungle world where learning grows through play 🌱
          </p>

          {/* ✅ CORRECT: call onComplete */}
          <GameButton
            text="Register to Enter the Jungle 🌷"
            onClick={onComplete}
          />

          <p className="lock-note">
            🔒 Unlock the dream jungle of Exploration 🍁
          </p>
        </div>
      </div>

      <Mascot />
    </div>
  );
}
