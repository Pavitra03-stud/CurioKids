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
//       <div className="wb-page">
//         <header className="wb-topbar">
//           <button className="wb-back" onClick={goBack}>
//             ←
//           </button>
//           <h1 className="wb-title">🧩 Word Builder</h1>
//         </header>

//         <div className="wb-content">
//           <div className="wb-finish-card">
//             <div className="wb-finish-emoji">🌟</div>
//             <h2>Great Job!</h2>
//             <p>
//               You got <span>{score}</span> out of <span>{rounds.length}</span>
//             </p>

//             <div className="wb-finish-buttons">
//               <button className="wb-primary-btn" onClick={handleRestart}>
//                 Play Again
//               </button>
//               <button className="wb-secondary-btn" onClick={goBack}>
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
//     <div className="wb-page">
//       <header className="wb-topbar">
//         <button className="wb-back" onClick={goBack}>
//           ←
//         </button>
//         <h1 className="wb-title">🧩 Word Builder</h1>
//       </header>

//       <div className="wb-content">
//         <div className="wb-top-info">
//           <div className="wb-score">⭐ Score: {score}</div>
//           <div className="wb-progress">
//             {index + 1} / {rounds.length}
//           </div>
//         </div>

//         <div className="wb-card">
//           <div className="wb-helper-animals">
//             <span>🐻</span>
//             <span>🦊</span>
//             <span>🐼</span>
//           </div>

//           <div className="wb-main-image">{current.image}</div>

//           <button className="wb-hear-word-btn" onClick={() => speak(current.word)}>
//             🔊 Hear Word
//           </button>

//           <h2>Build the word</h2>
//           <p className="wb-subtitle">Tap the letters in the correct order</p>

//           <div className="wb-answer-preview">
//             {current.word.split("").map((_, i) => (
//               <div key={i} className="wb-preview-box">
//                 {selected[i]?.letter || ""}
//               </div>
//             ))}
//           </div>

//           <div className="wb-letters-grid">
//             {(current.letters || current.word.split("")).map((letter, i) => {
//               const used = usedIndexes.includes(i);

//               return (
//                 <button
//                   key={i}
//                   className={`wb-letter-btn ${used ? "used" : ""}`}
//                   onClick={() => handleLetterClick(letter, i)}
//                   disabled={used || !!status}
//                 >
//                   {letter}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="wb-feedback-area">
//             {!status && (
//               <p className="wb-hint">Tap carefully and complete the word ✨</p>
//             )}

//             {status === "correct" && (
//               <p className="wb-feedback wb-correct-text">
//                 ✅ Super! You built the word correctly
//               </p>
//             )}

//             {status === "wrong" && (
//               <p className="wb-feedback wb-wrong-text">
//                 ❌ Oops! Try the next word carefully
//               </p>
//             )}
//           </div>

//           {status && (
//             <button className="wb-next-btn" onClick={handleNext}>
//               {isLastRound ? "See Result" : "Next"}
//             </button>
//           )}
//         </div>

