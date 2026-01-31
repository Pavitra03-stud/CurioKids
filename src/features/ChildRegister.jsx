import { useState } from "react";
import GameButton from "../components/Gamebutton";
import Mascot from "../components/Mascot";
import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const saveChild = () => {
    if (!name || !age) {
      alert("Please fill all details");
      return;
    }

    const childProfile = {
      name,
      age,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("childProfile", JSON.stringify(childProfile));
    localStorage.setItem("appProgress", "child-created");

    onComplete();
  };

  return (
    <div className="child-register">
      <div className="register-card">
        <h1>Hi there! 👋</h1>
        <p>Let’s create your jungle profile</p>

        <input
          type="text"
          placeholder="Your Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="input"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        >
          <option value="">Select your age</option>
          <option>3 – 4 years</option>
          <option>5 – 6 years</option>
          <option>7 – 8 years</option>
          <option>9 – 10 years</option>
        </select>

        <GameButton text="🌱 Save My Profile" onClick={saveChild} />

        <p className="note">No email. No passwords. Just play.</p>
      </div>
    </div>
  );
}
