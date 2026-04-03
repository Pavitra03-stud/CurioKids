import { useState, useEffect } from "react";
import BackIcon from "../components/BackIcon";
import { generateLetterSet } from "../services/aiEngine"; // ✅ AI

export default function ConfusingLetters({ goBack }) {

  const [letters, setLetters] = useState([]);
  const [targetIndex, setTargetIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🚀 LOAD AI QUESTIONS
  useEffect(() => {
    loadAI();
  }, []);

  const loadAI = async () => {
    setLoading(true);

    try {
      const res = await generateLetterSet();

      // 👉 convert "b,d,p,q" → ["b","d","p","q"]
      const arr = res.replace(/\s/g, "").split(",");

      setLetters(arr);
      setTargetIndex(0);

    } catch (err) {
      console.log(err);

      // fallback if AI fails
      setLetters(["b", "d", "p", "q"]);
    }

    setLoading(false);
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading AI... 🤖</h2>;
  }

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

      {/* 🔁 Reload AI Questions */}
      <button style={styles.reload} onClick={loadAI}>
        🔄 New AI Questions
      </button>
    </div>
  );
}

const styles = {
  page: { textAlign: "center", padding: "20px" },

  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px"
  },

  btn: {
    fontSize: "30px",
    padding: "15px",
    cursor: "pointer"
  },

  reload: {
    marginTop: "20px",
    padding: "10px",
    cursor: "pointer"
  }
};