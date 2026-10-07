import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import useGameProgress from "../hooks/useGameProgress";
import "../styles/SightWords.css";

/* =========================================================
   SETTINGS
========================================================= */

const TOTAL_QUESTIONS = 5;

/* =========================================================
   LETTER QUESTIONS
   🔤 LETTER MODE = LETTERS ONLY
========================================================= */

const LETTER_QUESTIONS = [
  {
    sequence: ["A", "B", "_", "D"],
    answer: "C",
    options: ["C", "E", "F"],
  },
  {
    sequence: ["F", "G", "_", "I"],
    answer: "H",
    options: ["H", "J", "K"],
  },
  {
    sequence: ["K", "L", "_", "N"],
    answer: "M",
    options: ["M", "O", "P"],
  },
  {
    sequence: ["P", "Q", "_", "S"],
    answer: "R",
    options: ["R", "T", "U"],
  },
  {
    sequence: ["W", "X", "_", "Z"],
    answer: "Y",
    options: ["Y", "A", "B"],
  },

  {
    sequence: ["B", "D", "_", "H"],
    answer: "F",
    options: ["F", "E", "G"],
  },
  {
    sequence: ["C", "E", "_", "I"],
    answer: "G",
    options: ["G", "H", "F"],
  },
  {
    sequence: ["D", "F", "_", "J"],
    answer: "H",
    options: ["H", "I", "G"],
  },
  {
    sequence: ["G", "I", "_", "M"],
    answer: "K",
    options: ["K", "L", "J"],
  },
  {
    sequence: ["H", "J", "_", "N"],
    answer: "L",
    options: ["L", "M", "K"],
  },

  {
    sequence: ["M", "N", "_", "P"],
    answer: "O",
    options: ["O", "Q", "R"],
  },
  {
    sequence: ["R", "S", "_", "U"],
    answer: "T",
    options: ["T", "V", "W"],
  },
];

/* =========================================================
   NUMBER QUESTIONS
   🔢 NUMBER MODE = NUMBERS ONLY
========================================================= */

const NUMBER_QUESTIONS = [
  {
    sequence: ["1", "2", "_", "4"],
    answer: "3",
    options: ["3", "5", "6"],
  },
  {
    sequence: ["5", "6", "_", "8"],
    answer: "7",
    options: ["7", "9", "4"],
  },
  {
    sequence: ["9", "10", "_", "12"],
    answer: "11",
    options: ["11", "13", "8"],
  },
  {
    sequence: ["13", "14", "_", "16"],
    answer: "15",
    options: ["15", "17", "12"],
  },
  {
    sequence: ["17", "18", "_", "20"],
    answer: "19",
    options: ["19", "21", "16"],
  },

  {
    sequence: ["2", "4", "_", "8"],
    answer: "6",
    options: ["6", "5", "10"],
  },
  {
    sequence: ["3", "6", "_", "12"],
    answer: "9",
    options: ["9", "8", "15"],
  },
  {
    sequence: ["4", "8", "_", "16"],
    answer: "12",
    options: ["12", "10", "14"],
  },
  {
    sequence: ["5", "10", "_", "20"],
    answer: "15",
    options: ["15", "12", "18"],
  },
  {
    sequence: ["6", "12", "_", "24"],
    answer: "18",
    options: ["18", "16", "20"],
  },

  {
    sequence: ["10", "11", "_", "13"],
    answer: "12",
    options: ["12", "14", "15"],
  },
  {
    sequence: ["20", "21", "_", "23"],
    answer: "22",
    options: ["22", "24", "19"],
  },
];

/* =========================================================
   HELPERS
========================================================= */

const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

/*
  Select 5 different questions for the round.
*/
const createRound = (questionPool) => {
  return shuffle(questionPool)
    .slice(0, TOTAL_QUESTIONS)
    .map((question) => ({
      sequence: [...question.sequence],
      answer: question.answer,
      options: shuffle(question.options),
    }));
};

/* =========================================================
   COMPONENT
========================================================= */

