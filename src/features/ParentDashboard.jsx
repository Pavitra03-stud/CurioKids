import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth } from "../firebase";

import "../styles/ParentDashboard.css";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [parent, setParent] = useState(null);
  const [child, setChild] = useState(null);
  const [friend, setFriend] = useState(null);

  const [progress, setProgress] = useState({
    stars: 0,
    streak: 0,
    history: [],
  });

  const [loadingPage, setLoadingPage] =
    useState(true);

  // =====================================================
  // FIREBASE AUTH + REAL-TIME DATA
  // =====================================================

  useEffect(() => {
    let unsubscribeUser = null;
    let unsubscribeProgress = null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          // -----------------------------------------------
          // NOT LOGGED IN
          // -----------------------------------------------

          if (!firebaseUser) {
            console.warn(
              "❌ No Firebase user"
            );

            navigate("/login");
            return;
          }

          const uid =
            firebaseUser.uid;

          console.log(
            "🔥 Parent Dashboard Firebase UID:",
            uid
          );

          // -----------------------------------------------
          // USER PROFILE - REAL TIME
          // -----------------------------------------------

          const userRef = doc(
            db,
            "users",
            uid
          );

          unsubscribeUser =
            onSnapshot(
              userRef,
              (snapshot) => {
                if (!snapshot.exists()) {
                  console.warn(
                    "⚠️ User document not found"
                  );

                  setLoadingPage(false);
                  return;
                }

                const userData =
                  snapshot.data();

                console.log(
                  "👤 Live user data:",
                  userData
                );

                // -----------------------------------------
                // PARENT
                // -----------------------------------------

                const parentProfile =
                  userData.parentProfile ||
                  {};

                setParent({
                  parentName:
                    parentProfile.parentName ||
                    "",
                  email:
                    parentProfile.email ||
                    userData.email ||
                    "",
                  timeLimit:
                    parentProfile.timeLimit ||
                    "",
                });

                // -----------------------------------------
                // CHILD
                // -----------------------------------------

                const childProfile =
                  userData.childProfile ||
                  {};

                setChild({
                  name:
                    childProfile.name ||
                    "",
                  age:
                    childProfile.age ||
                    "",
                });

                // -----------------------------------------
                // JUNGLE FRIEND
                // -----------------------------------------

                const jungleFriend =
                  userData.jungleFriend ||
                  {};

                setFriend({
                  name:
                    jungleFriend.name ||
                    "",
                  image:
                    jungleFriend.image ||
                    "",
                });

                setLoadingPage(false);
              },
              (error) => {
                console.error(
                  "❌ User snapshot error:",
                  error
                );

                setLoadingPage(false);
              }
            );

          // -----------------------------------------------
          // PROGRESS - REAL TIME
          // -----------------------------------------------

          const progressRef = doc(
            db,
            "progress",
            uid
          );

          unsubscribeProgress =
            onSnapshot(
              progressRef,
              (snapshot) => {
                if (!snapshot.exists()) {
                  console.log(
                    "🌱 No progress yet"
                  );

                  setProgress({
                    stars: 0,
                    streak: 0,
                    history: [],
                  });

                  return;
                }

                const data =
                  snapshot.data();

                console.log(
                  "📈 LIVE PROGRESS UPDATE:",
                  data
                );

                setProgress({
                  stars:
                    Number(
                      data.stars || 0
                    ),

                  streak:
                    Number(
                      data.streak || 0
                    ),

                  history:
                    Array.isArray(
                      data.history
                    )
                      ? data.history
                      : [],
                });
              },
              (error) => {
                console.error(
                  "❌ Progress snapshot error:",
                  error
                );
              }
            );
        }
      );

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      unsubscribeAuth();

      if (unsubscribeUser) {
        unsubscribeUser();
      }

      if (unsubscribeProgress) {
        unsubscribeProgress();
      }
    };
  }, [navigate]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingPage) {
    return (
      <div className="parent-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#185b3a",
          }}
        >
          <h2>
            Loading dashboard... 🌱
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const stars =
    progress.stars || 0;

  const streak =
    progress.streak || 0;

  const history =
    progress.history || [];

  // =====================================================
  // SESSIONS
  // =====================================================

  const totalGames =
    history.length;

  // =====================================================
  // ACCURACY
  // =====================================================

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce(
            (total, item) =>
              total +
              Number(
                item?.score || 0
              ),
            0
          ) / history.length
        )
      : 0;

  // =====================================================
  // LEVEL
  // =====================================================

  let level =
    "🌱 Beginner";

  if (stars >= 30) {
    level =
      "🏆 Jungle Master";
  } else if (stars >= 15) {
    level =
      "🌳 Jungle Hero";
  } else if (stars >= 5) {
    level =
      "🌿 Explorer";
  }

  const levelPercent =
    Math.min(
      (stars / 30) * 100,
      100
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="parent-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="parent-navbar">

        <div className="navbar-title">
          📊 Parent Dashboard
        </div>

        <div className="navbar-plant">
          🌱
        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="parent-content">

        {/* =================================================
            GREETING
        ================================================= */}

        <section className="parent-greeting">

          <h1>
            Good day,{" "}
            <span>
              {parent?.parentName ||
                "Parent"}
            </span>{" "}
            👋
          </h1>

          <p>
            Here's how your little
            learner is doing today.
          </p>

        </section>

        {/* =================================================
            CHILD
        ================================================= */}

        <section className="child-hero-card">

          <div className="child-avatar">

            {friend?.image ? (
              <img
                src={friend.image}
                alt={
                  friend.name ||
                  "Jungle friend"
                }
              />
            ) : (
              "👶"
            )}

          </div>

          <div className="child-info">

            <span>
              YOUR LITTLE LEARNER
            </span>

            <h2>
              {child?.name ||
                "No child profile"}
            </h2>

            <p>
              Age:{" "}
              {child?.age ||
                "Not set"}
            </p>

            {friend?.name && (
              <small>
                Jungle friend:{" "}
                {friend.name} 🦊
              </small>
            )}

          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              ⭐
            </div>

            <div>
              <span>
                Total Stars
              </span>

              <strong>
                {stars}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🔥
            </div>

            <div>
              <span>
                Day Streak
              </span>

              <strong>
                {streak}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🎮
            </div>

            <div>
              <span>
                Sessions
              </span>

              <strong>
                {totalGames}
              </strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>
              <span>
                Accuracy
              </span>

              <strong>
                {averageScore}%
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            PROGRESS + PERFORMANCE
        ================================================= */}

        <div className="dashboard-grid">

          <section className="dashboard-card">

            <div className="card-heading">

              <div>
                🌟
              </div>

              <div>
                <h2>
                  Overall Progress
                </h2>

                <p>
                  Keep growing, one
                  step at a time.
                </p>
              </div>

            </div>

            <div className="level-row">

              <span>
                Current Level
              </span>

              <strong>
                {level}
              </strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${levelPercent}%`,
                }}
              />

            </div>

            <div className="progress-label">

              <span>
                ⭐ {stars} stars
              </span>

              <span>
                {Math.round(
                  levelPercent
                )}%
              </span>

            </div>

          </section>

          <section className="dashboard-card">

            <div className="card-heading">

              <div>
                🧠
              </div>

              <div>
                <h2>
                  Learning Performance
                </h2>

                <p>
                  Recent learning
                  activity.
                </p>
              </div>

            </div>

            <div className="performance-row">

              <span>
                Practice Sessions
              </span>

              <strong>
                {totalGames}
              </strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${Math.min(
                      totalGames * 10,
                      100
                    )}%`,
                }}
              />

            </div>

            <div
              className="performance-row"
              style={{
                marginTop: "22px",
              }}
            >

              <span>
                Average Accuracy
              </span>

              <strong>
                {averageScore}%
              </strong>

            </div>

          </section>

        </div>

        {/* =================================================
            PARENT INFORMATION
        ================================================= */}

        <section className="dashboard-card">

          <div className="card-heading">

            <div>
              👨‍👩‍👧
            </div>

            <div>
              <h2>
                Parent Information
              </h2>

              <p>
                Your account details.
              </p>
            </div>

          </div>

          <div className="profile-details">

            <div>
              <span>
                Parent Name
              </span>

              <strong>
                {parent?.parentName ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <span>
                Email
              </span>

              <strong>
                {parent?.email ||
                  "Not available"}
              </strong>
            </div>

            <div>
              <span>
                Daily Play Limit
              </span>

              <strong>
                {parent?.timeLimit
                  ? `${parent.timeLimit} mins`
                  : "Not set"}
              </strong>
            </div>

          </div>

        </section>

        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <section className="dashboard-card">

          <div className="card-heading">

            <div>
              📚
            </div>

            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Your child's latest
                learning sessions.
              </p>
            </div>

          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              🌱 No games completed yet.
              <br />
              Start a learning activity
              to see progress here.
            </div>
          ) : (
            <div className="activity-list">

              {history
                .slice()
                .reverse()
                .slice(0, 8)
                .map(
                  (item, index) => (
                    <div
                      className="activity-item"
                      key={
                        `${item.game}-${item.date}-${index}`
                      }
                    >

                      <div>
                        🎮
                      </div>

                      <div className="activity-info">

                        <strong>
                          {item.game ||
                            "Learning Activity"}
                        </strong>

                        <span>
                          {item.date ||
                            "Recent"}
                        </span>

                      </div>

                      <div className="activity-score">

                        <strong>
                          {item.score || 0}%
                        </strong>

                        <span>
                          ⭐{" "}
                          {item.stars || 0}
                        </span>

                      </div>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

        {/* =================================================
            ACHIEVEMENTS
        ================================================= */}

        <section className="dashboard-card">

          <div className="card-heading">

            <div>
              🏆
            </div>

            <div>
              <h2>
                Achievements
              </h2>

              <p>
                Little milestones
                along the journey.
              </p>
            </div>

          </div>

          <div className="achievement-grid">

            <div
              className={
                stars >= 1
                  ? "achievement unlocked"
                  : "achievement"
              }
            >
              ⭐

              <strong>
                First Star
              </strong>
            </div>

            <div
              className={
                totalGames >= 5
                  ? "achievement unlocked"
                  : "achievement"
              }
            >
              🎮

              <strong>
                5 Sessions
              </strong>
            </div>

            <div
              className={
                streak >= 3
                  ? "achievement unlocked"
                  : "achievement"
              }
            >
              🔥

              <strong>
                3 Day Streak
              </strong>
            </div>

            <div
              className={
                stars >= 15
                  ? "achievement unlocked"
                  : "achievement"
              }
            >
              🏆

              <strong>
                Jungle Hero
              </strong>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}