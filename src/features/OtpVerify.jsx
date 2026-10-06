// // // import { useState, useRef, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { db } from "../firebase";
// // // import { doc, setDoc, getDoc } from "firebase/firestore";

// // // export default function OtpVerify() {
// // //   const [otp, setOtp] = useState(new Array(6).fill(""));
// // //   const [error, setError] = useState("");
// // //   const [timer, setTimer] = useState(30);
// // //   const [loading, setLoading] = useState(false);

// // //   const inputsRef = useRef([]);
// // //   const navigate = useNavigate();

// // //   const email = localStorage.getItem("loginEmail");

// // //   // ⏱️ Timer
// // //   useEffect(() => {
// // //     if (timer > 0) {
// // //       const interval = setInterval(() => {
// // //         setTimer((prev) => prev - 1);
// // //       }, 1000);
// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [timer]);

// // //   // 🔢 Handle OTP input
// // //   const handleChange = (value, index) => {
// // //     if (!/^[0-9]?$/.test(value)) return;

// // //     const newOtp = [...otp];
// // //     newOtp[index] = value;
// // //     setOtp(newOtp);

// // //     if (value && index < 5) {
// // //       inputsRef.current[index + 1].focus();
// // //     }
// // //   };

// // //   // 🔐 VERIFY OTP
// // //   const verifyOtp = async () => {
// // //     setError("");

// // //     const finalOtp = otp.join("");

// // //     if (finalOtp.length !== 6) {
// // //       setError("Enter complete OTP 🔢");
// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       const res = await fetch("http://localhost:5000/api/verify-otp", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({
// // //           email,
// // //           otp: finalOtp,
// // //         }),
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         setError(data.message || "Invalid OTP ❌");
// // //         return;
// // //       }

// // //       // 🔥 CHECK IF USER EXISTS
// // //       const userRef = doc(db, "users", email);
// // //       const userSnap = await getDoc(userRef);

// // //       if (!userSnap.exists()) {
// // //         // 🆕 Create new user
// // //         await setDoc(userRef, {
// // //           email,
// // //           score: 0,
// // //           level: "easy",
// // //           createdAt: new Date().toISOString(),
// // //         });
// // //       } else {
// // //         // 🔄 Update existing user (keep score)
// // //         await setDoc(
// // //           userRef,
// // //           {
// // //             verified: true,
// // //             lastLogin: new Date().toISOString(),
// // //           },
// // //           { merge: true }
// // //         );
// // //       }

// // //       alert("Login successful 🎉");

// // //       // ❌ DO NOT REMOVE EMAIL
// // //       // localStorage.removeItem("loginEmail");

// // //       // ✅ Navigate
// // //       navigate("/choose-friend");

// // //     } catch (err) {
// // //       console.error(err);
// // //       setError("Server error 😢");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // 🔁 RESEND OTP
// // //   const resendOtp = async () => {
// // //     setError("");

// // //     try {
// // //       const res = await fetch("http://localhost:5000/api/send-otp", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //         },
// // //         body: JSON.stringify({ email }),
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         setError(data.message || "Failed to resend OTP");
// // //         return;
// // //       }

// // //       alert("OTP resent 📧");
// // //       setTimer(30);

// // //     } catch (err) {
// // //       console.error(err);
// // //       setError("Failed to resend OTP");
// // //     }
// // //   };

// // //   return (
// // //     <div style={styles.container}>
// // //       <div style={styles.card}>
// // //         <h2>🔐 Enter OTP</h2>
// // //         <p>Sent to {email}</p>

// // //         <div style={styles.otpContainer}>
// // //           {otp.map((digit, index) => (
// // //             <input
// // //               key={index}
// // //               type="text"
// // //               maxLength="1"
// // //               value={digit}
// // //               ref={(el) => (inputsRef.current[index] = el)}
// // //               onChange={(e) => handleChange(e.target.value, index)}
// // //               style={styles.otpInput}
// // //             />
// // //           ))}
// // //         </div>

// // //         <button onClick={verifyOtp} style={styles.button} disabled={loading}>
// // //           {loading ? "Verifying..." : "Verify OTP"}
// // //         </button>

