// // // import { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";

// // // import {
// // //   doc,
// // //   onSnapshot,
// // // } from "firebase/firestore";

// // // import {
// // //   onAuthStateChanged,
// // // } from "firebase/auth";

// // // import { db, auth } from "../firebase";

// // // import "../styles/ParentDashboard.css";

// // // export default function ParentDashboard() {
// // //   const navigate = useNavigate();

// // //   const [parent, setParent] = useState(null);
// // //   const [child, setChild] = useState(null);
// // //   const [friend, setFriend] = useState(null);

// // //   const [progress, setProgress] = useState({
// // //     stars: 0,
// // //     streak: 0,
// // //     history: [],
// // //   });

// // //   const [loadingPage, setLoadingPage] =
// // //     useState(true);

// // //   // =====================================================
// // //   // FIREBASE AUTH + REAL-TIME DATA
// // //   // =====================================================

// // //   useEffect(() => {
// // //     let unsubscribeUser = null;
// // //     let unsubscribeProgress = null;

// // //     const unsubscribeAuth =
// // //       onAuthStateChanged(
// // //         auth,
// // //         (firebaseUser) => {
// // //           // -----------------------------------------------
// // //           // NOT LOGGED IN
// // //           // -----------------------------------------------

// // //           if (!firebaseUser) {
// // //             console.warn(
// // //               "❌ No Firebase user"
// // //             );

// // //             navigate("/login");
// // //             return;
// // //           }

// // //           const uid =
// // //             firebaseUser.uid;

// // //           console.log(
// // //             "🔥 Parent Dashboard Firebase UID:",
// // //             uid
// // //           );

// // //           // -----------------------------------------------
// // //           // USER PROFILE - REAL TIME
// // //           // -----------------------------------------------

// // //           const userRef = doc(
// // //             db,
// // //             "users",
// // //             uid
// // //           );

// // //           unsubscribeUser =
// // //             onSnapshot(
// // //               userRef,
// // //               (snapshot) => {
// // //                 if (!snapshot.exists()) {
// // //                   console.warn(
// // //                     "⚠️ User document not found"
// // //                   );

// // //                   setLoadingPage(false);
// // //                   return;
// // //                 }

// // //                 const userData =
// // //                   snapshot.data();

// // //                 console.log(
// // //                   "👤 Live user data:",
// // //                   userData
// // //                 );

// // //                 // -----------------------------------------
// // //                 // PARENT
// // //                 // -----------------------------------------

// // //                 const parentProfile =
// // //                   userData.parentProfile ||
// // //                   {};

// // //                 setParent({
// // //                   parentName:
// // //                     parentProfile.parentName ||
// // //                     "",
// // //                   email:
// // //                     parentProfile.email ||
// // //                     userData.email ||
// // //                     "",
// // //                   timeLimit:
// // //                     parentProfile.timeLimit ||
// // //                     "",
// // //                 });

// // //                 // -----------------------------------------
// // //                 // CHILD
// // //                 // -----------------------------------------

// // //                 const childProfile =
// // //                   userData.childProfile ||
// // //                   {};

// // //                 setChild({
// // //                   name:
// // //                     childProfile.name ||
// // //                     "",
// // //                   age:
// // //                     childProfile.age ||
// // //                     "",
// // //                 });

// // //                 // -----------------------------------------
// // //                 // JUNGLE FRIEND
// // //                 // -----------------------------------------

// // //                 const jungleFriend =
// // //                   userData.jungleFriend ||
// // //                   {};

// // //                 setFriend({
// // //                   name:
// // //                     jungleFriend.name ||
// // //                     "",
// // //                   image:
// // //                     jungleFriend.image ||
// // //                     "",
// // //                 });

// // //                 setLoadingPage(false);
// // //               },
// // //               (error) => {
// // //                 console.error(
// // //                   "❌ User snapshot error:",
// // //                   error
// // //                 );

// // //                 setLoadingPage(false);
// // //               }
// // //             );

// // //           // -----------------------------------------------
// // //           // PROGRESS - REAL TIME
// // //           // -----------------------------------------------

// // //           const progressRef = doc(
// // //             db,
// // //             "progress",
// // //             uid
// // //           );

// // //           unsubscribeProgress =
// // //             onSnapshot(
// // //               progressRef,
// // //               (snapshot) => {
// // //                 if (!snapshot.exists()) {
// // //                   console.log(
// // //                     "🌱 No progress yet"
// // //                   );

// // //                   setProgress({
// // //                     stars: 0,
// // //                     streak: 0,
// // //                     history: [],
// // //                   });

// // //                   return;
// // //                 }

// // //                 const data =
// // //                   snapshot.data();

// // //                 console.log(
// // //                   "📈 LIVE PROGRESS UPDATE:",
// // //                   data
// // //                 );

// // //                 setProgress({
// // //                   stars:
// // //                     Number(
// // //                       data.stars || 0
// // //                     ),

// // //                   streak:
// // //                     Number(
// // //                       data.streak || 0
// // //                     ),

// // //                   history:
// // //                     Array.isArray(
// // //                       data.history
// // //                     )
// // //                       ? data.history
// // //                       : [],
// // //                 });
// // //               },
// // //               (error) => {
// // //                 console.error(
// // //                   "❌ Progress snapshot error:",
// // //                   error
// // //                 );
// // //               }
// // //             );
// // //         }
// // //       );

// // //     // =====================================================
// // //     // CLEANUP
// // //     // =====================================================

// // //     return () => {
// // //       unsubscribeAuth();

// // //       if (unsubscribeUser) {
// // //         unsubscribeUser();
// // //       }

// // //       if (unsubscribeProgress) {
// // //         unsubscribeProgress();
// // //       }
// // //     };
// // //   }, [navigate]);

// // //   // =====================================================
// // //   // LOADING
// // //   // =====================================================

// // //   if (loadingPage) {
// // //     return (
// // //       <div className="parent-page">
// // //         <div
// // //           style={{
// // //             minHeight: "100vh",
// // //             display: "flex",
// // //             alignItems: "center",
// // //             justifyContent: "center",
// // //             color: "#185b3a",
// // //           }}
// // //         >
// // //           <h2>
// // //             Loading dashboard... 🌱
// // //           </h2>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // =====================================================
// // //   // DATA
// // //   // =====================================================

// // //   const stars =
// // //     progress.stars || 0;

// // //   const streak =
// // //     progress.streak || 0;

// // //   const history =
// // //     progress.history || [];

// // //   // =====================================================
// // //   // SESSIONS
// // //   // =====================================================

// // //   const totalGames =
// // //     history.length;

// // //   // =====================================================
// // //   // ACCURACY
// // //   // =====================================================

// // //   const averageScore =
// // //     history.length > 0
// // //       ? Math.round(
// // //           history.reduce(
// // //             (total, item) =>
// // //               total +
// // //               Number(
// // //                 item?.score || 0
// // //               ),
// // //             0
// // //           ) / history.length
// // //         )
// // //       : 0;

// // //   // =====================================================
// // //   // LEVEL
// // //   // =====================================================

// // //   let level =
// // //     "🌱 Beginner";

// // //   if (stars >= 30) {
// // //     level =
// // //       "🏆 Jungle Master";
// // //   } else if (stars >= 15) {
// // //     level =
// // //       "🌳 Jungle Hero";
// // //   } else if (stars >= 5) {
// // //     level =
// // //       "🌿 Explorer";
// // //   }

// // //   const levelPercent =
// // //     Math.min(
// // //       (stars / 30) * 100,
// // //       100
// // //     );

// // //   // =====================================================
// // //   // RENDER
// // //   // =====================================================

// // //   return (
// // //     <div className="parent-page">

// // //       {/* =================================================
// // //           NAVBAR
// // //       ================================================= */}

// // //       <header className="parent-navbar">

// // //         <div className="navbar-title">
// // //           📊 Parent Dashboard
// // //         </div>

// // //         <div className="navbar-plant">
// // //           🌱
// // //         </div>

// // //       </header>

// // //       {/* =================================================
// // //           CONTENT
// // //       ================================================= */}

