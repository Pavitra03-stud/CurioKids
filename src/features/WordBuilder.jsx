// import { useMemo, useState } from "react";
// import "../styles/WordBuilder.css";

// export default function WordBuilder({ goBack }) {
//   const rounds = useMemo(
//     () => [
//       { image: "🐱", word: "CAT", letters: ["T", "C", "A"] },
//       { image: "🐶", word: "DOG", letters: ["G", "D", "O"] },
//       { image: "☀️", word: "SUN", letters: ["N", "S", "U"] },
//       { image: "🎩", word: "HAT", letters: ["T", "H", "A"] },
//       { image: "🐟", word: "FISH", letters: ["S", "F", "H", "I"] },
//       { image: "🍎", word: "APPLE", letters: ["P", "A", "L", "E", "P"] },
//     ],
//     []
//   );

//   const [index, setIndex] = useState(0);
//   const [selected, setSelected] = useState([]);
//   const [status, setStatus] = useState("");
//   const [score, setScore] = useState(0);

//   const current = rounds[index];
//   const finished = index >= rounds.length;
//   const isLastRound = index === rounds.length - 1;

//   const speak = (text) => {
//     window.speechSynthesis.cancel();
//     const msg = new SpeechSynthesisUtterance(text);
//     msg.rate = 0.8;
//     msg.pitch = 1;
//     window.speechSynthesis.speak(msg);
//   };

//   const handleLetterClick = (letter, i) => {
//     if (status) return;

//     const expected = current.word[selected.length];

//     if (letter === expected) {
//       const updated = [...selected, { letter, i }];
//       setSelected(updated);

//       if (updated.length === current.word.length) {
//         setStatus("correct");
//         setScore((prev) => prev + 1);
//         speak(current.word);
//       }
//     } else {
//       setStatus("wrong");
//     }
//   };

//   const handleNext = () => {
//     if (isLastRound) {
//       setIndex(rounds.length);
//       return;
//     }

//     setIndex((prev) => prev + 1);
//     setSelected([]);
//     setStatus("");
//   };

//   const handleRestart = () => {
//     setIndex(0);
//     setSelected([]);
//     setStatus("");
//     setScore(0);
//   };

//   if (finished) {
//     return (
//       <div className="word-builder-page">
//         <header className="word-builder-topbar">
//           <button className="word-builder-back" onClick={goBack}>
//             ←
//           </button>
//           <h1 className="word-builder-title">🧩 Word Builder</h1>
//         </header>

//         <div className="word-builder-content">
//           <div className="word-finish-card">
//             <div className="word-finish-emoji">🌟</div>
//             <h2>Great Job!</h2>
//             <p>
//               You got <span>{score}</span> out of <span>{rounds.length}</span>
//             </p>

//             <div className="word-finish-buttons">
//               <button className="word-primary-btn" onClick={handleRestart}>
//                 Play Again
//               </button>
//               <button className="word-secondary-btn" onClick={goBack}>
//                 Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const usedIndexes = selected.map((item) => item.i);

//   return (
//     <div className="word-builder-page">
//       <header className="word-builder-topbar">
//         <button className="word-builder-back" onClick={goBack}>
//           ←
//         </button>
//         <h1 className="word-builder-title">🧩 Word Builder</h1>
//       </header>

//       <div className="word-builder-content">
//         <div className="word-top-info">
//           <div className="word-score">⭐ Score: {score}</div>
//           <div className="word-progress">
//             {index + 1} / {rounds.length}
//           </div>
//         </div>

//         <div className="word-card">
//           <div className="word-helper-animals">
//             <span>🐻</span>
//             <span>🦊</span>
//             <span>🐼</span>
//           </div>

//           <div className="word-main-image">{current.image}</div>

//           <button className="hear-word-btn" onClick={() => speak(current.word)}>
//             🔊 Hear Word
//           </button>

//           <h2>Build the word</h2>
//           <p className="word-subtitle">Tap the letters in the correct order</p>

//           <div className="word-answer-preview">
//             {current.word.split("").map((_, i) => (
//               <div key={i} className="word-preview-box">
//                 {selected[i]?.letter || ""}
//               </div>
//             ))}
//           </div>

//           <div className="word-letters-grid">
//             {current.letters.map((letter, i) => {
//               const used = usedIndexes.includes(i);

//               return (
//                 <button
//                   key={i}
//                   className={`word-letter-btn ${used ? "used" : ""}`}
//                   onClick={() => handleLetterClick(letter, i)}
//                   disabled={used || !!status}
//                 >
//                   {letter}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="word-feedback-area">
//             {!status && (
//               <p className="word-hint">Tap carefully and complete the word ✨</p>
//             )}

//             {status === "correct" && (
//               <p className="word-feedback correct-text">
//                 ✅ Super! You built the word correctly
//               </p>
//             )}

//             {status === "wrong" && (
//               <p className="word-feedback wrong-text">
//                 ❌ Oops! Try the next word carefully
//               </p>
//             )}
//           </div>

//           {status && (
//             <button className="word-next-btn" onClick={handleNext}>
//               {isLastRound ? "See Result" : "Next"}
//             </button>
//           )}
//         </div>

