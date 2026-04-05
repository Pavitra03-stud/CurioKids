import { db } from "../firebase";
import { doc, collection, addDoc, Timestamp, setDoc } from "firebase/firestore";

export const saveScore = async (gameName, score, totalQuestions) => {
  try {
    const userEmail = "demo_user"; // 🔥 later replace with auth

    const userRef = doc(db, "users", userEmail);

    // ✅ ensure user document exists
    await setDoc(userRef, {
      email: userEmail,
      lastPlayed: Timestamp.now()
    }, { merge: true });

    const gameResultsRef = collection(userRef, "game_results");

    const accuracy = (score / totalQuestions) * 100;

    await addDoc(gameResultsRef, {
      game: gameName,
      score,
      totalQuestions,
      accuracy: accuracy.toFixed(2),
      createdAt: Timestamp.now()
    });

    console.log(`✅ ${gameName} saved`);

  } catch (error) {
    console.error("❌ Firestore Error:", error);
  }
};