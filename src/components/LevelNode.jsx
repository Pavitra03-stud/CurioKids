import "../styles/LevelNode.css";

export default function LevelNode({ icon, locked }) {
  return (
    <div className={`level-node ${locked ? "locked" : "unlocked"}`}>
      {icon}
    </div>
  );
}
