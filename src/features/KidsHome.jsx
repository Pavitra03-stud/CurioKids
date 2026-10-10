import "../styles/KidsHome.css";

import { speak } from "../utils/speak";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { signOut } from "firebase/auth";

import { db, auth } from "../firebase";

import { useGame } from "../context/GameContext";

export default function KidsHome() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const [userName, setUserName] = useState("Pavii");

  const {
    stars = 0,
    streak = 0,
    loadingProgress,
    rewards = [],
    claimedRewards = [],
  } = useGame();

  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          return;
        }

        const userRef = doc(db, "users", userId);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          const childProfile = data.childProfile || {};

          setUserName(
            childProfile.name ||
            data.name ||
            data.displayName ||
            data.username ||
            "Pavii"
          );
        }
      } catch (error) {
        console.error("❌ Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  // =========================================================
  // CLICK OUTSIDE PROFILE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-container")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // =========================================================
  // LEVEL
  // =========================================================

  const getLevel = () => {
    if (stars < 5) return 1;
    if (stars < 15) return 2;
    if (stars < 30) return 3;
    if (stars < 50) return 4;

    return 5;
  };

  const level = getLevel();

  // =========================================================
  // SPEECH
  // =========================================================

  const speakText = (text) => {
    speak(text);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("❌ Firebase logout failed:", error);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("loginEmail");

      setProfileOpen(false);

      navigate("/login", {
        replace: true,
      });
    }
  };

  // =========================================================
  // NAVIGATION HELPERS
  // =========================================================

  const goToRewards = () => {
    setProfileOpen(false);
    navigate("/rewards");
  };

  const goToProgress = () => {
    setProfileOpen(false);
    navigate("/progress");
  };

  // =========================================================
  // ZONES
  // =========================================================

  const zones = [
    {
      key: "games",
      icon: "🎮",
      title: "Games",
      subtitle: "Play, explore & have fun",
      description: "Fun challenges made for curious minds",
      color: "green",
      path: "/games-play",
      speech: "Let's play fun games!",
      tag: "PLAY",
    },

    {
      key: "letters",
      icon: "🔤",
      title: "Letters",
      subtitle: "Explore the alphabet",
      description: "Discover sounds, words and letters",
      color: "orange",
      path: "/letters-home",
      speech: "Let's learn letters together!",
      tag: "ABC",
    },

    {
      key: "numbers",
      icon: "🔢",
      title: "Numbers",
      subtitle: "Count, learn & discover",
      description: "Build number skills through play",
      color: "blue",
      path: "/numbers",
      speech: "Numbers are fun to learn!",
      tag: "123",
    },

    {
      key: "practice",
      icon: "🧠",
      title: "Practice",
      subtitle: "Build your super skills",
      description: "Strengthen what you have learned",
      color: "purple",
      path: "/practice-home",
      speech: "Practice makes you stronger!",
      tag: "BOOST",
    },
  ];

  // =========================================================
  // EARNED REWARDS
  // =========================================================

  const earnedRewards = rewards.filter((reward) =>
    claimedRewards.includes(reward.id)
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="kids-home">

      {/* Decorative jungle glow */}
      <div className="jungle-glow jungle-glow-one" />
      <div className="jungle-glow jungle-glow-two" />

      {/* Floating leaves */}
      <div className="floating-leaf leaf-one">🍃</div>
      <div className="floating-leaf leaf-two">🌿</div>
      <div className="floating-leaf leaf-three">🍃</div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="kids-navbar">

        {/* Plain CurioKids text */}
        <div className="navbar-title">
          <span className="brand-sprout">🌱</span>
          <span className="brand-curio">Curio</span>
          <span className="brand-kids">Kids</span>
        </div>

        <div className="navbar-right">

          {/* REWARDS */}
          <button
            type="button"
            className="top-action rewards-action"
            onClick={goToRewards}
          >
            <span>🏆</span>
            <span>Rewards</span>
          </button>

          {/* PROGRESS */}
          <button
            type="button"
            className="top-action progress-action"
            onClick={goToProgress}
          >
            <span>📊</span>
            <span>Progress</span>
          </button>

          {/* PROFILE */}
          <div className="profile-container">

            <button
              type="button"
              className="profile-avatar"
              onClick={(e) => {
                e.stopPropagation();

                setProfileOpen((prev) => !prev);
              }}
              aria-label="Open profile"
            >
              👤
            </button>

            {profileOpen && (
              <div
                className="profile-dropdown"
                onClick={(e) => e.stopPropagation()}
              >

                <div className="profile-dropdown-head">

                  <div className="profile-mini-avatar">
                    👤
                  </div>

                  <div>
                    <p className="profile-name">
                      {userName} 🌟
                    </p>

                    <span>
                      Level {level} explorer
                    </span>
                  </div>

                </div>

                <div className="profile-stat">
                  <span>⭐ Stars</span>

                  <strong>
                    {loadingProgress ? "..." : stars}
                  </strong>
                </div>

                <div className="profile-stat">
                  <span>🔥 Streak</span>

                  <strong>
                    {loadingProgress ? "..." : streak} days
                  </strong>
                </div>

                <div className="profile-divider" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  👤 My Profile
                </button>



                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="kids-content">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero-section">

          <div className="hero-copy">

            <div className="welcome-badge">
              ✨ Ready for an adventure?
            </div>

            <h1>
              A Brighter Way
              <br />
              to Learn and
              <span>Play</span>
              <br />

            </h1>
            <div className="hero-tagline">
              <span className="hero-tagline-kicker">
                ✨ YOUR NEXT ADVENTURE STARTS HERE
              </span>

              <h2>
                A World of <span>Wonder Awaits You</span>
              </h2>

              <p>
                Explore, discover, and grow — one little
                adventure at a time. 🌱
              </p>

              <div className="hero-fireflies" aria-hidden="true">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
              </div>
            </div>


          </div>

        </section>

        {/* ===================================================
            ZONES
        =================================================== */}

        <section className="zone-section">

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                YOUR ADVENTURE MAP
              </span>

              <h2>
                Choose your jungle zone 🌈
              </h2>

              <p>
                Pick a zone and let's make today a learning adventure!
              </p>

            </div>

            <div className="tiny-jungle-sign">
              🦋 Learn &amp; play!
            </div>

          </div>

          <div className="zone-grid">

            {zones.map((zone, index) => (
              <button
                type="button"
                key={zone.key}
                className={`zone-card zone-${zone.color}`}
                onClick={() => navigate(zone.path)}
                onMouseEnter={() => speakText(zone.speech)}
                style={{
                  "--delay": `${index * 90}ms`,
                }}
              >

                <span className="zone-card-shine" />

                <div className="zone-top">

                  <span className="zone-tag">
                    {zone.tag}
                  </span>

                  <span className="zone-number">
                    0{index + 1}
                  </span>

                </div>

                <div className="zone-icon-wrap">

                  <span className="zone-icon">
                    {zone.icon}
                  </span>

                </div>

                <div className="zone-copy">

                  <h3>
                    {zone.title}
                  </h3>

                  <strong>
                    {zone.subtitle}
                  </strong>

                  <p>
                    {zone.description}
                  </p>

                </div>

                <span className="zone-arrow">
                  PLAY <b>›</b>
                </span>

                <div className="zone-dots">
                  <i />
                  <i />
                  <i />
                </div>

              </button>
            ))}

          </div>

        </section>

        {/* ===================================================
            ENCOURAGEMENT
        =================================================== */}

        <section className="encouragement">

          <div className="encouragement-animal">
            🦜
          </div>

          <div>

            <span>
              Jungle tip
            </span>

            <strong>
              Every little step makes you stronger! 💚
            </strong>

          </div>

          <div className="encouragement-leaves">
            🌿🍃
          </div>

        </section>

        {/* ===================================================
            EARNED REWARDS
        =================================================== */}

        <section className="earned-rewards-section">

          <div className="earned-rewards-header">

            <div>

              <span className="earned-kicker">
                YOUR REWARDS
              </span>

              <h2>
                Jungle Achievements 🏆
              </h2>

            </div>

            <button
              type="button"
              onClick={goToRewards}
              className="view-rewards-btn"
            >
              View All →
            </button>

          </div>

          {earnedRewards.length === 0 ? (
            <p className="no-rewards">
              Your first reward is waiting! Earn stars ⭐
            </p>
          ) : (
            <div className="earned-rewards-list">

              {earnedRewards.slice(-5).map((reward) => (
                <div
                  key={reward.id}
                  className="earned-reward"
                >
                  <span>
                    {reward.icon}
                  </span>

                  <span>
                    {reward.title}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}