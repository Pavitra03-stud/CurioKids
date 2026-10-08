import { useEffect, useRef, useState } from "react";
import "../styles/PatternCopy.css";
import useGameProgress from "../hooks/useGameProgress";

const COLORS = ["🔴", "🔵", "🟢", "🟡"];

const GAME_ID = "pattern-copy";

const TOTAL_ROUNDS = 5;

const INITIAL_STATE = {
  pattern: [],
  userInput: [],
  showPattern: true,
  message: "",
  round: 1,
  score: 0,
  completed: false,
};

export default function PatternCopy({ goBack }) {
  const {
    save,
    loading: progressLoading,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );

  /* =========================================================
     STATE
     ========================================================= */

  const [pattern, setPattern] = useState([]);

  const [userInput, setUserInput] = useState([]);

  const [showPattern, setShowPattern] =
    useState(true);

  const [message, setMessage] = useState("");

  const [round, setRound] = useState(1);

  const [score, setScore] = useState(0);

  const [completed, setCompleted] =
    useState(false);

  const [gameReady, setGameReady] =
    useState(false);

  const timerRef = useRef(null);

  const nextRoundTimerRef =
    useRef(null);


  /* =========================================================
     CLEANUP
     ========================================================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (nextRoundTimerRef.current) {
        clearTimeout(
          nextRoundTimerRef.current
        );
      }
    };
  }, []);


  /* =========================================================
     GENERATE PATTERN
     ========================================================= */

  const generatePattern = async (
    nextRound = 1,
    currentScore = 0
  ) => {

    /* Clear old timers */

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (nextRoundTimerRef.current) {
      clearTimeout(
        nextRoundTimerRef.current
      );
    }


    /* Create a new 3-color pattern */

    const newPattern = Array.from(
      { length: 3 },
      () =>
        COLORS[
          Math.floor(
            Math.random() * COLORS.length
          )
        ]
    );


    /* Update screen */

    setPattern(newPattern);

    setUserInput([]);

    setShowPattern(true);

    setMessage("");

    setRound(nextRound);

    setScore(currentScore);

    setCompleted(false);


    /* Save current round */

    await save({
      pattern: newPattern,

      userInput: [],

      showPattern: true,

      message: "",

      round: nextRound,

      score: currentScore,

      completed: false,
    });


    /*
     * Keep the pattern visible for 2 seconds.
     */

    timerRef.current = setTimeout(
      async () => {

        setShowPattern(false);

        await save({
          pattern: newPattern,

          userInput: [],

          showPattern: false,

          message: "",

          round: nextRound,

          score: currentScore,

          completed: false,
        });

      },
      2000
    );
  };


  /* =========================================================
     START GAME
     
     IMPORTANT:
     We intentionally start a fresh game here.
     
     This prevents an old Firebase state such as:
       showPattern: false
       pattern: [...]
     
     from causing the first screen to say
     "Repeat the pattern" with an empty board.
     ========================================================= */

  useEffect(() => {

    if (progressLoading) {
      return;
    }

    if (gameReady) {
      return;
    }

    setGameReady(true);

    generatePattern(1, 0);

  }, [
    progressLoading,
    gameReady,
  ]);


  /* =========================================================
     HANDLE COLOR CLICK
     ========================================================= */

  const handleClick = async (color) => {

    /* Don't allow clicking while pattern is visible */

    if (showPattern) {
      return;
    }


    /* Don't allow clicks after game completion */

    if (completed) {
      return;
    }


    /* Don't allow extra clicks */

    if (
      userInput.length >= pattern.length
    ) {
      return;
    }


    /* Add selected color */

    const newInput = [
      ...userInput,
      color,
    ];

    setUserInput(newInput);


    /* =======================================================
       PARTIAL ANSWER
       ======================================================= */

    if (
      newInput.length < pattern.length
    ) {

      await save({
        pattern,

        userInput: newInput,

        showPattern: false,

        message: "",

        round,

        score,

        completed: false,
      });

      return;
    }


    /* =======================================================
       CHECK COMPLETE ANSWER
       ======================================================= */

    const isCorrect =
      JSON.stringify(newInput) ===
      JSON.stringify(pattern);


    /* =======================================================
       CORRECT
       ======================================================= */

    if (isCorrect) {

      const newScore = score + 1;

      setMessage(
        "Great job! 🌟"
      );

      setScore(newScore);


      await save({
        pattern,

        userInput: newInput,

        showPattern: false,

        message: "Great job! 🌟",

        round,

        score: newScore,

        completed: false,
      });


      /*
       * Small delay so the child can see
       * "Great job!" before the next pattern.
       */

      nextRoundTimerRef.current =
        setTimeout(async () => {

          /* ================================
             FINAL ROUND
             ================================ */

          if (
            round >= TOTAL_ROUNDS
          ) {

            setCompleted(true);

            await save({
              pattern,

              userInput: newInput,

              showPattern: false,

              message:
                "Great job! 🌟",

              round:
                TOTAL_ROUNDS,

              score: newScore,

              completed: true,
            });

            return;
          }


          /* ================================
             NEXT ROUND
             ================================ */

          generatePattern(
            round + 1,
            newScore
          );

        }, 900);

      return;
    }


    /* =======================================================
       WRONG ANSWER
       ======================================================= */

    setMessage(
      "Try again 💛"
    );


    await save({
      pattern,

      userInput: [],

      showPattern: false,

      message: "Try again 💛",

      round,

      score,

      completed: false,
    });


    /*
     * Clear the wrong answer after a short delay.
     * The child stays on the same round and can retry.
     */

    setTimeout(() => {

      setUserInput([]);

      setMessage("");

    }, 700);
  };


  /* =========================================================
     LOADING
     ========================================================= */

  if (
    progressLoading ||
    !gameReady ||
    pattern.length === 0
  ) {

    return (
      <div className="pattern-page">

        <div className="pattern-header">

          <h1>
            Pattern Copy Game
          </h1>

        </div>

        <p className="pattern-text">
          Getting your jungle pattern ready... 🌱
        </p>

      </div>
    );
  }


  /* =========================================================
     COMPLETED
     ========================================================= */

  if (completed) {

    return (
      <div className="pattern-page">

        <div className="pattern-header">

          <h1>
            Pattern Copy Game
          </h1>

        </div>


        <div className="pattern-complete">

          <div className="complete-emoji">
            🎉
          </div>


          <h2>
            Jungle Adventure Complete!
          </h2>


          <p>
            You finished all {TOTAL_ROUNDS} rounds!
          </p>


          <div className="final-score">

            <span>
              YOUR SCORE
            </span>

            <strong>
              {score} / {TOTAL_ROUNDS}
            </strong>

          </div>


          <p className="score-message">

            {score === TOTAL_ROUNDS
              ? "Perfect memory! 🧠🌟"
              : score >= 3
                ? "Great jungle memory! 🌿"
                : "Keep practising your memory! 💚"
            }

          </p>


          <button
            className="next-btn"
            onClick={() => {

              setCompleted(false);

              setRound(1);

              setScore(0);

              setMessage("");

              setUserInput([]);

              generatePattern(1, 0);

            }}
          >
            Play Again ↻
          </button>

        </div>

      </div>
    );
  }


  /* =========================================================
     GAME UI
     ========================================================= */

  return (
    <div className="pattern-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="pattern-header">

        <h1>
          Pattern Copy Game
        </h1>

      </div>


      {/* =====================================================
          ROUND
          ===================================================== */}

      <div className="pattern-round">

        <span>
          ROUND
        </span>

        <strong>
          {round}
        </strong>

        <small>
          / {TOTAL_ROUNDS}
        </small>

      </div>


      {/* =====================================================
          SCORE
          ===================================================== */}

      <div className="pattern-score">

        ⭐ Score: {score}

      </div>


      {/* =====================================================
          INSTRUCTION
          ===================================================== */}

      <p className="pattern-text">

        {showPattern
          ? "Remember the pattern"
          : "Repeat the pattern"
        }

      </p>


      {/* =====================================================
          PATTERN BOARD
          ===================================================== */}

      <div className="pattern-box">

        {showPattern

          ? pattern.map(
              (color, index) => (

                <span key={index}>
                  {color}
                </span>

              )
            )

          : userInput.map(
              (color, index) => (

                <span key={index}>
                  {color}
                </span>

              )
            )

        }

      </div>


      {/* =====================================================
          COLOR OPTIONS
          ===================================================== */}

      <div className="color-options">

        {COLORS.map(
          (color, index) => (

            <div
              key={index}

              className="color-btn"

              onClick={() =>
                handleClick(color)
              }
            >
              {color}
            </div>

          )
        )}

      </div>


      {/* =====================================================
          FEEDBACK
          ===================================================== */}

      <h2 className="feedback">

        {message}

      </h2>


      {/* =====================================================
          NO NEXT BUTTON
          
          Correct answer automatically moves
          to the next round.
          ===================================================== */}

    </div>
  );
}