import "../styles/LettersLearningHome.css";
import BackIcon from "../components/BackIcon";

export default function LettersLearningHome({ navigate, goBack }) {
  const options = [
    {
      title: "E-Learning",
      subtitle: "Learn A to Z with pictures",
      screen: "alphabet-learning",
      animal: "🦊",
    },
    {
      title: "Flash Cards",
      subtitle: "Learn letters using cards",
      screen: "alphabet-flashcard",
      animal: "🐼",
    },
    {
      title: "Uppercase & Lowercase",
      subtitle: "Match capital and small letters",
      screen: "uppercase-lowercase",
      animal: "🦁",
    },
    {
      title: "Confusing Letters",
      subtitle: "Practice b, d, p, q",
      screen: "confusing-letters",
      animal: "🐵",
    },
    {
      title: "Letter Tracing",
      subtitle: "Trace and write letters",
      screen: "letter-tracing",
      animal: "🐰",
    },
  ];

  return (
    <div className="letters-learning-page">
      <div className="floating-bg bubble1"></div>
      <div className="floating-bg bubble2"></div>
      <div className="floating-bg bubble3"></div>

      <BackIcon goBack={goBack} />

      <div className="letters-learning-header">
        <div className="header-mascots">
          <span>🦒</span>
          <span>🐘</span>
          <span>🦜</span>
        </div>
        <h1>Letters Learning</h1>
        <p>Choose a fun animal learning activity</p>
      </div>

      <div className="letters-learning-container">
        {options.map((item, index) => (
          <div
            key={index}
            className="learning-card"
            onClick={() => navigate(item.screen)}
          >
            <div className="card-left">
              <div className="animal-icon">{item.animal}</div>

              <div className="card-text">
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
              </div>
            </div>

            <span className="arrow">➜</span>
          </div>
        ))}
      </div>

      <div className="bottom-animals">
        <span>🐯</span>
        <span>🐻</span>
        <span>🦓</span>
      </div>
    </div>
  );
}