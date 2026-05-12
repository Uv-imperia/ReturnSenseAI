import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { product_name, reason, notes, prior_returns_30d, has_media } = await req.json();
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const prompt = `Analyze this product return for an e-commerce platform.
Product: ${product_name}
Reason: ${reason}
Notes: ${notes || "(none)"}
Customer prior returns in last 30 days: ${prior_returns_30d ?? 0}
Has uploaded media evidence: ${has_media ? "yes" : "no"}

Return a structured assessment.`;

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a fraud-detection and damage-assessment expert for retail returns. Be skeptical but fair." },
        { role: "user", content: prompt },
      ],
      tools: [{
        type: "function",
        function: {
          name: "submit_assessment",
          description: "Submit return assessment.",
          parameters: {
            type: "object",
            properties: {
              fraud_score: { type: "integer", description: "0-100 fraud probability" },
              risk_level: { type: "string", enum: ["Low", "Medium", "High"] },
              approval_confidence: { type: "integer", description: "0-100 confidence the return should be approved" },
              damage_assessment: { type: "string", description: "1-sentence damage summary" },
              ai_explanation: { type: "string", description: "2-3 sentences explaining the score" },
              recommended_action: { type: "string", enum: ["Approve", "Manual Review", "Reject"] },
              routing: { type: "string", enum: ["Restock", "Refurbish", "Recycle", "Discard"] },
            },
            required: ["fraud_score", "risk_level", "approval_confidence", "damage_assessment", "ai_explanation", "recommended_action", "routing"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "submit_assessment" } },
    };

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limit" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!r.ok) {
      const t = await r.text();
      console.error("AI err", r.status, t);
      return new Response(JSON.stringify({ error: "AI failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : null;
    if (!parsed) throw new Error("No assessment");
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
