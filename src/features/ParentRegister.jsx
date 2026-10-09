// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "../styles/ParentRegister.css";

// export default function ParentRegister() {
//   const navigate = useNavigate();

//   const [parentName, setParentName] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // =========================================================
//   // VALIDATION
//   // =========================================================

//   const isValidName = (value) =>
//     /^[A-Za-z\s]+$/.test(value);

//   const isValidEmail = (value) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   // =========================================================
//   // REGISTER
//   // =========================================================

//   const saveParent = async () => {
//     setError("");

//     // ---------------------------------------------------------
//     // NAME VALIDATION
//     // ---------------------------------------------------------

//     const cleanName = parentName.trim();

//     if (!cleanName) {
//       setError("Please enter your name 😊");
//       return;
//     }

//     if (cleanName.length < 2) {
//       setError("Name should be at least 2 letters 🌿");
//       return;
//     }

//     if (!isValidName(cleanName)) {
//       setError("Name should contain only letters ✨");
//       return;
//     }

//     // ---------------------------------------------------------
//     // EMAIL VALIDATION
//     // ---------------------------------------------------------

//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail) {
//       setError("Please enter your email address 📧");
//       return;
//     }

//     if (!isValidEmail(cleanEmail)) {
//       setError("Please enter a valid email address 📩");
//       return;
//     }

//     // ---------------------------------------------------------
//     // REGISTER
//     // ---------------------------------------------------------

//     try {
//       setLoading(true);

//       // =======================================================
//       // 1. SAVE PARENT REGISTRATION DATA LOCALLY
//       //
//       // Firebase UID does NOT exist yet because OTP has not
//       // been verified.
//       // =======================================================

//       const parentData = {
//         parentName: cleanName,
//         email: cleanEmail,
//       };

//       localStorage.setItem(
//         "parentProfile",
//         JSON.stringify(parentData)
//       );

//       // Keep this for compatibility with the existing flow
//       localStorage.setItem(
//         "tempParent",
//         JSON.stringify(parentData)
//       );

//       localStorage.setItem(
//         "userName",
//         cleanName
//       );

//       localStorage.setItem(
//         "loginEmail",
//         cleanEmail
//       );

//       console.log(
//         "👨‍👩‍👧 Parent registration data:",
//         parentData
//       );

//       // =======================================================
//       // 2. BACKEND REGISTER
//       //
//       // No time limit is sent anymore.
//       // =======================================================

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: cleanName,
//             email: cleanEmail,
//           }),
//         }
//       );

//       const data = await res.json();

//       console.log(
//         "📝 Register response:",
//         data
//       );

//       // =======================================================
//       // 3. HANDLE REGISTER ERROR
//       // =======================================================

//       if (!res.ok) {
//         if (data.type === "USER_EXISTS") {
//           setError(
//             "User already registered! Redirecting to login 🔐"
//           );

//           setTimeout(() => {
//             navigate("/login");
//           }, 2000);

//           return;
//         }

//         setError(
//           data.message || "Register failed ❌"
//         );

//         return;
//       }

//       // =======================================================
//       // 4. SEND OTP
//       // =======================================================

//       const otpRes = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/send-otp`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: cleanEmail,
//           }),
//         }
//       );

//       const otpData = await otpRes.json();

//       console.log(
//         "📧 OTP response:",
//         otpData
//       );

//       if (!otpRes.ok) {
//         setError(
//           otpData.message ||
//             "Failed to send OTP ❌"
//         );

//         return;
//       }

//       // =======================================================
//       // IMPORTANT
//       //
//       // DO NOT CREATE childProfile HERE.
//       //
//       // The child profile comes from ChildRegister.
//       //
//       // Firebase users/{uid} will be created/updated after
//       // OTP verification.
//       // =======================================================

//       console.log(
//         "✅ Parent data saved temporarily."
//       );

//       console.log(
//         "📧 OTP sent. Waiting for verification."
//       );

//       // =======================================================
//       // 5. SUCCESS
//       // =======================================================

//       alert(
//         "OTP sent to your email 📧"
//       );

//       navigate("/otp");

//     } catch (err) {
//       console.error(
//         "❌ Registration error:",
//         err
//       );

//       setError(
//         "Server error. Try again 😢"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div className="parent-register">

//       <div className="parent-card">

//         {/* ===================================================
//             TITLE
//         =================================================== */}

//         <h1>
//           Parent Registration
//         </h1>

//         <p>
//           Help guide your child’s jungle journey
//         </p>

//         {/* ===================================================
//             PARENT NAME
//         =================================================== */}

//         <input
//           type="text"
//           placeholder="Parent Name"
//           className="input"
//           value={parentName}
//           onChange={(e) =>
//             setParentName(e.target.value)
//           }
//         />

//         {/* ===================================================
//             EMAIL
//         =================================================== */}

//         <input
//           type="email"
//           placeholder="Email Address"
//           className="input"
//           value={email}
//           onChange={(e) =>
//             setEmail(e.target.value)
//           }
//         />

//         {/* ===================================================
//             ERROR
//         =================================================== */}

//         {error && (
//           <p className="error-text">
//             {error}
//           </p>
//         )}

//         {/* ===================================================
//             REGISTER
//         =================================================== */}

//         <button
//           className="save-btn"
//           onClick={saveParent}
//           disabled={loading}
//         >
//           {loading
//             ? "Sending... ⏳"
//             : "🔐 Link & Unlock Jungle"}
//         </button>

//         {/* ===================================================
//             LOGIN
//         =================================================== */}

