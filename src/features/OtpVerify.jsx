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

// //   const email =
// //     localStorage.getItem("loginEmail");

// //   const [otp, setOtp] = useState(
// //     new Array(6).fill("")
// //   );

// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [timer, setTimer] = useState(30);

// //   const inputsRef = useRef([]);

// //   // =========================================================
// //   // TIMER
// //   // =========================================================

// //   useEffect(() => {
// //     if (timer <= 0) return;

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
// //   // VERIFY OTP
// //   // =========================================================

// //   const verifyOtp = async () => {
// //     setError("");

// //     const finalOtp = otp.join("");

// //     if (!email) {
// //       setError(
// //         "Email not found. Please login again."
// //       );
// //       return;
// //     }

// //     if (finalOtp.length !== 6) {
// //       setError("Please enter the complete OTP.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       // =======================================================
// //       // 1. VERIFY OTP WITH BACKEND
// //       // =======================================================

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

// //       if (!data.customToken) {
// //         setError(
// //           "Firebase login token was not received."
// //         );
// //         return;
// //       }

// //       // =======================================================
// //       // 2. FIREBASE LOGIN
// //       // =======================================================

// //       const userCredential =
// //         await signInWithCustomToken(
// //           auth,
// //           data.customToken
// //         );

// //       const firebaseUser =
// //         userCredential.user;

// //       const uid = firebaseUser.uid;

// //       console.log(
// //         "✅ Firebase login successful"
// //       );

// //       console.log(
// //         "👤 Firebase UID:",
// //         uid
// //       );

// //       // =======================================================
// //       // 3. ADMIN CHECK
// //       // =======================================================

// //       const tokenResult =
// //         await getIdTokenResult(
// //           firebaseUser,
// //           true
// //         );

// //       const isAdmin =
// //         tokenResult.claims.admin === true;

// //       console.log(
// //         "👑 Admin:",
// //         isAdmin
// //       );

// //       // =======================================================
// //       // 4. SAVE CURRENT USER ID
// //       // =======================================================

// //       localStorage.setItem(
// //         "userId",
// //         uid
// //       );

// //       // =======================================================
// //       // 5. GET THIS USER'S FIREBASE DOCUMENT
// //       // =======================================================

// //       const userRef = doc(
// //         db,
// //         "users",
// //         uid
// //       );

// //       const userSnap =
// //         await getDoc(userRef);

// //       const existingUser =
// //         userSnap.exists()
// //           ? userSnap.data()
// //           : null;

// //       console.log(
// //         "🔥 Firebase user exists:",
// //         userSnap.exists()
// //       );

// //       console.log(
// //         "🔥 Existing Firebase data:",
// //         existingUser
// //       );

// //       // =======================================================
// //       // 🚨 IMPORTANT SECURITY RULE
// //       //
// //       // EXISTING USER:
// //       //     Firebase ONLY
// //       //
// //       // NEW USER:
// //       //     Registration localStorage → Firebase
// //       //
// //       // This prevents YOUR localStorage data from being
// //       // copied into your friend's account.
// //       // =======================================================

// //       let childProfile =
// //         existingUser?.childProfile || null;

// //       let parentProfile =
// //         existingUser?.parentProfile || null;

// //       let jungleFriend =
// //         existingUser?.jungleFriend || null;

// //       // =======================================================
// //       // 🆕 NEW USER ONLY
// //       // =======================================================

// //       if (!userSnap.exists()) {
// //         console.log(
// //           "🆕 NEW USER → reading registration data"
// //         );

// //         // -----------------------------------------------------
// //         // CHILD
// //         // -----------------------------------------------------

// //         const savedChild =
// //           localStorage.getItem(
// //             "childProfile"
// //           );

// //         if (savedChild) {
// //           try {
// //             const childData =
// //               JSON.parse(savedChild);

// //             if (childData?.name) {
// //               childProfile = {
// //                 name:
// //                   childData.name.trim(),

// //                 age:
// //                   childData.age || "",

