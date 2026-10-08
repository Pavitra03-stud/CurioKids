// import React from "react";
// import "../styles/LettersHome.css";

// export default function LettersHome({
//   navigate,
//   goBack,
// }) {
//   const goToLearning = () => {
//     console.log("➡️ Opening Letters Learning Home");
//     navigate("letters-learning-home");
//   };

//   const goToGames = () => {
//     console.log("➡️ Opening Letters Game Home");
//     navigate("letters-game-home");
//   };

//   const handleBack = () => {
//     if (goBack) {
//       goBack();
//     } else {
//       navigate("kids-home");
//     }
//   };

//   return (
//     <div className="letters-home-page">
//       {/* =====================================================
//           DECORATIVE CANOPY
//       ===================================================== */}

//       <div className="letters-canopy letters-canopy-left">
//         <span>🌿</span>
//         <span>🍃</span>
//         <span>🌿</span>
//       </div>

//       <div className="letters-canopy letters-canopy-right">
//         <span>🌿</span>
//         <span>🍃</span>
//         <span>🌿</span>
//       </div>

//       {/* =====================================================
//           SOFT MIST
//       ===================================================== */}

//       <div className="letters-mist letters-mist-one" />
//       <div className="letters-mist letters-mist-two" />

//       {/* =====================================================
//           FLOATING LEAVES
//       ===================================================== */}

//       <div className="letters-floating-leaves">
//         <span className="letters-leaf leaf-one">🍃</span>
//         <span className="letters-leaf leaf-two">🌿</span>
//         <span className="letters-leaf leaf-three">🍃</span>
//       </div>

//       {/* =====================================================
//           NAVBAR
//       ===================================================== */}

//       <header className="letters-header">
//         <div
//           className="letters-brand"
//           onClick={handleBack}
//           role="button"
//           tabIndex={0}
//           onKeyDown={(event) => {
//             if (
//               event.key === "Enter" ||
//               event.key === " "
//             ) {
//               event.preventDefault();
//               handleBack();
//             }
//           }}
//         >
//           <div className="letters-brand-icon">
//             🔤
//           </div>

//           <div className="letters-brand-text">
//             <h1>CurioKids</h1>
//             <span>LETTER JUNGLE</span>
//           </div>
//         </div>

//         <div className="letters-header-message">
//           <span>🌱</span>

//           <strong>
//             Choose a letter zone and explore!
//           </strong>
//         </div>

//         <button
//           type="button"
//           className="letters-back-button"
//           onClick={handleBack}
//         >
//           ← Back
//         </button>
//       </header>

//       {/* =====================================================
//           MAIN
//       ===================================================== */}

//       <main className="letters-content">

//         {/* HERO */}

//         <section className="letters-hero">
//           <div className="letters-hero-copy">
//             <span className="letters-kicker">
//               🌿 YOUR LETTER ADVENTURE
//             </span>

//             <h2>
//               Let’s Explore Letters!
//             </h2>

//             <p>
//               Choose a zone, discover letters,
//               and build your skills one step at a time!
//             </p>

//             <div className="letters-traits">
//               <span>🔤 Learn</span>
//               <span>🎯 Focus</span>
//               <span>🌈 Grow</span>
//             </div>
//           </div>
//         </section>

//         {/* LETTER MAP */}

//         <section className="letters-section">

//           <div className="letters-section-heading">

//             <div>
//               <span className="letters-section-kicker">
//                 YOUR LETTER MAP
//               </span>

//               <h2>
//                 Choose your zone 🗺️
//               </h2>
//             </div>

//             <div className="letters-count">
//               <strong>2</strong>

//               <span>
//                 ZONES TO EXPLORE
//               </span>
//             </div>

//           </div>

//           {/* =================================================
//               CARDS
//           ================================================= */}

//           <div className="letters-grid">

//             {/* =========================
//                 LEARNING
//             ========================= */}

//             <article className="letters-card">

//               <div className="letters-card-category">
//                 LEARNING
//               </div>

