import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp
} from "firebase/firestore";

export default function DailyPractice() {

  const DAILY_GOAL = 5;

  const [completed, setCompleted] = useState(0);
  const [message, setMessage] = useState("");

  const userEmail = "demo_user";

  const today = new Date().toISOString().split("T")[0];

  // 🔥 LOAD TODAY DATA
  const loadTodayProgress = async () => {
    try {
      const docRef = doc(
        db,
        "users",
        userEmail,
        "daily_progress",
        today
      );

      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setCompleted(snap.data().completed);
      } else {
        await setDoc(docRef, {
          date: today,
          completed: 0,
          goal: DAILY_GOAL,
          createdAt: Timestamp.now()
        });
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTodayProgress();
  }, []);

  // 🎯 COMPLETE ONE TASK
  const handlePractice = async () => {

    if (completed >= DAILY_GOAL) return;

    const newValue = completed + 1;
    setCompleted(newValue);

    const docRef = doc(
      db,
      "users",
      userEmail,
      "daily_progress",
      today
    );

    await setDoc(docRef, {
      date: today,
      completed: newValue,
      goal: DAILY_GOAL,
      updatedAt: Timestamp.now()
    });

    if (newValue === DAILY_GOAL) {
      setMessage("🎉 Daily Goal Completed!");
    } else {
      setMessage("👍 Keep going!");
    }
  };

  // 📊 PROGRESS %
  const progressPercent = (completed / DAILY_GOAL) * 100;

  return (
    <div className="blend-container">

      <h2>🌞 Daily Practice Goal</h2>

      <h3>
        {completed} / {DAILY_GOAL} completed
      </h3>

      {/* 🔥 PROGRESS BAR */}
      <div
        style={{
          width: "80%",
          height: "20px",
          background: "#ddd",
          margin: "20px auto",
          borderRadius: "10px"
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "green",
            borderRadius: "10px"
          }}
        ></div>
      </div>

      <button onClick={handlePractice}>
        ✅ Complete Practice
      </button>

      <p>{message}</p>

      {completed >= DAILY_GOAL && (
        <h3>🏆 Goal Achieved Today!</h3>
      )}

    </div>
  );
}