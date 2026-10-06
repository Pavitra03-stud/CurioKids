export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // =====================================================
    // CORS
    // =====================================================

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }


    // =====================================================
    // DEFAULT ROUTE
    // =====================================================

    if (url.pathname === "/") {
      return new Response(
        "CurioKids AI Worker is running 🚀",
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }


    // =====================================================
    // AI ROUTE
    // =====================================================

    if (url.pathname === "/ai" && request.method === "POST") {

      try {

        // -------------------------------------------------
        // Check API key
        // -------------------------------------------------

        const apiKey = env.GROQ_API_KEY?.trim();

        if (!apiKey) {
          return new Response(
            JSON.stringify({
              error: "GROQ_API_KEY is not configured.",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }


        // -------------------------------------------------
        // Read request body
        // -------------------------------------------------

        const body = await request.json();

        const prompt = body?.prompt?.trim();

        if (!prompt) {
          return new Response(
            JSON.stringify({
              error: "Please provide a prompt.",
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }


        // =================================================
        // SYSTEM PROMPT
        // =================================================

        let systemPrompt;


        // -------------------------------------------------
        // TEACHING MODE
        // -------------------------------------------------

        if (body.type === "teach") {

          systemPrompt = `
You are CurioKids AI, a friendly learning buddy for children.

Teach concepts in a:
- simple
- clear
- encouraging
- playful
- age-appropriate

way.

Use short explanations and simple examples.

Never make the child feel bad for making mistakes.

Encourage them to try again.

Avoid complicated words unless you explain them.

Use emojis occasionally to make learning fun.
`;
        }


        // -------------------------------------------------
        // ANALYSIS MODE
        // -------------------------------------------------

        else if (body.type === "analyze") {

          systemPrompt = `
You are CurioKids AI, a supportive learning tutor.

Analyze the student's answer.

If the answer is correct:
- celebrate their effort
- explain briefly why it is correct

If the answer is incorrect:
- never shame the student
- gently explain the mistake
- provide the correct answer
- give a simple example
- encourage them to try again

Keep your explanation simple and child-friendly.

Use short paragraphs and occasional emojis.
`;
        }


        // -------------------------------------------------
        // CHAT MODE
        // -------------------------------------------------

        else {

          systemPrompt = `
You are CurioKids AI, a friendly and supportive AI learning buddy for children.

Your personality is:
- kind
- patient
- encouraging
- playful
- positive

Talk to children using simple language.

Keep responses reasonably short and easy to read.

Help children learn without making them feel pressured.

If they make a mistake, gently guide them.

Never insult, shame, scare, or discourage a child.

Use occasional friendly emojis.
`;
        }


        // =================================================
        // GROQ API REQUEST
        // =================================================

        const aiRes = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },

            body: JSON.stringify({
              model: "openai/gpt-oss-20b",

              messages: [
                {
                  role: "system",
                  content: systemPrompt,
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],

              temperature: 0.7,

              max_completion_tokens: 500,

              include_reasoning: false,
            }),
          }
        );


        // =================================================
        // READ GROQ RESPONSE
        // =================================================

        const data = await aiRes.json();

        console.log("Groq status:", aiRes.status);


        // -------------------------------------------------
        // Handle API error
        // -------------------------------------------------

        if (!aiRes.ok) {

          console.error(
            "Groq API error:",
            data
          );

          return new Response(
            JSON.stringify({
              error:
                data?.error?.message ||
                "Groq AI request failed.",
            }),
            {
              status: aiRes.status,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }


        // =================================================
        // GET AI MESSAGE
        // =================================================

        const reply =
          data?.choices?.[0]?.message?.content;


        if (!reply) {

          return new Response(
            JSON.stringify({
              error: "AI returned an empty response.",
            }),
            {
              status: 502,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        return new Response(
          JSON.stringify({
            reply: reply,
          }),
          {
            status: 200,

            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );

      } catch (error) {

        console.error(
          "CurioKids AI Worker Error:",
          error
        );

        return new Response(
          JSON.stringify({
            error:
              "Something went wrong while connecting to CurioKids AI.",
          }),
          {
            status: 500,

            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    }


    // =====================================================
    // ROUTE NOT FOUND
    // =====================================================

    return new Response(
      JSON.stringify({
        error: "Route not found",
      }),
      {
        status: 404,

        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  },
};