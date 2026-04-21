// import "../styles/GamesHome.css";
// import { useNavigate } from "react-router-dom";

// export default function GamesHome() {
//   const navigate = useNavigate();

//   return (
//     <div className="games-page">

//       <header className="games-topbar">
//         <h1 className="games-topbar-title">🎮 Games</h1>
//       </header>

//       <div className="games-header">
//         <p>Choose a zone and start playing</p>
//       </div>

//       <div className="games-container">

//         <div
//           className="games-card learning"
//           onClick={() => navigate("/games-learning")}
//           style={{ cursor: "pointer" }}
//         >
//           📘 Learning Zone
//         </div>

//         <div
//           className="games-card play"
//           onClick={() => navigate("/games-play")}
//           style={{ cursor: "pointer" }}
//         >
//           🎮 Game Zone
//         </div>

//       </div>

//     </div>
//   );
// }




import "../styles/GamesHome.css";
import { useNavigate } from "react-router-dom";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function GamesHome() {
  const navigate = useNavigate();

  // ✅ ACTIVITY LOGGER
  const logActivity = async (zone) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "enter",
      module: "games",
      screen: zone,
      timestamp: new Date(),
    });
  };

  const handleNavigate = async (path, zoneName) => {
    await logActivity(zoneName); // ✅ log before navigation
    navigate(path);
  };

  return (
    <div className="games-page">

      <header className="games-topbar">
        <h1 className="games-topbar-title">🎮 Games</h1>
      </header>

      <div className="games-header">
        <p>Choose a zone and start playing</p>
      </div>

      <div className="games-container">

        <div
          className="games-card learning"
          onClick={() => handleNavigate("/games-learning", "learning-zone")}
          style={{ cursor: "pointer" }}
        >
          📘 Learning Zone
        </div>

        <div
          className="games-card play"
          onClick={() => handleNavigate("/games-play", "game-zone")}
          style={{ cursor: "pointer" }}
        >
          🎮 Game Zone
        </div>

      </div>

    </div>
  );
}