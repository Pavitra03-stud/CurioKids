import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ParentRegister.css";

export default function ParentRegister() {
  const navigate = useNavigate();

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // VALIDATION
  // =========================================================

  const isValidName = (value) =>
    /^[A-Za-z\s]+$/.test(value);

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // =========================================================
  // REGISTER
  // =========================================================

  const saveParent = async () => {
    setError("");

    // ---------------------------------------------------------
    // NAME VALIDATION
    // ---------------------------------------------------------

    const cleanName = parentName.trim();

    if (!cleanName) {
      setError("Please enter your name 😊");
      return;
    }

    if (cleanName.length < 2) {
      setError("Name should be at least 2 letters 🌿");
      return;
    }

    if (!isValidName(cleanName)) {
      setError("Name should contain only letters ✨");
      return;
    }

    // ---------------------------------------------------------
    // EMAIL VALIDATION
    // ---------------------------------------------------------

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address 📧");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address 📩");
      return;
    }

    // ---------------------------------------------------------
    // REGISTER
    // ---------------------------------------------------------

    try {
      setLoading(true);

      // =======================================================
      // 1. SAVE PARENT REGISTRATION DATA LOCALLY
      //
      // Firebase UID does NOT exist yet because OTP has not
      // been verified.
      // =======================================================

      const parentData = {
        parentName: cleanName,
        email: cleanEmail,
      };

      localStorage.setItem(
        "parentProfile",
        JSON.stringify(parentData)
      );

      // Keep this for compatibility with the existing flow
      localStorage.setItem(
        "tempParent",
        JSON.stringify(parentData)
      );

      localStorage.setItem(
        "userName",
        cleanName
      );

      localStorage.setItem(
        "loginEmail",
        cleanEmail
      );

      console.log(
        "👨‍👩‍👧 Parent registration data:",
        parentData
      );

      // =======================================================
      // 2. BACKEND REGISTER
      //
      // No time limit is sent anymore.
      // =======================================================

      const res = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "📝 Register response:",
        data
      );

      // =======================================================
      // 3. HANDLE REGISTER ERROR
      // =======================================================

      if (!res.ok) {
        if (data.type === "USER_EXISTS") {
          setError(
            "User already registered! Redirecting to login 🔐"
          );

          setTimeout(() => {
            navigate("/login");
          }, 2000);

          return;
        }

        setError(
          data.message || "Register failed ❌"
        );

        return;
      }

      // =======================================================
      // 4. SEND OTP
      // =======================================================

      const otpRes = await fetch(
        "http://localhost:5000/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const otpData = await otpRes.json();

      console.log(
        "📧 OTP response:",
        otpData
      );

      if (!otpRes.ok) {
        setError(
          otpData.message ||
            "Failed to send OTP ❌"
        );

        return;
      }

      // =======================================================
      // IMPORTANT
      //
      // DO NOT CREATE childProfile HERE.
      //
      // The child profile comes from ChildRegister.
      //
      // Firebase users/{uid} will be created/updated after
      // OTP verification.
      // =======================================================

      console.log(
        "✅ Parent data saved temporarily."
      );

      console.log(
        "📧 OTP sent. Waiting for verification."
      );

      // =======================================================
      // 5. SUCCESS
      // =======================================================

      alert(
        "OTP sent to your email 📧"
      );

      navigate("/otp");

    } catch (err) {
      console.error(
        "❌ Registration error:",
        err
      );

      setError(
        "Server error. Try again 😢"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="parent-register">

      <div className="parent-card">

        {/* ===================================================
            TITLE
        =================================================== */}

        <h1>
          Parent Registration
        </h1>

        <p>
          Help guide your child’s jungle journey
        </p>

        {/* ===================================================
            PARENT NAME
        =================================================== */}

        <input
          type="text"
          placeholder="Parent Name"
          className="input"
          value={parentName}
          onChange={(e) =>
            setParentName(e.target.value)
          }
        />

        {/* ===================================================
            EMAIL
        =================================================== */}

        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        {/* ===================================================
            REGISTER
        =================================================== */}

        <button
          className="save-btn"
          onClick={saveParent}
          disabled={loading}
        >
          {loading
            ? "Sending... ⏳"
            : "🔐 Link & Unlock Jungle"}
        </button>

        {/* ===================================================
            LOGIN
        =================================================== */}

        <p
          className="login-link"
          onClick={() =>
            navigate("/login")
          }
          style={{
            cursor: "pointer",
          }}
        >
          Already registered? Login 🔐
        </p>

        {/* ===================================================
            NOTE
        =================================================== */}

        <p className="note">
          You’ll see progress, not pressure.
        </p>

      </div>

    </div>
  );
}