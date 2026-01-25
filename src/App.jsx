import { useState } from "react";

/* 🔒 Public / Locked screens */
import PublicHome from "./features/PublicHome";
import ChildRegister from "./features/ChildRegister";
import ParentRegister from "./features/ParentRegister";

/* 🌱 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/friendIntro";

/* 🌴 Main App Screens */
import KidsHome from "./features/KidsHome";
import ParentDashboard from "./features/ParentDashboard";

export default function App() {
  const [appState, setAppState] = useState({
    screen: "public-home",
    childCreated: false,
    parentCreated: false,
    friendChosen: false,
  });

  const goTo = (screen) => {
    setAppState((prev) => ({ ...prev, screen }));
  };

  switch (appState.screen) {
    /* 🔓 PUBLIC LANDING */
    case "public-home":
      return <PublicHome goTo={goTo} />;

    /* 👧 CHILD REGISTER */
    case "child-register":
      return (
        <ChildRegister
          onComplete={() =>
            setAppState((prev) => ({
              ...prev,
              childCreated: true,
              screen: "parent-register",
            }))
          }
        />
      );

    /* 👨‍👩‍👧 PARENT REGISTER */
    case "parent-register":
      return (
        <ParentRegister
          onComplete={() =>
            setAppState((prev) => ({
              ...prev,
              parentCreated: true,
              screen: "choose-friend",
            }))
          }
        />
      );

    /* 🐾 CHOOSE FRIEND */
    case "choose-friend":
      return (
        <ChooseFriend
          onComplete={() =>
            setAppState((prev) => ({
              ...prev,
              friendChosen: true,
              screen: "friend-intro", // ✅ CHANGED HERE
            }))
          }
        />
      );

    /* 🌟 FRIEND INTRO POPUP */
    case "friend-intro":
      return (
        <FriendIntro
          onComplete={() => goTo("kids-home")}
        />
      );

    /* 🌴 MAIN KIDS HOME */
    case "kids-home":
      return <KidsHome />;

    /* 📊 PARENT DASHBOARD */
    case "parent-dashboard":
      return <ParentDashboard />;

    default:
      return <PublicHome goTo={goTo} />;
  }
}
