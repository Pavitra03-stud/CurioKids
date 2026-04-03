import { useState, useEffect } from "react";

/* 🌱 Entry */
import PublicHome from "./features/PublicHome";

/* 🧒 Registration */
import ChildRegister from "./features/ChildRegister";
import ParentRegister from "./features/ParentRegister";

/* 🔐 Auth */
import Login from "./features/Login";
import OtpVerify from "./features/OtpVerify";

/* 🐾 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/FriendIntro";

/* 🌴 Main */
import JungleHero from "./features/JungleHero";
import KidsHome from "./features/KidsHome";
import LettersHome from "./features/LettersHome";
import LettersLearningHome from "./features/LettersLearningHome";
import LettersGameHome from "./features/LettersGameHome";
import PracticeHome from "./features/PracticeHome";
import NumbersHome from "./features/NumbersHome";
import GamesHome from "./features/GamesHome";
import GamesPlayHome from "./features/GamesPlayHome";
import ParentDashboard from "./features/ParentDashboard";

/* 🔤 Letters */
import AlphabetLearning from "./features/AlphabetLearning";
import AlphabetFlashCard from "./features/AlphabetFlashCard";
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognizition from "./features/LetterRecognizition";
import UppercaseLowercase from "./features/UppercaseLowercase";
import RhymingWords from "./features/RhymingWords";

/* 🔢 Numbers */
import StrawberryCount from "./features/StrawberryCount";
import NumberTrail from "./features/NumberTrail";
import FrogJumpMath from "./features/FrogJumpMath";
import MissingNumber from "./features/MissingNumber";
import CompareSafari from "./features/CompareSafari";
import SkipCounting from "./features/SkipCounting";
import NumberLineMove from "./features/NumberLineMove";
import NumbersLearningHome from "./features/NumbersLearningHome";
import NumbersGameHome from "./features/NumbersGameHome";

import ConceptWhatIsANumber from "./features/ConceptWhatIsANumber";
import ConceptBiggerSmaller from "./features/ConceptBiggerSmaller";

/* 🔤 Letters / Practice */
import AIWritingTest from "./features/AIWritingTest";
import AlphabetLearning from "./features/AlphabetLearning";
import AlphabetFlashCard from "./features/AlphabetFlashCard";
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognizition from "./features/LetterRecognizition";
import UppercaseLowercase from "./features/UppercaseLowercase";
import RhymingWords from "./features/RhymingWords";

/* 🎮 Games */
import SoundTap from "./features/SoundTap";
import PatternCopy from "./features/PatternCopy";
import FindFriend from "./features/FindFriend";
import MemoryMatch from "./features/MemoryMatch";
import CatchWord from "./features/CatchWord";
import FillBucket from "./features/FillBucket";
import LetterBlast from "./features/LetterBlast";

/* 🤖 AI */
import AIChat from "./features/AIChat";
import AIButton from "./features/AIButton";

