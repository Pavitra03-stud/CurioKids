import { useState } from "react";

// Feature screens
import Home from "./features/Home";
import ChildLogin from "./features/ChildLogin";
import ParentLogin from "./features/ParentLogin";
import ParentSignup from "./features/ParentSignup";
import AdminLogin from "./features/AdminLogin";
// later
// import ParentDashboard from "./features/ParentDashboard";
// import WorldMap from "./features/WorldMap";

// Global styles
import "./styles/fonts.css";
import "./styles/accessibility.css";
import "./styles/animations.css";

function App() {
  // simple game-style screen control
  const [screen, setScreen] = useState("home");

  const renderScreen = () => {
    switch (screen) {
      case "child":
        return <ChildLogin goTo={setScreen} />;

      case "parent-login":
        return <ParentLogin goTo={setScreen} />;

      case "parent-signup":
        return <ParentSignup goTo={setScreen} />;

      case "admin":
        return <AdminLogin />;

      // next phase
      // case "parent-dashboard":
      //   return <ParentDashboard />;

      // case "world":
      //   return <WorldMap />;

      default:
        return <Home goTo={setScreen} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  );
}

export default App;
