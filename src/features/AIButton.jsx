import { useNavigate } from "react-router-dom";

export default function AIButton() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/ai-chat")}
      style={styles.button}
      title="Ask AI 🤖"
    >
      🤖
    </div>
  );
}

const styles = {
  button: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    fontSize: "26px",
    background: "#4CAF50",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
  }
};