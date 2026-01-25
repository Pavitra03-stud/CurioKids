import GameButton from "../components/Gamebutton";
import Mascot from "../components/Mascot";
import "../styles/PublicHome.css";

export default function PublicHome({ goTo }) {
  return (
    <div className="public-home">
      <div className="center-content">
        <h1 className="title">CurioKids</h1>
        <p className="subtitle">
          A jungle world where learning grows through play 🌱
        </p>

        <GameButton
          text="👶 I am a Child"
          onClick={() => goTo("child-register")}
        />

        <GameButton
          text="👨‍👩‍👧 I am a Parent"
          onClick={() => goTo("parent-register")}
        />

        <p className="lock-note">
          🔒 The jungle unlocks only when a child and parent join together
        </p>
      </div>

      <Mascot />
    </div>
  );
}
