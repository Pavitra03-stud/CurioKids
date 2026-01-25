import { useState } from "react";
import GameButton from "../components/Gamebutton";
import Mascot from "../components/Mascot";
import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSaveProfile = () => {
    if (!name || !age) {
      alert("Please enter your name and age 😊");
      return;
    }

    const childData = {
      name,
      age,
    };

    // ✅ Save to localStorage
    localStorage.setItem("childProfile", JSON.stringify(childData));
    localStorage.setItem("appProgress", "child-created");

    // ✅ Go to next step
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
          <option value="3-4">3 – 4 years</option>
          <option value="5-6">5 – 6 years</option>
          <option value="7-8">7 – 8 years</option>
          <option value="9-10">9 – 10 years</option>
        </select>

        <GameButton
          text="🌱 Save My Profile"
          onClick={handleSaveProfile}
        />

        <p className="note">
          No email. No passwords. Just play.
        </p>
      </div>

      <Mascot />
    </div>
  );
}
