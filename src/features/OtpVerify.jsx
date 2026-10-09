// import { useState, useRef, useEffect } from "react";

// import { useNavigate } from "react-router-dom";



// import { auth, db } from "../firebase";



// import {

//   signInWithCustomToken,

//   getIdTokenResult,

// } from "firebase/auth";



// import {

//   doc,

//   getDoc,

//   setDoc,

// } from "firebase/firestore";



// import "../styles/OtpVerify.css";

// const API_URL = import.meta.env.VITE_API_URL;



// export default function OtpVerify() {

//   const navigate = useNavigate();



//   // =========================================================

//   // EMAIL

//   // =========================================================



//   const email = (

//     localStorage.getItem("loginEmail") || ""

//   )

//     .trim()

//     .toLowerCase();



//   // =========================================================

//   // STATE

//   // =========================================================



//   const [otp, setOtp] = useState(

//     new Array(6).fill("")

//   );



//   const [error, setError] = useState("");

//   const [loading, setLoading] = useState(false);

//   const [timer, setTimer] = useState(30);



//   const inputsRef = useRef([]);



//   // =========================================================

//   // RESEND TIMER

//   // =========================================================



//   useEffect(() => {

//     if (timer <= 0) {

//       return;

//     }



//     const interval = setInterval(() => {

//       setTimer((prev) => prev - 1);

//     }, 1000);



//     return () => clearInterval(interval);

//   }, [timer]);



//   // =========================================================

//   // OTP INPUT

//   // =========================================================



//   const handleChange = (value, index) => {

//     if (!/^[0-9]?$/.test(value)) {

//       return;

//     }



//     const newOtp = [...otp];



//     newOtp[index] = value;



//     setOtp(newOtp);



//     setError("");



//     if (value && index < 5) {

//       inputsRef.current[index + 1]?.focus();

//     }

//   };



//   // =========================================================

//   // BACKSPACE

//   // =========================================================



//   const handleKeyDown = (event, index) => {

//     if (

//       event.key === "Backspace" &&

//       !otp[index] &&

//       index > 0

//     ) {

//       inputsRef.current[index - 1]?.focus();

//     }

//   };



//   // =========================================================

//   // SAFE LOCAL STORAGE READER

//   // =========================================================



//   const getLocalStorageObject = (key) => {

//     try {

//       const value =

//         localStorage.getItem(key);



//       if (!value) {

//         return null;

//       }



//       return JSON.parse(value);

//     } catch (storageError) {

//       console.error(

//         `❌ Failed to parse ${key}:`,

//         storageError

//       );



//       return null;

//     }

//   };



//   // =========================================================

//   // VERIFY OTP

//   // =========================================================



//   const verifyOtp = async () => {

//     setError("");



//     const finalOtp = otp.join("");



//     // =======================================================

//     // VALIDATION

//     // =======================================================



//     if (!email) {

//       setError(

//         "Email not found. Please login again."

//       );



//       return;

//     }



//     if (finalOtp.length !== 6) {

//       setError(

//         "Please enter the complete OTP."

//       );



//       return;

//     }



//     setLoading(true);



//     try {

//       // =====================================================

//       // 1. VERIFY OTP WITH BACKEND

//       // =====================================================



//       const response = await fetch(

//         `${import.meta.env.VITE_API_URL}/api/verify-otp`,

//         {

//           method: "POST",



//           headers: {

//             "Content-Type": "application/json",

//           },



//           body: JSON.stringify({

//             email,

//             otp: finalOtp,

//           }),

//         }

//       );



//       const data = await response.json();



//       console.log(

//         "🔐 OTP response:",

//         data

//       );



//       if (!response.ok) {

//         setError(

//           data.message ||

//             "Invalid OTP. Please try again."

//         );



//         return;

//       }



//       // =====================================================

//       // 2. FIREBASE CUSTOM TOKEN

//       // =====================================================



//       if (!data.customToken) {

//         setError(

//           "Firebase login token was not received."

//         );



//         return;

//       }



//       // =====================================================

//       // 3. FIREBASE LOGIN

//       // =====================================================



//       console.log(

//         "🔥 Signing into Firebase..."

