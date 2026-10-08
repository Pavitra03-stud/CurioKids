// // import { useState, useRef, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";

// // import { auth, db } from "../firebase";

// // import {
// //   signInWithCustomToken,
// //   getIdTokenResult,
// // } from "firebase/auth";

// // import {
// //   doc,
// //   getDoc,
// //   setDoc,
// // } from "firebase/firestore";

// // export default function OtpVerify() {
// //   const navigate = useNavigate();

// //   // =========================================================
// //   // EMAIL
// //   // =========================================================

// //   const email = (
// //     localStorage.getItem("loginEmail") || ""
// //   )
// //     .trim()
// //     .toLowerCase();

// //   // =========================================================
// //   // STATE
// //   // =========================================================

// //   const [otp, setOtp] = useState(
// //     new Array(6).fill("")
// //   );

// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [timer, setTimer] = useState(30);

// //   const inputsRef = useRef([]);

// //   // =========================================================
// //   // RESEND TIMER
// //   // =========================================================

// //   useEffect(() => {
// //     if (timer <= 0) {
// //       return;
// //     }

// //     const interval = setInterval(() => {
// //       setTimer((prev) => prev - 1);
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [timer]);

// //   // =========================================================
// //   // OTP INPUT
// //   // =========================================================

// //   const handleChange = (value, index) => {
// //     if (!/^[0-9]?$/.test(value)) {
// //       return;
// //     }

// //     const newOtp = [...otp];

// //     newOtp[index] = value;

// //     setOtp(newOtp);

// //     setError("");

// //     if (value && index < 5) {
// //       inputsRef.current[index + 1]?.focus();
// //     }
// //   };

// //   // =========================================================
// //   // BACKSPACE
// //   // =========================================================

// //   const handleKeyDown = (event, index) => {
// //     if (
// //       event.key === "Backspace" &&
// //       !otp[index] &&
// //       index > 0
// //     ) {
// //       inputsRef.current[index - 1]?.focus();
// //     }
// //   };

// //   // =========================================================
// //   // SAFE LOCAL STORAGE READER
// //   // =========================================================

// //   const getLocalStorageObject = (key) => {
// //     try {
// //       const value =
// //         localStorage.getItem(key);

// //       if (!value) {
// //         return null;
// //       }

// //       return JSON.parse(value);

// //     } catch (storageError) {
// //       console.error(
// //         `❌ Failed to parse ${key}:`,
// //         storageError
// //       );

// //       return null;
// //     }
// //   };

// //   // =========================================================
// //   // VERIFY OTP
// //   // =========================================================

// //   const verifyOtp = async () => {
// //     setError("");

// //     const finalOtp = otp.join("");

// //     // =======================================================
// //     // VALIDATION
// //     // =======================================================

// //     if (!email) {
// //       setError(
// //         "Email not found. Please login again."
// //       );

// //       return;
// //     }

// //     if (finalOtp.length !== 6) {
// //       setError(
// //         "Please enter the complete OTP."
// //       );

// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // =====================================================
// //       // 1. VERIFY OTP WITH BACKEND
// //       // =====================================================

// //       const response = await fetch(
// //         "http://localhost:5000/api/verify-otp",
// //         {
// //           method: "POST",

// //           headers: {
// //             "Content-Type": "application/json",
// //           },

// //           body: JSON.stringify({
// //             email,
// //             otp: finalOtp,
// //           }),
// //         }
// //       );

// //       const data = await response.json();

// //       console.log(
// //         "🔐 OTP response:",
// //         data
// //       );

// //       if (!response.ok) {
// //         setError(
// //           data.message ||
// //             "Invalid OTP. Please try again."
// //         );

// //         return;
// //       }

// //       // =====================================================
// //       // 2. FIREBASE CUSTOM TOKEN
// //       // =====================================================

// //       if (!data.customToken) {
// //         setError(
// //           "Firebase login token was not received."
// //         );

// //         return;
// //       }

// //       // =====================================================
// //       // 3. FIREBASE LOGIN
// //       // =====================================================

// //       console.log(
// //         "🔥 Signing into Firebase..."
// //       );

// //       const userCredential =
// //         await signInWithCustomToken(
// //           auth,
// //           data.customToken
// //         );

// //       const firebaseUser =
// //         userCredential.user;

// //       const uid =
// //         firebaseUser.uid;

// //       console.log(
// //         "✅ Firebase login successful"
// //       );

// //       console.log(
// //         "👤 Firebase UID:",
// //         uid
// //       );

// //       // =====================================================
// //       // 4. SAVE REAL FIREBASE UID
// //       // =====================================================

// //       localStorage.setItem(
// //         "userId",
// //         uid
// //       );

// //       // =====================================================
// //       // 5. ADMIN CHECK
// //       // =====================================================

// //       let isAdmin = false;

// //       try {
// //         const tokenResult =
// //           await getIdTokenResult(
// //             firebaseUser,
// //             true
// //           );

// //         isAdmin =
// //           tokenResult.claims.admin === true;

// //         console.log(
// //           "👑 Admin:",
// //           isAdmin
// //         );

// //       } catch (adminError) {
// //         console.warn(
// //           "⚠️ Admin check failed:",
// //           adminError
// //         );
// //       }

// //       // =====================================================
// //       // 6. GET USER DOCUMENT
// //       //
// //       // IMPORTANT:
// //       //
// //       // We ONLY use:
// //       //
// //       // users/{firebaseUID}
// //       //
// //       // We DO NOT try:
// //       //
// //       // users/{email}
// //       //
// //       // because Firestore rules are UID based.
// //       // =====================================================

// //       const userRef = doc(
// //         db,
// //         "users",
// //         uid
// //       );

// //       const userSnap =
// //         await getDoc(userRef);

// //       const userExists =
// //         userSnap.exists();

// //       const existingUser =
// //         userExists
// //           ? userSnap.data()
// //           : null;

// //       console.log(
// //         "🔥 User exists:",
// //         userExists
// //       );

// //       console.log(
// //         "🔥 Existing Firebase data:",
// //         existingUser
// //       );

// //       // =====================================================
// //       // 7. PROFILE DATA
// //       // =====================================================

// //       let childProfile =
// //         existingUser?.childProfile ||
// //         null;

// //       let parentProfile =
// //         existingUser?.parentProfile ||
// //         null;

// //       let jungleFriend =
// //         existingUser?.jungleFriend ||
// //         null;

// //       // =====================================================
// //       // 8. BRAND NEW USER
// //       //
// //       // Only a brand-new Firebase user reads the registration
// //       // information stored temporarily in localStorage.
// //       // =====================================================

// //       if (!userExists) {
// //         console.log(
// //           "🆕 NEW FIREBASE USER → reading registration data"
// //         );

// //         // ---------------------------------------------------
// //         // CHILD PROFILE
// //         // ---------------------------------------------------

// //         const savedChild =
// //           getLocalStorageObject(
// //             "childProfile"
// //           );

// //         if (
// //           savedChild &&
// //           savedChild.name
// //         ) {
// //           childProfile = {
// //             name: String(
// //               savedChild.name
// //             ).trim(),

