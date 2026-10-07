// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ChooseFriend.css";

// import { db } from "../firebase";
// import { doc, setDoc } from "firebase/firestore";

// import useGameProgress from "../hooks/useGameProgress";

// const GAME_ID = "choose-friend";

// export default function ChooseFriend() {
//   const navigate = useNavigate();

//   // =========================================================
//   // 🎮 GAME PROGRESS
//   // =========================================================

//   const {
//     savedState,
//     loading: progressLoading,
//     save,
//   } = useGameProgress(GAME_ID);

//   // =========================================================
//   // 🎯 STATE
//   // =========================================================

//   const [friends, setFriends] = useState([]);
//   const [index, setIndex] = useState(0);
//   const [showIntro, setShowIntro] = useState(false);
//   const [text, setText] = useState("");

//   const [gameReady, setGameReady] = useState(false);

//   // =========================================================
//   // 👥 LOAD FRIENDS
//   // =========================================================

//   useEffect(() => {
//     fetch("/friends.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setFriends(data);
//       })
//       .catch((err) => {
//         console.error(
//           "❌ Failed to load friends:",
//           err
//         );
//       });
//   }, []);

//   // =========================================================
//   // 🔄 RESTORE PROGRESS
//   // =========================================================

//   useEffect(() => {
//     if (progressLoading) {
//       console.log(
//         "⏳ Waiting for Choose Friend Firebase progress..."
//       );
//       return;
//     }

//     if (!friends.length) return;

//     console.log(
//       "🎮 Choose Friend saved state:",
//       savedState
//     );

//     // =======================================================
//     // 🔄 RESUME
//     // =======================================================

//     if (
//       savedState &&
//       typeof savedState.index === "number"
//     ) {
//       console.log(
//         "🔄 RESUMING CHOOSE FRIEND:",
//         savedState
//       );

//       const savedIndex =
//         Math.min(
//           Math.max(savedState.index, 0),
//           friends.length - 1
//         );

//       setIndex(savedIndex);

//       setShowIntro(
//         savedState.showIntro === true
//       );

//       setGameReady(true);

//       return;
//     }

//     // =======================================================
//     // 🆕 NEW
//     // =======================================================

//     console.log(
//       "🆕 Starting Choose Friend"
//     );

//     setIndex(0);
//     setShowIntro(false);

//     save({
//       index: 0,
//       showIntro: false,
//     });

//     setGameReady(true);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     progressLoading,
//     friends.length,
//   ]);

//   // =========================================================
//   // 👤 CURRENT FRIEND
//   // =========================================================

//   const current =
//     friends[index];

//   // =========================================================
//   // ✍️ TYPING INTRO
//   // =========================================================

//   useEffect(() => {
//     if (
//       !showIntro ||
//       !current
//     ) {
//       setText("");
//       return;
//     }

//     const fullText =
//       `${current.intro}\n\n${current.about}`;

//     let i = 0;

//     setText("");

//     const timer =
//       setInterval(() => {

//         setText(
//           (prev) =>
//             prev +
//             fullText[i]
//         );

//         i++;

//         if (
//           i >=
//           fullText.length
//         ) {
//           clearInterval(timer);
//         }

//       }, 30);

//     return () =>
//       clearInterval(timer);

//   }, [
//     showIntro,
//     current,
//   ]);

//   // =========================================================
//   // ◀ PREVIOUS FRIEND
//   // =========================================================

//   const previousFriend = async () => {

//     const newIndex =
//       (index -
//         1 +
//         friends.length) %
//       friends.length;

//     setIndex(newIndex);

//     setShowIntro(false);

//     await save({
//       index: newIndex,
//       showIntro: false,
//     });
//   };

//   // =========================================================
//   // ▶ NEXT FRIEND
//   // =========================================================

//   const nextFriend = async () => {

//     const newIndex =
//       (index + 1) %
//       friends.length;

//     setIndex(newIndex);

//     setShowIntro(false);

//     await save({
//       index: newIndex,
//       showIntro: false,
//     });
//   };

//   // =========================================================
//   // 🚀 START INTRO
//   // =========================================================

//   const handleStart = async () => {

//     setShowIntro(true);

//     await save({
//       index,
//       showIntro: true,
//     });
//   };

//   // =========================================================
//   // 🌈 BEGIN ADVENTURE
//   // =========================================================

//   const handleBegin = async () => {

//     if (!current) return;

//     const friendData = {
//       id: current.id,
//       name: current.name,
//       image: current.image,
//     };

//     // =======================================================
//     // ⚡ LOCAL STORAGE
//     // =======================================================

//     localStorage.setItem(
//       "jungleFriend",
//       JSON.stringify(
//         friendData
//       )
//     );

//     localStorage.setItem(
//       "appProgress",
//       "friend-chosen"
//     );

//     // =======================================================
//     // 🔥 FIREBASE USER PROFILE
//     // =======================================================

//     try {

//       const userId =
//         localStorage.getItem(
//           "userId"
//         );

