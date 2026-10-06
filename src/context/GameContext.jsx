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
  /* =====================================================
     👤 CURRENT USER
  ===================================================== */

  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  /* =====================================================
     ⭐ OVERALL PROGRESS
  ===================================================== */

  const [stars, setStars] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  /* =====================================================
     🎮 ACTIVE / RESUME GAME PROGRESS

     Example:

     activeGames: {
       "find-friend": {
         question: 4,
         score: 70,
         updatedAt: ...
       },

       "sound-matching": {
         question: 2,
         score: 40,
         updatedAt: ...
       }
     }
  ===================================================== */

  const [activeGames, setActiveGames] = useState({});

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

    window.addEventListener(
      "focus",
      checkUser
    );

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
    setActiveGames({});

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

        /* ---------------------------------------------
           ⭐ OVERALL STARS
        --------------------------------------------- */

        setStars(
          Number(data.stars) || 0
        );

        /* ---------------------------------------------
           📚 HISTORY
        --------------------------------------------- */

        setHistory(
          Array.isArray(data.history)
            ? data.history
            : []
        );

        /* ---------------------------------------------
           🔥 STREAK
        --------------------------------------------- */

        setStreak(
          Number(data.streak) || 0
        );

        /* ---------------------------------------------
           🎮 ACTIVE GAMES
        --------------------------------------------- */

        setActiveGames(
          data.activeGames &&
          typeof data.activeGames === "object"
            ? data.activeGames
            : {}
        );

        console.log(
          "🎮 Active game progress loaded:",
          data.activeGames || {}
        );
      } else {
        /* ---------------------------------------------
           🆕 NEW USER
        --------------------------------------------- */

        setStars(0);
        setHistory([]);
        setStreak(0);
        setActiveGames({});

        console.log(
          "🆕 No existing progress found."
        );
      }
    } catch (error) {
      console.error(
        "❌ Error loading user progress:",
        error
      );

      setStars(0);
      setHistory([]);
      setStreak(0);
      setActiveGames({});
    } finally {
      setLoadingProgress(false);
    }
  };


  /* =====================================================
     💾 SAVE GENERAL PROGRESS TO FIREBASE
  ===================================================== */

  const saveToFirebase = async (
    currentUserId,
    newStars,
    newHistory,
    newStreak,
    newActiveGames = activeGames
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

          activeGames: newActiveGames,

          updatedAt: new Date(),
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
     🎮 SAVE CURRENT GAME PROGRESS
  =====================================================

     Use inside ANY game:

     saveGameProgress({
       gameId: "find-friend",
       question: 4,
       score: 70,
     });

  ===================================================== */

  const saveGameProgress = async ({
    gameId,
    question = 0,
    score = 0,
    ...extraData
  }) => {
    if (!userId) {
      console.warn(
        "⚠️ Cannot save game progress: no userId"
      );

      return;
    }

    if (!gameId) {
      console.warn(
        "⚠️ Cannot save game progress: gameId is required"
      );

      return;
    }

    try {
      const progressRef = doc(
        db,
        "progress",
        userId
      );

      const currentGameProgress = {
        ...activeGames,

        [gameId]: {
          question: Number(question) || 0,

          score: Number(score) || 0,

          ...extraData,

          updatedAt: new Date(),
        },
      };

      /* ---------------------------------------------
         🔄 UPDATE LOCAL STATE
      --------------------------------------------- */

      setActiveGames(
        currentGameProgress
      );

      /* ---------------------------------------------
         💾 SAVE TO FIREBASE
      --------------------------------------------- */

      await setDoc(
        progressRef,
        {
          userId,

          activeGames:
            currentGameProgress,

          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      console.log(
        `💾 ${gameId} progress saved:`,
        currentGameProgress[gameId]
      );
    } catch (error) {
      console.error(
        `❌ Error saving ${gameId} progress:`,
        error
      );
    }
  };


  /* =====================================================
     📥 GET SAVED GAME PROGRESS
  =====================================================

     Example:

     const saved =
       getGameProgress("find-friend");

  ===================================================== */

  const getGameProgress = (gameId) => {
    if (!gameId) {
      return null;
    }

    return activeGames[gameId] || null;
  };


  /* =====================================================
     🗑️ CLEAR ONE GAME'S SAVED PROGRESS
  =====================================================

     Call this AFTER a game is completely finished.

     Example:

     clearGameProgress("find-friend");

  ===================================================== */

  const clearGameProgress = async (gameId) => {
    if (!userId) {
      console.warn(
        "⚠️ Cannot clear game progress: no userId"
      );

      return;
    }

    if (!gameId) {
      console.warn(
        "⚠️ Cannot clear game progress: gameId is required"
      );

      return;
    }

    try {
      const progressRef = doc(
        db,
        "progress",
        userId
      );

      const updatedActiveGames = {
        ...activeGames,
      };

      delete updatedActiveGames[gameId];

      setActiveGames(
        updatedActiveGames
      );

      await setDoc(
        progressRef,
        {
          activeGames:
            updatedActiveGames,

          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      console.log(
        `🗑️ ${gameId} saved progress cleared`
      );
    } catch (error) {
      console.error(
        `❌ Error clearing ${gameId} progress:`,
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
        newStreak =
          streak || 1;
      } else if (
        lastDate === yesterday
      ) {
        newStreak =
          (streak || 0) + 1;
      } else {
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
       💾 SAVE TO FIREBASE
    --------------------------------------------- */

    await saveToFirebase(
      userId,
      newStars,
      newHistory,
      newStreak,
      activeGames
    );
  };


  /* =====================================================
     🏁 COMPLETE GAME
  =====================================================

     This helper does TWO things:

     1. Adds score/stars/history
     2. Removes resume progress

     Example:

     await completeGame(
       100,
       "Find Friend",
       "find-friend"
     );

  ===================================================== */

  const completeGame = async (
    score,
    gameName = "Game",
    gameId
  ) => {
    /* ---------------------------------------------
       ⭐ SAVE SCORE + STARS
    --------------------------------------------- */

    await addStars(
      score,
      gameName
    );

    /* ---------------------------------------------
       🗑️ GAME IS FINISHED
       REMOVE RESUME DATA
    --------------------------------------------- */

    if (gameId) {
      await clearGameProgress(
        gameId
      );
    }
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
      setActiveGames({});

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

          activeGames: {},

          updatedAt: new Date(),
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
        /* 👤 USER */
        userId,

        /* ⭐ OVERALL PROGRESS */
        stars,
        history,
        streak,

        /* 🎮 RESUME PROGRESS */
        activeGames,

        /* ⏳ LOADING */
        loadingProgress,

        /* ⭐ EXISTING FUNCTIONS */
        addStars,
        resetProgress,

        /* 🎮 NEW GAME FUNCTIONS */
        saveGameProgress,
        getGameProgress,
        clearGameProgress,
        completeGame,

        /* 🔄 RELOAD */
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