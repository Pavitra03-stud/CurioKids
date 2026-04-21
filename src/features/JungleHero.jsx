// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/JungleHero.css";

// export default function JungleHero() {
//   const navigate = useNavigate();
//   const [friend, setFriend] = useState(null);

//   useEffect(() => {
//     const savedFriend = localStorage.getItem("jungleFriend");
//     if (savedFriend) setFriend(JSON.parse(savedFriend));
//   }, []);

//   return (
//     <div className="jungle-hero-page">

//       {/* 🌴 FIXED NAVBAR */}
//       <div className="hero-navbar">

//         <div className="navbar-title">
//           🌴 CurioKids
//         </div>
//       </div>

//       {/* 🌿 PAGE CONTENT */}
//       <div className="hero-content-wrapper">

//         {/* 🌴 HERO SECTION */}
//         <section className="hero-section">
//           <div className="hero-content">
//             <h1>
//               A Joyful Start to Your <br />
//               <span>Learning Jungle</span>
//             </h1>

//             <p>
//               A calm, supportive learning space for children —
//               designed with care for dyslexia and learning differences.
//             </p>

//             <div className="hero-buttons">
//               <button
//                 className="hero-btn student"
//                 onClick={() => navigate("/kids-home")}
//               >
//                 Student 🌱
//               </button>

//               <button
//                 className="hero-btn parent"
//                 onClick={() => navigate("/parent-dashboard")}
//               >
//                 Parent 👨‍👩‍👧
//               </button>
//             </div>
//           </div>

//           {friend && (
//             <div className="hero-friend">
//               <img src={friend.image} alt={friend.name} />
//               <p>Hi, I’m <b>{friend.name}</b> 🐾</p>
//             </div>
//           )}
//         </section>

//         {/* 💚 ABOUT DYSLEXIA */}
//         <section className="dyslexia-section">
//           <h2>💚 Understanding Dyslexia</h2>

//           <p className="intro">
//             Dyslexia is a <strong>learning difference</strong> that affects how
//             children read, spell, and process letters —
//             but it has <strong>nothing to do with intelligence</strong>.
//           </p>

//           <div className="info-grid">
//             <InfoCard
//               title="🧠 What it is"
//               text="Dyslexia affects how the brain processes language. Children learn differently — not slowly."
//             />
//             <InfoCard
//               title="❌ What it is NOT"
//               text="Dyslexia is not laziness, low intelligence, or lack of effort."
//             />
//             <InfoCard
//               title="🌈 How CurioKids Helps"
//               text="We use games, visuals, repetition, and encouragement to build confidence and joy."
//             />
//           </div>

//           <p className="closing">
//             Every child learns differently 🌱 — CurioKids grows with them.
//           </p>
//         </section>

//         {/* 🚀 HOW OUR WEBSITE WORKS */}
//         <section className="how-section">
//           <h2>✨ How CurioKids Works</h2>

//           <div className="steps">
//             <Step number="1" text="Create a calm, playful learning profile" />
//             <Step number="2" text="Learn through games and visual activities" />
//             <Step number="3" text="Build confidence step by step — no pressure" />
//             <Step number="4" text="Parents track growth, not marks" />
//           </div>

//           <div className="motivation-box">
//             <h3>💛 A Message for Students</h3>
//             <p>
//               You are not slow.
//               You are not weak.
//               Your brain is unique — and that is your superpower 🌟
//             </p>
//           </div>
//         </section>

//         {/* 🌿 FOOTER */}
//         <footer className="hero-footer">
//           <div className="footer-grid">
//             <div>
//               <h3>🌴 CurioKids</h3>
//               <p>
//                 A joyful jungle where children with dyslexia learn through
//                 play, confidence, and care.
//               </p>
//             </div>

//             <div>
//               <h4>🎮 For Students</h4>
//               <ul>
//                 <li>Fun learning games</li>
//                 <li>Friendly jungle characters</li>
//                 <li>Learn at your own pace</li>
//               </ul>
//             </div>

//             <div>
//               <h4>📊 For Parents</h4>
//               <ul>
//                 <li>Child progress tracking</li>
//                 <li>Time control & safety</li>
//                 <li>Stress-free learning</li>
//               </ul>
//             </div>

//             <div>
//               <h4>💚 Our Promise</h4>
//               <p>
//                 Every child is smart.<br />
//                 Every journey is unique.<br />
//                 We grow together 🌱
//               </p>
//             </div>
//           </div>

//           <div className="copyright">
//             © {new Date().getFullYear()} CurioKids • Built with ❤️ for young learners
//           </div>
//         </footer>

//       </div>
//     </div>
//   );
// }

