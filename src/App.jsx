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

/* 🐾 Onboarding */
import ChooseFriend from "./features/ChooseFriend";
import FriendIntro from "./features/FriendIntro";

/* 🌴 Main Screens */
import JungleHero from "./features/JungleHero";
import KidsHome from "./features/KidsHome";
import LettersHome from "./features/LettersHome";
import LettersLearningHome from "./features/LettersLearningHome";
import LettersGameHome from "./features/LettersGameHome";
import PracticeHome from "./features/PracticeHome";
import NumbersHome from "./features/NumbersHome";
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
// import ConceptNumber from "./features/ConceptNumber";
// /* 🧠 Practice Games */
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognition from "./features/LetterRecognizition";
import AlphabetFlashCard from "./features/AlphabetFlashCard";
import UppercaseLowercase from "./features/UppercaseLowercase"; 
import RhymingWords from "./features/RhymingWords"; // 🔥 NEW

import "./index.css";

export default function App() {

  const [screen, setScreen] = useState(
    localStorage.getItem("currentScreen") || "public-home"
  );

  /* 🔥 Scroll to top on screen change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const navigate = (next) => {
    setScreen(next);
    localStorage.setItem("currentScreen", next);
  };

  /* 🔙 Smart Back Navigation */
  const goBack = () => {

    /* Practice games go back to practice-home */
    if (
      screen === "letter-tracing" ||
      screen === "letter-recognition" ||
      screen === "confusing-letters" ||
      screen === "uppercase-lowercase" ||
      screen === "rhyming-words" // 🔥 added
    ) {
      navigate("practice-home");
      return;
    }

    /* Number games go back to numbers */
    if (
      screen === "strawberry-count" ||
      screen === "number-trail" ||
      screen === "frog-jump" ||
      screen === "missing-number" ||
      screen === "compare-safari" ||
      screen === "skip-count" ||
      screen === "number-line"
    ) {
      navigate("numbers");
      return;
    }

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
      navigate(flow[currentIndex - 1]);
    }
  };

  switch (screen) {

    /* ENTRY FLOW */
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

    /* MAIN HUBS */
    case "kids-home":
      return <KidsHome navigate={navigate} />;

    case "letters-home":
      return (
        <LettersHome
        navigate={navigate}
        goBack={() => navigate("kids-home")}
       />
      );
      
      case "letters-learning-home":
        return(
          <LettersLearningHome
          navigate={navigate}
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
    case "practice-home":
      return <PracticeHome navigate={navigate} goBack={goBack} />;

    case "numbers":
      return (
        <NumbersHome
          navigate={navigate}
          goBack={() => navigate("kids-home")}
        />
      );

    /* NUMBER GAMES */
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

    /* PRACTICE GAMES */
    case "letter-tracing":
      return <LetterTracing goBack={goBack} />;

    case "letter-recognition":
      return <LetterRecognition goBack={goBack} />;

    case "confusing-letters":
      return <ConfusingLetters goBack={goBack} />;

    case "uppercase-lowercase":   // 🔥 NEW SCREEN
      return <UppercaseLowercase goBack={goBack} />;
      case "rhyming-words":   // 🔥 NEW SCREEN
      return <RhymingWords goBack={goBack} />;


    case "parent-dashboard":
      return <ParentDashboard navigate={navigate} />;
        
    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}