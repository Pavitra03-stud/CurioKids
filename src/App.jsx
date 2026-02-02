import { useState } from "react";

/* 🌱 Entry */
import PublicHome from "./features/PublicHome";

/* 🧒👨‍👩‍👧 Registration */
import ChildRegister from "./features/ChildRegister";
import ParentRegister from "./features/ParentRegister";

/* 🐾 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/FriendIntro";

/* 🌴 Main Screens */
import JungleHero from "./features/JungleHero";
import KidsHome from "./features/KidsHome";
import ParentDashboard from "./features/ParentDashboard";
import "./index.css";

export default function App() {
const[screen, setScreen] = useState("public-home");

  /* 👉 CENTRAL NAVIGATION */
  const navigate = (next) => {
    console.log("Navigate to:", next);
    setScreen(next);
  };

  /* 🔙 BACK NAVIGATION */
  const goBack = () => {
    const flow = [
      "public-home",
      "child-register",
      "parent-register",
      "choose-friend",
      "friend-intro",
      "jungle-hero",
      "kids-home",
      "parent-dashboard",
    ];

    const currentIndex = flow.indexOf(screen);
    if (currentIndex > 0) {
      setScreen(flow[currentIndex - 1]);
    }
  };

  /* 🧭 SCREEN SWITCH */
  switch (screen) {
    case "public-home":
      return <PublicHome onComplete={() => navigate("child-register")} />;

    case "child-register":
      return (
        <ChildRegister
          onComplete={() => {
            localStorage.setItem("appProgress", "child-register");
            navigate("parent-register");
          }}
          goBack={goBack}
        />
      );

    case "parent-register":
      return (
        <ParentRegister
          onComplete={() => {
            localStorage.setItem("appProgress", "parent-register");
            navigate("choose-friend");
          }}
          goBack={goBack}
        />
      );

    case "choose-friend":
      return (
        <ChooseFriend
          onComplete={() => {
            localStorage.setItem("appProgress", "choose-friend");
            navigate("friend-intro");
          }}
          goBack={goBack}
        />
      );

    case "friend-intro":
      return (
        <FriendIntro
          onComplete={() => {
            localStorage.setItem("appProgress", "friend-intro");
            navigate("jungle-hero");
          }}
          goBack={goBack}
        />
      );

    case "jungle-hero":
      return (
        <JungleHero
          onComplete={navigate}   // 👈 student / parent choice
          goBack={goBack}
        />
      );

    case "kids-home":
      return <KidsHome goBack={goBack} />;

    case "parent-dashboard":
      return <ParentDashboard navigate={navigate}  />;

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}
