import GameButton from "../components/Gamebutton";
import Mascot from "../components/Mascot";
import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete }) {
  return (
    <div className="child-register">
      <div className="register-card">
        <h1>Hi there! 👋</h1>
        <p>Let’s create your jungle profile</p>

        <input
          type="text"
          placeholder="Your Name"
          className="input"
        />

        <select className="input">
          <option value="">Select your age</option>
          <option>3 – 4 years</option>
          <option>5 – 6 years</option>
          <option>7 – 8 years</option>
          <option>9 – 10 years</option>
        </select>

        <GameButton
          text="🌱 Save My Profile"
          onClick={onComplete}
        />

        <p className="note">
          No email. No passwords. Just play.
        </p>
      </div>

      <Mascot />
    </div>
  );
}
