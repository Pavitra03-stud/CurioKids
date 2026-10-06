// // import React, { useEffect, useState } from "react";
// // import "../styles/ArrangeNumbersGame.css";

// // function shuffleArray(array) {
// //   return [...array].sort(() => Math.random() - 0.5);
// // }

// // export default function ArrangeNumbersGame() {
// //   const [numbers, setNumbers] = useState([]);
// //   const [shuffled, setShuffled] = useState([]);
// //   const [selected, setSelected] = useState([]);
// //   const [message, setMessage] = useState("Arrange numbers in order");
// //   const [level, setLevel] = useState(1);

// //   // generate numbers based on level
// //   useEffect(() => {
// //     const max = level === 1 ? 5 : level === 2 ? 10 : 15;
// //     const nums = Array.from({ length: max }, (_, i) => i + 1);
// //     setNumbers(nums);
// //     setShuffled(shuffleArray(nums));
// //     setSelected([]);
// //   }, [level]);

// //   const handleClick = (num) => {
// //     if (selected.includes(num)) return;

// //     const newSelected = [...selected, num];
// //     setSelected(newSelected);

// //     if (newSelected.length === numbers.length) {
// //       if (JSON.stringify(newSelected) === JSON.stringify(numbers)) {
// //         setMessage("🎉 Correct! Well done!");
// //       } else {
// //         setMessage("❌ Wrong order! Try again.");
// //       }
// //     }
// //   };

// //   const handleReset = () => {
// //     setShuffled(shuffleArray(numbers));
// //     setSelected([]);
// //     setMessage("Try again");
// //   };

// //   const handleNextLevel = () => {
// //     setLevel((prev) => (prev < 3 ? prev + 1 : 1));
// //   };

// //   return (
// //     <div className="arrange-page">
// //       <div className="arrange-card">

// //         <h1>🔢 Arrange the Numbers</h1>
// //         <p>Tap numbers in the correct order</p>

// //         <div className="level-box">
// //           <span>Level: {level}</span>
// //         </div>

// //         {/* Selected Output */}
// //         <div className="output-box">
// //           {selected.map((num, index) => (
// //             <div key={index} className="number-box selected">
// //               {num}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Number Options */}
// //         <div className="numbers-grid">
// //           {shuffled.map((num) => (
// //             <button
// //               key={num}
// //               className={`number-btn ${
// //                 selected.includes(num) ? "disabled" : ""
// //               }`}
// //               onClick={() => handleClick(num)}
// //               disabled={selected.includes(num)}
// //             >
// //               {num}
// //             </button>
// //           ))}
// //         </div>

// //         <div className="message-box">
// //           <p>{message}</p>
// //         </div>

// //         <div className="btn-group">
// //           <button onClick={handleReset} className="reset-btn">
// //             Reset
// //           </button>
// //           <button onClick={handleNextLevel} className="next-btn">
// //             Next Level
// //           </button>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }




// import React, { useEffect, useMemo, useState } from "react";
// import "../styles/ArrangeNumbersGame.css";

// const levels = [
//   { id: 1, title: "Easy", type: "ascending", range: 10, count: 5, unlocked: true },
//   { id: 2, title: "Easy", type: "descending", range: 10, count: 5, unlocked: true },
//   { id: 3, title: "Medium", type: "ascending", range: 50, count: 8, unlocked: true },
//   { id: 4, title: "Medium", type: "descending", range: 50, count: 8, unlocked: true },
//   { id: 5, title: "Hard", type: "ascending", range: 100, count: 10, unlocked: true },
//   { id: 6, title: "Hard", type: "descending", range: 100, count: 10, unlocked: true },
// ];

// function shuffleArray(array) {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// }

// function generateUniqueNumbers(range, count) {
//   const allNumbers = Array.from({ length: range }, (_, i) => i + 1);
//   return shuffleArray(allNumbers).slice(0, count);
// }

// export default function ArrangeNumbersGame() {
//   const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
//   const [questionNumbers, setQuestionNumbers] = useState([]);
//   const [shuffledNumbers, setShuffledNumbers] = useState([]);
//   const [selectedNumbers, setSelectedNumbers] = useState([]);
//   const [message, setMessage] = useState("Tap numbers in the correct order");
//   const [completed, setCompleted] = useState(false);

