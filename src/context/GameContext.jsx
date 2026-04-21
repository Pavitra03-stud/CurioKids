import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [stars, setStars] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  // ✅ GET USER ID FROM OTP LOGIN
  const userId = localStorage.getItem("userId");

  // 🧠 DATE HELPERS
  const getToday = () => new Date().toLocaleDateString();

  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString();
  };

  // 🔥 LOAD FROM FIREBASE
  useEffect(() => {
    if (!userId) return; // ✅ SAFETY

    const fetchData = async () => {
      try {
        const docRef = doc(db, "progress", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStars(data.stars || 0);
          setHistory(data.history || []);
          setStreak(data.streak || 0);
        }
      } catch (err) {
        console.error("Error fetching Firebase data:", err);
      }
    };

    fetchData();
  }, [userId]);

  // 💾 SAVE TO FIREBASE
  const saveToFirebase = async (newStars, newHistory, newStreak) => {
    if (!userId) return; // ✅ SAFETY

    try {
      await setDoc(doc(db, "progress", userId), {
        stars: newStars,
        history: newHistory,
        streak: newStreak,
      });
    } catch (err) {
      console.error("Error saving to Firebase:", err);
    }
  };

  // ⭐ MAIN FUNCTION
  const addStars = async (score, gameName = "Game") => {
    if (!userId) return; // ✅ SAFETY

    let earned = 0;

    if (score >= 90) earned = 3;
    else if (score >= 70) earned = 2;
    else earned = 1;

    const today = getToday();
    const yesterday = getYesterday();

    let newStreak = streak;

    // 🔥 STREAK LOGIC
    if (history.length > 0) {
      const lastDate = history[history.length - 1].date;

      if (lastDate === today) {
        // no change
      } else if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newStars = stars + earned;

    const newHistory = [
      ...history,
      {
        date: today,
        score,
        stars: earned,
        game: gameName,
      },
    ];

    // 🔥 UPDATE STATE
    setStars(newStars);
    setHistory(newHistory);
    setStreak(newStreak);

    // 🔥 SAVE TO FIREBASE
    await saveToFirebase(newStars, newHistory, newStreak);
  };

  // 🔄 RESET
  const resetProgress = async () => {
    if (!userId) return;

    setStars(0);
    setHistory([]);
    setStreak(0);

    await setDoc(doc(db, "progress", userId), {
      stars: 0,
      history: [],
      streak: 0,
    });
  };

  return (
    <GameContext.Provider
      value={{
        stars,
        history,
        streak,
        addStars,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);