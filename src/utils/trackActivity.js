import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const trackActivity = async ({
  userId,
  action,
  screen = "",
  module = "",
  score = 0,
  friend = "",
}) => {
  try {
    await addDoc(collection(db, "activity"), {
      userId,
      action,
      screen,
      module,
      score,
      friend,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error:", err);
  }
};