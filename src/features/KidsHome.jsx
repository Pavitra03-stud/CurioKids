// // import "../styles/KidsHome.css";
// // import bearImage from "../assets/bear.png";
// // import { speak } from "../utils/speak";
// // import { useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import { doc, getDoc } from "firebase/firestore";
// // import { db } from "../firebase";
// // import { useGame } from "../context/GameContext";

// // export default function KidsHome() {
// //   const navigate = useNavigate();
// //   const [profileOpen, setProfileOpen] = useState(false);
// //   const [userName, setUserName] = useState("Pavii");

// //   const {
// //     stars = 0,
// //     streak = 0,
// //     loadingProgress,
// //   } = useGame();

// //   useEffect(() => {
// //     const loadProfile = async () => {
// //       try {
// //         const userId = localStorage.getItem("userId");

// //         if (!userId) return;

// //         const userRef = doc(db, "users", userId);
// //         const userSnap = await getDoc(userRef);

// //         if (userSnap.exists()) {
// //           const data = userSnap.data();

// //           setUserName(
// //             data.name ||
// //             data.displayName ||
// //             data.username ||
// //             "Pavii"
// //           );
// //         }
// //       } catch (error) {
// //         console.error("❌ Failed to load profile:", error);
// //       }
// //     };

// //     loadProfile();
// //   }, []);

// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (!event.target.closest(".profile-container")) {
// //         setProfileOpen(false);
// //       }
// //     };

// //     document.addEventListener("click", handleClickOutside);

// //     return () => {
// //       document.removeEventListener("click", handleClickOutside);
// //     };
// //   }, []);

// //   const getLevel = () => {
// //     if (stars < 5) return 1;
// //     if (stars < 15) return 2;
// //     if (stars < 30) return 3;
// //     if (stars < 50) return 4;
// //     return 5;
// //   };

// //   const level = getLevel();

// //   const speakText = (text) => {
// //     speak(text);
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("userId");
// //     localStorage.removeItem("loginEmail");
// //     setProfileOpen(false);
// //     navigate("/login");
// //   };

// //   const zones = [
// //     {
// //       key: "games",
// //       icon: "🎮",
// //       title: "Games",
// //       subtitle: "Play, explore & have fun",
// //       description: "Fun challenges made for curious minds",
// //       color: "green",
// //       path: "/games-home",
// //       speech: "Let's play fun games!",
// //       tag: "PLAY",
// //     },
// //     {
// //       key: "letters",
// //       icon: "🔤",
// //       title: "Letters",
// //       subtitle: "Explore the alphabet",
// //       description: "Discover sounds, words and letters",
// //       color: "orange",
// //       path: "/letters-home",
// //       speech: "Let's learn letters together!",
// //       tag: "ABC",
// //     },
// //     {
// //       key: "numbers",
// //       icon: "🔢",
// //       title: "Numbers",
// //       subtitle: "Count, learn & discover",
// //       description: "Build number skills through play",
// //       color: "blue",
// //       path: "/numbers",
// //       speech: "Numbers are fun to learn!",
// //       tag: "123",
// //     },
// //     {
// //       key: "practice",
// //       icon: "🧠",
// //       title: "Practice",
// //       subtitle: "Build your super skills",
// //       description: "Strengthen what you have learned",
// //       color: "purple",
// //       path: "/practice-home",
// //       speech: "Practice makes you stronger!",
// //       tag: "BOOST",
// //     },
// //   ];

// //   return (
// //     <div className="kids-home">
// //       <div className="jungle-glow jungle-glow-one" />
// //       <div className="jungle-glow jungle-glow-two" />
// //       <div className="floating-leaf leaf-one">🍃</div>
// //       <div className="floating-leaf leaf-two">🌿</div>
// //       <div className="floating-leaf leaf-three">🍃</div>

// //       <header className="kids-navbar">
// //         <button
// //           className="brand"
// //           onClick={() => navigate("/kids-home")}
// //           aria-label="CurioKids home"
// //         >
// //           <span>CurioKids</span>
// //         </button>

// //         <div className="navbar-right">
// //           <button
// //             className="top-action rewards-action"
// //             onClick={() => navigate("/rewards")}
// //           >
// //             <span>🏆</span>
// //             <span>Rewards</span>
// //           </button>

// //           <button
// //             className="top-action progress-action"
// //             onClick={() => navigate("/progress")}
// //           >
// //             <span>📊</span>
// //             <span>Progress</span>
// //           </button>

