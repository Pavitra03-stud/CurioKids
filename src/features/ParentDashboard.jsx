// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import BackIcon from "../components/BackIcon";
// import "../styles/ParentDashboard.css";

// export default function ParentDashboard() {

//   const navigate = useNavigate();

//   const [parent, setParent] = useState(null);
//   const [child, setChild] = useState(null);
//   const [aiData, setAiData] = useState(null);
//   const [practiceRewards, setPracticeRewards] = useState(null);
//   const [loadingPage, setLoadingPage] = useState(true);

//   // 🤖 AI CHAT STATES
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const savedParent =
//   localStorage.getItem("parentProfile") ||
//   localStorage.getItem("tempParent");
//     const savedChild = localStorage.getItem("childProfile");
//     const savedAI = localStorage.getItem("aiProgress");
//     const savedRewards = localStorage.getItem("practiceData");
//     const loginEmail = localStorage.getItem("loginEmail");

//     // ❌ If not logged in → redirect
//     if (!loginEmail) {
//       navigate("/login");
//       return;
//     }

//     // ✅ Load data safely
//     if (savedParent) setParent(JSON.parse(savedParent));
//     if (savedChild) setChild(JSON.parse(savedChild));
//     if (savedAI) setAiData(JSON.parse(savedAI));
//     if (savedRewards) setPracticeRewards(JSON.parse(savedRewards));

//     setLoadingPage(false);
//   }, [navigate]);

//   // 🤖 SEND MESSAGE FUNCTION
//   const sendMessage = async () => {
//     if (!question.trim()) return;

//     const userMessage = { type: "user", text: question };
//     setMessages(prev => [...prev, userMessage]);

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/ai/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           childId: child?._id || "69be509b3193e4d163dd7885",
//           question,
//         }),
//       });

//       const data = await res.json();

//       const botMessage = {
//         type: "bot",
//         text: data.answer || "No response from AI",
//       };

//       setMessages(prev => [...prev, botMessage]);
//       setQuestion("");

//     } catch (err) {
//       console.log(err);
//     }

//     setLoading(false);
//   };

//   // ⏳ LOADING SCREEN
//   if (loadingPage) {
//     return (
//       <div style={{ padding: "120px 40px" }}>
//         <h2>Loading dashboard...</h2>
//       </div>
//     );
//   }

//   // ❌ If no data → redirect (prevents stuck UI)
//   if (!parent || !child) {
//     return (
//       <div style={{ padding: "120px 40px" }}>
//         <h2>No data found. Redirecting...</h2>
//       </div>
//     );
//   }

//   const levelPercent = aiData ? (aiData.level / 5) * 100 : 0;
//   const roundPercent = aiData
//     ? Math.min((aiData.roundsCompleted / 10) * 100, 100)
//     : 0;

//   return (
//     <div className="parent-page">

//       {/* 🌴 NAVBAR */}
//       <div className="parent-navbar">
//         <div className="navbar-left">
//           <BackIcon goBack={() => navigate("/jungle-hero")} />
//         </div>
//         <div className="navbar-title">
//           📊 Parent Dashboard
//         </div>
//       </div>

//       {/* 🌿 CONTENT */}
//       <div className="parent-content">

//         {/* 👧 CHILD PROFILE */}
//         <div className="parent-card">
//           <h2>👧 Child Profile</h2>
//           <p><b>Name:</b> {child.name}</p>
//           <p><b>Age:</b> {child.age}</p>
//         </div>

//         {/* 👨‍👩‍👧 PARENT PROFILE */}
//         <div className="parent-card">
//           <h2>👨‍👩‍👧 Parent Profile</h2>
//           <p><b>Name:</b> {parent.parentName}</p>
//           <p><b>Email:</b> {parent.email}</p>
//           <p><b>Daily Play Limit:</b> {parent.timeLimit} mins</p>
//         </div>

//         {/* 🧠 AI PROGRESS */}
//         <div className="parent-card">
//           <h2>🧠 AI Practice Progress</h2>

//           {aiData ? (
//             <>
//               <p><b>Current Level:</b> {aiData.level}</p>
//               <div className="progress-bar">
//                 <div
//                   className="progress-fill"
//                   style={{ width: `${levelPercent}%` }}
//                 />
//               </div>

