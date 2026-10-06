// import { useState, useEffect } from "react";
// import "../styles/MemoryMatch.css";

// const EMOJIS = ["🐶", "🐱", "🐸", "🐵", "🐰", "🦊"];

// export default function MemoryMatch({ goBack }) {
//   const [cards, setCards] = useState([]);
//   const [flipped, setFlipped] = useState([]);
//   const [matched, setMatched] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     startGame();
//   }, []);

//   const shuffle = (array) => {
//     return [...array].sort(() => Math.random() - 0.5);
//   };

//   const startGame = () => {
//     const doubled = [...EMOJIS, ...EMOJIS];
//     const shuffled = shuffle(doubled).map((emoji, index) => ({
//       id: index,
//       emoji,
//     }));

//     setCards(shuffled);
//     setFlipped([]);
//     setMatched([]);
//     setMessage("");
//   };

//   const handleClick = (card) => {
//     if (flipped.length === 2 || flipped.includes(card.id)) return;

//     const newFlipped = [...flipped, card.id];
//     setFlipped(newFlipped);

//     if (newFlipped.length === 2) {
//       const [first, second] = newFlipped;
//       const firstCard = cards.find((c) => c.id === first);
//       const secondCard = cards.find((c) => c.id === second);

//       if (firstCard.emoji === secondCard.emoji) {
//         setMatched((prev) => [...prev, first, second]);
//         setFlipped([]);
//       } else {
//         setTimeout(() => setFlipped([]), 800);
//       }
//     }
//   };

//   useEffect(() => {
//     if (matched.length === cards.length && cards.length > 0) {
//       setMessage("Amazing! 🎉");
//     }
//   }, [matched, cards]);

//   return (
//     <div className="memory-page">

//       {/* Header */}
//       <div className="memory-header">
//         <button className="back-btn" onClick={goBack}>⬅</button>
//         <h1>Memory Match</h1>
//       </div>

//       {/* Instruction */}
//       <p className="memory-text">Match the pairs</p>

//       {/* Grid */}
//       <div className="memory-grid">
//         {cards.map((card) => {
//           const isFlipped =
//             flipped.includes(card.id) || matched.includes(card.id);

//           return (
//             <div
//               key={card.id}
//               className={`memory-card ${isFlipped ? "flipped" : ""}`}
//               onClick={() => handleClick(card)}
//             >
//               {isFlipped ? card.emoji : "❓"}
//             </div>
//           );
//         })}
//       </div>

//       {/* Message */}
//       <h2 className="feedback">{message}</h2>

//       {/* Restart */}
//       {message && (
//         <button className="next-btn" onClick={startGame}>
//           Play Again →
//         </button>
//       )}
//     </div>
//   );
// }/




import { useEffect, useState } from "react";
import "../styles/MemoryMatch.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "memory-match-animals";

const EMOJIS = [
  "🐶",
  "🐱",
  "🐸",
  "🐵",
  "🐰",
  "🦊",
];

const TOTAL_PAIRS = EMOJIS.length;

