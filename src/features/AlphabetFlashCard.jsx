
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AlphabetFlashCard.css";
import { trackActivity } from "../utils/trackActivity";
import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "alphabet-flash-cards";

const cards = [
  {
    letter: "A",
    word: "ANT",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41c.svg",
  },
  {
    letter: "B",
    word: "BEAR",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43b.svg",
  },
  {
    letter: "C",
    word: "CAT",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg",
  },
  {
    letter: "D",
    word: "DOG",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg",
  },
  {
    letter: "E",
    word: "ELEPHANT",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f418.svg",
  },
  {
    letter: "F",
    word: "FOX",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg",
  },
  {
    letter: "G",
    word: "GIRAFFE",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f992.svg",
  },
  {
    letter: "H",
    word: "HORSE",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f434.svg",
  },
  {
    letter: "I",
    word: "IGUANA",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98e.svg",
  },
  {
    letter: "J",
    word: "JELLYFISH",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1fabc.svg",
  },
  {
    letter: "K",
    word: "KOALA",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f428.svg",
  },
  {
    letter: "L",
    word: "LION",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f981.svg",
  },
  {
    letter: "M",
    word: "MONKEY",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f435.svg",
  },
  {
    letter: "N",
    word: "NIGHTINGALE",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg",
  },
  {
    letter: "O",
    word: "OWL",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f989.svg",
  },
  {
    letter: "P",
    word: "PENGUIN",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg",
  },
  {
    letter: "Q",
    word: "QUAIL",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f426.svg",
  },
  {
    letter: "R",
    word: "RABBIT",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg",
  },
  {
    letter: "S",
    word: "SNAKE",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40d.svg",
  },
  {
    letter: "T",
    word: "TIGER",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f42f.svg",
  },
  {
    letter: "U",
    word: "UNICORN",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f984.svg",
  },
  {
    letter: "V",
    word: "VULTURE",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f986.svg",
  },
  {
    letter: "W",
    word: "WHALE",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f40b.svg",
  },
  {
    letter: "X",
    word: "X-RAY FISH",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f41f.svg",
  },
  {
    letter: "Y",
    word: "YAK",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f402.svg",
  },
  {
    letter: "Z",
    word: "ZEBRA",
    image:
      "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f993.svg",
  },
];

export default function AlphabetFlashCard() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [slide, setSlide] = useState("");

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  const {
    savedState,
    loading: progressLoading,
    save,
    finish,
  } = useGameProgress(GAME_ID, {
    index: 0,
    flipped: false,
  });

  const [gameLoading, setGameLoading] = useState(true);

  const current = cards[index];

  /*
  |--------------------------------------------------------------------------
  | RESTORE PROGRESS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (progressLoading) return;

    if (savedState) {
      console.log("🔥 Restoring Alphabet Flash Cards:", savedState);

      const restoredIndex = Math.min(
        Math.max(savedState.index ?? 0, 0),
        cards.length - 1
      );

      setIndex(restoredIndex);
      setFlipped(savedState.flipped ?? false);
    } else {
      console.log("🆕 Starting Alphabet Flash Cards");

      setIndex(0);
      setFlipped(false);
    }

    setGameLoading(false);
  }, [progressLoading, savedState]);

  /*
  |--------------------------------------------------------------------------
  | TRACK GAME OPEN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (userId) {
      trackActivity({
        userId,
        action: "open_game",
        screen: "flash-cards",
        module: "letters",
      });
    }
  }, [userId]);

  /*
  |--------------------------------------------------------------------------
  | SPEECH CLEANUP
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | SPEAK
  |--------------------------------------------------------------------------
  */

  const speak = () => {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    const msg = new SpeechSynthesisUtterance(
      `${current.letter} for ${current.word}`
    );

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);

    /*
     * Track speak activity
     */
    if (userId) {
      trackActivity({
        userId,
        action: "speak",
        screen: "flash-cards",
        module: "letters",
        extraData: {
          letter: current.letter,
        },
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FLIP CARD
  |--------------------------------------------------------------------------
  */

  const flip = async () => {
    const nextFlipped = !flipped;

    setFlipped(nextFlipped);

    await save({
      index,
      flipped: nextFlipped,
    });

    if (nextFlipped) {
      speak();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | NEXT CARD
  |--------------------------------------------------------------------------
  */

  const next = async () => {
    /*
     * If this is the final card,
     * complete the game.
     */
    if (index === cards.length - 1) {
      if (userId) {
        trackActivity({
          userId,
          action: "game_complete",
          screen: "flash-cards",
          module: "letters",
          score: 100,
        });
      }

      /*
       * Award 100 stars through the progress system.
       * This replaces addStars().
       */
      await finish(100, "Flash Cards");

      /*
       * Start from A again after completion.
       */
      setIndex(0);
      setFlipped(false);

      await save({
        index: 0,
        flipped: false,
      });

      return;
    }

    /*
     * Slide animation
     */
    setSlide("slide-out-left");

    setTimeout(async () => {
      const nextIndex = index + 1;

      setIndex(nextIndex);
      setFlipped(false);
      setSlide("slide-in-right");

      /*
       * Save exact card position.
       */
      await save({
        index: nextIndex,
        flipped: false,
      });
    }, 300);

    setTimeout(() => {
      setSlide("");
    }, 600);
  };

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS CARD
  |--------------------------------------------------------------------------
  */

  const prev = async () => {
    if (index === 0) return;

    setSlide("slide-out-right");

    setTimeout(async () => {
      const previousIndex = index - 1;

      setIndex(previousIndex);
      setFlipped(false);
      setSlide("slide-in-left");

      /*
       * Save exact card position.
       */
      await save({
        index: previousIndex,
        flipped: false,
      });
    }, 300);

    setTimeout(() => {
      setSlide("");
    }, 600);
  };

  /*
  |--------------------------------------------------------------------------
  | BACK
  |--------------------------------------------------------------------------
  */

  const handleBack = () => {
    navigate("/letter-learning");
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (progressLoading || gameLoading) {
    return (
      <div className="flash-page">
        <div className="flash-header">
          <h1>Alphabet Flash Cards</h1>
        </div>

        <div className="flash-wrapper">
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flash-page">
      <div className="flash-header">
        <h1>Alphabet Flash Cards</h1>
      </div>

      <div className="flash-wrapper">
        <div
          className={`flash-card ${
            flipped ? "flipped" : ""
          } ${slide}`}
        >
          <div className="flash-front" onClick={flip}>
            <h2>{current.letter}</h2>
            <p>Tap</p>
          </div>

          <div className="flash-back" onClick={flip}>
            <img
              src={current.image}
              alt={current.word}
            />

            <h2>{current.word}</h2>
          </div>
        </div>
      </div>

      <div className="controls">
        <button
          onClick={prev}
          disabled={index === 0}
        >
          Prev
        </button>

        <button onClick={speak}>
          🔊
        </button>

        <button
          onClick={next}
          disabled={false}
        >
          Next
        </button>
      </div>
    </div>
  );
}