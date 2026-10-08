import { useNavigate } from "react-router-dom";

import "../styles/Rewards.css";

import { useGame } from "../context/GameContext";

export default function Rewards() {
  const navigate = useNavigate();

  const {
    stars = 0,
    rewards = [],
    claimedRewards = [],
    loadingProgress,
  } = useGame();

  if (loadingProgress) {
    return (
      <div className="rewards-page">
        <div className="rewards-loading">
          🌱 Loading rewards...
        </div>
      </div>
    );
  }

  return (
    <div className="rewards-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rewards-header">
        <h1>
          🏆 Jungle Rewards
        </h1>

        <p>
          ⭐ Your Stars:{" "}
          <strong>
            {stars}
          </strong>
        </p>
      </div>

      {/* =====================================================
          REWARDS
      ===================================================== */}

      <div className="rewards-grid">

        {rewards.map(
          (reward) => {

            const unlocked =
              stars >= reward.cost;

            const claimed =
              claimedRewards.includes(
                reward.id
              );

            return (
              <div
                key={reward.id}
                className={`reward-card ${
                  claimed
                    ? "claimed"
                    : unlocked
                    ? "unlocked"
                    : "locked"
                }`}
              >

                {/* ICON */}

                <div className="reward-icon">
                  {reward.icon}
                </div>

                {/* TITLE */}

                <h2>
                  {reward.title}
                </h2>

                {/* STATUS */}

                {claimed ? (
                  <p className="reward-status claimed-text">
                    ✅ Claimed
                  </p>
                ) : (
                  <p className="reward-status">
                    🔒 Need {reward.cost} ⭐
                  </p>
                )}

                {/* CURRENT STARS */}

                <p className="reward-have">
                  You have{" "}
                  {stars}{" "}
                  ⭐
                </p>

                {/* PROGRESS */}

                {!claimed && (
                  <div className="reward-progress">
                    <div
                      className="reward-progress-fill"
                      style={{
                        width: `${Math.min(
                          (stars /
                            reward.cost) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                )}

                {/* MILESTONE */}

                <span className="reward-milestone">
                  {claimed
                    ? "Achievement unlocked!"
                    : `${Math.max(
                        reward.cost -
                          stars,
                        0
                      )} more ⭐ to unlock`}
                </span>

              </div>
            );
          }
        )}

      </div>

      {/* =====================================================
          BACK
      ===================================================== */}

      <button
        className="rewards-back"
        onClick={() =>
          navigate("/kids-home")
        }
      >
        🌿 Back to Jungle
      </button>

    </div>
  );
}