//         <div className="wb-bottom-animals">
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

    console.log("🧩 Word Builder saved state:", savedState);

    if (
      savedState &&
      typeof savedState.index === "number" &&
      Array.isArray(savedState.selected)
    ) {
      console.log("✅ Resuming Word Builder");

      setIndex(savedState.index);
      setSelected(savedState.selected);
      setStatus(savedState.status || "");
      setScore(savedState.score || 0);
      setFinished(savedState.finished || false);

      // If the browser was refreshed after answering, continue automatically.
      // This prevents a saved "correct" or "wrong" state from getting stuck.
      if (!savedState.finished && savedState.status) {
        setLocked(true);

        const delay =
          savedState.status === "correct" ? 700 : 900;

        const timer = setTimeout(() => {
          if (savedState.index >= rounds.length - 1) {
            setFinished(true);
            setLocked(false);
            return;
          }

          const nextIndex = savedState.index + 1;

          setIndex(nextIndex);
          setSelected([]);
          setStatus("");
          setLocked(false);

          Promise.resolve(
            save({
              index: nextIndex,
              selected: [],
              status: "",
              score: savedState.score || 0,
              finished: false,
            })
          ).catch((error) => {
            console.error("❌ Error saving next Word Builder round:", error);
          });
        }, delay);

        return () => clearTimeout(timer);
      }

      setLocked(false);
      return;
    }

    console.log("🆕 Starting Word Builder");

    setIndex(0);
    setSelected([]);
    setStatus("");
    setScore(0);
    setFinished(false);
    setLocked(false);

    Promise.resolve(
      save({
        index: 0,
        selected: [],
        status: "",
        score: 0,
        finished: false,
      })
    ).catch((error) => {
      console.error("❌ Error saving initial Word Builder state:", error);
    });
  }, [progressLoading]);

  // =====================================================
  // AUTOMATICALLY MOVE TO THE NEXT ROUND
  // =====================================================

  const advanceToNextRound = (
    finalScore,
    finalStatus,
    finalSelected
  ) => {
    // FINAL ROUND
    if (isLastRound) {
      const percentage =
        (finalScore / rounds.length) * 100;

      // Update the UI immediately. Firebase must never block the game.
      setFinished(true);
      setLocked(false);

      Promise.resolve(
        save({
          index,
          selected: finalSelected,
          status: finalStatus,
          score: finalScore,
          finished: true,
        })
      ).catch((error) => {
        console.error("❌ Error saving final Word Builder state:", error);
      });

      Promise.resolve(saveScoreToFirestore(finalScore)).catch((error) => {
        console.error("❌ Error saving final Word Builder score:", error);
      });

      Promise.resolve(
        finish(percentage, "Word Builder")
      ).catch((error) => {
        console.error("❌ Error finishing Word Builder:", error);
      });

      return;
    }

    // Start the timer BEFORE any Firebase operation.
    // This guarantees that a slow/hanging save can never freeze the game.
    const delay = finalStatus === "correct" ? 700 : 900;

    setTimeout(() => {
      const nextIndex = index + 1;

      setIndex(nextIndex);
      setSelected([]);
      setStatus("");
      setLocked(false);

      Promise.resolve(
        save({
          index: nextIndex,
          selected: [],
          status: "",
          score: finalScore,
          finished: false,
        })
      ).catch((error) => {
        console.error("❌ Error saving next Word Builder round:", error);
      });
    }, delay);
  };

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
      current.word[selected.length];

    // ❌ Wrong letter
    if (letter !== expected) {
      setStatus("wrong");
      setLocked(true);

      // Save in the background. Do NOT wait for Firebase before advancing.
      Promise.resolve(
        save({
          index,
          selected,
          status: "wrong",
          score,
          finished: false,
        })
      ).catch((error) => {
        console.error("❌ Error saving wrong Word Builder answer:", error);
      });

      advanceToNextRound(
        score,
        "wrong",
        selected
      );

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

    // Partial word
    if (
      updated.length !== current.word.length
    ) {
      Promise.resolve(
        save({
          index,
          selected: updated,
          status: "",
          score,
          finished: false,
        })
      ).catch((error) => {
        console.error("❌ Error saving Word Builder progress:", error);
      });

      return;
    }

    // ✅ WORD COMPLETED
    const updatedScore = score + 1;

    setStatus("correct");
    setScore(updatedScore);
    setLocked(true);

    speak(current.word);

    // Save in the background. The next round starts independently.
    Promise.resolve(
      save({
        index,
        selected: updated,
        status: "correct",
        score: updatedScore,
        finished: false,
      })
    ).catch((error) => {
      console.error("❌ Error saving completed Word Builder round:", error);
    });

    advanceToNextRound(
      updatedScore,
      "correct",
      updated
    );
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
      <div className="wb-page">

        <header className="wb-topbar">

          

          <h1 className="wb-title">
            🧩 Word Builder
          </h1>

        </header>

        <div className="wb-content">

          <div className="wb-finish-card">
            <div className="wb-finish-emoji">
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
      <div className="wb-page">

        <header className="wb-topbar">

         

          <h1 className="wb-title">
            🧩 Word Builder
          </h1>

        </header>

        <div className="wb-content">

          <div className="wb-finish-card">

            <div className="wb-finish-emoji">
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

            <div className="wb-finish-buttons">

              <button
                className="wb-primary-btn"
                onClick={
                  handleRestart
                }
              >
                Play Again
              </button>

              <button
                className="wb-secondary-btn"
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
    <div className="wb-page">

      <header className="wb-topbar">

        
        <h1 className="wb-title">
          🧩 Word Builder
        </h1>

      </header>

      <div className="wb-content">

        {/* TOP INFO */}

        <div className="wb-top-info">

          <div className="wb-score">
            ⭐ Score: {score}
          </div>

          <div className="wb-progress">
            {index + 1} /{" "}
            {rounds.length}
          </div>

        </div>

        {/* MAIN CARD */}

        <div className="wb-card">

          <div className="wb-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="wb-main-image">
            {current.image}
          </div>

          <button
            className="wb-hear-word-btn"
            onClick={() =>
              speak(current.word)
            }
          >
            🔊 Hear Word
          </button>

          <h2>
            Build the word
          </h2>

          <p className="wb-subtitle">
            Tap the letters in the
            correct order
          </p>

          {/* ANSWER PREVIEW */}

          <div className="wb-answer-preview">

            {current.word
              .split("")
              .map(
                (_, i) => (
                  <div
                    key={i}
                    className="wb-preview-box"
                  >
                    {selected[i]
                      ?.letter || ""}
                  </div>
                )
              )}

          </div>

          {/* LETTERS */}

          <div className="wb-letters-grid">

            {(Array.isArray(current.letters) && current.letters.length
              ? current.letters
              : current.word.split("")).map(
              (letter, i) => {

                const used =
                  usedIndexes.includes(i);

                return (
                  <button
                    type="button"
                    key={`${letter}-${i}`}
                    className={`wb-letter-btn ${
                      used ? "used" : ""
                    }`}
                    onClick={() =>
                      handleLetterClick(letter, i)
                    }
                    disabled={
                      used ||
                      !!status ||
                      locked
                    }
                  >
                    <span className="word-letter-text">
                      {letter}
                    </span>
                  </button>
                );
              }
            )}

          </div>

          {/* FEEDBACK */}

          <div className="wb-feedback-area">

            {!status && (
              <p className="wb-hint">
                Tap carefully and
                complete the word ✨
              </p>
            )}

            {status ===
              "correct" && (
              <p className="wb-feedback wb-correct-text">
                ✅ Super! You built
                the word correctly
              </p>
            )}

            {status ===
              "wrong" && (
              <p className="wb-feedback wb-wrong-text">
                ❌ Oops! Try the next
                word carefully
              </p>
            )}

          </div>


        </div>

        {/* BOTTOM ANIMALS */}

        <div className="wb-bottom-animals">

          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>

        </div>

      </div>

    </div>
  );
}