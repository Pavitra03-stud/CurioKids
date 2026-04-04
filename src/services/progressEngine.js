export function updateProgressFromAI(message) {
  let progress = JSON.parse(localStorage.getItem("progressData")) || {
    stars: 0,
    reading: 0,
    pronunciation: 0,
    understanding: 0,
    level: "Beginner",
    rewards: []
  };

  let starsEarned = 0;

  const text = message.toLowerCase();

  // 🧠 Detect learning type
  if (text.includes("read") || text.includes("story")) {
    progress.reading += 2;
    starsEarned = 2;
  } 
  else if (text.includes("say") || text.includes("pronounce")) {
    progress.pronunciation += 2;
    starsEarned = 2;
  } 
  else {
    progress.understanding += 1;
    starsEarned = 1;
  }

  // ⭐ Add stars
  progress.stars += starsEarned;

  // 🌿 Level system
  if (progress.stars > 50) progress.level = "Advanced";
  else if (progress.stars > 20) progress.level = "Intermediate";

  // 🎁 AUTO REWARD SYSTEM
  const rewardList = [
    { name: "Starter Badge", need: 5 },
    { name: "Reading Star", need: 10 },
    { name: "Jungle Explorer", need: 20 },
    { name: "Master Learner", need: 40 }
  ];

  let unlockedReward = null;

  rewardList.forEach((r) => {
    if (
      progress.stars >= r.need &&
      !progress.rewards.includes(r.name)
    ) {
      progress.rewards.push(r.name);
      unlockedReward = r.name;
    }
  });

  localStorage.setItem("progressData", JSON.stringify(progress));

  return {
    starsEarned,
    unlockedReward
  };
}