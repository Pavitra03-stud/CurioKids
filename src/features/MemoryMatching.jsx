import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp } from "firebase/firestore";

// 🔥 Router
import { useLocation } from "react-router-dom";

export default function MemoryMatch() {

  const TOTAL_PAIRS = 3;

  // 🔥 MODE
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode") || "letters";

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🤖 AI GENERATE CARDS
  const generateCards = () => {
    try {
      setLoading(true);

      const base =
        mode === "numbers"
          ? ["1","2","3","4","5","6","7","8","9"]
          : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      const selected = base
        .sort(() => 0.5 - Math.random())
        .slice(0, TOTAL_PAIRS);

      const pairs = [...selected, ...selected]
        .sort(() => 0.5 - Math.random());

      setCards(pairs);
      setFlipped([]);
      setMatched([]);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateCards();
  }, [mode]);

  // 🎯 HANDLE CLICK
  const handleClick = (index) => {

    if (flipped.length === 2 || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);

      const [i1, i2] = newFlipped;

      if (cards[i1] === cards[i2]) {
        setMatched(prev => [...prev, cards[i1]]);
        setScore(prev => prev + 1);
        setFlipped([]);
        setMessage("✅ Match!");
      } else {
        setMessage("❌ Try again");

        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  // ☁️ SAVE WHEN COMPLETE
  useEffect(() => {
    if (matched.length === TOTAL_PAIRS) {
      saveScoreToFirestore();
    }
  }, [matched]);

  const saveScoreToFirestore = async () => {
    try {
      const userEmail = "demo_user";

      const userRef = doc(db, "users", userEmail);
      const gameResultsRef = collection(userRef, "game_results");

      const accuracy = (score / TOTAL_PAIRS) * 100;

      await addDoc(gameResultsRef, {
        score,
        totalPairs: TOTAL_PAIRS,
        moves,
        accuracy: accuracy.toFixed(2),
        createdAt: Timestamp.now(),
        game: `MemoryMatch_${mode}`
      });

      alert(`🎯 Completed!\nScore: ${score}/${TOTAL_PAIRS}`);

      // reset
      setScore(0);
      setMoves(0);
      generateCards();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="blend-container">

      <h2>🧠 Memory Match ({mode})</h2>

      <div className="game-info">
        Score: {score} | Moves: {moves}
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gap: "15px",
          justifyContent: "center"
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(card);

            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                style={{
                  height: "80px",
                  fontSize: "24px"
                }}
              >
                {isFlipped ? card : "?"}
              </button>
            );
          })
        )}
      </div>

      <p>{message}</p>

    </div>
  );
}