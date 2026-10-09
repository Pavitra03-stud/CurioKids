import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../styles/DescendingOrderLearning.css";

import useGameProgress from "../hooks/useGameProgress";
import descendingOrderImage from "../assets/descending_orders.png";


/* =========================================================
   GAME ID
========================================================= */

const GAME_ID =
  "descending-order-learning";


/* =========================================================
   LEVELS
========================================================= */

const levels = [
  {
    id: 1,
    title: "Level 1",
    subtitle: "Descending 1 to 10",
    range: 10,
    count: 4,
  },

  {
    id: 2,
    title: "Level 2",
    subtitle: "Descending 1 to 50",
    range: 50,
    count: 5,
  },

  {
    id: 3,
    title: "Level 3",
    subtitle: "Descending 1 to 100",
    range: 100,
    count: 6,
  },
];


/* =========================================================
   SHUFFLE NUMBERS
========================================================= */

const shuffleArray = (array) => {

  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      copy[i],
      copy[j],
    ] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
};


/* =========================================================
   GENERATE UNIQUE NUMBERS
========================================================= */

const generateUniqueNumbers = (
  range,
  count
) => {

  const allNumbers = Array.from(
    {
      length: range,
    },
    (_, index) => index + 1
  );

  return shuffleArray(
    allNumbers
  ).slice(0, count);
};


/* =========================================================
   COMPONENT
========================================================= */

