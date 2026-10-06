// import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import "../styles/UserReport.css";

// export default function UserReport({ userId, goBack }) {
//   const [activities, setActivities] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const snap = await getDocs(collection(db, "activity"));

//     const data = snap.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     // 🔥 Filter this user's AI data
//     const userData = data.filter(
//       (a) => a.userId === userId && a.action === "ai_test"
//     );

//     setActivities(userData);
//   };

//   // 📊 Average
//   const avg =
//     activities.length > 0
//       ? (
//           activities.reduce((acc, a) => acc + (a.score || 0), 0) /
//           activities.length
//         ).toFixed(1)
//       : 0;

//   // 🔴 Weak letters
//   const weakLetters = activities
//     .filter((a) => a.score < 30)
//     .map((a) => a.extraData?.letter);

//   return (
//     <div className="user-report-page">
//       <button onClick={goBack}>← Back</button>

//       <h2>👶 User Report</h2>

//       <h3>Average Score: {avg}%</h3>

//       {/* 🔥 GRID */}
//       <div className="result-grid">
//         {activities.map((a, index) => {
//           const color =
//             a.extraData?.status === "correct"
//               ? "green"
//               : a.extraData?.status === "practice"
//               ? "orange"
//               : "red";

//           return (
//             <div key={index} className={`result-item ${color}`}>
//               {a.extraData?.letter}
//             </div>
//           );
//         })}
//       </div>

//       {/* ❌ WEAK */}
//       <div style={{ marginTop: "20px" }}>
//         <h4>⚠️ Weak Letters</h4>
//         {weakLetters.length === 0 ? (
//           <p>None 🎉</p>
//         ) : (
//           <p>{weakLetters.join(", ")}</p>
//         )}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "../styles/UserReport.css";

export default function UserReport({ userId, goBack }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH USER AI ACTIVITY
  // =====================================================

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * 🔥 Fetch only this user's activity
       *
       * Instead of downloading every activity document
       * and filtering on the frontend.
       */
      const activityQuery = query(
        collection(db, "activity"),
        where("userId", "==", userId),
        where("action", "==", "ai_test")
      );

      const snap = await getDocs(
        activityQuery
      );

      const data = snap.docs.map(
        (activityDoc) => ({
          id: activityDoc.id,
          ...activityDoc.data(),
        })
      );

      setActivities(data);

      console.log(
        "📊 User AI activity:",
        data
      );
    } catch (err) {
      console.error(
        "❌ Error fetching report:",
        err
      );

      setError(
        "Unable to load the user's report."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AVERAGE SCORE
  // =====================================================

  const avg =
    activities.length > 0
      ? (
          activities.reduce(
            (acc, activity) =>
              acc +
              Number(
                activity.score || 0
              ),
            0
          ) /
          activities.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // WEAK LETTERS
  // =====================================================

  const weakLetters = activities
    .filter(
      (activity) =>
        Number(
          activity.score || 0
        ) < 30
    )
    .map(
      (activity) =>
        activity.extraData?.letter
    )
    .filter(Boolean);

  // Remove duplicate letters
  const uniqueWeakLetters = [
    ...new Set(weakLetters),
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="user-report-page">

        <button onClick={goBack}>
          ← Back
        </button>

        <h2>
          👶 User Report
        </h2>

        <p>
          📊 Loading report...
        </p>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="user-report-page">

        <button onClick={goBack}>
          ← Back
        </button>

        <h2>
          👶 User Report
        </h2>

        <p>
          ❌ {error}
        </p>

        <button onClick={fetchData}>
          🔄 Try Again
        </button>

      </div>
    );
  }

  // =====================================================
  // REPORT
  // =====================================================

  return (
    <div className="user-report-page">

      <button onClick={goBack}>
        ← Back
      </button>

      <h2>
        👶 User Report
      </h2>

      {/* AVERAGE */}

      <h3>
        Average Score: {avg}%
      </h3>

      {/* NO DATA */}

      {activities.length === 0 ? (
        <div className="result-grid">
          <p>
            No AI test activity found yet. 🌱
          </p>
        </div>
      ) : (
        <>
          {/* RESULT GRID */}

          <div className="result-grid">

            {activities.map(
              (activity) => {

                const status =
                  activity.extraData
                    ?.status;

                const color =
                  status ===
                  "correct"
                    ? "green"
                    : status ===
                      "practice"
                    ? "orange"
                    : "red";

                return (
                  <div
                    key={
                      activity.id
                    }
                    className={`result-item ${color}`}
                    title={`Score: ${
                      activity.score ||
                      0
                    }%`}
                  >
                    {
                      activity
                        .extraData
                        ?.letter
                    }
                  </div>
                );
              }
            )}

          </div>

          {/* WEAK LETTERS */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h4>
              ⚠️ Weak Letters
            </h4>

            {uniqueWeakLetters.length ===
            0 ? (
              <p>
                None 🎉
              </p>
            ) : (
              <p>
                {uniqueWeakLetters.join(
                  ", "
                )}
              </p>
            )}

          </div>
        </>
      )}

    </div>
  );
}