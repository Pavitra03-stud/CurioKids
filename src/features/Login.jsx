// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Auth.css";

// export default function Login() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: ""
//   });

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // 🔐 Get user from localStorage
//     const savedUser = JSON.parse(localStorage.getItem("user"));

//     if (!savedUser) {
//       alert("User not found. Please register first 🌱");
//       return;
//     }

//     if (
//       savedUser.email === form.email &&
//       savedUser.password === form.password
//     ) {
//       alert("Login successful 🎉");
//       navigate("/dashboard"); // change if needed
//     } else {
//       alert("Invalid credentials ❌");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>🔐 Welcome Back</h2>

//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           required
//           onChange={(e) =>
//             setForm({ ...form, email: e.target.value })
//           }
//         />

//         <input
//           type="password"
//           placeholder="Enter your password"
//           required
//           onChange={(e) =>
//             setForm({ ...form, password: e.target.value })
//           }
//         />

//         <button type="submit">Login</button>
//       </form>

//       <p onClick={() => navigate("/register")} className="switch-text">
//         New here? Register 🌱
//       </p>
//     </div>
//   );
// }



import { useState } from "react";
import "../styles/Auth.css";

export default function Login({ onComplete }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Enter your email 📧");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending login OTP... 🔐");

      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (!res.ok) {
        setError(data.message || "Failed to send OTP ❌");
        setLoading(false);
        return;
      }

      // 💾 Store email for OTP screen
      localStorage.setItem("loginEmail", email.trim());

      alert("OTP sent to your email 📧");

      // 👉 Go to OTP screen
      if (typeof onComplete === "function") {
        onComplete();
      }

    } catch (err) {
      console.log("Login error:", err);
      setError("Server error 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Welcome Back</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="error-text">{error}</p>}

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

      <p className="switch-text">
        New here? Register 🌱
      </p>
    </div>
  );
}