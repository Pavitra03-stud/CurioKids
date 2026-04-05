import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProgressStars() {

  const userEmail = "demo_user";

  const [stars, setStars] = useState(0);
  const [level, setLevel] = useState("");

  // 🔥 LOAD DATA
  const loadStars = async () => {
    try {
      const ref = doc(db, "users", userEmail, "rewards", "summary");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const totalStars = snap.data().stars || 0;
        setStars(totalStars);
        calculateLevel(totalStars);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStars();
  }, []);

  // 🎯 LEVEL CALCULATION
  const calculateLevel = (stars) => {
    if (stars >= 20) setLevel("🏆 Champion");
    else if (stars >= 10) setLevel("🌟 Star");
    else if (stars >= 5) setLevel("📘 Learner");
    else setLevel("🌱 Beginner");
  };

  // 📊 PROGRESS BAR (max = 20 for full)
  const progressPercent = Math.min((stars / 20) * 100, 100);

  return (
    <div className="blend-container">

      <h2>⭐ Progress Stars</h2>

      <h1>⭐ {stars}</h1>

      <h3>{level}</h3>

      {/* 🔥 PROGRESS BAR */}
      <div
        style={{
          width: "80%",
          height: "25px",
          background: "#ddd",
          margin: "20px auto",
          borderRadius: "10px"
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "gold",
            borderRadius: "10px"
          }}
        ></div>
      </div>

      <p>Keep practicing to earn more stars ⭐</p>

    </div>
  );
}