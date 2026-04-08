import { useEffect, useState } from "react";
import "./index.css";
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
import LearningLetterBlast from "./features/LearningLetterBlast";
import OddLetter from "./features/OddLetter";
import ConnectLetters from "./features/ConnectLetters";
import WordBuilder from "./features/WordBuilder";
import PracticeHome from "./features/PracticeHome";
import NumbersHome from "./features/NumbersHome";
import GamesHome from "./features/GamesHome";
import GamesPlayHome from "./features/GamesPlayHome";
import ParentDashboard from "./features/ParentDashboard";
import BeginningSounds from "./features/BeginningSounds";
import EndingSounds from "./features/EndingSounds";
import BuildWord from "./features/BuildWord";
import FindHidden from "./features/FindHidden";

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

/* 🔤 Letters */
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
import FindCorrectLetter from "./features/FindCorrectLetter";
import SoundMatching from "./features/SoundMatching";
import BlendSounds from "./features/BlendSounds";
import BreakWord from "./features/BreakWord";
import MissingLetter from "./features/MissingLetter";
import SightWords from "./features/SightWords";
import WordScramble from "./features/WordScramble";
import SentenceBuilder from "./features/SentenceBuilder";
import MatchWordToPicture from "./features/MatchWordToPicture";
import SequenceBuilder from "./features/SequenceBuilder";
import LeftRightPractice from "./features/LeftRightPractice";
import PatternMatching from "./features/PatternMatching";
import SpotDifference from "./features/SpotDifference";
import MemoryMatching from "./features/MemoryMatching";
import ReadAloud from "./features/ReadAloud";
import TimedChallenge from "./features/TimedChallenge";
import DailyPractice from "./features/DailyPractice";
import RewardChallenge from "./features/RewardChallenge";
import ProgressStars from "./features/ProgressStars";
import Rewards from "./features/Reward";
import Progress from "./features/Progress";
//import LettersLearningHome from "./features/LettersLearningHome";
/* 🎮 Games */
import SoundTap from "./features/SoundTap";
import PatternCopy from "./features/PatternCopy";
import FindFriend from "./features/FindFriend";
import MemoryMatch from "./features/MemoryMatch";
import CatchWord from "./features/CatchWord";
import FillBucket from "./features/FillBucket";
import LetterBlast from "./features/LetterBlast";
import GamesLearningHome from "./features/GamesLearningHome";
import WeatherClothesGame from "./features/WeatherClothesGame";
import NumberNinja from "./features/NumberNinja";
import ConceptWhatIsANumber from "./features/ConceptWhatIsANumber";


/* 🤖 AI */
import AIChat from "./features/AIChat";
import AIButton from "./features/AIButton";
import Profile from "./features/Profile";
import AdminDashboard from "./features/AdminDashboard";

