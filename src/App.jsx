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

/* 🧠 Practice */
import LetterTracing from "./features/LetterTracing";
import ConfusingLetters from "./features/ConfusingLetters";
import LetterRecognition from "./features/LetterRecognizition";
import UppercaseLowercase from "./features/UppercaseLowercase";
import RhymingWords from "./features/RhymingWords";
import AlphabetLearning from "./features/AlphabetLearning";
import AlphabetFlashCard from "./features/AlphabetFlashCard";

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

  const goBack = () => {
    if (screen === "alphabet-learning") {
      navigate("letters-learning-home");
      return;
    }

    if (screen === "alphabet-flashcard") {
      navigate("letters-learning-home");
      return;
    }

    if (
      screen === "letter-tracing" ||
      screen === "letter-recognition" ||
      screen === "confusing-letters" ||
      screen === "uppercase-lowercase" ||
      screen === "rhyming-words"
    ) {
      navigate("practice-home");
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
      navigate("numbers");
      return;
    }

    if (screen === "letters-learning-home" || screen === "letters-game-home") {
      navigate("letters-home");
      return;
    }

    if (
      screen === "concept-what-is-a-number" ||
      screen === "concept-bigger-smaller"
    ) {
      navigate("numbers-learning-home");
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

    const index = flow.indexOf(screen);

    if (index > 0) {
      navigate(flow[index - 1]);
    }
  };

  switch (screen) {
    case "public-home":
      return (
        <PublicHome
          onComplete={() => navigate("child-register")}
          goBack={() => navigate("kids-home")}
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
      return <JungleHero onComplete={navigate} />;

    case "kids-home":
      return (
        <KidsHome
          navigate={navigate}
          goBack={() => navigate("jungle-hero")}
        />
      );

    case "letters-home":
      return (
        <LettersHome
          navigate={navigate}
          goBack={() => navigate("kids-home")}
        />
      );

    case "letters-learning-home":
      return (
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

    case "alphabet-learning":
      return <AlphabetLearning goBack={goBack} />;

    case "alphabet-flashcard":
      return <AlphabetFlashCard goBack={goBack} />;

    case "practice-home":
      return <PracticeHome navigate={navigate} goBack={goBack} />;

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
      return <LetterRecognition goBack={goBack} />;

    case "confusing-letters":
      return <ConfusingLetters goBack={goBack} />;

    case "uppercase-lowercase":
      return <UppercaseLowercase goBack={goBack} />;

    case "rhyming-words":
      return <RhymingWords goBack={goBack} />;

    case "parent-dashboard":
      return <ParentDashboard navigate={navigate} />;

    default:
      return <PublicHome onComplete={() => navigate("child-register")} />;
  }
}

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
// import LettersHome from "./features/LettersHome";
// import LettersLearningHome from "./features/LettersLearningHome";
// import LettersGameHome from "./features/LettersGameHome";
// import PracticeHome from "./features/PracticeHome";
// import NumbersHome from "./features/NumbersHome";
// import ParentDashboard from "./features/ParentDashboard";

// /* 📊 Progress Page */
// import Progress from "./pages/Progress";

// /* 🧠 Practice */
// import LetterTracing from "./features/LetterTracing";
// import ConfusingLetters from "./features/ConfusingLetters";
// import LetterRecognition from "./features/LetterRecognizition";
// import UppercaseLowercase from "./features/UppercaseLowercase";
// import RhymingWords from "./features/RhymingWords";

// import "./index.css";

// export default function App() {
// const [screen, setScreen] = useState(
// localStorage.getItem("currentScreen") || "public-home"
// );

// useEffect(() => {
// window.scrollTo(0, 0);
// }, [screen]);

// const navigate = (next) => {
// setScreen(next);
// localStorage.setItem("currentScreen", next);
// };

// const goBack = () => {
// if (screen === "progress") {
// navigate("parent-dashboard");
// return;
// }
// const flow = [
//   "public-home",
//   "child-register",
//   "parent-register",
//   "choose-friend",
//   "friend-intro",
//   "jungle-hero",
//   "kids-home",
//   "practice-home",
//   "parent-dashboard",
// ];

// const index = flow.indexOf(screen);

// if (index > 0) {
//   navigate(flow[index - 1]);
// }


// };

// switch (screen) {

// case "public-home":
//   return (
//     <PublicHome
//       onComplete={() => navigate("child-register")}
//     />
//   );

// case "child-register":
//   return (
//     <ChildRegister
//       onComplete={() => navigate("parent-register")}
//       goBack={goBack}
//     />
//   );

// case "parent-register":
//   return (
//     <ParentRegister
//       onComplete={() => navigate("choose-friend")}
//       goBack={goBack}
//     />
//   );

// case "choose-friend":
//   return (
//     <ChooseFriend
//       onComplete={() => navigate("friend-intro")}
//       goBack={goBack}
//     />
//   );

// case "friend-intro":
//   return (
//     <FriendIntro
//       onComplete={() => navigate("jungle-hero")}
//       goBack={goBack}
//     />
//   );

// case "jungle-hero":
//   return <JungleHero onComplete={navigate} />;

// case "kids-home":
//   return (
//     <KidsHome
//       navigate={navigate}
//     />
//   );

// case "letters-home":
//   return (
//     <LettersHome
//       navigate={navigate}
//     />
//   );

// case "letters-learning-home":
//   return (
//     <LettersLearningHome
//       navigate={navigate}
//     />
//   );

// case "letters-game-home":
//   return (
//     <LettersGameHome
//       navigate={navigate}
//     />
//   );

// case "practice-home":
//   return (
//     <PracticeHome
//       navigate={navigate}
//       goBack={goBack}
//     />
//   );

// case "numbers":
//   return (
//     <NumbersHome
//       navigate={navigate}
//     />
//   );

// case "letter-tracing":
//   return <LetterTracing goBack={goBack} />;

// case "letter-recognition":
//   return <LetterRecognition goBack={goBack} />;

// case "confusing-letters":
//   return <ConfusingLetters goBack={goBack} />;

// case "uppercase-lowercase":
//   return <UppercaseLowercase goBack={goBack} />;

// case "rhyming-words":
//   return <RhymingWords goBack={goBack} />;

// case "parent-dashboard":
//   return (
//     <ParentDashboard navigate={navigate} />
//   );

// case "progress":
//   return (
//     <Progress goBack={goBack} />
//   );

// default:
//   return <PublicHome onComplete={() => navigate("child-register")} />;

// }
// }