// // //         {timer > 0 ? (
// // //           <p style={styles.timer}>Resend OTP in {timer}s</p>
// // //         ) : (
// // //           <button onClick={resendOtp} style={styles.resend}>
// // //             Resend OTP
// // //           </button>
// // //         )}

// // //         {error && <p style={styles.error}>{error}</p>}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // const styles = {
// // //   container: {
// // //     height: "100vh",
// // //     display: "flex",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     backgroundImage:
// // //       "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
// // //     backgroundSize: "cover",
// // //     backgroundPosition: "center",
// // //   },
// // //   card: {
// // //     background: "rgba(255,255,255,0.95)",
// // //     padding: "30px",
// // //     borderRadius: "20px",
// // //     width: "350px",
// // //     textAlign: "center",
// // //     boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
// // //   },
// // //   otpContainer: {
// // //     display: "flex",
// // //     justifyContent: "space-between",
// // //     margin: "20px 0",
// // //   },
// // //   otpInput: {
// // //     width: "45px",
// // //     height: "50px",
// // //     fontSize: "20px",
// // //     textAlign: "center",
// // //     borderRadius: "10px",
// // //     border: "2px solid #6bcB77",
// // //   },
// // //   button: {
// // //     width: "100%",
// // //     padding: "12px",
// // //     background: "#ff9f1c",
// // //     color: "#fff",
// // //     border: "none",
// // //     borderRadius: "10px",
// // //     cursor: "pointer",
// // //     fontWeight: "bold",
// // //   },
// // //   resend: {
// // //     marginTop: "10px",
// // //     background: "none",
// // //     border: "none",
// // //     color: "#2d6a4f",
// // //     cursor: "pointer",
// // //   },
// // //   timer: {
// // //     marginTop: "10px",
// // //     color: "#555",
// // //   },
// // //   error: {
// // //     color: "red",
// // //     marginTop: "10px",
// // //   },
// // // };



// // import { useState, useRef, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { db } from "../firebase";
// // import { doc, setDoc, getDoc } from "firebase/firestore";

// // export default function OtpVerify() {
// //   const [otp, setOtp] = useState(new Array(6).fill(""));
// //   const [error, setError] = useState("");
// //   const [timer, setTimer] = useState(30);
// //   const [loading, setLoading] = useState(false);

// //   const inputsRef = useRef([]);
// //   const navigate = useNavigate();

// //   const email = localStorage.getItem("loginEmail");

// //   // ⏱️ Timer
// //   useEffect(() => {
// //     if (timer > 0) {
// //       const interval = setInterval(() => {
// //         setTimer((prev) => prev - 1);
// //       }, 1000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [timer]);

// //   // 🔢 Handle OTP input
// //   const handleChange = (value, index) => {
// //     if (!/^[0-9]?$/.test(value)) return;

// //     const newOtp = [...otp];
// //     newOtp[index] = value;
// //     setOtp(newOtp);

// //     if (value && index < 5) {
// //       inputsRef.current[index + 1].focus();
// //     }
// //   };

// //   // 🔐 VERIFY OTP
// //   const verifyOtp = async () => {
// //     setError("");

// //     const finalOtp = otp.join("");

// //     if (finalOtp.length !== 6) {
// //       setError("Enter complete OTP 🔢");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const res = await fetch("http://localhost:5000/api/verify-otp", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           email,
// //           otp: finalOtp,
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         setError(data.message || "Invalid OTP ❌");
// //         return;
// //       }

// //       // 🔥 CHECK IF USER EXISTS
// //       const userRef = doc(db, "users", email);
// //       const userSnap = await getDoc(userRef);

// //       if (!userSnap.exists()) {
// //         // 🆕 Create new user
// //         await setDoc(userRef, {
// //           email,
// //           score: 0,
// //           level: "easy",
// //           createdAt: new Date().toISOString(),
// //         });
// //       } else {
// //         // 🔄 Update existing user (keep score)
// //         await setDoc(
// //           userRef,
// //           {
// //             verified: true,
// //             lastLogin: new Date().toISOString(),
// //           },
// //           { merge: true }
// //         );
// //       }

// //       alert("Login successful 🎉");

