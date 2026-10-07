import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/practiceHome.css";

const practiceActivities = [
  {
    title: "Letter Tracing",
    description: "Trace letters carefully and build strong writing skills.",
    helper: "TRACE & LEARN",
    category: "LETTERS",
    icon: "✏️",
    path: "/letter-tracing",
  },
  {
    title: "Letter Recognition",
    description: "Find and recognize letters quickly and confidently.",
    helper: "FIND THE LETTER",
    category: "LETTERS",
    icon: "🔤",
    path: "/letter-recognition",
  },
  {
    title: "Uppercase vs Lowercase",
    description: "Match uppercase letters with their lowercase partners.",
    helper: "MATCH THE LETTERS",
    category: "LETTERS",
    icon: "🔠",
    path: "/uppercase-lowercase",
  },
  {
    title: "Find the Correct Letter",
    description: "Look carefully and choose the correct letter.",
    helper: "LOOK & CHOOSE",
    category: "FOCUS",
    icon: "🔎",
    path: "/find-letter",
  },
  {
    title: "Confusing Letters",
    description: "Practice letters that can look tricky or confusing.",
    helper: "THINK CAREFULLY",
    category: "FOCUS",
    icon: "🤔",
    path: "/confusing-letters",
  },
  {
    title: "Beginning Sounds",
    description: "Listen and identify the sound at the beginning of a word.",
    helper: "LISTEN & FIND",
    category: "PHONICS",
    icon: "🔊",
    path: "/beginning-sounds",
  },
  {
    title: "Ending Sounds",
    description: "Listen closely and find the sound at the end of each word.",
    helper: "HEAR THE ENDING",
    category: "PHONICS",
    icon: "🎵",
    path: "/ending-sounds",
  },
  {
    title: "Sound Matching",
    description: "Match words and pictures that share the same sound.",
    helper: "LISTEN & MATCH",
    category: "LISTEN",
    icon: "🎧",
    path: "/sound-matching",
  },
  {
    title: "Rhyming Words",
    description: "Find words that sound alike at the end.",
    helper: "FIND THE RHYME",
    category: "PHONICS",
    icon: "🎶",
    path: "/rhyming-words",
  },
  {
    title: "Blend Sounds",
    description: "Put individual sounds together to make a word.",
    helper: "BLEND & READ",
    category: "PHONICS",
    icon: "🧩",
    path: "/blend-sounds",
  },
  {
    title: "Break the Word",
    description: "Break words into their individual sounds.",
    helper: "BREAK IT DOWN",
    category: "PHONICS",
    icon: "🔤",
    path: "/break-word",
  },
  {
    title: "Build the Word",
    description: "Build words by putting the right letters together.",
    helper: "BUILD & LEARN",
    category: "WORDS",
    icon: "🧱",
    path: "/build-word",
  },
  {
    title: "Missing Letter",
    description: "Find the missing letter and complete the word.",
    helper: "FIND THE MISSING ONE",
    category: "WORDS",
    icon: "❓",
    path: "/missing-letter",
  },
  {
    title: "Sight Words",
    description: "Practice common words and recognize them quickly.",
    helper: "READ & REMEMBER",
    category: "WORDS",
    icon: "👀",
    path: "/sight-words",
  },
  {
    title: "Word Scramble",
    description: "Arrange mixed-up letters to make the correct word.",
    helper: "UNSCRAMBLE",
    category: "WORDS",
    icon: "🔀",
    path: "/word-scramble",
  },
  {
    title: "Match Word to Picture",
    description: "Connect each word with the picture that matches it.",
    helper: "MATCH & LEARN",
    category: "WORDS",
    icon: "🖼️",
    path: "/match-word-picture",
  },
  {
    title: "Sentence Builder",
    description: "Put words in the right order to build a sentence.",
    helper: "BUILD A SENTENCE",
    category: "WORDS",
    icon: "📝",
    path: "/sentence-builder",
  },
  {
    title: "Memory Match - Letters",
    description: "Match letter pairs and strengthen your memory.",
    helper: "REMEMBER & MATCH",
    category: "MEMORY",
    icon: "🧠",
    path: "/memory-match?mode=letters",
  },
  {
    title: "Memory Match - Numbers",
    description: "Match number pairs and train your visual memory.",
    helper: "REMEMBER & MATCH",
    category: "MEMORY",
    icon: "🔢",
    path: "/memory-match?mode=numbers",
  },
  {
    title: "Spot Difference",
    description: "Look closely and find the different letter.",
    helper: "LOOK CLOSELY",
    category: "VISUAL",
    icon: "👁️",
    path: "/spot-difference?mode=letters",
  },
  {
    title: "Find Hidden - Letters",
    description: "Search the scene and find the hidden letters.",
    helper: "SEARCH & FIND",
    category: "VISUAL",
    icon: "🔍",
    path: "/find-hidden?mode=letters",
  },
  {
    title: "Find Hidden - Numbers",
    description: "Search carefully and discover hidden numbers.",
    helper: "SEARCH & FIND",
    category: "VISUAL",
    icon: "🔢",
    path: "/find-hidden?mode=numbers",
  },
  {
    title: "Left / Right - Letters",
    description: "Practice left and right using letters.",
    helper: "LEFT & RIGHT",
    category: "FOCUS",
    icon: "↔️",
    path: "/left-right-practice?mode=letters",
  },
  {
    title: "Left / Right - Numbers",
    description: "Practice left and right using numbers.",
    helper: "LEFT & RIGHT",
    category: "FOCUS",
    icon: "↔️",
    path: "/left-right-practice?mode=numbers",
  },
  {
    title: "Pattern Matching",
    description: "Observe patterns and choose the matching one.",
    helper: "SPOT THE PATTERN",
    category: "VISUAL",
    icon: "🧩",
    path: "/pattern-matching",
  },
  {
    title: "Sequence Builder - Letters",
    description: "Arrange letters in the correct sequence.",
    helper: "BUILD THE SEQUENCE",
    category: "SEQUENCE",
    icon: "🔡",
    path: "/sequence-builder?mode=letters",
  },
  {
    title: "Sequence Builder - Numbers",
    description: "Arrange numbers in the correct sequence.",
    helper: "BUILD THE SEQUENCE",
    category: "SEQUENCE",
    icon: "🔢",
    path: "/sequence-builder?mode=numbers",
  },
];

