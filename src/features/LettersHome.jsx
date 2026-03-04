import BackIcon from "../components/BackIcon";

export default function LettersHome({ navigate, goBack }) {
  return (
    <div style={{ padding: "20px" }}>

      {/* 🔝 NAVBAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60px",
          background: "#1b4332",
          color: "white",
          borderRadius: "8px",
          position: "relative",
          marginBottom: "30px"
        }}
      >
        <div style={{ position: "absolute", left: "15px" }}>
          <BackIcon goBack={goBack} />
        </div>

        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          🔤 Letters
        </div>
      </div>

      {/* 📘 LEARNING ZONE */}
      <div
        onClick={() => navigate("letters-learning-home")}
        style={{
          background: "#2d6a4f",
          padding: "25px",
          borderRadius: "12px",
          color: "white",
          fontSize: "18px",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        📘 Learning Zone
      </div>

      {/* 🎮 GAME ZONE */}
      <div
        onClick={() => navigate("letters-game-home")}
        style={{
          background: "#40916c",
          padding: "25px",
          borderRadius: "12px",
          color: "white",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        🎮 Game Zone
      </div>

    </div>
  );
}