import "../styles/KidsHome.css";
import {speak} from "../utils/speak";
import foxy from "../assets/foxy-cutout.png";

export default function KidsHome() {
  const speakText = (text) => {
    speak(text);
  };

  return (
    <div className="kids-home">
      {/* 🌴 NAVBAR */}
      <nav className="kids-navbar">
        <div className="nav-left">
          <span className="logo">🌴 CurioKids</span>
        </div>

        <div className="nav-center">
          <button>🎮 Games</button>
          <button>🧠 Practice</button>
          <button>🔤 Letters</button>
          <button>🔢 Numbers</button>
        </div>

        <div className="nav-right">
          <button className="pill">🏆 Rewards</button>
          <button className="pill">📊 Progress</button>
          <button className="pill">👨‍👩‍👧 Parent</button>
        </div>
      </nav>

      {/* 🌱 WELCOME */}
      <section className="welcome-section">
        <h1>Welcome to the Jungle 🌿</h1>
        <p>Let’s play, learn, and grow together!</p>
      </section>

      {/* 🧩 CARDS */}
      <section className="card-grid">
        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Let’s play fun games!")}
        >
          🎮 Games
        </div>

        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Practice makes you stronger!")}
        >
          🧠 Practice
        </div>

        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Let’s learn letters together!")}
        >
          🔤 Letters
        </div>

        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Numbers are fun to learn!")}
        >
          🔢 Numbers
        </div>
      </section>

      {/* 🦊 MASCOT */}
      <div className="mascot-container">
  <img
  src={foxy}
  alt="Jungle Friend"
  className="mascot-img mascot-enter"
/>

  <div className="mascot-bubble">
    <strong>Let’s start to learn!!! </strong>
  </div>
</div>

    </div>
  );
}