// //           <div className="profile-container">
// //             <button
// //               className="profile-avatar"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 setProfileOpen((prev) => !prev);
// //               }}
// //               aria-label="Open profile"
// //             >
// //               👤
// //             </button>

// //             {profileOpen && (
// //               <div
// //                 className="profile-dropdown"
// //                 onClick={(e) => e.stopPropagation()}
// //               >
// //                 <div className="profile-dropdown-head">
// //                   <div className="profile-mini-avatar">👤</div>
// //                   <div>
// //                     <p className="profile-name">{userName} 🌟</p>
// //                     <span>Level {level} explorer</span>
// //                   </div>
// //                 </div>

// //                 <div className="profile-stat">
// //                   <span>⭐ Stars</span>
// //                   <strong>{loadingProgress ? "..." : stars}</strong>
// //                 </div>

// //                 <div className="profile-stat">
// //                   <span>🔥 Streak</span>
// //                   <strong>{loadingProgress ? "..." : streak} days</strong>
// //                 </div>

// //                 <div className="profile-divider" />

// //                 <button onClick={() => navigate("/profile")}>
// //                   👤 My Profile
// //                 </button>

// //                 <button onClick={() => navigate("/settings")}>
// //                   ⚙️ Settings
// //                 </button>

// //                 <button className="logout-btn" onClick={handleLogout}>
// //                   🚪 Logout
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </header>

// //       <main className="kids-content">
// //         <section className="hero-section">
// //           <div className="hero-copy">
// //             <div className="welcome-badge">
// //               ✨ Ready for an adventure?
// //             </div>

// //             <h1>
// //               Welcome to the
// //               <span> Jungle! 🌿</span>
// //             </h1>

// //             <p>
// //               Hi {userName}! Let's play, learn, and grow together.
// //             </p>

// //           </div>

// //           <div className="hero-mascot">
// //             <div className="mascot-shadow" />

            

// //             <img
// //               className="hero-bear"
// //               src={bearImage}
// //               alt="CurioKids jungle bear"
// //             />
// //           </div>
// //         </section>

// //         <section className="zone-section">
// //           <div className="section-heading">
// //             <div>
// //               <span className="section-kicker">YOUR ADVENTURE MAP</span>
// //               <h2>Choose your jungle zone 🌈</h2>
// //               <p>Pick a zone and let's make today a learning adventure!</p>
// //             </div>

// //             <div className="tiny-jungle-sign">
// //               <span>🦋</span>
// //               Learn &amp; play!
// //             </div>
// //           </div>

// //           <div className="zone-grid">
// //             {zones.map((zone, index) => (
// //               <button
// //                 key={zone.key}
// //                 className={`zone-card zone-${zone.color}`}
// //                 onClick={() => navigate(zone.path)}
// //                 onMouseEnter={() => speakText(zone.speech)}
// //                 style={{ "--delay": `${index * 90}ms` }}
// //               >
// //                 <span className="zone-card-shine" />

// //                 <div className="zone-top">
// //                   <span className="zone-tag">{zone.tag}</span>
// //                   <span className="zone-number">0{index + 1}</span>
// //                 </div>

// //                 <div className="zone-icon-wrap">
// //                   <span className="zone-icon">{zone.icon}</span>
// //                 </div>

// //                 <div className="zone-copy">
// //                   <h3>{zone.title}</h3>
// //                   <strong>{zone.subtitle}</strong>
// //                   <p>{zone.description}</p>
// //                 </div>

// //                 <span className="zone-arrow">PLAY <b>›</b></span>

// //                 <div className="zone-dots">
// //                   <i />
// //                   <i />
// //                   <i />
// //                 </div>
// //               </button>
// //             ))}
// //           </div>
// //         </section>

// //         <section className="encouragement">
// //           <div className="encouragement-animal">🦜</div>
// //           <div>
// //             <span>Jungle tip</span>
// //             <strong>Every little step makes you stronger! 💚</strong>
// //           </div>
// //           <div className="encouragement-leaves">🌿🍃</div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }




// import "../styles/KidsHome.css";
// import bearImage from "../assets/bear.png";
// import { speak } from "../utils/speak";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { db, auth } from "../firebase";
// import { useGame } from "../context/GameContext";

