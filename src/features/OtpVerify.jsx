import { useState, useRef, useEffect } from "react";
import {db} from "../firebase";
import {doc,setDoc} from "firebase/firestore";

export default function OtpVerify({ onSuccess }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const email = localStorage.getItem("loginEmail");

  // ⏱️ Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 🔢 Handle OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // 🔐 VERIFY OTP
  const verifyOtp = async () => {
    setError("");

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Enter complete OTP 🔢");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP ❌");
        return;
      }

      await setDoc(doc(db, "users", email), {
  email,
  verified: true,
  createdAt: new Date()
});

alert("Login successful 🎉");

      localStorage.removeItem("loginEmail");

      if (typeof onSuccess === "function") {
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      setError("Server error 😢");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const resendOtp = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      alert("OTP resent 📧");
      setTimer(30);

    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Enter OTP</h2>
        <p>Sent to {email}</p>

        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              style={styles.otpInput}
            />
          ))}
        </div>

        <button onClick={verifyOtp} style={styles.button} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {timer > 0 ? (
          <p style={styles.timer}>Resend OTP in {timer}s</p>
        ) : (
          <button onClick={resendOtp} style={styles.resend}>
            Resend OTP
          </button>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    padding: "30px",
    borderRadius: "20px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0",
  },
  otpInput: {
    width: "45px",
    height: "50px",
    fontSize: "20px",
    textAlign: "center",
    borderRadius: "10px",
    border: "2px solid #6bcB77",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#ff9f1c",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resend: {
    marginTop: "10px",
    background: "none",
    border: "none",
    color: "#2d6a4f",
    cursor: "pointer",
  },
  timer: {
    marginTop: "10px",
    color: "#555",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};