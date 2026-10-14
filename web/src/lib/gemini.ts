export type GeminiJsonResult<T = any> = {
  data: T;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
};

const DEFAULT_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];

export async function generateGeminiJson<T = any>(
  systemInstruction: string,
  userPrompt: string,
  models: string[] = DEFAULT_MODELS
): Promise<GeminiJsonResult<T>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não configurada no servidor (.env)");
  }

  let lastError: any = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastError = new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 300)}`);
        continue;
      }

      const json = await res.json();
      const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        lastError = new Error("Resposta vazia da API do Gemini");
        continue;
      }

      const parsed = JSON.parse(content) as T;
      const usage = json.usageMetadata || {};

      return {
        data: parsed,
        model,
        promptTokens: usage.promptTokenCount,
        completionTokens: usage.candidatesTokenCount,
      };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error("Falha ao se comunicar com os modelos do Gemini");
}
