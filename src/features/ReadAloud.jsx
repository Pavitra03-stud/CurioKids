// import { useState, useEffect, useRef } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// export default function ReadAloud() {

//   const TOTAL_QUESTIONS = 5;

//   const words = [
//     "cat","dog","sun","ball","fish","book","cup","hat","pen","bat"
//   ];

//   const [currentWord, setCurrentWord] = useState("");
//   const [score, setScore] = useState(0);
//   const [questionCount, setQuestionCount] = useState(0);

//   const [message, setMessage] = useState("");
//   const [listening, setListening] = useState(false);

//   const recognitionRef = useRef(null);

//   // 🎤 INIT SPEECH
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.lang = "en-US";
//       recognition.continuous = false;

//       recognition.onresult = (event) => {
//         const spoken = event.results[0][0].transcript.toLowerCase().trim();

//         console.log("User said:", spoken);

//         checkAnswer(spoken);
//       };

//       recognition.onend = () => {
//         setListening(false);
//       };

//       recognitionRef.current = recognition;
//     } else {
//       alert("Speech Recognition not supported in this browser");
//     }
//   }, []);

//   // 🤖 GENERATE WORD
//   const generateWord = () => {
//     const word = words[Math.floor(Math.random() * words.length)];
//     setCurrentWord(word);
//   };

//   useEffect(() => {
//     generateWord();
//   }, []);

//   // 🎯 START LISTENING
//   const startListening = () => {
//     if (recognitionRef.current) {
//       setListening(true);
//       recognitionRef.current.start();
//     }
//   };

//   // 🎯 CHECK ANSWER
//   const checkAnswer = async (spoken) => {

//   if (questionCount >= TOTAL_QUESTIONS) return;

//   const cleanSpoken = spoken.toLowerCase().trim();
//   const correctWord = currentWord.toLowerCase();

//   // ✅ STRICT MATCH
//   const isExact = cleanSpoken === correctWord;

//   // ✅ SMALL TOLERANCE (for speech errors)
//   const isClose =
//     cleanSpoken.startsWith(correctWord) ||
//     correctWord.startsWith(cleanSpoken);

//   const isCorrect = isExact || (cleanSpoken.length > 2 && isClose);

//   const updatedScore = isCorrect ? score + 1 : score;

//   if (isCorrect) {
//     setScore(updatedScore);
//     setMessage("🎉 Correct pronunciation!");
//   } else {
//     setMessage(`❌ You said "${cleanSpoken}"`);
//   }

//   setTimeout(async () => {

//     setMessage("");

//     const next = questionCount + 1;
//     setQuestionCount(next);

//     if (next === TOTAL_QUESTIONS) {

//       await saveScoreToFirestore(updatedScore);

//       alert(`🎯 Completed!\nScore: ${updatedScore}/5`);

//       setScore(0);
//       setQuestionCount(0);
//       generateWord();

//     } else {
//       generateWord();
//     }

//   }, 1200);
// };
//   // ☁️ SAVE
//   const saveScoreToFirestore = async (finalScore) => {
//     try {
//       const userEmail = "demo_user";

//       const userRef = doc(db, "users", userEmail);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

//       await addDoc(gameResultsRef, {
//         score: finalScore,
//         totalQuestions: TOTAL_QUESTIONS,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: "ReadAloud_AI"
//       });

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="blend-container">

//       <h2>🎤 AI Read Aloud</h2>

//       <div className="game-info">
//         Question {questionCount + 1}/5 | Score: {score}
//       </div>

//       <h1 style={{ fontSize: "40px" }}>{currentWord}</h1>

//       <h3>Click and read aloud</h3>

//       <button onClick={startListening}>
//         {listening ? "🎧 Listening..." : "🎤 Start Speaking"}
//       </button>

//       <p>{message}</p>

//     </div>
//   );
// }





import { useState, useEffect, useRef } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// 🎮 Game Progress
import useGameProgress from "../hooks/useGameProgress";

