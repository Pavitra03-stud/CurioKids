import { useEffect, useState } from "react";
import "../styles/Profile.css";
import { useGame } from "../context/GameContext";

export default function Profile() {
  const { stars } = useGame();

  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("🐵");

  // 🎭 SKINS
  const skins = [
    { icon: "🐵", cost: 0 },
    { icon: "🦊", cost: 5 },
    { icon: "🐯", cost: 10 },
    { icon: "🦁", cost: 15 },
    { icon: "🐸", cost: 20 },
  ];

  // 🔥 LOAD DATA
  useEffect(() => {
    const child = JSON.parse(localStorage.getItem("childProfile"));
    const avatar = localStorage.getItem("avatar");

    if (child) setName(child.name);
    if (avatar) setSelectedAvatar(avatar);
  }, []);

  // 💾 SAVE NAME
  const saveName = () => {
    if (!name.trim()) return;

    const child = JSON.parse(localStorage.getItem("childProfile")) || {};
    child.name = name.trim();

    localStorage.setItem("childProfile", JSON.stringify(child));
    setEditing(false);
  };

  // 🎯 SELECT AVATAR
  const selectAvatar = (skin) => {
    if (stars < skin.cost) {
      alert("❌ Not enough stars!");
      return;
    }

    setSelectedAvatar(skin.icon);
    localStorage.setItem("avatar", skin.icon);
  };

  return (
    <div className="profile-page">

      {/* 👤 NAME SECTION */}
      <div className="name-section">
        {editing ? (
          <>
            <input
              className="name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="save-btn" onClick={saveName}>
              Save ✅
            </button>
          </>
        ) : (
          <>
            <h1>👤 {name}</h1>
            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit
            </button>
          </>
        )}
      </div>

      {/* 🎭 AVATAR */}
      <div className="avatar-preview">
        {selectedAvatar}
      </div>

      <h2>🎨 Choose Your Avatar</h2>

      <div className="avatar-grid">
        {skins.map((skin, i) => {
          const unlocked = stars >= skin.cost;

          return (
            <div
              key={i}
              className={`avatar-card ${
                unlocked ? "unlocked" : "locked"
              }`}
              onClick={() => unlocked && selectAvatar(skin)}
            >
              <span className="avatar-icon">{skin.icon}</span>

              {unlocked ? (
                <p>✅</p>
              ) : (
                <p>🔒 {skin.cost}⭐</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ⭐ STARS */}
      <div className="stars-box">
        ⭐ Stars: {stars}
      </div>

    </div>
  );
}