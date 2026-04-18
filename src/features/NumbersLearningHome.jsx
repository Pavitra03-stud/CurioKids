import { useNavigate } from "react-router-dom";
import "../styles/NumbersLearningHome.css";

export default function NumbersLearningHome() {
  const navigate = useNavigate();

  const learningCards = [
    {
      icon: "👀👂✋",
      title: "Multi-Sensory",
      subtitle: "See, hear and touch numbers",
      path: "/multi-sensory-numbers",
      color: "yellow",
    },
    {
      icon: "📖",
      title: "Story Based",
      subtitle: "Learn numbers with stories",
      path: "/story-based-numbers",
      color: "blue",
    },
    {
      icon: "🔁",
      title: "Number Tracing",
      subtitle: "Trace numbers with your finger",
      path: "/number-tracing",
      color: "pink",
    },
    {
      icon: "🐢",
      title: "Slow Step",
      subtitle: "Learn step by step",
      path: "/slow-step-numbers",
      color: "purple",
    },
    {
      icon: "😊",
      title: "Safe Error",
      subtitle: "Learn without fear",
      path: "/safe-error-numbers",
      color: "green",
    },
  ];

  return (
    <div className="numbers-learning-page">

      {/* HEADER */}
      <div className="numbers-learning-topbar">
        <h1 className="numbers-learning-title">
          🔢 Numbers Learning
        </h1>
      </div>

      {/* DECOR */}
      <div className="numbers-learning-decor decor-top-left"></div>
      <div className="numbers-learning-decor decor-middle-right"></div>
      <div className="numbers-learning-decor decor-bottom-left"></div>

      {/* TOP ICONS */}
      <div className="numbers-learning-header">
        <div className="numbers-learning-animals top-animals">
          <span>🔢</span>
          <span>🧮</span>
          <span>✨</span>
        </div>
      </div>

      {/* CARDS */}
      <div className="numbers-learning-list">
        {learningCards.map((card, index) => (
          <div
            key={index}
            className="numbers-learning-card"
            onClick={() => navigate(card.path)}
          >
            <div className={`numbers-learning-icon ${card.color}`}>
              {card.icon}
            </div>

            <div className="numbers-learning-text">
              <h2>{card.title}</h2>
              <p>{card.subtitle}</p>
            </div>

            <div className="numbers-learning-arrow">→</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="numbers-learning-footer">
        <div className="numbers-learning-progress">
          <h3>Number Zone</h3>
          <p>Learn numbers from 1 to 100 step by step.</p>
        </div>
      </div>
    </div>
  );
}