// // //       <main className="parent-content">

// // //         {/* =================================================
// // //             GREETING
// // //         ================================================= */}

// // //         <section className="parent-greeting">

// // //           <h1>
// // //             Good day,{" "}
// // //             <span>
// // //               {parent?.parentName ||
// // //                 "Parent"}
// // //             </span>{" "}
// // //             👋
// // //           </h1>

// // //           <p>
// // //             Here's how your little
// // //             learner is doing today.
// // //           </p>

// // //         </section>

// // //         {/* =================================================
// // //             CHILD
// // //         ================================================= */}

// // //         <section className="child-hero-card">

// // //           <div className="child-avatar">

// // //             {friend?.image ? (
// // //               <img
// // //                 src={friend.image}
// // //                 alt={
// // //                   friend.name ||
// // //                   "Jungle friend"
// // //                 }
// // //               />
// // //             ) : (
// // //               "👶"
// // //             )}

// // //           </div>

// // //           <div className="child-info">

// // //             <span>
// // //               YOUR LITTLE LEARNER
// // //             </span>

// // //             <h2>
// // //               {child?.name ||
// // //                 "No child profile"}
// // //             </h2>

// // //             <p>
// // //               Age:{" "}
// // //               {child?.age ||
// // //                 "Not set"}
// // //             </p>

// // //             {friend?.name && (
// // //               <small>
// // //                 Jungle friend:{" "}
// // //                 {friend.name} 🦊
// // //               </small>
// // //             )}

// // //           </div>

// // //         </section>

// // //         {/* =================================================
// // //             STATS
// // //         ================================================= */}

// // //         <div className="stats-grid">

// // //           <div className="stat-card">

// // //             <div className="stat-icon">
// // //               ⭐
// // //             </div>

// // //             <div>
// // //               <span>
// // //                 Total Stars
// // //               </span>

// // //               <strong>
// // //                 {stars}
// // //               </strong>
// // //             </div>

// // //           </div>

// // //           <div className="stat-card">

// // //             <div className="stat-icon">
// // //               🔥
// // //             </div>

// // //             <div>
// // //               <span>
// // //                 Day Streak
// // //               </span>

// // //               <strong>
// // //                 {streak}
// // //               </strong>
// // //             </div>

// // //           </div>

// // //           <div className="stat-card">

// // //             <div className="stat-icon">
// // //               🎮
// // //             </div>

// // //             <div>
// // //               <span>
// // //                 Sessions
// // //               </span>

// // //               <strong>
// // //                 {totalGames}
// // //               </strong>
// // //             </div>

// // //           </div>

// // //           <div className="stat-card">

// // //             <div className="stat-icon">
// // //               🎯
// // //             </div>

// // //             <div>
// // //               <span>
// // //                 Accuracy
// // //               </span>

// // //               <strong>
// // //                 {averageScore}%
// // //               </strong>
// // //             </div>

// // //           </div>

// // //         </div>

// // //         {/* =================================================
// // //             PROGRESS + PERFORMANCE
// // //         ================================================= */}

// // //         <div className="dashboard-grid">

// // //           <section className="dashboard-card">

// // //             <div className="card-heading">

// // //               <div>
// // //                 🌟
// // //               </div>

// // //               <div>
// // //                 <h2>
// // //                   Overall Progress
// // //                 </h2>

// // //                 <p>
// // //                   Keep growing, one
// // //                   step at a time.
// // //                 </p>
// // //               </div>

// // //             </div>

// // //             <div className="level-row">

// // //               <span>
// // //                 Current Level
// // //               </span>

// // //               <strong>
// // //                 {level}
// // //               </strong>

// // //             </div>

// // //             <div className="progress-track">

// // //               <div
// // //                 className="progress-fill"
// // //                 style={{
// // //                   width:
// // //                     `${levelPercent}%`,
// // //                 }}
// // //               />

// // //             </div>

// // //             <div className="progress-label">

// // //               <span>
// // //                 ⭐ {stars} stars
// // //               </span>

// // //               <span>
// // //                 {Math.round(
// // //                   levelPercent
// // //                 )}%
// // //               </span>

// // //             </div>

// // //           </section>

// // //           <section className="dashboard-card">

// // //             <div className="card-heading">

// // //               <div>
// // //                 🧠
// // //               </div>

// // //               <div>
// // //                 <h2>
// // //                   Learning Performance
// // //                 </h2>

// // //                 <p>
// // //                   Recent learning
// // //                   activity.
// // //                 </p>
// // //               </div>

// // //             </div>

// // //             <div className="performance-row">

// // //               <span>
// // //                 Practice Sessions
// // //               </span>

// // //               <strong>
// // //                 {totalGames}
// // //               </strong>

// // //             </div>

// // //             <div className="progress-track">

// // //               <div
// // //                 className="progress-fill"
// // //                 style={{
// // //                   width:
// // //                     `${Math.min(
// // //                       totalGames * 10,
// // //                       100
// // //                     )}%`,
// // //                 }}
// // //               />

// // //             </div>

// // //             <div
// // //               className="performance-row"
// // //               style={{
// // //                 marginTop: "22px",
// // //               }}
// // //             >

// // //               <span>
// // //                 Average Accuracy
// // //               </span>

// // //               <strong>
// // //                 {averageScore}%
// // //               </strong>

// // //             </div>

// // //           </section>

// // //         </div>

// // //         {/* =================================================
// // //             PARENT INFORMATION
// // //         ================================================= */}

// // //         <section className="dashboard-card">

// // //           <div className="card-heading">

// // //             <div>
// // //               👨‍👩‍👧
// // //             </div>

// // //             <div>
// // //               <h2>
// // //                 Parent Information
// // //               </h2>

// // //               <p>
// // //                 Your account details.
// // //               </p>
// // //             </div>

// // //           </div>

// // //           <div className="profile-details">

// // //             <div>
// // //               <span>
// // //                 Parent Name
// // //               </span>

// // //               <strong>
// // //                 {parent?.parentName ||
// // //                   "Not available"}
// // //               </strong>
// // //             </div>

// // //             <div>
// // //               <span>
// // //                 Email
// // //               </span>

// // //               <strong>
// // //                 {parent?.email ||
// // //                   "Not available"}
// // //               </strong>
// // //             </div>

// // //             <div>
// // //               <span>
// // //                 Daily Play Limit
// // //               </span>

// // //               <strong>
// // //                 {parent?.timeLimit
// // //                   ? `${parent.timeLimit} mins`
// // //                   : "Not set"}
// // //               </strong>
// // //             </div>

// // //           </div>

// // //         </section>

// // //         {/* =================================================
// // //             RECENT ACTIVITY
// // //         ================================================= */}

// // //         <section className="dashboard-card">

// // //           <div className="card-heading">

// // //             <div>
// // //               📚
// // //             </div>

// // //             <div>
// // //               <h2>
// // //                 Recent Activity
// // //               </h2>

// // //               <p>
// // //                 Your child's latest
// // //                 learning sessions.
// // //               </p>
// // //             </div>

// // //           </div>

// // //           {history.length === 0 ? (
// // //             <div className="empty-state">
// // //               🌱 No games completed yet.
// // //               <br />
// // //               Start a learning activity
// // //               to see progress here.
// // //             </div>
// // //           ) : (
// // //             <div className="activity-list">

// // //               {history
// // //                 .slice()
// // //                 .reverse()
// // //                 .slice(0, 8)
// // //                 .map(
// // //                   (item, index) => (
// // //                     <div
// // //                       className="activity-item"
// // //                       key={
// // //                         `${item.game}-${item.date}-${index}`
// // //                       }
// // //                     >

// // //                       <div>
// // //                         🎮
// // //                       </div>

// // //                       <div className="activity-info">

// // //                         <strong>
// // //                           {item.game ||
// // //                             "Learning Activity"}
// // //                         </strong>

// // //                         <span>
// // //                           {item.date ||
// // //                             "Recent"}
// // //                         </span>

// // //                       </div>

// // //                       <div className="activity-score">

// // //                         <strong>
// // //                           {item.score || 0}%
// // //                         </strong>

