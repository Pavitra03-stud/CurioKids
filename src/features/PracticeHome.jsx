import { useEffect, useRef } from "react";
import "../styles/practiceHome.css";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";

export default function PracticeHome({ navigate, goBack, initialZone }) {

  const speakText = (text) => {
    speak(text);
  };

  /* 🔥 Section Refs */
  const letterRef = useRef(null);
  const phonicsRef = useRef(null);
  const wordRef = useRef(null);
  const memoryRef = useRef(null);
  const confidenceRef = useRef(null);

  /* 🔥 Auto-scroll when coming from KidsHome */
  useEffect(() => {
    if (!initialZone) return;

    const sectionMap = {
      letterMastery: letterRef,
      phonics: phonicsRef,
      wordBuilder: wordRef,
      memory: memoryRef,
      confidence: confidenceRef,
    };

    const targetRef = sectionMap[initialZone];

    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [initialZone]);

  /* ================= ZONES ================= */

  const zones = {

    /* 🔤 LETTER ZONE */
    letterMastery: [
      { title: "Letter Tracing", route: "letter-tracing" },
      { title: "Letter Recognition", route: "letter-recognition" },
      { title: "Uppercase vs Lowercase", route: "uppercase-lowercase" },
      { title: "Find the Correct Letter", route: "find-letter" },
      { title: "Confusing Letters (b/d/p/q)", route: "confusing-letters" },
      { title: "Letter Recognition Challenge", route: "letter-recognition-challenge" }
    ],

    /* 🔊 PHONICS ZONE */
    phonics: [
      { title: "Beginning Sounds", route: "beginning-sounds" },
      { title: "Ending Sounds", route: "ending-sounds" },
      { title: "Sound Matching", route: "sound-matching" },
      { title: "Rhyming Words", route: "rhyming-words" },
      { title: "Blend Sounds", route: "blend-sounds" },
      { title: "Break the Word", route: "break-word" }
    ],

    /* 🧩 WORD BUILDER */
    wordBuilder: [
      { title: "Build the Word", route: "build-word" },
      { title: "Missing Letter", route: "missing-letter" },
      { title: "Sight Words", route: "sight-words" },
      { title: "Word Scramble", route: "word-scramble" },
      { title: "Match Word to Picture", route: "match-word-picture" },
      { title: "Sentence Builder", route: "sentence-builder" }
    ],

    /* 🧠 MEMORY */
    memory: [
      { title: "Memory Match", route: "memory-match" },
      { title: "Spot the Difference", route: "spot-difference" },
      { title: "Find Hidden Letter", route: "find-hidden-letter" },
      { title: "Left / Right Practice", route: "left-right-practice" },
      { title: "Pattern Matching", route: "pattern-matching" },
      { title: "Sequence Builder", route: "sequence-builder" }
    ],

    /* ⭐ CONFIDENCE */
    confidence: [
      { title: "Read Aloud", route: "read-aloud" },
      { title: "Timed Challenge", route: "timed-challenge" },
      { title: "Daily Practice Goal", route: "daily-practice-goal" },
      { title: "Reward Challenge", route: "reward-challenge" },
      { title: "Progress Stars", route: "progress-stars" }
    ]
  };

  return (
    <div className="practice-home">

      {/* 🌴 NAVBAR */}
      <div className="practice-navbar">

        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>

        <div className="navbar-title">
          🌟 Jungle Practice Camp
        </div>

      </div>

      <div className="practice-content">

        <p className="practice-intro">
          Choose your learning zone and grow stronger every day 💪🌿
        </p>

        {/* 🔤 LETTER MASTERY */}
        <div ref={letterRef}>
          <Section
            title="🔤 Letter Mastery Zone"
            games={zones.letterMastery}
            navigate={navigate}
            speakText={speakText}
          />
        </div>

        {/* 🔊 PHONICS */}
        <div ref={phonicsRef}>
          <Section
            title="🔊 Phonics Power Zone"
            games={zones.phonics}
            navigate={navigate}
            speakText={speakText}
          />
        </div>

        {/* 🧩 WORD BUILDER */}
        <div ref={wordRef}>
          <Section
            title="🧩 Word Builder Zone"
            games={zones.wordBuilder}
            navigate={navigate}
            speakText={speakText}
          />
        </div>

        {/* 🧠 MEMORY */}
        <div ref={memoryRef}>
          <Section
            title="🧠 Memory & Visual Skills"
            games={zones.memory}
            navigate={navigate}
            speakText={speakText}
          />
        </div>

        {/* ⭐ CONFIDENCE */}
        <div ref={confidenceRef}>
          <Section
            title="⭐ Confidence Boost Zone"
            games={zones.confidence}
            navigate={navigate}
            speakText={speakText}
          />
        </div>

      </div>

    </div>
  );
}

/* ================= SECTION ================= */

function Section({ title, games, navigate, speakText }) {
  return (
    <div className="practice-section">

      <h2 className="section-title">{title}</h2>

      <div className="practice-grid">
        {games.map((game, index) => (
          <Card
            key={index}
            title={game.title}
            onClick={() => navigate(game.route)}
            speakText={speakText}
          />
        ))}
      </div>

    </div>
  );
}

/* ================= CARD ================= */

function Card({ title, onClick, speakText }) {
  return (
    <div
      className="practice-card"
      onClick={onClick}
      onMouseEnter={() => speakText(title)}
      style={{ cursor: "pointer" }}
    >
      {title}
    </div>
  );
}