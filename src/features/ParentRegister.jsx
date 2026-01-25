import { useState } from "react";
import GameButton from "../components/Gamebutton";
import "../styles/ParentRegister.css";

export default function ParentRegister({ onComplete }) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  const saveParent = () => {
    if (!parentName || !email || !timeLimit) {
      alert("Please fill all details");
      return;
    }

    const parentProfile = {
      parentName,
      email,
      timeLimit,
      linkedAt: new Date().toISOString(),
    };

    localStorage.setItem("parentProfile", JSON.stringify(parentProfile));
    localStorage.setItem("appProgress", "parent-created");

    onComplete();
  };

  return (
    <div className="parent-register">
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
          <option>15 minutes</option>
          <option>30 minutes</option>
          <option>45 minutes</option>
        </select>

        <GameButton text="🔐 Link & Unlock Jungle" onClick={saveParent} />

        <p className="note">You’ll see progress, not pressure.</p>
      </div>
    </div>
  );
}
