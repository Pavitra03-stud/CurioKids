// import { Routes, Route } from "react-router-dom";

// /* 🌱 Entry */
// import PublicHome from "./features/PublicHome";

// /* 🧒 Registration */
// import ChildRegister from "./features/ChildRegister";
// import ParentRegister from "./features/ParentRegister";

// /* 🔐 Auth */
// import Login from "./features/Login";
// import OtpVerify from "./features/OtpVerify";

// /* 🐾 Onboarding */
// import ChooseFriend from "./features/ChooseFriend";
// import FriendIntro from "./features/FriendIntro";

// /* 🌴 Main */
// import JungleHero from "./features/JungleHero";
// import KidsHome from "./features/KidsHome";
// import LettersHome from "./features/LettersHome";
// import LettersLearningHome from "./features/LettersLearningHome";
// import LettersGameHome from "./features/LettersGameHome";
// import PracticeHome from "./features/PracticeHome";
// import NumbersHome from "./features/NumbersHome";
// import GamesHome from "./features/GamesHome";
// import GamesPlayHome from "./features/GamesPlayHome";
// import ParentDashboard from "./features/ParentDashboard";
// import BeginningSounds from "./features/BeginningSounds";
// import EndingSounds from "./features/EndingSounds";
// import BuildWord from "./features/BuildWord";
// import FindHidden from "./features/FindHidden";

// /* 🔢 Numbers */
// import StrawberryCount from "./features/StrawberryCount";
// import NumberTrail from "./features/NumberTrail";
// import FrogJumpMath from "./features/FrogJumpMath";
// import MissingNumber from "./features/MissingNumber";
// import CompareSafari from "./features/CompareSafari";
// import SkipCounting from "./features/SkipCounting";
// import NumberLineMove from "./features/NumberLineMove";
// import NumbersLearningHome from "./features/NumbersLearningHome";
// import NumbersGameHome from "./features/NumbersGameHome";

// /* 🔤 Letters */
// import AIWritingTest from "./features/AIWritingTest";
// import AlphabetLearning from "./features/AlphabetLearning";
// import AlphabetFlashCard from "./features/AlphabetFlashCard";
// import LetterTracing from "./features/LetterTracing";
// import ConfusingLetters from "./features/ConfusingLetters";
// import LetterRecognizition from "./features/LetterRecognizition";
// import UppercaseLowercase from "./features/UppercaseLowercase";
// import RhymingWords from "./features/RhymingWords";
// import FindCorrectLetter from "./features/FindCorrectLetter";
// import SoundMatching from "./features/SoundMatching";
// import BlendSounds from "./features/BlendSounds";
// import BreakWord from "./features/BreakWord";
// import MissingLetter from "./features/MissingLetter";
// import SightWords from "./features/SightWords";
// import WordScramble from "./features/WordScramble";
// import SentenceBuilder from "./features/SentenceBuilder";
// import MatchWordToPicture from "./features/MatchWordToPicture";
// import SequenceBuilder from "./features/SequenceBuilder";
// import LeftRightPractice from "./features/LeftRightPractice";
// import PatternMatching from "./features/PatternMatching";
// import SpotDifference from "./features/SpotDifference";
// import MemoryMatching from "./features/MemoryMatching";
// import ReadAloud from "./features/ReadAloud";
// import TimedChallenge from "./features/TimedChallenge";
// import DailyPractice from "./features/DailyPractice";
// import RewardChallenge from "./features/RewardChallenge";
// import ProgressStars from "./features/ProgressStars";
// import Rewards from "./features/Reward";
// import Progress from "./features/Progress";
// //import LettersLearningHome from "./features/LettersLearningHome";
// /* 🎮 Games */
// import SoundTap from "./features/SoundTap";
// import PatternCopy from "./features/PatternCopy";
// import FindFriend from "./features/FindFriend";
// import MemoryMatch from "./features/MemoryMatch";
// import CatchWord from "./features/CatchWord";
// import FillBucket from "./features/FillBucket";
// import LetterBlast from "./features/LetterBlast";
// import GamesLearningHome from "./features/GamesLearningHome";
// import WeatherClothesGame from "./features/WeatherClothesGame";
// import NumberNinja from "./features/NumberNinja";
// import ConceptWhatIsANumber from "./features/ConceptWhatIsANumber";


// /* 🤖 AI */
// import AIChat from "./features/AIChat";
// import AIButton from "./features/AIButton";
// import Profile from "./features/Profile";
// import AdminDashboard from "./features/AdminDashboard";

// import GamesLearning from "./features/GamesLearningHome";
// import GamesPlay from "./features/GamesPlayHome";
// import { GameProvider } from "./context/GameContext";

// import "./index.css";

// export default function App() {
//   return (
//     <GameProvider>
//       <Routes>

//         {/* 🌱 Entry */}
//         <Route path="/" element={<PublicHome />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/child-register" element={<ChildRegister />} />
//         <Route path="/parent-register" element={<ParentRegister />} />
//         <Route path="/otp" element={<OtpVerify />} />

