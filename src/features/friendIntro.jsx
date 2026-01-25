import { useEffect, useState } from "react";

export default function FriendIntro({ onComplete }) {
  const [friend, setFriend] = useState(null);

  /* ✅ LOAD FRIEND FROM LOCAL STORAGE */
  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");
    if (savedFriend) {
      setFriend(JSON.parse(savedFriend));
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem("appProgress", "entered-jungle-home");
    onComplete();
  };

  if (!friend) return null; // safety

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* 🦊 CHARACTER SIDE */}
        <div style={styles.characterWrap}>
          <img
            src={friend.image}
            alt={friend.name}
            style={styles.character}
          />
        </div>

        {/* 💬 MESSAGE SIDE */}
        <div style={styles.messageBox}>
          <h2 style={styles.title}>🌟 Welcome to CurioKids!</h2>

          <p style={styles.text}>
            Hi there! 👋  
            <br /><br />
            I’m <strong>{friend.name}</strong>, your jungle friend, and I’m
            *so proud of you* for starting this learning adventure 🌈  
            <br /><br />
            We’ll play fun games 🎮, solve puzzles 🧩, and grow smarter every
            single day 🌱  
            <br /><br />
            Are you ready to explore the jungle with me? 🐾
          </p>

          <button style={styles.button} onClick={handleEnter}>
            Enter Jungle Home 🌴
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES (UNCHANGED) */
const styles = {
  overlay: {
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #1b5e20, #43a047)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    background: "#fff3d6",
    padding: "40px 50px",
    borderRadius: "30px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
    maxWidth: "900px",
  },

  characterWrap: {
    animation: "slideIn 0.8s ease-out",
  },

  character: {
    width: "240px",
    height: "240px",
    objectFit: "contain",
    filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.25))",
  },

  messageBox: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    maxWidth: "420px",
    position: "relative",
  },

  title: {
    marginBottom: "12px",
    color: "#2e7d32",
  },

  text: {
    fontSize: "15.5px",
    lineHeight: "1.6",
    color: "#333",
    marginBottom: "20px",
  },

  button: {
    background: "#ff9800",
    color: "#fff",
    border: "none",
    padding: "14px 26px",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
