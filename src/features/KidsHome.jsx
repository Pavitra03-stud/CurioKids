// // // import "../styles/KidsHome.css";
// // // import { speak } from "../utils/speak";
// // // import foxy from "../assets/foxy-cutout.png";
// // // import { useNavigate } from "react-router-dom";

// // // export default function KidsHome() {
// // //   const navigate = useNavigate(); // ✅ NEW

// // //   const speakText = (text) => {
// // //     speak(text);
// // //   };

// // //   return (
// // //     <div className="kids-home">

// // //       {/* 🦊 MASCOT */}
// // //       <div className="mascot-container">
// // //         <img src={foxy} alt="Jungle Friend" className="mascot-img" />
// // //         <div className="mascot-bubble">
// // //           <strong>Let’s start learning!!!</strong>
// // //         </div>
// // //       </div>

// // //       {/* 🌴 NAVBAR */}
// // //       <div className="kids-navbar">

// // //         {/* ❌ REMOVED BACK BUTTON */}

// // //         <div className="navbar-title">🌴 CurioKids</div>

// // //         <div className="navbar-right">
// // //           <button className="pill" onClick={() => navigate("/rewards")}>
// // //             🏆 Rewards
// // //           </button>

// // //           <button className="pill" onClick={() => navigate("/progress")}>
// // //             📊 Progress
// // //           </button>
// // //         </div>

// // //       </div>

// // //       {/* 🌿 CONTENT */}
// // //       <div className="kids-content">

// // //         {/* 🌱 WELCOME */}
// // //         <section className="welcome-section">
// // //           <h1>Welcome to the Jungle 🌿</h1>
// // //           <p>Let's play, learn, and grow together!</p>
// // //         </section>

// // //         {/* 🧩 MAIN CARDS */}
// // //         <section className="card-grid">

// // //           {/* ===== GAMES ===== */}
// // //           <div
// // //             className="jungle-card"
// // //             onClick={() => navigate("/games-home")}
// // //             onMouseEnter={() => speakText("Let's play fun games!")}
// // //           >
// // //             <span className="card-icon">🎮</span>
// // //             <span className="card-text">Games</span>
// // //           </div>

// // //           <div className="games-topic">
// // //             <span className="card-text">Games</span>
// // //             <ul>
// // //               <li className="topic-link">Decoding Practice</li>
// // //               <li className="topic-link">Identifying Concepts</li>
// // //               <li className="topic-link">Isolating Speech Sounds</li>
// // //             </ul>
// // //           </div>

// // //           {/* ===== LETTERS ===== */}
// // //           <div
// // //             className="jungle-card"
// // //             onClick={() => navigate("/letters-home")}
// // //             onMouseEnter={() => speakText("Let's learn letters together!")}
// // //           >
// // //             <span className="card-icon">🔤</span>
// // //             <span className="card-text">Letters</span>
// // //           </div>

// // //           <div className="games-topic">
// // //             <span className="card-text">Letters</span>
// // //             <ul>
// // //               <li className="topic-link">Alphabet Explorer Zone</li>
// // //               <li className="topic-link">Letter Detective Zone</li>
// // //               <li className="topic-link">Writing & Shape Zone</li>
// // //               <li className="topic-link">Letter Challenge Arena</li>
// // //             </ul>
// // //           </div>

// // //           {/* ===== NUMBERS ===== */}
// // //           <div
// // //             className="jungle-card"
// // //             onClick={() => navigate("/numbers")}
// // //             onMouseEnter={() => speakText("Numbers are fun to learn!")}
// // //           >
// // //             <span className="card-icon">🔢</span>
// // //             <span className="card-text">Numbers</span>
// // //           </div>

// // //           <div className="games-topic">
// // //             <span className="card-text">Numbers</span>
// // //             <ul>
// // //               <li className="topic-link">Number Writing</li>
// // //               <li className="topic-link">Spelling Practice</li>
// // //               <li className="topic-link">Focused Spelling</li>
// // //             </ul>
// // //           </div>

// // //           {/* ===== PRACTICE ===== */}
// // //           <div
// // //             className="jungle-card"
// // //             onClick={() => navigate("/practice-home")}
// // //             onMouseEnter={() => speakText("Practice makes you stronger!")}
// // //           >
// // //             <span className="card-icon">🧠</span>
// // //             <span className="card-text">Practice</span>
// // //           </div>

