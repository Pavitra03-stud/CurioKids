import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/ParentDashboard.css";

export default function ParentDashboard({ navigate }) {

  const [parent, setParent] = useState(null);
  const [child, setChild] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [practiceRewards, setPracticeRewards] = useState(null);

  // 🤖 AI CHAT STATES (NEW)
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // 🤖 SEND MESSAGE FUNCTION (NEW)
  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = { type: "user", text: question };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: child?._id || "69be509b3193e4d163dd7885",
          question,
        }),
      });

      const data = await res.json();

      const botMessage = {
        type: "bot",
        text: data.answer,
      };

      setMessages(prev => [...prev, botMessage]);
      setQuestion("");

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

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

        {/* 🏆 REWARDS */}
        <div className="parent-card">
          <h2>🏆 Rewards & Achievements</h2>

          {practiceRewards ? (
            <>
              <p><b>Total Rounds:</b> {practiceRewards.totalRounds}</p>
              <p><b>Total Stars:</b> ⭐ {practiceRewards.totalStars}</p>

              <div className="badge-grid">
                {Array.from({ length: practiceRewards.badges }).map((_, index) => (
                  <div key={index} className="badge-item">🏅</div>
                ))}
              </div>
            </>
          ) : (
            <p>No rewards yet 🌱</p>
          )}
        </div>

        {/* 🤖 AI CHATBOT (NEW SECTION) */}
        <div className="parent-card">
          <h2>🤖 AI Assistant</h2>

          <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  background: msg.type === "user" ? "#4caf50" : "#eee",
                  color: msg.type === "user" ? "white" : "black",
                  padding: "8px",
                  margin: "5px",
                  borderRadius: "8px",
                  textAlign: msg.type === "user" ? "right" : "left"
                }}
              >
                {msg.text}
              </div>
            ))}

            {loading && <p>AI is typing...</p>}
          </div>

          <div style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Ask about your child..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />
            <button onClick={sendMessage} style={{ marginLeft: "5px" }}>
              Send
            </button>
          </div>
        </div>

        <p className="growth-note">
          Growth-focused learning 🌱 No pressure. Confidence first.
        </p>

      </div>
    </div>
  );
}