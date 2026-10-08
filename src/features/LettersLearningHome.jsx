// import { useNavigate } from "react-router-dom";
// import "../styles/LettersLearningHome.css";

// export default function LettersLearningHome() {
//   const navigate = useNavigate();

//   const learningCards = [
//     {
//       icon: "🦊",
//       title: "E-Learning",
//       subtitle: "Learn A to Z with pictures",
//       path: "/alphabet-learning",
//       color: "yellow",
//     },
//     {
//       icon: "🐨",
//       title: "Flash Cards",
//       subtitle: "Learn letters using cards",
//       path: "/alphabet-flashcard",
//       color: "blue",
//     },
//     {
//       icon: "🦁",
//       title: "Uppercase & Lowercase",
//       subtitle: "Match capital and small letters",
//       path: "/alphabet-uppercase-lowercase",
//       color: "pink",
//     },
//     {
//       icon: "🐵",
//       title: "Animal Letter Path",
//       subtitle: "Practice letters with animals",
//       path: "/animal-letter-path",
//       color: "purple",
//     },
//     {
//       icon: "🐰",
//       title: "Letter Tracing",
//       subtitle: "Trace and write letters",
//       path: "/alphabet-letter-tracing",
//       color: "green",
//     },
//   ];

//   const handleCardKeyDown = (event, path) => {
//     if (
//       event.key === "Enter" ||
//       event.key === " "
//     ) {
//       event.preventDefault();
//       navigate(path);
//     }
//   };

//   return (
//     <div className="letters-learning-page">

//       {/* Decorative elements */}
//       <div className="letters-learning-decor decor-top-left"></div>

//       <div className="letters-learning-decor decor-middle-right"></div>

//       <div className="letters-learning-decor decor-bottom-left"></div>

//       {/* Header */}
//       <div className="letters-learning-topbar">
//         <h1 className="letters-learning-title">
//           🌿 Letters Learning
//         </h1>
//       </div>

//       {/* Top animals */}
//       <div className="letters-learning-header">
//         <div className="letters-learning-animals top-animals">
//           <span>🦒</span>
//           <span>🐘</span>
//           <span>🐦</span>
//         </div>
//       </div>

//       {/* Learning cards */}
//       <div className="letters-learning-list">

//         {learningCards.map(
//           (card, index) => (
//             <div
//               key={index}
//               className="letters-learning-card"
//               onClick={() =>
//                 navigate(card.path)
//               }
//               onKeyDown={(event) =>
//                 handleCardKeyDown(
//                   event,
//                   card.path
//                 )
//               }
//               role="button"
//               tabIndex={0}
//               aria-label={`Open ${card.title}`}
//             >

//               <div
//                 className={`letters-learning-icon ${card.color}`}
//               >
//                 {card.icon}
//               </div>

//               <div className="letters-learning-text">
//                 <h2>
//                   {card.title}
//                 </h2>

//                 <p>
//                   {card.subtitle}
//                 </p>
//               </div>

//               <div className="letters-learning-arrow">
//                 →
//               </div>

//             </div>
//           )
//         )}

//       </div>

//       {/* Footer */}
//       <div className="letters-learning-footer">

//         <div className="letters-learning-progress">
//           <h3>
//             Letter Zone
//           </h3>

