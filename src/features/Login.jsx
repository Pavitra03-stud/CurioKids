import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ NEW

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

      // ✅ FIXED NAVIGATION
      navigate("/otp");

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

      {/* ✅ FIXED REGISTER NAVIGATION */}
      <p
        className="switch-text"
        onClick={() => navigate("/child-register")}
        style={{ cursor: "pointer" }}
      >
        New here? Register 🌱
      </p>
    </div>
  );
}