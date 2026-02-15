import "../styles/KidsHome.css";
import { speak } from "../utils/speak";
import foxy from "../assets/foxy-cutout.png";
import BackIcon from "../components/BackIcon";

export default function KidsHome({ goBack }) {
  const speakText = (text) => {
    speak(text);
  };

  return (
    <div className="kids-home">
      {/* 🔙 BACK BUTTON */}
      <BackIcon goBack={goBack} />

      {/* 🌴 NAVBAR */}
      <nav className="kids-navbar">
        <div className="nav-left">
          <span className="logo">🌴 CurioKids</span>
        </div>


        <div className="nav-right">
          <button className="pill">🏆 Rewards</button>
          <button className="pill">📊 Progress</button>
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
          <span className="card-icon">🎮</span>
          <span className="card-text">Games</span>
        </div>

        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Let’s learn letters together!")}
        >
          <span className="card-icon">🔤</span>
          <span className="card-text">Letters</span>
        </div>

        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Numbers are fun to learn!")}
        >
          <span className="card-icon">🔢</span>
          <span className="card-text">Numbers</span>
        </div>

        <div
          className="jungle-card"
          onMouseEnter={() => speakText("Practice makes you stronger!")}
        >
          <span className="card-icon">🧠</span>
          <span className="card-text">Practice</span>
        </div>
      </section>

      {/* 🦊 MASCOT */}
      {/*<div className="mascot-container">
        <img src={foxy} alt="Jungle Friend" className="mascot-img mascot-enter" />
        <div className="mascot-bubble">
          <strong>Let’s start learning!!!</strong>
        </div>
      </div>
      */}
      <div className="games-topic">
          <span className="card-text">Games</span>
          <ul>
            <li>Decoding practice</li>
            <li>Indentifying concepts</li>
           <li>Isolating speech sounds</li>
          </ul>
      </div>
      <div className="games-topic">
          <span className="card-text">Practice</span>
          <ul>
            <li>Reading comprehension</li>
            <li>Spelling syllables and sounds</li>
           <li>Reviewing concepts</li>
          </ul>
      </div>
      <div className="games-topic">
          <span className="card-text">Letters</span>
          <ul>
            <li>Letter writing practice</li>
            <li>spelling practice</li>
           <li>Focused spelling</li>
          </ul>
      </div>
      <div className="games-topic">
          <span className="card-text">Numbers</span>
          <ul>
            <li>Numbers practice</li>
            <li>Spelling practice</li>
           <li>Counting</li>
          </ul>
      </div>
    </div>

    
  );
}