// //                 createdAt:
// //                   childData.createdAt ||
// //                   new Date().toISOString(),
// //               };
// //             }
// //           } catch (error) {
// //             console.error(
// //               "❌ Child profile parse error:",
// //               error
// //             );
// //           }
// //         }

// //         // -----------------------------------------------------
// //         // PARENT
// //         // -----------------------------------------------------

// //         const savedParent =
// //           localStorage.getItem(
// //             "parentProfile"
// //           ) ||
// //           localStorage.getItem(
// //             "tempParent"
// //           );

// //         if (savedParent) {
// //           try {
// //             const parentData =
// //               JSON.parse(savedParent);

// //             parentProfile = {
// //               parentName:
// //                 parentData.parentName ||
// //                 "",

// //               email:
// //                 parentData.email ||
// //                 firebaseUser.email ||
// //                 email,

// //               timeLimit:
// //                 parentData.timeLimit ||
// //                 "",
// //             };
// //           } catch (error) {
// //             console.error(
// //               "❌ Parent profile parse error:",
// //               error
// //             );
// //           }
// //         }

// //         // -----------------------------------------------------
// //         // FRIEND
// //         // -----------------------------------------------------

// //         const savedFriend =
// //           localStorage.getItem(
// //             "jungleFriend"
// //           );

// //         if (savedFriend) {
// //           try {
// //             const friendData =
// //               JSON.parse(savedFriend);

// //             if (friendData?.name) {
// //               jungleFriend = {
// //                 id:
// //                   friendData.id || "",

// //                 name:
// //                   friendData.name,

// //                 image:
// //                   friendData.image || "",
// //               };
// //             }
// //           } catch (error) {
// //             console.error(
// //               "❌ Jungle friend parse error:",
// //               error
// //             );
// //           }
// //         }
// //       } else {
// //         // =====================================================
// //         // 🔥 EXISTING USER
// //         //
// //         // NEVER use localStorage profile data here.
// //         // Firebase is the source of truth.
// //         // =====================================================

// //         console.log(
// //           "✅ EXISTING USER → Firebase data only"
// //         );
// //       }

// //       // =======================================================
// //       // 6. SAVE USER PROFILE
// //       // =======================================================

// //       await setDoc(
// //         userRef,
// //         {
// //           uid,

// //           email:
// //             firebaseUser.email ||
// //             email,

// //           verified: true,

// //           childProfile,

// //           parentProfile,

// //           jungleFriend,

// //           // Compatibility field
// //           name:
// //             childProfile?.name ||
// //             existingUser?.name ||
// //             "",

// //           avatar:
// //             existingUser?.avatar ||
// //             "🐵",

// //           createdAt:
// //             existingUser?.createdAt ||
// //             new Date().toISOString(),

// //           lastLogin:
// //             new Date().toISOString(),
// //         },
// //         {
// //           merge: true,
// //         }
// //       );

// //       console.log(
// //         "✅ User profile saved to Firebase"
// //       );

// //       // =======================================================
// //       // 7. READ FIREBASE AGAIN
// //       // =======================================================

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

// //       // =======================================================
// //       // 8. UPDATE LOCAL STORAGE FROM FIREBASE
// //       //
// //       // This is only a CACHE.
// //       // Firebase remains the source of truth.
// //       // =======================================================

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

// //       // =======================================================
// //       // 9. CREATE PROGRESS IF NEEDED
// //       // =======================================================

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
// //             stars: 0,
// //             streak: 0,
// //             history: [],
// //             activeGames: {},
// //           }
// //         );

// //         console.log(
// //           "🌱 Progress created"
// //         );
// //       }

// //       // =======================================================
// //       // 10. CHECK PROFILE COMPLETION
// //       // =======================================================

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
// //         "👧 Child:",
// //         firebaseUserData
// //           ?.childProfile
// //       );

// //       console.log(
// //         "🦊 Friend:",
// //         firebaseUserData
// //           ?.jungleFriend
// //       );

// //       console.log(
// //         "👧 Child profile complete:",
// //         hasChildProfile
// //       );

// //       console.log(
// //         "🦊 Friend selected:",
// //         hasJungleFriend
// //       );

// //       // =======================================================
// //       // 11. ADMIN
// //       // =======================================================

