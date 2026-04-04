import { useNavigate } from "react-router-dom";
import "../styles/PublicHome.css";

export default function PublicHome() {
  const navigate = useNavigate();

  return (
    <div className="public-home">
      <div className="center-content">
        <img
          src="/src/assets/board.png"
          className="board-img"
          alt="wooden board"
        />

        <div className="board-content">
          <h1 className="title">CurioKids</h1>

          <p className="subtitle">
            A jungle world where learning grows through play 🌱
          </p>

          {/* 🌱 REGISTER */}
          <button
            className="main-btn"
            onClick={() => navigate("/child-register")}
          >
            Register to Enter the Jungle 🌷
          </button>

          {/* 🔐 LOGIN */}
          <button
            className="secondary-btn"
            onClick={() => navigate("/login")}
          >
            Welcome Back (Login) 🔐
          </button>

          <p className="lock-note">
            🔒 Unlock the dream jungle of Exploration 🍁
          </p>
        </div>
      </div>
    </div>
  );
}