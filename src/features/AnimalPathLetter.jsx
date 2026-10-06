// import { useEffect, useMemo, useRef, useState } from "react";
// import "../styles/AnimalPathLetters.css";
// import BackIcon from "../components/BackIcon";

// const LETTERS = [
//   { letter: "A", animal: "Ant", emoji: "🐜", sound: "A says /a/" },
//   { letter: "B", animal: "Bear", emoji: "🐻", sound: "B says /b/" },
//   { letter: "C", animal: "Cat", emoji: "🐱", sound: "C says /c/" },
//   { letter: "D", animal: "Dog", emoji: "🐶", sound: "D says /d/" },
//   { letter: "E", animal: "Elephant", emoji: "🐘", sound: "E says /e/" },
//   { letter: "F", animal: "Fish", emoji: "🐟", sound: "F says /f/" },
//   { letter: "G", animal: "Goat", emoji: "🐐", sound: "G says /g/" },
//   { letter: "H", animal: "Horse", emoji: "🐴", sound: "H says /h/" },
//   { letter: "I", animal: "Iguana", emoji: "🦎", sound: "I says /i/" },
//   { letter: "J", animal: "Jellyfish", emoji: "🪼", sound: "J says /j/" },
//   { letter: "K", animal: "Koala", emoji: "🐨", sound: "K says /k/" },
//   { letter: "L", animal: "Lion", emoji: "🦁", sound: "L says /l/" },
//   { letter: "M", animal: "Monkey", emoji: "🐵", sound: "M says /m/" },
//   { letter: "N", animal: "Nest bird", emoji: "🐦", sound: "N says /n/" },
//   { letter: "O", animal: "Owl", emoji: "🦉", sound: "O says /o/" },
//   { letter: "P", animal: "Panda", emoji: "🐼", sound: "P says /p/" },
//   { letter: "Q", animal: "Quail", emoji: "🐤", sound: "Q says /q/" },
//   { letter: "R", animal: "Rabbit", emoji: "🐰", sound: "R says /r/" },
//   { letter: "S", animal: "Snake", emoji: "🐍", sound: "S says /s/" },
//   { letter: "T", animal: "Tiger", emoji: "🐯", sound: "T says /t/" },
//   { letter: "U", animal: "Urial", emoji: "🐏", sound: "U says /u/" },
//   { letter: "V", animal: "Vulture", emoji: "🦅", sound: "V says /v/" },
//   { letter: "W", animal: "Whale", emoji: "🐋", sound: "W says /w/" },
//   { letter: "X", animal: "Fox", emoji: "🦊", sound: "X sounds like /ks/" },
//   { letter: "Y", animal: "Yak", emoji: "🐂", sound: "Y says /y/" },
//   { letter: "Z", animal: "Zebra", emoji: "🦓", sound: "Z says /z/" },
// ];

// const createOptions = (correctLetter) => {
//   const others = LETTERS.filter((item) => item.letter !== correctLetter);
//   const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 5);
//   return [...shuffled, LETTERS.find((item) => item.letter === correctLetter)].sort(
//     () => Math.random() - 0.5
//   );
// };

// export default function AnimalPathLetters({ goBack }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [message, setMessage] = useState("Tap the correct letter for the animal path!");
//   const [score, setScore] = useState(0);
//   const [selectedLetter, setSelectedLetter] = useState("");
//   const [shakeTile, setShakeTile] = useState("");
//   const [pathStep, setPathStep] = useState(0);
//   const [showFinish, setShowFinish] = useState(false);

//   const utteranceRef = useRef(null);
//   const currentItem = LETTERS[currentIndex];

//   const pathDots = useMemo(() => {
//     return Array.from({ length: 6 }, (_, i) => ({
//       id: i + 1,
//       active: i < pathStep,
//     }));
//   }, [pathStep]);

//   const options = useMemo(() => createOptions(currentItem.letter), [currentItem]);

//   useEffect(() => {
//     setSelectedLetter("");
//     setShakeTile("");
//     setPathStep(0);
//     setShowFinish(false);
//     setMessage("Tap the correct letter for the animal path!");
//   }, [currentIndex]);