// // //           <div className="games-topic">
// // //             <span className="card-text">Practice</span>
// // //             <ul>

// // //               <li
// // //                 className="topic-link"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   navigate("/practice-letter-mastery");
// // //                 }}
// // //               >
// // //                 Letter Mastery Zone
// // //               </li>

// // //               <li
// // //                 className="topic-link"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   navigate("/practice-phonics");
// // //                 }}
// // //               >
// // //                 Phonics Power Zone
// // //               </li>

// // //               <li
// // //                 className="topic-link"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   navigate("/practice-word-builder");
// // //                 }}
// // //               >
// // //                 Word Builder Zone
// // //               </li>

// // //               <li
// // //                 className="topic-link"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   navigate("/practice-memory");
// // //                 }}
// // //               >
// // //                 Memory & Visual Skills
// // //               </li>

// // //               <li
// // //                 className="topic-link"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   navigate("/practice-confidence");
// // //                 }}
// // //               >
// // //                 Confidence Boost Zone
// // //               </li>

// // //             </ul>
// // //           </div>

// // //         </section>
// // //       </div>
// // //     </div>
// // //   );
// // // }





// // import "../styles/KidsHome.css";
// // import { speak } from "../utils/speak";
// // import foxy from "../assets/foxy-cutout.png";
// // import { useNavigate } from "react-router-dom";
// // import { useState } from "react";

// // export default function KidsHome() {
// //   const navigate = useNavigate();
// //   const [profileOpen, setProfileOpen] = useState(false);

// //   const speakText = (text) => {
// //     speak(text);
// //   };

// //   return (
// //     <div className="kids-home">

// //       {/* 🦊 MASCOT */}
// //       <div className="mascot-container">
// //         <img src={foxy} alt="Jungle Friend" className="mascot-img" />
// //         <div className="mascot-bubble">
// //           <strong>Let’s start learning!!!</strong>
// //         </div>
// //       </div>

// //       {/* 🌴 NAVBAR */}
// //       <div className="kids-navbar">

// //         <div className="navbar-title">🌴 CurioKids</div>

// //         <div className="navbar-right">

// //           {/* 🏆 Rewards */}
// //           <button className="pill" onClick={() => navigate("/rewards")}>
// //             🏆 Rewards
// //           </button>

// //           {/* 📊 Progress */}
// //           <button className="pill" onClick={() => navigate("/progress")}>
// //             📊 Progress
// //           </button>

// //           {/* 👤 PROFILE */}
// //           <div className="profile-container">
// //             <div
// //               className="profile-avatar"
// //               onClick={() => setProfileOpen(!profileOpen)}
// //             >
// //               👤
// //             </div>

// //             {profileOpen && (
// //               <div className="profile-dropdown">
// //                 <p className="profile-name">Pavii 🌟</p>
// //                 <p>Level: 5</p>
// //                 <p>🔥 Streak: 3 days</p>

// //                 <hr />

// //                 <button onClick={() => navigate("/profile")}>
// //                   👤 My Profile
// //                 </button>

// //                 <button>
// //                   ⚙️ Settings
// //                 </button>

// //                 <button className="logout-btn">
// //                   🚪 Logout
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //         </div>
// //       </div>

// //       {/* 🌿 CONTENT */}
// //       <div className="kids-content">

// //         {/* 🌱 WELCOME */}
// //         <section className="welcome-section">
// //           <h1>Welcome to the Jungle 🌿</h1>
// //           <p>Let's play, learn, and grow together!</p>
// //         </section>

// //         {/* 🧩 MAIN CARDS */}
// //         <section className="card-grid">

// //           {/* ===== GAMES ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/games-home")}
// //             onMouseEnter={() => speakText("Let's play fun games!")}
// //           >
// //             <span className="card-icon">🎮</span>
// //             <span className="card-text">Games</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Games</span>
// //             <ul>
// //               <li className="topic-link">Decoding Practice</li>
// //               <li className="topic-link">Identifying Concepts</li>
// //               <li className="topic-link">Isolating Speech Sounds</li>
// //             </ul>
// //           </div>

