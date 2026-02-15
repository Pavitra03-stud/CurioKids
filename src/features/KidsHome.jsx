import "../styles/KidsHome.css";
import { speak } from "../utils/speak";
import foxy from "../assets/foxy-cutout.png";
import BackIcon from "../components/BackIcon";

export default function KidsHome({ navigate, goBack }) {

  const speakText = (text) => {
    speak(text);
  };

  return (
    <div className="kids-home">

      {/* 🌴 FIXED NAVBAR */}
      <div className="kids-navbar">
        
        {/* LEFT - BACK BUTTON */}
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>

        {/* CENTER - TITLE */}
        <div className="navbar-title">
          🌴 CurioKids
        </div>


        {/* RIGHT - ACTION BUTTONS */}
        <div className="navbar-right">
          <button 
            className="pill"
            onClick={() => navigate("rewards")}
          >
            🏆 Rewards
          </button>

          <button 
            className="pill"
            onClick={() => navigate("progress")}
          >
            📊 Progress
          </button>
        </div>
      </div>

      {/* 🌿 PAGE CONTENT */}
      <div className="kids-content">

        {/* 🌱 WELCOME */}
        <section className="welcome-section">
          <h1>Welcome to the Jungle 🌿</h1>
          <p>Let’s play, learn, and grow together!</p>
        </section>

        {/* 🧩 CARDS */}
        <section className="card-grid">

          {/* 🎮 GAMES */}
          <div
            className="jungle-card"
            onClick={() => navigate("games")}
            onMouseEnter={() => speakText("Let’s play fun games!")}
          >
            <span className="card-icon">🎮</span>
            <span className="card-text">Games</span>
          </div>

          {/* 🔤 LETTERS */}
          <div
            className="jungle-card"
            onClick={() => navigate("letters")}
            onMouseEnter={() => speakText("Let’s learn letters together!")}
          >
            <span className="card-icon">🔤</span>
            <span className="card-text">Letters</span>
          </div>

          {/* 🔢 NUMBERS */}
          <div
            className="jungle-card"
            onClick={() => navigate("numbers")}
            onMouseEnter={() => speakText("Numbers are fun to learn!")}
          >
            <span className="card-icon">🔢</span>
            <span className="card-text">Numbers</span>
          </div>

          {/* 🧠 PRACTICE */}
          <div
            className="jungle-card"
            onClick={() => navigate("practice-home")}
            onMouseEnter={() => speakText("Practice makes you stronger!")}
          >
            <span className="card-icon">🧠</span>
            <span className="card-text">Practice</span>
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
            <strong>Let’s start learning!!!</strong>
          </div>
        </div>

<<<<<<< HEAD
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
=======
>>>>>>> c36adf6d5c1cd53aada627ce026f71e55fa09d03
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
