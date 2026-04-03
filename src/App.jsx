import { Routes, Route } from "react-router-dom";

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
import GamesLearningHome from "./features/GamesLearningHome";
import WeatherClothesGame from "./features/WeatherClothesGame";

/* 🤖 AI */
import AIChat from "./features/AIChat";
import AIButton from "./features/AIButton";

import GamesLearning from "./features/GamesLearningHome";
import GamesPlay from "./features/GamesPlayHome";

import "./index.css";

export default function App() {
  return (
    <>
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
        <Route path="/letters-learning-home" element={<LettersLearningHome />} />
        <Route path="/letters-game-home" element={<LettersGameHome />} />
        <Route path="/practice-home" element={<PracticeHome />} />
        <Route path="/numbers" element={<NumbersHome />} />

        {/* 🔤 Letters */}
        <Route path="/alphabet-learning" element={<AlphabetLearning />} />
        <Route path="/alphabet-flashcard" element={<AlphabetFlashCard />} />
        <Route path="/letter-tracing" element={<LetterTracing />} />
        <Route path="/confusing-letters" element={<ConfusingLetters />} />
        <Route path="/letter-recognition" element={<LetterRecognizition />} />
        <Route path="/uppercase-lowercase" element={<UppercaseLowercase />} />
        <Route path="/rhyming-words" element={<RhymingWords />} />
        <Route path="/ai-writing-test" element={<AIWritingTest />} />

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
        <Route path="/letter-blast-game" element={<LetterBlast />} />
        <Route path="/weather-clothes" element={<WeatherClothesGame />} />
        <Route path="/games-learning" element={<GamesLearning />} />
        <Route path="/games-play" element={<GamesPlay />} />
        {/* 👨‍👩‍👧 Parent */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        {/* 🤖 AI */}
        <Route path="/ai-chat" element={<AIChat />} />
        
      </Routes>

      {/* 🤖 Floating AI Button */}
      <AIButton />
    </>
  );
}