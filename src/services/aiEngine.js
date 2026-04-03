export const chat = async (message, role) => {
  try {
    const res = await fetch(
      "https://curiokids-worker.curiokids25.workers.dev/ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: role === "kid" ? "chat" : "analyze",
          prompt: message,
        }),
      }
    );

    const data = await res.json();

    // ✅ IMPORTANT FIX
    return data.reply;

  } catch (error) {
    console.error("AI Error:", error);
    return "No response from AI";
  }
};