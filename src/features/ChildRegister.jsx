// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "../styles/ChildRegister.css";

// // export default function ChildRegister({ onComplete }) {
// //   const navigate = useNavigate();

// //   const [name, setName] = useState("");
// //   const [age, setAge] = useState("");
// //   const [errors, setErrors] = useState({});

// //   // 🔹 Validation function
// //   const validateForm = () => {
// //     let newErrors = {};

// //     if (!name.trim()) {
// //       newErrors.name = "Name is required";
// //     } else if (!/^[A-Za-z\s]+$/.test(name)) {
// //       newErrors.name = "Only letters are allowed";
// //     } else if (name.trim().length < 2) {
// //       newErrors.name = "Name must be at least 2 characters";
// //     }

// //     if (!age) {
// //       newErrors.age = "Please select age";
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const saveChild = () => {
// //     if (!validateForm()) return;

// //     const childProfile = {
// //       name: name.trim(),
// //       age,
// //       createdAt: new Date().toISOString(),
// //     };

// //     localStorage.setItem("childProfile", JSON.stringify(childProfile));
// //     localStorage.setItem("appProgress", "child-created");

// //     // Navigate instead of onComplete
// //     navigate("/parent-register");
// //   };

// //   return (
// //     <div className="child-register">
// //       <div className="register-card">
// //         <h1>Hi there! 👋</h1>
// //         <p>Let’s create your jungle profile</p>

// //         <input
// //           type="text"
// //           placeholder="Your Name"
// //           className="input"
// //           value={name}
// //           onChange={(e) => setName(e.target.value)}
// //         />
// //         {errors.name && <p className="error">{errors.name}</p>}

// //         <select
// //           className="input"
// //           value={age}
// //           onChange={(e) => setAge(e.target.value)}
// //         >
// //           <option value="">Select your age</option>
// //           <option value="3-4">3 – 4 years</option>
// //           <option value="5-6">5 – 6 years</option>
// //           <option value="7-8">7 – 8 years</option>
// //           <option value="9-10">9 – 10 years</option>
// //         </select>
// //         {errors.age && <p className="error">{errors.age}</p>}

// //         {/* 🌱 SAVE BUTTON */}
// //         <button className="save-btn" onClick={saveChild}>
// //           🌱 Save My Profile
// //         </button>

// //         <p className="note">No email. No passwords. Just play.</p>
// //       </div>
// //     </div>
// //   );
// // }




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ChildRegister.css";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { doc, setDoc } from "firebase/firestore";

// export default function ChildRegister({ onComplete }) {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [age, setAge] = useState("");
//   const [errors, setErrors] = useState({});

//   // 🔹 Validation function
//   const validateForm = () => {
//     let newErrors = {};

//     if (!name.trim()) {
//       newErrors.name = "Name is required";
//     } else if (!/^[A-Za-z\s]+$/.test(name)) {
//       newErrors.name = "Only letters are allowed";
//     } else if (name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }

//     if (!age) {
//       newErrors.age = "Please select age";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const saveChild = async () => {
//     if (!validateForm()) return;

//     const childProfile = {
//       name: name.trim(),
//       age,
//       createdAt: new Date().toISOString(),
//     };

//     // ✅ SAVE LOCAL (FAST ACCESS)
//     localStorage.setItem("childProfile", JSON.stringify(childProfile));
//     localStorage.setItem("appProgress", "child-created");

//     // ✅ SAVE TO FIREBASE (USER SPECIFIC)
//     try {
//       const userId = localStorage.getItem("userId");

//       if (userId) {
//         await setDoc(
//           doc(db, "users", userId),
//           {
//             childProfile,
//           },
//           { merge: true }
//         );
//       }
//     } catch (err) {
//       console.error("Firebase save error:", err);
//     }

//     // 👉 Navigate
//     navigate("/parent-register");
//   };

//   return (
//     <div className="child-register">
//       <div className="register-card">
//         <h1>Hi there! 👋</h1>
//         <p>Let’s create your jungle profile</p>

//         <input
//           type="text"
//           placeholder="Your Name"
//           className="input"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         {errors.name && <p className="error">{errors.name}</p>}

//         <select
//           className="input"
//           value={age}
//           onChange={(e) => setAge(e.target.value)}
//         >
//           <option value="">Select your age</option>
//           <option value="3-4">3 – 4 years</option>
//           <option value="5-6">5 – 6 years</option>
//           <option value="7-8">7 – 8 years</option>
//           <option value="9-10">9 – 10 years</option>
//         </select>
//         {errors.age && <p className="error">{errors.age}</p>}

//         <button className="save-btn" onClick={saveChild}>
//           🌱 Save My Profile
//         </button>

//         <p className="note">No email. No passwords. Just play.</p>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ChildRegister.css";

export default function ChildRegister({ onComplete }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    // ---------------------------------------------------------
    // NAME
    // ---------------------------------------------------------

    const cleanName = name.trim();

    if (!cleanName) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(cleanName)) {
      newErrors.name = "Only letters are allowed";
    } else if (cleanName.length < 2) {
      newErrors.name =
        "Name must be at least 2 characters";
    }

    // ---------------------------------------------------------
    // AGE
    // ---------------------------------------------------------

    if (!age) {
      newErrors.age = "Please select age";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // SAVE CHILD
  // =========================================================

  const saveChild = async () => {
    if (!validateForm()) {
      return;
    }

    const childProfile = {
      name: name.trim(),
      age,
      createdAt: new Date().toISOString(),
    };

    console.log(
      "👧 Child registration data:",
      childProfile
    );

    // =======================================================
    // SAVE TEMPORARILY IN LOCAL STORAGE
    //
    // At this stage the user may NOT have a Firebase UID yet.
    //
    // OtpVerify.jsx will later take this data and save it to:
    //
    // users/{firebaseUID}/childProfile
    // =======================================================

    localStorage.setItem(
      "childProfile",
      JSON.stringify(childProfile)
    );

    localStorage.setItem(
      "appProgress",
      "child-created"
    );

    // =======================================================
    // DO NOT SAVE USING localStorage.userId HERE
    //
    // A previous user's UID could still exist in the browser.
    //
    // If we write using that UID, the new child's information
    // could accidentally be saved to the previous account.
    //
    // Firebase saving will happen safely in OtpVerify.jsx
    // after the correct Firebase UID is obtained.
    // =======================================================

    console.log(
      "💾 Child profile saved temporarily."
    );

    // =======================================================
    // OPTIONAL onComplete CALLBACK
    // =======================================================

    if (typeof onComplete === "function") {
      try {
        await onComplete(childProfile);
      } catch (error) {
        console.error(
          "❌ onComplete error:",
          error
        );
      }
    }

    // =======================================================
    // NEXT STEP
    // =======================================================

    navigate("/parent-register");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="child-register">

      <div className="register-card">

        {/* ===================================================
            TITLE
        =================================================== */}

        <h1>
          Hi there! 👋
        </h1>

        <p>
          Let’s create your jungle profile
        </p>

        {/* ===================================================
            CHILD NAME
        =================================================== */}

        <input
          type="text"
          placeholder="Your Name"
          className="input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            // Clear name error while typing
            if (errors.name) {
              setErrors((prev) => ({
                ...prev,
                name: "",
              }));
            }
          }}
        />

        {errors.name && (
          <p className="error">
            {errors.name}
          </p>
        )}

        {/* ===================================================
            AGE
        =================================================== */}

        <select
          className="input"
          value={age}
          onChange={(e) => {
            setAge(e.target.value);

            // Clear age error after selection
            if (errors.age) {
              setErrors((prev) => ({
                ...prev,
                age: "",
              }));
            }
          }}
        >
          <option value="">
            Select your age
          </option>

          <option value="3-4">
            3 – 4 years
          </option>

          <option value="5-6">
            5 – 6 years
          </option>

          <option value="7-8">
            7 – 8 years
          </option>

          <option value="9-10">
            9 – 10 years
          </option>
        </select>

        {errors.age && (
          <p className="error">
            {errors.age}
          </p>
        )}

        {/* ===================================================
            SAVE BUTTON
        =================================================== */}

        <button
          className="save-btn"
          onClick={saveChild}
        >
          🌱 Save My Profile
        </button>

        {/* ===================================================
            NOTE
        =================================================== */}

        <p className="note">
          No email. No passwords. Just play.
        </p>

      </div>

    </div>
  );
}