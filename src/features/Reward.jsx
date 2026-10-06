// import { useEffect, useState } from "react";
// import Confetti from "react-confetti";
// import "../styles/Rewards.css";
// import { useGame } from "../context/GameContext";

// export default function Rewards() {
//   const {
//     stars,
//     loadingProgress,
//   } = useGame();

//   const [showConfetti, setShowConfetti] = useState(false);
//   const [unlockedReward, setUnlockedReward] = useState("");

//   const rewards = [
//     {
//       id: 1,
//       name: "Super Learner Badge",
//       icon: "🏅",
//       need: 3,
//     },
//     {
//       id: 2,
//       name: "Avatar Hat",
//       icon: "🎩",
//       need: 6,
//     },
//     {
//       id: 3,
//       name: "Mini Game",
//       icon: "🎮",
//       need: 10,
//     },
//   ];

//   /* =====================================================
//      🎉 CLAIM / CELEBRATE REWARD
//   ===================================================== */

//   const handleUnlock = (reward) => {
//     setUnlockedReward(reward.name);
//     setShowConfetti(true);

//     setTimeout(() => {
//       setShowConfetti(false);
//     }, 3000);
//   };


//   /* =====================================================
//      🏆 REWARD STATUS
//   ===================================================== */

//   const getRewardStatus = (reward) => {
//     return stars >= reward.need;
//   };


//   /* =====================================================
//      ⏳ LOADING
//   ===================================================== */

//   if (loadingProgress) {
//     return (
//       <div className="rewards-page">
//         <h1>🏆 Jungle Rewards</h1>

//         <div className="reward-loading">
//           🌱 Loading your rewards...
//         </div>
//       </div>
//     );
//   }


//   /* =====================================================
//      🎨 UI
//   ===================================================== */

//   return (
//     <div className="rewards-page">

//       {/* HEADER */}
//       <h1>🏆 Jungle Rewards</h1>

//       {/* REAL STAR COUNT */}
//       <div className="stars-summary">
//         ⭐ Your Stars: <strong>{stars}</strong>
//       </div>


//       {/* CONFETTI */}
//       {showConfetti && (
//         <Confetti
//           recycle={false}
//           numberOfPieces={250}
//         />
//       )}


//       {/* REWARDS */}
//       <div className="reward-grid">

//         {rewards.map((reward) => {

//           const unlocked =
//             getRewardStatus(reward);

//           return (
//             <div
//               key={reward.id}
//               className={`reward-card ${
//                 unlocked
//                   ? "reward-unlocked"
//                   : "reward-locked"
//               }`}
//             >

//               {/* ICON */}
//               <div className="icon">
//                 {reward.icon}
//               </div>


//               {/* NAME */}
//               <h3>
//                 {reward.name}
//               </h3>


//               {/* STATUS */}
//               {unlocked ? (
//                 <>
//                   <p className="unlocked-text">
//                     🔓 Unlocked!
//                   </p>

//                   <button
//                     className="claim-btn"
//                     onClick={() =>
//                       handleUnlock(reward)
//                     }
//                   >
//                     🎁 Claim
//                   </button>
//                 </>
//               ) : (
//                 <div className="locked-info">

//                   <p>
//                     🔒 Need{" "}
//                     <strong>
//                       {reward.need}
//                     </strong>{" "}
//                     ⭐
//                   </p>

//                   <p className="progress-text">
//                     You have {stars} ⭐
//                   </p>

//                   <div className="reward-progress">

//                     <div
//                       className="reward-progress-fill"
//                       style={{
//                         width: `${Math.min(
//                           (stars /
//                             reward.need) *
//                             100,
//                           100
//                         )}%`,
//                       }}
//                     />

//                   </div>

//                 </div>
//               )}

//             </div>
//           );
//         })}

//       </div>


//       {/* 🎉 POPUP */}
//       {unlockedReward && (
//         <div className="popup">

//           🎉 You unlocked{" "}
//           <strong>
//             {unlockedReward}
//           </strong>
//           !

//         </div>
//       )}

//     </div>
//   );
// }




import { useState } from "react";
import Confetti from "react-confetti";
import "../styles/Rewards.css";
import { useGame } from "../context/GameContext";

export default function Rewards() {
  const { stars, loadingProgress } = useGame();

  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedReward, setUnlockedReward] = useState("");

  const rewards = [
    {
      id: 1,
      name: "Super Learner Badge",
      icon: "🏅",
      need: 3,
    },
    {
      id: 2,
      name: "Avatar Hat",
      icon: "🎩",
      need: 6,
    },
    {
      id: 3,
      name: "Mini Game",
      icon: "🎮",
      need: 10,
    },
  ];

  /* =====================================================
     🎉 CLAIM / CELEBRATE REWARD
  ===================================================== */

  const handleUnlock = (reward) => {
    setUnlockedReward(reward.name);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    setTimeout(() => {
      setUnlockedReward("");
    }, 4000);
  };

  /* =====================================================
     🏆 REWARD STATUS
  ===================================================== */

  const isUnlocked = (reward) => {
    return stars >= reward.need;
  };

  /* =====================================================
     ⏳ LOADING
  ===================================================== */

  if (loadingProgress) {
    return (
      <div className="rewards-page">
        <h1>🏆 Jungle Rewards</h1>

        <div className="reward-loading">
          🌱 Loading your rewards...
        </div>
      </div>
    );
  }

  /* =====================================================
     🎨 UI
  ===================================================== */

  return (
    <div className="rewards-page">

      {/* HEADER */}
      <h1>🏆 Jungle Rewards</h1>

      {/* REAL FIREBASE STAR COUNT */}
      <div className="stars-summary">
        ⭐ Your Stars: <strong>{stars}</strong>
      </div>

      {/* CONFETTI */}
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={250}
        />
      )}

      {/* REWARDS */}
      <div className="reward-grid">
        {rewards.map((reward) => {
          const unlocked = isUnlocked(reward);

          return (
            <div
              key={reward.id}
              className={`reward-card ${
                unlocked
                  ? "reward-unlocked"
                  : "reward-locked"
              }`}
            >

              {/* ICON */}
              <div className="icon">
                {reward.icon}
              </div>

              {/* NAME */}
              <h3>{reward.name}</h3>

              {/* STATUS */}
              {unlocked ? (
                <>
                  <p className="unlocked-text">
                    🔓 Unlocked!
                  </p>

                  <button
                    className="claim-btn"
                    onClick={() => handleUnlock(reward)}
                  >
                    🎁 Claim
                  </button>
                </>
              ) : (
                <div className="locked-info">

                  <p>
                    🔒 Need{" "}
                    <strong>{reward.need}</strong>{" "}
                    ⭐
                  </p>

                  <p className="progress-text">
                    You have {stars} ⭐
                  </p>

                  {/* PROGRESS BAR */}
                  <div className="reward-progress">
                    <div
                      className="reward-progress-fill"
                      style={{
                        width: `${Math.min(
                          (stars / reward.need) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 🎉 POPUP */}
      {unlockedReward && (
        <div className="popup">
          🎉 You unlocked{" "}
          <strong>{unlockedReward}</strong>!
        </div>
      )}

    </div>
  );
}