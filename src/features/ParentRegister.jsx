// import { useState } from "react";
// import GameButton from "../components/Gamebutton";
// import BackIcon from "../components/BackIcon";
// import "../styles/ParentRegister.css";

// export default function ParentRegister({ onComplete, goBack }) {
//   const [parentName, setParentName] = useState("");
//   const [email, setEmail] = useState("");
//   const [timeLimit, setTimeLimit] = useState("");
//   const [error, setError] = useState("");

//   // ✅ Name validation
//   const isValidName = (value) => /^[A-Za-z\s]+$/.test(value);

//   // ✅ Email validation
//   const isValidEmail = (value) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   // 🚀 MAIN FUNCTION (REGISTER + SEND OTP)
//   const saveParent = async () => {
//     setError("");

//     // 👤 Name validation
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

//     // 📧 Email validation
//     if (!email.trim()) {
//       setError("Please enter your email address 📧");
//       return;
//     }

//     if (!isValidEmail(email)) {
//       setError("Please enter a valid email address 📩");
//       return;
//     }

//     // ⏱️ Time validation
//     if (!timeLimit) {
//       setError("Please select a daily play time ⏰");
//       return;
//     }

//     try {
//       // 🔥 REGISTER (this sends OTP from backend)
//       const res = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: parentName.trim(),
//           email: email.trim(),
//           password: "123456", // temp password
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Failed to send OTP");
//         return;
//       }

//       // 💾 Store temp data
//       const parentData = {
//         parentName: parentName.trim(),
//         email: email.trim(),
//         timeLimit,
//       };

//       localStorage.setItem("tempParent", JSON.stringify(parentData));

//       // 🎉 Success
//       alert("OTP sent to your email 📧");

//       // 👉 Move to OTP screen
//       onComplete();

//     } catch (err) {
//       console.log(err);
//       setError("Server error. Try again 😢");
//     }
//   };

//   return (
//     <div className="parent-register">
//       <BackIcon goBack={goBack} />

//       <div className="parent-card">
//         <h1>Parent Registration</h1>
//         <p>Help guide your child’s jungle journey</p>

//         {/* 👤 Parent Name */}
//         <input
//           type="text"
//           placeholder="Parent Name"
//           className="input"
//           value={parentName}
//           onChange={(e) => setParentName(e.target.value)}
//         />

//         {/* 📧 Email */}
//         <input
//           type="email"
//           placeholder="Email Address"
//           className="input"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* ⏱️ Time Limit */}
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

//         {/* ❌ Error */}
//         {error && <p className="error-text">{error}</p>}

//         {/* 🔐 Button */}
//         <GameButton
//           text="🔐 Link & Unlock Jungle"
//           onClick={saveParent}
//         />

//         <p className="note">
//           You’ll see progress, not pressure.
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameButton from "../components/Gamebutton";
import BackIcon from "../components/BackIcon";
import "../styles/ParentRegister.css";

export default function ParentRegister({ onComplete, goBack }) {
  const navigate = useNavigate();

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [error, setError] = useState("");

  // ✅ Name validation
  const isValidName = (value) => /^[A-Za-z\s]+$/.test(value);

  // ✅ Email validation
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // 🚀 MAIN FUNCTION (REGISTER + SEND OTP)
  const saveParent = async () => {
    setError("");

    // 👤 Name validation
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

    // ⏱️ Time validation
    if (!timeLimit) {
      setError("Please select a daily play time ⏰");
      return;
    }

    try {
      // 🔥 REGISTER API
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: parentName.trim(),
          email: email.trim(),
          password: "123456",
        }),
      });

      const data = await res.json();

      // ❌ If user already exists
      if (!res.ok) {
        if (data.message?.includes("exists")) {
          setError("User already registered! Please login 🔐");
          return;
        }

        setError(data.message || "Failed to send OTP");
        return;
      }

      // 💾 Store temp data
      const parentData = {
        parentName: parentName.trim(),
        email: email.trim(),
        timeLimit,
      };

      localStorage.setItem("tempParent", JSON.stringify(parentData));

      // 🎉 Success
      alert("OTP sent to your email 📧");

      // 👉 Move to OTP screen
      onComplete();

    } catch (err) {
      console.log(err);
      setError("Server error. Try again 😢");
    }
  };

  return (
    <div className="parent-register">
      <BackIcon goBack={goBack} />

      <div className="parent-card">
        <h1>Parent Registration</h1>
        <p>Help guide your child’s jungle journey</p>

        {/* 👤 Parent Name */}
        <input
          type="text"
          placeholder="Parent Name"
          className="input"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
        />

        {/* 📧 Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ⏱️ Time Limit */}
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

        {/* ❌ Error */}
        {error && <p className="error-text">{error}</p>}

        {/* 🔐 Register Button */}
        <GameButton
          text="🔐 Link & Unlock Jungle"
          onClick={saveParent}
        />

        {/* 🔐 Login Redirect */}
        <p
          className="login-link"
          onClick={() => navigate("/login")}
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