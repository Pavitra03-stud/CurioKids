import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackIcon from "../components/BackIcon";
import "../styles/conceptWhatIsANumber.css";

export default function ConceptWhatIsANumber({ goBack }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(null);

  // 🎧 Voice
  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.85;
    msg.pitch = 1.1;
    msg.volume = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  // 🎬 Teaching flow
  useEffect(() => {
    const texts = [
      "Hi! I am Panda. Let's learn numbers!",
      "Tap each apple and count slowly!",
      "Awesome! There are three apples.",
      "Even if objects change, the number stays the same.",
      "Now it's your turn! Count the cars."
    ];
    speak(texts[step]);
  }, [step]);

  // ⏱ Auto next (slightly slower for kids)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) setStep(step + 1);
    }, 6000);
    return () => clearTimeout(timer);
  }, [step]);

  const handleTap = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <div className="concept-page cartoon">

      {/* Navbar */}
      <div className="practice-navbar">
        <BackIcon goBack={goBack ? goBack : () => navigate(-1)} />
        <div className="navbar-title">🐼 Learn with Panda</div>
      </div>

      {/* 🐼 Panda */}
      <div className="teacher">
        <img
          src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
          alt="panda"
          className="panda-img"
        />
      </div>

      {/* 💬 Speech */}
      <div className="speech">
        {[
          "Hi! I'm Panda 🐼",
          "Tap the apples 🍎",
          "Great job! 🎉",
          "See? Same number!",
          "Now your turn 🚗"
        ][step]}
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div className="card fade">
          <h2>Welcome 👋</h2>
          <p>Let’s learn numbers in a fun way!</p>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card fade">
          <h2>Tap and Count 🍎</h2>

          <div className="objects">
            {["🍎", "🍎", "🍎"].map((x, i) => (
              <span
                key={i}
                onClick={handleTap}
                className="pop"
              >
                {x}
              </span>
            ))}
          </div>

          <div className="big bounce">{count}</div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card fade">
          <h2>These are 3 apples</h2>
          <div className="big glow">3</div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card fade">
          <h2>Same Number</h2>
          <div className="objects">⭐ ⭐ ⭐</div>
          <div className="big glow">3</div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="card fade">
          <h2>Your Turn 🎮</h2>
          <div className="objects">🚗 🚗 🚗</div>

          <div className="options">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                className={`option-btn ${
                  selected === n
                    ? n === 3
                      ? "correct"
                      : "wrong"
                    : ""
                }`}
                onClick={() => {
                  setSelected(n);
                  speak(n === 3 ? "Correct!" : "Try again");
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {selected && (
            <div className="feedback">
              {selected === 3 ? "🎉 Correct!" : "❌ Try Again"}
            </div>
          )}
        </div>
      )}

    </div>
  );
}