import { useEffect, useState } from "react";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

import useGameProgress from "../hooks/useGameProgress";

import jungleBg from "../assets/gamesHome.png";


const GAME_ID = "fill-bucket";
const TOTAL_ROUNDS = 5;


const INITIAL_STATE = {
  target: null,
  bucket: [],
  message: "",
  score: 0,
  round: 1,
  completed: false,
};


export default function FillBucket({ goBack }) {

  // =========================================================
  // GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    INITIAL_STATE
  );


  // =========================================================
  // HELPERS
  // =========================================================

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 6) + 2;
  };


  const getItem = (num) => {
    if (num <= 2) return "🍎";
    if (num <= 4) return "🍌";
    if (num <= 6) return "🍇";
    return "🍓";
  };


  // =========================================================
  // STATES
  // =========================================================

  const [target, setTarget] = useState(
    getRandomNumber()
  );

  const [bucket, setBucket] = useState([]);

  const [message, setMessage] = useState("");

  const [score, setScore] = useState(0);

  const [round, setRound] = useState(1);

  const [gameFinished, setGameFinished] = useState(false);

  const [restored, setRestored] = useState(false);

  const [processing, setProcessing] = useState(false);


  const item = getItem(target);


  // =========================================================
  // RESTORE FIREBASE PROGRESS
  // =========================================================

  useEffect(() => {

    if (progressLoading) return;

    if (restored) return;


    console.log(
      "🔥 Fill Bucket saved state:",
      savedState
    );


    if (savedState) {

      setTarget(
        savedState.target ?? getRandomNumber()
      );

      setBucket(
        savedState.bucket ?? []
      );

      setMessage(
        savedState.message ?? ""
      );

      setScore(
        savedState.score ?? 0
      );

      setRound(
        savedState.round ?? 1
      );

      setGameFinished(
        savedState.completed ?? false
      );

    } else {

      const initialTarget =
        getRandomNumber();

      setTarget(initialTarget);

      save({
        target: initialTarget,
        bucket: [],
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
  ]);


  // =========================================================
  // ACTIVITY LOGGER
  // =========================================================

  const logActivity = async (finalScore) => {

    try {

      const userId =
        localStorage.getItem("userId");


      if (!userId) return;


      await addDoc(
        collection(db, "activity"),
        {
          userId,
          action: "play",
          module: "math",
          screen: "fill-bucket",
          score: finalScore,
          timestamp: new Date(),
        }
      );


      console.log(
        "✅ Fill Bucket activity logged"
      );

    } catch (error) {

      console.error(
        "❌ Activity logging failed:",
        error
      );

    }

  };


  // =========================================================
  // DRAG START
  // =========================================================

  const handleDragStart = (e) => {

    e.dataTransfer.setData(
      "item",
      item
    );

  };


  // =========================================================
  // ALLOW DROP
  // =========================================================

  const allowDrop = (e) => {

    e.preventDefault();

  };


  // =========================================================
  // DROP
  // =========================================================

  const handleDrop = async (e) => {

    e.preventDefault();


    if (processing) return;

    if (gameFinished) return;

    if (bucket.length >= target) return;


    const newItem = {
      id: Date.now(),
    };


    const newBucket = [
      ...bucket,
      newItem,
    ];


    setBucket(newBucket);


    // =======================================================
    // BUCKET NOT FULL
    // =======================================================

    if (newBucket.length < target) {

      await save({
        target,
        bucket: newBucket,
        message: "",
        score,
        round,
        completed: false,
      });

      return;

    }


    // =======================================================
    // CORRECT ANSWER
    // =======================================================

    const updatedScore =
      score + 1;


    setMessage(
      "Perfect! 🎉"
    );

    setScore(
      updatedScore
    );

    setProcessing(
      true
    );


    await save({
      target,
      bucket: newBucket,
      message: "Perfect! 🎉",
      score: updatedScore,
      round,
      completed: false,
    });


    // =======================================================
    // AUTOMATIC NEXT ROUND
    // =======================================================

    setTimeout(async () => {

      // =====================================================
      // FINAL ROUND
      // =====================================================

      if (round === TOTAL_ROUNDS) {

        const finalPercentage =
          (updatedScore / TOTAL_ROUNDS) * 100;


        console.log(
          "🏁 Fill Bucket completed:",
          {
            score: updatedScore,
            total: TOTAL_ROUNDS,
            percentage: finalPercentage,
          }
        );


        setGameFinished(true);


        await finish(
          finalPercentage,
          "Fill Bucket"
        );


        await logActivity(
          finalPercentage
        );


        setBucket([]);

        setMessage("");

        setProcessing(false);

        return;

      }


      // =====================================================
      // NEXT ROUND
      // =====================================================

      const nextRound =
        round + 1;


      const nextTarget =
        getRandomNumber();


      setRound(
        nextRound
      );

      setBucket([]);

      setMessage("");

      setTarget(
        nextTarget
      );


      await save({

        target:
          nextTarget,

        bucket: [],

        message: "",

        score:
          updatedScore,

        round:
          nextRound,

        completed:
          false,

      });


      setProcessing(false);

    }, 800);

  };


  // =========================================================
  // RESET
  // =========================================================

  const reset = async () => {

    const newTarget =
      getRandomNumber();


    setTarget(
      newTarget
    );

    setBucket([]);

    setMessage("");

    setScore(0);

    setRound(1);

    setGameFinished(false);

    setProcessing(false);


    await save({

      target:
        newTarget,

      bucket: [],

      message: "",

      score: 0,

      round: 1,

      completed: false,

    });

  };


  // =========================================================
  // COMMON STYLES
  // =========================================================

  const woodBackground =
    "linear-gradient(145deg, #c47a3d 0%, #a85f2d 45%, #c47a3d 100%)";


  const woodTexture =
    "repeating-linear-gradient(0deg, rgba(92,48,22,0.10) 0px, rgba(92,48,22,0.10) 2px, transparent 2px, transparent 8px), repeating-linear-gradient(90deg, rgba(255,220,160,0.05) 0px, rgba(255,220,160,0.05) 2px, transparent 2px, transparent 12px)";


  const woodenBox = {
    backgroundImage:
      `${woodTexture}, ${woodBackground}`,

    border:
      "6px solid #633719",

    borderRadius:
      "24px",

    boxShadow:
      "inset 0 0 0 3px rgba(255,220,160,0.35), 0 8px 0 #4e2915, 0 15px 30px rgba(0,0,0,0.25)",
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    progressLoading ||
    !restored
  ) {

    return (

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundImage: `url(${jungleBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >

        <div
          style={{
            ...woodenBox,
            padding: "35px 55px",
            color: "#fff5d5",
            fontSize: "25px",
            fontWeight: 800,
          }}
        >
          🌿 Restoring your jungle game...
        </div>

      </div>

    );

  }


  // =========================================================
  // COMPLETED SCREEN
  // =========================================================

  if (gameFinished) {

    const percentage =
      (score / TOTAL_ROUNDS) * 100;


    return (

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundImage: `url(${jungleBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "Arial, sans-serif",
          paddingBottom: "50px",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            height: "90px",
            width: "100%",
            background:
              "linear-gradient(90deg, #075336, #0d6845, #075336)",
            borderBottom:
              "5px solid #e7bd63",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow:
              "0 5px 15px rgba(0,0,0,0.3)",
          }}
        >

          <h1
            style={{
              color: "#ffffff",
              margin: 0,
              fontSize: "42px",
              fontWeight: 900,
            }}
          >
            Fill the Bucket
          </h1>

        </div>


        {/* COMPLETION BOARD */}

        <div
          style={{
            ...woodenBox,
            width: "min(800px, 88vw)",
            margin: "70px auto",
            padding: "50px",
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "70px",
            }}
          >
            🪣🎉
          </div>


          <h2
            style={{
              margin: "10px 0",
              color: "#fff5d5",
              fontSize: "42px",
              textShadow:
                "0 3px 0 #633719",
            }}
          >
            Game Completed!
          </h2>


          <p
            style={{
              color: "#fff5d5",
              fontSize: "21px",
              fontWeight: 700,
            }}
          >
            Amazing work! You filled every bucket! 🌿
          </p>


          <div
            style={{
              display: "inline-block",
              marginTop: "15px",
              padding: "18px 40px",
              background: "#fff5d5",
              border: "4px solid #e7bd63",
              borderRadius: "20px",
              boxShadow:
                "0 5px 0 #633719",
            }}
          >

            <div
              style={{
                fontSize: "14px",
                fontWeight: 900,
                color: "#52705d",
                letterSpacing: "2px",
              }}
            >
              FINAL SCORE
            </div>


            <div
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#237b4d",
              }}
            >
              {score} / {TOTAL_ROUNDS}
            </div>


            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#237b4d",
              }}
            >
              Accuracy: {percentage.toFixed(0)}%
            </div>

          </div>


          <br />


          <button
            onClick={reset}
            style={{
              marginTop: "25px",
              padding: "14px 35px",
              border: "4px solid #633719",
              borderRadius: "30px",
              background:
                "linear-gradient(145deg, #2c8c59, #1d7048)",
              color: "#fff",
              fontSize: "20px",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow:
                "0 5px 0 #0d4228",
            }}
          >
            Play Again →
          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN GAME
  // =========================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${jungleBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "60px",
        overflowX: "hidden",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          height: "90px",
          width: "100%",
          background:
            "linear-gradient(90deg, #075336, #0d6845, #075336)",
          borderBottom:
            "5px solid #e7bd63",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow:
            "0 5px 15px rgba(0,0,0,0.3)",
        }}
      >

        <h1
          style={{
            color: "#ffffff",
            margin: 0,
            fontSize: "42px",
            fontWeight: 900,
          }}
        >
          Fill the Bucket
        </h1>

      </div>


      {/* =====================================================
          ROUND + SCORE
      ===================================================== */}

      <div
        style={{
          width: "min(1200px, 92vw)",
          margin: "25px auto 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        {/* ROUND */}

        <div
          style={{
            ...woodenBox,
            padding: "12px 25px",
            color: "#fff5d5",
            fontSize: "20px",
            fontWeight: 900,
          }}
        >

          ROUND{" "}

          <span
            style={{
              fontSize: "27px",
              color: "#ffe875",
            }}
          >
            {round}
          </span>

          {" / "}

          {TOTAL_ROUNDS}

        </div>


        {/* SCORE */}

        <div
          style={{
            padding: "12px 25px",
            border: "5px solid #155333",
            borderRadius: "18px",
            background:
              "linear-gradient(145deg, #2c8c59, #1d7048)",
            color: "#fff",
            fontSize: "20px",
            fontWeight: 900,
            boxShadow:
              "0 5px 0 #0d4228",
          }}
        >

          ⭐ Score:{" "}

          <span
            style={{
              fontSize: "27px",
            }}
          >
            {score}
          </span>

        </div>

      </div>


      {/* =====================================================
          INSTRUCTION
      ===================================================== */}

      <div
        style={{
          textAlign: "center",
          marginTop: "25px",
        }}
      >

        <h2
          style={{
            margin: 0,
            color: "#fff5d5",
            fontSize: "38px",
            fontWeight: 900,
            textShadow:
              "0 4px 0 #633719",
          }}
        >

          Drag{" "}

          <span
            style={{
              color: "#ffe875",
            }}
          >
            {target}
          </span>

          {" "}

          {item} into bucket

        </h2>

      </div>


      {/* =====================================================
          LARGE WOODEN GAME BOARD
      ===================================================== */}

      <div
        style={{
          ...woodenBox,

          width: "min(1050px, 90vw)",

          minHeight: "570px",

          margin: "30px auto 0",

          padding: "45px",

          position: "relative",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          backgroundImage:
            `${woodTexture}, ${woodBackground}`,
        }}
      >

        {/* INNER BORDER */}

        <div
          style={{
            position: "absolute",
            inset: "14px",
            border:
              "3px solid rgba(255,220,160,0.35)",
            borderRadius: "18px",
            pointerEvents: "none",
          }}
        />


        {/* =================================================
            FRUIT
        ================================================= */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
          }}
        >

          <div
            style={{
              color: "#fff5d5",
              fontSize: "20px",
              fontWeight: 800,
              marginBottom: "12px",
              textShadow:
                "0 2px 0 #633719",
            }}
          >
            Drag this fruit
          </div>


          <div
            draggable={!processing}

            onDragStart={
              handleDragStart
            }

            style={{
              width: "125px",
              height: "125px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background: "#fff5d5",

              border:
                "6px solid #e7bd63",

              borderRadius: "25px",

              fontSize: "70px",

              cursor:
                processing
                  ? "default"
                  : "grab",

              userSelect: "none",

              boxShadow:
                "0 7px 0 #633719, 0 12px 20px rgba(0,0,0,0.25)",
            }}
          >
            {item}
          </div>

        </div>


        {/* =================================================
            BUCKET / DROP AREA
        ================================================= */}

        <div
          onDragOver={allowDrop}

          onDrop={handleDrop}

          style={{
            position: "relative",
            zIndex: 2,

            width: "min(720px, 85vw)",

            minHeight: "230px",

            marginTop: "45px",

            padding: "30px",

            display: "flex",

            flexWrap: "wrap",

            alignItems: "center",

            justifyContent: "center",

            alignContent: "center",

            gap: "14px",

            border:
              "7px solid #633719",

            borderRadius: "28px",

            backgroundImage:
              `${woodTexture}, linear-gradient(145deg, #a96331, #81491f)`,

            boxShadow:
              "inset 0 0 0 3px rgba(255,220,160,0.28), inset 0 0 25px rgba(50,25,10,0.2), 0 8px 0 #4d2913",
          }}
        >

          {/* EMPTY BUCKET */}

          {bucket.length === 0 && (

            <div
              style={{
                width: "100%",
                textAlign: "center",
                color: "#fff5d5",
                fontSize: "28px",
                fontWeight: 900,
                textShadow:
                  "0 3px 0 #633719",
              }}
            >
              🪣 Drop the fruit here
            </div>

          )}


          {/* FRUITS INSIDE BUCKET */}

          {bucket.map((b) => (

            <div
              key={b.id}
              style={{
                width: "70px",
                height: "70px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "#fff5d5",

                border:
                  "4px solid #e7bd63",

                borderRadius: "18px",

                fontSize: "42px",

                boxShadow:
                  "0 5px 0 #633719",
              }}
            >
              {item}
            </div>

          ))}

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div
          style={{
            position: "relative",
            zIndex: 2,

            marginTop: "22px",

            padding: "9px 24px",

            borderRadius: "999px",

            background: "#fff5d5",

            border:
              "3px solid #e7bd63",

            color: "#174d37",

            fontSize: "17px",

            fontWeight: 900,

            boxShadow:
              "0 4px 0 #633719",
          }}
        >
          {bucket.length} / {target} collected
        </div>


        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (

          <div
            style={{
              position: "relative",
              zIndex: 5,

              marginTop: "18px",

              padding: "10px 28px",

              borderRadius: "999px",

              background: "#fff5d5",

              border:
                "4px solid #e7bd63",

              color: "#237b4d",

              fontSize: "24px",

              fontWeight: 900,

              boxShadow:
                "0 5px 0 #633719",
            }}
          >
            {message}
          </div>

        )}

      </div>

    </div>

  );

}