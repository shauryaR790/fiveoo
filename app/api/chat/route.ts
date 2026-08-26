import { NextRequest } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are the FIVEO studio assistant on fiveoo.com. FIVEO is a creative partner for startups and scale-ups offering branding, UI/UX, motion, and design on demand.

Help visitors with:
- Services, pricing plans, and how FIVEO works
- Navigating the site (About, Works, Services, Pricing, Process, Careers)
- General questions about starting a design project with FIVEO

Keep replies concise, friendly, and professional. If you do not know something specific about the studio, say so and suggest they explore the Pricing section or reach out through the site footer.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured. Add OPENAI_API_KEY to your environment." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[] = [];

  try {
    const body = await request.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const sanitized = messages
    .filter(
      (message): message is ChatMessage =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 2000),
    }));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.7,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI chat error:", errorText);
      return Response.json(
        { error: "Unable to reach the assistant right now." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return Response.json(
        { error: "The assistant returned an empty response." },
        { status: 502 },
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat route failed:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
