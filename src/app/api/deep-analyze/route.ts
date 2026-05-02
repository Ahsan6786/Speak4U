import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { transcript, prompt, brutalMode } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const modeText = brutalMode ? "MODE: BRUTAL. Point out every hesitation." : "MODE: ELITE COACH. Be strict.";

    const systemPrompt = `
      You are an elite coach. 
      ${modeText}
      Transcript: "${transcript}"
      Prompt: "${prompt}"
      Return ONLY valid JSON:
      {
        "confidence_score": 0,
        "clarity_score": 0,
        "fluency_score": 0,
        "tone_score": 0,
        "feedback_summary": "",
        "mistakes": [],
        "improvement_tips": [],
        "better_version": "",
        "tone_analysis": "",
        "filler_words_detected": 0,
        "pace_feedback": "",
        "vocab_words": []
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    if (!result?.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();
    const feedback = JSON.parse(text);

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({
      error: "Failed to analyze speech",
      message: error.message
    }, { status: 500 });
  }
}
