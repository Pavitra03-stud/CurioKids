// import React, { useEffect, useState } from "react";
// import "../styles/NumberMatchAnimals.css";

// const animalsList = ["🐶", "🐱", "🐰", "🐟", "🐦", "🦋"];

// function shuffle(array) {
//   return [...array].sort(() => Math.random() - 0.5);
// }

// function generateRound() {
//   const numbers = [1, 2, 3, 4]; // easy level
//   const shuffledAnimals = shuffle(animalsList).slice(0, numbers.length);

//   return numbers.map((num, index) => ({
//     id: index,
//     number: num,
//     animal: shuffledAnimals[index],
//   }));
// }

// export default function NumberMatchAnimals() {
//   const [pairs, setPairs] = useState([]);
//   const [numbers, setNumbers] = useState([]);
//   const [animals, setAnimals] = useState([]);

//   const [selectedNumber, setSelectedNumber] = useState(null);
//   const [matched, setMatched] = useState({});
//   const [message, setMessage] = useState("Match the number with animals");
//   const [score, setScore] = useState(0);

//   const loadGame = () => {
//     const data = generateRound();
//     setPairs(data);
//     setNumbers(shuffle(data));
//     setAnimals(shuffle(data));
//     setMatched({});
//     setSelectedNumber(null);
//     setMessage("Match the number with animals");
//   };

//   useEffect(() => {
//     loadGame();
//   }, []);

//   const handleNumberClick = (item) => {
//     if (matched[item.id]) return;
//     setSelectedNumber(item);
//     setMessage(`Now select animals for ${item.number}`);
//   };

//   const handleAnimalClick = (item) => {
//     if (!selectedNumber || matched[item.id]) return;

//     if (selectedNumber.id === item.id) {
//       setMatched((prev) => ({ ...prev, [item.id]: true }));
//       setScore((prev) => prev + 1);
//       setMessage("✅ Correct match!");

//       setSelectedNumber(null);
//     } else {
//       setMessage("❌ Try again!");
//     }
//   };

//   const isCompleted = Object.keys(matched).length === pairs.length;

//   return (
//     <div className="match-page">
//       <div className="match-card">
//         <h1>🐾 Number Match</h1>
//         <p>Match the number with correct animals</p>

//         <div className="match-container">
//           {/* Numbers */}
//           <div className="column">
//             <h3>Numbers</h3>
//             {numbers.map((item) => (
//               <button
//                 key={item.id}
//                 className={`number-box ${
//                   selectedNumber?.id === item.id ? "selected" : ""
//                 } ${matched[item.id] ? "matched" : ""}`}
//                 onClick={() => handleNumberClick(item)}
//               >
//                 {item.number}
//               </button>
//             ))}
//           </div>

//           {/* Animals */}
//           <div className="column">
//             <h3>Animals</h3>
//             {animals.map((item) => (
//               <button
//                 key={item.id}
//                 className={`animal-box ${matched[item.id] ? "matched" : ""}`}
//                 onClick={() => handleAnimalClick(item)}
//               >
//                 {item.animal.repeat(item.number)}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="message-box">
//           <p>{message}</p>
//         </div>

//         <div className="score-box">Score: {score}</div>

//         {isCompleted && (
//           <div className="done-box">🎉 All matched! Great job!</div>
//         )}

//         <div className="btn-group">
//           <button onClick={loadGame}>Reset</button>
//         </div>
//       </div>
//     </div>
//   );
// }




// import React, { useEffect, useState } from "react";
// import "../styles/NumberMatchAnimals.css";

// const animalPool = ["🐶", "🐱", "🐰", "🐟", "🦋", "🐦", "🐢", "🦊", "🐻", "🐼"];

// const levels = [
//   { id: 1, title: "Easy", pairCount: 4, maxNumber: 5 },
//   { id: 2, title: "Medium", pairCount: 6, maxNumber: 8 },
//   { id: 3, title: "Hard", pairCount: 8, maxNumber: 10 },
// ];

// function shuffleArray(array) {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// }