//         {/* 🐾 Onboarding */}
//         <Route path="/choose-friend" element={<ChooseFriend />} />
//         <Route path="/friend-intro" element={<FriendIntro />} />
//         <Route path="/jungle-hero" element={<JungleHero />} />

//         {/* 🌴 Main */}
//         <Route path="/kids-home" element={<KidsHome />} />
//         <Route path="/letters-home" element={<LettersHome />} />
//         <Route path="/letter-learning" element={<LettersLearningHome />} />
//         <Route path="/letter-gaming" element={<LettersGameHome />} />
//         <Route path="/practice-home" element={<PracticeHome />} />
//         <Route path="/numbers" element={<NumbersHome />} />
//         <Route path="/rewards" element={<Rewards />} />
//         <Route path="/progress" element={<Progress />} />


//         {/* 🔤 Letters */}
//         <Route path="/alphabet-learning" element={<AlphabetLearning />} />
//         <Route path="/alphabet-flashcard" element={<AlphabetFlashCard />} />
//         <Route path="/letter-tracing" element={<LetterTracing />} />
//         <Route path="/confusing-letters" element={<ConfusingLetters />} />
//         <Route path="/letter-recognition" element={<LetterRecognizition />} />
//         <Route path="/uppercase-lowercase" element={<UppercaseLowercase />} />
//         <Route path="/rhyming-words" element={<RhymingWords />} />
//         <Route path="/ai-writing-test" element={<AIWritingTest />} />
//         <Route path="/find-letter" element={<FindCorrectLetter />} />
//         <Route path ="/beginning-sounds" element={<BeginningSounds/>}/>
//         <Route path ="/ending-sounds" element={<EndingSounds/>}/>
//         <Route path="/sound-matching" element={<SoundMatching />} />
//         <Route path="/blend-sounds" element={<BlendSounds />} />
//         <Route path="/break-word" element={<BreakWord />} />
//         <Route path="/build-word" element={<BuildWord />} />
//         <Route path="/missing-letter" element={<MissingLetter />} />
//         <Route path="/sight-words" element={<SightWords />} />
//         <Route path="/word-scramble" element={<WordScramble />} />
//         <Route path="/sentence-builder" element={<SentenceBuilder />} />
//         <Route path="/match-word-picture" element={<MatchWordToPicture />} />
//         <Route path="/find-hidden" element={<FindHidden/>}/>
//         <Route path="/sequence-builder" element={<SequenceBuilder />} />
//         <Route path="/left-right-practice" element={<LeftRightPractice />} />
//         <Route path="/pattern-matching" element={<PatternMatching />} />
//         <Route path="/spot-difference" element={<SpotDifference/>}/>
//         <Route path="/memory-match" element={<MemoryMatching />} />
//         <Route path="/read-aloud" element={<ReadAloud />} />
//         <Route path="/timed-challenge" element={<TimedChallenge />} />
//         <Route path="/daily-practice-goal" element={<DailyPractice />} />
//         <Route path="/reward-challenge" element={<RewardChallenge />} />
//         <Route path="/progress-stars" element={<ProgressStars />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/number-ninja" element={<NumberNinja />} />



//         {/* 🔢 Numbers */}
//         <Route path="/numbers-learning-home" element={<NumbersLearningHome />} />
//         <Route path="/numbers-game-home" element={<NumbersGameHome />} />
//         <Route path="/strawberry-count" element={<StrawberryCount />} />
//         <Route path="/number-trail" element={<NumberTrail />} />
//         <Route path="/frog-jump" element={<FrogJumpMath />} />
//         <Route path="/missing-number" element={<MissingNumber />} />
//         <Route path="/compare-safari" element={<CompareSafari />} />
//         <Route path="/skip-count" element={<SkipCounting />} />
//         <Route path="/number-line" element={<NumberLineMove />} />
//         <Route path="/concept-what-is-a-number" element={<ConceptWhatIsANumber/>}/>

//         {/* 🎮 Games */}
//         <Route path="/games-home" element={<GamesHome />} />
//         <Route path="/games-play" element={<GamesPlayHome />} />
//         <Route path="/games-learning" element={<GamesLearningHome />} />
//         <Route path="/sound-tap" element={<SoundTap />} />
//         <Route path="/pattern-copy" element={<PatternCopy />} />
//         <Route path="/find-friend" element={<FindFriend />} />
//         <Route path="/memory-match" element={<MemoryMatch />} />
//         <Route path="/catch-word" element={<CatchWord />} />
//         <Route path="/fill-bucket" element={<FillBucket />} />
//         <Route path="/letter-blast" element={<LetterBlast />} />
//         <Route path="/weather-clothes" element={<WeatherClothesGame />} />
//         <Route path="/games-learning" element={<GamesLearning />} />
//         <Route path="/games-play" element={<GamesPlay />} />
//         {/* 👨‍👩‍👧 Parent */}
//         <Route path="/parent-dashboard" element={<ParentDashboard />} />
//         <Route path="/admin" element={<AdminDashboard />} />