// //           {/* ===== LETTERS ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/letters-home")}
// //             onMouseEnter={() => speakText("Let's learn letters together!")}
// //           >
// //             <span className="card-icon">🔤</span>
// //             <span className="card-text">Letters</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Letters</span>
// //             <ul>
// //               <li className="topic-link">Alphabet Explorer Zone</li>
// //               <li className="topic-link">Letter Detective Zone</li>
// //               <li className="topic-link">Writing & Shape Zone</li>
// //               <li className="topic-link">Letter Challenge Arena</li>
// //             </ul>
// //           </div>

// //           {/* ===== NUMBERS ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/numbers")}
// //             onMouseEnter={() => speakText("Numbers are fun to learn!")}
// //           >
// //             <span className="card-icon">🔢</span>
// //             <span className="card-text">Numbers</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Numbers</span>
// //             <ul>
// //               <li className="topic-link">Number Writing</li>
// //               <li className="topic-link">Spelling Practice</li>
// //               <li className="topic-link">Focused Spelling</li>
// //             </ul>
// //           </div>

// //           {/* ===== PRACTICE ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/practice-home")}
// //             onMouseEnter={() => speakText("Practice makes you stronger!")}
// //           >
// //             <span className="card-icon">🧠</span>
// //             <span className="card-text">Practice</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Practice</span>
// //             <ul>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-letter-mastery");
// //                 }}
// //               >
// //                 Letter Mastery Zone
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-phonics");
// //                 }}
// //               >
// //                 Phonics Power Zone
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-word-builder");
// //                 }}
// //               >
// //                 Word Builder Zone
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-memory");
// //                 }}
// //               >
// //                 Memory & Visual Skills
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-confidence");
// //                 }}
// //               >
// //                 Confidence Boost Zone
// //               </li>

// //             </ul>
// //           </div>

// //         </section>
// //       </div>
// //     </div>
// //   );
// // }




// // import "../styles/KidsHome.css";
// // import { speak } from "../utils/speak";
// // import foxy from "../assets/foxy-cutout.png";
// // import { useNavigate } from "react-router-dom";

// // export default function KidsHome() {
// //   const navigate = useNavigate(); // ✅ NEW

// //   const speakText = (text) => {
// //     speak(text);
// //   };

// //   return (
// //     <div className="kids-home">

// //       {/* 🦊 MASCOT */}
// //       <div className="mascot-container">
// //         <img src={foxy} alt="Jungle Friend" className="mascot-img" />
// //         <div className="mascot-bubble">
// //           <strong>Let’s start learning!!!</strong>
// //         </div>
// //       </div>

// //       {/* 🌴 NAVBAR */}
// //       <div className="kids-navbar">

// //         {/* ❌ REMOVED BACK BUTTON */}

// //         <div className="navbar-title">🌴 CurioKids</div>

// //         <div className="navbar-right">
// //           <button className="pill" onClick={() => navigate("/rewards")}>
// //             🏆 Rewards
// //           </button>

// //           <button className="pill" onClick={() => navigate("/progress")}>
// //             📊 Progress
// //           </button>
// //         </div>

// //       </div>

// //       {/* 🌿 CONTENT */}
// //       <div className="kids-content">

// //         {/* 🌱 WELCOME */}
// //         <section className="welcome-section">
// //           <h1>Welcome to the Jungle 🌿</h1>
// //           <p>Let's play, learn, and grow together!</p>
// //         </section>

// //         {/* 🧩 MAIN CARDS */}
// //         <section className="card-grid">

// //           {/* ===== GAMES ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/games-home")}
// //             onMouseEnter={() => speakText("Let's play fun games!")}
// //           >
// //             <span className="card-icon">🎮</span>
// //             <span className="card-text">Games</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Games</span>
// //             <ul>
// //               <li className="topic-link">Decoding Practice</li>
// //               <li className="topic-link">Identifying Concepts</li>
// //               <li className="topic-link">Isolating Speech Sounds</li>
// //             </ul>
// //           </div>

// //           {/* ===== LETTERS ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/letters-home")}
// //             onMouseEnter={() => speakText("Let's learn letters together!")}
// //           >
// //             <span className="card-icon">🔤</span>
// //             <span className="card-text">Letters</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Letters</span>
// //             <ul>
// //               <li className="topic-link">Alphabet Explorer Zone</li>
// //               <li className="topic-link">Letter Detective Zone</li>
// //               <li className="topic-link">Writing & Shape Zone</li>
// //               <li className="topic-link">Letter Challenge Arena</li>
// //             </ul>
// //           </div>

