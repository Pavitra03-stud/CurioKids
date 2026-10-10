// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { sendSignInLinkToEmail } from "firebase/auth";
// // import { auth } from "../firebase";
// // import "../styles/Auth.css";

// // export default function Login() {
// //   const [email, setEmail] = useState("");
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [sent, setSent] = useState(false);

// //   const navigate = useNavigate();

// //   const handleLogin = async () => {
// //     setError("");
// //     setSent(false);

// //     const cleanEmail = email.trim().toLowerCase();

// //     if (!cleanEmail) {
// //       setError("Enter your email 📧");
// //       return;
// //     }

// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// //     if (!emailRegex.test(cleanEmail)) {
// //       setError("Enter a valid email 📧");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const actionCodeSettings = {
// //         url: `${window.location.origin}/otp`,
// //         handleCodeInApp: true,
// //       };

// //       await sendSignInLinkToEmail(
// //         auth,
// //         cleanEmail,
// //         actionCodeSettings
// //       );

// //       localStorage.setItem("loginEmail", cleanEmail);
// //       localStorage.setItem("emailForSignIn", cleanEmail);

// //       setSent(true);

// //       console.log("✅ Firebase sign-in link sent");

// //     } catch (err) {
// //       console.error("❌ Firebase email-link error:", err);

// //       if (
// //         err.code === "auth/unauthorized-continue-uri" ||
// //         err.code === "auth/invalid-continue-uri"
// //       ) {
// //         setError(
// //           "This website URL is not authorized in Firebase."
// //         );
// //       } else if (err.code === "auth/invalid-email") {
// //         setError("Please enter a valid email address.");
// //       } else if (
// //         err.code === "auth/operation-not-allowed"
// //       ) {
// //         setError(
// //           "Email link sign-in is not enabled in Firebase."
// //         );
// //       } else {
// //         setError(
// //           err.message || "Could not send the sign-in link."
// //         );
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="login-page">
// //       <div className="login-overlay"></div>

// //       <header className="login-brand">
// //         <div className="brand-title">
// //           <span className="brand-curio">Curio</span>
// //           <span className="brand-kids">Kids</span>
// //           <span className="brand-sprout">🌱</span>
// //         </div>

// //         <div className="brand-tagline">
// //           Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
// //         </div>
// //       </header>

// //       <div className="login-leaf leaf-one">🍃</div>
// //       <div className="login-leaf leaf-two">🌿</div>
// //       <div className="login-leaf leaf-three">🍃</div>
// //       <div className="login-butterfly">🦋</div>
// //       <div className="login-flower flower-one">🌺</div>
// //       <div className="login-flower flower-two">🌸</div>

// //       <main className="login-content">
// //         <div className="login-card">
// //           <div className="login-lock">
// //             <span className="lock-sprout">🌱</span>
// //             <span className="lock">🔒</span>
// //           </div>

// //           <h1>Welcome Back</h1>

// //           <p className="login-subtitle">
// //             Let's continue your learning adventure!
// //           </p>

// //           <div className="login-input-wrapper">
// //             <span className="email-icon">✉️</span>

// //             <input
// //               type="email"
// //               placeholder="Enter your email"
// //               value={email}
// //               onChange={(e) => {
// //                 setEmail(e.target.value);
// //                 setError("");
// //                 setSent(false);
// //               }}
// //               disabled={loading || sent}
// //               autoComplete="email"
// //               onKeyDown={(e) => {
// //                 if (e.key === "Enter" && !loading && !sent) {
// //                   handleLogin();
// //                 }
// //               }}
// //             />
// //           </div>

// //           {error && (
// //             <p className="login-error" role="alert">
// //               {error}
// //             </p>
// //           )}

// //           {sent && (
// //             <div className="login-success" role="status">
// //               <p>🌿 Sign-in link sent successfully!</p>
// //               <p>
// //                 Check <strong>{email.trim().toLowerCase()}</strong>
// //                 {" "}and open the link on this device to continue.
// //               </p>
// //               <p>
// //                 If you don't see it, check your spam folder.
// //               </p>
// //             </div>
// //           )}

