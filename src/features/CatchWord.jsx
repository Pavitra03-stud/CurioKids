import { useState, useEffect, useRef } from "react";
import { collection, addDoc, Timestamp, doc } from "firebase/firestore";

import { db } from "../firebase";
import useGameProgress from "../hooks/useGameProgress";

import jungleBg from "../assets/gamesHome.png";


const words = [
  "cat",
  "dog",
  "sun",
  "bat",
];

const TOTAL_ROUNDS = 5;

const GAME_ID = "catch-word";


function randomWord() {
  return words[
    Math.floor(
      Math.random() * words.length
    )
  ];
}


export default function CatchWord({ goBack }) {

  /* =========================================================
     GAME PROGRESS
     ========================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID);


  /* =========================================================
     GAME STATE
     ========================================================= */

  const [target, setTarget] =
    useState("");

  const [fallingWords, setFallingWords] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [round, setRound] =
    useState(0);

  const [gameReady, setGameReady] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);


  /* =========================================================
     TIMER REFS
     ========================================================= */

  const nextRoundTimer =
    useRef(null);


  /* =========================================================
     LOAD / RESUME GAME
     ========================================================= */

  useEffect(() => {

    if (progressLoading) {
      return;
    }


    const loadGame = async () => {

      console.log(
        "🎮 Catch Word saved state:",
        savedState
      );


      /* =====================================================
         RESUME EXISTING GAME
         ===================================================== */

      if (
        savedState &&
        savedState.target
      ) {

        console.log(
          "🔄 RESUMING CATCH WORD:",
          savedState
        );


        setTarget(
          savedState.target
        );

        setRound(
          Number(savedState.round) || 0
        );

        setScore(
          Number(savedState.score) || 0
        );

        setMessage("");

        setGameReady(true);

        return;
      }


      /* =====================================================
         NEW GAME
         ===================================================== */

      console.log(
        "🆕 Starting new Catch Word game"
      );


      const newTarget =
        randomWord();


      setTarget(newTarget);

      setRound(0);

      setScore(0);

      setMessage("");


      await save({
        round: 0,
        score: 0,
        target: newTarget,
      });


      setGameReady(true);
    };


    loadGame();

  }, [
    progressLoading,
  ]);


  /* =========================================================
     CLEANUP
     ========================================================= */

  useEffect(() => {

    return () => {

      if (
        nextRoundTimer.current
      ) {

        clearTimeout(
          nextRoundTimer.current
        );

      }

    };

  }, []);


  /* =========================================================
     GENERATE FALLING WORDS
     ========================================================= */

  useEffect(() => {

    if (!gameReady) {
      return;
    }


    const interval =
      setInterval(() => {

        const newWord = {

          text:
            words[
              Math.floor(
                Math.random() *
                words.length
              )
            ],

          id:
            Date.now() +
            Math.random(),

          left:
            Math.random() * 82 + "%",

        };


        setFallingWords(
          (prev) => [
            ...prev,
            newWord,
          ]
        );


        /*
         * Remove word after 3 seconds
         */

        setTimeout(() => {

          setFallingWords(
            (prev) =>
              prev.filter(
                (w) =>
                  w.id !== newWord.id
              )
          );

        }, 3000);

      }, 1000);


    return () =>
      clearInterval(interval);

  }, [gameReady]);


  /* =========================================================
     ACTIVITY LOGGER
     ========================================================= */

  const logActivity = async (
    finalScore
  ) => {

    const userId =
      localStorage.getItem(
        "userId"
      );


    if (!userId) {
      return;
    }


    try {

      await addDoc(
        collection(
          db,
          "activity"
        ),
        {
          userId,

          action: "play",

          module: "games",

          screen: "catch-word",

          score: finalScore,

          timestamp: new Date(),
        }
      );


      console.log(
        "📊 Catch Word activity saved"
      );

    } catch (error) {

      console.error(
        "❌ Activity logging error:",
        error
      );

    }

  };


  /* =========================================================
     SAVE DETAILED RESULT
     ========================================================= */

  const saveGameResult =
    async (finalScore) => {

      const userId =
        localStorage.getItem(
          "userId"
        );


      if (!userId) {
        return;
      }


      try {

        const userRef =
          doc(
            db,
            "users",
            userId
          );


        const gameResultsRef =
          collection(
            userRef,
            "game_results"
          );


        await addDoc(
          gameResultsRef,
          {

            game: "CatchWord",

            score: finalScore,

            totalQuestions:
              TOTAL_ROUNDS,

            accuracy:
              (
                (
                  finalScore /
                  TOTAL_ROUNDS
                ) *
                100
              ).toFixed(2),

            createdAt:
              Timestamp.now(),

          }
        );


        console.log(
          "☁️ Catch Word result saved"
        );

      } catch (error) {

        console.error(
          "❌ Result save error:",
          error
        );

      }

    };


  /* =========================================================
     START NEXT ROUND
     ========================================================= */

  const startNextRound =
    async (
      updatedScore,
      nextRound
    ) => {

      /*
       * Clear current falling words
       */

      setFallingWords([]);

      setMessage("");


      /*
       * Generate new target
       */

      const newTarget =
        randomWord();


      setScore(
        updatedScore
      );

      setRound(
        nextRound
      );

      setTarget(
        newTarget
      );


      /*
       * Save progress
       */

      await save({

        round:
          nextRound,

        score:
          updatedScore,

        target:
          newTarget,

      });

    };


  /* =========================================================
     COMPLETE GAME
     ========================================================= */

  const completeGame =
    async (finalScore) => {

      const finalPercentage =
        (
          finalScore /
          TOTAL_ROUNDS
        ) *
        100;


      console.log(
        "🏆 Catch Word completed:",
        finalScore,
        "/",
        TOTAL_ROUNDS
      );


      /*
       * Add stars + history
       * + clear active game
       */

      await finish(
        finalPercentage,
        "Catch Word"
      );


      /*
       * Activity
       */

      await logActivity(
        finalPercentage
      );


      /*
       * Detailed result
       */

      await saveGameResult(
        finalScore
      );


      setCompleted(true);

    };


  /* =========================================================
     CLICK FALLING WORD
     ========================================================= */

  const handleClick = async (
    wordObj
  ) => {

    if (!gameReady) {
      return;
    }


    /*
     * Don't allow another answer
     * while feedback is showing.
     */

    if (message) {
      return;
    }


    const isCorrect =
      wordObj.text === target;


    /*
     * Remove clicked word
     */

    setFallingWords(
      (prev) =>
        prev.filter(
          (w) =>
            w.id !== wordObj.id
        )
    );


    /* =======================================================
       CORRECT ANSWER
       ======================================================= */

    if (isCorrect) {

      const updatedScore =
        score + 1;


      setScore(
        updatedScore
      );


      setMessage(
        "Nice catch! 🎉"
      );


      /*
       * Save the successful answer
       */

      await save({

        round,

        score:
          updatedScore,

        target,

      });


      /*
       * AUTOMATICALLY MOVE TO NEXT
       *
       * Small delay so the child can
       * see the success message.
       */

      nextRoundTimer.current =
        setTimeout(
          async () => {

            /*
             * Last round
             */

            if (
              round + 1 >=
              TOTAL_ROUNDS
            ) {

              await completeGame(
                updatedScore
              );

              return;
            }


            /*
             * Next question
             */

            await startNextRound(
              updatedScore,
              round + 1
            );

          },
          800
        );


      return;
    }


    /* =======================================================
       WRONG ANSWER
       ======================================================= */

    setMessage(
      "Oops! 💛"
    );

  };


  /* =========================================================
     MANUAL NEXT FOR WRONG ANSWER
     
     We keep this behavior from your original logic.
     Correct answers move automatically.
     ========================================================= */

  const nextAfterWrong =
    async () => {

      if (!message) {
        return;
      }


      if (
        message.includes(
          "Nice"
        )
      ) {
        return;
      }


      /*
       * Wrong answer does not
       * increase score.
       */

      if (
        round + 1 >=
        TOTAL_ROUNDS
      ) {

        await completeGame(
          score
        );

        return;
      }


      await startNextRound(
        score,
        round + 1
      );

    };


  /* =========================================================
     LOADING
     ========================================================= */

  if (!gameReady) {

    return (
      <div
        style={{
          minHeight:
            "100vh",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          fontFamily:
            "'Nunito', sans-serif",

          backgroundImage:
            `url(${jungleBg})`,

          backgroundSize:
            "cover",

          backgroundPosition:
            "center",

          color:
            "#fff",
        }}
      >

        <div
          style={{
            background:
              "#124d36",

            border:
              "5px solid #e7bd63",

            borderRadius:
              "24px",

            padding:
              "35px 60px",

            fontSize:
              "24px",

            fontWeight:
              800,

            boxShadow:
              "0 8px 0 #633719",
          }}
        >

          🌿 Loading Catch the Word...

        </div>

      </div>
    );

  }


  /* =========================================================
     GAME COMPLETE
     ========================================================= */

  if (completed) {

    return (
      <div
        style={{
          minHeight:
            "100vh",

          width:
            "100%",

          backgroundImage:
            `linear-gradient(
              rgba(20, 80, 50, 0.12),
              rgba(20, 80, 50, 0.12)
            ), url(${jungleBg})`,

          backgroundSize:
            "cover",

          backgroundPosition:
            "center",

          fontFamily:
            "'Nunito', sans-serif",

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          color:
            "#173f31",

          paddingBottom:
            "50px",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            width:
              "100%",

            minHeight:
              "90px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            background:
              "linear-gradient(90deg, #0c5236, #116944, #0c5236)",

            borderBottom:
              "5px solid #e7bd63",

            boxShadow:
              "0 6px 18px rgba(0,0,0,.25)",

            color:
              "#fff",

            position:
              "sticky",

            top:
              0,

            zIndex:
              100,
          }}
        >

          <h1
            style={{
              margin:
                0,

              fontFamily:
                "'Baloo 2', sans-serif",

              fontSize:
                "clamp(30px, 4vw, 48px)",

              fontWeight:
                800,
            }}
          >
            Catch the Word
          </h1>

        </div>


        {/* COMPLETION WOODEN GRID */}

        <div
          style={{
            width:
              "min(700px, 88vw)",

            marginTop:
              "70px",

            padding:
              "50px 40px",

            textAlign:
              "center",

            border:
              "7px solid #633719",

            borderRadius:
              "30px",

            background:
              "repeating-linear-gradient(0deg, rgba(92,48,22,.07) 0px, rgba(92,48,22,.07) 3px, transparent 3px, transparent 9px), linear-gradient(145deg, #bd7840, #96572b, #bd7840)",

            boxShadow:
              "inset 0 0 0 3px rgba(255,208,123,.35), 0 10px 0 #633719, 0 20px 35px rgba(0,0,0,.3)",
          }}
        >

          <div
            style={{
              fontSize:
                "70px",
            }}
          >
            🎉
          </div>


          <h2
            style={{
              margin:
                "10px 0",

              color:
                "#fff5d5",

              fontFamily:
                "'Baloo 2', sans-serif",

              fontSize:
                "clamp(30px, 5vw, 46px)",

              textShadow:
                "0 3px 0 #633719",
            }}
          >
            Jungle Adventure Complete!
          </h2>


          <p
            style={{
              color:
                "#fff5d5",

              fontSize:
                "20px",

              fontWeight:
                800,
            }}
          >
            You finished all {TOTAL_ROUNDS} rounds!
          </p>


          <div
            style={{
              display:
                "inline-flex",

              flexDirection:
                "column",

              alignItems:
                "center",

              marginTop:
                "15px",

              padding:
                "18px 40px",

              borderRadius:
                "20px",

              background:
                "#fff5d5",

              border:
                "4px solid #e7bd63",

              boxShadow:
                "0 5px 0 #633719",
            }}
          >

            <span
              style={{
                fontSize:
                  "12px",

                fontWeight:
                  900,

                letterSpacing:
                  "2px",

                color:
                  "#6b8060",
              }}
            >
              FINAL SCORE
            </span>


            <strong
              style={{
                color:
                  "#237b4d",

                fontFamily:
                  "'Baloo 2', sans-serif",

                fontSize:
                  "52px",

                lineHeight:
                  1,
              }}
            >
              {score} / {TOTAL_ROUNDS}
            </strong>

          </div>

        </div>

      </div>
    );

  }


  /* =========================================================
     MAIN GAME
     ========================================================= */

  return (

    <div
      style={{
        minHeight:
          "100vh",

        width:
          "100%",

        overflow:
          "hidden",

        backgroundImage:
          `linear-gradient(
            rgba(20, 80, 50, 0.10),
            rgba(20, 80, 50, 0.10)
          ), url(${jungleBg})`,

        backgroundSize:
          "cover",

        backgroundPosition:
          "center",

        backgroundAttachment:
          "fixed",

        fontFamily:
          "'Nunito', sans-serif",

        color:
          "#173f31",

        position:
          "relative",
      }}
    >

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div
        style={{
          width:
            "100%",

          height:
            "88px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          position:
            "sticky",

          top:
            0,

          zIndex:
            100,

          background:
            "linear-gradient(90deg, rgba(12,82,54,.98), rgba(17,105,68,.98), rgba(12,82,54,.98))",

          borderBottom:
            "5px solid #e7bd63",

          boxShadow:
            "0 5px 18px rgba(0,0,0,.28)",
        }}
      >

        <h1
          style={{
            margin:
              0,

            color:
              "#fff",

            fontFamily:
              "'Baloo 2', sans-serif",

            fontSize:
              "clamp(30px, 4vw, 48px)",

            fontWeight:
              800,

            textShadow:
              "0 3px 0 rgba(0,0,0,.2)",
          }}
        >
          Catch the Word
        </h1>

      </div>


      {/* =====================================================
          ROUND + SCORE
          ===================================================== */}

      <div
        style={{
          width:
            "min(1200px, 92vw)",

          margin:
            "25px auto 0",

          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          position:
            "relative",

          zIndex:
            20,
        }}
      >

        {/* ROUND */}

        <div
          style={{
            padding:
              "12px 24px",

            border:
              "4px solid #633719",

            borderRadius:
              "18px",

            background:
              "linear-gradient(145deg, #bd7840, #96572b)",

            color:
              "#fff5d5",

            fontSize:
              "20px",

            fontWeight:
              900,

            boxShadow:
              "0 5px 0 #633719",
          }}
        >

          ROUND{" "}
          <span
            style={{
              fontSize:
                "28px",

              color:
                "#ffe878",
            }}
          >
            {round + 1}
          </span>

          {" / "}

          {TOTAL_ROUNDS}

        </div>


        {/* SCORE */}

        <div
          style={{
            padding:
              "12px 24px",

            border:
              "4px solid #155333",

            borderRadius:
              "18px",

            background:
              "linear-gradient(145deg, #2c8c59, #1d7048)",

            color:
              "#fff",

            fontSize:
              "20px",

            fontWeight:
              900,

            boxShadow:
              "0 5px 0 #0d4228",
          }}
        >

          ⭐ Score:{" "}

          <span
            style={{
              fontSize:
                "28px",
            }}
          >
            {score}
          </span>

        </div>

      </div>


      {/* =====================================================
          TARGET
          ===================================================== */}

      <div
        style={{
          textAlign:
            "center",

          marginTop:
            "25px",

          position:
            "relative",

          zIndex:
            10,
        }}
      >

        <p
          style={{
            margin:
              "0 0 10px",

            color:
              "#fff",

            fontSize:
              "clamp(22px, 3vw, 34px)",

            fontFamily:
              "'Baloo 2', sans-serif",

            fontWeight:
              800,

            textShadow:
              "0 3px 0 rgba(50,70,40,.7)",
          }}
        >
          Catch:{" "}

          <strong
            style={{
              color:
                "#fff1a8",
            }}
          >
            {target}
          </strong>

        </p>

      </div>


      {/* =====================================================
          LARGE WOODEN GAME GRID
          ===================================================== */}

      <div
        style={{
          width:
            "min(1100px, 90vw)",

          height:
            "min(560px, 58vh)",

          minHeight:
            "450px",

          margin:
            "20px auto 40px",

          position:
            "relative",

          overflow:
            "hidden",

          border:
            "8px solid #633719",

          borderRadius:
            "30px",

          background:
            "repeating-linear-gradient(0deg, rgba(92,48,22,.06) 0px, rgba(92,48,22,.06) 3px, transparent 3px, transparent 9px), repeating-linear-gradient(90deg, rgba(92,48,22,.035) 0px, rgba(92,48,22,.035) 2px, transparent 2px, transparent 13px), linear-gradient(145deg, #b96f35, #96572b 45%, #b87538)",

          boxShadow:
            "inset 0 0 0 4px rgba(255,211,130,.28), inset 0 0 35px rgba(80,38,15,.18), 0 10px 0 #633719, 0 18px 35px rgba(0,0,0,.28)",
        }}
      >

        {/* INNER WOODEN BORDER */}

        <div
          style={{
            position:
              "absolute",

            inset:
              "12px",

            border:
              "3px solid rgba(255,215,145,.35)",

            borderRadius:
              "20px",

            pointerEvents:
              "none",

            zIndex:
              1,
          }}
        />


        {/* INSTRUCTION INSIDE BOARD */}

        <div
          style={{
            position:
              "absolute",

            top:
              "20px",

            left:
              "50%",

            transform:
              "translateX(-50%)",

            zIndex:
              5,

            padding:
              "9px 22px",

            borderRadius:
              "999px",

            background:
              "rgba(255,245,213,.94)",

            color:
              "#174d37",

            fontWeight:
              900,

            fontSize:
              "16px",

            boxShadow:
              "0 4px 0 #633719",
          }}
        >
          Catch the correct word!
        </div>


        {/* ===================================================
            FALLING WORDS
            =================================================== */}

        {fallingWords.map(
          (word) => (

            <div
              key={word.id}

              onClick={() =>
                handleClick(word)
              }

              style={{
                position:
                  "absolute",

                left:
                  word.left,

                top:
                  "-70px",

                width:
                  "145px",

                minHeight:
                  "70px",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                padding:
                  "10px 18px",

                cursor:
                  "pointer",

                userSelect:
                  "none",

                zIndex:
                  10,

                color:
                  "#fff7dc",

                fontFamily:
                  "'Baloo 2', sans-serif",

                fontSize:
                  "28px",

                fontWeight:
                  800,

                border:
                  "5px solid #633719",

                borderRadius:
                  "18px",

                background:
                  "linear-gradient(145deg, #c98242, #96572b)",

                boxShadow:
                  "inset 0 0 0 2px rgba(255,215,145,.28), 0 6px 0 #633719, 0 10px 18px rgba(0,0,0,.25)",

                animation:
                  "catchWordFall 3s linear forwards",
              }}
            >

              {word.text}

            </div>

          )
        )}


        {/* ===================================================
            EMPTY BOARD MESSAGE
            =================================================== */}

        {fallingWords.length === 0 &&
          !message && (

            <div
              style={{
                position:
                  "absolute",

                left:
                  "50%",

                top:
                  "50%",

                transform:
                  "translate(-50%, -50%)",

                color:
                  "#fff0c7",

                fontFamily:
                  "'Baloo 2', sans-serif",

                fontSize:
                  "26px",

                fontWeight:
                  800,

                opacity:
                  0.9,

                textShadow:
                  "0 3px 0 #633719",
              }}
            >
              🌿 Watch carefully...
            </div>

          )}

      </div>


      {/* =====================================================
          FEEDBACK
          ===================================================== */}

      {message && (

        <div
          style={{
            width:
              "fit-content",

            minWidth:
              "220px",

            margin:
              "-15px auto 25px",

            padding:
              "14px 28px",

            textAlign:
              "center",

            border:
              "4px solid #e7bd63",

            borderRadius:
              "18px",

            background:
              "#fff5d5",

            color:
              message.includes("Nice")
                ? "#237b4d"
                : "#9b552c",

            fontFamily:
              "'Baloo 2', sans-serif",

            fontSize:
              "24px",

            fontWeight:
              900,

            boxShadow:
              "0 5px 0 #633719",

            position:
              "relative",

            zIndex:
              30,
          }}
        >

          {message}

        </div>

      )}


      {/* =====================================================
          WRONG ANSWER BUTTON
          
          Correct answers DON'T need this.
          They automatically move to the next question.
          ===================================================== */}

      {message.includes("Oops") && (

        <button
          onClick={
            nextAfterWrong
          }

          style={{
            display:
              "block",

            margin:
              "0 auto 40px",

            padding:
              "13px 32px",

            border:
              "4px solid #633719",

            borderRadius:
              "999px",

            background:
              "linear-gradient(145deg, #2c8c59, #1d7048)",

            color:
              "#fff",

            fontFamily:
              "'Baloo 2', sans-serif",

            fontSize:
              "20px",

            fontWeight:
              900,

            cursor:
              "pointer",

            boxShadow:
              "0 5px 0 #0d4228",

            position:
              "relative",

            zIndex:
              30,
          }}
        >
          Next →
        </button>

      )}


      {/* =====================================================
          INLINE ANIMATION
          ===================================================== */}

      <style>
        {`

          @import url(
            'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@500;600;700;800;900&display=swap'
          );

          @keyframes catchWordFall {

            0% {
              transform:
                translateY(-80px)
                rotate(-2deg);

              opacity: 0;
            }

            8% {
              opacity: 1;
            }

            100% {
              transform:
                translateY(
                  calc(
                    min(560px, 58vh) + 120px
                  )
                )
                rotate(2deg);

              opacity: 1;
            }

          }


          * {
            box-sizing: border-box;
          }


          @media (max-width: 700px) {

            .catch-word-mobile {
              width: 94vw;
            }

          }

        `}
      </style>

    </div>
  );
}