// //       if (isAdmin) {
// //         console.log(
// //           "👑 Admin → /admin"
// //         );

// //         navigate("/admin");
// //         return;
// //       }

// //       // =======================================================
// //       // 12. EXISTING / COMPLETED USER
// //       // =======================================================

// //       if (
// //         hasChildProfile &&
// //         hasJungleFriend
// //       ) {
// //         console.log(
// //           "✅ Complete user → Jungle Hero"
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

// //       // =======================================================
// //       // 13. INCOMPLETE USER
// //       // =======================================================

// //       console.log(
// //         "🆕 Profile incomplete → Choose Friend"
// //       );

// //       navigate(
// //         "/choose-friend"
// //       );

// //     } catch (error) {
// //       console.error(
// //         "❌ OTP verification error:",
// //         error
// //       );

// //       setError(
// //         error?.message ||
// //           "Something went wrong. Please try again."
// //       );
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
// //       const response = await fetch(
// //         "http://localhost:5000/api/send-otp",
// //         {
// //           method: "POST",

// //           headers: {
// //             "Content-Type":
// //               "application/json",
// //           },

// //           body: JSON.stringify({
// //             email,
// //           }),
// //         }
// //       );

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

// //         <h2>🔐 Enter OTP</h2>

// //         <p>
// //           Sent to {email}
// //         </p>

// //         <div style={styles.otpContainer}>
// //           {otp.map(
// //             (digit, index) => (
// //               <input
// //                 key={index}
// //                 ref={(element) => {
// //                   inputsRef.current[
// //                     index
// //                   ] = element;
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
// //                 style={styles.otpInput}
// //                 autoComplete="one-time-code"
// //               />
// //             )
// //           )}
// //         </div>

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

// //     margin:
// //       "25px 0",
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

// //     background:
// //       "#ff9f1c",

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

// export default function OtpVerify() {
//   const navigate = useNavigate();

//   // =========================================================
//   // EMAIL
//   // =========================================================

//   const email = localStorage.getItem("loginEmail");

//   // =========================================================
//   // STATE
//   // =========================================================

//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(30);

//   const inputsRef = useRef([]);

//   // =========================================================
//   // TIMER
//   // =========================================================

//   useEffect(() => {
//     if (timer <= 0) return;

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
//   // SAFE JSON PARSER
//   // =========================================================

//   const getLocalStorageObject = (key) => {
//     try {
//       const value = localStorage.getItem(key);

//       if (!value) {
//         return null;
//       }

//       return JSON.parse(value);
//     } catch (error) {
//       console.error(`❌ Failed to parse ${key}:`, error);
//       return null;
//     }
//   };

//   // =========================================================
//   // VERIFY OTP
//   // =========================================================

//   const verifyOtp = async () => {
//     setError("");

//     const finalOtp = otp.join("");

//     // ---------------------------------------------------------
//     // VALIDATION
//     // ---------------------------------------------------------

//     if (!email) {
//       setError("Email not found. Please login again.");
//       return;
//     }

//     if (finalOtp.length !== 6) {
//       setError("Please enter the complete OTP.");
//       return;
//     }

//     setLoading(true);

//     try {
//       // =======================================================
//       // 1. VERIFY OTP WITH BACKEND
//       // =======================================================

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

//       console.log("🔐 OTP response:", data);

//       if (!response.ok) {
//         setError(
//           data.message ||
//             "Invalid OTP. Please try again."
//         );
//         return;
//       }

//       if (!data.customToken) {
//         setError(
//           "Firebase login token was not received."
//         );
//         return;
//       }

//       // =======================================================
//       // 2. FIREBASE LOGIN
//       // =======================================================

//       const userCredential =
//         await signInWithCustomToken(
//           auth,
//           data.customToken
//         );

//       const firebaseUser =
//         userCredential.user;

//       const uid = firebaseUser.uid;

//       console.log(
//         "✅ Firebase login successful"
//       );

//       console.log(
//         "👤 Firebase UID:",
//         uid
//       );

//       // =======================================================
//       // 3. SAVE CURRENT USER ID
//       // =======================================================

