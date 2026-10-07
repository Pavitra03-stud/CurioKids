import React, { useEffect, useMemo, useState } from "react";
import "../styles/BuildWord.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "build-word";
const GAME_NAME = "Build the Word";
const TOTAL_QUESTIONS = 5;

/*
|--------------------------------------------------------------------------
| LARGE ROTATING QUESTION BANK
|--------------------------------------------------------------------------
*/

const WORD_BANK = [
  {
    word: "SUN",
    emoji: "☀️",
    hint: "It shines in the sky.",
  },
  {
    word: "CAT",
    emoji: "🐱",
    hint: "A small animal that says meow.",
  },
  {
    word: "DOG",
    emoji: "🐶",
    hint: "A friendly animal that barks.",
  },
  {
    word: "FISH",
    emoji: "🐟",
    hint: "It swims in water.",
  },
  {
    word: "BOOK",
    emoji: "📚",
    hint: "You read this.",
  },
  {
    word: "MOON",
    emoji: "🌙",
    hint: "You can see it at night.",
  },
  {
    word: "STAR",
    emoji: "⭐",
    hint: "It twinkles in the night sky.",
  },
  {
    word: "TREE",
    emoji: "🌳",
    hint: "It has leaves and branches.",
  },
  {
    word: "BIRD",
    emoji: "🐦",
    hint: "It can fly in the sky.",
  },
  {
    word: "BALL",
    emoji: "⚽",
    hint: "You can kick or throw it.",
  },
  {
    word: "CAKE",
    emoji: "🎂",
    hint: "You may eat this on a birthday.",
  },
  {
    word: "FROG",
    emoji: "🐸",
    hint: "It can jump and says ribbit.",
  },
  {
    word: "FISH",
    emoji: "🐠",
    hint: "It lives underwater.",
  },
  {
    word: "RAIN",
    emoji: "🌧️",
    hint: "Water falls from the clouds.",
  },
  {
    word: "MILK",
    emoji: "🥛",
    hint: "A white drink.",
  },
  {
    word: "HAND",
    emoji: "✋",
    hint: "You have five fingers on it.",
  },
  {
    word: "SHIP",
    emoji: "🚢",
    hint: "It travels on water.",
  },
  {
    word: "STAR",
    emoji: "🌟",
    hint: "It shines in the sky.",
  },
  {
    word: "LION",
    emoji: "🦁",
    hint: "The king of the jungle.",
  },
  {
    word: "DUCK",
    emoji: "🦆",
    hint: "A bird that likes water.",
  },
  {
    word: "FARM",
    emoji: "🚜",
    hint: "A place where animals and crops are kept.",
  },
  {
    word: "APPLE",
    emoji: "🍎",
    hint: "A red or green fruit.",
  },
  {
    word: "HOUSE",
    emoji: "🏠",
    hint: "A place where people live.",
  },
  {
    word: "TIGER",
    emoji: "🐯",
    hint: "A big striped wild cat.",
  },
  {
    word: "HORSE",
    emoji: "🐴",
    hint: "An animal people can ride.",
  },
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getMissingIndex(word) {
  return Math.floor(Math.random() * word.length);
}

function createQuestion(usedWords = []) {
  const available = WORD_BANK.filter(
    (item) => !usedWords.includes(item.word)
  );

  const pool = available.length > 0 ? available : WORD_BANK;

  const selected = pool[Math.floor(Math.random() * pool.length)];

  const missingIndex = getMissingIndex(selected.word);
  const missingLetter = selected.word[missingIndex];

  const wrongLetters = shuffle(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .filter((letter) => letter !== missingLetter)
  ).slice(0, 3);

  const options = shuffle([missingLetter, ...wrongLetters]);

  return {
    ...selected,
    missingIndex,
    missingLetter,
    options,
  };
}

function createInitialState() {
  const firstQuestion = createQuestion();

  return {
    questionIndex: 0,
    score: 0,
    currentQuestion: firstQuestion,
    usedWords: [firstQuestion.word],
    answered: false,
    selectedLetter: null,
    message: "",
    completed: false,
  };
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function BuildWord() {
  const initialState = useMemo(() => createInitialState(), []);

  const { savedState, loading, save, finish } = useGameProgress(
    GAME_ID,
    initialState
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | RESTORE GAME
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (loading) return;

    if (
      savedState &&
      Object.keys(savedState).length > 0 &&
      savedState.currentQuestion
    ) {
      setQuestionIndex(savedState.questionIndex || 0);
      setScore(savedState.score || 0);
      setCurrentQuestion(savedState.currentQuestion);
      setUsedWords(savedState.usedWords || []);
      setAnswered(savedState.answered || false);
      setSelectedLetter(savedState.selectedLetter || null);
      setMessage(savedState.message || "");
      setCompleted(savedState.completed || false);

      console.log("✅ Build Word restored:", savedState);
      return;
    }

    const fresh = createInitialState();

    setQuestionIndex(fresh.questionIndex);
    setScore(fresh.score);
    setCurrentQuestion(fresh.currentQuestion);
    setUsedWords(fresh.usedWords);
    setAnswered(fresh.answered);
    setSelectedLetter(fresh.selectedLetter);
    setMessage(fresh.message);
    setCompleted(false);

    save({
      questionIndex: fresh.questionIndex,
      score: fresh.score,
      currentQuestion: fresh.currentQuestion,
      usedWords: fresh.usedWords,
      answered: false,
      selectedLetter: null,
      message: "",
      completed: false,
    });
  }, [loading, savedState]);

  /*
  |--------------------------------------------------------------------------
  | SAVE CURRENT STATE
  |--------------------------------------------------------------------------
  */

  const saveCurrentState = async (overrides = {}) => {
    await save({
      questionIndex,
      score,
      currentQuestion,
      usedWords,
      answered,
      selectedLetter,
      message,
      completed,
      ...overrides,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT LETTER
  |--------------------------------------------------------------------------
  */

  const handleLetterClick = async (letter) => {
    if (!currentQuestion || answered || completed) return;

    setSelectedLetter(letter);
    setAnswered(true);

    const isCorrect = letter === currentQuestion.missingLetter;

    const newScore = isCorrect ? score + 1 : score;

    const newMessage = isCorrect
      ? "🎉 Amazing! You built the word!"
      : `💛 Almost! The missing letter is ${currentQuestion.missingLetter}.`;

    setScore(newScore);
    setMessage(newMessage);

    await saveCurrentState({
      score: newScore,
      answered: true,
      selectedLetter: letter,
      message: newMessage,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | NEXT QUESTION
  |--------------------------------------------------------------------------
  */

  const handleNext = async () => {
    if (!currentQuestion || !answered || completed) return;

    /*
    |--------------------------------------------------------------
    | LAST QUESTION
    |--------------------------------------------------------------
    */

    if (questionIndex >= TOTAL_QUESTIONS - 1) {
      const finalScore = score;
      const percentage = Math.round(
        (finalScore / TOTAL_QUESTIONS) * 100
      );

      setCompleted(true);

      await saveCurrentState({
        completed: true,
        answered: true,
      });

      await finish(percentage, GAME_NAME);

      return;
    }

    /*
    |--------------------------------------------------------------
    | NEW QUESTION
    |--------------------------------------------------------------
    */

    const nextQuestion = createQuestion(usedWords);

    const newUsedWords = [...usedWords, nextQuestion.word];

    const nextIndex = questionIndex + 1;

    setQuestionIndex(nextIndex);
    setCurrentQuestion(nextQuestion);
    setUsedWords(newUsedWords);
    setAnswered(false);
    setSelectedLetter(null);
    setMessage("");

    await save({
      questionIndex: nextIndex,
      score,
      currentQuestion: nextQuestion,
      usedWords: newUsedWords,
      answered: false,
      selectedLetter: null,
      message: "",
      completed: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | PLAY AGAIN
  |--------------------------------------------------------------------------
  */

  const handlePlayAgain = async () => {
    const fresh = createInitialState();

    setQuestionIndex(0);
    setScore(0);
    setCurrentQuestion(fresh.currentQuestion);
    setUsedWords(fresh.usedWords);
    setAnswered(false);
    setSelectedLetter(null);
    setMessage("");
    setCompleted(false);

    await save({
      questionIndex: 0,
      score: 0,
      currentQuestion: fresh.currentQuestion,
      usedWords: fresh.usedWords,
      answered: false,
      selectedLetter: null,
      message: "",
      completed: false,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading || !currentQuestion) {
    return (
      <div className="build-word-page">
        <div className="build-loading">
          <div className="loading-emoji">🧩</div>
          <h2>Building your game...</h2>
          <p>Getting some fun words ready!</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | COMPLETED SCREEN
  |--------------------------------------------------------------------------
  */

  if (completed) {
    const percentage = Math.round(
      (score / TOTAL_QUESTIONS) * 100
    );

    return (
      <div className="build-word-page">
        <div className="build-shell">
          <div className="build-complete">
            <div className="complete-badge">🏆</div>

            <h1>Word Builder Champion!</h1>

            <p className="complete-text">
              You finished building all the words!
            </p>

            <div className="result-box">
              <div>
                <span>Score</span>
                <strong>
                  {score}/{TOTAL_QUESTIONS}
                </strong>
              </div>

              <div>
                <span>Accuracy</span>
                <strong>{percentage}%</strong>
              </div>
            </div>

            <div className="celebration">
              {percentage >= 80
                ? "🌟 Fantastic word building!"
                : "🌱 Great effort! Keep practicing!"}
            </div>

            <button
              className="play-again-button"
              onClick={handlePlayAgain}
            >
              🔄 Build Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | WORD DISPLAY
  |--------------------------------------------------------------------------
  */

  const wordLetters = currentQuestion.word.split("");

  return (
    <div className="build-word-page">
      <div className="build-shell">

        {/* HEADER */}

        <header className="build-header">
          <div className="build-title-icon">🧩</div>

          <div>
            <h1>Build the Word</h1>
            <p>Choose the missing letter and complete the word!</p>
          </div>
        </header>

        {/* TOP INFO */}

        <div className="build-info-row">

          <div className="build-info-card question-info">
            <span className="info-icon">📖</span>

            <div>
              <small>QUESTION</small>

              <strong>
                {questionIndex + 1}
                <span> / {TOTAL_QUESTIONS}</span>
              </strong>
            </div>
          </div>

          <div className="build-info-card score-info">
            <span className="info-icon">⭐</span>

            <div>
              <small>WORDS BUILT</small>

              <strong>{score}</strong>
            </div>
          </div>

        </div>

        {/* PROGRESS */}

        <div className="build-progress-area">
          <div className="progress-top">
            <span>Your word journey</span>

            <strong>
              {Math.round(
                ((questionIndex + 1) / TOTAL_QUESTIONS) * 100
              )}
              %
            </strong>
          </div>

          <div className="build-progress-track">
            <div
              className="build-progress-fill"
              style={{
                width: `${
                  ((questionIndex + 1) / TOTAL_QUESTIONS) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* MAIN PUZZLE */}

        <main className="word-puzzle">

          <div className="puzzle-decoration decoration-one">
            ✦
          </div>

          <div className="puzzle-decoration decoration-two">
            •
          </div>

          <div className="word-clue">

            <div className="word-emoji">
              {currentQuestion.emoji}
            </div>

            <div>
              <span>WORD CLUE</span>

              <p>{currentQuestion.hint}</p>
            </div>

          </div>

          <h2>Complete the word</h2>

          {/* WORD SLOTS */}

          <div className="word-slots">
            {wordLetters.map((letter, index) => {
              const isMissing =
                index === currentQuestion.missingIndex;

              let displayedLetter = "";

              if (!isMissing) {
                displayedLetter = letter;
              } else if (selectedLetter) {
                displayedLetter = selectedLetter;
              }

              return (
                <div
                  key={`${currentQuestion.word}-${index}`}
                  className={[
                    "word-slot",
                    isMissing ? "missing-slot" : "filled-slot",
                    selectedLetter && isMissing
                      ? selectedLetter ===
                        currentQuestion.missingLetter
                        ? "correct-slot"
                        : "wrong-slot"
                      : "",
                  ].join(" ")}
                >
                  {displayedLetter || "?"}
                </div>
              );
            })}
          </div>

          {/* HINT */}

          <div className="build-instruction">
            💡 Tap a letter to fill the empty space
          </div>

          {/* LETTER OPTIONS */}

          <div className="letter-area">

            <p className="choose-label">
              Which letter belongs here?
            </p>

            <div className="letter-options">
              {currentQuestion.options.map((letter) => {
                const isSelected =
                  selectedLetter === letter;

                const isCorrect =
                  isSelected &&
                  letter === currentQuestion.missingLetter;

                const isWrong =
                  isSelected &&
                  letter !== currentQuestion.missingLetter;

                return (
                  <button
                    key={letter}
                    className={[
                      "letter-tile",
                      isSelected ? "selected-letter" : "",
                      isCorrect ? "correct-letter" : "",
                      isWrong ? "wrong-letter" : "",
                    ].join(" ")}
                    onClick={() =>
                      handleLetterClick(letter)
                    }
                    disabled={answered}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FEEDBACK */}

          {message && (
            <div
              className={`build-feedback ${
                selectedLetter === currentQuestion.missingLetter
                  ? "feedback-good"
                  : "feedback-wrong"
              }`}
            >
              {message}
            </div>
          )}

          {/* NEXT */}

          {answered && (
            <button
              className="next-word-button"
              onClick={handleNext}
            >
              {questionIndex === TOTAL_QUESTIONS - 1
                ? "🏆 Finish Game"
                : "Next Word →"}
            </button>
          )}

        </main>
      </div>
    </div>
  );
}