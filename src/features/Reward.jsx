import { useState } from "react";
import Confetti from "react-confetti";
import "../styles/Rewards.css";
import { useGame } from "../context/GameContext";

export default function Rewards() {
  const { stars } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedReward, setUnlockedReward] = useState("");

  const rewards = [
    { id: 1, name: "Super Learner Badge", icon: "🏅", need: 3 },
    { id: 2, name: "Avatar Hat", icon: "🎩", need: 6 },
    { id: 3, name: "Mini Game", icon: "🎮", need: 10 },
  ];

  const handleUnlock = (reward) => {
    setUnlockedReward(reward.name);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  return (
    <div className="rewards-page">
      <h1>🏆 Jungle Rewards</h1>

      {showConfetti && <Confetti />}

      <div className="reward-grid">
        {rewards.map((r, i) => {
          const unlocked =
            stars >= r.need &&
            (i === 0 || stars >= rewards[i - 1].need);

          return (
            <div key={r.id} className="reward-card">
              <div className="icon">{r.icon}</div>
              <h3>{r.name}</h3>

              {unlocked ? (
                <button
                  className="claim-btn"
                  onClick={() => handleUnlock(r)}
                >
                  🎁 Claim
                </button>
              ) : (
                <p>🔒 Need {r.need} ⭐</p>
              )}
            </div>
          );
        })}
      </div>

      {/* 🎉 POPUP */}
      {unlockedReward && (
        <div className="popup">
          🎉 You unlocked {unlockedReward}!
        </div>
      )}
    </div>
  );
}