// import { useEffect, useState } from "react";
// import "../styles/Profile.css";
// import { useGame } from "../context/GameContext";

// export default function Profile() {
//   const { stars } = useGame();

//   const [name, setName] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState("🐵");

//   // 🎭 SKINS
//   const skins = [
//     { icon: "🐵", cost: 0 },
//     { icon: "🦊", cost: 5 },
//     { icon: "🐯", cost: 10 },
//     { icon: "🦁", cost: 15 },
//     { icon: "🐸", cost: 20 },
//   ];

//   // 🔥 LOAD DATA
//   useEffect(() => {
//     const child = JSON.parse(localStorage.getItem("childProfile"));
//     const avatar = localStorage.getItem("avatar");

//     if (child) setName(child.name);
//     if (avatar) setSelectedAvatar(avatar);
//   }, []);

//   // 💾 SAVE NAME
//   const saveName = () => {
//     if (!name.trim()) return;

//     const child = JSON.parse(localStorage.getItem("childProfile")) || {};
//     child.name = name.trim();

//     localStorage.setItem("childProfile", JSON.stringify(child));
//     setEditing(false);
//   };

//   // 🎯 SELECT AVATAR
//   const selectAvatar = (skin) => {
//     if (stars < skin.cost) {
//       alert("❌ Not enough stars!");
//       return;
//     }

//     setSelectedAvatar(skin.icon);
//     localStorage.setItem("avatar", skin.icon);
//   };

//   return (
//     <div className="profile-page">

//       {/* 👤 NAME SECTION */}
//       <div className="name-section">
//         {editing ? (
//           <>
//             <input
//               className="name-input"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <button className="save-btn" onClick={saveName}>
//               Save ✅
//             </button>
//           </>
//         ) : (
//           <>
//             <h1>👤 {name}</h1>
//             <button
//               className="edit-btn"
//               onClick={() => setEditing(true)}
//             >
//               ✏️ Edit
//             </button>
//           </>
//         )}
//       </div>

//       {/* 🎭 AVATAR */}
//       <div className="avatar-preview">
//         {selectedAvatar}
//       </div>

//       <h2>🎨 Choose Your Avatar</h2>

//       <div className="avatar-grid">
//         {skins.map((skin, i) => {
//           const unlocked = stars >= skin.cost;

//           return (
//             <div
//               key={i}
//               className={`avatar-card ${
//                 unlocked ? "unlocked" : "locked"
//               }`}
//               onClick={() => unlocked && selectAvatar(skin)}
//             >
//               <span className="avatar-icon">{skin.icon}</span>

//               {unlocked ? (
//                 <p>✅</p>
//               ) : (
//                 <p>🔒 {skin.cost}⭐</p>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* ⭐ STARS */}
//       <div className="stars-box">
//         ⭐ Stars: {stars}
//       </div>

//     </div>
//   );
// }





import { useEffect, useState } from "react";
import "../styles/Profile.css";
import { useGame } from "../context/GameContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Profile() {
  const { stars = 0 } = useGame();

  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("🐵");
  const [loading, setLoading] = useState(true);

  // 🎭 SKINS
  const skins = [
    { icon: "🐵", cost: 0 },
    { icon: "🦊", cost: 5 },
    { icon: "🐯", cost: 10 },
    { icon: "🦁", cost: 15 },
    { icon: "🐸", cost: 20 },
  ];

  // 🔥 LOAD PROFILE FROM FIREBASE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.log("❌ No Firebase userId found");
          setLoading(false);
          return;
        }

        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();

          setName(data.name || "");
          setSelectedAvatar(data.avatar || "🐵");

          // Keep localStorage in sync
          const child = {
            ...JSON.parse(
              localStorage.getItem("childProfile") || "{}"
            ),
            name: data.name || "",
          };

          localStorage.setItem(
            "childProfile",
            JSON.stringify(child)
          );

          localStorage.setItem(
            "avatar",
            data.avatar || "🐵"
          );
        } else {
          // Fallback to localStorage if Firebase profile
          // does not exist yet
          const child = JSON.parse(
            localStorage.getItem("childProfile") || "{}"
          );

          const avatar =
            localStorage.getItem("avatar") || "🐵";

          setName(child.name || "");
          setSelectedAvatar(avatar);
        }
      } catch (error) {
        console.error(
          "❌ Failed to load profile:",
          error
        );

        // Fallback to localStorage
        const child = JSON.parse(
          localStorage.getItem("childProfile") || "{}"
        );

        const avatar =
          localStorage.getItem("avatar") || "🐵";

        setName(child.name || "");
        setSelectedAvatar(avatar);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 💾 SAVE NAME
  const saveName = async () => {
    if (!name.trim()) return;

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("❌ User not logged in!");
        return;
      }

      const cleanName = name.trim();

      const userRef = doc(db, "users", userId);

      await setDoc(
        userRef,
        {
          name: cleanName,
        },
        {
          merge: true,
        }
      );

      // Keep localStorage synced
      const child = JSON.parse(
        localStorage.getItem("childProfile") || "{}"
      );

      child.name = cleanName;

      localStorage.setItem(
        "childProfile",
        JSON.stringify(child)
      );

      setName(cleanName);
      setEditing(false);

      alert("✅ Name saved!");
    } catch (error) {
      console.error(
        "❌ Failed to save name:",
        error
      );

      alert("❌ Could not save name!");
    }
  };

  // 🎯 SELECT AVATAR
  const selectAvatar = async (skin) => {
    if (stars < skin.cost) {
      alert("❌ Not enough stars!");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("❌ User not logged in!");
        return;
      }

      const userRef = doc(db, "users", userId);

      await setDoc(
        userRef,
        {
          avatar: skin.icon,
        },
        {
          merge: true,
        }
      );

      setSelectedAvatar(skin.icon);

      // Keep localStorage synced
      localStorage.setItem(
        "avatar",
        skin.icon
      );

      alert("🎉 Avatar updated!");
    } catch (error) {
      console.error(
        "❌ Failed to save avatar:",
        error
      );

      alert("❌ Could not update avatar!");
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <div className="profile-page">
        <div className="name-section">
          <h1>Loading profile... 🌱</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* 👤 NAME SECTION */}
      <div className="name-section">
        {editing ? (
          <>
            <input
              className="name-input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

            <button
              className="save-btn"
              onClick={saveName}
            >
              Save ✅
            </button>
          </>
        ) : (
          <>
            <h1>
              👤 {name || "Little Explorer"}
            </h1>

            <button
              className="edit-btn"
              onClick={() =>
                setEditing(true)
              }
            >
              ✏️ Edit
            </button>
          </>
        )}
      </div>

      {/* 🎭 AVATAR */}
      <div className="avatar-preview">
        {selectedAvatar}
      </div>

      <h2>🎨 Choose Your Avatar</h2>

      <div className="avatar-grid">
        {skins.map((skin, i) => {
          const unlocked =
            stars >= skin.cost;

          return (
            <div
              key={i}
              className={`avatar-card ${
                unlocked
                  ? "unlocked"
                  : "locked"
              }`}
              onClick={() =>
                unlocked &&
                selectAvatar(skin)
              }
            >
              <span className="avatar-icon">
                {skin.icon}
              </span>

              {unlocked ? (
                <p>✅</p>
              ) : (
                <p>
                  🔒 {skin.cost}⭐
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ⭐ STARS */}
      <div className="stars-box">
        ⭐ Stars: {stars}
      </div>

    </div>
  );
}