import { useEffect, useState } from "react";
import "../styles/gameCommon.css";
import useGameProgress from "../hooks/useGameProgress";

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const GAME_ID = "letter-blast";
const TOTAL_ROUNDS = 5;

const INITIAL_STATE = {
  correct: "",
  options: [],
  selected: null,
  message: "",
  score: 0,
  round: 1,
  completed: false,
};

export default function LetterBlast() {
  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, INITIAL_STATE);

  const [game, setGame] = useState({
    correct: "",
    options: [],
  });

  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Confetti
  const [confetti, setConfetti] = useState([]);
  const [blastPosition, setBlastPosition] = useState(null);

  const [restored, setRestored] = useState(false);

  // ---------------------------------------------------------
  // GENERATE GAME
  // ---------------------------------------------------------

  function generateGame() {
    const correct =
      ALL_LETTERS[
        Math.floor(Math.random() * ALL_LETTERS.length)
      ];

    let options = [correct];

    while (options.length < 4) {
      const random =
        ALL_LETTERS[
          Math.floor(Math.random() * ALL_LETTERS.length)
        ];

      if (!options.includes(random)) {
        options.push(random);
      }
    }

    options = options.sort(() => Math.random() - 0.5);

    return {
      correct,
      options,
    };
  }

  // ---------------------------------------------------------
  // RESTORE SAVED GAME
  // ---------------------------------------------------------

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log("🔥 Letter Blast saved state:", savedState);

    if (
      savedState &&
      savedState.correct &&
      savedState.options?.length
    ) {
      setGame({
        correct: savedState.correct,
        options: savedState.options,
      });

      setSelected(savedState.selected ?? null);
      setMessage(savedState.message || "");
      setScore(savedState.score ?? 0);
      setRound(savedState.round ?? 1);
      setCompleted(savedState.completed ?? false);
    } else {
      const newGame = generateGame();

      setGame(newGame);

      save({
        correct: newGame.correct,
        options: newGame.options,
        selected: null,
        message: "",
        score: 0,
        round: 1,
        completed: false,
      });
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
    save,
  ]);

  // ---------------------------------------------------------
  // CREATE CONFETTI
  // ---------------------------------------------------------

  const createConfetti = (x, y) => {
    const colors = [
      "#ff4d6d",
      "#ffd166",
      "#06d6a0",
      "#4dabf7",
      "#c77dff",
      "#ff922b",
      "#ffffff",
    ];

    const pieces = Array.from(
      { length: 80 },
      (_, index) => {
        const angle =
          Math.random() * Math.PI * 2;

        const distance =
          80 + Math.random() * 260;

        return {
          id: `${Date.now()}-${index}`,

          x,
          y,

          moveX:
            Math.cos(angle) * distance,

          moveY:
            Math.sin(angle) * distance,

          fall:
            250 + Math.random() * 450,

          rotate:
            Math.random() * 1080 - 540,

          delay:
            Math.random() * 0.12,

          color:
            colors[
              Math.floor(
                Math.random() * colors.length
              )
            ],

          width:
            7 + Math.random() * 7,

          height:
            10 + Math.random() * 12,
        };
      }
    );

    setConfetti(pieces);
    setBlastPosition({ x, y });

    setTimeout(() => {
      setConfetti([]);
      setBlastPosition(null);
    }, 3000);
  };

  // ---------------------------------------------------------
  // HANDLE CLICK
  // ---------------------------------------------------------

  const handleClick = async (letter, event) => {
    if (completed) return;
    if (selected === game.correct) return;

    setSelected(letter);

    const isCorrect =
      letter === game.correct;

    const updatedScore =
      isCorrect ? score + 1 : score;

    const feedback = isCorrect
      ? "Boom! 💥 Correct"
      : "Oops! Try again 💛";

    setScore(updatedScore);
    setMessage(feedback);

    // 💥 CORRECT LETTER = CONFETTI BLAST
    if (isCorrect && event) {
      const rect =
        event.currentTarget.getBoundingClientRect();

      const x =
        rect.left + rect.width / 2;

      const y =
        rect.top + rect.height / 2;

      createConfetti(x, y);
    }

    await save({
      correct: game.correct,
      options: game.options,
      selected: letter,
      message: feedback,
      score: updatedScore,
      round,
      completed: false,
    });
  };

  // ---------------------------------------------------------
  // NEXT / FINISH
  // ---------------------------------------------------------

  const next = async () => {
    if (round === TOTAL_ROUNDS) {
      const finalPercentage =
        (score / TOTAL_ROUNDS) * 100;

      setCompleted(true);

      await finish(
        finalPercentage,
        "Letter Blast"
      );

      await save({
        correct: game.correct,
        options: game.options,
        selected,
        message:
          `🎯 Game Completed! Score: ${score}/${TOTAL_ROUNDS}`,
        score,
        round,
        completed: true,
      });

      setConfetti([]);
      setBlastPosition(null);

      return;
    }

    const nextGame = generateGame();

    const nextRound = round + 1;

    setRound(nextRound);
    setGame(nextGame);
    setSelected(null);
    setMessage("");
    setConfetti([]);
    setBlastPosition(null);

    await save({
      correct: nextGame.correct,
      options: nextGame.options,
      selected: null,
      message: "",
      score,
      round: nextRound,
      completed: false,
    });
  };

  // ---------------------------------------------------------
  // PLAY AGAIN
  // ---------------------------------------------------------

  const playAgain = async () => {
    const newGame = generateGame();

    setGame(newGame);
    setSelected(null);
    setMessage("");
    setScore(0);
    setRound(1);
    setCompleted(false);
    setConfetti([]);
    setBlastPosition(null);

    await save({
      correct: newGame.correct,
      options: newGame.options,
      selected: null,
      message: "",
      score: 0,
      round: 1,
      completed: false,
    });
  };

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (progressLoading || !restored) {
    return (
      <div className="game-page">
        <div className="header">
          <h1>Letter Blast</h1>
        </div>

        <p className="instruction">
          Restoring your game...
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // COMPLETED
  // ---------------------------------------------------------

  if (completed) {
    return (
      <div className="game-page">
        <div className="header">
          <h1>Letter Blast 💥</h1>
        </div>

        <h2 className="feedback">
          🎯 Game Completed!
        </h2>

        <p className="instruction">
          Score:{" "}
          <strong>
            {score}/{TOTAL_ROUNDS}
          </strong>
        </p>

        <button
          className="next-btn"
          onClick={playAgain}
        >
          Play Again 🔄
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN GAME
  // ---------------------------------------------------------

  return (
    <div className="game-page">

      {/* =====================================================
          CONFETTI BLAST
      ===================================================== */}

      {blastPosition && (
        <div
          className="blast-effect"
          style={{
            left: blastPosition.x,
            top: blastPosition.y,
          }}
        >
          <div className="blast-ring ring-one"></div>
          <div className="blast-ring ring-two"></div>
          <div className="blast-emoji">
            💥
          </div>
        </div>
      )}

      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="letter-confetti"
          style={{
            left: piece.x,
            top: piece.y,

            width: piece.width,
            height: piece.height,

            backgroundColor:
              piece.color,

            "--move-x": `${piece.moveX}px`,
            "--move-y": `${piece.moveY}px`,
            "--fall": `${piece.fall}px`,
            "--rotate": `${piece.rotate}deg`,
            "--delay": `${piece.delay}s`,
          }}
        />
      ))}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="header">
        <h1>Letter Blast</h1>

        <p>
          Round {round}/{TOTAL_ROUNDS}
          {" | "}
          Score: {score}
        </p>
      </div>

      {/* =====================================================
          INSTRUCTION
      ===================================================== */}

      <p className="instruction">
        Blast:{" "}
        <strong className="target">
          {game.correct}
        </strong>
      </p>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

      <div className="options">
        {game.options.map(
          (letter, index) => {
            let stateClass = "";

            if (selected === letter) {
              stateClass =
                letter === game.correct
                  ? "blast correct"
                  : "wrong";
            }

            return (
              <div
                key={index}
                className={`card floating ${stateClass}`}
                onClick={(event) =>
                  handleClick(
                    letter,
                    event
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();

                    handleClick(
                      letter,
                      event
                    );
                  }
                }}
              >
                {letter}
              </div>
            );
          }
        )}
      </div>

      {/* =====================================================
          FEEDBACK
      ===================================================== */}

      <h2 className="feedback">
        {message}
      </h2>

      {/* =====================================================
          NEXT BUTTON
      ===================================================== */}

      {message.includes("Correct") && (
        <button
          className="next-btn"
          onClick={next}
        >
          {round === TOTAL_ROUNDS
            ? "Finish 🎯"
            : "Next →"}
        </button>
      )}

      {/* =====================================================
          CONFETTI CSS
      ===================================================== */}

      <style>{`
        .blast-effect {
          position: fixed;
          width: 1px;
          height: 1px;
          z-index: 999998;
          pointer-events: none;
        }

        .blast-emoji {
          position: absolute;
          left: 0;
          top: 0;
          transform: translate(-50%, -50%);
          font-size: 58px;
          line-height: 1;
          animation: blastEmoji 0.55s ease-out forwards;
          filter: drop-shadow(0 5px 8px rgba(0,0,0,0.2));
        }

        .blast-ring {
          position: absolute;
          left: 0;
          top: 0;
          border: 6px solid white;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }

        .ring-one {
          width: 55px;
          height: 55px;
          animation: blastRing 0.65s ease-out forwards;
        }

        .ring-two {
          width: 90px;
          height: 90px;
          animation: blastRing 0.85s ease-out 0.08s forwards;
        }

        .letter-confetti {
          position: fixed;
          display: block;
          z-index: 999999;
          pointer-events: none;
          border-radius: 3px;
          animation:
            letterConfettiFall
            2.8s
            cubic-bezier(0.12, 0.65, 0.25, 1)
            var(--delay)
            forwards;
        }

        @keyframes blastEmoji {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0.1)
              rotate(-20deg);
            opacity: 0;
          }

          25% {
            transform:
              translate(-50%, -50%)
              scale(1.5)
              rotate(10deg);
            opacity: 1;
          }

          55% {
            transform:
              translate(-50%, -50%)
              scale(1)
              rotate(-5deg);
            opacity: 1;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(0.2)
              rotate(20deg);
            opacity: 0;
          }
        }

        @keyframes blastRing {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0);
            opacity: 0.9;
          }

          70% {
            opacity: 0.5;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(2.2);
            opacity: 0;
          }
        }

        @keyframes letterConfettiFall {
          0% {
            transform:
              translate(-50%, -50%)
              translate(0px, 0px)
              rotate(0deg);
            opacity: 1;
          }

          20% {
            transform:
              translate(-50%, -50%)
              translate(
                calc(var(--move-x) * 0.65),
                calc(var(--move-y) * 0.65)
              )
              rotate(180deg);
            opacity: 1;
          }

          55% {
            transform:
              translate(-50%, -50%)
              translate(
                var(--move-x),
                calc(var(--move-y) + (var(--fall) * 0.35))
              )
              rotate(360deg);
            opacity: 0.95;
          }

          100% {
            transform:
              translate(-50%, -50%)
              translate(
                var(--move-x),
                calc(var(--move-y) + var(--fall))
              )
              rotate(var(--rotate));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}