// //           {!sent && (
// //             <button
// //               className="send-otp-btn"
// //               type="button"
// //               onClick={handleLogin}
// //               disabled={loading}
// //             >
// //               <span>✉️</span>
// //               {loading
// //                 ? "Sending link..."
// //                 : "Send Sign-in Link"}
// //             </button>
// //           )}

// //           {sent && (
// //             <button
// //               className="send-otp-btn"
// //               type="button"
// //               onClick={() => {
// //                 setSent(false);
// //                 setError("");
// //               }}
// //             >
// //               Use another email
// //             </button>
// //           )}

// //           <p className="register-text">
// //             New here?{" "}
// //             <span
// //               onClick={() => {
// //                 if (!loading) {
// //                   navigate("/child-register");
// //                 }
// //               }}
// //             >
// //               Register 🌱
// //             </span>
// //           </p>

// //           <div className="privacy-note">
// //             🔐 Your learning space is safe and private
// //           </div>
// //         </div>
// //       </main>

// //       <button
// //         className="login-chatbot"
// //         type="button"
// //         aria-label="CurioKids assistant"
// //       >
// //         🤖
// //       </button>
// //     </div>
// //   );
// // }



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   signInWithEmailAndPassword,
//   getIdTokenResult,
//   signOut,
// } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   setDoc,
// } from "firebase/firestore";

