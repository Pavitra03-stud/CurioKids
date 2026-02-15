import BackIcon from "./BackIcon";
import "../styles/AppNavbar.css";

export default function AppNavbar({ title, goBack }) {
  return (
    <div className="app-navbar">
      <div className="navbar-left">
        <BackIcon goBack={goBack} />
      </div>

      <div className="navbar-center">
        <h2>{title}</h2>
      </div>

      <div className="navbar-right">
        {/* Optional future icons */}
      </div>
    </div>
  );
}
