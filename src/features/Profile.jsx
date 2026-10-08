// // import { useEffect, useState } from "react";
// // import "../styles/Profile.css";
// // import { useGame } from "../context/GameContext";

// // export default function Profile() {
// //   const { stars } = useGame();

// //   const [name, setName] = useState("");
// //   const [editing, setEditing] = useState(false);
// //   const [selectedAvatar, setSelectedAvatar] = useState("🐵");

// //   // 🎭 SKINS
// //   const skins = [
// //     { icon: "🐵", cost: 0 },
// //     { icon: "🦊", cost: 5 },
// //     { icon: "🐯", cost: 10 },
// //     { icon: "🦁", cost: 15 },
// //     { icon: "🐸", cost: 20 },
// //   ];

// //   // 🔥 LOAD DATA
// //   useEffect(() => {
// //     const child = JSON.parse(localStorage.getItem("childProfile"));
// //     const avatar = localStorage.getItem("avatar");

// //     if (child) setName(child.name);
// //     if (avatar) setSelectedAvatar(avatar);
// //   }, []);

// //   // 💾 SAVE NAME
// //   const saveName = () => {
// //     if (!name.trim()) return;

// //     const child = JSON.parse(localStorage.getItem("childProfile")) || {};
// //     child.name = name.trim();

// //     localStorage.setItem("childProfile", JSON.stringify(child));
// //     setEditing(false);
// //   };

// //   // 🎯 SELECT AVATAR
// //   const selectAvatar = (skin) => {
// //     if (stars < skin.cost) {
// //       alert("❌ Not enough stars!");
// //       return;
// //     }

// //     setSelectedAvatar(skin.icon);
// //     localStorage.setItem("avatar", skin.icon);
// //   };

// //   return (
// //     <div className="profile-page">

// //       {/* 👤 NAME SECTION */}
// //       <div className="name-section">
// //         {editing ? (
// //           <>
// //             <input
// //               className="name-input"
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //             />
// //             <button className="save-btn" onClick={saveName}>
// //               Save ✅
// //             </button>
// //           </>
// //         ) : (
// //           <>
// //             <h1>👤 {name}</h1>
// //             <button
// //               className="edit-btn"
// //               onClick={() => setEditing(true)}
// //             >
// //               ✏️ Edit
// //             </button>
// //           </>
// //         )}
// //       </div>

// //       {/* 🎭 AVATAR */}
// //       <div className="avatar-preview">
// //         {selectedAvatar}
// //       </div>

// //       <h2>🎨 Choose Your Avatar</h2>

// //       <div className="avatar-grid">
// //         {skins.map((skin, i) => {
// //           const unlocked = stars >= skin.cost;

// //           return (
// //             <div
// //               key={i}
// //               className={`avatar-card ${
// //                 unlocked ? "unlocked" : "locked"
// //               }`}
// //               onClick={() => unlocked && selectAvatar(skin)}
// //             >
// //               <span className="avatar-icon">{skin.icon}</span>

// //               {unlocked ? (
// //                 <p>✅</p>
// //               ) : (
// //                 <p>🔒 {skin.cost}⭐</p>
// //               )}
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* ⭐ STARS */}
// //       <div className="stars-box">
// //         ⭐ Stars: {stars}
// //       </div>

// //     </div>
// //   );
// // }





// import { useEffect, useState } from "react";
// import "../styles/Profile.css";
// import { useGame } from "../context/GameContext";
// import { db } from "../firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
// } from "firebase/firestore";

// export default function Profile() {
//   const { stars = 0 } = useGame();

//   const [name, setName] = useState("");
//   const [editing, setEditing] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState("🐵");
//   const [loading, setLoading] = useState(true);

//   // 🎭 SKINS
//   const skins = [
//     { icon: "🐵", cost: 0 },
//     { icon: "🦊", cost: 5 },
//     { icon: "🐯", cost: 10 },
//     { icon: "🦁", cost: 15 },
//     { icon: "🐸", cost: 20 },
//   ];

