import { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [stars, setStars] = useState(0);
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  // 🔥 LOAD FROM STORAGE
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gameData"));
    if (saved) {
      setStars(saved.stars || 0);
      setHistory(saved.history || []);
      setStreak(saved.streak || 0);
    }
  }, []);

  // 💾 SAVE TO STORAGE
  useEffect(() => {
    localStorage.setItem(
      "gameData",
      JSON.stringify({ stars, history, streak })
    );
  }, [stars, history, streak]);

  // ⭐ MAIN FUNCTION
  const addStars = (score) => {
    let earned = 0;

    if (score >= 90) earned = 3;
    else if (score >= 70) earned = 2;
    else earned = 1;

    const today = new Date().toLocaleDateString();

    // 🔥 STREAK LOGIC
    if (history.length > 0) {
      const lastDate = history[history.length - 1].date;
      if (lastDate !== today) {
        setStreak((prev) => prev + 1);
      }
    } else {
      setStreak(1);
    }

    setStars((prev) => prev + earned);

    setHistory((prev) => [
      ...prev,
      {
        date: today,
        score,
        stars: earned,
      },
    ]);
  };

  return (
    <GameContext.Provider value={{ stars, history, streak, addStars }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);