// import { auth, db } from "../firebase";
// import "../styles/Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event?.preventDefault();
//     setError("");

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail || !password) {
//       setError("Please enter your email and password 🌱");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       setError("Please enter a valid email address 📧");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Authenticate the parent with Firebase.
//       const credential = await signInWithEmailAndPassword(
//         auth,
//         cleanEmail,
//         password
//       );

//       const user = credential.user;

//       // 2. Check whether this account has administrator access.
//       const tokenResult = await getIdTokenResult(user, true);

//       if (tokenResult.claims.admin === true) {
//         localStorage.setItem("userId", user.uid);
//         localStorage.setItem("loginEmail", user.email || cleanEmail);

//         navigate("/admin", { replace: true });
//         return;
//       }

//       // 3. Load the user's Firestore profile using the Firebase UID.
//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         // Do not create an empty profile automatically.
//         // The registration flow should create the required profile.
//         await signOut(auth);

//         localStorage.removeItem("userId");

//         setError(
//           "Your account exists, but your profile is missing. Please register again or contact support."
//         );
//         return;
//       }

//       const userData = userSnap.data();

//       // 4. Update login metadata without replacing existing profile data.
//       await setDoc(
//         userRef,
//         {
//           uid: user.uid,
//           email: user.email || cleanEmail,
//           lastLogin: new Date().toISOString(),
//         },
//         { merge: true }
//       );

//       // 5. Update the local cache from Firestore.
//       // Firestore remains the source of truth.
//       localStorage.setItem("userId", user.uid);
//       localStorage.setItem("loginEmail", user.email || cleanEmail);

//       if (userData.parentProfile) {
//         localStorage.setItem(
//           "parentProfile",
//           JSON.stringify(userData.parentProfile)
//         );

//         if (userData.parentProfile.parentName) {
//           localStorage.setItem(
//             "userName",
//             userData.parentProfile.parentName
//           );
//         }
//       } else {
//         localStorage.removeItem("parentProfile");
//       }

//       if (userData.childProfile) {
//         localStorage.setItem(
//           "childProfile",
//           JSON.stringify(userData.childProfile)
//         );
//       } else {
//         localStorage.removeItem("childProfile");
//       }

//       if (userData.jungleFriend) {
//         localStorage.setItem(
//           "jungleFriend",
//           JSON.stringify(userData.jungleFriend)
//         );
//       } else {
//         localStorage.removeItem("jungleFriend");
//       }

//       // 6. Create a progress document only if it does not exist.
//       // Existing stars, streaks, history and game progress are preserved.
//       const progressRef = doc(db, "progress", user.uid);
//       const progressSnap = await getDoc(progressRef);

//       if (!progressSnap.exists()) {
//         await setDoc(progressRef, {
//           userId: user.uid,
//           stars: 0,
//           streak: 0,
//           history: [],
//           activeGames: {},
//         });
//       }

//       // 7. Route according to the saved profile.
//       const childProfile = userData.childProfile;
//       const jungleFriend = userData.jungleFriend;

//       const hasChildProfile = Boolean(
//         childProfile?.name && childProfile?.age
//       );

//       const hasJungleFriend = Boolean(jungleFriend?.name);

//       if (hasChildProfile && hasJungleFriend) {
//         localStorage.setItem("appProgress", "friend-chosen");

//         navigate("/jungle-hero", { replace: true });
//       } else {
//         localStorage.setItem(
//           "appProgress",
//           hasChildProfile ? "child-created" : "parent-created"
//         );

//         navigate(
//           hasChildProfile ? "/choose-friend" : "/child-register",
//           { replace: true }
//         );
//       }
//     } catch (err) {
//       console.error("CurioKids login error:", err.code, err.message);

//       switch (err.code) {
//         case "auth/invalid-email":
//           setError("Please enter a valid email address 📧");
//           break;

//         case "auth/invalid-credential":
//         case "auth/wrong-password":
//         case "auth/user-not-found":
//           setError("Incorrect email or password. Please try again.");
//           break;

//         case "auth/user-disabled":
//           setError("This account has been disabled. Please contact support.");
//           break;

//         case "auth/too-many-requests":
//           setError(
//             "Too many unsuccessful attempts. Please wait before trying again."
//           );
//           break;

//         case "auth/network-request-failed":
//           setError("Network error. Please check your internet connection.");
//           break;

//         case "auth/operation-not-allowed":
//           setError(
//             "Email/password login is not enabled in Firebase Authentication."
//           );
//           break;

//         case "permission-denied":
//         case "firestore/permission-denied":
//           setError(
//             "Unable to access your profile. Please check your account permissions."
//           );
//           break;

//         default:
//           setError("Unable to log in right now. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-overlay"></div>

//       <header className="login-brand">
//         <div className="brand-title">
//           <span className="brand-curio">Curio</span>
//           <span className="brand-kids">Kids</span>
//           <span className="brand-sprout">🌱</span>
//         </div>

//         <div className="brand-tagline">
//           Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
//         </div>
//       </header>

//       <div className="login-leaf leaf-one">🍃</div>
//       <div className="login-leaf leaf-two">🌿</div>
//       <div className="login-leaf leaf-three">🍃</div>
//       <div className="login-butterfly">🦋</div>
//       <div className="login-flower flower-one">🌺</div>
//       <div className="login-flower flower-two">🌸</div>

//       <main className="login-content">
//         <div className="login-card">
//           <div className="login-lock">
//             <span className="lock-sprout">🌱</span>
//             <span className="lock">🔒</span>
//           </div>

//           <h1>Welcome Back</h1>

//           <p className="login-subtitle">
//             Let's continue your learning adventure!
//           </p>

//           <form onSubmit={handleLogin}>
//             <div className="login-input-wrapper">
//               <span className="email-icon">✉️</span>

//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(event) => {
//                   setEmail(event.target.value);
//                   setError("");
//                 }}
//                 disabled={loading}
//                 autoComplete="email"
//                 required
//               />
//             </div>

//             <div className="login-input-wrapper">
//               <span className="email-icon">🔑</span>

//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(event) => {
//                   setPassword(event.target.value);
//                   setError("");
//                 }}
//                 disabled={loading}
//                 autoComplete="current-password"
//                 required
//               />
//             </div>

//             {error && (
//               <p className="login-error" role="alert">
//                 {error}
//               </p>
//             )}

//             <button
//               className="send-otp-btn"
//               type="submit"
//               disabled={loading}
//             >
//               <span>🌿</span>
//               {loading ? "Entering the jungle..." : "Enter the Jungle"}
//             </button>
//           </form>

//           <p className="register-text">
//             New here?{" "}
//             <span
//               onClick={() => {
//                 if (!loading) navigate("/child-register");
//               }}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(event) => {
//                 if (
//                   !loading &&
//                   (event.key === "Enter" || event.key === " ")
//                 ) {
//                   navigate("/child-register");
//                 }
//               }}
//             >
//               Register 🌱
//             </span>
//           </p>

//           <p className="register-text">
//             Forgot your password?{" "}
//             <span
//               onClick={() => {
//                 if (!loading) navigate("/forgot-password");
//               }}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(event) => {
//                 if (
//                   !loading &&
//                   (event.key === "Enter" || event.key === " ")
//                 ) {
//                   navigate("/forgot-password");
//                 }
//               }}
//             >
//               Reset it
//             </span>
//           </p>

//           <div className="privacy-note">
//             🔐 Your learning space is safe and private
//           </div>
//         </div>
//       </main>

//       <button
//         className="login-chatbot"
//         type="button"
//         aria-label="CurioKids assistant"
//       >
//         🤖
//       </button>
//     </div>
//   );
// }\






// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   signInWithEmailAndPassword,
//   getIdTokenResult,
//   signOut,
// } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   setDoc,
// } from "firebase/firestore";

// import { auth, db } from "../firebase";
// import "../styles/Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setError("");

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail || !password) {
//       setError("Please enter your email and password 🌱");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
//       setError("Please enter a valid email address 📧");
//       return;
//     }

//     setLoading(true);

//     try {
//       // 1. Authenticate with Firebase.
//       const credential = await signInWithEmailAndPassword(
//         auth,
//         cleanEmail,
//         password
//       );

//       const user = credential.user;

//       // 2. Preserve administrator access.
//       const tokenResult = await getIdTokenResult(user, true);

//       localStorage.setItem("userId", user.uid);
//       localStorage.setItem("loginEmail", user.email || cleanEmail);

//       if (tokenResult.claims.admin === true) {
//         navigate("/admin", { replace: true });
//         return;
//       }

//       // 3. Read the profile belonging to this authenticated UID.
//       const userRef = doc(db, "users", user.uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         setError(
//           "Your login succeeded, but no profile was found for this account. Please contact support so we can recover your existing profile safely."
//         );
//         await signOut(auth);
//         return;
//       }

//       const userData = userSnap.data();

//       // 4. Update login metadata without deleting saved fields.
//       await setDoc(
//         userRef,
//         {
//           uid: user.uid,
//           email: user.email || cleanEmail,
//           lastLogin: new Date().toISOString(),
//         },
//         { merge: true }
//       );

//       // 5. Read saved profile information.
//       // Some older profiles may also have child details at the top level.
//       const savedChild =
//         userData.childProfile ||
//         (userData.childName || userData.age
//           ? {
//               name: userData.childName || userData.name || "",
//               age: userData.age || "",
//             }
//           : null);

//       const cachedChild = (() => {
//         try {
//           return JSON.parse(
//             localStorage.getItem("childProfile") || "null"
//           );
//         } catch {
//           return null;
//         }
//       })();

//       const childProfile = savedChild || cachedChild;
//       const jungleFriend =
//         userData.jungleFriend ||
//         (() => {
//           try {
//             return JSON.parse(
//               localStorage.getItem("jungleFriend") || "null"
//             );
//           } catch {
//             return null;
//           }
//         })();

//       // 6. Refresh local caches from the available profile.
//       if (userData.parentProfile) {
//         localStorage.setItem(
//           "parentProfile",
//           JSON.stringify(userData.parentProfile)
//         );

//         if (userData.parentProfile.parentName) {
//           localStorage.setItem(
//             "userName",
//             userData.parentProfile.parentName
//           );
//         }
//       }

//       if (childProfile) {
//         localStorage.setItem(
//           "childProfile",
//           JSON.stringify(childProfile)
//         );
//       }

//       if (jungleFriend) {
//         localStorage.setItem(
//           "jungleFriend",
//           JSON.stringify(jungleFriend)
//         );
//       }

//       // 7. Initialize progress only when it does not exist.
//       // Never reset existing stars, streaks, history, or game results.
//       const progressRef = doc(db, "progress", user.uid);
//       const progressSnap = await getDoc(progressRef);

//       if (!progressSnap.exists()) {
//         await setDoc(progressRef, {
//           userId: user.uid,
//           stars: 0,
//           streak: 0,
//           history: [],
//           activeGames: {},
//         });
//       }

//       // 8. Decide where to navigate.
//       const hasChildProfile = Boolean(
//         childProfile?.name &&
//         childProfile?.age !== undefined &&
//         childProfile?.age !== null &&
//         String(childProfile.age).trim() !== ""
//       );

//       const hasJungleFriend = Boolean(
//         jungleFriend?.name ||
//         (typeof jungleFriend === "string" && jungleFriend.trim())
//       );

//       if (hasChildProfile && hasJungleFriend) {
//         localStorage.setItem("appProgress", "friend-chosen");
//         navigate("/jungle-hero", { replace: true });
//       } else if (hasChildProfile) {
//         localStorage.setItem("appProgress", "child-created");
//         navigate("/choose-friend", { replace: true });
//       } else {
//         // Do not silently overwrite the existing Firestore profile.
//         setError(
//           "Your account is signed in, but the child profile could not be identified. Please contact support to recover it."
//         );
//         await signOut(auth);
//       }
//     } catch (err) {
//       console.error("CurioKids login error:", err.code, err.message);

//       switch (err.code) {
//         case "auth/invalid-email":
//           setError("Please enter a valid email address 📧");
//           break;

//         case "auth/invalid-credential":
//         case "auth/wrong-password":
//         case "auth/user-not-found":
//           setError("Incorrect email or password. Please try again.");
//           break;

//         case "auth/user-disabled":
//           setError("This account has been disabled. Please contact support.");
//           break;

//         case "auth/too-many-requests":
//           setError("Too many unsuccessful attempts. Please wait and try again.");
//           break;

//         case "auth/network-request-failed":
//           setError("Network error. Please check your internet connection.");
//           break;

//         case "auth/operation-not-allowed":
//           setError("Email/password login is not enabled in Firebase.");
//           break;

//         case "permission-denied":
//         case "firestore/permission-denied":
//           setError("Unable to access your profile. Please check account permissions.");
//           break;

//         default:
//           setError(
//             "Unable to complete login. Please try again. If this continues, check the browser console."
//           );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-overlay"></div>

//       <header className="login-brand">
//         <div className="brand-title">
//           <span className="brand-curio">Curio</span>
//           <span className="brand-kids">Kids</span>
//           <span className="brand-sprout">🌱</span>
//         </div>
//         <div className="brand-tagline">
//           Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow
//         </div>
//       </header>

//       <div className="login-leaf leaf-one">🍃</div>
//       <div className="login-leaf leaf-two">🌿</div>
//       <div className="login-leaf leaf-three">🍃</div>
//       <div className="login-butterfly">🦋</div>
//       <div className="login-flower flower-one">🌺</div>
//       <div className="login-flower flower-two">🌸</div>

//       <main className="login-content">
//         <div className="login-card">
//           <div className="login-lock">
//             <span className="lock-sprout">🌱</span>
//             <span className="lock">🔒</span>
//           </div>

//           <h1>Welcome Back</h1>
//           <p className="login-subtitle">
//             Let's continue your learning adventure!
//           </p>

//           <form onSubmit={handleLogin}>
//             <div className="login-input-wrapper">
//               <span className="email-icon">✉️</span>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(event) => {
//                   setEmail(event.target.value);
//                   setError("");
//                 }}
//                 disabled={loading}
//                 autoComplete="email"
//                 required
//               />
//             </div>

//             <div className="login-input-wrapper">
//               <span className="email-icon">🔑</span>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(event) => {
//                   setPassword(event.target.value);
//                   setError("");
//                 }}
//                 disabled={loading}
//                 autoComplete="current-password"
//                 required
//               />
//             </div>

//             {error && (
//               <p className="login-error" role="alert">
//                 {error}
//               </p>
//             )}

//             <button
//               className="send-otp-btn"
//               type="submit"
//               disabled={loading}
//             >
//               <span>🌿</span>
//               {loading ? "Entering the jungle..." : "Enter the Jungle"}
//             </button>
//           </form>

//           <p className="register-text">
//             New here?{" "}
//             <span
//               onClick={() => !loading && navigate("/child-register")}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(event) => {
//                 if (
//                   !loading &&
//                   (event.key === "Enter" || event.key === " ")
//                 ) {
//                   navigate("/child-register");
//                 }
//               }}
//             >
//               Register 🌱
//             </span>
//           </p>

//           <p className="register-text">
//             Forgot your password?{" "}
//             <span
//               onClick={() => !loading && navigate("/forgot-password")}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(event) => {
//                 if (
//                   !loading &&
//                   (event.key === "Enter" || event.key === " ")
//                 ) {
//                   navigate("/forgot-password");
//                 }
//               }}
//             >
//               Reset it
//             </span>
//           </p>

//           <div className="privacy-note">
//             🔐 Your learning space is safe and private
//           </div>
//         </div>
//       </main>

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
import {
  signInWithEmailAndPassword,
  getIdTokenResult,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/Auth.css";

const firstNonEmpty = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "";
};

// Support current and older child-profile structures.
const normalizeChildProfile = (userData) => {
  const nested = userData?.childProfile;

  const source =
    nested &&
      typeof nested === "object" &&
      !Array.isArray(nested)
      ? nested
      : {};

  const name = firstNonEmpty(
    source.name,
    source.childName,
    userData?.childName,
    userData?.name
  );

  const age = firstNonEmpty(
    source.age,
    source.childAge,
    userData?.childAge,
    userData?.age
  );

  if (!name || age === "") {
    return null;
  }

  return {
    ...source,
    name: String(name).trim(),
    age,
  };
};

const normalizeJungleFriend = (value) => {
  if (typeof value === "string") {
    const name = value.trim();
    return name ? { name } : null;
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const name = firstNonEmpty(
      value.name,
      value.friendName,
      value.title
    );

    return name
      ? { ...value, name: String(name).trim() }
      : null;
  }

  return null;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password 🌱");
      return;
    }

    // Correct email validation.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address 📧");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate using Firebase email/password.
      const credential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      const user = credential.user;

      // 2. Check administrator access.
      const tokenResult = await getIdTokenResult(user, true);

      localStorage.setItem("userId", user.uid);
      localStorage.setItem(
        "loginEmail",
        user.email || cleanEmail
      );

      if (tokenResult.claims.admin === true) {
        navigate("/admin", { replace: true });
        return;
      }

      // 3. Load the existing user document.
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const userData = userSnap.exists()
        ? userSnap.data()
        : {};

      // 4. Normalize existing profile data without deleting fields.
      const childProfile = normalizeChildProfile(userData);

      const jungleFriend = normalizeJungleFriend(
        userData.jungleFriend
      );

      const parentProfile =
        userData.parentProfile &&
          typeof userData.parentProfile === "object"
          ? userData.parentProfile
          : userData.parentName
            ? { parentName: userData.parentName }
            : null;

      // 5. Update only account metadata and recoverable profile fields.
      const userPatch = {
        uid: user.uid,
        email: user.email || cleanEmail,
        lastLogin: new Date().toISOString(),
      };

      if (childProfile && !userData.childProfile) {
        userPatch.childProfile = childProfile;
      }

      if (parentProfile && !userData.parentProfile) {
        userPatch.parentProfile = parentProfile;
      }

      if (jungleFriend && !userData.jungleFriend) {
        userPatch.jungleFriend = jungleFriend;
      }

      await setDoc(userRef, userPatch, { merge: true });

      // 6. Refresh local profile caches.
      if (parentProfile) {
        localStorage.setItem(
          "parentProfile",
          JSON.stringify(parentProfile)
        );

        if (parentProfile.parentName) {
          localStorage.setItem(
            "userName",
            String(parentProfile.parentName)
          );
        }
      }

      if (childProfile) {
        localStorage.setItem(
          "childProfile",
          JSON.stringify(childProfile)
        );
      } else {
        localStorage.removeItem("childProfile");
      }

      if (jungleFriend) {
        localStorage.setItem(
          "jungleFriend",
          JSON.stringify(jungleFriend)
        );
      } else {
        localStorage.removeItem("jungleFriend");
      }

      // 7. Initialize progress only if it does not already exist.
      // Existing stars, streaks, history and game progress are preserved.
      const progressRef = doc(db, "progress", user.uid);
      const progressSnap = await getDoc(progressRef);

      if (!progressSnap.exists()) {
        await setDoc(progressRef, {
          userId: user.uid,
          stars: 0,
          streak: 0,
          history: [],
          activeGames: {},
        });
      }

      // 8. Navigate according to the saved profile.
      if (childProfile && jungleFriend) {
        navigate("/jungle-hero", { replace: true });
      } else if (childProfile) {
        navigate("/choose-friend", { replace: true });
      } else {
        // Existing user without a recognized profile:
        // do not send them to registration automatically.
        navigate("/jungle-hero", { replace: true });
      }
    } catch (err) {
      console.error(
        "CurioKids login error:",
        err.code,
        err.message
      );

      switch (err.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address 📧");
          break;

        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError(
            "Incorrect email or password. Please try again."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled. Please contact support."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many unsuccessful attempts. Please wait and try again."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/password login is not enabled in Firebase."
          );
          break;

        case "permission-denied":
        case "firestore/permission-denied":
          setError(
            "Unable to access your profile. Please check your account permissions."
          );
          break;

        default:
          setError(
            "We couldn't finish signing you in. Please try again. If this continues, check the browser console."
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

      <div className="login-leaf leaf-one">🍃</div>
      <div className="login-leaf leaf-two">🌿</div>
      <div className="login-leaf leaf-three">🍃</div>
      <div className="login-butterfly">🦋</div>
      <div className="login-flower flower-one">🌺</div>
      <div className="login-flower flower-two">🌸</div>

      <main className="login-content">
        <div className="login-card">
          <div className="login-lock">
            <span className="lock-sprout">🌱</span>
            <span className="lock">🔒</span>
          </div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Let's continue your learning adventure!
          </p>

          <form onSubmit={handleLogin}>
            <div className="login-input-wrapper">
              <span className="email-icon">✉️</span>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-input-wrapper">
              <span className="email-icon">🔑</span>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                disabled={loading}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="send-otp-btn"
              type="submit"
              disabled={loading}
            >
              <span>🌿</span>
              {loading
                ? "Entering the jungle..."
                : "Enter the Jungle"}
            </button>
          </form>

          <p className="register-text">
            New here?{" "}
            <span
              role="button"
              tabIndex={0}
              onClick={() =>
                !loading && navigate("/child-register")
              }
              onKeyDown={(event) => {
                if (
                  !loading &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  navigate("/child-register");
                }
              }}
            >
              Register 🌱
            </span>
          </p>

          <p className="register-text">
            Forgot your password?{" "}
            <span
              role="button"
              tabIndex={0}
              onClick={() =>
                !loading && navigate("/forgot-password")
              }
              onKeyDown={(event) => {
                if (
                  !loading &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  navigate("/forgot-password");
                }
              }}
            >
              Reset it
            </span>
          </p>

          <div className="privacy-note">
            🔐 Your learning space is safe and private
          </div>
        </div>
      </main>

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