//   const speakText = (text) => {
//     if ("speechSynthesis" in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.9;
//       utterance.pitch = 1.1;
//       utteranceRef.current = utterance;
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const handleSpeakAnimal = () => {
//     speakText(`${currentItem.animal}. ${currentItem.letter}. ${currentItem.sound}`);
//   };

//   const handleTileClick = (item) => {
//     setSelectedLetter(item.letter);

//     if (item.letter === currentItem.letter) {
//       setMessage(`Super! ${currentItem.animal} starts with ${currentItem.letter}`);
//       setScore((prev) => prev + 1);
//       speakText(`Great job! ${currentItem.animal} starts with ${currentItem.letter}`);
//       setPathStep(6);
//       setShowFinish(true);
//     } else {
//       setMessage(`Oops! Try again. ${currentItem.animal} does not start with ${item.letter}`);
//       setShakeTile(item.letter);
//       speakText("Try again");
//       setTimeout(() => {
//         setShakeTile("");
//       }, 400);
//     }
//   };

//   const handleStartPath = () => {
//     if (!showFinish) return;
//     speakText(`Follow the animal path for ${currentItem.letter}`);
//   };

//   const handleNext = () => {
//     if (currentIndex < LETTERS.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       setCurrentIndex(0);
//       setScore(0);
//       setMessage("Yay! You finished all animal letters. Let’s play again!");
//     }
//   };

//   return (
//     <div className="animal-path-page">
//       <header className="animal-path-header">
//         <BackIcon goBack={goBack} />
//         <h1>Animal Path Letters</h1>
//       </header>

//       <div className="animal-path-content">
//         <div className="animal-top-row">
//           <div className="animal-big-card">
//             <div className="animal-card-letter">{currentItem.letter}</div>
//             <div className="animal-card-emoji">{currentItem.emoji}</div>
//             <div className="animal-card-name">{currentItem.animal}</div>
//             <div className="animal-card-sound">{currentItem.sound}</div>
//           </div>

//           <div className="animal-grid-panel">
//             <div className="animal-grid-title">Choose the correct letter</div>
//             <div className="animal-grid">
//               {options.map((item) => (
//                 <button
//                   key={item.letter}
//                   className={`animal-grid-tile ${
//                     selectedLetter === item.letter ? "selected" : ""
//                   } ${shakeTile === item.letter ? "shake" : ""}`}
//                   onClick={() => handleTileClick(item)}
//                 >
//                   <span className="animal-tile-main">{item.letter}</span>
//                   <span className="animal-tile-sub">{item.animal}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="animal-bottom-row">
//           <div className="animal-path-area">
//             <div className="animal-path-title">Follow the animal path</div>

//             <div className="animal-track-wrap">
//               <div className="animal-track-line"></div>

//               {pathDots.map((dot) => (
//                 <div
//                   key={dot.id}
//                   className={`animal-track-dot ${dot.active ? "active" : ""}`}
//                 >
//                   {dot.id}
//                 </div>
//               ))}

//               <div className={`animal-friend ${showFinish ? "move-finish" : ""}`}>
//                 {currentItem.emoji}
//               </div>
//             </div>

//             <div className="animal-drop-zones">
//               <button
//                 className={`animal-drop-box ${showFinish ? "done" : ""}`}
//                 onClick={handleStartPath}
//               >
//                 {showFinish
//                   ? `Path complete for ${currentItem.letter}`
//                   : "Choose correct letter first"}
//               </button>
//             </div>

//             <div className="animal-info-row">
//               <div className="animal-message">{message}</div>
//               <div className="animal-score">Score: {score}</div>
//             </div>

//             <div className="animal-actions">
//               <button className="animal-action-btn speak" onClick={handleSpeakAnimal}>
//                 🔊 Hear Sound
//               </button>
//               <button
//                 className="animal-action-btn next"
//                 onClick={handleNext}
//                 disabled={!showFinish}
//               >
//                 Next
//               </button>
//             </div>

//             <div className="animal-progress">
//               Letter {currentIndex + 1} / {LETTERS.length}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useRef, useState } from "react";
import "../styles/AnimalPathLetters.css";
import BackIcon from "../components/BackIcon";
import useGameProgress from "../hooks/useGameProgress";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

const GAME_ID = "animal-path-letters";

const LETTERS = [
  { letter: "A", animal: "Ant", emoji: "🐜", sound: "A says /a/" },
  { letter: "B", animal: "Bear", emoji: "🐻", sound: "B says /b/" },
  { letter: "C", animal: "Cat", emoji: "🐱", sound: "C says /c/" },
  { letter: "D", animal: "Dog", emoji: "🐶", sound: "D says /d/" },
  { letter: "E", animal: "Elephant", emoji: "🐘", sound: "E says /e/" },
  { letter: "F", animal: "Fish", emoji: "🐟", sound: "F says /f/" },
  { letter: "G", animal: "Goat", emoji: "🐐", sound: "G says /g/" },
  { letter: "H", animal: "Horse", emoji: "🐴", sound: "H says /h/" },
  { letter: "I", animal: "Iguana", emoji: "🦎", sound: "I says /i/" },
  { letter: "J", animal: "Jellyfish", emoji: "🪼", sound: "J says /j/" },
  { letter: "K", animal: "Koala", emoji: "🐨", sound: "K says /k/" },
  { letter: "L", animal: "Lion", emoji: "🦁", sound: "L says /l/" },
  { letter: "M", animal: "Monkey", emoji: "🐵", sound: "M says /m/" },
  { letter: "N", animal: "Nest bird", emoji: "🐦", sound: "N says /n/" },
  { letter: "O", animal: "Owl", emoji: "🦉", sound: "O says /o/" },
  { letter: "P", animal: "Panda", emoji: "🐼", sound: "P says /p/" },
  { letter: "Q", animal: "Quail", emoji: "🐤", sound: "Q says /q/" },
  { letter: "R", animal: "Rabbit", emoji: "🐰", sound: "R says /r/" },
  { letter: "S", animal: "Snake", emoji: "🐍", sound: "S says /s/" },
  { letter: "T", animal: "Tiger", emoji: "🐯", sound: "T says /t/" },
  { letter: "U", animal: "Urial", emoji: "🐏", sound: "U says /u/" },
  { letter: "V", animal: "Vulture", emoji: "🦅", sound: "V says /v/" },
  { letter: "W", animal: "Whale", emoji: "🐋", sound: "W says /w/" },
  { letter: "X", animal: "Fox", emoji: "🦊", sound: "X sounds like /ks/" },
  { letter: "Y", animal: "Yak", emoji: "🐂", sound: "Y says /y/" },
  { letter: "Z", animal: "Zebra", emoji: "🦓", sound: "Z says /z/" },
];

const createOptions = (correctLetter) => {
  const others = LETTERS.filter(
    (item) => item.letter !== correctLetter
  );

  const shuffled = [...others]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  const correct = LETTERS.find(
    (item) => item.letter === correctLetter
  );

  return [...shuffled, correct].sort(
    () => Math.random() - 0.5
  );
};

export default function AnimalPathLetters({ goBack }) {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    currentIndex: 0,
    message: "Tap the correct letter for the animal path!",
    score: 0,
    selectedLetter: "",
    shakeTile: "",
    pathStep: 0,
    showFinish: false,
    options: [],
    completed: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState(
    "Tap the correct letter for the animal path!"
  );
  const [score, setScore] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [shakeTile, setShakeTile] = useState("");
  const [pathStep, setPathStep] = useState(0);
  const [showFinish, setShowFinish] = useState(false);
  const [options, setOptions] = useState([]);

  const [gameCompleted, setGameCompleted] = useState(false);

  const utteranceRef = useRef(null);

  const currentItem = LETTERS[currentIndex];

  /* 🔄 RESTORE FIREBASE PROGRESS */
  useEffect(() => {
    if (progressLoading || !savedState) return;

    console.log(
      "🐾 Animal Path Letters saved state:",
      savedState
    );

    setCurrentIndex(savedState.currentIndex ?? 0);

    setMessage(
      savedState.message ??
        "Tap the correct letter for the animal path!"
    );

    setScore(savedState.score ?? 0);

    setSelectedLetter(
      savedState.selectedLetter ?? ""
    );

    setShakeTile(savedState.shakeTile ?? "");

    setPathStep(savedState.pathStep ?? 0);

    setShowFinish(savedState.showFinish ?? false);

    setGameCompleted(
      Boolean(savedState.completed)
    );

    if (
      savedState.options &&
      savedState.options.length > 0
    ) {
      setOptions(savedState.options);
    } else {
      setOptions(
        createOptions(
          LETTERS[savedState.currentIndex ?? 0].letter
        )
      );
    }
  }, [progressLoading, savedState]);

  /* 🗣️ SPEAK */
  const speakText = (text) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
  };

  /* 🧹 STOP SPEECH ON UNMOUNT */
  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* 🎤 HEAR ANIMAL */
  const handleSpeakAnimal = () => {
    speakText(
      `${currentItem.animal}. ${currentItem.letter}. ${currentItem.sound}`
    );
  };

  /* 🎯 ANSWER */
  const handleTileClick = async (item) => {
    // Don't allow another answer after completing this letter
    if (showFinish || gameCompleted) return;

    setSelectedLetter(item.letter);

    if (item.letter === currentItem.letter) {
      const newScore = score + 1;

      const newMessage = `Super! ${currentItem.animal} starts with ${currentItem.letter}`;

      setMessage(newMessage);
      setScore(newScore);
      setPathStep(6);
      setShowFinish(true);

      speakText(
        `Great job! ${currentItem.animal} starts with ${currentItem.letter}`
      );

      await save({
        currentIndex,
        message: newMessage,
        score: newScore,
        selectedLetter: item.letter,
        shakeTile: "",
        pathStep: 6,
        showFinish: true,
        options,
        completed: false,
      });
    } else {
      const newMessage = `Oops! Try again. ${currentItem.animal} does not start with ${item.letter}`;

      setMessage(newMessage);
      setShakeTile(item.letter);

      speakText("Try again");

      await save({
        currentIndex,
        message: newMessage,
        score,
        selectedLetter: item.letter,
        shakeTile: item.letter,
        pathStep,
        showFinish: false,
        options,
        completed: false,
      });

      setTimeout(() => {
        setShakeTile("");
      }, 400);
    }
  };

  /* 🐾 START PATH */
  const handleStartPath = () => {
    if (!showFinish) return;

    speakText(
      `Follow the animal path for ${currentItem.letter}`
    );
  };

  /* 📝 ACTIVITY LOGGER */
  const logActivity = async (finalScore) => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "letters",
        screen: "animal-path-letters",
        score: finalScore,
        timestamp: new Date(),
      });

      console.log(
        "✅ Animal Path Letters activity logged"
      );
    } catch (err) {
      console.error(
        "❌ Animal Path Letters activity error:",
        err
      );
    }
  };

  /* ➡️ NEXT LETTER */
  const handleNext = async () => {
    if (!showFinish || gameCompleted) return;

    if (currentIndex < LETTERS.length - 1) {
      const newIndex = currentIndex + 1;

      const newOptions = createOptions(
        LETTERS[newIndex].letter
      );

      setCurrentIndex(newIndex);
      setMessage(
        "Tap the correct letter for the animal path!"
      );
      setSelectedLetter("");
      setShakeTile("");
      setPathStep(0);
      setShowFinish(false);
      setOptions(newOptions);

      await save({
        currentIndex: newIndex,
        message:
          "Tap the correct letter for the animal path!",
        score,
        selectedLetter: "",
        shakeTile: "",
        pathStep: 0,
        showFinish: false,
        options: newOptions,
        completed: false,
      });
    } else {
      /* 🏁 FINAL LETTER COMPLETED */

      const finalScore = score;

      const percentage = Math.round(
        (finalScore / LETTERS.length) * 100
      );

      setGameCompleted(true);

      const finalMessage =
        `Yay! You finished all animal letters! ` +
        `Score: ${finalScore}/${LETTERS.length}`;

      setMessage(finalMessage);

      try {
        await finish(
          percentage,
          "Animal Path Letters"
        );

        await logActivity(percentage);

        console.log(
          "🏆 Animal Path Letters completed:",
          percentage
        );
      } catch (err) {
        console.error(
          "❌ Failed to complete Animal Path Letters:",
          err
        );
      }
    }
  };

  /* ⏳ LOADING */
  if (progressLoading) {
    return (
      <div className="animal-path-page">
        <header className="animal-path-header">
          <BackIcon goBack={goBack} />
          <h1>Animal Path Letters</h1>
        </header>

        <div className="animal-path-content">
          <div className="animal-path-area">
            <div className="animal-message">
              🐾 Loading your progress...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pathDots = Array.from(
    { length: 6 },
    (_, i) => ({
      id: i + 1,
      active: i < pathStep,
    })
  );

  return (
    <div className="animal-path-page">
      <header className="animal-path-header">
        <BackIcon goBack={goBack} />

        <h1>Animal Path Letters</h1>
      </header>

      <div className="animal-path-content">
        <div className="animal-top-row">
          <div className="animal-big-card">
            <div className="animal-card-letter">
              {currentItem.letter}
            </div>

            <div className="animal-card-emoji">
              {currentItem.emoji}
            </div>

            <div className="animal-card-name">
              {currentItem.animal}
            </div>

            <div className="animal-card-sound">
              {currentItem.sound}
            </div>
          </div>

          <div className="animal-grid-panel">
            <div className="animal-grid-title">
              Choose the correct letter
            </div>

            <div className="animal-grid">
              {options.map((item) => (
                <button
                  key={item.letter}
                  className={`animal-grid-tile ${
                    selectedLetter === item.letter
                      ? "selected"
                      : ""
                  } ${
                    shakeTile === item.letter
                      ? "shake"
                      : ""
                  }`}
                  onClick={() =>
                    handleTileClick(item)
                  }
                  disabled={
                    showFinish || gameCompleted
                  }
                >
                  <span className="animal-tile-main">
                    {item.letter}
                  </span>

                  <span className="animal-tile-sub">
                    {item.animal}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="animal-bottom-row">
          <div className="animal-path-area">
            <div className="animal-path-title">
              Follow the animal path
            </div>

            <div className="animal-track-wrap">
              <div className="animal-track-line"></div>

              {pathDots.map((dot) => (
                <div
                  key={dot.id}
                  className={`animal-track-dot ${
                    dot.active ? "active" : ""
                  }`}
                >
                  {dot.id}
                </div>
              ))}

              <div
                className={`animal-friend ${
                  showFinish ? "move-finish" : ""
                }`}
              >
                {currentItem.emoji}
              </div>
            </div>

            <div className="animal-drop-zones">
              <button
                className={`animal-drop-box ${
                  showFinish ? "done" : ""
                }`}
                onClick={handleStartPath}
              >
                {showFinish
                  ? `Path complete for ${currentItem.letter}`
                  : "Choose correct letter first"}
              </button>
            </div>

            <div className="animal-info-row">
              <div className="animal-message">
                {message}
              </div>

              <div className="animal-score">
                Score: {score}
              </div>
            </div>

            <div className="animal-actions">
              <button
                className="animal-action-btn speak"
                onClick={handleSpeakAnimal}
              >
                🔊 Hear Sound
              </button>

              <button
                className="animal-action-btn next"
                onClick={handleNext}
                disabled={
                  !showFinish || gameCompleted
                }
              >
                {currentIndex === LETTERS.length - 1
                  ? "Finish 🎉"
                  : "Next"}
              </button>
            </div>

            <div className="animal-progress">
              Letter {currentIndex + 1} /{" "}
              {LETTERS.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}