// //       // ✅🔥 VERY IMPORTANT (ADDED)
// //       // Store userId for Firebase progress tracking
// //       localStorage.setItem("userId", email);

// //       // ❌ DO NOT REMOVE EMAIL
// //       // localStorage.removeItem("loginEmail");

// //       // ✅ Navigate
// //       navigate("/choose-friend");

// //     } catch (err) {
// //       console.error(err);
// //       setError("Server error 😢");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 🔁 RESEND OTP
// //   const resendOtp = async () => {
// //     setError("");

// //     try {
// //       const res = await fetch("http://localhost:5000/api/send-otp", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ email }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         setError(data.message || "Failed to resend OTP");
// //         return;
// //       }

// //       alert("OTP resent 📧");
// //       setTimer(30);

// //     } catch (err) {
// //       console.error(err);
// //       setError("Failed to resend OTP");
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.card}>
// //         <h2>🔐 Enter OTP</h2>
// //         <p>Sent to {email}</p>

// //         <div style={styles.otpContainer}>
// //           {otp.map((digit, index) => (
// //             <input
// //               key={index}
// //               type="text"
// //               maxLength="1"
// //               value={digit}
// //               ref={(el) => (inputsRef.current[index] = el)}
// //               onChange={(e) => handleChange(e.target.value, index)}
// //               style={styles.otpInput}
// //             />
// //           ))}
// //         </div>

// //         <button onClick={verifyOtp} style={styles.button} disabled={loading}>
// //           {loading ? "Verifying..." : "Verify OTP"}
// //         </button>

// //         {timer > 0 ? (
// //           <p style={styles.timer}>Resend OTP in {timer}s</p>
// //         ) : (
// //           <button onClick={resendOtp} style={styles.resend}>
// //             Resend OTP
// //           </button>
// //         )}

// //         {error && <p style={styles.error}>{error}</p>}
// //       </div>
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     height: "100vh",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundImage:
// //       "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
// //     backgroundSize: "cover",
// //     backgroundPosition: "center",
// //   },
// //   card: {
// //     background: "rgba(255,255,255,0.95)",
// //     padding: "30px",
// //     borderRadius: "20px",
// //     width: "350px",
// //     textAlign: "center",
// //     boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
// //   },
// //   otpContainer: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     margin: "20px 0",
// //   },
// //   otpInput: {
// //     width: "45px",
// //     height: "50px",
// //     fontSize: "20px",
// //     textAlign: "center",
// //     borderRadius: "10px",
// //     border: "2px solid #6bcB77",
// //   },
// //   button: {
// //     width: "100%",
// //     padding: "12px",
// //     background: "#ff9f1c",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "10px",
// //     cursor: "pointer",
// //     fontWeight: "bold",
// //   },
// //   resend: {
// //     marginTop: "10px",
// //     background: "none",
// //     border: "none",
// //     color: "#2d6a4f",
// //     cursor: "pointer",
// //   },
// //   timer: {
// //     marginTop: "10px",
// //     color: "#555",
// //   },
// //   error: {
// //     color: "red",
// //     marginTop: "10px",
// //   },
// // };



// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { auth, db } from "../firebase";

// import { signInWithCustomToken } from "firebase/auth";
// import { doc, setDoc, getDoc } from "firebase/firestore";

// export default function OtpVerify() {
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [error, setError] = useState("");
//   const [timer, setTimer] = useState(30);
//   const [loading, setLoading] = useState(false);

//   const inputsRef = useRef([]);

//   const navigate = useNavigate();

//   const email =
//     localStorage.getItem("loginEmail");

//   // =====================================================
//   // TIMER
//   // =====================================================

//   useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [timer]);

//   // =====================================================
//   // HANDLE OTP INPUT
//   // =====================================================

//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];

//     newOtp[index] = value;

//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   // =====================================================
//   // HANDLE BACKSPACE
//   // =====================================================

//   const handleKeyDown = (event, index) => {
//     if (
//       event.key === "Backspace" &&
//       !otp[index] &&
//       index > 0
//     ) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   // =====================================================
//   // VERIFY OTP
//   // =====================================================

//   const verifyOtp = async () => {
//     setError("");

//     const finalOtp = otp.join("");

