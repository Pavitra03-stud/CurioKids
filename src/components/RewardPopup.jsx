import "../styles/Reward.css";

export default function RewardPopup({ show }) {
  if (!show) return null;

  return (
    <div className="reward-popup">
      <h2>🎉 Awesome!</h2>
      <p>You earned a ⭐</p>
    </div>
  );
}
