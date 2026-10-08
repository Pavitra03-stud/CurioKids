// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   // =========================================================
//   // LOGIN
//   // =========================================================

//   const handleLogin = async () => {
//     setError("");

//     const cleanEmail = email.trim().toLowerCase();

//     // =======================================================
//     // VALIDATION
//     // =======================================================

//     if (!cleanEmail) {
//       setError("Enter your email 📧");
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(cleanEmail)) {
//       setError("Enter a valid email 📧");
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("🔐 Sending login OTP...");

//       const res = await fetch(
       
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
//           data.message || "Failed to send OTP ❌"
//         );

//         return;
//       }

//       // =====================================================
//       // SAVE EMAIL
//       // =====================================================

//       localStorage.setItem(
//         "loginEmail",
//         cleanEmail
//       );

//       console.log(
//         "📧 Login OTP sent successfully"
//       );

//       alert("OTP sent to your email 📧");

//       navigate("/otp");

//     } catch (err) {
//       console.error("❌ Login error:", err);

//       setError(
//         "Unable to connect to server 😢"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">

//       {/* =====================================================
//           BACKGROUND OVERLAY
//       ===================================================== */}

//       <div className="login-overlay"></div>

//       {/* =====================================================
//           TOP BRAND
//       ===================================================== */}

//       <header className="login-brand">

//         <div className="brand-title">
//           <span className="brand-curio">
//             Curio
//           </span>

//           <span className="brand-kids">
//             Kids
//           </span>

//           <span className="brand-sprout">
//             🌱
//           </span>
//         </div>

//         <div className="brand-tagline">
//           Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
//         </div>

//       </header>

//       {/* =====================================================
//           DECORATIVE ELEMENTS
//       ===================================================== */}

//       <div className="login-leaf leaf-one">
//         🍃
//       </div>

//       <div className="login-leaf leaf-two">
//         🌿
//       </div>

//       <div className="login-leaf leaf-three">
//         🍃
//       </div>

//       <div className="login-butterfly">
//         🦋
//       </div>

//       <div className="login-flower flower-one">
//         🌺
//       </div>

//       <div className="login-flower flower-two">
//         🌸
//       </div>

//       {/* =====================================================
//           LOGIN CARD
//       ===================================================== */}

//       <main className="login-content">

//         <div className="login-card">

//           {/* =================================================
//               LOCK
//           ================================================= */}

//           <div className="login-lock">
//             <span className="lock-sprout">
//               🌱
//             </span>

//             <span className="lock">
//               🔒
//             </span>
//           </div>

//           {/* =================================================
//               HEADING
//           ================================================= */}

//           <h1>
//             Welcome Back
//           </h1>

//           <p className="login-subtitle">
//             Let's continue your learning adventure!
//           </p>

//           {/* =================================================
//               EMAIL
//           ================================================= */}

//           <div className="login-input-wrapper">

//             <span className="email-icon">
//               ✉️
//             </span>

//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               disabled={loading}
//               autoComplete="email"
//               onKeyDown={(e) => {
//                 if (
//                   e.key === "Enter" &&
//                   !loading
//                 ) {
//                   handleLogin();
//                 }
//               }}
//             />

//           </div>

//           {/* =================================================
//               ERROR
//           ================================================= */}

//           {error && (
//             <p className="login-error">
//               {error}
//             </p>
//           )}

//           {/* =================================================
//               SEND OTP
//           ================================================= */}

//           <button
//             className="send-otp-btn"
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             <span>
//               ✈️
//             </span>

//             {loading
//               ? "Sending OTP..."
//               : "Send OTP"}
//           </button>

//           {/* =================================================
//               REGISTER
//           ================================================= */}

//           <p className="register-text">
//             New here?{" "}

//             <span
//               onClick={() => {
//                 if (!loading) {
//                   navigate("/child-register");
//                 }
//               }}
//             >
//               Register 🌱
//             </span>
//           </p>

//           {/* =================================================
//               PRIVACY
//           ================================================= */}

//           <div className="privacy-note">
//             🔐 Your learning space is safe and private
//           </div>

//         </div>

//       </main>

//       {/* =====================================================
//           CHATBOT
//       ===================================================== */}

//       <button
//         className="login-chatbot"
//         type="button"
//         aria-label="CurioKids assistant"
//       >
//         🤖
//       </button>

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

    const cleanEmail = email.trim().toLowerCase();

    // =======================================================
    // VALIDATION
    // =======================================================

    if (!cleanEmail) {
      setError("Enter your email 📧");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError("Enter a valid email 📧");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Sending login OTP...");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/send-otp`,
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

      const data = await res.json();

      console.log("📩 OTP response:", data);

      if (!res.ok) {
        setError(
          data.message || "Failed to send OTP ❌"
        );

        return;
      }

      // =====================================================
      // SAVE EMAIL
      // =====================================================

      localStorage.setItem(
        "loginEmail",
        cleanEmail
      );

      console.log(
        "📧 Login OTP sent successfully"
      );

      alert("OTP sent to your email 📧");

      navigate("/otp");

    } catch (err) {
      console.error("❌ Login error:", err);

      setError(
        "Unable to connect to server 😢"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =====================================================
          BACKGROUND OVERLAY
      ===================================================== */}

      <div className="login-overlay"></div>

      {/* =====================================================
          TOP BRAND
      ===================================================== */}

      <header className="login-brand">

        <div className="brand-title">
          <span className="brand-curio">
            Curio
          </span>

          <span className="brand-kids">
            Kids
          </span>

          <span className="brand-sprout">
            🌱
          </span>
        </div>

        <div className="brand-tagline">
          Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
        </div>

      </header>

      {/* =====================================================
          DECORATIVE ELEMENTS
      ===================================================== */}

      <div className="login-leaf leaf-one">
        🍃
      </div>

      <div className="login-leaf leaf-two">
        🌿
      </div>

      <div className="login-leaf leaf-three">
        🍃
      </div>

      <div className="login-butterfly">
        🦋
      </div>

      <div className="login-flower flower-one">
        🌺
      </div>

      <div className="login-flower flower-two">
        🌸
      </div>

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <main className="login-content">

        <div className="login-card">

          {/* =================================================
              LOCK
          ================================================= */}

          <div className="login-lock">
            <span className="lock-sprout">
              🌱
            </span>

            <span className="lock">
              🔒
            </span>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1>
            Welcome Back
          </h1>

          <p className="login-subtitle">
            Let's continue your learning adventure!
          </p>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="login-input-wrapper">

            <span className="email-icon">
              ✉️
            </span>

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

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {/* =================================================
              SEND OTP
          ================================================= */}

          <button
            className="send-otp-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            <span>
              ✈️
            </span>

            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

          {/* =================================================
              REGISTER
          ================================================= */}

          <p className="register-text">
            New here?{" "}

            <span
              onClick={() => {
                if (!loading) {
                  navigate("/child-register");
                }
              }}
            >
              Register 🌱
            </span>
          </p>

          {/* =================================================
              PRIVACY
          ================================================= */}

          <div className="privacy-note">
            🔐 Your learning space is safe and private
          </div>

        </div>

      </main>

      {/* =====================================================
          CHATBOT
      ===================================================== */}

      <button
        className="login-chatbot"
        type="button"
        aria-label="CurioKids assistant"
      >
        🤖
      </button>

    </div>
  );
}
