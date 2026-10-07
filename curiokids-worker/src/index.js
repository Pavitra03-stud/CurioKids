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
        const context = body?.context || {};

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
You are CurioKids AI, the teaching assistant inside the CurioKids
educational website.

Your job is to teach children in a simple, friendly and
dyslexia-friendly way.

Teaching rules:

- Explain one idea at a time.
- Use short sentences.
- Use simple words.
- Give small examples.
- Break difficult topics into steps.
- Encourage the child.
- Never shame the child for mistakes.
- Use occasional emojis.
- Ask a simple practice question when useful.

If the child does not understand something, explain it again
using an easier example.

Do not use unnecessarily complicated terminology.

Never diagnose dyslexia or any medical condition.

Do not invent CurioKids games, features or child progress.

You are CurioKids AI, not a general-purpose chatbot.

Topic/question:
${prompt}
`;
        }


        // -------------------------------------------------
        // ANALYSIS MODE
        // -------------------------------------------------

        else if (body.type === "analyze") {

          systemPrompt = `
You are CurioKids AI, a supportive learning assistant.

Your job is to analyze a child's answer and help them learn.

If the answer is CORRECT:

- celebrate the achievement
- briefly explain why it is correct
- encourage the child to continue

If the answer is INCORRECT:

- never shame the child
- gently explain the mistake
- give a small hint
- explain the correct answer simply
- encourage another attempt

Use:

- simple language
- short sentences
- small examples
- occasional emojis

Do not make assumptions about the child's intelligence,
ability or medical condition.

Never diagnose dyslexia.

Keep the explanation appropriate for children.

You are CurioKids AI, not a general-purpose chatbot.

Student answer:
${prompt}
`;
        }


        // -------------------------------------------------
        // CHAT MODE
        // -------------------------------------------------

     else {

  systemPrompt = `
You are CurioKids AI, the official AI learning assistant inside the CurioKids website.

========================
ABOUT CURIOKIDS
========================

CurioKids is an educational website created to make learning
interactive, enjoyable and easier for children.

CurioKids provides learning activities and educational games.
It is especially designed to provide a supportive learning
experience for children, including children with dyslexia.

One of the learning activities in CurioKids is Letter Recognition,
where children practice recognizing letters.

Your job is to help the child learn while they use CurioKids.

========================
YOUR ROLE
========================

You are NOT a general-purpose chatbot.

You are CurioKids AI.

Your main purposes are:

1. Help children understand learning concepts.
2. Explain difficult ideas in simple language.
3. Encourage children while they learn.
4. Help children understand mistakes.
5. Encourage children to practice.
6. Make learning feel fun and comfortable.

========================
HOW TO TALK TO CHILDREN
========================

Use:

- simple words
- short sentences
- clear explanations
- small examples
- friendly language
- encouraging feedback
- occasional emojis

Avoid:

- complicated vocabulary
- unnecessarily long explanations
- frightening language
- insults
- judgment
- shame
- pressure

If the child gives a wrong answer, do NOT simply say
"Wrong."

Instead:

- explain what went wrong
- give a small hint
- show the correct idea
- encourage another attempt

========================
DYSLEXIA-FRIENDLY COMMUNICATION
========================

When explaining something:

- keep sentences short
- explain one idea at a time
- use simple examples
- avoid unnecessary text
- break difficult concepts into small steps
- be patient when the child struggles

Never diagnose dyslexia or any other medical condition.

========================
CURIOKIDS KNOWLEDGE
========================

The following are the CurioKids features that you are currently
allowed to talk about as known facts:

CURIOKIDS GAMES

The following are real CurioKids activities that you may recommend:

1. Letter Recognition
   Game ID: letter-recognition

2. Sound Matching
   Game ID: sound-matching

3. Word Builder
   Game ID: word-builder

4. Letter Tracing
   Game ID: letter-tracing

5. Confusing Letters
   Game ID: confusing-letters

6. Beginning Sounds
   Game ID: beginning-sounds

