import { useEffect, useState } from "react";
import "../styles/AlphabetFlashCard.css";

const cards = [
  { letter: "A", word: "ANT", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41c.svg" },
  { letter: "B", word: "BEAR", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43b.svg" },
  { letter: "C", word: "CAT", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg" },
  { letter: "D", word: "DOG", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg" },
  { letter: "E", word: "ELEPHANT", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f418.svg" },
  { letter: "F", word: "FOX", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg" },
  { letter: "G", word: "GIRAFFE", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f992.svg" },
  { letter: "H", word: "HORSE", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f434.svg" },
  { letter: "I", word: "IGUANA", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg" },
  { letter: "J", word: "JELLYFISH", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1fabc.svg" },
  { letter: "K", word: "KOALA", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f428.svg" },
  { letter: "L", word: "LION", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg" },
  { letter: "M", word: "MONKEY", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f435.svg" },
  { letter: "N", word: "OWL", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg" },
  { letter: "O", word: "OCTOPUS", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f419.svg" },
  { letter: "P", word: "PENGUIN", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg" },
  { letter: "Q", word: "QUAIL", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg" },
  { letter: "R", word: "RABBIT", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg" },
  { letter: "S", word: "SNAKE", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40d.svg" },
  { letter: "T", word: "TIGER", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f42f.svg" },
  { letter: "U", word: "UNICORN", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg" },
  { letter: "V", word: "VULTURE", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg" },
  { letter: "W", word: "WHALE", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40b.svg" },
  { letter: "X", word: "FISH", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41f.svg" },
  { letter: "Y", word: "YAK", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f402.svg" },
  { letter: "Z", word: "ZEBRA", image: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f993.svg" },
];

export default function AlphabetFlashCard({ goBack }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [slide, setSlide] = useState("");

  const current = cards[index];

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = () => {
    const msg = new SpeechSynthesisUtterance(
      `${current.letter} for ${current.word}`
    );
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const flip = () => {
    setFlipped(!flipped);
    if (!flipped) speak();
  };

  const next = () => {
    if (index === cards.length - 1) return;

    setSlide("slide-out-left");
    setTimeout(() => {
      setIndex(index + 1);
      setFlipped(false);
      setSlide("slide-in-right");
    }, 300);

    setTimeout(() => setSlide(""), 600);
  };

  const prev = () => {
    if (index === 0) return;

    setSlide("slide-out-right");
    setTimeout(() => {
      setIndex(index - 1);
      setFlipped(false);
      setSlide("slide-in-left");
    }, 300);

    setTimeout(() => setSlide(""), 600);
  };

  return (
    <div className="flash-page">
      <div className="flash-header">
        <button className="back-btn" onClick={goBack}>←</button>
        <h1>Alphabet Flash Cards</h1>
      </div>

      <div className="flash-wrapper">
        <div className={`flash-card ${flipped ? "flipped" : ""} ${slide}`}>
          <div className="flash-front" onClick={flip}>
            <h2>{current.letter}</h2>
            <p>Tap</p>
          </div>

          <div className="flash-back">
            <img src={current.image} alt="" />
            <h2>{current.word}</h2>
          </div>
        </div>
      </div>

      <div className="controls">
        <button onClick={prev}>Prev</button>
        <button onClick={speak}>🔊</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}