// // //                         <span>
// // //                           ⭐{" "}
// // //                           {item.stars || 0}
// // //                         </span>

// // //                       </div>

// // //                     </div>
// // //                   )
// // //                 )}

// // //             </div>
// // //           )}

// // //         </section>

// // //         {/* =================================================
// // //             ACHIEVEMENTS
// // //         ================================================= */}

// // //         <section className="dashboard-card">

// // //           <div className="card-heading">

// // //             <div>
// // //               🏆
// // //             </div>

// // //             <div>
// // //               <h2>
// // //                 Achievements
// // //               </h2>

// // //               <p>
// // //                 Little milestones
// // //                 along the journey.
// // //               </p>
// // //             </div>

// // //           </div>

// // //           <div className="achievement-grid">

// // //             <div
// // //               className={
// // //                 stars >= 1
// // //                   ? "achievement unlocked"
// // //                   : "achievement"
// // //               }
// // //             >
// // //               ⭐

// // //               <strong>
// // //                 First Star
// // //               </strong>
// // //             </div>

// // //             <div
// // //               className={
// // //                 totalGames >= 5
// // //                   ? "achievement unlocked"
// // //                   : "achievement"
// // //               }
// // //             >
// // //               🎮

// // //               <strong>
// // //                 5 Sessions
// // //               </strong>
// // //             </div>

// // //             <div
// // //               className={
// // //                 streak >= 3
// // //                   ? "achievement unlocked"
// // //                   : "achievement"
// // //               }
// // //             >
// // //               🔥

// // //               <strong>
// // //                 3 Day Streak
// // //               </strong>
// // //             </div>

// // //             <div
// // //               className={
// // //                 stars >= 15
// // //                   ? "achievement unlocked"
// // //                   : "achievement"
// // //               }
// // //             >
// // //               🏆

// // //               <strong>
// // //                 Jungle Hero
// // //               </strong>
// // //             </div>

// // //           </div>

// // //         </section>

// // //       </main>

// // //     </div>
// // //   );
// // // }





// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // import {
// //   doc,
// //   onSnapshot,
// // } from "firebase/firestore";

// // import {
// //   onAuthStateChanged,
// // } from "firebase/auth";

// // import { db, auth } from "../firebase";

// // import "../styles/ParentDashboard.css";

// // export default function ParentDashboard() {
// //   const navigate = useNavigate();

// //   // =========================================================
// //   // 👤 USER DATA
// //   // =========================================================

// //   const [parent, setParent] = useState(null);
// //   const [child, setChild] = useState(null);
// //   const [friend, setFriend] = useState(null);

// //   // =========================================================
// //   // 📊 PROGRESS
// //   // =========================================================

// //   const [progress, setProgress] = useState({
// //     stars: 0,
// //     streak: 0,
// //     history: [],
// //   });

// //   // =========================================================
// //   // ⏳ LOADING
// //   // =========================================================

// //   const [loadingPage, setLoadingPage] =
// //     useState(true);

// //   // =========================================================
// //   // 🔥 FIREBASE AUTH + REAL-TIME DATA
// //   // =========================================================

// //   useEffect(() => {
// //     let unsubscribeUser = null;
// //     let unsubscribeProgress = null;

// //     const unsubscribeAuth =
// //       onAuthStateChanged(
// //         auth,
// //         (firebaseUser) => {
// //           // =================================================
// //           // NOT LOGGED IN
// //           // =================================================

// //           if (!firebaseUser) {
// //             console.warn(
// //               "❌ No Firebase user"
// //             );

// //             setParent(null);
// //             setChild(null);
// //             setFriend(null);

// //             setLoadingPage(false);

// //             navigate("/login");

// //             return;
// //           }

// //           // =================================================
// //           // CURRENT FIREBASE UID
// //           // =================================================

// //           const uid =
// //             firebaseUser.uid;

// //           console.log(
// //             "🔥 Parent Dashboard Firebase UID:",
// //             uid
// //           );

// //           // =================================================
// //           // KEEP UID AS CACHE ONLY
// //           //
// //           // Firebase Auth remains the source of truth.
// //           // =================================================

// //           localStorage.setItem(
// //             "userId",
// //             uid
// //           );

// //           // =================================================
// //           // USER PROFILE
// //           //
// //           // users/{CURRENT FIREBASE UID}
// //           // =================================================

// //           const userRef = doc(
// //             db,
// //             "users",
// //             uid
// //           );

// //           unsubscribeUser =
// //             onSnapshot(
// //               userRef,
// //               (snapshot) => {
// //                 // =========================================
// //                 // USER DOCUMENT DOES NOT EXIST
// //                 // =========================================

// //                 if (!snapshot.exists()) {
// //                   console.warn(
// //                     "⚠️ User document not found for UID:",
// //                     uid
// //                   );

// //                   setParent(null);
// //                   setChild(null);
// //                   setFriend(null);

// //                   setLoadingPage(false);

// //                   return;
// //                 }

// //                 // =========================================
// //                 // FIREBASE USER DATA
// //                 // =========================================

// //                 const userData =
// //                   snapshot.data();

// //                 console.log(
// //                   "👤 LIVE FIREBASE USER DATA:",
// //                   userData
// //                 );

// //                 // =========================================
// //                 // PARENT
// //                 // =========================================

// //                 const parentProfile =
// //                   userData.parentProfile ||
// //                   null;

// //                 if (parentProfile) {
// //                   setParent({
// //                     parentName:
// //                       parentProfile.parentName ||
// //                       "",

// //                     email:
// //                       parentProfile.email ||
// //                       userData.email ||
// //                       firebaseUser.email ||
// //                       "",

// //                     timeLimit:
// //                       parentProfile.timeLimit ||
// //                       "",
// //                   });
// //                 } else {
// //                   setParent(null);
// //                 }

// //                 // =========================================
// //                 // CHILD
// //                 // =========================================

// //                 const childProfile =
// //                   userData.childProfile ||
// //                   null;

// //                 if (childProfile) {
// //                   setChild({
// //                     name:
// //                       childProfile.name ||
// //                       "",

// //                     age:
// //                       childProfile.age ||
// //                       "",
// //                   });
// //                 } else {
// //                   setChild(null);
// //                 }

// //                 // =========================================
// //                 // JUNGLE FRIEND
// //                 // =========================================

// //                 const jungleFriend =
// //                   userData.jungleFriend ||
// //                   null;

// //                 if (jungleFriend) {
// //                   setFriend({
// //                     id:
// //                       jungleFriend.id ||
// //                       "",

// //                     name:
// //                       jungleFriend.name ||
// //                       "",

// //                     image:
// //                       jungleFriend.image ||
// //                       "",
// //                   });
// //                 } else {
// //                   setFriend(null);
// //                 }

// //                 // =========================================
// //                 // SYNC LOCAL CACHE
// //                 //
// //                 // This is NOT used as dashboard source.
// //                 // It simply keeps localStorage up to date.
// //                 // =========================================

// //                 if (childProfile) {
// //                   localStorage.setItem(
// //                     "childProfile",
// //                     JSON.stringify(
// //                       childProfile
// //                     )
// //                   );
// //                 } else {
// //                   localStorage.removeItem(
// //                     "childProfile"
// //                   );
// //                 }

// //                 if (parentProfile) {
// //                   localStorage.setItem(
// //                     "parentProfile",
// //                     JSON.stringify(
// //                       parentProfile
// //                     )
// //                   );
// //                 } else {
// //                   localStorage.removeItem(
// //                     "parentProfile"
// //                   );
// //                 }

// //                 if (jungleFriend) {
// //                   localStorage.setItem(
// //                     "jungleFriend",
// //                     JSON.stringify(
// //                       jungleFriend
// //                     )
// //                   );
// //                 } else {
// //                   localStorage.removeItem(
// //                     "jungleFriend"
// //                   );
// //                 }

// //                 // =========================================
// //                 // DONE
// //                 // =========================================

// //                 setLoadingPage(false);
// //               },
// //               (error) => {
// //                 console.error(
// //                   "❌ User snapshot error:",
// //                   error
// //                 );

