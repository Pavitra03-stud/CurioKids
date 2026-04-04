import "../styles/numbersZone.css";

export default function NumbersLearningHome({ navigate, goBack }) {
  const lessons = [
    {
      title: "What is a Number?",
      subtitle: "Learn number basics",
      screen: "concept-what-is-a-number",
      icon: "🔢",
    },
    {
      title: "Bigger & Smaller",
      subtitle: "Compare numbers easily",
      screen: "concept-bigger-smaller",
      icon: "📏",
    },
    {
      title: "Number Line Basics",
      subtitle: "Learn number positions",
      screen: "concept-number-line",
      icon: "➡️",
    },
    {
      title: "Skip Counting Concept",
      subtitle: "Count by 2s, 5s, and 10s",
      screen: "concept-skip-counting",
      icon: "🔁",
    },
  ];

  return (
    <div className="numbers-zone-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>

      <header className="numbers-zone-topbar">
        <button className="numbers-zone-back" onClick={goBack}>
          ←
        </button>
        <h1 className="numbers-zone-topbar-title">📚 Numbers Learning Zone</h1>
      </header>

      <div className="numbers-zone-header">
        <div className="header-mascots">
          <span>🔢</span>
          <span>🧮</span>
          <span>✨</span>
        </div>
        <p>Choose a number lesson and start learning</p>
      </div>

      <div className="numbers-zone-container">
        {lessons.map((item, i) => (
          <div
            key={i}
            className="numbers-zone-card"
            onClick={() => navigate(item.screen)}
          >
            <div className="card-left">
              <div className="animal-icon">{item.icon}</div>

              <div className="card-text">
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
              </div>
            </div>

            <div className="arrow">→</div>
          </div>
        ))}
      </div>

      <div className="bottom-icons">
        <span>1️⃣</span>
        <span>2️⃣</span>
        <span>3️⃣</span>
      </div>
    </div>
  );
}