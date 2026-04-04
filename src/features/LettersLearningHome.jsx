import "../styles/LettersLearningHome.css";

export default function LettersLearningHome({ navigate, goBack }) {
  const learningCards = [
    {
      icon: "🦊",
      title: "E-Learning",
      subtitle: "Learn A to Z with pictures",
      screen: "alphabet-learning",
    },
    {
      icon: "🐨",
      title: "Flash Cards",
      subtitle: "Learn letters using cards",
      screen: "alphabet-flashcard",
    },
    {
      icon: "🦁",
      title: "Uppercase & Lowercase",
      subtitle: "Match capital and small letters",
      screen: "uppercase-lowercase",
    },
    {
      icon: "🐵",
      title: "Confusing Letters",
      subtitle: "Practice b, d, p, q",
      screen: "confusing-letters",
    },
    {
      icon: "🐰",
      title: "Letter Tracing",
      subtitle: "Trace and write letters",
      screen: "letter-tracing",
    },
    {
      icon: "✏️",
      title: "AI Writing Test",
      subtitle: "Write A to Z on the board",
      screen: "ai-writing-test",
    },
  ];

  return (
    <div className="letters-learning-page">
      <div className="letters-learning-decor decor-top-left"></div>
      <div className="letters-learning-decor decor-middle-right"></div>
      <div className="letters-learning-decor decor-bottom-left"></div>

     <header className="letters-learning-topbar">
  <button className="letters-learning-back" onClick={goBack}>
    ←
  </button>

  <h1 className="letters-learning-title">
    🌿 Letters Learning
  </h1>
</header>

      <div className="letters-learning-animals top-animals">
        <span>🦒</span>
        <span>🐘</span>
        <span>🐦</span>
      </div>


      <div className="letters-learning-list">
        {learningCards.map((card, index) => (
          <div
            key={index}
            className="letters-learning-card"
            onClick={() => navigate(card.screen)}
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