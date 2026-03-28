import { useState } from "react";
import BackIcon from "../components/BackIcon";

export default function ConnectLetters({ goBack }) {
  const sequence = ["A", "B", "C", "D"];
  const [current, setCurrent] = useState(0);

  const handleClick = (letter) => {
    if (letter === sequence[current]) {
      setCurrent(current + 1);
      if (current === sequence.length - 1) {
        alert("Great Job!");
        setCurrent(0);
      }
    } else {
      alert("Wrong order!");
      setCurrent(0);
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <BackIcon goBack={goBack} />
      <h1>🔗 Connect Letters</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {sequence.map((l, i) => (
          <div
            key={i}
            onClick={() => handleClick(l)}
            style={{
              width: "80px",
              height: "80px",
              background: "#fff",
              fontSize: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}