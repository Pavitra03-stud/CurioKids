import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    // ---------------------------------------------------------
    // NAME
    // ---------------------------------------------------------

    const cleanName = name.trim();

    if (!cleanName) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(cleanName)) {
      newErrors.name = "Only letters are allowed";
    } else if (cleanName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // ---------------------------------------------------------
    // AGE
    // ---------------------------------------------------------

    if (!age) {
      newErrors.age = "Age is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // SAVE CHILD
  // =========================================================

  const saveChild = async () => {
    if (!validateForm()) {
      return;
    }

    const childProfile = {
      name: name.trim(),
      age,
      createdAt: new Date().toISOString(),
    };

    console.log("👧 Child registration data:", childProfile);

    // =======================================================
    // SAVE TEMPORARILY IN LOCAL STORAGE
    //
    // At this stage the user may NOT have a Firebase UID yet.
    //
    // OtpVerify.jsx will later take this data and save it to:
    //
    // users/{firebaseUID}/childProfile
    // =======================================================

    localStorage.setItem(
      "childProfile",
      JSON.stringify(childProfile)
    );

    localStorage.setItem(
      "appProgress",
      "child-created"
    );

    // =======================================================
    // DO NOT SAVE USING localStorage.userId HERE
    //
    // A previous user's UID could still exist in the browser.
    //
    // Firebase saving will happen safely in OtpVerify.jsx
    // after the correct Firebase UID is obtained.
    // =======================================================

    console.log("💾 Child profile saved temporarily.");

    // =======================================================
    // OPTIONAL onComplete CALLBACK
    // =======================================================

    if (typeof onComplete === "function") {
      try {
        await onComplete(childProfile);
      } catch (error) {
        console.error("❌ onComplete error:", error);
      }
    }

    // =======================================================
    // NEXT STEP
    // =======================================================

    navigate("/parent-register");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="child-register">
      <div className="register-card">

        {/* ===================================================
            TITLE
        =================================================== */}

        <h1>Hi there! 👋</h1>

        <p>
          Let’s create your jungle profile
        </p>

        {/* ===================================================
            CHILD NAME
        =================================================== */}

        <input
          type="text"
          placeholder="Your Name"
          className="input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            // Clear name error while typing
            if (errors.name) {
              setErrors((prev) => ({
                ...prev,
                name: "",
              }));
            }
          }}
        />

        {errors.name && (
          <p className="error">
            {errors.name}
          </p>
        )}

        {/* ===================================================
            AGE
        =================================================== */}

        <input
          type="number"
          min="1"
          step="1"
          placeholder="Enter your age"
          className="input"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);

            // Clear age error while typing
            if (errors.age) {
              setErrors((prev) => ({
                ...prev,
                age: "",
              }));
            }
          }}
        />

        {errors.age && (
          <p className="error">
            {errors.age}
          </p>
        )}

        {/* ===================================================
            SAVE BUTTON
        =================================================== */}

        <button
          className="save-btn"
          onClick={saveChild}
        >
          🌱 Save My Profile
        </button>

        {/* ===================================================
            NOTE
        =================================================== */}

        <p className="note">
          No email. No passwords. Just play.
        </p>

      </div>
    </div>
  );
}