//         <p
//           className="login-link"
//           onClick={() =>
//             navigate("/login")
//           }
//           style={{
//             cursor: "pointer",
//           }}
//         >
//           Already registered? Login 🔐
//         </p>

//         {/* ===================================================
//             NOTE
//         =================================================== */}

//         <p className="note">
//           You’ll see progress, not pressure.
//         </p>

//       </div>

//     </div>
//   );
// }






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import "../styles/ParentRegister.css";

export default function ParentRegister() {
  const navigate = useNavigate();

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidName = (value) => /^[A-Za-z\s]+$/.test(value);

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const saveParent = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = parentName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || !isValidName(cleanName)) {
      setError("Enter a valid name using letters only 🌿");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Please enter a valid email address 📧");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters 🔐");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    let childProfile = null;

    try {
      const savedChild = localStorage.getItem("childProfile");

      if (savedChild) {
        const parsedChild = JSON.parse(savedChild);

        if (parsedChild?.name && parsedChild?.age) {
          childProfile = {
            name: String(parsedChild.name).trim(),
            age: String(parsedChild.age),
            createdAt:
              parsedChild.createdAt || new Date().toISOString(),
          };
        }
      }
    } catch {
      setError("Your child's temporary profile is invalid. Please register again.");
      return;
    }

    if (!childProfile) {
      setError("Please complete your child's registration first.");
      return;
    }

    setLoading(true);

    let createdUser = null;

    try {
      // 1. Create the Firebase Authentication account.
      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      createdUser = credential.user;
      const uid = createdUser.uid;

      // 2. Read any existing document before updating it.
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const existingData = userSnap.exists() ? userSnap.data() : {};

      // Preserve existing timeLimit and other parent profile fields.
      const existingParentProfile = existingData.parentProfile || {};

      const parentProfile = {
        ...existingParentProfile,
        parentName: cleanName,
        email: cleanEmail,
        uid,
        verified: false,
      };

      // 3. Save profiles in the structure already used by CurioKids.
      const userData = {
        uid,
        email: cleanEmail,
        name: childProfile.name,
        avatar: existingData.avatar || "🐵",
        parentProfile,
        childProfile,
        jungleFriend: existingData.jungleFriend || null,
        createdAt:
          existingData.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await setDoc(userRef, userData, { merge: true });

      // 4. Initialize progress only if it doesn't already exist.
      const progressRef = doc(db, "progress", uid);
      const progressSnap = await getDoc(progressRef);

      if (!progressSnap.exists()) {
        await setDoc(progressRef, {
          userId: uid,
          stars: 0,
          streak: 0,
          history: [],
          activeGames: {},
        });
      }

      // 5. Keep local storage as a cache, not the source of truth.
      localStorage.setItem("userId", uid);
      localStorage.setItem("loginEmail", cleanEmail);
      localStorage.setItem("userName", cleanName);
      localStorage.setItem("parentProfile", JSON.stringify(parentProfile));
      localStorage.setItem("tempParent", JSON.stringify({
        parentName: cleanName,
        email: cleanEmail,
      }));
      localStorage.setItem("childProfile", JSON.stringify(childProfile));
      localStorage.setItem("appProgress", "child-created");

      // 6. Email verification is separate from login.
      // A sending failure must not erase the account or its profile.
      let verificationMessage =
        "Your account is ready. You can continue your jungle journey! 🌱";

      try {
        await sendEmailVerification(createdUser);
        verificationMessage =
          "Account created! Check your email for a verification link. 🌱";
      } catch (verificationError) {
        console.warn(
          "Verification email could not be sent:",
          verificationError.code
        );

        verificationMessage =
          "Account created, but the verification email could not be sent. You can continue and try verification later.";
      }

      setSuccess(verificationMessage);

      // 7. Continue the existing child journey.
      // The parent is already signed in after account creation.
      navigate("/choose-friend", { replace: true });
    } catch (err) {
      console.error("Parent registration error:", err.code, err.message);

      // If account creation succeeded but a subsequent database write
      // failed, keep the user signed in so registration can be recovered.
      if (createdUser) {
        setError(
          "Your account was created, but saving your profile or progress failed. Please don't register again. Sign in and contact support to recover your profile."
        );
      } else {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("This email already has an account. Please log in 🔐");
            break;

          case "auth/invalid-email":
            setError("Please enter a valid email address.");
            break;

          case "auth/weak-password":
            setError("Please choose a stronger password.");
            break;

          case "auth/operation-not-allowed":
            setError("Enable Email/Password in Firebase Authentication.");
            break;

          case "auth/too-many-requests":
            setError("Too many attempts. Please wait and try again.");
            break;

          case "auth/network-request-failed":
            setError("Check your internet connection and try again.");
            break;

          default:
            setError(
              "Registration could not be completed. Please try again."
            );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-register">
      <div className="parent-card">
        <h1>Parent Registration</h1>
        <p>Help guide your child’s jungle journey</p>

        <form onSubmit={saveParent}>
          <input
            type="text"
            placeholder="Parent Name"
            className="input"
            value={parentName}
            onChange={(e) => {
              setParentName(e.target.value);
              setError("");
            }}
            autoComplete="name"
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            autoComplete="email"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Create Password (minimum 8 characters)"
            className="input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />

          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="success-text" role="status">
              {success}
            </p>
          )}

          <button
            className="save-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account... ⏳" : "🔐 Create Account"}
          </button>
        </form>

        <p
          className="login-link"
          onClick={() => {
            if (!loading) navigate("/login");
          }}
          style={{ cursor: "pointer" }}
        >
          Already registered? Login 🔐
        </p>

        <p className="note">
          You’ll see progress, not pressure.
        </p>
      </div>
    </div>
  );
}
