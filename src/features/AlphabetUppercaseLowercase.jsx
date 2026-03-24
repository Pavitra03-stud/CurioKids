import { useState } from "react";
import BackIcon from "../components/BackIcon";

export default function UppercaseLowercase({ goBack }) {

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");

  const options = letters
    .map(l => l.toLowerCase())
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const correct = letters[index].toLowerCase();

  const check = (choice) => {
    if (choice === correct) {
      setMessage("Correct ✅");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % letters.length);
        setMessage("");
      }, 1000);
    } else {
      setMessage("Try Again ❌");
    }
  };

  return (
    <div style={styles.page}>
      <BackIcon goBack={goBack} />

      <h1>Match Uppercase & Lowercase</h1>

      <div style={styles.big}>{letters[index]}</div>

      <div style={styles.options}>
        {[correct, ...options].slice(0, 4).map((opt, i) => (
          <button key={i} style={styles.btn} onClick={() => check(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <p>{message}</p>
    </div>
  );
}

const styles = {
  page: { textAlign: "center", padding: "20px" },
  big: { fontSize: "80px", margin: "20px" },
  options: { marginTop: "20px" },
  btn: { padding: "10px 20px", margin: "5px", fontSize: "20px" }
};