// /* 🟢 COMPONENTS */
// function InfoCard({ title, text }) {
//   return (
//     <div className="info-card">
//       <h3>{title}</h3>
//       <p>{text}</p>
//     </div>
//   );
// }

// function Step({ number, text }) {
//   return (
//     <div className="step-card">
//       <h4>{number}</h4>
//       <p>{text}</p>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/JungleHero.css";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function JungleHero() {
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");
    if (savedFriend) setFriend(JSON.parse(savedFriend));

    // ✅ LOG PAGE VISIT
    logVisit();
  }, []);

  // ✅ ACTIVITY LOGGER
  const logVisit = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "visit",
      screen: "jungle-hero",
      module: "home",
      timestamp: new Date(),
    });
  };

  // ✅ NAVIGATION TRACKING
  const handleNavigate = async (path, role) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "enter",
        screen: role,
        module: "home",
        timestamp: new Date(),
      });
    }

    navigate(path);
  };

  return (
    <div className="jungle-hero-page">

      <div className="hero-navbar">
        <div className="navbar-title">
          🌴 CurioKids
        </div>
      </div>

      <div className="hero-content-wrapper">

        <section className="hero-section">
          <div className="hero-content">
            <h1>
              A Joyful Start to Your <br />
              <span>Learning Jungle</span>
            </h1>

            <p>
              A calm, supportive learning space for children —
              designed with care for dyslexia and learning differences.
            </p>

            <div className="hero-buttons">
              <button
                className="hero-btn student"
                onClick={() => handleNavigate("/kids-home", "student")}
              >
                Student 🌱
              </button>

              <button
                className="hero-btn parent"
                onClick={() => handleNavigate("/parent-dashboard", "parent")}
              >
                Parent 👨‍👩‍👧
              </button>
            </div>
          </div>

          {friend && (
            <div className="hero-friend">
              <img src={friend.image} alt={friend.name} />
              <p>Hi, I’m <b>{friend.name}</b> 🐾</p>
            </div>
          )}
        </section>

        {/* REST OF YOUR UI UNCHANGED */}

        <section className="dyslexia-section">
          <h2>💚 Understanding Dyslexia</h2>

          <p className="intro">
            Dyslexia is a <strong>learning difference</strong> that affects how
            children read, spell, and process letters —
            but it has <strong>nothing to do with intelligence</strong>.
          </p>

          <div className="info-grid">
            <InfoCard
              title="🧠 What it is"
              text="Dyslexia affects how the brain processes language. Children learn differently — not slowly."
            />
            <InfoCard
              title="❌ What it is NOT"
              text="Dyslexia is not laziness, low intelligence, or lack of effort."
            />
            <InfoCard
              title="🌈 How CurioKids Helps"
              text="We use games, visuals, repetition, and encouragement to build confidence and joy."
            />
          </div>

          <p className="closing">
            Every child learns differently 🌱 — CurioKids grows with them.
          </p>
        </section>

        <section className="how-section">
          <h2>✨ How CurioKids Works</h2>

          <div className="steps">
            <Step number="1" text="Create a calm, playful learning profile" />
            <Step number="2" text="Learn through games and visual activities" />
            <Step number="3" text="Build confidence step by step — no pressure" />
            <Step number="4" text="Parents track growth, not marks" />
          </div>

          <div className="motivation-box">
            <h3>💛 A Message for Students</h3>
            <p>
              You are not slow.
              You are not weak.
              Your brain is unique — and that is your superpower 🌟
            </p>
          </div>
        </section>

        <footer className="hero-footer">
          <div className="footer-grid">
            <div>
              <h3>🌴 CurioKids</h3>
              <p>
                A joyful jungle where children with dyslexia learn through
                play, confidence, and care.
              </p>
            </div>

            <div>
              <h4>🎮 For Students</h4>
              <ul>
                <li>Fun learning games</li>
                <li>Friendly jungle characters</li>
                <li>Learn at your own pace</li>
              </ul>
            </div>

            <div>
              <h4>📊 For Parents</h4>
              <ul>
                <li>Child progress tracking</li>
                <li>Time control & safety</li>
                <li>Stress-free learning</li>
              </ul>
            </div>

            <div>
              <h4>💚 Our Promise</h4>
              <p>
                Every child is smart.<br />
                Every journey is unique.<br />
                We grow together 🌱
              </p>
            </div>
          </div>

          <div className="copyright">
            © {new Date().getFullYear()} CurioKids • Built with ❤️ for young learners
          </div>
        </footer>

      </div>
    </div>
  );
}

/* COMPONENTS */
function InfoCard({ title, text }) {
  return (
    <div className="info-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="step-card">
      <h4>{number}</h4>
      <p>{text}</p>
    </div>
  );
}