// function getUniqueNumbers(count, maxNumber) {
//   const nums = Array.from({ length: maxNumber }, (_, i) => i + 1);
//   return shuffleArray(nums).slice(0, count);
// }

// function generateRound(level) {
//   const chosenNumbers = getUniqueNumbers(level.pairCount, level.maxNumber);
//   const chosenAnimals = shuffleArray(animalPool).slice(0, level.pairCount);

//   const pairs = chosenNumbers.map((number, index) => ({
//     id: `${level.id}-${index + 1}`,
//     number,
//     animal: chosenAnimals[index],
//   }));

//   return {
//     numberCards: shuffleArray(pairs),
//     animalCards: shuffleArray(pairs),
//   };
// }

// export default function NumberMatchAnimals() {
//   const [selectedLevel, setSelectedLevel] = useState(levels[0]);
//   const [numberCards, setNumberCards] = useState([]);
//   const [animalCards, setAnimalCards] = useState([]);
//   const [selectedNumber, setSelectedNumber] = useState(null);
//   const [matchedIds, setMatchedIds] = useState([]);
//   const [message, setMessage] = useState("Match the number with correct animals");
//   const [score, setScore] = useState(0);

//   const loadRound = (level = selectedLevel) => {
//     const { numberCards, animalCards } = generateRound(level);
//     setNumberCards(numberCards);
//     setAnimalCards(animalCards);
//     setSelectedNumber(null);
//     setMatchedIds([]);
//     setMessage("Match the number with correct animals");
//     setScore(0);
//   };

//   useEffect(() => {
//     loadRound(selectedLevel);
//   }, [selectedLevel]);

//   const handleNumberClick = (item) => {
//     if (matchedIds.includes(item.id)) return;
//     setSelectedNumber(item);
//     setMessage(`Now select the animal group for ${item.number}`);
//   };

//   const handleAnimalClick = (item) => {
//     if (!selectedNumber || matchedIds.includes(item.id)) return;

//     if (selectedNumber.id === item.id) {
//       const updatedMatched = [...matchedIds, item.id];
//       setMatchedIds(updatedMatched);
//       setScore((prev) => prev + 1);
//       setSelectedNumber(null);

//       if (updatedMatched.length === numberCards.length) {
//         setMessage("🎉 All matches are correct! Great job!");
//       } else {
//         setMessage("✅ Correct match!");
//       }
//     } else {
//       setMessage("❌ Wrong match. Try another animal group.");
//     }
//   };

//   const handleLevelChange = (level) => {
//     setSelectedLevel(level);
//   };

//   const isCompleted = matchedIds.length === numberCards.length && numberCards.length > 0;

//   return (
//     <div className="match-page">
//       <div className="match-card">
//         <div className="match-top-bar">
//           <h1>🐾 Number Match</h1>
//           <p>Match the number with correct animals</p>
//         </div>

//         <div className="level-row">
//           {levels.map((level) => (
//             <button
//               key={level.id}
//               className={`level-btn ${selectedLevel.id === level.id ? "active-level" : ""}`}
//               onClick={() => handleLevelChange(level)}
//             >
//               {level.title}
//             </button>
//           ))}
//         </div>

//         <div className="level-info">
//           <span>
//             Level: {selectedLevel.title} | Matches: {selectedLevel.pairCount}
//           </span>
//         </div>

//         <div className="match-columns">
//           <div className="match-column">
//             <h2>Numbers</h2>
//             {numberCards.map((item) => (
//               <button
//                 key={`number-${item.id}`}
//                 className={`match-box number-box ${
//                   selectedNumber?.id === item.id ? "selected-box" : ""
//                 } ${matchedIds.includes(item.id) ? "matched-box" : ""}`}
//                 onClick={() => handleNumberClick(item)}
//                 disabled={matchedIds.includes(item.id)}
//               >
//                 {item.number}
//               </button>
//             ))}
//           </div>

