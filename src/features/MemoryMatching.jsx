// import { useState, useEffect } from "react";
// import "../styles/BlendSounds.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// // 🔥 Router
// import { useLocation } from "react-router-dom";

// export default function MemoryMatch() {

//   const TOTAL_PAIRS = 3;

//   // 🔥 MODE
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const mode = query.get("mode") || "letters";

//   const [cards, setCards] = useState([]);
//   const [flipped, setFlipped] = useState([]);
//   const [matched, setMatched] = useState([]);

//   const [score, setScore] = useState(0);
//   const [moves, setMoves] = useState(0);

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   // 🤖 AI GENERATE CARDS
//   const generateCards = () => {
//     try {
//       setLoading(true);

//       const base =
//         mode === "numbers"
//           ? ["1","2","3","4","5","6","7","8","9"]
//           : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//       const selected = base
//         .sort(() => 0.5 - Math.random())
//         .slice(0, TOTAL_PAIRS);

//       const pairs = [...selected, ...selected]
//         .sort(() => 0.5 - Math.random());

//       setCards(pairs);
//       setFlipped([]);
//       setMatched([]);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     generateCards();
//   }, [mode]);

//   // 🎯 HANDLE CLICK
//   const handleClick = (index) => {

//     if (flipped.length === 2 || flipped.includes(index)) return;

//     const newFlipped = [...flipped, index];
//     setFlipped(newFlipped);

//     if (newFlipped.length === 2) {
//       setMoves(prev => prev + 1);

//       const [i1, i2] = newFlipped;

//       if (cards[i1] === cards[i2]) {
//         setMatched(prev => [...prev, cards[i1]]);
//         setScore(prev => prev + 1);
//         setFlipped([]);
//         setMessage("✅ Match!");
//       } else {
//         setMessage("❌ Try again");

//         setTimeout(() => {
//           setFlipped([]);
//         }, 800);
//       }
//     }
//   };

//   // ☁️ SAVE WHEN COMPLETE
//   useEffect(() => {
//     if (matched.length === TOTAL_PAIRS) {
//       saveScoreToFirestore();
//     }
//   }, [matched]);

//   const saveScoreToFirestore = async () => {
//     try {
//       const userEmail = "demo_user";

//       const userRef = doc(db, "users", userEmail);
//       const gameResultsRef = collection(userRef, "game_results");

//       const accuracy = (score / TOTAL_PAIRS) * 100;

//       await addDoc(gameResultsRef, {
//         score,
//         totalPairs: TOTAL_PAIRS,
//         moves,
//         accuracy: accuracy.toFixed(2),
//         createdAt: Timestamp.now(),
//         game: `MemoryMatch_${mode}`
//       });

//       alert(`🎯 Completed!\nScore: ${score}/${TOTAL_PAIRS}`);

//       // reset
//       setScore(0);
//       setMoves(0);
//       generateCards();

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="blend-container">

//       <h2>🧠 Memory Match ({mode})</h2>

//       <div className="game-info">
//         Score: {score} | Moves: {moves}
//       </div>

