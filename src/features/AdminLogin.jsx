import GameButton from "../components/Gamebutton";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  return (
    <div className="admin-login">
      <h2>Admin Access</h2>

      <input type="email" placeholder="Admin Email" />
      <input type="password" placeholder="Password" />

      <GameButton text="Login" />
    </div>
  );
}