//       );



//       const userCredential =

//         await signInWithCustomToken(

//           auth,

//           data.customToken

//         );



//       const firebaseUser =

//         userCredential.user;



//       const uid =

//         firebaseUser.uid;



//       console.log(

//         "✅ Firebase login successful"

//       );



//       console.log(

//         "👤 Firebase UID:",

//         uid

//       );



//       // =====================================================

//       // 4. SAVE REAL FIREBASE UID

//       // =====================================================



//       localStorage.setItem(

//         "userId",

//         uid

//       );



//       // =====================================================

//       // 5. ADMIN CHECK

//       // =====================================================



//       let isAdmin = false;



//       try {

//         const tokenResult =

//           await getIdTokenResult(

//             firebaseUser,

//             true

//           );



//         isAdmin =

//           tokenResult.claims.admin === true;



//         console.log(

//           "👑 Admin:",

//           isAdmin

//         );

//       } catch (adminError) {

//         console.warn(

//           "⚠️ Admin check failed:",

//           adminError

//         );

//       }



//       // =====================================================

//       // 6. GET USER DOCUMENT

//       //

//       // IMPORTANT:

//       //

//       // We ONLY use:

//       //

//       // users/{firebaseUID}

//       //

//       // We DO NOT try:

//       //

//       // users/{email}

//       //

//       // because Firestore rules are UID based.

//       // =====================================================



//       const userRef = doc(

//         db,

//         "users",

//         uid

//       );



//       const userSnap =

//         await getDoc(userRef);



//       const userExists =

//         userSnap.exists();



//       const existingUser =

//         userExists

//           ? userSnap.data()

//           : null;



//       console.log(

//         "🔥 User exists:",

//         userExists

//       );



//       console.log(

//         "🔥 Existing Firebase data:",

//         existingUser

//       );



//       // =====================================================

//       // 7. PROFILE DATA

//       // =====================================================



//       let childProfile =

//         existingUser?.childProfile ||

//         null;



//       let parentProfile =

//         existingUser?.parentProfile ||

//         null;



//       let jungleFriend =

//         existingUser?.jungleFriend ||

//         null;



//       // =====================================================

//       // 8. BRAND NEW USER

//       //

//       // Only a brand-new Firebase user reads the registration

//       // information stored temporarily in localStorage.

//       // =====================================================



//       if (!userExists) {

//         console.log(

//           "🆕 NEW FIREBASE USER → reading registration data"

//         );



//         // ---------------------------------------------------

//         // CHILD PROFILE

//         // ---------------------------------------------------



//         const savedChild =

//           getLocalStorageObject(

//             "childProfile"

//           );



//         if (

//           savedChild &&

//           savedChild.name

//         ) {

//           childProfile = {

//             name: String(

//               savedChild.name

//             ).trim(),



//             age:

//               savedChild.age !== undefined &&

//               savedChild.age !== null

//                 ? String(savedChild.age)

//                 : "",



//             createdAt:

//               savedChild.createdAt ||

//               new Date().toISOString(),

//           };



//           console.log(

//             "👧 Registration child:",

//             childProfile

//           );

//         }



//         // ---------------------------------------------------

//         // PARENT PROFILE

//         // ---------------------------------------------------



//         const savedParent =

//           getLocalStorageObject(

//             "parentProfile"

//           ) ||

//           getLocalStorageObject(

//             "tempParent"

//           );



//         if (savedParent) {

//           parentProfile = {

//             parentName:

//               savedParent.parentName ||

//               "",



//             email:

//               savedParent.email ||

//               firebaseUser.email ||

//               email,

//           };



//           console.log(

//             "👨‍👩‍👧 Registration parent:",

//             parentProfile

//           );

//         }



//         // ---------------------------------------------------

//         // JUNGLE FRIEND

//         //

//         // New user must choose friend separately.

//         // ---------------------------------------------------



//         jungleFriend = null;



//         localStorage.removeItem(

//           "jungleFriend"

//         );



//         console.log(

//           "🦊 New user → friend will be selected later"

//         );

//       } else {

//         // ===================================================

//         // EXISTING USER

//         //

//         // Firebase is the only source of truth.

