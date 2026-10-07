import "../styles/KidsHome.css";
import bearImage from "../assets/bear.png";
import { speak } from "../utils/speak";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useGame } from "../context/GameContext";

export default function KidsHome() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Pavii");

  const {
    stars = 0,
    streak = 0,
    loadingProgress,
  } = useGame();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setUserName(
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

  const getLevel = () => {
    if (stars < 5) return 1;
    if (stars < 15) return 2;
    if (stars < 30) return 3;
    if (stars < 50) return 4;
    return 5;
  };

  const level = getLevel();

  const speakText = (text) => {
    speak(text);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("loginEmail");
    setProfileOpen(false);
    navigate("/login");
  };

  const zones = [
    {
      key: "games",
      icon: "🎮",
      title: "Games",
      subtitle: "Play, explore & have fun",
      description: "Fun challenges made for curious minds",
      color: "green",
      path: "/games-home",
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

  return (
    <div className="kids-home">
      <div className="jungle-glow jungle-glow-one" />
      <div className="jungle-glow jungle-glow-two" />
      <div className="floating-leaf leaf-one">🍃</div>
      <div className="floating-leaf leaf-two">🌿</div>
      <div className="floating-leaf leaf-three">🍃</div>

      <header className="kids-navbar">
        <button
          className="brand"
          onClick={() => navigate("/kids-home")}
          aria-label="CurioKids home"
        >
          <span>CurioKids</span>
        </button>

        <div className="navbar-right">
          <button
            className="top-action rewards-action"
            onClick={() => navigate("/rewards")}
          >
            <span>🏆</span>
            <span>Rewards</span>
          </button>

          <button
            className="top-action progress-action"
            onClick={() => navigate("/progress")}
          >
            <span>📊</span>
            <span>Progress</span>
          </button>

          <div className="profile-container">
            <button
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
                  <div className="profile-mini-avatar">👤</div>
                  <div>
                    <p className="profile-name">{userName} 🌟</p>
                    <span>Level {level} explorer</span>
                  </div>
                </div>

                <div className="profile-stat">
                  <span>⭐ Stars</span>
                  <strong>{loadingProgress ? "..." : stars}</strong>
                </div>

                <div className="profile-stat">
                  <span>🔥 Streak</span>
                  <strong>{loadingProgress ? "..." : streak} days</strong>
                </div>

                <div className="profile-divider" />

                <button onClick={() => navigate("/profile")}>
                  👤 My Profile
                </button>

                <button onClick={() => navigate("/settings")}>
                  ⚙️ Settings
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="kids-content">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="welcome-badge">
              ✨ Ready for an adventure?
            </div>

            <h1>
              Welcome to the
              <span> Jungle! 🌿</span>
            </h1>

            <p>
              Hi {userName}! Let's play, learn, and grow together.
            </p>

          </div>

          <div className="hero-mascot">
            <div className="mascot-shadow" />

            

            <img
              className="hero-bear"
              src={bearImage}
              alt="CurioKids jungle bear"
            />
          </div>
        </section>

        <section className="zone-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR ADVENTURE MAP</span>
              <h2>Choose your jungle zone 🌈</h2>
              <p>Pick a zone and let's make today a learning adventure!</p>
            </div>

            <div className="tiny-jungle-sign">
              <span>🦋</span>
              Learn &amp; play!
            </div>
          </div>

          <div className="zone-grid">
            {zones.map((zone, index) => (
              <button
                key={zone.key}
                className={`zone-card zone-${zone.color}`}
                onClick={() => navigate(zone.path)}
                onMouseEnter={() => speakText(zone.speech)}
                style={{ "--delay": `${index * 90}ms` }}
              >
                <span className="zone-card-shine" />

                <div className="zone-top">
                  <span className="zone-tag">{zone.tag}</span>
                  <span className="zone-number">0{index + 1}</span>
                </div>

                <div className="zone-icon-wrap">
                  <span className="zone-icon">{zone.icon}</span>
                </div>

                <div className="zone-copy">
                  <h3>{zone.title}</h3>
                  <strong>{zone.subtitle}</strong>
                  <p>{zone.description}</p>
                </div>

                <span className="zone-arrow">PLAY <b>›</b></span>

                <div className="zone-dots">
                  <i />
                  <i />
                  <i />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="encouragement">
          <div className="encouragement-animal">🦜</div>
          <div>
            <span>Jungle tip</span>
            <strong>Every little step makes you stronger! 💚</strong>
          </div>
          <div className="encouragement-leaves">🌿🍃</div>
        </section>
      </main>
    </div>
  );
}