//         <div className="word-bottom-animals">
//           <span>🦁</span>
//           <span>🐯</span>
//           <span>🐵</span>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import "../styles/WordBuilder.css";

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "word-builder";

export default function WordBuilder({ goBack }) {
  const rounds = useMemo(
    () => [
      {
        image: "🐱",
        word: "CAT",
        letters: ["T", "C", "A"],
      },
      {
        image: "🐶",
        word: "DOG",
        letters: ["G", "D", "O"],
      },
      {
        image: "☀️",
        word: "SUN",
        letters: ["N", "S", "U"],
      },
      {
        image: "🎩",
        word: "HAT",
        letters: ["T", "H", "A"],
      },
      {
        image: "🐟",
        word: "FISH",
        letters: ["S", "F", "H", "I"],
      },
      {
        image: "🍎",
        word: "APPLE",
        letters: ["P", "A", "L", "E", "P"],
      },
    ],
    []
  );

  // =====================================================
  // FIREBASE PROGRESS
  // =====================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);

  // =====================================================
  // STATES
  // =====================================================

  const [index, setIndex] = useState(0);

  const [selected, setSelected] =
    useState([]);

  const [status, setStatus] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [locked, setLocked] =
    useState(false);

  // =====================================================
  // CURRENT ROUND
  // =====================================================

  const current = rounds[index];

  const isLastRound =
    index === rounds.length - 1;

  // =====================================================
  // SPEECH
  // =====================================================

  const speak = (text) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const msg =
      new SpeechSynthesisUtterance(
        text
      );

    msg.rate = 0.8;
    msg.pitch = 1;

    window.speechSynthesis.speak(msg);
  };

  // =====================================================
  // RESTORE PROGRESS
  // =====================================================

  useEffect(() => {
    if (progressLoading) return;

    console.log(
      "🧩 Word Builder saved state:",
      savedState
    );

    if (
      savedState &&
      typeof savedState.index ===
        "number" &&
      Array.isArray(
        savedState.selected
      )
    ) {
      console.log(
        "✅ Resuming Word Builder"
      );

      setIndex(
        savedState.index
      );

      setSelected(
        savedState.selected
      );

      setStatus(
        savedState.status || ""
      );

      setScore(
        savedState.score || 0
      );

      setFinished(
        savedState.finished || false
      );

      setLocked(false);

      return;
    }

    console.log(
      "🆕 Starting Word Builder"
    );

    setIndex(0);
    setSelected([]);
    setStatus("");
    setScore(0);
    setFinished(false);
    setLocked(false);

    save({
      index: 0,
      selected: [],
      status: "",
      score: 0,
      finished: false,
    });
  }, [progressLoading, GAME_ID]);

  // =====================================================
  // LETTER CLICK
  // =====================================================

  const handleLetterClick = (
    letter,
    letterIndex
  ) => {
    if (
      locked ||
      status ||
      finished ||
      !current
    ) {
      return;
    }

    const expected =
      current.word[
        selected.length
      ];

    // ❌ Wrong letter
    if (letter !== expected) {
      setStatus("wrong");
      setLocked(true);

      save({
        index,
        selected,
        status: "wrong",
        score,
        finished: false,
      });

      return;
    }

    // ✅ Correct letter
    const updated = [
      ...selected,
      {
        letter,
        i: letterIndex,
      },
    ];

    setSelected(updated);

    // ===================================================
    // WORD COMPLETED
    // ===================================================

    if (
      updated.length ===
      current.word.length
    ) {
      const updatedScore =
        score + 1;

      setStatus("correct");
      setScore(updatedScore);
      setLocked(true);

      speak(current.word);

      save({
        index,
        selected: updated,
        status: "correct",
        score: updatedScore,
        finished: false,
      });

      return;
    }

    // ===================================================
    // PARTIAL WORD
    // ===================================================

    save({
      index,
      selected: updated,
      status: "",
      score,
      finished: false,
    });
  };

  // =====================================================
  // NEXT ROUND
  // =====================================================

  const handleNext = async () => {
    if (!status || locked === false) {
      return;
    }

    // ===================================================
    // FINAL ROUND
    // ===================================================

    if (isLastRound) {
      const percentage =
        (score /
          rounds.length) *
        100;

      /*
       * Save completion state first.
       */
      await save({
        index,
        selected,
        status,
        score,
        finished: true,
      });

      /*
       * Save individual result.
       */
      await saveScoreToFirestore(
        score
      );

      /*
       * Update global stars/history.
       */
      await finish(
        percentage,
        "Word Builder"
      );

      setFinished(true);
      setLocked(false);

      return;
    }

    // ===================================================
    // NEXT WORD
    // ===================================================

    const nextIndex =
      index + 1;

    setIndex(nextIndex);
    setSelected([]);
    setStatus("");
    setLocked(false);

    await save({
      index: nextIndex,
      selected: [],
      status: "",
      score,
      finished: false,
    });
  };

  // =====================================================
  // SAVE RESULT
  // =====================================================

  const saveScoreToFirestore =
    async (finalScore) => {
      try {
        const userId =
          localStorage.getItem(
            "userId"
          );

        if (!userId) {
          console.warn(
            "❌ No Firebase user ID found"
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
          (finalScore /
            rounds.length) *
          100;

        await addDoc(
          gameResultsRef,
          {
            score: finalScore,
            totalQuestions:
              rounds.length,
            accuracy:
              accuracy.toFixed(2),
            createdAt:
              Timestamp.now(),
            game: "Word Builder",
          }
        );

        console.log(
          "✅ Word Builder result saved"
        );
      } catch (error) {
        console.error(
          "❌ Error saving Word Builder:",
          error
        );
      }
    };

  // =====================================================
  // RESTART
  // =====================================================

  const handleRestart = async () => {
    const firstRound = rounds[0];

    setIndex(0);
    setSelected([]);
    setStatus("");
    setScore(0);
    setFinished(false);
    setLocked(false);

    await save({
      index: 0,
      selected: [],
      status: "",
      score: 0,
      finished: false,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (progressLoading) {
    return (
      <div className="word-builder-page">

        <header className="word-builder-topbar">

          

          <h1 className="word-builder-title">
            🧩 Word Builder
          </h1>

        </header>

        <div className="word-builder-content">

          <div className="word-finish-card">
            <div className="word-finish-emoji">
              🌱
            </div>

            <h2>
              Loading your progress...
            </h2>
          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // FINISH SCREEN
  // =====================================================

  if (finished) {
    const percentage =
      (score /
        rounds.length) *
      100;

    return (
      <div className="word-builder-page">

        <header className="word-builder-topbar">

         

          <h1 className="word-builder-title">
            🧩 Word Builder
          </h1>

        </header>

        <div className="word-builder-content">

          <div className="word-finish-card">

            <div className="word-finish-emoji">
              🌟
            </div>

            <h2>
              Great Job!
            </h2>

            <p>
              You got{" "}
              <span>{score}</span>{" "}
              out of{" "}
              <span>
                {rounds.length}
              </span>
            </p>

            <p>
              Accuracy:{" "}
              <strong>
                {percentage.toFixed(0)}%
              </strong>
            </p>

            <div className="word-finish-buttons">

              <button
                className="word-primary-btn"
                onClick={
                  handleRestart
                }
              >
                Play Again
              </button>

              <button
                className="word-secondary-btn"
                onClick={goBack}
              >
                Back
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // USED LETTERS
  // =====================================================

  const usedIndexes =
    selected.map(
      (item) => item.i
    );

  // =====================================================
  // GAME UI
  // =====================================================

  return (
    <div className="word-builder-page">

      <header className="word-builder-topbar">

        
        <h1 className="word-builder-title">
          🧩 Word Builder
        </h1>

      </header>

      <div className="word-builder-content">

        {/* TOP INFO */}

        <div className="word-top-info">

          <div className="word-score">
            ⭐ Score: {score}
          </div>

          <div className="word-progress">
            {index + 1} /{" "}
            {rounds.length}
          </div>

        </div>

        {/* MAIN CARD */}

        <div className="word-card">

          <div className="word-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="word-main-image">
            {current.image}
          </div>

          <button
            className="hear-word-btn"
            onClick={() =>
              speak(current.word)
            }
          >
            🔊 Hear Word
          </button>

          <h2>
            Build the word
          </h2>

          <p className="word-subtitle">
            Tap the letters in the
            correct order
          </p>

          {/* ANSWER PREVIEW */}

          <div className="word-answer-preview">

            {current.word
              .split("")
              .map(
                (_, i) => (
                  <div
                    key={i}
                    className="word-preview-box"
                  >
                    {selected[i]
                      ?.letter || ""}
                  </div>
                )
              )}

          </div>

          {/* LETTERS */}

          <div className="word-letters-grid">

            {current.letters.map(
              (letter, i) => {

                const used =
                  usedIndexes.includes(
                    i
                  );

                return (
                  <button
                    key={i}
                    className={`word-letter-btn ${
                      used
                        ? "used"
                        : ""
                    }`}
                    onClick={() =>
                      handleLetterClick(
                        letter,
                        i
                      )
                    }
                    disabled={
                      used ||
                      !!status ||
                      locked
                    }
                  >
                    {letter}
                  </button>
                );
              }
            )}

          </div>

          {/* FEEDBACK */}

          <div className="word-feedback-area">

            {!status && (
              <p className="word-hint">
                Tap carefully and
                complete the word ✨
              </p>
            )}

            {status ===
              "correct" && (
              <p className="word-feedback correct-text">
                ✅ Super! You built
                the word correctly
              </p>
            )}

            {status ===
              "wrong" && (
              <p className="word-feedback wrong-text">
                ❌ Oops! Try the next
                word carefully
              </p>
            )}

          </div>

          {/* NEXT */}

          {status && (
            <button
              className="word-next-btn"
              onClick={
                handleNext
              }
            >
              {isLastRound
                ? "See Result"
                : "Next"}
            </button>
          )}

        </div>

        {/* BOTTOM ANIMALS */}

        <div className="word-bottom-animals">

          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>

        </div>

      </div>

    </div>
  );
}