export default function ReadAloud() {
  const TOTAL_QUESTIONS = 5;

  const words = [
    "cat",
    "dog",
    "sun",
    "ball",
    "fish",
    "book",
    "cup",
    "hat",
    "pen",
    "bat",
  ];

  const GAME_ID = "read-aloud";

  const INITIAL_STATE = {
    currentWord: "",
    score: 0,
    questionCount: 0,
    message: "",
    completed: false,
  };

  // =========================================================
  // 🎮 FIREBASE GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const answeringRef = useRef(false);

  // =========================================================
  // 🎤 INIT SPEECH RECOGNITION
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "⚠️ Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const spoken =
        event.results[0][0].transcript
          .toLowerCase()
          .trim();

      console.log("🎤 User said:", spoken);

      checkAnswer(spoken);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "❌ Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [currentWord, score, questionCount]);

  // =========================================================
  // 🎲 GENERATE WORD
  // =========================================================

  const createRandomWord = () => {
    return words[
      Math.floor(Math.random() * words.length)
    ];
  };

  // =========================================================
  // 🔥 RESTORE / START GAME
  // =========================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log("🎤 Read Aloud saved state:", savedState);

    if (
      savedState &&
      savedState.currentWord
    ) {
      console.log("✅ Resuming Read Aloud");

      setCurrentWord(savedState.currentWord);
      setScore(savedState.score || 0);
      setQuestionCount(
        savedState.questionCount || 0
      );
      setMessage(savedState.message || "");

      return;
    }

    // 🆕 New game
    const newWord = createRandomWord();

    setCurrentWord(newWord);
    setScore(0);
    setQuestionCount(0);
    setMessage("");

    save({
      currentWord: newWord,
      score: 0,
      questionCount: 0,
      message: "",
      completed: false,
    });
  }, [progressLoading, GAME_ID]);

  // =========================================================
  // 🎤 START LISTENING
  // =========================================================

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech Recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (listening || answeringRef.current) return;

    try {
      answeringRef.current = false;

      setListening(true);

      recognitionRef.current.start();
    } catch (error) {
      console.error(
        "❌ Could not start speech recognition:",
        error
      );

      setListening(false);
    }
  };

  // =========================================================
  // 🎯 CHECK ANSWER
  // =========================================================

  const checkAnswer = (spoken) => {
    if (answeringRef.current) return;

    if (questionCount >= TOTAL_QUESTIONS) return;

    answeringRef.current = true;

    const cleanSpoken = spoken
      .toLowerCase()
      .trim();

    const correctWord =
      currentWord.toLowerCase();

    // ✅ Exact match
    const isExact =
      cleanSpoken === correctWord;

    // ✅ Small tolerance for speech recognition
    const isClose =
      cleanSpoken.startsWith(correctWord) ||
      correctWord.startsWith(cleanSpoken);

    const isCorrect =
      isExact ||
      (cleanSpoken.length > 2 && isClose);

    const updatedScore = isCorrect
      ? score + 1
      : score;

    const nextQuestion =
      questionCount + 1;

    const feedback = isCorrect
      ? "🎉 Correct pronunciation!"
      : `❌ You said "${cleanSpoken}"`;

    setMessage(feedback);

    // 💾 Save answer immediately
    save({
      currentWord,
      score: updatedScore,
      questionCount: nextQuestion,
      message: feedback,
      completed: false,
    });

    setTimeout(async () => {
      setMessage("");

      // =====================================================
      // 🏁 FINAL QUESTION
      // =====================================================

      if (nextQuestion === TOTAL_QUESTIONS) {
        const finalPercentage =
          (updatedScore / TOTAL_QUESTIONS) * 100;

        console.log(
          "🏁 Read Aloud completed:",
          updatedScore,
          finalPercentage
        );

        // ⭐ Main progress system
        await finish(
          finalPercentage,
          "AI Read Aloud"
        );

        // 📊 Save detailed result
        await saveScoreToFirestore(
          updatedScore
        );

        // 📊 Activity
        await logActivity(
          finalPercentage
        );

        alert(
          `🎯 Completed!\nScore: ${updatedScore}/${TOTAL_QUESTIONS}`
        );

        // ===================================================
        // 🔄 START NEW ROUND
        // ===================================================

        const newWord = createRandomWord();

        setCurrentWord(newWord);
        setScore(0);
        setQuestionCount(0);
        setMessage("");

        answeringRef.current = false;

        // Save new round
        await save({
          currentWord: newWord,
          score: 0,
          questionCount: 0,
          message: "",
          completed: false,
        });

        return;
      }

      // =====================================================
      // ➡️ NEXT QUESTION
      // =====================================================

      const newWord = createRandomWord();

      setCurrentWord(newWord);
      setScore(updatedScore);
      setQuestionCount(nextQuestion);
      setMessage("");

      answeringRef.current = false;

      // 💾 Save exact next question
      await save({
        currentWord: newWord,
        score: updatedScore,
        questionCount: nextQuestion,
        message: "",
        completed: false,
      });
    }, 1200);
  };

  // =========================================================
  // ☁️ SAVE GAME RESULT
  // =========================================================

  const saveScoreToFirestore = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        console.warn(
          "⚠️ No Firebase userId found"
        );
        return;
      }

      const userRef = doc(
        db,
        "users",
        userId
      );

      const gameResultsRef =
        collection(
          userRef,
          "game_results"
        );

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "ReadAloud_AI",
      });

      console.log(
        "✅ Read Aloud result saved"
      );
    } catch (error) {
      console.error(
        "❌ Firestore error:",
        error
      );
    }
  };

  // =========================================================
  // 📊 ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "reading",
          screen: "read-aloud",
          score: finalScore,
          timestamp: Timestamp.now(),
        }
      );

      console.log(
        "✅ Read Aloud activity saved"
      );
    } catch (error) {
      console.error(
        "❌ Activity logging error:",
        error
      );
    }
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (progressLoading) {
    return (
      <div className="blend-container">
        <h2>🎤 AI Read Aloud</h2>
        <p>
          ⏳ Loading your progress...
        </p>
      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="blend-container">
      <h2>🎤 AI Read Aloud</h2>

      <div className="game-info">
        Question{" "}
        {Math.min(
          questionCount + 1,
          TOTAL_QUESTIONS
        )}
        /{TOTAL_QUESTIONS} | Score: {score}
      </div>

      <h1 style={{ fontSize: "40px" }}>
        {currentWord}
      </h1>

      <h3>
        Click and read aloud
      </h3>

      <button
        onClick={startListening}
        disabled={listening}
      >
        {listening
          ? "🎧 Listening..."
          : "🎤 Start Speaking"}
      </button>

      <p>{message}</p>
    </div>
  );
}