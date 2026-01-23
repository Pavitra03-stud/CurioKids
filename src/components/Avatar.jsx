import "../styles/Avatar.css";

export default function Avatar({ name = "Star" }) {
  return (
    <div className="avatar-box">
      <div className="avatar-face">🧒</div>
      <p className="avatar-name">{name}</p>
    </div>
  );
}
