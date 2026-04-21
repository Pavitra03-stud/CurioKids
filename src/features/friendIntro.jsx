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



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔥 Firebase
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FriendIntro() {
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    const savedFriend = localStorage.getItem("jungleFriend");
    if (savedFriend) {
      setFriend(JSON.parse(savedFriend));
    }
  }, []);

  // ✅ ACTIVITY LOGGER
  const logEntry = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await addDoc(collection(db, "activity"), {
      userId,
      action: "enter",
      screen: "friend-intro",
      module: "onboarding",
      timestamp: new Date(),
    });
  };

  const handleEnter = async () => {

    localStorage.setItem("appProgress", "jungle-hero");

    // ✅ LOG ENTRY
    await logEntry();

    navigate("/kids-home");
  };

  if (!friend) {
    return <h2 style={{ padding: "40px" }}>Loading jungle friend… 🌱</h2>;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <img src={friend.image} alt={friend.name} style={styles.image} />

        <div style={styles.box}>
          <h2>🌟 Welcome to CurioKids!</h2>

          <p>
            Hi there! 👋 <br /><br />
            I’m <b>{friend.name}</b>, your jungle friend 🐾 <br /><br />
            Ready to explore the jungle with me?
          </p>

          <button style={styles.button} onClick={handleEnter}>
            Enter Jungle Home 🌴
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    height: "100vh",
    background: "linear-gradient(#1b5e20, #43a047)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    background: "#fff3d6",
    padding: "40px",
    borderRadius: "24px",
    display: "flex",
    gap: "30px",
    alignItems: "center",
  },
  image: {
    width: "220px",
  },
  box: {
    maxWidth: "420px",
  },
  button: {
    marginTop: "20px",
    padding: "14px 26px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#ff9800",
    color: "#fff",
    cursor: "pointer",
  },
};