// //             age:
// //               savedChild.age !== undefined &&
// //               savedChild.age !== null
// //                 ? String(savedChild.age)
// //                 : "",

// //             createdAt:
// //               savedChild.createdAt ||
// //               new Date().toISOString(),
// //           };

// //           console.log(
// //             "👧 Registration child:",
// //             childProfile
// //           );
// //         }

// //         // ---------------------------------------------------
// //         // PARENT PROFILE
// //         // ---------------------------------------------------

// //         const savedParent =
// //           getLocalStorageObject(
// //             "parentProfile"
// //           ) ||
// //           getLocalStorageObject(
// //             "tempParent"
// //           );

// //         if (savedParent) {
// //           parentProfile = {
// //             parentName:
// //               savedParent.parentName ||
// //               "",

// //             email:
// //               savedParent.email ||
// //               firebaseUser.email ||
// //               email,
// //           };

// //           console.log(
// //             "👨‍👩‍👧 Registration parent:",
// //             parentProfile
// //           );
// //         }

// //         // ---------------------------------------------------
// //         // JUNGLE FRIEND
// //         //
// //         // New user must choose friend separately.
// //         // ---------------------------------------------------

// //         jungleFriend = null;

// //         localStorage.removeItem(
// //           "jungleFriend"
// //         );

// //         console.log(
// //           "🦊 New user → friend will be selected later"
// //         );

// //       } else {
// //         // ===================================================
// //         // EXISTING USER
// //         //
// //         // Firebase is the only source of truth.
// //         // ===================================================

// //         console.log(
// //           "✅ EXISTING USER → Firebase data only"
// //         );

// //         console.log(
// //           "🚫 Ignoring temporary localStorage profile data"
// //         );
// //       }

// //       // =====================================================
// //       // 9. SAVE PROFILE TO UID DOCUMENT
// //       // =====================================================

// //       const profileData = {
// //         uid,

// //         email:
// //           firebaseUser.email ||
// //           email,

// //         verified: true,

// //         childProfile:
// //           childProfile || null,

// //         parentProfile:
// //           parentProfile || null,

// //         jungleFriend:
// //           jungleFriend || null,

// //         // Compatibility field
// //         name:
// //           childProfile?.name ||
// //           existingUser?.name ||
// //           "",

// //         avatar:
// //           existingUser?.avatar ||
// //           "🐵",

// //         createdAt:
// //           existingUser?.createdAt ||
// //           new Date().toISOString(),

// //         lastLogin:
// //           new Date().toISOString(),
// //       };

// //       await setDoc(
// //         userRef,
// //         profileData,
// //         {
// //           merge: true,
// //         }
// //       );

// //       console.log(
// //         "✅ User profile saved to UID document"
// //       );

// //       // =====================================================
// //       // 10. READ FINAL FIREBASE DATA
// //       // =====================================================

// //       const latestUserSnap =
// //         await getDoc(userRef);

// //       const firebaseUserData =
// //         latestUserSnap.exists()
// //           ? latestUserSnap.data()
// //           : {};

// //       console.log(
// //         "🔥 FINAL FIREBASE DATA:",
// //         firebaseUserData
// //       );

// //       // =====================================================
// //       // 11. UPDATE LOCAL STORAGE CACHE
// //       //
// //       // Firebase = source of truth
// //       // localStorage = cache only
// //       // =====================================================

// //       // -----------------------------------------------------
// //       // CHILD
// //       // -----------------------------------------------------

// //       if (
// //         firebaseUserData.childProfile
// //       ) {
// //         localStorage.setItem(
// //           "childProfile",
// //           JSON.stringify(
// //             firebaseUserData.childProfile
// //           )
// //         );
// //       } else {
// //         localStorage.removeItem(
// //           "childProfile"
// //         );
// //       }

// //       // -----------------------------------------------------
// //       // PARENT
// //       // -----------------------------------------------------

// //       if (
// //         firebaseUserData.parentProfile
// //       ) {
// //         localStorage.setItem(
// //           "parentProfile",
// //           JSON.stringify(
// //             firebaseUserData.parentProfile
// //           )
// //         );
// //       } else {
// //         localStorage.removeItem(
// //           "parentProfile"
// //         );
// //       }

// //       // -----------------------------------------------------
// //       // FRIEND
// //       // -----------------------------------------------------

// //       if (
// //         firebaseUserData.jungleFriend
// //       ) {
// //         localStorage.setItem(
// //           "jungleFriend",
// //           JSON.stringify(
// //             firebaseUserData.jungleFriend
// //           )
// //         );
// //       } else {
// //         localStorage.removeItem(
// //           "jungleFriend"
// //         );
// //       }

// //       // -----------------------------------------------------
// //       // EMAIL
// //       // -----------------------------------------------------

// //       localStorage.setItem(
// //         "loginEmail",
// //         firebaseUserData.email ||
// //           firebaseUser.email ||
// //           email
// //       );

// //       // =====================================================
// //       // 12. CREATE PROGRESS DOCUMENT IF NEEDED
// //       // =====================================================

// //       const progressRef = doc(
// //         db,
// //         "progress",
// //         uid
// //       );

// //       const progressSnap =
// //         await getDoc(progressRef);

// //       if (!progressSnap.exists()) {
// //         await setDoc(
// //           progressRef,
// //           {
// //             userId: uid,
// //             stars: 0,
// //             streak: 0,
// //             history: [],
// //             activeGames: {},
// //           }
// //         );

// //         console.log(
// //           "🌱 Progress document created"
// //         );
// //       } else {
// //         console.log(
// //           "📊 Progress document already exists"
// //         );
// //       }

// //       // =====================================================
// //       // 13. CHECK PROFILE COMPLETION
// //       // =====================================================

// //       const hasChildProfile =
// //         Boolean(
// //           firebaseUserData
// //             ?.childProfile
// //             ?.name
// //         ) &&
// //         Boolean(
// //           firebaseUserData
// //             ?.childProfile
// //             ?.age
// //         );

// //       const hasJungleFriend =
// //         Boolean(
// //           firebaseUserData
// //             ?.jungleFriend
// //             ?.name
// //         );

// //       console.log(
// //         "👧 Child profile:",
// //         firebaseUserData?.childProfile
// //       );

// //       console.log(
// //         "🦊 Jungle friend:",
// //         firebaseUserData?.jungleFriend
// //       );

// //       console.log(
// //         "👧 Child profile complete:",
// //         hasChildProfile
// //       );

// //       console.log(
// //         "🦊 Friend selected:",
// //         hasJungleFriend
// //       );

// //       // =====================================================
// //       // 14. ADMIN
// //       // =====================================================

// //       if (isAdmin) {
// //         console.log(
// //           "👑 Admin → /admin"
// //         );

// //         navigate("/admin");

// //         return;
// //       }

// //       // =====================================================
// //       // 15. BRAND NEW USER
// //       // =====================================================

// //       if (!userExists) {
// //         console.log(
// //           "🆕 BRAND NEW USER → Choose Friend"
// //         );

// //         localStorage.setItem(
// //           "appProgress",
// //           "child-created"
// //         );

// //         localStorage.removeItem(
// //           "jungleFriend"
// //         );

