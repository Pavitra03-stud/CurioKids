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
  // 👤 PROFILE
  // =========================================================

  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // =========================================================
  // 🎭 AVATAR
  // =========================================================

  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("🐵");

  // =========================================================
  // 🦊 JUNGLE FRIEND
  // =========================================================

  const [jungleFriend, setJungleFriend] = useState(null);

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  const [loading, setLoading] = useState(true);

  // =========================================================
  // 🔔 CUSTOM NOTIFICATION
  // =========================================================

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 2200);
  };

  // =========================================================
  // 🎭 AVATAR SKINS
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
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.log("❌ No Firebase userId found");
          setLoading(false);
          return;
        }

        console.log(
          "🔥 Loading profile for UID:",
          userId
        );

        const userRef = doc(
          db,
          "users",
          userId
        );

        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();

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
            childProfile.age || "";

          setName(realName);
          setAge(realAge);

          // =================================================
          // 🎭 AVATAR
          // =================================================

          const realAvatar =
            data.avatar || "🐵";

          setSelectedAvatar(realAvatar);

          // =================================================
          // 🦊 JUNGLE FRIEND
          // =================================================

          const realFriend =
            data.jungleFriend || null;

          setJungleFriend(realFriend);

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
            JSON.stringify(updatedChild)
          );

          localStorage.setItem(
            "avatar",
            realAvatar
          );

          if (realFriend) {
            localStorage.setItem(
              "jungleFriend",
              JSON.stringify(realFriend)
            );
          }

        } else {

          // =================================================
          // FALLBACK
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

        // =================================================
        // FALLBACK
        // =================================================

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
      showNotification(
        "Please enter your name.",
        "error"
      );
      return;
    }

    if (!cleanAge) {
      showNotification(
        "Please enter your age.",
        "error"
      );
      return;
    }

    try {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        showNotification(
          "User not logged in!",
          "error"
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
        existingData.childProfile || {};

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

          name: cleanName,
        },
        {
          merge: true,
        }
      );

      // =====================================================
      // LOCAL STORAGE
      // =====================================================

      localStorage.setItem(
        "childProfile",
        JSON.stringify(
          updatedChildProfile
        )
      );

      setName(cleanName);
      setAge(cleanAge);
      setEditing(false);

      showNotification(
        "Profile saved! 🌱",
        "success"
      );

    } catch (error) {

      console.error(
        "❌ Failed to save profile:",
        error
      );

      showNotification(
        "Could not save profile!",
        "error"
      );
    }
  };

  // =========================================================
  // 🎯 SELECT AVATAR
  // =========================================================

  const selectAvatar = async (skin) => {

    if (stars < skin.cost) {
      showNotification(
        `You need ${skin.cost} ⭐ to unlock this avatar.`,
        "error"
      );

      return;
    }

    try {

      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        showNotification(
          "User not logged in!",
          "error"
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

      // =====================================================
      // UPDATE UI
      // =====================================================

      setSelectedAvatar(
        skin.icon
      );

      // =====================================================
      // UPDATE LOCAL STORAGE
      // =====================================================

      localStorage.setItem(
        "avatar",
        skin.icon
      );

      // =====================================================
      // CUSTOM NOTIFICATION
      // =====================================================

      showNotification(
        "Avatar updated! 🎉",
        "success"
      );

    } catch (error) {

      console.error(
        "❌ Failed to save avatar:",
        error
      );

      showNotification(
        "Could not update avatar!",
        "error"
      );
    }
  };

  // =========================================================
  // 🦊 CHANGE JUNGLE FRIEND
  // =========================================================

  const changeJungleFriend = () => {
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

  const level = getLevel();

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="profile-page">

      {/* ===================================================
          🔔 CUSTOM NOTIFICATION
      =================================================== */}

      {notification && (
        <div
          className={`profile-notification ${
            notification.type === "error"
              ? "notification-error"
              : "notification-success"
          }`}
        >
          <div className="notification-icon">
            {notification.type === "error"
              ? "⚠️"
              : "🎉"}
          </div>

          <span>
            {notification.message}
          </span>
        </div>
      )}

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


      </div>

    </div>
  );
}