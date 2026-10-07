// // import { useState, useEffect } from "react";
// // import "../styles/BlendSounds.css";

// // // 🔥 Firebase
// // import { db } from "../firebase";
// // import {
// //   doc,
// //   getDoc,
// //   setDoc,
// //   Timestamp
// // } from "firebase/firestore";

// // export default function DailyPractice() {

// //   const DAILY_GOAL = 5;

// //   const [completed, setCompleted] = useState(0);
// //   const [message, setMessage] = useState("");

// //   const userEmail = "demo_user";

// //   const today = new Date().toISOString().split("T")[0];

// //   // 🔥 LOAD TODAY DATA
// //   const loadTodayProgress = async () => {
// //     try {
// //       const docRef = doc(
// //         db,
// //         "users",
// //         userEmail,
// //         "daily_progress",
// //         today
// //       );

// //       const snap = await getDoc(docRef);

// //       if (snap.exists()) {
// //         setCompleted(snap.data().completed);
// //       } else {
// //         await setDoc(docRef, {
// //           date: today,
// //           completed: 0,
// //           goal: DAILY_GOAL,
// //           createdAt: Timestamp.now()
// //         });
// //       }

// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   useEffect(() => {
// //     loadTodayProgress();
// //   }, []);

// //   // 🎯 COMPLETE ONE TASK
// //   const handlePractice = async () => {

// //     if (completed >= DAILY_GOAL) return;

// //     const newValue = completed + 1;
// //     setCompleted(newValue);

// //     const docRef = doc(
// //       db,
// //       "users",
// //       userEmail,
// //       "daily_progress",
// //       today
// //     );

// //     await setDoc(docRef, {
// //       date: today,
// //       completed: newValue,
// //       goal: DAILY_GOAL,
// //       updatedAt: Timestamp.now()
// //     });

// //     if (newValue === DAILY_GOAL) {
// //       setMessage("🎉 Daily Goal Completed!");
// //     } else {
// //       setMessage("👍 Keep going!");
// //     }
// //   };

// //   // 📊 PROGRESS %
// //   const progressPercent = (completed / DAILY_GOAL) * 100;

// //   return (
// //     <div className="blend-container">

// //       <h2>🌞 Daily Practice Goal</h2>

// //       <h3>
// //         {completed} / {DAILY_GOAL} completed
// //       </h3>

// //       {/* 🔥 PROGRESS BAR */}
// //       <div
// //         style={{
// //           width: "80%",
// //           height: "20px",
// //           background: "#ddd",
// //           margin: "20px auto",
// //           borderRadius: "10px"
// //         }}
// //       >
// //         <div
// //           style={{
// //             width: `${progressPercent}%`,
// //             height: "100%",
// //             background: "green",
// //             borderRadius: "10px"
// //           }}
// //         ></div>
// //       </div>

// //       <button onClick={handlePractice}>
// //         ✅ Complete Practice
// //       </button>

// //       <p>{message}</p>

// //       {completed >= DAILY_GOAL && (
// //         <h3>🏆 Goal Achieved Today!</h3>
// //       )}

// //     </div>
// //   );
// // }


// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   Timestamp
// } from "firebase/firestore";

// // ✅ GameContext
// import { useGame } from "../context/GameContext";

// export default function DailyPractice() {

//   const { addStars } = useGame(); // ✅ ADDED

//   const DAILY_GOAL = 5;

//   const [completed, setCompleted] = useState(0);
//   const [message, setMessage] = useState("");

//   const userId = localStorage.getItem("userId"); // ✅ FIXED

//   const today = new Date().toISOString().split("T")[0];

//   // 🔥 LOAD TODAY DATA
//   const loadTodayProgress = async () => {
//     try {
//       if (!userId) return;

//       const docRef = doc(
//         db,
//         "users",
//         userId,
//         "daily_progress",
//         today
//       );

//       const snap = await getDoc(docRef);

//       if (snap.exists()) {
//         setCompleted(snap.data().completed);
//       } else {
//         await setDoc(docRef, {
//           date: today,
//           completed: 0,
//           goal: DAILY_GOAL,
//           createdAt: Timestamp.now()
//         });
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadTodayProgress();
//   }, []);