//         // ===================================================



//         console.log(

//           "✅ EXISTING USER → Firebase data only"

//         );



//         console.log(

//           "🚫 Ignoring temporary localStorage profile data"

//         );

//       }



//       // =====================================================

//       // 9. SAVE PROFILE TO UID DOCUMENT

//       // =====================================================



//       const profileData = {

//         uid,



//         email:

//           firebaseUser.email ||

//           email,



//         verified: true,



//         childProfile:

//           childProfile || null,



//         parentProfile:

//           parentProfile || null,



//         jungleFriend:

//           jungleFriend || null,



//         // Compatibility field

//         name:

//           childProfile?.name ||

//           existingUser?.name ||

//           "",



//         avatar:

//           existingUser?.avatar ||

//           "🐵",



//         createdAt:

//           existingUser?.createdAt ||

//           new Date().toISOString(),



//         lastLogin:

//           new Date().toISOString(),

//       };



//       await setDoc(

//         userRef,

//         profileData,

//         {

//           merge: true,

//         }

//       );



//       console.log(

//         "✅ User profile saved to UID document"

//       );



//       // =====================================================

//       // 10. READ FINAL FIREBASE DATA

//       // =====================================================



//       const latestUserSnap =

//         await getDoc(userRef);



//       const firebaseUserData =

//         latestUserSnap.exists()

//           ? latestUserSnap.data()

//           : {};



//       console.log(

//         "🔥 FINAL FIREBASE DATA:",

//         firebaseUserData

//       );



//       // =====================================================

//       // 11. UPDATE LOCAL STORAGE CACHE

//       //

//       // Firebase = source of truth

//       // localStorage = cache only

//       // =====================================================



//       // -----------------------------------------------------

//       // CHILD

//       // -----------------------------------------------------



//       if (

//         firebaseUserData.childProfile

//       ) {

//         localStorage.setItem(

//           "childProfile",

//           JSON.stringify(

//             firebaseUserData.childProfile

//           )

//         );

//       } else {

//         localStorage.removeItem(

//           "childProfile"

//         );

//       }



//       // -----------------------------------------------------

//       // PARENT

//       // -----------------------------------------------------



//       if (

//         firebaseUserData.parentProfile

//       ) {

//         localStorage.setItem(

//           "parentProfile",

//           JSON.stringify(

//             firebaseUserData.parentProfile

//           )

//         );

//       } else {

//         localStorage.removeItem(

//           "parentProfile"

//         );

//       }



//       // -----------------------------------------------------

//       // FRIEND

//       // -----------------------------------------------------



//       if (

//         firebaseUserData.jungleFriend

//       ) {

//         localStorage.setItem(

//           "jungleFriend",

//           JSON.stringify(

//             firebaseUserData.jungleFriend

//           )

//         );

//       } else {

//         localStorage.removeItem(

//           "jungleFriend"

//         );

//       }



//       // -----------------------------------------------------

//       // EMAIL

//       // -----------------------------------------------------



//       localStorage.setItem(

//         "loginEmail",

//         firebaseUserData.email ||

//           firebaseUser.email ||

//           email

//       );



//       // =====================================================

//       // 12. CREATE PROGRESS DOCUMENT IF NEEDED

//       // =====================================================



//       const progressRef = doc(

//         db,

//         "progress",

//         uid

//       );



//       const progressSnap =

//         await getDoc(progressRef);



//       if (!progressSnap.exists()) {

//         await setDoc(

//           progressRef,

//           {

//             userId: uid,

//             stars: 0,

//             streak: 0,

//             history: [],

//             activeGames: {},

//           }

//         );



//         console.log(

//           "🌱 Progress document created"

//         );

//       } else {

//         console.log(

//           "📊 Progress document already exists"

//         );

//       }



//       // =====================================================

//       // 13. CHECK PROFILE COMPLETION

//       // =====================================================



//       const hasChildProfile =

//         Boolean(

//           firebaseUserData

//             ?.childProfile

//             ?.name

//         ) &&

//         Boolean(

//           firebaseUserData

//             ?.childProfile

//             ?.age

//         );



//       const hasJungleFriend =

//         Boolean(