// export default function KidsHome() {
//   const navigate = useNavigate();
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [userName, setUserName] = useState("Pavii");

//   const {
//     stars = 0,
//     streak = 0,
//     loadingProgress,
//   } = useGame();

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const userId = localStorage.getItem("userId");

//         if (!userId) return;

//         const userRef = doc(db, "users", userId);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const data = userSnap.data();

//           setUserName(
//             data.name ||
//             data.displayName ||
//             data.username ||
//             "Pavii"
//           );
//         }
//       } catch (error) {
//         console.error(
//           "❌ Failed to load profile:",
//           error
//         );
//       }
//     };

//     loadProfile();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".profile-container")) {
//         setProfileOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const getLevel = () => {
//     if (stars < 5) return 1;
//     if (stars < 15) return 2;
//     if (stars < 30) return 3;
//     if (stars < 50) return 4;
//     return 5;
//   };

//   const level = getLevel();

//   const speakText = (text) => {
//     speak(text);
//   };

//   // =========================================================
//   // 🚪 LOGOUT
//   // =========================================================

//   const handleLogout = async () => {
//     try {
//       console.log("🚪 Logging out...");

//       // Sign out from Firebase
//       await signOut(auth);

//       console.log("✅ Firebase sign out successful");

//     } catch (error) {
//       console.error(
//         "❌ Firebase logout failed:",
//         error
//       );
//     } finally {
//       // Clear local session information
//       localStorage.removeItem("userId");
//       localStorage.removeItem("loginEmail");

//       // Close profile dropdown
//       setProfileOpen(false);

//       // Go to login page and replace current history entry
//       navigate("/login", {
//         replace: true,
//       });
//     }
//   };

//   const zones = [
//     {
//       key: "games",
//       icon: "🎮",
//       title: "Games",
//       subtitle: "Play, explore & have fun",
//       description: "Fun challenges made for curious minds",
//       color: "green",
//       path: "/games-home",
//       speech: "Let's play fun games!",
//       tag: "PLAY",
//     },
//     {
//       key: "letters",
//       icon: "🔤",
//       title: "Letters",
//       subtitle: "Explore the alphabet",
//       description: "Discover sounds, words and letters",
//       color: "orange",
//       path: "/letters-home",
//       speech: "Let's learn letters together!",
//       tag: "ABC",
//     },
//     {
//       key: "numbers",
//       icon: "🔢",
//       title: "Numbers",
//       subtitle: "Count, learn & discover",
//       description: "Build number skills through play",
//       color: "blue",
//       path: "/numbers",
//       speech: "Numbers are fun to learn!",
//       tag: "123",
//     },
//     {
//       key: "practice",
//       icon: "🧠",
//       title: "Practice",
//       subtitle: "Build your super skills",
//       description: "Strengthen what you have learned",
//       color: "purple",
//       path: "/practice-home",
//       speech: "Practice makes you stronger!",
//       tag: "BOOST",
//     },
//   ];

//   return (
//     <div className="kids-home">
//       <div className="jungle-glow jungle-glow-one" />
//       <div className="jungle-glow jungle-glow-two" />
//       <div className="floating-leaf leaf-one">🍃</div>
//       <div className="floating-leaf leaf-two">🌿</div>
//       <div className="floating-leaf leaf-three">🍃</div>

//       <header className="kids-navbar">
//         <button
//           className="brand"
//           onClick={() => navigate("/kids-home")}
//           aria-label="CurioKids home"
//         >
//           <span>CurioKids</span>
//         </button>

//         <div className="navbar-right">
//           <button
//             className="top-action rewards-action"
//             onClick={() => navigate("/rewards")}
//           >
//             <span>🏆</span>
//             <span>Rewards</span>
//           </button>

//           <button
//             className="top-action progress-action"
//             onClick={() => navigate("/progress")}
//           >
//             <span>📊</span>
//             <span>Progress</span>
//           </button>

//           <div className="profile-container">
//             <button
//               className="profile-avatar"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setProfileOpen((prev) => !prev);
//               }}
//               aria-label="Open profile"
//             >
//               👤
//             </button>

//             {profileOpen && (
//               <div
//                 className="profile-dropdown"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="profile-dropdown-head">
//                   <div className="profile-mini-avatar">👤</div>
//                   <div>
//                     <p className="profile-name">
//                       {userName} 🌟
//                     </p>

//                     <span>
//                       Level {level} explorer
//                     </span>
//                   </div>
//                 </div>