//   // ✅ ACTIVITY LOGGER
//   const logActivity = async (count) => {
//     if (!userId) return;

//     await setDoc(
//       doc(db, "users", userId, "daily_activity", today),
//       {
//         completed: count,
//         updatedAt: Timestamp.now()
//       },
//       { merge: true }
//     );
//   };

//   // 🎯 COMPLETE ONE TASK
//   const handlePractice = async () => {

//     if (completed >= DAILY_GOAL) return;

//     const newValue = completed + 1;
//     setCompleted(newValue);

//     const docRef = doc(
//       db,
//       "users",
//       userId,
//       "daily_progress",
//       today
//     );

//     await setDoc(docRef, {
//       date: today,
//       completed: newValue,
//       goal: DAILY_GOAL,
//       updatedAt: Timestamp.now()
//     });

//     // ✅ LOG ACTIVITY
//     await logActivity(newValue);

//     // 🎯 REWARD WHEN GOAL COMPLETED
//     if (newValue === DAILY_GOAL) {

//       await addStars(100, "Daily Practice"); // ⭐ BIG REWARD

//       setMessage("🎉 Daily Goal Completed!");
//     } else {
//       setMessage("👍 Keep going!");
//     }
//   };

//   // 📊 PROGRESS %
//   const progressPercent = (completed / DAILY_GOAL) * 100;

//   return (
//     <div className="blend-container">

//       <h2>🌞 Daily Practice Goal</h2>

//       <h3>
//         {completed} / {DAILY_GOAL} completed
//       </h3>

//       {/* 🔥 PROGRESS BAR */}
//       <div
//         style={{
//           width: "80%",
//           height: "20px",
//           background: "#ddd",
//           margin: "20px auto",
//           borderRadius: "10px"
//         }}
//       >
//         <div
//           style={{
//             width: `${progressPercent}%`,
//             height: "100%",
//             background: "green",
//             borderRadius: "10px",
//             transition: "0.3s"
//           }}
//         ></div>
//       </div>

//       <button onClick={handlePractice}>
//         ✅ Complete Practice
//       </button>

//       <p>{message}</p>

//       {completed >= DAILY_GOAL && (
//         <h3>🏆 Goal Achieved Today!</h3>
//       )}

//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";

import "../styles/DailyPractice.css";
import { db } from "../firebase";
import { useGame } from "../context/GameContext";

const DAILY_TASKS = [
  {
    id: "letter-mastery",
    title: "Letter Mastery",
    description: "Practice recognizing and learning letters.",
    emoji: "🔤",
    route: "/practice-letter-mastery",
  },
  {
    id: "phonics",
    title: "Phonics Power",
    description: "Practice sounds and letter combinations.",
    emoji: "🔊",
    route: "/practice-phonics",
  },
  {
    id: "word-builder",
    title: "Word Builder",
    description: "Build simple words and improve spelling.",
    emoji: "🧩",
    route: "/practice-word-builder",
  },
  {
    id: "memory",
    title: "Memory & Visual Skills",
    description: "Improve memory and visual recognition.",
    emoji: "🧠",
    route: "/practice-memory",
  },
  {
    id: "confidence",
    title: "Confidence Boost",
    description: "Practice and build learning confidence.",
    emoji: "🌟",
    route: "/practice-confidence",
  },
];

const getToday = () => {
  const now = new Date();

  return now.toISOString().split("T")[0];
};

