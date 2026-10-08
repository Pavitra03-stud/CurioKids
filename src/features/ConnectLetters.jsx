import { useMemo, useState, useEffect, useRef } from "react";
import "../styles/ConnectLetters.css";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

export default function ConnectLetters({ goBack }) {
  const GAME_ID = "connect-letters";

  const rounds = useMemo(
    () => [
      {
        type: "word",
        image: "🐱",
        title: "Connect the word",
        subtitle: "Tap the letters in the correct order",
        targetWord: "CAT",
        letters: ["T", "C", "A"],
      },
      {
        type: "missing",
        image: "🐶",
        title: "Fill the missing letter",
        subtitle: "Choose the missing letter to complete the word",
        wordPattern: ["D", "", "G"],
        options: ["E", "A", "O"],
        answer: "O",
        completedWord: "DOG",
      },
      {
        type: "match-case",
        image: "🔤",
        title: "Match uppercase and lowercase",
        subtitle: "Tap the matching pairs",
        pairs: [
          ["C", "c"],
          ["A", "a"],
          ["B", "b"],
        ],
      },
      {
        type: "word",
        image: "☀️",
        title: "Connect the word",
        subtitle: "Tap the letters in the correct order",
        targetWord: "SUN",
        letters: ["N", "S", "U"],
      },
      {
        type: "missing",
        image: "🎩",
        title: "Fill the missing letter",
        subtitle: "Choose the missing letter to complete the word",
        wordPattern: ["H", "", "T"],
        options: ["U", "O", "A"],
        answer: "A",
        completedWord: "HAT",
      },
      {
        type: "match-case",
        image: "🔠",
        title: "Match uppercase and lowercase",
        subtitle: "Tap the matching pairs",
        pairs: [
          ["P", "p"],
          ["D", "d"],
          ["M", "m"],
        ],
      },
    ],
    []
  );

  // --------------------------------------------------
  // 🔥 FIREBASE GAME PROGRESS
  // --------------------------------------------------

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    currentIndex: 0,
    score: 0,
    status: "",
    selectedWordLetters: [],
    selectedMissing: "",
    matchedPairs: [],
    tempUpper: null,
  });

  // --------------------------------------------------
  // 🎮 LOCAL STATE
  // --------------------------------------------------

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [status, setStatus] = useState("");

  const [selectedWordLetters, setSelectedWordLetters] =
    useState([]);

  const [selectedMissing, setSelectedMissing] =
    useState("");

  const [matchedPairs, setMatchedPairs] = useState([]);

  const [tempUpper, setTempUpper] = useState(null);

  const [initialized, setInitialized] = useState(false);

  const nextTimerRef = useRef(null);

  // --------------------------------------------------
  // CURRENT ROUND
  // --------------------------------------------------

  const currentRound = rounds[currentIndex];

  const isLastRound =
    currentIndex === rounds.length - 1;

  const finished =
    currentIndex >= rounds.length;

  // Shuffle the two sides independently once per round.
  // The actual uppercase/lowercase pairs stay unchanged.
  const shuffledMatchPairs = useMemo(() => {
    if (currentRound?.type !== "match-case") {
      return { uppercase: [], lowercase: [] };
    }

    const shuffle = (items) => {
      const result = [...items];

      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }

      return result;
    };

    return {
      uppercase: shuffle(currentRound.pairs.map(([upper]) => upper)),
      lowercase: shuffle(currentRound.pairs.map(([, lower]) => lower)),
    };
  }, [currentIndex, currentRound]);

  // --------------------------------------------------
  // 🔄 RESTORE GAME
  // --------------------------------------------------

  useEffect(() => {
    if (progressLoading || initialized) return;

    if (savedState) {
      console.log(
        "🔥 Restoring Connect Letters:",
        savedState
      );

      setCurrentIndex(
        savedState.currentIndex ?? 0
      );

      setScore(savedState.score ?? 0);

      // Status is temporary UI feedback. Never restore "wrong" or "correct"
      // from Firebase because it can lock the current round on reload.
      setStatus("");

      setSelectedWordLetters(
        savedState.selectedWordLetters ?? []
      );

      setSelectedMissing("");

      setMatchedPairs([]);
      setTempUpper(null);
    } else {
      console.log(
        "🆕 Starting new Connect Letters game"
      );

      save({
        currentIndex: 0,
        score: 0,
        status: "",
        selectedWordLetters: [],
        selectedMissing: "",
        matchedPairs: [],
        tempUpper: null,
      });
    }

    setInitialized(true);
  }, [
    progressLoading,
    savedState,
    initialized,
    save,
  ]);

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        window.clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  // --------------------------------------------------
  // 📊 ACTIVITY LOGGER
  // --------------------------------------------------

  const logActivity = async (finalScore) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) return;

      await addDoc(collection(db, "activity"), {
        userId,
        action: "play",
        module: "letters",
        screen: "connect-letters",
        score: finalScore,
        timestamp: new Date(),
      });

      console.log("✅ Connect Letters activity saved");
    } catch (error) {
      console.error(
        "❌ Activity logging error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // 🧹 RESET CURRENT ROUND STATE
  // --------------------------------------------------

  const resetRoundState = () => {
    setStatus("");
    setSelectedWordLetters([]);
    setSelectedMissing("");
    setMatchedPairs([]);
    setTempUpper(null);
  };

  // --------------------------------------------------
  // 💾 SAVE CURRENT STATE
  // --------------------------------------------------

  const saveCurrentState = async (overrides = {}) => {
    await save({
      currentIndex,
      score,
      status,
      selectedWordLetters,
      selectedMissing,
      matchedPairs,
      tempUpper,
      ...overrides,
    });
  };

  // --------------------------------------------------
  // ➡️ NEXT ROUND
  // --------------------------------------------------

  const goToNextRound = (nextIndex, updatedScore) => {
    if (nextIndex >= rounds.length) {
      const finalPercentage =
        (updatedScore / rounds.length) * 100;

      setCurrentIndex(rounds.length);
      setStatus("");

      // Do not block the game UI on Firebase.
      Promise.resolve(finish(finalPercentage, "Connect Letters"))
        .then(() => logActivity(finalPercentage))
        .catch((error) => {
          console.error(
            "❌ Connect Letters finish error:",
            error
          );
        });

      return;
    }

    setCurrentIndex(nextIndex);
    setScore(updatedScore);
    setStatus("");
    setSelectedWordLetters([]);
    setSelectedMissing("");
    setMatchedPairs([]);
    setTempUpper(null);

    // Save in the background so a Firebase delay cannot freeze the game.
    Promise.resolve(
      save({
        currentIndex: nextIndex,
        score: updatedScore,
        status: "",
        selectedWordLetters: [],
        selectedMissing: "",
        matchedPairs: [],
        tempUpper: null,
      })
    ).catch((error) => {
      console.error(
        "❌ Connect Letters progress save error:",
        error
      );
    });
  };

  const scheduleNextRound = (updatedScore) => {
    if (nextTimerRef.current) {
      window.clearTimeout(nextTimerRef.current);
    }

    const nextIndex = currentIndex + 1;

    nextTimerRef.current = window.setTimeout(() => {
      goToNextRound(nextIndex, updatedScore);
    }, 700);
  };

  const scheduleRetry = () => {
    if (nextTimerRef.current) {
      window.clearTimeout(nextTimerRef.current);
    }

    nextTimerRef.current = window.setTimeout(() => {
      setStatus("");
    }, 700);
  };

  // --------------------------------------------------
  // 🔁 RESTART
  // --------------------------------------------------

  const handleRestart = async () => {
    if (nextTimerRef.current) {
      window.clearTimeout(nextTimerRef.current);
    }

    setCurrentIndex(0);
    setScore(0);

    setStatus("");
    setSelectedWordLetters([]);
    setSelectedMissing("");
    setMatchedPairs([]);
    setTempUpper(null);

    await save({
      currentIndex: 0,
      score: 0,
      status: "",
      selectedWordLetters: [],
      selectedMissing: "",
      matchedPairs: [],
      tempUpper: null,
    });
  };

  // --------------------------------------------------
  // 🔤 WORD LETTER CLICK
  // --------------------------------------------------

  const handleWordLetterClick = async (
    letter,
    index
  ) => {
    if (status) return;

    const expectedLetter =
      currentRound.targetWord[
        selectedWordLetters.length
      ];

    // Correct letter
    if (letter === expectedLetter) {
      const updated = [
        ...selectedWordLetters,
        {
          letter,
          index,
        },
      ];

      setSelectedWordLetters(updated);

      // Word completed
      if (
        updated.length ===
        currentRound.targetWord.length
      ) {
        const updatedScore = score + 1;

        setStatus("correct");
        setScore(updatedScore);

        scheduleNextRound(updatedScore);

        Promise.resolve(
          save({
            currentIndex,
            score: updatedScore,
            status: "correct",
            selectedWordLetters: updated,
            selectedMissing,
            matchedPairs,
            tempUpper,
          })
        ).catch((error) => {
          console.error(
            "❌ Connect Letters save error:",
            error
          );
        });
      } else {
        // Save partial word progress
        await save({
          currentIndex,
          score,
          status: "",
          selectedWordLetters: updated,
          selectedMissing,
          matchedPairs,
          tempUpper,
        });
      }
    } else {
      setStatus("wrong");
      scheduleRetry();

      Promise.resolve(
        save({
          currentIndex,
          score,
          status: "wrong",
          selectedWordLetters,
          selectedMissing,
          matchedPairs,
          tempUpper,
        })
      ).catch((error) => {
        console.error(
          "❌ Connect Letters save error:",
          error
        );
      });
    }
  };

  // --------------------------------------------------
  // 🔠 MISSING LETTER
  // --------------------------------------------------

  const handleMissingOptionClick = async (
    option
  ) => {
    if (status) return;

    setSelectedMissing(option);

    if (option === currentRound.answer) {
      const updatedScore = score + 1;

      setStatus("correct");
      setScore(updatedScore);

      scheduleNextRound(updatedScore);

      Promise.resolve(
        save({
          currentIndex,
          score: updatedScore,
          status: "correct",
          selectedWordLetters,
          selectedMissing: option,
          matchedPairs,
          tempUpper,
        })
      ).catch((error) => {
        console.error(
          "❌ Connect Letters save error:",
          error
        );
      });
    } else {
      setStatus("wrong");
      scheduleRetry();

      Promise.resolve(
        save({
          currentIndex,
          score,
          status: "wrong",
          selectedWordLetters,
          selectedMissing: option,
          matchedPairs,
          tempUpper,
        })
      ).catch((error) => {
        console.error(
          "❌ Connect Letters save error:",
          error
        );
      });
    }
  };

  // --------------------------------------------------
  // 🔠 SELECT UPPERCASE
  // --------------------------------------------------

  const handleUpperClick = async (upper) => {
    if (status) return;

    setTempUpper(upper);

    await save({
      currentIndex,
      score,
      status,
      selectedWordLetters,
      selectedMissing,
      matchedPairs,
      tempUpper: upper,
    });
  };

  // --------------------------------------------------
  // 🔡 SELECT LOWERCASE
  // --------------------------------------------------

  const handleLowerClick = async (lower) => {
    if (status || !tempUpper) return;

    const isCorrectPair =
      currentRound.pairs.some(
        ([upper, small]) =>
          upper === tempUpper &&
          small === lower
      );

    const alreadyMatched =
      matchedPairs.some(
        ([upper, small]) =>
          upper === tempUpper ||
          small === lower
      );

    if (alreadyMatched) return;

    // -----------------------------------------------
    // ❌ WRONG PAIR
    // -----------------------------------------------

    if (!isCorrectPair) {
      setStatus("wrong");
      scheduleRetry();

      Promise.resolve(
        save({
          currentIndex,
          score,
          status: "wrong",
          selectedWordLetters,
          selectedMissing,
          matchedPairs,
          tempUpper,
        })
      ).catch((error) => {
        console.error(
          "❌ Connect Letters save error:",
          error
        );
      });

      return;
    }

    // -----------------------------------------------
    // ✅ CORRECT PAIR
    // -----------------------------------------------

    const updatedPairs = [
      ...matchedPairs,
      [tempUpper, lower],
    ];

    setMatchedPairs(updatedPairs);
    setTempUpper(null);

    // All pairs completed
    if (
      updatedPairs.length ===
      currentRound.pairs.length
    ) {
      const updatedScore = score + 1;

      setStatus("correct");
      setScore(updatedScore);

      scheduleNextRound(updatedScore);

      Promise.resolve(
        save({
          currentIndex,
          score: updatedScore,
          status: "correct",
          selectedWordLetters,
          selectedMissing,
          matchedPairs: updatedPairs,
          tempUpper: null,
        })
      ).catch((error) => {
        console.error(
          "❌ Connect Letters save error:",
          error
        );
      });
    } else {
      // Save partial matching progress
      await save({
        currentIndex,
        score,
        status: "",
        selectedWordLetters,
        selectedMissing,
        matchedPairs: updatedPairs,
        tempUpper: null,
      });
    }
  };

  // --------------------------------------------------
  // ⏳ LOADING
  // --------------------------------------------------

  if (progressLoading || !initialized) {
    return (
      <div className="connect-letters-page">
        <header className="connect-letters-topbar">
          {/* <button
            className="connect-letters-back"
            onClick={goBack}
          >
            ←
          </button> */}

          <h1 className="connect-letters-title">
            🔗 Connect Letters
          </h1>
        </header>

        <div className="connect-letters-content">
          <div className="connect-card">
            <h2>Loading your game...</h2>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // 🏆 FINISHED SCREEN
  // --------------------------------------------------

  if (finished) {
    return (
      <div className="connect-letters-page">
        <header className="connect-letters-topbar">
          

          <h1 className="connect-letters-title">
            🔗 Connect Letters
          </h1>
        </header>

        <div className="connect-letters-content">
          <div className="connect-finish-card">
            <div className="connect-finish-emoji">
              🌟
            </div>

            <h2>Great Job!</h2>

            <p>
              You got{" "}
              <span>{score}</span> out of{" "}
              <span>{rounds.length}</span>
            </p>

            <div className="connect-finish-buttons">
              <button
                className="connect-primary-btn"
                onClick={handleRestart}
              >
                Play Again
              </button>

              <button
                className="connect-secondary-btn"
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

  // --------------------------------------------------
  // 🎨 MAIN UI
  // --------------------------------------------------

  return (
    <div className="connect-letters-page">
      <header className="connect-letters-topbar">
        

        <h1 className="connect-letters-title">
          🔗 Connect Letters
        </h1>
      </header>

      <div className="connect-letters-content">
        <div className="connect-top-info">
          <div className="connect-score">
            ⭐ Score: {score}
          </div>

          <div className="connect-progress">
            {currentIndex + 1} / {rounds.length}
          </div>
        </div>

        <div className="connect-card">
          <div className="connect-helper-animals">
            <span>🐻</span>
            <span>🦊</span>
            <span>🐼</span>
          </div>

          <div className="connect-main-image">
            {currentRound.image}
          </div>

          <h2>{currentRound.title}</h2>

          <p className="connect-subtitle">
            {currentRound.subtitle}
          </p>

          {/* -----------------------------------------
              WORD ROUND
          ------------------------------------------ */}

          {currentRound.type === "word" && (
            <div className="connect-word-section">
              <div className="connect-word-row">
                {currentRound.letters.map(
                  (letter, index) => {
                    const picked =
                      selectedWordLetters.some(
                        (item) =>
                          item.index === index
                      );

                    return (
                      <button
                        key={index}
                        className={`connect-letter-btn ${
                          picked ? "picked" : ""
                        }`}
                        onClick={() =>
                          handleWordLetterClick(
                            letter,
                            index
                          )
                        }
                      >
                        {letter}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="connect-answer-preview">
                {currentRound.targetWord
                  .split("")
                  .map((_, index) => (
                    <div
                      key={index}
                      className="preview-box"
                    >
                      {
                        selectedWordLetters[index]
                          ?.letter || ""
                      }
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* -----------------------------------------
              MISSING LETTER ROUND
          ------------------------------------------ */}

          {currentRound.type === "missing" && (
            <div className="connect-missing-section">
              <div className="connect-missing-word">
                {currentRound.wordPattern.map(
                  (letter, index) => (
                    <div
                      key={index}
                      className="missing-box"
                    >
                      {letter === ""
                        ? selectedMissing || "_"
                        : letter}
                    </div>
                  )
                )}
              </div>

              <div className="connect-options-row">
                {currentRound.options.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`connect-option-btn ${
                        selectedMissing === option
                          ? "picked"
                          : ""
                      }`}
                      onClick={() =>
                        handleMissingOptionClick(
                          option
                        )
                      }
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* -----------------------------------------
              MATCH CASE ROUND
          ------------------------------------------ */}

          {currentRound.type === "match-case" && (
            <div className="connect-match-section">
              <div className="match-columns">
                <div className="match-column">
                  <h3>Uppercase</h3>

                  <div className="match-list">
                    {shuffledMatchPairs.uppercase.map(
                      (upper) => {
                        const used =
                          matchedPairs.some(
                            ([u]) => u === upper
                          );

                        return (
                          <button
                            key={upper}
                            className={`match-btn uppercase-btn ${
                              tempUpper === upper
                                ? "active"
                                : ""
                            } ${
                              used
                                ? "matched"
                                : ""
                            }`}
                            onClick={() =>
                              handleUpperClick(
                                upper
                              )
                            }
                          >
                            {upper}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="match-column">
                  <h3>Lowercase</h3>

                  <div className="match-list">
                    {shuffledMatchPairs.lowercase.map(
                      (lower) => {
                        const used =
                          matchedPairs.some(
                            ([, l]) =>
                              l === lower
                          );

                        return (
                          <button
                            key={lower}
                            className={`match-btn lowercase-btn ${
                              used
                                ? "matched"
                                : ""
                            }`}
                            onClick={() =>
                              handleLowerClick(
                                lower
                              )
                            }
                          >
                            {lower}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="matched-preview">
                {matchedPairs.map(
                  ([upper, lower], index) => (
                    <div
                      key={index}
                      className="matched-pill"
                    >
                      {upper} → {lower}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* -----------------------------------------
              FEEDBACK
          ------------------------------------------ */}

          <div className="connect-feedback-area">
            {!status && (
              <p className="connect-hint">
                Tap carefully and complete the activity ✨
              </p>
            )}

            {status === "correct" && (
              <p className="connect-feedback correct-text">
                ✅ Super! You did it correctly
              </p>
            )}

            {status === "wrong" && (
              <p className="connect-feedback wrong-text">
                ❌ Oops! Try the next one carefully
              </p>
            )}
          </div>


        </div>

        <div className="connect-bottom-animals">
          <span>🦁</span>
          <span>🐯</span>
          <span>🐵</span>
        </div>
      </div>
    </div>
  );
}