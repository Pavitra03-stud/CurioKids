import "../styles/practiceHome.css";
import BackIcon from "../components/BackIcon";
import { speak } from "../utils/speak";

export default function PracticeHome({ navigate, goBack }) {

  const speakText = (text) => {
    speak(text);
  };

  return (
    <div className="practice-home">

      {/* 🌴 FIXED NAVBAR */}
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
        <Section title="🔤 Letter Mastery Zone">

          <Card
            title="Letter Tracing"
            speakText={speakText}
            onClick={() => navigate("letter-tracing")}
          />

          <Card
            title="Letter Recognition"
            speakText={speakText}
            onClick={() => navigate("letter-recognition")}
          />

          <Card
            title="Uppercase vs Lowercase"
            speakText={speakText}
            onClick={() => navigate("uppercase-lowercase")}
          />

          <Card
            title="Find the Correct Letter"
            speakText={speakText}
            onClick={() => navigate("find-letter")}
          />

          <Card
            title="Confusing Letters (b/d/p/q)"
            speakText={speakText}
            onClick={() => navigate("confusing-letters")}
          />

          <Card
            title="Letter Recognition Challenge"
            speakText={speakText}
            onClick={() => navigate("letter-recognition-challenge")}
          />

        </Section>

        {/* 🔊 PHONICS */}
        <Section title="🔊 Phonics Power Zone">

          <Card title="Beginning Sounds" speakText={speakText} />
          <Card title="Ending Sounds" speakText={speakText} />
          <Card title="Sound Matching" speakText={speakText} />
          <Card title="Rhyming Words" speakText={speakText} />
          <Card title="Blend Sounds" speakText={speakText} />
          <Card title="Break the Word" speakText={speakText} />

        </Section>

        {/* 🧩 WORD BUILDER */}
        <Section title="🧩 Word Builder Zone">

          <Card title="Build the Word" speakText={speakText} />
          <Card title="Missing Letter" speakText={speakText} />
          <Card title="Sight Words" speakText={speakText} />
          <Card title="Word Scramble" speakText={speakText} />
          <Card title="Match Word to Picture" speakText={speakText} />
          <Card title="Sentence Builder" speakText={speakText} />

        </Section>

        {/* 🧠 MEMORY */}
        <Section title="🧠 Memory & Visual Skills">

          <Card title="Memory Match" speakText={speakText} />
          <Card title="Spot the Difference" speakText={speakText} />
          <Card title="Find Hidden Letter" speakText={speakText} />
          <Card title="Left / Right Practice" speakText={speakText} />
          <Card title="Pattern Matching" speakText={speakText} />
          <Card title="Sequence Builder" speakText={speakText} />

        </Section>

        {/* ⭐ CONFIDENCE */}
        <Section title="⭐ Confidence Boost Zone">

          <Card title="Read Aloud" speakText={speakText} />
          <Card title="Timed Challenge" speakText={speakText} />
          <Card title="Daily Practice Goal" speakText={speakText} />
          <Card title="Reward Challenge" speakText={speakText} />
          <Card title="Progress Stars" speakText={speakText} />

        </Section>

      </div>
    </div>
  );
}

/* 🔹 SECTION */
function Section({ title, children }) {
  return (
    <div className="practice-section">
      <h2 className="section-title">{title}</h2>
      <div className="practice-grid">
        {children}
      </div>
    </div>
  );
}

/* 🔹 CARD */
function Card({ title, onClick, speakText }) {
  return (
    <div
      className="practice-card"
      onClick={onClick}
      onMouseEnter={() => speakText(title)}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {title}
    </div>
  );
}
