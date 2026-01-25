import "../styles/KidsHome.css";

export default function KidsHome() {
  return (
    <div className="kids-home">
      {/* NAVBAR */}
      <nav className="kids-navbar">
        <h2>🌴 CurioKids</h2>
        <div className="nav-actions">
          <button>🏆 Rewards</button>
          <button>⏱ Progress</button>
          <button>👨‍👩‍👧 Parent</button>
        </div>
      </nav>

      {/* WELCOME */}
      <section className="welcome">
        <h1>Welcome to the Jungle 🌿</h1>
        <p>
          Your learning adventure begins now!  
          Let’s play, explore, and grow smarter every day 🎮📚
        </p>
      </section>

      {/* ACTIVITIES */}
      <section className="activities">
        <div className="activity-card">🎮 Games</div>
        <div className="activity-card">🧠 Practice</div>
        <div className="activity-card">🔤 Letters</div>
        <div className="activity-card">🔢 Numbers</div>
        <div className="activity-card">🏆 Rewards</div>
      </section>
    </div>
  );
}
