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
  runTransaction,
} from "firebase/firestore";

const GameContext = createContext();

// =========================================================
// 🎁 REWARD MILESTONES
// =========================================================

export const REWARDS = [
  {
    id: "super-learner-badge",
    icon: "🏅",
    title: "Super Learner Badge",
    cost: 3,
    message:
      "Amazing! You earned your first learning badge! 🌟",
  },

  {
    id: "explorer-hat",
    icon: "🎩",
    title: "Explorer Hat",
    cost: 6,
    message:
      "Your jungle adventure is growing! 🎩🌿",
  },

  {
    id: "mini-game-ticket",
    icon: "🎮",
    title: "Mini Game Ticket",
    cost: 10,
    message:
      "You unlocked a special mini-game reward! 🎮",
  },

  {
    id: "rainbow-star",
    icon: "🌈",
    title: "Rainbow Star",
    cost: 15,
    message:
      "You're shining brighter every day! 🌈⭐",
  },

  {
    id: "butterfly-badge",
    icon: "🦋",
    title: "Butterfly Badge",
    cost: 20,
    message:
      "You found a beautiful new milestone! 🦋",
  },

  {
    id: "golden-leaf",
    icon: "🍃",
    title: "Golden Leaf",
    cost: 25,
    message:
      "Your learning journey is becoming golden! 🍃✨",
  },

  {
    id: "jungle-hero",
    icon: "🦁",
    title: "Jungle Hero",
    cost: 30,
    message:
      "You're officially a Jungle Hero! 🦁🏆",
  },

  {
    id: "jungle-treasure",
    icon: "💎",
    title: "Jungle Treasure",
    cost: 40,
    message:
      "You discovered a precious jungle treasure! 💎",
  },

  {
    id: "jungle-master",
    icon: "👑",
    title: "Jungle Master",
    cost: 50,
    message:
      "WOW! You're a true Jungle Master! 👑🌴",
  },

  {
    id: "grand-champion",
    icon: "🏆",
    title: "Grand Champion",
    cost: 75,
    message:
      "An incredible achievement! You're a Grand Champion! 🏆",
  },
];

// =========================================================
// 🌴 PROVIDER
// =========================================================