//       {/* GRID */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 80px)",
//           gap: "15px",
//           justifyContent: "center"
//         }}
//       >
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           cards.map((card, i) => {
//             const isFlipped = flipped.includes(i) || matched.includes(card);

//             return (
//               <button
//                 key={i}
//                 onClick={() => handleClick(i)}
//                 style={{
//                   height: "80px",
//                   fontSize: "24px"
//                 }}
//               >
//                 {isFlipped ? card : "?"}
//               </button>
//             );
//           })
//         )}
//       </div>

//       <p>{message}</p>

//     </div>
//   );
// }


import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";
import { useLocation } from "react-router-dom";
import useGameProgress from "../hooks/useGameProgress";

const TOTAL_PAIRS = 3;

export default function MemoryMatch() {
  /* =========================================================
     MODE
  ========================================================= */

  const location = useLocation();

  const query = new URLSearchParams(
    location.search
  );

  const mode =
    query.get("mode") || "letters";

  /* =========================================================
     UNIQUE GAME ID PER MODE
  ========================================================= */

  const GAME_ID =
    `memory-match-${mode}`;

  /* =========================================================
     INITIAL STATE
  ========================================================= */

  const initialState = {
    cards: [],
    flipped: [],
    matched: [],
    score: 0,
    moves: 0,
    message: "",
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

  const [score, setScore] =
    useState(0);

  const [moves, setMoves] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [completed, setCompleted] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  const [checking, setChecking] =
    useState(false);

  /* =========================================================
     🤖 GENERATE CARDS
  ========================================================= */

  const generateCards = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
            ]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
              ""
            );

      const selected = [
        ...base,
      ]
        .sort(
          () => 0.5 - Math.random()
        )
        .slice(
          0,
          TOTAL_PAIRS
        );

      const pairs = [
        ...selected,
        ...selected,
      ].sort(
        () => 0.5 - Math.random()
      );

      setCards(pairs);
      setFlipped([]);
      setMatched([]);
      setScore(0);
      setMoves(0);
      setMessage("");
      setCompleted(false);
      setChecking(false);

      return pairs;
    } catch (err) {
      console.error(
        "❌ Error generating cards:",
        err
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     🔥 RESTORE SAVED GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Memory Match saved state:",
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

      setScore(
        savedState.score || 0
      );

      setMoves(
        savedState.moves || 0
      );

      setMessage(
        savedState.message || ""
      );

      setCompleted(
        Boolean(
          savedState.completed
        )
      );

      setLoading(false);
    } else {
      generateCards();
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     💾 SAVE CURRENT STATE
  ========================================================= */

  const saveCurrentState = async (
    overrides = {}
  ) => {
    await save({
      cards,
      flipped,
      matched,
      score,
      moves,
      message,
      completed,
      ...overrides,
    });
  };

  /* =========================================================
     🎯 HANDLE CARD CLICK
  ========================================================= */

  const handleClick = async (
    index
  ) => {
    if (checking) return;

    if (completed) return;

    if (
      flipped.length === 2
    ) {
      return;
    }

    if (
      flipped.includes(index)
    ) {
      return;
    }

    if (
      matched.includes(
        cards[index]
      )
    ) {
      return;
    }

    const newFlipped = [
      ...flipped,
      index,
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
      await saveCurrentState({
        flipped: newFlipped,
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
      firstIndex,
      secondIndex,
    ] = newFlipped;

    const firstCard =
      cards[firstIndex];

    const secondCard =
      cards[secondIndex];

    /* =======================================================
       MATCH
    ======================================================= */

    if (
      firstCard ===
      secondCard
    ) {
      const updatedMatched = [
        ...matched,
        firstCard,
      ];

      const updatedScore =
        score + 1;

      const isComplete =
        updatedMatched.length ===
        TOTAL_PAIRS;

      const newMessage =
        isComplete
          ? "🎉 All pairs matched!"
          : "✅ Match!";

      setMatched(
        updatedMatched
      );

      setScore(
        updatedScore
      );

      setFlipped([]);

      setMessage(
        newMessage
      );

      /* =====================================================
         🏆 COMPLETED
      ===================================================== */

      if (isComplete) {
        const percentage =
          (updatedScore /
            TOTAL_PAIRS) *
          100;

        console.log(
          "🏁 Memory Match completed:",
          {
            mode,
            score:
              updatedScore,
            totalPairs:
              TOTAL_PAIRS,
            moves:
              updatedMoves,
            percentage,
          }
        );

        await finish(
          percentage,
          `Memory Match (${mode})`
        );

        setCompleted(
          true
        );

        await save({
          cards,
          flipped: [],
          matched:
            updatedMatched,
          score:
            updatedScore,
          moves:
            updatedMoves,
          message:
            newMessage,
          completed: true,
        });

        setChecking(false);

        return;
      }

      /* =====================================================
         💾 SAVE MATCH
      ===================================================== */

      await save({
        cards,
        flipped: [],
        matched:
          updatedMatched,
        score:
          updatedScore,
        moves:
          updatedMoves,
        message:
          newMessage,
        completed: false,
      });

      setChecking(false);

      return;
    }

    /* =======================================================
       ❌ NOT A MATCH
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
      score,
      moves: updatedMoves,
      message:
        wrongMessage,
      completed: false,
    });

    /* Wait before hiding cards */
    setTimeout(async () => {
      setFlipped([]);
      setMessage("");

      await save({
        cards,
        flipped: [],
        matched,
        score,
        moves: updatedMoves,
        message: "",
        completed: false,
      });

      setChecking(false);
    }, 800);
  };

  /* =========================================================
     🔄 PLAY AGAIN
  ========================================================= */

  const handleRestart = async () => {
    const newCards =
      generateCards();

    await save({
      cards: newCards,
      flipped: [],
      matched: [],
      score: 0,
      moves: 0,
      message: "",
      completed: false,
    });
  };

  /* =========================================================
     ⏳ LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="blend-container">

        <h2>
          🧠 Memory Match
        </h2>

        <p>
          Restoring your game...
        </p>

      </div>
    );
  }

  /* =========================================================
     🏆 COMPLETED SCREEN
  ========================================================= */

  if (completed) {
    return (
      <div className="blend-container">

        <h2>
          🧠 Memory Match (
          {mode}
          )
        </h2>

        <div className="game-info">
          🎯 Completed!
        </div>

        <div className="big-letter">
          🌟
        </div>

        <h3>
          Score: {score}/
          {TOTAL_PAIRS}
        </h3>

        <p>
          Moves: {moves}
        </p>

        <button
          onClick={
            handleRestart
          }
          style={{
            marginTop:
              "20px",
            padding:
              "12px 24px",
            borderRadius:
              "10px",
            border:
              "none",
            cursor:
              "pointer",
            fontSize:
              "16px",
          }}
        >
          🔄 Play Again
        </button>

      </div>
    );
  }

  /* =========================================================
     🎮 GAME UI
  ========================================================= */

  return (
    <div className="blend-container">

      <h2>
        🧠 Memory Match (
        {mode}
        )
      </h2>

      <div className="game-info">
        Score: {score} | Moves:{" "}
        {moves}
      </div>

      {/* GRID */}
      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(3, 80px)",
          gap: "15px",
          justifyContent:
            "center",
        }}
      >
        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          cards.map(
            (card, index) => {
              const isFlipped =
                flipped.includes(
                  index
                ) ||
                matched.includes(
                  card
                );

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleClick(
                      index
                    )
                  }
                  disabled={
                    checking ||
                    flipped.length ===
                      2 ||
                    matched.includes(
                      card
                    )
                  }
                  style={{
                    height:
                      "80px",
                    fontSize:
                      "24px",
                  }}
                >
                  {isFlipped
                    ? card
                    : "?"}
                </button>
              );
            }
          )
        )}
      </div>

      <p>
        {message}
      </p>

    </div>
  );
}
