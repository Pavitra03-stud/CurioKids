
// import { useState, useEffect } from "react";

// /* 🌱 Entry */
// import PublicHome from "./features/PublicHome";

// /* 🧒 Registration */
// import ChildRegister from "./features/ChildRegister";
// import ParentRegister from "./features/ParentRegister";

// /* 🐾 Onboarding */
// import ChooseFriend from "./features/ChooseFriend";
// import FriendIntro from "./features/FriendIntro";

// /* 🌴 Main Screens */
// import JungleHero from "./features/JungleHero";
// import KidsHome from "./features/KidsHome";
// import PracticeHome from "./features/PracticeHome";
// import NumbersHome from "./features/NumbersHome";
// import ParentDashboard from "./features/ParentDashboard";

// /* 🔢 Number Games */
// import StrawberryCount from "./features/StrawberryCount";
// import NumberTrail from "./features/NumberTrail";
// import FrogJumpMath from "./features/FrogJumpMath";
// import MissingNumber from "./features/MissingNumber";
// import CompareSafari from "./features/CompareSafari";
// import SkipCounting from "./features/SkipCounting";
// import NumberLineMove from "./features/NumberLineMove";

// /* 🧠 Practice */
// import LetterTracing from "./features/LetterTracing";
// import ConfusingLetters from "./features/ConfusingLetters";
// import LetterRecognition from "./features/LetterRecognizition";

// import "./index.css";

// export default function App() {

//   const [screen, setScreen] = useState(
//     localStorage.getItem("currentScreen") || "public-home"
//   );

//   /* 🔥 Scroll to top on screen change */
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [screen]);

//   const navigate = (next) => {
//     setScreen(next);
//     localStorage.setItem("currentScreen", next);
//   };

//   /* 🔙 Smart Back Navigation */
//   const goBack = () => {

//     // ✅ FIXED: Practice games + practice zones go back to practice-home
//     if (
//       screen === "letter-tracing" ||
//       screen === "letter-recognition" ||
//       screen === "confusing-letters" ||

//       screen === "practice-letter-mastery" ||
//       screen === "practice-phonics" ||
//       screen === "practice-word-builder" ||
//       screen === "practice-memory" ||
//       screen === "practice-confidence"
//     ) {
//       navigate("practice-home");
//       return;
//     }

//     // Number games go back to numbers
//     if (
//       screen === "strawberry-count" ||
//       screen === "number-trail" ||
//       screen === "frog-jump" ||
//       screen === "missing-number" ||
//       screen === "compare-safari" ||
//       screen === "skip-count" ||
//       screen === "number-line"
//     ) {
//       navigate("numbers");
//       return;
//     }

//     const flow = [
//       "public-home",
//       "child-register",
//       "parent-register",
//       "choose-friend",
//       "friend-intro",
//       "jungle-hero",
//       "kids-home",
//       "practice-home",
//       "parent-dashboard",
//     ];

//     const currentIndex = flow.indexOf(screen);

//     if (currentIndex > 0) {
//       navigate(flow[currentIndex - 1]);
//     }
//   };

//   switch (screen) {

//     /* ENTRY FLOW */
//     case "public-home":
//       return <PublicHome onComplete={() => navigate("child-register")} />;

//     case "child-register":
//       return <ChildRegister onComplete={() => navigate("parent-register")} />;

//     case "parent-register":
//       return <ParentRegister onComplete={() => navigate("choose-friend")} />;

//     case "choose-friend":
//       return <ChooseFriend onComplete={() => navigate("friend-intro")} />;

//     case "friend-intro":
//       return <FriendIntro onComplete={() => navigate("jungle-hero")} />;

//     case "jungle-hero":
//       return <JungleHero onComplete={navigate} />;

//     /* MAIN HUBS */
//     case "kids-home":
//       return <KidsHome navigate={navigate} goBack={goBack} />;

//     case "practice-home":
//       return <PracticeHome navigate={navigate} goBack={goBack} />;