// //         navigate(
// //           "/choose-friend"
// //         );

// //         return;
// //       }

// //       // =====================================================
// //       // 16. EXISTING COMPLETE USER
// //       // =====================================================

// //       if (
// //         hasChildProfile &&
// //         hasJungleFriend
// //       ) {
// //         console.log(
// //           "✅ EXISTING COMPLETE USER → Jungle Hero"
// //         );

// //         localStorage.setItem(
// //           "appProgress",
// //           "friend-chosen"
// //         );

// //         navigate(
// //           "/jungle-hero"
// //         );

// //         return;
// //       }

// //       // =====================================================
// //       // 17. EXISTING INCOMPLETE USER
// //       // =====================================================

// //       console.log(
// //         "🆕 EXISTING INCOMPLETE USER → Choose Friend"
// //       );

// //       navigate(
// //         "/choose-friend"
// //       );

// //     } catch (error) {
// //       console.error(
// //         "❌ OTP verification error:",
// //         error
// //       );

// //       // Keep the useful Firebase error
// //       // in the console, but show a cleaner
// //       // message to the user.
// //       if (
// //         error?.code ===
// //         "permission-denied"
// //       ) {
// //         setError(
// //           "Firebase permission denied. Please check your Firestore rules."
// //         );
// //       } else {
// //         setError(
// //           error?.message ||
// //             "Something went wrong. Please try again."
// //         );
// //       }

// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =========================================================
// //   // RESEND OTP
// //   // =========================================================

// //   const resendOtp = async () => {
// //     setError("");

// //     if (!email) {
// //       setError(
// //         "Email not found. Please login again."
// //       );

// //       return;
// //     }

// //     try {
// //       const response =
// //         await fetch(
// //           "http://localhost:5000/api/send-otp",
// //           {
// //             method: "POST",

// //             headers: {
// //               "Content-Type":
// //                 "application/json",
// //             },

// //             body: JSON.stringify({
// //               email,
// //             }),
// //           }
// //         );

// //       const data =
// //         await response.json();

// //       if (!response.ok) {
// //         setError(
// //           data.message ||
// //             "Failed to resend OTP."
// //         );

// //         return;
// //       }

// //       setOtp(
// //         new Array(6).fill("")
// //       );

// //       setTimer(30);

// //       inputsRef.current[0]?.focus();

// //       alert(
// //         "OTP resent successfully 📧"
// //       );

// //     } catch (error) {
// //       console.error(
// //         "❌ Resend OTP error:",
// //         error
// //       );

// //       setError(
// //         "Failed to resend OTP."
// //       );
// //     }
// //   };

// //   // =========================================================
// //   // UI
// //   // =========================================================

// //   return (
// //     <div style={styles.container}>

// //       <div style={styles.card}>

// //         <h2>
// //           🔐 Enter OTP
// //         </h2>

// //         <p>
// //           Sent to {email}
// //         </p>

// //         {/* OTP INPUTS */}

// //         <div style={styles.otpContainer}>

// //           {otp.map(
// //             (digit, index) => (
// //               <input
// //                 key={index}

// //                 ref={(element) => {
// //                   inputsRef.current[index] =
// //                     element;
// //                 }}

// //                 type="text"

// //                 inputMode="numeric"

// //                 maxLength={1}

// //                 value={digit}

// //                 onChange={(event) =>
// //                   handleChange(
// //                     event.target.value,
// //                     index
// //                   )
// //                 }

// //                 onKeyDown={(event) =>
// //                   handleKeyDown(
// //                     event,
// //                     index
// //                   )
// //                 }

// //                 style={
// //                   styles.otpInput
// //                 }

// //                 autoComplete={
// //                   index === 0
// //                     ? "one-time-code"
// //                     : "off"
// //                 }
// //               />
// //             )
// //           )}

// //         </div>

// //         {/* VERIFY */}

// //         <button
// //           onClick={verifyOtp}
// //           disabled={loading}
// //           style={{
// //             ...styles.button,
// //             opacity: loading
// //               ? 0.7
// //               : 1,
// //           }}
// //         >
// //           {loading
// //             ? "Verifying..."
// //             : "Verify OTP"}
// //         </button>

// //         {/* RESEND */}

// //         {timer > 0 ? (
// //           <p style={styles.timer}>
// //             Resend OTP in {timer}s
// //           </p>
// //         ) : (
// //           <button
// //             onClick={resendOtp}
// //             style={styles.resend}
// //           >
// //             Resend OTP
// //           </button>
// //         )}

// //         {/* ERROR */}

// //         {error && (
// //           <p style={styles.error}>
// //             {error}
// //           </p>
// //         )}

// //       </div>

// //     </div>
// //   );
// // }

// // // =========================================================
// // // STYLES
// // // =========================================================

// // const styles = {
// //   container: {
// //     minHeight: "100vh",

// //     display: "flex",

// //     justifyContent: "center",

// //     alignItems: "center",

// //     background:
// //       "linear-gradient(135deg, #dff5dc, #bde7b8)",

// //     padding: "20px",

// //     boxSizing: "border-box",
// //   },

// //   card: {
// //     background:
// //       "rgba(255,255,255,0.96)",

// //     padding: "35px",

// //     borderRadius: "22px",

// //     width: "380px",

// //     maxWidth: "100%",

// //     textAlign: "center",

// //     boxShadow:
// //       "0 15px 40px rgba(0,0,0,0.15)",
// //   },

// //   otpContainer: {
// //     display: "flex",

// //     justifyContent: "center",

// //     gap: "9px",

// //     margin: "25px 0",
// //   },

// //   otpInput: {
// //     width: "45px",

// //     height: "52px",

// //     fontSize: "22px",

// //     fontWeight: "700",

// //     textAlign: "center",

// //     borderRadius: "10px",

// //     border:
// //       "2px solid #6bcb77",

// //     outline: "none",

// //     boxSizing: "border-box",
// //   },

// //   button: {
// //     width: "100%",

// //     padding: "13px",

// //     background: "#ff9f1c",

// //     color: "#fff",

// //     border: "none",

// //     borderRadius: "11px",

// //     cursor: "pointer",

// //     fontWeight: "700",

// //     fontSize: "16px",
// //   },

// //   resend: {
// //     marginTop: "12px",

// //     background: "none",

// //     border: "none",

// //     color: "#2d6a4f",

// //     cursor: "pointer",

// //     fontWeight: "700",

// //     fontSize: "14px",
// //   },

// //   timer: {
// //     marginTop: "12px",

// //     color: "#666",

// //     fontSize: "14px",
// //   },

// //   error: {
// //     marginTop: "12px",

// //     color: "#d62828",

// //     fontSize: "14px",

// //     lineHeight: "1.4",
// //   },
// // };




// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { auth, db } from "../firebase";

// import {
//   signInWithCustomToken,
//   getIdTokenResult,
// } from "firebase/auth";

// import {
//   doc,
//   getDoc,
//   setDoc,
// } from "firebase/firestore";

// import "../styles/OtpVerify.css";

// export default function OtpVerify() {
//   const navigate = useNavigate();

//   // =========================================================
//   // EMAIL
//   // =========================================================

