import React, { useEffect, useMemo, useState } from "react";

import { useGame } from "../context/GameContext";

import useGameProgress from "../hooks/useGameProgress";

import "../styles/SpotDifference.css";



/*

  Picture-based Spot the Difference



  5 different scenes rotate.

  Each scene contains one visual difference.



  Firebase:

  - Saves active game progress

  - Resumes after refresh

  - Awards stars through completeGame()

  - Saves history/streak through GameContext

*/



const GAME_ID = "spot-difference-pictures";

const TOTAL_QUESTIONS = 5;



/* -------------------------------------------------------

   SCENE DATA

\------------------------------------------------------- */



const SCENES = [

  {

    id: "garden",

    title: "The Bunny Garden",

    emoji: "🐰",

    difference: "butterfly",

  },

  {

    id: "safari",

    title: "Sunny Safari",

    emoji: "🦁",

    difference: "tree",

  },

  {

    id: "beach",

    title: "Happy Beach",

    emoji: "🏖️",

    difference: "ball",

  },

  {

    id: "space",

    title: "Little Space Trip",

    emoji: "🚀",

    difference: "star",

  },

  {

    id: "bakery",

    title: "Sweet Bakery",

    emoji: "🧁",

    difference: "cupcake",

  },

];



/* -------------------------------------------------------

   SHUFFLE

\------------------------------------------------------- */



function shuffle(array) {

  const copy = [...array];



  for (let i = copy.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));



    [copy[i], copy[j]] = [copy[j], copy[i]];

  }



  return copy;

}



/* -------------------------------------------------------

   SVG SCENE COMPONENTS

\------------------------------------------------------- */



function GardenScene({ different }) {

  return (

    <svg

      viewBox="0 0 500 330"

      className="scene-svg"

      role="img"

      aria-label="Bunny garden picture"

    >

      {/* sky */}

      <rect width="500" height="330" fill="#dff5ff" />



      {/* clouds */}

      <g fill="#ffffff">

        <circle cx="85" cy="65" r="25" />

        <circle cx="115" cy="65" r="32" />

        <circle cx="145" cy="65" r="23" />



        <circle cx="365" cy="75" r="22" />

        <circle cx="395" cy="75" r="30" />

        <circle cx="425" cy="75" r="20" />

      </g>



      {/* sun */}

      <circle cx="440" cy="45" r="25" fill="#ffd85c" />



      {/* grass */}

      <rect y="200" width="500" height="130" fill="#9bdc83" />



      {/* tree */}

      <rect x="60" y="125" width="25" height="100" rx="10" fill="#8b5e3c" />

      <circle cx="72" cy="110" r="55" fill="#55b95d" />

      <circle cx="35" cy="135" r="35" fill="#69c96b" />

      <circle cx="108" cy="135" r="35" fill="#69c96b" />



      {/* house */}

      <rect x="330" y="145" width="100" height="85" rx="4" fill="#ffd28a" />

      <polygon points="320,150 380,95 440,150" fill="#e97862" />

      <rect x="370" y="185" width="25" height="45" fill="#8b6547" />

      <rect x="345" y="165" width="22" height="22" fill="#9edfff" />

      <rect x="402" y="165" width="22" height="22" fill="#9edfff" />



      {/* flowers */}

      <g>

        <line x1="170" y1="245" x2="170" y2="290" stroke="#4c9a45" strokeWidth="5" />

        <circle cx="170" cy="238" r="12" fill="#ff7ca8" />



        <line x1="215" y1="250" x2="215" y2="292" stroke="#4c9a45" strokeWidth="5" />

        <circle cx="215" cy="243" r="12" fill="#ffd85c" />



        <line x1="260" y1="245" x2="260" y2="290" stroke="#4c9a45" strokeWidth="5" />

        <circle cx="260" cy="238" r="12" fill="#b995e8" />

      </g>



      {/* bunny */}

      <g>

        <ellipse cx="285" cy="240" rx="34" ry="38" fill="#ffffff" />

        <circle cx="285" cy="195" r="30" fill="#ffffff" />



        <ellipse

          cx="270"

          cy="158"

          rx="10"

          ry="28"

          fill="#ffffff"

        />



        <ellipse

          cx="300"

          cy="158"

          rx="10"

          ry="28"

          fill="#ffffff"

        />



        <circle cx="275" cy="193" r="4" fill="#333" />

        <circle cx="295" cy="193" r="4" fill="#333" />



        <circle cx="285" cy="202" r="5" fill="#ff9eb5" />



        <path

          d="M278 209 Q285 215 292 209"

          fill="none"

          stroke="#333"

          strokeWidth="3"

        />

      </g>



      {/* butterfly exists only in right image */}

      {different && (

        <g>

          <ellipse cx="145" cy="180" rx="13" ry="18" fill="#8d79e8" />

          <ellipse cx="170" cy="180" rx="13" ry="18" fill="#ff7ca8" />

          <rect x="154" y="172" width="7" height="28" rx="3" fill="#57405c" />

          <circle cx="158" cy="168" r="5" fill="#57405c" />

        </g>

      )}

    </svg>

  );

}



