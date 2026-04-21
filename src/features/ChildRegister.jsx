// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ChildRegister.css";

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

//   const saveChild = () => {
//     if (!validateForm()) return;

//     const childProfile = {
//       name: name.trim(),
//       age,
//       createdAt: new Date().toISOString(),
//     };

//     localStorage.setItem("childProfile", JSON.stringify(childProfile));
//     localStorage.setItem("appProgress", "child-created");

//     // Navigate instead of onComplete
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

//         {/* 🌱 SAVE BUTTON */}
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

// 🔥 Firebase
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ChildRegister({ onComplete }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  // 🔹 Validation function
  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Only letters are allowed";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!age) {
      newErrors.age = "Please select age";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChild = async () => {
    if (!validateForm()) return;

    const childProfile = {
      name: name.trim(),
      age,
      createdAt: new Date().toISOString(),
    };

    // ✅ SAVE LOCAL (FAST ACCESS)
    localStorage.setItem("childProfile", JSON.stringify(childProfile));
    localStorage.setItem("appProgress", "child-created");

    // ✅ SAVE TO FIREBASE (USER SPECIFIC)
    try {
      const userId = localStorage.getItem("userId");

      if (userId) {
        await setDoc(
          doc(db, "users", userId),
          {
            childProfile,
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Firebase save error:", err);
    }

    // 👉 Navigate
    navigate("/parent-register");
  };

  return (
    <div className="child-register">
      <div className="register-card">
        <h1>Hi there! 👋</h1>
        <p>Let’s create your jungle profile</p>

        <input
          type="text"
          placeholder="Your Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <select
          className="input"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        >
          <option value="">Select your age</option>
          <option value="3-4">3 – 4 years</option>
          <option value="5-6">5 – 6 years</option>
          <option value="7-8">7 – 8 years</option>
          <option value="9-10">9 – 10 years</option>
        </select>
        {errors.age && <p className="error">{errors.age}</p>}

        <button className="save-btn" onClick={saveChild}>
          🌱 Save My Profile
        </button>

        <p className="note">No email. No passwords. Just play.</p>
      </div>
    </div>
  );
}