function PracticeHome() {
  const navigate = useNavigate();

  return (
    <div className="practice-home-page">

      {/* =========================
          DECORATIVE JUNGLE
      ========================= */}

      <div className="practice-canopy practice-canopy-left">
        <span>🌿</span>
        <span>🍃</span>
        <span>🌿</span>
      </div>

      <div className="practice-canopy practice-canopy-right">
        <span>🌿</span>
        <span>🍃</span>
        <span>🌿</span>
      </div>

      <div className="practice-mist practice-mist-one"></div>
      <div className="practice-mist practice-mist-two"></div>

      <div className="practice-floating-leaves">
        <span className="practice-leaf leaf-one">🍃</span>
        <span className="practice-leaf leaf-two">🌿</span>
        <span className="practice-leaf leaf-three">🍃</span>
      </div>

      {/* =========================
          FIXED NAVBAR
      ========================= */}

      <header className="practice-header">

        <div
          className="practice-brand"
          onClick={() => navigate("/")}
        >
          <div className="practice-brand-icon">
            🌴
          </div>

          <div className="practice-brand-text">
            <h1>CurioKids</h1>
            <span>JUNGLE PRACTICE</span>
          </div>
        </div>

        <div className="practice-header-message">
          <span>🌱</span>
          <strong>Choose a skill and explore!</strong>
        </div>

      </header>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="practice-content">

        {/* =========================
            HERO
        ========================= */}

        <section className="practice-hero">

          <div className="practice-hero-copy">

            <span className="practice-kicker">
              🌿 YOUR PRACTICE MAP
            </span>

            <h2>
              Choose your practice
            </h2>

            <p>
              Pick one and start your jungle learning adventure!
            </p>

            <div className="practice-traits">
              <span>🧠 Think</span>
              <span>🎯 Focus</span>
              <span>🌈 Learn</span>
            </div>

          </div>

        </section>

        {/* =========================
            PRACTICE SECTION
        ========================= */}

        <section className="practice-section">

          <div className="practice-section-heading">

            <div>
              <span className="practice-section-kicker">
                YOUR ADVENTURE MAP
              </span>

              <h2>
                Explore your skills 🗺️
              </h2>
            </div>

            <div className="practice-count">
              <strong>{practiceActivities.length}</strong>
              <span>SKILLS TO EXPLORE</span>
            </div>

          </div>

          {/* =========================
              CARDS
          ========================= */}

          <div className="practice-grid">

            {practiceActivities.map((activity, index) => (

              <article
                className="practice-card"
                key={activity.title}
              >

                {/* Top category */}
                <div className="practice-card-category">
                  {activity.category}
                </div>

                {/* Main content */}
                <div className="practice-card-main">

                  <div className="practice-icon-wrap">
                    <span className="practice-icon">
                      {activity.icon}
                    </span>
                  </div>

                  <div className="practice-card-text">

                    <h3>
                      {activity.title}
                    </h3>

                    <p>
                      {activity.description}
                    </p>

                  </div>

                </div>

                {/* Bottom information */}
                <div className="practice-card-bottom">

                  <button
                    type="button"
                    className="practice-button"
                    onClick={() => navigate(activity.path)}
                  >
                    <span>PRACTICE</span>
                    <span className="practice-arrow">›</span>
                  </button>

                  <span className="practice-helper">
                    {activity.helper}
                  </span>

                  <span className="practice-card-leaf">
                    🍃
                  </span>

                </div>

                {/* Number */}
                <span className="practice-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

              </article>

            ))}

          </div>

        </section>

        {/* =========================
            JUNGLE TIP
        ========================= */}

        <div className="practice-tip">

          <div className="practice-tip-icon">
            💡
          </div>

          <div>
            <strong>JUNGLE TIP</strong>

            <p>
              Take your time, focus on one activity, and enjoy learning!
            </p>
          </div>

          <div className="practice-tip-plants">
            🌿🍃
          </div>

        </div>

      </main>

    </div>
  );
}

export default PracticeHome;