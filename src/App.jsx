import { useState } from "react";

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

/* 🍓 Number Games */
import StrawberryCount from "./features/StrawberryCount";
import MissingNumber from "./features/MissingNumber";
import NumberTrail from "./features/NumberTrail";
import FrogJumpMath from "./features/FrogJumpMath";
import CompareSafari from "./features/CompareSafari";
import SkipCounting from "./features/SkipCounting";
import NumberLineMove from "./features/NumberLineMove";

/* 🧠 Practice */
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognition from "./features/LetterRecognizition";

import "./index.css";

export default function App() {

  const [screen, setScreen] = useState(
    localStorage.getItem("currentScreen") || "public-home"
  );

  const navigate = (next) => {
    setScreen(next);
    localStorage.setItem("currentScreen", next);
  };

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
        <NumbersHome
          navigate={navigate}
          goBack={() => navigate("kids-home")}
        />
      );

    case "strawberry-count":
      return (
        <StrawberryCount
          goBack={() => navigate("numbers")}
        />
      );

    case "number-trail":
      return (
        <NumberTrail
          goBack={() => navigate("numbers")}
        />
      );

    case "frog-jump":
      return (
        <FrogJumpMath
          goBack={() => navigate("numbers")}
        />
      );

    case "missing-number":
      return (
        <MissingNumber
          goBack={() => navigate("numbers")}
        />
      );

    case "compare-safari":
      return (
        <CompareSafari
          goBack={() => navigate("numbers")}
        />
      );

    case "skip-count":
      return (
        <SkipCounting
          goBack={() => navigate("numbers")}
        />
      );
      case "number-line":
  return (
    <NumberLineMove
      goBack={() => navigate("numbers")}
    />
  );

    case "letter-tracing":
      return <LetterTracing goBack={() => navigate("practice-home")} />;

    case "confusing-letters":
      return <ConfusingLetters goBack={() => navigate("practice-home")} />;

    case "letter-recognition":
      return <LetterRecognition goBack={() => navigate("practice-home")} />;

    case "parent-dashboard":
      return <ParentDashboard navigate={navigate} />;

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}