function SafariScene({ different }) {

  return (

    <svg

      viewBox="0 0 500 330"

      className="scene-svg"

      role="img"

      aria-label="Safari picture"

    >

      <rect width="500" height="330" fill="#bfeeff" />



      {/* sun */}

      <circle cx="425" cy="55" r="35" fill="#ffd75e" />



      {/* clouds */}

      <g fill="#fff">

        <circle cx="85" cy="65" r="25" />

        <circle cx="115" cy="65" r="32" />

        <circle cx="145" cy="65" r="23" />

      </g>



      {/* ground */}

      <rect y="205" width="500" height="125" fill="#e5c878" />



      {/* distant bushes */}

      <circle cx="80" cy="200" r="45" fill="#75b85b" />

      <circle cx="135" cy="205" r="35" fill="#67a951" />

      <circle cx="405" cy="200" r="45" fill="#75b85b" />



      {/* tree only on right */}

      {different && (

        <g>

          <rect x="70" y="105" width="22" height="105" fill="#8a5c38" />

          <circle cx="80" cy="95" r="55" fill="#55a94f" />

          <circle cx="42" cy="120" r="35" fill="#67b85b" />

          <circle cx="118" cy="120" r="35" fill="#67b85b" />

        </g>

      )}



      {/* lion */}

      <g>

        <circle cx="275" cy="180" r="48" fill="#d48b32" />

        <circle cx="275" cy="180" r="34" fill="#f2bd62" />



        <circle cx="262" cy="175" r="5" fill="#333" />

        <circle cx="288" cy="175" r="5" fill="#333" />



        <ellipse cx="275" cy="192" rx="9" ry="7" fill="#53372b" />



        <path

          d="M266 202 Q275 210 284 202"

          fill="none"

          stroke="#53372b"

          strokeWidth="3"

        />



        <circle cx="275" cy="135" r="16" fill="#e7a34c" />

        <circle cx="235" cy="150" r="16" fill="#e7a34c" />

        <circle cx="315" cy="150" r="16" fill="#e7a34c" />

      </g>



      {/* little rocks */}

      <ellipse cx="150" cy="260" rx="25" ry="12" fill="#9e855e" />

      <ellipse cx="380" cy="270" rx="28" ry="13" fill="#9e855e" />

    </svg>

  );

}



