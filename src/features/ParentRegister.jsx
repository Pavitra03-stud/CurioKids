import GameButton from "../components/Gamebutton";
import "../styles/ParentRegister.css";

export default function ParentRegister({ onComplete }) {
  return (
    <div className="parent-register">
      <div className="parent-card">
        <h1>Parent Registration</h1>
        <p>Help guide your child’s jungle journey</p>

        <input
          type="text"
          placeholder="Parent Name"
          className="input"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="input"
        />

        <select className="input">
          <option>Daily play time limit</option>
          <option>15 minutes</option>
          <option>30 minutes</option>
          <option>45 minutes</option>
        </select>

        <GameButton
          text="🔐 Link & Unlock Jungle"
          onClick={onComplete}
        />

        <p className="note">
          You’ll see progress, not pressure.
        </p>
      </div>
    </div>
  );
}