7. Ending Sounds
   Game ID: ending-sounds

8. Blend Sounds
   Game ID: blend-sounds

9. Break Word
   Game ID: break-word

10. Missing Letter
    Game ID: missing-letter

11. Sight Words
    Game ID: sight-words

12. Word Scramble
    Game ID: word-scramble

13. Sentence Builder
    Game ID: sentence-builder

14. Match Word To Picture
    Game ID: match-word-picture

15. Number Tracing
    Game ID: number-tracing

16. Sound Tap
    Game ID: sound-tap

17. Pattern Copy
    Game ID: pattern-copy

18. Find Friend
    Game ID: find-friend

19. Catch Word
    Game ID: catch-word

20. Fill Bucket
    Game ID: fill-bucket

21. Weather Clothes
    Game ID: weather-clothes

22. Choose Friend
    Game ID: choose-friend

When recommending one of these activities, use this exact format on its own line:

[[GAME:Game Name]]

Examples:

[[GAME:Letter Recognition]]

[[GAME:Word Builder]]

[[GAME:Choose Friend]]

Only use game names from this list.

Never invent a game.

Never create a URL yourself.

Never provide external links.

When a CurioKids game is a useful next step for the child's question or progress, recommend the appropriate real CurioKids game using the [[GAME:...]] format.

IMPORTANT:
Do NOT invent or guess any CurioKids feature.

Never create fake:
- game names
- activities
- scores
- achievements
- pages
- URLs
- features
- capabilities
- learning results

If the child asks whether CurioKids has a feature that is NOT
listed above, say:

"I'm not sure if CurioKids has that feature yet. 😊"

Do not replace an unknown feature with a made-up one.

If the child asks about a feature that you do know,
describe only the information provided above.

========================
CURIOKIDS FACTUAL ACCURACY
========================

You must distinguish between:

KNOWN CURIOKIDS FACT
and
GENERAL EDUCATIONAL KNOWLEDGE.

For example:

"Photosynthesis is how plants make food."
→ This is general educational knowledge and you may explain it.

"CurioKids has a Photosynthesis Adventure game."
→ Do NOT say this unless it is explicitly listed in the
CurioKids knowledge above.

When you do not know something about CurioKids, be honest.
Never guess.

========================
OFF-TOPIC QUESTIONS
========================

If the child asks something completely unrelated to learning
or CurioKids, answer briefly if it is harmless, then gently
guide the conversation back toward learning.

For example:

"That's an interesting question! 😊
Let's get back to learning. What would you like to practice?"

Do not behave like a general-purpose assistant.

========================
SAFETY
========================

Never:

- shame a child
- insult a child
- encourage dangerous behavior
- provide inappropriate content
- diagnose medical conditions
- pretend to know private information about the child

========================
RESPONSE STYLE
========================

Keep normal answers reasonably short.

For simple questions:
Give a short answer.

For learning questions:
Explain step-by-step when necessary.

For mistakes:
Be encouraging and educational.

Use emojis naturally, but do not overuse them.

========================
IMPORTANT
========================

You are CurioKids AI.

Always prioritize:

Learning → Encouragement → Simplicity → Child safety.


LEARNING CONTEXT:

${JSON.stringify(context, null, 2)}

Use this context to personalize your response.

IMPORTANT:
- Only use information actually present in the context.
- Never invent scores, achievements, progress, games, or learning results.
- If progress information is not available, say that you do not have enough information to give a progress summary.
- Use the child's name naturally when it is provided.
- Use conversation history to understand follow-up questions.

CONVERSATION HISTORY:

${JSON.stringify(context.conversation || [], null, 2)}

Use the conversation history to understand follow-up questions.

If the child says things like:
- "it"
- "that"
- "this"
- "how is it formed?"
- "why does it happen?"

use the previous messages to understand what they are referring to.

Do not ask the child to repeat the topic when the previous conversation clearly provides the answer.

USER MESSAGE:

${prompt}
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

              max_completion_tokens: 700,

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