// //                 setLoadingPage(false);
// //               }
// //             );

// //           // =================================================
// //           // PROGRESS
// //           //
// //           // progress/{CURRENT FIREBASE UID}
// //           // =================================================

// //           const progressRef = doc(
// //             db,
// //             "progress",
// //             uid
// //           );

// //           unsubscribeProgress =
// //             onSnapshot(
// //               progressRef,
// //               (snapshot) => {
// //                 // =========================================
// //                 // NO PROGRESS YET
// //                 // =========================================

// //                 if (!snapshot.exists()) {
// //                   console.log(
// //                     "🌱 No progress yet"
// //                   );

// //                   setProgress({
// //                     stars: 0,
// //                     streak: 0,
// //                     history: [],
// //                   });

// //                   return;
// //                 }

// //                 // =========================================
// //                 // FIREBASE PROGRESS
// //                 // =========================================

// //                 const data =
// //                   snapshot.data();

// //                 console.log(
// //                   "📈 LIVE PROGRESS UPDATE:",
// //                   data
// //                 );

// //                 setProgress({
// //                   stars:
// //                     Number(
// //                       data.stars || 0
// //                     ),

// //                   streak:
// //                     Number(
// //                       data.streak || 0
// //                     ),

// //                   history:
// //                     Array.isArray(
// //                       data.history
// //                     )
// //                       ? data.history
// //                       : [],
// //                 });
// //               },
// //               (error) => {
// //                 console.error(
// //                   "❌ Progress snapshot error:",
// //                   error
// //                 );
// //               }
// //             );
// //         }
// //       );

// //     // =======================================================
// //     // CLEANUP
// //     // =======================================================

// //     return () => {
// //       unsubscribeAuth();

// //       if (unsubscribeUser) {
// //         unsubscribeUser();
// //       }

// //       if (unsubscribeProgress) {
// //         unsubscribeProgress();
// //       }
// //     };
// //   }, [navigate]);

// //   // =========================================================
// //   // ⏳ LOADING
// //   // =========================================================

// //   if (loadingPage) {
// //     return (
// //       <div className="parent-page">
// //         <div
// //           style={{
// //             minHeight: "100vh",
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             color: "#185b3a",
// //           }}
// //         >
// //           <h2>
// //             Loading dashboard... 🌱
// //           </h2>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // =========================================================
// //   // 📊 DATA
// //   // =========================================================

// //   const stars =
// //     Number(progress.stars || 0);

// //   const streak =
// //     Number(progress.streak || 0);

// //   const history =
// //     Array.isArray(progress.history)
// //       ? progress.history
// //       : [];

// //   // =========================================================
// //   // 🎮 SESSIONS
// //   // =========================================================

// //   const totalGames =
// //     history.length;

// //   // =========================================================
// //   // 🎯 ACCURACY
// //   // =========================================================

// //   const averageScore =
// //     history.length > 0
// //       ? Math.round(
// //           history.reduce(
// //             (total, item) =>
// //               total +
// //               Number(
// //                 item?.score || 0
// //               ),
// //             0
// //           ) / history.length
// //         )
// //       : 0;

// //   // =========================================================
// //   // 🌱 LEVEL
// //   // =========================================================

// //   let level =
// //     "🌱 Beginner";

// //   if (stars >= 30) {
// //     level =
// //       "🏆 Jungle Master";
// //   } else if (stars >= 15) {
// //     level =
// //       "🌳 Jungle Hero";
// //   } else if (stars >= 5) {
// //     level =
// //       "🌿 Explorer";
// //   }

// //   const levelPercent =
// //     Math.min(
// //       (stars / 30) * 100,
// //       100
// //     );

// //   // =========================================================
// //   // RENDER
// //   // =========================================================

// //   return (
// //     <div className="parent-page">

// //       {/* =====================================================
// //           NAVBAR
// //       ===================================================== */}

// //       <header className="parent-navbar">

// //         <div className="navbar-title">
// //           📊 Parent Dashboard
// //         </div>

// //         <div className="navbar-plant">
// //           🌱
// //         </div>

// //       </header>

// //       {/* =====================================================
// //           CONTENT
// //       ===================================================== */}

// //       <main className="parent-content">

// //         {/* ===================================================
// //             GREETING
// //         =================================================== */}

// //         <section className="parent-greeting">

// //           <h1>
// //             Good day,{" "}
// //             <span>
// //               {parent?.parentName ||
// //                 "Parent"}
// //             </span>{" "}
// //             👋
// //           </h1>

// //           <p>
// //             Here's how your little
// //             learner is doing today.
// //           </p>

// //         </section>

// //         {/* ===================================================
// //             CHILD
// //         =================================================== */}

// //         <section className="child-hero-card">

// //           <div className="child-avatar">

// //             {friend?.image ? (
// //               <img
// //                 src={friend.image}
// //                 alt={
// //                   friend.name ||
// //                   "Jungle friend"
// //                 }
// //               />
// //             ) : (
// //               "👶"
// //             )}

// //           </div>

// //           <div className="child-info">

// //             <span>
// //               YOUR LITTLE LEARNER
// //             </span>

// //             <h2>
// //               {child?.name ||
// //                 "No child profile"}
// //             </h2>

// //             <p>
// //               Age:{" "}
// //               {child?.age ||
// //                 "Not set"}
// //             </p>

// //             {friend?.name && (
// //               <small>
// //                 Jungle friend:{" "}
// //                 {friend.name} 🦊
// //               </small>
// //             )}

// //           </div>

// //         </section>

// //         {/* ===================================================
// //             STATS
// //         =================================================== */}

// //         <div className="stats-grid">

// //           {/* STARS */}

// //           <div className="stat-card">

// //             <div className="stat-icon">
// //               ⭐
// //             </div>

// //             <div>
// //               <span>
// //                 Total Stars
// //               </span>

// //               <strong>
// //                 {stars}
// //               </strong>
// //             </div>

// //           </div>

// //           {/* STREAK */}

// //           <div className="stat-card">

// //             <div className="stat-icon">
// //               🔥
// //             </div>

// //             <div>
// //               <span>
// //                 Day Streak
// //               </span>

// //               <strong>
// //                 {streak}
// //               </strong>
// //             </div>

// //           </div>

// //           {/* SESSIONS */}

// //           <div className="stat-card">

// //             <div className="stat-icon">
// //               🎮
// //             </div>

// //             <div>
// //               <span>
// //                 Sessions
// //               </span>

// //               <strong>
// //                 {totalGames}
// //               </strong>
// //             </div>

// //           </div>

// //           {/* ACCURACY */}

// //           <div className="stat-card">

// //             <div className="stat-icon">
// //               🎯
// //             </div>

// //             <div>
// //               <span>
// //                 Accuracy
// //               </span>

// //               <strong>
// //                 {averageScore}%
// //               </strong>
// //             </div>

// //           </div>

// //         </div>

// //         {/* ===================================================
// //             PROGRESS + PERFORMANCE
// //         =================================================== */}

// //         <div className="dashboard-grid">

// //           {/* =================================================
// //               OVERALL PROGRESS
// //           ================================================= */}

// //           <section className="dashboard-card">

// //             <div className="card-heading">

// //               <div>
// //                 🌟
// //               </div>

// //               <div>

// //                 <h2>
// //                   Overall Progress
// //                 </h2>

// //                 <p>
// //                   Keep growing, one
// //                   step at a time.
// //                 </p>

// //               </div>

// //             </div>

// //             <div className="level-row">

// //               <span>
// //                 Current Level
// //               </span>

// //               <strong>
// //                 {level}
// //               </strong>

// //             </div>

// //             <div className="progress-track">

// //               <div
// //                 className="progress-fill"
// //                 style={{
// //                   width:
// //                     `${levelPercent}%`,
// //                 }}
// //               />

// //             </div>

// //             <div className="progress-label">

// //               <span>
// //                 ⭐ {stars} stars
// //               </span>

// //               <span>
// //                 {Math.round(
// //                   levelPercent
// //                 )}%
// //               </span>

// //             </div>

// //           </section>

