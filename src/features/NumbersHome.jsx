import "../styles/numbersZone.css";

export default function NumbersHome({ navigate, goBack }) {
  return (
    <div className="numbers-home-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>

      <header className="numbers-home-topbar">
        <button className="numbers-home-back" onClick={goBack}>
          ←
        </button>
        <h1 className="numbers-home-topbar-title">🔢 Numbers</h1>
      </header>

      <div className="numbers-home-header">
        <div className="header-mascots">
          <span>1️⃣</span>
          <span>2️⃣</span>
          <span>3️⃣</span>
        </div>
        <p>Choose a fun zone and start learning</p>
      </div>

      <div className="numbers-home-container">
        <div
          className="numbers-home-card"
          onClick={() => navigate("numbers-learning-home")}
        >
          <div className="card-left">
            <div className="animal-icon">📚</div>
            <div className="card-text">
              <h2>Learning Zone</h2>
              <p>Learn numbers with fun concepts</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>

        <div
          className="numbers-home-card"
          onClick={() => navigate("numbers-games-home")}
        >
          <div className="card-left">
            <div className="animal-icon">🎮</div>
            <div className="card-text">
              <h2>Game Zone</h2>
              <p>Play games and improve your skills</p>
            </div>
          </div>
          <div className="arrow">→</div>
        </div>
      </div>

      <div className="bottom-icons">
        <span>🔢</span>
        <span>🧮</span>
        <span>✨</span>
      </div>
    </div>
  );
}