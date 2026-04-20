import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/UserReport.css";

export default function UserReport({ userId, goBack }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const snap = await getDocs(collection(db, "activity"));

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 🔥 Filter this user's AI data
    const userData = data.filter(
      (a) => a.userId === userId && a.action === "ai_test"
    );

    setActivities(userData);
  };

  // 📊 Average
  const avg =
    activities.length > 0
      ? (
          activities.reduce((acc, a) => acc + (a.score || 0), 0) /
          activities.length
        ).toFixed(1)
      : 0;

  // 🔴 Weak letters
  const weakLetters = activities
    .filter((a) => a.score < 30)
    .map((a) => a.extraData?.letter);

  return (
    <div className="user-report-page">
      <button onClick={goBack}>← Back</button>

      <h2>👶 User Report</h2>

      <h3>Average Score: {avg}%</h3>

      {/* 🔥 GRID */}
      <div className="result-grid">
        {activities.map((a, index) => {
          const color =
            a.extraData?.status === "correct"
              ? "green"
              : a.extraData?.status === "practice"
              ? "orange"
              : "red";

          return (
            <div key={index} className={`result-item ${color}`}>
              {a.extraData?.letter}
            </div>
          );
        })}
      </div>

      {/* ❌ WEAK */}
      <div style={{ marginTop: "20px" }}>
        <h4>⚠️ Weak Letters</h4>
        {weakLetters.length === 0 ? (
          <p>None 🎉</p>
        ) : (
          <p>{weakLetters.join(", ")}</p>
        )}
      </div>
    </div>
  );
}