// //           {/* =================================================
// //               LEARNING PERFORMANCE
// //           ================================================= */}

// //           <section className="dashboard-card">

// //             <div className="card-heading">

// //               <div>
// //                 🧠
// //               </div>

// //               <div>

// //                 <h2>
// //                   Learning Performance
// //                 </h2>

// //                 <p>
// //                   Recent learning
// //                   activity.
// //                 </p>

// //               </div>

// //             </div>

// //             <div className="performance-row">

// //               <span>
// //                 Practice Sessions
// //               </span>

// //               <strong>
// //                 {totalGames}
// //               </strong>

// //             </div>

// //             <div className="progress-track">

// //               <div
// //                 className="progress-fill"
// //                 style={{
// //                   width:
// //                     `${Math.min(
// //                       totalGames * 10,
// //                       100
// //                     )}%`,
// //                 }}
// //               />

// //             </div>

// //             <div
// //               className="performance-row"
// //               style={{
// //                 marginTop: "22px",
// //               }}
// //             >

// //               <span>
// //                 Average Accuracy
// //               </span>

// //               <strong>
// //                 {averageScore}%
// //               </strong>

// //             </div>

// //           </section>

// //         </div>

// //         {/* ===================================================
// //             PARENT INFORMATION
// //         =================================================== */}

// //         <section className="dashboard-card">

// //           <div className="card-heading">

// //             <div>
// //               👨‍👩‍👧
// //             </div>

// //             <div>

// //               <h2>
// //                 Parent Information
// //               </h2>

// //               <p>
// //                 Your account details.
// //               </p>

// //             </div>

// //           </div>

// //           <div className="profile-details">

// //             {/* PARENT NAME */}

// //             <div>

// //               <span>
// //                 Parent Name
// //               </span>

// //               <strong>
// //                 {parent?.parentName ||
// //                   "Not available"}
// //               </strong>

// //             </div>

// //             {/* EMAIL */}

// //             <div>

// //               <span>
// //                 Email
// //               </span>

// //               <strong>
// //                 {parent?.email ||
// //                   "Not available"}
// //               </strong>

// //             </div>

// //             {/* TIME LIMIT */}

// //             <div>

// //               <span>
// //                 Daily Play Limit
// //               </span>

// //               <strong>
// //                 {parent?.timeLimit
// //                   ? `${parent.timeLimit} mins`
// //                   : "Not set"}
// //               </strong>

// //             </div>

// //           </div>

// //         </section>

// //         {/* ===================================================
// //             RECENT ACTIVITY
// //         =================================================== */}

// //         <section className="dashboard-card">

// //           <div className="card-heading">

// //             <div>
// //               📚
// //             </div>

// //             <div>

// //               <h2>
// //                 Recent Activity
// //               </h2>

// //               <p>
// //                 Your child's latest
// //                 learning sessions.
// //               </p>

// //             </div>

// //           </div>

// //           {history.length === 0 ? (
// //             <div className="empty-state">
// //               🌱 No games completed yet.
// //               <br />
// //               Start a learning activity
// //               to see progress here.
// //             </div>
// //           ) : (
// //             <div className="activity-list">

// //               {history
// //                 .slice()
// //                 .reverse()
// //                 .slice(0, 8)
// //                 .map(
// //                   (item, index) => (
// //                     <div
// //                       className="activity-item"
// //                       key={
// //                         `${item?.game || "game"}-${
// //                           item?.date || index
// //                         }-${index}`
// //                       }
// //                     >

// //                       <div>
// //                         🎮
// //                       </div>

// //                       <div className="activity-info">

// //                         <strong>
// //                           {item?.game ||
// //                             "Learning Activity"}
// //                         </strong>

// //                         <span>
// //                           {item?.date ||
// //                             "Recent"}
// //                         </span>

// //                       </div>

// //                       <div className="activity-score">

// //                         <strong>
// //                           {Number(
// //                             item?.score || 0
// //                           )}%
// //                         </strong>

// //                         <span>
// //                           ⭐{" "}
// //                           {Number(
// //                             item?.stars || 0
// //                           )}
// //                         </span>

// //                       </div>

// //                     </div>
// //                   )
// //                 )}

// //             </div>
// //           )}

// //         </section>

// //         {/* ===================================================
// //             ACHIEVEMENTS
// //         =================================================== */}

// //         <section className="dashboard-card">

// //           <div className="card-heading">

// //             <div>
// //               🏆
// //             </div>

// //             <div>

// //               <h2>
// //                 Achievements
// //               </h2>

// //               <p>
// //                 Little milestones
// //                 along the journey.
// //               </p>

// //             </div>

// //           </div>

// //           <div className="achievement-grid">

// //             {/* FIRST STAR */}

// //             <div
// //               className={
// //                 stars >= 1
// //                   ? "achievement unlocked"
// //                   : "achievement"
// //               }
// //             >
// //               ⭐

// //               <strong>
// //                 First Star
// //               </strong>

// //             </div>

// //             {/* 5 SESSIONS */}

// //             <div
// //               className={
// //                 totalGames >= 5
// //                   ? "achievement unlocked"
// //                   : "achievement"
// //               }
// //             >
// //               🎮

// //               <strong>
// //                 5 Sessions
// //               </strong>

// //             </div>

// //             {/* 3 DAY STREAK */}

// //             <div
// //               className={
// //                 streak >= 3
// //                   ? "achievement unlocked"
// //                   : "achievement"
// //               }
// //             >
// //               🔥

// //               <strong>
// //                 3 Day Streak
// //               </strong>

// //             </div>

// //             {/* JUNGLE HERO */}

// //             <div
// //               className={
// //                 stars >= 15
// //                   ? "achievement unlocked"
// //                   : "achievement"
// //               }
// //             >
// //               🏆

// //               <strong>
// //                 Jungle Hero
// //               </strong>

// //             </div>

// //           </div>

// //         </section>

// //       </main>

// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   doc,
//   onSnapshot,
// } from "firebase/firestore";

// import {
//   onAuthStateChanged,
// } from "firebase/auth";

// import { db, auth } from "../firebase";

// import "../styles/ParentDashboard.css";

// export default function ParentDashboard() {
//   const navigate = useNavigate();

//   // =========================================================
//   // 👤 USER DATA
//   // =========================================================

//   const [parent, setParent] = useState(null);
//   const [child, setChild] = useState(null);
//   const [friend, setFriend] = useState(null);

//   // =========================================================
//   // 📊 PROGRESS
//   // =========================================================

//   const [progress, setProgress] = useState({
//     stars: 0,
//     streak: 0,
//     history: [],
//   });

//   // =========================================================
//   // ⏳ LOADING
//   // =========================================================

//   const [loadingPage, setLoadingPage] = useState(true);

//   // =========================================================
//   // 🔥 FIREBASE AUTH + REAL-TIME DATA
//   // =========================================================

//   useEffect(() => {
//     let unsubscribeUser = null;
//     let unsubscribeProgress = null;

//     const unsubscribeAuth = onAuthStateChanged(
//       auth,
//       (firebaseUser) => {
//         // ===================================================
//         // NOT LOGGED IN
//         // ===================================================

//         if (!firebaseUser) {
//           console.warn("❌ No Firebase user");

//           setParent(null);
//           setChild(null);
//           setFriend(null);

//           setProgress({
//             stars: 0,
//             streak: 0,
//             history: [],
//           });

//           setLoadingPage(false);

//           navigate("/login");

//           return;
//         }

//         // ===================================================
//         // CURRENT FIREBASE UID
//         // ===================================================

//         const uid = firebaseUser.uid;

//         console.log(
//           "🔥 Parent Dashboard Firebase UID:",
//           uid
//         );

//         // Keep UID only as a cache for the rest of the app.
//         // Firebase Auth is still the source of truth.
//         localStorage.setItem("userId", uid);

//         // ===================================================
//         // USER PROFILE
//         // users/{uid}
//         // ===================================================

//         const userRef = doc(
//           db,
//           "users",
//           uid
//         );

//         unsubscribeUser = onSnapshot(
//           userRef,
//           (snapshot) => {
//             // =================================================
//             // USER DOCUMENT NOT FOUND
//             // =================================================