//   const email = (
//     localStorage.getItem("loginEmail") || ""
//   )
//     .trim()
//     .toLowerCase();

//   // =========================================================
//   // STATE
//   // =========================================================

//   const [otp, setOtp] = useState(
//     new Array(6).fill("")
//   );

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(30);

//   const inputsRef = useRef([]);

//   // =========================================================
//   // RESEND TIMER
//   // =========================================================

//   useEffect(() => {
//     if (timer <= 0) {
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   // =========================================================
//   // OTP INPUT
//   // =========================================================

//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) {
//       return;
//     }

//     const newOtp = [...otp];

//     newOtp[index] = value;

//     setOtp(newOtp);

//     setError("");

//     if (value && index < 5) {
//       inputsRef.current[index + 1]?.focus();
//     }
//   };

//   // =========================================================
//   // BACKSPACE
//   // =========================================================

//   const handleKeyDown = (event, index) => {
//     if (
//       event.key === "Backspace" &&
//       !otp[index] &&
//       index > 0
//     ) {
//       inputsRef.current[index - 1]?.focus();
//     }
//   };

//   // =========================================================
//   // SAFE LOCAL STORAGE READER
//   // =========================================================

//   const getLocalStorageObject = (key) => {
//     try {
//       const value =
//         localStorage.getItem(key);

//       if (!value) {
//         return null;
//       }

//       return JSON.parse(value);
//     } catch (storageError) {
//       console.error(
//         `❌ Failed to parse ${key}:`,
//         storageError
//       );

//       return null;
//     }
//   };

//   // =========================================================
//   // VERIFY OTP
//   // =========================================================

//   const verifyOtp = async () => {
//     setError("");

//     const finalOtp = otp.join("");

//     // =======================================================
//     // VALIDATION
//     // =======================================================

//     if (!email) {
//       setError(
//         "Email not found. Please login again."
//       );

//       return;
//     }

//     if (finalOtp.length !== 6) {
//       setError(
//         "Please enter the complete OTP."
//       );

//       return;
//     }

//     setLoading(true);

//     try {
//       // =====================================================
//       // 1. VERIFY OTP WITH BACKEND
//       // =====================================================

//       const response = await fetch(
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

//       const data = await response.json();

//       console.log(
//         "🔐 OTP response:",
//         data
//       );

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Invalid OTP. Please try again."
//         );

//         return;
//       }

//       // =====================================================
//       // 2. FIREBASE CUSTOM TOKEN
//       // =====================================================

//       if (!data.customToken) {
//         setError(
//           "Firebase login token was not received."
//         );

//         return;
//       }

//       // =====================================================
//       // 3. FIREBASE LOGIN
//       // =====================================================

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

//       const uid =
//         firebaseUser.uid;

//       console.log(
//         "✅ Firebase login successful"
//       );

//       console.log(
//         "👤 Firebase UID:",
//         uid
//       );

//       // =====================================================
//       // 4. SAVE REAL FIREBASE UID
//       // =====================================================

//       localStorage.setItem(
//         "userId",
//         uid
//       );

//       // =====================================================
//       // 5. ADMIN CHECK
//       // =====================================================

//       let isAdmin = false;

//       try {
//         const tokenResult =
//           await getIdTokenResult(
//             firebaseUser,
//             true
//           );

//         isAdmin =
//           tokenResult.claims.admin === true;

//         console.log(
//           "👑 Admin:",
//           isAdmin
//         );
//       } catch (adminError) {
//         console.warn(
//           "⚠️ Admin check failed:",
//           adminError
//         );
//       }

//       // =====================================================
//       // 6. GET USER DOCUMENT
//       //
//       // IMPORTANT:
//       //
//       // We ONLY use:
//       //
//       // users/{firebaseUID}
//       //
//       // We DO NOT try:
//       //
//       // users/{email}
//       //
//       // because Firestore rules are UID based.
//       // =====================================================

//       const userRef = doc(
//         db,
//         "users",
//         uid
//       );

//       const userSnap =
//         await getDoc(userRef);

//       const userExists =
//         userSnap.exists();

//       const existingUser =
//         userExists
//           ? userSnap.data()
//           : null;

//       console.log(
//         "🔥 User exists:",
//         userExists
//       );

//       console.log(
//         "🔥 Existing Firebase data:",
//         existingUser
//       );

//       // =====================================================
//       // 7. PROFILE DATA
//       // =====================================================

//       let childProfile =
//         existingUser?.childProfile ||
//         null;

//       let parentProfile =
//         existingUser?.parentProfile ||
//         null;

//       let jungleFriend =
//         existingUser?.jungleFriend ||
//         null;

//       // =====================================================
//       // 8. BRAND NEW USER
//       //
//       // Only a brand-new Firebase user reads the registration
//       // information stored temporarily in localStorage.
//       // =====================================================

//       if (!userExists) {
//         console.log(
//           "🆕 NEW FIREBASE USER → reading registration data"
//         );

//         // ---------------------------------------------------
//         // CHILD PROFILE
//         // ---------------------------------------------------

//         const savedChild =
//           getLocalStorageObject(
//             "childProfile"
//           );

//         if (
//           savedChild &&
//           savedChild.name
//         ) {
//           childProfile = {
//             name: String(
//               savedChild.name
//             ).trim(),

//             age:
//               savedChild.age !== undefined &&
//               savedChild.age !== null
//                 ? String(savedChild.age)
//                 : "",

//             createdAt:
//               savedChild.createdAt ||
//               new Date().toISOString(),
//           };

//           console.log(
//             "👧 Registration child:",
//             childProfile
//           );
//         }

//         // ---------------------------------------------------
//         // PARENT PROFILE
//         // ---------------------------------------------------

//         const savedParent =
//           getLocalStorageObject(
//             "parentProfile"
//           ) ||
//           getLocalStorageObject(
//             "tempParent"
//           );

//         if (savedParent) {
//           parentProfile = {
//             parentName:
//               savedParent.parentName ||
//               "",

//             email:
//               savedParent.email ||
//               firebaseUser.email ||
//               email,
//           };

//           console.log(
//             "👨‍👩‍👧 Registration parent:",
//             parentProfile
//           );
//         }

//         // ---------------------------------------------------
//         // JUNGLE FRIEND
//         //
//         // New user must choose friend separately.
//         // ---------------------------------------------------

//         jungleFriend = null;

//         localStorage.removeItem(
//           "jungleFriend"
//         );

//         console.log(
//           "🦊 New user → friend will be selected later"
//         );
//       } else {
//         // ===================================================
//         // EXISTING USER
//         //
//         // Firebase is the only source of truth.
//         // ===================================================

//         console.log(
//           "✅ EXISTING USER → Firebase data only"
//         );

//         console.log(
//           "🚫 Ignoring temporary localStorage profile data"
//         );
//       }

//       // =====================================================
//       // 9. SAVE PROFILE TO UID DOCUMENT
//       // =====================================================

//       const profileData = {
//         uid,

//         email:
//           firebaseUser.email ||
//           email,

//         verified: true,

//         childProfile:
//           childProfile || null,

//         parentProfile:
//           parentProfile || null,

