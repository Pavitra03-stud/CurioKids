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

  const navigate = (next) => {
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
          onComplete={() => navigate("parent-register")}
          goBack={goBack}
        />
      );

    case "strawberry-count":
      return (
        <ParentRegister
          onComplete={() => navigate("choose-friend")}
          goBack={goBack}
        />
      );

    case "number-trail":
      return (
        <ChooseFriend
          onComplete={() => navigate("friend-intro")}
          goBack={goBack}
        />
      );

    case "frog-jump":
      return (
        <FriendIntro
          onComplete={() => navigate("jungle-hero")}
          goBack={goBack}
        />
      );

    case "missing-number":
      return (
        <JungleHero
          onComplete={navigate}
          goBack={goBack}
        />
      );

    case "compare-safari":
      return (
        <CompareSafari
          goBack={() => navigate("numbers")}
        />
      );

    /* PRACTICE MAIN */
    case "practice-home":
      return (
        <SkipCounting
          goBack={() => navigate("numbers")}
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
      return <ParentDashboard navigate={navigate} />;

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}