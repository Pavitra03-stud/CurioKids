import "../styles/XPBar.css";

export default function XPBar({ value = 40 }) {
  return (
    <div className="xp-container">
      <span>XP</span>
      <div className="xp-track">
        <div className="xp-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