export const GameProvider = ({ children }) => {
  // =======================================================
  // 👤 CURRENT USER
  // =======================================================

  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  // =======================================================
  // ⭐ OVERALL PROGRESS
  // =======================================================

  const [stars, setStars] = useState(0);

  const [history, setHistory] = useState([]);

  const [streak, setStreak] = useState(0);

  // =======================================================
  // 🎮 ACTIVE / RESUME GAME PROGRESS
  // =======================================================

  const [activeGames, setActiveGames] = useState({});

  // =======================================================
  // 🎁 REWARDS
  // =======================================================

  const [claimedRewards, setClaimedRewards] =
    useState([]);

  // Reward queue for automatic popups
  const [rewardQueue, setRewardQueue] =
    useState([]);

  const [currentReward, setCurrentReward] =
    useState(null);

  // =======================================================
  // ⏳ LOADING
  // =======================================================

  const [loadingProgress, setLoadingProgress] =
    useState(true);

  // =======================================================
  // 👤 WATCH FOR LOGIN USER CHANGES
  // =======================================================

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

  // =======================================================
  // 📅 DATE HELPERS
  // =======================================================

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

  // =======================================================
  // 🎁 SHOW NEXT REWARD
  // =======================================================

  useEffect(() => {
    if (
      !currentReward &&
      rewardQueue.length > 0
    ) {
      const [nextReward, ...remaining] =
        rewardQueue;

      setCurrentReward(
        nextReward
      );

      setRewardQueue(
        remaining
      );
    }
  }, [
    currentReward,
    rewardQueue,
  ]);

  // =======================================================
  // 🎁 CLOSE REWARD POPUP
  // =======================================================

  const dismissReward = () => {
    setCurrentReward(null);
  };

  // =======================================================
  // 🔥 LOAD USER PROGRESS
  // =======================================================

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
        await getDoc(
          progressRef
        );

      if (
        progressSnap.exists()
      ) {
        const data =
          progressSnap.data();

        // -----------------------------------------------
        // ⭐ STARS
        // -----------------------------------------------

        setStars(
          Number(data.stars) || 0
        );

        // -----------------------------------------------
        // 📚 HISTORY
        // -----------------------------------------------

        setHistory(
          Array.isArray(
            data.history
          )
            ? data.history
            : []
        );

        // -----------------------------------------------
        // 🔥 STREAK
        // -----------------------------------------------

        setStreak(
          Number(data.streak) || 0
        );

        // -----------------------------------------------
        // 🎮 ACTIVE GAMES
        // -----------------------------------------------

        setActiveGames(
          data.activeGames &&
          typeof data.activeGames ===
            "object"
            ? data.activeGames
            : {}
        );

        // -----------------------------------------------
        // 🎁 CLAIMED REWARDS
        // -----------------------------------------------

        setClaimedRewards(
          Array.isArray(
            data.claimedRewards
          )
            ? data.claimedRewards
            : []
        );

        console.log(
          "🔥 Firebase progress loaded:",
          {
            stars: data.stars,
            streak: data.streak,
            history: data.history,
            activeGames:
              data.activeGames,
            claimedRewards:
              data.claimedRewards,
          }
        );

      } else {
        // -----------------------------------------------
        // 🆕 NEW USER
        // -----------------------------------------------

        setStars(0);

        setHistory([]);

        setStreak(0);

        setActiveGames({});

        setClaimedRewards([]);

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

      setClaimedRewards([]);

    } finally {
      setLoadingProgress(false);
    }
  };

  // =======================================================
  // 🔄 RESET LOCAL STATE WHEN USER CHANGES
  // =======================================================

  useEffect(() => {
    setStars(0);

    setHistory([]);

    setStreak(0);

    setActiveGames({});

    setClaimedRewards([]);

    setRewardQueue([]);

    setCurrentReward(null);

    if (!userId) {
      setLoadingProgress(false);

      return;
    }

    loadProgress(userId);

  }, [userId]);

  // =======================================================
  // 💾 SAVE GENERAL PROGRESS TO FIREBASE
  // =======================================================

  const saveToFirebase = async (
    currentUserId,
    newStars,
    newHistory,
    newStreak,
    newActiveGames = activeGames,
    newClaimedRewards = claimedRewards
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
          userId:
            currentUserId,

          stars:
            newStars,

          history:
            newHistory,

          streak:
            newStreak,

          activeGames:
            newActiveGames,

          claimedRewards:
            newClaimedRewards,

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

      throw error;
    }
  };

  // =======================================================
  // 🎮 SAVE CURRENT GAME PROGRESS
  // =======================================================

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

      const currentGameProgress = {
        ...existingActiveGames,

        [gameId]: {
          question:
            Number(question) || 0,

          score:
            Number(score) || 0,

          ...extraData,

          updatedAt:
            new Date(),
        },
      };

      // Update local state
      setActiveGames(
        currentGameProgress
      );

      // Save to Firebase
      await setDoc(
        progressRef,
        {
          userId,

          activeGames:
            currentGameProgress,

          updatedAt:
            new Date(),
        },
        {
          merge: true,
        }
      );

      console.log(
        `💾 ${gameId} progress saved:`,
        currentGameProgress[
          gameId
        ]
      );

    } catch (error) {
      console.error(
        `❌ Error saving ${gameId} progress:`,
        error
      );
    }
  };

  // =======================================================
  // 📥 GET SAVED GAME PROGRESS
  // =======================================================

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

  // =======================================================
  // 🗑️ CLEAR ONE GAME'S SAVED PROGRESS
  // =======================================================

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

      // Update local state
      setActiveGames(
        updatedActiveGames
      );

      // Save only active games
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

  // =======================================================
  // ⭐ ADD STARS
  //
  // REAL FIREBASE TRANSACTION
  // + AUTOMATIC REWARDS
  // =======================================================

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

      const progressRef =
        doc(
          db,
          "progress",
          userId
        );

      // =====================================================
      // 🔥 ATOMIC FIREBASE UPDATE
      // =====================================================

      let resultOfUpdate =
        null;

      await runTransaction(
        db,
        async (transaction) => {
          const progressSnap =
            await transaction.get(
              progressRef
            );

          const firebaseData =
            progressSnap.exists()
              ? progressSnap.data()
              : {};

          // -----------------------------------------------
          // CURRENT VALUES
          // -----------------------------------------------

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

          const currentActiveGames =
            firebaseData.activeGames &&
            typeof firebaseData.activeGames ===
              "object"
              ? firebaseData.activeGames
              : {};

          const currentClaimedRewards =
            Array.isArray(
              firebaseData.claimedRewards
            )
              ? firebaseData.claimedRewards
              : [];

          // -----------------------------------------------
          // ⭐ CALCULATE EARNED STARS
          // -----------------------------------------------

          let earned = 1;

          if (
            Number(score) >= 90
          ) {
            earned = 3;
          } else if (
            Number(score) >= 70
          ) {
            earned = 2;
          }

          // -----------------------------------------------
          // 📅 DATES
          // -----------------------------------------------

          const today =
            getToday();

          const yesterday =
            getYesterday();

          // -----------------------------------------------
          // 🔥 STREAK
          // -----------------------------------------------

          let newStreak = 1;

          if (
            currentHistory.length > 0
          ) {
            const lastActivity =
              currentHistory[
                currentHistory.length -
                  1
              ];

            const lastDate =
              lastActivity?.date;

            if (
              lastDate === today
            ) {
              newStreak =
                currentStreak || 1;

            } else if (
              lastDate ===
              yesterday
            ) {
              newStreak =
                (currentStreak || 0) +
                1;

            } else {
              newStreak = 1;
            }
          }

          // -----------------------------------------------
          // ⭐ NEW STAR TOTAL
          // -----------------------------------------------

          const newStars =
            currentStars +
            earned;

          // -----------------------------------------------
          // 📚 NEW ACTIVITY
          // -----------------------------------------------

          const newActivity = {
            date: today,

            score:
              Number(score) || 0,

            stars:
              earned,

            game:
              gameName,
          };

          const newHistory = [
            ...currentHistory,
            newActivity,
          ];

          // -----------------------------------------------
          // 🎁 DETECT NEW REWARDS
          // -----------------------------------------------

          const newlyUnlockedRewards =
            REWARDS.filter(
              (reward) =>
                !currentClaimedRewards.includes(
                  reward.id
                ) &&
                currentStars <
                  reward.cost &&
                newStars >=
                  reward.cost
            );

          // -----------------------------------------------
          // 🎁 STORE ALL NEWLY CLAIMED REWARDS
          // -----------------------------------------------

          const updatedClaimedRewards = [
            ...currentClaimedRewards,

            ...newlyUnlockedRewards.map(
              (reward) =>
                reward.id
            ),
          ];

          // -----------------------------------------------
          // 💾 SAVE FINAL FIREBASE DATA
          // -----------------------------------------------

          transaction.set(
            progressRef,
            {
              userId,

              stars:
                newStars,

              history:
                newHistory,

              streak:
                newStreak,

              activeGames:
                currentActiveGames,

              claimedRewards:
                updatedClaimedRewards,

              updatedAt:
                new Date(),
            },
            {
              merge: true,
            }
          );

          // -----------------------------------------------
          // RETURN DATA TO LOCAL UI
          // -----------------------------------------------

          resultOfUpdate = {
            earned,

            newStars,

            newHistory,

            newStreak,

            updatedClaimedRewards,

            newlyUnlockedRewards,
          };
        }
      );

      // =====================================================
      // 🔄 UPDATE LOCAL STATE AFTER FIREBASE SUCCESS
      // =====================================================

      if (resultOfUpdate) {
        setStars(
          resultOfUpdate.newStars
        );

        setHistory(
          resultOfUpdate.newHistory
        );

        setStreak(
          resultOfUpdate.newStreak
        );

        setClaimedRewards(
          resultOfUpdate.updatedClaimedRewards
        );

        setActiveGames(
          (prev) => prev
        );

        // ===================================================
        // 🎉 AUTOMATIC REWARD POPUP
        // ===================================================

        if (
          resultOfUpdate
            .newlyUnlockedRewards
            .length > 0
        ) {
          console.log(
            "🎉 NEW REWARDS UNLOCKED:",
            resultOfUpdate
              .newlyUnlockedRewards
          );

          setRewardQueue(
            (previousQueue) => [
              ...previousQueue,
              ...resultOfUpdate
                .newlyUnlockedRewards,
            ]
          );
        }

        console.log(
          "✅ FINAL PROGRESS SAVED:",
          {
            stars:
              resultOfUpdate.newStars,

            streak:
              resultOfUpdate.newStreak,

            earned:
              resultOfUpdate.earned,

            newRewards:
              resultOfUpdate
                .newlyUnlockedRewards,
          }
        );
      }

    } catch (error) {
      console.error(
        "❌ FINAL PROGRESS SAVE FAILED:",
        error
      );

      throw error;
    }
  };

  // =======================================================
  // 🏁 COMPLETE GAME
  // =======================================================

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

      // ---------------------------------------------------
      // 1️⃣ SAVE STARS + HISTORY + STREAK + REWARDS
      // ---------------------------------------------------

      await addStars(
        score,
        gameName
      );

      // ---------------------------------------------------
      // 2️⃣ REMOVE RESUME DATA
      // ---------------------------------------------------

      if (gameId) {
        await clearGameProgress(
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

  // =======================================================
  // 🔄 RESET USER PROGRESS
  // =======================================================

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

      setClaimedRewards([]);

      setRewardQueue([]);

      setCurrentReward(null);

      const progressRef =
        doc(
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

          claimedRewards: [],

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

  // =======================================================
  // 🎉 GLOBAL AUTOMATIC REWARD POPUP
  //
  // This appears on ANY page when a reward is unlocked.
  // =======================================================

  const rewardPopup =
    currentReward ? (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background:
            "rgba(11, 55, 27, 0.45)",

          backdropFilter:
            "blur(5px)",

          padding: "20px",
        }}
      >
        <div
          style={{
            width: "min(430px, 92vw)",

            padding:
              "30px 24px",

            borderRadius:
              "28px",

            textAlign: "center",

            background:
              "linear-gradient(180deg, #fffef2, #ffffff)",

            border:
              "5px solid #ffd12f",

            boxShadow:
              "0 25px 60px rgba(0,0,0,0.28)",

            animation:
              "rewardPop 0.35s ease-out",
          }}
        >
          <div
            style={{
              fontSize:
                "24px",

              marginBottom:
                "8px",
            }}
          >
            ✨ ⭐ ✨
          </div>

          <div
            style={{
              fontSize:
                "78px",

              lineHeight: 1,

              marginBottom:
                "12px",
            }}
          >
            {currentReward.icon}
          </div>

          <h2
            style={{
              margin:
                "0 0 8px",

              color:
                "#18552c",

              fontSize:
                "28px",

              fontWeight:
                "900",
            }}
          >
            🎉 Reward Unlocked!
          </h2>

          <h3
            style={{
              margin:
                "0 0 10px",

              color:
                "#d49300",

              fontSize:
                "24px",

              fontWeight:
                "900",
            }}
          >
            {currentReward.title}
          </h3>

          <p
            style={{
              margin:
                "0 auto 16px",

              maxWidth:
                "330px",

              color:
                "#506c56",

              fontSize:
                "16px",

              lineHeight:
                "1.5",

              fontWeight:
                "600",
            }}
          >
            {currentReward.message}
          </p>

          <div
            style={{
              marginBottom:
                "20px",

              padding:
                "10px 14px",

              borderRadius:
                "14px",

              background:
                "#eef9df",

              color:
                "#315b36",

              fontWeight:
                "800",

              fontSize:
                "14px",
            }}
          >
            ✅ Added to your rewards!
          </div>

          <button
            onClick={
              dismissReward
            }
            style={{
              border:
                "none",

              padding:
                "12px 28px",

              borderRadius:
                "14px",

              background:
                "#ffbd22",

              color:
                "#173d1f",

              fontFamily:
                "inherit",

              fontSize:
                "16px",

              fontWeight:
                "900",

              cursor:
                "pointer",
            }}
          >
            Awesome! 🌈
          </button>
        </div>
      </div>
    ) : null;

  // =======================================================
  // 📦 CONTEXT
  // =======================================================

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

        // 🎁 REWARDS
        rewards: REWARDS,
        claimedRewards,

        // Current automatic popup reward
        currentReward,

        // Close popup
        dismissReward,

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
            loadProgress(
              userId
            );
          }
        },
      }}
    >
      {children}

      {rewardPopup}

      <style>
        {`
          @keyframes rewardPop {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }

            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </GameContext.Provider>
  );
};

// =========================================================
// 🎮 HOOK
// =========================================================

export const useGame = () =>
  useContext(GameContext);