// //           {/* ===== NUMBERS ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/numbers")}
// //             onMouseEnter={() => speakText("Numbers are fun to learn!")}
// //           >
// //             <span className="card-icon">🔢</span>
// //             <span className="card-text">Numbers</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Numbers</span>
// //             <ul>
// //               <li className="topic-link">Number Writing</li>
// //               <li className="topic-link">Spelling Practice</li>
// //               <li className="topic-link">Focused Spelling</li>
// //             </ul>
// //           </div>

// //           {/* ===== PRACTICE ===== */}
// //           <div
// //             className="jungle-card"
// //             onClick={() => navigate("/practice-home")}
// //             onMouseEnter={() => speakText("Practice makes you stronger!")}
// //           >
// //             <span className="card-icon">🧠</span>
// //             <span className="card-text">Practice</span>
// //           </div>

// //           <div className="games-topic">
// //             <span className="card-text">Practice</span>
// //             <ul>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-letter-mastery");
// //                 }}
// //               >
// //                 Letter Mastery Zone
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-phonics");
// //                 }}
// //               >
// //                 Phonics Power Zone
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-word-builder");
// //                 }}
// //               >
// //                 Word Builder Zone
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-memory");
// //                 }}
// //               >
// //                 Memory & Visual Skills
// //               </li>

// //               <li
// //                 className="topic-link"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   navigate("/practice-confidence");
// //                 }}
// //               >
// //                 Confidence Boost Zone
// //               </li>

// //             </ul>
// //           </div>

// //         </section>
// //       </div>
// //     </div>
// //   );
// // }





// import "../styles/KidsHome.css";
// import { speak } from "../utils/speak";
// import foxy from "../assets/foxy-cutout.png";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function KidsHome() {
//   const navigate = useNavigate();
//   const [profileOpen, setProfileOpen] = useState(false);

//   const speakText = (text) => {
//     speak(text);
//   };

//   return (
//     <div className="kids-home">

//       {/* 🦊 MASCOT */}
//       <div className="mascot-container">
//         <img src={foxy} alt="Jungle Friend" className="mascot-img" />
//         <div className="mascot-bubble">
//           <strong>Let’s start learning!!!</strong>
//         </div>
//       </div>

//       {/* 🌴 NAVBAR */}
//       <div className="kids-navbar">

//         <div className="navbar-title">🌴 CurioKids</div>

//         <div className="navbar-right">

//           {/* 🏆 Rewards */}
//           <button className="pill" onClick={() => navigate("/rewards")}>
//             🏆 Rewards
//           </button>

//           {/* 📊 Progress */}
//           <button className="pill" onClick={() => navigate("/progress")}>
//             📊 Progress
//           </button>

//           {/* 👤 PROFILE */}
//           <div className="profile-container">
//             <div
//               className="profile-avatar"
//               onClick={() => setProfileOpen(!profileOpen)}
//             >
//               👤
//             </div>

//             {profileOpen && (
//               <div className="profile-dropdown">
//                 <p className="profile-name">Pavii 🌟</p>
//                 <p>Level: 5</p>
//                 <p>🔥 Streak: 3 days</p>

//                 <hr />

//                 <button onClick={() => navigate("/profile")}>
//                   👤 My Profile
//                 </button>

//                 <button>
//                   ⚙️ Settings
//                 </button>

//                 <button className="logout-btn">
//                   🚪 Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>

//       {/* 🌿 CONTENT */}
//       <div className="kids-content">

//         {/* 🌱 WELCOME */}
//         <section className="welcome-section">
//           <h1>Welcome to the Jungle 🌿</h1>
//           <p>Let's play, learn, and grow together!</p>
//         </section>

//         {/* 🧩 MAIN CARDS */}
//         <section className="card-grid">

//           {/* ===== GAMES ===== */}
//           <div
//             className="jungle-card"
//             onClick={() => navigate("/games-home")}
//             onMouseEnter={() => speakText("Let's play fun games!")}
//           >
//             <span className="card-icon">🎮</span>
//             <span className="card-text">Games</span>
//           </div>

//           <div className="games-topic">
//             <span className="card-text">Games</span>
//             <ul>
//               <li className="topic-link">Decoding Practice</li>
//               <li className="topic-link">Identifying Concepts</li>
//               <li className="topic-link">Isolating Speech Sounds</li>
//             </ul>
//           </div>

