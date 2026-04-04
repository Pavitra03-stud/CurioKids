export default {
  async fetch(request, env) {
    const url = new URL(request.url);


    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // ✅ Default route
    if (url.pathname === "/") {
      return new Response("Curiokids Worker Running 🚀");
    }

    // 🤖 AI ROUTE
    if (url.pathname === "/ai" && request.method === "POST") {
      try {
        const body = await request.json();

        // 🔍 DEBUG KEY (IMPORTANT - remove later)
        console.log("API KEY:", env.GROQ_API_KEY);

        let systemPrompt = "";

        // 🧠 Teaching Mode
        if (body.type === "teach") {
          systemPrompt =
            "You are a friendly teacher for kids. Explain concepts in a simple, fun, and engaging way with examples.";
        }

        // 📊 Analysis Mode
        else if (body.type === "analyze") {
          systemPrompt =
            "You are an AI tutor. Analyze the student's answer, identify mistakes, and correct them in a simple way.";
        }

        // 💬 Chat Mode
        else {
          systemPrompt =
            "You are a friendly AI assistant for kids. Talk politely, clearly, and simply.";
        }

        // 🔗 GROQ API CALL
        const aiRes = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
Authorization: `Bearer ${env.GROQ_API_KEY?.trim()}`,
            },
            body: JSON.stringify({
              model:"llama-3.1-8b-instant",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: body.prompt },
              ],
            }),
          }
        );

        const data = await aiRes.json();

        // 🔍 DEBUG RESPONSE
        console.log("AI RESPONSE:", data);

       return new Response(
  JSON.stringify({
    reply:
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI not responding",
  }),
  {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  }
);
      } catch (err) {
        console.error("ERROR:", err);

        return new Response(
          JSON.stringify({
            error: "Something went wrong in AI route",
          }),
          { status: 500 }
        );
      }
    }

    return new Response("Route not found", { status: 404 });
  },
};