import "./index.css";

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("currentScreen") || "public-home"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const navigate = (next) => {
    setScreen(next);
    localStorage.setItem("currentScreen", next);
  };

  /* 🔥 FULL BACK LOGIC (MERGED) */
  const goBack = () => {
    const map = {
      "letters-home": "kids-home",
      "letters-learning-home": "letters-home",
      "letters-game-home": "letters-home",

      "alphabet-learning": "letters-learning-home",
      "alphabet-flashcard": "letters-learning-home",

      "letter-tracing": "practice-home",
      "letter-recognition": "practice-home",
      "confusing-letters": "practice-home",
      "uppercase-lowercase": "practice-home",
      "rhyming-words": "practice-home",

      "numbers-learning-home": "numbers",
      "numbers-game-home": "numbers",

      "strawberry-count": "numbers-game-home",
      "number-trail": "numbers-game-home",
      "frog-jump": "numbers-game-home",
      "missing-number": "numbers-game-home",
      "compare-safari": "numbers-game-home",
      "skip-count": "numbers-game-home",
      "number-line": "numbers-game-home",

      "games-play": "games-home",

      "sound-tap": "games-play",
      "pattern-copy": "games-play",
      "find-friend": "games-play",
      "memory-match": "games-play",
      "catch-word": "games-play",
      "fill-bucket": "games-play",
      "letter-blast-game": "games-play",

      "ai-chat": "kids-home",
    };

    if (map[screen]) {
      navigate(map[screen]);
      return;
    }

    const flow = [
      "public-home",
      "child-register",
      "parent-register",
      "otp",
      "choose-friend",
      "friend-intro",
      "jungle-hero",
      "kids-home",
      "practice-home",
      "parent-dashboard",
    ];

    const i = flow.indexOf(screen);
    if (i > 0) navigate(flow[i - 1]);
  };

  const renderScreen = () => {
    switch (screen) {

      case "public-home":
        return (
          <PublicHome
            onComplete={() => navigate("child-register")}
            goToLogin={() => navigate("login")}
          />
        );

      case "login":
        return <Login onComplete={() => navigate("otp")} goBack={goBack} />;

      case "child-register":
        return <ChildRegister onComplete={() => navigate("parent-register")} goBack={goBack} />;

      case "parent-register":
        return <ParentRegister onComplete={() => navigate("otp")} goBack={goBack} />;

      case "otp":
        return <OtpVerify onSuccess={() => navigate("choose-friend")} />;

      case "choose-friend":
        return <ChooseFriend onComplete={() => navigate("friend-intro")} goBack={goBack} />;

      case "friend-intro":
        return <FriendIntro onComplete={() => navigate("jungle-hero")} goBack={goBack} />;

      case "jungle-hero":
        return <JungleHero onComplete={navigate} />;

      case "kids-home":
        return <KidsHome navigate={navigate} goBack={goBack} />;

      case "letters-home":
        return <LettersHome navigate={navigate} goBack={() => navigate("kids-home")} />;

      case "letters-learning-home":
        return <LettersLearningHome navigate={navigate} goBack={() => navigate("letters-home")} />;

      case "letters-game-home":
        return <LettersGameHome navigate={navigate} goBack={() => navigate("letters-home")} />;

      case "alphabet-learning":
        return <AlphabetLearning goBack={goBack} />;

      case "alphabet-flashcard":
        return <AlphabetFlashCard goBack={goBack} />;

      case "letter-tracing":
        return <LetterTracing goBack={goBack} />;

      case "confusing-letters":
        return <ConfusingLetters goBack={goBack} />;

      case "letter-recognition":
        return <LetterRecognizition goBack={goBack} />;

      case "uppercase-lowercase":
        return <UppercaseLowercase goBack={goBack} />;

      case "rhyming-words":
        return <RhymingWords goBack={goBack} />;

      case "practice-home":
        return <PracticeHome navigate={navigate} goBack={goBack} />;

      case "numbers":
        return <NumbersHome navigate={navigate} goBack={() => navigate("kids-home")} />;

      case "numbers-learning-home":
        return <NumbersLearningHome navigate={navigate} goBack={() => navigate("numbers")} />;

      case "numbers-game-home":
        return <NumbersGameHome navigate={navigate} goBack={() => navigate("numbers")} />;

      case "strawberry-count":
        return <StrawberryCount goBack={goBack} />;

      case "number-trail":
        return <NumberTrail goBack={goBack} />;

      case "frog-jump":
        return <FrogJumpMath goBack={goBack} />;

      case "missing-number":
        return <MissingNumber goBack={goBack} />;

      case "compare-safari":
        return <CompareSafari goBack={goBack} />;

      case "skip-count":
        return <SkipCounting goBack={goBack} />;

      case "number-line":
        return <NumberLineMove goBack={goBack} />;

      case "games-home":
        return <GamesHome navigate={navigate} goBack={() => navigate("kids-home")} />;

      case "games-play":
        return <GamesPlayHome navigate={navigate} goBack={() => navigate("games-home")} />;

      case "sound-tap":
        return <SoundTap goBack={goBack} />;

      case "pattern-copy":
        return <PatternCopy goBack={goBack} />;

      case "find-friend":
        return <FindFriend goBack={goBack} />;

      case "memory-match":
        return <MemoryMatch goBack={goBack} />;

      case "catch-word":
        return <CatchWord goBack={goBack} />;

      case "fill-bucket":
        return <FillBucket goBack={goBack} />;

      case "letter-blast-game":
        return <LetterBlast goBack={goBack} />;

      case "parent-dashboard":
        return <ParentDashboard navigate={navigate} goBack={goBack} />;

      case "ai-chat":
        return <AIChat goBack={goBack} />;

      default:
        return <PublicHome onComplete={() => navigate("child-register")} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <AIButton navigate={navigate} />
    </>
  );
}