// import "../styles/LettersLearningHome.css";

// export default function LettersLearningHome({ navigate, goBack }) {

//   const learningCards = [
//     {
//       icon: "🦊",
//       title: "E-Learning",
//       subtitle: "Learn A to Z with pictures",
//       path: "alphabet-learning",
//     },
//     {
//       icon: "🐨",
//       title: "Flash Cards",
//       subtitle: "Learn letters using cards",
//       path: "alphabet-flashcard",
//     },
//     {
//       icon: "🦁",
//       title: "Uppercase & Lowercase",
//       subtitle: "Match capital and small letters",
//       path: "alphabet-uppercase-lowercase",
//     },
//     {
//       icon: "🐵",
//       title: "Confusing Letters",
//       subtitle: "Practice b, d, p, q",
//       path: "alphabet-confusing-letters",
//     },
//     {
//       icon: "🐰",
//       title: "Letter Tracing",
//       subtitle: "Trace and write letters",
//       path: "alphabet-letter-tracing",
//     },
//     {
//       icon: "✏️",
//       title: "AI Writing Test",
//       subtitle: "Write A to Z on the board",
//       path: "ai-writing-test",
//     },
//   ];

//   return (
//     <div className="letters-learning-page">

//       <div className="letters-learning-decor decor-top-left"></div>
//       <div className="letters-learning-decor decor-middle-right"></div>
//       <div className="letters-learning-decor decor-bottom-left"></div>

//       {/* ✅ FIXED HEADER */}
//       <header className="letters-learning-topbar">
//         <button className="letters-learning-back" onClick={goBack}>
//           ←
//         </button>

//         <h1 className="letters-learning-title">
//           🌿 Letters Learning
//         </h1>
//       </header>

//       <div className="letters-learning-animals top-animals">
//         <span>🦒</span>
//         <span>🐘</span>
//         <span>🐦</span>
//       </div>

//       <div className="letters-learning-list">
//         {learningCards.map((card, index) => (
//           <div
//             key={index}
//             className="letters-learning-card"
//             onClick={() => navigate(card.path)}
//           >
//             <div className="letters-learning-icon">{card.icon}</div>

//             <div className="letters-learning-text">
//               <h2>{card.title}</h2>
//               <p>{card.subtitle}</p>
//             </div>

//             <div className="letters-learning-arrow">→</div>
//           </div>
//         ))}
//       </div>

//       <div className="letters-learning-footer">
//         <div className="letters-learning-progress">
//           <h3>Letter Zone</h3>
//           <p>Learn, trace, match, and practice all letters from A to Z.</p>
//         </div>

//         <div className="letters-learning-animals bottom-animals">
//           <span>🐯</span>
//           <span>🐻</span>
//           <span>🦓</span>
//         </div>
//       </div>

//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import "../styles/LettersLearningHome.css";

export default function LettersLearningHome() {
  const navigate = useNavigate();

  const learningCards = [
    {
      icon: "🦊",
      title: "E-Learning",
      subtitle: "Learn A to Z with pictures",
      path: "/alphabet-learning",
      color: "yellow",
    },
    {
      icon: "🐨",
      title: "Flash Cards",
      subtitle: "Learn letters using cards",
      path: "/alphabet-flashcard",
      color: "blue",
    },
    {
      icon: "🦁",
      title: "Uppercase & Lowercase",
      subtitle: "Match capital and small letters",
      path: "/alphabet-uppercase-lowercase",
      color: "pink",
    },
    {
      icon: "🐵",
      title: "Animal Letter Path",
      subtitle: "Practice .",
      path: "/alphabet-confusing-letters",
      color: "purple",
    },
    {
      icon: "🐰",
      title: "Letter Tracing",
      subtitle: "Trace and write letters",
      path: "/alphabet-letter-tracing",
      color: "green",
    },
  ];

  return (
    <div className="letters-learning-page">
      <div className="letters-learning-topbar">
        <h1 className="letters-learning-title">🌿 Letters Learning</h1>
      </div>

      <div className="letters-learning-decor decor-top-left"></div>
      <div className="letters-learning-decor decor-middle-right"></div>
      <div className="letters-learning-decor decor-bottom-left"></div>

      <div className="letters-learning-header">
        <div className="letters-learning-animals top-animals">
          <span>🦒</span>
          <span>🐘</span>
          <span>🐦</span>
        </div>
      </div>

      <div className="letters-learning-list">
        {learningCards.map((card, index) => (
          <div
            key={index}
            className="letters-learning-card"
            onClick={() => navigate(card.path)}
          >
            <div className={`letters-learning-icon ${card.color}`}>
              {card.icon}
            </div>

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
      </div>
    </div>
  );
}