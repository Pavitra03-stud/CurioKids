import GameButton from "../components/Gamebutton";
import "../styles/ParentSignup.css";

export default function ParentSignup({ goTo }) {
  return (
    <div className="parent-signup">
      <h2>Create Parent Account</h2>

      <input type="text" placeholder="Parent Name" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <h3>Create Child Profile</h3>
      <input type="text" placeholder="Child Name" />
      <input type="number" placeholder="Age (3–10)" />

      <p>Choose Avatar</p>
      <div className="avatars">
        <span>🦊</span>
        <span>🐢</span>
        <span>🦉</span>
      </div>

      <GameButton text="Create Account" onClick={() => goTo("home")} />
    </div>
  );
}