//           {/* ===== LETTERS ===== */}
//           <div
//             className="jungle-card"
//             onClick={() => navigate("/letters-home")}
//             onMouseEnter={() => speakText("Let's learn letters together!")}
//           >
//             <span className="card-icon">🔤</span>
//             <span className="card-text">Letters</span>
//           </div>

//           <div className="games-topic">
//             <span className="card-text">Letters</span>
//             <ul>
//               <li className="topic-link">Alphabet Explorer Zone</li>
//               <li className="topic-link">Letter Detective Zone</li>
//               <li className="topic-link">Writing & Shape Zone</li>
//               <li className="topic-link">Letter Challenge Arena</li>
//             </ul>
//           </div>

//           {/* ===== NUMBERS ===== */}
//           <div
//             className="jungle-card"
//             onClick={() => navigate("/numbers")}
//             onMouseEnter={() => speakText("Numbers are fun to learn!")}
//           >
//             <span className="card-icon">🔢</span>
//             <span className="card-text">Numbers</span>
//           </div>

//           <div className="games-topic">
//             <span className="card-text">Numbers</span>
//             <ul>
//               <li className="topic-link">Number Writing</li>
//               <li className="topic-link">Spelling Practice</li>
//               <li className="topic-link">Focused Spelling</li>
//             </ul>
//           </div>

//           {/* ===== PRACTICE ===== */}
//           <div
//             className="jungle-card"
//             onClick={() => navigate("/practice-home")}
//             onMouseEnter={() => speakText("Practice makes you stronger!")}
//           >
//             <span className="card-icon">🧠</span>
//             <span className="card-text">Practice</span>
//           </div>

//           <div className="games-topic">
//             <span className="card-text">Practice</span>
//             <ul>

//               <li
//                 className="topic-link"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/practice-letter-mastery");
//                 }}
//               >
//                 Letter Mastery Zone
//               </li>

//               <li
//                 className="topic-link"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/practice-phonics");
//                 }}
//               >
//                 Phonics Power Zone
//               </li>

//               <li
//                 className="topic-link"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/practice-word-builder");
//                 }}
//               >
//                 Word Builder Zone
//               </li>

//               <li
//                 className="topic-link"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/practice-memory");
//                 }}
//               >
//                 Memory & Visual Skills
//               </li>

//               <li
//                 className="topic-link"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/practice-confidence");
//                 }}
//               >
//                 Confidence Boost Zone
//               </li>

//             </ul>
//           </div>

//         </section>
//       </div>
//     </div>
//   );
// }