//               <div className="letters-card-main">

//                 <div className="letters-icon-wrap">
//                   📚
//                 </div>

//                 <div className="letters-card-text">
//                   <h3>
//                     Letter Learning Zone
//                   </h3>

//                   <p>
//                     Practice letters, tracing,
//                     flashcards and more in a fun way.
//                   </p>
//                 </div>

//               </div>

//               <div className="letters-card-bottom">

//                 <button
//                   type="button"
//                   className="letters-practice-button"
//                   onClick={goToLearning}
//                 >
//                   <span>
//                     EXPLORE
//                   </span>

//                   <span className="letters-arrow">
//                     →
//                   </span>
//                 </button>

//                 <span className="letters-helper">
//                   LEARN & BUILD
//                 </span>

//               </div>

//               <span className="letters-card-leaf">
//                 🍃
//               </span>

//               <span className="letters-number">
//                 01
//               </span>

//             </article>

//             {/* =========================
//                 GAMING
//             ========================= */}

//             <article className="letters-card">

//               <div className="letters-card-category">
//                 PLAY
//               </div>

//               <div className="letters-card-main">

//                 <div className="letters-icon-wrap">
//                   🎮
//                 </div>

//                 <div className="letters-card-text">

//                   <h3>
//                     Letter Gaming Zone
//                   </h3>

//                   <p>
//                     Play fun letter games and
//                     improve your skills while having fun.
//                   </p>

//                 </div>

//               </div>

//               <div className="letters-card-bottom">

//                 <button
//                   type="button"
//                   className="letters-practice-button"
//                   onClick={goToGames}
//                 >
//                   <span>
//                     PLAY NOW
//                   </span>

//                   <span className="letters-arrow">
//                     →
//                   </span>
//                 </button>

//                 <span className="letters-helper">
//                   PLAY & DISCOVER
//                 </span>

//               </div>

//               <span className="letters-card-leaf">
//                 🌿
//               </span>

//               <span className="letters-number">
//                 02
//               </span>

//             </article>

//           </div>
//         </section>

//         {/* JUNGLE TIP */}

//         <div className="letters-tip">

//           <div className="letters-tip-icon">
//             💡
//           </div>

//           <div className="letters-tip-content">

//             <strong>
//               JUNGLE TIP
//             </strong>

//             <p>
//               Take your time, listen carefully,
//               and celebrate every letter you learn!
//             </p>

//           </div>

//           <div className="letters-tip-plants">
//             🌿🍃
//           </div>

//         </div>

//       </main>
//     </div>
//   );
// }




import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LettersHome.css";

