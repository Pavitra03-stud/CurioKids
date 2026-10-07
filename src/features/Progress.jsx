import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";
import "../styles/Progress.css";

export default function Progress() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    stars: 0,
    streak: 0,
    history: [],
  });

  const [gameResults, setGameResults] = useState([]);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD FIREBASE DATA
  ========================================================= */

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          navigate("/login");
          return;
        }

        /* -----------------------------------------------------
           USER PROFILE
        ----------------------------------------------------- */

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          setChild({
            name:
              userData.childProfile?.name ||
              userData.childName ||
              userData.child?.name ||
              "Explorer",

            age:
              userData.childProfile?.age ||
              userData.childAge ||
              userData.child?.age ||
              "",
          });
        }

        /* -----------------------------------------------------
           PROGRESS
        ----------------------------------------------------- */

        const progressRef = doc(db, "progress", userId);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          const data = progressSnap.data();

          setProgress({
            stars: Number(data.stars) || 0,
            streak: Number(data.streak) || 0,
            history: Array.isArray(data.history)
              ? data.history
              : [],
          });
        } else {
          setProgress({
            stars: 0,
            streak: 0,
            history: [],
          });
        }

        /* -----------------------------------------------------
           GAME RESULTS
        ----------------------------------------------------- */

        try {
          const resultsRef = collection(
            db,
            "users",
            userId,
            "game_results"
          );

          const resultsQuery = query(
            resultsRef,
            orderBy("createdAt", "desc"),
            limit(20)
          );

          const resultsSnap = await getDocs(resultsQuery);

          const results = resultsSnap.docs.map((gameDoc) => ({
            id: gameDoc.id,
            ...gameDoc.data(),
          }));

          setGameResults(results);
        } catch (error) {
          console.warn(
            "Could not load game results:",
            error
          );

          setGameResults([]);
        }
      } catch (error) {
        console.error(
          "Progress page loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [navigate]);

  /* =========================================================
     VALUES
  ========================================================= */

  const stars = progress.stars;
  const streak = progress.streak;
  const history = progress.history;

  const totalGames = history.length;

  const averageScore = useMemo(() => {
    if (!history.length) return 0;

    const total = history.reduce(
      (sum, item) =>
        sum + (Number(item.score) || 0),
      0
    );

    return Math.round(total / history.length);
  }, [history]);

  /* =========================================================
     LEVEL
  ========================================================= */

  const level = useMemo(() => {
    if (stars >= 30) {
      return {
        name: "Jungle Master",
        emoji: "🏆",
        progress: 100,
      };
    }

    if (stars >= 15) {
      return {
        name: "Jungle Hero",
        emoji: "🌳",
        progress: Math.round(
          ((stars - 15) / 15) * 100
        ),
      };
    }

    if (stars >= 5) {
      return {
        name: "Explorer",
        emoji: "🌿",
        progress: Math.round(
          ((stars - 5) / 10) * 100
        ),
      };
    }

    return {
      name: "Beginner",
      emoji: "🌱",
      progress: Math.min(
        Math.round((stars / 5) * 100),
        100
      ),
    };
  }, [stars]);

  /* =========================================================
     PERFORMANCE DATA
  ========================================================= */

  const performanceData = useMemo(() => {
    return history
      .slice(-10)
      .map((item, index) => ({
        id: `${item.date}-${index}`,
        score: Math.min(
          Math.max(Number(item.score) || 0, 0),
          100
        ),
        date: item.date || "Recent",
        game: item.game || "Practice",
      }));
  }, [history]);

  /* =========================================================
     RECENT ACTIVITY
  ========================================================= */

  const recentActivity = useMemo(() => {
    return [...history]
      .slice(-5)
      .reverse();
  }, [history]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="progress-loading">
        <div className="loading-orbit">
          🌱
        </div>

        <h2>Loading your progress...</h2>

        <p>
          Your learning adventure is getting ready ✨
        </p>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="progress-page">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="progress-decoration decoration-one">
        ✨
      </div>

      <div className="progress-decoration decoration-two">
        🌿
      </div>

      <div className="progress-decoration decoration-three">
        ⭐
      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="progress-header">

        <button
          className="progress-back-button"
          onClick={() => navigate("/jungle-hero")}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="progress-header-text">

          <div className="progress-kicker">
            🌴 CURIOKIDS
          </div>

          <h1>
            {child?.name
              ? `${child.name}'s Progress`
              : "My Progress"}
          </h1>

          <p>
            Keep exploring, learning and growing! 🌱
          </p>

        </div>

        <div className="progress-header-avatar">
          🐵
        </div>

      </header>

      {/* =====================================================
          TOP STATS
      ===================================================== */}

      <section className="progress-stats">

        {/* STARS */}

        <div className="stat-card stars-card">

          <div className="stat-icon">
            ⭐
          </div>

          <div className="stat-content">

            <span className="stat-label">
              TOTAL STARS
            </span>

            <strong>
              {stars}
            </strong>

            <small>
              Amazing work!
            </small>

          </div>

        </div>

        {/* LEVEL */}

        {/* LEVEL */}
<div className="stat-card level-card">

  <div className="level-card-icon">
    {level.emoji}
  </div>

  <div className="level-card-content">

    <span className="level-card-label">
      CURRENT LEVEL
    </span>

    <strong className="level-card-name">
      {level.name}
    </strong>

    <small className="level-card-subtitle">
      Keep going! ✨
    </small>

  </div>

</div>

        {/* STREAK */}

        <div className="stat-card streak-card">

          <div className="stat-icon">
            🔥
          </div>

          <div className="stat-content">

            <span className="stat-label">
              DAY STREAK
            </span>

            <strong>
              {streak}
            </strong>

            <small>
              {streak === 1
                ? "Day started!"
                : "Days in a row!"}
            </small>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <main className="progress-grid">

        {/* ===================================================
            OVERALL PROGRESS
        =================================================== */}

        <section className="progress-card overall-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              📚
            </div>

            <div>
              <span>
                YOUR JOURNEY
              </span>

              <h2>
                Overall Progress
              </h2>
            </div>

          </div>

          <div className="level-display">

            <div className="level-circle">
              {level.emoji}
            </div>

            <div>

              <span className="level-small">
                CURRENT LEVEL
              </span>

              <h3>
                {level.name}
              </h3>

            </div>

          </div>

          <div className="journey-progress">

            <div className="journey-progress-top">

              <span>
                Progress to next level
              </span>

              <strong>
                {level.progress}%
              </strong>

            </div>

            <div className="journey-track">

              <div
                className="journey-fill"
                style={{
                  width: `${level.progress}%`,
                }}
              />

            </div>

          </div>

          <div className="journey-message">

            <span>
              🌟
            </span>

            <p>
              Every little step makes you
              stronger!
            </p>

          </div>

        </section>

        {/* ===================================================
            PERFORMANCE
        =================================================== */}

        <section className="progress-card performance-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              📈
            </div>

            <div>
              <span>
                LEARNING
              </span>

              <h2>
                Performance
              </h2>
            </div>

          </div>

          <div className="performance-summary">

            <div>
              <span>
                Average score
              </span>

              <strong>
                {averageScore}%
              </strong>
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

          <div className="chart-wrapper">

            {performanceData.length === 0 ? (
              <div className="performance-empty">

                <div>
                  🌱
                </div>

                <p>
                  Complete a game to see
                  your performance!
                </p>

              </div>
            ) : (
              <div className="performance-chart">

                {/* GRID LINES */}

                <div className="chart-grid-line line-100">
                  <span>100</span>
                </div>

                <div className="chart-grid-line line-75">
                  <span>75</span>
                </div>

                <div className="chart-grid-line line-50">
                  <span>50</span>
                </div>

                <div className="chart-grid-line line-25">
                  <span>25</span>
                </div>

                <div className="chart-bars">

                  {performanceData.map(
                    (item, index) => (
                      <div
                        className="chart-column"
                        key={item.id}
                        title={`${item.game}: ${item.score}%`}
                      >

                        <div className="bar-value">
                          {item.score}
                        </div>

                        <div
                          className="performance-bar"
                          style={{
                            height: `${Math.max(
                              item.score,
                              8
                            )}%`,
                          }}
                        />

                        <div className="bar-date">
                          {item.date
                            .toString()
                            .slice(5)}
                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ===================================================
            RECENT ACTIVITY
        =================================================== */}

        <section className="progress-card activity-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🗓️
            </div>

            <div>
              <span>
                YOUR ADVENTURE
              </span>

              <h2>
                Recent Activity
              </h2>
            </div>

          </div>

          <div className="activity-list">

            {recentActivity.length === 0 ? (

              <div className="empty-activity">
                🚀
                <p>
                  Your adventure starts here!
                </p>
              </div>

            ) : (

              recentActivity.map(
                (item, index) => (

                  <div
                    className="activity-item"
                    key={`${item.date}-${index}`}
                  >

                    <div className="activity-icon">
                      🎯
                    </div>

                    <div className="activity-info">

                      <strong>
                        {item.game ||
                          "Practice Game"}
                      </strong>

                      <span>
                        {item.date ||
                          "Recent"}
                      </span>

                    </div>

                    <div className="activity-score">

                      <strong>
                        {item.score ?? 0}%
                      </strong>

                      <span>
                        ⭐ {item.stars ?? 0}
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

        {/* ===================================================
            ACHIEVEMENTS
        =================================================== */}

        <section className="progress-card achievements-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🏆
            </div>

            <div>
              <span>
                REWARDS
              </span>

              <h2>
                Achievements
              </h2>
            </div>

          </div>

          <div className="achievement-summary">

            <div className="achievement-big">
              ⭐
            </div>

            <div>

              <strong>
                {stars}
              </strong>

              <span>
                Stars earned
              </span>

            </div>

          </div>

          <div className="badge-grid">

            {Array.from({
              length: Math.min(
                Math.max(
                  Math.floor(stars / 5),
                  0
                ),
                8
              ),
            }).map((_, index) => (

              <div
                className="achievement-badge earned"
                key={index}
              >
                🏅
              </div>

            ))}

            {stars < 5 && (
              <div className="achievement-badge locked">
                🔒
              </div>
            )}

          </div>

          <p className="achievement-message">

            {stars >= 30
              ? "You're a true Jungle Master! 🏆"
              : stars >= 15
              ? "You're becoming a Jungle Hero! 🌳"
              : stars >= 5
              ? "Great job, Explorer! 🌿"
              : "Keep learning to unlock your first badge! 🌱"}

          </p>

        </section>

      </main>

      {/* =====================================================
          FOOTER MESSAGE
      ===================================================== */}

      <section className="progress-footer">

        <div className="footer-mascot">
          🐯
        </div>

        <div>

          <h3>
            Keep going, little explorer! ✨
          </h3>

          <p>
            Every practice session helps you
            learn something new.
          </p>

        </div>

      </section>

    </div>
  );
}