//       localStorage.setItem(
//         "userId",
//         uid
//       );

//       // =======================================================
//       // 4. ADMIN CHECK
//       // =======================================================

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

//       // =======================================================
//       // 5. GET THIS USER'S FIREBASE DOCUMENT
//       // =======================================================

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
//         "🔥 Firebase user exists:",
//         userExists
//       );

//       console.log(
//         "🔥 Existing Firebase data:",
//         existingUser
//       );

//       // =======================================================
//       // 6. PROFILE DATA
//       //
//       // EXISTING USER:
//       // Firebase ONLY
//       //
//       // NEW USER:
//       // Registration localStorage → Firebase
//       // =======================================================

//       let childProfile =
//         existingUser?.childProfile || null;

//       let parentProfile =
//         existingUser?.parentProfile || null;

//       let jungleFriend =
//         existingUser?.jungleFriend || null;

//       // =======================================================
//       // NEW USER ONLY
//       // =======================================================

//       if (!userExists) {
//         console.log(
//           "🆕 NEW FIREBASE USER → reading registration data"
//         );

//         // -----------------------------------------------------
//         // CHILD PROFILE
//         // -----------------------------------------------------

//         const savedChild =
//           getLocalStorageObject(
//             "childProfile"
//           );

//         if (
//           savedChild &&
//           savedChild.name
//         ) {
//           childProfile = {
//             name:
//               String(
//                 savedChild.name
//               ).trim(),

//             age:
//               savedChild.age || "",

//             createdAt:
//               savedChild.createdAt ||
//               new Date().toISOString(),
//           };

//           console.log(
//             "👧 Registration child:",
//             childProfile
//           );
//         }

//         // -----------------------------------------------------
//         // PARENT PROFILE
//         // -----------------------------------------------------

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

//             timeLimit:
//               savedParent.timeLimit ||
//               "",
//           };

//           console.log(
//             "👨‍👩‍👧 Registration parent:",
//             parentProfile
//           );
//         }

//         // -----------------------------------------------------
//         // JUNGLE FRIEND
//         // -----------------------------------------------------

//         const savedFriend =
//           getLocalStorageObject(
//             "jungleFriend"
//           );

//         if (
//           savedFriend &&
//           savedFriend.name
//         ) {
//           jungleFriend = {
//             id:
//               savedFriend.id || "",

//             name:
//               savedFriend.name,

//             image:
//               savedFriend.image || "",
//           };

//           console.log(
//             "🦊 Registration friend:",
//             jungleFriend
//           );
//         }
//       } else {
//         // =====================================================
//         // EXISTING USER
//         // =====================================================

//         console.log(
//           "✅ EXISTING USER → Firebase data ONLY"
//         );

//         console.log(
//           "🚫 Ignoring old localStorage profile data"
//         );
//       }

//       // =======================================================
//       // 7. SAVE USER PROFILE TO FIREBASE
//       // =======================================================

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
//         "✅ User profile saved to Firebase"
//       );

//       // =======================================================
//       // 8. READ FIREBASE AGAIN
//       //
//       // IMPORTANT:
//       // NEVER USE THE OLD userSnap AFTER setDoc()
//       // =======================================================

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

//       // =======================================================
//       // 9. UPDATE LOCAL STORAGE FROM FIREBASE
//       //
//       // Firebase = SOURCE OF TRUTH
//       // localStorage = CACHE ONLY
//       // =======================================================

//       // -------------------------------------------------------
//       // CHILD
//       // -------------------------------------------------------

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

//       // -------------------------------------------------------
//       // PARENT
//       // -------------------------------------------------------

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

//       // -------------------------------------------------------
//       // FRIEND
//       // -------------------------------------------------------

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

//       // -------------------------------------------------------
//       // EMAIL
//       // -------------------------------------------------------

//       localStorage.setItem(
//         "loginEmail",
//         firebaseUserData.email ||
//           firebaseUser.email ||
//           email
//       );

//       // =======================================================
//       // 10. CREATE PROGRESS DOCUMENT IF NEEDED
//       // =======================================================

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