function BeachScene({ different }) {

  return (

    <svg

      viewBox="0 0 500 330"

      className="scene-svg"

      role="img"

      aria-label="Beach picture"

    >

      {/* sky */}

      <rect width="500" height="330" fill="#bcecff" />



      {/* sun */}

      <circle cx="425" cy="50" r="32" fill="#ffd75e" />



      {/* ocean */}

      <rect y="155" width="500" height="75" fill="#64c8e8" />



      {/* waves */}

      <path

        d="M0 180 Q40 160 80 180 T160 180 T240 180 T320 180 T400 180 T480 180"

        fill="none"

        stroke="#ffffff"

        strokeWidth="8"

      />



      {/* sand */}

      <rect y="230" width="500" height="100" fill="#f6d99a" />



      {/* umbrella */}

      <rect x="100" y="135" width="8" height="110" fill="#8c6746" />

      <path d="M50 140 Q105 75 160 140 Z" fill="#ff7d7d" />

      <path d="M75 112 Q105 88 135 112" fill="#ffd45d" />



      {/* bucket */}

      <path d="M350 255 L395 255 L385 295 L360 295 Z" fill="#ef6e8e" />

      <path

        d="M355 255 Q372 230 390 255"

        fill="none"

        stroke="#6b8ed8"

        strokeWidth="7"

      />



      {/* ball only on right */}

      {different && (

        <g>

          <circle cx="250" cy="270" r="25" fill="#ff8f66" />

          <path

            d="M230 260 Q250 275 270 260"

            fill="none"

            stroke="#fff"

            strokeWidth="5"

          />

          <path

            d="M240 250 Q250 270 260 290"

            fill="none"

            stroke="#fff"

            strokeWidth="5"

          />

        </g>

      )}

    </svg>

  );

}



function SpaceScene({ different }) {

  return (

    <svg

      viewBox="0 0 500 330"

      className="scene-svg"

      role="img"

      aria-label="Space picture"

    >

      <rect width="500" height="330" fill="#17244d" />



      {/* stars */}

      <circle cx="70" cy="60" r="4" fill="#fff" />

      <circle cx="145" cy="110" r="5" fill="#fff" />

      <circle cx="390" cy="95" r="4" fill="#fff" />

      <circle cx="450" cy="170" r="5" fill="#fff" />



      {/* moon */}

      <circle cx="80" cy="245" r="42" fill="#f0e6c8" />

      <circle cx="65" cy="232" r="7" fill="#d5c8aa" />

      <circle cx="95" cy="260" r="9" fill="#d5c8aa" />



      {/* planet */}

      <circle cx="400" cy="245" r="42" fill="#d8799b" />

      <ellipse

        cx="400"

        cy="245"

        rx="65"

        ry="18"

        fill="none"

        stroke="#f1b4c7"

        strokeWidth="10"

      />



      {/* rocket */}

      <g>

        <path

          d="M245 65 Q300 90 300 170 L270 205 L240 170 Q240 90 245 65"

          fill="#f5f5f5"

        />

        <circle cx="270" cy="125" r="14" fill="#68c9ed" />

        <path d="M240 170 L215 195 L250 190" fill="#ef6f62" />

        <path d="M300 170 L325 195 L290 190" fill="#ef6f62" />

        <path d="M255 200 L270 235 L285 200" fill="#ffb84d" />

      </g>



      {/* extra star only on right */}

      {different && (

        <g>

          <path

            d="M350 45 L356 60 L372 60 L359 70 L364 86 L350 77 L336 86 L341 70 L328 60 L344 60 Z"

            fill="#ffd85c"

          />

        </g>

      )}

    </svg>

  );

}



function BakeryScene({ different }) {

  return (

    <svg

      viewBox="0 0 500 330"

      className="scene-svg"

      role="img"

      aria-label="Bakery picture"

    >

      {/* wall */}

      <rect width="500" height="330" fill="#fff0d7" />



      {/* awning */}

      <path d="M0 75 H500 V120 H0 Z" fill="#ff9e9e" />



      <path d="M0 75 Q40 115 80 75 Q120 115 160 75 Q200 115 240 75 Q280 115 320 75 Q360 115 400 75 Q440 115 480 75 Q500 90 500 100 V120 H0 Z"

        fill="#fff"

      />



      {/* counter */}

      <rect x="0" y="235" width="500" height="95" fill="#b9794c" />



      {/* window */}

      <rect x="50" y="125" width="150" height="85" rx="8" fill="#a9dded" />

      <rect x="125" y="125" width="5" height="85" fill="#fff" />

      <rect x="50" y="165" width="150" height="5" fill="#fff" />



      {/* cake */}

      <rect x="260" y="180" width="100" height="55" rx="12" fill="#ff9fb7" />

      <rect x="275" y="155" width="70" height="35" rx="10" fill="#fff" />

      <circle cx="310" cy="148" r="8" fill="#ff6f61" />



      {/* cupcake only on right */}

      {different && (

        <g>

          <path

            d="M390 185 L450 185 L440 235 L400 235 Z"

            fill="#8bc8f2"

          />

          <path

            d="M385 185 Q420 145 455 185 Z"

            fill="#ffb4cb"

          />

          <circle cx="420" cy="155" r="8" fill="#ff6f61" />

        </g>

      )}

    </svg>

  );

}



