import { useState } from "react";
import GameButton from "../components/Gamebutton";
import BackIcon from "../components/BackIcon";
import "../styles/ParentRegister.css";

export default function ParentRegister({ onComplete, goBack }) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [error, setError] = useState("");

  // ✅ Validations
  const isValidName = (value) => /^[A-Za-z\s]+$/.test(value);
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const saveParent = () => {
    setError("");

    // 👤 Parent name validation
    if (!parentName.trim()) {
      setError("Please enter your name 😊");
      return;
    }

    if (parentName.trim().length < 2) {
      setError("Name should be at least 2 letters 🌿");
      return;
    }

    if (!isValidName(parentName)) {
      setError("Name should contain only letters ✨");
      return;
    }

    // 📧 Email validation
    if (!email.trim()) {
      setError("Please enter your email address 📧");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address 📩");
      return;
    }

    // ⏱️ Time limit validation
    if (!timeLimit) {
      setError("Please select a daily play time ⏰");
      return;
    }

    // ✅ Save parent profile
    const parentProfile = {
      parentName: parentName.trim(),
      email: email.trim(),
      timeLimit,
      linkedAt: new Date().toISOString(),
    };

    localStorage.setItem("parentProfile", JSON.stringify(parentProfile));
    localStorage.setItem("appProgress", "parent-created");

    // 👉 MOVE FORWARD (CONTROLLED BY App.jsx)
    onComplete();
  };

  return (
    <div className="parent-register">
      {/* 🔙 GLOBAL BACK ICON */}
      <BackIcon goBack={goBack} />

      <div className="parent-card">
        <h1>Parent Registration</h1>
        <p>Help guide your child’s jungle journey</p>

        <input
          type="text"
          placeholder="Parent Name"
          className="input"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="input"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        >
          <option value="">Daily play time limit</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
        </select>

        {/* 🌸 Friendly error message */}
        {error && <p className="error-text">{error}</p>}

        <GameButton
          text="🔐 Link & Unlock Jungle"
          onClick={saveParent}
        />

        <p className="note">
          You’ll see progress, not pressure.
        </p>
      </div>
    </div>
  );
}
