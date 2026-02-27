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
        {/* 🦊 MASCOT */}
        <div className="mascot-container">
          <img src={foxy} alt="Jungle Friend" className="mascot-img" />
          <div className="mascot-bubble">
            <strong>Let’s start learning!!!</strong>
          </div>
        </div>

      {/* 🌴 NAVBAR */}
      <div className="kids-navbar">
        
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>

        <div className="navbar-title">🌴 CurioKids</div>

        <div className="navbar-right">
          <button className="pill" onClick={() => navigate("rewards")}>
            🏆 Rewards
          </button>

          <button className="pill" onClick={() => navigate("progress")}>
            📊 Progress
          </button>
        </div>
      </div>

      {/* 🌿 CONTENT */}
      <div className="kids-content">

        {/* 🌱 WELCOME */}
        <section className="welcome-section">
          <h1>Welcome to the Jungle 🌿</h1>
          <p>Let’s play, learn, and grow together!</p>
        </section>

        {/* 🧩 MAIN CARDS */}
        <section className="card-grid">

          <div
            className="jungle-card"
            onClick={() => navigate("games")}
            onMouseEnter={() => speakText("Let’s play fun games!")}
          >
            <span className="card-icon">🎮</span>
            <span className="card-text">Games</span>
          </div>
          <div className="games-topic">
            <span className="card-text">Games</span>
            <ul>
              <li>Decoding practice</li>
              <li>Identifying concepts</li>
              <li>Isolating speech sounds</li>
            </ul>
          </div>

          <div
            className="jungle-card"
            onClick={() => navigate("letters")}
            onMouseEnter={() => speakText("Let’s learn letters together!")}
          >
            <span className="card-icon">🔤</span>
            <span className="card-text">Letters</span>
          </div>
           <div className="games-topic">
            <span className="card-text">Letters</span>
            <ul>
              <li>Alphabet Explorer Zone</li>
              <li>Letter Detective zone</li>
              <li>Writing & shape Zone</li>
              <li>Letter challenge Arena</li>
            </ul>
          </div>
        
          

          <div
            className="jungle-card"
            onClick={() => navigate("numbers")}
            onMouseEnter={() => speakText("Numbers are fun to learn!")}
          >
            <span className="card-icon">🔢</span>
            <span className="card-text">Numbers</span>
          </div>
           <div className="games-topic">
            <span className="card-text">Numbers</span>
            <ul>
              <li>Letter writing</li>
              <li>Spelling practice</li>
              <li>Focused spelling</li>
            </ul>
          </div>
          

          <div
            className="jungle-card"
            onClick={() => navigate("practice-home")}
            onMouseEnter={() => speakText("Practice makes you stronger!")}
          >
            <span className="card-icon">🧠</span>
            <span className="card-text">Practice</span>
          </div>
           <div className="games-topic">
            <span className="card-text">Practice</span>
            <ul>
              <li>Letter Mastery Zone</li>
              <li>Phonics power Zone</li>
              <li>Word Builder Zone</li>
              <li>Memory & visual skills</li>
              <li>Confidence Boost Zone</li>
            </ul>
          </div>
          

        </section>

        

      </div>
    </div>
  );
}
