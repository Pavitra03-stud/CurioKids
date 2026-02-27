import { useState, useEffect } from "react";

/* 🌱 Entry */
import PublicHome from "./features/PublicHome";

/* 🧒 Registration */
import ChildRegister from "./features/ChildRegister";
import ParentRegister from "./features/ParentRegister";

/* 🐾 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/FriendIntro";

/* 🌴 Main Screens */
import JungleHero from "./features/JungleHero";
import KidsHome from "./features/KidsHome";
import PracticeHome from "./features/PracticeHome";
import NumbersHome from "./features/NumbersHome";
import ParentDashboard from "./features/ParentDashboard";
import PracticeHome from "./features/PracticeHome";

/* 🧠 Practice Sessions (create later) */
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognition from "./features/LetterRecognizition";

import "./index.css";

export default function App() {
  const [screen, setScreen] = useState(localStorage.getItem("currentScreen") || "public-home");

  const navigate = (next) => {
    setScreen(next);
    localStorage.setItem("currentScreen", next);
  };

  /* 🔙 BACK NAVIGATION SYSTEM */
  const goBack = () => {
  const flow = [
    "public-home",
    "child-register",
    "parent-register",
    "choose-friend",
    "friend-intro",
    "jungle-hero",
    "kids-home",
    "practice-home",
    "letter-tracing",
    "confusing-letters",
    "memory-match",
    "parent-dashboard",
  ];

    const currentIndex = flow.indexOf(screen);
    if (currentIndex > 0) {
      const previous = flow[currentIndex - 1];
      setScreen(previous);
      localStorage.setItem("currentScreen", previous);
    }
  };

  /* 🧭 SCREEN SWITCH CONTROLLER */
  switch (screen) {

    case "public-home":
      return <PublicHome onComplete={() => navigate("child-register")} />;

    case "child-register":
      return <ChildRegister onComplete={() => navigate("parent-register")} />;

    case "parent-register":
      return <ParentRegister onComplete={() => navigate("choose-friend")} />;

    case "choose-friend":
      return <ChooseFriend onComplete={() => navigate("friend-intro")} />;

    case "friend-intro":
      return <FriendIntro onComplete={() => navigate("jungle-hero")} />;

    case "jungle-hero":
      return <JungleHero onComplete={navigate} />;

    case "kids-home":
      return <KidsHome navigate={navigate} />;

    case "practice-home":
      return <PracticeHome navigate={navigate} />;

    case "numbers":
      return (
        <ChildRegister
          onComplete={() => {
            localStorage.setItem("appProgress", "child-register");
            navigate("parent-register");
          }}
          goBack={goBack}
        />
      );

    case "strawberry-count":
      return (
        <ParentRegister
          onComplete={() => {
            localStorage.setItem("appProgress", "parent-register");
            navigate("choose-friend");
          }}
          goBack={goBack}
        />
      );

    case "number-trail":
      return (
        <ChooseFriend
          onComplete={() => {
            localStorage.setItem("appProgress", "choose-friend");
            navigate("friend-intro");
          }}
          goBack={goBack}
        />
      );

    case "frog-jump":
      return (
        <FriendIntro
          onComplete={() => {
            localStorage.setItem("appProgress", "friend-intro");
            navigate("jungle-hero");
          }}
          goBack={goBack}
        />
      );

    case "missing-number":
      return (
        <JungleHero
          onComplete={navigate}   // student / parent selection
          goBack={goBack}
        />
      );

    case "compare-safari":
      return (
        <CompareSafari
          goBack={() => navigate("numbers")}
        />
      );

    case "practice-home":
      return (
        <SkipCounting
          goBack={() => navigate("numbers")}
        />
      );

    /* 🧠 PRACTICE SUB-SCREENS (Enable Later) */
    case "confusing-letters":
      return <ConfusingLetters goBack={() => navigate("practice-home")} />;

    case "letter-recognition":
  return <LetterRecognition goBack={() => navigate("practice-home")} />;
  
      
    case "letter-tracing":
      return <LetterTracing goBack={goBack} />;


   /* case "memory-match":
      return <MemoryMatch goBack={goBack} />;
      */

    case "parent-dashboard":
      return <ParentDashboard navigate={navigate} />;

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}