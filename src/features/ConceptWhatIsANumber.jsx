import { useState } from "react";
import BackIcon from "../components/BackIcon";
import "../styles/conceptWhatIsANumber.css";

export default function ConceptWhatIsANumber({ goBack }) {

  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="concept-page">

      <div className="practice-navbar">
        <div className="navbar-left">
          <BackIcon goBack={goBack} />
        </div>
        <div className="navbar-title">
          🔢 What Is a Number?
        </div>
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div className="concept-content">
          <h2>Numbers Count Things</h2>
          <div className="objects">🍎 🍎 🍎</div>
          <div className="big-number">3</div>
          <p>
            There are three apples.
            The number 3 tells us how many apples we have.
          </p>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="concept-content">
          <h2>Same Number, Different Objects</h2>
          <div className="objects">⭐ ⭐ ⭐</div>
          <div className="big-number">3</div>
          <p>
            These are stars.
            There are still three.
            The number stays the same.
          </p>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="concept-content">
          <h2>Number Means Quantity</h2>
          <div className="objects">🧸 🧸 🧸</div>
          <div className="big-number">3</div>
          <p>
            A number does not depend on the object.
            It shows the amount.
          </p>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="concept-content">
          <h2>Numbers Are Symbols</h2>
          <div className="big-number">3</div>
          <p>
            This symbol is called the number 3.
            Whenever we see it, it means three things.
          </p>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="concept-content">
          <h2>Let’s Think</h2>
          <div className="objects">🚗 🚗 🚗</div>
          <p>
            How many cars are there?
            Count them slowly.
          </p>
          <div className="big-number">3</div>
        </div>
      )}

      <div className="concept-buttons">
        <button onClick={prevStep} disabled={step === 0}>
          Back
        </button>
        <button onClick={nextStep} disabled={step === 4}>
          Next
        </button>
      </div>

    </div>
  );
}