//                 <div className="profile-stat">
//                   <span>⭐ Stars</span>

//                   <strong>
//                     {loadingProgress ? "..." : stars}
//                   </strong>
//                 </div>

//                 <div className="profile-stat">
//                   <span>🔥 Streak</span>

//                   <strong>
//                     {loadingProgress
//                       ? "..."
//                       : streak}{" "}
//                     days
//                   </strong>
//                 </div>

//                 <div className="profile-divider" />

//                 <button
//                   onClick={() =>
//                     navigate("/profile")
//                   }
//                 >
//                   👤 My Profile
//                 </button>

//                 <button
//                   onClick={() =>
//                     navigate("/settings")
//                   }
//                 >
//                   ⚙️ Settings
//                 </button>

//                 <button
//                   className="logout-btn"
//                   onClick={handleLogout}
//                 >
//                   🚪 Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="kids-content">
//         <section className="hero-section">
//           <div className="hero-copy">
//             <div className="welcome-badge">
//               ✨ Ready for an adventure?
//             </div>

//             <h1>
//               Welcome to the
//               <span> Jungle! 🌿</span>
//             </h1>

//             <p>
//               Hi {userName}! Let's play, learn, and grow together.
//             </p>
//           </div>

//           <div className="hero-mascot">
//             <div className="mascot-shadow" />

//             <img
//               className="hero-bear"
//               src={bearImage}
//               alt="CurioKids jungle bear"
//             />
//           </div>
//         </section>

//         <section className="zone-section">
//           <div className="section-heading">
//             <div>
//               <span className="section-kicker">
//                 YOUR ADVENTURE MAP
//               </span>

//               <h2>
//                 Choose your jungle zone 🌈
//               </h2>

//               <p>
//                 Pick a zone and let's make today a
//                 learning adventure!
//               </p>
//             </div>

//             <div className="tiny-jungle-sign">
//               <span>🦋</span>
//               Learn &amp; play!
//             </div>
//           </div>

//           <div className="zone-grid">
//             {zones.map((zone, index) => (
//               <button
//                 key={zone.key}
//                 className={`zone-card zone-${zone.color}`}
//                 onClick={() =>
//                   navigate(zone.path)
//                 }
//                 onMouseEnter={() =>
//                   speakText(zone.speech)
//                 }
//                 style={{
//                   "--delay": `${index * 90}ms`,
//                 }}
//               >
//                 <span className="zone-card-shine" />

//                 <div className="zone-top">
//                   <span className="zone-tag">
//                     {zone.tag}
//                   </span>

//                   <span className="zone-number">
//                     0{index + 1}
//                   </span>
//                 </div>

//                 <div className="zone-icon-wrap">
//                   <span className="zone-icon">
//                     {zone.icon}
//                   </span>
//                 </div>

//                 <div className="zone-copy">
//                   <h3>
//                     {zone.title}
//                   </h3>

//                   <strong>
//                     {zone.subtitle}
//                   </strong>

//                   <p>
//                     {zone.description}
//                   </p>
//                 </div>

//                 <span className="zone-arrow">
//                   PLAY <b>›</b>
//                 </span>

//                 <div className="zone-dots">
//                   <i />
//                   <i />
//                   <i />
//                 </div>
//               </button>
//             ))}
//           </div>
//         </section>

//         <section className="encouragement">
//           <div className="encouragement-animal">
//             🦜
//           </div>

//           <div>
//             <span>
//               Jungle tip
//             </span>

//             <strong>
//               Every little step makes you
//               stronger! 💚
//             </strong>
//           </div>

//           <div className="encouragement-leaves">
//             🌿🍃
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }





import "../styles/KidsHome.css";

import bearImage from "../assets/bear.png";

import { speak } from "../utils/speak";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  signOut,
} from "firebase/auth";

import {
  db,
  auth,
} from "../firebase";

import {
  useGame,
} from "../context/GameContext";

