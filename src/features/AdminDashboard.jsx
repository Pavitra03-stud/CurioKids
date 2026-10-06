// // import { useEffect, useState } from "react";
// // import { db } from "../firebase";
// // import { collection, getDocs } from "firebase/firestore";
// // import "../styles/AdminDashboard.css";

// // export default function AdminDashboard({ navigate, goBack }) {
// //   const [activeSection, setActiveSection] = useState("dashboard");

// //   const [users, setUsers] = useState([]);
// //   const [games, setGames] = useState([]);
// //   const [activities, setActivities] = useState([]);

// //   // 🔥 FETCH DATA
// //   useEffect(() => {
// //     fetchUsers();
// //     fetchGames();
// //     fetchActivities();
// //   }, []);

// //   const fetchUsers = async () => {
// //     const snap = await getDocs(collection(db, "users"));
// //     setUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// //   };

// //   const fetchGames = async () => {
// //     const snap = await getDocs(collection(db, "games"));
// //     setGames(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// //   };

// //   const fetchActivities = async () => {
// //     const snap = await getDocs(collection(db, "activity"));
// //     setActivities(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
// //   };

// //   // 🤖 AI DATA
// //   const aiActivities = activities.filter((a) => a.action === "ai_test");

// //   const avgScore =
// //     aiActivities.length > 0
// //       ? (
// //           aiActivities.reduce((acc, a) => acc + (a.score || 0), 0) /
// //           aiActivities.length
// //         ).toFixed(1)
// //       : 0;

// //   // 🟢 DASHBOARD
// //   const renderDashboard = () => (
// //     <>
// //       <div className="admin-card-grid">
// //         <div className="admin-stat-card">
// //           <div className="admin-stat-value">{users.length}</div>
// //           <div>Total Users</div>
// //         </div>

// //         <div className="admin-stat-card">
// //           <div className="admin-stat-value">{games.length}</div>
// //           <div>Total Games</div>
// //         </div>

// //         <div className="admin-stat-card">
// //           <div className="admin-stat-value">{avgScore}%</div>
// //           <div>Avg AI Score</div>
// //         </div>

// //         <div className="admin-stat-card">
// //           <div className="admin-stat-value">{aiActivities.length}</div>
// //           <div>AI Tests</div>
// //         </div>
// //       </div>

// //       <div className="admin-panel">
// //         <h3>🕒 Recent AI Activity</h3>

// //         {aiActivities.length === 0 ? (
// //           <div className="admin-empty-box">No activity yet</div>
// //         ) : (
// //           aiActivities.slice(0, 5).map((a) => (
// //             <div key={a.id} className="admin-activity-item">
// //               <strong>{a.userId}</strong>
// //               <span>
// //                 {" "}
// //                 wrote {a.extraData?.letter} ({a.score}%)
// //               </span>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </>
// //   );

// //   // 📈 REPORTS
// //   const renderReports = () => (
// //     <div className="admin-panel">
// //       <h3>📈 User Activity Report</h3>

// //       {activities.length === 0 ? (
// //         <div className="admin-empty-box">No activity</div>
// //       ) : (
// //         activities.map((a) => (
// //           <div key={a.id} className="admin-list-row">
// //             <div>
// //               <div>{a.action}</div>
// //               <div>User: {a.userId}</div>
// //               <div>Screen: {a.screen}</div>
// //             </div>
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );

// //   // 🤖 AI REPORT
// //   const renderAI = () => (
// //     <div className="admin-panel">
// //       <h3>🤖 AI Writing Report</h3>

// //       {aiActivities.map((a) => (
// //         <div key={a.id} className="admin-list-row">
// //           <div>
// //             <div>User: {a.userId}</div>
// //             <div>Letter: {a.extraData?.letter}</div>
// //             <div>Score: {a.score}%</div>
// //             <div>Status: {a.extraData?.status}</div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );

// //   // 👥 USERS
// //   const renderUsers = () => (
// //     <div className="admin-panel">
// //       <h3>👥 Users</h3>