//         jungleFriend:
//           jungleFriend || null,

//         // Compatibility field
//         name:
//           childProfile?.name ||
//           existingUser?.name ||
//           "",

//         avatar:
//           existingUser?.avatar ||
//           "🐵",

//         createdAt:
//           existingUser?.createdAt ||
//           new Date().toISOString(),

//         lastLogin:
//           new Date().toISOString(),
//       };

//       await setDoc(
//         userRef,
//         profileData,
//         {
//           merge: true,
//         }
//       );

//       console.log(
//         "✅ User profile saved to UID document"
//       );

//       // =====================================================
//       // 10. READ FINAL FIREBASE DATA
//       // =====================================================

//       const latestUserSnap =
//         await getDoc(userRef);

//       const firebaseUserData =
//         latestUserSnap.exists()
//           ? latestUserSnap.data()
//           : {};

//       console.log(
//         "🔥 FINAL FIREBASE DATA:",
//         firebaseUserData
//       );

//       // =====================================================
//       // 11. UPDATE LOCAL STORAGE CACHE
//       //
//       // Firebase = source of truth
//       // localStorage = cache only
//       // =====================================================

//       // -----------------------------------------------------
//       // CHILD
//       // -----------------------------------------------------

//       if (
//         firebaseUserData.childProfile
//       ) {
//         localStorage.setItem(
//           "childProfile",
//           JSON.stringify(
//             firebaseUserData.childProfile
//           )
//         );
//       } else {
//         localStorage.removeItem(
//           "childProfile"
//         );
//       }

//       // -----------------------------------------------------
//       // PARENT
//       // -----------------------------------------------------

//       if (
//         firebaseUserData.parentProfile
//       ) {
//         localStorage.setItem(
//           "parentProfile",
//           JSON.stringify(
//             firebaseUserData.parentProfile
//           )
//         );
//       } else {
//         localStorage.removeItem(
//           "parentProfile"
//         );
//       }

//       // -----------------------------------------------------
//       // FRIEND
//       // -----------------------------------------------------

//       if (
//         firebaseUserData.jungleFriend
//       ) {
//         localStorage.setItem(
//           "jungleFriend",
//           JSON.stringify(
//             firebaseUserData.jungleFriend
//           )
//         );
//       } else {
//         localStorage.removeItem(
//           "jungleFriend"
//         );
//       }

//       // -----------------------------------------------------
//       // EMAIL
//       // -----------------------------------------------------

//       localStorage.setItem(
//         "loginEmail",
//         firebaseUserData.email ||
//           firebaseUser.email ||
//           email
//       );

//       // =====================================================
//       // 12. CREATE PROGRESS DOCUMENT IF NEEDED
//       // =====================================================

//       const progressRef = doc(
//         db,
//         "progress",
//         uid
//       );

//       const progressSnap =
//         await getDoc(progressRef);

//       if (!progressSnap.exists()) {
//         await setDoc(
//           progressRef,
//           {
//             userId: uid,
//             stars: 0,
//             streak: 0,
//             history: [],
//             activeGames: {},
//           }
//         );

//         console.log(
//           "🌱 Progress document created"
//         );
//       } else {
//         console.log(
//           "📊 Progress document already exists"
//         );
//       }

//       // =====================================================
//       // 13. CHECK PROFILE COMPLETION
//       // =====================================================

//       const hasChildProfile =
//         Boolean(
//           firebaseUserData
//             ?.childProfile
//             ?.name
//         ) &&
//         Boolean(
//           firebaseUserData
//             ?.childProfile
//             ?.age
//         );

//       const hasJungleFriend =
//         Boolean(
//           firebaseUserData
//             ?.jungleFriend
//             ?.name
//         );

//       console.log(
//         "👧 Child profile:",
//         firebaseUserData?.childProfile
//       );

//       console.log(
//         "🦊 Jungle friend:",
//         firebaseUserData?.jungleFriend
//       );

//       console.log(
//         "👧 Child profile complete:",
//         hasChildProfile
//       );

//       console.log(
//         "🦊 Friend selected:",
//         hasJungleFriend
//       );

//       // =====================================================
//       // 14. ADMIN
//       // =====================================================

//       if (isAdmin) {
//         console.log(
//           "👑 Admin → /admin"
//         );

//         navigate("/admin");

//         return;
//       }

//       // =====================================================
//       // 15. BRAND NEW USER
//       // =====================================================

//       if (!userExists) {
//         console.log(
//           "🆕 BRAND NEW USER → Choose Friend"
//         );

//         localStorage.setItem(
//           "appProgress",
//           "child-created"
//         );

//         localStorage.removeItem(
//           "jungleFriend"
//         );

//         navigate(
//           "/choose-friend"
//         );

//         return;
//       }

//       // =====================================================
//       // 16. EXISTING COMPLETE USER
//       // =====================================================

//       if (
//         hasChildProfile &&
//         hasJungleFriend
//       ) {
//         console.log(
//           "✅ EXISTING COMPLETE USER → Jungle Hero"
//         );

//         localStorage.setItem(
//           "appProgress",
//           "friend-chosen"
//         );

//         navigate(
//           "/jungle-hero"
//         );

//         return;
//       }

//       // =====================================================
//       // 17. EXISTING INCOMPLETE USER
//       // =====================================================

//       console.log(
//         "🆕 EXISTING INCOMPLETE USER → Choose Friend"
//       );

//       navigate(
//         "/choose-friend"
//       );

//     } catch (error) {
//       console.error(
//         "❌ OTP verification error:",
//         error
//       );

//       // Keep the useful Firebase error
//       // in the console, but show a cleaner
//       // message to the user.

//       if (
//         error?.code ===
//         "permission-denied"
//       ) {
//         setError(
//           "Firebase permission denied. Please check your Firestore rules."
//         );
//       } else {
//         setError(
//           error?.message ||
//             "Something went wrong. Please try again."
//         );
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // RESEND OTP
//   // =========================================================

//   const resendOtp = async () => {
//     setError("");

//     if (!email) {
//       setError(
//         "Email not found. Please login again."
//       );

//       return;
//     }

//     try {
//       const response =
//         await fetch(
//           "http://localhost:5000/api/send-otp",
//           {
//             method: "POST",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               email,
//             }),
//           }
//         );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Failed to resend OTP."
//         );

//         return;
//       }

//       setOtp(
//         new Array(6).fill("")
//       );

//       setTimer(30);

//       inputsRef.current[0]?.focus();

//       alert(
//         "OTP resent successfully 📧"
//       );

//     } catch (error) {
//       console.error(
//         "❌ Resend OTP error:",
//         error
//       );

//       setError(
//         "Failed to resend OTP."
//       );
//     }
//   };

//   // =========================================================
//   // UI ONLY
//   // =========================================================

//   return (
//     <div className="otp-page">

//       {/* Background overlay */}
//       <div className="otp-overlay"></div>

//       {/* =====================================================
//           BRAND
//       ===================================================== */}

//       <header className="otp-brand">

//         <div className="otp-brand-title">

//           <span className="otp-brand-curio">
//             Curio
//           </span>

//           <span className="otp-brand-kids">
//             Kids
//           </span>