//           firebaseUserData

//             ?.jungleFriend

//             ?.name

//         );



//       console.log(

//         "👧 Child profile:",

//         firebaseUserData?.childProfile

//       );



//       console.log(

//         "🦊 Jungle friend:",

//         firebaseUserData?.jungleFriend

//       );



//       console.log(

//         "👧 Child profile complete:",

//         hasChildProfile

//       );



//       console.log(

//         "🦊 Friend selected:",

//         hasJungleFriend

//       );



//       // =====================================================

//       // 14. ADMIN

//       // =====================================================



//       if (isAdmin) {

//         console.log(

//           "👑 Admin → /admin"

//         );



//         navigate("/admin");



//         return;

//       }



//       // =====================================================

//       // 15. BRAND NEW USER

//       // =====================================================



//       if (!userExists) {

//         console.log(

//           "🆕 BRAND NEW USER → Choose Friend"

//         );



//         localStorage.setItem(

//           "appProgress",

//           "child-created"

//         );



//         localStorage.removeItem(

//           "jungleFriend"

//         );



//         navigate(

//           "/choose-friend"

//         );



//         return;

//       }



//       // =====================================================

//       // 16. EXISTING COMPLETE USER

//       // =====================================================



//       if (

//         hasChildProfile &&

//         hasJungleFriend

//       ) {

//         console.log(

//           "✅ EXISTING COMPLETE USER → Jungle Hero"

//         );



//         localStorage.setItem(

//           "appProgress",

//           "friend-chosen"

//         );



//         navigate(

//           "/jungle-hero"

//         );



//         return;

//       }



//       // =====================================================

//       // 17. EXISTING INCOMPLETE USER

//       // =====================================================



//       console.log(

//         "🆕 EXISTING INCOMPLETE USER → Choose Friend"

//       );



//       navigate(

//         "/choose-friend"

//       );



//     } catch (error) {

//       console.error(

//         "❌ OTP verification error:",

//         error

//       );



//       // Keep the useful Firebase error

//       // in the console, but show a cleaner

//       // message to the user.



//       if (

//         error?.code ===

//         "permission-denied"

//       ) {

//         setError(

//           "Firebase permission denied. Please check your Firestore rules."

//         );

//       } else {

//         setError(

//           error?.message ||

//             "Something went wrong. Please try again."

//         );

//       }



//     } finally {

//       setLoading(false);

//     }

//   };



//   // =========================================================

//   // RESEND OTP

//   // =========================================================



//   const resendOtp = async () => {

//     setError("");



//     if (!email) {

//       setError(

//         "Email not found. Please login again."

//       );



//       return;

//     }



//     try {

//       const response =

//         await fetch(

//           `${import.meta.env.VITE_API_URL}/api/send-otp`,

//           {

//             method: "POST",



//             headers: {

//               "Content-Type":

//                 "application/json",

//             },



//             body: JSON.stringify({

//               email,

//             }),

//           }

//         );



//       const data =

//         await response.json();



//       if (!response.ok) {

//         setError(

//           data.message ||

//             "Failed to resend OTP."

//         );



//         return;

//       }



//       setOtp(

//         new Array(6).fill("")

//       );



//       setTimer(30);



//       inputsRef.current[0]?.focus();



//       alert(

//         "OTP resent successfully 📧"

//       );



//     } catch (error) {

//       console.error(

//         "❌ Resend OTP error:",

//         error

//       );



//       setError(

//         "Failed to resend OTP."

//       );

//     }

//   };



//   // =========================================================

//   // UI ONLY

//   // =========================================================



//   return (

//     <div className="otp-page">



//       {/* Background overlay */}

//       <div className="otp-overlay"></div>



//       {/* =====================================================

//           BRAND

//       ===================================================== */}



//       <header className="otp-brand">



//         <div className="otp-brand-title">



//           <span className="otp-brand-curio">

//             Curio

//           </span>



//           <span className="otp-brand-kids">

//             Kids

//           </span>



//           <span className="otp-brand-sprout">

//             🌱

//           </span>



//         </div>



//         <div className="otp-brand-tagline">

//           Play&nbsp; • &nbsp;Learn&nbsp; • &nbsp;Grow

