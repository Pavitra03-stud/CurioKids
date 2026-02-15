import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/ParentDashboard.css";

export default function ParentDashboard({ navigate }) {

  const [parent, setParent] = useState(null);
  const [child, setChild] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [practiceRewards, setPracticeRewards] = useState(null);

  useEffect(() => {
    const savedParent = localStorage.getItem("parentProfile");
    const savedChild = localStorage.getItem("childProfile");
    const savedAI = localStorage.getItem("aiProgress");
    const savedRewards = localStorage.getItem("practiceData");

    if (savedParent) setParent(JSON.parse(savedParent));
    if (savedChild) setChild(JSON.parse(savedChild));
    if (savedAI) setAiData(JSON.parse(savedAI));
    if (savedRewards) setPracticeRewards(JSON.parse(savedRewards));
  }, []);

  if (!parent || !child) {
    return (
      <div style={{ padding: "120px 40px" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  const levelPercent = aiData ? (aiData.level / 5) * 100 : 0;
  const roundPercent = aiData
    ? Math.min((aiData.roundsCompleted / 10) * 100, 100)
    : 0;

  const weeklyData = practiceRewards
    ? [
        practiceRewards.totalRounds - 6,
        practiceRewards.totalRounds - 4,
        practiceRewards.totalRounds - 3,
        practiceRewards.totalRounds - 2,
        practiceRewards.totalRounds - 1,
        practiceRewards.totalRounds
      ].map(n => (n < 0 ? 0 : n))
    : [];

  return (
    <div className="parent-page">

      {/* 🌴 NAVBAR */}
      <div className="parent-navbar">
        <div className="navbar-left">
          <BackIcon goBack={() => navigate("jungle-hero")} />
        </div>
        <div className="navbar-title">
          📊 Parent Dashboard
        </div>
      </div>

      {/* 🌿 CONTENT */}
      <div className="parent-content">

        {/* 👧 CHILD PROFILE */}
        <div className="parent-card">
          <h2>👧 Child Profile</h2>
          <p><b>Name:</b> {child.name}</p>
          <p><b>Age:</b> {child.age}</p>
        </div>

        {/* 👨‍👩‍👧 PARENT PROFILE */}
        <div className="parent-card">
          <h2>👨‍👩‍👧 Parent Profile</h2>
          <p><b>Name:</b> {parent.parentName}</p>
          <p><b>Email:</b> {parent.email}</p>
          <p><b>Daily Play Limit:</b> {parent.timeLimit} mins</p>
        </div>

        {/* 🧠 AI PROGRESS */}
        <div className="parent-card">
          <h2>🧠 AI Practice Progress</h2>

          {aiData ? (
            <>
              <p><b>Current Level:</b> {aiData.level}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${levelPercent}%` }}
                />
              </div>

              <p><b>Practice Sessions Completed:</b> {aiData.roundsCompleted}</p>
              <div className="progress-bar">
                <div
                  className="progress-fill score"
                  style={{ width: `${roundPercent}%` }}
                />
              </div>

              <p><b>Most Challenging Letter:</b> {aiData.mostDifficultLetter}</p>
            </>
          ) : (
            <p>Practice data will appear after sessions are completed.</p>
          )}
        </div>

        {/* 🏆 REWARDS SECTION */}
        <div className="parent-card">
          <h2>🏆 Rewards & Achievements</h2>

          {practiceRewards ? (
            <>
              <p><b>Total Rounds:</b> {practiceRewards.totalRounds}</p>
              <p><b>Total Stars:</b> ⭐ {practiceRewards.totalStars}</p>
              <p><b>Badges Earned:</b></p>

              <div className="badge-grid">
                {Array.from({ length: practiceRewards.badges }).map((_, index) => (
                  <div key={index} className="badge-item">
                    🏅
                  </div>
                ))}
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill badge"
                  style={{
                    width: `${Math.min((practiceRewards.totalRounds / 9) * 100, 100)}%`
                  }}
                />
              </div>
            </>
          ) : (
            <p>No rewards yet. Let your child start practicing 🌱</p>
          )}
        </div>

        {/* 📊 WEEKLY ACTIVITY CHART */}
        <div className="parent-card">
          <h2>📊 Weekly Activity</h2>
          <div className="chart">
            {weeklyData.map((value, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${value * 10}px` }}
              />
            ))}
          </div>
        </div>

        {/* 📈 LETTER INSIGHT */}
        <div className="parent-card">
          <h2>📈 Letter Difficulty Insight</h2>
          {aiData ? (
            <div className="difficulty-box">
              <p>Most Challenging Letter</p>
              <div className="difficulty-letter">
                {aiData.mostDifficultLetter}
              </div>
            </div>
          ) : (
            <p>No data yet</p>
          )}
        </div>

        <p className="growth-note">
          Growth-focused learning 🌱 No pressure. Confidence first.
        </p>

      </div>
    </div>
  );
}