//         {/* 🤖 AI */}
//         <Route path="/ai-chat" element={<AIChat />} />

//       </Routes>

//       {/* 🤖 Floating AI Button */}
//     <AIButton/>
//     </GameProvider>
//   );
// }


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
import PracticeHome from "./features/PracticeHome";
import NumbersHome from "./features/NumbersHome";
import GamesHome from "./features/GamesHome";
import GamesPlayHome from "./features/GamesPlayHome";
import ParentDashboard from "./features/ParentDashboard";

/* 🔤 Letters Main */
import LettersHome from "./features/LettersHome";
import LettersLearningHome from "./features/LettersLearningHome";
import LettersGameHome from "./features/LettersGameHome";

/* 🔤 Letters Learning */
import AlphabetLearning from "./features/AlphabetLearning";
import AlphabetFlashCard from "./features/AlphabetFlashCard";
import AnimalPathLetter from "./features/AnimalPathLetter";
import AlphabetLetterTracing from "./features/AlphabetLetterTracing";
import AlphabetUppercaseLowercase from "./features/AlphabetUppercaseLowercase";

/* 🔤 Letters Games */
import LearningLetterBlast from "./features/LearningLetterBlast";
import OddLetter from "./features/OddLetter";
import ConnectLetters from "./features/ConnectLetters";
import WordBuilder from "./features/WordBuilder";

/* 🔢 Numbers */
import NumbersLearningHome from "./features/NumbersLearningHome";
import NumberGamesHome from "./features/NumberGamesHome";
import MultiSensoryNumbers from "./features/MultiSensoryNumbers";
import StoryBasedNumbers from "./features/StoryBasedNumbers";
import NumberTracing from "./features/NumberTracing";
import SlowLearning from "./features/SlowLearning";

/* 🎮 Games */
import SoundTap from "./features/SoundTap";
import PatternCopy from "./features/PatternCopy";
import FindFriend from "./features/FindFriend";
import MemoryMatch from "./features/MemoryMatch";
import CatchWord from "./features/CatchWord";
import FillBucket from "./features/FillBucket";
import GamesLearningHome from "./features/GamesLearningHome";
import WeatherClothesGame from "./features/WeatherClothesGame";

/* 🤖 AI */
import AIChat from "./features/AIChat";
import AIButton from "./features/AIButton";
import Profile from "./features/Profile";
import AdminDashboard from "./features/AdminDashboard";

import Rewards from "./features/Reward";
import Progress from "./features/Progress";
import { GameProvider } from "./context/GameContext";

import "./index.css";



export default function App() {
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
        <Route path="/practice-home" element={<PracticeHome />} />
        <Route path="/numbers" element={<NumbersHome />} />
        <Route path="/games-home" element={<GamesHome />} />
        <Route path="/games-play" element={<GamesPlayHome />} />
        <Route path="/games-learning" element={<GamesLearningHome />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ai-chat" element={<AIChat />} />

        {/* 🔤 Letters Main */}
        <Route path="/letters-home" element={<LettersHome />} />
        <Route path="/letter-learning" element={<LettersLearningHome />} />
        <Route path="/letter-gaming" element={<LettersGameHome />} />

        {/* 🔤 Letters Learning Pages */}
        <Route path="/alphabet-learning" element={<AlphabetLearning />} />
        <Route path="/alphabet-flashcard" element={<AlphabetFlashCard />} />
        <Route path="/animal-path-letter" element={<AnimalPathLetter />} />
        <Route
          path="/alphabet-letter-tracing"
          element={<AlphabetLetterTracing />}
        />
        <Route
          path="/alphabet-uppercase-lowercase"
          element={<AlphabetUppercaseLowercase />}
        />

        {/* 🔤 Letters Game Pages */}
        <Route path="/learning-letter-blast" element={<LearningLetterBlast />} />
        <Route path="/odd-letter" element={<OddLetter />} />
        <Route path="/connect-letters" element={<ConnectLetters />} />
        <Route path="/word-builder" element={<WordBuilder />} />

        {/* 🔢 Numbers */}
        <Route path="/numbers-learning-home" element={<NumbersLearningHome />} />
        <Route path="/number-games-home" element={<NumberGamesHome />} />
        <Route path="/multi-sensory-numbers" element={<MultiSensoryNumbers />} />
        <Route path="/story-based-numbers" element={<StoryBasedNumbers />} />
        <Route path="/number-tracing" element={<NumberTracing />} />
        <Route path="/slow-learning" element={<SlowLearning />} />
        <

        

        {/* 🎮 General Games */}
        <Route path="/sound-tap" element={<SoundTap />} />
        <Route path="/pattern-copy" element={<PatternCopy />} />
        <Route path="/find-friend" element={<FindFriend />} />
        <Route path="/memory-match" element={<MemoryMatch />} />
        <Route path="/catch-word" element={<CatchWord />} />
        <Route path="/fill-bucket" element={<FillBucket />} />
        <Route path="/weather-clothes" element={<WeatherClothesGame />} />
      </Routes>

      <AIButton />
    </GameProvider>
  );
}