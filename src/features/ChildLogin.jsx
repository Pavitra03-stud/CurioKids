import "../styles/ChildLogin.css";

export default function ChildLogin({ goTo }) {
  return (
    <div className="child-login">
      <h2>Choose Your Friend 🦊</h2>

      <div className="avatars">
        <div className="avatar" onClick={() => goTo("world")}>🦊</div>
        <div className="avatar" onClick={() => goTo("world")}>🐢</div>
        <div className="avatar" onClick={() => goTo("world")}>🦉</div>
      </div>

      <p className="hint">Tap an animal to start playing</p>
    </div>
  );
}