// //       {users.map((u) => (
// //         <div key={u.id} className="admin-list-row">
// //           <div>
// //             <div>{u.name || "User"}</div>
// //             <div>{u.email}</div>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );

// //   // 🎯 MAIN SWITCH
// //   const renderContent = () => {
// //     if (activeSection === "dashboard") return renderDashboard();
// //     if (activeSection === "reports") return renderReports();
// //     if (activeSection === "ai") return renderAI();
// //     if (activeSection === "users") return renderUsers();
// //   };

// //   return (
// //     <div className="admin-page">
// //       {/* SIDEBAR */}
// //       <aside className="admin-sidebar">
// //         <h2>🧑‍💼 Admin</h2>

// //         <button onClick={goBack}>← Back</button>

// //         <button onClick={() => setActiveSection("dashboard")}>
// //           📊 Dashboard
// //         </button>

// //         <button onClick={() => setActiveSection("reports")}>
// //           📈 Reports
// //         </button>

// //         <button onClick={() => setActiveSection("ai")}>
// //           🤖 AI Data
// //         </button>

// //         <button onClick={() => setActiveSection("users")}>
// //           👥 Users
// //         </button>
// //       </aside>

// //       {/* MAIN */}
// //       <main className="admin-main">
// //         <h2>Admin Dashboard</h2>
// //         {renderContent()}
// //       </main>
// //     </div>
// //   );
// // }



// import { useEffect, useState } from "react";
// import { db } from "../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import "../styles/AdminDashboard.css";

// export default function AdminDashboard({ navigate, goBack }) {
//   const [active, setActive] = useState("dashboard");

//   const [users, setUsers] = useState([]);
//   const [activities, setActivities] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//     fetchActivities();
//   }, []);

//   const fetchUsers = async () => {
//     const snap = await getDocs(collection(db, "users"));
//     setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   };

//   const fetchActivities = async () => {
//     const snap = await getDocs(collection(db, "activity"));
//     setActivities(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//   };

//   // 🔥 AI DATA
//   const ai = activities.filter((a) => a.action === "ai_test");

//   const avg =
//     ai.length > 0
//       ? (
//           ai.reduce((acc, a) => acc + (a.score || 0), 0) / ai.length
//         ).toFixed(1)
//       : 0;

//   // 📊 DASHBOARD
//   const Dashboard = () => (
//     <>
//       <div className="admin-card-grid">
//         <div className="admin-stat-card">
//           <div>{users.length}</div>
//           <span>Users</span>
//         </div>

//         <div className="admin-stat-card">
//           <div>{ai.length}</div>
//           <span>AI Tests</span>
//         </div>

//         <div className="admin-stat-card">
//           <div>{avg}%</div>
//           <span>Avg Score</span>
//         </div>
//       </div>

//       <div className="admin-panel">
//         <h3>Recent AI Activity</h3>

//         {ai.slice(0, 5).map((a) => (
//           <div key={a.id}>
//             {a.userId} → {a.extraData?.letter} ({a.score}%)
//           </div>
//         ))}
//       </div>
//     </>
//   );

//   // 🤖 AI REPORT
//   const AIReport = () => (
//     <div className="admin-panel">
//       <h3>AI Report</h3>

//       {ai.map((a) => (
//         <div key={a.id}>
//           {a.userId} | {a.extraData?.letter} | {a.score}% |{" "}
//           {a.extraData?.status}
//         </div>
//       ))}
//     </div>
//   );

//   // 👥 USERS
//   const Users = () => (
//     <div className="admin-panel">
//       <h3>Users</h3>

//       {users.map((u) => (
//         <div
//           key={u.id}
//           onClick={() => navigate("user-report", u.id)}
//           style={{ cursor: "pointer" }}
//         >
//           {u.name}
//         </div>
//       ))}
//     </div>
//   );

//   const render = () => {
//     if (active === "dashboard") return <Dashboard />;
//     if (active === "ai") return <AIReport />;
//     if (active === "users") return <Users />;
//   };

//   return (
//     <div className="admin-page">
//       <aside className="admin-sidebar">
//         <button onClick={goBack}>← Back</button>

