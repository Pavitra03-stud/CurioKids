// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function FriendIntro() {
//   const navigate = useNavigate();
//   const [friend, setFriend] = useState(null);

//   useEffect(() => {
//     const savedFriend = localStorage.getItem("jungleFriend");
//     if (savedFriend) {
//       setFriend(JSON.parse(savedFriend));
//     }
//   }, []);

//   const handleEnter = () => {
//     localStorage.setItem("appProgress", "jungle-hero");

//     // 👉 Navigate directly
//     navigate("/kids-home");
//   };

//   if (!friend) {
//     return <h2 style={{ padding: "40px" }}>Loading jungle friend… 🌱</h2>;
//   }

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.container}>
//         <img src={friend.image} alt={friend.name} style={styles.image} />

//         <div style={styles.box}>
//           <h2>🌟 Welcome to CurioKids!</h2>

//           <p>
//             Hi there! 👋 <br /><br />
//             I’m <b>{friend.name}</b>, your jungle friend 🐾 <br /><br />
//             Ready to explore the jungle with me?
//           </p>

//           <button style={styles.button} onClick={handleEnter}>
//             Enter Jungle Home 🌴
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   overlay: {
//     height: "100vh",
//     background: "linear-gradient(#1b5e20, #43a047)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     background: "#fff3d6",
//     padding: "40px",
//     borderRadius: "24px",
//     display: "flex",
//     gap: "30px",
//     alignItems: "center",
//   },
//   image: {
//     width: "220px",
//   },
//   box: {
//     maxWidth: "420px",
//   },
//   button: {
//     marginTop: "20px",
//     padding: "14px 26px",
//     fontSize: "16px",
//     borderRadius: "12px",
//     border: "none",
//     background: "#ff9800",
//     color: "#fff",
//     cursor: "pointer",
//   },
// };



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // 🔥 Firebase
// import { db } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";

// export default function FriendIntro() {
//   const navigate = useNavigate();
//   const [friend, setFriend] = useState(null);

//   useEffect(() => {
//     const savedFriend = localStorage.getItem("jungleFriend");
//     if (savedFriend) {
//       setFriend(JSON.parse(savedFriend));
//     }
//   }, []);

//   // ✅ ACTIVITY LOGGER
//   const logEntry = async () => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     await addDoc(collection(db, "activity"), {
//       userId,
//       action: "enter",
//       screen: "friend-intro",
//       module: "onboarding",
//       timestamp: new Date(),
//     });
//   };

//   const handleEnter = async () => {

//     localStorage.setItem("appProgress", "jungle-hero");

//     // ✅ LOG ENTRY
//     await logEntry();

//     navigate("/kids-home");
//   };

//   if (!friend) {
//     return <h2 style={{ padding: "40px" }}>Loading jungle friend… 🌱</h2>;
//   }

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.container}>
//         <img src={friend.image} alt={friend.name} style={styles.image} />

//         <div style={styles.box}>
//           <h2>🌟 Welcome to CurioKids!</h2>

//           <p>
//             Hi there! 👋 <br /><br />
//             I’m <b>{friend.name}</b>, your jungle friend 🐾 <br /><br />
//             Ready to explore the jungle with me?
//           </p>

//           <button style={styles.button} onClick={handleEnter}>
//             Enter Jungle Home 🌴
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   overlay: {
//     height: "100vh",
//     background: "linear-gradient(#1b5e20, #43a047)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   container: {
//     background: "#fff3d6",
//     padding: "40px",
//     borderRadius: "24px",
//     display: "flex",
//     gap: "30px",
//     alignItems: "center",
//   },
//   image: {
//     width: "220px",
//   },
//   box: {
//     maxWidth: "420px",
//   },
//   button: {
//     marginTop: "20px",
//     padding: "14px 26px",
//     fontSize: "16px",
//     borderRadius: "12px",
//     border: "none",
//     background: "#ff9800",
//     color: "#fff",
//     cursor: "pointer",
//   },
// };



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔥 Firebase
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

export default function FriendIntro() {
  const navigate = useNavigate();

  const [friend, setFriend] = useState(null);

  // =========================================================
  // 🌴 LOAD SELECTED JUNGLE FRIEND
  // =========================================================

  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");

    if (savedFriend) {
      try {
        setFriend(JSON.parse(savedFriend));
      } catch (error) {
        console.error(
          "❌ Failed to load jungle friend:",
          error
        );
      }
    }
  }, []);

  // =========================================================
  // 📊 ACTIVITY LOGGER
  // =========================================================

  const logEntry = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn("⚠️ No Firebase userId found");
        return;
      }

      await addDoc(collection(db, "activity"), {
        userId,
        action: "enter",
        screen: "friend-intro",
        module: "onboarding",
        timestamp: Timestamp.now(),
      });

      console.log("✅ Friend intro entry logged");
    } catch (error) {
      console.error(
        "❌ Failed to log friend intro:",
        error
      );
    }
  };

  // =========================================================
  // 🌴 ENTER JUNGLE
  // =========================================================

  const handleEnter = async () => {
    try {
      // Save current app stage
      localStorage.setItem(
        "appProgress",
        "jungle-hero"
      );

      // Log entry
      await logEntry();

      // Go to Kids Home
      navigate("/kids-home");
    } catch (error) {
      console.error(
        "❌ Error entering jungle:",
        error
      );

      // Navigate even if logging fails
      navigate("/kids-home");
    }
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (!friend) {
    return (
      <div style={styles.loading}>
        <h2>Loading jungle friend… 🌱</h2>
      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <img
          src={friend.image}
          alt={friend.name}
          style={styles.image}
        />

        <div style={styles.box}>
          <h2>🌟 Welcome to CurioKids!</h2>

          <p>
            Hi there! 👋
            <br />
            <br />
            I’m <b>{friend.name}</b>, your jungle friend 🐾
            <br />
            <br />
            Ready to explore the jungle with me?
          </p>

          <button
            style={styles.button}
            onClick={handleEnter}
          >
            Enter Jungle Home 🌴
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// 🎨 STYLES
// =========================================================

const styles = {
  overlay: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1b5e20, #43a047)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  loading: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1b5e20, #43a047)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    padding: "20px",
  },

  container: {
    width: "100%",
    maxWidth: "850px",
    background: "#fff3d6",
    padding: "40px",
    borderRadius: "24px",
    display: "flex",
    gap: "30px",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    boxShadow:
      "0 15px 40px rgba(0, 0, 0, 0.2)",
  },

  image: {
    width: "220px",
    maxWidth: "35%",
    height: "auto",
    objectFit: "contain",
  },

  box: {
    maxWidth: "420px",
    width: "100%",
  },

  button: {
    marginTop: "20px",
    padding: "14px 26px",
    fontSize: "16px",
    fontWeight: "700",
    borderRadius: "12px",
    border: "none",
    background: "#ff9800",
    color: "#fff",
    cursor: "pointer",
  },
};