export default function DailyPractice() {
  const navigate = useNavigate();

  const { addStars } = useGame();

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  const [completedTasks, setCompletedTasks] = useState([]);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = getToday();

  /*
  |--------------------------------------------------------------------------
  | LOAD TODAY'S DAILY PRACTICE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadDailyPractice = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const dailyRef = doc(
          db,
          "users",
          userId,
          "daily_practice",
          today
        );

        const snapshot = await getDoc(dailyRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setCompletedTasks(
            data.completedTasks || []
          );

          setRewardClaimed(
            data.rewardClaimed || false
          );
        } else {
          setCompletedTasks([]);
          setRewardClaimed(false);
        }
      } catch (error) {
        console.error(
          "❌ Error loading daily practice:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDailyPractice();
  }, [userId, today]);

  /*
  |--------------------------------------------------------------------------
  | SAVE DAILY PRACTICE
  |--------------------------------------------------------------------------
  */

  const saveDailyPractice = async (
    updatedTasks,
    updatedRewardClaimed
  ) => {
    if (!userId) return;

    try {
      const dailyRef = doc(
        db,
        "users",
        userId,
        "daily_practice",
        today
      );

      await setDoc(
        dailyRef,
        {
          userId,
          date: today,
          completedTasks: updatedTasks,
          rewardClaimed: updatedRewardClaimed,
          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      console.log(
        "✅ Daily practice saved"
      );
    } catch (error) {
      console.error(
        "❌ Error saving daily practice:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COMPLETE TASK
  |--------------------------------------------------------------------------
  */

  const completeTask = async (taskId) => {
    if (completedTasks.includes(taskId)) {
      return;
    }

    const updatedTasks = [
      ...completedTasks,
      taskId,
    ];

    setCompletedTasks(updatedTasks);

    await saveDailyPractice(
      updatedTasks,
      rewardClaimed
    );
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN TASK
  |--------------------------------------------------------------------------
  */

  const openTask = (task) => {
    /*
     * Mark the task as visited/completed.
     *
     * The actual learning activity can also
     * complete the task later.
     */
    completeTask(task.id);

    navigate(task.route);
  };

  /*
  |--------------------------------------------------------------------------
  | COMPLETE ENTIRE DAY
  |--------------------------------------------------------------------------
  */

  const allCompleted =
    completedTasks.length === DAILY_TASKS.length;

  useEffect(() => {
    const claimDailyReward = async () => {
      if (!allCompleted) return;

      if (rewardClaimed) return;

      /*
       * Prevent duplicate rewards.
       */
      setRewardClaimed(true);

      await saveDailyPractice(
        completedTasks,
        true
      );

      /*
       * Award the daily reward only once.
       */
      await addStars(
        100,
        "Daily Practice"
      );

      console.log(
        "🎉 Daily Practice completed!"
      );
    };

    claimDailyReward();
  }, [
    allCompleted,
    rewardClaimed,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PROGRESS
  |--------------------------------------------------------------------------
  */

  const completedCount =
    completedTasks.length;

  const progressPercentage =
    (completedCount / DAILY_TASKS.length) *
    100;

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="daily-practice-page">
        <div className="daily-loading">
          <h2>🌿 Loading today's practice...</h2>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="daily-practice-page">

      <div className="daily-header">

       

        <div>
          <h1>
            🌟 Daily Practice
          </h1>

          <p>
            A little practice every day
            makes you stronger!
          </p>
        </div>

      </div>

      {/* PROGRESS */}

      <div className="daily-progress-card">

        <div className="daily-progress-top">

          <span>
            Today's Progress
          </span>

          <strong>
            {completedCount} /{" "}
            {DAILY_TASKS.length}
          </strong>

        </div>

        <div className="daily-progress-bar">

          <div
            className="daily-progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>

        <p>
          {allCompleted
            ? "🎉 Amazing! You completed today's practice!"
            : "Keep going! You can do it! 💪"}
        </p>

      </div>

      {/* TASKS */}

      <div className="daily-task-grid">

        {DAILY_TASKS.map((task) => {

          const completed =
            completedTasks.includes(task.id);

          return (
            <div
              key={task.id}
              className={`daily-task-card ${
                completed
                  ? "completed"
                  : ""
              }`}
            >

              <div className="daily-task-icon">
                {task.emoji}
              </div>

              <div className="daily-task-content">

                <h2>
                  {task.title}
                </h2>

                <p>
                  {task.description}
                </p>

                {completed && (
                  <span className="daily-completed">
                    ✓ Completed
                  </span>
                )}

              </div>

              <button
                className="daily-task-button"
                onClick={() =>
                  openTask(task)
                }
              >
                {completed
                  ? "Practice Again"
                  : "Start"}
              </button>

            </div>
          );
        })}

      </div>

      {/* REWARD */}

      {allCompleted && (
        <div className="daily-reward-card">

          <div className="daily-reward-icon">
            🏆
          </div>

          <div>
            <h2>
              Daily Practice Complete!
            </h2>

            <p>
              {rewardClaimed
                ? "Your daily reward has already been claimed! ⭐"
                : "Amazing work! Your reward is being added..."}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}