//   const currentLevel = levels[currentLevelIndex];

//   const correctOrder = useMemo(() => {
//     const sorted = [...questionNumbers].sort((a, b) => a - b);
//     return currentLevel.type === "ascending" ? sorted : sorted.reverse();
//   }, [questionNumbers, currentLevel]);

//   const loadLevel = (level) => {
//     const numbers = generateUniqueNumbers(level.range, level.count);
//     setQuestionNumbers(numbers);
//     setShuffledNumbers(shuffleArray(numbers));
//     setSelectedNumbers([]);
//     setCompleted(false);
//     setMessage(
//       level.type === "ascending"
//         ? "Arrange from smallest to biggest"
//         : "Arrange from biggest to smallest"
//     );
//   };

//   useEffect(() => {
//     loadLevel(currentLevel);
//   }, [currentLevelIndex]);

//   const handleNumberClick = (number) => {
//     if (completed || selectedNumbers.includes(number)) return;

//     const nextIndex = selectedNumbers.length;
//     const expectedNumber = correctOrder[nextIndex];

//     if (number === expectedNumber) {
//       const updated = [...selectedNumbers, number];
//       setSelectedNumbers(updated);

//       if (updated.length === correctOrder.length) {
//         setCompleted(true);
//         setMessage("🎉 Super! You arranged all numbers correctly");
//       } else {
//         setMessage(`Good! Next number is ${correctOrder[updated.length]}`);
//       }
//     } else {
//       setMessage(`Oops! Choose ${expectedNumber}`);
//     }
//   };

//   const handleReset = () => {
//     setSelectedNumbers([]);
//     setCompleted(false);
//     setMessage(
//       currentLevel.type === "ascending"
//         ? "Arrange from smallest to biggest"
//         : "Arrange from biggest to smallest"
//     );
//   };

//   const handleNextLevel = () => {
//     const nextIndex = (currentLevelIndex + 1) % levels.length;
//     setCurrentLevelIndex(nextIndex);
//   };

//   return (
//     <div className="arrange-page">
//       <div className="arrange-card">
//         <div className="top-bar">
//           <h1>🔢 Arrange the Numbers</h1>
//           <p>Tap numbers in the correct order</p>
//         </div>

//         <div className="level-box">
//           <span>
//             Level: {currentLevel.id} | {currentLevel.title} |{" "}
//             {currentLevel.type === "ascending" ? "Ascending" : "Descending"}
//           </span>
//         </div>

//         <div className="numbers-section">
//           {shuffledNumbers.map((number) => (
//             <button
//               key={number}
//               className={`number-chip ${selectedNumbers.includes(number) ? "used" : ""}`}
//               onClick={() => handleNumberClick(number)}
//               disabled={selectedNumbers.includes(number)}
//             >
//               {number}
//             </button>
//           ))}
//         </div>

//         <div className="answer-box">
//           <h3>Arrange numbers in order</h3>
//           <div className="answer-row">
//             {correctOrder.map((_, index) => (
//               <div key={index} className="answer-slot">
//                 {selectedNumbers[index] ?? ""}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="message-box">
//           <p>{message}</p>
//         </div>

//         <button className="reset-btn" onClick={handleReset}>
//           Reset
//         </button>

//         <button className="next-btn" onClick={handleNextLevel}>
//           Next Level
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import "../styles/ArrangeNumbersGame.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "arrange-numbers";

const levels = [
  {
    id: 1,
    title: "Easy",
    type: "ascending",
    range: 10,
    count: 5,
    unlocked: true,
  },
  {
    id: 2,
    title: "Easy",
    type: "descending",
    range: 10,
    count: 5,
    unlocked: true,
  },
  {
    id: 3,
    title: "Medium",
    type: "ascending",
    range: 50,
    count: 8,
    unlocked: true,
  },
  {
    id: 4,
    title: "Medium",
    type: "descending",
    range: 50,
    count: 8,
    unlocked: true,
  },
  {
    id: 5,
    title: "Hard",
    type: "ascending",
    range: 100,
    count: 10,
    unlocked: true,
  },
  {
    id: 6,
    title: "Hard",
    type: "descending",
    range: 100,
    count: 10,
    unlocked: true,
  },
];

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] = [
      newArray[j],
      newArray[i],
    ];
  }

  return newArray;
}