//           <p>
//             Learn, trace, match, and
//             practice all letters from
//             A to Z.
//           </p>
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
      helper: "LEARN A TO Z",
      category: "LEARN",
      path: "/alphabet-learning",
      number: "01",
    },
    {
      icon: "🐨",
      title: "Flash Cards",
      subtitle: "Learn letters using cards",
      helper: "SEE & REMEMBER",
      category: "PRACTICE",
      path: "/alphabet-flashcard",
      number: "02",
    },
    {
      icon: "🦁",
      title: "Uppercase & Lowercase",
      subtitle: "Match capital and small letters",
      helper: "MATCH LETTERS",
      category: "MATCH",
      path: "/alphabet-uppercase-lowercase",
      number: "03",
    },
    {
      icon: "🐵",
      title: "Animal Letter Path",
      subtitle: "Practice letters with animals",
      helper: "FOLLOW THE PATH",
      category: "EXPLORE",
      path: "/animal-letter-path",
      number: "04",
    },
    {
      icon: "🐰",
      title: "Letter Tracing",
      subtitle: "Trace and write letters",
      helper: "TRACE & WRITE",
      category: "WRITE",
      path: "/alphabet-letter-tracing",
      number: "05",
    },
  ];

  const handleBack = () => {
    navigate("/letters-home");
  };

  return (
    <div className="letters-learning-page">

      {/* =====================================================
          JUNGLE BACKGROUND
      ===================================================== */}

      <div className="letters-learning-canopy letters-learning-canopy-left">
        <span>🌿</span>
        <span>🍃</span>
        <span>🌿</span>
      </div>

      <div className="letters-learning-canopy letters-learning-canopy-right">
        <span>🌿</span>
        <span>🍃</span>
        <span>🌿</span>
      </div>

      <div className="letters-learning-mist letters-learning-mist-one" />
      <div className="letters-learning-mist letters-learning-mist-two" />

      <div className="letters-learning-floating-leaves">
        <span className="learning-leaf learning-leaf-one">
          🍃
        </span>

        <span className="learning-leaf learning-leaf-two">
          🌿
        </span>

        <span className="learning-leaf learning-leaf-three">
          🍃
        </span>
      </div>

      {/* =====================================================
          FIXED NAVBAR
      ===================================================== */}

      <header className="letters-learning-header">

        <button
          type="button"
          className="letters-learning-brand"
          onClick={handleBack}
        >
          <div className="letters-learning-brand-icon">
            🔤
          </div>

          <div className="letters-learning-brand-text">
            <h1>CurioKids</h1>
            <span>LETTER LEARNING</span>
          </div>
        </button>

        <div className="letters-learning-header-message">
          <span>🌱</span>
          <strong>
            Choose a skill and explore!
          </strong>
        </div>

        <button
          type="button"
          className="letters-learning-back"
          onClick={handleBack}
        >
          ← Back
        </button>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="letters-learning-content">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="letters-learning-hero">

          <div className="letters-learning-hero-copy">

            <span className="letters-learning-kicker">
              🌿 YOUR LETTER LEARNING MAP
            </span>

            <h2>
              Explore Your Letter Skills
            </h2>

            <p>
              Learn letters, practice sounds,
              trace, match and grow your confidence!
            </p>

            <div className="letters-learning-traits">
              <span>🔤 Learn</span>
              <span>🎯 Focus</span>
              <span>🌈 Grow</span>
            </div>

          </div>

        </section>

        {/* ===================================================
            LEARNING SECTION
        =================================================== */}

        <section className="letters-learning-section">

          <div className="letters-learning-section-heading">

            <div>
              <span className="letters-learning-section-kicker">
                YOUR LEARNING ADVENTURE
              </span>

              <h2>
                Choose your skill 🗺️
              </h2>
            </div>

            <div className="letters-learning-count">
              <strong>5</strong>

              <span>
                SKILLS TO EXPLORE
              </span>
            </div>

          </div>

          {/* =================================================
              LEARNING CARDS
          ================================================= */}

          <div className="letters-learning-grid">

            {learningCards.map((card) => (
              <article
                key={card.path}
                className="letters-learning-card"
                onClick={() => navigate(card.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    navigate(card.path);
                  }
                }}
              >

                {/* CATEGORY */}
                <div className="letters-learning-card-category">
                  {card.category}
                </div>

                {/* MAIN */}
                <div className="letters-learning-card-main">

                  <div className="letters-learning-icon-wrap">
                    {card.icon}
                  </div>

                  <div className="letters-learning-card-text">

                    <h3>
                      {card.title}
                    </h3>

                    <p>
                      {card.subtitle}
                    </p>

                  </div>

                </div>

                {/* BOTTOM */}
                <div className="letters-learning-card-bottom">

                  <button
                    type="button"
                    className="letters-learning-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(card.path);
                    }}
                  >
                    <span>
                      EXPLORE
                    </span>

                    <span className="letters-learning-arrow">
                      →
                    </span>
                  </button>

                  <span className="letters-learning-helper">
                    {card.helper}
                  </span>

                </div>

                {/* DECORATION */}
                <span className="letters-learning-card-leaf">
                  🍃
                </span>

                <span className="letters-learning-number">
                  {card.number}
                </span>

              </article>
            ))}

          </div>

        </section>

        {/* ===================================================
            JUNGLE TIP
        =================================================== */}

        <div className="letters-learning-tip">

          <div className="letters-learning-tip-icon">
            💡
          </div>

          <div className="letters-learning-tip-content">

            <strong>
              JUNGLE TIP
            </strong>

            <p>
              Take your time, listen carefully,
              and celebrate every letter you learn!
            </p>

          </div>

          <div className="letters-learning-tip-plants">
            🌿🍃
          </div>

        </div>

      </main>

    </div>
  );
}