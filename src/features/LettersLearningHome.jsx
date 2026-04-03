import "../styles/LettersLearningHome.css";
import { useNavigate } from "react-router-dom";

export default function LettersLearningHome() {
  const navigate = useNavigate();

  const learningCards = [
    {
      icon: "🦊",
      title: "E-Learning",
      subtitle: "Learn A to Z with pictures",
      path: "/alphabet-learning",
    },
    {
      icon: "🐨",
      title: "Flash Cards",
      subtitle: "Learn letters using cards",
      path: "/alphabet-flashcard",
    },
    {
      icon: "🦁",
      title: "Uppercase & Lowercase",
      subtitle: "Match capital and small letters",
      path: "/uppercase-lowercase",
    },
    {
      icon: "🐵",
      title: "Confusing Letters",
      subtitle: "Practice b, d, p, q",
      path: "/confusing-letters",
    },
    {
      icon: "🐰",
      title: "Letter Tracing",
      subtitle: "Trace and write letters",
      path: "/letter-tracing",
    },
    {
      icon: "✏️",
      title: "AI Writing Test",
      subtitle: "Write A to Z on the board",
      path: "/ai-writing-test",
    },
  ];

  return (
    <div className="letters-learning-page">
      <div className="letters-learning-decor decor-top-left"></div>
      <div className="letters-learning-decor decor-middle-right"></div>
      <div className="letters-learning-decor decor-bottom-left"></div>

      {/* ✅ FIXED BACK BUTTON */}
      <button
        className="letters-learning-back"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <div className="letters-learning-animals top-animals">
        <span>🦒</span>
        <span>🐘</span>
        <span>🐦</span>
      </div>

      <div className="letters-learning-header">
        <h1>Letters Learning</h1>
        <p>Choose a fun animal learning activity</p>
      </div>

      <div className="letters-learning-list">
        {learningCards.map((card, index) => (
          <div
            key={index}
            className="letters-learning-card"
            onClick={() => navigate(card.path)} // ✅ FIXED
          >
            <div className="letters-learning-icon">{card.icon}</div>

            <div className="letters-learning-text">
              <h2>{card.title}</h2>
              <p>{card.subtitle}</p>
            </div>

            <div className="letters-learning-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="letters-learning-footer">
        <div className="letters-learning-progress">
          <h3>Letter Zone</h3>
          <p>Learn, trace, match, and practice all letters from A to Z.</p>
        </div>

        <div className="letters-learning-animals bottom-animals">
          <span>🐯</span>
          <span>🐻</span>
          <span>🦓</span>
        </div>
      </div>
    </div>
  );
}