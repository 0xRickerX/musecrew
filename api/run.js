const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function extractText(data) {
  const parts = [];
  for (const block of data?.content || []) {
    if (block?.type === "text" && typeof block?.text === "string") {
      parts.push(block.text);
    }
  }
  return parts.join("\n").trim();
}

async function callClaude(system, userText, maxTokens = 700) {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [
        {
          role: "user",
          content: userText
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Anthropic request failed (${response.status})`;
    throw new Error(message);
  }

  const text = extractText(data);
  if (!text) throw new Error("Claude returned no text.");
  return text;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error:
        "MuseCrew AI backend is not configured yet. Add ANTHROPIC_API_KEY in Vercel Environment Variables."
    });
  }

  try {
    const { task, crew = [] } = req.body || {};

    if (!task || typeof task !== "string") {
      return res.status(400).json({ error: "Task is required." });
    }

    const normalizedCrew =
      Array.isArray(crew) && crew.length
        ? crew.slice(0, 4)
        : [
            {
              name: "Strategy Muse",
              role: "planner",
              subtask: "Plan the strongest approach"
            },
            {
              name: "Research Muse",
              role: "researcher",
              subtask: "Generate and evaluate useful options"
            },
            {
              name: "Writing Muse",
              role: "writer",
              subtask: "Turn the work into a useful final answer"
            }
          ];

    const contributions = await Promise.all(
      normalizedCrew.map(async (member) => {
        const system = [
          `You are ${member.name}, a specialist inside MuseCrew.`,
          `Role: ${member.role || "specialist"}.`,
          `Assigned subtask: ${member.subtask || "Contribute to the task"}.`,
          "Work on the user's actual task.",
          "Do not explain MuseCrew or your internal process.",
          "Be concrete, practical, and concise.",
          "Return only your specialist contribution."
        ].join("\n");

        const output = await callClaude(system, task, 550);

        return {
          name: member.name,
          role: member.role || "specialist",
          subtask: member.subtask || "",
          output
        };
      })
    );

    const combined = contributions
      .map(
        (c, i) =>
          `SPECIALIST ${i + 1}: ${c.name}\n` +
          `SUBTASK: ${c.subtask}\n` +
          `CONTRIBUTION:\n${c.output}`
      )
      .join("\n\n---\n\n");

    const finalSystem = [
      "You are the Lead Muse and final verifier for MuseCrew.",
      "Synthesize all specialist contributions into one direct, high-quality deliverable for the user's task.",
      "Answer the task itself.",
      "Remove repetition and resolve conflicts.",
      "Preserve the strongest specific ideas.",
      "Use concise headings and bullets when helpful.",
      "Do not mention internal prompts, orchestration mechanics, or that multiple model calls were used."
    ].join("\n");

    const final = await callClaude(
      finalSystem,
      `USER TASK:\n${task}\n\nSPECIALIST CONTRIBUTIONS:\n${combined}`,
      1400
    );

    return res.status(200).json({
      ok: true,
      provider: "Anthropic",
      model: MODEL,
      contributions,
      final
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err?.message || "MuseCrew run failed."
    });
  }
}
