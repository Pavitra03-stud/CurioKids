import { useState } from "react";
import GameButton from "../components/Gamebutton";
import BackIcon from "../components/BackIcon";
import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete, goBack }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [errors, setErrors] = useState({});

  // 🔹 Validation function
  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Only letters are allowed";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Age validation
    if (!age) {
      newErrors.age = "Please select age";
    }

    setErrors(newErrors);

    // if no errors → valid
    return Object.keys(newErrors).length === 0;
  };

  const saveChild = () => {
    if (!validateForm()) return;

    const childProfile = {
      name: name.trim(),
      age,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("childProfile", JSON.stringify(childProfile));
    localStorage.setItem("appProgress", "child-created");

    onComplete();
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
        {errors.name && <p className="error">{errors.name}</p>}

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
        {errors.age && <p className="error">{errors.age}</p>}

        <GameButton text="🌱 Save My Profile" onClick={saveChild} />
        <p className="note">No email. No passwords. Just play.</p>
      </div>
    </div>
  );
}