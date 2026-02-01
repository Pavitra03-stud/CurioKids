import { useState } from "react";
import GameButton from "../components/Gamebutton";
import BackIcon from "../components/BackIcon";
import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete, goBack }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const saveChild = () => {
    if (!name.trim() || !age) {
      alert("Please enter your name and age 😊");
      return;
    }

    const childProfile = {
      name: name.trim(),
      age,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("childProfile", JSON.stringify(childProfile));
    localStorage.setItem("appProgress", "child-created");

    onComplete(); // ✅ ONLY THIS
  };

  return (
    <div className="child-register">
      <BackIcon goBack={goBack} />

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
          <option value="3-4">3 – 4 years</option>
          <option value="5-6">5 – 6 years</option>
          <option value="7-8">7 – 8 years</option>
          <option value="9-10">9 – 10 years</option>
        </select>

        <GameButton text="🌱 Save My Profile" onClick={saveChild} />
        <p className="note">No email. No passwords. Just play.</p>
      </div>
    </div>
  );
}