//         </div>



//       </header>



//       {/* =====================================================

//           DECORATIONS

//       ===================================================== */}



//       <div className="otp-leaf otp-leaf-one">

//         🍃

//       </div>



//       <div className="otp-leaf otp-leaf-two">

//         🌿

//       </div>



//       <div className="otp-leaf otp-leaf-three">

//         🍃

//       </div>



//       <div className="otp-butterfly">

//         🦋

//       </div>



//       <div className="otp-flower otp-flower-one">

//         🌺

//       </div>



//       <div className="otp-flower otp-flower-two">

//         🌸

//       </div>



//       {/* =====================================================

//           MAIN

//       ===================================================== */}



//       <main className="otp-main">



//         <div className="otp-card">



//           {/* =================================================

//               LOCK

//           ================================================= */}



//           <div className="otp-lock-area">



//             <span className="otp-lock-sprout">

//               🌱

//             </span>



//             <span className="otp-lock">

//               🔐

//             </span>



//           </div>



//           {/* =================================================

//               HEADING

//           ================================================= */}



//           <h1>

//             Verify Your Journey

//           </h1>



//           <p className="otp-subtitle">

//             Enter the code we sent to your email

//           </p>



//           {/* =================================================

//               EMAIL

//           ================================================= */}



//           <div className="otp-email-box">



//             <span className="otp-email-icon">

//               ✉️

//             </span>



//             <div className="otp-email-content">



//               <small>

//                 Verification code sent to

//               </small>



//               <strong>

//                 {email || "your email"}

//               </strong>



//             </div>



//           </div>



//           {/* =================================================

//               OTP INPUTS

//           ================================================= */}



//           <div className="otp-input-container">



//             {otp.map(

//               (digit, index) => (

//                 <input

//                   key={index}



//                   ref={(element) => {

//                     inputsRef.current[index] =

//                       element;

//                   }}



//                   className={

//                     `otp-box ${

//                       digit

//                         ? "otp-box-filled"

//                         : ""

//                     }`

//                   }



//                   type="text"



//                   inputMode="numeric"



//                   maxLength={1}



//                   value={digit}



//                   onChange={(event) =>

//                     handleChange(

//                       event.target.value,

//                       index

//                     )

//                   }



//                   onKeyDown={(event) =>

//                     handleKeyDown(

//                       event,

//                       index

//                     )

//                   }



//                   autoComplete={

//                     index === 0

//                       ? "one-time-code"

//                       : "off"

//                   }

//                 />

//               )

//             )}



//           </div>



//           {/* =================================================

//               ERROR

//           ================================================= */}



//           {error && (

//             <div className="otp-error">

//               ⚠️ {error}

//             </div>

//           )}



//           {/* =================================================

//               VERIFY

//           ================================================= */}



//           <button

//             className="verify-otp-button"

//             onClick={verifyOtp}

//             disabled={loading}

//           >



//             <span>

//               🌿

//             </span>



//             {loading

//               ? "Verifying..."

//               : "Verify OTP"}



//           </button>



//           {/* =================================================

//               RESEND

//           ================================================= */}



//           <div className="otp-resend-area">



//             {timer > 0 ? (

//               <>

//                 <span className="resend-label">

//                   Didn’t receive the code?

//                 </span>



//                 <span className="resend-timer">

//                   Resend OTP in {timer}s

//                 </span>

//               </>

//             ) : (

//               <button

//                 onClick={resendOtp}

//                 className="resend-button"

//               >

//                 🔄 Resend OTP

//               </button>

//             )}



//           </div>



//           {/* =================================================

//               SECURITY NOTE

//           ================================================= */}



//           <div className="otp-security">

//             🔐 Your verification is secure and private

//           </div>



//         </div>



//       </main>



//       {/* =====================================================

//           CHATBOT

//       ===================================================== */}



//       <button

//         className="otp-chatbot"

//         type="button"

//         aria-label="CurioKids assistant"

//       >

//         🤖

//       </button>



//     </div>

//   );

// }





// import { useState, useRef, useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// import { auth, db } from "../firebase";

