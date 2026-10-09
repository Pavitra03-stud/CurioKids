
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address 📧");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, cleanEmail);

      setSuccess(
        "If an account exists for this email, a password-reset email will be sent. Check your inbox and spam folder."
      );
    } catch (err) {
      console.error("Password reset error:", err.code);

      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError(
          "Unable to send the reset email right now. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <header className="login-brand">
        <div className="brand-title">
          <span className="brand-curio">Curio</span>
          <span className="brand-kids">Kids</span>
          <span className="brand-sprout">🌱</span>
        </div>

        <div className="brand-tagline">
          Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
        </div>
      </header>

      <main className="login-content">
        <div className="login-card">
          <div className="login-lock">🔐</div>

          <h1>Reset Password</h1>

          <p className="login-subtitle">
            Let's get you back to your learning adventure!
          </p>

          <form onSubmit={handleReset}>
            <div className="login-input-wrapper">
              <span className="email-icon">✉️</span>

              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="login-success" role="status">
                {success}
              </p>
            )}

            <button
              className="send-otp-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </form>

          <p className="register-text">
            Remember your password?{" "}
            <span
              role="button"
              tabIndex={0}
              onClick={() => navigate("/login")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/login");
                }
              }}
            >
              Back to Login
            </span>
          </p>

          <div className="privacy-note">
            🔐 Your learning space is safe and private
          </div>
        </div>
      </main>
    </div>
  );
}
