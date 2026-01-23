import GameButton from "../components/Gamebutton";
import "../styles/ParentLogin.css";

export default function ParentLogin({ goTo }) {
  return (
    <div className="parent-login">
      <h2>Parent Login</h2>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <GameButton text="Login" onClick={() => goTo("parent-dashboard")} />
    </div>
  );
}
