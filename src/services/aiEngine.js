export const chat = async (userMessage, role = "kid") => {
  try {
    // 📥 Get child data
    const child = JSON.parse(localStorage.getItem("childProfile")) || {};
    const progress = JSON.parse(localStorage.getItem("progressData")) || {
      stars: 0,
      level: "Beginner",
      reading: 0,
      pronunciation: 0,
      understanding: 0,
    };

    // 🧠 Build smart teacher prompt
    const prompt = `
You are a friendly AI teacher for kids.

Child Details:
Name: ${child.name || "friend"}
Age: ${child.age || "5-8"}

Learning Level: ${progress.level}
Stars: ${progress.stars}

Your behavior:
- Speak very simply
- Be kind, fun, and encouraging 😊🌱✨
- Keep answers SHORT (2-4 lines max)
- Help with reading, pronunciation, and understanding

Teaching rules:
- If child asks a question → explain simply
- If child struggles → give small example
- If possible → suggest a fun learning activity
- Motivate the child always 🎉

Child says:
"${userMessage}"
`;

    // 🌐 API CALL (your existing endpoint)
    const res = await fetch(
      "https://curiokids-worker.curiokids25.workers.dev/ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: role === "kid" ? "chat" : "analyze",
          prompt: prompt, // 🔥 IMPORTANT: send enhanced prompt
        }),
      }
    );

    const data = await res.json();

    return data.reply || "Let's learn together! 🌱";

  } catch (error) {
    console.error("AI Error:", error);
    return "Oops! Let's try again 😊";
  }
};