//       // =======================================================
//       // 11. CHECK PROFILE COMPLETION
//       // =======================================================

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

//       const hasParentProfile =
//         Boolean(
//           firebaseUserData
//             ?.parentProfile
//             ?.parentName
//         );

//       console.log(
//         "👧 Child:",
//         firebaseUserData?.childProfile
//       );

//       console.log(
//         "👨‍👩‍👧 Parent:",
//         firebaseUserData?.parentProfile
//       );

//       console.log(
//         "🦊 Friend:",
//         firebaseUserData?.jungleFriend
//       );

//       console.log(
//         "👧 Child profile complete:",
//         hasChildProfile
//       );

//       console.log(
//         "👨‍👩‍👧 Parent profile complete:",
//         hasParentProfile
//       );

//       console.log(
//         "🦊 Friend selected:",
//         hasJungleFriend
//       );

//       // =======================================================
//       // 12. ADMIN
//       // =======================================================

//       if (isAdmin) {
//         console.log(
//           "👑 Admin → /admin"
//         );

//         navigate("/admin");
//         return;
//       }

//       // =======================================================
//       // 13. COMPLETE USER
//       //
//       // Child + Friend are enough to enter the
//       // main CurioKids experience.
//       // =======================================================

//       if (
//         hasChildProfile &&
//         hasJungleFriend
//       ) {
//         console.log(
//           "✅ Complete user → Jungle Hero"
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

//       // =======================================================
//       // 14. INCOMPLETE USER
//       // =======================================================

//       console.log(
//         "🆕 Profile incomplete → Choose Friend"
//       );

//       navigate(
//         "/choose-friend"
//       );

//     } catch (error) {
//       console.error(
//         "❌ OTP verification error:",
//         error
//       );

//       setError(
//         error?.message ||
//           "Something went wrong. Please try again."
//       );
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
//       const response = await fetch(
//         "http://localhost:5000/api/send-otp",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify({
//             email,
//           }),
//         }
//       );

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
//   // UI
//   // =========================================================

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>

//         <h2>🔐 Enter OTP</h2>

//         <p>
//           Sent to {email}
//         </p>

//         <div style={styles.otpContainer}>
//           {otp.map(
//             (digit, index) => (
//               <input
//                 key={index}

//                 ref={(element) => {
//                   inputsRef.current[index] =
//                     element;
//                 }}

//                 type="text"

//                 inputMode="numeric"

//                 maxLength={1}

//                 value={digit}

//                 onChange={(event) =>
//                   handleChange(
//                     event.target.value,
//                     index
//                   )
//                 }

//                 onKeyDown={(event) =>
//                   handleKeyDown(
//                     event,
//                     index
//                   )
//                 }

//                 style={styles.otpInput}

//                 autoComplete="one-time-code"
//               />
//             )
//           )}
//         </div>

