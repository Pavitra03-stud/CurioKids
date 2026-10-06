import { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";

export default function useGameProgress(gameId, initialState = {}) {
  const {
    getGameProgress,
    saveGameProgress,
    completeGame,
    loadingProgress,
  } = useGame();

  const [savedState, setSavedState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🎮 useGameProgress:", {
      gameId,
      loadingProgress,
    });

    if (loadingProgress) {
      console.log("⏳ Waiting for GameContext Firebase load...");
      return;
    }

    const saved = getGameProgress(gameId);

    console.log("🔥 SAVED GAME FROM CONTEXT:", saved);

    if (saved) {
      console.log("✅ RESUMING:", saved);
      setSavedState(saved);
    } else {
      console.log("🆕 NO SAVED GAME");
      setSavedState(initialState);
    }

    setLoading(false);
  }, [gameId, loadingProgress]);

  const save = async (state = {}) => {
    console.log("💾 Saving game:", gameId, state);

    await saveGameProgress({
      gameId,
      ...state,
    });
  };

  const finish = async (score, gameName) => {
    console.log("🏁 Completing game:", gameId);

    await completeGame(
      score,
      gameName,
      gameId
    );
  };

  return {
    savedState,
    loading,
    save,
    finish,
  };
}