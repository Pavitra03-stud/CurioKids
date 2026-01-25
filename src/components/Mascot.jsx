import "../styles/Mascot.css";
import fox from "../assets/fox.png";

export default function Mascot() {
  return (
    <div className="mascot">
      <img src={fox} alt="CurioKids Fox Mascot" />
    </div>
  );
}
