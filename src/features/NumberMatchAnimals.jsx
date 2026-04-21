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




import React, { useEffect, useState } from "react";
import "../styles/NumberMatchAnimals.css";

const animalPool = ["🐶", "🐱", "🐰", "🐟", "🦋", "🐦", "🐢", "🦊", "🐻", "🐼"];

const levels = [
  { id: 1, title: "Easy", pairCount: 4, maxNumber: 5 },
  { id: 2, title: "Medium", pairCount: 6, maxNumber: 8 },
  { id: 3, title: "Hard", pairCount: 8, maxNumber: 10 },
];

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getUniqueNumbers(count, maxNumber) {
  const nums = Array.from({ length: maxNumber }, (_, i) => i + 1);
  return shuffleArray(nums).slice(0, count);
}

function generateRound(level) {
  const chosenNumbers = getUniqueNumbers(level.pairCount, level.maxNumber);
  const chosenAnimals = shuffleArray(animalPool).slice(0, level.pairCount);

  const pairs = chosenNumbers.map((number, index) => ({
    id: `${level.id}-${index + 1}`,
    number,
    animal: chosenAnimals[index],
  }));

  return {
    numberCards: shuffleArray(pairs),
    animalCards: shuffleArray(pairs),
  };
}

export default function NumberMatchAnimals() {
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [numberCards, setNumberCards] = useState([]);
  const [animalCards, setAnimalCards] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [message, setMessage] = useState("Match the number with correct animals");
  const [score, setScore] = useState(0);

  const loadRound = (level = selectedLevel) => {
    const { numberCards, animalCards } = generateRound(level);
    setNumberCards(numberCards);
    setAnimalCards(animalCards);
    setSelectedNumber(null);
    setMatchedIds([]);
    setMessage("Match the number with correct animals");
    setScore(0);
  };

  useEffect(() => {
    loadRound(selectedLevel);
  }, [selectedLevel]);

  const handleNumberClick = (item) => {
    if (matchedIds.includes(item.id)) return;
    setSelectedNumber(item);
    setMessage(`Now select the animal group for ${item.number}`);
  };

  const handleAnimalClick = (item) => {
    if (!selectedNumber || matchedIds.includes(item.id)) return;

    if (selectedNumber.id === item.id) {
      const updatedMatched = [...matchedIds, item.id];
      setMatchedIds(updatedMatched);
      setScore((prev) => prev + 1);
      setSelectedNumber(null);

      if (updatedMatched.length === numberCards.length) {
        setMessage("🎉 All matches are correct! Great job!");
      } else {
        setMessage("✅ Correct match!");
      }
    } else {
      setMessage("❌ Wrong match. Try another animal group.");
    }
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
  };

  const isCompleted = matchedIds.length === numberCards.length && numberCards.length > 0;

  return (
    <div className="match-page">
      <div className="match-card">
        <div className="match-top-bar">
          <h1>🐾 Number Match</h1>
          <p>Match the number with correct animals</p>
        </div>

        <div className="level-row">
          {levels.map((level) => (
            <button
              key={level.id}
              className={`level-btn ${selectedLevel.id === level.id ? "active-level" : ""}`}
              onClick={() => handleLevelChange(level)}
            >
              {level.title}
            </button>
          ))}
        </div>

        <div className="level-info">
          <span>
            Level: {selectedLevel.title} | Matches: {selectedLevel.pairCount}
          </span>
        </div>

        <div className="match-columns">
          <div className="match-column">
            <h2>Numbers</h2>
            {numberCards.map((item) => (
              <button
                key={`number-${item.id}`}
                className={`match-box number-box ${
                  selectedNumber?.id === item.id ? "selected-box" : ""
                } ${matchedIds.includes(item.id) ? "matched-box" : ""}`}
                onClick={() => handleNumberClick(item)}
                disabled={matchedIds.includes(item.id)}
              >
                {item.number}
              </button>
            ))}
          </div>

          <div className="match-column">
            <h2>Animals</h2>
            {animalCards.map((item) => (
              <button
                key={`animal-${item.id}`}
                className={`match-box animal-box ${
                  matchedIds.includes(item.id) ? "matched-box" : ""
                }`}
                onClick={() => handleAnimalClick(item)}
                disabled={matchedIds.includes(item.id)}
              >
                {item.animal.repeat(item.number)}
              </button>
            ))}
          </div>
        </div>

        <div className="message-box">
          <p>{message}</p>
        </div>

        <div className="score-box">
          <span>Score: {score}</span>
        </div>

        {isCompleted && (
          <div className="done-box">
            🎉 You matched all {selectedLevel.pairCount} pairs!
          </div>
        )}

        <div className="button-row">
          <button className="reset-btn" onClick={() => loadRound(selectedLevel)}>
            Reset
          </button>
          <button className="next-btn" onClick={() => loadRound(selectedLevel)}>
            Next Round
          </button>
        </div>
      </div>
    </div>
  );
}