export default function LettersHome() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/kids-home");
  };

  const handleLearningZone = () => {
    navigate("/letter-learning");
  };

  const handleGamingZone = () => {
    navigate("/letter-gaming");
  };

  return (
    <div className="letters-home-page">

      {/* =====================================================
          DECORATIVE CANOPY
      ===================================================== */}

      <div className="letters-canopy letters-canopy-left">
        <span>🌿</span>
        <span>🍃</span>
        <span>🌿</span>
      </div>

      <div className="letters-canopy letters-canopy-right">
        <span>🌿</span>
        <span>🍃</span>
        <span>🌿</span>
      </div>

      {/* =====================================================
          SOFT MIST
      ===================================================== */}

      <div className="letters-mist letters-mist-one" />
      <div className="letters-mist letters-mist-two" />

      {/* =====================================================
          FLOATING LEAVES
      ===================================================== */}

      <div className="letters-floating-leaves">
        <span className="letters-leaf leaf-one">🍃</span>
        <span className="letters-leaf leaf-two">🌿</span>
        <span className="letters-leaf leaf-three">🍃</span>
      </div>

      {/* =====================================================
          FIXED NAVBAR
      ===================================================== */}

      <header className="letters-header">

        {/* BRAND */}
        <button
          type="button"
          className="letters-brand"
          onClick={handleBack}
        >
          <div className="letters-brand-icon">
            🔤
          </div>

          <div className="letters-brand-text">
            <h1>CurioKids</h1>
            <span>LETTER JUNGLE</span>
          </div>
        </button>

        {/* HEADER MESSAGE */}
        <div className="letters-header-message">
          <span>🌱</span>

          <strong>
            Choose a letter zone and explore!
          </strong>
        </div>

        {/* BACK BUTTON */}
        <button
          type="button"
          className="letters-back-button"
          onClick={handleBack}
        >
          ← Back
        </button>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="letters-content">

        {/* HERO */}

        <section className="letters-hero">
          <div className="letters-hero-copy">

            <span className="letters-kicker">
              🌿 YOUR LETTER ADVENTURE
            </span>

            <h2>
              Let’s Explore Letters!
            </h2>

            <p>
              Choose a zone, discover letters,
              and build your skills one step at a time!
            </p>

            <div className="letters-traits">
              <span>🔤 Learn</span>
              <span>🎯 Focus</span>
              <span>🌈 Grow</span>
            </div>

          </div>
        </section>

        {/* ===================================================
            LETTER SECTION
        =================================================== */}

        <section className="letters-section">

          <div className="letters-section-heading">

            <div>
              <span className="letters-section-kicker">
                YOUR LETTER MAP
              </span>

              <h2>
                Choose your zone 🗺️
              </h2>
            </div>

            <div className="letters-count">
              <strong>2</strong>

              <span>
                ZONES TO EXPLORE
              </span>
            </div>

          </div>

          {/* =================================================
              ZONE CARDS
          ================================================= */}

          <div className="letters-grid">

            {/* =================================================
                LEARNING ZONE
            ================================================= */}

            <article className="letters-card">

              <div className="letters-card-category">
                LEARNING
              </div>

              <div className="letters-card-main">

                <div className="letters-icon-wrap">
                  📚
                </div>

                <div className="letters-card-text">

                  <h3>
                    Letter Learning Zone
                  </h3>

                  <p>
                    Practice letters, tracing,
                    flashcards and more in a fun way.
                  </p>

                </div>

              </div>

              <div className="letters-card-bottom">

                <button
                  type="button"
                  className="letters-practice-button"
                  onClick={handleLearningZone}
                >
                  <span>
                    EXPLORE
                  </span>

                  <span className="letters-arrow">
                    →
                  </span>
                </button>

                <span className="letters-helper">
                  LEARN & BUILD
                </span>

              </div>

              <span className="letters-card-leaf">
                🍃
              </span>

              <span className="letters-number">
                01
              </span>

            </article>

            {/* =================================================
                GAMING ZONE
            ================================================= */}

            <article className="letters-card">

              <div className="letters-card-category">
                PLAY
              </div>

              <div className="letters-card-main">

                <div className="letters-icon-wrap">
                  🎮
                </div>

                <div className="letters-card-text">

                  <h3>
                    Letter Gaming Zone
                  </h3>

                  <p>
                    Play fun letter games and
                    improve your skills while having fun.
                  </p>

                </div>

              </div>

              <div className="letters-card-bottom">

                <button
                  type="button"
                  className="letters-practice-button"
                  onClick={handleGamingZone}
                >
                  <span>
                    PLAY NOW
                  </span>

                  <span className="letters-arrow">
                    →
                  </span>
                </button>

                <span className="letters-helper">
                  PLAY & DISCOVER
                </span>

              </div>

              <span className="letters-card-leaf">
                🌿
              </span>

              <span className="letters-number">
                02
              </span>

            </article>

          </div>

        </section>

        {/* ===================================================
            JUNGLE TIP
        ===================================================== */}

        <div className="letters-tip">

          <div className="letters-tip-icon">
            💡
          </div>

          <div className="letters-tip-content">

            <strong>
              JUNGLE TIP
            </strong>

            <p>
              Take your time, listen carefully,
              and celebrate every letter you learn!
            </p>

          </div>

          <div className="letters-tip-plants">
            🌿🍃
          </div>

        </div>

      </main>

    </div>
  );
}