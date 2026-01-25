import { useState } from "react";

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
  });

  const goTo = (screen) => {
    setAppState({ screen });
  };

  switch (appState.screen) {
    case "public-home":
      return <PublicHome goTo={goTo} />;

    case "child-register":
      return <ChildRegister onComplete={() => goTo("parent-register")} />;

    case "parent-register":
      return <ParentRegister onComplete={() => goTo("choose-friend")} />;

    case "choose-friend":
      return <ChooseFriend onComplete={() => goTo("friend-intro")} />;

    case "friend-intro":
      return <FriendIntro onComplete={() => goTo("jungle-hero")} />;

    case "jungle-hero":
      return <JungleHero goTo={goTo} />;

    case "kids-home":
      return <KidsHome />;

    case "parent-dashboard":
      return <ParentDashboard />;

    default:
      return <PublicHome goTo={goTo} />;
  }
}