//           <span className="otp-brand-sprout">
//             🌱
//           </span>

//         </div>

//         <div className="otp-brand-tagline">
//           Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
//         </div>

//       </header>

//       {/* =====================================================
//           DECORATIONS
//       ===================================================== */}

//       <div className="otp-leaf otp-leaf-one">
//         🍃
//       </div>

//       <div className="otp-leaf otp-leaf-two">
//         🌿
//       </div>

//       <div className="otp-leaf otp-leaf-three">
//         🍃
//       </div>

//       <div className="otp-butterfly">
//         🦋
//       </div>

//       <div className="otp-flower otp-flower-one">
//         🌺
//       </div>

//       <div className="otp-flower otp-flower-two">
//         🌸
//       </div>

//       {/* =====================================================
//           MAIN
//       ===================================================== */}

//       <main className="otp-main">

//         <div className="otp-card">

//           {/* =================================================
//               LOCK
//           ================================================= */}

//           <div className="otp-lock-area">

//             <span className="otp-lock-sprout">
//               🌱
//             </span>

//             <span className="otp-lock">
//               🔐
//             </span>

//           </div>

//           {/* =================================================
//               HEADING
//           ================================================= */}

//           <h1>
//             Verify Your Journey
//           </h1>

//           <p className="otp-subtitle">
//             Enter the code we sent to your email
//           </p>

//           {/* =================================================
//               EMAIL
//           ================================================= */}

//           <div className="otp-email-box">

//             <span className="otp-email-icon">
//               ✉️
//             </span>

//             <div className="otp-email-content">

//               <small>
//                 Verification code sent to
//               </small>

//               <strong>
//                 {email || "your email"}
//               </strong>

//             </div>

//           </div>

//           {/* =================================================
//               OTP INPUTS
//           ================================================= */}

//           <div className="otp-input-container">

//             {otp.map(
//               (digit, index) => (
//                 <input
//                   key={index}

//                   ref={(element) => {
//                     inputsRef.current[index] =
//                       element;
//                   }}

//                   className={
//                     `otp-box ${
//                       digit
//                         ? "otp-box-filled"
//                         : ""
//                     }`
//                   }

//                   type="text"

//                   inputMode="numeric"

//                   maxLength={1}

//                   value={digit}

//                   onChange={(event) =>
//                     handleChange(
//                       event.target.value,
//                       index
//                     )
//                   }

//                   onKeyDown={(event) =>
//                     handleKeyDown(
//                       event,
//                       index
//                     )
//                   }

//                   autoComplete={
//                     index === 0
//                       ? "one-time-code"
//                       : "off"
//                   }
//                 />
//               )
//             )}

//           </div>

//           {/* =================================================
//               ERROR
//           ================================================= */}

//           {error && (
//             <div className="otp-error">
//               ⚠️ {error}
//             </div>
//           )}

//           {/* =================================================
//               VERIFY
//           ================================================= */}

//           <button
//             className="verify-otp-button"
//             onClick={verifyOtp}
//             disabled={loading}
//           >

//             <span>
//               🌿
//             </span>

//             {loading
//               ? "Verifying..."
//               : "Verify OTP"}

//           </button>

//           {/* =================================================
//               RESEND
//           ================================================= */}

//           <div className="otp-resend-area">

//             {timer > 0 ? (
//               <>
//                 <span className="resend-label">
//                   Didn’t receive the code?
//                 </span>

//                 <span className="resend-timer">
//                   Resend OTP in {timer}s
//                 </span>
//               </>
//             ) : (
//               <button
//                 onClick={resendOtp}
//                 className="resend-button"
//               >
//                 🔄 Resend OTP
//               </button>
//             )}

//           </div>

//           {/* =================================================
//               SECURITY NOTE
//           ================================================= */}

//           <div className="otp-security">
//             🔐 Your verification is secure and private
//           </div>

//         </div>

//       </main>

//       {/* =====================================================
//           CHATBOT
//       ===================================================== */}

//       <button
//         className="otp-chatbot"
//         type="button"
//         aria-label="CurioKids assistant"
//       >
//         🤖
//       </button>

//     </div>
//   );
// }







import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";



import { auth, db } from "../firebase";



import {

  signInWithCustomToken,

  getIdTokenResult,

} from "firebase/auth";



import {

  doc,

  getDoc,

  setDoc,

} from "firebase/firestore";



import "../styles/OtpVerify.css";

const API_URL = import.meta.env.VITE_API_URL;