// import {
//   isSignInWithEmailLink,
//   signInWithEmailLink,
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

//   // Automatically complete sign-in when Firebase returns the user to this page.
//   useEffect(() => {
//     if (isSignInWithEmailLink(auth, window.location.href)) {
//       verifyOtp();
//     }
//     // Run once on page entry; the Firebase link is the trigger.
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

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

//     if (!isSignInWithEmailLink(auth, window.location.href)) {
//       setError("Please open the sign-in link sent to your email.");
//       return;
//     }

//     setLoading(true);

//     try {
//       let emailForSignIn =
//         localStorage.getItem("emailForSignIn") ||
//         localStorage.getItem("loginEmail") ||
//         "";

//       if (!emailForSignIn) {
//         emailForSignIn = window.prompt(
//           "Enter the email address that received the sign-in link:"
//         ) || "";
//       }

//       emailForSignIn = emailForSignIn.trim().toLowerCase();

//       if (!emailForSignIn) {
//         setError("Email is required to complete sign-in.");
//         return;
//       }

//       const userCredential = await signInWithEmailLink(
//         auth,
//         emailForSignIn,
//         window.location.href
//       );

//       const firebaseUser = userCredential.user;
//       const uid = firebaseUser.uid;

//       localStorage.removeItem("emailForSignIn");
//       window.history.replaceState({}, document.title, "/otp");

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

//           `${import.meta.env.VITE_API_URL}/api/send-otp`,

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

//             Complete Your Journey

//           </h1>

//           <p className="otp-subtitle">

//             Open the sign-in link sent to your email to continue

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

//                 Sign-in link sent to

//               </small>

//               <strong>

//                 {email || "your email"}

//               </strong>

//             </div>

//           </div>

//           <div className="otp-input-container">
//             <p className="otp-subtitle">
//               🌱 Your secure sign-in is being completed. Please keep this page open.
//             </p>
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

//               : "Complete Sign-in"}

//           </button>

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
  isSignInWithEmailLink,
  signInWithEmailLink,
  getIdTokenResult,
} from "firebase/auth";

import {

  doc,

  getDoc,

  setDoc,

} from "firebase/firestore";

import "../styles/OtpVerify.css";

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

  const [emailForSignIn, setEmailForSignIn] = useState(() =>
    (localStorage.getItem("emailForSignIn") || localStorage.getItem("loginEmail") || "")
      .trim()
      .toLowerCase()
  );

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  // Automatically complete sign-in when Firebase returns the user to this page.
  useEffect(() => {
    // Keep the email editable on the page before completing sign-in.
    // This avoids browser prompts and lets the user correct a stale saved email.
    // Run once on page entry; the Firebase link is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (!isSignInWithEmailLink(auth, window.location.href)) {
      setError("Please open the sign-in link sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = emailForSignIn.trim().toLowerCase();

      if (!normalizedEmail) {
        setError("Enter the email address where you received this sign-in link.");
        return;
      }

      localStorage.setItem("emailForSignIn", normalizedEmail);
      localStorage.setItem("loginEmail", normalizedEmail);

      const userCredential = await signInWithEmailLink(
        auth,
        normalizedEmail,
        window.location.href
      );

      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      localStorage.removeItem("emailForSignIn");
      window.history.replaceState({}, document.title, "/otp");

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

            Complete Your Journey

          </h1>

          <p className="otp-subtitle">

            Open the sign-in link sent to your email to continue

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

                Sign-in link sent to

              </small>

              <strong>

                {email || "your email"}

              </strong>

            </div>

          </div>

          <div className="otp-input-container">
            <label className="otp-email-fallback" style={{ display: "block", marginTop: "16px", textAlign: "left" }}>
              <span style={{ display: "block", marginBottom: "8px" }}>Email address used to request the link</span>
              <input
                type="email"
                value={emailForSignIn}
                onChange={(event) => {
                  setEmailForSignIn(event.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
                style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #cbd9bf", borderRadius: "12px", font: "inherit" }}
              />
            </label>
            <p className="otp-subtitle">
              🌱 Your secure sign-in is being completed. Please keep this page open.
            </p>
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

              : "Complete Sign-in"}

          </button>

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
