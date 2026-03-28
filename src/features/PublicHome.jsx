// // import GameButton from "../components/Gamebutton";
// // import Mascot from "../components/Mascot";
// // import "../styles/PublicHome.css";

// // export default function PublicHome({ onComplete }) {
// //   return (
// //     <div className="public-home">
// //       <div className="center-content">
// //         <img
// //           src="src/assets/board.png"
// //           className="board-img"
// //           alt="wooden board"
// //         />

// //         <div className="board-content">
// //           <h1 className="title">CurioKids</h1>

// //           <p className="subtitle">
// //             A jungle world where learning grows through play 🌱
// //           </p>

// //           {/* ✅ CORRECT: call onComplete */}
// //           <GameButton
// //             text="Register to Enter the Jungle 🌷"
// //             onClick={onComplete}
// //           />

// //           <p className="lock-note">
// //             🔒 Unlock the dream jungle of Exploration 🍁
// //           </p>
// //         </div>
// //       </div>

// //       <Mascot />
// //     </div>
// //   );
// // }


// import { useNavigate } from "react-router-dom";
// import GameButton from "../components/Gamebutton";
// import Mascot from "../components/Mascot";
// import "../styles/PublicHome.css";

// export default function PublicHome() {
//   const navigate = useNavigate();

//   return (
//     <div className="public-home">
//       <div className="center-content">
//         <img
//           src="src/assets/board.png"
//           className="board-img"
//           alt="wooden board"
//         />

//         <div className="board-content">
//           <h1 className="title">CurioKids</h1>

//           <p className="subtitle">
//             A jungle world where learning grows through play 🌱
//           </p>

//           {/* 🌱 REGISTER BUTTON */}
//           <GameButton
//             text="Register to Enter the Jungle 🌷"
//             onClick={() => navigate("/register")}
//           />

//           {/* 🔐 LOGIN BUTTON */}
//           <GameButton
//             text="Welcome Back (Login) 🔐"
//             onClick={() => navigate("/login")}
//             className="secondary-btn"
//           />

//           <p className="lock-note">
//             🔒 Unlock the dream jungle of Exploration 🍁
//           </p>
//         </div>
//       </div>

//       <Mascot />
//     </div>
//   );
// }



import GameButton from "../components/Gamebutton";
import Mascot from "../components/Mascot";
import "../styles/PublicHome.css";

export default function PublicHome({ onComplete, goToLogin }) {
  return (
    <div className="public-home">
      <div className="center-content">
        <img
          src="src/assets/board.png"
          className="board-img"
          alt="wooden board"
        />

        <div className="board-content">
          <h1 className="title">CurioKids</h1>

          <p className="subtitle">
            A jungle world where learning grows through play 🌱
          </p>

          {/* 🌱 REGISTER */}
          <GameButton
            text="Register to Enter the Jungle 🌷"
            onClick={onComplete}
          />

          {/* 🔐 LOGIN */}
          <GameButton
            text="Welcome Back (Login) 🔐"
            onClick={goToLogin}
            className="secondary-btn"
          />

          <p className="lock-note">
            🔒 Unlock the dream jungle of Exploration 🍁
          </p>
        </div>
      </div>

      <Mascot />
    </div>
  );
}