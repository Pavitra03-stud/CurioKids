// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ParentRegister.css";

// export default function ParentRegister() {
//   const navigate = useNavigate();

//   const [parentName, setParentName] = useState("");
//   const [email, setEmail] = useState("");
//   const [timeLimit, setTimeLimit] = useState("");
//   const [error, setError] = useState("");

//   const isValidName = (value) => /^[A-Za-z\s]+$/.test(value);
//   const isValidEmail = (value) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   const saveParent = async () => {
//     setError("");

//     if (!parentName.trim()) {
//       setError("Please enter your name 😊");
//       return;
//     }

//     if (parentName.trim().length < 2) {
//       setError("Name should be at least 2 letters 🌿");
//       return;
//     }

//     if (!isValidName(parentName)) {
//       setError("Name should contain only letters ✨");
//       return;
//     }

//     if (!email.trim()) {
//       setError("Please enter your email address 📧");
//       return;
//     }

//     if (!isValidEmail(email)) {
//       setError("Please enter a valid email address 📩");
//       return;
//     }

//     if (!timeLimit) {
//       setError("Please select a daily play time ⏰");
//       return;
//     }

//     try {
//       // ✅ SAVE LOCALLY
//       localStorage.setItem("userName", parentName.trim());
//       localStorage.setItem("userTime", timeLimit);

//       // ✅ REGISTER
//       const res = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: parentName.trim(),
//           email: email.trim(),
//           time: timeLimit,
//         }),
//       });

//       const data = await res.json();

//       // ❌ HANDLE EXISTING USER
//       if (!res.ok) {
//         if (data.type === "USER_EXISTS") {
//           setError("User already registered! Redirecting to login 🔐");

//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);

//           return;
//         }

//         setError(data.message || "Register failed ❌");
//         return;
//       }

//       // ✅ SEND OTP
//       const otpRes = await fetch("http://localhost:5000/api/send-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim(),
//         }),
//       });

//       const otpData = await otpRes.json();

//       if (!otpRes.ok) {
//         setError(otpData.message || "Failed to send OTP ❌");
//         return;
//       }

//       // ✅ FINAL DATA SAVE (🔥 IMPORTANT FIX)
//       const parentData = {
//         parentName: parentName.trim(),
//         email: email.trim(),
//         timeLimit,
//       };

//       // 🔥 THIS FIXES YOUR DASHBOARD ISSUE
//       localStorage.setItem("parentProfile", JSON.stringify(parentData));

//       // 🔥 TEMP CHILD DATA (so dashboard works)
//       localStorage.setItem(
//         "childProfile",
//         JSON.stringify({
//           name: "Little Explorer",
//           age: 5,
//         })
//       );

//       // existing storage
//       localStorage.setItem("tempParent", JSON.stringify(parentData));
//       localStorage.setItem("loginEmail", email.trim());

//       alert("OTP sent to your email 📧");

//       navigate("/otp");

//     } catch (err) {
//       console.log(err);
//       setError("Server error. Try again 😢");
//     }
//   };

//   return (
//     <div className="parent-register">
//       <div className="parent-card">
//         <h1>Parent Registration</h1>
//         <p>Help guide your child’s jungle journey</p>

//         <input
//           type="text"
//           placeholder="Parent Name"
//           className="input"
//           value={parentName}
//           onChange={(e) => setParentName(e.target.value)}
//         />

//         <input
//           type="email"
//           placeholder="Email Address"
//           className="input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <select
//           className="input"
//           value={timeLimit}
//           onChange={(e) => setTimeLimit(e.target.value)}
//         >
//           <option value="">Daily play time limit</option>
//           <option value="15">15 minutes</option>
//           <option value="30">30 minutes</option>
//           <option value="45">45 minutes</option>
//         </select>

//         {error && <p className="error-text">{error}</p>}

//         <button className="save-btn" onClick={saveParent}>
//           🔐 Link & Unlock Jungle
//         </button>

//         <p
//           className="login-link"
//           onClick={() => navigate("/login")}
//           style={{ cursor: "pointer" }}
//         >
//           Already registered? Login 🔐
//         </p>

//         <p className="note">
//           You’ll see progress, not pressure.
//         </p>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ParentRegister.css";

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ParentRegister() {
  const navigate = useNavigate();

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
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

    // Name validation
    if (!parentName.trim()) {
      setError("Please enter your name 😊");
      return;
    }

    if (parentName.trim().length < 2) {
      setError("Name should be at least 2 letters 🌿");
      return;
    }

    if (!isValidName(parentName.trim())) {
      setError("Name should contain only letters ✨");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Please enter your email address 📧");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address 📩");
      return;
    }

    // Time limit validation
    if (!timeLimit) {
      setError("Please select a daily play time ⏰");
      return;
    }

    try {
      setLoading(true);

      const cleanName = parentName.trim();
      const cleanEmail = email.trim().toLowerCase();

      // =====================================================
      // LOCAL STORAGE
      // =====================================================

      localStorage.setItem(
        "userName",
        cleanName
      );

      localStorage.setItem(
        "userTime",
        timeLimit
      );

      // =====================================================
      // BACKEND REGISTER
      // =====================================================

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
            time: timeLimit,
          }),
        }
      );

      const data = await res.json();

      // =====================================================
      // EXISTING USER
      // =====================================================

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

      // =====================================================
      // SAVE PARENT PROFILE LOCALLY
      // =====================================================

      const parentData = {
        parentName: cleanName,
        email: cleanEmail,
        timeLimit,
      };

      localStorage.setItem(
        "parentProfile",
        JSON.stringify(parentData)
      );

      localStorage.setItem(
        "tempParent",
        JSON.stringify(parentData)
      );

      localStorage.setItem(
        "loginEmail",
        cleanEmail
      );

      // =====================================================
      // SEND OTP
      // =====================================================

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

      if (!otpRes.ok) {
        setError(
          otpData.message ||
            "Failed to send OTP ❌"
        );

        return;
      }

      // =====================================================
      // TEMP CHILD PROFILE
      // =====================================================

      localStorage.setItem(
        "childProfile",
        JSON.stringify({
          name: "Little Explorer",
          age: 5,
        })
      );

      // =====================================================
      // IMPORTANT
      // =====================================================
      //
      // Firebase `users/{uid}` will be created/updated
      // after OTP verification because the Firebase UID
      // does not exist yet at this stage.
      //
      // So DON'T use email as the Firebase document ID.
      //
      // OtpVerify.jsx should save:
      //
      // users/{firebaseUID}
      //
      // =====================================================

      alert("OTP sent to your email 📧");

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

        <h1>
          Parent Registration
        </h1>

        <p>
          Help guide your child’s jungle journey
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Parent Name"
          className="input"
          value={parentName}
          onChange={(e) =>
            setParentName(e.target.value)
          }
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* TIME LIMIT */}
        <select
          className="input"
          value={timeLimit}
          onChange={(e) =>
            setTimeLimit(e.target.value)
          }
        >
          <option value="">
            Daily play time limit
          </option>

          <option value="15">
            15 minutes
          </option>

          <option value="30">
            30 minutes
          </option>

          <option value="45">
            45 minutes
          </option>
        </select>

        {/* ERROR */}
        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        {/* REGISTER */}
        <button
          className="save-btn"
          onClick={saveParent}
          disabled={loading}
        >
          {loading
            ? "Sending... ⏳"
            : "🔐 Link & Unlock Jungle"}
        </button>

        {/* LOGIN */}
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