export default function OtpVerify() {

  const navigate = useNavigate();



  // =========================================================

  // EMAIL

  // =========================================================



  const email = (

    localStorage.getItem("loginEmail") || ""

  )

    .trim()

    .toLowerCase();



  // =========================================================

  // STATE

  // =========================================================



  const [otp, setOtp] = useState(

    new Array(6).fill("")

  );



  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);



  const inputsRef = useRef([]);



  // =========================================================

  // RESEND TIMER

  // =========================================================



  useEffect(() => {

    if (timer <= 0) {

      return;

    }



    const interval = setInterval(() => {

      setTimer((prev) => prev - 1);

    }, 1000);



    return () => clearInterval(interval);

  }, [timer]);



  // =========================================================

  // OTP INPUT

  // =========================================================



  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value)) {

      return;

    }



    const newOtp = [...otp];



    newOtp[index] = value;



    setOtp(newOtp);



    setError("");



    if (value && index < 5) {

      inputsRef.current[index + 1]?.focus();

    }

  };



  // =========================================================

  // BACKSPACE

  // =========================================================



  const handleKeyDown = (event, index) => {

    if (

      event.key === "Backspace" &&

      !otp[index] &&

      index > 0

    ) {

      inputsRef.current[index - 1]?.focus();

    }

  };



  // =========================================================

  // SAFE LOCAL STORAGE READER

  // =========================================================



  const getLocalStorageObject = (key) => {

    try {

      const value =

        localStorage.getItem(key);



      if (!value) {

        return null;

      }



      return JSON.parse(value);

    } catch (storageError) {

      console.error(

        `❌ Failed to parse ${key}:`,

        storageError

      );



      return null;

    }

  };



  // =========================================================

  // VERIFY OTP

  // =========================================================



  const verifyOtp = async () => {

    setError("");



    const finalOtp = otp.join("");



    // =======================================================

    // VALIDATION

    // =======================================================



    if (!email) {

      setError(

        "Email not found. Please login again."

      );



      return;

    }



    if (finalOtp.length !== 6) {

      setError(

        "Please enter the complete OTP."

      );



      return;

    }



    setLoading(true);



    try {

      // =====================================================

      // 1. VERIFY OTP WITH BACKEND

      // =====================================================



      const response = await fetch(

        `${import.meta.env.VITE_API_URL}/api/verify-otp`,

        {

          method: "POST",



          headers: {

            "Content-Type": "application/json",

          },



          body: JSON.stringify({

            email,

            otp: finalOtp,

          }),

        }

      );



      const data = await response.json();



      console.log(

        "🔐 OTP response:",

        data

      );



      if (!response.ok) {

        setError(

          data.message ||

            "Invalid OTP. Please try again."

        );



        return;

      }



      // =====================================================

      // 2. FIREBASE CUSTOM TOKEN

      // =====================================================



      if (!data.customToken) {

        setError(

          "Firebase login token was not received."

        );



        return;

      }



      // =====================================================

      // 3. FIREBASE LOGIN

      // =====================================================



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



      const uid =

        firebaseUser.uid;



      console.log(

        "✅ Firebase login successful"

      );



      console.log(

        "👤 Firebase UID:",

        uid

      );



      // =====================================================

      // 4. SAVE REAL FIREBASE UID

      // =====================================================



      localStorage.setItem(

        "userId",

        uid

      );



      // =====================================================

      // 5. ADMIN CHECK

      // =====================================================



      let isAdmin = false;



      try {

        const tokenResult =

          await getIdTokenResult(

            firebaseUser,

            true

          );



        isAdmin =

          tokenResult.claims.admin === true;



        console.log(

          "👑 Admin:",

          isAdmin

        );

      } catch (adminError) {

        console.warn(

          "⚠️ Admin check failed:",

          adminError

        );

      }



      // =====================================================

      // 6. GET USER DOCUMENT

      //

      // IMPORTANT:

      //

      // We ONLY use:

      //

      // users/{firebaseUID}

      //

      // We DO NOT try:

      //

      // users/{email}

      //

      // because Firestore rules are UID based.

      // =====================================================



      const userRef = doc(

        db,

        "users",

        uid

      );



      const userSnap =

        await getDoc(userRef);



      const userExists =

        userSnap.exists();



      const existingUser =

        userExists

          ? userSnap.data()

          : null;



      console.log(

        "🔥 User exists:",

        userExists

      );



      console.log(

        "🔥 Existing Firebase data:",

        existingUser

      );



      // =====================================================

      // 7. PROFILE DATA

      // =====================================================



      let childProfile =

        existingUser?.childProfile ||

        null;



      let parentProfile =

        existingUser?.parentProfile ||

        null;



      let jungleFriend =

        existingUser?.jungleFriend ||

        null;



      // =====================================================

      // 8. BRAND NEW USER

      //

      // Only a brand-new Firebase user reads the registration

      // information stored temporarily in localStorage.

      // =====================================================



      if (!userExists) {

        console.log(

          "🆕 NEW FIREBASE USER → reading registration data"

        );



        // ---------------------------------------------------

        // CHILD PROFILE

        // ---------------------------------------------------



        const savedChild =

          getLocalStorageObject(

            "childProfile"

          );



        if (

          savedChild &&

          savedChild.name

        ) {

          childProfile = {

            name: String(

              savedChild.name

            ).trim(),



            age:

              savedChild.age !== undefined &&

              savedChild.age !== null

                ? String(savedChild.age)

                : "",



            createdAt:

              savedChild.createdAt ||

              new Date().toISOString(),

          };



          console.log(

            "👧 Registration child:",

            childProfile

          );

        }



        // ---------------------------------------------------

        // PARENT PROFILE

        // ---------------------------------------------------



        const savedParent =

          getLocalStorageObject(

            "parentProfile"

          ) ||

          getLocalStorageObject(

            "tempParent"

          );



        if (savedParent) {

          parentProfile = {

            parentName:

              savedParent.parentName ||

              "",



            email:

              savedParent.email ||

              firebaseUser.email ||

              email,

          };



          console.log(

            "👨‍👩‍👧 Registration parent:",

            parentProfile

          );

        }



        // ---------------------------------------------------

        // JUNGLE FRIEND

        //

        // New user must choose friend separately.

        // ---------------------------------------------------



        jungleFriend = null;



        localStorage.removeItem(

          "jungleFriend"

        );



        console.log(

          "🦊 New user → friend will be selected later"

        );

      } else {

        // ===================================================

        // EXISTING USER

        //

        // Firebase is the only source of truth.

        // ===================================================



        console.log(

          "✅ EXISTING USER → Firebase data only"

        );



        console.log(

          "🚫 Ignoring temporary localStorage profile data"

        );

      }



      // =====================================================

      // 9. SAVE PROFILE TO UID DOCUMENT

      // =====================================================



      const profileData = {

        uid,



        email:

          firebaseUser.email ||

          email,



        verified: true,



        childProfile:

          childProfile || null,



        parentProfile:

          parentProfile || null,



        jungleFriend:

          jungleFriend || null,



        // Compatibility field

        name:

          childProfile?.name ||

          existingUser?.name ||

          "",



        avatar:

          existingUser?.avatar ||

          "🐵",



        createdAt:

          existingUser?.createdAt ||

          new Date().toISOString(),



        lastLogin:

          new Date().toISOString(),

      };



      await setDoc(

        userRef,

        profileData,

        {

          merge: true,

        }

      );



      console.log(

        "✅ User profile saved to UID document"

      );



      // =====================================================

      // 10. READ FINAL FIREBASE DATA

      // =====================================================



      const latestUserSnap =

        await getDoc(userRef);



      const firebaseUserData =

        latestUserSnap.exists()

          ? latestUserSnap.data()

          : {};



      console.log(

        "🔥 FINAL FIREBASE DATA:",

        firebaseUserData

      );



      // =====================================================

      // 11. UPDATE LOCAL STORAGE CACHE

      //

      // Firebase = source of truth

      // localStorage = cache only

      // =====================================================



      // -----------------------------------------------------

      // CHILD

      // -----------------------------------------------------



      if (

        firebaseUserData.childProfile

      ) {

        localStorage.setItem(

          "childProfile",

          JSON.stringify(

            firebaseUserData.childProfile

          )

        );

      } else {

        localStorage.removeItem(

          "childProfile"

        );

      }



      // -----------------------------------------------------

      // PARENT

      // -----------------------------------------------------



      if (

        firebaseUserData.parentProfile

      ) {

        localStorage.setItem(

          "parentProfile",

          JSON.stringify(

            firebaseUserData.parentProfile

          )

        );

      } else {

        localStorage.removeItem(

          "parentProfile"

        );

      }



      // -----------------------------------------------------

      // FRIEND

      // -----------------------------------------------------



      if (

        firebaseUserData.jungleFriend

      ) {

        localStorage.setItem(

          "jungleFriend",

          JSON.stringify(

            firebaseUserData.jungleFriend

          )

        );

      } else {

        localStorage.removeItem(

          "jungleFriend"

        );

      }



      // -----------------------------------------------------

      // EMAIL

      // -----------------------------------------------------



      localStorage.setItem(

        "loginEmail",

        firebaseUserData.email ||

          firebaseUser.email ||

          email

      );



      // =====================================================

      // 12. CREATE PROGRESS DOCUMENT IF NEEDED

      // =====================================================



      const progressRef = doc(

        db,

        "progress",

        uid

      );



      const progressSnap =

        await getDoc(progressRef);



      if (!progressSnap.exists()) {

        await setDoc(

          progressRef,

          {

            userId: uid,

            stars: 0,

            streak: 0,

            history: [],

            activeGames: {},

          }

        );



        console.log(

          "🌱 Progress document created"

        );

      } else {

        console.log(

          "📊 Progress document already exists"

        );

      }



      // =====================================================

      // 13. CHECK PROFILE COMPLETION

      // =====================================================



      const hasChildProfile =

        Boolean(

          firebaseUserData

            ?.childProfile

            ?.name

        ) &&

        Boolean(

          firebaseUserData

            ?.childProfile

            ?.age

        );



      const hasJungleFriend =

        Boolean(

          firebaseUserData

            ?.jungleFriend

            ?.name

        );



      console.log(

        "👧 Child profile:",

        firebaseUserData?.childProfile

      );



      console.log(

        "🦊 Jungle friend:",

        firebaseUserData?.jungleFriend

      );



      console.log(

        "👧 Child profile complete:",

        hasChildProfile

      );



      console.log(

        "🦊 Friend selected:",

        hasJungleFriend

      );



      // =====================================================

      // 14. ADMIN

      // =====================================================



      if (isAdmin) {

        console.log(

          "👑 Admin → /admin"

        );



        navigate("/admin");



        return;

      }



      // =====================================================

      // 15. BRAND NEW USER

      // =====================================================



      if (!userExists) {

        console.log(

          "🆕 BRAND NEW USER → Choose Friend"

        );



        localStorage.setItem(

          "appProgress",

          "child-created"

        );



        localStorage.removeItem(

          "jungleFriend"

        );



        navigate(

          "/choose-friend"

        );



        return;

      }



      // =====================================================

      // 16. EXISTING COMPLETE USER

      // =====================================================



      if (

        hasChildProfile &&

        hasJungleFriend

      ) {

        console.log(

          "✅ EXISTING COMPLETE USER → Jungle Hero"

        );



        localStorage.setItem(

          "appProgress",

          "friend-chosen"

        );



        navigate(

          "/jungle-hero"

        );



        return;

      }



      // =====================================================

      // 17. EXISTING INCOMPLETE USER

      // =====================================================



      console.log(

        "🆕 EXISTING INCOMPLETE USER → Choose Friend"

      );



      navigate(

        "/choose-friend"

      );



    } catch (error) {

      console.error(

        "❌ OTP verification error:",

        error

      );



      // Keep the useful Firebase error

      // in the console, but show a cleaner

      // message to the user.



      if (

        error?.code ===

        "permission-denied"

      ) {

        setError(

          "Firebase permission denied. Please check your Firestore rules."

        );

      } else {

        setError(

          error?.message ||

            "Something went wrong. Please try again."

        );

      }



    } finally {

      setLoading(false);

    }

  };



  // =========================================================

  // RESEND OTP

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

      const response =

        await fetch(

          `${import.meta.env.VITE_API_URL}/api/send-otp`,

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



      const data =

        await response.json();



      if (!response.ok) {

        setError(

          data.message ||

            "Failed to resend OTP."

        );



        return;

      }



      setOtp(

        new Array(6).fill("")

      );



      setTimer(30);



      inputsRef.current[0]?.focus();



      alert(

        "OTP resent successfully 📧"

      );



    } catch (error) {

      console.error(

        "❌ Resend OTP error:",

        error

      );



      setError(

        "Failed to resend OTP."

      );

    }

  };



  // =========================================================

  // UI ONLY

  // =========================================================



  return (

    <div className="otp-page">



      {/* Background overlay */}

      <div className="otp-overlay"></div>



      {/* =====================================================

          BRAND

      ===================================================== */}



      <header className="otp-brand">



        <div className="otp-brand-title">



          <span className="otp-brand-curio">

            Curio

          </span>



          <span className="otp-brand-kids">

            Kids

          </span>



          <span className="otp-brand-sprout">

            🌱

          </span>



        </div>



        <div className="otp-brand-tagline">

          Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow

        </div>



      </header>



      {/* =====================================================

          DECORATIONS

      ===================================================== */}



      <div className="otp-leaf otp-leaf-one">

        🍃

      </div>



      <div className="otp-leaf otp-leaf-two">

        🌿

      </div>



      <div className="otp-leaf otp-leaf-three">

        🍃

      </div>



      <div className="otp-butterfly">

        🦋

      </div>



      <div className="otp-flower otp-flower-one">

        🌺

      </div>



      <div className="otp-flower otp-flower-two">

        🌸

      </div>



      {/* =====================================================

          MAIN

      ===================================================== */}



      <main className="otp-main">



        <div className="otp-card">



          {/* =================================================

              LOCK

          ================================================= */}



          <div className="otp-lock-area">



            <span className="otp-lock-sprout">

              🌱

            </span>



            <span className="otp-lock">

              🔐

            </span>



          </div>



          {/* =================================================

              HEADING

          ================================================= */}



          <h1>

            Verify Your Journey

          </h1>



          <p className="otp-subtitle">

            Enter the code we sent to your email

          </p>



          {/* =================================================

              EMAIL

          ================================================= */}



          <div className="otp-email-box">



            <span className="otp-email-icon">

              ✉️

            </span>



            <div className="otp-email-content">



              <small>

                Verification code sent to

              </small>



              <strong>

                {email || "your email"}

              </strong>



            </div>



          </div>



          {/* =================================================

              OTP INPUTS

          ================================================= */}



          <div className="otp-input-container">



            {otp.map(

              (digit, index) => (

                <input

                  key={index}



                  ref={(element) => {

                    inputsRef.current[index] =

                      element;

                  }}



                  className={

                    `otp-box ${

                      digit

                        ? "otp-box-filled"

                        : ""

                    }`

                  }



                  type="text"



                  inputMode="numeric"



                  maxLength={1}



                  value={digit}



                  onChange={(event) =>

                    handleChange(

                      event.target.value,

                      index

                    )

                  }



                  onKeyDown={(event) =>

                    handleKeyDown(

                      event,

                      index

                    )

                  }



                  autoComplete={

                    index === 0

                      ? "one-time-code"

                      : "off"

                  }

                />

              )

            )}



          </div>



          {/* =================================================

              ERROR

          ================================================= */}



          {error && (

            <div className="otp-error">

              ⚠️ {error}

            </div>

          )}



          {/* =================================================

              VERIFY

          ================================================= */}



          <button

            className="verify-otp-button"

            onClick={verifyOtp}

            disabled={loading}

          >



            <span>

              🌿

            </span>



            {loading

              ? "Verifying..."

              : "Verify OTP"}



          </button>



          {/* =================================================

              RESEND

          ================================================= */}



          <div className="otp-resend-area">



            {timer > 0 ? (

              <>

                <span className="resend-label">

                  Didn’t receive the code?

                </span>



                <span className="resend-timer">

                  Resend OTP in {timer}s

                </span>

              </>

            ) : (

              <button

                onClick={resendOtp}

                className="resend-button"

              >

                🔄 Resend OTP

              </button>

            )}



          </div>



          {/* =================================================

              SECURITY NOTE

          ================================================= */}



          <div className="otp-security">

            🔐 Your verification is secure and private

          </div>



        </div>



      </main>



      {/* =====================================================

          CHATBOT

      ===================================================== */}



      <button

        className="otp-chatbot"

        type="button"

        aria-label="CurioKids assistant"

      >

        🤖

      </button>



    </div>

  );

}
