import { useState } from "react";
import BackIcon from "../components/BackIcon";

const alphabetData = [
  { letter: "A", word: "Ant", emoji: "🐜" },
  { letter: "B", word: "Bear", emoji: "🐻" },
  { letter: "C", word: "Cat", emoji: "🐱" },
  { letter: "D", word: "Dog", emoji: "🐶" },
  { letter: "E", word: "Elephant", emoji: "🐘" },
  { letter: "F", word: "Flamingo", emoji: "🦩" },
  { letter: "G", word: "Giraffe", emoji: "🦒" },
  { letter: "H", word: "Horse", emoji: "🐎" },
  { letter: "I", word: "Iguana", emoji: "🦎" },
  { letter: "J", word: "Jellyfish", emoji: "🪼" },
  { letter: "K", word: "Kangaroo", emoji: "🦘" },
  { letter: "L", word: "Lion", emoji: "🦁" },
  { letter: "M", word: "Monkey", emoji: "🐒" },
  { letter: "N", word: "Narwhal", emoji: "🐋" },
  { letter: "O", word: "Owl", emoji: "🦉" },
  { letter: "P", word: "Panda", emoji: "🐼" },
  { letter: "Q", word: "Quail", emoji: "🐦" },
  { letter: "R", word: "Rabbit", emoji: "🐰" },
  { letter: "S", word: "Sheep", emoji: "🐑" },
  { letter: "T", word: "Tiger", emoji: "🐯" },
  { letter: "U", word: "Urchin", emoji: "🦔" },
  { letter: "V", word: "Vulture", emoji: "🦅" },
  { letter: "W", word: "Whale", emoji: "🐳" },
  { letter: "X", word: "X-Ray Fish", emoji: "🐟" },
  { letter: "Y", word: "Yak", emoji: "🐂" },
  { letter: "Z", word: "Zebra", emoji: "🦓" }
];

export default function AlphabetFlashCard({ goBack }) {

  const [index, setIndex] = useState(0);
  const item = alphabetData[index];

  const speak = () => {
    const speech = new SpeechSynthesisUtterance(
      `${item.letter} is for ${item.word}`
    );
    speech.rate = 0.8;
    window.speechSynthesis.speak(speech);
  };

  const next = () => {
    if (index < alphabetData.length - 1) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>

      {/* TOP BAR */}
      <div
        style={{
          background: "#1b4332",
          color: "white",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          position: "relative",
          marginBottom: "30px"
        }}
      >
        <div style={{ position: "absolute", left: "15px" }}>
          <BackIcon goBack={goBack} />
        </div>

        <h2>🔤 Alphabet Learning</h2>
      </div>

      {/* LETTER */}
      <h1 style={{ fontSize: "90px" }}>
        {item.letter} {item.letter.toLowerCase()}
      </h1>

      {/* ANIMAL */}
      <div
        onClick={speak}
        style={{
          fontSize: "150px",
          cursor: "pointer",
          margin: "20px"
        }}
      >
        {item.emoji}
      </div>

      {/* WORD */}
      <h2 style={{ fontSize: "40px" }}>
        {item.word}
      </h2>

      <p>Tap the picture to hear the sound 🔊</p>

      {/* NAVIGATION */}
      <div style={{ marginTop: "30px" }}>

        <button
          onClick={prev}
          style={{
            padding: "10px 20px",
            marginRight: "10px"
          }}
        >
          ⬅ Previous
        </button>

        <button
          onClick={next}
          style={{
            padding: "10px 20px"
          }}
        >
          Next ➡
        </button>

      </div>

    </div>
  );
}