//     case "practice-letter-mastery":
//       return (
//         <PracticeHome
//           navigate={navigate}
//           goBack={goBack}
//           initialZone="letterMastery"
//         />
//       );

//     case "practice-phonics":
//       return (
//         <PracticeHome
//           navigate={navigate}
//           goBack={goBack}
//           initialZone="phonics"
//         />
//       );

//     case "practice-word-builder":
//       return (
//         <PracticeHome
//           navigate={navigate}
//           goBack={goBack}
//           initialZone="wordBuilder"
//         />
//       );

//     case "practice-memory":
//       return (
//         <PracticeHome
//           navigate={navigate}
//           goBack={goBack}
//           initialZone="memory"
//         />
//       );

//     case "practice-confidence":
//       return (
//         <PracticeHome
//           navigate={navigate}
//           goBack={goBack}
//           initialZone="confidence"
//         />
//       );

//     case "numbers":
//       return (
//         <NumbersHome
//           navigate={navigate}
//           goBack={() => navigate("kids-home")}
//         />
//       );

//     /* NUMBER GAMES */
//     case "strawberry-count":
//       return <StrawberryCount goBack={goBack} />;

//     case "number-trail":
//       return <NumberTrail goBack={goBack} />;

//     case "frog-jump":
//       return <FrogJumpMath goBack={goBack} />;

//     case "missing-number":
//       return <MissingNumber goBack={goBack} />;

//     case "compare-safari":
//       return <CompareSafari goBack={goBack} />;

//     case "skip-count":
//       return <SkipCounting goBack={goBack} />;

//     case "number-line":
//       return <NumberLineMove goBack={goBack} />;

//     /* PRACTICE GAMES */
//     case "letter-tracing":
//       return <LetterTracing goBack={goBack} />;

//     case "letter-recognition":
//       return <LetterRecognition goBack={goBack} />;

//     case "confusing-letters":
//       return <ConfusingLetters goBack={goBack} />;

//     case "parent-dashboard":
//       return <ParentDashboard navigate={navigate} />;

//     default:
//       return <PublicHome onComplete={() => navigate("child-register")} />;
//   }
// }


import { useState, useEffect } from "react";

/* 🌱 Entry */
import PublicHome from "./features/PublicHome";

/* 🧒 Registration */
import ChildRegister from "./features/ChildRegister";
import ParentRegister from "./features/ParentRegister";

/* 🔐 OTP */
import OtpVerify from "./features/OtpVerify";

/* 🐾 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/FriendIntro";

/* 🌴 Main Screens */
import JungleHero from "./features/JungleHero";
import KidsHome from "./features/KidsHome";
import LettersHome from "./features/LettersHome";
import LettersLearningHome from "./features/LettersLearningHome";
import LettersGameHome from "./features/LettersGameHome";
import LearningLetterBlast from "./features/LearningLetterBlast";
import OddLetter from "./features/OddLetter";
import ConnectLetters from "./features/ConnectLetters";
import WordBuilder from "./features/WordBuilder";
import PracticeHome from "./features/PracticeHome";
import NumbersHome from "./features/NumbersHome";
import GamesHome from "./features/GamesHome";
import ParentDashboard from "./features/ParentDashboard";

/* 🔢 Number Games */
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
import AlphabetUppercaseLowercase from "./features/AlphabetUppercaseLowercase";
import AlphabetConfusingLetters from "./features/AlphabetConfusingLetters";
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import AlphabetLetterTracing from "./features/AlphabetLetterTracing";
import LetterRecognizition from "./features/LetterRecognizition";
import UppercaseLowercase from "./features/UppercaseLowercase";
import RhymingWords from "./features/RhymingWords";

/* 🎮 Games */
import GamesPlayHome from "./features/GamesPlayHome";
import SoundTap from "./features/SoundTap";
import PatternCopy from "./features/PatternCopy";
import FindFriend from "./features/FindFriend";
import MemoryMatch from "./features/MemoryMatch";
import CatchWord from "./features/CatchWord";
import FillBucket from "./features/FillBucket";
import LetterBlast from "./features/LetterBlast";
import Login from "./features/Login";