/* -------------------------------------------------------

   SCENE RENDERER

\------------------------------------------------------- */



function SceneImage({ scene, different }) {
  let Scene = null;

  if (scene.id === "garden") {
    Scene = GardenScene;
  } else if (scene.id === "safari") {
    Scene = SafariScene;
  } else if (scene.id === "beach") {
    Scene = BeachScene;
  } else if (scene.id === "space") {
    Scene = SpaceScene;
  } else if (scene.id === "bakery") {
    Scene = BakeryScene;
  }

  if (!Scene) return null;

  return (
    <div className="scene-visual">
      <Scene different={different} />
    </div>
  );
}

/* -------------------------------------------------------

   MAIN GAME

\------------------------------------------------------- */



export default function SpotDifference() {

  const { getGameProgress, loadingProgress } = useGame();



  const { savedState, loading, save, finish } = useGameProgress(

    GAME_ID,

    {

      questionIndex: 0,

      score: 0,

      sceneOrder: [],

      found: false,

      completed: false,

    }

  );



  const [questionIndex, setQuestionIndex] = useState(0);

  const [score, setScore] = useState(0);

  const [sceneOrder, setSceneOrder] = useState([]);

  const [found, setFound] = useState(false);

  const [wrongClick, setWrongClick] = useState(false);

  const [completed, setCompleted] = useState(false);



  /* ---------------------------------------------------

     PREPARE SCENE ORDER

  --------------------------------------------------- */



  const prepareScenes = () => {

    const shuffled = shuffle(SCENES).map((scene) => scene.id);



    setSceneOrder(shuffled);



    return shuffled;

  };



  /* ---------------------------------------------------

     RESTORE

  --------------------------------------------------- */



  useEffect(() => {

    if (loadingProgress || loading) return;



    const saved = getGameProgress(GAME_ID);



    if (saved && saved.sceneOrder?.length) {

      console.log("🔎 Restoring Spot Difference:", saved);



      setQuestionIndex(saved.questionIndex || 0);

      setScore(saved.score || 0);

      setSceneOrder(saved.sceneOrder);

      setFound(Boolean(saved.found));

      setCompleted(Boolean(saved.completed));

      return;

    }



    const order = prepareScenes();



    setQuestionIndex(0);

    setScore(0);

    setFound(false);

    setCompleted(false);



    save({

      questionIndex: 0,

      score: 0,

      sceneOrder: order,

      found: false,

      completed: false,

    });

  }, [loadingProgress, loading]);



  /* ---------------------------------------------------

     CURRENT SCENE

  --------------------------------------------------- */



  const currentScene = useMemo(() => {

    if (!sceneOrder.length) return null;



    const id = sceneOrder[questionIndex];



    return SCENES.find((scene) => scene.id === id) || null;

  }, [sceneOrder, questionIndex]);



  /* ---------------------------------------------------

     SAVE CURRENT PROGRESS

  --------------------------------------------------- */



  const saveCurrentProgress = async (

    nextQuestion,

    nextScore,

    nextFound

  ) => {

    await save({

      questionIndex: nextQuestion,

      score: nextScore,

      sceneOrder,

      found: nextFound,

      completed: false,

    });

  };



  /* ---------------------------------------------------

     CORRECT DIFFERENCE

  --------------------------------------------------- */



  const handleCorrectDifference = async () => {

    if (found || completed) return;



    const newScore = score + 1;



    setFound(true);

    setWrongClick(false);

    setScore(newScore);



    const isLastQuestion = questionIndex === TOTAL_QUESTIONS - 1;



    if (isLastQuestion) {

      const percentage = Math.round(

        (newScore / TOTAL_QUESTIONS) * 100

      );



      /*

        Save completion state first.

        finish() then clears activeGames.

        Do NOT call save() after finish().

      */



      await save({

        questionIndex,

        score: newScore,

        sceneOrder,

        found: true,

        completed: true,

      });



      await finish(percentage, "Spot the Difference");



      setCompleted(true);



      console.log("🎉 Spot Difference completed:", {

        score: newScore,

        percentage,

      });



      return;

    }



    await saveCurrentProgress(

      questionIndex,

      newScore,

      true

    );

  };



  /* ---------------------------------------------------

     WRONG CLICK

  --------------------------------------------------- */



  const handleWrongClick = () => {

    if (found || completed) return;



    setWrongClick(true);



    setTimeout(() => {

      setWrongClick(false);

    }, 900);

  };



  /* ---------------------------------------------------

     NEXT QUESTION

  --------------------------------------------------- */



  const handleNext = async () => {

    if (!found || completed) return;



    const nextQuestion = questionIndex + 1;



    setQuestionIndex(nextQuestion);

    setFound(false);

    setWrongClick(false);



    await save({

      questionIndex: nextQuestion,

      score,

      sceneOrder,

      found: false,

      completed: false,

    });

  };



  /* ---------------------------------------------------

     PLAY AGAIN

  --------------------------------------------------- */



  const handlePlayAgain = async () => {

    const newOrder = shuffle(SCENES).map((scene) => scene.id);



    setQuestionIndex(0);

    setScore(0);

    setSceneOrder(newOrder);

    setFound(false);

    setWrongClick(false);

    setCompleted(false);



    await save({

      questionIndex: 0,

      score: 0,

      sceneOrder: newOrder,

      found: false,

      completed: false,

    });

  };



  /* ---------------------------------------------------

     LOADING

  --------------------------------------------------- */



  if (

    loadingProgress ||

    loading ||

    !currentScene

  ) {

    return (

      <div className="spot-page">

        <div className="spot-loading">

          <div className="loading-emoji">🔍</div>

          <h2>Getting the pictures ready...</h2>

          <p>Let's find the hidden difference! ✨</p>

        </div>

      </div>

    );

  }



  /* ---------------------------------------------------

     COMPLETED

  --------------------------------------------------- */



  if (completed) {

    const percentage = Math.round(

      (score / TOTAL_QUESTIONS) * 100

    );



    return (

      <div className="spot-page">

        <div className="spot-complete-card">

          <div className="celebration">🎉</div>



          <h1>Amazing Detective! 🕵️</h1>



          <p className="complete-text">

            You found all the differences!

          </p>



          <div className="result-stars">

            {"⭐".repeat(

              percentage >= 90

                ? 3

                : percentage >= 70

                  ? 2

                  : 1

            )}

          </div>



          <div className="final-score">

            <strong>{score}</strong>

            <span>/ {TOTAL_QUESTIONS}</span>

          </div>



          <p className="percentage">

            {percentage}% correct

          </p>



          <button

            className="play-again-button"

            onClick={handlePlayAgain}

          >

            🔄 Play Again

          </button>

        </div>

      </div>

    );

  }



  /* ---------------------------------------------------

     MAIN UI

  --------------------------------------------------- */



  const progress =

    ((questionIndex + 1) / TOTAL_QUESTIONS) * 100;



  return (

    <div className="spot-page">



      {/* Decorative elements */}

      <div className="floating-decor decor-one">✨</div>

      <div className="floating-decor decor-two">🌿</div>

      <div className="floating-decor decor-three">⭐</div>



      <main className="spot-container">



        {/* HEADER */}

        <header className="spot-header">



          <div className="spot-title-icon">

            👀

          </div>



          <div>

            <p className="mini-label">

              VISUAL DETECTIVE

            </p>



            <h1>

              Spot the Difference

            </h1>



            <p className="subtitle">

              Look carefully and find what changed!

            </p>

          </div>



        </header>



        {/* STATUS */}

        <section className="status-row">



          <div className="status-card">

            <span className="status-icon">🔎</span>



            <div>

              <span className="status-label">

                QUESTION

              </span>



              <strong>

                {questionIndex + 1}

                <small> / {TOTAL_QUESTIONS}</small>

              </strong>

            </div>

          </div>



          <div className="status-card">

            <span className="status-icon">⭐</span>



            <div>

              <span className="status-label">

                FOUND

              </span>



              <strong>

                {score}

              </strong>

            </div>

          </div>



        </section>



        {/* PROGRESS */}

        <section className="progress-card">



          <div className="progress-top">

            <span>Your adventure</span>



            <strong>

              {Math.round(progress)}%

            </strong>

          </div>



          <div className="progress-track">

            <div

              className="progress-fill"

              style={{ width: `${progress}%` }}

            />

          </div>



        </section>



        {/* QUESTION */}

        <section className="game-card">



          <div className="game-intro">



            <span className="look-badge">

              👀 Look carefully!

            </span>



            <h2>

              Can you spot what is different?

            </h2>



            <p>

              Compare the two pictures and tap the

              different object.

            </p>



          </div>



          {/* PICTURE PAIRS */}

          <div className="pictures-wrapper">



            {/* LEFT */}

            <div className="picture-column">



              <div className="picture-label">

                <span>🌿</span>

                Picture A

              </div>



              <div

                className={`picture-frame ${wrongClick ? "wrong-shake" : ""

                  }`}

                onClick={handleWrongClick}

              >

                <SceneImage

                  scene={currentScene}

                  different={false}

                />



                {/* Invisible wrong-click layer */}

                <button

                  className="picture-click-layer"

                  aria-label="Picture A"

                  onClick={(event) => {

                    event.stopPropagation();

                    handleWrongClick();

                  }}

                />

              </div>



            </div>



            {/* VS */}

            <div className="compare-badge">

              <span>VS</span>

            </div>



            {/* RIGHT */}

            <div className="picture-column">



              <div className="picture-label">

                <span>✨</span>

                Picture B

              </div>



              <div className="picture-frame difference-picture">



                <SceneImage

                  scene={currentScene}

                  different={true}

                />



                <button

                  type="button"

                  className={`difference-target difference-${currentScene.id} ${found ? "found-target" : ""

                    }`}

                  onClick={handleCorrectDifference}

                  aria-label={`Find the difference in ${currentScene.title}`}

                >

                  {found && (

                    <span className="found-check">

                      ✓

                    </span>

                  )}

                </button>



              </div>



            </div>



          </div>



          {/* HELPER TEXT */}

          <div

            className={`game-message ${wrongClick ? "message-wrong" : ""

              } ${found ? "message-correct" : ""}`}

          >

            {found

              ? "🎉 Great spotting! You found it!"

              : wrongClick

                ? "💭 Not there! Look carefully and try again."

                : "🔍 Take your time. Look at both pictures carefully."}

          </div>



          {/* NEXT */}

          {found && !completed && (

            <button

              className="next-question-button"

              onClick={handleNext}

            >

              Next Picture

              <span>→</span>

            </button>

          )}



          {/* Scene title */}

          <div className="scene-name">

            <span>{currentScene.emoji}</span>

            {currentScene.title}

          </div>



        </section>



        {/* TIP */}

        <div className="detective-tip">

          <span>💡</span>



          <div>

            <strong>Detective tip</strong>

            <p>

              Check the pictures from top to bottom.

              Little details can hide anywhere!

            </p>

          </div>

        </div>



      </main>

    </div>

  );

}