//         <button
//           onClick={verifyOtp}
//           disabled={loading}
//           style={{
//             ...styles.button,
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           {loading
//             ? "Verifying..."
//             : "Verify OTP"}
//         </button>

//         {timer > 0 ? (
//           <p style={styles.timer}>
//             Resend OTP in {timer}s
//           </p>
//         ) : (
//           <button
//             onClick={resendOtp}
//             style={styles.resend}
//           >
//             Resend OTP
//           </button>
//         )}

//         {error && (
//           <p style={styles.error}>
//             {error}
//           </p>
//         )}

//       </div>
//     </div>
//   );
// }

// // =========================================================
// // STYLES
// // =========================================================

// const styles = {
//   container: {
//     minHeight: "100vh",

//     display: "flex",

//     justifyContent: "center",

//     alignItems: "center",

//     background:
//       "linear-gradient(135deg, #dff5dc, #bde7b8)",

//     padding: "20px",

//     boxSizing: "border-box",
//   },

//   card: {
//     background:
//       "rgba(255,255,255,0.96)",

//     padding: "35px",

//     borderRadius: "22px",

//     width: "380px",

//     maxWidth: "100%",

//     textAlign: "center",

//     boxShadow:
//       "0 15px 40px rgba(0,0,0,0.15)",
//   },

//   otpContainer: {
//     display: "flex",

//     justifyContent: "center",

//     gap: "9px",

//     margin:
//       "25px 0",
//   },

//   otpInput: {
//     width: "45px",

//     height: "52px",

//     fontSize: "22px",

//     fontWeight: "700",

//     textAlign: "center",

//     borderRadius: "10px",

//     border:
//       "2px solid #6bcb77",

//     outline: "none",

//     boxSizing: "border-box",
//   },

//   button: {
//     width: "100%",

//     padding: "13px",

//     background:
//       "#ff9f1c",

//     color: "#fff",

//     border: "none",

//     borderRadius: "11px",

//     cursor: "pointer",

//     fontWeight: "700",

//     fontSize: "16px",
//   },

//   resend: {
//     marginTop: "12px",

//     background: "none",

//     border: "none",

//     color: "#2d6a4f",

//     cursor: "pointer",

//     fontWeight: "700",

//     fontSize: "14px",
//   },

//   timer: {
//     marginTop: "12px",

//     color: "#666",

//     fontSize: "14px",
//   },

//   error: {
//     marginTop: "12px",

//     color: "#d62828",

//     fontSize: "14px",

//     lineHeight: "1.4",
//   },
// };



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

export default function OtpVerify() {
  const navigate = useNavigate();

  // =========================================================
  // EMAIL
  // =========================================================

  const email =
    localStorage.getItem("loginEmail");

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
  // TIMER
  // =========================================================

  useEffect(() => {
    if (timer <= 0) return;

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
      const value = localStorage.getItem(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value);
    } catch (error) {
      console.error(
        `❌ Failed to parse ${key}:`,
        error
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
      // 2. CHECK FIREBASE TOKEN
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
      // 4. SAVE CURRENT USER ID
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
      // 6. GET THIS USER'S FIREBASE DOCUMENT
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
        "🔥 Firebase user exists:",
        userExists
      );

      console.log(
        "🔥 Existing Firebase data:",
        existingUser
      );

      // =====================================================
      // IMPORTANT
      //
      // userExists is captured BEFORE we create/update
      // the document.
      //
      // This lets us distinguish:
      //
      // 🆕 BRAND NEW USER
      // 👤 EXISTING USER
      //
      // even after setDoc().
      // =====================================================

      // =====================================================
      // 7. PROFILE DATA
      // =====================================================

      let childProfile =
        existingUser?.childProfile || null;

      let parentProfile =
        existingUser?.parentProfile || null;

      // IMPORTANT:
      //
      // We deliberately DO NOT read jungleFriend
      // from localStorage for a new user.
      //
      // A new user MUST choose a friend through
      // ChooseFriend.jsx.
      //
      // This prevents an old user's friend from
      // accidentally entering the new account.

      let jungleFriend =
        existingUser?.jungleFriend || null;

      // =====================================================
      // 8. NEW USER
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
              savedChild.age || "",

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

            timeLimit:
              savedParent.timeLimit ||
              "",
          };

          console.log(
            "👨‍👩‍👧 Registration parent:",
            parentProfile
          );
        }

        // ---------------------------------------------------
        // VERY IMPORTANT
        // ---------------------------------------------------
        //
        // NEW USERS DO NOT GET A JUNGLE FRIEND YET.
        //
        // They must go through:
        //
        // /choose-friend
        //
        // and choose one there.
        //
        // ---------------------------------------------------

        jungleFriend = null;

        console.log(
          "🦊 NEW USER → jungle friend will be selected later"
        );

        // Remove any stale browser cache.
        localStorage.removeItem(
          "jungleFriend"
        );
      }

      // =====================================================
      // 9. EXISTING USER
      // =====================================================

      else {
        console.log(
          "✅ EXISTING USER → Firebase data ONLY"
        );

        console.log(
          "🚫 Ignoring localStorage profile data"
        );
      }

      // =====================================================
      // 10. SAVE USER PROFILE TO FIREBASE
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
        "✅ User profile saved to Firebase"
      );

      // =====================================================
      // 11. READ FIREBASE AGAIN
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
      // 12. UPDATE LOCAL STORAGE FROM FIREBASE
      //
      // Firebase = SOURCE OF TRUTH
      // localStorage = CACHE ONLY
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
      // 13. CREATE PROGRESS DOCUMENT IF NEEDED
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
      // 14. CHECK PROFILE COMPLETION
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

      const hasParentProfile =
        Boolean(
          firebaseUserData
            ?.parentProfile
            ?.parentName
        );

      console.log(
        "👧 Child:",
        firebaseUserData?.childProfile
      );

      console.log(
        "👨‍👩‍👧 Parent:",
        firebaseUserData?.parentProfile
      );

      console.log(
        "🦊 Friend:",
        firebaseUserData?.jungleFriend
      );

      console.log(
        "👧 Child profile complete:",
        hasChildProfile
      );

      console.log(
        "👨‍👩‍👧 Parent profile complete:",
        hasParentProfile
      );

      console.log(
        "🦊 Friend selected:",
        hasJungleFriend
      );

      // =====================================================
      // 15. ADMIN
      // =====================================================

      if (isAdmin) {
        console.log(
          "👑 Admin → /admin"
        );

        navigate("/admin");

        return;
      }

      // =====================================================
      // 16. ⭐ BRAND NEW USER
      // =====================================================
      //
      // THIS IS THE IMPORTANT FIX.
      //
      // A new user MUST choose their jungle friend.
      //
      // Even if old localStorage had a friend,
      // we removed it above and jungleFriend was
      // explicitly saved as null.
      //
      // Therefore:
      //
      // NEW USER → /choose-friend
      //
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
      // 17. 👤 EXISTING COMPLETE USER
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
      // 18. 👤 EXISTING INCOMPLETE USER
      // =====================================================

      console.log(
        "🆕 EXISTING USER INCOMPLETE → Choose Friend"
      );

      localStorage.removeItem(
        "jungleFriend"
      );

      navigate(
        "/choose-friend"
      );

    } catch (error) {
      console.error(
        "❌ OTP verification error:",
        error
      );

      setError(
        error?.message ||
          "Something went wrong. Please try again."
      );
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
      const response = await fetch(
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
  // UI
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

                ref={(element) => {
                  inputsRef.current[index] =
                    element;
                }}

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

                style={styles.otpInput}

                autoComplete="one-time-code"
              />
            )
          )}

        </div>

        {/* VERIFY */}

        <button
          onClick={verifyOtp}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading
              ? 0.7
              : 1,
          }}
        >
          {loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        {/* RESEND */}

        {timer > 0 ? (
          <p style={styles.timer}>
            Resend OTP in {timer}s
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
// STYLES
// =========================================================

const styles = {
  container: {
    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    background:
      "linear-gradient(135deg, #dff5dc, #bde7b8)",

    padding: "20px",

    boxSizing: "border-box",
  },

  card: {
    background:
      "rgba(255,255,255,0.96)",

    padding: "35px",

    borderRadius: "22px",

    width: "380px",

    maxWidth: "100%",

    textAlign: "center",

    boxShadow:
      "0 15px 40px rgba(0,0,0,0.15)",
  },

  otpContainer: {
    display: "flex",

    justifyContent: "center",

    gap: "9px",

    margin:
      "25px 0",
  },

  otpInput: {
    width: "45px",

    height: "52px",

    fontSize: "22px",

    fontWeight: "700",

    textAlign: "center",

    borderRadius: "10px",

    border:
      "2px solid #6bcb77",

    outline: "none",

    boxSizing: "border-box",
  },

  button: {
    width: "100%",

    padding: "13px",

    background:
      "#ff9f1c",

    color: "#fff",

    border: "none",

    borderRadius: "11px",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "16px",
  },

  resend: {
    marginTop: "12px",

    background: "none",

    border: "none",

    color: "#2d6a4f",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "14px",
  },

  timer: {
    marginTop: "12px",

    color: "#666",

    fontSize: "14px",
  },

  error: {
    marginTop: "12px",

    color: "#d62828",

    fontSize: "14px",

    lineHeight: "1.4",
  },
};