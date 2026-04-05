import { useState, useEffect } from "react";
import "../styles/BlendSounds.css";

// 🔥 Firebase
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";

export default function RewardChallenge() {

  const TOTAL_QUESTIONS = 5;
  const PASS_SCORE = 4;

  const userEmail = "demo_user";

  const [started, setStarted] = useState(false);

  const [target, setTarget] = useState("");
  const [options, setOptions] = useState([]);

  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const [stars, setStars] = useState(0);
  const [badges, setBadges] = useState([]);

  const [message, setMessage] = useState("");

  // 🔥 LOAD REWARDS
  const loadRewards = async () => {
    const ref = doc(db, "users", userEmail, "rewards", "summary");

    const snap = await getDoc(ref);

    if (snap.exists()) {
      setStars(snap.data().stars || 0);
      setBadges(snap.data().badges || []);
    } else {
      await setDoc(ref, {
        stars: 0,
        badges: []
      });
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  // 🤖 AI QUESTION
  const generateQuestionAI = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const correct =
      letters[Math.floor(Math.random() * letters.length)];

    const wrong = letters
      .filter(l => l !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const opts = [correct, ...wrong].sort(() => 0.5 - Math.random());

    setTarget(correct);
    setOptions(opts);
  };

  // 🎯 START TEST
  const startChallenge = () => {
    setStarted(true);
    setScore(0);
    setQuestionCount(0);
    generateQuestionAI();
  };

  // 🎯 HANDLE ANSWER
  const handleClick = async (item) => {

    const isCorrect = item === target;
    const updatedScore = isCorrect ? score + 1 : score;

    setScore(updatedScore);

    const next = questionCount + 1;
    setQuestionCount(next);

    if (next === TOTAL_QUESTIONS) {

      if (updatedScore >= PASS_SCORE) {
        await giveReward(updatedScore);
        setMessage("🏆 Reward Unlocked!");
      } else {
        setMessage("😢 Try Again to Unlock Reward");
      }

      setStarted(false);
    } else {
      generateQuestionAI();
    }
  };

  // ⭐ GIVE REWARD
  const giveReward = async (scoreAchieved) => {

    const newStars = stars + scoreAchieved;
    const newBadges = [...badges];

    if (newStars >= 5 && !newBadges.includes("Beginner")) {
      newBadges.push("Beginner");
    }

    if (newStars >= 10 && !newBadges.includes("Star Learner")) {
      newBadges.push("Star Learner");
    }

    if (newStars >= 20 && !newBadges.includes("Champion")) {
      newBadges.push("Champion");
    }

    const ref = doc(db, "users", userEmail, "rewards", "summary");

    await updateDoc(ref, {
      stars: newStars,
      badges: newBadges
    });

    setStars(newStars);
    setBadges(newBadges);
  };

  return (
    <div className="blend-container">

      <h2>🏆 AI Reward Challenge</h2>

      <h3>⭐ Stars: {stars}</h3>

      {/* 🎯 START */}
      {!started ? (
        <>
          <button onClick={startChallenge}>
            🚀 Start Challenge
          </button>

          <p>{message}</p>

          <h3>🏅 Badges</h3>
          {badges.length === 0 ? (
            <p>No badges yet</p>
          ) : (
            badges.map((b, i) => <div key={i}>{b}</div>)
          )}
        </>
      ) : (
        <>
          <h3>
            Question {questionCount + 1} / {TOTAL_QUESTIONS}
          </h3>

          <h2>Find: {target}</h2>

          <div className="options">
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleClick(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  );
}