import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "../styles/NumberMatchAnimals.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "number-match-animals";

/* =========================================================
   LEVELS
========================================================= */

const levels = [
  {
    id: 1,
    title: "Easy",
    pairCount: 4,
    maxNumber: 5,
  },
  {
    id: 2,
    title: "Medium",
    pairCount: 6,
    maxNumber: 8,
  },
  {
    id: 3,
    title: "Hard",
    pairCount: 8,
    maxNumber: 10,
  },
];

/* =========================================================
   ANIMALS
========================================================= */

const animalPool = [
  "🐶",
  "🐻",
  "🐟",
  "🐢",
  "🐱",
  "🦋",
  "🐼",
  "🦊",
  "🐰",
  "🐦",
];

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  selectedLevelId: 1,
  numberCards: [],
  animalCards: [],
  selectedNumber: null,
  matchedIds: [],
  message:
    "Choose a number, then find the matching animals.",
  score: 0,
  completed: false,
};

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {
  const result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

/* =========================================================
   GENERATE ROUND
========================================================= */

function generateRound(level) {
  const numbers = shuffleArray(
    Array.from(
      {
        length: level.maxNumber,
      },
      (_, index) => index + 1
    )
  ).slice(
    0,
    level.pairCount
  );

  const animals = shuffleArray(
    animalPool
  ).slice(
    0,
    level.pairCount
  );

  const pairs = numbers.map(
    (number, index) => ({
      id: `${level.id}-${Date.now()}-${index}`,
      number,
      animal: animals[index],
    })
  );

  /* -----------------------------------------
     Shuffle numbers
  ----------------------------------------- */

  const numberCards =
    shuffleArray(pairs);

  /* -----------------------------------------
     Shuffle animals separately
  ----------------------------------------- */

  let animalCards =
    shuffleArray(pairs);

  /*
   * Prevent correct pairs from accidentally
   * appearing at the same row position.
   */
  let samePosition =
    animalCards.some(
      (animal, index) =>
        animal.id ===
        numberCards[index].id
    );

  let attempts = 0;

  while (
    samePosition &&
    attempts < 30
  ) {
    animalCards =
      shuffleArray(pairs);

    samePosition =
      animalCards.some(
        (animal, index) =>
          animal.id ===
          numberCards[index].id
      );

    attempts += 1;
  }

  /* -----------------------------------------
     Fallback
  ----------------------------------------- */

  if (
    samePosition &&
    level.pairCount > 1
  ) {
    [
      animalCards[0],
      animalCards[1],
    ] = [
      animalCards[1],
      animalCards[0],
    ];
  }

  return {
    numberCards,
    animalCards,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function NumberMatchAnimals() {
  /* =======================================================
     FIREBASE
  ======================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =======================================================
     STATE
  ======================================================= */

  const [
    selectedLevel,
    setSelectedLevel,
  ] = useState(levels[0]);

  const [
    numberCards,
    setNumberCards,
  ] = useState([]);

  const [
    animalCards,
    setAnimalCards,
  ] = useState([]);

  const [
    selectedNumber,
    setSelectedNumber,
  ] = useState(null);

  const [
    matchedIds,
    setMatchedIds,
  ] = useState([]);

  const [
    message,
    setMessage,
  ] = useState(
    "Choose a number, then find the matching animals."
  );

  const [
    score,
    setScore,
  ] = useState(0);

  const [
    completed,
    setCompleted,
  ] = useState(false);

  const [
    restored,
    setRestored,
  ] = useState(false);

  /* =======================================================
     POPUP
  ======================================================= */

  const [
    showCompletionPopup,
    setShowCompletionPopup,
  ] = useState(false);

  /* =======================================================
     MATCH ANIMATION
  ======================================================= */

  const [
    connection,
    setConnection,
  ] = useState(null);

  const [
    animatingMatch,
    setAnimatingMatch,
  ] = useState(null);

  /* =======================================================
     REFS
  ======================================================= */

  const boardRef =
    useRef(null);

  const numberRefs =
    useRef({});

  const animalRefs =
    useRef({});

  /* =======================================================
     RESTORE
  ======================================================= */

  useEffect(() => {
    if (
      progressLoading ||
      restored
    ) {
      return;
    }

    if (
      savedState &&
      Array.isArray(
        savedState.numberCards
      ) &&
      savedState.numberCards.length > 0
    ) {
      const savedLevel =
        levels.find(
          (level) =>
            level.id ===
            Number(
              savedState.selectedLevelId
            )
        ) || levels[0];

      setSelectedLevel(
        savedLevel
      );

      setNumberCards(
        savedState.numberCards
      );

      setAnimalCards(
        savedState.animalCards || []
      );

      setSelectedNumber(
        savedState.selectedNumber ||
          null
      );

      setMatchedIds(
        savedState.matchedIds || []
      );

      setMessage(
        savedState.message ||
          "Choose a number, then find the matching animals."
      );

      setScore(
        Number(savedState.score) || 0
      );

      setCompleted(
        Boolean(
          savedState.completed
        )
      );
    } else {
      const round =
        generateRound(
          levels[0]
        );

      setSelectedLevel(
        levels[0]
      );

      setNumberCards(
        round.numberCards
      );

      setAnimalCards(
        round.animalCards
      );
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =======================================================
     SAVE
  ======================================================= */

  const saveGame = async (
    overrides = {}
  ) => {
    await save({
      selectedLevelId:
        selectedLevel.id,

      numberCards,

      animalCards,

      selectedNumber,

      matchedIds,

      message,

      score,

      completed,

      ...overrides,
    });
  };

  /* =======================================================
     CREATE CONNECTION
  ======================================================= */

  const createConnection =
    useCallback((id) => {
      const board =
        boardRef.current;

      const numberElement =
        numberRefs.current[id];

      const animalElement =
        animalRefs.current[id];

      if (
        !board ||
        !numberElement ||
        !animalElement
      ) {
        return;
      }

      const boardRect =
        board.getBoundingClientRect();

      const numberRect =
        numberElement.getBoundingClientRect();

      const animalRect =
        animalElement.getBoundingClientRect();

      setConnection({
        start: {
          x:
            numberRect.right -
            boardRect.left,

          y:
            numberRect.top -
            boardRect.top +
            numberRect.height / 2,
        },

        end: {
          x:
            animalRect.left -
            boardRect.left,

          y:
            animalRect.top -
            boardRect.top +
            animalRect.height / 2,
        },
      });
    }, []);

  /* =======================================================
     NEW ROUND
  ======================================================= */

  const startNewRound =
    async (
      level = selectedLevel
    ) => {
      const round =
        generateRound(level);

      const newMessage =
        "Choose a number, then find the matching animals.";

      setSelectedLevel(level);

      setNumberCards(
        round.numberCards
      );

      setAnimalCards(
        round.animalCards
      );

      setSelectedNumber(null);

      setMatchedIds([]);

      setMessage(newMessage);

      setScore(0);

      setCompleted(false);

      setShowCompletionPopup(
        false
      );

      setConnection(null);

      setAnimatingMatch(null);

      await save({
        selectedLevelId:
          level.id,

        numberCards:
          round.numberCards,

        animalCards:
          round.animalCards,

        selectedNumber: null,

        matchedIds: [],

        message: newMessage,

        score: 0,

        completed: false,
      });
    };

  /* =======================================================
     LEVEL
  ======================================================= */

  const handleLevelChange =
    async (level) => {
      await startNewRound(
        level
      );
    };

  /* =======================================================
     NUMBER CLICK
  ======================================================= */

  const handleNumberClick =
    async (item) => {
      if (
        completed ||
        matchedIds.includes(
          item.id
        )
      ) {
        return;
      }

      setSelectedNumber(
        item
      );

      const newMessage =
        `Find the group with ${item.number} ${
          item.number === 1
            ? "animal"
            : "animals"
        }.`;

      setMessage(
        newMessage
      );

      await saveGame({
        selectedNumber:
          item,

        message:
          newMessage,
      });
    };

  /* =======================================================
     ANIMAL CLICK
  ======================================================= */

  const handleAnimalClick =
    async (item) => {
      if (
        completed ||
        matchedIds.includes(
          item.id
        )
      ) {
        return;
      }

      if (!selectedNumber) {
        setMessage(
          "First choose a number!"
        );

        return;
      }

      /* ===================================================
         CORRECT
      =================================================== */

      if (
        selectedNumber.id ===
        item.id
      ) {
        const updatedMatchedIds =
          [
            ...matchedIds,
            item.id,
          ];

        const updatedScore =
          score + 1;

        const gameFinished =
          updatedMatchedIds.length ===
          numberCards.length;

        const newMessage =
          gameFinished
            ? "🎉 Amazing! You matched everything!"
            : "✨ Perfect match!";

        /*
         * Wait for the matched class
         * to appear, then calculate
         * the exact positions.
         */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            createConnection(
              item.id
            );
          });
        });

        setAnimatingMatch(
          item.id
        );

        setMatchedIds(
          updatedMatchedIds
        );

        setScore(
          updatedScore
        );

        setSelectedNumber(
          null
        );

        setMessage(
          newMessage
        );

        await save({
          selectedLevel:
            selectedLevel.id,

          selectedLevelId:
            selectedLevel.id,

          numberCards,

          animalCards,

          selectedNumber: null,

          matchedIds:
            updatedMatchedIds,

          message:
            newMessage,

          score:
            updatedScore,

          completed:
            gameFinished,
        });

        /* ===============================================
           FINISHED
        ================================================ */

        if (gameFinished) {
          setCompleted(true);

          setTimeout(() => {
            setConnection(null);

            setAnimatingMatch(
              null
            );

            setShowCompletionPopup(
              true
            );
          }, 1000);

          void finish(
            100,
            "Number Match Animals"
          );

          return;
        }

        /* ===============================================
           NORMAL MATCH
        ================================================ */

        setTimeout(() => {
          setConnection(null);

          setAnimatingMatch(
            null
          );
        }, 900);

        return;
      }

      /* ===================================================
         WRONG
      =================================================== */

      const wrongMessage =
        "❌ Not this group. Try again!";

      setMessage(
        wrongMessage
      );

      await saveGame({
        selectedNumber,

        message:
          wrongMessage,
      });
    };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset =
    async () => {
      await startNewRound(
        selectedLevel
      );
    };

  /* =======================================================
     PLAY AGAIN
  ======================================================= */

  const handlePlayAgain =
    async () => {
      await startNewRound(
        selectedLevel
      );
    };

  /* =======================================================
     NUMBER CARD
  ======================================================= */

  const renderNumberCard = (
    item
  ) => {
    return (
      <button
        key={
          `number-${item.id}`
        }
        ref={(element) => {
          numberRefs.current[
            item.id
          ] = element;
        }}
        className={`
          match-box
          number-box

          ${
            selectedNumber?.id ===
            item.id
              ? "selected-box"
              : ""
          }

          ${
            matchedIds.includes(
              item.id
            )
              ? "matched-box"
              : ""
          }

          ${
            animatingMatch ===
            item.id
              ? "matching-animation"
              : ""
          }
        `}
        onClick={() =>
          handleNumberClick(item)
        }
        disabled={
          completed ||
          matchedIds.includes(
            item.id
          )
        }
      >
        <span>
          {item.number}
        </span>

        {matchedIds.includes(
          item.id
        ) && (
          <span className="check">
            ✓
          </span>
        )}
      </button>
    );
  };

  /* =======================================================
     ANIMAL CARD
  ======================================================= */

  const renderAnimalCard = (
    item
  ) => {
    return (
      <button
        key={
          `animal-${item.id}`
        }
        ref={(element) => {
          animalRefs.current[
            item.id
          ] = element;
        }}
        className={`
          match-box
          animal-box

          ${
            matchedIds.includes(
              item.id
            )
              ? "matched-box"
              : ""
          }

          ${
            animatingMatch ===
            item.id
              ? "matching-animation"
              : ""
          }
        `}
        onClick={() =>
          handleAnimalClick(item)
        }
        disabled={
          completed ||
          matchedIds.includes(
            item.id
          )
        }
      >
        <div className="animal-icons">
          {Array.from(
            {
              length:
                item.number,
            },
            (_, index) => (
              <span key={index}>
                {item.animal}
              </span>
            )
          )}
        </div>

        {matchedIds.includes(
          item.id
        ) && (
          <span className="check">
            ✓
          </span>
        )}
      </button>
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="match-page">

        <div className="match-card loading-card">

          <div className="match-header">

            <div className="match-title-area">

              <div className="match-header-icon">
                🔢
              </div>

              <div>
                <h1>
                  Number Match
                </h1>

                <p>
                  Loading your game...
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="match-page">

      <div className="match-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="match-header">

          <div className="match-title-area">

            <div className="match-header-icon">
              🔢
            </div>

            <div>

              <h1>
                Number Match
              </h1>

              <p>
                Count the animals and find the matching number
              </p>

            </div>

          </div>

          <div className="score-badge">
            ⭐ {score}
          </div>

        </div>

        {/* =================================================
            LEVELS
        ================================================= */}

        <div className="level-row">

          {levels.map(
            (level) => (
              <button
                key={level.id}
                className={`level-btn ${
                  selectedLevel.id ===
                  level.id
                    ? "active-level"
                    : ""
                }`}
                onClick={() =>
                  handleLevelChange(
                    level
                  )
                }
              >
                {level.title}
              </button>
            )
          )}

        </div>

        {/* =================================================
            INSTRUCTION
        ================================================= */}

        <div className="kid-instruction">

          <span className="instruction-emoji">
            💡
          </span>

          <div>

            <strong>
              Count the animals!
            </strong>

            <p>
              Choose a number, then find the animal group with the same amount.
            </p>

          </div>

        </div>

        {/* =================================================
            MATCH BOARD
        ================================================= */}

        <div
          className="match-board"
          ref={boardRef}
        >

          {/* ===============================================
              CONNECTION
          ================================================ */}

          {connection && (
            <svg
              className="connection-svg"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            >

              <defs>

                <linearGradient
                  id="matchGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >

                  <stop
                    offset="0%"
                    stopColor="#ffd34d"
                  />

                  <stop
                    offset="50%"
                    stopColor="#ffffff"
                  />

                  <stop
                    offset="100%"
                    stopColor="#64c957"
                  />

                </linearGradient>

                <filter
                  id="matchGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >

                  <feGaussianBlur
                    stdDeviation="3"
                    result="blur"
                  />

                  <feMerge>

                    <feMergeNode
                      in="blur"
                    />

                    <feMergeNode
                      in="SourceGraphic"
                    />

                  </feMerge>

                </filter>

              </defs>

              {/* Glow */}
              <line
                x1={
                  connection.start.x
                }
                y1={
                  connection.start.y
                }
                x2={
                  connection.end.x
                }
                y2={
                  connection.end.y
                }
                className="connection-glow"
              />

              {/* Main beam */}
              <line
                x1={
                  connection.start.x
                }
                y1={
                  connection.start.y
                }
                x2={
                  connection.end.x
                }
                y2={
                  connection.end.y
                }
                className="connection-line"
                stroke="url(#matchGradient)"
                filter="url(#matchGlow)"
              />

              {/* Moving spark */}
              <circle
                cx={
                  connection.start.x
                }
                cy={
                  connection.start.y
                }
                r="7"
                className="travel-light"
              >

                <animate
                  attributeName="cx"
                  from={
                    connection.start.x
                  }
                  to={
                    connection.end.x
                  }
                  dur="0.7s"
                  fill="freeze"
                />

                <animate
                  attributeName="cy"
                  from={
                    connection.start.y
                  }
                  to={
                    connection.end.y
                  }
                  dur="0.7s"
                  fill="freeze"
                />

              </circle>

              {/* Burst */}
              <circle
                cx={
                  connection.end.x
                }
                cy={
                  connection.end.y
                }
                className="end-burst"
              />

            </svg>
          )}

          {/* ===============================================
              NUMBER COLUMN
          ================================================ */}

          <section className="game-column">

            <div className="column-title">
              <span>
                🔢
              </span>

              <h2>
                Numbers
              </h2>
            </div>

            <div className="card-list">

              {numberCards.map(
                renderNumberCard
              )}

            </div>

          </section>

          {/* ===============================================
              ANIMAL COLUMN
          ================================================ */}

          <section className="game-column">

            <div className="column-title">
              <span>
                🐾
              </span>

              <h2>
                Animals
              </h2>
            </div>

            <div className="card-list">

              {animalCards.map(
                renderAnimalCard
              )}

            </div>

          </section>

        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        <div
          className={`message-box ${
            completed
              ? "success-message"
              : ""
          }`}
        >

          <p>
            {message}
          </p>

        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="bottom-row">

          <span className="progress-label">
            {matchedIds.length} /{" "}
            {numberCards.length} matched
          </span>

          <button
            className="reset-btn"
            onClick={
              handleReset
            }
          >
            🔄 Reset
          </button>

        </div>

      </div>

      {/* ===================================================
          COMPLETION POPUP
      =================================================== */}

      {showCompletionPopup && (
        <div className="popup-overlay">

          <div className="completion-popup">

            <div className="popup-face">
              🐾
            </div>

            <div className="popup-stars">
              ⭐ ✨ ⭐
            </div>

            <h2>
              Amazing Job!
            </h2>

            <p>
              You matched all{" "}
              {numberCards.length}{" "}
              pairs!
            </p>

            <div className="popup-score">
              🏆 Score: {score}
            </div>

            <button
              className="popup-next-btn"
              onClick={
                handlePlayAgain
              }
            >
              PLAY AGAIN →
            </button>

          </div>

        </div>
      )}

    </div>
  );
}