import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/conceptBiggerSmaller.css";

export default function ConceptBiggerSmaller({ goBack }) {

  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState(null);

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  return (
    <div className="concept-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          📏 Bigger & Smaller
        </div>
      </div>

      {step === 0 && (
        <div className="lesson-block">
          <h2>This group has apples</h2>
          <div className="objects">🍎 🍎</div>
          <p>There are two apples.</p>
          <p>The number is 2.</p>
        </div>
      )}

      {step === 1 && (
        <div className="lesson-block">
          <h2>This group has apples</h2>
          <div className="objects">🍎 🍎 🍎 🍎</div>
          <p>There are four apples.</p>
          <p>The number is 4.</p>
        </div>
      )}

      {step === 2 && (
        <div className="lesson-block">
          <h2>Let’s compare them</h2>

          <div className="compare-row">
            <div className="group">🍎 🍎</div>
            <div className="group">🍎 🍎 🍎 🍎</div>
          </div>

          <p>Four apples is more than two apples.</p>
        </div>
      )}

      {step === 3 && (
        <div className="lesson-block">
          <h2>Understanding the words</h2>
          <p>
            When a group has more objects,
            we say the number is <b>bigger</b>.
          </p>
          <p>
            When a group has fewer objects,
            we say the number is <b>smaller</b>.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="lesson-block">
          <h2>Now you try</h2>
          <p>Tap the group with MORE apples.</p>

          <div className="compare-row">

            <div
              className={`group ${choice === "left" ? "selected" : ""}`}
              onClick={() => setChoice("left")}
            >
              🍎 🍎
            </div>

            <div
              className={`group ${choice === "right" ? "selected" : ""}`}
              onClick={() => setChoice("right")}
            >
              🍎 🍎 🍎 🍎
            </div>

          </div>

          {choice && (
            <p className="feedback">
              {choice === "right"
                ? "Correct! Four is bigger than two."
                : "Look again. Four apples is the bigger group."}
            </p>
          )}
        </div>
      )}

      <div className="lesson-controls">
        {step > 0 && <button onClick={prev}>Back</button>}
        {step < 4 && <button onClick={next}>Next</button>}
      </div>

    </div>
  );
}