export default function DescendingOrderLearning() {

  const navigate =
    useNavigate();

  const { level } =
    useParams();


  /* =======================================================
     FIREBASE
  ======================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(
    GAME_ID,
    {
      screen: "levels",

      selectedLevelId: null,

      numbers: [],

      selectedOrder: [],

      message:
        "Start from the biggest number.",

      completed: false,

      voiceEnabled: true,
    }
  );


  /* =======================================================
     STATE
  ======================================================= */

  const [screen, setScreen] =
    useState("levels");

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  const [numbers, setNumbers] =
    useState([]);

  const [selectedOrder, setSelectedOrder] =
    useState([]);

  const [message, setMessage] =
    useState(
      "Start from the biggest number."
    );

  const [completed, setCompleted] =
    useState(false);

  const [voiceEnabled, setVoiceEnabled] =
    useState(true);

  const [restored, setRestored] =
    useState(false);


  /* =======================================================
     NAVIGATION LOCK

     Prevents accidental double firing.

     First tap = navigation.
     Second tap while navigating = ignored.
  ======================================================= */

  const navigationLock =
    useRef(false);


  /* =======================================================
     CORRECT ORDER
  ======================================================= */

  const correctOrder =
    useMemo(() => {

      return [...numbers].sort(
        (a, b) => b - a
      );

    }, [numbers]);


  /* =======================================================
     CURRENT EXPECTED NUMBER
  ======================================================= */

  const currentExpected =
    correctOrder[
      selectedOrder.length
    ];


  /* =======================================================
     SPEECH
  ======================================================= */

  const speak = (text) => {

    if (
      !voiceEnabled ||
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }


    window.speechSynthesis.cancel();


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    utterance.rate = 0.9;

    utterance.pitch = 1;

    utterance.volume = 1;


    window.speechSynthesis.speak(
      utterance
    );
  };


  /* =======================================================
     LEVEL INSTRUCTION
  ======================================================= */

  const getLevelInstructionVoice =
    (selected) => {

      if (selected.id === 1) {

        return (
          "Welcome to level 1. Descending order means start from the biggest number and go down."
        );

      }


      if (selected.id === 2) {

        return (
          "Welcome to level 2. Find the biggest number each time and arrange the numbers from biggest to smallest."
        );

      }


      return (
        "Welcome to level 3. Arrange the numbers from biggest to smallest."
      );
    };


  /* =======================================================
     HINT
  ======================================================= */

  const getHintText = () => {

    if (!selectedLevel) {
      return "";
    }


    if (
      selectedLevel.id === 1
    ) {

      return (
        "Look for the biggest number first, then go down."
      );

    }


    if (
      selectedLevel.id === 2
    ) {

      return (
        "Compare the numbers carefully and choose the biggest remaining number."
      );

    }


    return (
      "Find the largest number each time and arrange from big to small."
    );
  };


  /* =======================================================
     RESTORE FIREBASE DATA

     IMPORTANT:

     Firebase restores the lesson DATA.

     URL controls which PAGE is displayed.

     /descending-order-learning
       = level selection

     /descending-order-learning/level/1
       = level 1
  ======================================================= */

  useEffect(() => {

    if (
      progressLoading ||
      restored
    ) {
      return;
    }


    const state =
      savedState || {};


    /* -----------------------------------------------
       Restore lesson data
    ------------------------------------------------ */

    setNumbers(
      Array.isArray(
        state.numbers
      )
        ? state.numbers
        : []
    );


    setSelectedOrder(
      Array.isArray(
        state.selectedOrder
      )
        ? state.selectedOrder
        : []
    );


    setMessage(
      state.message ||
        "Start from the biggest number."
    );


    setCompleted(
      Boolean(
        state.completed
      )
    );


    setVoiceEnabled(
      state.voiceEnabled !== false
    );


    /* -----------------------------------------------
       URL decides the screen
    ------------------------------------------------ */

    if (level) {

      const urlLevel =
        levels.find(
          (item) =>
            item.id ===
            Number(level)
        );


      if (urlLevel) {

        setSelectedLevel(
          urlLevel
        );

        setScreen(
          "lesson"
        );

      } else {

        navigate(
          "/descending-order-learning",
          {
            replace: true,
          }
        );

        setSelectedLevel(
          null
        );

        setScreen(
          "levels"
        );
      }

    } else {

      /*
       * ALWAYS show level selection
       * on the main URL.
       */

      setSelectedLevel(
        null
      );

      setScreen(
        "levels"
      );
    }


    setRestored(true);

  }, [
    progressLoading,
    savedState,
    restored,
    level,
    navigate,
  ]);


  /* =======================================================
     URL → SCREEN

     Runs after Firebase restoration.
  ======================================================= */

  useEffect(() => {

    if (!restored) {
      return;
    }


    /* -----------------------------------------------
       MAIN LEVEL SELECTION URL
    ------------------------------------------------ */

    if (!level) {

      setSelectedLevel(
        null
      );

      setScreen(
        "levels"
      );

      return;
    }


    /* -----------------------------------------------
       LEVEL URL
    ------------------------------------------------ */

    const levelId =
      Number(level);


    const foundLevel =
      levels.find(
        (item) =>
          item.id === levelId
      );


    if (!foundLevel) {

      navigate(
        "/descending-order-learning",
        {
          replace: true,
        }
      );

      setSelectedLevel(
        null
      );

      setScreen(
        "levels"
      );

      return;
    }


    setSelectedLevel(
      foundLevel
    );

    setScreen(
      "lesson"
    );

  }, [
    level,
    restored,
    navigate,
  ]);


  /* =======================================================
     GENERATE LESSON
  ======================================================= */

  const generateLesson =
    async (selected) => {

      const newNumbers =
        generateUniqueNumbers(
          selected.range,
          selected.count
        );


      const newMessage =
        "Start from the biggest number.";


      setNumbers(
        newNumbers
      );

      setSelectedOrder(
        []
      );

      setCompleted(
        false
      );

      setMessage(
        newMessage
      );


      /*
       * Save in Firebase.
       */

      await save({

        screen:
          "lesson",

        selectedLevelId:
          selected.id,

        numbers:
          newNumbers,

        selectedOrder:
          [],

        message:
          newMessage,

        completed:
          false,

        voiceEnabled,

      });

    };


  /* =======================================================
     SELECT LEVEL
     
     THIS IS THE IMPORTANT FIX.

     ONE POINTER DOWN = ONE NAVIGATION.

     We don't wait for Firebase.
     We don't wait for generateLesson.
  ======================================================= */

  const handleSelectLevel =
    (selected) => {

      /*
       * Prevent another pointer event
       * while the first navigation is happening.
       */

      if (
        navigationLock.current
      ) {
        return;
      }


      navigationLock.current =
        true;


      /* -----------------------------------------------
         Immediately update UI
      ------------------------------------------------ */

      setSelectedLevel(
        selected
      );

      setScreen(
        "lesson"
      );


      /* -----------------------------------------------
         IMMEDIATELY navigate

         This is NOT awaited.
      ------------------------------------------------ */

      navigate(
        `/descending-order-learning/level/${selected.id}`
      );


      /* -----------------------------------------------
         Generate lesson in background.

         Navigation is already complete.
      ------------------------------------------------ */

      generateLesson(
        selected
      ).catch(
        (error) => {
          console.error(
            "Failed to generate lesson:",
            error
          );
        }
      );


      /* -----------------------------------------------
         Voice
      ------------------------------------------------ */

      setTimeout(() => {

        speak(
          getLevelInstructionVoice(
            selected
          )
        );

      }, 300);


      /*
       * Release lock after navigation
       * has had time to finish.
       */

      setTimeout(() => {

        navigationLock.current =
          false;

      }, 500);

    };


  /* =======================================================
     NUMBER CLICK
  ======================================================= */

  const handleNumberClick =
    async (num) => {

      if (completed) {
        return;
      }


      if (
        selectedOrder.includes(
          num
        )
      ) {
        return;
      }


      /* -----------------------------------------------
         CORRECT
      ------------------------------------------------ */

      if (
        num === currentExpected
      ) {

        const updatedOrder = [
          ...selectedOrder,
          num,
        ];


        const isCompleted =
          updatedOrder.length ===
          correctOrder.length;


        let newMessage;


        if (isCompleted) {

          newMessage =
            `🎉 Great! Descending order is ${correctOrder.join(
              " → "
            )}`;


          setCompleted(
            true
          );


          setMessage(
            newMessage
          );


          speak(
            `Excellent. Descending order is ${correctOrder.join(
              ", "
            )}`
          );

        } else {

          newMessage =
            "Good! Now find the biggest number from the remaining ones.";


          setMessage(
            newMessage
          );


          speak(
            `Good job. ${num} is correct.`
          );
        }


        setSelectedOrder(
          updatedOrder
        );


        await save({

          screen:
            "lesson",

          selectedLevelId:
            selectedLevel?.id ??
            null,

          numbers,

          selectedOrder:
            updatedOrder,

          message:
            newMessage,

          completed:
            isCompleted,

          voiceEnabled,

        });


        return;
      }


      /* -----------------------------------------------
         WRONG
      ------------------------------------------------ */

      const wrongMessage =
        "Try again. Start from the biggest number.";


      setMessage(
        wrongMessage
      );


      speak(
        "Try again. Find the biggest number."
      );


      await save({

        screen:
          "lesson",

        selectedLevelId:
          selectedLevel?.id ??
          null,

        numbers,

        selectedOrder,

        message:
          wrongMessage,

        completed,

        voiceEnabled,

      });

    };


  /* =======================================================
     RESET
  ======================================================= */

  const handleReset =
    async () => {

      const resetMessage =
        "Start from the biggest number.";


      setSelectedOrder(
        []
      );

      setCompleted(
        false
      );

      setMessage(
        resetMessage
      );


      speak(
        "Lesson reset. Start from the biggest number."
      );


      await save({

        screen:
          "lesson",

        selectedLevelId:
          selectedLevel?.id ??
          null,

        numbers,

        selectedOrder:
          [],

        message:
          resetMessage,

        completed:
          false,

        voiceEnabled,

      });

    };


  /* =======================================================
     NEXT EXAMPLE
  ======================================================= */

  const handleNextExample =
    async () => {

      if (!selectedLevel) {
        return;
      }


      await generateLesson(
        selectedLevel
      );


      setTimeout(() => {

        speak(
          "Here is your next example. Start from the biggest number."
        );

      }, 200);

    };


  /* =======================================================
     VOICE TOGGLE
  ======================================================= */

  const toggleVoice =
    async () => {

      const nextVoice =
        !voiceEnabled;


      setVoiceEnabled(
        nextVoice
      );


      if (
        !nextVoice &&
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {

        window.speechSynthesis.cancel();

      }


      await save({

        screen,

        selectedLevelId:
          selectedLevel?.id ??
          null,

        numbers,

        selectedOrder,

        message,

        completed,

        voiceEnabled:
          nextVoice,

      });

    };


  /* =======================================================
     BACK FROM LESSON

     ONLY THIS PAGE HAS A BACK BUTTON.
  ======================================================= */

  const handleBack =
    () => {

      /*
       * Stop voice immediately.
       */

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {

        window.speechSynthesis.cancel();

      }


      /*
       * Unlock navigation.
       */

      navigationLock.current =
        false;


      /*
       * Change screen immediately.
       */

      setSelectedLevel(
        null
      );

      setScreen(
        "levels"
      );


      /*
       * Change URL immediately.
       *
       * NO await.
       */

      navigate(
        "/descending-order-learning",
        {
          replace: true,
        }
      );


      /*
       * Save progress AFTER navigation.
       *
       * Firebase cannot delay the UI.
       */

      save({

        screen:
          "levels",

        selectedLevelId:
          selectedLevel?.id ??
          null,

        numbers,

        selectedOrder,

        message,

        completed,

        voiceEnabled,

      }).catch(
        (error) => {
          console.error(
            "Failed to save progress:",
            error
          );
        }
      );

    };


  /* =======================================================
     CLEANUP SPEECH
  ======================================================= */

  useEffect(() => {

    return () => {

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {

        window.speechSynthesis.cancel();

      }

    };

  }, []);


  /* =======================================================
     LOADING PAGE
     
     DO NOT REMOVE
  ======================================================= */

  if (
    progressLoading ||
    !restored
  ) {

    return (

      <div className="descending-page">

        <div className="descending-card">

          <div className="top-section">
            <img
      src={descendingOrderImage}
      alt="Descending Orders"
      className="descending-title-icon"
    />
            <h1>
              Descending Order Learning
            </h1>

            <p>
              Loading your lesson...
            </p>

          </div>

        </div>

      </div>

    );

  }


  /* =======================================================
     LEVEL SELECTION PAGE
     
     ABSOLUTELY NO BACK BUTTON HERE.
  ======================================================= */

  if (
    screen === "levels"
  ) {

    return (

      <div className="descending-page">

        <div className="descending-card">


          {/* =============================================
              HEADER
          ============================================= */}

          <div className="top-section">
            <img
      src={descendingOrderImage}
      alt="Descending Orders"
      className="descending-title-icon"
    />
            <h1>
              Descending Order Learning
            </h1>

            <p>
              Learn how to arrange numbers
              from biggest to smallest.
            </p>

          </div>


          {/* =============================================
              SAME NUMBERS HOME ICON
          ============================================= */}

          <div
            className="descending-home-icon"
            aria-hidden="true"
          >

          </div>


          {/* =============================================
              CHOOSE LEVEL
          ============================================= */}

          <div className="rule-box">

            <h2>
              Choose a Level
            </h2>

            <p>
              Start learning numbers
              step by step.
            </p>

          </div>


          {/* =============================================
              RULE
          ============================================= */}

          <div className="rule-box">

            <h2>
              Rule
            </h2>

            <p>

              Descending order means:

              {" "}

              <strong>
                Big number → Small number
              </strong>

            </p>

            <p>

              Example:

              {" "}

              <strong>
                9 → 7 → 5 → 2
              </strong>

            </p>

          </div>


          {/* =============================================
              VOICE
          ============================================= */}

          <div className="voice-toggle-box">

            <button
              type="button"
              className="voice-btn"
              onClick={toggleVoice}
            >

              {voiceEnabled
                ? "🔊 Voice On"
                : "🔇 Voice Off"}

            </button>

          </div>


          {/* =============================================
              LEVEL CARDS

              IMPORTANT:
              onPointerDown = SINGLE TAP
          ============================================= */}

          <div className="levels-grid">

            {levels.map(
              (item) => (

                <button
                  key={item.id}

                  type="button"

                  className="level-box"

                  onPointerDown={() =>
                    handleSelectLevel(
                      item
                    )
                  }
                >

                  <div className="level-circle">

                    {item.id}

                  </div>


                  <h3>
                    {item.title}
                  </h3>


                  <p>
                    {item.subtitle}
                  </p>


                  <span>
                    Tap to Learn →
                  </span>

                </button>

              )
            )}

          </div>


        </div>

      </div>

    );

  }


  /* =======================================================
     SAFETY
  ======================================================= */

  if (!selectedLevel) {

    return null;

  }


  /* =======================================================
     LESSON PAGE

     ONLY HERE IS THERE A BACK BUTTON.
  ======================================================= */

  return (

    <div className="descending-page">

      <div className="descending-card">


        {/* =============================================
            LESSON HEADER
        ============================================= */}

        <div className="top-section lesson-top">

          {/* <button
            type="button"
            className="back-btn"
            onPointerDown={
              handleBack
            }
          >

            ← Back

          </button> */}


          <h1>
            {selectedLevel.title}
          </h1>


          <p>
            {selectedLevel.subtitle}
          </p>

        </div>


        {/* =============================================
            LESSON LAYOUT
        ============================================= */}

        <div className="lesson-layout">


          {/* ===========================================
              MAIN LESSON
          =========================================== */}

          <div className="lesson-main">


            {/* =========================================
                TEACH BOX
            ========================================= */}

            <div className="teach-box">

              <h2>
                Teaching Method
              </h2>


              <p>
                {getHintText()}
              </p>


              <p className="example-text">

                Descending order means
                going{" "}

                <strong>
                  down
                </strong>{" "}

                from the biggest number.

              </p>


              <div className="teach-actions">

                <button
                  type="button"
                  className="voice-btn"
                  onClick={() =>
                    speak(
                      "Start from the biggest number."
                    )
                  }
                >

                  🔊 Play Instruction

                </button>


                <button
                  type="button"
                  className="voice-btn secondary-voice-btn"
                  onClick={
                    toggleVoice
                  }
                >

                  {voiceEnabled
                    ? "🔇 Mute Voice"
                    : "🔊 Unmute Voice"}

                </button>

              </div>

            </div>


            {/* =========================================
                NUMBERS
            ========================================= */}

            <div className="numbers-box">

              {numbers.map(
                (num) => {

                  const isSelected =
                    selectedOrder.includes(
                      num
                    );


                  const isHint =
                    !completed &&
                    num ===
                      currentExpected;


                  return (

                    <button
                      key={num}

                      type="button"

                      className={`number-btn ${
                        isSelected
                          ? "selected-btn"
                          : ""
                      } ${
                        isHint
                          ? "hint-btn"
                          : ""
                      }`}

                      onClick={() =>
                        handleNumberClick(
                          num
                        )
                      }

                      disabled={
                        isSelected
                      }
                    >

                      {num}

                    </button>

                  );

                }
              )}

            </div>


            {/* =========================================
                ANSWER
            ========================================= */}

            <div className="answer-box">

              <h3>
                Descending Order
              </h3>


              <div className="answer-row">

                {correctOrder.map(
                  (_, index) => (

                    <div
                      key={index}
                      className="answer-slot"
                    >

                      {
                        selectedOrder[
                          index
                        ] ?? "?"
                      }

                    </div>

                  )
                )}

              </div>

            </div>


            {/* =========================================
                MESSAGE
            ========================================= */}

            <div className="message-box">

              <p>
                {message}
              </p>

            </div>


          </div>


          {/* ===========================================
              SIDE PANEL
          =========================================== */}

          <div className="lesson-side">


            {/* =========================================
                REMEMBER
            ========================================= */}

            <div className="side-card">

              <h3>
                Remember
              </h3>


              <p>
                1. Find the biggest number
              </p>


              <p>
                2. Put it first
              </p>


              <p>
                3. Continue until smallest
              </p>

            </div>


            {/* =========================================
                EXAMPLE
            ========================================= */}

            <div className="side-card">

              <h3>
                Example
              </h3>


              <div className="arrow-example">

                <span>
                  10
                </span>

                <span>
                  ⬇️
                </span>

                <span>
                  8
                </span>

                <span>
                  ⬇️
                </span>

                <span>
                  5
                </span>

              </div>

            </div>


            {/* =========================================
                ACTION BUTTONS
            ========================================= */}

            <div className="button-group">

              <button
                type="button"
                className="reset-btn"
                onClick={
                  handleReset
                }
              >

                Reset

              </button>


              <button
                type="button"
                className="next-btn"
                onClick={
                  handleNextExample
                }
              >

                Next Example

              </button>

            </div>


          </div>


        </div>

      </div>

    </div>

  );

}