import "./index.css";

export default function App() {
  const [screen, setScreen] = useState(
    localStorage.getItem("currentScreen") || "public-home"
  );
  const [lastSection, setLastSection] = useState(
    localStorage.getItem("lastSection") || ""
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const navigate = (next) => {
    if (
      next === "letters-home" ||
      next === "letters-learning-home" ||
      next === "letters-game-home" ||
      next === "alphabet-learning" ||
      next === "alphabet-flashcard" ||
      next === "alphabet-uppercase-lowercase" ||
      next === "alphabet-letter-tracing" ||
      next === "alphabet-letter-tracing" ||
      next === "odd-letter" ||
      next === "connect-letters" ||
      next === "letter-blast" ||
      next === "word-builder"
    ) {
      setLastSection("letters");
      localStorage.setItem("lastSection", "letters");
    }

    if (
      next === "practice-home" ||
      next === "letter-tracing" ||
      next === "letter-recognition" ||
      next === "confusing-letters" ||
      next === "uppercase-lowercase" ||
      next === "rhyming-words" ||
      next === "practice-letter-mastery" ||
      next === "practice-phonics" ||
      next === "practice-word-builder" ||
      next === "practice-memory" ||
      next === "practice-confidence"
    ) {
      setLastSection("practice");
      localStorage.setItem("lastSection", "practice");
    }

    setScreen(next);
    localStorage.setItem("currentScreen", next);
  };

  const goBack = () => {
    if (screen === "letters-home") {
      navigate("kids-home");
      return;
    }

    if (
      screen === "letters-learning-home" ||
      screen === "letters-game-home"
    ) {
      navigate("letters-home");
      return;
    }

    if (
      screen === "alphabet-learning" ||
      screen === "alphabet-flashcard" ||
      screen === "alphabet-uppercase-lowercase" ||
      screen === "alphabet-confusing-letters" ||
      screen === "alphabet-letter-tracing" 
    ) {
      navigate("letters-learning-home");
      return;
    }

    if (
      screen === "letter-blast" ||
      screen === "odd-letter" ||
      screen === "connect-letters" ||
      screen === "word-builder"
    ) {
      navigate("letters-game-home");
      return;
    }

    if (
      screen === "letter-tracing" ||
      screen === "letter-recognition" ||
      screen === "confusing-letters" ||
      screen === "uppercase-lowercase" ||
      screen === "rhyming-words" ||
      screen === "practice-letter-mastery" ||
      screen === "practice-phonics" ||
      screen === "practice-word-builder" ||
      screen === "practice-memory" ||
      screen === "practice-confidence"
    ) {
      navigate("practice-home");
      return;
    }

    if (
      screen === "numbers-learning-home" ||
      screen === "numbers-game-home"
    ) {
      navigate("numbers");
      return;
    }

    if (
      screen === "concept-what-is-a-number" ||
      screen === "concept-bigger-smaller"
    ) {
      navigate("numbers-learning-home");
      return;
    }

    if (
      screen === "strawberry-count" ||
      screen === "number-trail" ||
      screen === "frog-jump" ||
      screen === "missing-number" ||
      screen === "compare-safari" ||
      screen === "skip-count" ||
      screen === "number-line"
    ) {
      navigate("numbers-game-home");
      return;
    }

    if (screen === "games-play") {
      navigate("games-home");
      return;
    }

    if (
      screen === "sound-tap" ||
      screen === "pattern-copy" ||
      screen === "find-friend" ||
      screen === "memory-match" ||
      screen === "catch-word" ||
      screen === "fill-bucket" ||
      screen === "letter-blast-game"
    ) {
      navigate("games-play");
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

    const currentIndex = flow.indexOf(screen);

    if (currentIndex > 0) {
      navigate(flow[currentIndex - 1]);
    }
  };

  switch (screen) {
    case "public-home":
      return (
        <PublicHome
          onComplete={() => navigate("child-register")}
          goToLogin={() => navigate("login")}
        />
      );

    case "login":
      return (
        <Login
          onComplete={() => navigate("otp")}
          goBack={goBack}
        />
      );

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
          onComplete={() => navigate("otp")}
          goBack={goBack}
        />
      );

    case "otp":
      return <OtpVerify onSuccess={() => navigate("choose-friend")} />;

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
      return <JungleHero onComplete={navigate} />;

    case "kids-home":
      return <KidsHome navigate={navigate} goBack={goBack} />;
    case "games-learning":
      return <SomeLearningPage goBack={goBack} />;  

    case "letters-home":
      return (
        <LettersHome
          onBack={() => navigate("kids-home")}
          onLearningZone={() => navigate("letters-learning-home")}
          onGamingZone={() => navigate("letters-game-home")}
        />
      );

    case "letters-learning-home":
      return (
        <LettersLearningHome
          navigate={(next) =>
            next === "uppercase-lowercase"
            ? navigate("alphabet-uppercase-lowercase")
            : next === "confusing-letters"
            ? navigate("alphabet-confusing-letters")
            : next === "letter-tracing"
            ? navigate("alphabet-letter-tracing")
            : navigate(next)
          }
          goBack={() => navigate("letters-home")}
        />
      );

    case "letters-game-home":
      return (
        <LettersGameHome
          navigate={navigate}
          goBack={() => navigate("letters-home")}
        />
      );
     
    case "ai-writing-test":
      return (
        <AIWritingTest
          navigate={navigate}
          goBack={() => navigate("letters-learning-home")}
        />
      );

    case "alphabet-learning":
      return <AlphabetLearning goBack={goBack} />;

    case "alphabet-flashcard":
      return <AlphabetFlashCard goBack={goBack} />;

    case "alphabet-uppercase-lowercase":
      return <AlphabetUppercaseLowercase goBack={goBack} />;
    
    case "alphabet-confusing-letters":
      return <AlphabetConfusingLetters goBack={goBack} />;

    case "alphabet-letter-tracing":
      return <AlphabetLetterTracing goBack={goBack} />;
    case "letter-blast":
      return <LearningLetterBlast goBack={goBack} />;
  
    case "odd-letter":
      return <OddLetter goBack={goBack} />;

    case "connect-letters":
      return <ConnectLetters goBack={goBack} />;

    case "word-builder":
      return <WordBuilder goBack={goBack} />;

    case "practice-home":
      return <PracticeHome navigate={navigate} goBack={goBack} />;

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

    case "numbers":
      return (
        <NumbersHome
          navigate={navigate}
          goBack={() => navigate("kids-home")}
        />
      );

    case "numbers-learning-home":
      return (
        <NumbersLearningHome
          navigate={navigate}
          goBack={() => navigate("numbers")}
        />
      );

    case "numbers-game-home":
      return (
        <NumbersGameHome
          navigate={navigate}
          goBack={() => navigate("numbers")}
        />
      );

    case "concept-what-is-a-number":
      return (
        <ConceptWhatIsANumber
          goBack={() => navigate("numbers-learning-home")}
        />
      );

    case "concept-bigger-smaller":
      return (
        <ConceptBiggerSmaller
          goBack={() => navigate("numbers-learning-home")}
        />
      );

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

    case "letter-tracing":
      return <LetterTracing goBack={goBack} />;

    case "letter-recognition":
      return <LetterRecognizition goBack={goBack} />;

    case "confusing-letters":
      return <ConfusingLetters goBack={goBack} />;

    case "uppercase-lowercase":
      return lastSection === "letters" ? (
        <AlphabetUppercaseLowercase goBack={goBack} />
      ) : (
        <UppercaseLowercase goBack={goBack} />
      );

    case "rhyming-words":
      return <RhymingWords goBack={goBack} />;

    case "games-home":
      return (
        <GamesHome
          navigate={navigate}
          goBack={() => navigate("kids-home")}
        />
      );

    case "games-play":
      return (
        <GamesPlayHome
          navigate={navigate}
          goBack={() => navigate("games-home")}
        />
      );

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

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}