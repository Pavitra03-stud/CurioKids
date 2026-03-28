// import { useState, useRef, useEffect } from "react";

// export default function OtpVerify({ onSuccess }) {
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [error, setError] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [loading, setLoading] = useState(false);

//   const inputsRef = useRef([]);

//   const parentData = JSON.parse(localStorage.getItem("tempParent"));
//   const email = parentData?.email;

//   // ⏱️ Timer
//   useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearInterval(interval);
//     }
//   }, [timer]);

//   // 🔢 Handle OTP input
//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1].focus();
//     }
//   };

//   // 🔐 VERIFY OTP
//   const verifyOtp = async () => {
//     setError("");
//     const finalOtp = otp.join("").trim();

//     if (finalOtp.length !== 6) {
//       setError("Enter complete OTP 🔢");
//       return;
//     }

//     setLoading(true);

//     try {
//       // ✅ VERIFY
//       const res = await fetch("http://localhost:5000/api/verify-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, otp: finalOtp }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message);
//         setLoading(false);
//         return;
//       }

//       console.log("OTP Verified ✅");

//       // 🔐 TRY LOGIN (SAFE)
//       try {
//         const loginRes = await fetch("http://localhost:5000/api/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: parentData.email,
//             password: "123456",
//           }),
//         });

//         const loginData = await loginRes.json();

//         console.log("Login response:", loginData);

//         if (loginRes.ok && loginData.token) {
//           localStorage.setItem("token", loginData.token);
//           localStorage.setItem(
//             "parentProfile",
//             JSON.stringify(parentData)
//           );
//           console.log("Login success 🔐");
//         }
//       } catch (loginErr) {
//         console.log("Login skipped:", loginErr);
//       }

//       alert("OTP Verified 🎉");

//       // ✅ SAFE CALL (NO CRASH)
//       if (typeof onSuccess === "function") {
//         onSuccess();
//       } else {
//         console.log("onSuccess not provided (ignored)");
//       }

//     } catch (err) {
//       console.log(err);
//       setError("Something went wrong 😢");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔁 RESEND OTP
//   const resendOtp = async () => {
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: parentData.parentName,
//           email: parentData.email,
//           password: "123456",
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message);
//         return;
//       }

//       alert("OTP resent 📧");
//       setTimer(30);

//     } catch (err) {
//       console.log(err);
//       setError("Failed to resend OTP");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2>🔐 Enter OTP</h2>
//         <p>Sent to {email}</p>

//         {/* OTP Boxes */}
//         <div style={styles.otpContainer}>
//           {otp.map((digit, index) => (
//             <input
//               key={index}
//               type="text"
//               maxLength="1"
//               value={digit}
//               ref={(el) => (inputsRef.current[index] = el)}
//               onChange={(e) => handleChange(e.target.value, index)}
//               style={styles.otpInput}
//             />
//           ))}
//         </div>

//         <button
//           onClick={verifyOtp}
//           style={styles.button}
//           disabled={loading}
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>

//         {timer > 0 ? (
//           <p style={styles.timer}>Resend OTP in {timer}s</p>
//         ) : (
//           <button onClick={resendOtp} style={styles.resend}>
//             Resend OTP
//           </button>
//         )}

//         {error && <p style={styles.error}>{error}</p>}
//       </div>
//     </div>
//   );
// }

// // 🎨 Styles
// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundImage:
//       "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   },
//   card: {
//     background: "rgba(255,255,255,0.95)",
//     padding: "30px",
//     borderRadius: "20px",
//     width: "350px",
//     textAlign: "center",
//     boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
//   },
//   otpContainer: {
//     display: "flex",
//     justifyContent: "space-between",
//     margin: "20px 0",
//   },
//   otpInput: {
//     width: "45px",
//     height: "50px",
//     fontSize: "20px",
//     textAlign: "center",
//     borderRadius: "10px",
//     border: "2px solid #6bcB77",
//   },
//   button: {
//     width: "100%",
//     padding: "12px",
//     background: "#ff9f1c",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   resend: {
//     marginTop: "10px",
//     background: "none",
//     border: "none",
//     color: "#2d6a4f",
//     cursor: "pointer",
//   },
//   timer: {
//     marginTop: "10px",
//     color: "#555",
//   },
//   error: {
//     color: "red",
//     marginTop: "10px",
//   },
// };


import { useState, useRef, useEffect } from "react";

export default function OtpVerify({ onSuccess }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  // 🔥 SUPPORT BOTH FLOWS
  const parentData = JSON.parse(localStorage.getItem("tempParent"));
  const loginEmail = localStorage.getItem("loginEmail");

  const email = parentData?.email || loginEmail;

  // ⏱️ Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
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
    const finalOtp = otp.join("").trim();

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
        setError(data.message);
        setLoading(false);
        return;
      }

      console.log("OTP Verified ✅");

      // 💾 STORE TOKEN
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // 💾 STORE USER EMAIL
      localStorage.setItem("userEmail", email);

      // 🧹 CLEAR TEMP DATA
      localStorage.removeItem("tempParent");
      localStorage.removeItem("loginEmail");

      alert("Login successful 🎉");

      if (typeof onSuccess === "function") {
        onSuccess();
      }

    } catch (err) {
      console.log(err);
      setError("Something went wrong 😢");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP (SMART)
  const resendOtp = async () => {
    setError("");

    try {
      let url = "";
      let body = {};

      if (parentData) {
        // 🌱 REGISTER FLOW
        url = "http://localhost:5000/api/register";
        body = {
          name: parentData.parentName,
          email: parentData.email,
          password: "123456",
        };
      } else {
        // 🔐 LOGIN FLOW
        url = "http://localhost:5000/api/send-otp";
        body = { email };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      alert("OTP resent 📧");
      setTimer(30);

    } catch (err) {
      console.log(err);
      setError("Failed to resend OTP");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Enter OTP</h2>
        <p>Sent to {email}</p>

        {/* OTP Boxes */}
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

        <button
          onClick={verifyOtp}
          style={styles.button}
          disabled={loading}
        >
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

// 🎨 Styles (unchanged)
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