export default function MemoryMatch({ goBack }) {
  /* =========================================================
     FIREBASE PROGRESS
  ========================================================= */

  const initialState = {
    cards: [],
    flipped: [],
    matched: [],
    message: "",
    moves: 0,
    completed: false,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [cards, setCards] =
    useState([]);

  const [flipped, setFlipped] =
    useState([]);

  const [matched, setMatched] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [moves, setMoves] =
    useState(0);

  const [completed, setCompleted] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [checking, setChecking] =
    useState(false);

  /* =========================================================
     SHUFFLE
  ========================================================= */

  const shuffle = (array) => {
    return [...array].sort(
      () => Math.random() - 0.5
    );
  };

  /* =========================================================
     START GAME
  ========================================================= */

  const startGame = async () => {
    const doubled = [
      ...EMOJIS,
      ...EMOJIS,
    ];

    const shuffled = shuffle(
      doubled
    ).map((emoji, index) => ({
      id: index,
      emoji,
    }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMessage("");
    setMoves(0);
    setCompleted(false);
    setChecking(false);

    await save({
      cards: shuffled,
      flipped: [],
      matched: [],
      message: "",
      moves: 0,
      completed: false,
    });
  };

  /* =========================================================
     RESTORE SAVED GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Memory Match Animals saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.cards?.length > 0
    ) {
      setCards(
        savedState.cards
      );

      setFlipped(
        savedState.flipped || []
      );

      setMatched(
        savedState.matched || []
      );

      setMessage(
        savedState.message || ""
      );

      setMoves(
        savedState.moves || 0
      );

      setCompleted(
        Boolean(
          savedState.completed
        )
      );
    } else {
      /*
       * First time opening the game.
       */
      const doubled = [
        ...EMOJIS,
        ...EMOJIS,
      ];

      const shuffled = shuffle(
        doubled
      ).map((emoji, index) => ({
        id: index,
        emoji,
      }));

      setCards(shuffled);
      setFlipped([]);
      setMatched([]);
      setMessage("");
      setMoves(0);
      setCompleted(false);
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     HANDLE CARD CLICK
  ========================================================= */

  const handleClick = async (
    card
  ) => {
    if (checking) return;
    if (completed) return;

    if (
      flipped.length === 2
    ) {
      return;
    }

    if (
      flipped.includes(card.id)
    ) {
      return;
    }

    if (
      matched.includes(card.id)
    ) {
      return;
    }

    const newFlipped = [
      ...flipped,
      card.id,
    ];

    setFlipped(
      newFlipped
    );

    /* =======================================================
       FIRST CARD
    ======================================================= */

    if (
      newFlipped.length === 1
    ) {
      await save({
        cards,
        flipped: newFlipped,
        matched,
        message,
        moves,
        completed: false,
      });

      return;
    }

    /* =======================================================
       SECOND CARD
    ======================================================= */

    setChecking(true);

    const updatedMoves =
      moves + 1;

    setMoves(
      updatedMoves
    );

    const [
      firstId,
      secondId,
    ] = newFlipped;

    const firstCard =
      cards.find(
        (item) =>
          item.id === firstId
      );

    const secondCard =
      cards.find(
        (item) =>
          item.id === secondId
      );

    if (!firstCard || !secondCard) {
      setFlipped([]);
      setChecking(false);
      return;
    }

    /* =======================================================
       MATCH
    ======================================================= */

    if (
      firstCard.emoji ===
      secondCard.emoji
    ) {
      const updatedMatched = [
        ...matched,
        firstId,
        secondId,
      ];

      const isComplete =
        updatedMatched.length ===
        cards.length;

      const newMessage =
        isComplete
          ? "Amazing! 🎉"
          : "✅ Match!";

      setMatched(
        updatedMatched
      );

      setFlipped([]);

      setMessage(
        newMessage
      );

      /* =====================================================
         GAME COMPLETE
      ===================================================== */

      if (isComplete) {
        /*
         * 6 pairs = 100%
         */
        await finish(
          100,
          "Memory Match Animals"
        );

        setCompleted(true);

        await save({
          cards,
          flipped: [],
          matched:
            updatedMatched,
          message:
            newMessage,
          moves:
            updatedMoves,
          completed: true,
        });

        setChecking(false);

        return;
      }

      /* =====================================================
         SAVE MATCHED STATE
      ===================================================== */

      await save({
        cards,
        flipped: [],
        matched:
          updatedMatched,
        message:
          newMessage,
        moves:
          updatedMoves,
        completed: false,
      });

      setChecking(false);

      return;
    }

    /* =======================================================
       WRONG MATCH
    ======================================================= */

    const wrongMessage =
      "❌ Try again";

    setMessage(
      wrongMessage
    );

    await save({
      cards,
      flipped: newFlipped,
      matched,
      message:
        wrongMessage,
      moves:
        updatedMoves,
      completed: false,
    });

    /* Hide cards after 800ms */
    setTimeout(async () => {
      setFlipped([]);
      setMessage("");

      await save({
        cards,
        flipped: [],
        matched,
        message: "",
        moves:
          updatedMoves,
        completed: false,
      });

      setChecking(false);
    }, 800);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="memory-page">

        <div className="memory-header">
          <button
            className="back-btn"
            onClick={goBack}
          >
            ⬅
          </button>

          <h1>
            Memory Match
          </h1>
        </div>

        <p className="memory-text">
          Restoring your game...
        </p>

      </div>
    );
  }

  /* =========================================================
     COMPLETED
  ========================================================= */

  if (completed) {
    return (
      <div className="memory-page">

        <div className="memory-header">

          <button
            className="back-btn"
            onClick={goBack}
          >
            ⬅
          </button>

          <h1>
            Memory Match
          </h1>

        </div>

        <p className="memory-text">
          Match the pairs
        </p>

        <div className="memory-grid">

          {cards.map((card) => (
            <div
              key={card.id}
              className="memory-card flipped"
            >
              {card.emoji}
            </div>
          ))}

        </div>

        <h2 className="feedback">
          Amazing! 🎉
        </h2>

        <button
          className="next-btn"
          onClick={
            startGame
          }
        >
          Play Again →
        </button>

      </div>
    );
  }

  /* =========================================================
     GAME UI
  ========================================================= */

  return (
    <div className="memory-page">

      {/* HEADER */}
      <div className="memory-header">

        <button
          className="back-btn"
          onClick={goBack}
        >
          ⬅
        </button>

        <h1>
          Memory Match
        </h1>

      </div>

      {/* INSTRUCTION */}
      <p className="memory-text">
        Match the pairs
      </p>

      {/* MOVES */}
      <p className="memory-text">
        Moves: {moves}
      </p>

      {/* GRID */}
      <div className="memory-grid">

        {cards.map((card) => {

          const isFlipped =
            flipped.includes(
              card.id
            ) ||
            matched.includes(
              card.id
            );

          return (
            <div
              key={card.id}
              className={`memory-card ${
                isFlipped
                  ? "flipped"
                  : ""
              }`}
              onClick={() =>
                handleClick(card)
              }
            >
              {isFlipped
                ? card.emoji
                : "❓"}
            </div>
          );
        })}

      </div>

      {/* MESSAGE */}
      <h2 className="feedback">
        {message}
      </h2>

    </div>
  );
}