//           <div className="match-column">
//             <h2>Animals</h2>
//             {animalCards.map((item) => (
//               <button
//                 key={`animal-${item.id}`}
//                 className={`match-box animal-box ${
//                   matchedIds.includes(item.id) ? "matched-box" : ""
//                 }`}
//                 onClick={() => handleAnimalClick(item)}
//                 disabled={matchedIds.includes(item.id)}
//               >
//                 {item.animal.repeat(item.number)}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="message-box">
//           <p>{message}</p>
//         </div>

//         <div className="score-box">
//           <span>Score: {score}</span>
//         </div>

//         {isCompleted && (
//           <div className="done-box">
//             🎉 You matched all {selectedLevel.pairCount} pairs!
//           </div>
//         )}

//         <div className="button-row">
//           <button className="reset-btn" onClick={() => loadRound(selectedLevel)}>
//             Reset
//           </button>
//           <button className="next-btn" onClick={() => loadRound(selectedLevel)}>
//             Next Round
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import "../styles/NumberMatchAnimals.css";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "number-match-animals";

const animalPool = [
  "🐶",
  "🐱",
  "🐰",
  "🐟",
  "🦋",
  "🐦",
  "🐢",
  "🦊",
  "🐻",
  "🐼",
];

const levels = [
  {
    id: 1,
    title: "Easy",
    pairCount: 4,
    maxNumber: 5,
  },
  {
    id: 2,
    title: "Medium",
    pairCount: 6,
    maxNumber: 8,
  },
  {
    id: 3,
    title: "Hard",
    pairCount: 8,
    maxNumber: 10,
  },
];

/* =========================================================
   SHUFFLE
========================================================= */

function shuffleArray(array) {
  const newArray = [...array];

  for (
    let i = newArray.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [newArray[i], newArray[j]] = [
      newArray[j],
      newArray[i],
    ];
  }

  return newArray;
}

/* =========================================================
   UNIQUE NUMBERS
========================================================= */

function getUniqueNumbers(
  count,
  maxNumber
) {
  const nums = Array.from(
    { length: maxNumber },
    (_, i) => i + 1
  );

  return shuffleArray(nums).slice(
    0,
    count
  );
}

/* =========================================================
   GENERATE ROUND
========================================================= */