//             if (!snapshot.exists()) {
//               console.warn(
//                 "⚠️ User document not found for UID:",
//                 uid
//               );

//               setParent(null);
//               setChild(null);
//               setFriend(null);

//               setLoadingPage(false);

//               return;
//             }

//             // =================================================
//             // REAL FIREBASE DATA
//             // =================================================

//             const userData = snapshot.data();

//             console.log(
//               "👤 LIVE FIREBASE USER DATA:",
//               userData
//             );

//             // =================================================
//             // 👨‍👩‍👧 PARENT PROFILE
//             // =================================================

//             const firebaseParent =
//               userData.parentProfile || null;

//             if (firebaseParent) {
//               setParent({
//                 parentName:
//                   firebaseParent.parentName ||
//                   "",
//                 email:
//                   firebaseParent.email ||
//                   userData.email ||
//                   firebaseUser.email ||
//                   "",
//               });
//             } else {
//               // Compatibility with older user documents.
//               const hasLegacyParentData =
//                 userData.parentName ||
//                 userData.name ||
//                 userData.email;

//               if (hasLegacyParentData) {
//                 setParent({
//                   parentName:
//                     userData.parentName ||
//                     userData.name ||
//                     "",
//                   email:
//                     userData.email ||
//                     firebaseUser.email ||
//                     "",
//                 });
//               } else {
//                 setParent(null);
//               }
//             }

//             // =================================================
//             // 👧 CHILD PROFILE
//             // =================================================

//             const firebaseChild =
//               userData.childProfile || null;

//             if (firebaseChild) {
//               setChild({
//                 name:
//                   firebaseChild.name ||
//                   "",
//                 age:
//                   firebaseChild.age ||
//                   "",
//               });
//             } else {
//               // Compatibility with older Firebase structures.
//               const legacyChild =
//                 userData.child || null;

//               const legacyChildName =
//                 userData.childName ||
//                 legacyChild?.name ||
//                 "";

//               const legacyChildAge =
//                 userData.childAge ||
//                 legacyChild?.age ||
//                 "";

//               if (
//                 legacyChildName ||
//                 legacyChildAge
//               ) {
//                 setChild({
//                   name: legacyChildName,
//                   age: legacyChildAge,
//                 });
//               } else {
//                 setChild(null);
//               }
//             }

//             // =================================================
//             // 🦊 JUNGLE FRIEND
//             // =================================================

//             const firebaseFriend =
//               userData.jungleFriend || null;

//             if (firebaseFriend) {
//               setFriend({
//                 id:
//                   firebaseFriend.id ||
//                   "",
//                 name:
//                   firebaseFriend.name ||
//                   "",
//                 image:
//                   firebaseFriend.image ||
//                   "",
//               });
//             } else {
//               setFriend(null);
//             }

//             // =================================================
//             // ✅ DONE
//             // =================================================

//             setLoadingPage(false);
//           },
//           (error) => {
//             console.error(
//               "❌ User snapshot error:",
//               error
//             );

//             setLoadingPage(false);
//           }
//         );

//         // ===================================================
//         // 📊 PROGRESS
//         // progress/{uid}
//         // ===================================================

//         const progressRef = doc(
//           db,
//           "progress",
//           uid
//         );

//         unsubscribeProgress = onSnapshot(
//           progressRef,
//           (snapshot) => {
//             // =================================================
//             // NO PROGRESS YET
//             // =================================================

//             if (!snapshot.exists()) {
//               console.log(
//                 "🌱 No progress yet"
//               );

//               setProgress({
//                 stars: 0,
//                 streak: 0,
//                 history: [],
//               });

//               return;
//             }

//             // =================================================
//             // REAL FIREBASE PROGRESS
//             // =================================================

//             const data = snapshot.data();

//             console.log(
//               "📈 LIVE FIREBASE PROGRESS:",
//               data
//             );

//             setProgress({
//               stars: Number(
//                 data.stars || 0
//               ),

//               streak: Number(
//                 data.streak || 0
//               ),

//               history:
//                 Array.isArray(
//                   data.history
//                 )
//                   ? data.history
//                   : [],
//             });
//           },
//           (error) => {
//             console.error(
//               "❌ Progress snapshot error:",
//               error
//             );
//           }
//         );
//       }
//     );

//     // =======================================================
//     // CLEANUP
//     // =======================================================

//     return () => {
//       unsubscribeAuth();

//       if (unsubscribeUser) {
//         unsubscribeUser();
//       }

//       if (unsubscribeProgress) {
//         unsubscribeProgress();
//       }
//     };
//   }, [navigate]);

//   // =========================================================
//   // ⏳ LOADING
//   // =========================================================

//   if (loadingPage) {
//     return (
//       <div className="parent-page">
//         <div
//           style={{
//             minHeight: "100vh",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#185b3a",
//           }}
//         >
//           <h2>
//             Loading dashboard... 🌱
//           </h2>
//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // 📊 REAL DATA
//   // =========================================================

//   const stars = Number(
//     progress.stars || 0
//   );

//   const streak = Number(
//     progress.streak || 0
//   );

//   const history = Array.isArray(
//     progress.history
//   )
//     ? progress.history
//     : [];

//   // =========================================================
//   // 🎮 TOTAL SESSIONS
//   // =========================================================

//   const totalGames =
//     history.length;

//   // =========================================================
//   // 🎯 AVERAGE ACCURACY
//   // =========================================================

//   const averageScore =
//     history.length > 0
//       ? Math.round(
//           history.reduce(
//             (total, item) =>
//               total +
//               Number(
//                 item?.score || 0
//               ),
//             0
//           ) / history.length
//         )
//       : 0;

//   // =========================================================
//   // 🌱 LEVEL
//   // =========================================================

//   let level = "🌱 Beginner";

//   if (stars >= 30) {
//     level = "🏆 Jungle Master";
//   } else if (stars >= 15) {
//     level = "🌳 Jungle Hero";
//   } else if (stars >= 5) {
//     level = "🌿 Explorer";
//   }

//   const levelPercent = Math.min(
//     (stars / 30) * 100,
//     100
//   );

//   // =========================================================
//   // RENDER
//   // =========================================================

//   return (
//     <div className="parent-page">

//       {/* =================================================
//           NAVBAR
//       ================================================= */}

//       <header className="parent-navbar">

//         <div className="navbar-title">
//           📊 Parent Dashboard
//         </div>

//         <div className="navbar-plant">
//           🌱
//         </div>

//       </header>

//       {/* =================================================
//           CONTENT
//       ================================================= */}

//       <main className="parent-content">

//         {/* =================================================
//             GREETING
//         ================================================= */}

//         <section className="parent-greeting">

//           <h1>
//             Good day{" "}

//             <span>
//               {parent?.parentName ||
//                 "Parent"}
//             </span>{" "}

//             👋
//           </h1>

//           <p>
//             Here's how your little
//             learner is doing today.
//           </p>

//         </section>

//         {/* =================================================
//             CHILD PROFILE
//         ================================================= */}

//         <section className="child-hero-card">

//           <div className="child-avatar">

//             {friend?.image ? (
//               <img
//                 src={friend.image}
//                 alt={
//                   friend.name ||
//                   "Jungle friend"
//                 }
//               />
//             ) : (
//               "👶"
//             )}

//           </div>

//           <div className="child-info">

//             <span>
//               YOUR LITTLE LEARNER
//             </span>

//             <h2>
//               {child?.name ||
//                 "Not available"}
//             </h2>

//             <p>
//               Age:{" "}
//               {child?.age ||
//                 "Not available"}
//             </p>

//             {friend?.name && (
//               <small>
//                 Jungle friend:{" "}
//                 {friend.name} 🦊
//               </small>
//             )}

//           </div>

//         </section>

//         {/* =================================================
//             STATS
//         ================================================= */}

//         <div className="stats-grid">

//           {/* TOTAL STARS */}

//           <div className="stat-card">

//             <div className="stat-icon">
//               ⭐
//             </div>

//             <div>

