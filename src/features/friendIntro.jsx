import { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";

export default function FriendIntro({ onComplete, goBack }) {
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");
    if (savedFriend) {
      setFriend(JSON.parse(savedFriend));
    }
  }, []);

  // ✅ ONLY onComplete
  const handleEnter = () => {
    localStorage.setItem("appProgress", "jungle-hero");
    onComplete(); // <-- THIS triggers App.jsx navigation
  };

  if (!friend) {
    return <h2 style={{ padding: "40px" }}>Loading jungle friend… 🌱</h2>;
  }

  return (
    <div style={styles.overlay}>
      <BackIcon goBack={goBack} />

      <div style={styles.container}>
        <img src={friend.image} alt={friend.name} style={styles.image} />

        <div style={styles.box}>
          <h2>🌟 Welcome to CurioKids!</h2>

          <p>
            Hi there! 👋 <br /><br />
            I’m <b>{friend.name}</b>, your jungle friend 🐾 <br /><br />
            Ready to explore the jungle with me?
          </p>

          <button style={styles.button} onClick={handleEnter}>
            Enter Jungle Home 🌴
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    height: "100vh",
    background: "linear-gradient(#1b5e20, #43a047)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  container: {
    background: "#fff3d6",
    padding: "40px",
    borderRadius: "24px",
    display: "flex",
    gap: "30px",
    alignItems: "center",
  },
  image: {
    width: "220px",
  },
  box: {
    maxWidth: "420px",
  },
  button: {
    marginTop: "20px",
    padding: "14px 26px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#ff9800",
    color: "#fff",
    cursor: "pointer",
  },
};