import "../styles/KidsHome.css";
import { speak } from "../utils/speak";
import foxy from "../assets/foxy-cutout.png";
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

  // =========================================================
  // LOAD USER PROFILE FROM FIREBASE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.log("⚠️ No Firebase userId found");
          return;
        }

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

          console.log("👤 KidsHome profile:", data);
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
  // LEVEL CALCULATION
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

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("loginEmail");

    setProfileOpen(false);

    navigate("/login");
  };

  // =========================================================
  // CLOSE PROFILE WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".profile-container")
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
  // UI
  // =========================================================

  return (
    <div className="kids-home">

      {/* =====================================================
          🦊 MASCOT
      ===================================================== */}

      <div className="mascot-container">

        <img
          src={foxy}
          alt="Jungle Friend"
          className="mascot-img"
        />

        <div className="mascot-bubble">
          <strong>
            Let’s start learning!!!
          </strong>
        </div>

      </div>

      {/* =====================================================
          🌴 NAVBAR
      ===================================================== */}

      <div className="kids-navbar">

        <div className="navbar-title">
          🌴 CurioKids
        </div>

        <div className="navbar-right">

          {/* 🏆 Rewards */}
          <button
            className="pill"
            onClick={() =>
              navigate("/rewards")
            }
          >
            🏆 Rewards
          </button>

          {/* 📊 Progress */}
          <button
            className="pill"
            onClick={() =>
              navigate("/progress")
            }
          >
            📊 Progress
          </button>

          {/* 👤 PROFILE */}
          <div className="profile-container">

            <div
              className="profile-avatar"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(
                  (prev) => !prev
                );
              }}
            >
              👤
            </div>

            {profileOpen && (
              <div
                className="profile-dropdown"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <p className="profile-name">
                  {userName} 🌟
                </p>

                <p>
                  Level: {level}
                </p>

                <p>
                  ⭐ Stars:{" "}
                  {loadingProgress
                    ? "..."
                    : stars}
                </p>

                <p>
                  🔥 Streak:{" "}
                  {loadingProgress
                    ? "..."
                    : streak}{" "}
                  days
                </p>

                <hr />

                <button
                  onClick={() =>
                    navigate("/profile")
                  }
                >
                  👤 My Profile
                </button>

                <button
                  onClick={() =>
                    navigate("/settings")
                  }
                >
                  ⚙️ Settings
                </button>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          🌿 CONTENT
      ===================================================== */}

      <div className="kids-content">

        {/* 🌱 WELCOME */}

        <section className="welcome-section">

          <h1>
            Welcome to the Jungle 🌿
          </h1>

          <p>
            Let's play, learn, and grow together!
          </p>

        </section>

        {/* ===================================================
            🧩 MAIN CARDS
        =================================================== */}

        <section className="card-grid">

          {/* =================================================
              🎮 GAMES
          ================================================= */}

          <div
            className="jungle-card"
            onClick={() =>
              navigate("/games-home")
            }
            onMouseEnter={() =>
              speakText(
                "Let's play fun games!"
              )
            }
          >
            <span className="card-icon">
              🎮
            </span>

            <span className="card-text">
              Games
            </span>
          </div>

          <div className="games-topic">

            <span className="card-text">
              Games
            </span>

            <ul>

              <li className="topic-link">
                Decoding Practice
              </li>

              <li className="topic-link">
                Identifying Concepts
              </li>

              <li className="topic-link">
                Isolating Speech Sounds
              </li>

            </ul>

          </div>

          {/* =================================================
              🔤 LETTERS
          ================================================= */}

          <div
            className="jungle-card"
            onClick={() =>
              navigate("/letters-home")
            }
            onMouseEnter={() =>
              speakText(
                "Let's learn letters together!"
              )
            }
          >

            <span className="card-icon">
              🔤
            </span>

            <span className="card-text">
              Letters
            </span>

          </div>

          <div className="games-topic">

            <span className="card-text">
              Letters
            </span>

            <ul>

              <li className="topic-link">
                Alphabet Explorer Zone
              </li>

              <li className="topic-link">
                Letter Detective Zone
              </li>

              <li className="topic-link">
                Writing & Shape Zone
              </li>

              <li className="topic-link">
                Letter Challenge Arena
              </li>

            </ul>

          </div>

          {/* =================================================
              🔢 NUMBERS
          ================================================= */}

          <div
            className="jungle-card"
            onClick={() =>
              navigate("/numbers")
            }
            onMouseEnter={() =>
              speakText(
                "Numbers are fun to learn!"
              )
            }
          >

            <span className="card-icon">
              🔢
            </span>

            <span className="card-text">
              Numbers
            </span>

          </div>

          <div className="games-topic">

            <span className="card-text">
              Numbers
            </span>

            <ul>

              <li className="topic-link">
                Number Writing
              </li>

              <li className="topic-link">
                Spelling Practice
              </li>

              <li className="topic-link">
                Focused Spelling
              </li>

            </ul>

          </div>

          {/* =================================================
              🧠 PRACTICE
          ================================================= */}

          <div
            className="jungle-card"
            onClick={() =>
              navigate("/practice-home")
            }
            onMouseEnter={() =>
              speakText(
                "Practice makes you stronger!"
              )
            }
          >

            <span className="card-icon">
              🧠
            </span>

            <span className="card-text">
              Practice
            </span>

          </div>

          <div className="games-topic">

            <span className="card-text">
              Practice
            </span>

            <ul>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    "/practice-letter-mastery"
                  );
                }}
              >
                Letter Mastery Zone
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    "/practice-phonics"
                  );
                }}
              >
                Phonics Power Zone
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    "/practice-word-builder"
                  );
                }}
              >
                Word Builder Zone
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    "/practice-memory"
                  );
                }}
              >
                Memory & Visual Skills
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    "/practice-confidence"
                  );
                }}
              >
                Confidence Boost Zone
              </li>

            </ul>

          </div>

        </section>

      </div>

    </div>
  );
}