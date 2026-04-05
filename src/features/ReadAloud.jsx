import { useState, useEffect, useRef } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

export default function ReadAloud() {

  const TOTAL_QUESTIONS = 5;

  const words = [
    "cat","dog","sun","ball","fish","book","cup","hat","pen","bat"
  ];

  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // 🎤 INIT SPEECH
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase().trim();

        console.log("User said:", spoken);

        checkAnswer(spoken);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech Recognition not supported in this browser");
    }
  }, []);

  // 🤖 GENERATE WORD
  const generateWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(word);
  };

  useEffect(() => {
    generateWord();
  }, []);

  // 🎯 START LISTENING
  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  // 🎯 CHECK ANSWER
  const checkAnswer = async (spoken) => {

  if (questionCount >= TOTAL_QUESTIONS) return;

  const cleanSpoken = spoken.toLowerCase().trim();
  const correctWord = currentWord.toLowerCase();

  // ✅ STRICT MATCH
  const isExact = cleanSpoken === correctWord;

  // ✅ SMALL TOLERANCE (for speech errors)
  const isClose =
    cleanSpoken.startsWith(correctWord) ||
    correctWord.startsWith(cleanSpoken);

  const isCorrect = isExact || (cleanSpoken.length > 2 && isClose);

  const updatedScore = isCorrect ? score + 1 : score;

  if (isCorrect) {
    setScore(updatedScore);
    setMessage("🎉 Correct pronunciation!");
  } else {
    setMessage(`❌ You said "${cleanSpoken}"`);
  }

  setTimeout(async () => {

    setMessage("");

    const next = questionCount + 1;
    setQuestionCount(next);

    if (next === TOTAL_QUESTIONS) {

      await saveScoreToFirestore(updatedScore);

      alert(`🎯 Completed!\nScore: ${updatedScore}/5`);

      setScore(0);
      setQuestionCount(0);
      generateWord();

    } else {
      generateWord();
    }

  }, 1200);
};
  // ☁️ SAVE
  const saveScoreToFirestore = async (finalScore) => {
    try {
      const userEmail = "demo_user";

      const userRef = doc(db, "users", userEmail);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (finalScore / TOTAL_QUESTIONS) * 100;

      await addDoc(gameResultsRef, {
        score: finalScore,
        totalQuestions: TOTAL_QUESTIONS,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: "ReadAloud_AI"
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="blend-container">

      <h2>🎤 AI Read Aloud</h2>

      <div className="game-info">
        Question {questionCount + 1}/5 | Score: {score}
      </div>

      <h1 style={{ fontSize: "40px" }}>{currentWord}</h1>

      <h3>Click and read aloud</h3>

      <button onClick={startListening}>
        {listening ? "🎧 Listening..." : "🎤 Start Speaking"}
      </button>

      <p>{message}</p>

    </div>
  );
}