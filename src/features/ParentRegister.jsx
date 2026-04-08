import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ParentRegister.css";

export default function ParentRegister() {
  const navigate = useNavigate();

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [error, setError] = useState("");

  const isValidName = (value) => /^[A-Za-z\s]+$/.test(value);
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const saveParent = async () => {
    setError("");

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

    if (!email.trim()) {
      setError("Please enter your email address 📧");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address 📩");
      return;
    }

    if (!timeLimit) {
      setError("Please select a daily play time ⏰");
      return;
    }

    try {
      // ✅ SAVE LOCALLY (FIXED)
      localStorage.setItem("userName", parentName.trim());
      localStorage.setItem("userTime", timeLimit);

      // ✅ REGISTER
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: parentName.trim(),
          email: email.trim(),
          time: timeLimit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes("exists")) {
          setError("User already registered! Please login 🔐");
          return;
        }

        setError(data.message || "Register failed ❌");
        return;
      }

      // ✅ SEND OTP
      const otpRes = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setError(otpData.message || "Failed to send OTP ❌");
        return;
      }

      // 💾 STORE TEMP DATA
      const parentData = {
        parentName: parentName.trim(),
        email: email.trim(),
        timeLimit,
      };

      localStorage.setItem("tempParent", JSON.stringify(parentData));
      localStorage.setItem("loginEmail", email.trim());

      alert("OTP sent to your email 📧");

      // 👉 Navigate to OTP screen
      navigate("/otp");

    } catch (err) {
      console.log(err);
      setError("Server error. Try again 😢");
    }
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
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
        </select>

        {error && <p className="error-text">{error}</p>}

        {/* 🔐 BUTTON */}
        <button className="save-btn" onClick={saveParent}>
          🔐 Link & Unlock Jungle
        </button>

        {/* 🔗 LOGIN */}
        <p
          className="login-link"
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer" }}
        >
          Already registered? Login 🔐
        </p>

        <p className="note">
          You’ll see progress, not pressure.
        </p>
      </div>
    </div>
  );
}