export default function AIButton({ navigate }) {
  return (
    <button
      onClick={() => navigate("ai-chat")}
      style={styles.button}
      title="Ask AI 🤖"
    >
      🤖
    </button>
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
    fontSize: "24px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
    zIndex: 999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  }
};