import { useEffect, useRef, useState } from "react";
import useGameProgress from "../hooks/useGameProgress";
import jungleBg from "../assets/gamesHome.png";

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

function generateGame() {
  const correct =
    ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

  const options = [correct];

  while (options.length < 4) {
    const letter =
      ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];

    if (!options.includes(letter)) {
      options.push(letter);
    }
  }

  return {
    correct,
    options: options.sort(() => Math.random() - 0.5),
  };
}

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
  const [restored, setRestored] = useState(false);

  const [confetti, setConfetti] = useState([]);
  const [blastPosition, setBlastPosition] = useState(null);
  const [advancing, setAdvancing] = useState(false);

  const timerRef = useRef(null);
  const confettiTimerRef = useRef(null);
  const lockedRef = useRef(false);

  // ---------------------------------------------------------
  // RESTORE SAVED GAME
  // ---------------------------------------------------------

  useEffect(() => {
    if (progressLoading || restored) return;

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
      const fresh = generateGame();

      setGame(fresh);

      void save({
        ...fresh,
        selected: null,
        message: "",
        score: 0,
        round: 1,
        completed: false,
      });
    }

    setRestored(true);
  }, [progressLoading, restored, savedState, save]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(confettiTimerRef.current);
    };
  }, []);

  // ---------------------------------------------------------
  // CONFETTI
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

    const pieces = Array.from({ length: 80 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 260;

      return {
        id: `${Date.now()}-${index}`,
        x,
        y,
        moveX: Math.cos(angle) * distance,
        moveY: Math.sin(angle) * distance,
        fall: 250 + Math.random() * 450,
        rotate: Math.random() * 1080 - 540,
        delay: Math.random() * 0.12,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 7 + Math.random() * 7,
        height: 10 + Math.random() * 12,
      };
    });

    setConfetti(pieces);
    setBlastPosition({ x, y });

    clearTimeout(confettiTimerRef.current);

    confettiTimerRef.current = setTimeout(() => {
      setConfetti([]);
      setBlastPosition(null);
    }, 3000);
  };

  // ---------------------------------------------------------
  // ANSWER
  // ---------------------------------------------------------

  const handleClick = async (letter, event) => {
    if (
      completed ||
      advancing ||
      lockedRef.current ||
      !game.correct
    ) {
      return;
    }

    const isCorrect = letter === game.correct;

    if (isCorrect) {
      lockedRef.current = true;
    }

    setSelected(letter);

    const updatedScore = isCorrect ? score + 1 : score;

    const feedback = isCorrect
      ? "Boom! 💥 Correct"
      : "Oops! Try again 💛";

    setScore(updatedScore);
    setMessage(feedback);

    if (isCorrect && event) {
      const rect = event.currentTarget.getBoundingClientRect();

      createConfetti(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );

      setAdvancing(true);
    }

    await save({
      ...game,
      selected: letter,
      message: feedback,
      score: updatedScore,
      round,
      completed: false,
    });

    if (!isCorrect) {
      return;
    }

    // Automatically move to the next question.
    timerRef.current = setTimeout(async () => {
      try {
        if (round === TOTAL_ROUNDS) {
          const finalPercentage =
            (updatedScore / TOTAL_ROUNDS) * 100;

          setCompleted(true);

          await finish(
            finalPercentage,
            "Letter Blast"
          );

          await save({
            ...game,
            selected: letter,
            message:
              `🎯 Game Completed! Score: ${updatedScore}/${TOTAL_ROUNDS}`,
            score: updatedScore,
            round,
            completed: true,
          });
        } else {
          const nextGame = generateGame();
          const nextRound = round + 1;

          setRound(nextRound);
          setGame(nextGame);
          setSelected(null);
          setMessage("");

          await save({
            ...nextGame,
            selected: null,
            message: "",
            score: updatedScore,
            round: nextRound,
            completed: false,
          });
        }
      } catch (error) {
        console.error(
          "Letter Blast could not save the next round:",
          error
        );
      } finally {
        setAdvancing(false);
        lockedRef.current = false;
      }
    }, 1000);
  };

  // ---------------------------------------------------------
  // PLAY AGAIN
  // ---------------------------------------------------------

  const playAgain = async () => {
    clearTimeout(timerRef.current);
    clearTimeout(confettiTimerRef.current);

    lockedRef.current = false;

    const fresh = generateGame();

    setGame(fresh);
    setSelected(null);
    setMessage("");
    setScore(0);
    setRound(1);
    setCompleted(false);
    setAdvancing(false);
    setConfetti([]);
    setBlastPosition(null);

    await save({
      ...fresh,
      selected: null,
      message: "",
      score: 0,
      round: 1,
      completed: false,
    });
  };

  // ---------------------------------------------------------
  // INLINE STYLES
  // ---------------------------------------------------------

  const styles = `
    html,
    body,
    #root {
      margin: 0;
      padding: 0;
      min-height: 100%;
    }

    .letter-blast-page {
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
      position: relative;
      color: #fff8dc;
      font-family: "Trebuchet MS", Arial, sans-serif;

      background-image:
        linear-gradient(
          rgba(20, 82, 50, 0.10),
          rgba(20, 82, 50, 0.18)
        ),
        url("${jungleBg}");

      background-size: cover;
      background-position: center top;
      background-repeat: no-repeat;
      background-attachment: fixed;

      padding-bottom: 70px;
    }

    .letter-blast-page *,
    .letter-blast-page *::before,
    .letter-blast-page *::after {
      box-sizing: border-box;
    }

    /* Fixed jungle header, matching the CurioKids game screens */
    .letter-blast-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;

      height: 78px;
      min-height: 78px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 0 38px;

      background:
        linear-gradient(
          90deg,
          rgba(7, 73, 49, 0.98),
          rgba(10, 91, 61, 0.98),
          rgba(7, 73, 49, 0.98)
        );

      border-bottom: 4px solid #e7bd62;

      box-shadow:
        0 5px 18px rgba(22, 53, 30, 0.35);
    }

    .letter-blast-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .letter-blast-brand-icon {
      width: 46px;
      height: 46px;

      display: grid;
      place-items: center;

      border-radius: 13px;

      background: #ffd95d;

      color: #155238;
      font-size: 26px;

      box-shadow:
        0 3px 0 #b27a29;
    }

    .letter-blast-brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    .letter-blast-brand-text strong {
      font-size: 23px;
      font-weight: 900;
      color: #fff8dc;
    }

    .letter-blast-brand-text span {
      margin-top: 5px;
      color: #f4e7b7;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1.7px;
      text-transform: uppercase;
    }

    .letter-blast-header-pill {
      padding: 10px 19px;

      border-radius: 999px;

      background: #fff5d2;
      color: #20583d;

      font-size: 13px;
      font-weight: 900;

      box-shadow:
        0 3px 0 #b88a42;
    }

    .letter-blast-content {
      width: min(1120px, 94%);
      margin: 0 auto;
      padding-top: 108px;
    }

    /* Round and score badges */
    .letter-blast-stats {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 20px;
      margin: 12px 0 18px;
    }

    .letter-blast-stat {
      min-width: 170px;

      padding: 12px 22px;

      border-radius: 19px;

      background:
        linear-gradient(
          145deg,
          #c98a49,
          #a4612f 55%,
          #8b4e25
        );

      border: 5px solid #6b3b1d;

      color: #fff4d2;

      box-shadow:
        inset 0 2px 0 rgba(255, 220, 153, 0.65),
        0 6px 0 #4f2a14,
        0 10px 18px rgba(0, 0, 0, 0.22);

      font-size: 19px;
      font-weight: 900;
      text-align: center;

      text-shadow: 0 2px 0 #70401f;
    }

    .letter-blast-stat strong {
      color: #ffe47c;
    }

    /* Prompt */
    .letter-blast-prompt {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      gap: 18px;

      margin: 20px auto 25px;

      color: #fff8dc;

      font-size: clamp(28px, 4vw, 42px);
      font-weight: 900;
      text-align: center;

      text-shadow:
        0 4px 0 #245236,
        0 6px 12px rgba(0, 0, 0, 0.38);
    }

    .letter-blast-target {
      min-width: 88px;
      height: 88px;

      display: grid;
      place-items: center;

      padding: 8px 20px;

      border-radius: 20px;

      background: #fff5d8;

      border: 5px solid #e6bb61;

      color: #a84e1b;

      box-shadow:
        0 7px 0 #754322,
        0 11px 18px rgba(0, 0, 0, 0.28);

      font-size: 52px;
      line-height: 1;
    }

    /* ======================================================
       MAIN WOODEN BOARD
       This is deliberately the same warm wooden-board family
       used throughout the CurioKids jungle games.
       ====================================================== */

    .letter-blast-board {
      position: relative;

      width: 100%;
      min-height: 390px;

      padding: 38px 34px 42px;

      border-radius: 30px;

      background:
        repeating-linear-gradient(
          0deg,
          rgba(255, 220, 150, 0.10) 0px,
          rgba(255, 220, 150, 0.10) 3px,
          transparent 4px,
          transparent 22px
        ),
        linear-gradient(
          145deg,
          #bd7d42 0%,
          #a96331 45%,
          #c18345 100%
        );

      border: 9px solid #683b1e;

      box-shadow:
        inset 0 0 0 3px rgba(235, 188, 119, 0.75),
        inset 0 0 0 10px rgba(101, 54, 25, 0.18),
        0 10px 0 #4a2813,
        0 24px 40px rgba(20, 48, 27, 0.38);

      overflow: hidden;
    }

    .letter-blast-board::before {
      content: "";

      position: absolute;
      inset: 10px;

      border-radius: 21px;

      border: 2px solid rgba(255, 220, 150, 0.35);

      pointer-events: none;
    }

    .letter-blast-board::after {
      content: "";

      position: absolute;
      inset: 0;

      pointer-events: none;

      background:
        radial-gradient(
          circle at 85% 20%,
          rgba(255, 225, 157, 0.17),
          transparent 18%
        ),
        radial-gradient(
          circle at 15% 80%,
          rgba(91, 42, 19, 0.13),
          transparent 20%
        );

      border-radius: inherit;
    }

    .letter-blast-board-title {
      position: relative;
      z-index: 2;

      margin: 0 0 30px;

      color: #fff2c8;

      font-size: clamp(19px, 2.5vw, 27px);
      font-weight: 900;

      text-align: center;

      text-shadow:
        0 3px 0 #663719,
        0 5px 8px rgba(0, 0, 0, 0.22);
    }

    /* Four large cream letter blocks */
    .letter-blast-options {
      position: relative;
      z-index: 2;

      display: grid;

      grid-template-columns:
        repeat(4, minmax(0, 1fr));

      gap: 25px;

      width: 100%;
    }

    .letter-blast-option {
      width: 100%;
      min-height: 150px;

      display: grid;
      place-items: center;

      border-radius: 23px;

      border: 6px solid #e6bd6b;

      background:
        linear-gradient(
          145deg,
          #fff9e8,
          #f6e5bf
        );

      color: #245b40;

      box-shadow:
        0 9px 0 #7b4826,
        0 14px 20px rgba(56, 30, 14, 0.28);

      font-family: "Trebuchet MS", Arial, sans-serif;
      font-size: clamp(48px, 6vw, 76px);
      font-weight: 900;

      cursor: pointer;

      transition:
        transform 0.15s ease,
        filter 0.15s ease,
        background 0.15s ease;
    }

    .letter-blast-option:hover:not(:disabled) {
      transform: translateY(-5px);
      filter: brightness(1.04);
    }

    .letter-blast-option:active:not(:disabled) {
      transform: translateY(3px);
      box-shadow:
        0 5px 0 #7b4826,
        0 9px 15px rgba(56, 30, 14, 0.25);
    }

    .letter-blast-option:disabled {
      cursor: default;
    }

    .letter-blast-option.correct {
      background:
        linear-gradient(
          145deg,
          #e1ffc1,
          #8cdda0
        );

      color: #155d38;
      border-color: #f5df8d;
    }

    .letter-blast-option.wrong {
      background:
        linear-gradient(
          145deg,
          #ffe3d8,
          #ffb3a3
        );

      color: #a33e31;
    }

    .letter-blast-feedback {
      min-height: 52px;

      margin: 27px 0 0;

      color: #fff8dc;

      font-size: clamp(21px, 3vw, 30px);
      font-weight: 900;

      text-align: center;

      text-shadow:
        0 3px 0 #285337,
        0 5px 8px rgba(0, 0, 0, 0.35);
    }

    /* Completion board */
    .letter-blast-completed {
      max-width: 850px;
      margin: 45px auto;
      min-height: 380px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      text-align: center;
    }

    .letter-blast-completed h2 {
      margin: 0 0 18px;

      font-size: clamp(34px, 5vw, 54px);

      color: #fff4cf;

      text-shadow:
        0 4px 0 #633719,
        0 7px 12px rgba(0, 0, 0, 0.35);
    }

    .letter-blast-completed p {
      margin: 8px 0;

      color: #fff5d7;

      font-size: 24px;
      font-weight: 900;

      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
    }

    .letter-blast-play-again {
      margin-top: 24px;

      padding: 15px 35px;

      border-radius: 22px;

      border: 5px solid #673a1c;

      background: #fff0b8;
      color: #20563b;

      font-size: 22px;
      font-weight: 900;

      box-shadow: 0 7px 0 #70411f;

      cursor: pointer;
    }

    .letter-blast-play-again:active {
      transform: translateY(4px);
      box-shadow: 0 3px 0 #70411f;
    }

    /* Blast animation */
    .letter-blast-effect {
      position: fixed;

      width: 1px;
      height: 1px;

      z-index: 9998;

      pointer-events: none;
    }

    .letter-blast-emoji {
      position: absolute;

      left: 0;
      top: 0;

      transform:
        translate(-50%, -50%)
        scale(0.1);

      font-size: 60px;

      animation:
        letterBlastPop 0.65s ease-out forwards;
    }

    .letter-blast-ring {
      position: absolute;

      left: 0;
      top: 0;

      width: 75px;
      height: 75px;

      border: 6px solid #fff;

      border-radius: 50%;

      transform:
        translate(-50%, -50%)
        scale(0);

      animation:
        letterBlastRing 0.8s ease-out forwards;
    }

    .letter-blast-confetti {
      position: fixed;

      display: block;

      z-index: 9999;

      pointer-events: none;

      border-radius: 3px;

      animation:
        letterBlastFall
        2.8s
        ease-out
        var(--delay)
        forwards;
    }

    @keyframes letterBlastPop {
      0% {
        transform:
          translate(-50%, -50%)
          scale(0.1);
        opacity: 0;
      }

      30% {
        transform:
          translate(-50%, -50%)
          scale(1.5);
        opacity: 1;
      }

      100% {
        transform:
          translate(-50%, -50%)
          scale(0.2);
        opacity: 0;
      }
    }

    @keyframes letterBlastRing {
      0% {
        transform:
          translate(-50%, -50%)
          scale(0);
        opacity: 0.95;
      }

      100% {
        transform:
          translate(-50%, -50%)
          scale(2.5);
        opacity: 0;
      }
    }

    @keyframes letterBlastFall {
      0% {
        transform:
          translate(-50%, -50%)
          translate(0, 0)
          rotate(0deg);
        opacity: 1;
      }

      45% {
        opacity: 1;
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

    @media (max-width: 800px) {
      .letter-blast-header {
        padding: 0 18px;
      }

      .letter-blast-header-pill {
        display: none;
      }

      .letter-blast-content {
        width: 94%;
        padding-top: 98px;
      }

      .letter-blast-board {
        padding: 32px 20px 35px;
      }

      .letter-blast-options {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
      }

      .letter-blast-option {
        min-height: 125px;
      }

      .letter-blast-stat {
        min-width: 135px;
        padding: 10px 14px;
        font-size: 16px;
      }
    }

    @media (max-width: 520px) {
      .letter-blast-header {
        height: 68px;
        min-height: 68px;
      }

      .letter-blast-brand-icon {
        width: 40px;
        height: 40px;
        font-size: 22px;
      }

      .letter-blast-brand-text strong {
        font-size: 19px;
      }

      .letter-blast-content {
        padding-top: 88px;
      }

      .letter-blast-stats {
        gap: 8px;
      }

      .letter-blast-stat {
        min-width: 0;
        flex: 1;
        padding: 9px 8px;
        font-size: 14px;
      }

      .letter-blast-board {
        min-height: 360px;
        padding: 27px 14px 30px;
      }

      .letter-blast-options {
        gap: 14px;
      }

      .letter-blast-option {
        min-height: 105px;
        border-width: 5px;
      }
    }
  `;

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <div className="letter-blast-page">
      <style>{styles}</style>

      <header className="letter-blast-header">
        <div className="letter-blast-brand">
          <div className="letter-blast-brand-icon">🌴</div>

          <div className="letter-blast-brand-text">
            <strong>CurioKids</strong>
            <span>JUNGLE GAMES</span>
          </div>
        </div>

        <div className="letter-blast-header-pill">
          🌿 Letter Adventure
        </div>
      </header>

      {blastPosition && (
        <div
          className="letter-blast-effect"
          style={{
            left: blastPosition.x,
            top: blastPosition.y,
          }}
        >
          <span className="letter-blast-ring" />
          <span className="letter-blast-emoji">💥</span>
        </div>
      )}

      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="letter-blast-confetti"
          style={{
            left: piece.x,
            top: piece.y,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            "--move-x": `${piece.moveX}px`,
            "--move-y": `${piece.moveY}px`,
            "--fall": `${piece.fall}px`,
            "--rotate": `${piece.rotate}deg`,
            "--delay": `${piece.delay}s`,
          }}
        />
      ))}

      {progressLoading || !restored ? (
        <main className="letter-blast-content">
          <section className="letter-blast-board letter-blast-completed">
            <h2>🌿 Restoring your game...</h2>
          </section>
        </main>
      ) : completed ? (
        <main className="letter-blast-content">
          <section className="letter-blast-board letter-blast-completed">
            <h2>🎉 Game Completed!</h2>

            <p>
              ⭐ Score: {score}/{TOTAL_ROUNDS}
            </p>

            <p>
              Fantastic letter blasting! 💥
            </p>

            <button
              className="letter-blast-play-again"
              onClick={playAgain}
            >
              Play Again 🔄
            </button>
          </section>
        </main>
      ) : (
        <main className="letter-blast-content">
          <div className="letter-blast-stats">
            <div className="letter-blast-stat">
              🌱 Round{" "}
              <strong>
                {round}/{TOTAL_ROUNDS}
              </strong>
            </div>

            <div className="letter-blast-stat">
              ⭐ Score <strong>{score}</strong>
            </div>
          </div>

          <div className="letter-blast-prompt">
            Blast the letter
            <span className="letter-blast-target">
              {game.correct}
            </span>
          </div>

          <section className="letter-blast-board">
            <h2 className="letter-blast-board-title">
              ✨ Tap the matching letter! ✨
            </h2>

            <div className="letter-blast-options">
              {game.options.map((letter, index) => {
                const stateClass =
                  selected === letter
                    ? letter === game.correct
                      ? "correct"
                      : "wrong"
                    : "";

                return (
                  <button
                    key={`${letter}-${index}`}
                    type="button"
                    disabled={advancing}
                    className={`letter-blast-option ${stateClass}`}
                    onClick={(event) =>
                      handleClick(letter, event)
                    }
                    aria-label={`Choose letter ${letter}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </section>

          <div
            className="letter-blast-feedback"
            aria-live="polite"
          >
            {message ||
              "Choose the correct letter to continue 🌟"}
          </div>
        </main>
      )}
    </div>
  );
}
