import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChooseFriend.css";

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

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
    fetch("/friends.json")
      .then((res) => res.json())
      .then((data) => {
        setFriends(data);
      })
      .catch((err) => {
        console.error(
          "❌ Failed to load friends:",
          err
        );
      });
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

    if (!friends.length) return;

    console.log(
      "🎮 Choose Friend saved state:",
      savedState
    );

    // =======================================================
    // 🔄 RESUME
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
          Math.max(savedState.index, 0),
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
    // 🆕 NEW
    // =======================================================

    console.log(
      "🆕 Starting Choose Friend"
    );

    setIndex(0);
    setShowIntro(false);

    save({
      index: 0,
      showIntro: false,
    });

    setGameReady(true);

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
      `${current.intro}\n\n${current.about}`;

    let i = 0;

    setText("");

    const timer =
      setInterval(() => {

        setText(
          (prev) =>
            prev +
            fullText[i]
        );

        i++;

        if (
          i >=
          fullText.length
        ) {
          clearInterval(timer);
        }

      }, 30);

    return () =>
      clearInterval(timer);

  }, [
    showIntro,
    current,
  ]);

  // =========================================================
  // ◀ PREVIOUS FRIEND
  // =========================================================

  const previousFriend = async () => {

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

    if (!current) return;

    const friendData = {
      id: current.id,
      name: current.name,
      image: current.image,
    };

    // =======================================================
    // ⚡ LOCAL STORAGE
    // =======================================================

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

    // =======================================================
    // 🔥 FIREBASE USER PROFILE
    // =======================================================

    try {

      const userId =
        localStorage.getItem(
          "userId"
        );

      if (userId) {

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
          "🔥 Jungle friend saved:",
          friendData
        );
      }

    } catch (err) {

      console.error(
        "❌ Friend save error:",
        err
      );
    }

    // =======================================================
    // 🧹 CLEAR CHOOSE-FRIEND ACTIVE STATE
    // =======================================================

    // We intentionally don't call finish() because this
    // isn't a scored game. The selected friend is now stored
    // permanently in users/{uid}.

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

      {!showIntro ? (

        <div className="board">

          <div className="carousel">

            <button
              onClick={
                previousFriend
              }
            >
              ◀
            </button>

            <img
              src={current.image}
              alt={current.name}
            />

            <button
              onClick={
                nextFriend
              }
            >
              ▶
            </button>

          </div>

          <h2>
            {current.name}
          </h2>

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