function generateRound(level) {
  const chosenNumbers =
    getUniqueNumbers(
      level.pairCount,
      level.maxNumber
    );

  const chosenAnimals =
    shuffleArray(animalPool).slice(
      0,
      level.pairCount
    );

  const pairs = chosenNumbers.map(
    (number, index) => ({
      id: `${level.id}-${index + 1}`,
      number,
      animal:
        chosenAnimals[index],
    })
  );

  return {
    numberCards:
      shuffleArray(pairs),

    animalCards:
      shuffleArray(pairs),
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function NumberMatchAnimals() {
  const initialState = {
    selectedLevelId: 1,
    numberCards: [],
    animalCards: [],
    selectedNumber: null,
    matchedIds: [],
    message:
      "Match the number with correct animals",
    score: 0,
    completed: false,
  };

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(
    GAME_ID,
    initialState
  );

  /* =========================================================
     STATES
  ========================================================= */

  const [selectedLevel, setSelectedLevel] =
    useState(levels[0]);

  const [numberCards, setNumberCards] =
    useState([]);

  const [animalCards, setAnimalCards] =
    useState([]);

  const [selectedNumber, setSelectedNumber] =
    useState(null);

  const [matchedIds, setMatchedIds] =
    useState([]);

  const [message, setMessage] =
    useState(
      "Match the number with correct animals"
    );

  const [score, setScore] =
    useState(0);

  const [completed, setCompleted] =
    useState(false);

  const [restored, setRestored] =
    useState(false);

  /* =========================================================
     RESTORE SAVED GAME
  ========================================================= */

  useEffect(() => {
    if (progressLoading) return;
    if (restored) return;

    console.log(
      "🔥 Number Match Animals saved state:",
      savedState
    );

    if (
      savedState &&
      savedState.numberCards?.length > 0
    ) {
      const savedLevel =
        levels.find(
          (level) =>
            level.id ===
            savedState.selectedLevelId
        ) || levels[0];

      setSelectedLevel(savedLevel);

      setNumberCards(
        savedState.numberCards || []
      );

      setAnimalCards(
        savedState.animalCards || []
      );

      setSelectedNumber(
        savedState.selectedNumber || null
      );

      setMatchedIds(
        savedState.matchedIds || []
      );

      setMessage(
        savedState.message ||
          "Match the number with correct animals"
      );

      setScore(
        savedState.score || 0
      );

      setCompleted(
        Boolean(savedState.completed)
      );
    } else {
      /* No saved round → create first round */
      const firstLevel = levels[0];

      const {
        numberCards,
        animalCards,
      } = generateRound(firstLevel);

      setSelectedLevel(firstLevel);
      setNumberCards(numberCards);
      setAnimalCards(animalCards);
      setSelectedNumber(null);
      setMatchedIds([]);
      setMessage(
        "Match the number with correct animals"
      );
      setScore(0);
      setCompleted(false);
    }

    setRestored(true);
  }, [
    progressLoading,
    savedState,
    restored,
  ]);

  /* =========================================================
     SAVE STATE
  ========================================================= */

  const saveCurrentState = async (
    overrides = {}
  ) => {
    await save({
      selectedLevelId:
        selectedLevel.id,

      numberCards,

      animalCards,

      selectedNumber,

      matchedIds,

      message,

      score,

      completed,

      ...overrides,
    });
  };

  /* =========================================================
     LOAD ROUND
  ========================================================= */

  const loadRound = async (
    level = selectedLevel
  ) => {
    const {
      numberCards,
      animalCards,
    } = generateRound(level);

    const initialMessage =
      "Match the number with correct animals";

    setNumberCards(numberCards);
    setAnimalCards(animalCards);
    setSelectedNumber(null);
    setMatchedIds([]);
    setMessage(initialMessage);
    setScore(0);
    setCompleted(false);

    /* 💾 SAVE NEW ROUND */
    await save({
      selectedLevelId: level.id,
      numberCards,
      animalCards,
      selectedNumber: null,
      matchedIds: [],
      message: initialMessage,
      score: 0,
      completed: false,
    });
  };

  /* =========================================================
     LEVEL CHANGE
  ========================================================= */

  const handleLevelChange = async (
    level
  ) => {
    setSelectedLevel(level);

    await loadRound(level);
  };

  /* =========================================================
     NUMBER CLICK
  ========================================================= */

  const handleNumberClick = async (
    item
  ) => {
    if (
      matchedIds.includes(item.id)
    ) {
      return;
    }

    const newMessage = `Now select the animal group for ${item.number}`;

    setSelectedNumber(item);
    setMessage(newMessage);

    await saveCurrentState({
      selectedNumber: item,
      message: newMessage,
    });
  };

  /* =========================================================
     ANIMAL CLICK
  ========================================================= */

  const handleAnimalClick = async (
    item
  ) => {
    if (!selectedNumber) return;

    if (
      matchedIds.includes(item.id)
    ) {
      return;
    }

    /* -----------------------------------------
       CORRECT MATCH
    ----------------------------------------- */

    if (
      selectedNumber.id === item.id
    ) {
      const updatedMatched = [
        ...matchedIds,
        item.id,
      ];

      const updatedScore =
        score + 1;

      const isLastMatch =
        updatedMatched.length ===
        numberCards.length;

      const newMessage = isLastMatch
        ? "🎉 All matches are correct! Great job!"
        : "✅ Correct match!";

      setMatchedIds(
        updatedMatched
      );

      setScore(updatedScore);

      setSelectedNumber(null);

      setMessage(newMessage);

      /* ---------------------------------------
         GAME COMPLETE
      --------------------------------------- */

      if (isLastMatch) {
        const percentage =
          (updatedScore /
            numberCards.length) *
          100;

        console.log(
          "🏁 Number Match completed:",
          {
            score: updatedScore,
            total:
              numberCards.length,
            percentage,
          }
        );

        await finish(
          percentage,
          "Number Match Animals"
        );

        setCompleted(true);

        await save({
          selectedLevelId:
            selectedLevel.id,

          numberCards,

          animalCards,

          selectedNumber: null,

          matchedIds:
            updatedMatched,

          message: newMessage,

          score: updatedScore,

          completed: true,
        });

        return;
      }

      /* ---------------------------------------
         SAVE CORRECT MATCH
      --------------------------------------- */

      await save({
        selectedLevelId:
          selectedLevel.id,

        numberCards,

        animalCards,

        selectedNumber: null,

        matchedIds:
          updatedMatched,

        message: newMessage,

        score: updatedScore,

        completed: false,
      });

      return;
    }

    /* -----------------------------------------
       WRONG MATCH
    ----------------------------------------- */

    const wrongMessage =
      "❌ Wrong match. Try another animal group.";

    setMessage(wrongMessage);

    await saveCurrentState({
      selectedNumber,
      message: wrongMessage,
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (
    progressLoading ||
    !restored
  ) {
    return (
      <div className="match-page">
        <div className="match-card">

          <div className="match-top-bar">
            <h1>
              🐾 Number Match
            </h1>

            <p>
              Loading your game...
            </p>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="match-page">

      <div className="match-card">

        {/* TOP BAR */}
        <div className="match-top-bar">

          <h1>
            🐾 Number Match
          </h1>

          <p>
            Match the number with correct
            animals
          </p>

        </div>

        {/* LEVELS */}
        <div className="level-row">

          {levels.map((level) => (
            <button
              key={level.id}
              className={`level-btn ${
                selectedLevel.id ===
                level.id
                  ? "active-level"
                  : ""
              }`}
              onClick={() =>
                handleLevelChange(level)
              }
            >
              {level.title}
            </button>
          ))}

        </div>

        {/* LEVEL INFO */}
        <div className="level-info">

          <span>
            Level:{" "}
            {selectedLevel.title} |
            {" "}
            Matches:{" "}
            {selectedLevel.pairCount}
          </span>

        </div>

        {/* MATCH COLUMNS */}
        <div className="match-columns">

          {/* NUMBERS */}
          <div className="match-column">

            <h2>
              Numbers
            </h2>

            {numberCards.map(
              (item) => (
                <button
                  key={`number-${item.id}`}
                  className={`match-box number-box ${
                    selectedNumber?.id ===
                    item.id
                      ? "selected-box"
                      : ""
                  } ${
                    matchedIds.includes(
                      item.id
                    )
                      ? "matched-box"
                      : ""
                  }`}
                  onClick={() =>
                    handleNumberClick(
                      item
                    )
                  }
                  disabled={matchedIds.includes(
                    item.id
                  )}
                >
                  {item.number}
                </button>
              )
            )}

          </div>

          {/* ANIMALS */}
          <div className="match-column">

            <h2>
              Animals
            </h2>

            {animalCards.map(
              (item) => (
                <button
                  key={`animal-${item.id}`}
                  className={`match-box animal-box ${
                    matchedIds.includes(
                      item.id
                    )
                      ? "matched-box"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnimalClick(
                      item
                    )
                  }
                  disabled={matchedIds.includes(
                    item.id
                  )}
                >
                  {item.animal.repeat(
                    item.number
                  )}
                </button>
              )
            )}

          </div>

        </div>

        {/* MESSAGE */}
        <div className="message-box">

          <p>
            {message}
          </p>

        </div>

        {/* SCORE */}
        <div className="score-box">

          <span>
            Score: {score}
          </span>

        </div>

        {/* COMPLETED */}
        {completed && (
          <div className="done-box">
            🎉 You matched all{" "}
            {selectedLevel.pairCount}{" "}
            pairs!
          </div>
        )}

        {/* BUTTONS */}
        <div className="button-row">

          <button
            className="reset-btn"
            onClick={() =>
              loadRound(
                selectedLevel
              )
            }
          >
            Reset
          </button>

          <button
            className="next-btn"
            onClick={() =>
              loadRound(
                selectedLevel
              )
            }
          >
            Next Round
          </button>

        </div>

      </div>

    </div>
  );
}