//       if (userId) {

//         await setDoc(
//           doc(
//             db,
//             "users",
//             userId
//           ),
//           {
//             jungleFriend:
//               friendData,
//           },
//           {
//             merge: true,
//           }
//         );

//         console.log(
//           "🔥 Jungle friend saved:",
//           friendData
//         );
//       }

//     } catch (err) {

//       console.error(
//         "❌ Friend save error:",
//         err
//       );
//     }

//     // =======================================================
//     // 🧹 CLEAR CHOOSE-FRIEND ACTIVE STATE
//     // =======================================================

//     // We intentionally don't call finish() because this
//     // isn't a scored game. The selected friend is now stored
//     // permanently in users/{uid}.

//     navigate(
//       "/jungle-hero"
//     );
//   };

//   // =========================================================
//   // ⏳ LOADING
//   // =========================================================

//   if (
//     progressLoading ||
//     !gameReady ||
//     !friends.length ||
//     !current
//   ) {
//     return (
//       <div className="choose-container">
//         <h2>
//           Loading jungle friends… 🌱
//         </h2>
//       </div>
//     );
//   }

//   // =========================================================
//   // 🎨 UI
//   // =========================================================

//   return (
//     <div className="choose-container">

//       {!showIntro ? (

//         <div className="board">

//           <div className="carousel">

//             <button
//               onClick={
//                 previousFriend
//               }
//             >
//               ◀
//             </button>

//             <img
//               src={current.image}
//               alt={current.name}
//             />

//             <button
//               onClick={
//                 nextFriend
//               }
//             >
//               ▶
//             </button>

//           </div>

//           <h2>
//             {current.name}
//           </h2>

//           <button
//             className="start"
//             onClick={
//               handleStart
//             }
//           >
//             Start ▶
//           </button>

//         </div>

//       ) : (

//         <div className="intro-board">

//           <h1>
//             Meet {current.name}
//           </h1>

//           <img
//             src={current.image}
//             alt={current.name}
//           />

//           <p className="typing">
//             {text}
//           </p>

//           <button
//             className="start big"
//             onClick={
//               handleBegin
//             }
//           >
//             Let’s Begin 🌈
//           </button>

//         </div>

//       )}

//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/ChooseFriend.css";

import useGameProgress from "../hooks/useGameProgress";

const GAME_ID = "choose-friend";

