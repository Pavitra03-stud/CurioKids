import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/AdminDashboard.css";

export default function AdminDashboard({ navigate, goBack }) {
  const [activeSection, setActiveSection] = useState("Dashboard Overview");

  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);

  const [gameName, setGameName] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("easy");
  const [type, setType] = useState("mcq");

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, []);

  const fetchUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      setUsers(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchGames = async () => {
    try {
      const snap = await getDocs(collection(db, "games"));
      setGames(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  const addGame = async () => {
    if (!gameName.trim() || !topic.trim()) {
      alert("Fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "games"), {
        name: gameName.trim(),
        topic: topic.trim(),
        level,
        type,
        createdAt: serverTimestamp(),
      });

      setGameName("");
      setTopic("");
      setLevel("easy");
      setType("mcq");
      fetchGames();
      alert("Game Added 🚀");
    } catch (err) {
      console.error("Error adding game:", err);
      alert("Failed to add game");
    }
  };

  const adminSections = [
    {
      title: "Dashboard Overview",
      icon: "📊",
      items: [
        {
          name: "Total Users",
          screen: "users",
          type: "Summary",
          status: "Active",
          description: "Shows all registered users in the application",
          details: [
            "Count total registered users",
            "Display recent user activity",
            "Track user usage summary",
          ],
        },
        {
          name: "Total Kids",
          screen: "kids",
          type: "Summary",
          status: "Active",
          description: "Shows total kids using the learning platform",
          details: [
            "Display child learner count",
            "Track learning activity",
            "Monitor engagement",
          ],
        },
        {
          name: "Total Parents",
          screen: "parents",
          type: "Summary",
          status: "Active",
          description: "Shows parent access and parent-linked accounts",
          details: [
            "Display parent count",
            "Track parent dashboard access",
            "Monitor child-parent linkage",
          ],
        },
        {
          name: "Total Modules",
          screen: "modules",
          type: "Summary",
          status: "Active",
          description: "Shows total modules available in the app",
          details: [
            "Count major app modules",
            "Display module categories",
            "Track active sections",
          ],
        },
        {
          name: "Total Learning Pages",
          screen: "learning-pages",
          type: "Summary",
          status: "Active",
          description: "Shows total learning activities across modules",
          details: [
            "Letters learning count",
            "Practice learning count",
            "Numbers learning count",
          ],
        },
        {
          name: "Total Game Pages",
          screen: "game-pages",
          type: "Summary",
          status: "Active",
          description: "Shows all game-related screens in the platform",
          details: [
            "Track playable pages",
            "Count game activities",
            "Show game module summary",
          ],
        },
        {
          name: "Recently Added Activities",
          screen: "recent-activities",
          type: "Summary",
          status: "Active",
          description: "Shows the latest added games or app content",
          details: [
            "Latest activities",
            "Recently created modules",
            "Quick overview of new content",
          ],
        },
      ],
    },

    {
      title: "Authentication Management",
      icon: "🔐",
      items: [
        {
          name: "Public Home",
          screen: "public-home",
          type: "Entry Page",
          status: "Active",
          description: "Landing page for children and parents before login/register",
          details: [
            "Edit welcome title",
            "Edit subtitle",
            "Edit action buttons",
            "Manage banner image",
          ],
        },
        {
          name: "Login",
          screen: "login",
          type: "Auth Page",
          status: "Active",
          description: "User login flow with OTP sending",
          details: [
            "Manage email login",
            "Manage OTP send",
            "Manage register redirect",
          ],
        },
        {
          name: "Child Register",
          screen: "child-register",
          type: "Registration Page",
          status: "Active",
          description: "Child registration form and validation screen",
          details: [
            "Manage child form fields",
            "Enable or disable inputs",
            "Form validation settings",
          ],
        },
        {
          name: "Parent Register",
          screen: "parent-register",
          type: "Registration Page",
          status: "Active",
          description: "Parent registration form and validation screen",
          details: [
            "Manage parent form fields",
            "Validation settings",
            "Save/register flow",
          ],
        },
        {
          name: "OTP Verify",
          screen: "otp",
          type: "Auth Page",
          status: "Active",
          description: "OTP verification page used after login/register",
          details: [
            "OTP verification settings",
            "Success redirect",
            "Retry/resend control",
          ],
        },
      ],
    },

    {
      title: "Onboarding Management",
      icon: "🐾",
      items: [
        {
          name: "Choose Friend",
          screen: "choose-friend",
          type: "Onboarding",
          status: "Active",
          description: "Page for selecting friend/character",
          details: [
            "Character list",
            "Character image",
            "Selection flow",
          ],
        },
        {
          name: "Friend Intro",
          screen: "friend-intro",
          type: "Onboarding",
          status: "Active",
          description: "Intro page for selected friend/character",
          details: [
            "Intro text",
            "Voice/audio",
            "Animation and media",
          ],
        },
        {
          name: "Jungle Hero",
          screen: "jungle-hero",
          type: "Onboarding",
          status: "Active",
          description: "Main onboarding completion screen before home",
          details: [
            "Intro scene settings",
            "Story content",
            "Continue navigation",
          ],
        },
      ],
    },

    {
      title: "Main Pages Management",
      icon: "🏠",
      items: [
        {
          name: "Kids Home",
          screen: "kids-home",
          type: "Main Page",
          status: "Active",
          description: "Central app home for child user",
          details: [
            "Main cards",
            "Section access",
            "Home layout",
          ],
        },
        {
          name: "Letters Home",
          screen: "letters-home",
          type: "Main Page",
          status: "Active",
          description: "Letters module entry page",
          details: [
            "Learning zone card",
            "Game zone card",
            "Back navigation",
          ],
        },
        {
          name: "Practice Home",
          screen: "practice-home",
          type: "Main Page",
          status: "Active",
          description: "Practice module entry page",
          details: [
            "Practice zones",
            "Category cards",
            "Practice routing",
          ],
        },
        {
          name: "Numbers Home",
          screen: "numbers",
          type: "Main Page",
          status: "Active",
          description: "Numbers module entry page",
          details: [
            "Learning zone",
            "Game zone",
            "Home content",
          ],
        },
        {
          name: "Games Home",
          screen: "games-home",
          type: "Main Page",
          status: "Active",
          description: "Games module entry page",
          details: [
            "Learning zone",
            "Play zone",
            "Home cards",
          ],
        },
        {
          name: "Parent Dashboard",
          screen: "parent-dashboard",
          type: "Dashboard",
          status: "Active",
          description: "Parent page to track child activity and progress",
          details: [
            "Parent features",
            "Child progress access",
            "Dashboard widgets",
          ],
        },
      ],
    },

    {
      title: "Letters Module Management",
      icon: "🔤",
      items: [
        {
          name: "Letters Home",
          screen: "letters-home",
          type: "Module Home",
          status: "Active",
          description: "Main home page of letters module",
          details: [
            "Module overview",
            "Navigation setup",
            "Zone cards",
          ],
        },
        {
          name: "Letters Learning Home",
          screen: "letters-learning-home",
          type: "Learning Home",
          status: "Active",
          description: "Learning zone entry page for letters module",
          details: [
            "Learning page list",
            "Content grouping",
            "Navigation setup",
          ],
        },
        {
          name: "Alphabet Learning",
          screen: "alphabet-learning",
          type: "Learning Page",
          status: "Active",
          description: "Alphabet lesson and teaching screen",
          details: [
            "Lesson data",
            "Images / video / audio",
            "Learning progress",
          ],
        },
        {
          name: "Alphabet Flashcard",
          screen: "alphabet-flashcard",
          type: "Learning Page",
          status: "Active",
          description: "Flashcard-based alphabet learning page",
          details: [
            "Flashcard content",
            "Letter-image mapping",
            "Audio support",
          ],
        },
        {
          name: "Alphabet Uppercase Lowercase",
          screen: "alphabet-uppercase-lowercase",
          type: "Learning Page",
          status: "Active",
          description: "Uppercase and lowercase letter matching page",
          details: [
            "Match content",
            "Card data",
            "Level settings",
          ],
        },
        {
          name: "Alphabet Confusing Letters",
          screen: "alphabet-confusing-letters",
          type: "Learning Page",
          status: "Active",
          description: "Practice for confusing letters like b/d/p/q",
          details: [
            "Confusing pairs",
            "Exercise content",
            "Practice difficulty",
          ],
        },
        {
          name: "Alphabet Letter Tracing",
          screen: "alphabet-letter-tracing",
          type: "Learning Page",
          status: "Active",
          description: "Tracing page for guided letter writing",
          details: [
            "Letter tracing paths",
            "Stroke data",
            "Feedback settings",
          ],
        },
        {
          name: "AI Writing Test",
          screen: "ai-writing-test",
          type: "AI Learning Page",
          status: "Active",
          description: "AI-assisted writing test and correction page",
          details: [
            "Writing prompts",
            "AI feedback",
            "Writing results",
          ],
        },
        {
          name: "Letters Game Home",
          screen: "letters-game-home",
          type: "Game Home",
          status: "Active",
          description: "Game zone entry page for letters module",
          details: [
            "Game list",
            "Navigation control",
            "Activity access",
          ],
        },
        {
          name: "Learning Letter Blast",
          screen: "letter-blast",
          type: "Game Page",
          status: "Active",
          description: "Tap/select the correct letter game",
          details: [
            "Question set",
            "Score rules",
            "Sound effects",
          ],
        },
        {
          name: "Odd Letter",
          screen: "odd-letter",
          type: "Game Page",
          status: "Active",
          description: "Find the odd or different letter game",
          details: [
            "Question bank",
            "Visual settings",
            "Correct/wrong feedback",
          ],
        },
        {
          name: "Connect Letters",
          screen: "connect-letters",
          type: "Game Page",
          status: "Active",
          description: "Connect letters in order game",
          details: [
            "Path data",
            "Matching rules",
            "Level progression",
          ],
        },
        {
          name: "Word Builder",
          screen: "word-builder",
          type: "Game Page",
          status: "Active",
          description: "Build simple words from letters",
          details: [
            "Word sets",
            "Letter blocks",
            "Sound support",
          ],
        },
      ],
    },

    {
      title: "Practice Module Management",
      icon: "📝",
      items: [
        {
          name: "Practice Home",
          screen: "practice-home",
          type: "Module Home",
          status: "Active",
          description: "Main practice module home page",
          details: [
            "Practice zones",
            "Module categories",
            "Routing control",
          ],
        },
        {
          name: "Practice Letter Mastery",
          screen: "practice-letter-mastery",
          type: "Practice Page",
          status: "Active",
          description: "Letter mastery practice zone",
          details: [
            "Skill grouping",
            "Difficulty settings",
            "Task control",
          ],
        },
        {
          name: "Practice Phonics",
          screen: "practice-phonics",
          type: "Practice Page",
          status: "Active",
          description: "Phonics practice activities",
          details: [
            "Phonics content",
            "Sound-based exercises",
            "Progress support",
          ],
        },
        {
          name: "Practice Word Builder",
          screen: "practice-word-builder",
          type: "Practice Page",
          status: "Active",
          description: "Practice for word-building activities",
          details: [
            "Word tasks",
            "Difficulty control",
            "Word exercise bank",
          ],
        },
        {
          name: "Practice Memory",
          screen: "practice-memory",
          type: "Practice Page",
          status: "Active",
          description: "Memory-focused practice area",
          details: [
            "Memory exercises",
            "Visual content",
            "Progress scoring",
          ],
        },
        {
          name: "Practice Confidence",
          screen: "practice-confidence",
          type: "Practice Page",
          status: "Active",
          description: "Confidence-building practice area",
          details: [
            "Confidence tasks",
            "Support flow",
            "Reward connection",
          ],
        },
        {
          name: "Letter Tracing",
          screen: "letter-tracing",
          type: "Practice Page",
          status: "Active",
          description: "Practice letter tracing page",
          details: [
            "Tracing content",
            "Guide paths",
            "Writing feedback",
          ],
        },
        {
          name: "Letter Recognition",
          screen: "letter-recognition",
          type: "Practice Page",
          status: "Active",
          description: "Recognize letters visually",
          details: [
            "Recognition tasks",
            "Question bank",
            "Accuracy settings",
          ],
        },
        {
          name: "Confusing Letters",
          screen: "confusing-letters",
          type: "Practice Page",
          status: "Active",
          description: "Practice with confusing letters",
          details: [
            "Letter pair drills",
            "Difficulty level",
            "Corrective feedback",
          ],
        },
        {
          name: "Uppercase Lowercase",
          screen: "uppercase-lowercase",
          type: "Practice Page",
          status: "Active",
          description: "Practice matching uppercase and lowercase",
          details: [
            "Matching activity",
            "Card settings",
            "Letter grouping",
          ],
        },
        {
          name: "Rhyming Words",
          screen: "rhyming-words",
          type: "Practice Page",
          status: "Active",
          description: "Practice with rhyming words",
          details: [
            "Rhyme bank",
            "Word matching",
            "Sound association",
          ],
        },
        {
          name: "Find Letter",
          screen: "find-letter",
          type: "Practice Page",
          status: "Active",
          description: "Find the correct target letter",
          details: [
            "Question items",
            "Selection tasks",
            "Result handling",
          ],
        },
        {
          name: "Beginning Sounds",
          screen: "beginning-sounds",
          type: "Practice Page",
          status: "Active",
          description: "Beginning sound recognition",
          details: [
            "Sound bank",
            "Question prompts",
            "Phonics support",
          ],
        },
        {
          name: "Ending Sounds",
          screen: "ending-sounds",
          type: "Practice Page",
          status: "Active",
          description: "Ending sound recognition",
          details: [
            "Ending sound tasks",
            "Word examples",
            "Listening support",
          ],
        },
        {
          name: "Sound Matching",
          screen: "sound-matching",
          type: "Practice Page",
          status: "Active",
          description: "Match similar sounds and words",
          details: [
            "Sound pair mapping",
            "Question bank",
            "Audio practice",
          ],
        },
        {
          name: "Blend Sounds",
          screen: "blend-sounds",
          type: "Practice Page",
          status: "Active",
          description: "Practice blending letter sounds",
          details: [
            "Blend exercises",
            "Audio prompts",
            "Word formation",
          ],
        },
        {
          name: "Break Word",
          screen: "break-word",
          type: "Practice Page",
          status: "Active",
          description: "Break words into smaller sounds/parts",
          details: [
            "Word segmentation",
            "Phonics flow",
            "Task setup",
          ],
        },
        {
          name: "Build Word",
          screen: "build-word",
          type: "Practice Page",
          status: "Active",
          description: "Build words from sounds/letters",
          details: [
            "Word blocks",
            "Sound guidance",
            "Exercise data",
          ],
        },
        {
          name: "Missing Letter",
          screen: "missing-letter",
          type: "Practice Page",
          status: "Active",
          description: "Fill in missing letter activity",
          details: [
            "Question bank",
            "Word completion",
            "Difficulty setting",
          ],
        },
        {
          name: "Sight Words",
          screen: "sight-words",
          type: "Practice Page",
          status: "Active",
          description: "Practice commonly used sight words",
          details: [
            "Sight word list",
            "Recognition practice",
            "Audio support",
          ],
        },
        {
          name: "Word Scramble",
          screen: "word-scramble",
          type: "Practice Page",
          status: "Active",
          description: "Unscramble letters to form words",
          details: [
            "Scramble sets",
            "Hint logic",
            "Word completion",
          ],
        },
        {
          name: "Sentence Builder",
          screen: "sentence-builder",
          type: "Practice Page",
          status: "Active",
          description: "Build sentences from words",
          details: [
            "Sentence bank",
            "Word arrangement",
            "Grammar support",
          ],
        },
        {
          name: "Match Word Picture",
          screen: "match-word-picture",
          type: "Practice Page",
          status: "Active",
          description: "Match words with images",
          details: [
            "Word-image mapping",
            "Question cards",
            "Recognition support",
          ],
        },
        {
          name: "Find Hidden",
          screen: "find-hidden",
          type: "Practice Page",
          status: "Active",
          description: "Find hidden letters or words",
          details: [
            "Hidden item logic",
            "Visual layout",
            "Completion settings",
          ],
        },
        {
          name: "Sequence Builder",
          screen: "sequence-builder",
          type: "Practice Page",
          status: "Active",
          description: "Arrange items in sequence",
          details: [
            "Sequence data",
            "Pattern logic",
            "Progress tracking",
          ],
        },
        {
          name: "Left Right Practice",
          screen: "left-right-practice",
          type: "Practice Page",
          status: "Active",
          description: "Spatial direction practice",
          details: [
            "Directional prompts",
            "Interactive tasks",
            "Visual understanding",
          ],
        },
        {
          name: "Pattern Matching",
          screen: "pattern-matching",
          type: "Practice Page",
          status: "Active",
          description: "Pattern recognition and matching practice",
          details: [
            "Pattern bank",
            "Matching rules",
            "Difficulty level",
          ],
        },
        {
          name: "Spot Difference",
          screen: "spot-difference",
          type: "Practice Page",
          status: "Active",
          description: "Spot the difference practice",
          details: [
            "Image pair setup",
            "Difference count",
            "Attention training",
          ],
        },
        {
          name: "Memory Matching",
          screen: "memory-match",
          type: "Practice Page",
          status: "Active",
          description: "Practice memory with matching cards",
          details: [
            "Card data",
            "Matching rules",
            "Memory scoring",
          ],
        },
        {
          name: "Read Aloud",
          screen: "read-aloud",
          type: "Practice Page",
          status: "Active",
          description: "Reading practice page",
          details: [
            "Text reading",
            "Voice support",
            "Practice tracking",
          ],
        },
        {
          name: "Timed Challenge",
          screen: "timed-challenge",
          type: "Practice Page",
          status: "Active",
          description: "Time-based challenge practice",
          details: [
            "Timer rules",
            "Task count",
            "Result scoring",
          ],
        },
        {
          name: "Daily Practice Goal",
          screen: "daily-practice-goal",
          type: "Practice Page",
          status: "Active",
          description: "Daily practice goal management page",
          details: [
            "Goal setup",
            "Daily target",
            "Completion check",
          ],
        },
        {
          name: "Reward Challenge",
          screen: "reward-challenge",
          type: "Practice Page",
          status: "Active",
          description: "Reward-based challenge page",
          details: [
            "Reward rules",
            "Challenge setup",
            "Unlock flow",
          ],
        },
        {
          name: "Progress Stars",
          screen: "progress-stars",
          type: "Progress Page",
          status: "Active",
          description: "Stars and badge-based progress tracking",
          details: [
            "Star system",
            "Reward display",
            "Progress summary",
          ],
        },
        {
          name: "Rewards",
          screen: "rewards",
          type: "Reward Page",
          status: "Active",
          description: "Reward display and collection page",
          details: [
            "Reward items",
            "Unlock status",
            "Collected rewards",
          ],
        },
        {
          name: "Progress",
          screen: "progress",
          type: "Progress Page",
          status: "Active",
          description: "Overall practice progress page",
          details: [
            "Progress summary",
            "Statistics",
            "Milestone tracking",
          ],
        },
      ],
    },

    {
      title: "Numbers Module Management",
      icon: "🔢",
      items: [
        {
          name: "Numbers Home",
          screen: "numbers",
          type: "Module Home",
          status: "Active",
          description: "Main numbers module home screen",
          details: [
            "Learning zone",
            "Game zone",
            "Home navigation",
          ],
        },
        {
          name: "Numbers Learning Home",
          screen: "numbers-learning-home",
          type: "Learning Home",
          status: "Active",
          description: "Numbers learning section home",
          details: [
            "Concept page list",
            "Navigation flow",
            "Learning grouping",
          ],
        },
        {
          name: "Numbers Game Home",
          screen: "numbers-game-home",
          type: "Game Home",
          status: "Active",
          description: "Numbers game section home",
          details: [
            "Game list",
            "Navigation flow",
            "Game access",
          ],
        },
        {
          name: "Strawberry Count",
          screen: "strawberry-count",
          type: "Numbers Game",
          status: "Active",
          description: "Counting game activity",
          details: [
            "Concept/game title",
            "Game rules",
            "Score settings",
          ],
        },
        {
          name: "Number Trail",
          screen: "number-trail",
          type: "Numbers Game",
          status: "Active",
          description: "Follow the number trail activity",
          details: [
            "Trail sequence data",
            "Movement logic",
            "Difficulty level",
          ],
        },
        {
          name: "Frog Jump",
          screen: "frog-jump",
          type: "Numbers Game",
          status: "Active",
          description: "Jump through numbers activity",
          details: [
            "Jump logic",
            "Level settings",
            "Number tasks",
          ],
        },
        {
          name: "Missing Number",
          screen: "missing-number",
          type: "Numbers Game",
          status: "Active",
          description: "Find the missing number activity",
          details: [
            "Question bank",
            "Sequence logic",
            "Difficulty setting",
          ],
        },
        {
          name: "Compare Safari",
          screen: "compare-safari",
          type: "Numbers Game",
          status: "Active",
          description: "Compare bigger/smaller numbers activity",
          details: [
            "Comparison rules",
            "Question bank",
            "Score settings",
          ],
        },
        {
          name: "Skip Count",
          screen: "skip-count",
          type: "Numbers Game",
          status: "Active",
          description: "Skip counting learning game",
          details: [
            "Skip patterns",
            "Question set",
            "Age group difficulty",
          ],
        },
        {
          name: "Number Line",
          screen: "number-line",
          type: "Numbers Game",
          status: "Active",
          description: "Number line movement activity",
          details: [
            "Line positions",
            "Movement rules",
            "Feedback settings",
          ],
        },
      ],
    },

    {
      title: "Games Module Management",
      icon: "🎮",
      items: [
        {
          name: "Games Home",
          screen: "games-home",
          type: "Module Home",
          status: "Active",
          description: "Main games module home page",
          details: [
            "Learning zone",
            "Play zone",
            "Home cards",
          ],
        },
        {
          name: "Games Learning Home",
          screen: "games-learning",
          type: "Learning Home",
          status: "Active",
          description: "Learning-oriented games home page",
          details: [
            "Learning game cards",
            "Routing",
            "Section control",
          ],
        },
        {
          name: "Games Play Home",
          screen: "games-play",
          type: "Play Home",
          status: "Active",
          description: "Playable games home page",
          details: [
            "Playable cards",
            "Routing",
            "Game section control",
          ],
        },
        {
          name: "Sound Tap",
          screen: "sound-tap",
          type: "Game Page",
          status: "Active",
          description: "Tap the matching sound game",
          details: [
            "Game instructions",
            "Question/activity bank",
            "Points/rewards",
          ],
        },
        {
          name: "Pattern Copy",
          screen: "pattern-copy",
          type: "Game Page",
          status: "Active",
          description: "Copy the shown pattern game",
          details: [
            "Pattern setup",
            "Level settings",
            "Play status",
          ],
        },
        {
          name: "Find Friend",
          screen: "find-friend",
          type: "Game Page",
          status: "Active",
          description: "Find matching friend/character game",
          details: [
            "Game rules",
            "Matching setup",
            "Points/rewards",
          ],
        },
        {
          name: "Memory Match",
          screen: "memory-match",
          type: "Game Page",
          status: "Active",
          description: "Memory card matching game",
          details: [
            "Card logic",
            "Match rules",
            "Reward settings",
          ],
        },
        {
          name: "Catch Word",
          screen: "catch-word",
          type: "Game Page",
          status: "Active",
          description: "Catch the correct word game",
          details: [
            "Word bank",
            "Game instructions",
            "Scoring system",
          ],
        },
        {
          name: "Fill Bucket",
          screen: "fill-bucket",
          type: "Game Page",
          status: "Active",
          description: "Fill bucket with correct items game",
          details: [
            "Collection logic",
            "Game instructions",
            "Progress score",
          ],
        },
        {
          name: "Letter Blast Game",
          screen: "letter-blast-game",
          type: "Game Page",
          status: "Active",
          description: "Fast-paced letter blast game",
          details: [
            "Question set",
            "Level settings",
            "Reward system",
          ],
        },
        {
          name: "Weather Clothes Game",
          screen: "weather-clothes",
          type: "Game Page",
          status: "Active",
          description: "Match clothes to weather game",
          details: [
            "Question bank",
            "Game instructions",
            "Points and rewards",
          ],
        },
      ],
    },

    {
      title: "Parent Section Management",
      icon: "👨‍👩‍👧",
      items: [
        {
          name: "Parent Dashboard",
          screen: "parent-dashboard",
          type: "Parent Page",
          status: "Active",
          description: "Parent monitoring dashboard for child learning",
          details: [
            "Child learning progress",
            "Performance summary",
            "Parent reports",
            "Reward tracking",
            "Parent settings",
          ],
        },
      ],
    },

    {
      title: "Profile Management",
      icon: "👤",
      items: [
        {
          name: "Profile",
          screen: "profile",
          type: "Profile Page",
          status: "Active",
          description: "User profile settings and identity page",
          details: [
            "Child profile details",
            "Parent profile details",
            "Avatar/profile image",
            "Editable fields",
            "Account settings",
          ],
        },
      ],
    },

    {
      title: "AI Management",
      icon: "🤖",
      items: [
        {
          name: "AI Chat",
          screen: "ai-chat",
          type: "AI Feature",
          status: "Active",
          description: "AI support and chatbot screen",
          details: [
            "AI support screen",
            "Prompt/help topics",
            "Chat availability",
            "Usage tracking",
          ],
        },
        {
          name: "AI Button",
          screen: "ai-button",
          type: "AI Feature",
          status: "Active",
          description: "Floating AI access button",
          details: [
            "Floating button visibility",
            "Button icon",
            "Placement",
            "Open/close behavior",
          ],
        },
      ],
    },

    {
      title: "Admin Management",
      icon: "🧑‍💼",
      items: [
        {
          name: "Admin Dashboard",
          screen: "admin",
          type: "Admin Page",
          status: "Active",
          description: "Main control panel for entire app",
          details: [
            "Admin profile",
            "Permissions",
            "Role access",
            "Content controls",
            "System overview",
          ],
        },
      ],
    },

    {
      title: "Navigation / Router Control",
      icon: "🧭",
      items: [
        {
          name: "Current Screen Tracking",
          screen: "currentScreen",
          type: "Navigation Logic",
          status: "Active",
          description: "Track the current visible screen",
          details: [
            "Current screen tracking",
            "Stored in localStorage",
            "Used in render flow",
          ],
        },
        {
          name: "Last Section Tracking",
          screen: "lastSection",
          type: "Navigation Logic",
          status: "Active",
          description: "Track the last visited major section",
          details: [
            "Letters/practice section tracking",
            "Stored in localStorage",
            "Used for conditional page rendering",
          ],
        },
        {
          name: "Back Navigation Rules",
          screen: "goBack",
          type: "Navigation Logic",
          status: "Active",
          description: "Custom back rules for each module",
          details: [
            "Back routing control",
            "Module return logic",
            "Section-aware navigation",
          ],
        },
        {
          name: "Flow Management",
          screen: "navigate",
          type: "Navigation Logic",
          status: "Active",
          description: "Screen-to-screen navigation control",
          details: [
            "Flow management",
            "Section mapping",
            "Screen state updates",
          ],
        },
        {
          name: "Screen Visibility Control",
          screen: "renderScreen",
          type: "Navigation Logic",
          status: "Active",
          description: "Control which page is rendered",
          details: [
            "Switch-based rendering",
            "Screen state control",
            "Conditional page output",
          ],
        },
      ],
    },

    {
      title: "Settings",
      icon: "⚙️",
      items: [
        {
          name: "General Settings",
          screen: "general-settings",
          type: "Settings",
          status: "Active",
          description: "Core app settings",
          details: [
            "App options",
            "Base controls",
            "General preferences",
          ],
        },
        {
          name: "Theme Settings",
          screen: "theme-settings",
          type: "Settings",
          status: "Active",
          description: "Theme and visual controls",
          details: [
            "Theme setup",
            "Design preferences",
            "Visual customization",
          ],
        },
        {
          name: "Content Settings",
          screen: "content-settings",
          type: "Settings",
          status: "Active",
          description: "Manage displayed content settings",
          details: [
            "Content visibility",
            "Page control",
            "Content management",
          ],
        },
        {
          name: "Access Control",
          screen: "access-control",
          type: "Settings",
          status: "Active",
          description: "Permissions and access restrictions",
          details: [
            "Access levels",
            "Permission rules",
            "Module restrictions",
          ],
        },
        {
          name: "Notification Settings",
          screen: "notification-settings",
          type: "Settings",
          status: "Active",
          description: "Manage system and user notifications",
          details: [
            "Alert settings",
            "Notification control",
            "Reminder setup",
          ],
        },
        {
          name: "Media Upload Settings",
          screen: "media-upload-settings",
          type: "Settings",
          status: "Active",
          description: "Manage media upload options",
          details: [
            "Media controls",
            "Upload handling",
            "Asset management",
          ],
        },
        {
          name: "Backup / Data Settings",
          screen: "backup-data-settings",
          type: "Settings",
          status: "Active",
          description: "Backup and stored data controls",
          details: [
            "Data backup",
            "Storage management",
            "Recovery settings",
          ],
        },
      ],
    },

    {
      title: "Reports & Activity",
      icon: "📈",
      items: [
        {
          name: "User Activity Report",
          screen: "user-activity-report",
          type: "Report",
          status: "Active",
          description: "Shows user activity analytics",
          details: [
            "User activity report",
            "Recent actions",
            "Usage summary",
          ],
        },
        {
          name: "Page Usage Report",
          screen: "page-usage-report",
          type: "Report",
          status: "Active",
          description: "Shows which pages are used most",
          details: [
            "Page usage report",
            "Screen access count",
            "Activity frequency",
          ],
        },
        {
          name: "Learning Progress Report",
          screen: "learning-progress-report",
          type: "Report",
          status: "Active",
          description: "Shows learning progress analytics",
          details: [
            "Learning progress report",
            "Skill tracking",
            "Module completion",
          ],
        },
        {
          name: "Game Usage Report",
          screen: "game-usage-report",
          type: "Report",
          status: "Active",
          description: "Shows game access and usage analytics",
          details: [
            "Game usage report",
            "Play counts",
            "Most used games",
          ],
        },
        {
          name: "Parent Activity Report",
          screen: "parent-activity-report",
          type: "Report",
          status: "Active",
          description: "Shows parent dashboard and monitoring usage",
          details: [
            "Parent activity report",
            "Dashboard visits",
            "Child monitoring summary",
          ],
        },
        {
          name: "AI Usage Report",
          screen: "ai-usage-report",
          type: "Report",
          status: "Active",
          description: "Shows AI feature usage statistics",
          details: [
            "AI usage report",
            "Chat usage count",
            "Feature engagement",
          ],
        },
      ],
    },
  ];

  const totalTrackedItems = useMemo(() => {
    return adminSections.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [adminSections]);

  const currentSection = adminSections.find(
    (section) => section.title === activeSection
  );

  const filteredUsers = users.filter((u) =>
    `${u.name || ""} ${u.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredGames = games.filter((g) =>
    `${g.name || ""} ${g.topic || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredItems =
    currentSection?.items.filter((item) =>
      `${item.name} ${item.screen} ${item.description} ${item.type} ${item.status} ${item.details.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ) || [];

  const renderDashboardOverview = () => (
    <>
      <div className="admin-card-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-value">{users.length}</div>
          <div className="admin-stat-label">Total Users</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🎮</div>
          <div className="admin-stat-value">{games.length}</div>
          <div className="admin-stat-label">Total Games</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🧩</div>
          <div className="admin-stat-value">{adminSections.length}</div>
          <div className="admin-stat-label">Total Modules</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📄</div>
          <div className="admin-stat-value">{totalTrackedItems}</div>
          <div className="admin-stat-label">Tracked Admin Items</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🤖</div>
          <div className="admin-stat-value">2</div>
          <div className="admin-stat-label">AI Features</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📝</div>
          <div className="admin-stat-value">35+</div>
          <div className="admin-stat-label">Practice Pages</div>
        </div>
      </div>

      <div className="admin-double-grid">
        <div className="admin-panel">
          <h3 className="admin-panel-title">⚡ Quick Navigation Cards</h3>
          <div className="admin-quick-grid">
            {adminSections.slice(1, 9).map((section) => (
              <button
                key={section.title}
                className="admin-quick-card"
                onClick={() => {
                  setSearch("");
                  setActiveSection(section.title);
                }}
              >
                <span className="admin-quick-icon">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h3 className="admin-panel-title">🕒 Recent User Activity</h3>
          {users.length === 0 ? (
            <div className="admin-empty-box">No user activity available.</div>
          ) : (
            users.slice(0, 5).map((u) => (
              <div key={u.id} className="admin-activity-item">
                <strong>{u.name || u.email || "User"}</strong>
                <span className="admin-activity-sub">
                  {" "}
                  viewed / used the app
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="admin-panel">
        <h3 className="admin-panel-title">🆕 Recently Added Activities</h3>
        {games.length === 0 ? (
          <div className="admin-empty-box">No recent activities yet.</div>
        ) : (
          games.slice(0, 6).map((g) => (
            <div key={g.id} className="admin-list-row">
              <div>
                <div className="admin-list-title">{g.name}</div>
                <div className="admin-list-sub">Topic: {g.topic}</div>
                <div className="admin-list-sub">Type: {g.type}</div>
              </div>
              <span className="admin-badge">{g.level}</span>
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderGamesManagement = () => (
    <>
      <div className="admin-panel">
        <h3 className="admin-panel-title">➕ Add Game</h3>

        <div className="admin-form-grid">
          <input
            className="admin-input"
            placeholder="Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />

          <input
            className="admin-input"
            placeholder="AI Topic (ex: jungle animals)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <select
            className="admin-input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>

          <select
            className="admin-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="mcq">MCQ</option>
            <option value="sound">Sound</option>
            <option value="pattern">Pattern</option>
          </select>
        </div>

        <button className="admin-primary-btn" onClick={addGame}>
          Add Game ➕
        </button>
      </div>

      <div className="admin-panel">
        <h3 className="admin-panel-title">📚 All Games</h3>

        <input
          className="admin-search-input"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredGames.length === 0 ? (
          <div className="admin-empty-box">No games found.</div>
        ) : (
          filteredGames.map((g) => (
            <div key={g.id} className="admin-list-row">
              <div>
                <div className="admin-list-title">{g.name}</div>
                <div className="admin-list-sub">Topic: {g.topic}</div>
                <div className="admin-list-sub">Type: {g.type}</div>
              </div>
              <span className="admin-badge">{g.level}</span>
            </div>
          ))
        )}
      </div>

      <div className="admin-panel">
        <h3 className="admin-panel-title">🎮 Games Module Details</h3>
        <div className="admin-module-grid">
          {filteredItems.map((item) => (
            <div key={item.name} className="admin-module-card">
              <div className="admin-module-title">{item.name}</div>
              <div className="admin-module-sub">{item.description}</div>

              <div className="admin-detail-line">
                <strong>Screen:</strong> {item.screen}
              </div>
              <div className="admin-detail-line">
                <strong>Type:</strong> {item.type}
              </div>
              <div className="admin-detail-line">
                <strong>Status:</strong> {item.status}
              </div>

              <div className="admin-detail-box">
                {item.details.map((detail, index) => (
                  <div key={index} className="admin-detail-item">
                    • {detail}
                  </div>
                ))}
              </div>

              <div className="admin-action-row">
                <button className="admin-small-btn">View</button>
                <button className="admin-small-btn">Edit</button>
                <button className="admin-small-btn">Status</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAdminUsers = () => (
    <div className="admin-panel">
      <h3 className="admin-panel-title">👥 All Users</h3>

      <input
        className="admin-search-input"
        placeholder="Search users by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <div className="admin-empty-box">No users found.</div>
      ) : (
        filteredUsers.map((u) => (
          <div key={u.id} className="admin-list-row">
            <div>
              <div className="admin-list-title">{u.name || "No Name"}</div>
              <div className="admin-list-sub">{u.email || "No Email"}</div>
            </div>
            <span className="admin-badge">Score: {u.score ?? 0}</span>
          </div>
        ))
      )}
    </div>
  );

  const renderDetailedSection = () => {
    if (!currentSection) return null;

    return (
      <div className="admin-panel">
        <h3 className="admin-panel-title">
          {currentSection.icon} {currentSection.title}
        </h3>

        <input
          className="admin-search-input"
          placeholder="Search this section..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-module-grid">
          {filteredItems.length === 0 ? (
            <div className="admin-empty-box">No items found in this section.</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.name} className="admin-module-card">
                <div className="admin-module-title">{item.name}</div>
                <div className="admin-module-sub">{item.description}</div>

                <div className="admin-detail-line">
                  <strong>Screen:</strong> {item.screen}
                </div>
                <div className="admin-detail-line">
                  <strong>Type:</strong> {item.type}
                </div>
                <div className="admin-detail-line">
                  <strong>Status:</strong> {item.status}
                </div>

                <div className="admin-detail-box">
                  {item.details.map((detail, index) => (
                    <div key={index} className="admin-detail-item">
                      • {detail}
                    </div>
                  ))}
                </div>

                <div className="admin-action-row">
                  <button className="admin-small-btn">View</button>
                  <button className="admin-small-btn">Edit</button>
                  <button className="admin-small-btn">Status</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeSection === "Dashboard Overview") return renderDashboardOverview();
    if (activeSection === "Games Module Management")
      return renderGamesManagement();
    if (activeSection === "Admin Management") return renderAdminUsers();
    return renderDetailedSection();
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-circle">🧑‍💼</div>
          <div>
            <div className="admin-sidebar-title">Admin Panel</div>
            <div className="admin-sidebar-sub">CurioKids Control</div>
          </div>
        </div>

        <button className="admin-back-btn" onClick={goBack}>
          ← Back
        </button>

        <div className="admin-menu-wrap">
          {adminSections.map((section) => (
            <button
              key={section.title}
              onClick={() => {
                setSearch("");
                setActiveSection(section.title);
              }}
              className={`admin-menu-item ${
                activeSection === section.title ? "active" : ""
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">{activeSection}</div>
            <div className="admin-topbar-sub">
              Manage app modules, screens, users and activities
            </div>
          </div>

          <div className="admin-topbar-actions">
            <button
              className="admin-top-btn"
              onClick={() => navigate && navigate("kids-home")}
            >
              🏠 App Home
            </button>
            <button
              className="admin-top-btn"
              onClick={() => navigate && navigate("profile")}
            >
              👤 Profile
            </button>
          </div>
        </div>

        <div className="admin-content">{renderContent()}</div>
      </main>
    </div>
  );
}


