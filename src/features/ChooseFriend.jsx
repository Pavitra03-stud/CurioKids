import { useEffect, useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../styles/ChooseFriend.css";

import useGameProgress from "../hooks/useGameProgress";

import { auth, db } from "../firebase";

import {
  doc,
  setDoc,
} from "firebase/firestore";

const GAME_ID = "choose-friend";

export default function ChooseFriend() {

  const navigate = useNavigate();

  const location = useLocation();

  // =========================================================
  // 🔄 CHANGE FRIEND MODE
  //
  // Normal:
  // /choose-friend
  //
  // Profile change:
  // /choose-friend?mode=change
  // =========================================================

  const isChangeMode =
    new URLSearchParams(
      location.search
    ).get("mode") === "change";


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

  const [friends, setFriends] =
    useState([]);

  const [index, setIndex] =
    useState(0);

  const [showIntro, setShowIntro] =
    useState(false);

  const [text, setText] =
    useState("");

  const [gameReady, setGameReady] =
    useState(false);

  const [savingFriend, setSavingFriend] =
    useState(false);


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

        if (
          !Array.isArray(data) ||
          !data.length
        ) {

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
  //
  // CHANGE MODE:
  // Always start from first friend.
  //
  // NORMAL MODE:
  // Restore saved Choose Friend progress.
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


    // =======================================================
    // 🦊 CHANGE MODE
    // =======================================================

    if (isChangeMode) {

      console.log(
        "🦊 CHANGE FRIEND MODE → starting fresh"
      );

      setIndex(0);

      setShowIntro(false);

      setText("");

      setGameReady(true);

      return;

    }


    // =======================================================
    // NORMAL MODE
    // =======================================================

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

      const savedIndex =
        Math.min(
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


    // Save initial state only
    // in normal mode.

    save({
      index: 0,
      showIntro: false,
    });


    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [
    progressLoading,
    friends.length,
    isChangeMode,
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

        if (
          i >=
          fullText.length
        ) {

          clearInterval(timer);

          return;

        }


        setText(
          (prev) =>
            prev +
            fullText[i]
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

  const previousFriend =
    async () => {

      if (!friends.length) {
        return;
      }


      const newIndex =
        (
          index -
          1 +
          friends.length
        ) %
        friends.length;


      setIndex(newIndex);

      setShowIntro(false);


      // Don't change onboarding
      // progress when browsing
      // from Profile.

      if (!isChangeMode) {

        await save({
          index: newIndex,
          showIntro: false,
        });

      }

    };


  // =========================================================
  // ▶ NEXT FRIEND
  // =========================================================

  const nextFriend =
    async () => {

      if (!friends.length) {
        return;
      }


      const newIndex =
        (
          index + 1
        ) %
        friends.length;


      setIndex(newIndex);

      setShowIntro(false);


      // Don't change onboarding
      // progress when browsing
      // from Profile.

      if (!isChangeMode) {

        await save({
          index: newIndex,
          showIntro: false,
        });

      }

    };


  // =========================================================
  // 🚀 START INTRO
  // =========================================================

  const handleStart =
    async () => {

      if (!current) {
        return;
      }


      setShowIntro(true);


      // Save onboarding progress
      // only for normal registration.

      if (!isChangeMode) {

        await save({
          index,
          showIntro: true,
        });

      }

    };


  // =========================================================
  // 🌈 SAVE FRIEND
  //
  // Normal mode:
  // Save locally → Jungle Hero
  //
  // Change mode:
  // Save directly to Firebase → Profile
  // =========================================================

  const handleBegin =
    async () => {

      if (
        !current ||
        savingFriend
      ) {

        return;

      }


      const friendData = {

        id:
          current.id || "",

        name:
          current.name || "",

        image:
          current.image || "",

      };


      console.log(
        "🦊 Selected jungle friend:",
        friendData
      );


      // =====================================================
      // 👤 CHANGE FRIEND FROM PROFILE
      // =====================================================

      if (isChangeMode) {

        try {

          setSavingFriend(true);


          // -------------------------------------------------
          // Get current Firebase user safely
          // -------------------------------------------------

          const firebaseUser =
            auth.currentUser;


          const userId =
            firebaseUser?.uid ||
            localStorage.getItem(
              "userId"
            );


          if (!userId) {

            alert(
              "❌ User not logged in!"
            );

            return;

          }


          // -------------------------------------------------
          // SAVE TO FIREBASE
          // -------------------------------------------------

          await setDoc(

            doc(
              db,
              "users",
              userId
            ),

            {
              jungleFriend:
                friendData,
            },

            {
              merge: true,
            }

          );


          console.log(
            "✅ Jungle friend updated in Firebase:",
            friendData
          );


          // -------------------------------------------------
          // UPDATE LOCAL CACHE
          // -------------------------------------------------

          localStorage.setItem(
            "jungleFriend",
            JSON.stringify(
              friendData
            )
          );


          localStorage.setItem(
            "appProgress",
            "friend-chosen"
          );


          // -------------------------------------------------
          // RETURN TO PROFILE
          // -------------------------------------------------

          navigate(
            "/profile",
            {
              replace: true,
            }
          );


          return;


        } catch (error) {

          console.error(
            "❌ Failed to change jungle friend:",
            error
          );


          alert(
            "❌ Could not update your jungle friend. Please try again."
          );


        } finally {

          setSavingFriend(false);

        }


        return;

      }


      // =====================================================
      // 🆕 NORMAL NEW-USER FLOW
      // =====================================================


      // -----------------------------------------------------
      // LOCAL STORAGE
      // -----------------------------------------------------

      localStorage.setItem(
        "jungleFriend",
        JSON.stringify(
          friendData
        )
      );


      localStorage.setItem(
        "appProgress",
        "friend-chosen"
      );


      console.log(
        "💾 Jungle friend saved temporarily."
      );


      // -----------------------------------------------------
      // NORMAL FLOW
      // -----------------------------------------------------

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
  //
  // SINGLE AVATAR CAROUSEL
  // =========================================================

  return (

    <div className="choose-container">

      {!showIntro ? (

        <div className="board">


          {/* =================================================
              LABEL
          ================================================= */}

          <div className="board-label">
            🌿 &nbsp; JUNGLE FRIEND
          </div>


          {/* =================================================
              TITLE
          ================================================= */}

          <h1>
            Choose Your Friend
          </h1>


          <p className="subtitle">
            Pick your jungle buddy!
          </p>


          {/* =================================================
              SINGLE AVATAR CAROUSEL
          ================================================= */}

          <div className="friend-carousel">


            {/* LEFT ARROW */}

            <button
              type="button"
              className="friend-arrow"
              onClick={previousFriend}
              aria-label="Previous friend"
            >
              ←
            </button>


            {/* =================================================
                CURRENT FRIEND
            ================================================= */}

            <div className="friend-avatar-area">


              {/* NUMBER */}

              <div className="friend-number">

                {String(
                  index + 1
                ).padStart(2, "0")}

              </div>


              {/* AVATAR */}

              <div className="friend-avatar-circle">

                <img
                  src={current.image}
                  alt={current.name}
                  className="friend-avatar-image"
                />

              </div>


              {/* NAME */}

              <h2 className="friend-name">
                {current.name}
              </h2>


            </div>


            {/* RIGHT ARROW */}

            <button
              type="button"
              className="friend-arrow"
              onClick={nextFriend}
              aria-label="Next friend"
            >
              →
            </button>


          </div>


          {/* =================================================
              SELECTED FRIEND
          ================================================= */}

          <div className="selected-friend">


            <div className="selected-friend-avatar">

              <img
                src={current.image}
                alt={current.name}
              />

            </div>


            <div className="selected-friend-text">

              <span>
                YOUR JUNGLE FRIEND
              </span>

              <strong>
                {current.name}
              </strong>

            </div>


          </div>


          {/* =================================================
              MEET FRIEND
          ================================================= */}

          <button
            className="start"
            onClick={handleStart}
          >
            Meet My Friend →
          </button>


          {/* =================================================
              COUNTER
          ================================================= */}

          <div className="friend-counter">


            <button
              type="button"
              onClick={previousFriend}
              aria-label="Previous friend"
            >
              ←
            </button>


            <span>
              {index + 1} / {friends.length}
            </span>


            <button
              type="button"
              onClick={nextFriend}
              aria-label="Next friend"
            >
              →
            </button>


          </div>


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


          {/* =================================================
              BEGIN ADVENTURE
          ================================================= */}

          <button
            className="start big"
            onClick={handleBegin}
            disabled={savingFriend}
          >

            {savingFriend
              ? "Saving... 🌱"
              : "Let’s Begin 🌈"}

          </button>


        </div>

      )}

    </div>

  );

}