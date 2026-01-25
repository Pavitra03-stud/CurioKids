import { useState,useEffect } from "react";

/* 🔒 Public / Locked screens */
import PublicHome from "./features/PublicHome";
import ChildRegister from "./features/ChildRegister";
import ParentRegister from "./features/ParentRegister";

/* 🌱 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/friendIntro";
import JungleHero from "./features/JungleHero";

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

  useEffect(() => {
  const progress = localStorage.getItem("appProgress");

  if (progress === "friend-chosen") {
    setAppState((prev) => ({ ...prev, screen: "friend-intro" }));
  } else if (progress === "parent-created") {
    setAppState((prev) => ({ ...prev, screen: "choose-friend" }));
  } else if (progress === "child-created") {
    setAppState((prev) => ({ ...prev, screen: "parent-register" }));
  }
}, []);
  /* 🔁 Navigation helper */
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
              screen: "friend-intro",
            }))
          }
        />
      );

    /* 🌟 FRIEND INTRO (Let’s Begin) */
    case "friend-intro":
      return (
        <FriendIntro
          onComplete={() => goTo("jungle-hero")} // ✅ FIXED
        />
      );

    /* 🌿 JUNGLE HERO (Enter Jungle Home) */
    case "jungle-hero":
      return (
        <JungleHero
          onEnter={() => goTo("kids-home")} // ✅ ONLY HERE kids-home is allowed
        />
      );

    /* 🌴 MAIN KIDS HOME */
    case "kids-home":
      return <KidsHome />;

    /* 📊 PARENT DASHBOARD */
    case "parent-dashboard":
      return <ParentDashboard />;

    /* 🛟 FALLBACK */
    default:
      return <PublicHome goTo={goTo} />;
  }
}