//               <p><b>Practice Sessions Completed:</b> {aiData.roundsCompleted}</p>
//               <div className="progress-bar">
//                 <div
//                   className="progress-fill score"
//                   style={{ width: `${roundPercent}%` }}
//                 />
//               </div>

//               <p><b>Most Challenging Letter:</b> {aiData.mostDifficultLetter}</p>
//             </>
//           ) : (
//             <p>Practice data will appear after sessions are completed.</p>
//           )}
//         </div>

//         {/* 🏆 REWARDS */}
//         <div className="parent-card">
//           <h2>🏆 Rewards & Achievements</h2>

//           {practiceRewards ? (
//             <>
//               <p><b>Total Rounds:</b> {practiceRewards.totalRounds}</p>
//               <p><b>Total Stars:</b> ⭐ {practiceRewards.totalStars}</p>

//               <div className="badge-grid">
//                 {Array.from({ length: practiceRewards.badges }).map((_, index) => (
//                   <div key={index} className="badge-item">🏅</div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <p>No rewards yet 🌱</p>
//           )}
//         </div>

//         {/* 🤖 AI CHATBOT */}
//         <div className="parent-card">
//           <h2>🤖 AI Assistant</h2>

//           <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "10px" }}>
//             {messages.map((msg, i) => (
//               <div
//                 key={i}
//                 style={{
//                   background: msg.type === "user" ? "#4caf50" : "#eee",
//                   color: msg.type === "user" ? "white" : "black",
//                   padding: "8px",
//                   margin: "5px",
//                   borderRadius: "8px",
//                   textAlign: msg.type === "user" ? "right" : "left"
//                 }}
//               >
//                 {msg.text}
//               </div>
//             ))}

//             {loading && <p>AI is typing...</p>}
//           </div>

//           <div style={{ display: "flex" }}>
//             <input
//               type="text"
//               placeholder="Ask about your child..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               style={{ flex: 1, padding: "8px" }}
//             />
//             <button onClick={sendMessage} style={{ marginLeft: "5px" }}>
//               Send
//             </button>
//           </div>
//         </div>

//         <p className="growth-note">
//           Growth-focused learning 🌱 No pressure. Confidence first.
//         </p>

//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BackIcon from "../components/BackIcon";
import "../styles/ParentDashboard.css";

