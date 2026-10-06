import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { db } from "../firebase";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  const [stars, setStars] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  const [loadingProgress, setLoadingProgress] =
    useState(true);

  /* =====================================================
     👤 WATCH FOR LOGIN USER CHANGES
  ===================================================== */

  useEffect(() => {
    const checkUser = () => {
      const currentUserId =
        localStorage.getItem("userId");

      setUserId(currentUserId);
    };

    // Check when the app becomes active again
    window.addEventListener(
      "focus",
      checkUser
    );

    // Support logout/login changes between tabs
    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {
      window.removeEventListener(
        "focus",
        checkUser
      );

      window.removeEventListener(
        "storage",
        checkUser
      );
    };
  }, []);


  /* =====================================================
     📅 DATE HELPERS
  ===================================================== */

  const getToday = () => {
    const date = new Date();

    return date.toLocaleDateString(
      "en-CA"
    );
  };

  const getYesterday = () => {
    const date = new Date();

    date.setDate(
      date.getDate() - 1
    );

    return date.toLocaleDateString(
      "en-CA"
    );
  };


  /* =====================================================
     🔄 RESET LOCAL STATE WHEN USER CHANGES
  ===================================================== */

  useEffect(() => {
    setStars(0);
    setHistory([]);
    setStreak(0);

    if (!userId) {
      setLoadingProgress(false);
      return;
    }

    loadProgress(userId);
  }, [userId]);


  /* =====================================================
     🔥 LOAD REAL USER PROGRESS FROM FIREBASE
  ===================================================== */

  const loadProgress = async (currentUserId) => {
    setLoadingProgress(true);

    try {
      const progressRef = doc(
        db,
        "progress",
        currentUserId
      );

      const progressSnap =
        await getDoc(progressRef);

      if (progressSnap.exists()) {
        const data =
          progressSnap.data();

        setStars(
          Number(data.stars) || 0
        );

        setHistory(
          Array.isArray(data.history)
            ? data.history
            : []
        );

        setStreak(
          Number(data.streak) || 0
        );
      } else {
        // New user
        setStars(0);
        setHistory([]);
        setStreak(0);
      }
    } catch (error) {
      console.error(
        "❌ Error loading user progress:",
        error
      );

      setStars(0);
      setHistory([]);
      setStreak(0);
    } finally {
      setLoadingProgress(false);
    }
  };


  /* =====================================================
     💾 SAVE REAL USER PROGRESS
  ===================================================== */

  const saveToFirebase = async (
    currentUserId,
    newStars,
    newHistory,
    newStreak
  ) => {
    if (!currentUserId) {
      console.warn(
        "⚠️ Cannot save progress: no userId"
      );

      return;
    }

    try {
      const progressRef = doc(
        db,
        "progress",
        currentUserId
      );

      await setDoc(
        progressRef,
        {
          userId: currentUserId,

          stars: newStars,

          history: newHistory,

          streak: newStreak,

          updatedAt:
            new Date(),
        },
        {
          merge: true,
        }
      );

      console.log(
        "✅ Progress saved for user:",
        currentUserId
      );
    } catch (error) {
      console.error(
        "❌ Error saving progress:",
        error
      );
    }
  };


  /* =====================================================
     ⭐ ADD STARS
  ===================================================== */

  const addStars = async (
    score,
    gameName = "Game"
  ) => {
    if (!userId) {
      console.warn(
        "⚠️ No logged-in user. Stars were not added."
      );

      return;
    }

    /* ---------------------------------------------
       ⭐ CALCULATE STARS FROM SCORE
    --------------------------------------------- */

    let earned = 1;

    if (score >= 90) {
      earned = 3;
    } else if (score >= 70) {
      earned = 2;
    }


    /* ---------------------------------------------
       📅 DATE
    --------------------------------------------- */

    const today = getToday();

    const yesterday =
      getYesterday();


    /* ---------------------------------------------
       🔥 CALCULATE STREAK
    --------------------------------------------- */

    let newStreak = streak;

    if (history.length === 0) {
      newStreak = 1;
    } else {
      const lastActivity =
        history[history.length - 1];

      const lastDate =
        lastActivity?.date;

      if (lastDate === today) {
        // Already played today.
        // Keep today's streak.
        newStreak = streak || 1;
      } else if (
        lastDate === yesterday
      ) {
        // Continued consecutive day.
        newStreak =
          (streak || 0) + 1;
      } else {
        // Missed one or more days.
        newStreak = 1;
      }
    }


    /* ---------------------------------------------
       ⭐ NEW TOTAL
    --------------------------------------------- */

    const newStars =
      stars + earned;


    /* ---------------------------------------------
       📚 ADD ACTIVITY HISTORY
    --------------------------------------------- */

    const newActivity = {
      date: today,

      score: Number(score) || 0,

      stars: earned,

      game: gameName,
    };

    const newHistory = [
      ...history,
      newActivity,
    ];


    /* ---------------------------------------------
       🔄 UPDATE UI IMMEDIATELY
    --------------------------------------------- */

    setStars(newStars);

    setHistory(newHistory);

    setStreak(newStreak);


    /* ---------------------------------------------
       💾 SAVE TO THIS USER'S FIREBASE DOCUMENT
    --------------------------------------------- */

    await saveToFirebase(
      userId,
      newStars,
      newHistory,
      newStreak
    );
  };


  /* =====================================================
     🔄 RESET USER PROGRESS
  ===================================================== */

  const resetProgress = async () => {
    if (!userId) {
      console.warn(
        "⚠️ No logged-in user."
      );

      return;
    }

    try {
      setStars(0);
      setHistory([]);
      setStreak(0);

      const progressRef = doc(
        db,
        "progress",
        userId
      );

      await setDoc(
        progressRef,
        {
          userId,

          stars: 0,

          history: [],

          streak: 0,

          updatedAt:
            new Date(),
        }
      );

      console.log(
        "✅ Progress reset for:",
        userId
      );
    } catch (error) {
      console.error(
        "❌ Error resetting progress:",
        error
      );
    }
  };


  /* =====================================================
     📦 CONTEXT
  ===================================================== */

  return (
    <GameContext.Provider
      value={{
        userId,

        stars,

        history,

        streak,

        loadingProgress,

        addStars,

        resetProgress,

        reloadProgress: () => {
          if (userId) {
            loadProgress(userId);
          }
        },
      }}
    >
      {children}
    </GameContext.Provider>
  );
};


/* =========================================================
   🎮 HOOK
========================================================= */

export const useGame = () =>
  useContext(GameContext);