//   // 🔥 LOAD PROFILE FROM FIREBASE
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const userId = localStorage.getItem("userId");

//         if (!userId) {
//           console.log("❌ No Firebase userId found");
//           setLoading(false);
//           return;
//         }

//         const userRef = doc(db, "users", userId);
//         const snap = await getDoc(userRef);

//         if (snap.exists()) {
//           const data = snap.data();

//           setName(data.name || "");
//           setSelectedAvatar(data.avatar || "🐵");

//           // Keep localStorage in sync
//           const child = {
//             ...JSON.parse(
//               localStorage.getItem("childProfile") || "{}"
//             ),
//             name: data.name || "",
//           };

//           localStorage.setItem(
//             "childProfile",
//             JSON.stringify(child)
//           );

//           localStorage.setItem(
//             "avatar",
//             data.avatar || "🐵"
//           );
//         } else {
//           // Fallback to localStorage if Firebase profile
//           // does not exist yet
//           const child = JSON.parse(
//             localStorage.getItem("childProfile") || "{}"
//           );

//           const avatar =
//             localStorage.getItem("avatar") || "🐵";

//           setName(child.name || "");
//           setSelectedAvatar(avatar);
//         }
//       } catch (error) {
//         console.error(
//           "❌ Failed to load profile:",
//           error
//         );

//         // Fallback to localStorage
//         const child = JSON.parse(
//           localStorage.getItem("childProfile") || "{}"
//         );

//         const avatar =
//           localStorage.getItem("avatar") || "🐵";

//         setName(child.name || "");
//         setSelectedAvatar(avatar);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfile();
//   }, []);

//   // 💾 SAVE NAME
//   const saveName = async () => {
//     if (!name.trim()) return;

//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         alert("❌ User not logged in!");
//         return;
//       }

//       const cleanName = name.trim();

//       const userRef = doc(db, "users", userId);

//       await setDoc(
//         userRef,
//         {
//           name: cleanName,
//         },
//         {
//           merge: true,
//         }
//       );

//       // Keep localStorage synced
//       const child = JSON.parse(
//         localStorage.getItem("childProfile") || "{}"
//       );

//       child.name = cleanName;

//       localStorage.setItem(
//         "childProfile",
//         JSON.stringify(child)
//       );

//       setName(cleanName);
//       setEditing(false);

//       alert("✅ Name saved!");
//     } catch (error) {
//       console.error(
//         "❌ Failed to save name:",
//         error
//       );

//       alert("❌ Could not save name!");
//     }
//   };

//   // 🎯 SELECT AVATAR
//   const selectAvatar = async (skin) => {
//     if (stars < skin.cost) {
//       alert("❌ Not enough stars!");
//       return;
//     }

//     try {
//       const userId = localStorage.getItem("userId");

//       if (!userId) {
//         alert("❌ User not logged in!");
//         return;
//       }

//       const userRef = doc(db, "users", userId);

//       await setDoc(
//         userRef,
//         {
//           avatar: skin.icon,
//         },
//         {
//           merge: true,
//         }
//       );

//       setSelectedAvatar(skin.icon);

//       // Keep localStorage synced
//       localStorage.setItem(
//         "avatar",
//         skin.icon
//       );

//       alert("🎉 Avatar updated!");
//     } catch (error) {
//       console.error(
//         "❌ Failed to save avatar:",
//         error
//       );

//       alert("❌ Could not update avatar!");
//     }
//   };

//   // ⏳ LOADING
//   if (loading) {
//     return (
//       <div className="profile-page">
//         <div className="name-section">
//           <h1>Loading profile... 🌱</h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">

//       {/* 👤 NAME SECTION */}
//       <div className="name-section">
//         {editing ? (
//           <>
//             <input
//               className="name-input"
//               value={name}
//               onChange={(e) =>
//                 setName(e.target.value)
//               }
//               placeholder="Enter your name"
//             />

