import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/JungleHero.css";

export default function JungleHero({ onComplete, goBack }) {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");
    if (savedFriend) setFriend(JSON.parse(savedFriend));
  }, []);

  return (
    <div className="jungle-hero-page"
    style={{
      minHeight: "100vh",
      width: "100%",
      overflowY: "auto",
      overflowX: "hidden",
      background: "linear-gradient(#1b5e20, #43a047)",
    }}>
      <BackIcon goBack={goBack} />

      {/* 🌴 HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            A Joyful Start to Your <br />
            <span>Learning Jungle</span>
          </h1>

          <p>
            A calm, supportive learning space for children —  
            designed with care for dyslexia and learning differences.
          </p>

          <div className="hero-buttons">
            <button
              className="hero-btn student"
              onClick={() => onComplete("kids-home")}
            >
              Student 🌱
            </button>

            <button
              className="hero-btn parent"
              onClick={() => onComplete("parent-dashboard")}
            >
              Parent 👨‍👩‍👧
            </button>
          </div>
        </div>

        {friend && (
          <div className="hero-friend">
            <img src={friend.image} alt={friend.name} />
            <p>Hi, I’m <b>{friend.name}</b> 🐾</p>
          </div>
        )}
      </section>

      {/* 💚 ABOUT DYSLEXIA */}
      <section className="dyslexia-section">
        <h2>💚 Understanding Dyslexia</h2>

        <p className="intro">
          Dyslexia is a <strong>learning difference</strong> that affects how
          children read, spell, and process letters —  
          but it has <strong>nothing to do with intelligence</strong>.
        </p>

        <div className="info-grid">
          <InfoCard
            title="🧠 What it is"
            text="Dyslexia affects how the brain processes language. Children learn differently — not slowly."
          />
          <InfoCard
            title="❌ What it is NOT"
            text="Dyslexia is not laziness, low intelligence, or lack of effort."
          />
          <InfoCard
            title="🌈 How CurioKids Helps"
            text="We use games, visuals, repetition, and encouragement to build confidence and joy."
          />
        </div>

        <p className="closing">
          Every child learns differently 🌱 — CurioKids grows with them.
        </p>
      </section>

      {/* 🚀 HOW OUR WEBSITE WORKS */}
      <section className="how-section">
        <h2>✨ How CurioKids Works</h2>

        <div className="steps">
          <Step number="1" text="Create a calm, playful learning profile" />
          <Step number="2" text="Learn through games and visual activities" />
          <Step number="3" text="Build confidence step by step — no pressure" />
          <Step number="4" text="Parents track growth, not marks" />
        </div>

        <div className="motivation-box">
          <h3>💛 A Message for Students</h3>
          <p>
            You are not slow.  
            You are not weak.  
            Your brain is unique — and that is your superpower 🌟
          </p>
        </div>
      </section>

        {/* 🌿 FOOTER */}
<footer
  style={{
    background: "#1b5e20",
    color: "#e8f5e9",
    padding: "50px 60px",
    marginTop: "80px",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "40px",
    }}
  >
    {/* 🌱 BRAND */}
    <div>
      <h3 style={{ marginBottom: "12px", color: "#ffeb3b" }}>
        🌴 CurioKids
      </h3>
      <p style={{ lineHeight: "1.6" }}>
        A joyful jungle where children with dyslexia learn through
        play, confidence, and care.
      </p>
    </div>

    {/* 🎓 FOR STUDENTS */}
    <div>
      <h4 style={{ marginBottom: "12px" }}>🎮 For Students</h4>
      <ul style={listStyle}>
        <li>Fun learning games</li>
        <li>Friendly jungle characters</li>
        <li>Learn at your own pace</li>
      </ul>
    </div>

    {/* 👨‍👩‍👧 FOR PARENTS */}
    <div>
      <h4 style={{ marginBottom: "12px" }}>📊 For Parents</h4>
      <ul style={listStyle}>
        <li>Child progress tracking</li>
        <li>Time control & safety</li>
        <li>Stress-free learning</li>
      </ul>
    </div>

    {/* 💚 MOTIVATION */}
    <div>
      <h4 style={{ marginBottom: "12px" }}>💚 Our Promise</h4>
      <p style={{ lineHeight: "1.6" }}>
        Every child is smart.<br />
        Every journey is unique.<br />
        We grow together 🌱
      </p>
    </div>
  </div>

  {/* 🔒 COPYRIGHT */}
  <div
    style={{
      textAlign: "center",
      marginTop: "40px",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      paddingTop: "20px",
      fontSize: "14px",
    }}
  >
    © {new Date().getFullYear()} CurioKids • Built with ❤️ for young learners
  </div>
</footer>

    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="info-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <p>{text}</p>
    </div>
  );
}

const listStyle = {
  listStyle: "none",
  padding: 0,
  lineHeight: "1.8",
};