import GamesLearning from "./features/GamesLearningHome";
import GamesPlay from "./features/GamesPlayHome";
import { GameProvider } from "./context/GameContext";

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
  return (
    <GameProvider>
      <Routes>

        {/* 🌱 Entry */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/child-register" element={<ChildRegister />} />
        <Route path="/parent-register" element={<ParentRegister />} />
        <Route path="/otp" element={<OtpVerify />} />

        {/* 🐾 Onboarding */}
        <Route path="/choose-friend" element={<ChooseFriend />} />
        <Route path="/friend-intro" element={<FriendIntro />} />
        <Route path="/jungle-hero" element={<JungleHero />} />

        {/* 🌴 Main */}
        <Route path="/kids-home" element={<KidsHome />} />
        <Route path="/letters-home" element={<LettersHome />} />
        <Route path="/letter-learning" element={<LettersLearningHome />} />
        <Route path="/letter-gaming" element={<LettersGameHome />} />
        <Route path="/practice-home" element={<PracticeHome />} />
        <Route path="/numbers" element={<NumbersHome />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/progress" element={<Progress />} />
        

        {/* 🔤 Letters */}
        <Route path="/alphabet-learning" element={<AlphabetLearning />} />
        <Route path="/alphabet-flashcard" element={<AlphabetFlashCard />} />
        <Route path="/letter-tracing" element={<LetterTracing />} />
        <Route path="/confusing-letters" element={<ConfusingLetters />} />
        <Route path="/letter-recognition" element={<LetterRecognizition />} />
        <Route path="/uppercase-lowercase" element={<UppercaseLowercase />} />
        <Route path="/rhyming-words" element={<RhymingWords />} />
        <Route path="/ai-writing-test" element={<AIWritingTest />} />
        <Route path="/find-letter" element={<FindCorrectLetter />} />
        <Route path ="/beginning-sounds" element={<BeginningSounds/>}/>
        <Route path ="/ending-sounds" element={<EndingSounds/>}/>
        <Route path="/sound-matching" element={<SoundMatching />} />
        <Route path="/blend-sounds" element={<BlendSounds />} />
        <Route path="/break-word" element={<BreakWord />} />
        <Route path="/build-word" element={<BuildWord />} />
        <Route path="/missing-letter" element={<MissingLetter />} />
        <Route path="/sight-words" element={<SightWords />} />
        <Route path="/word-scramble" element={<WordScramble />} />
        <Route path="/sentence-builder" element={<SentenceBuilder />} />
        <Route path="/match-word-picture" element={<MatchWordToPicture />} />
        <Route path="/find-hidden" element={<FindHidden/>}/>
        <Route path="/sequence-builder" element={<SequenceBuilder />} />
        <Route path="/left-right-practice" element={<LeftRightPractice />} />
        <Route path="/pattern-matching" element={<PatternMatching />} />
        <Route path="/spot-difference" element={<SpotDifference/>}/>
        <Route path="/memory-match" element={<MemoryMatching />} />
        <Route path="/read-aloud" element={<ReadAloud />} />
        <Route path="/timed-challenge" element={<TimedChallenge />} />
        <Route path="/daily-practice-goal" element={<DailyPractice />} />
        <Route path="/reward-challenge" element={<RewardChallenge />} />
        <Route path="/progress-stars" element={<ProgressStars />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/number-ninja" element={<NumberNinja />} />

        

        {/* 🔢 Numbers */}
        <Route path="/numbers-learning-home" element={<NumbersLearningHome />} />
        <Route path="/numbers-game-home" element={<NumbersGameHome />} />
        <Route path="/strawberry-count" element={<StrawberryCount />} />
        <Route path="/number-trail" element={<NumberTrail />} />
        <Route path="/frog-jump" element={<FrogJumpMath />} />
        <Route path="/missing-number" element={<MissingNumber />} />
        <Route path="/compare-safari" element={<CompareSafari />} />
        <Route path="/skip-count" element={<SkipCounting />} />
        <Route path="/number-line" element={<NumberLineMove />} />
        <Route path="/concept-what-is-a-number" element={<ConceptWhatIsANumber/>}/>

        {/* 🎮 Games */}
        <Route path="/games-home" element={<GamesHome />} />
        <Route path="/games-play" element={<GamesPlayHome />} />
        <Route path="/games-learning" element={<GamesLearningHome />} />
        <Route path="/sound-tap" element={<SoundTap />} />
        <Route path="/pattern-copy" element={<PatternCopy />} />
        <Route path="/find-friend" element={<FindFriend />} />
        <Route path="/memory-match" element={<MemoryMatch />} />
        <Route path="/catch-word" element={<CatchWord />} />
        <Route path="/fill-bucket" element={<FillBucket />} />
        <Route path="/letter-blast" element={<LetterBlast />} />
        <Route path="/weather-clothes" element={<WeatherClothesGame />} />
        <Route path="/games-learning" element={<GamesLearning />} />
        <Route path="/games-play" element={<GamesPlay />} />
        {/* 👨‍👩‍👧 Parent */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* 🤖 AI */}
        <Route path="/ai-chat" element={<AIChat />} />
        
      </Routes>

      {/* 🤖 Floating AI Button */}
    <AIButton/>
    </GameProvider>
  );

}