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




// import "../styles/KidsHome.css";
// import { speak } from "../utils/speak";
// import foxy from "../assets/foxy-cutout.png";
// import { useNavigate } from "react-router-dom";

// export default function KidsHome() {
//   const navigate = useNavigate(); // ✅ NEW

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

//         {/* ❌ REMOVED BACK BUTTON */}

//         <div className="navbar-title">🌴 CurioKids</div>

//         <div className="navbar-right">
//           <button className="pill" onClick={() => navigate("/rewards")}>
//             🏆 Rewards
//           </button>

//           <button className="pill" onClick={() => navigate("/progress")}>
//             📊 Progress
//           </button>
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
import { useState } from "react";

export default function KidsHome() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const speakText = (text) => {
    speak(text);
  };

  return (
    <div className="kids-home">

      {/* 🦊 MASCOT */}
      <div className="mascot-container">
        <img src={foxy} alt="Jungle Friend" className="mascot-img" />
        <div className="mascot-bubble">
          <strong>Let’s start learning!!!</strong>
        </div>
      </div>

      {/* 🌴 NAVBAR */}
      <div className="kids-navbar">

        <div className="navbar-title">🌴 CurioKids</div>

        <div className="navbar-right">

          {/* 🏆 Rewards */}
          <button className="pill" onClick={() => navigate("/rewards")}>
            🏆 Rewards
          </button>

          {/* 📊 Progress */}
          <button className="pill" onClick={() => navigate("/progress")}>
            📊 Progress
          </button>

          {/* 👤 PROFILE */}
          <div className="profile-container">
            <div
              className="profile-avatar"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              👤
            </div>

            {profileOpen && (
              <div className="profile-dropdown">
                <p className="profile-name">Pavii 🌟</p>
                <p>Level: 5</p>
                <p>🔥 Streak: 3 days</p>

                <hr />

                <button onClick={() => navigate("/profile")}>
                  👤 My Profile
                </button>

                <button>
                  ⚙️ Settings
                </button>

                <button className="logout-btn">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 🌿 CONTENT */}
      <div className="kids-content">

        {/* 🌱 WELCOME */}
        <section className="welcome-section">
          <h1>Welcome to the Jungle 🌿</h1>
          <p>Let's play, learn, and grow together!</p>
        </section>

        {/* 🧩 MAIN CARDS */}
        <section className="card-grid">

          {/* ===== GAMES ===== */}
          <div
            className="jungle-card"
            onClick={() => navigate("/games-home")}
            onMouseEnter={() => speakText("Let's play fun games!")}
          >
            <span className="card-icon">🎮</span>
            <span className="card-text">Games</span>
          </div>

          <div className="games-topic">
            <span className="card-text">Games</span>
            <ul>
              <li className="topic-link">Decoding Practice</li>
              <li className="topic-link">Identifying Concepts</li>
              <li className="topic-link">Isolating Speech Sounds</li>
            </ul>
          </div>

          {/* ===== LETTERS ===== */}
          <div
            className="jungle-card"
            onClick={() => navigate("/letters-home")}
            onMouseEnter={() => speakText("Let's learn letters together!")}
          >
            <span className="card-icon">🔤</span>
            <span className="card-text">Letters</span>
          </div>

          <div className="games-topic">
            <span className="card-text">Letters</span>
            <ul>
              <li className="topic-link">Alphabet Explorer Zone</li>
              <li className="topic-link">Letter Detective Zone</li>
              <li className="topic-link">Writing & Shape Zone</li>
              <li className="topic-link">Letter Challenge Arena</li>
            </ul>
          </div>

          {/* ===== NUMBERS ===== */}
          <div
            className="jungle-card"
            onClick={() => navigate("/numbers")}
            onMouseEnter={() => speakText("Numbers are fun to learn!")}
          >
            <span className="card-icon">🔢</span>
            <span className="card-text">Numbers</span>
          </div>

          <div className="games-topic">
            <span className="card-text">Numbers</span>
            <ul>
              <li className="topic-link">Number Writing</li>
              <li className="topic-link">Spelling Practice</li>
              <li className="topic-link">Focused Spelling</li>
            </ul>
          </div>

          {/* ===== PRACTICE ===== */}
          <div
            className="jungle-card"
            onClick={() => navigate("/practice-home")}
            onMouseEnter={() => speakText("Practice makes you stronger!")}
          >
            <span className="card-icon">🧠</span>
            <span className="card-text">Practice</span>
          </div>

          <div className="games-topic">
            <span className="card-text">Practice</span>
            <ul>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/practice-letter-mastery");
                }}
              >
                Letter Mastery Zone
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/practice-phonics");
                }}
              >
                Phonics Power Zone
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/practice-word-builder");
                }}
              >
                Word Builder Zone
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/practice-memory");
                }}
              >
                Memory & Visual Skills
              </li>

              <li
                className="topic-link"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/practice-confidence");
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