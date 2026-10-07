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

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState("");
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [checking, setChecking] = useState(false);

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
      setCards(savedState.cards);

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

  const handleClick = async (card) => {
    if (checking) return;
    if (completed) return;

    if (flipped.length === 2) {
      return;
    }

    if (flipped.includes(card.id)) {
      return;
    }

    if (matched.includes(card.id)) {
      return;
    }

    const newFlipped = [
      ...flipped,
      card.id,
    ];

    setFlipped(newFlipped);

    /* FIRST CARD */

    if (newFlipped.length === 1) {
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

    /* SECOND CARD */

    setChecking(true);

    const updatedMoves = moves + 1;

    setMoves(updatedMoves);

    const [
      firstId,
      secondId,
    ] = newFlipped;

    const firstCard = cards.find(
      (item) =>
        item.id === firstId
    );

    const secondCard = cards.find(
      (item) =>
        item.id === secondId
    );

    if (!firstCard || !secondCard) {
      setFlipped([]);
      setChecking(false);
      return;
    }

    /* MATCH */

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

      setMessage(newMessage);

      /* GAME COMPLETE */

      if (isComplete) {
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
          message: newMessage,
          moves: updatedMoves,
          completed: true,
        });

        setChecking(false);

        return;
      }

      /* SAVE MATCHED STATE */

      await save({
        cards,
        flipped: [],
        matched:
          updatedMatched,
        message: newMessage,
        moves: updatedMoves,
        completed: false,
      });

      setChecking(false);

      return;
    }

    /* WRONG MATCH */

    const wrongMessage =
      "❌ Try again";

    setMessage(wrongMessage);

    await save({
      cards,
      flipped: newFlipped,
      matched,
      message: wrongMessage,
      moves: updatedMoves,
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
        moves: updatedMoves,
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

        <nav className="memory-navbar">
          <div className="memory-brand">
            🌿 CurioKids
          </div>

          <div className="memory-title">
            🧠 Memory Match
          </div>
        </nav>

        <main className="memory-main">

          <div className="memory-loading-card">

            <div className="loading-animal">
              🐵
            </div>

            <h1>
              Getting the animals ready...
            </h1>

            <p>
              Your memory adventure is
              loading ✨
            </p>

            <div className="loading-dots">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     COMPLETED
  ========================================================= */

  if (completed) {
    return (
      <div className="memory-page">

        <nav className="memory-navbar">
          <div className="memory-brand">
            🌿 CurioKids
          </div>

          <div className="memory-title">
            🧠 Memory Match
          </div>
        </nav>

        <main className="memory-main">

          <div className="memory-completion-card">

            <div className="completion-confetti">
              🎉 ✨ 🌟
            </div>

            <div className="completion-animal">
              🦊
            </div>

            <h1>
              Memory Master!
            </h1>

            <p>
              Amazing! You matched all
              {TOTAL_PAIRS} animal pairs!
            </p>

            <div className="completion-stats">

              <div className="completion-stat">
                <span>🐾</span>
                <strong>
                  {TOTAL_PAIRS}
                </strong>
                <small>
                  Pairs
                </small>
              </div>

              <div className="completion-stat">
                <span>🎯</span>
                <strong>
                  {moves}
                </strong>
                <small>
                  Moves
                </small>
              </div>

            </div>

            <div className="completion-message">
              🌟 Amazing memory! Keep
              exploring and learning!
            </div>

            <button
              className="memory-play-again"
              onClick={startGame}
            >
              🔄 Play Again
            </button>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     GAME UI
  ========================================================= */

  return (
    <div className="memory-page">

      {/* NAVBAR */}

      <nav className="memory-navbar">

        <div className="memory-brand">
          🌿 CurioKids
        </div>

        <div className="memory-title">
          🧠 Memory Match
        </div>

      </nav>

      <main className="memory-main">

        {/* HEADER */}

        <section className="memory-header-card">

          <div className="memory-header-icon">
            🧠
          </div>

          <div>
            <h1>
              Memory Match
            </h1>

            <p>
              Find the matching animal pairs!
            </p>
          </div>

        </section>

        {/* GAME INFO */}

        <section className="memory-info-card">

          <div className="memory-info-item">
            <span>🐾</span>

            <div>
              <small>
                Pairs
              </small>

              <strong>
                {matched.length / 2}/
                {TOTAL_PAIRS}
              </strong>
            </div>
          </div>

          <div className="memory-info-divider" />

          <div className="memory-info-item">
            <span>🎯</span>

            <div>
              <small>
                Moves
              </small>

              <strong>
                {moves}
              </strong>
            </div>
          </div>

          <div className="memory-info-divider" />

          <div className="memory-info-item">
            <span>✨</span>

            <div>
              <small>
                Matched
              </small>

              <strong>
                {matched.length}/
                {cards.length}
              </strong>
            </div>
          </div>

        </section>

        {/* INSTRUCTION */}

        <div className="memory-instruction">
          💡 Match two cards with the
          same animal!
        </div>

        {/* GRID */}

        <section className="memory-board">

          <div className="memory-grid">

            {cards.map((card) => {

              const isFlipped =
                flipped.includes(
                  card.id
                ) ||
                matched.includes(
                  card.id
                );

              const isMatched =
                matched.includes(
                  card.id
                );

              return (
                <button
                  key={card.id}
                  type="button"
                  className={`memory-card ${
                    isFlipped
                      ? "flipped"
                      : ""
                  } ${
                    isMatched
                      ? "matched"
                      : ""
                  }`}
                  onClick={() =>
                    handleClick(card)
                  }
                  disabled={
                    checking ||
                    isMatched
                  }
                >

                  <span className="card-front">
                    ❓
                  </span>

                  <span className="card-back">
                    {card.emoji}
                  </span>

                </button>
              );
            })}

          </div>

        </section>

        {/* MESSAGE */}

        {message && (
          <div
            className={`memory-feedback ${
              message.includes("Try")
                ? "feedback-wrong"
                : "feedback-good"
            }`}
          >
            {message}
          </div>
        )}

        {/* TIP */}

        <div className="memory-tip">
          🌈 Remember where each animal
          is hiding!
        </div>

      </main>

    </div>
  );
}