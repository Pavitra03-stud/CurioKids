import { useState } from "react";
import BackIcon from "../components/BackIcon";

export default function LetterTracing({ goBack }) {

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % letters.length);
  };

  return (
    <div style={styles.page}>
      <BackIcon goBack={goBack} />

      <h1>Trace the Letter</h1>

      <div style={styles.traceBox}>
        {letters[index]}
      </div>

      <button style={styles.btn} onClick={next}>
        Next ➡
      </button>
    </div>
  );
}

const styles = {
  page: { textAlign: "center", padding: "20px" },
  traceBox: {
    fontSize: "120px",
    border: "2px dashed #999",
    padding: "40px",
    margin: "30px auto",
    width: "200px"
  },
  btn: {
    padding: "10px 20px",
    fontSize: "18px"
  }
};