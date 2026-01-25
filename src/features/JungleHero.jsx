import { useEffect, useState } from "react";

export default function JungleHero({ goTo }) {
  const [friend, setFriend] = useState(null);

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
      }}
    >
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
          {/* ✅ STUDENT → KidsHome */}
          <button
            onClick={() => goTo("kids-home")}
            style={{
              marginRight: "20px",
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            STUDENT 🌱
          </button>

          {/* ✅ PARENT → ParentDashboard */}
          <button
            onClick={() => goTo("parent-dashboard")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
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