//         <button onClick={() => setActive("dashboard")}>Dashboard</button>
//         <button onClick={() => setActive("ai")}>AI Data</button>
//         <button onClick={() => setActive("users")}>Users</button>
//       </aside>

//       <main className="admin-main">{render()}</main>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import "../styles/AdminDashboard.css";

export default function AdminDashboard({
  navigate,
  goBack,
}) {
  const [active, setActive] =
    useState("dashboard");

  const [users, setUsers] =
    useState([]);

  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH ADMIN DATA
  // =====================================================

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        usersSnap,
        activitySnap,
      ] = await Promise.all([
        getDocs(
          collection(db, "users")
        ),
        getDocs(
          collection(db, "activity")
        ),
      ]);

      const userData =
        usersSnap.docs.map(
          (d) => ({
            id: d.id,
            ...d.data(),
          })
        );

      const activityData =
        activitySnap.docs.map(
          (d) => ({
            id: d.id,
            ...d.data(),
          })
        );

      setUsers(userData);
      setActivities(activityData);

      console.log(
        "👥 Users:",
        userData
      );

      console.log(
        "📊 Activities:",
        activityData
      );
    } catch (err) {
      console.error(
        "❌ Admin data error:",
        err
      );

      setError(
        "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AI ACTIVITIES
  // =====================================================

  const aiActivities =
    activities.filter(
      (activity) =>
        activity.action ===
        "ai_test"
    );

  // =====================================================
  // AVERAGE AI SCORE
  // =====================================================

  const averageScore =
    aiActivities.length > 0
      ? (
          aiActivities.reduce(
            (total, activity) =>
              total +
              Number(
                activity.score || 0
              ),
            0
          ) /
          aiActivities.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // DASHBOARD
  // =====================================================

  const Dashboard = () => (
    <>
      <div className="admin-card-grid">

        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {users.length}
          </div>

          <span>
            👥 Total Users
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {activities.length}
          </div>

          <span>
            📊 Activities
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {aiActivities.length}
          </div>

          <span>
            🤖 AI Tests
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {averageScore}%
          </div>

          <span>
            ⭐ Avg AI Score
          </span>
        </div>

      </div>

      {/* RECENT ACTIVITY */}

      <div className="admin-panel">

        <h3>
          🕒 Recent Activity
        </h3>

        {activities.length === 0 ? (
          <div className="admin-empty-box">
            No activity yet.
          </div>
        ) : (
          activities
            .slice(-10)
            .reverse()
            .map((activity) => (
              <div
                key={activity.id}
                className="admin-list-row"
              >
                <div>
                  <strong>
                    {activity.action ||
                      "Activity"}
                  </strong>

                  <div>
                    User:{" "}
                    {getUserName(
                      activity.userId
                    )}
                  </div>

                  {activity.screen && (
                    <div>
                      Screen:{" "}
                      {
                        activity.screen
                      }
                    </div>
                  )}

                  {activity.score !==
                    undefined && (
                    <div>
                      Score:{" "}
                      {
                        activity.score
                      }%
                    </div>
                  )}
                </div>
              </div>
            ))
        )}

      </div>
    </>
  );

  // =====================================================
  // REPORTS
  // =====================================================

  const Reports = () => (
    <div className="admin-panel">

      <h3>
        📈 User Activity Report
      </h3>

      {activities.length === 0 ? (
        <div className="admin-empty-box">
          No activity yet.
        </div>
      ) : (
        activities.map(
          (activity) => (
            <div
              key={activity.id}
              className="admin-list-row"
            >
              <div>

                <strong>
                  {activity.action ||
                    "Activity"}
                </strong>

                <div>
                  User:{" "}
                  {getUserName(
                    activity.userId
                  )}
                </div>

                <div>
                  UID:{" "}
                  {activity.userId ||
                    "Unknown"}
                </div>

                {activity.screen && (
                  <div>
                    Screen:{" "}
                    {
                      activity.screen
                    }
                  </div>
                )}

                {activity.score !==
                  undefined && (
                  <div>
                    Score:{" "}
                    {
                      activity.score
                    }%
                  </div>
                )}

              </div>
            </div>
          )
        )
      )}

    </div>
  );

  // =====================================================
  // AI REPORT
  // =====================================================

  const AIReport = () => (
    <div className="admin-panel">

      <h3>
        🤖 AI Writing Report
      </h3>

      {aiActivities.length ===
      0 ? (
        <div className="admin-empty-box">
          No AI activity yet.
        </div>
      ) : (
        aiActivities.map(
          (activity) => (
            <div
              key={activity.id}
              className="admin-list-row"
            >
              <div>

                <strong>
                  User:{" "}
                  {getUserName(
                    activity.userId
                  )}
                </strong>

                <div>
                  Letter:{" "}
                  {activity.extraData
                    ?.letter ||
                    "-"}
                </div>

                <div>
                  Score:{" "}
                  {activity.score ||
                    0}
                  %
                </div>

                <div>
                  Status:{" "}
                  {activity.extraData
                    ?.status ||
                    "-"}
                </div>

              </div>
            </div>
          )
        )
      )}

    </div>
  );

  // =====================================================
  // USERS
  // =====================================================

  const Users = () => (
    <div className="admin-panel">

      <h3>
        👥 Users
      </h3>

      {users.length === 0 ? (
        <div className="admin-empty-box">
          No users found.
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="admin-list-row"
            onClick={() =>
              navigate(
                "user-report",
                user.id
              )
            }
            style={{
              cursor: "pointer",
            }}
          >
            <div>

              <strong>
                {user.name ||
                  "User"}
              </strong>

              <div>
                {user.email ||
                  "No email"}
              </div>

              <div>
                UID: {user.id}
              </div>

            </div>
          </div>
        ))
      )}

    </div>
  );

  // =====================================================
  // USER NAME HELPER
  // =====================================================

  const getUserName = (
    userId
  ) => {
    if (!userId) {
      return "Unknown User";
    }

    const user = users.find(
      (item) =>
        item.id === userId
    );

    return (
      user?.name ||
      user?.email ||
      userId
    );
  };

  // =====================================================
  // CONTENT
  // =====================================================

  const renderContent = () => {
    if (active === "dashboard") {
      return <Dashboard />;
    }

    if (active === "reports") {
      return <Reports />;
    }

    if (active === "ai") {
      return <AIReport />;
    }

    if (active === "users") {
      return <Users />;
    }

    return <Dashboard />;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-page">

        <aside className="admin-sidebar">
          <h2>
            🧑‍💼 Admin
          </h2>

          <button
            onClick={goBack}
          >
            ← Back
          </button>
        </aside>

        <main className="admin-main">

          <h2>
            Admin Dashboard
          </h2>

          <div className="admin-panel">
            <h3>
              📊 Loading admin data...
            </h3>

            <p>
              Please wait...
            </p>
          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="admin-page">

        <aside className="admin-sidebar">
          <h2>
            🧑‍💼 Admin
          </h2>

          <button
            onClick={goBack}
          >
            ← Back
          </button>
        </aside>

        <main className="admin-main">

          <h2>
            Admin Dashboard
          </h2>

          <div className="admin-panel">

            <h3>
              ❌ {error}
            </h3>

            <button
              onClick={
                loadAdminData
              }
            >
              🔄 Retry
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <h2>
          🧑‍💼 Admin
        </h2>

        <button
          onClick={goBack}
        >
          ← Back
        </button>

        <button
          onClick={() =>
            setActive(
              "dashboard"
            )
          }
        >
          📊 Dashboard
        </button>

        <button
          onClick={() =>
            setActive(
              "reports"
            )
          }
        >
          📈 Reports
        </button>

        <button
          onClick={() =>
            setActive("ai")
          }
        >
          🤖 AI Data
        </button>

        <button
          onClick={() =>
            setActive("users")
          }
        >
          👥 Users
        </button>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        <h2>
          Admin Dashboard
        </h2>

        {renderContent()}

      </main>

    </div>
  );
}