//     if (!email) {
//       setError(
//         "Email not found. Please login again."
//       );
//       return;
//     }

//     if (finalOtp.length !== 6) {
//       setError("Enter complete OTP 🔢");
//       return;
//     }

//     setLoading(true);

//     try {
//       // -------------------------------------------------
//       // SEND OTP TO BACKEND
//       // -------------------------------------------------

//       const res = await fetch(
//         "http://localhost:5000/api/verify-otp",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify({
//             email,
//             otp: finalOtp,
//           }),
//         }
//       );

//       const data = await res.json();

//       console.log(
//         "OTP verification response:",
//         data
//       );

//       if (!res.ok) {
//         setError(
//           data.message ||
//             "Invalid OTP ❌"
//         );
//         return;
//       }

//       // -------------------------------------------------
//       // CHECK CUSTOM TOKEN
//       // -------------------------------------------------

//       if (!data.customToken) {
//         console.error(
//           "Firebase custom token missing:",
//           data
//         );

//         setError(
//           "Firebase login token was not received."
//         );

//         return;
//       }

//       // -------------------------------------------------
//       // FIREBASE AUTH LOGIN
//       // -------------------------------------------------

//       console.log(
//         "🔥 Signing into Firebase..."
//       );

//       const userCredential =
//         await signInWithCustomToken(
//           auth,
//           data.customToken
//         );

//       const firebaseUser =
//         userCredential.user;

//       console.log(
//         "✅ Firebase login successful"
//       );

//       console.log(
//         "👤 Firebase UID:",
//         firebaseUser.uid
//       );

//       // -------------------------------------------------
//       // STORE REAL FIREBASE UID
//       // -------------------------------------------------

//       localStorage.setItem(
//         "userId",
//         firebaseUser.uid
//       );

//       console.log(
//         "💾 Firebase UID stored:",
//         firebaseUser.uid
//       );

//       // -------------------------------------------------
//       // USER FIRESTORE DOCUMENT
//       // -------------------------------------------------

//       const userRef = doc(
//         db,
//         "users",
//         firebaseUser.uid
//       );

//       const userSnap =
//         await getDoc(userRef);

//       if (!userSnap.exists()) {
//         // -------------------------------------------------
//         // NEW USER
//         // -------------------------------------------------

//         await setDoc(userRef, {
//           uid: firebaseUser.uid,

//           email:
//             firebaseUser.email || email,

//           verified: true,

//           score: 0,

//           level: "easy",

//           createdAt:
//             new Date().toISOString(),

//           lastLogin:
//             new Date().toISOString(),
//         });

//         console.log(
//           "🆕 New Firestore user created"
//         );
//       } else {
//         // -------------------------------------------------
//         // EXISTING USER
//         // -------------------------------------------------

//         await setDoc(
//           userRef,
//           {
//             uid: firebaseUser.uid,

//             email:
//               firebaseUser.email || email,

//             verified: true,

//             lastLogin:
//               new Date().toISOString(),
//           },
//           {
//             merge: true,
//           }
//         );

//         console.log(
//           "🔄 Existing Firestore user updated"
//         );
//       }

//       // -------------------------------------------------
//       // SUCCESS
//       // -------------------------------------------------

//       alert(
//         "Login successful 🎉"
//       );

//       // Keep loginEmail because other
//       // parts of the app may use it.

//       navigate(
//         "/choose-friend"
//       );

//     } catch (err) {
//       console.error(
//         "❌ OTP/Firebase login error:",
//         err
//       );

//       setError(
//         err?.message ||
//           "Server error 😢"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // RESEND OTP
//   // =====================================================

//   const resendOtp = async () => {
//     setError("");

//     if (!email) {
//       setError(
//         "Email not found. Please login again."
//       );
//       return;
//     }

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/send-otp",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify({
//             email,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(
//           data.message ||
//             "Failed to resend OTP"
//         );
//         return;
//       }

//       // Clear old OTP
//       setOtp(
//         new Array(6).fill("")
//       );

//       // Restart timer
//       setTimer(30);

//       // Focus first box
//       inputsRef.current[0]?.focus();

