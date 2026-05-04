import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing from environment" }, { status: 500 });
    }

    const { transcript, prompt, brutalMode } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const modeText = brutalMode ? "MODE: BRUTAL. Point out every hesitation." : "MODE: ELITE COACH. Be strict.";

    const systemPrompt = `
      You are an elite coach. 
      ${modeText}
      Transcript: "${transcript}"
      Prompt: "${prompt}"
      Return ONLY valid JSON:
      {
        "confidence_score": number,
        "clarity_score": number,
        "fluency_score": number,
        "tone_score": number,
        "feedback_summary": "string",
        "mistakes": ["string"],
        "improvement_tips": ["string"],
        "better_version": "string",
        "tone_analysis": "string",
        "filler_words_detected": number,
        "pace_feedback": "string",
        "vocab_words": [{"word": "string", "meaning": "string"}]
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }]
    });

    const response = await result.response;
    if (!response) {
      throw new Error("Empty response from Gemini API");
    }

    const text = response.text();
    let feedback;

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      feedback = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", text);
      return NextResponse.json({
        error: "AI returned invalid response format",
        raw: text.substring(0, 500)
      }, { status: 500 });
    }

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("Gemini Deep-Analyze Error:", error);
    return NextResponse.json({
      error: "Analysis failed",
      message: error.message
    }, { status: 500 });
  }
}
