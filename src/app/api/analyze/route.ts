import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  console.log("DEBUG: API Key used:", process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 4)}...` : "MISSING");
  try {
    const { transcript, prompt, brutalMode } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (e) {
      console.error("Failed to load gemini-1.5-flash, falling back to gemini-pro");
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const systemPrompt = `
      You are a world-class elite communication coach for "SpeakMirror". 
      Your task is to provide a deep, high-impact analysis of the user's speech.
      
      CRITICAL INSTRUCTIONS:
      1. DO NOT use any markdown formatting (like **, _, #) in your strings. Use plain text only.
      2. Use simple, plain, and clear language that anyone can understand. Avoid complex jargon.
      3. Be honest, direct, and elite. 
      4. Focus on "Communication Structure" and "Vocal Confidence".
      5. BE EXTREMELY CONCISE. Feedback summary must be 1-2 very short sentences only. Mistakes and tips must be short fragments. No long explanations. Be direct and to the point.
      6. For "better_version", rewrite it to sound like a natural, confident leader.
      
      ${brutalMode ? "MODE: BRUTAL. Point out every hesitation, every structural weakness, and every weak word choice. Do not hold back." : "MODE: ELITE COACH. Be strict but constructive. Provide a clear path to mastery."}

      Transcript: "${transcript}"
      Original Prompt: "${prompt}"

      Return ONLY a valid JSON object with this exact structure:
      {
        "confidence_score": number (0-100),
        "clarity_score": number (0-100),
        "fluency_score": number (0-100),
        "tone_score": number (0-100),
        "feedback_summary": "Plain text summary of their performance.",
        "mistakes": ["Point 1 (plain text)", "Point 2 (plain text)"],
        "improvement_tips": ["Actionable tip 1", "Actionable tip 2"],
        "better_version": "A complete, high-impact rewrite of their speech.",
        "tone_analysis": "e.g., Hesitant, Authoritative, Warm, etc.",
        "filler_words_detected": number,
        "pace_feedback": "Short comment on their speed.",
        "vocab_words": [
          { "word": "Word 1", "meaning": "Simple meaning 1" },
          { "word": "Word 2", "meaning": "Simple meaning 2" },
          { "word": "Word 3", "meaning": "Simple meaning 3" },
          { "word": "Word 4", "meaning": "Simple meaning 4" },
          { "word": "Word 5", "meaning": "Simple meaning 5" }
        ]
      }
    `;

    let result;
    const fallbacks = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest", "gemini-1.5-flash", "gemini-pro"];
    
    for (const modelName of fallbacks) {
      try {
        console.log(`Trying model: ${modelName}`);
        const currentModel = genAI.getGenerativeModel({ model: modelName });
        result = await currentModel.generateContent(systemPrompt);
        if (result) break;
      } catch (e: any) {
        console.warn(`Model ${modelName} failed:`, e.message);
        if (modelName === fallbacks[fallbacks.length - 1]) throw e;
      }
    }
    
    if (!result) {
      throw new Error("Failed to generate content with any available model");
    }

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (sometimes Gemini wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to analyze speech" }, { status: 500 });
  }
}