export default function ChooseFriend() {
  const navigate = useNavigate();

  // =========================================================
  // 🎮 GAME PROGRESS
  // =========================================================

  const {
    savedState,
    loading: progressLoading,
    save,
  } = useGameProgress(GAME_ID);

  // =========================================================
  // 🎯 STATE
  // =========================================================

  const [friends, setFriends] = useState([]);
  const [index, setIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [text, setText] = useState("");

  const [gameReady, setGameReady] = useState(false);

  // =========================================================
  // 👥 LOAD FRIENDS
  // =========================================================

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response =
          await fetch("/friends.json");

        if (!response.ok) {
          throw new Error(
            "Failed to load friends.json"
          );
        }

        const data =
          await response.json();

        if (!Array.isArray(data) || !data.length) {
          throw new Error(
            "No jungle friends found"
          );
        }

        setFriends(data);
      } catch (error) {
        console.error(
          "❌ Failed to load friends:",
          error
        );

        setFriends([]);
      }
    };

    loadFriends();
  }, []);

  // =========================================================
  // 🔄 RESTORE PROGRESS
  // =========================================================

  useEffect(() => {
    if (progressLoading) {
      console.log(
        "⏳ Waiting for Choose Friend Firebase progress..."
      );

      return;
    }

    if (!friends.length) {
      return;
    }

    console.log(
      "🎮 Choose Friend saved state:",
      savedState
    );

    // =======================================================
    // 🔄 RESUME EXISTING PROGRESS
    // =======================================================

    if (
      savedState &&
      typeof savedState.index === "number"
    ) {
      console.log(
        "🔄 RESUMING CHOOSE FRIEND:",
        savedState
      );

      const savedIndex = Math.min(
        Math.max(
          savedState.index,
          0
        ),
        friends.length - 1
      );

      setIndex(savedIndex);

      setShowIntro(
        savedState.showIntro === true
      );

      setGameReady(true);

      return;
    }

    // =======================================================
    // 🆕 NEW CHOOSE FRIEND SESSION
    // =======================================================

    console.log(
      "🆕 Starting Choose Friend"
    );

    setIndex(0);
    setShowIntro(false);

    setGameReady(true);

    // Save initial state.
    save({
      index: 0,
      showIntro: false,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    progressLoading,
    friends.length,
  ]);

  // =========================================================
  // 👤 CURRENT FRIEND
  // =========================================================

  const current =
    friends[index];

  // =========================================================
  // ✍️ TYPING INTRO
  // =========================================================

  useEffect(() => {
    if (
      !showIntro ||
      !current
    ) {
      setText("");
      return;
    }

    const fullText =
      `${current.intro || ""}\n\n${
        current.about || ""
      }`;

    let i = 0;

    setText("");

    const timer =
      setInterval(() => {
        if (i >= fullText.length) {
          clearInterval(timer);
          return;
        }

        setText(
          (prev) =>
            prev + fullText[i]
        );

        i++;
      }, 30);

    return () => {
      clearInterval(timer);
    };
  }, [
    showIntro,
    current,
  ]);

  // =========================================================
  // ◀ PREVIOUS FRIEND
  // =========================================================

  const previousFriend = async () => {
    if (!friends.length) {
      return;
    }

    const newIndex =
      (index -
        1 +
        friends.length) %
      friends.length;

    setIndex(newIndex);

    setShowIntro(false);

    await save({
      index: newIndex,
      showIntro: false,
    });
  };

  // =========================================================
  // ▶ NEXT FRIEND
  // =========================================================

  const nextFriend = async () => {
    if (!friends.length) {
      return;
    }

    const newIndex =
      (index + 1) %
      friends.length;

    setIndex(newIndex);

    setShowIntro(false);

    await save({
      index: newIndex,
      showIntro: false,
    });
  };

  // =========================================================
  // 🚀 START INTRO
  // =========================================================

  const handleStart = async () => {
    if (!current) {
      return;
    }

    setShowIntro(true);

    await save({
      index,
      showIntro: true,
    });
  };

  // =========================================================
  // 🌈 BEGIN ADVENTURE
  // =========================================================

  const handleBegin = async () => {
    if (!current) {
      return;
    }

    // =======================================================
    // FRIEND DATA
    // =======================================================

    const friendData = {
      id: current.id || "",
      name: current.name || "",
      image: current.image || "",
    };

    console.log(
      "🦊 Selected jungle friend:",
      friendData
    );

    // =======================================================
    // ⚡ SAVE TEMPORARILY TO LOCAL STORAGE
    //
    // The correct Firebase UID is established during OTP.
    // OtpVerify.jsx will save this to users/{UID}.
    // =======================================================

    localStorage.setItem(
      "jungleFriend",
      JSON.stringify(friendData)
    );

    localStorage.setItem(
      "appProgress",
      "friend-chosen"
    );

    console.log(
      "💾 Jungle friend saved temporarily."
    );

    // =======================================================
    // IMPORTANT
    //
    // We intentionally DO NOT do:
    //
    // const userId = localStorage.getItem("userId");
    //
    // await setDoc(
    //   doc(db, "users", userId),
    //   ...
    // );
    //
    // because during registration localStorage could contain
    // the previous user's UID.
    //
    // That could cause:
    //
    // Friend B
    //    ↓
    // Previous user's UID
    //    ↓
    // Friend B saved into User A ❌
    //
    // Instead:
    //
    // ChooseFriend
    //    ↓
    // localStorage
    //    ↓
    // OTP verification
    //    ↓
    // correct Firebase UID
    //    ↓
    // users/{UID}
    // =======================================================

    // =======================================================
    // 🧹 CHOOSE FRIEND PROGRESS
    //
    // We intentionally don't call finish() because this is
    // not a scored game.
    //
    // The selected friend becomes part of the user's profile.
    // =======================================================

    navigate(
      "/jungle-hero"
    );
  };

  // =========================================================
  // ⏳ LOADING
  // =========================================================

  if (
    progressLoading ||
    !gameReady ||
    !friends.length ||
    !current
  ) {
    return (
      <div className="choose-container">
        <h2>
          Loading jungle friends… 🌱
        </h2>
      </div>
    );
  }

  // =========================================================
  // 🎨 UI
  // =========================================================

  return (
    <div className="choose-container">

      {/* ===================================================
          FRIEND SELECTION
      =================================================== */}

      {!showIntro ? (
        <div className="board">

          <div className="carousel">

            {/* PREVIOUS */}

            <button
              onClick={
                previousFriend
              }
              aria-label="Previous friend"
            >
              ◀
            </button>

            {/* FRIEND IMAGE */}

            <img
              src={current.image}
              alt={current.name}
            />

            {/* NEXT */}

            <button
              onClick={
                nextFriend
              }
              aria-label="Next friend"
            >
              ▶
            </button>

          </div>

          {/* FRIEND NAME */}

          <h2>
            {current.name}
          </h2>

          {/* START */}

          <button
            className="start"
            onClick={
              handleStart
            }
          >
            Start ▶
          </button>

        </div>
      ) : (

        /* =================================================
           FRIEND INTRO
        ================================================= */

        <div className="intro-board">

          <h1>
            Meet {current.name}
          </h1>

          <img
            src={current.image}
            alt={current.name}
          />

          <p className="typing">
            {text}
          </p>

          {/* BEGIN ADVENTURE */}

          <button
            className="start big"
            onClick={
              handleBegin
            }
          >
            Let’s Begin 🌈
          </button>

        </div>

      )}

    </div>
  );
}