export default function SequenceBuilder() {
  const location = useLocation();

  /* =======================================================
     MODE
     IMPORTANT:
     Only "numbers" activates number mode.
     Everything else is LETTER mode.
  ======================================================= */

  const query = new URLSearchParams(location.search);

  const mode =
    query.get("mode") === "numbers"
      ? "numbers"
      : "letters";

  /* =======================================================
     SEPARATE GAME IDS
     Letters and numbers never overwrite each other.
  ======================================================= */

  const GAME_ID =
    mode === "numbers"
      ? "sequence-builder-numbers"
      : "sequence-builder-letters";

  /* =======================================================
     SELECT CORRECT QUESTION POOL
  ======================================================= */

  const questionPool = useMemo(() => {
    return mode === "numbers"
      ? NUMBER_QUESTIONS
      : LETTER_QUESTIONS;
  }, [mode]);

  /* =======================================================
     INITIAL STATE
  ======================================================= */

  const initialState = {
    questions: [],
    questionIndex: 0,
    score: 0,
    completed: false,
  };

  /* =======================================================
     GAME PROGRESS
  ======================================================= */

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =======================================================
     LOCAL STATE
  ======================================================= */

  const [questions, setQuestions] = useState([]);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [score, setScore] = useState(0);

  const [selected, setSelected] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [completed, setCompleted] =
    useState(false);

  const [ready, setReady] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  /* =======================================================
     CURRENT QUESTION
  ======================================================= */

  const currentQuestion =
    questions[questionIndex];

  /* =======================================================
     RESTORE / START GAME
  ======================================================= */

  useEffect(() => {
    if (progressLoading) {
      return;
    }

    /*
      If saved game exists,
      restore it.
    */

    if (
      savedState?.questions?.length > 0
    ) {
      console.log(
        "🔄 Restoring Sequence Builder:",
        savedState
      );

      setQuestions(
        savedState.questions
      );

      setQuestionIndex(
        savedState.questionIndex || 0
      );

      setScore(
        savedState.score || 0
      );

      setCompleted(
        Boolean(savedState.completed)
      );

      setSelected("");
      setMessage("");
      setReady(true);

      return;
    }

    /*
      No saved game.
      Start a fresh round.
    */

    console.log(
      "🆕 Starting Sequence Builder:",
      mode
    );

    const newQuestions =
      createRound(questionPool);

    setQuestions(newQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelected("");
    setMessage("");
    setCompleted(false);
    setReady(true);

    /*
      Save initial game state.
    */
    save({
      questions: newQuestions,
      questionIndex: 0,
      score: 0,
      completed: false,
    });
  }, [
    progressLoading,
    savedState,
    mode,
    questionPool,
  ]);

  /* =======================================================
     SAVE GAME RESULT
  ======================================================= */

  const saveGameResult = async (
    finalScore
  ) => {
    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        console.warn(
          "⚠️ No userId found."
        );
        return;
      }

      const accuracy =
        (finalScore / TOTAL_QUESTIONS) *
        100;

      const userRef = doc(
        db,
        "users",
        userId
      );

      const resultsRef = collection(
        userRef,
        "game_results"
      );

      await addDoc(resultsRef, {
        game:
          mode === "numbers"
            ? "SequenceBuilder_numbers"
            : "SequenceBuilder_letters",

        mode,

        score: finalScore,

        totalQuestions:
          TOTAL_QUESTIONS,

        accuracy: Number(
          accuracy.toFixed(2)
        ),

        createdAt:
          Timestamp.now(),
      });

      console.log(
        "✅ Sequence Builder result saved"
      );
    } catch (error) {
      console.error(
        "❌ Failed to save Sequence Builder result:",
        error
      );
    }
  };

  /* =======================================================
     HANDLE ANSWER
  ======================================================= */

  const handleAnswer = async (
    selectedOption
  ) => {
    if (
      processing ||
      completed ||
      !currentQuestion
    ) {
      return;
    }

    setProcessing(true);
    setSelected(selectedOption);

    const isCorrect =
      selectedOption ===
      currentQuestion.answer;

    const updatedScore = isCorrect
      ? score + 1
      : score;

    setScore(updatedScore);

    setMessage(
      isCorrect
        ? "🎉 Correct! Great thinking!"
        : `💡 Nice try! The answer is ${currentQuestion.answer}.`
    );

    const isLastQuestion =
      questionIndex ===
      TOTAL_QUESTIONS - 1;

    /* =====================================================
       LAST QUESTION
    ===================================================== */

    if (isLastQuestion) {
      const percentage =
        (updatedScore /
          TOTAL_QUESTIONS) *
        100;

      /*
        Save game result.
      */
      await saveGameResult(
        updatedScore
      );

      /*
        Save completion state BEFORE
        finish(), because finish() clears
        active game progress.
      */
      await save({
        questions,
        questionIndex,
        score: updatedScore,
        completed: true,
      });

      /*
        ⭐ Stars + history
      */
      await finish(
        percentage,
        mode === "numbers"
          ? "Sequence Builder (Numbers)"
          : "Sequence Builder (Letters)"
      );

      setTimeout(() => {
        setCompleted(true);
        setProcessing(false);
      }, 600);

      return;
    }

    /* =====================================================
       NEXT QUESTION
    ===================================================== */

    const nextIndex =
      questionIndex + 1;

    /*
      Save progress before moving.
    */
    await save({
      questions,
      questionIndex: nextIndex,
      score: updatedScore,
      completed: false,
    });

    setTimeout(() => {
      setQuestionIndex(nextIndex);
      setSelected("");
      setMessage("");
      setProcessing(false);
    }, 600);
  };

  /* =======================================================
     PLAY AGAIN
  ======================================================= */

  const playAgain = async () => {
    const newQuestions =
      createRound(questionPool);

    setQuestions(newQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSelected("");
    setMessage("");
    setCompleted(false);
    setProcessing(false);

    await save({
      questions: newQuestions,
      questionIndex: 0,
      score: 0,
      completed: false,
    });
  };

  /* =======================================================
     PERFORMANCE MESSAGE
  ======================================================= */

  const getPerformanceMessage = () => {
    if (score === 5) {
      return "🌟 Sequence Superstar!";
    }

    if (score === 4) {
      return "🎉 Excellent thinking!";
    }

    if (score === 3) {
      return "👏 Great job!";
    }

    if (score === 2) {
      return "💪 Good effort! Keep practicing!";
    }

    return "🌱 Keep practicing sequences!";
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    progressLoading ||
    !ready
  ) {
    return (
      <div className="blend-container">
        <h2>
          {mode === "numbers"
            ? "🔢 Sequence Builder"
            : "🔤 Sequence Builder"}
        </h2>

        <p>
          🌱 Getting your practice ready...
        </p>
      </div>
    );
  }

  /* =======================================================
     COMPLETED SCREEN
  ======================================================= */

  if (completed) {
    const percentage = Math.round(
      (score / TOTAL_QUESTIONS) *
        100
    );

    return (
      <div className="blend-container">

        <div className="ai-analysis">

          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            {percentage === 100
              ? "🏆"
              : percentage >= 60
                ? "🌟"
                : "🌱"}
          </div>

          <h2>
            {mode === "numbers"
              ? "🔢 Number Sequence Complete!"
              : "🔤 Letter Sequence Complete!"}
          </h2>

          <h3>
            Score: {score}/
            {TOTAL_QUESTIONS}
          </h3>

          <p>
            Accuracy: {percentage}%
          </p>

          <p>
            {getPerformanceMessage()}
          </p>

          <p
            style={{
              fontSize: "28px",
              margin: "15px 0",
            }}
          >
            {percentage >= 90
              ? "⭐⭐⭐"
              : percentage >= 70
                ? "⭐⭐"
                : "⭐"}
          </p>

          <button
            onClick={playAgain}
          >
            🔄 Play Again
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN GAME
  ======================================================= */

  return (
    <div className="blend-container">

      {/* =================================================
          TITLE
      ================================================= */}

      <h2>
        {mode === "numbers"
          ? "🔢 Number Sequence Builder"
          : "🔤 Letter Sequence Builder"}
      </h2>

      {/* =================================================
          GAME INFO
      ================================================= */}

      <div className="game-info">
        Question{" "}
        {questionIndex + 1}/
        {TOTAL_QUESTIONS}
        {" | "}
        Score: {score}
      </div>

      {/* =================================================
          INSTRUCTION
      ================================================= */}

      <h3>
        {mode === "numbers"
          ? "What number is missing?"
          : "What letter is missing?"}
      </h3>

      {/* =================================================
          SEQUENCE
      ================================================= */}

      <div className="sounds">

        {currentQuestion?.sequence.map(
          (item, index) => (
            <span
              key={`${item}-${index}`}
              className="sound-box"
              style={{
                fontSize: "28px",
                fontWeight: "800",
              }}
            >
              {item}
            </span>
          )
        )}

      </div>

      {/* =================================================
          OPTIONS
      ================================================= */}

      <h3>
        {mode === "numbers"
          ? "Choose the correct number"
          : "Choose the correct letter"}
      </h3>

      <div className="options">

        {currentQuestion?.options.map(
          (option, index) => {

            const isSelected =
              selected === option;

            const isCorrect =
              isSelected &&
              option ===
                currentQuestion.answer;

            const isWrong =
              isSelected &&
              option !==
                currentQuestion.answer;

            return (
              <button
                key={`${option}-${index}`}
                onClick={() =>
                  handleAnswer(option)
                }
                disabled={
                  processing ||
                  Boolean(selected)
                }
                style={{
                  backgroundColor:
                    isCorrect
                      ? "#d9f7df"
                      : isWrong
                        ? "#ffe1df"
                        : "",
                }}
              >
                {option}
              </button>
            );
          }
        )}

      </div>

      {/* =================================================
          MESSAGE
      ================================================= */}

      <p
        style={{
          minHeight: "30px",
          fontWeight: "700",
        }}
      >
        {message}
      </p>

      {/* =================================================
          PERFORMANCE
      ================================================= */}

      <div className="ai-analysis">

        <p>
          {score === 0
            ? "💡 Look carefully at the order."
            : getPerformanceMessage()}
        </p>

      </div>

    </div>
  );
}