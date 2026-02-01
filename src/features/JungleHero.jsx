import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";

export default function JungleHero({ onComplete, goBack }) {
  const [friend, setFriend] = useState(null);

  // 🌿 Load selected jungle friend
  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");
    if (savedFriend) {
      setFriend(JSON.parse(savedFriend));
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#1b5e20, #4caf50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px",
        color: "white",
        position: "relative",
      }}
    >
      {/* 🔙 GLOBAL BACK ICON */}
      <BackIcon goBack={goBack} />

      {/* LEFT CONTENT */}
      <div>
        <h1>
          A Joyful Start to Your <br />
          <span style={{ color: "#FFD54F" }}>Learning Jungle!</span>
        </h1>

        <p>
          Fun games, friendly animals, <br />
          and AI-powered learning support.
        </p>

        <div style={{ marginTop: "30px" }}>
          {/* 🧒 STUDENT → KidsHome */}
          <button
            onClick={() => onComplete("kids-home")}
            style={buttonStyle("#FFD54F")}
          >
            STUDENT 🌱
          </button>

          {/* 👨‍👩‍👧 PARENT → ParentDashboard */}
          <button
            onClick={() => onComplete("parent-dashboard")}
            style={buttonStyle("#ffffff")}
          >
            PARENT 👨‍👩‍👧
          </button>
        </div>
      </div>

      {/* RIGHT FRIEND */}
      {friend && (
        <div style={{ textAlign: "center" }}>
          <img
            src={friend.image}
            alt={friend.name}
            style={{ width: "300px" }}
          />
          <p style={{ marginTop: "10px", fontSize: "18px" }}>
            Hi, I’m <b>{friend.name}</b> 🐾
          </p>
        </div>
      )}
    </div>
  );
}

const buttonStyle = (bg) => ({
  marginRight: "20px",
  padding: "14px 28px",
  fontSize: "16px",
  borderRadius: "14px",
  border: "none",
  cursor: "pointer",
  background: bg,
});