//       alert(
//         "OTP resent 📧"
//       );
//     } catch (err) {
//       console.error(
//         "Resend OTP error:",
//         err
//       );

//       setError(
//         "Failed to resend OTP"
//       );
//     }
//   };

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>

//         <h2>
//           🔐 Enter OTP
//         </h2>

//         <p>
//           Sent to {email}
//         </p>

//         {/* OTP INPUTS */}

//         <div style={styles.otpContainer}>
//           {otp.map(
//             (digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength="1"
//                 value={digit}
//                 ref={(el) =>
//                   (inputsRef.current[
//                     index
//                   ] = el)
//                 }
//                 onChange={(e) =>
//                   handleChange(
//                     e.target.value,
//                     index
//                   )
//                 }
//                 onKeyDown={(e) =>
//                   handleKeyDown(
//                     e,
//                     index
//                   )
//                 }
//                 style={
//                   styles.otpInput
//                 }
//               />
//             )
//           )}
//         </div>

//         {/* VERIFY BUTTON */}

//         <button
//           onClick={verifyOtp}
//           style={{
//             ...styles.button,
//             opacity: loading
//               ? 0.7
//               : 1,
//           }}
//           disabled={loading}
//         >
//           {loading
//             ? "Verifying..."
//             : "Verify OTP"}
//         </button>

//         {/* RESEND */}

//         {timer > 0 ? (
//           <p style={styles.timer}>
//             Resend OTP in{" "}
//             {timer}s
//           </p>
//         ) : (
//           <button
//             onClick={resendOtp}
//             style={styles.resend}
//           >
//             Resend OTP
//           </button>
//         )}

//         {/* ERROR */}

//         {error && (
//           <p style={styles.error}>
//             {error}
//           </p>
//         )}

//       </div>
//     </div>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

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

//     padding: "20px",

//     boxSizing: "border-box",
//   },

//   card: {
//     background:
//       "rgba(255,255,255,0.95)",

//     padding: "30px",

//     borderRadius: "20px",

//     width: "350px",

//     maxWidth: "100%",

//     textAlign: "center",

//     boxShadow:
//       "0 10px 25px rgba(0,0,0,0.2)",
//   },

//   otpContainer: {
//     display: "flex",

//     justifyContent:
//       "space-between",

//     gap: "8px",

//     margin: "20px 0",
//   },

//   otpInput: {
//     width: "45px",

//     height: "50px",

//     fontSize: "20px",

//     textAlign: "center",

//     borderRadius: "10px",

//     border:
//       "2px solid #6bcb77",

//     outline: "none",

//     boxSizing: "border-box",
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

//     fontSize: "16px",
//   },

//   resend: {
//     marginTop: "10px",

//     background: "none",

//     border: "none",

//     color: "#2d6a4f",

//     cursor: "pointer",

//     fontWeight: "bold",

//     fontSize: "14px",
//   },

//   timer: {
//     marginTop: "10px",

//     color: "#555",
//   },

//   error: {
//     color: "red",

//     marginTop: "10px",

//     fontSize: "14px",
//   },
// };



import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase";

import { signInWithCustomToken } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