//               <span>
//                 Total Stars
//               </span>

//               <strong>
//                 {stars}
//               </strong>

//             </div>

//           </div>

//           {/* DAY STREAK */}

//           <div className="stat-card">

//             <div className="stat-icon">
//               🔥
//             </div>

//             <div>

//               <span>
//                 Day Streak
//               </span>

//               <strong>
//                 {streak}
//               </strong>

//             </div>

//           </div>

//           {/* SESSIONS */}

//           <div className="stat-card">

//             <div className="stat-icon">
//               🎮
//             </div>

//             <div>

//               <span>
//                 Sessions
//               </span>

//               <strong>
//                 {totalGames}
//               </strong>

//             </div>

//           </div>

//           {/* ACCURACY */}

//           <div className="stat-card">

//             <div className="stat-icon">
//               🎯
//             </div>

//             <div>

//               <span>
//                 Accuracy
//               </span>

//               <strong>
//                 {averageScore}%
//               </strong>

//             </div>

//           </div>

//         </div>

//         {/* =================================================
//             PROGRESS + PERFORMANCE
//         ================================================= */}

//         <div className="dashboard-grid">

//           {/* OVERALL PROGRESS */}

//           <section className="dashboard-card">

//             <div className="card-heading">

//               <div>
//                 🌟
//               </div>

//               <div>

//                 <h2>
//                   Overall Progress
//                 </h2>

//                 <p>
//                   Keep growing, one
//                   step at a time.
//                 </p>

//               </div>

//             </div>

//             <div className="level-row">

//               <span>
//                 Current Level
//               </span>

//               <strong>
//                 {level}
//               </strong>

//             </div>

//             <div className="progress-track">

//               <div
//                 className="progress-fill"
//                 style={{
//                   width:
//                     `${levelPercent}%`,
//                 }}
//               />

//             </div>

//             <div className="progress-label">

//               <span>
//                 ⭐ {stars} stars
//               </span>

//               <span>
//                 {Math.round(
//                   levelPercent
//                 )}%
//               </span>

//             </div>

//           </section>

//           {/* LEARNING PERFORMANCE */}

//           <section className="dashboard-card">

//             <div className="card-heading">

//               <div>
//                 🧠
//               </div>

//               <div>

//                 <h2>
//                   Learning Performance
//                 </h2>

//                 <p>
//                   Recent learning
//                   activity.
//                 </p>

//               </div>

//             </div>

//             <div className="performance-row">

//               <span>
//                 Practice Sessions
//               </span>

//               <strong>
//                 {totalGames}
//               </strong>

//             </div>

//             <div className="progress-track">

//               <div
//                 className="progress-fill"
//                 style={{
//                   width:
//                     `${Math.min(
//                       totalGames * 10,
//                       100
//                     )}%`,
//                 }}
//               />

//             </div>

//             <div
//               className="performance-row"
//               style={{
//                 marginTop: "22px",
//               }}
//             >

//               <span>
//                 Average Accuracy
//               </span>

//               <strong>
//                 {averageScore}%
//               </strong>

//             </div>

//           </section>

//         </div>

//         {/* =================================================
//             PARENT INFORMATION
//         ================================================= */}

//         <section className="dashboard-card">

//           <div className="card-heading">

//             <div>
//               👨‍👩‍👧
//             </div>

//             <div>

//               <h2>
//                 Parent Information
//               </h2>

//               <p>
//                 Your account details.
//               </p>

//             </div>

//           </div>

//           <div className="profile-details">

//             {/* PARENT NAME */}

//             <div>

//               <span>
//                 Parent Name
//               </span>

//               <strong>
//                 {parent?.parentName ||
//                   "Not available"}
//               </strong>

//             </div>

//             {/* EMAIL */}

//             <div>

//               <span>
//                 Email
//               </span>

//               <strong>
//                 {parent?.email ||
//                   "Not available"}
//               </strong>

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             RECENT ACTIVITY
//         ================================================= */}

//         <section className="dashboard-card">

//           <div className="card-heading">

//             <div>
//               📚
//             </div>

//             <div>

//               <h2>
//                 Recent Activity
//               </h2>

//               <p>
//                 Your child's latest
//                 learning sessions.
//               </p>

//             </div>

//           </div>

//           {history.length === 0 ? (

//             <div className="empty-state">

//               🌱 No games completed yet.

//               <br />

//               Start a learning activity
//               to see progress here.

//             </div>

//           ) : (

//             <div className="activity-list">

//               {history
//                 .slice()
//                 .reverse()
//                 .slice(0, 8)
//                 .map(
//                   (item, index) => (

//                     <div
//                       className="activity-item"
//                       key={
//                         `${item?.game || "game"}-${
//                           item?.date || "recent"
//                         }-${index}`
//                       }
//                     >

//                       <div>
//                         🎮
//                       </div>

//                       <div className="activity-info">

//                         <strong>
//                           {item?.game ||
//                             "Learning Activity"}
//                         </strong>

//                         <span>
//                           {item?.date ||
//                             "Recent"}
//                         </span>

//                       </div>

//                       <div className="activity-score">

//                         <strong>
//                           {Number(
//                             item?.score || 0
//                           )}%
//                         </strong>

//                         <span>
//                           ⭐{" "}
//                           {Number(
//                             item?.stars || 0
//                           )}
//                         </span>

//                       </div>

//                     </div>
//                   )
//                 )}

//             </div>

//           )}

//         </section>

//         {/* =================================================
//             ACHIEVEMENTS
//         ================================================= */}

//         <section className="dashboard-card">

//           <div className="card-heading">

//             <div>
//               🏆
//             </div>

//             <div>

//               <h2>
//                 Achievements
//               </h2>

//               <p>
//                 Little milestones
//                 along the journey.
//               </p>

//             </div>

//           </div>

//           <div className="achievement-grid">

//             {/* FIRST STAR */}

//             <div
//               className={
//                 stars >= 1
//                   ? "achievement unlocked"
//                   : "achievement"
//               }
//             >

//               ⭐

//               <strong>
//                 First Star
//               </strong>

//             </div>

//             {/* 5 SESSIONS */}

//             <div
//               className={
//                 totalGames >= 5
//                   ? "achievement unlocked"
//                   : "achievement"
//               }
//             >

//               🎮

//               <strong>
//                 5 Sessions
//               </strong>

//             </div>

//             {/* 3 DAY STREAK */}

//             <div
//               className={
//                 streak >= 3
//                   ? "achievement unlocked"
//                   : "achievement"
//               }
//             >

//               🔥

//               <strong>
//                 3 Day Streak
//               </strong>

//             </div>

//             {/* JUNGLE HERO */}

//             <div
//               className={
//                 stars >= 15
//                   ? "achievement unlocked"
//                   : "achievement"
//               }
//             >

//               🏆

//               <strong>
//                 Jungle Hero
//               </strong>

//             </div>

//           </div>

//         </section>

//       </main>

//     </div>
//   );
// }.





import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  db,
  auth,
} from "../firebase";

import "../styles/ParentDashboard.css";

