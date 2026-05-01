import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { transcript, prompt, brutalMode } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
      You are a world-class elite communication coach for "SpeakMirror". 
      Your task is to provide a deep, high-impact analysis of the user's speech.
      
      CRITICAL INSTRUCTIONS:
      1. DO NOT use any markdown formatting (like **, _, #) in your strings. Use plain text only.
      2. Use simple, plain, and clear language that anyone can understand. Avoid complex jargon.
      3. Be honest, direct, and elite. 
      4. INTENT & RELEVANCE: Analyze if the user actually answered the prompt. Did they understand the question? Is their answer relevant and logical? Point this out in your feedback.
      5. SPEECH RATE & FLOW: Analyze their implied speaking speed based on sentence structure and filler words. Identify if they sound rushed, hesitant, or perfectly paced.
      6. BE EXTREMELY CONCISE. Feedback summary must be 1-2 very short sentences only. Mistakes and tips must be short fragments. No long explanations. Be direct and to the point.
      7. For "better_version", rewrite it to sound like a natural, confident leader, while keeping their original intent.
      
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

    const result = await model.generateContent(systemPrompt);

    if (!result?.response) {
      throw new Error("No response from Gemini");
    }

    const text = result.response.text();

    let feedback;

    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      feedback = JSON.parse(jsonMatch[0]);

    } catch (err) {
      console.error("JSON PARSE ERROR:", text);

      return NextResponse.json({
        error: "Invalid AI response",
        raw: text
      }, { status: 500 });
    }

    return NextResponse.json(feedback);

  } catch (error: any) {
    console.error("API ERROR:", error);

    return NextResponse.json({
      error: "Failed to analyze speech",
      message: error.message
    }, { status: 500 });
  }
}