export default function OtpVerify() {
  const [otp, setOtp] = useState(
    new Array(6).fill("")
  );

  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const navigate = useNavigate();

  const email =
    localStorage.getItem("loginEmail");

  // =========================================================
  // ⏱️ TIMER
  // =========================================================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =========================================================
  // 🔢 OTP INPUT
  // =========================================================

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next box
    if (
      value &&
      index < 5
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  // =========================================================
  // ⌫ BACKSPACE
  // =========================================================

  const handleKeyDown = (
    event,
    index
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ]?.focus();
    }
  };

  // =========================================================
  // 🔐 VERIFY OTP
  // =========================================================

  const verifyOtp = async () => {
    setError("");

    const finalOtp = otp.join("");

    if (!email) {
      setError(
        "Email not found. Please login again."
      );
      return;
    }

    if (finalOtp.length !== 6) {
      setError(
        "Enter complete OTP 🔢"
      );
      return;
    }

    setLoading(true);

    try {
      // =======================================================
      // 1️⃣ VERIFY OTP WITH BACKEND
      // =======================================================

      const res = await fetch(
        "http://localhost:5000/api/verify-otp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            otp: finalOtp,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "🔐 OTP verification response:",
        data
      );

      if (!res.ok) {
        setError(
          data.message ||
            "Invalid OTP ❌"
        );
        return;
      }

      // =======================================================
      // 2️⃣ CHECK FIREBASE CUSTOM TOKEN
      // =======================================================

      if (!data.customToken) {
        console.error(
          "❌ Firebase custom token missing:",
          data
        );

        setError(
          "Firebase login token was not received."
        );

        return;
      }

      // =======================================================
      // 3️⃣ LOGIN TO FIREBASE AUTH
      // =======================================================

      console.log(
        "🔥 Signing into Firebase..."
      );

      const userCredential =
        await signInWithCustomToken(
          auth,
          data.customToken
        );

      const firebaseUser =
        userCredential.user;

      console.log(
        "✅ Firebase login successful"
      );

      console.log(
        "👤 Firebase UID:",
        firebaseUser.uid
      );

      // =======================================================
      // 4️⃣ STORE REAL FIREBASE UID
      // =======================================================

      localStorage.setItem(
        "userId",
        firebaseUser.uid
      );

      console.log(
        "💾 Firebase UID stored:",
        firebaseUser.uid
      );

      // =======================================================
      // 5️⃣ GET PARENT DATA FROM REGISTRATION
      // =======================================================

      const savedParent =
        localStorage.getItem(
          "parentProfile"
        ) ||
        localStorage.getItem(
          "tempParent"
        );

      let parentData = {};

      if (savedParent) {
        try {
          parentData =
            JSON.parse(savedParent);
        } catch (error) {
          console.error(
            "❌ Invalid parent data:",
            error
          );
        }
      }

      // =======================================================
      // 6️⃣ GET CHILD DATA
      // =======================================================

      const savedChild =
        localStorage.getItem(
          "childProfile"
        );

      let childData = {
        name: "Little Explorer",
        age: 5,
      };

      if (savedChild) {
        try {
          childData = {
            ...childData,
            ...JSON.parse(savedChild),
          };
        } catch (error) {
          console.error(
            "❌ Invalid child data:",
            error
          );
        }
      }

      // =======================================================
      // 7️⃣ FIRESTORE USER DOCUMENT
      // =======================================================

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userSnap =
        await getDoc(userRef);

      // =======================================================
      // 🆕 NEW USER
      // =======================================================

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,

          email:
            firebaseUser.email ||
            email,

          // 👨‍👩‍👧 Parent
          parentName:
            parentData.parentName ||
            parentData.name ||
            "",

          timeLimit:
            parentData.timeLimit ||
            parentData.time ||
            "",

          // 👧 Child
          childName:
            childData.name ||
            "Little Explorer",

          childAge:
            childData.age || 5,

          // 👤 Profile
          name:
            childData.name ||
            "Little Explorer",

          avatar: "🐵",

          verified: true,

          createdAt:
            new Date().toISOString(),

          lastLogin:
            new Date().toISOString(),
        });

        console.log(
          "🆕 New Firebase user profile created"
        );
      }

      // =======================================================
      // 🔄 EXISTING USER
      // =======================================================

      else {
        /*
         * IMPORTANT:
         * merge:true means we DON'T overwrite
         * existing stars/progress/profile fields.
         */

        await setDoc(
          userRef,
          {
            uid: firebaseUser.uid,

            email:
              firebaseUser.email ||
              email,

            verified: true,

            lastLogin:
              new Date().toISOString(),

            // Update registration information
            // only if it exists locally.
            ...(parentData.parentName
              ? {
                  parentName:
                    parentData.parentName,
                }
              : {}),

            ...(parentData.timeLimit
              ? {
                  timeLimit:
                    parentData.timeLimit,
                }
              : {}),

            ...(childData.name
              ? {
                  childName:
                    childData.name,
                }
              : {}),

            ...(childData.age
              ? {
                  childAge:
                    childData.age,
                }
              : {}),
          },
          {
            merge: true,
          }
        );

        console.log(
          "🔄 Existing Firebase user updated"
        );
      }

      // =======================================================
      // 8️⃣ MAKE SURE PROGRESS DOCUMENT EXISTS
      // =======================================================

      const progressRef = doc(
        db,
        "progress",
        firebaseUser.uid
      );

      const progressSnap =
        await getDoc(progressRef);

      if (!progressSnap.exists()) {
        await setDoc(progressRef, {
          stars: 0,
          streak: 0,
          history: [],
          activeGames: {},
        });

        console.log(
          "🌱 Initial progress document created"
        );
      }

      // =======================================================
      // 9️⃣ KEEP LOCAL STORAGE IN SYNC
      // =======================================================

      localStorage.setItem(
        "loginEmail",
        email
      );

      localStorage.setItem(
        "parentProfile",
        JSON.stringify({
          parentName:
            parentData.parentName ||
            parentData.name ||
            "",

          email,

          timeLimit:
            parentData.timeLimit ||
            parentData.time ||
            "",
        })
      );

      localStorage.setItem(
        "childProfile",
        JSON.stringify(
          childData
        )
      );

      // =======================================================
      // 🎉 SUCCESS
      // =======================================================

      alert(
        "Login successful 🎉"
      );

      navigate(
        "/choose-friend"
      );

    } catch (err) {
      console.error(
        "❌ OTP/Firebase login error:",
        err
      );

      setError(
        err?.message ||
          "Server error 😢"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🔁 RESEND OTP
  // =========================================================

  const resendOtp = async () => {
    setError("");

    if (!email) {
      setError(
        "Email not found. Please login again."
      );
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Failed to resend OTP"
        );
        return;
      }

      // Clear old OTP
      setOtp(
        new Array(6).fill("")
      );

      // Restart timer
      setTimer(30);

      // Focus first input
      inputsRef.current[0]?.focus();

      alert(
        "OTP resent 📧"
      );

    } catch (err) {
      console.error(
        "❌ Resend OTP error:",
        err
      );

      setError(
        "Failed to resend OTP"
      );
    }
  };

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h2>
          🔐 Enter OTP
        </h2>

        <p>
          Sent to {email}
        </p>

        {/* OTP INPUTS */}
        <div style={styles.otpContainer}>

          {otp.map(
            (digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                ref={(el) =>
                  (inputsRef.current[
                    index
                  ] = el)
                }
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    index
                  )
                }
                style={styles.otpInput}
              />
            )
          )}

        </div>

        {/* VERIFY */}
        <button
          onClick={verifyOtp}
          style={{
            ...styles.button,
            opacity: loading
              ? 0.7
              : 1,
          }}
          disabled={loading}
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        {/* RESEND */}
        {timer > 0 ? (
          <p style={styles.timer}>
            Resend OTP in{" "}
            {timer}s
          </p>
        ) : (
          <button
            onClick={resendOtp}
            style={styles.resend}
          >
            Resend OTP
          </button>
        )}

        {/* ERROR */}
        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

// =========================================================
// 🎨 STYLES
// =========================================================

const styles = {
  container: {
    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    backgroundImage:
      "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",

    backgroundSize: "cover",

    backgroundPosition: "center",

    padding: "20px",

    boxSizing: "border-box",
  },

  card: {
    background:
      "rgba(255,255,255,0.95)",

    padding: "30px",

    borderRadius: "20px",

    width: "350px",

    maxWidth: "100%",

    textAlign: "center",

    boxShadow:
      "0 10px 25px rgba(0,0,0,0.2)",
  },

  otpContainer: {
    display: "flex",

    justifyContent:
      "space-between",

    gap: "8px",

    margin: "20px 0",
  },

  otpInput: {
    width: "45px",

    height: "50px",

    fontSize: "20px",

    textAlign: "center",

    borderRadius: "10px",

    border:
      "2px solid #6bcb77",

    outline: "none",

    boxSizing: "border-box",
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

    fontSize: "16px",
  },

  resend: {
    marginTop: "10px",

    background: "none",

    border: "none",

    color: "#2d6a4f",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "14px",
  },

  timer: {
    marginTop: "10px",

    color: "#555",
  },

  error: {
    color: "red",

    marginTop: "10px",

    fontSize: "14px",
  },
};