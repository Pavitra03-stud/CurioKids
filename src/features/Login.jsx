// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setError("");

//     const cleanEmail = email.trim();

//     // 📧 Empty email
//     if (!cleanEmail) {
//       setError("Enter your email 📧");
//       return;
//     }

//     // 📧 Basic email validation
//     const emailRegex =
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(cleanEmail)) {
//       setError("Enter a valid email 📧");
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("🔐 Sending login OTP...");

//       const res = await fetch(
//         "http://localhost:5000/api/send-otp",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: cleanEmail,
//           }),
//         }
//       );

//       const data = await res.json();

//       console.log("📩 OTP response:", data);

//       if (!res.ok) {
//         setError(
//           data.message ||
//             "Failed to send OTP ❌"
//         );
//         return;
//       }

//       // 💾 Save email for OTP verification
//       localStorage.setItem(
//         "loginEmail",
//         cleanEmail
//       );

//       alert(
//         "OTP sent to your email 📧"
//       );

//       // ➡️ Go to OTP screen
//       navigate("/otp");
//     } catch (err) {
//       console.error(
//         "❌ Login error:",
//         err
//       );

//       setError(
//         "Unable to connect to server 😢"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>🔐 Welcome Back</h2>

//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) =>
//           setEmail(e.target.value)
//         }
//         disabled={loading}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             handleLogin();
//           }
//         }}
//       />

//       {error && (
//         <p className="error-text">
//           {error}
//         </p>
//       )}

//       <button
//         onClick={handleLogin}
//         disabled={loading}
//       >
//         {loading
//           ? "Sending OTP..."
//           : "Send OTP"}
//       </button>

//       <p
//         className="switch-text"
//         onClick={() =>
//           !loading &&
//           navigate("/child-register")
//         }
//         style={{
//           cursor: loading
//             ? "default"
//             : "pointer",
//         }}
//       >
//         New here? Register 🌱
//       </p>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    setError("");

    // =======================================================
    // CLEAN EMAIL
    // =======================================================

    const cleanEmail =
      email.trim().toLowerCase();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!cleanEmail) {
      setError(
        "Enter your email 📧"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError(
        "Enter a valid email 📧"
      );
      return;
    }

    setLoading(true);

    try {
      console.log(
        "🔐 Sending login OTP..."
      );

      // =====================================================
      // SEND OTP
      // =====================================================

      const res = await fetch(
        "http://localhost:5000/api/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "📩 OTP response:",
        data
      );

      // =====================================================
      // BACKEND ERROR
      // =====================================================

      if (!res.ok) {
        setError(
          data.message ||
            "Failed to send OTP ❌"
        );

        return;
      }

      // =====================================================
      // SAVE EMAIL FOR OTP
      // =====================================================

      localStorage.setItem(
        "loginEmail",
        cleanEmail
      );

      // =====================================================
      // IMPORTANT
      //
      // We DO NOT load childProfile,
      // parentProfile, or jungleFriend here.
      //
      // OtpVerify.jsx will authenticate the user,
      // get the Firebase UID, and fetch the correct
      // Firebase profile.
      // =====================================================

      console.log(
        "📧 Login OTP sent successfully"
      );

      alert(
        "OTP sent to your email 📧"
      );

      // =====================================================
      // GO TO OTP
      // =====================================================

      navigate("/otp");

    } catch (err) {
      console.error(
        "❌ Login error:",
        err
      );

      setError(
        "Unable to connect to server 😢"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="auth-container">

      <h2>
        🔐 Welcome Back
      </h2>

      {/* ===================================================
          EMAIL
      =================================================== */}

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        disabled={loading}
        autoComplete="email"
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !loading
          ) {
            handleLogin();
          }
        }}
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
          LOGIN BUTTON
      =================================================== */}

      <button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading
          ? "Sending OTP..."
          : "Send OTP"}
      </button>

      {/* ===================================================
          REGISTER
      =================================================== */}

      <p
        className="switch-text"
        onClick={() => {
          if (!loading) {
            navigate(
              "/child-register"
            );
          }
        }}
        style={{
          cursor: loading
            ? "default"
            : "pointer",
        }}
      >
        New here? Register 🌱
      </p>

    </div>
  );
}