export default function KidsHome() {
  const navigate =
    useNavigate();

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    userName,
    setUserName,
  ] = useState("Pavii");

  const {
    stars = 0,
    streak = 0,
    loadingProgress,

    rewards = [],
    claimedRewards = [],
  } = useGame();

  // =========================================================
  // 👤 LOAD PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile =
      async () => {
        try {
          const userId =
            localStorage.getItem(
              "userId"
            );

          if (!userId) {
            return;
          }

          const userRef =
            doc(
              db,
              "users",
              userId
            );

          const userSnap =
            await getDoc(
              userRef
            );

          if (
            userSnap.exists()
          ) {
            const data =
              userSnap.data();

            const childProfile =
              data.childProfile ||
              {};

            setUserName(
              childProfile.name ||
                data.name ||
                data.displayName ||
                data.username ||
                "Pavii"
            );
          }
        } catch (error) {
          console.error(
            "❌ Failed to load profile:",
            error
          );
        }
      };

    loadProfile();
  }, []);

  // =========================================================
  // 👆 CLICK OUTSIDE PROFILE
  // =========================================================

  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          !event.target.closest(
            ".profile-container"
          )
        ) {
          setProfileOpen(false);
        }
      };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // ⭐ LEVEL
  // =========================================================

  const getLevel = () => {
    if (stars < 5) return 1;
    if (stars < 15) return 2;
    if (stars < 30) return 3;
    if (stars < 50) return 4;

    return 5;
  };

  const level =
    getLevel();

  // =========================================================
  // 🔊 SPEECH
  // =========================================================

  const speakText = (
    text
  ) => {
    speak(text);
  };

  // =========================================================
  // 🚪 LOGOUT
  // =========================================================

  const handleLogout =
    async () => {
      try {
        await signOut(
          auth
        );
      } catch (error) {
        console.error(
          "❌ Firebase logout failed:",
          error
        );
      } finally {
        localStorage.removeItem(
          "userId"
        );

        localStorage.removeItem(
          "loginEmail"
        );

        setProfileOpen(
          false
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      }
    };

  // =========================================================
  // 🗺️ ZONES
  // =========================================================

  const zones = [
    {
      key: "games",
      icon: "🎮",
      title: "Games",
      subtitle:
        "Play, explore & have fun",
      description:
        "Fun challenges made for curious minds",
      color: "green",
      path: "/games-home",
      speech:
        "Let's play fun games!",
      tag: "PLAY",
    },

    {
      key: "letters",
      icon: "🔤",
      title: "Letters",
      subtitle:
        "Explore the alphabet",
      description:
        "Discover sounds, words and letters",
      color: "orange",
      path: "/letters-home",
      speech:
        "Let's learn letters together!",
      tag: "ABC",
    },

    {
      key: "numbers",
      icon: "🔢",
      title: "Numbers",
      subtitle:
        "Count, learn & discover",
      description:
        "Build number skills through play",
      color: "blue",
      path: "/numbers",
      speech:
        "Numbers are fun to learn!",
      tag: "123",
    },

    {
      key: "practice",
      icon: "🧠",
      title: "Practice",
      subtitle:
        "Build your super skills",
      description:
        "Strengthen what you have learned",
      color: "purple",
      path: "/practice-home",
      speech:
        "Practice makes you stronger!",
      tag: "BOOST",
    },
  ];

  // =========================================================
  // 🎁 EARNED REWARDS
  // =========================================================

  const earnedRewards =
    rewards.filter(
      (reward) =>
        claimedRewards.includes(
          reward.id
        )
    );

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="kids-home">

      <div className="jungle-glow jungle-glow-one" />

      <div className="jungle-glow jungle-glow-two" />

      <div className="floating-leaf leaf-one">
        🍃
      </div>

      <div className="floating-leaf leaf-two">
        🌿
      </div>

      <div className="floating-leaf leaf-three">
        🍃
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="kids-navbar">

        <button
          className="brand"
          onClick={() =>
            navigate(
              "/kids-home"
            )
          }
          aria-label="CurioKids home"
        >
          <span>
            CurioKids
          </span>
        </button>

        <div className="navbar-right">

          <button
            className="top-action rewards-action"
            onClick={() =>
              navigate(
                "/rewards"
              )
            }
          >
            <span>
              🏆
            </span>

            <span>
              Rewards
            </span>
          </button>

          <button
            className="top-action progress-action"
            onClick={() =>
              navigate(
                "/progress"
              )
            }
          >
            <span>
              📊
            </span>

            <span>
              Progress
            </span>
          </button>

          <div className="profile-container">

            <button
              className="profile-avatar"
              onClick={(e) => {
                e.stopPropagation();

                setProfileOpen(
                  (prev) =>
                    !prev
                );
              }}
              aria-label="Open profile"
            >
              👤
            </button>

            {profileOpen && (
              <div
                className="profile-dropdown"
                onClick={(e) =>
                  e.stopPropagation()
                }
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

                  <span>
                    ⭐ Stars
                  </span>

                  <strong>
                    {loadingProgress
                      ? "..."
                      : stars}
                  </strong>

                </div>

                <div className="profile-stat">

                  <span>
                    🔥 Streak
                  </span>

                  <strong>
                    {loadingProgress
                      ? "..."
                      : streak}{" "}
                    days
                  </strong>

                </div>

                <div className="profile-divider" />

                <button
                  onClick={() =>
                    navigate(
                      "/profile"
                    )
                  }
                >
                  👤 My Profile
                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/settings"
                    )
                  }
                >
                  ⚙️ Settings
                </button>

                <button
                  className="logout-btn"
                  onClick={
                    handleLogout
                  }
                >
                  🚪 Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENT
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
              Welcome to the
              <span>
                {" "}
                Jungle! 🌿
              </span>
            </h1>

            <p>
              Hi {userName}! Let's play,
              learn, and grow together.
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
                Pick a zone and let's make
                today a learning adventure!
              </p>

            </div>

            <div className="tiny-jungle-sign">

              <span>
                🦋
              </span>

              Learn &amp; play!

            </div>

          </div>

          <div className="zone-grid">

            {zones.map(
              (
                zone,
                index
              ) => (
                <button
                  key={
                    zone.key
                  }
                  className={`zone-card zone-${zone.color}`}
                  onClick={() =>
                    navigate(
                      zone.path
                    )
                  }
                  onMouseEnter={() =>
                    speakText(
                      zone.speech
                    )
                  }
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
                    PLAY{" "}
                    <b>
                      ›
                    </b>
                  </span>

                  <div className="zone-dots">
                    <i />
                    <i />
                    <i />
                  </div>

                </button>
              )
            )}

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
              Every little step makes
              you stronger! 💚
            </strong>

          </div>

          <div className="encouragement-leaves">
            🌿🍃
          </div>

        </section>

        {/* ===================================================
            🏆 REAL EARNED REWARDS
            Added without changing the existing sections.
        =================================================== */}

        <section
          style={{
            marginTop:
              "22px",

            padding:
              "20px 22px",

            borderRadius:
              "22px",

            background:
              "rgba(255,255,255,0.88)",

            boxShadow:
              "0 10px 25px rgba(30,80,30,0.12)",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                "16px",

              flexWrap:
                "wrap",
            }}
          >

            <div>

              <span
                style={{
                  display:
                    "block",

                  fontSize:
                    "12px",

                  fontWeight:
                    "800",

                  letterSpacing:
                    "1px",

                  color:
                    "#64846a",
                }}
              >
                YOUR REWARDS
              </span>

              <h2
                style={{
                  margin:
                    "4px 0 0",

                  color:
                    "#17451f",

                  fontSize:
                    "24px",
                }}
              >
                Jungle Achievements 🏆
              </h2>

            </div>

            <button
              onClick={() =>
                navigate(
                  "/rewards"
                )
              }
              style={{
                border:
                  "none",

                borderRadius:
                  "12px",

                padding:
                  "10px 16px",

                background:
                  "#ffbd22",

                color:
                  "#173d1f",

                fontFamily:
                  "inherit",

                fontWeight:
                  "900",

                cursor:
                  "pointer",
              }}
            >
              View All →
            </button>

          </div>

          {earnedRewards.length ===
          0 ? (
            <p
              style={{
                margin:
                  "14px 0 0",

                color:
                  "#627763",

                fontWeight:
                  "700",
              }}
            >
              Your first reward is waiting! Earn stars ⭐
            </p>
          ) : (
            <div
              style={{
                display:
                  "flex",

                gap:
                  "12px",

                flexWrap:
                  "wrap",

                marginTop:
                  "16px",
              }}
            >

              {earnedRewards
                .slice(-5)
                .map(
                  (reward) => (
                    <div
                      key={
                        reward.id
                      }
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "8px",

                        padding:
                          "10px 13px",

                        borderRadius:
                          "14px",

                        background:
                          "#f0fae8",

                        color:
                          "#214f2a",

                        fontWeight:
                          "800",
                      }}
                    >
                      <span>
                        {reward.icon}
                      </span>

                      <span>
                        {reward.title}
                      </span>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}