export default function ParentDashboard() {
  const navigate =
    useNavigate();

  // =========================================================
  // 👤 USER DATA
  // =========================================================

  const [
    parent,
    setParent,
  ] = useState(null);

  const [
    child,
    setChild,
  ] = useState(null);

  const [
    friend,
    setFriend,
  ] = useState(null);

  // =========================================================
  // 📊 PROGRESS
  // =========================================================

  const [
    progress,
    setProgress,
  ] = useState({
    stars: 0,
    streak: 0,
    history: [],
  });

  // =========================================================
  // 🎁 REWARDS
  // =========================================================

  const [
    claimedRewards,
    setClaimedRewards,
  ] = useState([]);

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  const [
    loadingPage,
    setLoadingPage,
  ] = useState(true);

  // =========================================================
  // 🔥 REAL-TIME FIREBASE
  // =========================================================

  useEffect(() => {
    let unsubscribeUser =
      null;

    let unsubscribeProgress =
      null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {

          // ===============================================
          // NOT LOGGED IN
          // ===============================================

          if (!firebaseUser) {
            setParent(null);
            setChild(null);
            setFriend(null);

            setProgress({
              stars: 0,
              streak: 0,
              history: [],
            });

            setClaimedRewards([]);

            setLoadingPage(false);

            navigate(
              "/login",
              {
                replace: true,
              }
            );

            return;
          }

          // ===============================================
          // REAL UID
          // ===============================================

          const uid =
            firebaseUser.uid;

          localStorage.setItem(
            "userId",
            uid
          );

          console.log(
            "🔥 Parent Dashboard UID:",
            uid
          );

          // ===============================================
          // USER PROFILE
          // ===============================================

          const userRef =
            doc(
              db,
              "users",
              uid
            );

          unsubscribeUser =
            onSnapshot(
              userRef,
              (snapshot) => {

                if (
                  !snapshot.exists()
                ) {
                  setParent(null);
                  setChild(null);
                  setFriend(null);

                  setLoadingPage(false);

                  return;
                }

                const userData =
                  snapshot.data();

                console.log(
                  "👤 Live user data:",
                  userData
                );

                // =======================================
                // 👨‍👩‍👧 PARENT
                // =======================================

                const parentProfile =
                  userData.parentProfile ||
                  {};

                setParent({
                  parentName:
                    parentProfile.parentName ||
                    userData.parentName ||
                    userData.name ||
                    "",

                  email:
                    parentProfile.email ||
                    userData.email ||
                    firebaseUser.email ||
                    "",
                });

                // =======================================
                // 👧 CHILD
                // =======================================

                const childProfile =
                  userData.childProfile ||
                  {};

                const legacyChild =
                  userData.child ||
                  {};

                setChild({
                  name:
                    childProfile.name ||
                    userData.childName ||
                    legacyChild.name ||
                    "",

                  age:
                    childProfile.age ||
                    userData.childAge ||
                    legacyChild.age ||
                    "",
                });

                // =======================================
                // 🦊 FRIEND
                // =======================================

                setFriend(
                  userData.jungleFriend ||
                    null
                );

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

          // ===============================================
          // 📊 PROGRESS
          // ===============================================

          const progressRef =
            doc(
              db,
              "progress",
              uid
            );

          unsubscribeProgress =
            onSnapshot(
              progressRef,
              (snapshot) => {

                if (
                  !snapshot.exists()
                ) {
                  setProgress({
                    stars: 0,
                    streak: 0,
                    history: [],
                  });

                  setClaimedRewards([]);

                  return;
                }

                const data =
                  snapshot.data();

                console.log(
                  "📈 Live progress:",
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

                setClaimedRewards(
                  Array.isArray(
                    data.claimedRewards
                  )
                    ? data.claimedRewards
                    : []
                );
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

    return () => {
      unsubscribeAuth();

      if (
        unsubscribeUser
      ) {
        unsubscribeUser();
      }

      if (
        unsubscribeProgress
      ) {
        unsubscribeProgress();
      }
    };
  }, [navigate]);

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (loadingPage) {
    return (
      <div className="parent-page">

        <div
          style={{
            minHeight:
              "100vh",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            color:
              "#185b3a",
          }}
        >
          <h2>
            Loading dashboard... 🌱
          </h2>
        </div>

      </div>
    );
  }

  // =========================================================
  // 📊 REAL VALUES
  // =========================================================

  const stars =
    Number(
      progress.stars || 0
    );

  const streak =
    Number(
      progress.streak || 0
    );

  const history =
    Array.isArray(
      progress.history
    )
      ? progress.history
      : [];

  const totalGames =
    history.length;

  const averageScore =
    history.length > 0
      ? Math.round(
          history.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item?.score || 0
              ),
            0
          ) /
            history.length
        )
      : 0;

  // =========================================================
  // 🌱 LEVEL
  // =========================================================

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

  // =========================================================
  // 🎁 REWARD DEFINITIONS
  // =========================================================

  const rewardDefinitions = [
    {
      id:
        "super-learner-badge",
      icon:
        "🏅",
      title:
        "Super Learner Badge",
      cost:
        3,
    },

    {
      id:
        "explorer-hat",
      icon:
        "🎩",
      title:
        "Explorer Hat",
      cost:
        6,
    },

    {
      id:
        "mini-game-ticket",
      icon:
        "🎮",
      title:
        "Mini Game Ticket",
      cost:
        10,
    },

    {
      id:
        "rainbow-star",
      icon:
        "🌈",
      title:
        "Rainbow Star",
      cost:
        15,
    },

    {
      id:
        "butterfly-badge",
      icon:
        "🦋",
      title:
        "Butterfly Badge",
      cost:
        20,
    },

    {
      id:
        "golden-leaf",
      icon:
        "🍃",
      title:
        "Golden Leaf",
      cost:
        25,
    },

    {
      id:
        "jungle-hero",
      icon:
        "🦁",
      title:
        "Jungle Hero",
      cost:
        30,
    },

    {
      id:
        "jungle-treasure",
      icon:
        "💎",
      title:
        "Jungle Treasure",
      cost:
        40,
    },

    {
      id:
        "jungle-master",
      icon:
        "👑",
      title:
        "Jungle Master",
      cost:
        50,
    },

    {
      id:
        "grand-champion",
      icon:
        "🏆",
      title:
        "Grand Champion",
      cost:
        75,
    },
  ];

  const earnedRewards =
    rewardDefinitions.filter(
      (reward) =>
        claimedRewards.includes(
          reward.id
        )
    );

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="parent-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="parent-navbar">

        <div className="navbar-title">
          📊 Parent Dashboard
        </div>

        <div className="navbar-plant">
          🌱
        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="parent-content">

        {/* ===================================================
            GREETING
        =================================================== */}

        <section className="parent-greeting">

          <h1>
            Good day{" "}

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

        {/* ===================================================
            CHILD
        =================================================== */}

        <section className="child-hero-card">

          <div className="child-avatar">

            {friend?.image ? (
              <img
                src={
                  friend.image
                }
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

        {/* ===================================================
            STATS
        =================================================== */}

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

        {/* ===================================================
            OVERALL + PERFORMANCE
        =================================================== */}

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
                marginTop:
                  "22px",
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

        {/* ===================================================
            PARENT INFO
        =================================================== */}

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

          </div>

        </section>

        {/* ===================================================
            RECENT ACTIVITY
        =================================================== */}

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

          {history.length ===
          0 ? (
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
                .slice(
                  0,
                  8
                )
                .map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="activity-item"
                      key={`${item?.game || "game"}-${index}`}
                    >

                      <div>
                        🎮
                      </div>

                      <div className="activity-info">

                        <strong>
                          {item?.game ||
                            "Learning Activity"}
                        </strong>

                        <span>
                          {item?.date ||
                            "Recent"}
                        </span>

                      </div>

                      <div className="activity-score">

                        <strong>
                          {Number(
                            item?.score ||
                              0
                          )}
                          %
                        </strong>

                        <span>
                          ⭐{" "}
                          {Number(
                            item?.stars ||
                              0
                          )}
                        </span>

                      </div>

                    </div>
                  )
                )}

            </div>
          )}

        </section>

        {/* ===================================================
            🏆 REAL REWARDS
        =================================================== */}

        <section className="dashboard-card">

          <div className="card-heading">

            <div>
              🏆
            </div>

            <div>

              <h2>
                Rewards Earned
              </h2>

              <p>
                Milestones your child
                has achieved.
              </p>

            </div>

          </div>

          {earnedRewards.length ===
          0 ? (
            <div className="empty-state">
              🌱 No rewards earned yet.
            </div>
          ) : (
            <div className="achievement-grid">

              {earnedRewards.map(
                (reward) => (
                  <div
                    className="achievement unlocked"
                    key={
                      reward.id
                    }
                  >

                    <span
                      style={{
                        fontSize:
                          "32px",
                      }}
                    >
                      {reward.icon}
                    </span>

                    <strong>
                      {reward.title}
                    </strong>

                    <small>
                      ⭐{" "}
                      {reward.cost} star milestone
                    </small>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* ===================================================
            ACHIEVEMENTS
        =================================================== */}

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