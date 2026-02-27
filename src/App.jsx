import { useState, useEffect } from "react";

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
import PracticeHome from "./features/PracticeHome";

/* 🧠 Practice Sessions */
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognition from "./features/LetterRecognizition";

import "./index.css";

export default function App() {

  const [screen, setScreen] = useState(
    localStorage.getItem("currentScreen") || "public-home"
  );

  /* 🔥 Scroll fix (kept) */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  /* 🌿 CENTRAL NAVIGATION */
  const navigate = (next) => {
    console.log("Navigating to:", next);
    setScreen(next);
    localStorage.setItem("currentScreen", next);
  };

  /* 🔙 BACK NAVIGATION (UNCHANGED) */
const goBack = () => {

  // If inside a practice zone → go to practice-home
  if (
    screen === "practice-letter-mastery" ||
    screen === "practice-phonics" ||
    screen === "practice-word-builder" ||
    screen === "practice-memory" ||
    screen === "practice-confidence"
  ) {
    navigate("practice-home");
    return;
  }

  // If inside a practice game → go to practice-home
  if (
    screen === "letter-tracing" ||
    screen === "letter-recognition" ||
    screen === "confusing-letters"
  ) {
    navigate("practice-home");
    return;
  }

  // Normal backward flow
  const flow = [
    "public-home",
    "child-register",
    "parent-register",
    "choose-friend",
    "friend-intro",
    "jungle-hero",
    "kids-home",
    "practice-home",
    "parent-dashboard",
  ];

  const currentIndex = flow.indexOf(screen);

  if (currentIndex > 0) {
    const previous = flow[currentIndex - 1];
    navigate(previous);
  }
};

  /* 🧭 SCREEN SWITCH */
  switch (screen) {

    case "public-home":
      return <PublicHome onComplete={() => navigate("child-register")} />;

    case "child-register":
      return (
        <ChildRegister
          onComplete={() => navigate("parent-register")}
          goBack={goBack}
        />
      );

    case "parent-register":
      return (
        <ParentRegister
          onComplete={() => navigate("choose-friend")}
          goBack={goBack}
        />
      );

    case "choose-friend":
      return (
        <ChooseFriend
          onComplete={() => navigate("friend-intro")}
          goBack={goBack}
        />
      );

    case "friend-intro":
      return (
        <FriendIntro
          onComplete={() => navigate("jungle-hero")}
          goBack={goBack}
        />
      );

    case "jungle-hero":
      return (
        <JungleHero
          onComplete={navigate}
          goBack={goBack}
        />
      );

    case "kids-home":
      return (
        <KidsHome
          navigate={navigate}
          goBack={goBack}
        />
      );

    /* PRACTICE MAIN */
    case "practice-home":
      return (
        <PracticeHome
          navigate={navigate}
          goBack={goBack}
        />
      );

    /* PRACTICE ZONES — pass initialZone */
    case "practice-letter-mastery":
      return (
        <PracticeHome
          navigate={navigate}
          goBack={goBack}
          initialZone="letterMastery"
        />
      );

    case "practice-phonics":
      return (
        <PracticeHome
          navigate={navigate}
          goBack={goBack}
          initialZone="phonics"
        />
      );

    case "practice-word-builder":
      return (
        <PracticeHome
          navigate={navigate}
          goBack={goBack}
          initialZone="wordBuilder"
        />
      );

    case "practice-memory":
      return (
        <PracticeHome
          navigate={navigate}
          goBack={goBack}
          initialZone="memory"
        />
      );

    case "practice-confidence":
      return (
        <PracticeHome
          navigate={navigate}
          goBack={goBack}
          initialZone="confidence"
        />
      );

    /* PRACTICE GAMES */
    case "letter-tracing":
      return <LetterTracing goBack={goBack} />;

    case "letter-recognition":
      return <LetterRecognition goBack={goBack} />;

    case "confusing-letters":
      return <ConfusingLetters goBack={goBack} />;

    case "parent-dashboard":
      return (
        <ParentDashboard
          navigate={navigate}
          goBack={goBack}
        />
      );

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}