import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [parent, setParent] = useState(null);
  const [child, setChild] = useState(null);

  const [progress, setProgress] = useState(null);
  const [gameResults, setGameResults] = useState([]);

  const [loadingPage, setLoadingPage] = useState(true);

  // 🤖 AI CHAT STATES
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // 🔥 LOAD DASHBOARD DATA FROM FIREBASE
  // =========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // ❌ Not logged in
        if (!userId) {
          navigate("/login");
          return;
        }

        console.log(
          "🔥 Loading parent dashboard for UID:",
          userId
        );

        // =====================================================
        // 👨‍👩‍👧 USER PROFILE
        // =====================================================

        const userRef = doc(
          db,
          "users",
          userId
        );

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          console.log(
            "👤 Firebase user data:",
            userData
          );

          // Parent information
          setParent({
            parentName:
              userData.parentName ||
              userData.name ||
              "",
            email:
              userData.email || "",
            timeLimit:
              userData.timeLimit ||
              userData.time ||
              "",
          });

          // Child information
          setChild({
            name:
              userData.childName ||
              userData.child?.name ||
              "Little Explorer",

            age:
              userData.childAge ||
              userData.child?.age ||
              5,
          });
        } else {
          console.log(
            "❌ No Firebase user profile found"
          );
        }

        // =====================================================
        // ⭐ PROGRESS
        // =====================================================

        const progressRef = doc(
          db,
          "progress",
          userId
        );

        const progressSnap =
          await getDoc(progressRef);

        if (progressSnap.exists()) {
          const progressData =
            progressSnap.data();

          console.log(
            "⭐ Firebase progress:",
            progressData
          );

          setProgress({
            stars:
              progressData.stars || 0,

            streak:
              progressData.streak || 0,

            history:
              progressData.history || [],
          });
        } else {
          setProgress({
            stars: 0,
            streak: 0,
            history: [],
          });
        }

        // =====================================================
        // 🎮 GAME RESULTS
        // =====================================================

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

          const resultsSnap =
            await getDocs(resultsQuery);

          const results = resultsSnap.docs.map(
            (gameDoc) => ({
              id: gameDoc.id,
              ...gameDoc.data(),
            })
          );

          console.log(
            "🎮 Game results:",
            results
          );

          setGameResults(results);
        } catch (resultError) {
          console.log(
            "⚠️ Could not load game results:",
            resultError
          );

          setGameResults([]);
        }

      } catch (error) {
        console.error(
          "❌ Dashboard loading error:",
          error
        );
      } finally {
        setLoadingPage(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  // =========================================================
  // 🤖 SEND AI MESSAGE
  // =========================================================

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userId =
      localStorage.getItem("userId");

    if (!userId) {
      alert("Please login again 🔐");
      navigate("/login");
      return;
    }

    const currentQuestion =
      question.trim();

    const userMessage = {
      type: "user",
      text: currentQuestion,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            // 🔥 Firebase UID
            childId: userId,

            question: currentQuestion,
          }),
        }
      );

      const data = await res.json();

      const botMessage = {
        type: "bot",
        text:
          data.answer ||
          "No response from AI",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);
    } catch (error) {
      console.error(
        "❌ AI chat error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            "Sorry, I couldn't connect to the AI right now. 😢",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (loadingPage) {
    return (
      <div
        style={{
          padding: "120px 40px",
        }}
      >
        <h2>
          Loading dashboard... 🌱
        </h2>
      </div>
    );
  }

  // =========================================================
  // 📊 CALCULATIONS
  // =========================================================

  const stars = progress?.stars || 0;
  const streak = progress?.streak || 0;
  const history = progress?.history || [];

  const totalGames =
    gameResults.length;

  const averageScore =
    totalGames > 0
      ? Math.round(
          gameResults.reduce(
            (sum, game) =>
              sum +
              Number(
                game.accuracy || 0
              ),
            0
          ) / totalGames
        )
      : 0;

  const level =
    stars >= 30
      ? "🏆 Jungle Master"
      : stars >= 15
      ? "🌳 Jungle Hero"
      : stars >= 5
      ? "🌿 Explorer"
      : "🌱 Beginner";

  const levelPercent =
    Math.min(
      (stars / 30) * 100,
      100
    );

  const roundPercent =
    Math.min(
      (totalGames / 10) * 100,
      100
    );

  // =========================================================
  // 🎨 DASHBOARD
  // =========================================================

  return (
    <div className="parent-page">

      {/* 🌴 NAVBAR */}
      <div className="parent-navbar">

        <div className="navbar-left">
          <BackIcon
            goBack={() =>
              navigate("/jungle-hero")
            }
          />
        </div>

        <div className="navbar-title">
          📊 Parent Dashboard
        </div>

      </div>

      {/* 🌿 CONTENT */}
      <div className="parent-content">

        {/* 👧 CHILD PROFILE */}
        <div className="parent-card">

          <h2>
            👧 Child Profile
          </h2>

          <p>
            <b>Name:</b>{" "}
            {child?.name ||
              "Little Explorer"}
          </p>

          <p>
            <b>Age:</b>{" "}
            {child?.age || "-"}
          </p>

        </div>

        {/* 👨‍👩‍👧 PARENT PROFILE */}
        <div className="parent-card">

          <h2>
            👨‍👩‍👧 Parent Profile
          </h2>

          <p>
            <b>Name:</b>{" "}
            {parent?.parentName ||
              "-"}
          </p>

          <p>
            <b>Email:</b>{" "}
            {parent?.email || "-"}
          </p>

          <p>
            <b>Daily Play Limit:</b>{" "}
            {parent?.timeLimit
              ? `${parent.timeLimit} mins`
              : "-"}
          </p>

        </div>

        {/* ⭐ OVERALL PROGRESS */}
        <div className="parent-card">

          <h2>
            🌟 Overall Progress
          </h2>

          <p>
            <b>Current Level:</b>{" "}
            {level}
          </p>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${levelPercent}%`,
              }}
            />

          </div>

          <p>
            <b>Total Stars:</b>{" "}
            ⭐ {stars}
          </p>

          <p>
            <b>Day Streak:</b>{" "}
            🔥 {streak}
          </p>

        </div>

        {/* 🧠 GAME PERFORMANCE */}
        <div className="parent-card">

          <h2>
            🧠 Learning Performance
          </h2>

          <p>
            <b>Practice Sessions:</b>{" "}
            {totalGames}
          </p>

          <div className="progress-bar">

            <div
              className="progress-fill score"
              style={{
                width: `${roundPercent}%`,
              }}
            />

          </div>

          <p>
            <b>Average Accuracy:</b>{" "}
            {averageScore}%
          </p>

          {gameResults.length === 0 ? (
            <p>
              Practice data will appear
              after games are completed. 🌱
            </p>
          ) : (
            <div>
              {gameResults
                .slice(0, 5)
                .map((game) => (
                  <div
                    key={game.id}
                    style={{
                      padding: "8px",
                      margin: "5px 0",
                      borderRadius: "8px",
                      background:
                        "#f5f5f5",
                    }}
                  >
                    <b>
                      {game.game ||
                        "Practice Game"}
                    </b>

                    <br />

                    Score:{" "}
                    {game.score ?? 0}

                    {" / "}

                    {game.totalQuestions ??
                      "-"}

                    {" | "}

                    Accuracy:{" "}
                    {game.accuracy ?? 0}%
                  </div>
                ))}
            </div>
          )}

        </div>

        {/* ⭐ RECENT ACTIVITY */}
        <div className="parent-card">

          <h2>
            📅 Recent Activity
          </h2>

          {history.length === 0 ? (
            <p>
              No activity yet 🚀
            </p>
          ) : (
            history
              .slice(-5)
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    margin: "5px 0",
                    borderRadius: "8px",
                    background:
                      "#f5f5f5",
                  }}
                >
                  <span>
                    {item.date ||
                      "Recent"}
                  </span>

                  {" — "}

                  <span>
                    Score:{" "}
                    {item.score ?? 0}
                  </span>

                  {" — "}

                  <span>
                    ⭐{" "}
                    {item.stars ?? 0}
                  </span>
                </div>
              ))
          )}

        </div>

        {/* 🏆 REWARDS */}
        <div className="parent-card">

          <h2>
            🏆 Rewards & Achievements
          </h2>

          <p>
            <b>Total Rounds:</b>{" "}
            {history.length}
          </p>

          <p>
            <b>Total Stars:</b>{" "}
            ⭐ {stars}
          </p>

          <div className="badge-grid">

            {Array.from({
              length: Math.min(
                Math.floor(stars / 5),
                10
              ),
            }).map((_, index) => (
              <div
                key={index}
                className="badge-item"
              >
                🏅
              </div>
            ))}

          </div>

          {stars < 5 && (
            <p>
              Complete activities to
              unlock your first badge 🌱
            </p>
          )}

        </div>

        {/* 🤖 AI CHATBOT */}
        <div className="parent-card">

          <h2>
            🤖 AI Assistant
          </h2>

          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginBottom: "10px",
            }}
          >

            {messages.map(
              (msg, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      msg.type === "user"
                        ? "#4caf50"
                        : "#eee",

                    color:
                      msg.type === "user"
                        ? "white"
                        : "black",

                    padding: "8px",
                    margin: "5px",
                    borderRadius:
                      "8px",

                    textAlign:
                      msg.type === "user"
                        ? "right"
                        : "left",
                  }}
                >
                  {msg.text}
                </div>
              )
            )}

            {loading && (
              <p>
                AI is typing... 🤖
              </p>
            )}

          </div>

          <div
            style={{
              display: "flex",
            }}
          >

            <input
              type="text"
              placeholder="Ask about your child..."
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !loading
                ) {
                  sendMessage();
                }
              }}
              style={{
                flex: 1,
                padding: "8px",
              }}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                marginLeft: "5px",
              }}
            >
              {loading
                ? "..."
                : "Send"}
            </button>

          </div>

        </div>

        {/* 🌱 NOTE */}
        <p className="growth-note">
          Growth-focused learning 🌱
          No pressure. Confidence first.
        </p>

      </div>
    </div>
  );
}