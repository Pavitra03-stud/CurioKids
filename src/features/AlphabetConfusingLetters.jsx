import { useState } from "react";
import BackIcon from "../components/BackIcon";

export default function ConfusingLetters({ goBack }) {

  const sets = [
    ["b", "d", "p", "q"],
    ["m", "n", "w"],
    ["u", "v"],
  ];

  const [index, setIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [message, setMessage] = useState("");

  const letters = sets[index];
  const target = letters[targetIndex];

  const check = (letter) => {
    if (letter === target) {
      setMessage("Correct 🎉");
      setTimeout(() => {
        setTargetIndex((prev) => (prev + 1) % letters.length);
        setMessage("");
      }, 1000);
    } else {
      setMessage("Wrong ❌");
    }
  };

  return (
    <div style={styles.page}>
      <BackIcon goBack={goBack} />

      <h1>Find: {target}</h1>

      <div style={styles.grid}>
        {letters.map((l, i) => (
          <button key={i} style={styles.btn} onClick={() => check(l)}>
            {l}
          </button>
        ))}
      </div>

      <p>{message}</p>
    </div>
  );
}

const styles = {
  page: { textAlign: "center", padding: "20px" },
  grid: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" },
  btn: { fontSize: "30px", padding: "15px" }
};