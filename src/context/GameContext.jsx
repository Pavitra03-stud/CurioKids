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
  // =====================================================
  // 👤 CURRENT USER
  // =====================================================

  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  // =====================================================
  // ⭐ OVERALL PROGRESS
  // =====================================================

  const [stars, setStars] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  // =====================================================
  // 🎮 ACTIVE / RESUME GAME PROGRESS
  // =====================================================

  const [activeGames, setActiveGames] = useState({});

  const [loadingProgress, setLoadingProgress] =
    useState(true);

  // =====================================================
  // 👤 WATCH FOR LOGIN USER CHANGES
  // =====================================================

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

  // =====================================================
  // 📅 DATE HELPERS
  // =====================================================

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

  // =====================================================
  // 🔥 LOAD USER PROGRESS
  // =====================================================

  const loadProgress = async (
    currentUserId
  ) => {
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

        // ⭐ STARS
        setStars(
          Number(data.stars) || 0
        );

        // 📚 HISTORY
        setHistory(
          Array.isArray(data.history)
            ? data.history
            : []
        );

        // 🔥 STREAK
        setStreak(
          Number(data.streak) || 0
        );

        // 🎮 ACTIVE GAMES
        setActiveGames(
          data.activeGames &&
          typeof data.activeGames ===
            "object"
            ? data.activeGames
            : {}
        );

        console.log(
          "🔥 Firebase progress loaded:",
          {
            stars: data.stars,
            streak: data.streak,
            history: data.history,
            activeGames:
              data.activeGames,
          }
        );
      } else {
        // 🆕 NEW USER

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

  // =====================================================
  // 🔄 RESET LOCAL STATE WHEN USER CHANGES
  // =====================================================

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

  // =====================================================
  // 💾 SAVE GENERAL PROGRESS TO FIREBASE
  // =====================================================

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

          activeGames:
            newActiveGames,

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

      throw error;
    }
  };

  // =====================================================
  // 🎮 SAVE CURRENT GAME PROGRESS
  // =====================================================

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

      // Read latest Firebase data first.
      // This prevents overwriting another active game
      // with an old React state.
      const progressSnap =
        await getDoc(progressRef);

      const firebaseData =
        progressSnap.exists()
          ? progressSnap.data()
          : {};

      const existingActiveGames =
        firebaseData.activeGames &&
        typeof firebaseData.activeGames ===
          "object"
          ? firebaseData.activeGames
          : {};

      const currentGameProgress = {
        ...existingActiveGames,

        [gameId]: {
          question:
            Number(question) || 0,

          score:
            Number(score) || 0,

          ...extraData,

          updatedAt: new Date(),
        },
      };

      // 🔄 UPDATE LOCAL STATE
      setActiveGames(
        currentGameProgress
      );

      // 💾 SAVE TO FIREBASE
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

  // =====================================================
  // 📥 GET SAVED GAME PROGRESS
  // =====================================================

  const getGameProgress = (
    gameId
  ) => {
    if (!gameId) {
      return null;
    }

    return (
      activeGames[gameId] ||
      null
    );
  };

  // =====================================================
  // 🗑️ CLEAR ONE GAME'S SAVED PROGRESS
  // =====================================================

  const clearGameProgress = async (
    gameId
  ) => {
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

      // Read latest Firebase state.
      const progressSnap =
        await getDoc(progressRef);

      const firebaseData =
        progressSnap.exists()
          ? progressSnap.data()
          : {};

      const existingActiveGames =
        firebaseData.activeGames &&
        typeof firebaseData.activeGames ===
          "object"
          ? firebaseData.activeGames
          : {};

      const updatedActiveGames = {
        ...existingActiveGames,
      };

      delete updatedActiveGames[
        gameId
      ];

      // 🔄 UPDATE LOCAL STATE
      setActiveGames(
        updatedActiveGames
      );

      // 💾 SAVE FIREBASE
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

  // =====================================================
  // ⭐ ADD STARS
  // =====================================================
  //
  // IMPORTANT:
  // We read the LATEST Firebase progress first.
  // We do NOT depend on possibly stale React state.
  //
  // =====================================================

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

    try {
      console.log(
        "🏆 Completing game:",
        {
          userId,
          score,
          gameName,
        }
      );

      // -------------------------------------------------
      // 🔥 READ LATEST FIREBASE PROGRESS
      // -------------------------------------------------

      const progressRef = doc(
        db,
        "progress",
        userId
      );

      const progressSnap =
        await getDoc(progressRef);

      const firebaseData =
        progressSnap.exists()
          ? progressSnap.data()
          : {};

      // -------------------------------------------------
      // CURRENT FIREBASE VALUES
      // -------------------------------------------------

      const currentStars =
        Number(
          firebaseData.stars || 0
        );

      const currentHistory =
        Array.isArray(
          firebaseData.history
        )
          ? firebaseData.history
          : [];

      const currentStreak =
        Number(
          firebaseData.streak || 0
        );

      // -------------------------------------------------
      // ⭐ CALCULATE EARNED STARS
      // -------------------------------------------------

      let earned = 1;

      if (Number(score) >= 90) {
        earned = 3;
      } else if (
        Number(score) >= 70
      ) {
        earned = 2;
      }

      // -------------------------------------------------
      // 📅 DATES
      // -------------------------------------------------

      const today =
        getToday();

      const yesterday =
        getYesterday();

      // -------------------------------------------------
      // 🔥 CALCULATE STREAK
      // -------------------------------------------------

      let newStreak = 1;

      if (
        currentHistory.length > 0
      ) {
        const lastActivity =
          currentHistory[
            currentHistory.length - 1
          ];

        const lastDate =
          lastActivity?.date;

        if (
          lastDate === today
        ) {
          newStreak =
            currentStreak || 1;
        } else if (
          lastDate === yesterday
        ) {
          newStreak =
            (currentStreak || 0) + 1;
        } else {
          newStreak = 1;
        }
      }

      // -------------------------------------------------
      // ⭐ NEW TOTAL STARS
      // -------------------------------------------------

      const newStars =
        currentStars + earned;

      // -------------------------------------------------
      // 📚 NEW ACTIVITY
      // -------------------------------------------------

      const newActivity = {
        date: today,

        score:
          Number(score) || 0,

        stars: earned,

        game: gameName,
      };

      // -------------------------------------------------
      // 📚 NEW HISTORY
      // -------------------------------------------------

      const newHistory = [
        ...currentHistory,
        newActivity,
      ];

      // -------------------------------------------------
      // 💾 SAVE FINAL PROGRESS TO FIREBASE
      // -------------------------------------------------

      await setDoc(
        progressRef,
        {
          userId,

          stars: newStars,

          history: newHistory,

          streak: newStreak,

          updatedAt: new Date(),
        },
        {
          merge: true,
        }
      );

      // -------------------------------------------------
      // 🔄 UPDATE LOCAL UI ONLY AFTER FIREBASE SUCCESS
      // -------------------------------------------------

      setStars(newStars);

      setHistory(newHistory);

      setStreak(newStreak);

      console.log(
        "✅ FINAL PROGRESS SAVED:",
        {
          stars: newStars,
          streak: newStreak,
          history: newHistory,
        }
      );

    } catch (error) {
      console.error(
        "❌ FINAL PROGRESS SAVE FAILED:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // 🏁 COMPLETE GAME
  // =====================================================

  const completeGame = async (
    score,
    gameName = "Game",
    gameId
  ) => {
    if (!userId) {
      console.warn(
        "⚠️ Cannot complete game: no logged-in user."
      );

      return;
    }

    try {
      console.log(
        "🏁 COMPLETE GAME:",
        {
          userId,
          score,
          gameName,
          gameId,
        }
      );

      // -------------------------------------------------
      // 1️⃣ SAVE STARS + HISTORY + STREAK
      // -------------------------------------------------

      await addStars(
        score,
        gameName
      );

      // -------------------------------------------------
      // 2️⃣ REMOVE RESUME DATA
      // -------------------------------------------------

      if (gameId) {
        const progressRef =
          doc(
            db,
            "progress",
            userId
          );

        // Read latest Firebase state
        const progressSnap =
          await getDoc(
            progressRef
          );

        const firebaseData =
          progressSnap.exists()
            ? progressSnap.data()
            : {};

        const existingActiveGames =
          firebaseData.activeGames &&
          typeof firebaseData.activeGames ===
            "object"
            ? firebaseData.activeGames
            : {};

        const updatedActiveGames = {
          ...existingActiveGames,
        };

        delete updatedActiveGames[
          gameId
        ];

        // Save ONLY activeGames.
        // stars/history/streak remain untouched.
        await setDoc(
          progressRef,
          {
            activeGames:
              updatedActiveGames,

            updatedAt:
              new Date(),
          },
          {
            merge: true,
          }
        );

        setActiveGames(
          updatedActiveGames
        );

        console.log(
          "🗑️ Resume progress cleared:",
          gameId
        );
      }

      console.log(
        "🎉 GAME COMPLETED SUCCESSFULLY"
      );

    } catch (error) {
      console.error(
        "❌ COMPLETE GAME FAILED:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // 🔄 RESET USER PROGRESS
  // =====================================================

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

  // =====================================================
  // 📦 CONTEXT
  // =====================================================

  return (
    <GameContext.Provider
      value={{
        // 👤 USER
        userId,

        // ⭐ OVERALL PROGRESS
        stars,
        history,
        streak,

        // 🎮 RESUME PROGRESS
        activeGames,

        // ⏳ LOADING
        loadingProgress,

        // ⭐ FUNCTIONS
        addStars,
        resetProgress,

        // 🎮 GAME FUNCTIONS
        saveGameProgress,
        getGameProgress,
        clearGameProgress,
        completeGame,

        // 🔄 RELOAD
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

// =========================================================
// 🎮 HOOK
// =========================================================

export const useGame = () =>
  useContext(GameContext);