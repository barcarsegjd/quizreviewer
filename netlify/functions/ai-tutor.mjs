const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-3.1-flash-lite-preview", "gemini-3-flash-preview", "gemini-2.5-flash"];
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}

function buildPrompt(body, mode) {
  const isHint = mode === "hint";
  const safeCorrect = isHint ? "[hidden for hint mode]" : (body.correctAnswer || "");
  const safeExplanation = isHint ? "[hidden for hint mode]" : (body.explanation || "");
  return `You are an MLS quiz study coach inside a student reviewer app.\n\nMode: ${mode}\nQuiz: ${body.quiz || ""}\nModule: ${body.module || ""}\nSection: ${body.section || ""}\nQuestion: ${body.question || ""}\nChoices: ${JSON.stringify(body.choices || [])}\nStudent answer: ${body.studentAnswer || ""}\nCorrect answer: ${safeCorrect}\nBuilt-in explanation: ${safeExplanation}\n\nRules:\n- Be accurate, concise, and encouraging.\n- If mode is hint, do not reveal the correct answer, exact answer text, or answer letter.\n- If mode is check, compare the student's response against the key/rubric and explain what is correct or missing.\n- If mode is lesson, teach the concept in 4-7 short lines with a concrete exam cue.\n- Do not invent citations. Use the provided question context only.\n- End with one practical study tip.`;
}

async function callGemini(model, apiKey, prompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: "You tutor Medical Laboratory Science students. Keep answers safe for quiz practice and do not leak hidden answer keys in hint mode." }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.25, topP: 0.9, maxOutputTokens: 600 },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `${response.status} ${response.statusText}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() || "No Gemini response generated.";
}

async function callDeepSeek(model, apiKey, prompt) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", "authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You tutor Medical Laboratory Science students. Keep answers safe for quiz practice and do not leak hidden answer keys in hint mode." },
        { role: "user", content: prompt }
      ],
      temperature: 0.25,
      max_tokens: 600,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `${response.status} ${response.statusText}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return data?.choices?.[0]?.message?.content?.trim() || "No DeepSeek response generated.";
}

async function tryGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  const requested = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const models = [requested, ...GEMINI_FALLBACK_MODELS.filter((m) => m !== requested)];
  const errors = [];
  for (const model of models) {
    try { return { answer: await callGemini(model, apiKey, prompt), provider: "gemini", model }; }
    catch (error) { errors.push(`${model}: ${error.message}`); if (![400,404,429,503].includes(error.status)) break; }
  }
  throw new Error(errors.slice(0,2).join(" | ") || "Gemini unavailable.");
}

async function tryDeepSeek(prompt) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not set.");
  const model = process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL;
  return { answer: await callDeepSeek(model, apiKey, prompt), provider: "deepseek", model };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  try {
    const body = JSON.parse(event.body || "{}");
    const mode = body.mode || "hint";
    const provider = body.provider || "auto";
    const prompt = buildPrompt(body, mode);
    const errors = [];

    if (provider === "gemini") {
      const result = await tryGemini(prompt);
      return json(200, result);
    }
    if (provider === "deepseek") {
      const result = await tryDeepSeek(prompt);
      return json(200, result);
    }

    for (const fn of [tryGemini, tryDeepSeek]) {
      try { return json(200, await fn(prompt)); }
      catch (error) { errors.push(error.message); }
    }

    return json(200, {
      answer: `Server AI unavailable. The app will try Puter.js in Auto mode, then use Offline Tutor if needed. Server notes: ${errors.slice(0,2).join(" | ")}`,
      provider: "offline",
      model: "offline",
    });
  } catch (error) {
    return json(200, { answer: `Offline AI fallback: ${error.message || "server error"}`, provider: "offline", model: "offline" });
  }
}