function generateUniqueNumbers(range, count) {
  const allNumbers = Array.from(
    { length: range },
    (_, i) => i + 1
  );

  return shuffleArray(allNumbers).slice(0, count);
}

export default function ArrangeNumbersGame() {
  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(GAME_ID, {
    currentLevelIndex: 0,
    questionNumbers: [],
    shuffledNumbers: [],
    selectedNumbers: [],
    message: "Tap numbers in the correct order",
    completed: false,
  });

  const [currentLevelIndex, setCurrentLevelIndex] =
    useState(0);

  const [questionNumbers, setQuestionNumbers] =
    useState([]);

  const [shuffledNumbers, setShuffledNumbers] =
    useState([]);

  const [selectedNumbers, setSelectedNumbers] =
    useState([]);

  const [message, setMessage] = useState(
    "Tap numbers in the correct order"
  );

  const [completed, setCompleted] = useState(false);

  const [restored, setRestored] = useState(false);

  const currentLevel = levels[currentLevelIndex];

  const correctOrder = useMemo(() => {
    const sorted = [...questionNumbers].sort(
      (a, b) => a - b
    );

    return currentLevel.type === "ascending"
      ? sorted
      : sorted.reverse();
  }, [questionNumbers, currentLevel]);

  /*
   * 🔄 RESTORE SAVED PROGRESS
   */
  useEffect(() => {
    if (progressLoading || !savedState) return;

    console.log(
      "🔢 Arrange Numbers saved state:",
      savedState
    );

    const savedLevelIndex =
      savedState.currentLevelIndex ?? 0;

    const savedQuestionNumbers =
      savedState.questionNumbers ?? [];

    const savedShuffledNumbers =
      savedState.shuffledNumbers ?? [];

    setCurrentLevelIndex(savedLevelIndex);

    setQuestionNumbers(savedQuestionNumbers);

    setShuffledNumbers(savedShuffledNumbers);

    setSelectedNumbers(
      savedState.selectedNumbers ?? []
    );

    setMessage(
      savedState.message ??
        "Tap numbers in the correct order"
    );

    setCompleted(
      savedState.completed ?? false
    );

    setRestored(true);
  }, [progressLoading, savedState]);

  /*
   * 🎲 CREATE FIRST QUESTION
   *
   * Only generate random numbers if there is
   * no saved question.
   */
  useEffect(() => {
    if (!restored) return;

    if (
      questionNumbers.length === 0 &&
      shuffledNumbers.length === 0
    ) {
      const numbers = generateUniqueNumbers(
        currentLevel.range,
        currentLevel.count
      );

      const shuffled = shuffleArray(numbers);

      const initialMessage =
        currentLevel.type === "ascending"
          ? "Arrange from smallest to biggest"
          : "Arrange from biggest to smallest";

      setQuestionNumbers(numbers);
      setShuffledNumbers(shuffled);
      setSelectedNumbers([]);
      setCompleted(false);
      setMessage(initialMessage);

      save({
        currentLevelIndex,
        questionNumbers: numbers,
        shuffledNumbers: shuffled,
        selectedNumbers: [],
        completed: false,
        message: initialMessage,
      });
    }
  }, [restored, currentLevelIndex]);

  /*
   * 💾 SAVE PROGRESS
   */
  const saveCurrentProgress = async (
    overrides = {}
  ) => {
    await save({
      currentLevelIndex,
      questionNumbers,
      shuffledNumbers,
      selectedNumbers,
      message,
      completed,
      ...overrides,
    });
  };

  /*
   * 🔢 NUMBER CLICK
   */
  const handleNumberClick = async (number) => {
    if (
      completed ||
      selectedNumbers.includes(number)
    ) {
      return;
    }

    const nextIndex = selectedNumbers.length;

    const expectedNumber =
      correctOrder[nextIndex];

    /*
     * ✅ CORRECT ANSWER
     */
    if (number === expectedNumber) {
      const updated = [
        ...selectedNumbers,
        number,
      ];

      setSelectedNumbers(updated);

      /*
       * 🎉 LEVEL COMPLETED
       */
      if (
        updated.length ===
        correctOrder.length
      ) {
        const successMessage =
          "🎉 Super! You arranged all numbers correctly";

        setCompleted(true);
        setMessage(successMessage);

        await save({
          currentLevelIndex,
          questionNumbers,
          shuffledNumbers,
          selectedNumbers: updated,
          message: successMessage,
          completed: true,
        });
      } else {
        const nextNumber =
          correctOrder[updated.length];

        const nextMessage =
          `Good! Next number is ${nextNumber}`;

        setMessage(nextMessage);

        await save({
          currentLevelIndex,
          questionNumbers,
          shuffledNumbers,
          selectedNumbers: updated,
          message: nextMessage,
          completed: false,
        });
      }
    } else {
      /*
       * ❌ WRONG ANSWER
       */
      const wrongMessage =
        `Oops! Choose ${expectedNumber}`;

      setMessage(wrongMessage);

      await save({
        currentLevelIndex,
        questionNumbers,
        shuffledNumbers,
        selectedNumbers,
        message: wrongMessage,
        completed: false,
      });
    }
  };

  /*
   * 🔄 RESET CURRENT LEVEL
   */
  const handleReset = async () => {
    const resetMessage =
      currentLevel.type === "ascending"
        ? "Arrange from smallest to biggest"
        : "Arrange from biggest to smallest";

    setSelectedNumbers([]);
    setCompleted(false);
    setMessage(resetMessage);

    await save({
      currentLevelIndex,
      questionNumbers,
      shuffledNumbers,
      selectedNumbers: [],
      message: resetMessage,
      completed: false,
    });
  };

  /*
   * ➡️ NEXT LEVEL
   */
  const handleNextLevel = async () => {
    const nextIndex =
      (currentLevelIndex + 1) %
      levels.length;

    const nextLevel = levels[nextIndex];

    const numbers = generateUniqueNumbers(
      nextLevel.range,
      nextLevel.count
    );

    const shuffled = shuffleArray(numbers);

    const nextMessage =
      nextLevel.type === "ascending"
        ? "Arrange from smallest to biggest"
        : "Arrange from biggest to smallest";

    setCurrentLevelIndex(nextIndex);
    setQuestionNumbers(numbers);
    setShuffledNumbers(shuffled);
    setSelectedNumbers([]);
    setCompleted(false);
    setMessage(nextMessage);

    await save({
      currentLevelIndex: nextIndex,
      questionNumbers: numbers,
      shuffledNumbers: shuffled,
      selectedNumbers: [],
      message: nextMessage,
      completed: false,
    });
  };

  /*
   * ⏳ LOADING
   */
  if (progressLoading || !restored) {
    return (
      <div className="arrange-page">
        <div className="arrange-card">
          <div className="top-bar">
            <h1>🔢 Arrange the Numbers</h1>
            <p>Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="arrange-page">
      <div className="arrange-card">
        <div className="top-bar">
          <h1>🔢 Arrange the Numbers</h1>

          <p>
            Tap numbers in the correct order
          </p>
        </div>

        <div className="level-box">
          <span>
            Level: {currentLevel.id} |{" "}
            {currentLevel.title} |{" "}
            {currentLevel.type === "ascending"
              ? "Ascending"
              : "Descending"}
          </span>
        </div>

        <div className="numbers-section">
          {shuffledNumbers.map((number) => (
            <button
              key={number}
              className={`number-chip ${
                selectedNumbers.includes(number)
                  ? "used"
                  : ""
              }`}
              onClick={() =>
                handleNumberClick(number)
              }
              disabled={
                selectedNumbers.includes(number) ||
                completed
              }
            >
              {number}
            </button>
          ))}
        </div>

        <div className="answer-box">
          <h3>
            Arrange numbers in order
          </h3>

          <div className="answer-row">
            {correctOrder.map(
              (_, index) => (
                <div
                  key={index}
                  className="answer-slot"
                >
                  {selectedNumbers[index] ??
                    ""}
                </div>
              )
            )}
          </div>
        </div>

        <div className="message-box">
          <p>{message}</p>
        </div>

        <button
          className="reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          className="next-btn"
          onClick={handleNextLevel}
        >
          Next Level
        </button>
      </div>
    </div>
  );
}