//             <button
//               className="save-btn"
//               onClick={saveName}
//             >
//               Save ✅
//             </button>
//           </>
//         ) : (
//           <>
//             <h1>
//               👤 {name || "Little Explorer"}
//             </h1>

//             <button
//               className="edit-btn"
//               onClick={() =>
//                 setEditing(true)
//               }
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
//           const unlocked =
//             stars >= skin.cost;

//           return (
//             <div
//               key={i}
//               className={`avatar-card ${
//                 unlocked
//                   ? "unlocked"
//                   : "locked"
//               }`}
//               onClick={() =>
//                 unlocked &&
//                 selectAvatar(skin)
//               }
//             >
//               <span className="avatar-icon">
//                 {skin.icon}
//               </span>

//               {unlocked ? (
//                 <p>✅</p>
//               ) : (
//                 <p>
//                   🔒 {skin.cost}⭐
//                 </p>
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

import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const {
    stars = 0,
    streak = 0,
    loadingProgress,
  } = useGame();

  // =========================================================
  // 👤 REAL PROFILE DATA
  // =========================================================

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // =========================================================
  // 🎭 AVATAR
  // =========================================================

  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] =
    useState("🐵");

  // =========================================================
  // 🦊 JUNGLE FRIEND
  // =========================================================

  const [jungleFriend, setJungleFriend] =
    useState(null);

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  const [loading, setLoading] = useState(true);

  // =========================================================
  // 🎭 AVATAR SKINS
  //
  // These remain exactly the same as your current UI.
  // =========================================================

  const skins = [
    {
      icon: "🐵",
      cost: 0,
    },
    {
      icon: "🦊",
      cost: 5,
    },
    {
      icon: "🐯",
      cost: 10,
    },
    {
      icon: "🦁",
      cost: 15,
    },
    {
      icon: "🐸",
      cost: 20,
    },
  ];

  // =========================================================
  // 🔥 LOAD REAL PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId =
          localStorage.getItem("userId");

        if (!userId) {
          console.log(
            "❌ No Firebase userId found"
          );

          setLoading(false);

          return;
        }

        console.log(
          "🔥 Loading profile for UID:",
          userId
        );

        // ---------------------------------------------------
        // FIREBASE USER DOCUMENT
        // ---------------------------------------------------

        const userRef = doc(
          db,
          "users",
          userId
        );

        const snap =
          await getDoc(userRef);

        if (snap.exists()) {
          const data =
            snap.data();

          console.log(
            "🔥 Real Firebase profile:",
            data
          );

          // =================================================
          // 👧 CHILD PROFILE
          // =================================================

          const childProfile =
            data.childProfile || {};

          const realName =
            childProfile.name ||
            data.name ||
            data.displayName ||
            data.username ||
            "";

          const realAge =
            childProfile.age ||
            "";

          setName(realName);
          setAge(realAge);

          // =================================================
          // 🎭 AVATAR
          // =================================================

          const realAvatar =
            data.avatar || "🐵";

          setSelectedAvatar(
            realAvatar
          );

          // =================================================
          // 🦊 JUNGLE FRIEND
          // =================================================

          const realFriend =
            data.jungleFriend ||
            null;

          setJungleFriend(
            realFriend
          );

          // =================================================
          // LOCAL STORAGE CACHE
          // =================================================

          const existingChild =
            JSON.parse(
              localStorage.getItem(
                "childProfile"
              ) || "{}"
            );

          const updatedChild = {
            ...existingChild,

            name: realName,

            age: realAge,
          };

          localStorage.setItem(
            "childProfile",
            JSON.stringify(
              updatedChild
            )
          );

          localStorage.setItem(
            "avatar",
            realAvatar
          );

          if (realFriend) {
            localStorage.setItem(
              "jungleFriend",
              JSON.stringify(
                realFriend
              )
            );
          }

        } else {
          // =================================================
          // FALLBACK ONLY WHEN FIREBASE DOCUMENT DOESN'T
          // EXIST
          // =================================================

          console.log(
            "⚠️ Firebase profile not found. Using local cache."
          );

          const child =
            JSON.parse(
              localStorage.getItem(
                "childProfile"
              ) || "{}"
            );

          const avatar =
            localStorage.getItem(
              "avatar"
            ) || "🐵";

          const friend =
            JSON.parse(
              localStorage.getItem(
                "jungleFriend"
              ) || "null"
            );

          setName(
            child.name || ""
          );

          setAge(
            child.age || ""
          );

          setSelectedAvatar(
            avatar
          );

          setJungleFriend(
            friend
          );
        }

      } catch (error) {
        console.error(
          "❌ Failed to load profile:",
          error
        );

        // ===================================================
        // FALLBACK
        // ===================================================

        try {
          const child =
            JSON.parse(
              localStorage.getItem(
                "childProfile"
              ) || "{}"
            );

          const avatar =
            localStorage.getItem(
              "avatar"
            ) || "🐵";

          const friend =
            JSON.parse(
              localStorage.getItem(
                "jungleFriend"
              ) || "null"
            );

          setName(
            child.name || ""
          );

          setAge(
            child.age || ""
          );

          setSelectedAvatar(
            avatar
          );

          setJungleFriend(
            friend
          );

        } catch (fallbackError) {
          console.error(
            "❌ Profile fallback failed:",
            fallbackError
          );
        }

      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================================================
  // 💾 SAVE CHILD NAME + AGE
  // =========================================================

  const saveProfile = async () => {
    const cleanName =
      name.trim();

    const cleanAge =
      String(age).trim();

    if (!cleanName) {
      alert(
        "Please enter your name."
      );

      return;
    }

    if (!cleanAge) {
      alert(
        "Please enter your age."
      );

      return;
    }

    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        alert(
          "❌ User not logged in!"
        );

        return;
      }

      const userRef = doc(
        db,
        "users",
        userId
      );

      // =====================================================
      // READ EXISTING PROFILE FIRST
      // =====================================================

      const snap =
        await getDoc(userRef);

      const existingData =
        snap.exists()
          ? snap.data()
          : {};

      const existingChild =
        existingData.childProfile ||
        {};

      // =====================================================
      // SAVE CHILD PROFILE
      // =====================================================

      const updatedChildProfile = {
        ...existingChild,

        name: cleanName,

        age: cleanAge,
      };

      await setDoc(
        userRef,
        {
          childProfile:
            updatedChildProfile,

          // Compatibility field
          name: cleanName,
        },
        {
          merge: true,
        }
      );

      // =====================================================
      // LOCAL STORAGE CACHE
      // =====================================================

      localStorage.setItem(
        "childProfile",
        JSON.stringify(
          updatedChildProfile
        )
      );

      setName(
        cleanName
      );

      setAge(
        cleanAge
      );

      setEditing(false);

      alert(
        "✅ Profile saved!"
      );

    } catch (error) {
      console.error(
        "❌ Failed to save profile:",
        error
      );

      alert(
        "❌ Could not save profile!"
      );
    }
  };

  // =========================================================
  // 🎯 SELECT AVATAR
  // =========================================================

  const selectAvatar = async (skin) => {
    if (stars < skin.cost) {
      alert(
        "❌ Not enough stars!"
      );

      return;
    }

    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        alert(
          "❌ User not logged in!"
        );

        return;
      }

      const userRef = doc(
        db,
        "users",
        userId
      );

      await setDoc(
        userRef,
        {
          avatar: skin.icon,
        },
        {
          merge: true,
        }
      );

      setSelectedAvatar(
        skin.icon
      );

      localStorage.setItem(
        "avatar",
        skin.icon
      );

      alert(
        "🎉 Avatar updated!"
      );

    } catch (error) {
      console.error(
        "❌ Failed to save avatar:",
        error
      );

      alert(
        "❌ Could not update avatar!"
      );
    }
  };

  // =========================================================
  // 🦊 CHANGE JUNGLE FRIEND
  // =========================================================

  const changeJungleFriend = () => {
    /*
      Reuse the existing ChooseFriend screen.

      This is important because your onboarding already
      contains the real friend list, friend images,
      unlock logic, and friend-saving logic.

      We simply send the student there to choose again.
    */

    navigate(
      "/choose-friend?mode=change"
    );
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="profile-page">

        <div className="name-section">

          <h1>
            Loading profile... 🌱
          </h1>

        </div>

      </div>
    );
  }

  // =========================================================
  // ⭐ LEVEL
  // =========================================================

  const getLevel = () => {
    if (stars < 5) return 1;
    if (stars < 15) return 2;
    if (stars < 30) return 3;
    if (stars < 50) return 4;

    return 5;
  };

  const level =
    getLevel();

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="profile-page">

      {/* ===================================================
          👤 NAME SECTION
      =================================================== */}

      <div className="name-section">

        {editing ? (
          <>

            <input
              className="name-input"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter your name"
            />

            <input
              className="name-input"
              type="number"
              value={age}
              min="1"
              onChange={(e) =>
                setAge(
                  e.target.value
                )
              }
              placeholder="Enter your age"
            />

            <button
              className="save-btn"
              onClick={saveProfile}
            >
              Save ✅
            </button>

          </>
        ) : (
          <>

            <h1>
              👤{" "}
              {name ||
                "Little Explorer"}
            </h1>

            <p
              style={{
                margin:
                  "6px 0 10px",
                fontWeight: 600,
              }}
            >
              Age:{" "}
              {age ||
                "Not set"}
            </p>

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

      {/* ===================================================
          🎭 AVATAR
      =================================================== */}

      <div className="avatar-preview">
        {selectedAvatar}
      </div>

      <h2>
        🎨 Choose Your Avatar
      </h2>

      <div className="avatar-grid">

        {skins.map(
          (skin, i) => {

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
                  <p>
                    ✅
                  </p>
                ) : (
                  <p>
                    🔒{" "}
                    {skin.cost}⭐
                  </p>
                )}

              </div>
            );
          }
        )}

      </div>

      {/* ===================================================
          🦊 JUNGLE FRIEND
      =================================================== */}

      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
        }}
      >

        <h2
          style={{
            marginBottom:
              "10px",
          }}
        >
          🦊 Your Jungle Friend
        </h2>

        {jungleFriend ? (
          <>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                alignItems:
                  "center",
                gap: "8px",
              }}
            >

              {jungleFriend.image ? (
                <img
                  src={
                    jungleFriend.image
                  }
                  alt={
                    jungleFriend.name ||
                    "Jungle Friend"
                  }
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit:
                      "contain",
                    borderRadius:
                      "20px",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize:
                      "70px",
                  }}
                >
                  🐾
                </div>
              )}

              <strong
                style={{
                  fontSize:
                    "18px",
                }}
              >
                {jungleFriend.name ||
                  "Jungle Friend"}{" "}
                🐾
              </strong>

            </div>

          </>
        ) : (
          <p>
            No jungle friend selected yet.
          </p>
        )}

        {/* =================================================
            CHANGE FRIEND
        ================================================= */}

        <button
          className="edit-btn"
          onClick={
            changeJungleFriend
          }
          style={{
            marginTop: "12px",
          }}
        >
          🦊 Change Jungle Friend
        </button>

      </div>

      {/* ===================================================
          📊 REAL PROGRESS
      =================================================== */}

      <div
        className="stars-box"
        style={{
          marginTop: "24px",
        }}
      >
        ⭐ Stars:{" "}
        {loadingProgress
          ? "..."
          : stars}

        <br />

        🔥 Streak:{" "}
        {loadingProgress
          ? "..."
          : streak}{" "}
        days

        <br />

        🌱 Level: {level}
      </div>

    </div>
  );
}